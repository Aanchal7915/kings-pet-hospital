import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminBlog from './AdminBlog';
import AdminSEO from './AdminSEO';
import AdminBookings from './AdminBookings';
import AdminAnalytics from './AdminAnalytics';
import AdminCategories from './AdminCategories';
import AdminSubCategories from './AdminSubCategories';
import AdminCatalogOverview from './AdminCatalogOverview';
import AdminServicesCatalog from './AdminServicesCatalog';
import AdminPagesCMS from './AdminPagesCMS';
import AdminPetFoods from './AdminPetFoods';
import AdminPetListings from './AdminPetListings';
import AdminPetOrders from './AdminPetOrders';

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
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <img
                                    src="/logo.jpg"
                                    alt="Kings Pet Hospital logo"
                                    className="h-8 w-auto rounded-sm bg-white p-1 shadow-sm border border-gray-100"
                                />
                                <h1 className="text-sm font-black text-gray-900 tracking-tight whitespace-nowrap">
                                    Kings Pet <span className="text-blue-600">Admin</span>
                                </h1>
                            </div>

                            {/* Navigation Tabs */}
                            <div className="hidden md:flex items-center gap-1">
                                <button
                                    onClick={() => setActiveTab('blogs')}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'blogs' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    Blogs
                                </button>
                                <button
                                    onClick={() => setActiveTab('seo')}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'seo' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    Page SEO
                                </button>
                                <button
                                    onClick={() => setActiveTab('bookings')}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'bookings' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    Bookings
                                </button>
                                <button
                                    onClick={() => setActiveTab('analytics')}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    Analytics
                                </button>
                                <button
                                    onClick={() => setActiveTab('categories')}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'categories' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    Categories
                                </button>
                                <button
                                    onClick={() => setActiveTab('subCategories')}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'subCategories' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    Subcategories
                                </button>
                                <button
                                    onClick={() => setActiveTab('servicesCatalog')}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'servicesCatalog' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    Services
                                </button>
                                <button
                                    onClick={() => setActiveTab('pages')}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'pages' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    Pages
                                </button>
                                <button
                                    onClick={() => setActiveTab('petFoods')}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'petFoods' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    Pet Foods
                                </button>
                                <button
                                    onClick={() => setActiveTab('petListings')}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'petListings' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    Pets For Sale
                                </button>
                                <button
                                    onClick={() => setActiveTab('petOrders')}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'petOrders' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    Pet Orders
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLogout}
                                className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border border-red-100 shadow-sm flex items-center gap-1.5"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    <AdminCatalogOverview />

                    {/* Mobile Navigation - horizontal scroll */}
                    <div className="md:hidden mb-4 bg-white p-2 rounded-2xl shadow-sm overflow-x-auto">
                        <div className="flex items-center gap-1.5 w-max">
                            {[
                                { key: 'blogs', label: 'Blogs' },
                                { key: 'seo', label: 'SEO' },
                                { key: 'bookings', label: 'Bookings' },
                                { key: 'analytics', label: 'Analytics' },
                                { key: 'categories', label: 'Categories' },
                                { key: 'subCategories', label: 'Subcategories' },
                                { key: 'servicesCatalog', label: 'Services' },
                                { key: 'pages', label: 'Pages' },
                                { key: 'petFoods', label: 'Pet Foods' },
                                { key: 'petListings', label: 'Pets For Sale' },
                                { key: 'petOrders', label: 'Pet Orders' },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'text-gray-500 bg-gray-50'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeTab === 'blogs' && <AdminBlog isEmbedded={true} />}
                    {activeTab === 'seo' && <AdminSEO />}
                    {activeTab === 'bookings' && <AdminBookings />}
                    {activeTab === 'analytics' && <AdminAnalytics />}
                    {activeTab === 'categories' && <AdminCategories />}
                    {activeTab === 'subCategories' && <AdminSubCategories />}
                    {activeTab === 'servicesCatalog' && <AdminServicesCatalog />}
                    {activeTab === 'pages' && <AdminPagesCMS />}
                    {activeTab === 'petFoods' && <AdminPetFoods />}
                    {activeTab === 'petListings' && <AdminPetListings />}
                    {activeTab === 'petOrders' && <AdminPetOrders />}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
