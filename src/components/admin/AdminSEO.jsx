import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminSEO = () => {
    const [seoData, setSeoData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingSection, setEditingSection] = useState(null);
    const [editForm, setEditForm] = useState({
        section: '',
        title: '',
        metaDescription: '',
        h1OrH2: '',
        seoText: ''
    });

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchSEO();
    }, []);

    const fetchSEO = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/seo`);
            setSeoData(data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching SEO:', error);
            setLoading(false);
        }
    };

    const handleEdit = (section) => {
        setEditingSection(section.section);
        setEditForm(section);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post(`${API_URL}/api/seo/update`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingSection(null);
            fetchSEO();
            alert('SEO Updated Successfully!');
        } catch (error) {
            console.error('Error updating SEO:', error);
            alert('Failed to update SEO');
        }
    };

    const initializeDefaults = async () => {
        if (!window.confirm('Initialize all sections with default SEO data?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post(`${API_URL}/api/seo/init`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSEO();
        } catch (error) {
            console.error('Error initializing SEO:', error);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading SEO Settings...</div>;

    return (
        <div className="p-4 md:p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-black text-gray-900">Dynamic SEO Settings</h2>
                    <p className="text-gray-500 font-medium">Manage Meta Tags for Home Page Sections</p>
                </div>
                <button
                    onClick={initializeDefaults}
                    className="bg-blue-50 text-blue-600 px-6 py-2 rounded-xl font-bold border border-blue-100 hover:bg-blue-600 hover:text-white transition-all"
                >
                    Initialize Sections
                </button>
            </div>

            <div className="grid gap-6">
                {seoData.map((item) => (
                    <div key={item.section} className="border border-gray-100 rounded-2xl p-6 bg-gray-50/50 hover:bg-white transition-all hover:shadow-lg">
                        {editingSection === item.section ? (
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <h3 className="text-xl font-black text-blue-600 uppercase tracking-tighter">Editing: {item.section}</h3>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Page/Tab Title</label>
                                        <input
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200"
                                            value={editForm.title}
                                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">SEO Heading (H1/H2)</label>
                                        <input
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200"
                                            value={editForm.h1OrH2}
                                            onChange={(e) => setEditForm({ ...editForm, h1OrH2: e.target.value })}
                                            placeholder="e.g. Best Veterinary Clinic in Faridabad"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Meta Description</label>
                                    <textarea
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200"
                                        rows="2"
                                        value={editForm.metaDescription}
                                        onChange={(e) => setEditForm({ ...editForm, metaDescription: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Hidden SEO Content (Keywords/Text)</label>
                                    <textarea
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 font-mono text-sm"
                                        rows="3"
                                        value={editForm.seoText}
                                        onChange={(e) => setEditForm({ ...editForm, seoText: e.target.value })}
                                        placeholder="Add keywords or hidden paragraphs for search engines..."
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold">Save Changes</button>
                                    <button type="button" onClick={() => setEditingSection(null)} className="bg-gray-200 text-gray-600 px-6 py-2 rounded-xl font-bold">Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">Section: {item.section}</span>
                                        <h3 className="text-xl font-black text-gray-900">{item.title}</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm italic">"{item.metaDescription}"</p>
                                    {item.h1OrH2 && <p className="text-xs font-bold text-blue-500">SEO Heading: {item.h1OrH2}</p>}
                                </div>
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="p-2 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all text-blue-600"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminSEO;
