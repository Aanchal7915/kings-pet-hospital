import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PetFoodsPage = () => {
  const [foods, setFoods] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', city: '', quantity: 1, message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const fetchFoods = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/petfoods`);
      setFoods(data.data || []);
    } catch (_) {
      setFoods([]);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const petTypes = useMemo(() => {
    const seen = new Set();
    foods.forEach((f) => { if (f.petType) seen.add(f.petType); });
    return ['All', ...Array.from(seen).sort()];
  }, [foods]);

  const visible = useMemo(
    () => (filter === 'All' ? foods : foods.filter((f) => f.petType === filter)),
    [foods, filter]
  );

  const openOrder = (food) => {
    setSelected(food);
    setForm({ name: '', phone: '', email: '', address: '', city: '', quantity: 1, message: '' });
    setErrors({});
    setSuccess(null);
  };

  const closeOrder = () => {
    setSelected(null);
    setSuccess(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required';
    if (!/^\d{10}$/.test(form.phone.trim())) nextErrors.phone = 'Phone must be 10 digits';
    if (!form.address.trim()) nextErrors.address = 'Address is required';
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/petorders`, {
        orderType: 'food',
        itemId: selected._id,
        quantity: Number(form.quantity || 1),
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
      alert(error.response?.data?.error || 'Failed to place order');
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
              Pet Food Store
            </h1>
            <p className="text-gray-600 mt-3 text-base md:text-xl mx-auto max-w-2xl">
              Quality food for dogs, cats, birds, and more.
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
            <p className="text-center text-gray-500">No pet foods available right now.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {visible.map((food) => (
                <article key={food._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                  {food.image ? (
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-48 object-contain bg-white p-3"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-50 flex items-center justify-center text-xs text-gray-400">No image</div>
                  )}
                  <div className="p-4">
                    <span className="inline-block text-[10px] uppercase font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{food.petType} • {food.foodType}</span>
                    <h3 className="font-black text-gray-900 mt-2 text-lg">{food.name}</h3>
                    {food.brand && <p className="text-xs text-gray-500">{food.brand} {food.weight && `• ${food.weight}`}</p>}
                    {food.description && <p className="text-xs text-gray-600 mt-1 line-clamp-2 break-words">{food.description}</p>}
                    <p className="text-xl font-black text-blue-700 mt-3">₹{Number(food.price).toLocaleString('en-IN')}</p>
                    {Number(food.bookingAmount) > 0 && (
                      <p className="text-xs text-gray-500">Advance to confirm: ₹{Number(food.bookingAmount).toLocaleString('en-IN')}</p>
                    )}
                    <button
                      onClick={() => openOrder(food)}
                      disabled={food.stock === 0}
                      className={`mt-3 w-full py-2.5 rounded-xl text-white font-bold ${food.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      {food.stock === 0 ? 'Out of stock' : 'Order Now'}
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
                <h3 className="text-2xl font-black text-gray-900">Order Placed!</h3>
                <p className="text-gray-600 mt-2">Your order ID: <span className="font-bold">{success.orderId}</span></p>
                <p className="text-gray-600 mt-3">We will update you soon on your phone with confirmation and delivery details.</p>
                <button onClick={closeOrder} className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold">Close</button>
              </div>
            ) : (
              <form onSubmit={submit} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-black text-gray-900">Order: {selected.name}</h3>
                    <p className="text-xs text-gray-500">₹{Number(selected.price).toLocaleString('en-IN')} per unit</p>
                  </div>
                  <button type="button" onClick={closeOrder} className="text-gray-400 hover:text-gray-600">
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
                  <div>
                    <label className="text-[11px] font-bold text-gray-700">Email</label>
                    <input type="email" className="w-full border rounded-md px-2 py-1 text-sm mt-0.5" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700">Quantity</label>
                    <input type="number" min="1" className="w-full border rounded-md px-2 py-1 text-sm mt-0.5" value={form.quantity} onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-bold text-gray-700">Address *</label>
                    <textarea className="w-full border rounded-md px-2 py-1 text-sm mt-0.5" rows={2} value={form.address} onChange={(e) => { setErrors((p) => ({ ...p, address: '' })); setForm((p) => ({ ...p, address: e.target.value })); }} />
                    {errors.address && <p className="text-[11px] text-rose-600">{errors.address}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-bold text-gray-700">City</label>
                    <input className="w-full border rounded-md px-2 py-1 text-sm mt-0.5" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-bold text-gray-700">Notes (optional)</label>
                    <textarea className="w-full border rounded-md px-2 py-1 text-sm mt-0.5" rows={1} value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} />
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-2 text-xs">
                  <p>Total: <span className="font-black text-blue-700">₹{(Number(selected.price) * Number(form.quantity || 1)).toLocaleString('en-IN')}</span></p>
                  {Number(selected.bookingAmount) > 0 && (
                    <p className="text-[11px] text-gray-600">Advance to confirm: ₹{(Number(selected.bookingAmount) * Number(form.quantity || 1)).toLocaleString('en-IN')}</p>
                  )}
                </div>

                <button type="submit" disabled={submitting} className="w-full py-2 rounded-lg bg-blue-600 text-white text-sm font-black disabled:opacity-60">
                  {submitting ? 'Placing order...' : 'Place Order'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PetFoodsPage;
