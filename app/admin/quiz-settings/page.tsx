'use client';

import { useState, useEffect } from 'react';

interface QuizConfig {
    id: number;
    questionCount: number;
    basicPercentage: number;
    advancedPercentage: number;
    masteryPercentage: number;
    homepageMode: string;
}

export default function QuizSettingsPage() {
    const [config, setConfig] = useState<QuizConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        questionCount: 20,
        basicPercentage: 60,
        advancedPercentage: 30,
        masteryPercentage: 10,
        homepageMode: 'categories',
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/admin/quiz-config');
            const data = await res.json();
            setConfig(data);
            setFormData({
                questionCount: data.questionCount,
                basicPercentage: data.basicPercentage,
                advancedPercentage: data.advancedPercentage,
                masteryPercentage: data.masteryPercentage,
                homepageMode: data.homepageMode,
            });
        } catch (error) {
            console.error('Failed to fetch config:', error);
        } finally {
            setLoading(false);
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
            const res = await fetch('/api/admin/quiz-config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
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

    const totalPercentage = formData.basicPercentage + formData.advancedPercentage + formData.masteryPercentage;

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
                            onChange={(e) => setFormData({ ...formData, basicPercentage: parseInt(e.target.value) })}
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
                            onChange={(e) => setFormData({ ...formData, advancedPercentage: parseInt(e.target.value) })}
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
                            onChange={(e) => setFormData({ ...formData, masteryPercentage: parseInt(e.target.value) })}
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
                    <div className="space-y-3">
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
