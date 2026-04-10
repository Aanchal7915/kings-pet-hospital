import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { SkeletonGrid } from './utils/LoadingSkeleton';
import { EmptyState } from './utils/EmptyState';

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/products?featured=true`);
        setProducts(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [API_URL]);

  const visibleProducts = useMemo(() => products.slice(0, 6), [products]);

  const getStartingPrice = (product) => {
    const pricing = (product.pincodePricing || []).map(p => Number(p.finalPrice || p.originalPrice || 0)).filter(p => p > 0);
    if (pricing.length === 0) return 0;
    return Math.min(...pricing);
  };

  const getPrimaryImage = (product) => {
    const first = product?.images?.[0];
    if (typeof first === 'string' && first.trim()) return first;
    return '/logo.jpg';
  };

  const openProduct = (product) => {
    navigate(`/products/${product._id}`);
  };

  if (loading) {
    return (
      <section className="py-14 bg-linear-to-b from-white to-blue-50" id="featured-products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest font-bold text-blue-600">Premium Selection</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-2">Featured Products</h2>
          </div>
          <SkeletonGrid count={6} />
        </div>
      </section>
    );
  }

  if (visibleProducts.length === 0) {
    return (
      <section className="py-14 bg-linear-to-b from-white to-blue-50" id="featured-products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest font-bold text-blue-600">Premium Selection</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-2">Featured Products</h2>
          </div>
          <EmptyState 
            type="products"
            title="No featured products yet"
            message="Check back soon for our premium pet care products"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 bg-linear-to-b from-white to-blue-50" id="featured-products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest font-bold text-blue-600">Premium Selection</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-2">Featured Products</h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">Handpicked products for your pet's health and happiness</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProducts.map((product) => {
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
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white border border-blue-500">
                      Featured
                    </span>
                  )}
                  {product.bestSeller && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white border border-amber-600">
                      Best Seller
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-wide">{categoryBadge}</p>
                  <h3 className="text-lg font-bold text-gray-900 mt-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  {product.brand && (
                    <p className="text-sm text-gray-500 mt-1">By {product.brand}</p>
                  )}

                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description || 'Quality product with trusted sourcing'}</p>

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
                    className="w-full mt-auto pt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors duration-300"
                  >
                    View Product
                    <FaChevronRight size={14} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <a
            href="/products"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
          >
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
