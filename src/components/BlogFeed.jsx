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
        <section id="blog" className="py-24 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-16 space-y-4">
                    <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">Our Journal</span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                        Latest News & Updates
                    </h2>
                    <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Stay informed with our latest tips, stories, and hospital updates for your furry friends.
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
                    {blogs.map((blog) => (
                        <article 
                            key={blog._id} 
                            className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden flex flex-col"
                        >
                            {/* Image Container */}
                            <Link to={`/blog/${blog._id}`} className="relative block h-64 overflow-hidden">
                                <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent z-10 transition-colors duration-500"></div>
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=1000&auto=format&fit=crop'; }}
                                />
                                <div className="absolute top-4 left-4 z-20">
                                    <span className="bg-white/90 backdrop-blur-md text-blue-600 px-3 py-1 rounded-lg text-xs font-bold uppercase shadow-sm">
                                        Pet Health
                                    </span>
                                </div>
                            </Link>

                            {/* Content Container */}
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex items-center text-gray-400 text-xs mb-4 space-x-2">
                                    <span>Kings Pet Hospital</span>
                                    <span>•</span>
                                    <span>Latest Update</span>
                                </div>

                                <Link to={`/blog/${blog._id}`}>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                                        {blog.title}
                                    </h3>
                                </Link>

                                <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">
                                    {blog.content && blog.content.length > 20
                                        ? blog.content.replace(/<[^>]*>?/gm, '') // Strips HTML tags if any
                                        : `Expert insights and professional care tips for "${blog.title}". Read the full story to learn more from our medical team.`}
                                </p>

                                <div className="mt-auto pt-6 border-t border-gray-50">
                                    <Link 
                                        to={`/blog/${blog._id}`} 
                                        className="text-blue-600 font-extrabold flex items-center text-sm group/btn"
                                    >
                                        READ ARTICLE
                                        <svg className="w-5 h-5 ml-2 transform group-hover/btn:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Footer Action */}
                <div className="text-center">
                    <Link
                        to="/blog"
                        className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white transition-all duration-300 bg-blue-600 rounded-full hover:bg-blue-700 shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.4)] transform hover:-translate-y-1"
                    >
                        <span>Explore All Articles</span>
                        <svg className="w-6 h-6 ml-2 transform group-hover:rotate-45 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BlogFeed;






















// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';

// const BlogFeed = () => {
//     const [blogs, setBlogs] = useState([]);

//     useEffect(() => {
//         const fetchBlogs = async () => {
//             try {
//                 const { data } = await axios.get('http://localhost:5000/api/blogs');
//                 // Filter only Active blogs and take first 3 for home page preview
//                 const activeBlogs = data.data.filter(blog => blog.status === 'Active').slice(0, 3);
//                 setBlogs(activeBlogs);
//             } catch (error) {
//                 console.log(error);
//             }
//         };
//         fetchBlogs();
//     }, []);

//     if (blogs.length === 0) return null;

//     return (
//         <section id="blog" className="py-20 bg-white">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="text-center mb-16">
//                     <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Latest News & Updates</h2>
//                     <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//                         Stay informed with our latest tips, stories, and hospital updates for your furry friends.
//                     </p>
//                 </div>

//                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
//                     {blogs.map((blog) => (
//                         <div key={blog._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col group">
//                             <Link to={`/blog/${blog._id}`} className="block h-48 overflow-hidden">
//                                 <img
//                                     src={blog.image}
//                                     alt={blog.title}
//                                     className="w-full h-full object-cover"
//                                     onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x250?text=Kings+Pet+Blog'; }}
//                                 />
//                             </Link>
//                             <div className="p-6">
//                                 <Link to={`/blog/${blog._id}`}>
//                                     <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">{blog.title}</h3>
//                                 </Link>
//                                 <p className="text-gray-600 mb-4 line-clamp-3 text-sm italic">
//                                     {blog.content && blog.content.length > 20
//                                         ? blog.content
//                                         : `Expert insights and professional care tips for "${blog.title}". Read the full story to learn more from our medical team.`}
//                                 </p>
//                                 <Link to={`/blog/${blog._id}`} className="text-blue-600 font-bold hover:text-blue-800 inline-flex items-center text-sm tracking-tight group-hover:translate-x-1 transition-transform">
//                                     Read Full Story
//                                     <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                                     </svg>
//                                 </Link>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="text-center">
//                     <Link
//                         to="/blog"
//                         className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
//                     >
//                         View More Blogs
//                         <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//                         </svg>
//                     </Link>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default BlogFeed;
