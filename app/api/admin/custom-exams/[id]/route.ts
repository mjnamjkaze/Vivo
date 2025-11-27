import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT - Update custom exam
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const body = await request.json();
        const {
            name,
            description,
            categoryId,
            questionCount,
            basicPercentage,
            advancedPercentage,
            masteryPercentage,
            isActive,
        } = body;

        // Validation
        if (questionCount < 1 || questionCount > 100) {
            return NextResponse.json(
                { error: 'Question count must be between 1 and 100' },
                { status: 400 }
            );
        }

        const totalPercentage = basicPercentage + advancedPercentage + masteryPercentage;
        if (totalPercentage !== 100) {
            return NextResponse.json(
                { error: 'Percentages must sum to 100%' },
                { status: 400 }
            );
        }

        const exam = await prisma.customExam.update({
            where: { id },
            data: {
                name,
                description,
                categoryId,
                questionCount,
                basicPercentage,
                advancedPercentage,
                masteryPercentage,
                isActive,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(exam);
    } catch (error) {
        console.error('Failed to update custom exam:', error);
        return NextResponse.json(
            { error: 'Failed to update custom exam' },
            { status: 500 }
        );
    }
}

// DELETE - Delete custom exam
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);

        await prisma.customExam.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete custom exam:', error);
        return NextResponse.json(
            { error: 'Failed to delete custom exam' },
            { status: 500 }
        );
    }
}
