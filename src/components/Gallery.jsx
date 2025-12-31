import React, { useState } from 'react';

const defaultMedia = [
  { type: 'image', src: '2.jpg' },
  { type: 'image', src: '4.jpg' },
  { type: 'image', src: '7.jpg' },
  { type: 'image', src: '1.jpg' },
  { type: 'image', src: '15.jpg' },
  { type: 'image', src: '19.jpg' },
  { type: 'image', src: '13.jpg' },
  { type: 'image', src: '22.jpg' },
  { type: 'video', src: '5.mp4' },
  { type: 'video', src: '6.mp4' },
  { type: 'video', src: '8.mp4' },
  { type: 'video', src: '9.mp4' },
  { type: 'video', src: '10.mp4' },
  { type: 'video', src: '21.mp4' },

];

const Gallery = () => {
  const [mediaItems] = useState(defaultMedia);
  const [showAll, setShowAll] = useState(false);
  const VISIBLE_COUNT = 8;
  const visibleItems = showAll ? mediaItems : mediaItems.slice(0, VISIBLE_COUNT);

  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 reveal">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 text-gradient-animate animate-text-reveal underline-animate">
            Gallery
          </h2>
          <p className="text-gray-600 text-lg animate-text-slide text-hover-glow" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Photos and videos from our hospital and happy patients
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 lg:gap-6">
          {visibleItems.map((item, idx) => (
            <div 
              key={idx} 
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 mb-4 md:mb-0 cursor-pointer transform hover:-translate-y-2"
              style={{
                opacity: 0,
                animation: `scaleIn 0.5s ease-out ${idx * 0.1}s forwards`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
              {item.type === 'image' ? (
                <img
                  src={item.src}
                  alt="gallery"
                  loading="lazy"
                  className="w-full h-40 md:h-48 lg:h-56 object-cover group-hover:scale-125 transition-transform duration-700"
                />
              ) : (
                <div className="relative">
                  <video
                    src={item.src}
                    controls
                    preload="metadata"
                    className="w-full h-40 md:h-48 lg:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-bold z-20">
                    ▶ Video
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2">
                  <p className="text-xs font-semibold text-gray-800">View Full Size</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {mediaItems.length > VISIBLE_COUNT && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:shadow-blue-500/50 active:scale-95"
            >
              <span className="flex items-center gap-2">
                {showAll ? 'View Less' : 'View More'}
                <svg className={`w-5 h-5 transform transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;


