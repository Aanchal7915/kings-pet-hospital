import React, { useEffect, useRef } from 'react';
import Header from './Header';
import Footer from './Footer';
import Services from './Services';
import Gallery from './Gallery';
import About from './About';
import BlogFeed from './BlogFeed';
import BookingForm from './BookingForm';

const Home = () => {
    const bookingSectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll('.reveal');
        elements.forEach((el) => observer.observe(el));

        return () => {
            elements.forEach((el) => observer.unobserve(el));
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans antialiased">
            <Header showHeroImage={false} />
            <main className="relative z-10">
                <Services />
                <Gallery />
                <About />
                <BlogFeed />
                <section ref={bookingSectionRef} className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
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
