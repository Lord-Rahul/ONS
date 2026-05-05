import React, { useState, useEffect } from 'react';
import { Download, TrendingUp, Filter } from 'lucide-react';
import adminService from '../services/adminService.js';
import useToast from '../hooks/useToast.js';

const AdminReports = () => {
  const { addToast } = useToast();
  const [salesReport, setSalesReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterType, setFilterType] = useState('monthly');

  useEffect(() => {
    fetchSalesReport();
  }, [filterType]);

  const fetchSalesReport = async () => {
    try {
      setLoading(true);
      const response = await adminService.getSalesReport({
        type: filterType,
        startDate: dateRange.start,
        endDate: dateRange.end
      });
      if (response.success) {
        setSalesReport(response.data);
      }
    } catch (error) {
      addToast('Failed to load sales report', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    try {
      // Create CSV data
      const csvContent = [
        ['Sales Report', ''],
        ['Generated:', new Date().toLocaleString()],
        [''],
        ['Period', 'Revenue', 'Orders', 'Average Order Value'],
        ...(salesReport?.data || []).map(item => [
          item.period,
          `₹${item.revenue}`,
          item.orders,
          `₹${item.avgOrderValue}`
        ])
      ].map(row => row.join(',')).join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      addToast('Report downloaded successfully.', 'success');
    } catch (error) {
      addToast('Failed to download report', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-light text-black">Reports & Analytics</h1>
            <p className="text-gray-600 font-light">View detailed sales and business analytics</p>
          </div>
          <button
            onClick={handleDownloadReport}
            className="px-6 py-2 bg-black text-white font-light rounded hover:bg-gray-900 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap items-end">
          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-light"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-light"
            />
          </div>

          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-light"
            />
          </div>

          <button
            onClick={fetchSalesReport}
            className="px-6 py-2 border border-gray-300 text-gray-700 font-light rounded hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Apply Filter
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <p className="text-gray-600 font-light text-sm mb-2">Total Revenue</p>
                <p className="text-3xl font-light text-black">₹{salesReport?.totalRevenue?.toLocaleString() || '0'}</p>
                <p className="text-xs text-green-600 font-light mt-2">+12.5% from last period</p>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <p className="text-gray-600 font-light text-sm mb-2">Total Orders</p>
                <p className="text-3xl font-light text-black">{salesReport?.totalOrders || '0'}</p>
                <p className="text-xs text-green-600 font-light mt-2">+8.2% from last period</p>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <p className="text-gray-600 font-light text-sm mb-2">Avg. Order Value</p>
                <p className="text-3xl font-light text-black">₹{salesReport?.avgOrderValue?.toLocaleString() || '0'}</p>
                <p className="text-xs text-gray-600 font-light mt-2">Per transaction</p>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <p className="text-gray-600 font-light text-sm mb-2">Conversion Rate</p>
                <p className="text-3xl font-light text-black">{salesReport?.conversionRate || '0'}%</p>
                <p className="text-xs text-green-600 font-light mt-2">+3.1% from last period</p>
              </div>
            </div>

            {/* Sales Trend Table */}
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="text-lg font-light text-black mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Sales Trend
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-light text-gray-600">Period</th>
                      <th className="text-left py-3 px-4 text-sm font-light text-gray-600">Revenue</th>
                      <th className="text-left py-3 px-4 text-sm font-light text-gray-600">Orders</th>
                      <th className="text-left py-3 px-4 text-sm font-light text-gray-600">Avg. Order Value</th>
                      <th className="text-left py-3 px-4 text-sm font-light text-gray-600">Growth %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesReport?.data && salesReport.data.length > 0 ? (
                      salesReport.data.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-light text-gray-900">{item.period}</td>
                          <td className="py-3 px-4 text-sm font-light text-gray-900">₹{item.revenue?.toLocaleString()}</td>
                          <td className="py-3 px-4 text-sm font-light text-gray-700">{item.orders}</td>
                          <td className="py-3 px-4 text-sm font-light text-gray-700">₹{item.avgOrderValue?.toLocaleString()}</td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`font-light ${item.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {item.growth > 0 ? '+' : ''}{item.growth}%
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-500 font-light">
                          No data available for selected period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="text-lg font-light text-black mb-6">Top Selling Products</h3>

              <div className="space-y-3">
                {salesReport?.topProducts && salesReport.topProducts.length > 0 ? (
                  salesReport.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-light text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-600 font-light">{product.quantity} sold</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-light text-gray-900">₹{product.totalSales?.toLocaleString()}</p>
                        <p className="text-xs text-green-600 font-light">{product.contribution}% of total</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 font-light py-6">No product data available</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
