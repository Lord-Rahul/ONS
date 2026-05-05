import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import adminService from '../services/adminService.js';
import useToast from '../hooks/useToast.js';

const AdminUsers = () => {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUsers({ search: searchTerm });
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      addToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-light text-black">Users</h1>
          <p className="text-gray-600 font-light">Manage customer accounts</p>
        </div>

        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-light"
          />
        </div>
      </div>

      {/* Users Table */}
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
                    <th className="px-6 py-3 text-left text-sm font-light text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-light text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-light text-gray-700">Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-light text-gray-700">Orders</th>
                    <th className="px-6 py-3 text-left text-sm font-light text-gray-700">Joined</th>
                    <th className="px-6 py-3 text-left text-sm font-light text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-light text-gray-900">
                          {user.fullName || user.name}
                        </td>
                        <td className="px-6 py-4 text-sm font-light text-gray-700">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-sm font-light text-gray-700">
                          {user.number || user.mobileNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm font-light text-gray-900">
                          {user.ordersCount || 0}
                        </td>
                        <td className="px-6 py-4 text-sm font-light text-gray-700">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-light bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500 font-light">
                        No users found
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

export default AdminUsers;
