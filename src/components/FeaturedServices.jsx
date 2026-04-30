import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import { SkeletonGrid } from './utils/LoadingSkeleton';
import { EmptyState } from './utils/EmptyState';

const FeaturedServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/catalog/services?featured=true`);
        setServices(Array.isArray(data?.data) ? data.data : []);
      } catch (_error) {
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedServices();
  }, [API_URL]);

  const visibleServices = useMemo(() => services.slice(0, 8), [services]);
  const mobileServices = useMemo(() => visibleServices.slice(0, 4), [visibleServices]);

  const getStartingPrice = (service) => {
    const prices = (service.variants || []).map((variant) => Number(variant.price || 0)).filter((price) => price > 0);
    if (prices.length === 0) return 0;
    return Math.min(...prices);
  };

  const handleBookNow = (service) => navigate(`/services/${service.slug}`);

  const quickFeatures = (service) => {
    const picks = (service.variants || []).map((variant) => variant.variantName).filter(Boolean).slice(0, 2);
    if (picks.length > 0) return picks;
    return ['Expert vet-supervised care', 'Personalized treatment plan'];
  };

  if (loading) {
    return (
      <section className="py-8 md:py-14 bg-gray-50" id="featured-services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest font-bold text-blue-600">Featured Services</p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 text-gradient-animate underline-animate mt-2">Featured Services</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Only admin-selected featured services are shown here</p>
          </div>
          <SkeletonGrid count={3} />
        </div>
      </section>
    );
  }

  if (visibleServices.length === 0) {
    return (
      <section className="py-14 bg-gray-50" id="featured-services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest font-bold text-blue-600">Featured Services</p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 text-gradient-animate underline-animate mt-2">Featured Services</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Only admin-selected featured services are shown here</p>
          </div>
          <EmptyState
            type="search"
            title="No featured services yet"
            message="Please mark services as featured from the Admin panel"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="pt-12 pb-10 md:pt-14 md:pb-8 bg-gray-50" id="featured-services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest font-bold text-blue-600">Featured Services</p>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 text-gradient-animate underline-animate mt-2">Featured Services</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Only admin-selected featured services are shown here</p>
        </div>

        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleServices.map((service) => {
            const startingPrice = getStartingPrice(service);

            return (
              <article
                key={service._id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={service.variants?.[0]?.image || '/logo.jpg'}
                    alt={service.name}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      if (e.currentTarget.src.endsWith('/logo.jpg')) return;
                      e.currentTarget.src = '/logo.jpg';
                    }}
                  />
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-3 py-1.5 rounded-bl-xl text-sm font-bold shadow-lg">
                    Starting from ₹{startingPrice.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-base font-black text-gray-800 mb-2 leading-tight">{service.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">
                    {service.description || 'Comprehensive and trusted veterinary care for your pet.'}
                  </p>

                  <div className="border-t border-gray-200 pt-3 mb-4">
                    <ul className="space-y-1.5">
                      {quickFeatures(service).map((item) => (
                        <li key={`${service._id}-${item}`} className="flex items-start gap-2 text-sm text-gray-700">
                          <FaCheck className="text-blue-500 mt-1 shrink-0" size={12} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleBookNow(service)}
                    className="w-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold py-2.5 hover:from-blue-700 hover:to-violet-700 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="md:hidden grid grid-cols-2 gap-4">
          {mobileServices.map((service) => {
            const startingPrice = getStartingPrice(service);

            return (
              <article
                key={service._id}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={service.variants?.[0]?.image || '/logo.jpg'}
                    alt={service.name}
                    className="w-full h-20 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      if (e.currentTarget.src.endsWith('/logo.jpg')) return;
                      e.currentTarget.src = '/logo.jpg';
                    }}
                  />
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-2 py-0.5 rounded-bl-lg text-[10px] font-bold">
                    ₹{startingPrice.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-2">
                  <h3 className="text-sm font-black text-gray-800 line-clamp-2 min-h-10">{service.name}</h3>
                  <p className="text-gray-600 text-[11px] mt-1 line-clamp-2">{service.description || 'Trusted care service'}</p>

                  <div className="mt-2 border-t border-gray-200 pt-2 mb-2">
                    <ul className="space-y-1">
                      {quickFeatures(service).slice(0, 2).map((item) => (
                        <li key={`${service._id}-m-${item}`} className="flex items-start gap-2 text-xs text-gray-700">
                          <FaCheck className="text-blue-500 mt-0.5 shrink-0" size={10} />
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleBookNow(service)}
                    className="w-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold py-1.5"
                  >
                    Book Now
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <a
            href="/services"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
          >
            View All →
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
