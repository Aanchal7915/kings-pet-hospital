import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { triggerToast } from '../utils/Toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const statusTabs = ['all', 'confirmed', 'completed', 'rejected', 'cancelled', 'cancelled_refunded'];
const statusLabels = {
  all: 'All',
  confirmed: 'Confirmed',
  completed: 'Completed',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  cancelled_refunded: 'Cancelled & Refunded',
  rejected_refunded: 'Rejected & Refunded',
};

const bookingBadge = {
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
  cancelled: 'bg-orange-100 text-orange-700',
  cancelled_refunded: 'bg-gray-100 text-gray-700',
  rejected_refunded: 'bg-gray-100 text-gray-700',
};

const paymentBadge = {
  advance_paid: 'bg-amber-100 text-amber-700',
  fully_paid: 'bg-emerald-100 text-emerald-700',
  refunded: 'bg-gray-100 text-gray-700',
};

const toDateKey = (value) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const AdminBookings = () => {
  const token = useMemo(() => localStorage.getItem('adminToken'), []);
  const authConfig = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  const [tab, setTab] = useState('bookings');
  const [status, setStatus] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [search, setSearch] = useState('');
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [slotForm, setSlotForm] = useState({ fromDate: '', toDate: '', startTime: '09:00', endTime: '18:00', intervalMinutes: 30, capacity: 1 });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusModal, setStatusModal] = useState({ open: false, booking: null, nextStatus: '', note: '' });
  const [rescheduleModal, setRescheduleModal] = useState({ open: false, booking: null, slotId: '', note: '' });

  const fetchServices = async () => {
    const { data } = await axios.get(`${API_URL}/api/catalog/services?includeInactive=true`, authConfig);
    setServices(data.data || []);
  };

  const fetchAdvance = async () => {
    const { data } = await axios.get(`${API_URL}/api/settings/advance-amount`);
    setAdvanceAmount(String(data?.data?.value ?? ''));
  };

  const fetchBookings = async () => {
    const params = new URLSearchParams();
    if (status !== 'all') params.append('status', status);
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (search) params.append('search', search);
    const { data } = await axios.get(`${API_URL}/api/bookings/admin?${params.toString()}`, authConfig);
    setBookings(data.data || []);
  };

  const fetchSlots = async () => {
    const { data } = await axios.get(`${API_URL}/api/slots?includeBlocked=true`, authConfig);
    setSlots(data.data || []);
  };

  useEffect(() => {
    fetchBookings().catch((error) => triggerToast(error.response?.data?.error || 'Failed to load bookings', 'error'));
    fetchServices().catch(() => {});
    fetchAdvance().catch(() => {});
    fetchSlots().catch(() => {});
  }, [status, from, to, search]);

  useEffect(() => {
    if (tab === 'slots') {
      fetchSlots().catch((error) => triggerToast(error.response?.data?.error || 'Failed to load slots', 'error'));
    }
  }, [tab]);

  const saveAdvance = async () => {
    try {
      await axios.put(`${API_URL}/api/settings/advance-amount`, { value: Number(advanceAmount) }, authConfig);
      triggerToast('Advance amount updated', 'success');
    } catch (error) {
      triggerToast(error.response?.data?.error || 'Failed to update advance amount', 'error');
    }
  };

  const generateSlots = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/api/slots/generate`, slotForm, authConfig);
      triggerToast(`Generated ${data.created || 0} slots`, 'success');
      fetchSlots();
    } catch (error) {
      triggerToast(error.response?.data?.error || 'Failed to generate slots', 'error');
    }
  };

  const toggleSlot = async (slot) => {
    try {
      await axios.put(`${API_URL}/api/slots/${slot._id}/block`, { isBlocked: !slot.isBlocked }, authConfig);
      fetchSlots();
    } catch (error) {
      triggerToast(error.response?.data?.error || 'Failed to update slot', 'error');
    }
  };

  const deleteSlot = async (slotId) => {
    try {
      await axios.delete(`${API_URL}/api/slots/${slotId}`, authConfig);
      fetchSlots();
    } catch (error) {
      triggerToast(error.response?.data?.error || 'Failed to delete slot', 'error');
    }
  };

  const openStatusModal = (booking, nextStatus) => setStatusModal({ open: true, booking, nextStatus, note: '' });
  const submitStatus = async () => {
    try {
      await axios.patch(`${API_URL}/api/bookings/admin/${statusModal.booking._id}/status`, { status: statusModal.nextStatus, note: statusModal.note }, authConfig);
      triggerToast('Status updated', 'success');
      setStatusModal({ open: false, booking: null, nextStatus: '', note: '' });
      fetchBookings();
    } catch (error) {
      triggerToast(error.response?.data?.error || 'Failed to update status', 'error');
    }
  };

  const markRemaining = async (booking) => {
    try {
      await axios.patch(`${API_URL}/api/bookings/admin/${booking._id}/mark-remaining-received`, {}, authConfig);
      triggerToast('Marked remaining amount received', 'success');
      fetchBookings();
    } catch (error) {
      triggerToast(error.response?.data?.error || 'Failed to update payment', 'error');
    }
  };

  const openRescheduleModal = async (booking) => {
    setRescheduleModal({ open: true, booking, slotId: '', note: '' });
  };

  const submitReschedule = async () => {
    try {
      await axios.patch(`${API_URL}/api/bookings/admin/${rescheduleModal.booking._id}/reschedule`, { newSlotId: rescheduleModal.slotId, note: rescheduleModal.note }, authConfig);
      triggerToast('Booking rescheduled', 'success');
      setRescheduleModal({ open: false, booking: null, slotId: '', note: '' });
      fetchBookings();
      fetchSlots();
    } catch (error) {
      triggerToast(error.response?.data?.error || 'Failed to reschedule', 'error');
    }
  };

  const futureSlots = slots.filter((slot) => {
    const slotDate = new Date(`${toDateKey(slot.date)}T${slot.startTime}:00`);
    return slotDate >= new Date() && !slot.isBlocked && Number(slot.bookedCount) < Number(slot.capacity);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 bg-white rounded-2xl border border-gray-100 p-2 shadow-sm">
        <button onClick={() => setTab('bookings')} className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === 'bookings' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>Bookings</button>
        <button onClick={() => setTab('slots')} className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === 'slots' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>Manage Slots</button>
        <button onClick={() => setTab('settings')} className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === 'settings' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>Settings</button>
      </div>

      {tab === 'settings' && (
        <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm max-w-xl">
          <h3 className="text-xl font-black text-gray-900">Global Advance Payment</h3>
          <p className="text-sm text-gray-500 mt-1">Applies to all services unless a service has a custom override.</p>
          <div className="mt-4 flex gap-3">
            <input type="number" min="0" value={advanceAmount} onChange={(e) => setAdvanceAmount(e.target.value)} className="flex-1 border rounded-lg px-3 py-2" />
            <button onClick={saveAdvance} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold">Save</button>
          </div>
        </section>
      )}

      {tab === 'slots' && (
        <section className="space-y-5">
          <form onSubmit={generateSlots} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3">
            <input type="date" value={slotForm.fromDate} onChange={(e) => setSlotForm((p) => ({ ...p, fromDate: e.target.value }))} className="border rounded-lg px-3 py-2" required />
            <input type="date" value={slotForm.toDate} onChange={(e) => setSlotForm((p) => ({ ...p, toDate: e.target.value }))} className="border rounded-lg px-3 py-2" required />
            <input type="time" value={slotForm.startTime} onChange={(e) => setSlotForm((p) => ({ ...p, startTime: e.target.value }))} className="border rounded-lg px-3 py-2" required />
            <input type="time" value={slotForm.endTime} onChange={(e) => setSlotForm((p) => ({ ...p, endTime: e.target.value }))} className="border rounded-lg px-3 py-2" required />
            <select value={slotForm.intervalMinutes} onChange={(e) => setSlotForm((p) => ({ ...p, intervalMinutes: Number(e.target.value) }))} className="border rounded-lg px-3 py-2 bg-white">
              {[15, 30, 45, 60].map((min) => <option key={min} value={min}>{min} min</option>)}
            </select>
            <input type="number" min="1" value={slotForm.capacity} onChange={(e) => setSlotForm((p) => ({ ...p, capacity: Number(e.target.value) }))} className="border rounded-lg px-3 py-2" required />
            <button className="md:col-span-3 px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold">Generate Slots</button>
          </form>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            {slots.length === 0 ? (
              <p className="text-gray-500">No slots loaded.</p>
            ) : (
              slots.map((slot) => (
                <div key={slot._id} className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <p className="font-bold text-gray-900">{new Date(slot.date).toLocaleDateString()} {slot.startTime} - {slot.endTime}</p>
                    <p className="text-sm text-gray-500">{slot.bookedCount}/{slot.capacity} booked</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleSlot(slot)} className="px-3 py-1 rounded-lg bg-amber-500 text-white text-sm font-bold">{slot.isBlocked ? 'Unblock' : 'Block'}</button>
                    {Number(slot.bookedCount) === 0 && <button onClick={() => deleteSlot(slot._id)} className="px-3 py-1 rounded-lg bg-rose-600 text-white text-sm font-bold">Delete</button>}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {tab === 'bookings' && (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 space-y-4">
            <div className="flex flex-wrap gap-2">
              {statusTabs.map((tabStatus) => (
                <button key={tabStatus} onClick={() => setStatus(tabStatus)} className={`px-3 py-2 rounded-full text-sm font-semibold border ${status === tabStatus ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-700'}`}>
                  {statusLabels[tabStatus]}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border rounded-lg px-3 py-2" />
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border rounded-lg px-3 py-2" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="border rounded-lg px-3 py-2 md:col-span-2" placeholder="Search by name, phone, or booking ID" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Booking</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Service</th>
                  <th className="px-4 py-3 text-left">Slot</th>
                  <th className="px-4 py-3 text-left">Payment</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td className="px-4 py-4 text-gray-500" colSpan={7}>No bookings found.</td></tr>
                ) : bookings.map((booking) => (
                  <React.Fragment key={booking._id}>
                    <tr className="border-t border-gray-100 align-top">
                      <td className="px-4 py-3 font-bold text-gray-900">{booking.bookingId}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold">{booking.customer?.name}</p>
                        <p className="text-gray-500">{booking.customer?.phone}</p>
                        <p className="text-gray-500">{booking.customer?.petName} / {booking.customer?.petType}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold">{booking.service?.name || booking.service?.ref?.name}</p>
                        <p className="text-gray-500">{booking.variant?.name}</p>
                        <p className="text-gray-500">Advance ₹{Number(booking.advancePaid || 0).toLocaleString('en-IN')} | Remaining ₹{Number(booking.remainingAmount || 0).toLocaleString('en-IN')}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p>{booking.slot?.date ? new Date(booking.slot.date).toLocaleDateString() : '-'}</p>
                        <p className="text-gray-500">{booking.slot?.startTime} - {booking.slot?.endTime}</p>
                      </td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${paymentBadge[booking.paymentStatus] || 'bg-gray-100'}`}>{booking.paymentStatus}</span></td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${bookingBadge[booking.bookingStatus] || 'bg-gray-100'}`}>{booking.bookingStatus}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {booking.bookingStatus === 'confirmed' && <button onClick={() => openStatusModal(booking, 'completed')} className="px-2 py-1 rounded bg-emerald-600 text-white text-xs font-bold">Mark Completed</button>}
                          {booking.bookingStatus === 'confirmed' && <button onClick={() => openStatusModal(booking, 'rejected')} className="px-2 py-1 rounded bg-rose-600 text-white text-xs font-bold">Reject</button>}
                          {booking.bookingStatus === 'confirmed' && <button onClick={() => openStatusModal(booking, 'rejected_refunded')} className="px-2 py-1 rounded bg-gray-700 text-white text-xs font-bold">Reject &amp; Refund</button>}
                          {booking.bookingStatus === 'confirmed' && <button onClick={() => openStatusModal(booking, 'cancelled')} className="px-2 py-1 rounded bg-orange-600 text-white text-xs font-bold">Cancel</button>}
                          {booking.bookingStatus === 'confirmed' && <button onClick={() => openStatusModal(booking, 'cancelled_refunded')} className="px-2 py-1 rounded bg-gray-700 text-white text-xs font-bold">Cancel &amp; Refund</button>}
                          {booking.bookingStatus !== 'completed' && booking.bookingStatus !== 'cancelled_refunded' && booking.bookingStatus !== 'rejected_refunded' && <button onClick={() => markRemaining(booking)} className="px-2 py-1 rounded bg-blue-600 text-white text-xs font-bold">Mark Remaining Received</button>}
                          {booking.bookingStatus !== 'completed' && booking.bookingStatus !== 'cancelled_refunded' && (
                            <button onClick={() => openRescheduleModal(booking)} className="px-2 py-1 rounded bg-amber-500 text-white text-xs font-bold">Reschedule</button>
                          )}
                          <button onClick={() => setSelectedBooking(selectedBooking?._id === booking._id ? null : booking)} className="px-2 py-1 rounded border border-gray-300 text-xs font-bold">{selectedBooking?._id === booking._id ? 'Collapse' : 'Expand'}</button>
                        </div>
                      </td>
                    </tr>
                    {selectedBooking?._id === booking._id && (
                      <tr className="bg-gray-50 border-t border-gray-100">
                        <td colSpan={7} className="px-4 py-4 text-sm">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-bold mb-2">Status History</h4>
                              <ul className="space-y-2">
                                {(booking.statusHistory || []).map((item, idx) => <li key={idx} className="text-gray-700">{item.status} - {new Date(item.changedAt || item.at || booking.createdAt).toLocaleString()} {item.note ? `(${item.note})` : ''}</li>)}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-bold mb-2">Booking Details</h4>
                              <p>Razorpay Order: {booking.razorpayOrderId}</p>
                              <p>Razorpay Payment: {booking.razorpayPaymentId}</p>
                              <p className="mt-2 text-gray-700">Note: {booking.adminNote || '-'}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {statusModal.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-5 space-y-4">
            <h3 className="text-xl font-black text-gray-900">Change status to {statusModal.nextStatus}?</h3>
            <textarea value={statusModal.note} onChange={(e) => setStatusModal((p) => ({ ...p, note: e.target.value }))} className="w-full border rounded-lg px-3 py-2" rows={4} placeholder="Optional note" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setStatusModal({ open: false, booking: null, nextStatus: '', note: '' })} className="px-4 py-2 rounded-lg border border-gray-300">Cancel</button>
              <button onClick={submitStatus} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {rescheduleModal.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-gray-900">Reschedule booking</h3>
            <div className="border rounded-xl p-4 bg-gray-50">
              <p className="text-sm font-semibold text-gray-700 mb-3">Select future slot</p>
              {futureSlots.length === 0 ? (
                <p className="text-sm text-gray-500">No future slots available right now.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                  {futureSlots.map((slot) => {
                    const isSelected = rescheduleModal.slotId === slot._id;
                    return (
                      <button
                        key={slot._id}
                        type="button"
                        onClick={() => setRescheduleModal((p) => ({ ...p, slotId: slot._id }))}
                        className={`text-left rounded-xl border px-4 py-3 transition-all ${isSelected ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100' : 'border-gray-200 bg-white hover:border-blue-300'}`}
                      >
                        <p className="font-bold text-gray-900">{new Date(slot.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">{slot.startTime} - {slot.endTime}</p>
                        <p className="text-xs text-gray-500 mt-1">{Math.max(Number(slot.capacity || 0) - Number(slot.bookedCount || 0), 0)} slots left</p>
                      </button>
                    );
                  })}
                </div>
              )}
              {rescheduleModal.slotId && (
                <p className="text-sm text-blue-700 font-semibold mt-3">Selected slot: {new Date(futureSlots.find((slot) => slot._id === rescheduleModal.slotId)?.date || Date.now()).toLocaleDateString()}</p>
              )}
            </div>
            <textarea value={rescheduleModal.note} onChange={(e) => setRescheduleModal((p) => ({ ...p, note: e.target.value }))} className="w-full border rounded-lg px-3 py-2" rows={4} placeholder="Optional note" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setRescheduleModal({ open: false, booking: null, slotId: '', note: '' })} className="px-4 py-2 rounded-lg border border-gray-300">Cancel</button>
              <button onClick={submitReschedule} className="px-4 py-2 rounded-lg bg-amber-500 text-white font-bold">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
