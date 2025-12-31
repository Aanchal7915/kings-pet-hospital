import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Services from './Services';
import Gallery from './Gallery';
import About from './About';
import BlogFeed from './BlogFeed';
import BookingForm from './BookingForm';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans antialiased">
            <Header showHeroImage={false} />
            <main className="relative z-10">
                <Services />
                <Gallery />
                <About />
                <BlogFeed />
                <section className="py-16 bg-blue-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Visit?</h2>
                            <p className="text-lg text-gray-600">
                                Book an appointment today and give your pet the care they deserve.
                            </p>
                        </div>
                        <BookingForm />
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
