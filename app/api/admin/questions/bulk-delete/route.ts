import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST bulk delete questions
export async function POST(request: NextRequest) {
    try {
        const { ids } = await request.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json(
                { error: 'Invalid request: ids array is required' },
                { status: 400 }
            );
        }

        // Delete all questions with the given IDs
        const result = await prisma.question.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });

        return NextResponse.json({
            success: true,
            deletedCount: result.count,
        });
    } catch (error) {
        console.error('Bulk delete questions error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
