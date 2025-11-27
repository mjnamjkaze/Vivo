import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const categoryId = searchParams.get('categoryId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
        });

        if (!user || (user.role !== 'admin' && user.role !== 's-admin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const whereClause = categoryId ? { categoryId: parseInt(categoryId) } : {};

        const questions = await prisma.question.findMany({
            where: whereClause,
            select: {
                question: true,
                optionA: true,
                optionB: true,
                optionC: true,
                optionD: true,
                correctAnswer: true,
                questionImageUrl: true,
                optionAImageUrl: true,
                optionBImageUrl: true,
                optionCImageUrl: true,
                optionDImageUrl: true,
                categoryId: true,
            }
        });

        return NextResponse.json(questions);
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
