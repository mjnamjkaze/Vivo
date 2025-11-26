import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('1234', 10);
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {
            password: hashedPassword,
            role: 'admin',
        },
        create: {
            username: 'admin',
            password: hashedPassword,
            role: 'admin',
        },
    });

    console.log(`Created admin user: ${admin.username}`);

    // Create s-admin user (super admin)
    const sAdmin = await prisma.user.upsert({
        where: { username: 's-admin' },
        update: {
            password: hashedPassword,
            role: 's-admin',
        },
        create: {
            username: 's-admin',
            password: hashedPassword,
            role: 's-admin',
        },
    });

    console.log(`Created s-admin user: ${sAdmin.username}`);

    // Create categories
    const categories = [
        { name: 'Tiếng Anh', description: 'English Language Questions' },
        { name: 'Toán Học', description: 'Mathematics Questions' },
        { name: 'Văn Học', description: 'Literature Questions' },
    ];

    const createdCategories: { [key: string]: number } = {};

    for (const cat of categories) {
        const category = await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: cat,
        });
        createdCategories[cat.name] = category.id;
        console.log(`Created category: ${category.name}`);
    }

    // English questions
    const englishQuestions = [
        {
            question: "What is the past tense of 'go'?",
            optionA: "goed",
            optionB: "went",
            optionC: "gone",
            optionD: "going",
            correctAnswer: "B",
            categoryId: createdCategories['Tiếng Anh']
        },
        {
            question: "Which word is a noun?",
            optionA: "quickly",
            optionB: "run",
            optionC: "happiness",
            optionD: "beautiful",
            correctAnswer: "C",
            categoryId: createdCategories['Tiếng Anh']
        },
        {
            question: "Choose the correct sentence:",
            optionA: "She don't like coffee",
            optionB: "She doesn't likes coffee",
            optionC: "She doesn't like coffee",
            optionD: "She not like coffee",
            correctAnswer: "C",
            categoryId: createdCategories['Tiếng Anh']
        },
        {
            question: "What is the plural of 'child'?",
            optionA: "childs",
            optionB: "childes",
            optionC: "children",
            optionD: "childrens",
            correctAnswer: "C",
            categoryId: createdCategories['Tiếng Anh']
        },
        {
            question: "Which is a preposition?",
            optionA: "under",
            optionB: "quickly",
            optionC: "happy",
            optionD: "running",
            correctAnswer: "A",
            categoryId: createdCategories['Tiếng Anh']
        },
        {
            question: "What does 'benevolent' mean?",
            optionA: "cruel",
            optionB: "kind",
            optionC: "angry",
            optionD: "sad",
            correctAnswer: "B",
            categoryId: createdCategories['Tiếng Anh']
        },
        {
            question: "What is a synonym for 'happy'?",
            optionA: "sad",
            optionB: "joyful",
            optionC: "angry",
            optionD: "tired",
            correctAnswer: "B",
            categoryId: createdCategories['Tiếng Anh']
        },
        {
            question: "What is the superlative form of 'good'?",
            optionA: "gooder",
            optionB: "goodest",
            optionC: "better",
            optionD: "best",
            correctAnswer: "D",
            categoryId: createdCategories['Tiếng Anh']
        },
        {
            question: "Which word is an adverb?",
            optionA: "quick",
            optionB: "quickly",
            optionC: "quickness",
            optionD: "quicker",
            correctAnswer: "B",
            categoryId: createdCategories['Tiếng Anh']
        },
        {
            question: "What is the meaning of 'procrastinate'?",
            optionA: "to do something immediately",
            optionB: "to delay or postpone",
            optionC: "to finish quickly",
            optionD: "to work hard",
            correctAnswer: "B",
            categoryId: createdCategories['Tiếng Anh']
        },
    ];

    // Math questions
    const mathQuestions = [
        {
            question: "2 + 2 = ?",
            optionA: "3",
            optionB: "4",
            optionC: "5",
            optionD: "6",
            correctAnswer: "B",
            categoryId: createdCategories['Toán Học']
        },
        {
            question: "10 × 5 = ?",
            optionA: "50",
            optionB: "15",
            optionC: "55",
            optionD: "45",
            correctAnswer: "A",
            categoryId: createdCategories['Toán Học']
        },
        {
            question: "100 ÷ 4 = ?",
            optionA: "20",
            optionB: "25",
            optionC: "30",
            optionD: "40",
            correctAnswer: "B",
            categoryId: createdCategories['Toán Học']
        },
        {
            question: "Căn bậc hai của 144 là?",
            optionA: "10",
            optionB: "11",
            optionC: "12",
            optionD: "13",
            correctAnswer: "C",
            categoryId: createdCategories['Toán Học']
        },
        {
            question: "15% của 200 là?",
            optionA: "20",
            optionB: "25",
            optionC: "30",
            optionD: "35",
            correctAnswer: "C",
            categoryId: createdCategories['Toán Học']
        },
        {
            question: "Nếu x + 5 = 12, thì x = ?",
            optionA: "5",
            optionB: "6",
            optionC: "7",
            optionD: "8",
            correctAnswer: "C",
            categoryId: createdCategories['Toán Học']
        },
        {
            question: "Chu vi hình vuông cạnh 5cm là?",
            optionA: "15cm",
            optionB: "20cm",
            optionC: "25cm",
            optionD: "30cm",
            correctAnswer: "B",
            categoryId: createdCategories['Toán Học']
        },
        {
            question: "Diện tích hình chữ nhật 4cm × 6cm là?",
            optionA: "20cm²",
            optionB: "22cm²",
            optionC: "24cm²",
            optionD: "26cm²",
            correctAnswer: "C",
            categoryId: createdCategories['Toán Học']
        },
        {
            question: "2³ (2 mũ 3) = ?",
            optionA: "6",
            optionB: "8",
            optionC: "9",
            optionD: "12",
            correctAnswer: "B",
            categoryId: createdCategories['Toán Học']
        },
        {
            question: "Số nguyên tố nhỏ nhất là?",
            optionA: "0",
            optionB: "1",
            optionC: "2",
            optionD: "3",
            correctAnswer: "C",
            categoryId: createdCategories['Toán Học']
        },
    ];

    // Literature questions
    const literatureQuestions = [
        {
            question: "Tác giả của 'Truyện Kiều' là ai?",
            optionA: "Nguyễn Du",
            optionB: "Hồ Xuân Hương",
            optionC: "Nguyễn Trãi",
            optionD: "Tú Xương",
            correctAnswer: "A",
            categoryId: createdCategories['Văn Học']
        },
        {
            question: "'Số phận con người' là tác phẩm của ai?",
            optionA: "Nam Cao",
            optionB: "Ngô Tất Tố",
            optionC: "Nguyễn Công Hoan",
            optionD: "Vũ Trọng Phụng",
            correctAnswer: "A",
            categoryId: createdCategories['Văn Học']
        },
        {
            question: "Thể thơ lục bát có bao nhiêu chữ mỗi câu?",
            optionA: "6 và 7",
            optionB: "6 và 8",
            optionC: "7 và 8",
            optionD: "5 và 7",
            correctAnswer: "B",
            categoryId: createdCategories['Văn Học']
        },
        {
            question: "Ai là tác giả của 'Chí Phèo'?",
            optionA: "Nam Cao",
            optionB: "Ngô Tất Tố",
            optionC: "Tô Hoài",
            optionD: "Kim Lân",
            correctAnswer: "A",
            categoryId: createdCategories['Văn Học']
        },
        {
            question: "Tác phẩm 'Tắt đèn' của ai?",
            optionA: "Nam Cao",
            optionB: "Ngô Tất Tố",
            optionC: "Nguyễn Công Hoan",
            optionD: "Vũ Trọng Phụng",
            correctAnswer: "B",
            categoryId: createdCategories['Văn Học']
        },
        {
            question: "Thơ Đường luật có mấy câu?",
            optionA: "4 câu",
            optionB: "6 câu",
            optionC: "8 câu",
            optionD: "10 câu",
            correctAnswer: "C",
            categoryId: createdCategories['Văn Học']
        },
        {
            question: "Ai là tác giả của 'Vợ nhặt'?",
            optionA: "Kim Lân",
            optionB: "Nam Cao",
            optionC: "Ngô Tất Tố",
            optionD: "Tô Hoài",
            correctAnswer: "A",
            categoryId: createdCategories['Văn Học']
        },
        {
            question: "Tác phẩm 'Dế Mèn phiêu lưu ký' của ai?",
            optionA: "Tô Hoài",
            optionB: "Nam Cao",
            optionC: "Nguyễn Nhật Ánh",
            optionD: "Nguyễn Ngọc Tư",
            correctAnswer: "A",
            categoryId: createdCategories['Văn Học']
        },
        {
            question: "Thể văn xuôi bao gồm những gì?",
            optionA: "Truyện, tiểu thuyết, kịch",
            optionB: "Thơ, ca dao",
            optionC: "Chỉ có thơ",
            optionD: "Chỉ có truyện",
            correctAnswer: "A",
            categoryId: createdCategories['Văn Học']
        },
        {
            question: "Ai là tác giả của 'Chiếc lá cuối cùng'?",
            optionA: "O.Henry",
            optionB: "Nam Cao",
            optionC: "Ngô Tất Tố",
            optionD: "Tô Hoài",
            correctAnswer: "A",
            categoryId: createdCategories['Văn Học']
        },
    ];

    // Create all questions
    const allQuestions = [...englishQuestions, ...mathQuestions, ...literatureQuestions];

    for (const q of allQuestions) {
        await prisma.question.create({
            data: q,
        });
    }

    console.log(`Created ${allQuestions.length} questions`);
    console.log(`  - English: ${englishQuestions.length}`);
    console.log(`  - Math: ${mathQuestions.length}`);
    console.log(`  - Literature: ${literatureQuestions.length}`);
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
