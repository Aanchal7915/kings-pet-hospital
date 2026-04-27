import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PetListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', city: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const fetchListings = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/petlistings`);
      setListings(data.data || []);
    } catch (_) {
      setListings([]);
    }
  };

  useEffect(() => {
    fetchListings();
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

  const openBook = (pet) => {
    setSelected(pet);
    setForm({ name: '', phone: '', email: '', address: '', city: '', message: '' });
    setErrors({});
    setSuccess(null);
  };

  const closeBook = () => {
    setSelected(null);
    setSuccess(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required';
    if (!/^\d{10}$/.test(form.phone.trim())) nextErrors.phone = 'Phone must be 10 digits';
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/petorders`, {
        orderType: 'pet',
        itemId: selected._id,
        message: form.message,
        customer: {
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          city: form.city,
        },
      });
      setSuccess(data.data);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to book pet');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showHero={false} />
      <main className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text">
              Pets For Sale
            </h1>
            <p className="text-gray-600 mt-3 text-base md:text-xl mx-auto max-w-2xl">
              Adopt a healthy puppy, kitten, or other pet from us.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {petTypes.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${filter === t ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <p className="text-center text-gray-500">No pets available right now.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {visible.map((pet) => (
                <article key={pet._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                  {pet.image ? (
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-full h-52 object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-52 bg-gray-50 flex items-center justify-center text-xs text-gray-400">No image</div>
                  )}
                  <div className="p-4">
                    <span className="inline-block text-[10px] uppercase font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{pet.petType}</span>
                    <h3 className="font-black text-gray-900 mt-2 text-lg">{pet.name}</h3>
                    <p className="text-xs text-gray-500">{pet.breed} {pet.gender !== 'Unknown' && `• ${pet.gender}`} {pet.age && `• ${pet.age}`}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {pet.vaccinated && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Vaccinated</span>}
                      {pet.dewormed && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">Dewormed</span>}
                    </div>
                    <p className="text-xl font-black text-blue-700 mt-3">₹{Number(pet.price).toLocaleString('en-IN')}</p>
                    {Number(pet.bookingAmount) > 0 && (
                      <p className="text-xs text-gray-500">Booking amount: ₹{Number(pet.bookingAmount).toLocaleString('en-IN')}</p>
                    )}
                    <button
                      onClick={() => openBook(pet)}
                      className="mt-3 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    >
                      Book Now
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {success ? (
              <div className="p-8 text-center">
                <div className="inline-flex w-16 h-16 rounded-full bg-emerald-100 items-center justify-center mb-4">
                  <svg className="w-9 h-9 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900">Booking Received!</h3>
                <p className="text-gray-600 mt-2">Your booking ID: <span className="font-bold">{success.orderId}</span></p>
                <p className="text-gray-600 mt-3">We will update you soon on your phone with confirmation and pickup details.</p>
                <p className="text-gray-700 font-semibold mt-2">Booking will be for 7 days.</p>
                <button onClick={closeBook} className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold">Close</button>
              </div>
            ) : (
              <form onSubmit={submit} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-black text-gray-900">Book: {selected.name}</h3>
                    <p className="text-xs text-gray-500">{selected.breed} • ₹{Number(selected.price).toLocaleString('en-IN')}</p>
                  </div>
                  <button type="button" onClick={closeBook} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700">Your Name *</label>
                    <input className="w-full border rounded-md px-2 py-1 text-sm mt-0.5" value={form.name} onChange={(e) => { setErrors((p) => ({ ...p, name: '' })); setForm((p) => ({ ...p, name: e.target.value })); }} />
                    {errors.name && <p className="text-[11px] text-rose-600">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700">Phone *</label>
                    <input className="w-full border rounded-md px-2 py-1 text-sm mt-0.5" value={form.phone} onChange={(e) => { setErrors((p) => ({ ...p, phone: '' })); setForm((p) => ({ ...p, phone: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) })); }} />
                    {errors.phone && <p className="text-[11px] text-rose-600">{errors.phone}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-bold text-gray-700">Email</label>
                    <input type="email" className="w-full border rounded-md px-2 py-1 text-sm mt-0.5" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-bold text-gray-700">Address</label>
                    <textarea className="w-full border rounded-md px-2 py-1 text-sm mt-0.5" rows={2} value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-bold text-gray-700">City</label>
                    <input className="w-full border rounded-md px-2 py-1 text-sm mt-0.5" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-bold text-gray-700">Message (optional)</label>
                    <textarea className="w-full border rounded-md px-2 py-1 text-sm mt-0.5" rows={1} value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} placeholder="Any specific questions?" />
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-2 text-xs">
                  <p>Total: <span className="font-black text-blue-700">₹{Number(selected.price).toLocaleString('en-IN')}</span></p>
                  {Number(selected.bookingAmount) > 0 && (
                    <p className="text-[11px] text-gray-600">Booking amount: ₹{Number(selected.bookingAmount).toLocaleString('en-IN')} (remaining ₹{(Number(selected.price) - Number(selected.bookingAmount)).toLocaleString('en-IN')} on pickup)</p>
                  )}
                </div>

                <button type="submit" disabled={submitting} className="w-full py-2 rounded-lg bg-blue-600 text-white text-sm font-black disabled:opacity-60">
                  {submitting ? 'Submitting...' : 'Submit Booking Request'}
                </button>
                <p className="text-[10px] text-gray-500 text-center">Our team will contact you shortly to confirm.</p>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PetListingsPage;
