'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface StatisticsData {
    summary: {
        totalSessions: number;
        averageScore: number;
        uniqueIPs: number;
    };
    scoreDistribution: Array<{ range: string; count: number }>;
    categoryStats: Array<{ name: string; count: number; averageScore: number }>;
    timeSeriesData: Array<{ date: string; count: number }>;
    sessions: Array<{
        id: number;
        username: string;
        ipAddress: string | null;
        categoryId: number | null;
        score: number | null;
        totalQuestions: number;
        percentage: number;
        startTime: string;
        duration: number | null;
    }>;
}

interface Category {
    id: number;
    name: string;
}

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function StatisticsPage() {
    const [data, setData] = useState<StatisticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetchCategories();
        fetchStatistics();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchStatistics = async () => {
        try {
            let url = '/api/admin/statistics?';
            if (startDate) url += `startDate=${startDate}&`;
            if (endDate) url += `endDate=${endDate}&`;
            if (categoryFilter) url += `categoryId=${categoryFilter}`;

            const res = await fetch(url);
            const statsData = await res.json();
            setData(statsData);
        } catch (error) {
            console.error('Failed to fetch statistics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = () => {
        setLoading(true);
        fetchStatistics();
    };

    if (loading) {
        return <div className="text-center py-8">Đang tải thống kê...</div>;
    }

    if (!data) {
        return <div className="text-center py-8">Không có dữ liệu</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Thống Kê</h1>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Từ ngày</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Đến ngày</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Danh mục</label>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                            <option value="">Tất cả danh mục</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={handleFilter}
                            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                            Lọc
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="text-sm opacity-90">Tổng lượt thi</div>
                    <div className="text-4xl font-bold mt-2">{data.summary.totalSessions}</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="text-sm opacity-90">Điểm trung bình</div>
                    <div className="text-4xl font-bold mt-2">{data.summary.averageScore.toFixed(1)}</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="text-sm opacity-90">IP duy nhất</div>
                    <div className="text-4xl font-bold mt-2">{data.summary.uniqueIPs}</div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Score Distribution */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Phân bố điểm</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.scoreDistribution}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="range" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8b5cf6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Stats */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Lượt thi theo danh mục</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data.categoryStats}
                                dataKey="count"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {data.categoryStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 gap-6">
                {/* Time Series */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Lượt thi theo thời gian</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.timeSeriesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Average Score by Category */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Điểm trung bình theo danh mục</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.categoryStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="averageScore" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Sessions Table */}
            <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-4">Chi tiết lượt thi</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4">Người dùng</th>
                                <th className="text-left py-3 px-4">IP</th>
                                <th className="text-left py-3 px-4">Điểm</th>
                                <th className="text-left py-3 px-4">%</th>
                                <th className="text-left py-3 px-4">Thời gian</th>
                                <th className="text-left py-3 px-4">Thời lượng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.sessions.map((session) => (
                                <tr key={session.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">{session.username}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{session.ipAddress || 'N/A'}</td>
                                    <td className="py-3 px-4 font-semibold">
                                        {session.score}/{session.totalQuestions}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded text-sm ${session.percentage >= 80 ? 'bg-green-100 text-green-700' :
                                            session.percentage >= 60 ? 'bg-blue-100 text-blue-700' :
                                                session.percentage >= 40 ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {session.percentage}%
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">
                                        {format(new Date(session.startTime), 'dd/MM/yyyy HH:mm')}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">
                                        {session.duration ? `${Math.floor(session.duration / 60)}:${(session.duration % 60).toString().padStart(2, '0')}` : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
