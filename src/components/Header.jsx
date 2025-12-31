import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import BookingForm from './BookingForm';

const whatsappNumber = '+918222993333';
function openWhatsApp(serviceName = '') {
  const message = encodeURIComponent(
    `Hello Kings Pet Hospital, I would like to book an appointment${serviceName ? ' for: ' + serviceName : ''}`
  );
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
}

const Typewriter = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, [text]);

  return <span>{displayText}</span>;
};

const Header = ({ showHeroImage = false, showHero = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  // FIX: This variable determines if the navbar should look "Active" (White bg, Blue/Gray text)
  // It triggers if the user scrolls OR if the Hero section is hidden (Blog page)
  const isNavbarActive = isScrolled || !showHero;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getNavLink = (item) => {
    const sectionId = item.toLowerCase();
    if (item === 'Contact') return '/contact';
    if (item === 'Blog') return '/blog';
    if (isHome) return `#${sectionId}`;
    return `/#${sectionId}`;
  };

  return (
    <header className="relative">
      {/* Navigation Bar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isNavbarActive ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/logo.jpg"
                alt="Kings Pet Hospital logo"
                className="h-10 w-auto rounded-sm bg-white/90 p-1 shadow-sm"
              />
              <h1 className={`text-2xl font-bold transition-colors duration-300 ${isNavbarActive ? 'text-blue-600' : 'text-white'
                }`}>
                Kings Pet Hospital
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {['Services', 'Gallery', 'About', 'Team', 'Blog', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={getNavLink(item)}
                  className={`transition-colors duration-300 font-medium ${isNavbarActive
                    ? 'text-gray-600 hover:text-blue-600'
                    : 'text-white hover:text-blue-200'
                    }`}
                >
                  {item}
                </a>
              ))}
              <button
                className={`px-6 py-2 rounded-full font-semibold transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isNavbarActive
                  ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                  : 'bg-white text-blue-600 hover:bg-blue-50 focus:ring-white'
                  }`}
                onClick={() => openWhatsApp()}
              >
                Book Appointment
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-inset ${isNavbarActive
                  ? 'text-gray-600 hover:text-gray-800 focus:ring-blue-500'
                  : 'text-white hover:text-gray-200 focus:ring-white'
                  }`}
              >
                <span className="sr-only">Open main menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg mt-2 shadow-lg">
                {['Services', 'Gallery', 'About', 'Team', 'Blog', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={getNavLink(item)}
                    className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <button
                  className="w-full mt-2 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold transition-all duration-300 hover:bg-blue-700"
                  onClick={() => openWhatsApp()}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      {showHero && (
        <div className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0 bg-blue-900">
            <img
              src='hero-bg.png'
              alt="Dog Hero Background"
              className="w-full h-full object-cover "
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-12 md:mb-0 md:pr-8 animate-[fadeIn_0.5s_ease-out_forwards]">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 min-h-[140px]">
                  <Typewriter text="Your Pet Deserves The Best Care" />
                </h1>
                <p className="text-xl text-blue-100 mb-8 max-w-lg">
                  Professional pet care services to keep your furry friend healthy and happy.
                  Expert veterinarians, modern facilities, and loving attention.
                </p>

                {!showHeroImage && (
                  <div className="space-y-4 mb-8">
                    {[
                      '24/7 Emergency Care',
                      'Experienced Veterinarians',
                      'Advanced Medical Equipment'
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                          <svg className="w-5 h-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-blue-50 text-lg font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                {!showHeroImage && (
                  <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 inline-flex">
                    <svg className="w-8 h-8 text-blue-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-blue-50 text-sm font-medium">
                      Fill the form to book your appointment instantly via WhatsApp →
                    </p>
                  </div>
                )}

                {showHeroImage && (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold transition-all hover:bg-blue-50"
                      onClick={() => openWhatsApp()}
                    >
                      Book Now
                    </button>
                  </div>
                )}
              </div>

              <div className="md:w-1/2 lg:w-5/12 w-full animate-[fadeIn_0.5s_ease-out_0.3s_forwards]">
                {showHeroImage ? (
                  <img
                    src="50.jpg"
                    alt="Happy dog"
                    className="rounded-3xl shadow-2xl transform transition-transform duration-500 hover:scale-105 border-4 border-white/10"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/logo.jpg'; }}
                  />
                ) : (
                  <div className="bg-white p-2 rounded-[2rem] shadow-2xl">
                    <BookingForm />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

//okay




















// import React, { useState, useEffect } from 'react';
// import { useLocation, Link } from 'react-router-dom';
// import BookingForm from './BookingForm';

// const whatsappNumber = '+918222993333';
// function openWhatsApp(serviceName = '') {
//   const message = encodeURIComponent(
//     `Hello Kings Pet Hospital, I would like to book an appointment${serviceName ? ' for: ' + serviceName : ''}`
//   );
//   window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
// }

// // Typewriter Component for the letter-by-letter animation
// const Typewriter = ({ text }) => {
//   const [displayText, setDisplayText] = useState('');
//   useEffect(() => {
//     let i = 0;
//     const timer = setInterval(() => {
//       setDisplayText(text.substring(0, i + 1));
//       i++;
//       if (i >= text.length) clearInterval(timer);
//     }, 50); // Speed of typing
//     return () => clearInterval(timer);
//   }, [text]);

//   return <span>{displayText}</span>;
// };

// const Header = ({ showHeroImage = false, showHero = true }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const location = useLocation();
//   const isHome = location.pathname === '/';

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const getNavLink = (item) => {
//     const sectionId = item.toLowerCase();

//     if (item === 'Contact') return '/contact';
//     if (item === 'Blog') return '/blog';

//     if (isHome) return `#${sectionId}`;
//     return `/#${sectionId}`;
//   };

//   return (
//     <header className="relative">
//       {/* Navigation Bar */}
//       <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'
//         }`}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center">
//             {/* Logo */}
//             <Link to="/" className="flex items-center space-x-3">
//               <img
//                 src="/logo.jpg"
//                 alt="Kings Pet Hospital logo"
//                 className="h-10 w-auto rounded-sm bg-white/90 p-1 shadow-sm"
//               />
//               <h1 className={`text-2xl font-bold transition-colors duration-300 ${isScrolled ? 'text-blue-600' : 'text-white'
//                 }`}>
//                 Kings Pet Hospital
//               </h1>
//             </Link>

//             {/* Desktop Navigation */}
//             <div className="hidden md:flex items-center space-x-8">
//               {['Services', 'Gallery', 'About', 'Team', 'Blog', 'Contact'].map((item) => (
//                 <a
//                   key={item}
//                   href={getNavLink(item)}
//                   className={`transition-colors duration-300 font-medium ${isScrolled
//                     ? 'text-gray-600 hover:text-blue-600'
//                     : 'text-white hover:text-blue-200'
//                     }`}
//                 >
//                   {item}
//                 </a>
//               ))}
//               <button
//                 className={`px-6 py-2 rounded-full font-semibold transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isScrolled
//                   ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
//                   : 'bg-white text-blue-600 hover:bg-blue-50 focus:ring-white'
//                   }`}
//                 onClick={() => openWhatsApp()}
//               >
//                 Book Appointment
//               </button>
//             </div>

//             {/* Mobile Menu Button */}
//             <div className="md:hidden">
//               <button
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 className={`p-2 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-inset ${isScrolled
//                   ? 'text-gray-600 hover:text-gray-800 focus:ring-blue-500'
//                   : 'text-white hover:text-gray-200 focus:ring-white'
//                   }`}
//               >
//                 <span className="sr-only">Open main menu</span>
//                 <svg
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   {isMenuOpen ? (
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   ) : (
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                   )}
//                 </svg>
//               </button>
//             </div>
//           </div>

//           {/* Mobile Menu */}
//           {isMenuOpen && (
//             <div className="md:hidden">
//               <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg mt-2 shadow-lg">
//                 {['Services', 'Gallery', 'About', 'Team', 'Blog', 'Contact'].map((item) => (
//                   <a
//                     key={item}
//                     href={getNavLink(item)}
//                     className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-300"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     {item}
//                   </a>
//                 ))}
//                 <button
//                   className="w-full mt-2 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold transition-all duration-300 hover:bg-blue-700"
//                   onClick={() => openWhatsApp()}
//                 >
//                   Book Appointment
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </nav>

//       {/* Hero Section */}
//       {showHero && (
//         <div className="relative min-h-screen flex items-center overflow-hidden">
//           {/* Background Image Container */}
//           <div className="absolute inset-0 z-0">
//             <img 
//               src="https://images.unsplash.com/photo-1599443015574-be5fe8a05783?q=80&w=2070&auto=format&fit=crop" 
//               alt="Pet Care Background" 
//               className="w-full h-full object-cover"
//             />
//             {/* Dark Gradient Overlay for readability */}
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/60 to-black/40"></div>
//           </div>

//           <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full text-white">
//             <div className="flex flex-col md:flex-row items-center justify-between">
//               {/* Left Side: Content */}
//               <div className="md:w-1/2 mb-12 md:mb-0 md:pr-8 animate-[fadeIn_0.5s_ease-out_forwards]">
//                 <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 min-h-[140px]">
//                   <Typewriter text="Your Pet Deserves The Best Care" />
//                 </h1>
//                 <p className="text-xl text-blue-100 mb-8 max-w-lg">
//                   Professional pet care services to keep your furry friend healthy and happy.
//                   Expert veterinarians, modern facilities, and loving attention.
//                 </p>

//                 {!showHeroImage && (
//                   <div className="space-y-4 mb-8">
//                     {[
//                       '24/7 Emergency Care',
//                       'Experienced Veterinarians',
//                       'Advanced Medical Equipment'
//                     ].map((feature, idx) => (
//                       <div key={idx} className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
//                           <svg className="w-5 h-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                           </svg>
//                         </div>
//                         <span className="text-blue-50 text-lg font-medium">{feature}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {!showHeroImage && (
//                   <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 inline-flex">
//                     <svg className="w-8 h-8 text-blue-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     <p className="text-blue-50 text-sm font-medium">
//                       Fill the form to book your appointment instantly via WhatsApp →
//                     </p>
//                   </div>
//                 )}

//                 {showHeroImage && (
//                   <div className="flex flex-col sm:flex-row gap-4">
//                     <button
//                       className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold transition-all hover:bg-blue-50"
//                       onClick={() => openWhatsApp()}
//                     >
//                       Book Now
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Right Side: Form */}
//               <div className="md:w-1/2 lg:w-5/12 w-full animate-[fadeIn_0.5s_ease-out_0.3s_forwards]">
//                 {showHeroImage ? (
//                   <img
//                     src="50.jpg"
//                     alt="Happy dog with veterinarian"
//                     className="rounded-3xl shadow-2xl transform transition-transform duration-500 hover:scale-105 border-4 border-white/10"
//                     onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/logo.jpg'; }}
//                   />
//                 ) : (
//                   <div className="bg-white p-2 rounded-[2rem] shadow-2xl">
//                     <BookingForm />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;













// // import React, { useState, useEffect } from 'react';
// // import { useLocation, Link } from 'react-router-dom';
// // import BookingForm from './BookingForm';

// // const whatsappNumber = '+918222993333';
// // function openWhatsApp(serviceName = '') {
// //   const message = encodeURIComponent(
// //     `Hello Kings Pet Hospital, I would like to book an appointment${serviceName ? ' for: ' + serviceName : ''}`
// //   );
// //   window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
// // }

// // const Header = ({ showHeroImage = false, showHero = true }) => {
// //   const [isMenuOpen, setIsMenuOpen] = useState(false);
// //   const [isScrolled, setIsScrolled] = useState(false);
// //   const location = useLocation();
// //   const isHome = location.pathname === '/';

// //   useEffect(() => {
// //     const handleScroll = () => {
// //       setIsScrolled(window.scrollY > 20);
// //     };

// //     window.addEventListener('scroll', handleScroll);
// //     return () => window.removeEventListener('scroll', handleScroll);
// //   }, []);

// //   const getNavLink = (item) => {
// //     const sectionId = item.toLowerCase();

// //     if (item === 'Contact') return '/contact';
// //     if (item === 'Blog') return '/blog';

// //     // For other sections (Services, Gallery, About, Team)
// //     if (isHome) return `#${sectionId}`;
// //     return `/#${sectionId}`;
// //   };

// //   return (
// //     <header className="relative">
// //       {/* Navigation Bar */}
// //       <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'
// //         }`}>
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //           <div className="flex justify-between items-center">
// //             {/* Logo */}
// //             <Link to="/" className="flex items-center space-x-3">
// //               <img
// //                 src="/logo.jpg"
// //                 alt="Kings Pet Hospital logo"
// //                 className="h-10 w-auto rounded-sm bg-white/90 p-1 shadow-sm"
// //               />
// //               <h1 className={`text-2xl font-bold transition-colors duration-300 ${isScrolled ? 'text-blue-600' : 'text-white'
// //                 }`}>
// //                 Kings Pet Hospital
// //               </h1>
// //             </Link>

// //             {/* Desktop Navigation */}
// //             <div className="hidden md:flex items-center space-x-8">
// //               {['Services', 'Gallery', 'About', 'Team', 'Blog', 'Contact'].map((item) => (
// //                 <a
// //                   key={item}
// //                   href={getNavLink(item)}
// //                   className={`transition-colors duration-300 ${isScrolled
// //                     ? 'text-gray-600 hover:text-blue-600'
// //                     : 'text-white hover:text-blue-200'
// //                     }`}
// //                 >
// //                   {item}
// //                 </a>
// //               ))}
// //               <button
// //                 className={`px-6 py-2 rounded-full font-semibold transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isScrolled
// //                   ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
// //                   : 'bg-white text-blue-600 hover:bg-blue-50 focus:ring-white'
// //                   }`}
// //                 onClick={() => openWhatsApp()}
// //               >
// //                 Book Appointment
// //               </button>
// //             </div>

// //             {/* Mobile Menu Button */}
// //             <div className="md:hidden">
// //               <button
// //                 onClick={() => setIsMenuOpen(!isMenuOpen)}
// //                 className={`p-2 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-inset ${isScrolled
// //                   ? 'text-gray-600 hover:text-gray-800 focus:ring-blue-500'
// //                   : 'text-white hover:text-gray-200 focus:ring-white'
// //                   }`}
// //               >
// //                 <span className="sr-only">Open main menu</span>
// //                 <svg
// //                   className="h-6 w-6"
// //                   fill="none"
// //                   viewBox="0 0 24 24"
// //                   stroke="currentColor"
// //                 >
// //                   {isMenuOpen ? (
// //                     <path
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       strokeWidth={2}
// //                       d="M6 18L18 6M6 6l12 12"
// //                     />
// //                   ) : (
// //                     <path
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       strokeWidth={2}
// //                       d="M4 6h16M4 12h16M4 18h16"
// //                     />
// //                   )}
// //                 </svg>
// //               </button>
// //             </div>
// //           </div>

// //           {/* Mobile Menu */}
// //           {isMenuOpen && (
// //             <div className="md:hidden">
// //               <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg mt-2 shadow-lg transform transition-all duration-300 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]">
// //                 {['Services', 'Gallery', 'About', 'Team', 'Blog', 'Contact'].map((item) => (
// //                   <a
// //                     key={item}
// //                     href={getNavLink(item)}
// //                     className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-300"
// //                     onClick={() => setIsMenuOpen(false)}
// //                   >
// //                     {item}
// //                   </a>
// //                 ))}
// //                 <button
// //                   className="w-full mt-2 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold transition-all duration-300 hover:bg-blue-700 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
// //                   onClick={() => openWhatsApp()}
// //                 >
// //                   Book Appointment
// //                 </button>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </nav>

// //       {/* Hero Section */}
// //       {showHero && (
// //         <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white min-h-[90vh] flex items-center">
// //           <div className="absolute inset-0 bg-black opacity-50"></div>
// //           <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
// //             <div className="flex flex-col md:flex-row items-center justify-between">
// //               <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8 transform transition-all duration-500 opacity-0 translate-y-4 animate-[fadeIn_0.5s_ease-out_forwards]">
// //                 <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
// //                   Your Pet Deserves <br />
// //                   <span className="text-blue-200">The Best Care</span>
// //                 </h1>
// //                 <p className="text-xl text-blue-100 mb-6">
// //                   Professional pet care services to keep your furry friend healthy and happy.
// //                   Expert veterinarians, modern facilities, and loving attention.
// //                 </p>

// //                 {!showHeroImage && (
// //                   <div className="space-y-3 mb-8">
// //                     <div className="flex items-center gap-3">
// //                       <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
// //                         <svg className="w-6 h-6 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
// //                         </svg>
// //                       </div>
// //                       <span className="text-blue-50 text-lg">24/7 Emergency Care</span>
// //                     </div>

// //                     <div className="flex items-center gap-3">
// //                       <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
// //                         <svg className="w-6 h-6 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
// //                         </svg>
// //                       </div>
// //                       <span className="text-blue-50 text-lg">Experienced Veterinarians</span>
// //                     </div>

// //                     <div className="flex items-center gap-3">
// //                       <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
// //                         <svg className="w-6 h-6 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
// //                         </svg>
// //                       </div>
// //                       <span className="text-blue-50 text-lg">Advanced Medical Equipment</span>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {showHeroImage && (
// //                   <div className="flex flex-col sm:flex-row gap-4">
// //                     <button
// //                       className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold transition-all duration-300 hover:bg-blue-50 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
// //                       onClick={() => openWhatsApp()}
// //                     >
// //                       Book Now
// //                     </button>
// //                   </div>
// //                 )}

// //                 {!showHeroImage && (
// //                   <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
// //                     <svg className="w-8 h-8 text-blue-200 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// //                     </svg>
// //                     <p className="text-blue-50 text-sm">
// //                       Fill the form to book your appointment instantly via WhatsApp →
// //                     </p>
// //                   </div>
// //                 )}
// //               </div>
// //               <div className="md:w-1/2 transform transition-all duration-500 opacity-0 translate-y-4 animate-[fadeIn_0.5s_ease-out_0.3s_forwards]">
// //                 {showHeroImage ? (
// //                   <img
// //                     src="50.jpg"
// //                     alt="Happy dog with veterinarian"
// //                     className="rounded-lg shadow-2xl transform transition-transform duration-500 hover:scale-105"
// //                     onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/logo.jpg'; }}
// //                   />
// //                 ) : (
// //                   <BookingForm />
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </header>
// //   );
// // };

// // export default Header;












