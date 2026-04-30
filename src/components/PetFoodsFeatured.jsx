import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheck } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || '';
const isValidImage = (s) => typeof s === 'string' && (s.startsWith('http') || s.startsWith('data:') || s.startsWith('/'));

const PetFoodsFeatured = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/petfoods`);
        setFoods(Array.isArray(data?.data) ? data.data : []);
      } catch (_) {
        setFoods([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const visible = useMemo(() => foods.slice(0, 4), [foods]);

  const quickFeatures = (food) => {
    const feats = [];
    if (food.brand) feats.push(`Brand: ${food.brand}`);
    if (food.weight) feats.push(`Weight: ${food.weight}`);
    if (food.foodType) feats.push(`Type: ${food.foodType}`);
    if (feats.length === 0) return ['Premium quality ingredients', 'Vet recommended'];
    return feats.slice(0, 2);
  };

  if (loading || visible.length === 0) return null;

  return (
    <section className="pt-12 pb-10 md:pt-14 md:pb-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest font-bold text-blue-600">Pet Food Store</p>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 text-gradient-animate underline-animate mt-2">Quality Food for Your Pets</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Trusted brands and nutrition for dogs, cats, birds, and more</p>
        </div>

        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {visible.map((food) => (
            <article key={food._id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="relative overflow-hidden">
                <img
                  src={isValidImage(food.image) ? food.image : '/logo.jpg'}
                  alt={food.name}
                  className="w-full h-32 object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    if (e.currentTarget.src.endsWith('/logo.jpg')) return;
                    e.currentTarget.src = '/logo.jpg';
                  }}
                />
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-3 py-1.5 rounded-bl-xl text-sm font-bold shadow-lg">
                  ₹{Number(food.price).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-3">
                <span className="inline-block text-[10px] uppercase font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full mb-2">
                  {food.petType} • {food.foodType}
                </span>
                <h3 className="text-base font-black text-gray-800 mb-2 leading-tight">{food.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">
                  {food.description || 'Premium quality pet food for a healthy and happy pet.'}
                </p>

                <div className="border-t border-gray-200 pt-3 mb-4">
                  <ul className="space-y-1.5">
                    {quickFeatures(food).map((item) => (
                      <li key={`${food._id}-${item}`} className="flex items-start gap-2 text-sm text-gray-700">
                        <FaCheck className="text-blue-500 mt-1 shrink-0" size={12} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className={`w-full rounded-full font-bold py-2.5 transition-colors text-white ${food.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700'}`}
                  onClick={() => food.stock !== 0 && navigate(`/pet-foods/${food._id}`)}
                  disabled={food.stock === 0}
                >
                  {food.stock === 0 ? 'Out of Stock' : 'Order Now'}
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile Grid */}
        <div className="md:hidden grid grid-cols-2 gap-4">
          {visible.map((food) => (
            <article key={food._id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="relative overflow-hidden">
                <img
                  src={isValidImage(food.image) ? food.image : '/logo.jpg'}
                  alt={food.name}
                  className="w-full h-20 object-contain bg-gray-50"
                  loading="lazy"
                  onError={(e) => {
                    if (e.currentTarget.src.endsWith('/logo.jpg')) return;
                    e.currentTarget.src = '/logo.jpg';
                  }}
                />
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-2 py-0.5 rounded-bl-lg text-[10px] font-bold">
                  ₹{Number(food.price).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-2">
                <span className="inline-block text-[8px] uppercase font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full mb-1">
                  {food.petType} • {food.foodType}
                </span>
                <h3 className="text-sm font-black text-gray-800 line-clamp-2 min-h-10">{food.name}</h3>
                <p className="text-gray-600 text-[11px] mt-1 line-clamp-2">{food.description || 'Premium pet food'}</p>
                <div className="mt-2 border-t border-gray-200 pt-2 mb-2">
                  <ul className="space-y-1">
                    {quickFeatures(food).map((item) => (
                      <li key={`${food._id}-m-${item}`} className="flex items-start gap-2 text-[10px] text-gray-700">
                        <FaCheck className="text-blue-500 mt-0.5 shrink-0" size={10} />
                        <span className="line-clamp-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className={`mt-2 w-full rounded-full text-white text-xs font-bold py-1.5 ${food.stock === 0 ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-600 to-violet-600'}`}
                  onClick={() => food.stock !== 0 && navigate(`/pet-foods/${food._id}`)}
                >
                  {food.stock === 0 ? 'Out of Stock' : 'Order Now'}
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => navigate('/pet-foods')}
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
          >
            View All →
          </button>
        </div>
      </div>
    </section>
  );
};

export default PetFoodsFeatured;
