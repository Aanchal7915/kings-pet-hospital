import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STATUS_BADGE = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-violet-100 text-violet-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-100 text-rose-700',
  cancelled_refunded: 'bg-rose-200 text-rose-800',
  rejected: 'bg-gray-100 text-gray-700',
  rejected_refunded: 'bg-gray-200 text-gray-800',
};

const MyBookings = () => {
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem('userToken'), []);
  const userInfo = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('userInfo') || '{}'); } catch (_) { return {}; }
  }, []);

  const [orders, setOrders] = useState([]);
  const [serviceBookings, setServiceBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState('services'); // 'services', 'food', 'pets'

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    (async () => {
      try {
        const [ordersRes, bookingsRes] = await Promise.allSettled([
          axios.get(`${API_URL}/api/petorders/my`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/bookings/my`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        if (ordersRes.status === 'fulfilled') {
          setOrders(ordersRes.value.data.data || []);
        }
        if (bookingsRes.status === 'fulfilled') {
          setServiceBookings(bookingsRes.value.data.data || []);
        } else if (bookingsRes.reason?.response?.status !== 404) {
           console.error('Service bookings fetch error:', bookingsRes.reason);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('userToken');
          localStorage.removeItem('userInfo');
          navigate('/login');
          return;
        }
        setError(err.response?.data?.error || 'Failed to load your bookings');
      } finally {
        setLoading(false);
      }
    })();
  }, [token, navigate]);

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const foodOrders = orders.filter((o) => o.orderType === 'food');
  const petOrders = orders.filter((o) => o.orderType === 'pet');

  const renderServiceBookings = () => {
    if (serviceBookings.length === 0) {
      return (
        <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center">
          <p className="text-gray-500 mb-4">You don't have any service bookings yet.</p>
          <Link to="/services" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold">Browse Services</Link>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {serviceBookings.map((booking) => (
          <article key={booking._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-black text-gray-900">{booking.bookingId}</p>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    Service
                  </span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${STATUS_BADGE[booking.bookingStatus] || 'bg-gray-100 text-gray-700'}`}>
                    {booking.bookingStatus}
                  </span>
                </div>
                <p className="text-base font-bold text-gray-800">{booking.service?.name}</p>
                <p className="text-sm font-semibold text-gray-600">Variant: {booking.variant?.name}</p>
                {booking.slot && (
                  <p className="text-xs text-gray-500 mt-1">
                    Slot: {new Date(booking.slot.date).toLocaleDateString()} {booking.slot.startTime} - {booking.slot.endTime}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">Pet: {booking.customer?.petName} ({booking.customer?.petType})</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-blue-700">₹{Number(booking.variant?.fullPrice || 0).toLocaleString('en-IN')}</p>
                {Number(booking.advancePaid) > 0 && (
                  <>
                    <p className="text-xs text-gray-500">Advance ₹{Number(booking.advancePaid).toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-500">Remaining ₹{Number(booking.remainingAmount).toLocaleString('en-IN')}</p>
                  </>
                )}
              </div>
            </div>
            {booking.adminNote && (
              <p className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-600"><span className="font-bold text-gray-700">From admin: </span>{booking.adminNote}</p>
            )}
          </article>
        ))}
      </div>
    );
  };

  const renderPetOrders = (items, emptyMessage, browseLink, browseText) => {
    if (items.length === 0) {
      return (
        <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center">
          <p className="text-gray-500 mb-4">{emptyMessage}</p>
          <Link to={browseLink} className="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-bold">{browseText}</Link>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {items.map((order) => (
          <article key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-black text-gray-900">{order.orderId}</p>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${order.orderType === 'food' ? 'bg-orange-100 text-orange-700' : 'bg-violet-100 text-violet-700'}`}>
                    {order.orderType === 'food' ? 'Pet Food' : 'Pet Booking'}
                  </span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${STATUS_BADGE[order.status] || 'bg-gray-100 text-gray-700'}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-800 mt-1">{order.item?.name}</p>
                <p className="text-xs text-gray-500">{order.item?.petType}{order.item?.breed && ` • ${order.item.breed}`}{order.quantity > 1 && ` • Qty: ${order.quantity}`}</p>
                <p className="text-xs text-gray-500 mt-1">Placed: {new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-blue-700">₹{Number(order.totalPrice).toLocaleString('en-IN')}</p>
                {Number(order.bookingAmount) > 0 && (
                  <>
                    <p className="text-xs text-gray-500">Advance ₹{Number(order.bookingAmount).toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-500">Remaining ₹{Number(order.remainingAmount).toLocaleString('en-IN')}</p>
                  </>
                )}
              </div>
            </div>

            {(order.customer?.address || order.customer?.city) && (
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
                <span className="font-bold text-gray-700">Address: </span>
                {[order.customer.address, order.customer.city].filter(Boolean).join(', ')}
              </div>
            )}
            {order.message && (
              <p className="mt-1 text-xs text-gray-600"><span className="font-bold text-gray-700">Note: </span>{order.message}</p>
            )}
            {order.adminNote && (
              <p className="mt-1 text-xs text-gray-600"><span className="font-bold text-gray-700">From admin: </span>{order.adminNote}</p>
            )}
          </article>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showHero={false} />
      <main className="pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gradient-animate tracking-tight leading-none mb-3 relative inline-block">
                My Bookings
                <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full underline-animate"></span>
              </h1>
              {userInfo?.name && <p className="text-sm text-gray-500 mt-2">Hi {userInfo.name}, here are your orders & bookings</p>}
            </div>
            <button onClick={logout} className="px-5 py-2.5 rounded-xl bg-rose-50 text-rose-600 font-bold border border-rose-100 hover:bg-rose-600 hover:text-white transition-all text-sm shadow-sm">
              Logout
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 mb-4 border-b border-gray-200">
            <button 
              onClick={() => setCurrentTab('services')}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${currentTab === 'services' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              Service Bookings
            </button>
            <button 
              onClick={() => setCurrentTab('food')}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${currentTab === 'food' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              Pet Food Orders
            </button>
            <button 
              onClick={() => setCurrentTab('pets')}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${currentTab === 'pets' ? 'bg-violet-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              Pet Bookings
            </button>
          </div>

          {loading ? (
            <p className="text-gray-500 text-center py-10">Loading...</p>
          ) : error ? (
            <p className="text-rose-600 text-center py-10">{error}</p>
          ) : (
            <>
              {currentTab === 'services' && renderServiceBookings()}
              {currentTab === 'food' && renderPetOrders(foodOrders, "You don't have any pet food orders yet.", "/pet-foods", "Browse Pet Foods")}
              {currentTab === 'pets' && renderPetOrders(petOrders, "You haven't booked any pets yet.", "/pets-for-sale", "Browse Pets For Sale")}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyBookings;
