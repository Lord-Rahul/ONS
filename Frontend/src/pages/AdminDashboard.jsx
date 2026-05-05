import React, { useState, useEffect } from 'react';
import {
  BarChart as LucideBarChart,
  Users,
  ShoppingBag,
  TrendingUp,
  Download,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import adminService from '../services/adminService.js';
import useToast from '../hooks/useToast.js';

const AdminDashboard = () => {
  const { addToast } = useToast();
  const [stats, setStats] = useState(null);
  const [salesReport, setSalesReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [statsResponse, reportResponse] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getSalesReport({ type: 'monthly' }),
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (reportResponse.success) {
        setSalesReport(reportResponse.data?.data?.data || []);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      addToast('Failed to load dashboard stats', 'error');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, change, color }) => (
    <div className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span className={`text-sm font-light ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <p className="text-gray-600 font-light text-sm mb-1">{label}</p>
      <p className="text-3xl font-light text-black">{value || '0'}</p>
    </div>
  );

  const formatStatus = (status) => {
    if (!status) {
      return 'Pending';
    }

    return status.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-indigo-100 text-indigo-800';
      case 'shipped':
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'cancellation_requested':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const chartData = salesReport.map((entry) => ({
    period: entry.period,
    revenue: entry.revenue,
    orders: entry.orders,
  }));

  const chartColors = ['#111827', '#374151', '#4b5563', '#6b7280', '#9ca3af'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-black mb-1">Dashboard</h1>
            <p className="text-gray-600 font-light">Welcome back! Here's your analytics overview.</p>
          </div>
          <button className="px-6 py-2 border border-gray-300 text-gray-700 font-light rounded hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={ShoppingBag}
            label="Total Sales"
            value={`₹${stats?.totalSales?.toLocaleString() || '0'}`}
            change={stats?.salesChange || 12}
            color="bg-blue-600"
          />
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats?.totalUsers || '0'}
            change={stats?.usersChange || 8}
            color="bg-green-600"
          />
          <StatCard
            icon={ShoppingBag}
            label="Total Orders"
            value={stats?.totalOrders || '0'}
            change={stats?.ordersChange || 5}
            color="bg-purple-600"
          />
          <StatCard
            icon={TrendingUp}
            label="Products"
            value={stats?.totalProducts || '0'}
            change={stats?.productsChange || 3}
            color="bg-orange-600"
          />
        </div>

        {/* Charts and Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-white border border-gray-200 p-6 rounded-lg">
            <h3 className="text-lg font-light text-black mb-6 flex items-center gap-2">
              <LucideBarChart className="w-5 h-5" />
              Sales Overview
            </h3>
            <div className="h-80 bg-gray-50 rounded p-4">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        backgroundColor: '#ffffff',
                      }}
                      formatter={(value, name) => [
                        name === 'revenue' ? `₹${Number(value).toLocaleString()}` : value,
                        name === 'revenue' ? 'Revenue' : 'Orders',
                      ]}
                    />
                    <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={entry.period} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 font-light">
                  No sales data available yet.
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <h3 className="text-lg font-light text-black mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <a
                href="/admin/products"
                className="block w-full px-4 py-3 bg-black text-white text-center font-light rounded hover:bg-gray-900 transition-colors"
              >
                Manage Products
              </a>
              <a
                href="/admin/orders"
                className="block w-full px-4 py-3 border border-black text-black text-center font-light rounded hover:bg-black hover:text-white transition-colors"
              >
                View Orders
              </a>
              <a
                href="/admin/users"
                className="block w-full px-4 py-3 border border-black text-black text-center font-light rounded hover:bg-black hover:text-white transition-colors"
              >
                Manage Users
              </a>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 bg-white border border-gray-200 p-6 rounded-lg">
          <h3 className="text-lg font-light text-black mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Recent Orders
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-light text-gray-600">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-light text-gray-600">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-light text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-light text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-light text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900 font-light">{order.orderNumber}</td>
                      <td className="py-3 px-4 text-sm text-gray-700 font-light">{order.customerName}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 font-light">₹{order.totalAmount}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-light ${getStatusClassName(order.status)}`}>
                          {formatStatus(order.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 font-light">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500 font-light">
                      No recent orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
