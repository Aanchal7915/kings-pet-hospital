import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STATUS_TABS = ['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
const TYPE_TABS = ['all', 'food', 'pet'];

const STATUS_LABELS = {
  all: 'All',
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const STATUS_BADGE = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-violet-100 text-violet-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-100 text-rose-700',
};

const ALLOWED_NEXT = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['in_progress', 'completed', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
};

const AdminPetOrders = () => {
  const token = useMemo(() => localStorage.getItem('adminToken'), []);
  const authConfig = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('all');
  const [orderType, setOrderType] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState('');
  const [statusModal, setStatusModal] = useState({ open: false, order: null, nextStatus: '', note: '' });

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (status !== 'all') params.append('status', status);
      if (orderType !== 'all') params.append('orderType', orderType);
      if (search) params.append('search', search);
      const { data } = await axios.get(`${API_URL}/api/petorders/admin?${params.toString()}`, authConfig);
      setOrders(data.data || []);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to load orders');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status, orderType, search]);

  const submitStatus = async () => {
    try {
      await axios.patch(
        `${API_URL}/api/petorders/admin/${statusModal.order._id}/status`,
        { status: statusModal.nextStatus, note: statusModal.note },
        authConfig
      );
      setStatusModal({ open: false, order: null, nextStatus: '', note: '' });
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update status');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this order? This cannot be undone.')) return;
    try {
      await axios.delete(`${API_URL}/api/petorders/admin/${id}`, authConfig);
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete order');
    }
  };

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase">Type:</span>
            {TYPE_TABS.map((t) => (
              <button key={t} onClick={() => setOrderType(t)} className={`px-3 py-1 rounded-full text-xs font-bold border ${orderType === t ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-700'}`}>
                {t === 'all' ? 'All' : t === 'food' ? 'Pet Food' : 'Pet Booking'}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((s) => (
              <button key={s} onClick={() => setStatus(s)} className={`px-3 py-2 rounded-full text-sm font-semibold border ${status === s ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-700'}`}>
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Search by name, phone, order ID, or item" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Item</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-4 text-gray-500">No orders found.</td></tr>
              ) : orders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr className="border-t border-gray-100 align-top">
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-900">{order.orderId}</p>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${order.orderType === 'food' ? 'bg-orange-100 text-orange-700' : 'bg-violet-100 text-violet-700'}`}>
                        {order.orderType === 'food' ? 'Pet Food' : 'Pet Booking'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{order.customer?.name}</p>
                      <p className="text-gray-500">{order.customer?.phone}</p>
                      {order.customer?.email && <p className="text-gray-500 text-xs">{order.customer.email}</p>}
                      {order.customer?.city && <p className="text-gray-500 text-xs">{order.customer.city}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{order.item?.name}</p>
                      <p className="text-gray-500 text-xs">{order.item?.petType} {order.item?.breed && `• ${order.item.breed}`}</p>
                      {order.quantity > 1 && <p className="text-gray-500 text-xs">Qty: {order.quantity}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold">₹{Number(order.totalPrice).toLocaleString('en-IN')}</p>
                      {Number(order.bookingAmount) > 0 && (
                        <>
                          <p className="text-xs text-gray-500">Advance ₹{Number(order.bookingAmount).toLocaleString('en-IN')}</p>
                          <p className="text-xs text-gray-500">Remaining ₹{Number(order.remainingAmount).toLocaleString('en-IN')}</p>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${STATUS_BADGE[order.status] || 'bg-gray-100'}`}>{order.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {(ALLOWED_NEXT[order.status] || []).map((next) => (
                          <button
                            key={next}
                            onClick={() => setStatusModal({ open: true, order, nextStatus: next, note: '' })}
                            className={`px-2 py-1 rounded text-white text-xs font-bold ${
                              next === 'confirmed' ? 'bg-blue-600' :
                              next === 'in_progress' ? 'bg-violet-600' :
                              next === 'completed' ? 'bg-emerald-600' :
                              'bg-rose-600'
                            }`}
                          >
                            {next === 'confirmed' ? 'Confirm' :
                             next === 'in_progress' ? 'In Progress' :
                             next === 'completed' ? 'Mark Completed' :
                             'Cancel'}
                          </button>
                        ))}
                        <button onClick={() => setExpandedId(expandedId === order._id ? '' : order._id)} className="px-2 py-1 rounded border border-gray-300 text-xs font-bold">{expandedId === order._id ? 'Collapse' : 'Expand'}</button>
                        <button onClick={() => remove(order._id)} className="px-2 py-1 rounded bg-gray-700 text-white text-xs font-bold">Delete</button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === order._id && (
                    <tr className="bg-gray-50 border-t border-gray-100">
                      <td colSpan={7} className="px-4 py-4 text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-bold mb-2">Customer Details</h4>
                            <p>Name: {order.customer?.name}</p>
                            <p>Phone: {order.customer?.phone}</p>
                            {order.customer?.email && <p>Email: {order.customer.email}</p>}
                            {order.customer?.address && <p>Address: {order.customer.address}</p>}
                            {order.customer?.city && <p>City: {order.customer.city}</p>}
                            {order.message && <p className="mt-2">Message: <span className="text-gray-700">{order.message}</span></p>}
                          </div>
                          <div>
                            <h4 className="font-bold mb-2">Status History</h4>
                            <ul className="space-y-1">
                              {(order.statusHistory || []).map((item, idx) => (
                                <li key={idx} className="text-gray-700 text-xs">
                                  {item.status} • {new Date(item.changedAt).toLocaleString()} {item.note ? `• ${item.note}` : ''} (by {item.changedBy})
                                </li>
                              ))}
                            </ul>
                            {order.adminNote && <p className="mt-2 text-gray-700">Admin Note: {order.adminNote}</p>}
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

      {statusModal.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-5 space-y-4">
            <h3 className="text-xl font-black text-gray-900">Change status to {statusModal.nextStatus}?</h3>
            <textarea value={statusModal.note} onChange={(e) => setStatusModal((p) => ({ ...p, note: e.target.value }))} className="w-full border rounded-lg px-3 py-2" rows={4} placeholder="Optional note" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setStatusModal({ open: false, order: null, nextStatus: '', note: '' })} className="px-4 py-2 rounded-lg border border-gray-300">Cancel</button>
              <button onClick={submitStatus} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPetOrders;
