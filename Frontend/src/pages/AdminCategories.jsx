import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import adminService from '../services/adminService.js';
import useToast from '../hooks/useToast.js';

const AdminCategories = () => {
  const { addToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await adminService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      addToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      addToast('Category name is required', 'error');
      return;
    }

    try {
      const response = await adminService.addCategory({ name: newCategory });
      if (response.success) {
        addToast('Category added successfully.', 'success');
        setNewCategory('');
        setShowForm(false);
        fetchCategories();
      }
    } catch (error) {
      addToast(error.message || 'Failed to add category', 'error');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await adminService.deleteCategory(categoryId);
      if (response.success) {
        addToast('Category deleted successfully.', 'success');
        setDeleteConfirm(null);
        fetchCategories();
      }
    } catch (error) {
      addToast(error.message || 'Failed to delete category', 'error');
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryImageUrl = (category) => {
    return (
      category?.image?.url ||
      category?.imageUrl ||
      (typeof category?.image === 'string' ? category.image : '')
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-light text-black">Categories</h1>
            <p className="text-gray-600 font-light">Manage product categories</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setNewCategory('');
            }}
            className="px-6 py-2 bg-black text-white font-light rounded hover:bg-gray-900 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Cancel' : 'Add Category'}
          </button>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-light"
          />
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white border-b border-gray-200 p-8">
          <div className="max-w-md">
            <div className="flex gap-3">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-light"
              />
              <button
                onClick={handleAddCategory}
                className="px-6 py-2 bg-black text-white font-light rounded hover:bg-gray-900 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="p-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <div
                  key={category._id}
                  className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow"
                >
                  {getCategoryImageUrl(category) && (
                    <img
                      src={getCategoryImageUrl(category)}
                      alt={category.name}
                      className="w-full h-40 object-cover rounded mb-4"
                    />
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-light text-black">{category.name}</h3>
                    <button
                      onClick={() => setDeleteConfirm(category._id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 font-light">
                    {category.productsCount || 0} products
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 font-light">No categories found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-light text-black mb-4">Confirm Delete</h3>
            <p className="text-gray-600 font-light mb-6">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-light rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCategory(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-light rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
