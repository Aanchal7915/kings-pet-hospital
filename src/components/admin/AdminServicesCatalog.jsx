import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const toDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const emptyVariant = {
  variantName: '',
  price: '',
  bookingAmount: '',
  duration: 30,
  image: '',
  description: '',
  isActive: true,
};

const emptyForm = {
  name: '',
  image: '',
  description: '',
  category: '',
  subCategory: '',
  isActive: true,
  isFeatured: false,
  useCustomAdvance: false,
  customAdvanceAmount: '',
  variants: [{ ...emptyVariant }],
};

const AdminServicesCatalog = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = useMemo(() => localStorage.getItem('adminToken'), []);
  const authConfig = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');

  const filteredSubCategories = useMemo(
    () => subCategories.filter((sub) => sub.category?._id === form.category),
    [subCategories, form.category]
  );

  const fetchAll = async () => {
    const [categoriesRes, subCategoriesRes, servicesRes] = await Promise.all([
      axios.get(`${API_URL}/api/catalog/categories?includeInactive=true`),
      axios.get(`${API_URL}/api/catalog/subcategories?includeInactive=true`),
      axios.get(`${API_URL}/api/catalog/services?includeInactive=true`),
    ]);
    setCategories(categoriesRes.data.data || []);
    setSubCategories(subCategoriesRes.data.data || []);
    setServices(servicesRes.data.data || []);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const setVariant = (index, key, value) => {
    setForm((prev) => {
      const next = [...prev.variants];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, variants: next };
    });
  };

  const addVariant = () => {
    setForm((prev) => ({ ...prev, variants: [...prev.variants, { ...emptyVariant }] }));
  };

  const removeVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const moveVariant = (index, direction) => {
    setForm((prev) => {
      const next = [...prev.variants];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, variants: next };
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      useCustomAdvance: Boolean(form.useCustomAdvance),
      customAdvanceAmount: Number(form.customAdvanceAmount || 0),
      variants: form.variants.map((v, i) => ({
        ...v,
        price: Number(v.price || 0),
        bookingAmount: Number(v.bookingAmount || 0),
        duration: Number(v.duration || 30),
        sortOrder: i,
      })),
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/catalog/services/${editingId}`, payload, authConfig);
      } else {
        await axios.post(`${API_URL}/api/catalog/services`, payload, authConfig);
      }
      setForm(emptyForm);
      setEditingId('');
      fetchAll();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save service');
    }
  };

  const edit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || '',
      image: item.image || '',
      description: item.description || '',
      category: item.category?._id || '',
      subCategory: item.subCategory?._id || '',
      isActive: item.isActive !== false,
      isFeatured: Boolean(item.isFeatured),
      useCustomAdvance: Boolean(item.useCustomAdvance),
      customAdvanceAmount: item.customAdvanceAmount ?? '',
      variants: (item.variants || []).map((v) => ({
        variantName: v.variantName || '',
        price: v.price || 0,
        bookingAmount: v.bookingAmount || 0,
        duration: v.duration || 30,
        image: v.image || '',
        description: v.description || '',
        isActive: v.isActive !== false,
      })),
    });
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await axios.delete(`${API_URL}/api/catalog/services/${id}`, authConfig);
      fetchAll();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete service');
    }
  };

  return (
    <div className="space-y-5">
      <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-2xl font-black text-gray-900">Services</h3>
        <p className="text-sm text-gray-500">Manage services and their variant pricing cards.</p>

        <form onSubmit={submit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border rounded-lg px-3 py-2" placeholder="Service name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
            <input className="border rounded-lg px-3 py-2" placeholder="Service image URL" value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} />
            <select className="border rounded-lg px-3 py-2" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value, subCategory: '' }))} required>
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
            <select className="border rounded-lg px-3 py-2" value={form.subCategory} onChange={(e) => setForm((p) => ({ ...p, subCategory: e.target.value }))} required>
              <option value="">Select sub-category</option>
              {filteredSubCategories.map((sub) => (
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
            </select>
            <div className="flex items-center gap-6">
              <label className="inline-flex items-center gap-2 font-semibold text-gray-700"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))} /> Featured</label>
              <label className="inline-flex items-center gap-2 font-semibold text-gray-700"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} /> Active</label>
              <label className="inline-flex items-center gap-2 font-semibold text-gray-700"><input type="checkbox" checked={form.useCustomAdvance} onChange={(e) => setForm((p) => ({ ...p, useCustomAdvance: e.target.checked }))} /> Custom Advance</label>
            </div>
            {form.useCustomAdvance && (
              <input type="number" min="0" className="border rounded-lg px-3 py-2 md:col-span-2" placeholder="Custom Advance Amount" value={form.customAdvanceAmount} onChange={(e) => setForm((p) => ({ ...p, customAdvanceAmount: e.target.value }))} />
            )}
            <textarea className="border rounded-lg px-3 py-2 md:col-span-2" rows={3} placeholder="Service description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            {form.image && (
              <img
                src={form.image}
                alt="preview"
                className="w-24 h-20 object-contain rounded-lg border bg-white p-1"
                onError={(e) => {
                  if (e.currentTarget.src.endsWith('/logo.jpg')) return;
                  e.currentTarget.src = '/logo.jpg';
                }}
              />
            )}
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-black text-gray-900">Variants</h4>
              <button type="button" onClick={addVariant} className="px-3 py-1 rounded bg-indigo-600 text-white text-sm font-bold">+ Add Variant</button>
            </div>

            <div className="mt-3 space-y-3">
              {form.variants.map((variant, index) => (
                <div key={`variant-${index}`} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input className="border rounded px-2 py-1" placeholder="Variant Name" value={variant.variantName} onChange={(e) => setVariant(index, 'variantName', e.target.value)} required />
                    <input type="number" min="0" className="border rounded px-2 py-1" placeholder="Price" value={variant.price} onChange={(e) => setVariant(index, 'price', e.target.value)} required />
                    <input type="number" min="0" className="border rounded px-2 py-1" placeholder="Booking Amount" value={variant.bookingAmount} onChange={(e) => setVariant(index, 'bookingAmount', e.target.value)} required />
                    <input type="number" min="5" className="border rounded px-2 py-1" placeholder="Duration (mins)" value={variant.duration} onChange={(e) => setVariant(index, 'duration', e.target.value)} required />
                    <input className="border rounded px-2 py-1" placeholder="Image URL (or upload below)" value={variant.image} onChange={(e) => setVariant(index, 'image', e.target.value)} />
                    <label className="border rounded px-2 py-1 bg-white text-sm text-gray-600 flex items-center gap-2 cursor-pointer">
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          if (!e.target.files?.[0]) return;
                          const image = await toDataUrl(e.target.files[0]);
                          setVariant(index, 'image', image);
                        }}
                      />
                    </label>
                    <textarea className="md:col-span-3 border rounded px-2 py-1" rows={2} placeholder="Variant description" value={variant.description} onChange={(e) => setVariant(index, 'description', e.target.value)} />
                  </div>

                  <div className="mt-2 flex gap-2">
                    <button type="button" onClick={() => moveVariant(index, 'up')} className="px-3 py-1 rounded border border-gray-300 text-xs font-bold">Move Up</button>
                    <button type="button" onClick={() => moveVariant(index, 'down')} className="px-3 py-1 rounded border border-gray-300 text-xs font-bold">Move Down</button>
                    {form.variants.length > 1 && (
                      <button type="button" onClick={() => removeVariant(index)} className="px-3 py-1 rounded bg-red-600 text-white text-xs font-bold">Delete</button>
                    )}
                    <label className="inline-flex items-center gap-2 ml-auto text-sm font-semibold text-gray-700"><input type="checkbox" checked={variant.isActive} onChange={(e) => setVariant(index, 'isActive', e.target.checked)} /> Active</label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="px-5 py-2 rounded-lg bg-blue-600 text-white font-bold">{editingId ? 'Update Service' : 'Add Service'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(''); setForm(emptyForm); }} className="px-5 py-2 rounded-lg border border-gray-300">Cancel</button>}
          </div>
        </form>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h4 className="text-lg font-black text-gray-900">Services List</h4>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          {services.map((item) => (
            <article key={item._id} className="border border-gray-200 rounded-xl p-3">
              <img
                src={item.image || item.variants?.[0]?.image || '/logo.jpg'}
                alt={item.name}
                className="w-full h-44 object-contain rounded-lg border bg-white p-2"
                onError={(e) => {
                  if (e.currentTarget.src.endsWith('/logo.jpg')) return;
                  e.currentTarget.src = '/logo.jpg';
                }}
              />
              <h5 className="font-black text-gray-900">{item.name}</h5>
              <p className="text-xs text-gray-500 mt-1">{item.category?.name} / {item.subCategory?.name}</p>
              <p className="text-xs text-gray-600 mt-1">Variants: {(item.variants || []).length}</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await axios.put(
                        `${API_URL}/api/catalog/services/${item._id}`,
                        {
                          category: item.category?._id,
                          subCategory: item.subCategory?._id,
                          name: item.name,
                          image: item.image || '',
                          description: item.description || '',
                          isFeatured: !item.isFeatured,
                          isActive: item.isActive !== false,
                          useCustomAdvance: Boolean(item.useCustomAdvance),
                          customAdvanceAmount: Number(item.customAdvanceAmount || 0),
                          variants: item.variants || [],
                        },
                        authConfig
                      );
                      fetchAll();
                    } catch (error) {
                      alert(error.response?.data?.error || 'Failed to toggle featured');
                    }
                  }}
                  className={`px-3 py-1 rounded text-white text-xs font-bold ${item.isFeatured ? 'bg-emerald-600' : 'bg-slate-500'}`}
                >
                  Featured
                </button>
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

export default AdminServicesCatalog;
