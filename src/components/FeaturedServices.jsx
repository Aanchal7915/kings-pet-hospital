import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { FaStethoscope } from 'react-icons/fa';
import { SkeletonGrid } from './utils/LoadingSkeleton';
import { EmptyState } from './utils/EmptyState';

const fallbackServices = [
  {
    _id: 'fallback-vaccine',
    name: 'Vaccination Packages',
    description: 'Core and lifestyle vaccines for dogs and cats.',
    variants: [
      { _id: 'v1', variantName: 'Puppy Starter', price: 1200, bookingAmount: 300, image: '15.jpg' },
      { _id: 'v2', variantName: 'Adult Booster', price: 1500, bookingAmount: 400, image: '16.jpg' },
    ],
  },
  {
    _id: 'fallback-grooming',
    name: 'Grooming & Haircuts',
    description: 'Hygiene, fur styling, and coat health care.',
    variants: [
      { _id: 'g1', variantName: 'Basic Grooming', price: 699, bookingAmount: 199, image: '25.jpg' },
      { _id: 'g2', variantName: 'Premium Haircut', price: 1299, bookingAmount: 399, image: '27.jpeg' },
    ],
  },
  {
    _id: 'fallback-dental',
    name: 'Dental Care',
    description: 'Scaling and oral health treatment for pets.',
    variants: [
      { _id: 'd1', variantName: 'Dental Scaling', price: 3999, bookingAmount: 999, image: '2.jpg' },
      { _id: 'd2', variantName: 'Advanced Dental', price: 6999, bookingAmount: 1499, image: '3.jpg' },
    ],
  },
];

const FeaturedServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/catalog/services?featured=true`);
        const incoming = Array.isArray(data?.data) && data.data.length > 0 ? data.data : fallbackServices;
        setServices(incoming);
      } catch (_error) {
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedServices();
  }, [API_URL]);

  const visibleServices = useMemo(() => services.slice(0, 6), [services]);

  const getStartingPrice = (service) => {
    const prices = (service.variants || []).map((variant) => Number(variant.price || 0)).filter((price) => price > 0);
    if (prices.length === 0) return 0;
    return Math.min(...prices);
  };

  const handleBookNow = (service) => {
    window.dispatchEvent(
      new CustomEvent('book-service', {
        detail: {
          categoryId: service.category?._id || '',
          subCategoryId: service.subCategory?._id || '',
          serviceId: service._id,
        },
      })
    );

    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <section className="py-14 bg-gradient-to-r from-blue-50 to-white" id="featured-services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest font-bold text-blue-600">Premium Care</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-2">Featured Services</h2>
          </div>
          <SkeletonGrid count={3} />
        </div>
      </section>
    );
  }

  if (visibleServices.length === 0) {
    return (
      <section className="py-14 bg-gradient-to-r from-blue-50 to-white" id="featured-services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest font-bold text-blue-600">Premium Care</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-2">Featured Services</h2>
          </div>
          <EmptyState
            type="products"
            title="No featured services yet"
            message="Check back soon for our featured pet care services"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 bg-gradient-to-r from-blue-50 to-white" id="featured-services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest font-bold text-blue-600">Premium Care</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-2">Featured Services</h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">Discover our premium pet care services with flexible booking options</p>
        </div>

        {/* Mobile/Tablet: 3-column grid, Desktop: horizontal scroll */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleServices.map((service) => {
            const startingPrice = getStartingPrice(service);
            const variantCount = (service.variants || []).length;
            const categoryName = service.category?.name || 'Service';

            return (
              <article
                key={service._id}
                className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Service Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={service.variants?.[0]?.image || '/logo.jpg'}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wide">
                    Featured
                  </span>
                  {variantCount > 2 && (
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold">
                      {variantCount} Variants
                    </span>
                  )}
                </div>

                {/* Service Info */}
                <div className="p-5">
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-wide">{categoryName}</p>
                  <h3 className="text-lg font-bold text-gray-900 mt-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{service.description || 'Premium pet care service.'}</p>

                  {/* Service Details */}
                  <div className="mt-4 rounded-lg bg-blue-50 border border-blue-100 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Variants Available</span>
                      <span className="text-sm font-bold text-blue-700">{variantCount}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-blue-100 pt-2">
                      <span className="text-xs text-gray-600">From</span>
                      <span className="text-xl font-black text-blue-700">₹{Number(startingPrice || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleBookNow(service)}
                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors duration-300"
                  >
                    <FaStethoscope size={16} />
                    Book Now
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Mobile: Horizontal scroll */}
        <div className="md:hidden flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
          {visibleServices.map((service) => {
            const startingPrice = getStartingPrice(service);
            const variantCount = (service.variants || []).length;

            return (
              <article
                key={service._id}
                className="min-w-[280px] snap-start rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-40 bg-gray-100">
                  <img
                    src={service.variants?.[0]?.image || '/logo.jpg'}
                    alt={service.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-blue-600 text-white text-xs font-bold">
                    Featured
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="text-base font-bold text-gray-900 line-clamp-1">{service.name}</h3>
                  <p className="text-xs text-blue-600 font-semibold mt-1">{variantCount} variants</p>

                  <div className="mt-3 rounded-lg bg-blue-50 p-2">
                    <p className="text-xs text-gray-600">From</p>
                    <p className="text-lg font-black text-blue-700">₹{Number(startingPrice || 0).toLocaleString('en-IN')}</p>
                  </div>

                  <button
                    onClick={() => handleBookNow(service)}
                    className="w-full mt-3 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Book
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
            View All Services
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
