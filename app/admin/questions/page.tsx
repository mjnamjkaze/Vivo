'use client';

import { useState, useEffect } from 'react';

interface Category {
    id: number;
    name: string;
}

interface Question {
    id: number;
    question: string;
    questionImageUrl?: string | null;
    optionA: string;
    optionAImageUrl?: string | null;
    optionB: string;
    optionBImageUrl?: string | null;
    optionC: string;
    optionCImageUrl?: string | null;
    optionD: string;
    optionDImageUrl?: string | null;
    correctAnswer: string;
    categoryId: number;
    category: Category;
}

export default function QuestionsPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [filterCategory, setFilterCategory] = useState<string>('');
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        question: '',
        questionImageUrl: '',
        optionA: '',
        optionAImageUrl: '',
        optionB: '',
        optionBImageUrl: '',
        optionC: '',
        optionCImageUrl: '',
        optionD: '',
        optionDImageUrl: '',
        correctAnswer: 'A',
        categoryId: '',
    });

    useEffect(() => {
        fetchCategories();
        fetchQuestions();
    }, [filterCategory]);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchQuestions = async () => {
        try {
            const url = filterCategory
                ? `/api/admin/questions?categoryId=${filterCategory}`
                : '/api/admin/questions';

            const res = await fetch(url);
            const data = await res.json();
            setQuestions(data);
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (file: File, field: string) => {
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, [field]: data.url }));
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to upload image');
            }
        } catch (error) {
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingId
                ? `/api/admin/questions/${editingId}`
                : '/api/admin/questions';

            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                fetchQuestions();
                handleCancel();
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to save question');
            }
        } catch (error) {
            alert('An error occurred');
        }
    };

    const handleEdit = (question: Question) => {
        setEditingId(question.id);
        setFormData({
            question: question.question,
            questionImageUrl: question.questionImageUrl || '',
            optionA: question.optionA,
            optionAImageUrl: question.optionAImageUrl || '',
            optionB: question.optionB,
            optionBImageUrl: question.optionBImageUrl || '',
            optionC: question.optionC,
            optionCImageUrl: question.optionCImageUrl || '',
            optionD: question.optionD,
            optionDImageUrl: question.optionDImageUrl || '',
            correctAnswer: question.correctAnswer,
            categoryId: question.categoryId.toString(),
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this question?')) return;

        try {
            const res = await fetch(`/api/admin/questions/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchQuestions();
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to delete question');
            }
        } catch (error) {
            alert('An error occurred');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            question: '',
            questionImageUrl: '',
            optionA: '',
            optionAImageUrl: '',
            optionB: '',
            optionBImageUrl: '',
            optionC: '',
            optionCImageUrl: '',
            optionD: '',
            optionDImageUrl: '',
            correctAnswer: 'A',
            categoryId: '',
        });
    };

    const getCategoryColor = (categoryName: string) => {
        const colors: { [key: string]: string } = {
            'Tiếng Anh': 'bg-blue-100 text-blue-700',
            'Toán Học': 'bg-green-100 text-green-700',
            'Văn Học': 'bg-purple-100 text-purple-700',
        };
        return colors[categoryName] || 'bg-gray-100 text-gray-700';
    };

    const ImageUploadField = ({ label, field, currentUrl }: { label: string; field: string; currentUrl: string }) => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="flex gap-3 items-start">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, field);
                    }}
                    className="flex-1 text-sm"
                />
                {currentUrl && (
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, [field]: '' }))}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                        Remove
                    </button>
                )}
            </div>
            {currentUrl && (
                <img src={currentUrl} alt="Preview" className="mt-2 max-w-xs h-20 object-cover rounded border" />
            )}
        </div>
    );

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Questions Management</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition"
                >
                    + Add Question
                </button>
            </div>

            {/* Filter */}
            <div className="mb-6 flex gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">Filter by Category:</label>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                <span className="text-sm text-gray-600">
                    {questions.length} question{questions.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-white rounded-xl p-8 max-w-4xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            {editingId ? 'Edit Question' : 'Add New Question'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Question */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Question *</label>
                                <textarea
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    rows={2}
                                    required
                                />
                            </div>

                            <ImageUploadField label="Question Image (optional)" field="questionImageUrl" currentUrl={formData.questionImageUrl} />

                            {/* Options */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {['A', 'B', 'C', 'D'].map((opt) => (
                                    <div key={opt} className="border p-4 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Option {opt} *</label>
                                        <input
                                            type="text"
                                            value={formData[`option${opt}` as keyof typeof formData] as string}
                                            onChange={(e) => setFormData({ ...formData, [`option${opt}`]: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none mb-2"
                                            required
                                        />
                                        <ImageUploadField
                                            label={`Option ${opt} Image`}
                                            field={`option${opt}ImageUrl`}
                                            currentUrl={formData[`option${opt}ImageUrl` as keyof typeof formData] as string}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Correct Answer */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer *</label>
                                <select
                                    value={formData.correctAnswer}
                                    onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    required
                                >
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                    disabled={uploading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                                    disabled={uploading}
                                >
                                    {uploading ? 'Uploading...' : (editingId ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Questions List */}
            <div className="space-y-4">
                {questions.map((q) => (
                    <div key={q.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(q.category.name)}`}>
                                        {q.category.name}
                                    </span>
                                    <span className="text-xs text-gray-500">ID: {q.id}</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">{q.question}</h3>
                                {q.questionImageUrl && (
                                    <img src={q.questionImageUrl} alt="Question" className="mt-2 max-w-md h-32 object-cover rounded" />
                                )}
                            </div>

                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={() => handleEdit(q)}
                                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(q.id)}
                                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                            {['A', 'B', 'C', 'D'].map((option) => {
                                const optionText = q[`option${option}` as keyof Question] as string;
                                const optionImage = q[`option${option}ImageUrl` as keyof Question] as string | null;
                                const isCorrect = q.correctAnswer === option;

                                return (
                                    <div
                                        key={option}
                                        className={`p-3 rounded-lg border-2 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-start gap-2">
                                            <span className="font-semibold text-gray-700">{option}.</span>
                                            <div className="flex-1">
                                                <span className="text-gray-800">{optionText}</span>
                                                {optionImage && (
                                                    <img src={optionImage} alt={`Option ${option}`} className="mt-1 max-w-full h-16 object-cover rounded" />
                                                )}
                                            </div>
                                            {isCorrect && <span className="text-green-600 font-semibold">✓</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {questions.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No questions yet. Click "Add Question" to create one.
                </div>
            )}
        </div>
    );
}
