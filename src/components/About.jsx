import React, { useEffect, useRef, useState } from 'react';

const team = [
  {
    name: 'Dr. Mohit Bazzad',
    role: 'B.VSC.& AH,PGCCVH',
    imageUrl: '51.jpg',
  },
  {
    name: 'Dr. Manju',
    role: 'General Physician',
    imageUrl: '56.jpg',
  },
];

const About = () => {
  const [counters, setCounters] = useState({ years: 0, pets: 0, rating: 0 });
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && counters.years === 0) {
            // Animate counters
            const animateCounter = (target, duration, callback) => {
              let start = 0;
              const increment = target / (duration / 16);
              const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                  start = target;
                  clearInterval(timer);
                }
                callback(Math.floor(start));
              }, 16);
            };

            animateCounter(14, 2000, (val) => setCounters(prev => ({ ...prev, years: val })));
            animateCounter(10000, 2000, (val) => setCounters(prev => ({ ...prev, pets: val })));

            let ratingStart = 0;
            const ratingIncrement = 4.9 / 100;
            const ratingTimer = setInterval(() => {
              ratingStart += ratingIncrement;
              if (ratingStart >= 4.9) {
                ratingStart = 4.9;
                clearInterval(ratingTimer);
              }
              setCounters(prev => ({ ...prev, rating: parseFloat(ratingStart.toFixed(1)) }));
            }, 20);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [counters.years]);

  return (
    <section id="about" className="py-10 md:py-20 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-10 md:mb-16">
          <div className="reveal">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 text-gradient-animate animate-text-reveal pb-2 leading-tight">
              About Kings Pet Hospital
            </h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed animate-text-slide text-hover-glow" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              We are a modern, compassionate veterinary hospital dedicated to the lifelong well-being
              of your pets. Since 2019, we have provided advanced medical care, grooming, diagnostics,
              and rehabilitation under one roof.
            </p>
            <p className="text-gray-600 leading-relaxed animate-text-slide text-hover-glow" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              Our facility features state-of-the-art surgical suites, in-house diagnostics, and a caring team
              of professionals. We emphasize preventive care and personalized treatment plans so every pet gets
              the attention they deserve.
            </p>
            <div ref={statsRef} className="mt-8 grid grid-cols-3 gap-2 sm:gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-2 sm:p-4 text-center transform transition-all duration-500 hover:scale-110 hover:shadow-lg border border-blue-100">
                <p className="text-xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {counters.years}+
                </p>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mt-1 font-medium underline-animate">Years of Care</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-2 sm:p-4 text-center transform transition-all duration-500 hover:scale-110 hover:shadow-lg border border-blue-100">
                <p className="text-xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {counters.pets.toLocaleString()}+
                </p>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mt-1 font-medium underline-animate">Happy Pets</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-2 sm:p-4 text-center transform transition-all duration-500 hover:scale-110 hover:shadow-lg border border-blue-100">
                <p className="text-xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {counters.rating}★
                </p>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mt-1 font-medium underline-animate">Customer Rating</p>
              </div>
            </div>
          </div>

          <div className="relative reveal" style={{ animationDelay: '0.2s' }}>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="24.jpg"
                alt="Vet examining a dog"
                className="rounded-xl shadow-lg object-cover h-56 w-full transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              />
              <img
                src="20.jpg"
                alt="Happy pet after grooming"
                className="rounded-xl shadow-lg object-cover h-56 w-full transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              />
              <img
                src="18.jpg"
                alt="Modern veterinary equipment"
                className="rounded-xl shadow-lg object-cover h-56 w-full col-span-2 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              />
            </div>
            <div className="absolute -inset-2 -z-10 bg-gradient-to-r from-blue-200/40 to-purple-200/40 rounded-3xl blur-2xl animate-pulse-slow"></div>
          </div>
        </div>

        <div id="team" className="reveal" style={{ animationDelay: '0.3s' }}>

          <h3 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6 md:mb-8 text-center text-gradient-animate animate-text-reveal underline-animate">
            Meet Our Team
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={member.name}
                className="bg-white rounded-xl shadow-lg overflow-hidden text-center transform transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl group cursor-pointer"
              // style={{
              //   opacity: 0,
              //   animation: `bounceIn 0.8s ease-out ${index * 0.2}s forwards`
              // }}
              >

                <div className="relative overflow-hidden">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-64 object-cover transform transition-transform duration-700 group-hover:scale-125"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="p-6 bg-gradient-to-br from-white to-blue-50/50">
                  <h4 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-all duration-300 text-hover-glow underline-animate">{member.name}</h4>
                  <p className="text-blue-600 font-medium mt-1 transition-all duration-300 group-hover:text-purple-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;


