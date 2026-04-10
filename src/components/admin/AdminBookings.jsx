import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const formatDateLabel = (dateValue) => new Date(dateValue).toLocaleDateString();
const formatDateTime = (dateValue, timeValue) => `${new Date(dateValue).toLocaleDateString()} ${timeValue}`;

const toDateOnly = (dateValue) => new Date(dateValue).toISOString().slice(0, 10);

const AdminBookings = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = useMemo(() => localStorage.getItem('adminToken'), []);
  const authConfig = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  const [activeSubTab, setActiveSubTab] = useState('slot-management');

  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedSlotIds, setSelectedSlotIds] = useState([]);

  const [slotGenerateForm, setSlotGenerateForm] = useState({
    fromDate: '',
    toDate: '',
    startTime: '09:00',
    endTime: '18:00',
    intervalMinutes: 30,
    capacity: 1,
    serviceId: '',
  });

  const [manualSlotForm, setManualSlotForm] = useState({
    date: '',
    startTime: '09:00',
    endTime: '09:30',
    capacity: 1,
    serviceId: '',
  });

  const [slotFilter, setSlotFilter] = useState({
    fromDate: '',
    toDate: '',
    serviceId: '',
  });

  const [rescheduleModal, setRescheduleModal] = useState({
    open: false,
    booking: null,
    slots: [],
    selectedSlotId: '',
    note: '',
  });

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const fetchServices = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/catalog/services?includeInactive=true`);
      setServices(data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSlots = async () => {
    try {
      setLoadingSlots(true);
      const params = new URLSearchParams();
      if (slotFilter.fromDate) params.append('fromDate', slotFilter.fromDate);
      if (slotFilter.toDate) params.append('toDate', slotFilter.toDate);
      if (slotFilter.serviceId) params.append('serviceId', slotFilter.serviceId);
      params.append('includeBlocked', 'true');

      const { data } = await axios.get(`${API_URL}/api/slots?${params.toString()}`, authConfig);
      setSlots(data.data || []);
      setSelectedSlotIds([]);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to load slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const { data } = await axios.get(`${API_URL}/api/admin/bookings`, authConfig);
      setBookings(data.data || []);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to load bookings');
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    const today = new Date();
    const inSeven = new Date();
    inSeven.setDate(today.getDate() + 7);

    const defaultFromDate = toDateOnly(today);
    const defaultToDate = toDateOnly(inSeven);

    setSlotFilter({ fromDate: defaultFromDate, toDate: defaultToDate, serviceId: '' });
    setSlotGenerateForm((prev) => ({ ...prev, fromDate: defaultFromDate, toDate: defaultToDate }));
    setManualSlotForm((prev) => ({ ...prev, date: defaultFromDate }));

    fetchServices();
    fetchBookings();
  }, []);

  useEffect(() => {
    if (slotFilter.fromDate || slotFilter.toDate || slotFilter.serviceId) {
      fetchSlots();
    }
  }, [slotFilter.fromDate, slotFilter.toDate, slotFilter.serviceId]);

  const generateSlots = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...slotGenerateForm,
        intervalMinutes: Number(slotGenerateForm.intervalMinutes),
        capacity: Number(slotGenerateForm.capacity),
        serviceId: slotGenerateForm.serviceId || undefined,
      };
      await axios.post(`${API_URL}/api/slots/generate`, payload, authConfig);
      alert('Slots generated successfully');
      fetchSlots();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to generate slots');
    }
  };

  const createManualSlot = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...manualSlotForm,
        capacity: Number(manualSlotForm.capacity),
        serviceId: manualSlotForm.serviceId || undefined,
      };
      await axios.post(`${API_URL}/api/slots`, payload, authConfig);
      alert('Slot created successfully');
      fetchSlots();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create manual slot');
    }
  };

  const toggleSlotBlock = async (slot) => {
    try {
      await axios.put(`${API_URL}/api/slots/${slot._id}/block`, { isBlocked: !slot.isBlocked }, authConfig);
      fetchSlots();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to toggle slot block');
    }
  };

  const deleteSlot = async (slotId) => {
    if (!window.confirm('Delete this slot?')) return;
    try {
      await axios.delete(`${API_URL}/api/slots/${slotId}`, authConfig);
      fetchSlots();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete slot');
    }
  };

  const deleteSelectedSlots = async () => {
    if (selectedSlotIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedSlotIds.length} selected slot(s)?`)) return;

    try {
      await Promise.all(
        selectedSlotIds.map((slotId) => axios.delete(`${API_URL}/api/slots/${slotId}`, authConfig))
      );
      fetchSlots();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete selected slots');
    }
  };

  const toggleSelectAllSlots = (checked) => {
    if (checked) {
      setSelectedSlotIds(slots.map((slot) => slot._id));
    } else {
      setSelectedSlotIds([]);
    }
  };

  const toggleSelectedSlot = (slotId, checked) => {
    setSelectedSlotIds((prev) => {
      if (checked) {
        return prev.includes(slotId) ? prev : [...prev, slotId];
      }
      return prev.filter((id) => id !== slotId);
    });
  };

  const updateBookingStatus = async (booking, nextStatus, note = '') => {
    try {
      await axios.patch(
        `${API_URL}/api/admin/bookings/${booking._id}/status`,
        { status: nextStatus, note },
        authConfig
      );
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update booking status');
    }
  };

  const openRescheduleModal = async (booking) => {
    try {
      const today = toDateOnly(new Date());
      const inFourteen = new Date();
      inFourteen.setDate(new Date().getDate() + 14);

      const params = new URLSearchParams({
        fromDate: today,
        toDate: toDateOnly(inFourteen),
        serviceId: booking.service?._id || booking.service,
      });

      const { data } = await axios.get(`${API_URL}/api/slots?${params.toString()}`, authConfig);
      const now = new Date();
      const futureAvailable = (data.data || []).filter((slot) => {
        if (slot.isBlocked || Number(slot.bookedCount) >= Number(slot.capacity)) return false;
        const startAt = new Date(`${toDateOnly(slot.date)}T${slot.startTime}:00`);
        return startAt >= now;
      });

      setRescheduleModal({
        open: true,
        booking,
        slots: futureAvailable,
        selectedSlotId: futureAvailable[0]?._id || '',
        note: '',
      });
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to load future slots');
    }
  };

  const submitReschedule = async () => {
    if (!rescheduleModal.selectedSlotId || !rescheduleModal.booking) return;
    try {
      await axios.patch(
        `${API_URL}/api/admin/bookings/${rescheduleModal.booking._id}/reschedule`,
        {
          newSlotId: rescheduleModal.selectedSlotId,
          note: rescheduleModal.note,
        },
        authConfig
      );

      setRescheduleModal({ open: false, booking: null, slots: [], selectedSlotId: '', note: '' });
      fetchBookings();
      fetchSlots();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to reschedule booking');
    }
  };

  const statusBadge = (status) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-2 flex gap-2 shadow-sm">
        <button
          onClick={() => setActiveSubTab('slot-management')}
          className={`px-4 py-2 rounded-xl text-sm font-bold ${activeSubTab === 'slot-management' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
        >
          Slot Management
        </button>
        <button
          onClick={() => setActiveSubTab('booking-records')}
          className={`px-4 py-2 rounded-xl text-sm font-bold ${activeSubTab === 'booking-records' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
        >
          Booking Records
        </button>
      </div>

      {activeSubTab === 'slot-management' && (
        <>
          <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-xl font-black text-gray-900">Auto-generate slots</h3>
            <p className="text-sm text-gray-500">Generate slots by date range, time range, interval, and capacity.</p>

            <form onSubmit={generateSlots} className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <input type="date" className="border rounded-lg px-3 py-2" value={slotGenerateForm.fromDate} onChange={(e) => setSlotGenerateForm((p) => ({ ...p, fromDate: e.target.value }))} required />
              <input type="date" className="border rounded-lg px-3 py-2" value={slotGenerateForm.toDate} onChange={(e) => setSlotGenerateForm((p) => ({ ...p, toDate: e.target.value }))} required />
              <select className="border rounded-lg px-3 py-2" value={slotGenerateForm.intervalMinutes} onChange={(e) => setSlotGenerateForm((p) => ({ ...p, intervalMinutes: Number(e.target.value) }))}>
                <option value={15}>15 mins</option>
                <option value={30}>30 mins</option>
                <option value={45}>45 mins</option>
                <option value={60}>60 mins</option>
              </select>

              <input type="time" className="border rounded-lg px-3 py-2" value={slotGenerateForm.startTime} onChange={(e) => setSlotGenerateForm((p) => ({ ...p, startTime: e.target.value }))} required />
              <input type="time" className="border rounded-lg px-3 py-2" value={slotGenerateForm.endTime} onChange={(e) => setSlotGenerateForm((p) => ({ ...p, endTime: e.target.value }))} required />
              <input type="number" min={1} className="border rounded-lg px-3 py-2" value={slotGenerateForm.capacity} onChange={(e) => setSlotGenerateForm((p) => ({ ...p, capacity: Number(e.target.value) }))} required />

              <select className="md:col-span-3 border rounded-lg px-3 py-2" value={slotGenerateForm.serviceId} onChange={(e) => setSlotGenerateForm((p) => ({ ...p, serviceId: e.target.value }))}>
                <option value="">Global slots (all services)</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>{service.name}</option>
                ))}
              </select>

              <button type="submit" className="md:col-span-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg px-4 py-2">
                Generate Slots
              </button>
            </form>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-xl font-black text-gray-900">Manual single slot creation</h3>
            <form onSubmit={createManualSlot} className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <input type="date" className="border rounded-lg px-3 py-2" value={manualSlotForm.date} onChange={(e) => setManualSlotForm((p) => ({ ...p, date: e.target.value }))} required />
              <input type="time" className="border rounded-lg px-3 py-2" value={manualSlotForm.startTime} onChange={(e) => setManualSlotForm((p) => ({ ...p, startTime: e.target.value }))} required />
              <input type="time" className="border rounded-lg px-3 py-2" value={manualSlotForm.endTime} onChange={(e) => setManualSlotForm((p) => ({ ...p, endTime: e.target.value }))} required />
              <input type="number" min={1} className="border rounded-lg px-3 py-2" value={manualSlotForm.capacity} onChange={(e) => setManualSlotForm((p) => ({ ...p, capacity: Number(e.target.value) }))} required />
              <select className="md:col-span-2 border rounded-lg px-3 py-2" value={manualSlotForm.serviceId} onChange={(e) => setManualSlotForm((p) => ({ ...p, serviceId: e.target.value }))}>
                <option value="">Global slot</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>{service.name}</option>
                ))}
              </select>
              <button type="submit" className="md:col-span-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg px-4 py-2">
                Create Slot
              </button>
            </form>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="text-xs text-gray-500">From</label>
                <input type="date" className="block border rounded-lg px-3 py-2" value={slotFilter.fromDate} onChange={(e) => setSlotFilter((p) => ({ ...p, fromDate: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-gray-500">To</label>
                <input type="date" className="block border rounded-lg px-3 py-2" value={slotFilter.toDate} onChange={(e) => setSlotFilter((p) => ({ ...p, toDate: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-gray-500">Service</label>
                <select className="block border rounded-lg px-3 py-2" value={slotFilter.serviceId} onChange={(e) => setSlotFilter((p) => ({ ...p, serviceId: e.target.value }))}>
                  <option value="">All</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>{service.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={slots.length > 0 && selectedSlotIds.length === slots.length}
                  onChange={(e) => toggleSelectAllSlots(e.target.checked)}
                />
                Select all slots
              </label>
              <button
                type="button"
                onClick={() => setSelectedSlotIds([])}
                disabled={selectedSlotIds.length === 0}
                className="px-3 py-2 rounded border border-gray-300 text-gray-700 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Deselect All
              </button>
              <button
                type="button"
                onClick={deleteSelectedSlots}
                disabled={selectedSlotIds.length === 0}
                className="px-3 py-2 rounded bg-red-600 text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Selected ({selectedSlotIds.length})
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                  <tr>
                    <th className="px-3 py-2 text-left">
                      Select
                    </th>
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-left">Time</th>
                    <th className="px-3 py-2 text-left">Service</th>
                    <th className="px-3 py-2 text-left">Capacity</th>
                    <th className="px-3 py-2 text-left">Booked</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingSlots ? (
                    <tr><td colSpan={8} className="px-3 py-3 text-gray-500">Loading slots...</td></tr>
                  ) : slots.length === 0 ? (
                    <tr><td colSpan={8} className="px-3 py-3 text-gray-500">No slots found.</td></tr>
                  ) : (
                    slots.map((slot) => (
                      <tr key={slot._id} className="border-t border-gray-100">
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={selectedSlotIds.includes(slot._id)}
                            onChange={(e) => toggleSelectedSlot(slot._id, e.target.checked)}
                          />
                        </td>
                        <td className="px-3 py-2">{formatDateLabel(slot.date)}</td>
                        <td className="px-3 py-2">{slot.startTime} - {slot.endTime}</td>
                        <td className="px-3 py-2">{slot.service?.name || 'Global'}</td>
                        <td className="px-3 py-2">{slot.capacity}</td>
                        <td className="px-3 py-2">{slot.bookedCount}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${slot.isBlocked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {slot.isBlocked ? 'Blocked' : 'Open'}
                          </span>
                        </td>
                        <td className="px-3 py-2 flex gap-2">
                          <button onClick={() => toggleSlotBlock(slot)} className="px-2 py-1 rounded bg-amber-500 text-white text-xs font-bold">
                            {slot.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                          <button onClick={() => deleteSlot(slot._id)} className="px-2 py-1 rounded bg-red-600 text-white text-xs font-bold">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {activeSubTab === 'booking-records' && (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-900">Booking Records</h3>
              <p className="text-sm text-gray-500">Manage status, payment, and reschedule bookings.</p>
            </div>
            <button onClick={fetchBookings} className="px-3 py-2 rounded bg-blue-600 text-white text-sm font-bold">Refresh</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Pet</th>
                  <th className="px-4 py-3 text-left">Service</th>
                  <th className="px-4 py-3 text-left">Slot</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Payment</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingBookings ? (
                  <tr><td colSpan={7} className="px-4 py-3 text-gray-500">Loading bookings...</td></tr>
                ) : bookings.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-3 text-gray-500">No bookings yet.</td></tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking._id} className="border-t border-gray-100 align-top">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{booking.customer?.name || '-'}</p>
                        <p className="text-gray-500">{booking.customer?.phone || '-'}</p>
                        <p className="text-gray-500">{booking.customer?.email || '-'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{booking.pet?.name || '-'}</p>
                        <p className="text-gray-500">{booking.pet?.type || '-'}</p>
                        <p className="text-gray-500">{booking.pet?.breed || '-'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{booking.service?.name || '-'}</p>
                        <p className="text-gray-500">Variant: {booking.variant?.name || '-'}</p>
                        <p className="text-gray-500">Price: INR {Number(booking.variant?.price || 0).toLocaleString('en-IN')}</p>
                        <p className="text-gray-500">Booking: INR {Number(booking.variant?.bookingAmount || 0).toLocaleString('en-IN')}</p>
                      </td>
                      <td className="px-4 py-3">
                        {booking.slot ? (
                          <>
                            <p className="text-gray-900">{formatDateLabel(booking.slot.date)}</p>
                            <p className="text-gray-500">{booking.slot.startTime} - {booking.slot.endTime}</p>
                          </>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${statusBadge(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${statusBadge(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => updateBookingStatus(booking, 'confirmed', 'Confirmed by admin')}
                            className="px-2 py-1 rounded bg-blue-600 text-white text-xs font-bold"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking, 'completed', 'Marked completed by admin')}
                            className="px-2 py-1 rounded bg-emerald-600 text-white text-xs font-bold"
                          >
                            Completed
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking, 'cancelled', 'Cancelled by admin')}
                            className="px-2 py-1 rounded bg-red-600 text-white text-xs font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking, 'refunded', 'Refunded by admin')}
                            className="px-2 py-1 rounded bg-purple-600 text-white text-xs font-bold"
                          >
                            Refund
                          </button>
                          <button
                            onClick={() => openRescheduleModal(booking)}
                            className="px-2 py-1 rounded bg-amber-500 text-white text-xs font-bold"
                          >
                            Reschedule
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {rescheduleModal.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h4 className="text-lg font-black text-gray-900">Reschedule Booking</h4>
              <button onClick={() => setRescheduleModal({ open: false, booking: null, slots: [], selectedSlotId: '', note: '' })} className="text-gray-500">Close</button>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-600">Select a future slot for {rescheduleModal.booking?.customer?.name || 'customer'}.</p>

              <select
                className="w-full border rounded-lg px-3 py-2"
                value={rescheduleModal.selectedSlotId}
                onChange={(e) => setRescheduleModal((prev) => ({ ...prev, selectedSlotId: e.target.value }))}
              >
                <option value="">Select future slot</option>
                {rescheduleModal.slots.map((slot) => (
                  <option key={slot._id} value={slot._id}>
                    {formatDateTime(slot.date, slot.startTime)} - {slot.endTime} ({slot.bookedCount}/{slot.capacity})
                  </option>
                ))}
              </select>

              <textarea
                rows={3}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Reason for reschedule"
                value={rescheduleModal.note}
                onChange={(e) => setRescheduleModal((prev) => ({ ...prev, note: e.target.value }))}
              />

              <div className="flex justify-end gap-2">
                <button onClick={() => setRescheduleModal({ open: false, booking: null, slots: [], selectedSlotId: '', note: '' })} className="px-4 py-2 rounded-lg border border-gray-300">Cancel</button>
                <button onClick={submitReschedule} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
