import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const defaultHero = {
  title: 'Our Doctors',
  subtitle: 'Meet the veterinary professionals behind compassionate and evidence-based care.',
};

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

        setDoctors(doctorsRes.data.data || []);

        const doctorsPageMap = (pageRes.data.data || []).reduce((acc, item) => {
          acc[item.section] = item.content;
          return acc;
        }, {});
        if (doctorsPageMap.hero) {
          setHero(doctorsPageMap.hero);
        }
      } catch (_error) {
        // Keep default heading and empty doctors list if API is unavailable.
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
                  <img src={doctor.photo} alt={doctor.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-black text-slate-900">{doctor.name}</h2>
                  <p className="text-blue-700 font-semibold mt-1">{doctor.designation}</p>
                  <p className="text-sm text-slate-500 mt-1">Experience: {doctor.experience}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(doctor.specializations || []).map((item) => (
                      <span key={`${doctor._id}-${item}`} className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 border border-blue-100 text-blue-700">
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-slate-600 leading-relaxed">{doctor.bio}</p>
                </div>
              </article>
            ))}
          </div>

          {!filteredDoctors.length && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
              No doctors found for the selected specialization.
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DoctorsPage;
