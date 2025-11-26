import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { sessionId, answers } = await request.json();

        if (!sessionId) {
            return NextResponse.json(
                { error: 'Session ID is required' },
                { status: 400 }
            );
        }

        // Get all answers for this session
        const sessionAnswers = await prisma.answer.findMany({
            where: { sessionId: parseInt(sessionId) },
            include: { question: true },
        });

        let correctCount = 0;

        // Update each answer and check correctness
        for (const answer of sessionAnswers) {
            const userAnswer = answers[answer.questionId];
            const isCorrect = userAnswer === answer.question.correctAnswer;

            if (isCorrect) {
                correctCount++;
            }

            await prisma.answer.update({
                where: { id: answer.id },
                data: {
                    userAnswer: userAnswer || null,
                    isCorrect,
                },
            });
        }

        // Update session
        const session = await prisma.quizSession.update({
            where: { id: parseInt(sessionId) },
            data: {
                completed: true,
                endTime: new Date(),
                score: correctCount,
            },
            include: {
                answers: {
                    include: {
                        question: true,
                    },
                },
            },
        });

        // Calculate time taken
        const timeTaken = Math.floor(
            (session.endTime!.getTime() - session.startTime.getTime()) / 1000
        );

        return NextResponse.json({
            score: correctCount,
            total: session.totalQuestions,
            timeTaken,
            answers: session.answers.map((a) => ({
                question: a.question.question,
                userAnswer: a.userAnswer,
                correctAnswer: a.question.correctAnswer,
                isCorrect: a.isCorrect,
                options: {
                    A: a.question.optionA,
                    B: a.question.optionB,
                    C: a.question.optionC,
                    D: a.question.optionD,
                },
            })),
        });
    } catch (error) {
        console.error('Submit quiz error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
