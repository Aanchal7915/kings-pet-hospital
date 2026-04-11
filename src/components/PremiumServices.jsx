import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import { SkeletonGrid } from './utils/LoadingSkeleton';
import { EmptyState } from './utils/EmptyState';

const PremiumServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/catalog/services`);
        setServices(Array.isArray(data?.data) ? data.data : []);
      } catch (_error) {
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [API_URL]);

  const visibleServices = useMemo(() => services.slice(0, 6), [services]);

  const getStartingPrice = (service) => {
    const prices = (service.variants || []).map((variant) => Number(variant.price || 0)).filter((price) => price > 0);
    if (prices.length === 0) return 0;
    return Math.min(...prices);
  };

  const quickFeatures = (service) => {
    const picks = (service.variants || []).map((variant) => variant.variantName).filter(Boolean).slice(0, 2);
    if (picks.length > 0) return picks;
    return ['Expert vet-supervised care', 'Personalized treatment plan'];
  };

  const handleBookNow = (service) => navigate(`/services/${service.slug}`);

  if (loading) {
    return (
      <section className="py-14 bg-gray-50" id="premium-services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest font-bold text-blue-600">Our Services</p>
            <h2 className="text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text mt-2">
              Our Premium Pet Services
            </h2>
            <p className="text-gray-600 mt-4 text-lg max-w-3xl mx-auto">
              Providing top-quality care for your beloved furry friends with our comprehensive range of services
            </p>
          </div>
          <SkeletonGrid count={3} />
        </div>
      </section>
    );
  }

  if (visibleServices.length === 0) {
    return (
      <section className="py-14 bg-gray-50" id="premium-services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest font-bold text-blue-600">Our Services</p>
            <h2 className="text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text mt-2">
              Our Premium Pet Services
            </h2>
            <p className="text-gray-600 mt-4 text-lg max-w-3xl mx-auto">
              Providing top-quality care for your beloved furry friends with our comprehensive range of services
            </p>
          </div>
          <EmptyState
            type="search"
            title="No services available"
            message="Please add services from Admin panel"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 bg-gray-50" id="premium-services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest font-bold text-blue-600">Our Services</p>
          <h2 className="text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text mt-2">
            Our Premium Pet Services
          </h2>
          <p className="text-gray-600 mt-4 text-lg max-w-3xl mx-auto">
            Providing top-quality care for your beloved furry friends with our comprehensive range of services
          </p>
        </div>

        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
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

                <div className="p-5">
                  <h3 className="text-3xl font-black text-gray-800 mb-2 leading-tight">{service.name}</h3>
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

        <div className="md:hidden flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
          {visibleServices.map((service) => {
            const startingPrice = getStartingPrice(service);

            return (
              <article
                key={service._id}
                className="min-w-[280px] snap-start bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={service.variants?.[0]?.image || '/logo.jpg'}
                    alt={service.name}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      if (e.currentTarget.src.endsWith('/logo.jpg')) return;
                      e.currentTarget.src = '/logo.jpg';
                    }}
                  />
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-2.5 py-1 rounded-bl-lg text-xs font-bold">
                    Starting from ₹{startingPrice.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-black text-gray-800 line-clamp-2">{service.name}</h3>
                  <p className="text-gray-600 text-xs mt-2 line-clamp-2">{service.description || 'Trusted care service'}</p>

                  <div className="mt-3 border-t border-gray-200 pt-2 mb-3">
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
                    className="w-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold py-2"
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

export default PremiumServices;
