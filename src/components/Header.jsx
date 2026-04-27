import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaRegCalendarAlt } from 'react-icons/fa';

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;

function openWhatsApp(serviceName = '') {
  const message = encodeURIComponent(
    `Hello Kings Pet Hospital, I would like to book an appointment${serviceName ? ` for: ${serviceName}` : ''}`
  );
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
}

const TypewriterLine = ({ text, delay = 0, speed = 55, className = '' }) => {
  const [displayText, setDisplayText] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let interval;
    const starter = setTimeout(() => {
      let index = 0;
      interval = setInterval(() => {
        index += 1;
        setDisplayText(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(starter);
      if (interval) clearInterval(interval);
    };
  }, [text, delay, speed]);

  return (
    <span className={className}>
      {displayText}
      {!done && <span className="ml-1 inline-block w-[2px] h-[0.9em] bg-current animate-pulse">|</span>}
    </span>
  );
};

const Header = ({ showHero = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [waForm, setWaForm] = useState({ name: '', phone: '', petName: '', petType: 'Dog', message: '' });
  const [waErrors, setWaErrors] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isNavbarActive = isScrolled || !showHero;

  const goTo = (path) => {
    setIsMenuOpen(false);
    if (path === '/' && location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    navigate(path);
  };

  const goToSection = (sectionId) => {
    setIsMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
      return;
    }

    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const navButtonClass = isNavbarActive ? 'text-gray-600 hover:text-blue-600' : 'text-white hover:text-blue-200';

  const updateWaField = (field, value) => {
    setWaErrors((prev) => ({ ...prev, [field]: '' }));
    setWaForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitWhatsAppBooking = (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!waForm.name.trim()) nextErrors.name = 'Name is required';
    if (!/^\d{10}$/.test(waForm.phone.trim())) nextErrors.phone = 'Phone must be 10 digits';
    if (!waForm.petName.trim()) nextErrors.petName = 'Pet name is required';

    if (Object.keys(nextErrors).length > 0) {
      setWaErrors(nextErrors);
      return;
    }

    const msg = `Hi! I'd like an appointment.\n\nName: ${waForm.name}\nPhone: ${waForm.phone}\nPet Name: ${waForm.petName}\nPet Type: ${waForm.petType}\nMessage: ${waForm.message}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const heroHighlights = [
    { label: '24/7 Emergency Care', tone: 'from-emerald-500/35 to-emerald-400/20 text-emerald-300 border-emerald-300/35' },
    { label: 'Experienced Veterinarians', tone: 'from-blue-500/35 to-blue-400/20 text-blue-300 border-blue-300/35' },
    { label: 'Advanced Medical Equipment', tone: 'from-violet-500/35 to-violet-400/20 text-violet-300 border-violet-300/35' },
  ];

  return (
    <header className="relative overflow-x-hidden">
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isNavbarActive ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.jpg" alt="Kings Pet Hospital logo" className="h-9 w-auto rounded-sm bg-white/90 p-1 shadow-sm" />
              <h1 className={`text-base lg:text-lg font-bold whitespace-nowrap transition-colors duration-300 ${isNavbarActive ? 'text-blue-600' : 'text-white'}`}>
                Kings Pet Hospital
              </h1>
            </Link>

            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              <button type="button" onClick={() => goTo('/')} className={`text-sm font-medium whitespace-nowrap transition-colors duration-300 ${navButtonClass}`}>Home</button>
              <button type="button" onClick={() => goTo('/services')} className={`text-sm font-medium whitespace-nowrap transition-colors duration-300 ${navButtonClass}`}>Services</button>
              <button type="button" onClick={() => goTo('/pet-foods')} className={`text-sm font-medium whitespace-nowrap transition-colors duration-300 ${navButtonClass}`}>Pet Food</button>
              <button type="button" onClick={() => goTo('/pets-for-sale')} className={`text-sm font-medium whitespace-nowrap transition-colors duration-300 ${navButtonClass}`}>Pets For Sale</button>
              <button type="button" onClick={() => goTo('/gallery')} className={`text-sm font-medium whitespace-nowrap transition-colors duration-300 ${navButtonClass}`}>Gallery</button>
              <button type="button" onClick={() => goToSection('about')} className={`text-sm font-medium whitespace-nowrap transition-colors duration-300 ${navButtonClass}`}>About</button>
              <button type="button" onClick={() => goToSection('team')} className={`text-sm font-medium whitespace-nowrap transition-colors duration-300 ${navButtonClass}`}>Doctors</button>
              <button type="button" onClick={() => goTo('/blog')} className={`text-sm font-medium whitespace-nowrap transition-colors duration-300 ${navButtonClass}`}>Blog</button>
              <button type="button" onClick={() => goTo('/contact')} className={`text-sm font-medium whitespace-nowrap transition-colors duration-300 ${navButtonClass}`}>Contact</button>
              <button
                className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${isNavbarActive ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
                onClick={() => openWhatsApp()}
              >
                WhatsApp
              </button>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className={`p-2 rounded-md transition-colors duration-300 ${isNavbarActive ? 'text-gray-600 hover:text-gray-800' : 'text-white hover:text-gray-200'}`}
              >
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

          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg mt-2 shadow-lg">
                <button type="button" onClick={() => goTo('/')} className="block w-full px-3 py-2 text-left text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md">Home</button>
                <button type="button" onClick={() => goTo('/services')} className="block w-full px-3 py-2 text-left text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md">Services</button>
                <button type="button" onClick={() => goTo('/pet-foods')} className="block w-full px-3 py-2 text-left text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md">Pet Food</button>
                <button type="button" onClick={() => goTo('/pets-for-sale')} className="block w-full px-3 py-2 text-left text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md">Pets For Sale</button>
                <button type="button" onClick={() => goTo('/gallery')} className="block w-full px-3 py-2 text-left text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md">Gallery</button>
                <button type="button" onClick={() => goToSection('about')} className="block w-full px-3 py-2 text-left text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md">About</button>
                <button type="button" onClick={() => goToSection('team')} className="block w-full px-3 py-2 text-left text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md">Doctors</button>
                <button type="button" onClick={() => goTo('/blog')} className="block w-full px-3 py-2 text-left text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md">Blog</button>
                <button type="button" onClick={() => goTo('/contact')} className="block w-full px-3 py-2 text-left text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md">Contact</button>
                <button className="w-full mt-2 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700" onClick={() => openWhatsApp()}>
                  WhatsApp Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {showHero && (
        <div className="pt-5 relative min-h-screen flex items-center overflow-hidden bg-blue-900">
          <div className="absolute inset-0 z-0">
            <img src="hero-3.webp" alt="Dog Hero Background" className="hidden md:block w-full h-full object-cover object-center opacity-60" />
            <img src="hero-2.jpg" alt="Dog Hero Background" className="block md:hidden w-full h-full object-cover object-center opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/75 via-blue-900/40 to-blue-900/90"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28 w-full text-white overflow-x-hidden">
            <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-8 xl:gap-12 items-center">
              <div className="max-w-2xl min-w-0 animate-fade-in-up">
                <h1 className="font-black mb-6 leading-[0.95] tracking-tight text-white">
                  <TypewriterLine
                    text="Your Pet"
                    delay={120}
                    speed={55}
                    className="block text-[clamp(1.75rem,4.8vw,3.75rem)]"
                  />
                  <TypewriterLine
                    text="Deserves The"
                    delay={850}
                    speed={55}
                    className="block text-[clamp(1.75rem,4.8vw,3.75rem)] bg-gradient-to-r from-pink-300 via-pink-400 to-fuchsia-400 bg-clip-text text-transparent"
                  />
                  <TypewriterLine
                    text="Best Care"
                    delay={1600}
                    speed={55}
                    className="block text-[clamp(1.75rem,4.8vw,3.75rem)] bg-gradient-to-r from-pink-300 via-pink-400 to-fuchsia-400 bg-clip-text text-transparent"
                  />
                </h1>
                <p className="text-sm md:text-[1.05rem] text-blue-100/95 mb-8 animate-slide-in-left max-w-xl leading-relaxed" style={{ animationDelay: '0.45s' }}>
                  Professional pet care services with expert veterinarians, advanced facilities, and compassionate treatment.
                </p>

                <div className="space-y-3 mb-7 animate-fade-in-up" style={{ animationDelay: '0.58s' }}>
                  {heroHighlights.map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full border bg-gradient-to-br flex items-center justify-center shadow-lg ${item.tone}`}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[1.15rem] md:text-[1.25rem] font-semibold text-slate-100 leading-tight break-words">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full max-w-[560px] animate-slide-in-right" style={{ animationDelay: '0.55s' }}>
                  <button className="px-8 py-3 bg-white text-blue-700 rounded-full font-bold hover:bg-blue-50 transition-all hover:-translate-y-0.5" onClick={() => goTo('/services')}>
                    View Services
                  </button>
                  <button className="px-8 py-3 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-all hover:-translate-y-0.5" onClick={() => openWhatsApp()}>
                    Contact on WhatsApp
                  </button>
                </div>
              </div>

              <div className="animate-fade-in-up min-w-0" style={{ animationDelay: '0.35s' }}>
                <form onSubmit={submitWhatsAppBooking} className="rounded-3xl overflow-hidden shadow-[0_22px_60px_rgba(7,16,52,0.38)] border border-white/25 bg-white/95 backdrop-blur-md w-full max-w-xl xl:max-w-[490px] ml-auto">
                  <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white">
                    <h3 className="text-3xl font-black flex items-center gap-3">
                      <FaRegCalendarAlt className="text-2xl" />
                      WhatsApp Booking
                    </h3>
                    <p className="text-white/90 text-sm mt-1 ml-9">Quick & Easy WhatsApp Booking</p>
                  </div>

                  <div className="p-5 md:p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Your Name *</label>
                        <input
                          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 bg-white text-slate-900 placeholder:text-slate-400"
                          placeholder="Full Name"
                          value={waForm.name}
                          onChange={(e) => updateWaField('name', e.target.value)}
                        />
                        {waErrors.name && <p className="text-xs text-rose-600 mt-1">{waErrors.name}</p>}
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number *</label>
                        <input
                          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 bg-white text-slate-900 placeholder:text-slate-400"
                          placeholder="10-digit Mobile"
                          value={waForm.phone}
                          onChange={(e) => updateWaField('phone', e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                        />
                        {waErrors.phone && <p className="text-xs text-rose-600 mt-1">{waErrors.phone}</p>}
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Pet Name *</label>
                        <input
                          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 bg-white text-slate-900 placeholder:text-slate-400"
                          placeholder="Pet Name"
                          value={waForm.petName}
                          onChange={(e) => updateWaField('petName', e.target.value)}
                        />
                        {waErrors.petName && <p className="text-xs text-rose-600 mt-1">{waErrors.petName}</p>}
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Pet Type</label>
                        <select
                          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 bg-white text-slate-900"
                          value={waForm.petType}
                          onChange={(e) => updateWaField('petType', e.target.value)}
                        >
                          <option value="Dog">Dog</option>
                          <option value="Cat">Cat</option>
                          <option value="Bird">Bird</option>
                          <option value="Rabbit">Rabbit</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Message / Query (optional)</label>
                      <textarea
                        rows={3}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 bg-white text-slate-900 placeholder:text-slate-400"
                        placeholder="Tell us what your pet needs"
                        value={waForm.message}
                        onChange={(e) => updateWaField('message', e.target.value)}
                      />
                    </div>

                    <button type="submit" className="w-full rounded-xl bg-emerald-600 text-white py-3.5 font-black hover:bg-emerald-700 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                      <FaWhatsapp className="text-lg" />
                      Contact on WhatsApp
                    </button>

                    <p className="text-[11px] text-slate-500 text-center">We will contact you quickly on WhatsApp after submission.</p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
