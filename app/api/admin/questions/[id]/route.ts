import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT update question
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { question, optionA, optionB, optionC, optionD, correctAnswer, categoryId } = await request.json();
        const id = parseInt(params.id);

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

        const updatedQuestion = await prisma.question.update({
            where: { id },
            data: {
                question,
                optionA,
                optionB,
                optionC,
                optionD,
                correctAnswer,
                categoryId: parseInt(categoryId),
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(updatedQuestion);
    } catch (error: any) {
        console.error('Update question error:', error);

        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Question not found' },
                { status: 404 }
            );
        }

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

// DELETE question
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);

        await prisma.question.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Delete question error:', error);

        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Question not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
