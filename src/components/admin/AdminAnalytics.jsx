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

const STATUS_COLORS = {
  pending: '#f59e0b',
  confirmed: '#2563eb',
  completed: '#16a34a',
  cancelled: '#dc2626',
  refunded: '#9333ea',
};

const statusBadgeClass = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-100 text-rose-700',
  refunded: 'bg-violet-100 text-violet-700',
};

const getDateRangeFromPreset = (preset) => {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const start = new Date(now);

  if (preset === 'today') {
    start.setHours(0, 0, 0, 0);
  } else if (preset === 'week') {
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);
  } else if (preset === 'month') {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  }

  return {
    from: start.toISOString().slice(0, 10),
    to: end.toISOString().slice(0, 10),
  };
};

const formatCurrency = (value) => `INR ${Number(value || 0).toLocaleString('en-IN')}`;
const formatDateDisplay = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-IN');
};

const SkeletonCard = () => <div className="h-28 rounded-xl border border-gray-200 bg-gray-100 animate-pulse" />;

const SkeletonChart = () => <div className="h-80 rounded-xl border border-gray-200 bg-gray-100 animate-pulse" />;

const defaultAnalytics = {
  totalBookings: 0,
  monthBookings: 0,
  totalRevenue: 0,
  cancellationRate: 0,
  topService: '-',
  byStatus: {
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    refunded: 0,
  },
  byDate: [],
  topServices: [],
  byCategory: [],
  recentBookings: [],
};

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(defaultAnalytics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [preset, setPreset] = useState('month');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [range, setRange] = useState(() => getDateRangeFromPreset('month'));

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('adminToken');
        const { data } = await axios.get(`${API_URL}/api/analytics/summary`, {
          params: {
            from: range.from,
            to: range.to,
          },
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnalytics(data.data || defaultAnalytics);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [API_URL, range]);

  const statusChartData = useMemo(
    () => Object.entries(analytics.byStatus || {}).map(([status, count]) => ({ status, count })),
    [analytics.byStatus]
  );

  const serviceChartData = useMemo(() => analytics.topServices || [], [analytics.topServices]);

  const categoryChartData = useMemo(() => analytics.byCategory || [], [analytics.byCategory]);

  const presetLabel = {
    today: 'Today',
    week: 'Last 7 Days',
    month: 'This Month',
    custom: 'Custom Range',
  };

  const metrics = [
    { title: 'Total Bookings', value: analytics.totalBookings, border: 'border-l-blue-500' },
    { title: 'Bookings In Range', value: analytics.monthBookings, border: 'border-l-indigo-500' },
    { title: 'Revenue', value: formatCurrency(analytics.totalRevenue), border: 'border-l-emerald-500' },
    { title: 'Cancellation Rate', value: `${Number(analytics.cancellationRate || 0).toFixed(2)}%`, border: 'border-l-rose-500' },
    { title: 'Top Service', value: analytics.topService || '-', border: 'border-l-cyan-500' },
  ];

  const applyPreset = (nextPreset) => {
    setPreset(nextPreset);
    if (nextPreset !== 'custom') {
      setRange(getDateRangeFromPreset(nextPreset));
    }
  };

  const applyCustomRange = () => {
    if (!customFrom || !customTo) return;
    setPreset('custom');
    setRange({ from: customFrom, to: customTo });
  };

  const exportCsv = () => {
    const rows = analytics.recentBookings || [];
    const header = [
      'Date',
      'Customer',
      'Service',
      'Variant',
      'Booking Amount',
      'Status',
      'Payment Status',
      'Slot',
    ];

    const csvRows = rows.map((row) => [
      new Date(row.createdAt).toLocaleString('en-IN'),
      row.customerName || '-',
      row.serviceName || '-',
      row.variantName || '-',
      row.bookingAmount || 0,
      row.status || '-',
      row.paymentStatus || '-',
      `${formatDateDisplay(row.slotDate)} ${row.slotStartTime || ''}-${row.slotEndTime || ''}`,
    ]);

    const csvText = [header, ...csvRows]
      .map((line) => line.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `analytics-recent-bookings-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-gray-900">Analytics</h3>
          <p className="text-sm text-gray-500">Insights across bookings, statuses and revenue for {presetLabel[preset]}.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['today', 'week', 'month'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => applyPreset(p)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold border ${
                preset === p ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {presetLabel[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 flex flex-col md:flex-row md:items-end gap-3">
        <label className="flex flex-col text-sm font-semibold text-gray-700">
          From
          <input
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            className="mt-1 rounded-lg border border-gray-300 px-3 py-2 bg-white"
          />
        </label>
        <label className="flex flex-col text-sm font-semibold text-gray-700">
          To
          <input
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            className="mt-1 rounded-lg border border-gray-300 px-3 py-2 bg-white"
          />
        </label>
        <button
          type="button"
          onClick={applyCustomRange}
          className="h-10 px-4 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-black"
        >
          Apply Custom Range
        </button>
        <p className="text-xs text-gray-500">Current range: {range.from} to {range.to}</p>
      </div>

      {error && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 5 }).map((_, idx) => <SkeletonCard key={idx} />)
          : metrics.map((metric) => (
              <article key={metric.title} className={`rounded-xl border border-gray-200 bg-white p-4 border-l-4 ${metric.border}`}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{metric.title}</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{metric.value}</p>
              </article>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <>
            <SkeletonChart />
            <SkeletonChart />
          </>
        ) : (
          <>
            <article className="rounded-xl border border-gray-200 bg-white p-4 h-80">
              <h4 className="text-sm font-bold text-gray-800 mb-3">Bookings and Revenue Over Time</h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.byDate || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="count" stroke="#2563eb" name="Bookings" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#16a34a" name="Revenue" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-4 h-80">
              <h4 className="text-sm font-bold text-gray-800 mb-3">Booking Status Distribution</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusChartData} dataKey="count" nameKey="status" outerRadius={100} label>
                    {statusChartData.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#64748b'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </article>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <>
            <SkeletonChart />
            <SkeletonChart />
          </>
        ) : (
          <>
            <article className="rounded-xl border border-gray-200 bg-white p-4 h-80">
              <h4 className="text-sm font-bold text-gray-800 mb-3">Top Services by Bookings</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceChartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={130} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0891b2" />
                </BarChart>
              </ResponsiveContainer>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-4 h-80">
              <h4 className="text-sm font-bold text-gray-800 mb-3">Bookings by Category</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#7c3aed" />
                </BarChart>
              </ResponsiveContainer>
            </article>
          </>
        )}
      </div>

      <article className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-gray-800">Recent Activity (Last 10 Bookings)</h4>
          <button
            type="button"
            onClick={exportCsv}
            className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
          >
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200 text-gray-600">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Service</th>
                <th className="py-2 pr-4">Variant</th>
                <th className="py-2 pr-4">Booking Amount</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Payment</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td colSpan="7" className="py-3">
                      <div className="h-6 rounded bg-gray-100 animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : analytics.recentBookings?.length ? (
                analytics.recentBookings.map((item) => (
                  <tr key={item._id} className="border-b border-gray-100 text-gray-700">
                    <td className="py-2 pr-4">{new Date(item.createdAt).toLocaleString('en-IN')}</td>
                    <td className="py-2 pr-4">{item.customerName || '-'}</td>
                    <td className="py-2 pr-4">{item.serviceName || '-'}</td>
                    <td className="py-2 pr-4">{item.variantName || '-'}</td>
                    <td className="py-2 pr-4">{formatCurrency(item.bookingAmount)}</td>
                    <td className="py-2 pr-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadgeClass[item.status] || 'bg-gray-100 text-gray-700'}`}>
                        {item.status || '-'}
                      </span>
                    </td>
                    <td className="py-2 pr-4">{item.paymentStatus || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-gray-500">
                    No recent bookings found for selected range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
};

export default AdminAnalytics;
