import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const itemTypeOptions = ['Dairy', 'Fruits', 'Vegetables', 'Grains', 'Wellness', 'Supplements', 'Pet Care'];

const defaultPricingRow = {
  pincodesInput: '',
  packSize: '',
  originalPrice: '',
  discount: '',
  finalPrice: '',
  stockQty: '',
  verifiedLocations: [],
};

const defaultForm = {
  name: '',
  description: '',
  brand: '',
  categories: [],
  subCategory: '',
  itemType: '',
  featured: false,
  bestSeller: false,
  farmerDetails: {
    name: '',
    contact: '',
    location: '',
    email: '',
  },
  pincodePricing: [{ ...defaultPricingRow }],
  images: [],
  videoUrl: '',
};

const toDataUrls = async (fileList) => {
  const files = Array.from(fileList || []);
  const result = await Promise.all(
    files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    )
  );
  return result;
};

const computeFinalPrice = (originalPrice, discount) => {
  const original = Number(originalPrice || 0);
  const disc = Number(discount || 0);
  if (original <= 0) return 0;
  return Number((original - (original * disc) / 100).toFixed(2));
};

const AdminProducts = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = useMemo(() => localStorage.getItem('adminToken'), []);
  const authConfig = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategoryForDropdown, setSelectedCategoryForDropdown] = useState('');
  const [selectedCategoryToAdd, setSelectedCategoryToAdd] = useState('');

  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const selectedCategoryObjects = useMemo(
    () => categories.filter((c) => form.categories.includes(c.name)),
    [categories, form.categories]
  );

  const selectedCategoryIds = useMemo(
    () => selectedCategoryObjects.map((c) => c._id),
    [selectedCategoryObjects]
  );

  const allowedSubCategories = useMemo(() => {
    if (selectedCategoryIds.length === 0) return [];
    return subCategories.filter((sc) => selectedCategoryIds.includes(sc?.category?._id));
  }, [selectedCategoryIds, subCategories]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes, subCategoriesRes] = await Promise.all([
        axios.get(`${API_URL}/api/products`),
        axios.get(`${API_URL}/api/catalog/categories`),
        axios.get(`${API_URL}/api/catalog/subcategories`),
      ]);

      setProducts(productsRes?.data?.data || []);
      setCategories(categoriesRes?.data?.data || []);
      setSubCategories(subCategoriesRes?.data?.data || []);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to load product data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAddCategory = async () => {
    if (!selectedCategoryToAdd) return;

    if (selectedCategoryToAdd === '__create_new__') {
      const name = window.prompt('Enter new category name');
      if (!name || !name.trim()) return;

      try {
        const response = await axios.post(
          `${API_URL}/api/catalog/categories`,
          { name: name.trim(), isActive: true },
          authConfig
        );

        const created = response?.data?.data;
        if (created) {
          setCategories((prev) => [created, ...prev]);
          setForm((prev) => ({
            ...prev,
            categories: prev.categories.includes(created.name)
              ? prev.categories
              : [...prev.categories, created.name],
          }));
        }
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to create category');
      }

      setSelectedCategoryToAdd('');
      return;
    }

    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(selectedCategoryToAdd)
        ? prev.categories
        : [...prev.categories, selectedCategoryToAdd],
    }));
    setSelectedCategoryToAdd('');
  };

  const removeCategory = (categoryName) => {
    setForm((prev) => {
      const nextCategories = prev.categories.filter((c) => c !== categoryName);
      const stillAllowedSubCategories = allowedSubCategories
        .filter((sub) => nextCategories.includes(sub?.category?.name))
        .map((sub) => sub.name);

      return {
        ...prev,
        categories: nextCategories,
        subCategory: stillAllowedSubCategories.includes(prev.subCategory) ? prev.subCategory : '',
      };
    });
  };

  const setPricingRow = (index, key, value) => {
    setForm((prev) => {
      const nextRows = [...prev.pincodePricing];
      const row = { ...nextRows[index], [key]: value };

      if (key === 'originalPrice' || key === 'discount') {
        row.finalPrice = computeFinalPrice(
          key === 'originalPrice' ? value : row.originalPrice,
          key === 'discount' ? value : row.discount
        );
      }

      if (key === 'pincodesInput') {
        row.verifiedLocations = String(value)
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean);
      }

      nextRows[index] = row;
      return { ...prev, pincodePricing: nextRows };
    });
  };

  const addPricingRow = () => {
    setForm((prev) => ({
      ...prev,
      pincodePricing: [...prev.pincodePricing, { ...defaultPricingRow }],
    }));
  };

  const removePricingRow = (index) => {
    setForm((prev) => ({
      ...prev,
      pincodePricing: prev.pincodePricing.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId('');
    setSelectedCategoryForDropdown('');
    setSelectedCategoryToAdd('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Product Name is required');
      return;
    }

    const payload = {
      ...form,
      categories: form.categories,
      pincodePricing: form.pincodePricing.map((row) => ({
        pincodes: String(row.pincodesInput || '')
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean),
        packSize: row.packSize,
        originalPrice: Number(row.originalPrice || 0),
        discount: Number(row.discount || 0),
        finalPrice: Number(row.finalPrice || 0),
        stockQty: Number(row.stockQty || 0),
        verifiedLocations: row.verifiedLocations || [],
      })),
    };

    try {
      setIsSaving(true);
      if (editingId) {
        await axios.put(`${API_URL}/api/products/${editingId}`, payload, authConfig);
      } else {
        await axios.post(`${API_URL}/api/products`, payload, authConfig);
      }
      await fetchAll();
      resetForm();
      alert(editingId ? 'Product updated successfully' : 'Product added successfully');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const onEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || '',
      description: product.description || '',
      brand: product.brand || '',
      categories: product.categories || [],
      subCategory: product.subCategory || '',
      itemType: product.itemType || '',
      featured: Boolean(product.featured),
      bestSeller: Boolean(product.bestSeller),
      farmerDetails: {
        name: product.farmerDetails?.name || '',
        contact: product.farmerDetails?.contact || '',
        location: product.farmerDetails?.location || '',
        email: product.farmerDetails?.email || '',
      },
      pincodePricing:
        (product.pincodePricing || []).map((row) => ({
          pincodesInput: (row.pincodes || []).join(', '),
          packSize: row.packSize || '',
          originalPrice: row.originalPrice || '',
          discount: row.discount || '',
          finalPrice: row.finalPrice || '',
          stockQty: row.stockQty || '',
          verifiedLocations: row.verifiedLocations || row.pincodes || [],
        })) || [{ ...defaultPricingRow }],
      images: product.images || [],
      videoUrl: product.videoUrl || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API_URL}/api/products/${id}`, authConfig);
      await fetchAll();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete product');
    }
  };

  const totalUnits = (rows) => rows.reduce((sum, row) => sum + Number(row.stockQty || 0), 0);

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-2xl font-black text-gray-900">Products</h3>
            <p className="text-sm text-gray-500">Create and manage product inventory with pincode-specific pricing.</p>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700">Product Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="mt-1 w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700">Brand</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-bold text-gray-700">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700">Category Selector</label>
              <div className="mt-1 flex gap-2">
                <select
                  value={selectedCategoryToAdd}
                  onChange={(e) => setSelectedCategoryToAdd(e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                  <option value="__create_new__">Create New Category</option>
                </select>
                <button type="button" onClick={handleAddCategory} className="px-4 py-2 rounded-lg bg-blue-600 text-white">
                  Add
                </button>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {form.categories.map((categoryName) => (
                  <span
                    key={categoryName}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold"
                  >
                    {categoryName}
                    <button type="button" onClick={() => removeCategory(categoryName)}>
                      x
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700">Sub-category</label>
              <select
                value={form.subCategory}
                onChange={(e) => setForm((prev) => ({ ...prev, subCategory: e.target.value }))}
                className="mt-1 w-full border rounded-lg px-3 py-2"
                disabled={form.categories.length === 0}
              >
                <option value="">Select sub-category</option>
                {allowedSubCategories.map((sub) => (
                  <option key={sub._id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700">Item Type</label>
              <select
                value={form.itemType}
                onChange={(e) => setForm((prev) => ({ ...prev, itemType: e.target.value }))}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select item type</option>
                {itemTypeOptions.map((itemType) => (
                  <option key={itemType} value={itemType}>
                    {itemType}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-6">
              <label className="inline-flex items-center gap-2 font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                />
                Featured
              </label>
              <label className="inline-flex items-center gap-2 font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={form.bestSeller}
                  onChange={(e) => setForm((prev) => ({ ...prev, bestSeller: e.target.checked }))}
                />
                Best Seller
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <h4 className="text-lg font-black text-gray-900">Farmer Details</h4>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={form.farmerDetails.name}
                onChange={(e) => setForm((prev) => ({ ...prev, farmerDetails: { ...prev.farmerDetails, name: e.target.value } }))}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Contact No"
                value={form.farmerDetails.contact}
                onChange={(e) => setForm((prev) => ({ ...prev, farmerDetails: { ...prev.farmerDetails, contact: e.target.value } }))}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Location"
                value={form.farmerDetails.location}
                onChange={(e) => setForm((prev) => ({ ...prev, farmerDetails: { ...prev.farmerDetails, location: e.target.value } }))}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.farmerDetails.email}
                onChange={(e) => setForm((prev) => ({ ...prev, farmerDetails: { ...prev.farmerDetails, email: e.target.value } }))}
                className="border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <h4 className="text-lg font-black text-gray-900">PINCODE PRICE & INVENTORY</h4>
            <div className="mt-4 space-y-3">
              {form.pincodePricing.map((row, index) => (
                <div key={`pricing-${index}`} className="grid grid-cols-1 md:grid-cols-8 gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <input
                    type="text"
                    placeholder="Target Pincodes (comma separated)"
                    value={row.pincodesInput}
                    onChange={(e) => setPricingRow(index, 'pincodesInput', e.target.value)}
                    className="md:col-span-2 border rounded px-2 py-1"
                  />
                  <input
                    type="text"
                    placeholder="Pack Size"
                    value={row.packSize}
                    onChange={(e) => setPricingRow(index, 'packSize', e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Original Price"
                    value={row.originalPrice}
                    onChange={(e) => setPricingRow(index, 'originalPrice', e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Discount %"
                    value={row.discount}
                    onChange={(e) => setPricingRow(index, 'discount', e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Final Price"
                    value={row.finalPrice}
                    onChange={(e) => setPricingRow(index, 'finalPrice', e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Stock Qty"
                    value={row.stockQty}
                    onChange={(e) => setPricingRow(index, 'stockQty', e.target.value)}
                    className="border rounded px-2 py-1"
                  />

                  <div className="md:col-span-8 flex items-center justify-between gap-3">
                    <div className="text-xs text-gray-600">
                      Verified Locations: {(row.verifiedLocations || []).join(', ') || 'None'}
                    </div>
                    {form.pincodePricing.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePricingRow(index)}
                        className="px-3 py-1 rounded bg-red-50 text-red-600 border border-red-100"
                      >
                        Remove Row
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addPricingRow}
              className="mt-3 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold"
            >
              + Add Pincode Specific Pricing
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700">Product Images (multi-file upload)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                className="mt-1 w-full border rounded-lg px-3 py-2"
                onChange={async (e) => {
                  const dataUrls = await toDataUrls(e.target.files);
                  setForm((prev) => ({ ...prev, images: dataUrls }));
                }}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {form.images.map((img, idx) => (
                  <img key={`img-${idx}`} src={img} alt={`product-${idx}`} className="w-16 h-16 rounded object-cover border" />
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700">Product Video (optional)</label>
              <input
                type="file"
                accept="video/*"
                className="mt-1 w-full border rounded-lg px-3 py-2"
                onChange={async (e) => {
                  const dataUrls = await toDataUrls(e.target.files);
                  setForm((prev) => ({ ...prev, videoUrl: dataUrls[0] || '' }));
                }}
              />
              {form.videoUrl && (
                <video src={form.videoUrl} controls className="mt-2 w-full max-h-40 rounded border" />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h4 className="text-xl font-black text-gray-900">Active Inventory</h4>
        {loading ? (
          <p className="mt-3 text-sm text-gray-600">Loading inventory...</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {products.map((product) => (
              <article key={product._id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
                <div className="flex gap-3">
                  <img
                    src={product.images?.[0] || '/logo.jpg'}
                    alt={product.name}
                    className="w-24 h-24 rounded-lg object-cover border"
                  />
                  <div className="flex-1">
                    <h5 className="text-lg font-black text-gray-900">{product.name}</h5>
                    <p className="text-xs text-gray-500 mt-1">Category: {(product.categories || []).join(', ') || '-'}</p>
                    <div className="mt-2 text-sm text-gray-700 space-y-1">
                      {(product.pincodePricing || []).map((row, idx) => (
                        <p key={`variant-${product._id}-${idx}`}>
                          {row.packSize || 'Pack'}: INR {Number(row.finalPrice || 0).toLocaleString('en-IN')} ({Number(row.stockQty || 0)})
                        </p>
                      ))}
                    </div>
                    <p className="text-sm font-semibold text-gray-800 mt-2">Total Units: {totalUnits(product.pincodePricing || [])}</p>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="flex-1 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                  >
                    EDIT
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(product._id)}
                    className="flex-1 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
                  >
                    DEL
                  </button>
                </div>
              </article>
            ))}

            {products.length === 0 && <p className="text-sm text-gray-600">No products added yet.</p>}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminProducts;
