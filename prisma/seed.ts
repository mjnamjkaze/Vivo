import { PrismaClient } from '@prisma/client';
import { seedDatabase } from '../lib/seed-logic';

const prisma = new PrismaClient();

async function main() {
    await seedDatabase(prisma);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
