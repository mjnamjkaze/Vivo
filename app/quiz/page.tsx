'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
    id: number;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
}

export default function Quiz() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
            router.push('/dashboard');
            return;
        }

        // Fetch quiz data
        const fetchQuiz = async () => {
            try {
                const res = await fetch('/api/quiz/start', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: parseInt(localStorage.getItem('userId')!) }),
                });

                const data = await res.json();
                if (res.ok) {
                    setQuestions(data.questions);
                    setTimeLeft(data.timeLimit);
                }
            } catch (error) {
                console.error('Failed to fetch quiz:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [router]);

    useEffect(() => {
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleAnswer = (questionId: number, answer: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = async () => {
        const sessionId = localStorage.getItem('sessionId');
        if (!sessionId) return;

        try {
            const res = await fetch('/api/quiz/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: parseInt(sessionId),
                    answers,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('quizResult', JSON.stringify(data));
                router.push('/results');
            }
        } catch (error) {
            console.error('Failed to submit quiz:', error);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="quiz-container flex items-center justify-center">
                <div className="text-white text-xl">Loading quiz...</div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="quiz-container flex items-center justify-center">
                <div className="text-white text-xl">No questions available</div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="quiz-container min-h-screen p-4">
            <div className="max-w-4xl mx-auto py-8">
                {/* Header */}
                <div className="quiz-card p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-lg font-semibold text-gray-800">
                            Question {currentIndex + 1} of {questions.length}
                        </div>
                        <div className={`timer text-xl font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-purple-600'}`}>
                            ⏱ {formatTime(timeLeft)}
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="quiz-card p-8 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-8">
                        {currentQuestion.question}
                    </h2>

                    <div className="space-y-4">
                        {['A', 'B', 'C', 'D'].map((option) => {
                            const optionText = currentQuestion[`option${option}` as keyof Question] as string;
                            const isSelected = answers[currentQuestion.id] === option;

                            return (
                                <button
                                    key={option}
                                    onClick={() => handleAnswer(currentQuestion.id, option)}
                                    className={`option-button w-full text-left p-4 rounded-lg ${isSelected ? 'selected' : 'bg-white'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 font-semibold ${isSelected ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
                                            }`}>
                                            {option}
                                        </div>
                                        <div className="text-gray-800">{optionText}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentIndex === 0}
                        className="px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ← Previous
                    </button>

                    <div className="text-white text-sm">
                        {Object.keys(answers).length} / {questions.length} answered
                    </div>

                    {currentIndex < questions.length - 1 ? (
                        <button
                            onClick={() => setCurrentIndex((prev) => prev + 1)}
                            className="px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition"
                        >
                            Next →
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition transform hover:scale-105"
                        >
                            Submit Quiz
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
