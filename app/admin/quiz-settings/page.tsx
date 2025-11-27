'use client';

import { useState, useEffect } from 'react';

interface QuizConfig {
    id: number;
    questionCount: number;
    basicPercentage: number;
    advancedPercentage: number;
    masteryPercentage: number;
    timeLimit: number;
    homepageMode: string;
    selectedCategoryIds: string | null;
    selectedCustomExamIds: string | null;
}

interface Category {
    id: number;
    name: string;
}

interface CustomExam {
    id: number;
    name: string;
    description: string | null;
    isActive: boolean;
}

export default function QuizSettingsPage() {
    const [config, setConfig] = useState<QuizConfig | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [customExams, setCustomExams] = useState<CustomExam[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        questionCount: 20,
        basicPercentage: 60,
        advancedPercentage: 30,
        masteryPercentage: 10,
        timeLimit: 600,
        homepageMode: 'categories',
        selectedCategoryIds: [] as number[],
        selectedCustomExamIds: [] as number[],
    });

    useEffect(() => {
        fetchConfig();
        fetchCategories();
        fetchCustomExams();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/admin/quiz-config');
            const data = await res.json();
            setConfig(data);

            // Parse selectedCategoryIds string to array
            let selectedCatIds: number[] = [];
            if (data.selectedCategoryIds) {
                selectedCatIds = data.selectedCategoryIds.split(',').map((id: string) => parseInt(id));
            }

            // Parse selectedCustomExamIds string to array
            let selectedExamIds: number[] = [];
            if (data.selectedCustomExamIds) {
                selectedExamIds = data.selectedCustomExamIds.split(',').map((id: string) => parseInt(id));
            }

            setFormData(prev => ({
                ...prev,
                questionCount: data.questionCount,
                basicPercentage: data.basicPercentage,
                advancedPercentage: data.advancedPercentage,
                masteryPercentage: data.masteryPercentage,
                timeLimit: data.timeLimit || 600,
                homepageMode: data.homepageMode,
                selectedCategoryIds: selectedCatIds,
                selectedCustomExamIds: selectedExamIds,
            }));
        } catch (error) {
            console.error('Failed to fetch config:', error);
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

    const fetchCustomExams = async () => {
        try {
            const res = await fetch('/api/admin/custom-exams');
            const data = await res.json();
            setCustomExams(data.filter((exam: CustomExam) => exam.isActive));
        } catch (error) {
            console.error('Failed to fetch custom exams:', error);
        }
    };

    const handleSave = async () => {
        const total = formData.basicPercentage + formData.advancedPercentage + formData.masteryPercentage;
        if (total !== 100) {
            alert('Tổng % phải bằng 100%!');
            return;
        }

        setSaving(true);
        try {
            // Convert arrays to comma-separated strings
            const payload = {
                ...formData,
                selectedCategoryIds: formData.selectedCategoryIds.length > 0
                    ? formData.selectedCategoryIds.join(',')
                    : null,
                selectedCustomExamIds: formData.selectedCustomExamIds.length > 0
                    ? formData.selectedCustomExamIds.join(',')
                    : null
            };

            const res = await fetch('/api/admin/quiz-config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const data = await res.json();
                setConfig(data);
                alert('Đã lưu cấu hình!');
            } else {
                const error = await res.json();
                alert(error.error || 'Lỗi khi lưu');
            }
        } catch (error) {
            alert('Lỗi khi lưu cấu hình');
        } finally {
            setSaving(false);
        }
    };

    const handlePercentageChange = (field: 'basicPercentage' | 'advancedPercentage' | 'masteryPercentage', value: number) => {
        let otherSum = 0;
        if (field !== 'basicPercentage') otherSum += formData.basicPercentage;
        if (field !== 'advancedPercentage') otherSum += formData.advancedPercentage;
        if (field !== 'masteryPercentage') otherSum += formData.masteryPercentage;

        if (value + otherSum > 100) {
            value = 100 - otherSum;
        }

        setFormData({ ...formData, [field]: value });
    };

    const toggleCategory = (id: number) => {
        setFormData(prev => {
            const current = prev.selectedCategoryIds;
            const updated = current.includes(id)
                ? current.filter(c => c !== id)
                : [...current, id];
            return { ...prev, selectedCategoryIds: updated };
        });
    };

    const toggleExam = (id: number) => {
        setFormData(prev => {
            const current = prev.selectedCustomExamIds;
            const updated = current.includes(id)
                ? current.filter(e => e !== id)
                : [...current, id];
            return { ...prev, selectedCustomExamIds: updated };
        });
    };

    const selectAllCategories = () => {
        setFormData(prev => ({
            ...prev,
            selectedCategoryIds: [] // Empty means all
        }));
    };

    const selectAllExams = () => {
        setFormData(prev => ({
            ...prev,
            selectedCustomExamIds: [] // Empty means all
        }));
    };

    const totalPercentage = formData.basicPercentage + formData.advancedPercentage + formData.masteryPercentage;
    const isAllCategoriesSelected = formData.selectedCategoryIds.length === 0;
    const isAllExamsSelected = formData.selectedCustomExamIds.length === 0;

    if (loading) {
        return <div className="text-center py-8">Đang tải...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Cấu Hình Quiz</h1>

            <div className="bg-white rounded-xl p-6 shadow-md space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số câu hỏi mỗi đề thi
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={formData.questionCount}
                        onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thời gian làm bài (phút)
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="60"
                        value={Math.floor(formData.timeLimit / 60)}
                        onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) * 60 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.timeLimit} giây = {Math.floor(formData.timeLimit / 60)} phút</p>
                </div>

                <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Phân bố độ khó</h3>

                    <div className="mb-4">
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Cơ Bản</label>
                            <span className="text-sm font-semibold text-purple-600">{formData.basicPercentage}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={formData.basicPercentage}
                            onChange={(e) => handlePercentageChange('basicPercentage', parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-purple-600"
                        />
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Nâng Cao</label>
                            <span className="text-sm font-semibold text-blue-600">{formData.advancedPercentage}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={formData.advancedPercentage}
                            onChange={(e) => handlePercentageChange('advancedPercentage', parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-600"
                        />
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Tinh Thông</label>
                            <span className="text-sm font-semibold text-red-600">{formData.masteryPercentage}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={formData.masteryPercentage}
                            onChange={(e) => handlePercentageChange('masteryPercentage', parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-red-600"
                        />
                    </div>

                    <div className={`p-3 rounded-lg ${totalPercentage === 100 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        <p className="text-sm font-medium">
                            Tổng: {totalPercentage}% {totalPercentage === 100 ? '✓' : '(Phải bằng 100%)'}
                        </p>
                    </div>
                </div>

                <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Hiển thị trang chủ</h3>
                    <div className="space-y-3 mb-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="homepageMode"
                                value="categories"
                                checked={formData.homepageMode === 'categories'}
                                onChange={(e) => setFormData({ ...formData, homepageMode: e.target.value })}
                                className="mr-3 w-4 h-4"
                            />
                            <span className="text-gray-700">Hiển thị danh mục (Categories)</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="homepageMode"
                                value="custom-exams"
                                checked={formData.homepageMode === 'custom-exams'}
                                onChange={(e) => setFormData({ ...formData, homepageMode: e.target.value })}
                                className="mr-3 w-4 h-4"
                            />
                            <span className="text-gray-700">Hiển thị đề thi tùy chỉnh</span>
                        </label>
                    </div>

                    {/* Category Selection UI */}
                    {formData.homepageMode === 'categories' && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-medium text-gray-700">Chọn danh mục hiển thị:</label>
                                <button
                                    onClick={selectAllCategories}
                                    className={`text-xs px-2 py-1 rounded ${isAllCategoriesSelected
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {isAllCategoriesSelected ? '✓ Đang hiển thị tất cả' : 'Chọn tất cả'}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                                {categories.map(cat => (
                                    <label key={cat.id} className="flex items-center p-2 bg-white rounded border cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            checked={formData.selectedCategoryIds.includes(cat.id)}
                                            onChange={() => toggleCategory(cat.id)}
                                            className="mr-2 h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                                        />
                                        <span className="text-sm text-gray-700 truncate">{cat.name}</span>
                                    </label>
                                ))}
                            </div>
                            {isAllCategoriesSelected && (
                                <p className="text-xs text-gray-500 mt-2">
                                    * Không chọn danh mục nào đồng nghĩa với việc hiển thị <strong>TẤT CẢ</strong> danh mục.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Custom Exam Selection UI */}
                    {formData.homepageMode === 'custom-exams' && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-medium text-gray-700">Chọn đề thi hiển thị:</label>
                                <button
                                    onClick={selectAllExams}
                                    className={`text-xs px-2 py-1 rounded ${isAllExamsSelected
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {isAllExamsSelected ? '✓ Đang hiển thị tất cả' : 'Chọn tất cả'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                                {customExams.map(exam => (
                                    <label key={exam.id} className="flex items-center p-2 bg-white rounded border cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            checked={formData.selectedCustomExamIds.includes(exam.id)}
                                            onChange={() => toggleExam(exam.id)}
                                            className="mr-2 h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                                        />
                                        <span className="text-sm text-gray-700 truncate">{exam.name}</span>
                                    </label>
                                ))}
                            </div>
                            {isAllExamsSelected && (
                                <p className="text-xs text-gray-500 mt-2">
                                    * Không chọn đề thi nào đồng nghĩa với việc hiển thị <strong>TẤT CẢ</strong> đề thi đang active.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="border-t pt-6">
                    <button
                        onClick={handleSave}
                        disabled={saving || totalPercentage !== 100}
                        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50"
                    >
                        {saving ? 'Đang lưu...' : 'Lưu cấu hình'}
                    </button>
                </div>
            </div>
        </div>
    );
}
