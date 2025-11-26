import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all categories
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { questions: true }
                }
            },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error('Get categories error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST create new category
export async function POST(request: NextRequest) {
    try {
        const { name, description } = await request.json();

        if (!name) {
            return NextResponse.json(
                { error: 'Category name is required' },
                { status: 400 }
            );
        }

        const category = await prisma.category.create({
            data: {
                name,
                description: description || null,
            },
        });

        return NextResponse.json(category);
    } catch (error: any) {
        console.error('Create category error:', error);

        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Category name already exists' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
