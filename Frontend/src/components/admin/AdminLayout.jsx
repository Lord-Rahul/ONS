import React, { useState, useEffect } from 'react';
import { ChevronRight, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Orders', path: '/admin/orders' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Categories', path: '/admin/categories' },
    { name: 'Reports', path: '/admin/reports' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-black text-white transition-all duration-300 fixed left-0 top-0 h-screen flex flex-col z-40`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <Link to="/admin" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white flex items-center justify-center rounded">
              <span className="text-black font-light text-lg">O</span>
            </div>
            {sidebarOpen && <span className="text-xl font-light tracking-[0.15em]">ONS</span>}
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded transition-colors ${
                isActive(item.path)
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:bg-gray-900'
              }`}
              title={!sidebarOpen ? item.name : ''}
            >
              {sidebarOpen && <span className="font-light">{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white rounded hover:bg-gray-900 transition-colors font-light text-sm"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && 'Logout'}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-4 top-24 bg-black border border-gray-700 rounded-full p-2 hover:bg-gray-900 transition-colors"
        >
          <ChevronRight className={`w-4 h-4 text-white transition-transform ${!sidebarOpen && 'rotate-180'}`} />
        </button>
      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 flex flex-col transition-all duration-300`}>
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-light text-black">Admin Panel</h1>
          <div className="text-sm text-gray-600 font-light">
            {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
