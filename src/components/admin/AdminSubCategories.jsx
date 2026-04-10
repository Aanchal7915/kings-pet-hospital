import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const toDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const emptyForm = {
  name: '',
  category: '',
  description: '',
  image: '',
  isActive: true,
};

const AdminSubCategories = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = useMemo(() => localStorage.getItem('adminToken'), []);
  const authConfig = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');

  const fetchData = async () => {
    const [categoriesRes, subCategoriesRes] = await Promise.all([
      axios.get(`${API_URL}/api/catalog/categories?includeInactive=true`),
      axios.get(`${API_URL}/api/catalog/subcategories?includeInactive=true`),
    ]);

    setCategories(categoriesRes.data.data || []);
    setSubCategories(subCategoriesRes.data.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const visibleSubCategories = useMemo(() => {
    if (!filterCategory) return subCategories;
    return subCategories.filter((item) => item.category?._id === filterCategory);
  }, [subCategories, filterCategory]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/catalog/subcategories/${editingId}`, form, authConfig);
      } else {
        await axios.post(`${API_URL}/api/catalog/subcategories`, form, authConfig);
      }
      setForm(emptyForm);
      setEditingId('');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save sub-category');
    }
  };

  const edit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || '',
      category: item.category?._id || '',
      description: item.description || '',
      image: item.image || '',
      isActive: item.isActive !== false,
    });
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this sub-category?')) return;
    try {
      await axios.delete(`${API_URL}/api/catalog/subcategories/${id}`, authConfig);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete sub-category');
    }
  };

  return (
    <div className="space-y-5">
      <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-2xl font-black text-gray-900">Sub-categories</h3>
        <p className="text-sm text-gray-500">Add or manage sub-categories under categories.</p>

        <form onSubmit={submit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border rounded-lg px-3 py-2" placeholder="Sub-category name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          <select className="border rounded-lg px-3 py-2" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} required>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>

          <textarea className="border rounded-lg px-3 py-2 md:col-span-2" placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />

          <div>
            <input
              type="file"
              accept="image/*"
              className="w-full border rounded-lg px-3 py-2"
              onChange={async (e) => {
                if (!e.target.files?.[0]) return;
                const image = await toDataUrl(e.target.files[0]);
                setForm((p) => ({ ...p, image }));
              }}
            />
          </div>
          {form.image && <img src={form.image} alt="preview" className="w-20 h-20 rounded-lg object-cover border" />}

          <label className="flex items-center gap-2 font-semibold text-gray-700 md:col-span-2">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
            Active
          </label>

          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="px-5 py-2 rounded-lg bg-blue-600 text-white font-bold">{editingId ? 'Update Sub-category' : 'Add Sub-category'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(''); setForm(emptyForm); }} className="px-5 py-2 rounded-lg border border-gray-300">Cancel</button>}
          </div>
        </form>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-lg font-black text-gray-900">Sub-category List</h4>
          <select className="border rounded-lg px-3 py-2" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          {visibleSubCategories.map((item) => (
            <article key={item._id} className="border border-gray-200 rounded-xl p-3 flex gap-3 items-start">
              <img src={item.image || '/logo.jpg'} alt={item.name} className="w-16 h-16 rounded-lg border object-cover" />
              <div className="flex-1">
                <h5 className="font-black text-gray-900">{item.name}</h5>
                <p className="text-xs text-gray-500">Category: {item.category?.name || '-'}</p>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.description || 'No description'}</p>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => edit(item)} className="px-3 py-1 rounded bg-amber-500 text-white text-xs font-bold">Edit</button>
                  <button onClick={() => remove(item._id)} className="px-3 py-1 rounded bg-red-600 text-white text-xs font-bold">Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminSubCategories;
