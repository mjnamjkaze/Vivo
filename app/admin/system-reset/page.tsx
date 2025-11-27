'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SystemResetPage() {
    const [loading, setLoading] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const router = useRouter();

    const handleReset = async () => {
        if (confirmText !== 'RESET') {
            alert('Vui lòng nhập "RESET" để xác nhận!');
            return;
        }

        if (!confirm('⚠️ BẠN CHẮC CHẮN MUỐN XÓA TẤT CẢ DỮ LIỆU?\n\nHành động này sẽ xóa:\n- Tất cả categories\n- Tất cả questions\n- Tất cả quiz sessions\n- Tất cả custom exams\n- Quiz configuration\n\nCHỈ GIỮ LẠI: Danh sách users\n\nKhông thể hoàn tác!')) {
            return;
        }

        setLoading(true);
        try {
            const userId = localStorage.getItem('userId');
            const res = await fetch('/api/admin/system-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: parseInt(userId!) }),
            });

            const data = await res.json();

            if (res.ok) {
                alert('✅ ' + data.message);
                setConfirmText('');
                router.push('/admin/settings');
            } else {
                alert('❌ ' + (data.error || 'Failed to reset system'));
            }
        } catch (error) {
            alert('❌ An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">🔴 System Reset</h1>

            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-4xl">⚠️</span>
                        <h2 className="text-2xl font-bold text-red-700">CẢNH BÁO NGUY HIỂM</h2>
                    </div>
                    <p className="text-red-700 font-medium mb-4">
                        Chức năng này sẽ XÓA VĨNH VIỄN tất cả dữ liệu hệ thống!
                    </p>
                </div>

                <div className="bg-white rounded-lg p-6 mb-6">
                    <h3 className="font-bold text-gray-800 mb-3">Sẽ bị xóa:</h3>
                    <ul className="space-y-2 text-gray-700">
                        <li>❌ Tất cả Categories (Danh mục)</li>
                        <li>❌ Tất cả Questions (Câu hỏi)</li>
                        <li>❌ Tất cả Quiz Sessions (Lượt thi)</li>
                        <li>❌ Tất cả Answers (Câu trả lời)</li>
                        <li>❌ Tất cả Custom Exams (Đề thi tùy chỉnh)</li>
                        <li>❌ Quiz Configuration (Cấu hình)</li>
                    </ul>

                    <h3 className="font-bold text-green-700 mt-4 mb-3">Sẽ được giữ lại:</h3>
                    <ul className="space-y-2 text-green-700">
                        <li>✅ Tất cả Users (Người dùng)</li>
                    </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800 font-medium">
                        💡 <strong>Lưu ý:</strong> Sau khi reset, bạn cần chạy lại seed để có dữ liệu mẫu:
                    </p>
                    <code className="block mt-2 bg-gray-800 text-green-400 p-2 rounded">
                        npx prisma db seed
                    </code>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nhập <strong className="text-red-600">"RESET"</strong> để xác nhận:
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="Nhập RESET"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-lg font-mono"
                        />
                    </div>

                    <button
                        onClick={handleReset}
                        disabled={loading || confirmText !== 'RESET'}
                        className="w-full px-6 py-4 bg-red-600 text-white rounded-lg font-bold text-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? '🔄 Đang xóa dữ liệu...' : '🗑️ XÓA TẤT CẢ DỮ LIỆU'}
                    </button>

                    <button
                        onClick={() => router.push('/admin/settings')}
                        className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                        ← Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
}
