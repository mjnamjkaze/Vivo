import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { userId, categoryId, questions } = await request.json();

        if (!userId || !questions || !Array.isArray(questions)) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
        });

        if (!user || (user.role !== 'admin' && user.role !== 's-admin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        let targetCategoryId = categoryId ? parseInt(categoryId) : null;

        // If categoryId is not provided, we might need to infer it or require it.
        // The prompt says "import/export ... cho từng chủ đề" (for each topic).
        // So likely the user selects a topic and imports into it.

        if (!targetCategoryId) {
            // If not provided, check if questions have categoryId, otherwise error
            // But for simplicity, let's require categoryId or use the first one from questions if available
            if (questions.length > 0 && questions[0].categoryId) {
                targetCategoryId = questions[0].categoryId;
            } else {
                return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
            }
        }

        const createdQuestions = await prisma.$transaction(
            questions.map((q: any) =>
                prisma.question.create({
                    data: {
                        question: q.question,
                        optionA: q.optionA,
                        optionB: q.optionB,
                        optionC: q.optionC,
                        optionD: q.optionD,
                        correctAnswer: q.correctAnswer,
                        questionImageUrl: q.questionImageUrl,
                        optionAImageUrl: q.optionAImageUrl,
                        optionBImageUrl: q.optionBImageUrl,
                        optionCImageUrl: q.optionCImageUrl,
                        optionDImageUrl: q.optionDImageUrl,
                        categoryId: targetCategoryId!,
                    }
                })
            )
        );

        return NextResponse.json({ message: `Imported ${createdQuestions.length} questions successfully` });
    } catch (error) {
        console.error('Import error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
