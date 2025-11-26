'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            router.push('/');
        }
    }, [router]);

    const startQuiz = async () => {
        setLoading(true);
        const userId = localStorage.getItem('userId');

        try {
            const res = await fetch('/api/quiz/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: parseInt(userId!) }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('sessionId', data.sessionId);
                router.push('/quiz');
            } else {
                alert('Failed to start quiz');
            }
        } catch (error) {
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('sessionId');
        router.push('/');
    };

    return (
        <div className="quiz-container flex items-center justify-center p-4">
            <div className="quiz-card w-full max-w-2xl p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
                    >
                        Logout
                    </button>
                </div>

                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Welcome to VivoEdu English Quiz!
                    </h2>
                    <p className="text-gray-700 mb-6">
                        Test your English knowledge with 20 carefully selected questions.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-1">20</div>
                            <div className="text-sm text-gray-600">Questions</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-indigo-600 mb-1">10</div>
                            <div className="text-sm text-gray-600">Minutes</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-pink-600 mb-1">4</div>
                            <div className="text-sm text-gray-600">Options Each</div>
                        </div>
                    </div>

                    <button
                        onClick={startQuiz}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? 'Starting Quiz...' : 'Start Quiz'}
                    </button>
                </div>

                <div className="text-center text-sm text-gray-600">
                    <p>Good luck! Take your time and read each question carefully.</p>
                </div>
            </div>
        </div>
    );
}
