import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const PET_TYPES = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'];

const WhatsAppContactSection = () => {
  const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  const [form, setForm] = useState({
    name: '',
    phone: '',
    petName: '',
    petType: 'Dog',
    message: '',
  });
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!/^\d{10}$/.test(form.phone.trim())) next.phone = 'Enter valid 10 digit phone number';
    if (!form.petName.trim()) next.petName = 'Pet name is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const msg = `Hi! I'd like an appointment.\n\nName: ${form.name}\nPhone: ${form.phone}\nPet Name: ${form.petName}\nPet Type: ${form.petType}\nMessage: ${form.message}`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <section id="booking" className="py-16 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">Contact on WhatsApp</h2>
          <p className="text-gray-600 mt-2">Share your details and we will help you with appointments quickly.</p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 md:p-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name *</label>
              <input
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Enter your name"
              />
              {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
              <input
                value={form.phone}
                onChange={(e) => update('phone', e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="10 digit mobile number"
              />
              {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Pet Name *</label>
              <input
                value={form.petName}
                onChange={(e) => update('petName', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Enter pet name"
              />
              {errors.petName && <p className="text-xs text-rose-600 mt-1">{errors.petName}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Pet Type</label>
              <select
                value={form.petType}
                onChange={(e) => update('petType', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white"
              >
                {PET_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Message / Query (optional)</label>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Tell us your concern"
            />
          </div>

          <button type="submit" className="w-full md:w-auto px-6 py-3 rounded-full bg-emerald-600 text-white font-bold hover:bg-emerald-700 inline-flex items-center gap-2">
            <FaWhatsapp />
            Contact on WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
};

export default WhatsAppContactSection;
