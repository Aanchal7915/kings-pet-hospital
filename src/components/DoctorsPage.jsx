import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const defaultHero = {
  title: 'Our Doctors',
  subtitle: 'Meet the veterinary professionals behind compassionate and evidence-based care.',
};

const fallbackDoctors = [
  {
    _id: 'fallback-doctor-1',
    name: 'Dr. Mohit Bazzad',
    photo: '',
    designation: 'B.VSC.& AH,PGCCVH',
    specializations: ['Surgery', 'Veterinary Medicine'],
    experience: '8 years',
    bio: 'Experienced veterinary clinician focused on advanced diagnosis, surgery, and evidence-based pet care.',
  },
  {
    _id: 'fallback-doctor-2',
    name: 'Dr. Manju',
    photo: '',
    designation: 'General Physician',
    specializations: ['General Physician'],
    experience: '6 years',
    bio: 'Provides comprehensive primary veterinary care and routine consultations for pets.',
  },
];

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [hero, setHero] = useState(defaultHero);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchDoctorsContent = async () => {
      try {
        const [doctorsRes, pageRes] = await Promise.all([
          axios.get(`${API_URL}/api/doctors`),
          axios.get(`${API_URL}/api/pages/doctors`),
        ]);

        const incomingDoctors = Array.isArray(doctorsRes.data?.data) ? doctorsRes.data.data : [];
        setDoctors(incomingDoctors.length > 0 ? incomingDoctors : fallbackDoctors);

        const doctorsPageMap = (pageRes.data.data || []).reduce((acc, item) => {
          acc[item.section] = item.content;
          return acc;
        }, {});
        if (doctorsPageMap.hero) {
          setHero(doctorsPageMap.hero);
        }
      } catch (_error) {
        // Keep page usable even if doctors API is unavailable.
        setDoctors(fallbackDoctors);
      }
    };

    fetchDoctorsContent();
  }, [API_URL]);

  const specializationFilters = useMemo(() => {
    const unique = new Set();
    doctors.forEach((doctor) => {
      (doctor.specializations || []).forEach((item) => unique.add(item));
    });
    return ['All', ...Array.from(unique)];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    if (activeFilter === 'All') return doctors;
    return doctors.filter((doctor) => (doctor.specializations || []).includes(activeFilter));
  }, [doctors, activeFilter]);

  return (
    <div className="min-h-screen bg-white">
      <Header showHero={false} />
      <main className="pt-24 pb-16">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-linear-to-r from-slate-900 via-blue-900 to-sky-800 text-white p-8 md:p-10">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-cyan-200">Doctors</p>
            <h1 className="text-3xl md:text-5xl font-black mt-2">{hero.title}</h1>
            <p className="text-blue-100 mt-3 max-w-3xl">{hero.subtitle}</p>
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {specializationFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-bold border ${
                  activeFilter === filter
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <article key={doctor._id} className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="h-56 bg-slate-100">
                  {doctor.photo ? (
                    <img src={doctor.photo} alt={doctor.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-7 text-center">
                  <h2 className="text-[2.2rem] font-black text-slate-800 leading-tight">{doctor.name}</h2>
                  <p className="text-blue-700 font-bold text-[1.9rem] mt-3">{doctor.designation}</p>
                </div>
              </article>
            ))}
          </div>

        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DoctorsPage;
