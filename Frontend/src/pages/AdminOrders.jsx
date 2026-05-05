import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, Clock, XCircle } from 'lucide-react';
import adminService from '../services/adminService.js';
import useToast from '../hooks/useToast.js';

const AdminOrders = () => {
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminService.getOrders({
        status: filterStatus,
        search: searchTerm
      });
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      addToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await adminService.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        addToast('Order status updated.', 'success');
        fetchOrders();
      }
    } catch (error) {
      addToast('Failed to update order', 'error');
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-indigo-600" />;
      case 'shipped':
      case 'out_for_delivery':
        return <CheckCircle className="w-4 h-4 text-purple-600" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-light text-black">Orders</h1>
          <p className="text-gray-600 font-light">Manage customer orders</p>
        </div>

        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-light"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-light"
          >
            <option value="">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="p-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-light text-gray-700">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-light text-gray-700">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-light text-gray-700">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-light text-gray-700">Items</th>
                    <th className="px-6 py-3 text-left text-sm font-light text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-light text-gray-700">Date</th>
                    <th className="px-6 py-3 text-center text-sm font-light text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-light text-gray-900">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-light text-gray-900">{order.user?.fullName || order.user?.name || 'Unknown'}</p>
                            <p className="text-xs text-gray-500 font-light">{order.user?.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-light text-gray-900">
                          ₹{order.totalAmount}
                        </td>
                        <td className="px-6 py-4 text-sm font-light text-gray-700">
                          {order.items?.length || 0} items
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className={`text-xs font-light px-2 py-1 rounded-full ${
                              order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-indigo-100 text-indigo-800' :
                              order.status === 'shipped' || order.status === 'out_for_delivery' ? 'bg-purple-100 text-purple-800' :
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.status?.replace(/_/g, ' ')?.replace(/\b\w/g, (letter) => letter.toUpperCase())}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-light text-gray-700">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="text-sm px-2 py-1 border border-gray-300 rounded font-light focus:outline-none focus:border-black"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500 font-light">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
