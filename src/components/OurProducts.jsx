import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OurProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/products`);
        setProducts(data?.data || []);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

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
      <section id="our-products" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">Loading products...</div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section id="our-products" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-widest font-bold text-blue-600">Marketplace</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-2">Our Products</h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">Farm-fresh and pet-friendly products with localized pricing and stock visibility.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 9).map((product) => {
            const primaryPricing = product.pincodePricing?.[0] || {};
            return (
              <article
                key={product._id}
                className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                onClick={() => openProduct(product)}
              >
                <img
                  src={getPrimaryImage(product)}
                  alt={product.name}
                  className="w-full h-48 object-contain bg-white p-2"
                  loading="lazy"
                  onError={(e) => {
                    if (e.currentTarget.src.endsWith('/logo.jpg')) return;
                    e.currentTarget.src = '/logo.jpg';
                  }}
                />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-black text-gray-900 leading-tight">{product.name}</h3>
                    {product.bestSeller && (
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        Best Seller
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{(product.categories || []).join(', ') || 'General'}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description || 'Quality product with trusted sourcing and location pricing.'}</p>

                  <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 p-3">
                    <p className="text-xs text-gray-500">Starting Price</p>
                    <p className="text-xl font-black text-blue-700">
                      INR {Number(primaryPricing.finalPrice || primaryPricing.originalPrice || 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Pack: {primaryPricing.packSize || 'Standard'}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openProduct(product);
                    }}
                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                  >
                    Buy Now
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurProducts;
