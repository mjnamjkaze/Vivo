'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
    id: number;
    name: string;
    description: string | null;
}

interface CustomExam {
    id: number;
    name: string;
    description: string | null;
    categoryId: number;
    questionCount: number;
    isActive: boolean;
}

interface QuizConfig {
    homepageMode: string;
    questionCount: number;
}

export default function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [customExams, setCustomExams] = useState<CustomExam[]>([]);
    const [config, setConfig] = useState<QuizConfig | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedExam, setSelectedExam] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            router.push('/');
        }
        fetchConfig();
        fetchCategories();
        fetchCustomExams();
    }, [router]);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/admin/quiz-config');
            const data = await res.json();
            setConfig(data);
        } catch (error) {
            console.error('Failed to fetch config:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchCustomExams = async () => {
        try {
            const res = await fetch('/api/admin/custom-exams');
            const data = await res.json();
            setCustomExams(data.filter((exam: CustomExam) => exam.isActive));
        } catch (error) {
            console.error('Failed to fetch custom exams:', error);
        }
    };

    const startQuiz = async () => {
        setLoading(true);
        const userId = localStorage.getItem('userId');

        try {
            const body: any = {
                userId: parseInt(userId!),
            };

            if (config?.homepageMode === 'custom-exams' && selectedExam) {
                body.customExamId = parseInt(selectedExam);
            } else if (selectedCategory) {
                body.categoryId = parseInt(selectedCategory);
            }

            const res = await fetch('/api/quiz/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('sessionId', data.sessionId);
                router.push('/quiz');
            } else {
                alert(data.error || 'Failed to start quiz');
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
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
        router.push('/');
    };

    const showCategories = !config || config.homepageMode === 'categories';
    const questionCount = config?.questionCount || 20;

    return (
        <div className="quiz-container flex items-center justify-center p-4">
            <div className="quiz-card w-full max-w-2xl p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <div className="flex gap-3">
                        {['admin', 's-admin'].includes(localStorage.getItem('userRole') || '') && (
                            <button
                                onClick={() => router.push('/admin/categories')}
                                className="px-4 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
                            >
                                ⚙️ Admin
                            </button>
                        )}
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Welcome to VivoEdu Quiz!
                    </h2>
                    <p className="text-gray-700 mb-6">
                        Test your knowledge with {questionCount} carefully selected questions.
                    </p>

                    {/* Categories or Custom Exams */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-800 mb-3">
                            {showCategories ? 'Select Category (optional):' : 'Select Exam:'}
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {showCategories ? (
                                <>
                                    <button
                                        onClick={() => setSelectedCategory('')}
                                        className={`p-4 rounded-lg border-2 transition ${selectedCategory === ''
                                            ? 'border-purple-600 bg-purple-50'
                                            : 'border-gray-300 bg-white hover:border-purple-300'
                                            }`}
                                    >
                                        <div className="font-semibold text-gray-800">All Categories</div>
                                        <div className="text-sm text-gray-600">Mixed questions</div>
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id.toString())}
                                            className={`p-4 rounded-lg border-2 transition ${selectedCategory === cat.id.toString()
                                                ? 'border-purple-600 bg-purple-50'
                                                : 'border-gray-300 bg-white hover:border-purple-300'
                                                }`}
                                        >
                                            <div className="font-semibold text-gray-800">{cat.name}</div>
                                            {cat.description && (
                                                <div className="text-sm text-gray-600">{cat.description}</div>
                                            )}
                                        </button>
                                    ))}
                                </>
                            ) : (
                                customExams.map((exam) => (
                                    <button
                                        key={exam.id}
                                        onClick={() => setSelectedExam(exam.id.toString())}
                                        className={`p-4 rounded-lg border-2 transition ${selectedExam === exam.id.toString()
                                            ? 'border-purple-600 bg-purple-50'
                                            : 'border-gray-300 bg-white hover:border-purple-300'
                                            }`}
                                    >
                                        <div className="font-semibold text-gray-800">{exam.name}</div>
                                        {exam.description && (
                                            <div className="text-sm text-gray-600">{exam.description}</div>
                                        )}
                                        <div className="text-xs text-purple-600 mt-1">{exam.questionCount} câu</div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-1">{questionCount}</div>
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
                        disabled={loading || (!showCategories && !selectedExam)}
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
