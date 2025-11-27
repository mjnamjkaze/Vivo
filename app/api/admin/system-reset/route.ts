import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        // Verify user is s-admin (you might want to add proper auth check here)
        const { userId } = await request.json();

        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
        });

        if (!user || user.role !== 's-admin') {
            return NextResponse.json(
                { error: 'Unauthorized. Only s-admin can reset system.' },
                { status: 403 }
            );
        }

        // Delete all data except users
        console.log('Starting system reset...');

        // Delete in correct order (respecting foreign keys)
        await prisma.answer.deleteMany({});
        console.log('Deleted all answers');

        await prisma.quizSession.deleteMany({});
        console.log('Deleted all quiz sessions');

        await prisma.question.deleteMany({});
        console.log('Deleted all questions');

        await prisma.customExam.deleteMany({});
        console.log('Deleted all custom exams');

        await prisma.category.deleteMany({});
        console.log('Deleted all categories');

        await prisma.quizConfig.deleteMany({});
        console.log('Deleted all quiz configs');

        console.log('System reset completed successfully!');

        return NextResponse.json({
            success: true,
            message: 'System reset successfully. All data deleted except users.',
        });
    } catch (error) {
        console.error('System reset error:', error);
        return NextResponse.json(
            { error: 'Failed to reset system' },
            { status: 500 }
        );
    }
}
