import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';

const AllBlogsPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchBlogs = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/blogs');
                const activeBlogs = data.data.filter(blog => blog.status === 'Active');
                setBlogs(activeBlogs);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 uppercase">
            <Header showHero={false} />

            <div className="pt-32 pb-24 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter relative z-10">The Pet Journal</h1>
                <p className="text-blue-100 text-lg max-w-2xl mx-auto px-4 normal-case">
                    Latest news, pet care tips, and updates from Kings Pet Hospital.
                </p>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20 normal-case">
                        <h3 className="text-2xl text-gray-600">No blog posts found at the moment.</h3>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <div key={blog._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col group normal-case">
                                <Link to={`/blog/${blog._id}`} className="h-56 overflow-hidden">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-500"
                                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x250?text=Kings+Pet+Blog'; }}
                                    />
                                </Link>
                                <div className="p-6 flex-grow flex flex-col">
                                    <div className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
                                        {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <Link to={`/blog/${blog._id}`}>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors uppercase">{blog.title}</h3>
                                    </Link>
                                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm italic">
                                        {blog.content && blog.content.length > 20
                                            ? blog.content
                                            : `Expert insights and professional care tips for "${blog.title}". Read the full article to learn more from our veterinary specialists.`}
                                    </p>
                                    <div className="pt-4 border-t border-gray-100">
                                        <Link to={`/blog/${blog._id}`} className="text-blue-600 font-bold hover:text-blue-800 inline-flex items-center text-sm tracking-tight">
                                            Read Full Story
                                            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default AllBlogsPage;
