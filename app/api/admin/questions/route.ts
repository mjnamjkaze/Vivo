import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all questions with optional category filter
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const categoryId = searchParams.get('categoryId');

        const questions = await prisma.question.findMany({
            where: categoryId ? { categoryId: parseInt(categoryId) } : undefined,
            include: {
                category: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(questions);
    } catch (error) {
        console.error('Get questions error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST create new question
export async function POST(request: NextRequest) {
    try {
        const {
            question,
            questionImageUrl,
            optionA,
            optionAImageUrl,
            optionB,
            optionBImageUrl,
            optionC,
            optionCImageUrl,
            optionD,
            optionDImageUrl,
            correctAnswer,
            categoryId
        } = await request.json();

        if (!question || !optionA || !optionB || !optionC || !optionD || !correctAnswer || !categoryId) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) {
            return NextResponse.json(
                { error: 'Correct answer must be A, B, C, or D' },
                { status: 400 }
            );
        }

        const newQuestion = await prisma.question.create({
            data: {
                question,
                questionImageUrl: questionImageUrl || null,
                optionA,
                optionAImageUrl: optionAImageUrl || null,
                optionB,
                optionBImageUrl: optionBImageUrl || null,
                optionC,
                optionCImageUrl: optionCImageUrl || null,
                optionD,
                optionDImageUrl: optionDImageUrl || null,
                correctAnswer,
                categoryId: parseInt(categoryId),
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(newQuestion);
    } catch (error: any) {
        console.error('Create question error:', error);

        if (error.code === 'P2003') {
            return NextResponse.json(
                { error: 'Invalid category ID' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
