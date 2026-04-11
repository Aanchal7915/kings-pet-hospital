import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import PremiumServices from './PremiumServices';
import FeaturedServices from './FeaturedServices';
import About from './About';
import WhyChooseUs from './WhyChooseUs';
import HowItWorks from './HowItWorks';
import BlogFeed from './BlogFeed';
import WhatsAppContactSection from './WhatsAppContactSection';
import Footer from './Footer';
import ToastContainer from './utils/Toast';

const PUBLIC_TITLE = 'Kings Pet Hospital | Best Veterinary Care';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const sectionByPath = {
      '/about': 'about',
      '/doctors': 'team',
      '/team': 'team',
    };

    const targetSectionId = sectionByPath[location.pathname];
    if (!targetSectionId) return;

    const timer = setTimeout(() => {
      const section = document.getElementById(targetSectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <Helmet>
        <title>{PUBLIC_TITLE}</title>
        <meta name="title" content={PUBLIC_TITLE} />
        <meta name="description" content="Professional pet care services in Rohtak with expert vets and modern facilities." />
      </Helmet>

      <ToastContainer />
      <Header showHero={true} />

      <main className="relative z-10">
        <PremiumServices />
        <FeaturedServices />
        <About />
        <WhyChooseUs />
        <HowItWorks />
        <BlogFeed />
        <WhatsAppContactSection />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
