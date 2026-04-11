import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#f59e0b', '#7c3aed'];

const AdminAnalytics = () => {
  const [preset, setPreset] = useState('month');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useMemo(() => ({ from, to }), [from, to]);

  const fetchSummary = async (nextFrom, nextTo) => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const { data } = await axios.get(`${API_URL}/api/analytics/summary`, {
      params: { from: nextFrom, to: nextTo },
      headers: { Authorization: `Bearer ${token}` },
    });
    setSummary(data.data || {});
    setLoading(false);
  };

  useEffect(() => {
    const now = new Date();
    const start = new Date(now);
    if (preset === 'today') start.setHours(0, 0, 0, 0);
    if (preset === 'week') start.setDate(now.getDate() - 6);
    if (preset === 'month') start.setDate(1);
    setFrom(start.toISOString().slice(0, 10));
    setTo(now.toISOString().slice(0, 10));
  }, [preset]);

  useEffect(() => {
    fetchSummary(params.from, params.to).catch(() => setLoading(false));
  }, [params.from, params.to]);

  const kpis = [
    ['Total Bookings', summary?.totalBookings || 0],
    ['Confirmed', summary?.confirmed || 0],
    ['Completed', summary?.completed || 0],
    ['Advance Collected (₹)', Number(summary?.advanceCollected || 0).toLocaleString('en-IN')],
    ['Refunded (₹)', Number(summary?.refunded || 0).toLocaleString('en-IN')],
    ['Completion Rate (%)', `${Number(summary?.completionRate || 0).toFixed(2)}%`],
  ];

  const statusData = Object.entries(summary?.byStatus || {}).map(([name, value]) => ({ name, value }));

  const exportCsv = () => {
    const rows = summary?.recentBookings || [];
    const header = ['Booking ID', 'Customer', 'Service', 'Variant', 'Slot', 'Advance', 'Status', 'Payment Status'];
    const csv = [header, ...rows.map((row) => [row.bookingId, row.customer?.name, row.service?.name || row.service?.ref?.name, row.variant?.name, row.slot ? `${new Date(row.slot.date).toLocaleDateString()} ${row.slot.startTime}-${row.slot.endTime}` : '-', row.advancePaid, row.bookingStatus, row.paymentStatus])]
      .map((line) => line.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'analytics.csv';
    link.click();
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-2xl font-black text-gray-900">Analytics</h3>
          <p className="text-sm text-gray-500">Bookings, revenue, and status trends for the selected range.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['today', 'week', 'month'].map((item) => (
            <button key={item} onClick={() => setPreset(item)} className={`px-3 py-2 rounded-lg text-sm font-semibold border ${preset === item ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200'}`}>
              {item === 'today' ? 'Today' : item === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border rounded-lg px-3 py-2" />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border rounded-lg px-3 py-2" />
        <button onClick={() => fetchSummary(from, to)} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold">Apply Custom Range</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-gray-200 p-4 bg-gray-50">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">{label}</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{loading ? '...' : value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 p-4 h-80">
          <h4 className="font-bold mb-3">Bookings over time</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={summary?.bookingsOverTime || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line dataKey="count" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-gray-200 p-4 h-80">
          <h4 className="font-bold mb-3">Advance revenue over time</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summary?.advanceOverTime || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 p-4 h-80">
          <h4 className="font-bold mb-3">Bookings by status</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={100} label>
                {statusData.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-gray-200 p-4 h-80">
          <h4 className="font-bold mb-3">Top 5 services by booking count</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summary?.topServices || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={150} />
              <Tooltip />
              <Bar dataKey="count" fill="#7c3aed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
          <h4 className="font-bold">Recent bookings</h4>
          <button onClick={exportCsv} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold">CSV Export</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 uppercase text-xs">
              <tr>
                <th className="py-2 pr-3">Booking ID</th>
                <th className="py-2 pr-3">Customer</th>
                <th className="py-2 pr-3">Service + Variant</th>
                <th className="py-2 pr-3">Slot</th>
                <th className="py-2 pr-3">Advance Paid</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Payment</th>
              </tr>
            </thead>
            <tbody>
              {(summary?.recentBookings || []).map((row) => (
                <tr key={row._id} className="border-t border-gray-100">
                  <td className="py-2 pr-3 font-semibold">{row.bookingId}</td>
                  <td className="py-2 pr-3">{row.customer?.name}</td>
                  <td className="py-2 pr-3">{row.service?.name || row.service?.ref?.name} / {row.variant?.name}</td>
                  <td className="py-2 pr-3">{row.slot ? `${new Date(row.slot.date).toLocaleDateString()} ${row.slot.startTime}-${row.slot.endTime}` : '-'}</td>
                  <td className="py-2 pr-3">₹{Number(row.advancePaid || 0).toLocaleString('en-IN')}</td>
                  <td className="py-2 pr-3">{row.bookingStatus}</td>
                  <td className="py-2 pr-3">{row.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminAnalytics;
