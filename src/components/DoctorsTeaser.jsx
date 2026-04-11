import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { SkeletonGrid } from './utils/LoadingSkeleton';

const fallbackDoctors = [
  {
    _id: 'fallback-doctor-1',
    name: 'Dr. Mohit Bazzad',
    photo: '/doctor-mohit.jpg',
    designation: 'B.VSC.& AH,PGCCVH',
    specializations: ['Surgery', 'Veterinary Medicine'],
    experience: '8',
    bio: 'Experienced veterinary clinician focused on advanced diagnosis, surgery, and evidence-based pet care.',
  },
  {
    _id: 'fallback-doctor-2',
    name: 'Dr. Manju',
    photo: '',
    designation: 'General Physician',
    specializations: ['General Physician'],
    experience: '6',
    bio: 'Provides comprehensive primary veterinary care and routine consultations for pets.',
  },
];

const DoctorsTeaser = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/doctors?limit=3`);
        const doctorList = Array.isArray(data?.data) ? data.data.slice(0, 3) : [];
        setDoctors(doctorList.length > 0 ? doctorList : fallbackDoctors);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
        setDoctors(fallbackDoctors);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [API_URL]);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-blue-50" id="doctors-teaser">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest font-bold text-blue-600">Expert Team</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-2">Our Doctors</h2>
          </div>
          <SkeletonGrid count={3} />
        </div>
      </section>
    );
  }

  if (doctors.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50" id="doctors-teaser">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {doctors.slice(0, 2).map((doctor) => (
            <article
              key={doctor._id}
              className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm"
            >
              <div className="h-80 bg-slate-100 overflow-hidden">
                {doctor.photo ? (
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const placeholder = e.currentTarget.nextSibling;
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-full h-full items-center justify-center text-slate-300 ${doctor.photo ? 'hidden' : 'flex'}`}>
                  <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              </div>
              <div className="p-7 text-center">
                <h3 className="text-[2.2rem] font-black text-slate-800 leading-tight">{doctor.name}</h3>
                <p className="text-blue-700 font-bold text-[1.9rem] mt-3">{doctor.designation}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/doctors"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
          >
            View All Doctors
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DoctorsTeaser;
