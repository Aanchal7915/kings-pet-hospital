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
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const { data } = await axios.get(`${API_URL}/api/blogs`);
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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header showHero={false} />

            {/* Modern Hero Section */}
            <div className="pt-40 pb-24 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white text-center relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                
                <div className="relative z-10 px-4">
                    <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-[0.2em] uppercase bg-blue-500/30 backdrop-blur-md border border-blue-400/30 rounded-full">
                        Kings Pet Journal
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic">
                        The Pet <span className="text-blue-400">Journal</span>
                    </h1>
                    <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                        Expert insights, professional pet care tips, and the latest heart-warming stories from our hospital.
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-grow">
                {loading ? (
                    /* Enhanced Loading State */
                    <div className="flex flex-col justify-center items-center h-80 space-y-4">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin"></div>
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest animate-pulse">Fetching Stories...</p>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="mb-6 inline-block p-6 bg-gray-100 rounded-full">
                            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 4v4h4" />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800">No Articles Yet</h3>
                        <p className="text-gray-500 mt-2">Check back soon for new pet care updates.</p>
                    </div>
                ) : (
                    /* Modernized Grid */
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {blogs.map((blog) => (
                            <article 
                                key={blog._id} 
                                className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 border border-gray-100 flex flex-col overflow-hidden"
                            >
                                {/* Featured Image with Glass Date Badge */}
                                <Link to={`/blog/${blog._id}`} className="relative h-64 overflow-hidden block">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?q=80&w=1000&auto=format&fit=crop'; }}
                                    />
                                    <div className="absolute bottom-4 left-6 z-10">
                                        <div className="px-4 py-2 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm">
                                            <p className="text-blue-600 text-[10px] font-black uppercase tracking-tighter">
                                                {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </Link>

                                {/* Post Body */}
                                <div className="p-8 flex-grow flex flex-col">
                                    <Link to={`/blog/${blog._id}`}>
                                        <h3 className="text-2xl font-black text-gray-900 mb-4 hover:text-blue-600 transition-colors uppercase leading-tight">
                                            {blog.title}
                                        </h3>
                                    </Link>
                                    
                                    <p className="text-gray-500 mb-8 line-clamp-3 text-sm leading-relaxed italic">
                                        {blog.content && blog.content.length > 20
                                            ? blog.content.replace(/<[^>]*>?/gm, '')
                                            : `Professional medical insights and specific pet care recommendations for "${blog.title}". Read the full journal entry.`}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-gray-50 flex justify-between items-center">
                                        <Link 
                                            to={`/blog/${blog._id}`} 
                                            className="text-blue-600 font-black flex items-center text-xs tracking-[0.15em] uppercase group/btn"
                                        >
                                            View Full Story
                                            <svg className="w-5 h-5 ml-2 transform group-hover/btn:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default AllBlogsPage;













// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Header from './Header';
// import Footer from './Footer';
// import { Link } from 'react-router-dom';

// const AllBlogsPage = () => {
//     const [blogs, setBlogs] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         window.scrollTo(0, 0);
//         const fetchBlogs = async () => {
//             try {
//                 const { data } = await axios.get('http://localhost:5000/api/blogs');
//                 const activeBlogs = data.data.filter(blog => blog.status === 'Active');
//                 setBlogs(activeBlogs);
//                 setLoading(false);
//             } catch (error) {
//                 console.log(error);
//                 setLoading(false);
//             }
//         };
//         fetchBlogs();
//     }, []);

//     return (
//         <div className="min-h-screen bg-gray-50 uppercase">
//             <Header showHero={false} />

//             <div className="pt-32 pb-24 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white text-center relative overflow-hidden">
//                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
//                 <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter relative z-10">The Pet Journal</h1>
//                 <p className="text-blue-100 text-lg max-w-2xl mx-auto px-4 normal-case">
//                     Latest news, pet care tips, and updates from Kings Pet Hospital.
//                 </p>
//             </div>

//             <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//                 {loading ? (
//                     <div className="flex justify-center items-center h-64">
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//                     </div>
//                 ) : blogs.length === 0 ? (
//                     <div className="text-center py-20 normal-case">
//                         <h3 className="text-2xl text-gray-600">No blog posts found at the moment.</h3>
//                     </div>
//                 ) : (
//                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//                         {blogs.map((blog) => (
//                             <div key={blog._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col group normal-case">
//                                 <Link to={`/blog/${blog._id}`} className="h-56 overflow-hidden">
//                                     <img
//                                         src={blog.image}
//                                         alt={blog.title}
//                                         className="w-full h-full object-cover transition-transform duration-500"
//                                         onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x250?text=Kings+Pet+Blog'; }}
//                                     />
//                                 </Link>
//                                 <div className="p-6 flex-grow flex flex-col">
//                                     <div className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
//                                         {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
//                                     </div>
//                                     <Link to={`/blog/${blog._id}`}>
//                                         <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors uppercase">{blog.title}</h3>
//                                     </Link>
//                                     <p className="text-gray-600 mb-4 line-clamp-3 text-sm italic">
//                                         {blog.content && blog.content.length > 20
//                                             ? blog.content
//                                             : `Expert insights and professional care tips for "${blog.title}". Read the full article to learn more from our veterinary specialists.`}
//                                     </p>
//                                     <div className="pt-4 border-t border-gray-100">
//                                         <Link to={`/blog/${blog._id}`} className="text-blue-600 font-bold hover:text-blue-800 inline-flex items-center text-sm tracking-tight">
//                                             Read Full Story
//                                             <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                                             </svg>
//                                         </Link>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </main>

//             <Footer />
//         </div>
//     );
// };

// export default AllBlogsPage;
