const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function test() {
    console.log('Testing database...');

    // Check if admin user exists
    const user = await prisma.user.findUnique({
        where: { username: 'admin' }
    });

    console.log('Admin user:', user);

    if (user) {
        // Test password
        const isValid = await bcrypt.compare('1234', user.password);
        console.log('Password valid:', isValid);
    }

    // Check categories
    const categories = await prisma.category.findMany();
    console.log('Categories:', categories.length);

    // Check questions
    const questions = await prisma.question.findMany();
    console.log('Questions:', questions.length);

    await prisma.$disconnect();
}

test().catch(console.error);
