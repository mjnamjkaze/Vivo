import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { userId, categoryId } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Get 20 random questions (filtered by category if provided)
        const allQuestions = await prisma.question.findMany({
            where: categoryId ? { categoryId: parseInt(categoryId) } : undefined,
        });

        if (allQuestions.length < 20) {
            return NextResponse.json(
                { error: 'Not enough questions in this category' },
                { status: 400 }
            );
        }

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

        // Get the questions with answers (including image URLs)
        const questions = selectedQuestions.map((q) => ({
            id: q.id,
            question: q.question,
            questionImageUrl: q.questionImageUrl,
            optionA: q.optionA,
            optionAImageUrl: q.optionAImageUrl,
            optionB: q.optionB,
            optionBImageUrl: q.optionBImageUrl,
            optionC: q.optionC,
            optionCImageUrl: q.optionCImageUrl,
            optionD: q.optionD,
            optionDImageUrl: q.optionDImageUrl,
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
