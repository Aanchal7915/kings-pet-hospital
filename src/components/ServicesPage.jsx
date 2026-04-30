import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';
import ToastContainer from './utils/Toast';
import { SkeletonGrid } from './utils/LoadingSkeleton';
import { EmptyState } from './utils/EmptyState';

const ServicesPage = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/catalog/services`);
        setServices(Array.isArray(data?.data) ? data.data : []);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [API_URL]);

  const filters = useMemo(() => {
    const all = [{ id: 'all', name: 'All' }];
    const seen = new Set(['all']);
    
    services.forEach((s) => {
      // Add category
      if (s.category) {
        const catId = s.category._id || s.category.name;
        if (!seen.has(catId)) {
          seen.add(catId);
          all.push({ id: catId, name: s.category.name || catId });
        }
      }
      // Add subcategory
      if (s.subCategory) {
        const subId = s.subCategory._id || s.subCategory.name;
        if (!seen.has(subId)) {
          seen.add(subId);
          all.push({ id: subId, name: s.subCategory.name || subId });
        }
      }
    });
    return all;
  }, [services]);

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return services;
    return services.filter((s) => {
      const catMatch = (s.category?._id || s.category?.name) === activeCategory;
      const subMatch = (s.subCategory?._id || s.subCategory?.name) === activeCategory;
      return catMatch || subMatch;
    });
  }, [services, activeCategory]);

  const fromPrice = (service) => {
    const prices = (service.variants || []).map((variant) => Number(variant.price || 0)).filter((price) => price > 0);
    return prices.length ? Math.min(...prices) : 0;
  };

  const quickFeatures = (service) => {
    const picks = (service.variants || []).map((variant) => variant.variantName).filter(Boolean).slice(0, 2);
    if (picks.length > 0) return picks;
    return ['Expert vet-supervised care', 'Personalized treatment plan'];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <Header showHero={false} />

      <main className="pt-28 pb-16">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 text-gradient-animate underline-animate">
              Our Premium Pet Services
            </h1>
            <p className="text-gray-600 mt-3 text-base md:text-xl mx-auto max-w-2xl">
              Providing top-quality care for your beloved furry friends with our comprehensive range of services
            </p>
          </div>

          <div className="flex gap-1.5 md:gap-2 flex-wrap justify-center md:justify-start mb-6 md:mb-8">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveCategory(filter.id)}
                className={`px-2.5 py-1 md:px-4 md:py-2 rounded-full text-[11px] md:text-sm font-semibold border whitespace-nowrap ${activeCategory === filter.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`}
              >
                {filter.name}
              </button>
            ))}
          </div>

          {loading ? (
            <SkeletonGrid count={6} />
          ) : filtered.length === 0 ? (
            <EmptyState type="search" title="No services found" message="Try changing the category filter." />
          ) : (
            <>
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
                {filtered.map((service) => (
                  <article key={service._id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <img
                        src={service.variants?.[0]?.image || '/logo.jpg'}
                        alt={service.name}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          if (e.currentTarget.src.endsWith('/logo.jpg')) return;
                          e.currentTarget.src = '/logo.jpg';
                        }}
                      />
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-3 py-1.5 rounded-bl-xl text-sm font-bold shadow-lg">
                        Starting from ₹{fromPrice(service).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="p-3">
                      <h2 className="text-base font-black text-gray-800 mb-2">{service.name}</h2>
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
                        className="w-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold py-2.5 hover:from-blue-700 hover:to-violet-700 transition-colors"
                        onClick={() => navigate(`/services/${service.slug}`)}
                      >
                        Book Now
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="md:hidden grid grid-cols-2 gap-4">
                {filtered.map((service) => (
                  <article key={`m-${service._id}`} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
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
                        ₹{fromPrice(service).toLocaleString('en-IN')}
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
                        onClick={() => navigate(`/services/${service.slug}`)}
                        className="w-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold py-1.5"
                      >
                        Book Now
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ServicesPage;
