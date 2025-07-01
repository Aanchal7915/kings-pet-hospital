import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Services from './components/Services';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <Header />
      <main className="relative z-10">
        <Services />
      </main>
      <Footer />
    </div>
  );
}

export default App;
