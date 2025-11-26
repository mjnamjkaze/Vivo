import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const sessionId = request.nextUrl.searchParams.get('sessionId');

        if (!sessionId) {
            return NextResponse.json(
                { error: 'Session ID is required' },
                { status: 400 }
            );
        }

        // Get session with all answers and questions
        const session = await prisma.quizSession.findUnique({
            where: { id: parseInt(sessionId) },
            include: {
                answers: {
                    include: {
                        question: true,
                    },
                    orderBy: {
                        id: 'asc', // Maintain the order questions were added
                    },
                },
            },
        });

        if (!session) {
            return NextResponse.json(
                { error: 'Session not found' },
                { status: 404 }
            );
        }

        // Map questions with all image URLs
        const questions = session.answers.map((a) => ({
            id: a.question.id,
            question: a.question.question,
            questionImageUrl: a.question.questionImageUrl,
            optionA: a.question.optionA,
            optionAImageUrl: a.question.optionAImageUrl,
            optionB: a.question.optionB,
            optionBImageUrl: a.question.optionBImageUrl,
            optionC: a.question.optionC,
            optionCImageUrl: a.question.optionCImageUrl,
            optionD: a.question.optionD,
            optionDImageUrl: a.question.optionDImageUrl,
        }));

        return NextResponse.json({
            questions,
            timeLimit: session.timeLimit,
        });
    } catch (error) {
        console.error('Get quiz error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
