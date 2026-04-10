import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { SkeletonGrid } from './utils/LoadingSkeleton';

const DoctorsTeaser = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/doctors?limit=3`);
        const doctorList = Array.isArray(data?.data) ? data.data.slice(0, 3) : [];
        setDoctors(doctorList);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
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
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest font-bold text-blue-600">Expert Team</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-2">Meet Our Doctors</h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">Experienced veterinarians dedicated to your pet's health and happiness</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <article
              key={doctor._id}
              className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Doctor Photo */}
              <div className="relative h-56 bg-gradient-to-br from-blue-100 to-blue-50 overflow-hidden">
                {doctor.photo ? (
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-blue-300">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white border border-blue-500">
                  Doctor
                </div>
              </div>

              {/* Doctor Info */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                <p className="text-blue-600 font-semibold text-sm mt-1">{doctor.designation}</p>
                
                {doctor.specializations && doctor.specializations.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {doctor.specializations.slice(0, 2).map((spec, idx) => (
                      <span key={idx} className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                        {spec}
                      </span>
                    ))}
                    {doctor.specializations.length > 2 && (
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                        +{doctor.specializations.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {doctor.experience && (
                  <p className="text-xs text-gray-600 mt-3">
                    <span className="font-semibold">{doctor.experience}+ years</span> of experience
                  </p>
                )}

                {doctor.bio && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{doctor.bio}</p>
                )}

                <Link
                  to="/doctors"
                  className="mt-4 inline-block text-blue-600 font-semibold text-sm hover:text-blue-700 flex items-center gap-1 group/link"
                >
                  View Profile
                  <FaArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
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
