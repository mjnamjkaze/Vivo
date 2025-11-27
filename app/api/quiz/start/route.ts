import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { userId, categoryId, customExamId } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Get IP address
        const forwarded = request.headers.get('x-forwarded-for');
        const ipAddress = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

        let questionCount = 20;
        let basicPercentage = 60;
        let advancedPercentage = 30;
        let masteryPercentage = 10;
        let targetCategoryId = categoryId ? parseInt(categoryId) : undefined;

        // Check if using custom exam
        if (customExamId) {
            const customExam = await prisma.customExam.findUnique({
                where: { id: parseInt(customExamId) },
            });

            if (!customExam) {
                return NextResponse.json(
                    { error: 'Custom exam not found' },
                    { status: 404 }
                );
            }

            questionCount = customExam.questionCount;
            basicPercentage = customExam.basicPercentage;
            advancedPercentage = customExam.advancedPercentage;
            masteryPercentage = customExam.masteryPercentage;
            targetCategoryId = customExam.categoryId;
        } else {
            // Use global config
            const config = await prisma.quizConfig.findFirst();
            if (config) {
                questionCount = config.questionCount;
                basicPercentage = config.basicPercentage;
                advancedPercentage = config.advancedPercentage;
                masteryPercentage = config.masteryPercentage;
            }
        }

        // Calculate questions needed per difficulty
        const basicCount = Math.floor(questionCount * basicPercentage / 100);
        const advancedCount = Math.floor(questionCount * advancedPercentage / 100);
        const masteryCount = questionCount - basicCount - advancedCount;

        // Fetch questions by difficulty
        const whereClause: any = {};
        if (targetCategoryId) {
            whereClause.categoryId = targetCategoryId;
        }

        const basicQuestions = await prisma.question.findMany({
            where: { ...whereClause, tag: 'Cơ Bản' },
        });

        const advancedQuestions = await prisma.question.findMany({
            where: { ...whereClause, tag: 'Nâng Cao' },
        });

        const masteryQuestions = await prisma.question.findMany({
            where: { ...whereClause, tag: 'Tinh Thông' },
        });

        // Random selection from each difficulty
        const selectedBasic = basicQuestions
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.min(basicCount, basicQuestions.length));

        const selectedAdvanced = advancedQuestions
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.min(advancedCount, advancedQuestions.length));

        const selectedMastery = masteryQuestions
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.min(masteryCount, masteryQuestions.length));

        const selectedQuestions = [...selectedBasic, ...selectedAdvanced, ...selectedMastery];

        // Check if we have enough questions
        if (selectedQuestions.length < questionCount) {
            // Try to fill with any available questions
            const allQuestions = await prisma.question.findMany({
                where: whereClause,
            });

            const usedIds = new Set(selectedQuestions.map(q => q.id));
            const remaining = allQuestions
                .filter(q => !usedIds.has(q.id))
                .sort(() => 0.5 - Math.random())
                .slice(0, questionCount - selectedQuestions.length);

            selectedQuestions.push(...remaining);
        }

        if (selectedQuestions.length === 0) {
            return NextResponse.json(
                { error: 'No questions available' },
                { status: 400 }
            );
        }

        // Shuffle final list
        const shuffled = selectedQuestions.sort(() => 0.5 - Math.random());

        // Create quiz session with IP and category tracking
        const session = await prisma.quizSession.create({
            data: {
                userId: parseInt(userId),
                categoryId: targetCategoryId,
                ipAddress,
                totalQuestions: shuffled.length,
                timeLimit: 600, // 10 minutes
            },
        });

        // Create answer records
        await Promise.all(
            shuffled.map((q) =>
                prisma.answer.create({
                    data: {
                        sessionId: session.id,
                        questionId: q.id,
                    },
                })
            )
        );

        // Return questions (without correct answers)
        const questions = shuffled.map((q) => ({
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
