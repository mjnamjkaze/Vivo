import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const questions = [
    {
        question: "What is the past tense of 'go'?",
        optionA: "goed",
        optionB: "went",
        optionC: "gone",
        optionD: "going",
        correctAnswer: "B"
    },
    {
        question: "Which word is a noun?",
        optionA: "quickly",
        optionB: "run",
        optionC: "happiness",
        optionD: "beautiful",
        correctAnswer: "C"
    },
    {
        question: "Choose the correct sentence:",
        optionA: "She don't like coffee",
        optionB: "She doesn't likes coffee",
        optionC: "She doesn't like coffee",
        optionD: "She not like coffee",
        correctAnswer: "C"
    },
    {
        question: "What is the plural of 'child'?",
        optionA: "childs",
        optionB: "childes",
        optionC: "children",
        optionD: "childrens",
        correctAnswer: "C"
    },
    {
        question: "Which is a preposition?",
        optionA: "under",
        optionB: "quickly",
        optionC: "happy",
        optionD: "running",
        correctAnswer: "A"
    },
    {
        question: "What does 'benevolent' mean?",
        optionA: "cruel",
        optionB: "kind",
        optionC: "angry",
        optionD: "sad",
        correctAnswer: "B"
    },
    {
        question: "Choose the correct form: 'If I ___ rich, I would travel the world.'",
        optionA: "am",
        optionB: "was",
        optionC: "were",
        optionD: "be",
        correctAnswer: "C"
    },
    {
        question: "What is a synonym for 'happy'?",
        optionA: "sad",
        optionB: "joyful",
        optionC: "angry",
        optionD: "tired",
        correctAnswer: "B"
    },
    {
        question: "Which sentence is in passive voice?",
        optionA: "The cat chased the mouse",
        optionB: "The mouse was chased by the cat",
        optionC: "The cat is chasing the mouse",
        optionD: "The cat will chase the mouse",
        correctAnswer: "B"
    },
    {
        question: "What is the superlative form of 'good'?",
        optionA: "gooder",
        optionB: "goodest",
        optionC: "better",
        optionD: "best",
        correctAnswer: "D"
    },
    {
        question: "Which word is an adverb?",
        optionA: "quick",
        optionB: "quickly",
        optionC: "quickness",
        optionD: "quicker",
        correctAnswer: "B"
    },
    {
        question: "What is the meaning of 'procrastinate'?",
        optionA: "to do something immediately",
        optionB: "to delay or postpone",
        optionC: "to finish quickly",
        optionD: "to work hard",
        correctAnswer: "B"
    },
    {
        question: "Choose the correct article: '___ apple a day keeps the doctor away.'",
        optionA: "A",
        optionB: "An",
        optionC: "The",
        optionD: "No article",
        correctAnswer: "B"
    },
    {
        question: "What is the comparative form of 'bad'?",
        optionA: "badder",
        optionB: "baddest",
        optionC: "worse",
        optionD: "worst",
        correctAnswer: "C"
    },
    {
        question: "Which is a conjunction?",
        optionA: "and",
        optionB: "quickly",
        optionC: "under",
        optionD: "happy",
        correctAnswer: "A"
    },
    {
        question: "What does 'ambiguous' mean?",
        optionA: "clear",
        optionB: "uncertain or unclear",
        optionC: "simple",
        optionD: "obvious",
        correctAnswer: "B"
    },
    {
        question: "Choose the correct tense: 'She ___ to the store yesterday.'",
        optionA: "go",
        optionB: "goes",
        optionC: "went",
        optionD: "going",
        correctAnswer: "C"
    },
    {
        question: "What is an antonym for 'difficult'?",
        optionA: "hard",
        optionB: "easy",
        optionC: "challenging",
        optionD: "tough",
        correctAnswer: "B"
    },
    {
        question: "Which sentence uses correct punctuation?",
        optionA: "Its a beautiful day",
        optionB: "It's a beautiful day",
        optionC: "Its' a beautiful day",
        optionD: "Its a beautiful day.",
        correctAnswer: "B"
    },
    {
        question: "What is the past participle of 'eat'?",
        optionA: "ate",
        optionB: "eated",
        optionC: "eaten",
        optionD: "eating",
        correctAnswer: "C"
    },
    {
        question: "Which word is a pronoun?",
        optionA: "table",
        optionB: "quickly",
        optionC: "they",
        optionD: "running",
        correctAnswer: "C"
    },
    {
        question: "What does 'eloquent' mean?",
        optionA: "unable to speak",
        optionB: "fluent and persuasive in speaking",
        optionC: "quiet",
        optionD: "rude",
        correctAnswer: "B"
    },
    {
        question: "Choose the correct form: 'Neither John nor his friends ___ coming.'",
        optionA: "is",
        optionB: "are",
        optionC: "was",
        optionD: "been",
        correctAnswer: "B"
    },
    {
        question: "What is the meaning of 'meticulous'?",
        optionA: "careless",
        optionB: "showing great attention to detail",
        optionC: "lazy",
        optionD: "quick",
        correctAnswer: "B"
    },
    {
        question: "Which is the correct spelling?",
        optionA: "recieve",
        optionB: "receive",
        optionC: "receve",
        optionD: "receeve",
        correctAnswer: "B"
    },
    {
        question: "What type of word is 'beautiful'?",
        optionA: "noun",
        optionB: "verb",
        optionC: "adjective",
        optionD: "adverb",
        correctAnswer: "C"
    },
    {
        question: "Choose the correct sentence:",
        optionA: "Between you and I",
        optionB: "Between you and me",
        optionC: "Between you and myself",
        optionD: "Between yourself and I",
        correctAnswer: "B"
    },
    {
        question: "What is the plural of 'mouse'?",
        optionA: "mouses",
        optionB: "mice",
        optionC: "meese",
        optionD: "mouse",
        correctAnswer: "B"
    },
    {
        question: "Which word means 'to make worse'?",
        optionA: "improve",
        optionB: "exacerbate",
        optionC: "enhance",
        optionD: "better",
        correctAnswer: "B"
    },
    {
        question: "What is the correct form: 'I have ___ this book before.'",
        optionA: "read",
        optionB: "readed",
        optionC: "reading",
        optionD: "reads",
        correctAnswer: "A"
    },
    {
        question: "Which is a proper noun?",
        optionA: "city",
        optionB: "London",
        optionC: "building",
        optionD: "river",
        correctAnswer: "B"
    },
    {
        question: "What does 'ubiquitous' mean?",
        optionA: "rare",
        optionB: "present everywhere",
        optionC: "absent",
        optionD: "unique",
        correctAnswer: "B"
    },
    {
        question: "Choose the correct form: 'She has been working here ___ 2020.'",
        optionA: "for",
        optionB: "since",
        optionC: "from",
        optionD: "at",
        correctAnswer: "B"
    },
    {
        question: "What is the opposite of 'ancient'?",
        optionA: "old",
        optionB: "modern",
        optionC: "historical",
        optionD: "antique",
        correctAnswer: "B"
    },
    {
        question: "Which sentence is grammatically correct?",
        optionA: "He don't know the answer",
        optionB: "He doesn't knows the answer",
        optionC: "He doesn't know the answer",
        optionD: "He not know the answer",
        correctAnswer: "C"
    },
    {
        question: "What is a collective noun for fish?",
        optionA: "group",
        optionB: "school",
        optionC: "pack",
        optionD: "herd",
        correctAnswer: "B"
    },
    {
        question: "What does 'ephemeral' mean?",
        optionA: "lasting forever",
        optionB: "lasting for a very short time",
        optionC: "permanent",
        optionD: "eternal",
        correctAnswer: "B"
    },
    {
        question: "Choose the correct form: 'If I ___ you, I would apologize.'",
        optionA: "am",
        optionB: "was",
        optionC: "were",
        optionD: "be",
        correctAnswer: "C"
    },
    {
        question: "What is the past tense of 'swim'?",
        optionA: "swimmed",
        optionB: "swam",
        optionC: "swum",
        optionD: "swimming",
        correctAnswer: "B"
    },
    {
        question: "Which word is a verb?",
        optionA: "happiness",
        optionB: "happy",
        optionC: "happily",
        optionD: "happen",
        correctAnswer: "D"
    },
    {
        question: "What does 'pragmatic' mean?",
        optionA: "idealistic",
        optionB: "practical and realistic",
        optionC: "theoretical",
        optionD: "imaginative",
        correctAnswer: "B"
    },
    {
        question: "Choose the correct article: 'He is ___ honest man.'",
        optionA: "a",
        optionB: "an",
        optionC: "the",
        optionD: "no article",
        correctAnswer: "B"
    },
    {
        question: "What is the superlative form of 'far'?",
        optionA: "farer",
        optionB: "farthest",
        optionC: "more far",
        optionD: "most far",
        correctAnswer: "B"
    },
    {
        question: "Which is an interjection?",
        optionA: "and",
        optionB: "quickly",
        optionC: "wow",
        optionD: "running",
        correctAnswer: "C"
    },
    {
        question: "What does 'verbose' mean?",
        optionA: "brief",
        optionB: "using more words than needed",
        optionC: "concise",
        optionD: "silent",
        correctAnswer: "B"
    },
    {
        question: "Choose the correct form: 'The team ___ won the championship.'",
        optionA: "have",
        optionB: "has",
        optionC: "are",
        optionD: "were",
        correctAnswer: "B"
    },
    {
        question: "What is the plural of 'phenomenon'?",
        optionA: "phenomenons",
        optionB: "phenomena",
        optionC: "phenomenas",
        optionD: "phenomenon",
        correctAnswer: "B"
    },
    {
        question: "Which word means 'to make less severe'?",
        optionA: "aggravate",
        optionB: "mitigate",
        optionC: "worsen",
        optionD: "intensify",
        correctAnswer: "B"
    },
    {
        question: "What is the correct form: 'I wish I ___ taller.'",
        optionA: "am",
        optionB: "was",
        optionC: "were",
        optionD: "be",
        correctAnswer: "C"
    },
    {
        question: "Which is a demonstrative pronoun?",
        optionA: "he",
        optionB: "this",
        optionC: "who",
        optionD: "myself",
        correctAnswer: "B"
    },
    {
        question: "What does 'candid' mean?",
        optionA: "dishonest",
        optionB: "truthful and straightforward",
        optionC: "secretive",
        optionD: "deceptive",
        correctAnswer: "B"
    },
    {
        question: "Choose the correct tense: 'By next year, I ___ here for 10 years.'",
        optionA: "will work",
        optionB: "will have worked",
        optionC: "work",
        optionD: "worked",
        correctAnswer: "B"
    },
    {
        question: "What is the comparative form of 'little'?",
        optionA: "littler",
        optionB: "less",
        optionC: "least",
        optionD: "more little",
        correctAnswer: "B"
    },
    {
        question: "Which sentence uses correct subject-verb agreement?",
        optionA: "The list of items are on the desk",
        optionB: "The list of items is on the desk",
        optionC: "The list of items were on the desk",
        optionD: "The list of items be on the desk",
        correctAnswer: "B"
    },
    {
        question: "What does 'tenacious' mean?",
        optionA: "giving up easily",
        optionB: "persistent and determined",
        optionC: "weak",
        optionD: "lazy",
        correctAnswer: "B"
    },
    {
        question: "Choose the correct form: 'She made me ___ my homework.'",
        optionA: "to do",
        optionB: "do",
        optionC: "doing",
        optionD: "done",
        correctAnswer: "B"
    },
    {
        question: "What is the past participle of 'write'?",
        optionA: "wrote",
        optionB: "writed",
        optionC: "written",
        optionD: "writing",
        correctAnswer: "C"
    },
    {
        question: "Which word is an abstract noun?",
        optionA: "table",
        optionB: "freedom",
        optionC: "dog",
        optionD: "car",
        correctAnswer: "B"
    },
    {
        question: "What does 'frugal' mean?",
        optionA: "wasteful",
        optionB: "economical and avoiding waste",
        optionC: "expensive",
        optionD: "generous",
        correctAnswer: "B"
    },
    {
        question: "Choose the correct form: 'Either the students or the teacher ___ responsible.'",
        optionA: "are",
        optionB: "is",
        optionC: "were",
        optionD: "been",
        correctAnswer: "B"
    },
    {
        question: "What is the meaning of 'indigenous'?",
        optionA: "foreign",
        optionB: "native or originating from a place",
        optionC: "imported",
        optionD: "exotic",
        correctAnswer: "B"
    },
    {
        question: "Which is the correct spelling?",
        optionA: "occured",
        optionB: "occurred",
        optionC: "ocurred",
        optionD: "occurrd",
        correctAnswer: "B"
    },
    {
        question: "What type of clause is: 'because it was raining'?",
        optionA: "independent clause",
        optionB: "dependent clause",
        optionC: "noun clause",
        optionD: "relative clause",
        correctAnswer: "B"
    },
    {
        question: "Choose the correct sentence:",
        optionA: "Who's book is this?",
        optionB: "Whose book is this?",
        optionC: "Who book is this?",
        optionD: "Whos book is this?",
        correctAnswer: "B"
    },
    {
        question: "What is the plural of 'criterion'?",
        optionA: "criterions",
        optionB: "criteria",
        optionC: "criterias",
        optionD: "criterion",
        correctAnswer: "B"
    },
    {
        question: "Which word means 'to spread throughout'?",
        optionA: "contain",
        optionB: "pervade",
        optionC: "limit",
        optionD: "restrict",
        correctAnswer: "B"
    },
    {
        question: "What is the correct form: 'I look forward to ___ you.'",
        optionA: "see",
        optionB: "seeing",
        optionC: "saw",
        optionD: "seen",
        correctAnswer: "B"
    },
    {
        question: "Which is a reflexive pronoun?",
        optionA: "he",
        optionB: "this",
        optionC: "myself",
        optionD: "who",
        correctAnswer: "C"
    },
    {
        question: "What does 'altruistic' mean?",
        optionA: "selfish",
        optionB: "showing unselfish concern for others",
        optionC: "greedy",
        optionD: "self-centered",
        correctAnswer: "B"
    },
    {
        question: "Choose the correct form: 'The news ___ shocking.'",
        optionA: "are",
        optionB: "is",
        optionC: "were",
        optionD: "been",
        correctAnswer: "B"
    },
    {
        question: "What is the opposite of 'optimistic'?",
        optionA: "hopeful",
        optionB: "pessimistic",
        optionC: "positive",
        optionD: "cheerful",
        correctAnswer: "B"
    },
    {
        question: "Which sentence uses correct parallel structure?",
        optionA: "She likes reading, writing, and to paint",
        optionB: "She likes reading, writing, and painting",
        optionC: "She likes to read, writing, and painting",
        optionD: "She likes reading, to write, and painting",
        correctAnswer: "B"
    },
    {
        question: "What is a synonym for 'diligent'?",
        optionA: "lazy",
        optionB: "hardworking",
        optionC: "careless",
        optionD: "negligent",
        correctAnswer: "B"
    },
    {
        question: "What does 'ambivalent' mean?",
        optionA: "certain",
        optionB: "having mixed feelings",
        optionC: "decisive",
        optionD: "clear",
        correctAnswer: "B"
    },
    {
        question: "Choose the correct form: 'I would rather ___ at home.'",
        optionA: "to stay",
        optionB: "stay",
        optionC: "staying",
        optionD: "stayed",
        correctAnswer: "B"
    },
    {
        question: "What is the past tense of 'teach'?",
        optionA: "teached",
        optionB: "taught",
        optionC: "tought",
        optionD: "teaching",
        correctAnswer: "B"
    },
    {
        question: "Which word is a gerund?",
        optionA: "run",
        optionB: "running",
        optionC: "ran",
        optionD: "runs",
        correctAnswer: "B"
    },
    {
        question: "What does 'innate' mean?",
        optionA: "learned",
        optionB: "inborn or natural",
        optionC: "acquired",
        optionD: "taught",
        correctAnswer: "B"
    },
    {
        question: "Choose the correct article: '___ university is a place of learning.'",
        optionA: "A",
        optionB: "An",
        optionC: "The",
        optionD: "No article",
        correctAnswer: "A"
    },
    {
        question: "What is the superlative form of 'many'?",
        optionA: "more",
        optionB: "most",
        optionC: "much",
        optionD: "morer",
        correctAnswer: "B"
    },
    {
        question: "Which is a possessive pronoun?",
        optionA: "he",
        optionB: "his",
        optionC: "him",
        optionD: "himself",
        correctAnswer: "B"
    },
    {
        question: "What does 'lucid' mean?",
        optionA: "confusing",
        optionB: "clear and easy to understand",
        optionC: "vague",
        optionD: "obscure",
        correctAnswer: "B"
    },
    {
        question: "Choose the correct form: 'Each of the students ___ a book.'",
        optionA: "have",
        optionB: "has",
        optionC: "are having",
        optionD: "were having",
        correctAnswer: "B"
    },
    {
        question: "What is the plural of 'analysis'?",
        optionA: "analysises",
        optionB: "analyses",
        optionC: "analysis",
        optionD: "analysiss",
        correctAnswer: "B"
    },
    {
        question: "Which word means 'to confirm or support'?",
        optionA: "deny",
        optionB: "corroborate",
        optionC: "refute",
        optionD: "contradict",
        correctAnswer: "B"
    },
    {
        question: "What is the correct form: 'She is used to ___ early.'",
        optionA: "wake up",
        optionB: "waking up",
        optionC: "woke up",
        optionD: "woken up",
        correctAnswer: "B"
    },
    {
        question: "Which is an interrogative pronoun?",
        optionA: "he",
        optionB: "this",
        optionC: "who",
        optionD: "myself",
        correctAnswer: "C"
    },
    {
        question: "What does 'resilient' mean?",
        optionA: "fragile",
        optionB: "able to recover quickly",
        optionC: "weak",
        optionD: "brittle",
        correctAnswer: "B"
    },
    {
        question: "Choose the correct tense: 'When I arrived, they ___ already left.'",
        optionA: "have",
        optionB: "had",
        optionC: "has",
        optionD: "having",
        correctAnswer: "B"
    },
    {
        question: "What is the comparative form of 'beautiful'?",
        optionA: "beautifuler",
        optionB: "more beautiful",
        optionC: "most beautiful",
        optionD: "beautifuller",
        correctAnswer: "B"
    },
    {
        question: "Which sentence is in active voice?",
        optionA: "The cake was eaten by John",
        optionB: "John ate the cake",
        optionC: "The cake is being eaten by John",
        optionD: "The cake has been eaten by John",
        correctAnswer: "B"
    },
    {
        question: "What does 'zealous' mean?",
        optionA: "indifferent",
        optionB: "showing great energy and enthusiasm",
        optionC: "lazy",
        optionD: "apathetic",
        correctAnswer: "B"
    },
    {
        question: "Choose the correct form: 'I suggest that he ___ more carefully.'",
        optionA: "drives",
        optionB: "drive",
        optionC: "driving",
        optionD: "drove",
        correctAnswer: "B"
    },
    {
        question: "What is the past participle of 'choose'?",
        optionA: "chose",
        optionB: "choosed",
        optionC: "chosen",
        optionD: "choosing",
        correctAnswer: "C"
    }
];

async function main() {
    console.log('Start seeding...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('1234', 10);
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: hashedPassword,
        },
    });

    console.log(`Created admin user: ${admin.username}`);

    // Create questions
    for (const q of questions) {
        await prisma.question.create({
            data: q,
        });
    }

    console.log(`Created ${questions.length} questions`);
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
