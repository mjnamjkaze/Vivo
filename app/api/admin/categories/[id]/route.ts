import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT update category
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { name, description } = await request.json();
        const id = parseInt(params.id);

        if (!name) {
            return NextResponse.json(
                { error: 'Category name is required' },
                { status: 400 }
            );
        }

        const category = await prisma.category.update({
            where: { id },
            data: {
                name,
                description: description || null,
            },
        });

        return NextResponse.json(category);
    } catch (error: any) {
        console.error('Update category error:', error);

        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Category name already exists' },
                { status: 400 }
            );
        }

        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE category
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);

        // Check if category has questions
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { questions: true }
                }
            }
        });

        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        if (category._count.questions > 0) {
            return NextResponse.json(
                { error: 'Cannot delete category with existing questions' },
                { status: 400 }
            );
        }

        await prisma.category.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete category error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
