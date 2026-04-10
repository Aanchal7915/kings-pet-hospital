import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { SkeletonGrid } from './utils/LoadingSkeleton';
import { EmptyState } from './utils/EmptyState';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const whatsappNumber = '918222993333';

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedCategory !== 'All') params.append('category', selectedCategory);

        const { data } = await axios.get(`${API_URL}/api/products?${params}`);
        setProducts(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        triggerToast('Failed to load products', 'error');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedCategory, API_URL]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(['All']);
    products.forEach(p => {
      if (Array.isArray(p.categories)) {
        p.categories.forEach(c => cats.add(c));
      }
    });
    return Array.from(cats);
  }, [products]);

  // Get starting price
  const getStartingPrice = (product) => {
    const pricing = (product.pincodePricing || [])
      .map(p => Number(p.finalPrice || p.originalPrice || 0))
      .filter(p => p > 0);
    return pricing.length > 0 ? Math.min(...pricing) : 0;
  };

  const getPrimaryImage = (product) => {
    const first = product?.images?.[0];
    if (typeof first === 'string' && first.trim()) return first;
    return '/logo.jpg';
  };

  const openProduct = (product) => {
    navigate(`/products/${product._id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showHero={false} />

      {/* Page Header */}
      <section className="pt-24 pb-12 bg-linear-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-black mb-2">Our Products</h1>
          <p className="text-blue-100 text-lg">Premium pet care products for your beloved companions</p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="sticky top-18 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setLoading(true);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filter Toggle and Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="shrink-0 flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FaFilter size={16} />
              Filters
            </button>

            <div className="flex gap-2 flex-1 overflow-x-auto">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedCategory !== 'All') && (
            <div className="mt-3 flex flex-wrap gap-2">
              {searchQuery && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery('')}>
                    <FaTimes size={12} />
                  </button>
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')}>
                    <FaTimes size={12} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <SkeletonGrid count={12} />
          ) : products.length === 0 ? (
            <EmptyState
              type="search"
              title="No products found"
              message={searchQuery 
                ? `No products match "${searchQuery}". Try a different search term.`
                : 'No products available in this category.'}
            />
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Showing <span className="font-bold">{products.length}</span> product{products.length !== 1 ? 's' : ''}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const startPrice = getStartingPrice(product);
                  const categoryBadge = (product.categories || [])[0] || 'Product';

                  return (
                    <article
                      key={product._id}
                      className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full cursor-pointer"
                      onClick={() => openProduct(product)}
                    >
                      {/* Product Image */}
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        <img
                          src={getPrimaryImage(product)}
                          alt={product.name}
                          className="w-full h-full object-contain bg-white p-2 group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            if (e.currentTarget.src.endsWith('/logo.jpg')) return;
                            e.currentTarget.src = '/logo.jpg';
                          }}
                        />
                        {product.featured && (
                          <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">
                            Featured
                          </span>
                        )}
                        {product.bestSeller && (
                          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white">
                            Best Seller
                          </span>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-5 flex flex-col flex-1">
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wide">{categoryBadge}</p>
                        <h3 className="text-lg font-bold text-gray-900 mt-1 line-clamp-2">
                          {product.name}
                        </h3>

                        {product.brand && (
                          <p className="text-sm text-gray-500 mt-1">By {product.brand}</p>
                        )}

                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {product.description || 'Quality product with trusted sourcing'}
                        </p>

                        {/* Pricing */}
                        <div className="mt-4 rounded-lg bg-blue-50 border border-blue-100 p-3">
                          <p className="text-xs text-gray-600 font-medium">From</p>
                          <p className="text-2xl font-black text-blue-700 mt-1">
                            ₹{startPrice.toLocaleString('en-IN')}
                          </p>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openProduct(product);
                          }}
                          className="w-full mt-auto pt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                        >
                          Buy Now
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductsPage;
