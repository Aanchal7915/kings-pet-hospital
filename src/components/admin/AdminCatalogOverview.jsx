import React, { useEffect, useState } from 'react';
import axios from 'axios';

const statCard = (label, value, tone) => ({
  label,
  value,
  tone,
});

const AdminCatalogOverview = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ categories: 0, subCategories: 0, services: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [categoriesRes, subCategoriesRes, servicesRes] = await Promise.all([
          axios.get(`${API_URL}/api/catalog/categories?includeInactive=true`),
          axios.get(`${API_URL}/api/catalog/subcategories?includeInactive=true`),
          axios.get(`${API_URL}/api/catalog/services?includeInactive=true`),
        ]);

        setStats({
          categories: (categoriesRes.data.data || []).length,
          subCategories: (subCategoriesRes.data.data || []).length,
          services: (servicesRes.data.data || []).length,
        });
      } catch (fetchError) {
        setError(fetchError.response?.data?.error || 'Failed to load catalog overview');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [API_URL]);

  const items = [
    statCard('Categories', stats.categories, 'from-blue-600 to-indigo-600'),
    statCard('Subcategories', stats.subCategories, 'from-violet-600 to-purple-600'),
    statCard('Services', stats.services, 'from-emerald-600 to-teal-600'),
  ];

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm mb-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-gray-900">Catalog Overview</h3>
          <p className="text-sm text-gray-500">Quick view of your category hierarchy.</p>
        </div>
        <div className="text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
          Category → Subcategory → Service
        </div>
      </div>

      {error && <div className="mt-3 rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</div>}

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
            <div className={`h-1.5 bg-linear-to-r ${item.tone}`}></div>
            <div className="p-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500 font-semibold">{item.label}</p>
                <p className="text-3xl font-black text-gray-900 mt-1">{loading ? '...' : item.value}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 font-black">
                {item.label.charAt(0)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminCatalogOverview;