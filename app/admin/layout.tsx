'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const navItems = [
        { name: 'Categories', path: '/admin/categories' },
        { name: 'Questions', path: '/admin/questions' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 min-h-screen bg-white shadow-lg">
                    <div className="p-6 border-b">
                        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
                        <p className="text-sm text-gray-600 mt-1">VivoEdu Management</p>
                    </div>

                    <nav className="p-4">
                        {navItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => router.push(item.path)}
                                className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition ${pathname === item.path
                                        ? 'bg-purple-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {item.name}
                            </button>
                        ))}

                        <div className="border-t mt-4 pt-4">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                            >
                                ← Back to Dashboard
                            </button>
                        </div>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
