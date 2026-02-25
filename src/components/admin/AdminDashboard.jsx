import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminBlog from './AdminBlog';
import AdminSEO from './AdminSEO';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('blogs');

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Nav Bar */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/logo.jpg"
                                    alt="Kings Pet Hospital logo"
                                    className="h-9 w-auto rounded-sm bg-white p-1 shadow-sm border border-gray-100"
                                />
                                <h1 className="text-xl font-black text-gray-900 tracking-tight">
                                    Kings Pet <span className="text-blue-600">Admin</span>
                                </h1>
                            </div>

                            {/* Navigation Tabs */}
                            <div className="hidden md:flex items-center gap-2">
                                <button
                                    onClick={() => setActiveTab('blogs')}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'blogs' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    Blogs
                                </button>
                                <button
                                    onClick={() => setActiveTab('seo')}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'seo' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    Page SEO
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLogout}
                                className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all border border-red-100 shadow-sm flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main>
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    {/* Mobile Navigation */}
                    <div className="flex md:hidden items-center gap-2 mb-4 bg-white p-2 rounded-2xl shadow-sm">
                        <button
                            onClick={() => setActiveTab('blogs')}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'blogs' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
                        >
                            Blogs
                        </button>
                        <button
                            onClick={() => setActiveTab('seo')}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'seo' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
                        >
                            SEO
                        </button>
                    </div>

                    {activeTab === 'blogs' ? (
                        <AdminBlog isEmbedded={true} />
                    ) : (
                        <AdminSEO />
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
