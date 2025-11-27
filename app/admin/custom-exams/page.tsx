'use client';

import { useState, useEffect } from 'react';

interface Category {
    id: number;
    name: string;
}

interface CustomExam {
    id: number;
    name: string;
    description: string | null;
    categoryId: number;
    category: Category;
    questionCount: number;
    basicPercentage: number;
    advancedPercentage: number;
    masteryPercentage: number;
    isActive: boolean;
}

export default function CustomExamsPage() {
    const [exams, setExams] = useState<CustomExam[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        categoryId: 0,
        questionCount: 20,
        basicPercentage: 60,
        advancedPercentage: 30,
        masteryPercentage: 10,
        isActive: true,
    });

    useEffect(() => {
        fetchExams();
        fetchCategories();
    }, []);

    const fetchExams = async () => {
        try {
            const res = await fetch('/api/admin/custom-exams');
            const data = await res.json();
            setExams(data);
        } catch (error) {
            console.error('Failed to fetch exams:', error);
        } finally {
            setLoading(false);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const total = formData.basicPercentage + formData.advancedPercentage + formData.masteryPercentage;
        if (total !== 100) {
            alert('Tổng % phải bằng 100%!');
            return;
        }

        try {
            const url = editingId
                ? `/api/admin/custom-exams/${editingId}`
                : '/api/admin/custom-exams';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                fetchExams();
                handleCancel();
                alert(editingId ? 'Đã cập nhật!' : 'Đã tạo đề thi!');
            } else {
                const error = await res.json();
                alert(error.error || 'Lỗi');
            }
        } catch (error) {
            alert('Lỗi khi lưu');
        }
    };

    const handleEdit = (exam: CustomExam) => {
        setEditingId(exam.id);
        setFormData({
            name: exam.name,
            description: exam.description || '',
            categoryId: exam.categoryId,
            questionCount: exam.questionCount,
            basicPercentage: exam.basicPercentage,
            advancedPercentage: exam.advancedPercentage,
            masteryPercentage: exam.masteryPercentage,
            isActive: exam.isActive,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Xóa đề thi này?')) return;

        try {
            const res = await fetch(`/api/admin/custom-exams/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchExams();
                alert('Đã xóa!');
            }
        } catch (error) {
            alert('Lỗi khi xóa');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            name: '',
            description: '',
            categoryId: 0,
            questionCount: 20,
            basicPercentage: 60,
            advancedPercentage: 30,
            masteryPercentage: 10,
            isActive: true,
        });
    };

    const totalPercentage = formData.basicPercentage + formData.advancedPercentage + formData.masteryPercentage;

    if (loading) {
        return <div className="text-center py-8">Đang tải...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Đề Thi Tùy Chỉnh</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition"
                >
                    + Tạo Đề Thi
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            {editingId ? 'Sửa Đề Thi' : 'Tạo Đề Thi Mới'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tên đề thi *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục *</label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                    required
                                >
                                    <option value={0}>Chọn danh mục</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Số câu hỏi</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={formData.questionCount}
                                    onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-3">Phân bố độ khó</h3>

                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm">Cơ Bản</span>
                                            <span className="text-sm font-semibold">{formData.basicPercentage}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={formData.basicPercentage}
                                            onChange={(e) => setFormData({ ...formData, basicPercentage: parseInt(e.target.value) })}
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm">Nâng Cao</span>
                                            <span className="text-sm font-semibold">{formData.advancedPercentage}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={formData.advancedPercentage}
                                            onChange={(e) => setFormData({ ...formData, advancedPercentage: parseInt(e.target.value) })}
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm">Tinh Thông</span>
                                            <span className="text-sm font-semibold">{formData.masteryPercentage}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={formData.masteryPercentage}
                                            onChange={(e) => setFormData({ ...formData, masteryPercentage: parseInt(e.target.value) })}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className={`p-2 rounded text-sm ${totalPercentage === 100 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        Tổng: {totalPercentage}% {totalPercentage === 100 ? '✓' : '(Phải = 100%)'}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">Hiển thị trên trang chủ</span>
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={totalPercentage !== 100}
                                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                                >
                                    {editingId ? 'Cập nhật' : 'Tạo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam) => (
                    <div key={exam.id} className="bg-white rounded-xl p-6 shadow-md">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-bold text-gray-800">{exam.name}</h3>
                            {exam.isActive && (
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Active</span>
                            )}
                        </div>

                        {exam.description && (
                            <p className="text-sm text-gray-600 mb-3">{exam.description}</p>
                        )}

                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                            <p>📚 {exam.category.name}</p>
                            <p>📝 {exam.questionCount} câu</p>
                            <p>📊 {exam.basicPercentage}% / {exam.advancedPercentage}% / {exam.masteryPercentage}%</p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(exam)}
                                className="flex-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            >
                                Sửa
                            </button>
                            <button
                                onClick={() => handleDelete(exam.id)}
                                className="flex-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {exams.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    Chưa có đề thi nào. Nhấn "Tạo Đề Thi" để bắt đầu.
                </div>
            )}
        </div>
    );
}
