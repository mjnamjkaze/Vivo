import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all custom exams
export async function GET() {
    try {
        const exams = await prisma.customExam.findMany({
            include: {
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(exams);
    } catch (error) {
        console.error('Failed to fetch custom exams:', error);
        return NextResponse.json(
            { error: 'Failed to fetch custom exams' },
            { status: 500 }
        );
    }
}

// POST - Create new custom exam
export async function POST(request: Request) {
    try {
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
        if (!name || !categoryId) {
            return NextResponse.json(
                { error: 'Name and category are required' },
                { status: 400 }
            );
        }

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

        const exam = await prisma.customExam.create({
            data: {
                name,
                description,
                categoryId,
                questionCount,
                basicPercentage,
                advancedPercentage,
                masteryPercentage,
                isActive: isActive ?? true,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(exam);
    } catch (error) {
        console.error('Failed to create custom exam:', error);
        return NextResponse.json(
            { error: 'Failed to create custom exam' },
            { status: 500 }
        );
    }
}
