import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch quiz configuration (or return defaults)
export async function GET() {
    try {
        let config = await prisma.quizConfig.findFirst();

        // If no config exists, create default one
        if (!config) {
            config = await prisma.quizConfig.create({
                data: {
                    questionCount: 20,
                    basicPercentage: 60,
                    advancedPercentage: 30,
                    masteryPercentage: 10,
                    timeLimit: 600,
                    homepageMode: 'categories',
                    selectedCategoryIds: null,
                    selectedCustomExamIds: null,
                },
            });
        }

        return NextResponse.json(config);
    } catch (error) {
        console.error('Failed to fetch quiz config:', error);
        return NextResponse.json(
            { error: 'Failed to fetch configuration' },
            { status: 500 }
        );
    }
}

// PUT - Update quiz configuration
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const {
            questionCount,
            basicPercentage,
            advancedPercentage,
            masteryPercentage,
            timeLimit,
            homepageMode,
            selectedCategoryIds,
            selectedCustomExamIds,
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

        if (homepageMode !== 'categories' && homepageMode !== 'custom-exams') {
            return NextResponse.json(
                { error: 'Invalid homepage mode' },
                { status: 400 }
            );
        }

        // Get existing config or create new one
        let config = await prisma.quizConfig.findFirst();

        if (config) {
            // Update existing
            config = await prisma.quizConfig.update({
                where: { id: config.id },
                data: {
                    questionCount,
                    basicPercentage,
                    advancedPercentage,
                    masteryPercentage,
                    timeLimit,
                    homepageMode,
                    selectedCategoryIds,
                },
            });
        } else {
            // Create new
            config = await prisma.quizConfig.create({
                data: {
                    questionCount,
                    basicPercentage,
                    advancedPercentage,
                    masteryPercentage,
                    timeLimit,
                    homepageMode,
                    selectedCategoryIds,
                },
            });
        }

        return NextResponse.json(config);
    } catch (error) {
        console.error('Failed to update quiz config:', error);
        return NextResponse.json(
            { error: 'Failed to update configuration' },
            { status: 500 }
        );
    }
}
