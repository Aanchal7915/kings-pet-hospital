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

  const categories = useMemo(() => {
    const all = ['all'];
    services.forEach((service) => {
      const key = service.category?._id || service.category?.name || 'other';
      if (!all.includes(key)) all.push(key);
    });
    return all;
  }, [services]);

  const categoryLabel = (id) => {
    if (id === 'all') return 'All';
    return services.find((service) => (service.category?._id || service.category?.name) === id)?.category?.name || id;
  };

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return services;
    return services.filter((service) => (service.category?._id || service.category?.name) === activeCategory);
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
            <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text">
              Our Premium Pet Services
            </h1>
            <p className="text-gray-600 mt-3 text-base md:text-xl mx-auto max-w-2xl">
              Providing top-quality care for your beloved furry friends with our comprehensive range of services
            </p>
          </div>

          <div className="flex gap-2 flex-wrap mb-8">
            {categories.map((categoryId) => (
              <button
                key={categoryId}
                onClick={() => setActiveCategory(categoryId)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${activeCategory === categoryId ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`}
              >
                {categoryLabel(categoryId)}
              </button>
            ))}
          </div>

          {loading ? (
            <SkeletonGrid count={6} />
          ) : filtered.length === 0 ? (
            <EmptyState type="search" title="No services found" message="Try changing the category filter." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((service) => (
                <article key={service._id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="relative overflow-hidden">
                    <img
                      src={service.variants?.[0]?.image || '/logo.jpg'}
                      alt={service.name}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        if (e.currentTarget.src.endsWith('/logo.jpg')) return;
                        e.currentTarget.src = '/logo.jpg';
                      }}
                    />
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-3 py-1.5 rounded-bl-xl text-sm font-bold shadow-lg">
                      Starting from ₹{fromPrice(service).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="p-5">
                    <h2 className="text-3xl font-black text-gray-800 mb-2">{service.name}</h2>
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
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ServicesPage;
