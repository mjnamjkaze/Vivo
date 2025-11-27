'use client';

import { useState } from 'react';
// import * as XLSX from 'xlsx'; // Removed dependency, using simple text parsing 
// Let's stick to simple JSON/CSV parsing or text area for simplicity if no library.
// Actually, I'll implement a simple text area parser for JSON/CSV to avoid dependencies if possible, 
// or just ask user to paste JSON.
// Better: Text area for "Email/Phone" list (one per line) or JSON.

export default function UsersPage() {
    const [importData, setImportData] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [errors, setErrors] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            if (!text) return;

            // Simple CSV parsing
            const lines = text.split(/\r?\n/);
            // Try to detect headers
            const firstLine = lines[0].toLowerCase();
            const headers = firstLine.split(',').map(h => h.trim());

            const hasHeaders = headers.some(h => ['email', 'phone', 'sđt', 'mail', 'username', 'tên'].includes(h));

            let parsedUsers = [];

            if (hasHeaders) {
                // Map columns
                const emailIdx = headers.findIndex(h => h.includes('email') || h.includes('mail'));
                const phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('sđt') || h.includes('mobile'));
                const usernameIdx = headers.findIndex(h => h.includes('username') || h.includes('user') || h.includes('tên'));

                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;

                    // Handle CSV with quotes properly? For now simple split
                    const cols = line.split(',').map(c => c.trim());
                    const user: any = {};

                    if (emailIdx >= 0 && cols[emailIdx]) user.email = cols[emailIdx];
                    if (phoneIdx >= 0 && cols[phoneIdx]) user.phone = cols[phoneIdx];
                    if (usernameIdx >= 0 && cols[usernameIdx]) user.username = cols[usernameIdx];

                    // Fallback: if no specific columns found but has headers, maybe the headers were just "Value"
                    // But if we found headers, we expect indices.

                    if (Object.keys(user).length > 0) {
                        parsedUsers.push(user);
                    }
                }
            } else {
                // Assume first column is identifier (email or phone)
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed) continue;
                    const cols = trimmed.split(',').map(c => c.trim());
                    if (cols[0]) {
                        if (cols[0].includes('@')) {
                            parsedUsers.push({ email: cols[0] });
                        } else {
                            // Assume phone if numbers
                            parsedUsers.push({ phone: cols[0] });
                        }
                    }
                }
            }

            setImportData(JSON.stringify(parsedUsers, null, 2));
        };
        reader.readAsText(file);
    };

    const handleImport = async () => {
        if (!importData.trim()) return;

        setLoading(true);
        setResults([]);
        setErrors([]);

        // Parse input: try JSON first, then assume line-separated email/phone
        let users = [];
        try {
            users = JSON.parse(importData);
            if (!Array.isArray(users)) throw new Error('Not an array');
        } catch (e) {
            // Parse as lines
            users = importData.split('\n')
                .map(line => line.trim())
                .filter(line => line)
                .map(line => {
                    // Simple check if it looks like email or phone
                    if (line.includes('@')) return { email: line };
                    return { phone: line };
                });
        }

        try {
            const res = await fetch('/api/admin/users/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ users }),
            });

            const data = await res.json();
            if (res.ok) {
                setResults(data.imported);
                setErrors(data.errors);
                if (data.imported.length > 0) {
                    alert(`Imported ${data.imported.length} users successfully!`);
                }
            } else {
                alert(data.error || 'Import failed');
            }
        } catch (error) {
            alert('Error during import');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>

            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Import Users</h2>
                <p className="text-gray-600 mb-4 text-sm">
                    Enter a list of emails or phone numbers (one per line), or a JSON array of user objects.
                    Passwords will be auto-generated.
                </p>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload CSV File
                    </label>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Supported columns: email, phone (or sđt). If no headers, first column is used as identifier.
                    </p>
                </div>

                <div className="mb-2 text-sm font-medium text-gray-700">Or paste text/JSON:</div>
                <textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    className="w-full h-48 p-4 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-purple-500 outline-none mb-4"
                    placeholder={`user1@example.com\n0912345678\nuser2@example.com`}
                />

                <button
                    onClick={handleImport}
                    disabled={loading || !importData.trim()}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                >
                    {loading ? 'Importing...' : 'Import Users'}
                </button>
            </div>

            {/* Results */}
            {(results.length > 0 || errors.length > 0) && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Import Results</h2>

                    {results.length > 0 && (
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-green-600 font-medium">Success ({results.length})</h3>
                                <button
                                    onClick={() => copyToClipboard(JSON.stringify(results, null, 2))}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Copy JSON
                                </button>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="py-2">Username</th>
                                            <th className="py-2">Email/Phone</th>
                                            <th className="py-2">Password</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.map((user, idx) => (
                                            <tr key={idx} className="border-b last:border-0">
                                                <td className="py-2 font-medium">{user.username}</td>
                                                <td className="py-2">{user.email || user.phone}</td>
                                                <td className="py-2 font-mono text-blue-600">{user.password}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {errors.length > 0 && (
                        <div>
                            <h3 className="text-red-600 font-medium mb-2">Errors ({errors.length})</h3>
                            <div className="bg-red-50 rounded-lg p-4 text-sm text-red-700 space-y-1">
                                {errors.map((err, idx) => (
                                    <div key={idx}>
                                        <span className="font-semibold">{err.user.email || err.user.phone || JSON.stringify(err.user)}:</span> {err.error}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
