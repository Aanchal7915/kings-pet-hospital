import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheck } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const isValidImage = (s) => typeof s === 'string' && (s.startsWith('http') || s.startsWith('data:') || s.startsWith('/'));

const PetListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/petlistings`);
        setListings(data.data || []);
      } catch (_) {
        setListings([]);
      }
    })();
  }, []);

  const petTypes = useMemo(() => {
    const seen = new Set();
    listings.forEach((l) => { if (l.petType) seen.add(l.petType); });
    return ['All', ...Array.from(seen).sort()];
  }, [listings]);

  const visible = useMemo(
    () => (filter === 'All' ? listings : listings.filter((l) => l.petType === filter)),
    [listings, filter]
  );

  const quickFeatures = (pet) => {
    const feats = [];
    if (pet.breed) feats.push(`Breed: ${pet.breed}`);
    if (pet.age) feats.push(`Age: ${pet.age}`);
    if (pet.vaccinated) feats.push('Vaccinated');
    if (pet.dewormed) feats.push('Dewormed');
    if (feats.length === 0) return ['Healthy & friendly', 'Ready for adoption'];
    return feats.slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showHero={false} />
      <main className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 text-gradient-animate underline-animate">
              Pets For Sale
            </h1>
            <p className="text-gray-600 mt-3 text-base md:text-xl mx-auto max-w-2xl">
              Adopt a healthy puppy, kitten, or other pet from us.
            </p>
          </div>

          <div className="flex gap-1.5 md:gap-2 flex-wrap justify-center md:justify-start mb-6 md:mb-8">
            {petTypes.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-2.5 py-1 md:px-4 md:py-2 rounded-full text-[11px] md:text-sm font-semibold border whitespace-nowrap ${filter === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <p className="text-center text-gray-500">No pets available right now.</p>
          ) : (
            <>
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
                {visible.map((pet) => (
                  <article key={pet._id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
                    <div className="relative overflow-hidden">
                      {isValidImage(pet.image) ? (
                        <img
                          src={pet.image}
                          alt={pet.name}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            if (e.currentTarget.src.endsWith('/logo.jpg')) return;
                            e.currentTarget.src = '/logo.jpg';
                          }}
                        />
                      ) : (
                        <img
                          src="/logo.jpg"
                          alt={pet.name}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-3 py-1.5 rounded-bl-xl text-sm font-bold shadow-lg">
                        ₹{Number(pet.price).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="p-3">
                      <span className="inline-block text-[10px] uppercase font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full mb-2">
                        {pet.petType} {pet.gender && pet.gender !== 'Unknown' ? `• ${pet.gender}` : ''}
                      </span>
                      <h2 className="text-base font-black text-gray-800 mb-2">{pet.name}</h2>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">
                        {pet.description || 'A healthy and lovable pet looking for a caring home.'}
                      </p>

                      <div className="border-t border-gray-200 pt-3 mb-4">
                        <ul className="space-y-1.5">
                          {quickFeatures(pet).map((item) => (
                            <li key={`${pet._id}-${item}`} className="flex items-start gap-2 text-sm text-gray-700">
                              <FaCheck className="text-blue-500 mt-1 shrink-0" size={12} />
                              <span>{item}</span>
                            </li>
                          ))}
                          {Number(pet.bookingAmount) > 0 && (
                            <li className="flex items-start gap-2 text-sm text-gray-700">
                              <FaCheck className="text-blue-500 mt-1 shrink-0" size={12} />
                              <span>Booking: ₹{Number(pet.bookingAmount).toLocaleString('en-IN')}</span>
                            </li>
                          )}
                        </ul>
                      </div>

                      <button
                        className="w-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold py-2.5 hover:from-blue-700 hover:to-violet-700 transition-colors"
                        onClick={() => navigate(`/pets-for-sale/${pet._id}`)}
                      >
                        View Pet
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="md:hidden grid grid-cols-2 gap-4">
                {visible.map((pet) => (
                  <article key={`m-${pet._id}`} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="relative overflow-hidden">
                      {isValidImage(pet.image) ? (
                        <img
                          src={pet.image}
                          alt={pet.name}
                          className="w-full h-20 object-cover"
                          loading="lazy"
                          onError={(e) => {
                            if (e.currentTarget.src.endsWith('/logo.jpg')) return;
                            e.currentTarget.src = '/logo.jpg';
                          }}
                        />
                      ) : (
                        <img src="/logo.jpg" alt={pet.name} className="w-full h-20 object-cover" />
                      )}
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-2 py-0.5 rounded-bl-lg text-[10px] font-bold">
                        ₹{Number(pet.price).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="p-2">
                      <span className="inline-block text-[9px] uppercase font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full mb-1">
                        {pet.petType} {pet.gender && pet.gender !== 'Unknown' ? `• ${pet.gender}` : ''}
                      </span>
                      <h3 className="text-sm font-black text-gray-800 line-clamp-2 min-h-10">{pet.name}</h3>
                      <p className="text-gray-600 text-[11px] mt-1 line-clamp-2">{pet.description || 'Healthy pet for adoption'}</p>

                      <div className="mt-2 border-t border-gray-200 pt-2 mb-2">
                        <ul className="space-y-1">
                          {quickFeatures(pet).slice(0, 2).map((item) => (
                            <li key={`${pet._id}-m-${item}`} className="flex items-start gap-2 text-xs text-gray-700">
                              <FaCheck className="text-blue-500 mt-0.5 shrink-0" size={10} />
                              <span className="line-clamp-1">{item}</span>
                            </li>
                          ))}
                          {Number(pet.bookingAmount) > 0 && (
                            <li className="flex items-start gap-2 text-xs text-gray-700">
                              <FaCheck className="text-blue-500 mt-0.5 shrink-0" size={10} />
                              <span className="line-clamp-1">Booking: ₹{Number(pet.bookingAmount).toLocaleString('en-IN')}</span>
                            </li>
                          )}
                        </ul>
                      </div>

                      <button
                        className="w-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold py-1.5"
                        onClick={() => navigate(`/pets-for-sale/${pet._id}`)}
                      >
                        View Pet
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PetListingsPage;
