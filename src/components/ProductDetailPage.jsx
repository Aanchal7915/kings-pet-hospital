import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaWhatsapp, FaChevronLeft, FaShoppingCart } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';
import { SkeletonGrid } from './utils/LoadingSkeleton';
import { EmptyState } from './utils/EmptyState';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const whatsappNumber = '918222993333';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPricingIndex, setSelectedPricingIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(data?.data || null);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const images = useMemo(() => {
    const items = Array.isArray(product?.images) ? product.images.filter(Boolean) : [];
    return items.length > 0 ? items : ['/logo.jpg'];
  }, [product]);

  const pricing = useMemo(() => {
    const items = Array.isArray(product?.pincodePricing) ? product.pincodePricing : [];
    return items.length > 0 ? items : [];
  }, [product]);

  useEffect(() => {
    setSelectedImageIndex(0);
    setSelectedPricingIndex(0);
  }, [id]);

  const selectedPrice = pricing[selectedPricingIndex] || pricing[0] || null;
  const originalPrice = Number(selectedPrice?.originalPrice || 0);
  const finalPrice = Number(selectedPrice?.finalPrice || selectedPrice?.originalPrice || 0);
  const discount = Number(selectedPrice?.discount || 0);
  const saveAmount = originalPrice > 0 ? originalPrice - finalPrice : 0;

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello Kings Pet Hospital, I want to order ${product?.name || 'this product'}.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showHero={false} />
        <div className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SkeletonGrid count={1} />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showHero={false} />
        <div className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState
            type="search"
            title="Product not found"
            message="The product you are looking for is unavailable right now."
          />
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              <FaChevronLeft size={14} />
              Back to Products
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showHero={false} />

      <section className="pt-28 pb-12 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-sm text-blue-100 mb-4">
            <Link to="/products" className="hover:text-white transition-colors">Products</Link>
            <span>/</span>
            <span>{product.categories?.[0] || 'Product'}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black max-w-4xl leading-tight">{product.name}</h1>
          <p className="mt-3 text-blue-100 max-w-3xl">{product.description}</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center h-[420px]">
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-contain p-4"
                onError={(e) => {
                  if (e.currentTarget.src.endsWith('/logo.jpg')) return;
                  e.currentTarget.src = '/logo.jpg';
                }}
              />
            </div>

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`rounded-xl border p-2 bg-white transition-all ${selectedImageIndex === index ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200'}`}
                  >
                    <img src={image} alt={`${product.name}-${index}`} className="h-20 w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-5 md:p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">{product.categories?.[0] || 'Category'}</span>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">{product.subCategory || 'Subcategory'}</span>
              {product.featured && <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">Featured</span>}
              {product.bestSeller && <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold">Best Seller</span>}
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-gray-900">{product.name}</h2>
            {product.brand && <p className="mt-2 text-gray-500">By {product.brand}</p>}

            <div className="mt-6 rounded-2xl bg-blue-50 border border-blue-100 p-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="text-4xl font-black text-blue-700">₹{finalPrice.toLocaleString('en-IN')}</p>
                {originalPrice > finalPrice && (
                  <p className="text-sm text-gray-500 line-through mt-1">₹{originalPrice.toLocaleString('en-IN')}</p>
                )}
              </div>
              {discount > 0 && (
                <div className="rounded-xl bg-red-500 text-white px-4 py-3 text-right">
                  <div className="text-xs uppercase font-bold">Save</div>
                  <div className="text-2xl font-black">{discount}%</div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <p className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Pack Sizes / Variants</p>
              <div className="flex flex-wrap gap-3">
                {pricing.map((item, index) => (
                  <button
                    key={`${item.packSize || 'pack'}-${index}`}
                    onClick={() => setSelectedPricingIndex(index)}
                    className={`px-4 py-3 rounded-full border text-sm font-semibold transition-all ${selectedPricingIndex === index ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}
                  >
                    {item.packSize || `Option ${index + 1}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl border border-gray-200 p-4">
                <p className="text-gray-500">Category</p>
                <p className="font-bold text-gray-900 mt-1">{product.categories?.[0] || 'General'}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 p-4">
                <p className="text-gray-500">Subcategory</p>
                <p className="font-bold text-gray-900 mt-1">{product.subCategory || 'General'}</p>
              </div>
            </div>

            {selectedPrice?.stockQty !== undefined && (
              <div className="mt-6 text-emerald-700 font-semibold">
                {selectedPrice.stockQty} in stock
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={openWhatsApp}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-green-600 text-white font-bold hover:bg-green-700 transition-colors"
              >
                <FaWhatsapp />
                Order on WhatsApp
              </button>
              <button
                onClick={() => navigate('/products')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-gray-300 text-gray-800 font-bold hover:bg-gray-50 transition-colors"
              >
                <FaShoppingCart />
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
