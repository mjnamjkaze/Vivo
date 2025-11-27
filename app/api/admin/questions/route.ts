import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all questions with optional category filter and pagination
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const categoryId = searchParams.get('categoryId');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        const skip = (page - 1) * limit;

        const where = categoryId ? { categoryId: parseInt(categoryId) } : undefined;

        // Get total count
        const total = await prisma.question.count({ where });

        // Get paginated questions
        const questions = await prisma.question.findMany({
            where,
            include: {
                category: true,
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        });

        return NextResponse.json({
            questions,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
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
            tag,
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
                tag: tag || 'Cơ Bản',
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
