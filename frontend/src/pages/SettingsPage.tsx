import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { User, Lock, LogOut, Shield } from 'lucide-react';

function SettingsPage() {
    const { user, logout } = useAuth();

    // Password change
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage(null);

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        if (newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
            return;
        }

        try {
            setPasswordLoading(true);
            await api.put('/users', {
                user: {
                    current_password: currentPassword,
                    password: newPassword,
                    password_confirmation: confirmPassword,
                },
            });
            setPasswordMessage({ type: 'success', text: 'Password updated successfully.' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            const msg = err.response?.data?.errors?.join(', ') || err.response?.data?.message || 'Failed to update password.';
            setPasswordMessage({ type: 'error', text: msg });
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="w-full px-4 lg:px-6 py-6 space-y-6 max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>

            {/* Account Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-blue-50">
                        <User className="w-5 h-5 text-blue-500" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">Account Information</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                        <div className="px-4 py-2.5 bg-gray-50 rounded-lg text-gray-700 text-sm">
                            {user?.email}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-gray-400" />
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium capitalize">
                                {(user as any)?.role || 'user'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-amber-50">
                        <Lock className="w-5 h-5 text-amber-500" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">Change Password</h2>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                        </label>
                        <input
                            id="current-password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    {passwordMessage && (
                        <div
                            className={`px-4 py-3 rounded-lg text-sm ${
                                passwordMessage.type === 'success'
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                        >
                            {passwordMessage.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={passwordLoading}
                        className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {passwordLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-red-50">
                        <LogOut className="w-5 h-5 text-red-500" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">Session</h2>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                    Sign out of your current session on this device.
                </p>
                <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                    <LogOut size={16} />
                    Sign Out
                </button>
            </div>
        </div>
    );
}

export default SettingsPage;
