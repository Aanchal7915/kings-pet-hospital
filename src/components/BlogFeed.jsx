import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BlogFeed = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/blogs');
                // Filter only Active blogs and take first 3 for home page preview
                const activeBlogs = data.data.filter(blog => blog.status === 'Active').slice(0, 3);
                setBlogs(activeBlogs);
            } catch (error) {
                console.log(error);
            }
        };
        fetchBlogs();
    }, []);

    if (blogs.length === 0) return null;

    return (
        <section id="blog" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Latest News & Updates</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Stay informed with our latest tips, stories, and hospital updates for your furry friends.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {blogs.map((blog) => (
                        <div key={blog._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col group">
                            <Link to={`/blog/${blog._id}`} className="block h-48 overflow-hidden">
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x250?text=Kings+Pet+Blog'; }}
                                />
                            </Link>
                            <div className="p-6">
                                <Link to={`/blog/${blog._id}`}>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">{blog.title}</h3>
                                </Link>
                                <p className="text-gray-600 mb-4 line-clamp-3 text-sm italic">
                                    {blog.content && blog.content.length > 20
                                        ? blog.content
                                        : `Expert insights and professional care tips for "${blog.title}". Read the full story to learn more from our medical team.`}
                                </p>
                                <Link to={`/blog/${blog._id}`} className="text-blue-600 font-bold hover:text-blue-800 inline-flex items-center text-sm tracking-tight group-hover:translate-x-1 transition-transform">
                                    Read Full Story
                                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        to="/blog"
                        className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        View More Blogs
                        <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BlogFeed;
