import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Connecting to database...');
    const user = await prisma.user.findUnique({
        where: { username: 's-admin' },
    });

    console.log('User found:', user);
    if (user) {
        console.log('Role value:', (user as any).role);
    } else {
        console.log('User s-admin not found');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
