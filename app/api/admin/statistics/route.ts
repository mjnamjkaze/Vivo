import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const categoryId = searchParams.get('categoryId');

        // Build filter
        const where: any = {
            completed: true,
        };

        if (startDate && endDate) {
            where.startTime = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }

        if (categoryId) {
            where.categoryId = parseInt(categoryId);
        }

        // Fetch all completed sessions with user info
        const sessions = await prisma.quizSession.findMany({
            where,
            include: {
                user: {
                    select: {
                        username: true,
                    },
                },
            },
            orderBy: {
                startTime: 'desc',
            },
        });

        // Calculate statistics
        const totalSessions = sessions.length;
        const averageScore = sessions.length > 0
            ? sessions.reduce((sum, s) => sum + (s.score || 0), 0) / sessions.length
            : 0;

        // Unique IPs
        const uniqueIPs = new Set(sessions.map(s => s.ipAddress).filter(Boolean)).size;

        // Score distribution (0-20, 21-40, 41-60, 61-80, 81-100)
        const scoreRanges = {
            '0-20': 0,
            '21-40': 0,
            '41-60': 0,
            '61-80': 0,
            '81-100': 0,
        };

        sessions.forEach(session => {
            const score = session.score || 0;
            const percentage = (score / session.totalQuestions) * 100;

            if (percentage <= 20) scoreRanges['0-20']++;
            else if (percentage <= 40) scoreRanges['21-40']++;
            else if (percentage <= 60) scoreRanges['41-60']++;
            else if (percentage <= 80) scoreRanges['61-80']++;
            else scoreRanges['81-100']++;
        });

        // Sessions by category
        const sessionsByCategory: { [key: number]: number } = {};
        sessions.forEach(session => {
            if (session.categoryId) {
                sessionsByCategory[session.categoryId] =
                    (sessionsByCategory[session.categoryId] || 0) + 1;
            }
        });

        // Get category names
        const categories = await prisma.category.findMany({
            select: { id: true, name: true },
        });

        const categoryStats = categories.map(cat => ({
            name: cat.name,
            count: sessionsByCategory[cat.id] || 0,
            averageScore: sessions
                .filter(s => s.categoryId === cat.id)
                .reduce((sum, s, _, arr) => {
                    return arr.length > 0 ? sum + (s.score || 0) / arr.length : 0;
                }, 0),
        }));

        // Sessions over time (group by date)
        const sessionsByDate: { [key: string]: number } = {};
        sessions.forEach(session => {
            const date = session.startTime.toISOString().split('T')[0];
            sessionsByDate[date] = (sessionsByDate[date] || 0) + 1;
        });

        const timeSeriesData = Object.entries(sessionsByDate)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return NextResponse.json({
            summary: {
                totalSessions,
                averageScore: Math.round(averageScore * 100) / 100,
                uniqueIPs,
            },
            scoreDistribution: Object.entries(scoreRanges).map(([range, count]) => ({
                range,
                count,
            })),
            categoryStats,
            timeSeriesData,
            sessions: sessions.map(s => ({
                id: s.id,
                username: s.user.username,
                ipAddress: s.ipAddress,
                categoryId: s.categoryId,
                score: s.score,
                totalQuestions: s.totalQuestions,
                percentage: s.score ? Math.round((s.score / s.totalQuestions) * 100) : 0,
                startTime: s.startTime,
                endTime: s.endTime,
                duration: s.endTime
                    ? Math.round((s.endTime.getTime() - s.startTime.getTime()) / 1000)
                    : null,
            })),
        });
    } catch (error) {
        console.error('Failed to fetch statistics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}
