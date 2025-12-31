import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/forgotpassword', {
                email,
                password: newPassword
            });
            // If success, token is returned. We can login directly or just show success.
            // data.token contains the login token.
            setMessage('Password reset successfully! Redirecting...');
            setTimeout(() => {
                navigate('/admin/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>
                <p className="text-gray-600 text-center mb-6">Enter your email and new password.</p>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">New Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02]">
                        Reset Password
                    </button>
                </form>
                <div className="mt-6 text-center text-sm">
                    <Link to="/admin/login" className="text-blue-600 hover:underline">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default AdminForgotPassword;
