import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const emptyForm = {
  name: '',
  petType: '',
  foodType: '',
  brand: '',
  weight: '',
  price: '',
  bookingAmount: '',
  stock: 0,
  image: '',
  description: '',
  isActive: true,
};

const toDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const AdminPetFoods = () => {
  const token = useMemo(() => localStorage.getItem('adminToken'), []);
  const authConfig = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [filterPetType, setFilterPetType] = useState('all');

  const fetchFoods = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/petfoods?includeInactive=true`);
      setFoods(data.data || []);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to load pet foods');
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price || 0),
      bookingAmount: Number(form.bookingAmount || 0),
      stock: Number(form.stock || 0),
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/petfoods/${editingId}`, payload, authConfig);
      } else {
        await axios.post(`${API_URL}/api/petfoods`, payload, authConfig);
      }
      setForm(emptyForm);
      setEditingId('');
      fetchFoods();
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to save pet food';
      alert(message);
      if (error.response?.status === 404) {
        setEditingId('');
        setForm(emptyForm);
        fetchFoods();
      }
    }
  };

  const edit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || '',
      petType: item.petType || 'Dog',
      foodType: item.foodType || 'Dry',
      brand: item.brand || '',
      weight: item.weight || '',
      price: item.price ?? '',
      bookingAmount: item.bookingAmount ?? '',
      stock: item.stock ?? 0,
      image: item.image || '',
      description: item.description || '',
      isActive: item.isActive !== false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this pet food?')) return;
    try {
      await axios.delete(`${API_URL}/api/petfoods/${id}`, authConfig);
      fetchFoods();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete pet food');
    }
  };

  const availablePetTypes = useMemo(() => {
    const seen = new Set();
    foods.forEach((f) => { if (f.petType) seen.add(f.petType); });
    return Array.from(seen).sort();
  }, [foods]);

  const visibleFoods = filterPetType === 'all' ? foods : foods.filter((f) => f.petType === filterPetType);

  return (
    <div className="space-y-5">
      <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-2xl font-black text-gray-900">Pet Foods</h3>
        <p className="text-sm text-gray-500">Add and manage food items for dogs, cats, and other pets.</p>

        <form onSubmit={submit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border rounded-lg px-3 py-2" placeholder="Food name (e.g. Pedigree Adult)" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
            <input className="border rounded-lg px-3 py-2" placeholder="Brand (optional)" value={form.brand} onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))} />
            <input className="border rounded-lg px-3 py-2" placeholder="Pet type (e.g. Dog, Cat, Parrot)" value={form.petType} onChange={(e) => setForm((p) => ({ ...p, petType: e.target.value }))} required />
            <input className="border rounded-lg px-3 py-2" placeholder="Food type (e.g. Dry, Wet, Treats)" value={form.foodType} onChange={(e) => setForm((p) => ({ ...p, foodType: e.target.value }))} />
            <input className="border rounded-lg px-3 py-2" placeholder="Weight (e.g. 1kg, 500g)" value={form.weight} onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))} />
            <input type="number" min="0" className="border rounded-lg px-3 py-2" placeholder="Price (₹)" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} required />
            <input type="number" min="0" className="border rounded-lg px-3 py-2" placeholder="Booking / Advance amount (₹)" value={form.bookingAmount} onChange={(e) => setForm((p) => ({ ...p, bookingAmount: e.target.value }))} />
            <input type="number" min="0" className="border rounded-lg px-3 py-2" placeholder="Stock" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} />
            <input className="border rounded-lg px-3 py-2 md:col-span-2" placeholder="Image URL" value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} />
            <label className="border rounded-lg px-3 py-2 bg-gray-50 text-sm text-gray-600 flex items-center gap-2 cursor-pointer md:col-span-2">
              Upload Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  if (!e.target.files?.[0]) return;
                  const image = await toDataUrl(e.target.files[0]);
                  setForm((p) => ({ ...p, image }));
                }}
              />
            </label>
            {form.image && (
              <img src={form.image} alt="preview" className="w-24 h-20 object-contain rounded-lg border bg-white p-1" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            )}
            <textarea className="border rounded-lg px-3 py-2 md:col-span-2" rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            <label className="inline-flex items-center gap-2 font-semibold text-gray-700">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} /> Active
            </label>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="px-5 py-2 rounded-lg bg-blue-600 text-white font-bold">{editingId ? 'Update Pet Food' : 'Add Pet Food'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(''); setForm(emptyForm); }} className="px-5 py-2 rounded-lg border border-gray-300">Cancel</button>}
          </div>
        </form>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h4 className="text-lg font-black text-gray-900">All Pet Foods ({visibleFoods.length})</h4>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setFilterPetType('all')} className={`px-3 py-1 rounded-full text-xs font-bold border ${filterPetType === 'all' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-700'}`}>All</button>
            {availablePetTypes.map((t) => (
              <button key={t} onClick={() => setFilterPetType(t)} className={`px-3 py-1 rounded-full text-xs font-bold border ${filterPetType === t ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-700'}`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {visibleFoods.length === 0 ? (
            <p className="text-gray-500">No pet foods yet.</p>
          ) : visibleFoods.map((item) => (
            <article key={item._id} className="border border-gray-200 rounded-xl p-3">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-contain rounded-lg border bg-white p-2"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-40 rounded-lg border bg-gray-50 flex items-center justify-center text-xs text-gray-400">No image</div>
              )}
              <h5 className="font-black text-gray-900 mt-2">{item.name}</h5>
              <p className="text-xs text-gray-500">{item.brand} {item.weight && `• ${item.weight}`}</p>
              <p className="text-xs text-gray-600 mt-1">{item.petType} / {item.foodType}</p>
              <p className="text-sm font-bold text-blue-700 mt-1">₹{Number(item.price).toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-500">Advance: ₹{Number(item.bookingAmount || 0).toLocaleString('en-IN')} | Stock: {item.stock}</p>
              <p className={`text-xs font-bold mt-1 ${item.isActive ? 'text-emerald-600' : 'text-rose-600'}`}>{item.isActive ? 'Active' : 'Inactive'}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => edit(item)} className="px-3 py-1 rounded bg-amber-500 text-white text-xs font-bold">Edit</button>
                <button onClick={() => remove(item._id)} className="px-3 py-1 rounded bg-red-600 text-white text-xs font-bold">Delete</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPetFoods;
