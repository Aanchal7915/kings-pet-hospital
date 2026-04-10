import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { FaRegCalendarAlt, FaRegCommentDots, FaLock } from 'react-icons/fa';

const BookingForm = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    serviceId: '',
    preferredDate: '',
    notes: '',
  });

  const selectedService = useMemo(
    () => services.find((service) => service._id === form.serviceId) || null,
    [services, form.serviceId]
  );

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/catalog/services`);
        setServices(data?.data || []);
      } catch (_error) {
        setError('Unable to load services right now. Please try again shortly.');
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, [API_URL]);

  useEffect(() => {
    const onBookService = (event) => {
      const detail = event?.detail || {};
      if (!detail.serviceId) return;
      setForm((prev) => ({ ...prev, serviceId: detail.serviceId }));
    };

    window.addEventListener('book-service', onBookService);
    return () => window.removeEventListener('book-service', onBookService);
  }, []);

  const updateField = (field, value) => {
    setError('');
    setSuccess('');
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.customerName.trim()) return 'Please enter your full name.';
    if (!/^[0-9]{10}$/.test(form.phone.trim())) return 'Please enter a valid 10-digit mobile number.';
    if (!form.email.trim()) return 'Please enter your email address.';
    if (!form.serviceId) return 'Please select a service.';
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const payload = {
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        serviceId: form.serviceId,
        preferredDate: form.preferredDate || undefined,
        notes: form.notes.trim(),
      };

      const { data } = await axios.post(`${API_URL}/api/bookings`, payload);
      const bookingId = data?.data?._id;
      setSuccess(`Appointment request submitted${bookingId ? ` (ID: ${bookingId})` : ''}.`);
      setForm({
        customerName: '',
        phone: '',
        email: '',
        serviceId: '',
        preferredDate: '',
        notes: '',
      });
    } catch (submitError) {
      setError(submitError.response?.data?.error || 'Unable to submit appointment request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-xl bg-white/95">
      <div
        className="bg-linear-to-r from-blue-600 via-violet-600 to-indigo-700 animate-gradient text-white text-center py-3 px-4"
        style={{ backgroundSize: '220% 220%' }}
      >
        <h3 className="text-lg md:text-2xl font-black tracking-tight flex items-center justify-center gap-2">
          <FaRegCalendarAlt className="text-base md:text-lg" />
          Book Appointment
        </h3>
        <p className="text-white/90 mt-1 text-[11px] md:text-xs font-medium leading-none">Quick & Easy Booking</p>
      </div>

      <form onSubmit={handleSubmit} className="p-3 md:p-4 space-y-2.5">
        {error && <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>}
        {success && <div className="rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3 text-sm">{success}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] md:text-xs font-bold text-gray-700 mb-1">Your Name *</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full Name"
              value={form.customerName}
              onChange={(e) => updateField('customerName', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[11px] md:text-xs font-bold text-gray-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="10-digit Mobile"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
              required
            />
          </div>
          <div>
            <label className="block text-[11px] md:text-xs font-bold text-gray-700 mb-1">Email ID *</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[11px] md:text-xs font-bold text-gray-700 mb-1">Select Services *</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={form.serviceId}
              onChange={(e) => updateField('serviceId', e.target.value)}
              disabled={loadingServices}
              required
            >
              <option value="">{loadingServices ? 'Loading services...' : 'Choose...'}</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] md:text-xs font-bold text-gray-700 mb-1">Preferred Date (Optional)</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={form.preferredDate}
            onChange={(e) => updateField('preferredDate', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[11px] md:text-xs font-bold text-gray-700 mb-1">Notes (Optional)</label>
          <textarea
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Special requirements..."
            value={form.notes}
            onChange={(e) => updateField('notes', e.target.value)}
          />
        </div>

        {selectedService && (
          <p className="text-sm text-gray-500">
            Selected service: <span className="font-semibold text-gray-700">{selectedService.name}</span>
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || loadingServices}
          className="w-full bg-linear-to-r from-blue-600 via-violet-600 to-indigo-700 hover:from-blue-700 hover:via-violet-700 hover:to-indigo-800 text-white rounded-lg py-2.5 text-base md:text-lg font-black tracking-wide disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 animate-gradient"
          style={{ backgroundSize: '220% 220%' }}
        >
          <FaRegCommentDots className="text-sm md:text-base" />
          {submitting ? 'Booking...' : 'Book Now'}
        </button>

        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
          <FaLock />
          <span>Information secured & sent via WhatsApp</span>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
