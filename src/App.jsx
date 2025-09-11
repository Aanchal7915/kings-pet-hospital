import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Services from './components/Services';
import About from './components/About';
import Gallery from './components/Gallery';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <Header />
      <main className="relative z-10">
        <Services />
        <Gallery />
        <About />
      </main>
      <Footer />
    </div>
  );
}

export default App;
