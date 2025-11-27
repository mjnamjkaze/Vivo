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
    timeLimit: number;
    isActive: boolean;
}

interface QuizConfig {
    homepageMode: string;
    questionCount: number;
    timeLimit: number;
    selectedCategoryIds: string | null;
    selectedCustomExamIds: string | null;
}

export default function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [customExams, setCustomExams] = useState<CustomExam[]>([]);
    const [config, setConfig] = useState<QuizConfig | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedExams, setSelectedExams] = useState<number | null>(null);
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

    // Filter categories based on config
    const displayedCategories = categories.filter(cat => {
        if (!config || !config.selectedCategoryIds) return true;
        const selectedIds = config.selectedCategoryIds.split(',').map(id => parseInt(id));
        return selectedIds.includes(cat.id);
    });

    const fetchCustomExams = async () => {
        try {
            const res = await fetch('/api/admin/custom-exams');
            const data = await res.json();
            setCustomExams(data.filter((exam: CustomExam) => exam.isActive));
        } catch (error) {
            console.error('Failed to fetch custom exams:', error);
        }
    };

    // Filter custom exams based on config
    const displayedExams = customExams.filter(exam => {
        if (!config || !config.selectedCustomExamIds) return true;
        const selectedIds = config.selectedCustomExamIds.split(',').map(id => parseInt(id));
        return selectedIds.includes(exam.id);
    });

    const toggleCategory = (id: number) => {
        setSelectedCategories(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const toggleExam = (id: number) => {
        setSelectedExams(prev => prev === id ? null : id);
    };

    const selectAllCategories = () => {
        setSelectedCategories([]);
    };

    const selectAllExams = () => {
        setSelectedExams(null);
    };

    const startQuiz = async () => {
        setLoading(true);
        const userId = localStorage.getItem('userId');

        try {
            const body: any = {
                userId: parseInt(userId!),
            };

            // Only send IDs if specific items are selected
            if (config?.homepageMode === 'custom-exams') {
                if (selectedExams !== null) {
                    body.customExamIds = [selectedExams];
                }
                // If null, API will use all exams
            } else {
                if (selectedCategories.length > 0) {
                    body.categoryIds = selectedCategories;
                }
                // If empty, API will use all categories
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

    // Calculate dynamic question count and time limit based on selection
    let questionCount = config?.questionCount || 20;
    let timeLimit = config?.timeLimit || 600; // in seconds

    if (!showCategories && selectedExams !== null) {
        // When a specific exam is selected, use its values
        const selectedExam = customExams.find(exam => exam.id === selectedExams);
        if (selectedExam) {
            questionCount = selectedExam.questionCount;
            timeLimit = selectedExam.timeLimit;
        }
    }

    const timeLimitMinutes = Math.round(timeLimit / 60);
    const isAllSelected = showCategories ? selectedCategories.length === 0 : selectedExams === null;

    return (
        <div className="quiz-container flex items-center justify-center p-4">
            <div className="quiz-card w-full max-w-2xl p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <div className="flex gap-3">

                        {(typeof window !== 'undefined' && ['admin', 's-admin'].includes(localStorage.getItem('userRole') || '')) && (
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

                    {/* Categories or Custom Exams - Multiple Selection */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-sm font-medium text-gray-800">
                                {showCategories
                                    ? `Select Categories:`
                                    : `Select Exams:`}
                            </label>
                            <button
                                onClick={showCategories ? selectAllCategories : selectAllExams}
                                className={`px-3 py-1 text-sm rounded-lg transition ${isAllSelected
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {isAllSelected ? '✓ All Selected' : 'Select All'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-2">
                            {showCategories ? (
                                <>
                                    {displayedCategories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => toggleCategory(cat.id)}
                                            className={`p-4 rounded-lg border-2 transition text-left ${selectedCategories.includes(cat.id)
                                                ? 'border-purple-600 bg-purple-50'
                                                : 'border-gray-300 bg-white hover:border-purple-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="font-semibold text-gray-800">{cat.name}</div>
                                                {selectedCategories.includes(cat.id) && (
                                                    <span className="text-purple-600">✓</span>
                                                )}
                                            </div>
                                            {cat.description && (
                                                <div className="text-sm text-gray-600 mt-1">{cat.description}</div>
                                            )}
                                        </button>
                                    ))}
                                </>
                            ) : (
                                displayedExams.map((exam) => (
                                    <button
                                        key={exam.id}
                                        onClick={() => toggleExam(exam.id)}
                                        className={`p-4 rounded-lg border-2 transition text-left ${selectedExams === exam.id
                                            ? 'border-purple-600 bg-purple-50'
                                            : 'border-gray-300 bg-white hover:border-purple-300'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="font-semibold text-gray-800">{exam.name}</div>
                                            {selectedExams === exam.id && (
                                                <span className="text-purple-600">✓</span>
                                            )}
                                        </div>
                                        {exam.description && (
                                            <div className="text-sm text-gray-600 mt-1">{exam.description}</div>
                                        )}
                                        <div className="text-xs text-purple-600 mt-1">{exam.questionCount} câu</div>
                                    </button>
                                ))
                            )}
                        </div>

                        {isAllSelected && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-700">
                                    💡 <strong>All {showCategories ? 'categories' : 'exams'} selected</strong> - Questions will be mixed from all available sources
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-1">{questionCount}</div>
                            <div className="text-sm text-gray-600">Questions</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-indigo-600 mb-1">{timeLimitMinutes}</div>
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
        </div >
    );
}
