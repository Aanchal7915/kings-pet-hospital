import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Gallery from './Gallery';

const GalleryPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showHero={false} />
      <main className="pt-24 pb-16">
        <Gallery />
      </main>
      <Footer />
    </div>
  );
};

export default GalleryPage;
