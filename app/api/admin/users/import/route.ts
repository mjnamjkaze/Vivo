import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Helper to generate random password
function generatePassword(length = 8) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

export async function POST(request: NextRequest) {
    try {
        const { users } = await request.json(); // Expecting array of { email?, phone?, name? }

        if (!Array.isArray(users) || users.length === 0) {
            return NextResponse.json(
                { error: 'Invalid input. Expected array of users.' },
                { status: 400 }
            );
        }

        const results = [];
        const errors = [];

        for (const user of users) {
            const identifier = user.email || user.phone;
            if (!identifier) {
                errors.push({ user, error: 'Missing email or phone' });
                continue;
            }

            // Generate username from email/phone if not provided
            let username = user.username;
            if (!username) {
                if (user.email) {
                    username = user.email.split('@')[0];
                } else {
                    username = user.phone;
                }
            }

            // Check if user exists
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { username: username },
                        { email: user.email || undefined },
                        { phone: user.phone || undefined }
                    ]
                } as any
            });

            if (existingUser) {
                errors.push({ user, error: 'User already exists (username, email, or phone)' });
                continue;
            }

            const password = generatePassword(8);
            const hashedPassword = await bcrypt.hash(password, 10);

            try {
                const newUser = await prisma.user.create({
                    data: {
                        username,
                        email: user.email || null,
                        phone: user.phone || null,
                        password: hashedPassword,
                        mustChangePassword: true,
                        role: 'user'
                    } as any
                });

                results.push({
                    username: newUser.username,
                    email: (newUser as any).email,
                    phone: (newUser as any).phone,
                    password: password // Return plain text password so admin can distribute it
                });
            } catch (e: any) {
                errors.push({ user, error: e.message });
            }
        }

        return NextResponse.json({
            success: true,
            imported: results,
            errors: errors
        });

    } catch (error) {
        console.error('Import users error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
