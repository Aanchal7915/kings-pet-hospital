import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import Services from './Services';
import Gallery from './Gallery';
import About from './About';
import BlogFeed from './BlogFeed';
import BookingForm from './BookingForm';
import { Helmet } from 'react-helmet-async';

const Home = () => {
    const bookingSectionRef = useRef(null);
    const [activeSection, setActiveSection] = useState('home');
    const [dynamicSEO, setDynamicSEO] = useState({});

    // Fetch SEO data from Database
    useEffect(() => {
        const fetchSEO = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const { data } = await axios.get(`${API_URL}/api/seo`);
                const seoMap = {};
                data.data.forEach(item => {
                    seoMap[item.section] = item;
                });
                setDynamicSEO(seoMap);
            } catch (error) {
                console.error('Error fetching dynamic SEO:', error);
            }
        };
        fetchSEO();
    }, []);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -20% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.id?.toLowerCase();
                    if (id && dynamicSEO[id]) {
                        setActiveSection(id);
                        console.log(`%c SEO Updated: ${id.toUpperCase()} `, 'background: #2563eb; color: #fff; font-weight: bold;', dynamicSEO[id]);
                    }

                    if (entry.target.classList.contains('reveal')) {
                        entry.target.classList.add('active');
                    }
                }
            });
        }, [dynamicSEO]);

        // Track sections for SEO
        const sections = document.querySelectorAll('section[id], #services, #gallery, #about, #team, #blog, #booking');
        sections.forEach((section) => observer.observe(section));

        // Track reveal elements for animation
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach((el) => observer.observe(el));

        return () => {
            sections.forEach((section) => observer.unobserve(section));
            revealElements.forEach((el) => observer.unobserve(el));
        };
    }, [dynamicSEO]);

    // Handle initial hero section
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY < 300) {
                setActiveSection('home');
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const seo = dynamicSEO[activeSection] || dynamicSEO.home || {
        title: "Kings Pet Hospital | Best Veterinary Care",
        metaDescription: "Professional pet care services in Faridabad and Rohtak."
    };

    // Manual fallback to ensure the browser tab title ALWAYS updates
    useEffect(() => {
        if (seo.title) {
            document.title = seo.title;
        }
    }, [seo.title, activeSection]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans antialiased">
            <Helmet>
                <title>{seo.title}</title>
                <meta name="description" content={seo.metaDescription || seo.description} />
                <meta property="og:title" content={seo.title} />
                <meta property="og:description" content={seo.metaDescription || seo.description} />
            </Helmet>

            {/* Hidden SEO Text for Search Engines (Visible to crawlers, hidden from users) */}
            <div className="sr-only" aria-hidden="true">
                {seo.h1OrH2 && <h2>{seo.h1OrH2}</h2>}
                {seo.seoText && <p>{seo.seoText}</p>}
            </div>

            <Header showHeroImage={false} />
            <main className="relative z-10">
                <Services />
                <Gallery />
                <About />
                <BlogFeed />
                <section id="booking" ref={bookingSectionRef} className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
                    {/* Animated background elements */}
                    <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
                    <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>

                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-10 reveal">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 animate-fade-in-up text-gradient-animate underline-animate">Ready to Visit?</h2>
                            <p className="text-lg text-gray-600 animate-fade-in-up text-hover-glow" style={{ animationDelay: '0.2s' }}>
                                Book an appointment today and give your pet the care they deserve.
                            </p>
                        </div>
                        <div className="reveal" style={{ animationDelay: '0.3s' }}>
                            <BookingForm />
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
