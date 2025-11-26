'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ReactNode, useState, useEffect } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [userRole, setUserRole] = useState<string>('');
    const [navItems, setNavItems] = useState([
        { name: 'Categories', path: '/admin/categories' },
        { name: 'Questions', path: '/admin/questions' },
    ]);

    useEffect(() => {
        // Get user role from localStorage
        const role = localStorage.getItem('userRole') || '';
        setUserRole(role);

        // Update nav items based on role
        if (role === 's-admin') {
            setNavItems([
                { name: 'Categories', path: '/admin/categories' },
                { name: 'Questions', path: '/admin/questions' },
                { name: 'Settings', path: '/admin/settings' },
            ]);
        } else {
            setNavItems([
                { name: 'Categories', path: '/admin/categories' },
                { name: 'Questions', path: '/admin/questions' },
            ]);
        }

        // Security check: Redirect if not admin/s-admin
        if (role !== 'admin' && role !== 's-admin') {
            router.push('/dashboard');
            return;
        }

        // Security check: Redirect regular admin away from settings
        if (role === 'admin' && pathname.includes('/admin/settings')) {
            router.push('/admin/categories');
        }
    }, [pathname, router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 min-h-screen bg-white shadow-lg">
                    <div className="p-6 border-b">
                        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
                        <p className="text-sm text-gray-600 mt-1">VivoEdu Management</p>
                        <div className="mt-2 px-2 py-1 text-xs bg-gray-100 rounded inline-block">
                            Role: <span className="font-bold text-purple-600">{userRole || 'loading...'}</span>
                        </div>
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
