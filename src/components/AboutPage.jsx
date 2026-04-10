import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { FaClock, FaHeart, FaMicroscope, FaStethoscope } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';

const iconMap = {
  stethoscope: FaStethoscope,
  monitor: FaMicroscope,
  clock: FaClock,
  heart: FaHeart,
};

const defaultContent = {
  hero: {
    hospitalName: 'Kings Pet Hospital',
    tagline: 'Compassionate Veterinary Care, Every Day',
    description:
      'Trusted pet healthcare center for preventive wellness, diagnostics, surgery, grooming and recovery support.',
    image: '24.jpg',
  },
  story: {
    title: 'Our Story',
    paragraphs: [
      'Kings Pet Hospital began with a mission to deliver modern, compassionate care for pets.',
      'Our team combines clinical excellence with empathy at every stage of treatment and recovery.',
    ],
    image: '18.jpg',
  },
  whyChooseUs: {
    title: 'Why Choose Us',
    items: [
      { icon: 'stethoscope', title: 'Expert Vets', description: 'Skilled veterinarians with broad expertise.' },
      { icon: 'monitor', title: 'Modern Equipment', description: 'Advanced diagnostics and treatment setup.' },
      { icon: 'clock', title: '24/7 Care', description: 'Reliable support for urgent pet care needs.' },
      { icon: 'heart', title: 'Compassionate Team', description: 'Kind and attentive care for every pet.' },
    ],
  },
  stats: {
    items: [
      { label: 'Pets Treated', value: '500+' },
      { label: 'Doctors', value: '10+' },
      { label: 'Years of Care', value: '5+' },
      { label: 'Happy Clients', value: '98%' },
    ],
  },
  facilities: {
    title: 'Our Facilities',
    images: [
      { url: '18.jpg', caption: 'Surgery and treatment area' },
      { url: '20.jpg', caption: 'Grooming and pet wellness zone' },
      { url: '24.jpg', caption: 'Consultation and diagnostics room' },
      { url: '56.jpg', caption: 'Recovery and support care section' },
    ],
  },
  contactCta: {
    title: 'Visit Kings Pet Hospital',
    description: 'Book a consultation or contact our team for personalized pet care support.',
    address: 'Faridabad, Haryana, India',
    phone: '+91 99999 99999',
    email: 'care@kingspethospital.in',
    mapLink: 'https://maps.google.com',
    buttonText: 'Get Directions',
  },
};

const AboutPage = () => {
  const [content, setContent] = useState(defaultContent);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/pages/about`);
        const mapped = (data.data || []).reduce((acc, item) => {
          acc[item.section] = item.content;
          return acc;
        }, {});
        setContent((prev) => ({ ...prev, ...mapped }));
      } catch (_error) {
        // Preserve fallback content if API content is unavailable.
      }
    };

    fetchAbout();
  }, [API_URL]);

  const whyCards = useMemo(() => content.whyChooseUs?.items || [], [content.whyChooseUs]);
  const statItems = useMemo(() => content.stats?.items || [], [content.stats]);
  const facilityImages = useMemo(() => content.facilities?.images || [], [content.facilities]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header showHero={false} />
      <main className="pt-24 pb-16">
        <section className="w-full bg-linear-to-r from-sky-900 via-blue-800 to-cyan-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="uppercase tracking-[0.2em] text-xs text-cyan-100 font-bold">About Us</p>
              <h1 className="text-3xl md:text-5xl font-black leading-tight mt-3">{content.hero?.hospitalName}</h1>
              <p className="text-cyan-100 mt-3 text-lg font-semibold">{content.hero?.tagline}</p>
              <p className="text-blue-50 mt-4 max-w-2xl">{content.hero?.description}</p>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/20">
              <img src={content.hero?.image} alt={content.hero?.hospitalName} className="w-full h-80 object-cover" loading="lazy" />
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <article className="rounded-2xl bg-white border border-slate-200 p-7 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-blue-600 font-bold">Our Story</p>
              <h2 className="text-3xl font-black text-slate-900 mt-2">{content.story?.title}</h2>
              {(content.story?.paragraphs || []).map((paragraph, index) => (
                <p key={`story-${index}`} className="mt-4 text-slate-600 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </article>
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <img src={content.story?.image} alt="Our Story" className="w-full h-96 object-cover" loading="lazy" />
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <h2 className="text-3xl font-black text-slate-900">{content.whyChooseUs?.title}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {whyCards.map((item, index) => {
              const Icon = iconMap[item.icon] || FaStethoscope;
              return (
                <article key={`${item.title}-${index}`} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Icon />
                  </div>
                  <h3 className="mt-4 text-lg font-black text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="rounded-2xl bg-slate-900 text-white p-5 md:p-7 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statItems.map((item, index) => (
              <article key={`${item.label}-${index}`} className="text-center">
                <p className="text-3xl font-black text-cyan-300">{item.value}</p>
                <p className="text-sm uppercase tracking-wide text-slate-300 mt-1">{item.label}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <h2 className="text-3xl font-black text-slate-900">{content.facilities?.title}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {facilityImages.map((item, index) => (
              <figure key={`facility-${index}`} className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                <img src={item.url} alt={item.caption || `Facility ${index + 1}`} className="w-full h-48 object-cover" loading="lazy" />
                <figcaption className="p-3 text-sm text-slate-600">{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="rounded-2xl bg-linear-to-r from-blue-700 to-cyan-600 text-white p-6 md:p-8 flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-black">{content.contactCta?.title}</h2>
              <p className="mt-2 text-blue-50 max-w-3xl">{content.contactCta?.description}</p>
              <p className="mt-3 text-sm text-cyan-100">{content.contactCta?.address}</p>
              <p className="text-sm text-cyan-100">{content.contactCta?.phone} | {content.contactCta?.email}</p>
            </div>
            <a
              href={content.contactCta?.mapLink || '/contact'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-white text-blue-700 font-bold hover:bg-blue-50"
            >
              {content.contactCta?.buttonText || 'Contact Us'}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
