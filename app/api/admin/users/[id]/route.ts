import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// PUT update user by ID (s-admin only)
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const { username, password, role } = await request.json();

        if (!username) {
            return NextResponse.json(
                { error: 'Username is required' },
                { status: 400 }
            );
        }

        const updateData: any = {
            username,
            role: role || 'user',
        };

        // Only update password if provided
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                username: true,
                role: true,
                createdAt: true,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error: any) {
        console.error('Update user error:', error);

        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Username already exists' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE user by ID (s-admin only, prevent self-delete)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);

        // Get current user ID from request (you might want to implement proper session management)
        // For now, we'll check if it's the s-admin user
        const userToDelete = await prisma.user.findUnique({
            where: { id },
        });

        if (!userToDelete) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Prevent deleting s-admin
        if (userToDelete.username === 's-admin') {
            return NextResponse.json(
                { error: 'Cannot delete s-admin user' },
                { status: 403 }
            );
        }

        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Delete user error:', error);

        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
