import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('1234', 10);

    // Create candidate user
    const candidate = await prisma.user.upsert({
        where: { username: 'candidate' },
        update: {
            password: hashedPassword,
            role: 'user',
        },
        create: {
            username: 'candidate',
            password: hashedPassword,
            role: 'user',
        },
    });

    console.log(`Created candidate user: ${candidate.username}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
