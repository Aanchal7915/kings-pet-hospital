import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const GENDERS = ['Male', 'Female', 'Unknown'];

const emptyForm = {
  name: '',
  petType: '',
  breed: '',
  age: '',
  gender: 'Unknown',
  color: '',
  price: '',
  bookingAmount: '',
  vaccinated: false,
  dewormed: false,
  image: '',
  description: '',
  isAvailable: true,
  isActive: true,
};

const toDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const AdminPetListings = () => {
  const token = useMemo(() => localStorage.getItem('adminToken'), []);
  const authConfig = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  const [listings, setListings] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [filterPetType, setFilterPetType] = useState('all');

  const fetchListings = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/petlistings?includeInactive=true&includeSold=true`);
      setListings(data.data || []);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to load listings');
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price || 0),
      bookingAmount: Number(form.bookingAmount || 0),
    };
    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/petlistings/${editingId}`, payload, authConfig);
      } else {
        await axios.post(`${API_URL}/api/petlistings`, payload, authConfig);
      }
      setForm(emptyForm);
      setEditingId('');
      fetchListings();
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to save listing';
      alert(message);
      if (error.response?.status === 404) {
        setEditingId('');
        setForm(emptyForm);
        fetchListings();
      }
    }
  };

  const edit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || '',
      petType: item.petType || 'Puppy',
      breed: item.breed || '',
      age: item.age || '',
      gender: item.gender || 'Unknown',
      color: item.color || '',
      price: item.price ?? '',
      bookingAmount: item.bookingAmount ?? '',
      vaccinated: Boolean(item.vaccinated),
      dewormed: Boolean(item.dewormed),
      image: item.image || '',
      description: item.description || '',
      isAvailable: item.isAvailable !== false,
      isActive: item.isActive !== false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this pet listing?')) return;
    try {
      await axios.delete(`${API_URL}/api/petlistings/${id}`, authConfig);
      fetchListings();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete listing');
    }
  };

  const toggleAvailable = async (item) => {
    try {
      await axios.put(`${API_URL}/api/petlistings/${item._id}`, { ...item, isAvailable: !item.isAvailable }, authConfig);
      fetchListings();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update');
    }
  };

  const availablePetTypes = useMemo(() => {
    const seen = new Set();
    listings.forEach((l) => { if (l.petType) seen.add(l.petType); });
    return Array.from(seen).sort();
  }, [listings]);

  const visibleListings = filterPetType === 'all' ? listings : listings.filter((l) => l.petType === filterPetType);

  return (
    <div className="space-y-5">
      <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-2xl font-black text-gray-900">Pets For Sale</h3>
        <p className="text-sm text-gray-500">List puppies, kittens, and other pets available for booking.</p>

        <form onSubmit={submit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border rounded-lg px-3 py-2" placeholder="Listing name (e.g. German Shepherd Puppy)" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
            <input className="border rounded-lg px-3 py-2" placeholder="Breed (e.g. German Shepherd)" value={form.breed} onChange={(e) => setForm((p) => ({ ...p, breed: e.target.value }))} />
            <input className="border rounded-lg px-3 py-2" placeholder="Pet type (e.g. Puppy, Kitten, Parrot)" value={form.petType} onChange={(e) => setForm((p) => ({ ...p, petType: e.target.value }))} required />
            <select className="border rounded-lg px-3 py-2" value={form.gender} onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <input className="border rounded-lg px-3 py-2" placeholder="Age (e.g. 2 months)" value={form.age} onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))} />
            <input className="border rounded-lg px-3 py-2" placeholder="Color" value={form.color} onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))} />
            <input type="number" min="0" className="border rounded-lg px-3 py-2" placeholder="Price (₹)" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} required />
            <input type="number" min="0" className="border rounded-lg px-3 py-2" placeholder="Booking Amount (₹) - to confirm" value={form.bookingAmount} onChange={(e) => setForm((p) => ({ ...p, bookingAmount: e.target.value }))} />
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
              <img src={form.image} alt="preview" className="w-24 h-20 object-cover rounded-lg border bg-white" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            )}
            <textarea className="border rounded-lg px-3 py-2 md:col-span-2" rows={3} placeholder="Description (temperament, history, etc.)" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />

            <div className="md:col-span-2 flex flex-wrap items-center gap-6">
              <label className="inline-flex items-center gap-2 font-semibold text-gray-700">
                <input type="checkbox" checked={form.vaccinated} onChange={(e) => setForm((p) => ({ ...p, vaccinated: e.target.checked }))} /> Vaccinated
              </label>
              <label className="inline-flex items-center gap-2 font-semibold text-gray-700">
                <input type="checkbox" checked={form.dewormed} onChange={(e) => setForm((p) => ({ ...p, dewormed: e.target.checked }))} /> Dewormed
              </label>
              <label className="inline-flex items-center gap-2 font-semibold text-gray-700">
                <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm((p) => ({ ...p, isAvailable: e.target.checked }))} /> Available
              </label>
              <label className="inline-flex items-center gap-2 font-semibold text-gray-700">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} /> Active
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="px-5 py-2 rounded-lg bg-blue-600 text-white font-bold">{editingId ? 'Update Listing' : 'Add Listing'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(''); setForm(emptyForm); }} className="px-5 py-2 rounded-lg border border-gray-300">Cancel</button>}
          </div>
        </form>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h4 className="text-lg font-black text-gray-900">All Listings ({visibleListings.length})</h4>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setFilterPetType('all')} className={`px-3 py-1 rounded-full text-xs font-bold border ${filterPetType === 'all' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-700'}`}>All</button>
            {availablePetTypes.map((t) => (
              <button key={t} onClick={() => setFilterPetType(t)} className={`px-3 py-1 rounded-full text-xs font-bold border ${filterPetType === t ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-700'}`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {visibleListings.length === 0 ? (
            <p className="text-gray-500">No pet listings yet.</p>
          ) : visibleListings.map((item) => (
            <article key={item._id} className="border border-gray-200 rounded-xl p-3">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-44 object-cover rounded-lg border bg-white"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-44 rounded-lg border bg-gray-50 flex items-center justify-center text-xs text-gray-400">No image</div>
              )}
              <h5 className="font-black text-gray-900 mt-2">{item.name}</h5>
              <p className="text-xs text-gray-500">{item.breed} • {item.gender} • {item.age}</p>
              <p className="text-xs text-gray-600 mt-1">{item.petType}</p>
              <p className="text-sm font-bold text-blue-700 mt-1">₹{Number(item.price).toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-500">Booking: ₹{Number(item.bookingAmount || 0).toLocaleString('en-IN')}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {item.vaccinated && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Vaccinated</span>}
                {item.dewormed && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">Dewormed</span>}
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{item.isAvailable ? 'Available' : 'Sold/Reserved'}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button onClick={() => toggleAvailable(item)} className={`px-3 py-1 rounded text-white text-xs font-bold ${item.isAvailable ? 'bg-orange-500' : 'bg-emerald-600'}`}>{item.isAvailable ? 'Mark Sold' : 'Mark Available'}</button>
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

export default AdminPetListings;
