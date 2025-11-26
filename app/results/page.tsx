'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface QuizResult {
    score: number;
    total: number;
    timeTaken: number;
    answers: Array<{
        question: string;
        userAnswer: string | null;
        correctAnswer: string;
        isCorrect: boolean;
        options: {
            A: string;
            B: string;
            C: string;
            D: string;
        };
    }>;
}

export default function Results() {
    const [result, setResult] = useState<QuizResult | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const resultData = localStorage.getItem('quizResult');
        if (!resultData) {
            router.push('/dashboard');
            return;
        }

        setResult(JSON.parse(resultData));
    }, [router]);

    const handleRetake = () => {
        localStorage.removeItem('sessionId');
        localStorage.removeItem('quizResult');
        router.push('/dashboard');
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    if (!result) {
        return (
            <div className="quiz-container flex items-center justify-center">
                <div className="text-white text-xl">Loading results...</div>
            </div>
        );
    }

    const percentage = Math.round((result.score / result.total) * 100);
    const passed = percentage >= 70;

    return (
        <div className="quiz-container min-h-screen p-4">
            <div className="max-w-4xl mx-auto py-8">
                {/* Results Card */}
                <div className="quiz-card p-8 mb-6 text-center">
                    <div className={`text-6xl mb-4 ${passed ? 'text-green-500' : 'text-orange-500'}`}>
                        {passed ? '🎉' : '📚'}
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        {passed ? 'Congratulations!' : 'Good Effort!'}
                    </h1>
                    <p className="text-gray-600 mb-8">
                        {passed ? 'You passed the quiz!' : 'Keep practicing to improve!'}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-6">
                            <div className="text-4xl font-bold text-purple-700 mb-2">
                                {result.score}/{result.total}
                            </div>
                            <div className="text-sm text-purple-900">Correct Answers</div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl p-6">
                            <div className="text-4xl font-bold text-indigo-700 mb-2">{percentage}%</div>
                            <div className="text-sm text-indigo-900">Score</div>
                        </div>

                        <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl p-6">
                            <div className="text-4xl font-bold text-pink-700 mb-2">
                                {formatTime(result.timeTaken)}
                            </div>
                            <div className="text-sm text-pink-900">Time Taken</div>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                        >
                            {showDetails ? 'Hide Details' : 'Show Details'}
                        </button>
                        <button
                            onClick={handleRetake}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition transform hover:scale-105"
                        >
                            Take Another Quiz
                        </button>
                    </div>
                </div>

                {/* Detailed Results */}
                {showDetails && (
                    <div className="quiz-card p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Answer Review</h2>
                        <div className="space-y-6">
                            {result.answers.map((answer, index) => (
                                <div
                                    key={index}
                                    className={`p-6 rounded-lg border-2 ${answer.isCorrect
                                            ? 'border-green-300 bg-green-50'
                                            : 'border-red-300 bg-red-50'
                                        }`}
                                >
                                    <div className="flex items-start mb-4">
                                        <div
                                            className={`text-2xl mr-3 ${answer.isCorrect ? 'text-green-500' : 'text-red-500'
                                                }`}
                                        >
                                            {answer.isCorrect ? '✓' : '✗'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-800 mb-3">
                                                {index + 1}. {answer.question}
                                            </div>

                                            <div className="space-y-2">
                                                {['A', 'B', 'C', 'D'].map((option) => {
                                                    const isUserAnswer = answer.userAnswer === option;
                                                    const isCorrectAnswer = answer.correctAnswer === option;
                                                    const optionText = answer.options[option as keyof typeof answer.options];

                                                    return (
                                                        <div
                                                            key={option}
                                                            className={`p-3 rounded-lg ${isCorrectAnswer
                                                                    ? 'bg-green-200 font-semibold'
                                                                    : isUserAnswer
                                                                        ? 'bg-red-200'
                                                                        : 'bg-white'
                                                                }`}
                                                        >
                                                            <span className="font-semibold mr-2">{option}.</span>
                                                            {optionText}
                                                            {isCorrectAnswer && (
                                                                <span className="ml-2 text-green-700">✓ Correct</span>
                                                            )}
                                                            {isUserAnswer && !isCorrectAnswer && (
                                                                <span className="ml-2 text-red-700">Your answer</span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
