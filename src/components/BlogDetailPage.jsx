import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import Header from './Header';
import Footer from './Footer';

const BlogDetailPage = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [otherBlogs, setOtherBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchBlogData = async () => {
            try {
                const [blogRes, allBlogsRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/blogs/${id}`),
                    axios.get('http://localhost:5000/api/blogs')
                ]);

                setBlog(blogRes.data.data);
                const filtered = allBlogsRes.data.data
                    .filter(b => b._id !== id)
                    .slice(0, 3);
                setOtherBlogs(filtered);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load blog post');
                setLoading(false);
            }
        };

        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = totalScroll / windowHeight;
            setScrollProgress(scroll);
        };

        fetchBlogData();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header showHero={false} />
                <div className="flex-grow flex flex-col justify-center items-center">
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <img src="/logo.jpg" alt="Loading" className="w-10 h-10 rounded-full shadow-sm" />
                        </div>
                    </div>
                    <p className="mt-6 text-gray-400 font-bold tracking-[0.3em] uppercase text-xs animate-pulse">Loading Journal</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header showHero={false} />
                <div className="flex-grow flex flex-col items-center justify-center py-20 px-4">
                    <div className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-md w-full text-center border border-gray-100">
                        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight uppercase">Lost in the Archives?</h2>
                        <p className="text-gray-500 mb-10 leading-relaxed">The article you are searching for is unavailable. It might have been updated or moved.</p>
                        <Link to="/blog" className="inline-flex items-center justify-center w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
                            Back to All Blogs
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white selection:bg-blue-600 selection:text-white">
            <Helmet>
                <title>{blog.title} | Kings Pet Hospital</title>
                <meta name="description" content={blog.metaDescription || blog.content.substring(0, 160)} />
            </Helmet>

            <Header showHero={false} />

            {/* Premium Glowing Progress Bar */}
            <div className="fixed top-[72px] left-0 w-full h-1 z-[60] bg-gray-50">
                <div
                    className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 transition-all duration-150 origin-left shadow-[0_0_15px_rgba(37,99,235,0.6)]"
                    style={{ transform: `scaleX(${scrollProgress})` }}
                ></div>
            </div>

            <article className="pt-2">
                {/* Modern Editorial Header */}
                <header className="relative pt-20 pb-32 overflow-hidden bg-gray-50/50">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
                        <div className="absolute top-10 left-0 w-72 h-72 bg-blue-400/10 rounded-full blur-[100px]"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-[120px]"></div>
                    </div>

                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                        <Link
                            to="/blog"
                            className="inline-flex items-center gap-2 px-6 py-2 mb-5 bg-white border border-gray-100 text-blue-600 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:shadow-md transition-all group"
                        >
                            <svg className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Journal
                        </Link>

                        <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-[1.1] tracking-tight uppercase italic mb-5">
                            {blog.title}
                        </h1>

                        <div className="flex flex-wrap items-center justify-center gap-6">
                            <div className="flex items-center gap-3 px-5 py-2.5 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-gray-900 font-bold text-xs uppercase tracking-widest">
                                    {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-3 px-5 py-2.5 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-gray-900 font-bold text-xs uppercase tracking-widest">Verified Advice</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Overlapping Cover Image */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 mb-24 relative z-20">
                    <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border-[12px] border-white group">
                        <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=2000'; }}
                        />
                    </div>
                </div>

                {/* Content Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">

                        {/* Social Share Column (Left Sticky) */}
                        <div className="hidden lg:block lg:col-span-1">
                            <div className="sticky top-40 flex flex-col items-center gap-6">
                                <span className="text-[9px] font-black text-gray-300 uppercase [writing-mode:vertical-lr] rotate-180 tracking-[0.3em]">Share This Post</span>
                                <div className="w-px h-12 bg-gray-100"></div>
                                <button className="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-gray-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:-translate-y-1">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.14h-3v4h3v12h5v-12h3.85l.42-4z" /></svg>
                                </button>
                                <button className="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-gray-400 flex items-center justify-center hover:bg-sky-400 hover:text-white transition-all shadow-sm hover:-translate-y-1">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.44 4.83a9.45 9.45 0 0 1-2.67.73 4.63 4.63 0 0 0 2.05-2.57 9.28 9.28 0 0 1-2.93 1.12 4.62 4.62 0 1 0-7.88 4.21A13.12 13.12 0 0 1 1.64 3.16a4.63 4.63 0 0 0 1.43 6.17 4.61 4.61 0 0 1-2.1-.58v.06a4.62 4.62 0 0 0 3.71 4.53 4.6 4.6 0 0 1-2.09.08 4.62 4.62 0 0 0 4.32 3.21 9.28 9.28 0 0 1-5.74 1.98c-.37 0-.74-.02-1.1-.06a13.08 13.08 0 0 0 7.08 2.08c8.5 0 13.14-7.04 13.14-13.14 0-.2 0-.4-.01-.6a9.42 9.42 0 0 0 2.32-2.41z" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Article Main Body */}
                        <div className="lg:col-span-7">
                            <div className="prose prose-2xl prose-blue max-w-none">
                                <div className="text-gray-800 leading-[1.8] text-xl md:text-2xl whitespace-pre-wrap font-serif tracking-normal">
                                    {blog.content}
                                </div>
                            </div>

                            {/* Author Branding Box */}
                            <div className="mt-24 p-10 bg-gray-50 rounded-[3rem] border border-gray-100 relative overflow-hidden group">
                                <img src="/logo.jpg" alt="Watermark" className="absolute -right-10 -bottom-10 w-64 h-64 opacity-[0.03] grayscale transition-transform duration-1000 group-hover:rotate-12" />
                                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                                    <img src="/logo.jpg" alt="Kings Pet Hospital" className="w-24 h-24 rounded-3xl bg-white p-2 shadow-xl border border-gray-100" />
                                    <div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <h4 className="text-2xl font-black text-gray-900 uppercase italic">Kings Pet Hospital</h4>
                                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        </div>
                                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                            This article was reviewed and approved by our board-certified veterinary medical team. We are dedicated to providing life-long wellness for your pets.
                                        </p>
                                        <Link to="/contact" className="inline-flex items-center text-blue-600 font-black text-xs uppercase tracking-widest group/link">
                                            Schedule a consultation
                                            <svg className="ml-2 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar (Right Sticky) */}
                        <div className="lg:col-span-4 lg:pl-10">
                            <aside className="sticky top-40 space-y-16">
                                
                                {/* Professional CTA Card */}
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all duration-700"></div>
                                    <h3 className="text-3xl font-black mb-4 uppercase leading-tight italic">Health Priority?</h3>
                                    <p className="text-blue-100 mb-10 leading-relaxed font-medium">Book a professional check-up today for your pet's continued health.</p>
                                    <button className="w-full py-5 bg-white text-blue-700 rounded-2xl font-black uppercase text-sm tracking-widest hover:shadow-xl hover:-translate-y-1 transition-all">
                                        Book Now
                                    </button>
                                </div>

                                {/* Sidebar Related Posts */}
                                <div className="space-y-10">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Related Reads</h3>
                                        <div className="h-0.5 w-12 bg-blue-100"></div>
                                    </div>
                                    <div className="space-y-10">
                                        {otherBlogs.map((other) => (
                                            <Link key={other._id} to={`/blog/${other._id}`} className="group flex gap-5 items-center">
                                                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-gray-100">
                                                    <img src={other.image} alt={other.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 uppercase text-sm mb-1">
                                                        {other.title}
                                                    </h4>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        {new Date(other.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <Link to="/blog" className="flex items-center justify-center w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-dashed border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all">
                                        View All Journal Entries
                                    </Link>
                                </div>
                            </aside>
                        </div>

                    </div>
                </div>
            </article>

            <Footer />
        </div>
    );
};

export default BlogDetailPage;









// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import axios from 'axios';
// import { Helmet } from 'react-helmet-async';
// import Header from './Header';
// import Footer from './Footer';

// const BlogDetailPage = () => {
//     const { id } = useParams();
//     const [blog, setBlog] = useState(null);
//     const [otherBlogs, setOtherBlogs] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [scrollProgress, setScrollProgress] = useState(0);

//     useEffect(() => {
//         window.scrollTo(0, 0);

//         const fetchBlogData = async () => {
//             try {
//                 const [blogRes, allBlogsRes] = await Promise.all([
//                     axios.get(`http://localhost:5000/api/blogs/${id}`),
//                     axios.get('http://localhost:5000/api/blogs')
//                 ]);

//                 setBlog(blogRes.data.data);
//                 // Filter current blog out and take recent 3
//                 const filtered = allBlogsRes.data.data
//                     .filter(b => b._id !== id)
//                     .slice(0, 3);
//                 setOtherBlogs(filtered);
//                 setLoading(false);
//             } catch (err) {
//                 setError(err.response?.data?.error || 'Failed to load blog post');
//                 setLoading(false);
//             }
//         };

//         const handleScroll = () => {
//             const totalScroll = document.documentElement.scrollTop;
//             const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
//             const scroll = `${totalScroll / windowHeight}`;
//             setScrollProgress(scroll);
//         };

//         fetchBlogData();
//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, [id]);

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-white flex flex-col">
//                 <Header showHero={false} />
//                 <div className="flex-grow flex justify-center items-center">
//                     <div className="relative">
//                         <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
//                         <div className="absolute inset-0 flex items-center justify-center">
//                             <img src="/logo.jpg" alt="Loading" className="w-8 h-8 rounded-full" />
//                         </div>
//                     </div>
//                 </div>
//                 <Footer />
//             </div>
//         );
//     }

//     if (error || !blog) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex flex-col">
//                 <Header showHero={false} />
//                 <div className="flex-grow flex flex-col items-center justify-center py-20 px-4">
//                     <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-gray-100">
//                         <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-3 shadow-inner">
//                             <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                             </svg>
//                         </div>
//                         <h2 className="text-3xl font-black text-gray-900 mb-4">{error || 'Story Not Found'}</h2>
//                         <p className="text-gray-500 mb-10 leading-relaxed">The article you are searching for might have been moved or removed from our hospital archives.</p>
//                         <Link to="/blog" className="inline-flex items-center justify-center w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
//                             Back to Blog List
//                         </Link>
//                     </div>
//                 </div>
//                 <Footer />
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
//             <Helmet>
//                 <title>{blog.title} | Kings Pet Hospital</title>
//                 <meta name="description" content={blog.metaDescription || blog.content.substring(0, 160)} />
//                 <meta name="keywords" content={blog.metaKeywords || "pets, veterinary, hospital"} />
//             </Helmet>

//             <Header showHero={false} />

//             {/* Reading Progress Bar */}
//             <div
//                 className="fixed top-[72px] left-0 w-full h-1.5 z-[60] bg-transparent pointer-events-none"
//             >
//                 <div
//                     className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-75 origin-left shadow-[0_0_10px_rgba(37,99,235,0.5)]"
//                     style={{ transform: `scaleX(${scrollProgress})` }}
//                 ></div>
//             </div>

//             <article className="pt-20">
//                 {/* Sleek Editorial Header */}
//                 <header className="relative pt-16 pb-24 overflow-hidden">
//                     {/* Decorative Background Element */}
//                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
//                         <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl"></div>
//                         <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl"></div>
//                     </div>

//                     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
//                         {/* Breadcrumb / Category */}
//                         <div className="flex justify-center mb-8">
//                             <Link
//                                 to="/blog"
//                                 className="group flex items-center gap-2 px-5 py-2 bg-blue-50 text-blue-600 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm"
//                             >
//                                 <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                                 </svg>
//                                 The Pet Journal
//                             </Link>
//                         </div>

//                         {/* Title Section */}
//                         <div className="text-center space-y-8">
//                             <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
//                                 {blog.title}
//                             </h1>

//                             {/* Meta Info Pill */}
//                             <div className="flex items-center justify-center">
//                                 <div className="inline-flex items-center gap-4 px-5 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
//                                     <div className="flex items-center gap-2">
//                                         <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                         </svg>
//                                         <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">
//                                             {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
//                                         </span>
//                                     </div>
//                                     <div className="w-px h-3 bg-gray-200"></div>
//                                     <div className="flex items-center gap-2">
//                                         <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                         </svg>
//                                         <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">2 min read</span>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Navbar-Style Author Section */}
//                             <div className="pt-4 flex items-center justify-center">
//                                 <div className="flex flex-col items-center">
//                                     <div className="flex items-center space-x-3 mb-2">
//                                         <img
//                                             src="/logo.jpg"
//                                             alt="Kings Pet Hospital logo"
//                                             className="h-10 w-auto rounded-sm bg-white p-1 shadow-sm border border-gray-100"
//                                         />
//                                         <h2 className="text-2xl font-bold text-blue-600 tracking-tight">
//                                             Kings Pet Hospital
//                                         </h2>
//                                     </div>
//                                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50/50 rounded-full border border-blue-100/30">
//                                         <span className="relative flex h-2 w-2">
//                                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//                                             <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
//                                         </span>
//                                         <p className="text-blue-700 font-black text-[9px] uppercase tracking-[0.2em] whitespace-nowrap">
//                                             Expert Medical Faculty
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </header>

//                 {/* Impactful Cover Media */}
//                 <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 mb-20 relative">
//                     <div className="relative aspect-[16/8] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border-8 border-white group">
//                         <img
//                             src={blog.image}
//                             alt={blog.title}
//                             className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
//                             onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=1200'; }}
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
//                     </div>
//                 </div>

//                 {/* Main Content & Sidebar Layout */}
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
//                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

//                         {/* Sidebar: Left (Socials Sticky) */}
//                         <div className="hidden lg:block lg:col-span-1">
//                             <div className="sticky top-32 flex flex-col gap-4">
//                                 <span className="text-[10px] font-black text-gray-300 uppercase vertical-text transform rotate-180 py-4">Share Story</span>
//                                 <button className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all hover:-translate-y-1">
//                                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.14h-3v4h3v12h5v-12h3.85l.42-4z" /></svg>
//                                 </button>
//                                 <button className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all hover:-translate-y-1">
//                                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.44 4.83a9.45 9.45 0 0 1-2.67.73 4.63 4.63 0 0 0 2.05-2.57 9.28 9.28 0 0 1-2.93 1.12 4.62 4.62 0 1 0-7.88 4.21A13.12 13.12 0 0 1 1.64 3.16a4.63 4.63 0 0 0 1.43 6.17 4.61 4.61 0 0 1-2.1-.58v.06a4.62 4.62 0 0 0 3.71 4.53 4.6 4.6 0 0 1-2.09.08 4.62 4.62 0 0 0 4.32 3.21 9.28 9.28 0 0 1-5.74 1.98c-.37 0-.74-.02-1.1-.06a13.08 13.08 0 0 0 7.08 2.08c8.5 0 13.14-7.04 13.14-13.14 0-.2 0-.4-.01-.6a9.42 9.42 0 0 0 2.32-2.41z" /></svg>
//                                 </button>
//                                 <button className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all hover:-translate-y-1" onClick={() => window.print()}>
//                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Article Content Area */}
//                         <div className="lg:col-span-7">
//                             <div className="prose prose-xl prose-slate max-w-none">
//                                 <div className="text-gray-800 leading-[1.8] text-xl md:text-2xl whitespace-pre-wrap font-serif selection:bg-blue-100 drop-shadow-sm">
//                                     {blog.content}
//                                 </div>
//                             </div>

//                             {/* Author Box */}
//                             <div className="mt-24 p-8 bg-gray-50 rounded-[2rem] border border-gray-100 shadow-inner relative overflow-hidden group">
//                                 <div className="absolute top-0 right-0 p-8 opacity-[0.03] transform rotate-12 transition-transform group-hover:rotate-0 duration-700">
//                                     <img src="/logo.jpg" alt="Watermark" className="w-40 h-40" />
//                                 </div>
//                                 <div className="relative z-10">
//                                     <div className="flex items-center space-x-3 mb-4">
//                                         <img
//                                             src="/logo.jpg"
//                                             alt="Kings Pet Hospital logo"
//                                             className="h-10 w-auto rounded-sm bg-white p-1 shadow-sm border border-gray-100"
//                                         />
//                                         <h4 className="text-2xl font-bold text-blue-600 tracking-tight">
//                                             Kings Pet Medical Team
//                                         </h4>
//                                     </div>
//                                     <p className="text-gray-600 leading-relaxed mb-4 max-w-2xl">
//                                         Passionate about pet wellness and health education. Our team consists of qualified veterinarians and specialists dedicated to providing top-tier medical care for your furry family members.
//                                     </p>
//                                     <Link to="/contact" className="text-blue-600 font-bold uppercase text-[10px] tracking-[0.2em] hover:text-blue-800 transition-all flex items-center gap-2">
//                                         Consult with us
//                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
//                                     </Link>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Sidebar: Right (Related Posts) */}
//                         <div className="lg:col-span-4 lg:pl-8">
//                             <div className="sticky top-32 space-y-12">

//                                 {/* Newsletter / CTA Card */}
//                                 <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
//                                     <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
//                                     <h3 className="text-2xl font-black mb-4 relative z-10">Need Expert Advice?</h3>
//                                     <p className="text-blue-100 mb-8 leading-relaxed relative z-10">Get in touch with our veterinary specialists for personalized care and emergency support.</p>
//                                     <Link to="/contact" className="block w-full py-4 bg-white text-blue-700 rounded-2xl font-black text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all relative z-10">
//                                         Book Consultation
//                                     </Link>
//                                 </div>

//                                 {/* Latest Posts */}
//                                 <div className="space-y-8">
//                                     <div className="flex items-center gap-4">
//                                         <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">More Stories</h3>
//                                         <div className="h-0.5 flex-grow bg-gray-100 rounded-full"></div>
//                                     </div>
//                                     <div className="space-y-8">
//                                         {otherBlogs.length > 0 ? otherBlogs.map((other) => (
//                                             <Link key={other._id} to={`/blog/${other._id}`} className="group flex gap-4 items-start">
//                                                 <div className="w-24 h-20 rounded-2xl overflow-hidden shrink-0 shadow-md border border-gray-100">
//                                                     <img src={other.image} alt={other.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
//                                                 </div>
//                                                 <div>
//                                                     <h4 className="font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
//                                                         {other.title}
//                                                     </h4>
//                                                     <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-wider">
//                                                         <span>{new Date(other.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</span>
//                                                         <span className="w-1 h-1 rounded-full bg-gray-300"></span>
//                                                         <span>By Kings Pet</span>
//                                                     </div>
//                                                 </div>
//                                             </Link>
//                                         )) : (
//                                             <p className="text-gray-400 italic text-sm">No other stories published yet.</p>
//                                         )}
//                                     </div>
//                                     <Link to="/blog" className="flex items-center justify-center w-full py-3 bg-gray-50 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-100 border border-gray-200 transition-all">
//                                         Explore All Articles
//                                     </Link>
//                                 </div>
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//             </article>



//             <Footer />

//             <style dangerouslySetInnerHTML={{
//                 __html: `
//                 .vertical-text {
//                     writing-mode: vertical-rl;
//                 }
//             `}} />
//         </div>
//     );
// };

// export default BlogDetailPage;








