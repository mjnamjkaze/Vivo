import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { seedDatabase } from '@/lib/seed-logic';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
        });

        if (!user || user.role !== 's-admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await seedDatabase(prisma);

        return NextResponse.json({ message: 'System reset successfully' });
    } catch (error) {
        console.error('Reset error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
