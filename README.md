# VivoEdu - English Quiz Application

A modern, interactive English quiz application built with Next.js, Prisma, SQLite, and Tailwind CSS.

## Features

- 🎯 **20 Random Questions** per quiz session from a pool of 94 English questions
- ⏱️ **10-minute Timer** with automatic submission
- 🎨 **Beautiful UI** with gradient backgrounds and glassmorphism effects
- 📊 **Real-time Progress** tracking and scoring
- 🔐 **Admin Authentication** system
- 📱 **Responsive Design** for all devices
- ✅ **Detailed Results** with answer review

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Prisma ORM + SQLite
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Authentication**: bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Create database and tables
   npx prisma db push

   # Seed with questions and admin user
   npx prisma db seed
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Default Credentials

- **Username**: `admin`
- **Password**: `1234`

## Project Structure

```
VivoEdu/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication
│   │   └── quiz/         # Quiz logic
│   ├── dashboard/        # Dashboard page
│   ├── quiz/             # Quiz interface
│   ├── results/          # Results page
│   └── page.tsx          # Login page
├── lib/
│   └── prisma.ts         # Prisma client
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
└── package.json
```

## Database Schema

- **User**: Admin authentication
- **Question**: Quiz questions (94 English questions)
- **QuizSession**: Quiz attempts with timing
- **Answer**: User answers and scoring

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## How It Works

1. **Login** with admin credentials
2. **Start Quiz** from the dashboard
3. **Answer 20 questions** within 10 minutes
4. **Submit** or wait for auto-submit
5. **View Results** with detailed answer review
6. **Retake** as many times as you want

## Features in Detail

### Quiz Interface
- Live countdown timer
- Progress bar
- Question navigation (Previous/Next)
- Answer selection with visual feedback
- Answer counter

### Results Page
- Score percentage
- Time taken
- Pass/fail indicator (70% threshold)
- Detailed answer review with correct answers highlighted

## License

MIT

## Author

Built with ❤️ using Next.js and Prisma
