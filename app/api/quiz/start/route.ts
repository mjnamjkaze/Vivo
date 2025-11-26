import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Get 20 random questions
        const allQuestions = await prisma.question.findMany();
        const shuffled = allQuestions.sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, 20);

        // Create quiz session
        const session = await prisma.quizSession.create({
            data: {
                userId: parseInt(userId),
                totalQuestions: 20,
                timeLimit: 600, // 10 minutes
            },
        });

        // Create answer records for each question
        await Promise.all(
            selectedQuestions.map((q) =>
                prisma.answer.create({
                    data: {
                        sessionId: session.id,
                        questionId: q.id,
                    },
                })
            )
        );

        // Get the questions with answers
        const questions = selectedQuestions.map((q) => ({
            id: q.id,
            question: q.question,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
        }));

        return NextResponse.json({
            sessionId: session.id,
            questions,
            timeLimit: session.timeLimit,
        });
    } catch (error) {
        console.error('Start quiz error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
