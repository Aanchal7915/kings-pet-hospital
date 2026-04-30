import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem('userToken'), []);
  const API_URL = import.meta.env.VITE_API_URL || '';

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
    const liveToken = localStorage.getItem('userToken');
    const authHeaders = liveToken ? { Authorization: `Bearer ${liveToken}` } : {};
    try {
      const orderRes = await axios.post(`${API_URL}/api/bookings/create-order`, {
        serviceId: service._id,
        variantName: selectedVariant.variantName,
        slotId: selectedSlotId,
      }, {
        headers: authHeaders
      });

      const orderData = orderRes.data?.data;

      // Handle free bookings (no advance payment)
      if (orderData.isFree) {
        try {
          const verifyRes = await axios.post(`${API_URL}/api/bookings/verify-payment`, {
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: 'FREE',
            razorpay_signature: 'FREE',
            serviceId: service._id,
            variantName: selectedVariant.variantName,
            slotId: selectedSlotId,
            customer,
          }, {
            headers: authHeaders
          });

          const booking = verifyRes.data?.data;
          setConfirmation({
            bookingId: booking.bookingId,
            service: booking.service?.name || service.name,
            variant: booking.variant?.name,
            slot: booking.slot,
            advancePaid: booking.advancePaid,
            remainingAmount: booking.remainingAmount,
            paymentId: 'FREE',
          });
          triggerToast('Booking confirmed', 'success');
        } catch (verifyError) {
          triggerToast(verifyError.response?.data?.error || 'Booking failed', 'error');
        } finally {
          setProcessing(false);
        }
        return;
      }

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
            }, {
              headers: authHeaders
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
  const configuredAdvance = Number(
    selectedVariant?.bookingAmount ||
      (service?.useCustomAdvance ? service.customAdvanceAmount : globalAdvance) ||
      0
  );
  const advanceAmount = configuredAdvance > 0 ? Math.min(configuredAdvance, fullPrice) : fullPrice;
  const remainingAmount = Math.max(fullPrice - advanceAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <Header showHero={false} />

      <main className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {confirmation ? (
          <section className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 md:p-12 max-w-2xl mx-auto text-center animate-in fade-in zoom-in duration-300">
            <div className="inline-flex w-20 h-20 rounded-full bg-emerald-100 items-center justify-center mb-6">
              <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600 mb-8">Your appointment has been successfully scheduled.</p>

            <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-4 mb-8">
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Booking ID</span>
                <span className="text-sm font-black text-blue-700">{confirmation.bookingId}</span>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-black text-gray-800">{confirmation.service}</p>
                <p className="text-xs font-semibold text-gray-500">Variant: {confirmation.variant}</p>
              </div>

              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Appointment Slot</p>
                  <p className="text-sm font-bold text-gray-700">
                    {new Date(confirmation.slot?.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {confirmation.slot?.startTime}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <p className="text-[10px] text-emerald-600 font-bold uppercase mb-1">Paid Advance</p>
                  <p className="text-lg font-black text-emerald-700">₹{Number(confirmation.advancePaid || 0).toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                  <p className="text-[10px] text-amber-600 font-bold uppercase mb-1">Due at Clinic</p>
                  <p className="text-lg font-black text-amber-700">₹{Number(confirmation.remainingAmount || 0).toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/my-bookings" className="px-8 py-3 rounded-xl bg-blue-600 text-white font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                View My Bookings
              </Link>
              <button onClick={() => window.location.reload()} className="px-8 py-3 rounded-xl bg-gray-100 text-gray-700 font-black hover:bg-gray-200 transition-all">
                Close
              </button>
            </div>
            
            <p className="text-[10px] text-gray-400 mt-8 uppercase font-bold tracking-widest">Kings Pet Hospital • Reliable Care Since 2019</p>
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
              <div className="flex flex-col items-start">
                <h1 className="text-3xl font-bold text-gray-800 text-gradient-animate underline-animate mb-2">{service.name}</h1>
                <span className="inline-flex px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">{service.category?.name}</span>
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
                <input
                  type="date"
                  className="w-full border rounded-lg px-3 py-2 bg-white"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlotId('');
                  }}
                />


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
                className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-black hover:from-blue-700 hover:to-violet-700 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
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
