import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminBlog = ({ isEmbedded = false }) => {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBlog, setCurrentBlog] = useState({ title: '', content: '', image: '', altText: '', status: 'Active', metaTitle: '', metaKeywords: '', metaDescription: '' });

    const navigate = useNavigate();

    // Fetch Blogs
    const fetchBlogs = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const { data } = await axios.get(`${API_URL}/api/blogs`);
            setBlogs(data.data);
            setFilteredBlogs(data.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    // Search Logic
    useEffect(() => {
        const results = blogs.filter(blog =>
            blog.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBlogs(results);
        setCurrentPage(1);
    }, [searchTerm, blogs]);

    // Pagination Logic
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredBlogs.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(filteredBlogs.length / entriesPerPage);

    // Handle Delete
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                const token = localStorage.getItem('adminToken');
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                await axios.delete(`${API_URL}/api/blogs/${id}`, config);
                fetchBlogs();
            } catch (error) {
                console.error(error);
                alert(error.response?.data?.error || 'Failed to delete blog');
            }
        }
    };

    // Handle Submit (Create/Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            if (isEditing) {
                await axios.put(`${API_URL}/api/blogs/${currentBlog._id}`, currentBlog, config);
            } else {
                await axios.post(`${API_URL}/api/blogs`, currentBlog, config);
            }
            setShowModal(false);
            fetchBlogs();
            resetForm();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || 'Operation failed: ' + error.message);
        }
    };

    const resetForm = () => {
        setCurrentBlog({ title: '', content: '', image: '', altText: '', status: 'Active', metaTitle: '', metaKeywords: '', metaDescription: '' });
        setIsEditing(false);
    };

    const openEditModal = (blog) => {
        setCurrentBlog(blog);
        setIsEditing(true);
        setShowModal(true);
    };

    return (
        <div className={`min-h-screen ${isEmbedded ? 'bg-transparent' : 'bg-gray-100 font-sans text-gray-800'}`}>
            {!isEmbedded && (
                <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate('/admin/dashboard')}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                                    title="Back to Dashboard"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </button>
                                <h1 className="text-xl font-bold text-blue-600">Blog Management</h1>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('adminToken');
                                        navigate('/admin/login');
                                    }}
                                    className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            )}

            <div className={`max-w-7xl mx-auto ${isEmbedded ? 'p-0' : 'p-4 sm:p-6 lg:p-8'}`}>
                <div className="pl-3 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Manage Your Blogs
                        </h2>
                        <p className="text-gray-500 mt-1 italic">Create, edit, and optimize your blog posts for better reach.</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 flex items-center gap-2 group"
                    >
                        <span className="text-xl group-hover:rotate-90 transition-transform duration-300 transition-all">+</span>
                        Add New Blog Post
                    </button>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Controls Header */}
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-white">
                        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                            <span className="text-gray-500 text-sm font-medium ml-2">Show</span>
                            <select
                                value={entriesPerPage}
                                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                                className="bg-transparent font-bold text-gray-700 focus:outline-none cursor-pointer"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                            </select>
                            <span className="text-gray-500 text-sm font-medium mr-2">entries</span>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative w-full md:w-80">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                                    placeholder="Search by title..."
                                />
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-all shadow-sm" title="Print">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                </button>
                                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-all shadow-sm" title="Export CSV">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* The Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest">
                                    <th className="p-5 font-bold border-b border-gray-100">#</th>
                                    <th className="p-5 font-bold border-b border-gray-100">Preview</th>
                                    <th className="p-5 font-bold border-b border-gray-100 w-1/3">Post Details</th>
                                    <th className="p-5 font-bold border-b border-gray-100 text-center">Status</th>
                                    <th className="p-5 font-bold border-b border-gray-100 text-center">Edit</th>
                                    <th className="p-5 font-bold border-b border-gray-100 text-center">Delete</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading...</td></tr>
                                ) : currentEntries.length === 0 ? (
                                    <tr><td colSpan="6" className="p-8 text-center text-gray-500">No entries found</td></tr>
                                ) : (
                                    currentEntries.map((blog, index) => (
                                        <tr key={blog._id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="p-5 text-gray-400 font-medium">{indexOfFirstEntry + index + 1}</td>
                                            <td className="p-5 w-24">
                                                <div className="relative">
                                                    <img src={blog.image} alt="thumbnail" className="w-16 h-12 object-cover rounded-lg shadow-sm bg-gray-100" />
                                                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-lg"></div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="font-bold text-gray-900 line-clamp-1">{blog.title}</div>
                                                <div className="text-xs text-gray-500 mt-0.5 line-clamp-1 italic">{blog.metaDescription || 'No description provided'}</div>
                                            </td>
                                            <td className="p-5 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${blog.status === 'Active'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                                                    }`}>
                                                    {blog.status}
                                                </span>
                                            </td>
                                            <td className="p-5 text-center">
                                                <button
                                                    onClick={() => openEditModal(blog)}
                                                    className="w-10 h-10 flex items-center justify-center mx-auto bg-white border border-gray-200 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                                                    title="Edit Post"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                            </td>
                                            <td className="p-5 text-center">
                                                <button
                                                    onClick={() => handleDelete(blog._id)}
                                                    className="w-10 h-10 flex items-center justify-center mx-auto bg-white border border-gray-200 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-sm"
                                                    title="Delete Post"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
                        <div className="text-sm text-gray-600">
                            Showing {filteredBlogs.length > 0 ? indexOfFirstEntry + 1 : 0} to {Math.min(indexOfLastEntry, filteredBlogs.length)} of {filteredBlogs.length} entries
                        </div>
                        <div className="flex gap-1">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                            >
                                «
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-teal-500 text-white border-teal-500' : 'hover:bg-gray-100'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                            >
                                »
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Add/Edit */}
            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-auto overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-6 flex justify-between items-center text-white">
                            <div>
                                <h3 className="text-2xl font-bold">{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}</h3>
                                <p className="text-blue-100 text-sm opacity-90">Fill in the details below to publish your blog</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="ml-4 bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 flex items-center justify-center transition-all text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                                {/* Left Side: Content */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Blog Title</label>
                                        <input
                                            type="text"
                                            value={currentBlog.title}
                                            onChange={(e) => setCurrentBlog({ ...currentBlog, title: e.target.value })}
                                            className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all border shadow-sm"
                                            placeholder="Enter a catchy title..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Image URL</label>
                                        <input
                                            type="text"
                                            value={currentBlog.image}
                                            onChange={(e) => setCurrentBlog({ ...currentBlog, image: e.target.value })}
                                            className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all border shadow-sm"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Image Alt Text (Naming)</label>
                                        <input
                                            type="text"
                                            value={currentBlog.altText}
                                            onChange={(e) => setCurrentBlog({ ...currentBlog, altText: e.target.value })}
                                            className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all border shadow-sm"
                                            placeholder="Elegant dog portrait"
                                        />
                                        {currentBlog.image && (
                                            <div className="mt-2 p-1.5 bg-gray-50 border rounded-lg">
                                                <img
                                                    src={currentBlog.image}
                                                    alt={currentBlog.altText || "Preview"}
                                                    className="w-full h-24 object-cover rounded shadow-inner"
                                                    onError={(e) => e.target.style.display = 'none'}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Blog Content</label>
                                        <textarea
                                            value={currentBlog.content}
                                            onChange={(e) => setCurrentBlog({ ...currentBlog, content: e.target.value })}
                                            className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all border shadow-sm h-32 resize-none"
                                            placeholder="Write your blog content here..."
                                            required
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Right Side: Settings & SEO */}
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <h4 className="text-xs font-bold text-gray-800 mb-3 flex items-center gap-2">
                                            <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
                                            Publish Settings
                                        </h4>
                                        <div>
                                            <label className="block text-[10px] font-semibold text-gray-600 mb-1">Status</label>
                                            <select
                                                value={currentBlog.status}
                                                onChange={(e) => setCurrentBlog({ ...currentBlog, status: e.target.value })}
                                                className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all border bg-white shadow-sm"
                                            >
                                                <option value="Active">Active (Visible)</option>
                                                <option value="Inactive">Inactive (Hidden)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 shadow-sm">
                                        <h4 className="text-xs font-bold text-gray-800 mb-3 flex items-center gap-2">
                                            <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
                                            SEO Optimization
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-[10px] font-semibold text-gray-600 mb-1">Meta Title</label>
                                                <input
                                                    type="text"
                                                    value={currentBlog.metaTitle}
                                                    onChange={(e) => setCurrentBlog({ ...currentBlog, metaTitle: e.target.value })}
                                                    className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all border bg-white shadow-sm"
                                                    placeholder="Enter meta title for SEO..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-gray-600 mb-1">Meta Keywords</label>
                                                <input
                                                    type="text"
                                                    value={currentBlog.metaKeywords}
                                                    onChange={(e) => setCurrentBlog({ ...currentBlog, metaKeywords: e.target.value })}
                                                    className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all border bg-white shadow-sm"
                                                    placeholder="pets, dogs, health"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-gray-600 mb-1">Meta Description</label>
                                                <textarea
                                                    value={currentBlog.metaDescription}
                                                    onChange={(e) => setCurrentBlog({ ...currentBlog, metaDescription: e.target.value })}
                                                    className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all border bg-white shadow-sm h-24 resize-none"
                                                    placeholder="Enter brief summary..."
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 font-bold text-sm transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-sm shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5"
                                >
                                    {isEditing ? 'Update Post' : 'Publish Blog Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBlog;
