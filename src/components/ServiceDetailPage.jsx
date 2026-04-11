import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ToastContainer, { triggerToast } from './utils/Toast';

const PET_TYPES = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'];

const toDateKey = (value) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const loadRazorpay = () => new Promise((resolve) => {
  if (window.Razorpay) {
    resolve(true);
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [service, setService] = useState(null);
  const [selectedVariantName, setSelectedVariantName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [allSlots, setAllSlots] = useState([]);
  const [globalAdvance, setGlobalAdvance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    petName: '',
    petType: 'Dog',
    petBreed: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const from = new Date();
        const to = new Date();
        to.setDate(from.getDate() + 30);

        const [serviceRes, slotsRes, advanceRes] = await Promise.all([
          axios.get(`${API_URL}/api/catalog/services/slug/${slug}`),
          axios.get(`${API_URL}/api/slots/available?fromDate=${from.toISOString().slice(0, 10)}&toDate=${to.toISOString().slice(0, 10)}`),
          axios.get(`${API_URL}/api/settings/advance-amount`),
        ]);

        const fetchedService = serviceRes.data?.data;
        setService(fetchedService);
        const firstVariant = fetchedService?.variants?.find((variant) => variant.isActive !== false);
        setSelectedVariantName(firstVariant?.variantName || '');
        setAllSlots(Array.isArray(slotsRes.data?.data) ? slotsRes.data.data : []);
        setGlobalAdvance(Number(advanceRes.data?.data?.value || 0));
      } catch (_error) {
        triggerToast('Unable to load service details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL, slug]);

  const selectedVariant = useMemo(
    () => service?.variants?.find((variant) => variant.variantName === selectedVariantName) || null,
    [service, selectedVariantName]
  );

  const availableDates = useMemo(() => {
    const dates = new Set();
    allSlots.forEach((slot) => {
      dates.add(toDateKey(slot.date));
    });
    return Array.from(dates).sort();
  }, [allSlots]);

  useEffect(() => {
    if (selectedDate && !availableDates.includes(selectedDate)) {
      setSelectedDate('');
      setSelectedSlotId('');
    }
  }, [availableDates, selectedDate]);

  const dateSlots = useMemo(() => {
    if (!selectedDate) return [];
    return allSlots.filter((slot) => toDateKey(slot.date) === selectedDate);
  }, [allSlots, selectedDate]);

  const validate = () => {
    if (!customer.name.trim()) return 'Name is required';
    if (!/^\d{10}$/.test(customer.phone.trim())) return 'Phone must be 10 digits';
    if (!customer.petName.trim()) return 'Pet name is required';
    if (!selectedVariant) return 'Select a variant';
    if (!selectedSlotId) return 'Select a slot';
    return '';
  };

  const handlePay = async () => {
    const error = validate();
    if (error) {
      triggerToast(error, 'error');
      return;
    }

    setProcessing(true);
    try {
      const orderRes = await axios.post(`${API_URL}/api/bookings/create-order`, {
        serviceId: service._id,
        variantName: selectedVariant.variantName,
        slotId: selectedSlotId,
      });

      const orderData = orderRes.data?.data;
      const ok = await loadRazorpay();
      if (!ok) {
        triggerToast('Unable to load Razorpay checkout', 'error');
        setProcessing(false);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'Kings Pet Hospital',
        description: service.name,
        prefill: {
          name: customer.name,
          contact: customer.phone,
        },
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(`${API_URL}/api/bookings/verify-payment`, {
              ...response,
              serviceId: service._id,
              variantName: selectedVariant.variantName,
              slotId: selectedSlotId,
              customer,
            });

            const booking = verifyRes.data?.data;
            setConfirmation({
              bookingId: booking.bookingId,
              service: booking.service?.name || service.name,
              variant: booking.variant?.name,
              slot: booking.slot,
              advancePaid: booking.advancePaid,
              remainingAmount: booking.remainingAmount,
              paymentId: booking.razorpayPaymentId,
            });
            triggerToast('Booking confirmed', 'success');
          } catch (verifyError) {
            triggerToast(verifyError.response?.data?.error || 'Payment verification failed', 'error');
          } finally {
            setProcessing(false);
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (orderError) {
      triggerToast(orderError.response?.data?.error || 'Unable to create payment order', 'error');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showHero={false} />
        <main className="pt-28 pb-16 max-w-7xl mx-auto px-4">Loading service...</main>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showHero={false} />
        <main className="pt-28 pb-16 max-w-7xl mx-auto px-4">Service not found.</main>
        <Footer />
      </div>
    );
  }

  const fullPrice = Number(selectedVariant?.price || 0);
  const advanceAmount = Number(
    selectedVariant?.bookingAmount ||
      (service?.useCustomAdvance ? service.customAdvanceAmount : globalAdvance) ||
      0
  );
  const remainingAmount = Math.max(fullPrice - advanceAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <Header showHero={false} />

      <main className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {confirmation ? (
          <section className="bg-white rounded-2xl border border-emerald-200 p-6 space-y-3 max-w-3xl mx-auto">
            <h1 className="text-2xl font-black text-emerald-700">Booking Confirmed</h1>
            <p>Booking ID: <strong>{confirmation.bookingId}</strong></p>
            <p>Service: <strong>{confirmation.service}</strong></p>
            <p>Variant: <strong>{confirmation.variant}</strong></p>
            <p>
              Slot: <strong>{new Date(confirmation.slot?.date).toLocaleDateString()} {confirmation.slot?.startTime} - {confirmation.slot?.endTime}</strong>
            </p>
            <p>Advance Paid: <strong>₹{Number(confirmation.advancePaid || 0).toLocaleString('en-IN')}</strong></p>
            <p>Remaining Amount: <strong>₹{Number(confirmation.remainingAmount || 0).toLocaleString('en-IN')}</strong></p>
            <p>Payment ID: <strong>{confirmation.paymentId}</strong></p>
          </section>
        ) : (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <img
                src={selectedVariant?.image || '/logo.jpg'}
                alt={service.name}
                className="w-full h-96 object-cover rounded-2xl border border-gray-200"
                onError={(e) => {
                  if (e.currentTarget.src.endsWith('/logo.jpg')) return;
                  e.currentTarget.src = '/logo.jpg';
                }}
              />
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {(service.variants || []).map((variant) => (
                  <button
                    key={variant.variantName}
                    type="button"
                    onClick={() => setSelectedVariantName(variant.variantName)}
                    className={`rounded-lg border ${selectedVariantName === variant.variantName ? 'border-blue-600' : 'border-gray-200'}`}
                  >
                    <img src={variant.image || '/logo.jpg'} alt={variant.variantName} className="w-20 h-20 object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="inline-flex px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">{service.category?.name}</span>
                <h1 className="text-3xl font-black text-gray-900 mt-2">{service.name}</h1>
              </div>

              <div className="flex flex-wrap gap-2">
                {(service.variants || []).map((variant) => (
                  <button
                    key={variant.variantName}
                    onClick={() => setSelectedVariantName(variant.variantName)}
                    className={`px-3 py-2 rounded-full border text-sm font-semibold ${selectedVariantName === variant.variantName ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-700'}`}
                  >
                    {variant.variantName}
                  </button>
                ))}
              </div>

              <p className="text-gray-600">{selectedVariant?.description || service.description}</p>

              <div className="rounded-xl border border-gray-200 p-4 bg-white">
                <p className="text-gray-700">Full Price: <strong>₹{fullPrice.toLocaleString('en-IN')}</strong></p>
                <p className="text-emerald-700">Advance payable now: <strong>₹{advanceAmount.toLocaleString('en-IN')}</strong></p>
                <p className="text-gray-600">Remaining ₹{remainingAmount.toLocaleString('en-IN')} to be paid at clinic.</p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4 bg-white space-y-3">
                <label className="block text-sm font-semibold text-gray-700">Select Date</label>
                <select
                  className="w-full border rounded-lg px-3 py-2"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlotId('');
                  }}
                >
                  <option value="">Choose date</option>
                  {availableDates.map((date) => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                {!availableDates.length && (
                  <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    No booking dates are available yet. Please contact admin to generate slots.
                  </p>
                )}

                <label className="block text-sm font-semibold text-gray-700">Select Time Slot</label>
                <div className="flex flex-wrap gap-2">
                  {dateSlots.map((slot) => {
                    const left = Math.max(Number(slot.capacity || 0) - Number(slot.bookedCount || 0), 0);
                    return (
                      <button
                        key={slot._id}
                        onClick={() => setSelectedSlotId(slot._id)}
                        className={`px-3 py-2 rounded-full border text-sm ${selectedSlotId === slot._id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-700'}`}
                      >
                        {slot.startTime} {left > 1 ? `(${left} slots left)` : ''}
                      </button>
                    );
                  })}
                  {selectedDate && dateSlots.length === 0 && (
                    <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      No slots available on this date. Please choose another date.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="border rounded-lg px-3 py-2"
                  placeholder="Your Name *"
                  value={customer.name}
                  onChange={(e) => setCustomer((prev) => ({ ...prev, name: e.target.value }))}
                />
                <input
                  className="border rounded-lg px-3 py-2"
                  placeholder="Phone Number *"
                  value={customer.phone}
                  onChange={(e) => setCustomer((prev) => ({ ...prev, phone: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) }))}
                />
                <input
                  className="border rounded-lg px-3 py-2"
                  placeholder="Pet Name *"
                  value={customer.petName}
                  onChange={(e) => setCustomer((prev) => ({ ...prev, petName: e.target.value }))}
                />
                <select
                  className="border rounded-lg px-3 py-2 bg-white"
                  value={customer.petType}
                  onChange={(e) => setCustomer((prev) => ({ ...prev, petType: e.target.value }))}
                >
                  {PET_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <input
                  className="md:col-span-2 border rounded-lg px-3 py-2"
                  placeholder="Pet Breed (optional)"
                  value={customer.petBreed}
                  onChange={(e) => setCustomer((prev) => ({ ...prev, petBreed: e.target.value }))}
                />
              </div>

              <button
                disabled={processing}
                onClick={handlePay}
                className="w-full px-5 py-3 rounded-lg bg-emerald-600 text-white font-black hover:bg-emerald-700 disabled:opacity-60"
              >
                {processing ? 'Processing...' : `Confirm & Pay ₹${advanceAmount.toLocaleString('en-IN')}`}
              </button>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetailPage;
