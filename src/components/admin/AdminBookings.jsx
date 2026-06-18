import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { FaPen, FaChevronDown, FaChevronRight, FaTrash } from 'react-icons/fa';
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
  const [autoConfig, setAutoConfig] = useState({ enabled: false, startTime: '', endTime: '', intervalMinutes: '', capacity: '', daysAhead: '' });
  const [savingAuto, setSavingAuto] = useState(false);
  const [slotFilterDate, setSlotFilterDate] = useState('');
  const [slotFilterTime, setSlotFilterTime] = useState('');
  const [deletingIds, setDeletingIds] = useState([]);
  const [expandedDates, setExpandedDates] = useState({});
  const [slotEditModal, setSlotEditModal] = useState({ open: false, slot: null, startTime: '', endTime: '', capacity: 1 });
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

  const fetchAutoConfig = async () => {
    // Only sync the On/Off state — keep the input fields blank so the form is always
    // fresh for entering a new schedule. The saved schedule lives in the DB and keeps
    // generating slots daily regardless of what's shown here.
    const { data } = await axios.get(`${API_URL}/api/slots/auto-config`, authConfig);
    if (data?.data) setAutoConfig((prev) => ({ ...prev, enabled: !!data.data.enabled }));
  };

  useEffect(() => {
    fetchBookings().catch((error) => triggerToast(error.response?.data?.error || 'Failed to load bookings', 'error'));
    fetchServices().catch(() => { });
    fetchAdvance().catch(() => { });
    fetchSlots().catch(() => { });
    fetchAutoConfig().catch(() => { });
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

  const saveAutoConfig = async () => {
    if (autoConfig.enabled && (!autoConfig.startTime || !autoConfig.endTime || !autoConfig.intervalMinutes || !autoConfig.capacity || !autoConfig.daysAhead)) {
      triggerToast('Please fill all fields before saving', 'error');
      return;
    }
    setSavingAuto(true);
    try {
      const { data } = await axios.put(`${API_URL}/api/slots/auto-config`, autoConfig, authConfig);
      const savedEnabled = data?.data?.enabled ?? autoConfig.enabled;
      const created = data?.generated?.created || 0;
      triggerToast(
        autoConfig.enabled
          ? `Auto slot generation saved${created ? ` — ${created} new slot${created === 1 ? '' : 's'} created` : ''}. View them under Manage Slots.`
          : 'Auto slot generation turned off',
        'success'
      );
      // Clear the form after saving — the generated slots are visible under Manage Slots.
      // Toggle stays in sync so you can still see whether auto-generation is On/Off.
      setAutoConfig({ enabled: savedEnabled, startTime: '', endTime: '', intervalMinutes: '', capacity: '', daysAhead: '' });
      fetchSlots();
    } catch (error) {
      triggerToast(error.response?.data?.error || 'Failed to save auto slot settings', 'error');
    } finally {
      setSavingAuto(false);
    }
  };

  const generateSlots = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/api/slots/generate`, slotForm, authConfig);
      const created = data.created || 0;

      // Re-fetch slots and detect how many already exist for the requested date & time.
      // Works even with older backends that only return `created` (no skipped/total).
      const { data: slotData } = await axios.get(`${API_URL}/api/slots?includeBlocked=true`, authConfig);
      const allSlots = slotData.data || [];
      setSlots(allSlots);
      const existingInRange = allSlots.filter((slot) => {
        const key = toDateKey(slot.date);
        return key >= slotForm.fromDate && key <= slotForm.toDate
          && slot.startTime >= slotForm.startTime && slot.endTime <= slotForm.endTime;
      }).length;

      if (created > 0) {
        const already = Math.max(existingInRange - created, 0);
        triggerToast(`Generated ${created} new slot${created === 1 ? '' : 's'}${already ? ` — ${already} already existed` : ''}`, 'success');
        // Clear the entered dates after a successful generation so the form is ready for the next range.
        setSlotForm((prev) => ({ ...prev, fromDate: '', toDate: '' }));
      } else if (existingInRange > 0) {
        triggerToast(`Slots already available for this date & time (${existingInRange} slot${existingInRange === 1 ? '' : 's'}). Please choose a different date.`, 'info');
      } else {
        triggerToast('No slots generated — check the date and time range', 'error');
      }
    } catch (error) {
      triggerToast(error.response?.data?.error || 'Failed to generate slots', 'error');
    }
  };

  const toggleSlot = async (slot) => {
    try {
      await axios.put(`${API_URL}/api/slots/${slot._id}/block`, { isBlocked: !slot.isBlocked }, authConfig);
      triggerToast(!slot.isBlocked ? 'Slot blocked' : 'Slot unblocked', 'success');
      fetchSlots();
    } catch (error) {
      triggerToast(error.response?.data?.error || 'Failed to update slot', 'error');
    }
  };

  const deleteSlot = async (slotId) => {
    if (deletingIds.includes(slotId)) return; // guard against double-click
    setDeletingIds((prev) => [...prev, slotId]);
    try {
      await axios.delete(`${API_URL}/api/slots/${slotId}`, authConfig);
      triggerToast('Slot deleted', 'success');
      fetchSlots();
    } catch (error) {
      if (error.response?.status === 404) {
        // Slot already gone (e.g. a double-click) — treat as success, just refresh.
        fetchSlots();
      } else {
        triggerToast(error.response?.data?.error || 'Failed to delete slot', 'error');
      }
    } finally {
      setDeletingIds((prev) => prev.filter((id) => id !== slotId));
    }
  };

  const toggleDateGroup = (key) => setExpandedDates((prev) => ({ ...prev, [key]: !prev[key] }));

  const deleteDate = async (key) => {
    const group = slotGroups[key] || [];
    const deletable = group.filter((s) => Number(s.bookedCount) === 0);
    if (deletable.length === 0) {
      triggerToast('No deletable slots for this date (all have bookings)', 'info');
      return;
    }
    if (!window.confirm(`Delete all ${deletable.length} slot${deletable.length === 1 ? '' : 's'} for this date?`)) return;
    const results = await Promise.allSettled(
      deletable.map((s) => axios.delete(`${API_URL}/api/slots/${s._id}`, authConfig))
    );
    // Count 404 (already deleted) as success too.
    const ok = results.filter((r) => r.status === 'fulfilled' || r.reason?.response?.status === 404).length;
    triggerToast(`Deleted ${ok} slot${ok === 1 ? '' : 's'} for this date`, ok > 0 ? 'success' : 'error');
    fetchSlots();
  };

  const openSlotEdit = (slot) => setSlotEditModal({ open: true, slot, startTime: slot.startTime, endTime: slot.endTime, capacity: Number(slot.capacity) });

  const submitSlotEdit = async () => {
    const { slot, startTime, endTime, capacity } = slotEditModal;
    if (Number(capacity) < Number(slot.bookedCount)) {
      triggerToast(`Capacity can't be less than ${slot.bookedCount} already booked`, 'error');
      return;
    }
    try {
      await axios.put(`${API_URL}/api/slots/${slot._id}`, { startTime, endTime, capacity: Number(capacity) }, authConfig);
      triggerToast('Slot updated', 'success');
      setSlotEditModal({ open: false, slot: null, startTime: '', endTime: '', capacity: 1 });
      fetchSlots();
    } catch (error) {
      triggerToast(error.response?.data?.error || 'Failed to update slot', 'error');
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

  // Slots filtered by the selected date and/or time, grouped by day (for the collapsible list).
  const filteredSlots = slots.filter((slot) => {
    if (slotFilterDate && toDateKey(slot.date) !== slotFilterDate) return false;
    // Match slots whose time window contains the selected time (e.g. 09:10 → 09:00-09:20).
    if (slotFilterTime && !(slot.startTime <= slotFilterTime && slotFilterTime < slot.endTime)) return false;
    return true;
  });
  const slotGroups = filteredSlots.reduce((acc, slot) => {
    const key = toDateKey(slot.date);
    (acc[key] = acc[key] || []).push(slot);
    return acc;
  }, {});
  const slotGroupKeys = Object.keys(slotGroups).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 bg-white rounded-2xl border border-gray-100 p-2 shadow-sm">
        <button onClick={() => setTab('bookings')} className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === 'bookings' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>Bookings</button>
        <button onClick={() => setTab('slots')} className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === 'slots' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>Manage Slots</button>
        <button onClick={() => setTab('settings')} className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === 'settings' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>Settings</button>
      </div>

      {tab === 'settings' && (
        <div className="space-y-6 max-w-xl">
          <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-xl font-black text-gray-900">Global Advance Payment</h3>
            <p className="text-sm text-gray-500 mt-1">Applies to all services unless a service has a custom override.</p>
            <div className="mt-4 flex gap-3">
              <input type="number" min="0" value={advanceAmount} onChange={(e) => setAdvanceAmount(e.target.value)} className="flex-1 border rounded-lg px-3 py-2" />
              <button onClick={saveAdvance} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold">Save</button>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-gray-900">Automatic Slot Generation</h3>
                <p className="text-sm text-gray-500 mt-1">Auto-creates slots daily for the next few days. Manual generation still works alongside this.</p>
              </div>
              <label className="flex items-center gap-2 shrink-0 cursor-pointer">
                <input type="checkbox" checked={autoConfig.enabled} onChange={(e) => setAutoConfig((p) => ({ ...p, enabled: e.target.checked }))} className="h-5 w-5 accent-emerald-600" />
                <span className="text-sm font-bold text-gray-700">{autoConfig.enabled ? 'On' : 'Off'}</span>
              </label>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-sm">
                <span className="block text-gray-600 mb-1 font-semibold">Start time</span>
                <input type="time" value={autoConfig.startTime} onChange={(e) => setAutoConfig((p) => ({ ...p, startTime: e.target.value }))} className="w-full border rounded-lg px-3 py-2" />
              </label>
              <label className="text-sm">
                <span className="block text-gray-600 mb-1 font-semibold">End time</span>
                <input type="time" value={autoConfig.endTime} onChange={(e) => setAutoConfig((p) => ({ ...p, endTime: e.target.value }))} className="w-full border rounded-lg px-3 py-2" />
              </label>
              <label className="text-sm">
                <span className="block text-gray-600 mb-1 font-semibold">Slot length</span>
                <select value={autoConfig.intervalMinutes} onChange={(e) => setAutoConfig((p) => ({ ...p, intervalMinutes: e.target.value === '' ? '' : Number(e.target.value) }))} className="w-full border rounded-lg px-3 py-2 bg-white">
                  <option value="">Select</option>
                  {[15, 20, 30, 45, 60].map((min) => <option key={min} value={min}>{min} min</option>)}
                </select>
              </label>
              <label className="text-sm">
                <span className="block text-gray-600 mb-1 font-semibold">Capacity per slot</span>
                <input type="number" min="1" placeholder="e.g. 5" value={autoConfig.capacity} onChange={(e) => setAutoConfig((p) => ({ ...p, capacity: e.target.value === '' ? '' : Number(e.target.value) }))} className="w-full border rounded-lg px-3 py-2" />
              </label>
              <label className="text-sm sm:col-span-2">
                <span className="block text-gray-600 mb-1 font-semibold">Generate slots for the next (days)</span>
                <input type="number" min="1" max="60" placeholder="e.g. 7" value={autoConfig.daysAhead} onChange={(e) => setAutoConfig((p) => ({ ...p, daysAhead: e.target.value === '' ? '' : Number(e.target.value) }))} className="w-full border rounded-lg px-3 py-2" />
              </label>
            </div>

            <button onClick={saveAutoConfig} disabled={savingAuto} className="mt-4 w-full px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold disabled:opacity-60">
              {savingAuto ? 'Saving…' : 'Save Auto Settings'}
            </button>
          </section>
        </div>
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
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-gray-600">Filter by date</span>
              <input type="date" value={slotFilterDate} onChange={(e) => setSlotFilterDate(e.target.value)} className="border rounded-lg px-3 py-2" />
              <span className="text-sm font-semibold text-gray-600">time</span>
              <input type="time" value={slotFilterTime} onChange={(e) => setSlotFilterTime(e.target.value)} className="border rounded-lg px-3 py-2" />
              {(slotFilterDate || slotFilterTime) && <button onClick={() => { setSlotFilterDate(''); setSlotFilterTime(''); }} className="text-sm font-bold text-blue-600">Clear</button>}
              <span className="text-sm text-gray-500 ml-auto">{filteredSlots.length} slot{filteredSlots.length === 1 ? '' : 's'}</span>
            </div>

            {slotGroupKeys.length === 0 ? (
              <p className="text-gray-500">{slots.length === 0 ? 'No slots loaded.' : 'No slots for the selected date.'}</p>
            ) : (
              slotGroupKeys.map((key) => {
                const daySlots = slotGroups[key];
                const isOpen = !!expandedDates[key];
                return (
                  <div key={key} className="border border-gray-100 rounded-xl overflow-hidden">
                    <div className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50">
                      <button onClick={() => toggleDateGroup(key)} className="flex-1 flex items-center justify-between gap-3 hover:opacity-80">
                        <span className="font-bold text-gray-900">{new Date(`${key}T00:00:00`).toLocaleDateString()}</span>
                        <span className="flex items-center gap-2 text-sm text-gray-500">
                          {daySlots.length} slot{daySlots.length === 1 ? '' : 's'}
                          {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                        </span>
                      </button>
                      <button onClick={() => deleteDate(key)} title="Delete all slots for this date" className="shrink-0 text-rose-600 hover:text-rose-700 p-1">
                        <FaTrash size={15} />
                      </button>
                    </div>
                    {isOpen && (
                      <div className="divide-y divide-gray-100">
                        {daySlots.map((slot) => (
                          <div key={slot._id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                            <div>
                              <p className="font-bold text-gray-900">{slot.startTime} - {slot.endTime}{slot.isBlocked && <span className="ml-2 text-xs font-bold text-amber-600">(Blocked)</span>}</p>
                              <p className="text-sm text-gray-500">{slot.bookedCount}/{slot.capacity} booked</p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => openSlotEdit(slot)} title="Edit slot" className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm font-bold flex items-center gap-1"><FaPen size={12} /> Edit</button>
                              <button onClick={() => toggleSlot(slot)} className="px-3 py-1 rounded-lg bg-amber-500 text-white text-sm font-bold">{slot.isBlocked ? 'Unblock' : 'Block'}</button>
                              {Number(slot.bookedCount) === 0 && <button onClick={() => deleteSlot(slot._id)} disabled={deletingIds.includes(slot._id)} className="px-3 py-1 rounded-lg bg-rose-600 text-white text-sm font-bold disabled:opacity-50">{deletingIds.includes(slot._id) ? 'Deleting…' : 'Delete'}</button>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
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

      {slotEditModal.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 space-y-4">
            <h3 className="text-xl font-black text-gray-900">Edit slot</h3>
            <p className="text-sm text-gray-500">
              {slotEditModal.slot ? new Date(`${toDateKey(slotEditModal.slot.date)}T00:00:00`).toLocaleDateString() : ''} • {slotEditModal.slot?.bookedCount}/{slotEditModal.slot?.capacity} booked
            </p>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">
                <span className="block text-gray-600 mb-1 font-semibold">Start time</span>
                <input type="time" value={slotEditModal.startTime} onChange={(e) => setSlotEditModal((p) => ({ ...p, startTime: e.target.value }))} className="w-full border rounded-lg px-3 py-2" />
              </label>
              <label className="text-sm">
                <span className="block text-gray-600 mb-1 font-semibold">End time</span>
                <input type="time" value={slotEditModal.endTime} onChange={(e) => setSlotEditModal((p) => ({ ...p, endTime: e.target.value }))} className="w-full border rounded-lg px-3 py-2" />
              </label>
              <label className="text-sm col-span-2">
                <span className="block text-gray-600 mb-1 font-semibold">Capacity</span>
                <input type="number" min="1" value={slotEditModal.capacity} onChange={(e) => setSlotEditModal((p) => ({ ...p, capacity: Number(e.target.value) }))} className="w-full border rounded-lg px-3 py-2" />
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setSlotEditModal({ open: false, slot: null, startTime: '', endTime: '', capacity: 1 })} className="px-4 py-2 rounded-lg border border-gray-300">Cancel</button>
              <button onClick={submitSlotEdit} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
