import React, { useEffect, useMemo, useState } from 'react';
import { X, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import adminService from '../../services/adminService.js';

const EMPTY_SIZE_ROW = { size: '', stock: 0 };

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    countInStock: '',
    category: '',
    clothingType: '',
    brand: 'ONS',
    fabric: '',
    occasion: '',
    workType: '',
    neckType: '',
    sleeveType: '',
    sizes: [EMPTY_SIZE_ROW],
    colors: '',
  });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sizeInput, setSizeInput] = useState('');
  const [sizeStockInput, setSizeStockInput] = useState('0');
  const [mainImageFile, setMainImageFile] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await adminService.getCategories();
        if (response.success) {
          setCategories(response.data || []);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        countInStock: product.countInStock || '',
        category: product.category?._id || '',
        clothingType: product.clothingType || '',
        brand: product.brand || 'ONS',
        fabric: product.fabric || '',
        occasion: product.occasion || '',
        workType: product.workType || '',
        neckType: product.neckType || '',
        sleeveType: product.sleeveType || '',
        sizes:
          Array.isArray(product.sizes) && product.sizes.length > 0
            ? product.sizes.map((sizeEntry) => ({
                size: typeof sizeEntry === 'object' ? sizeEntry.size || '' : sizeEntry || '',
                stock: typeof sizeEntry === 'object' ? sizeEntry.stock ?? 0 : 0,
              }))
            : [EMPTY_SIZE_ROW],
        colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
      });

      setMainImagePreview(product.mainImage?.url || '');
      setAdditionalImagePreviews(product.additionalImages?.map((image) => image.url).filter(Boolean) || []);
      setMainImageFile(null);
      setAdditionalImageFiles([]);
    }
  }, [product]);

  useEffect(() => {
    if (!mainImageFile) {
      return undefined;
    }

    const objectUrl = URL.createObjectURL(mainImageFile);
    setMainImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [mainImageFile]);

  useEffect(() => {
    if (!additionalImageFiles.length) {
      return undefined;
    }

    const objectUrls = additionalImageFiles.map((file) => URL.createObjectURL(file));
    setAdditionalImagePreviews((previous) => {
      const existingPreviews = product?.additionalImages?.map((image) => image.url).filter(Boolean) || [];
      return [...existingPreviews, ...objectUrls];
    });

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [additionalImageFiles, product]);

  const selectedCategoryName = useMemo(() => {
    const selectedCategory = categories.find((item) => item._id === formData.category);
    return selectedCategory?.name || '';
  }, [categories, formData.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSizeChange = (index, field, value) => {
    setFormData((previous) => ({
      ...previous,
      sizes: previous.sizes.map((entry, currentIndex) => (
        currentIndex === index ? { ...entry, [field]: value } : entry
      )),
    }));
  };

  const addSizeRow = () => {
    setFormData((previous) => ({
      ...previous,
      sizes: [...previous.sizes, { ...EMPTY_SIZE_ROW }],
    }));
  };

  const removeSizeRow = (index) => {
    setFormData((previous) => {
      const nextSizes = previous.sizes.filter((_, currentIndex) => currentIndex !== index);
      return {
        ...previous,
        sizes: nextSizes.length > 0 ? nextSizes : [{ ...EMPTY_SIZE_ROW }],
      };
    });
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setMainImageFile(file);
  };

  const handleAdditionalImagesChange = (e) => {
    setAdditionalImageFiles(Array.from(e.target.files || []));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.clothingType) {
      alert('Please fill in all required fields');
      return;
    }

    if (!product && !mainImageFile) {
      alert('Please upload a main product image');
      return;
    }

    const normalizedSizes = formData.sizes
      .map((entry) => ({
        size: String(entry.size || '').trim(),
        stock: Number(entry.stock || 0),
      }))
      .filter((entry) => entry.size.length > 0);

    const payload = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      countInStock: formData.countInStock,
      category: formData.category,
      clothingType: formData.clothingType,
      brand: formData.brand,
      fabric: formData.fabric,
      occasion: formData.occasion,
      workType: formData.workType,
      neckType: formData.neckType,
      sleeveType: formData.sleeveType,
      sizes: normalizedSizes,
      colors: formData.colors
        .split(',')
        .map((color) => color.trim())
        .filter(Boolean),
      image: mainImageFile || undefined,
      images: additionalImageFiles,
    };

    setSaving(true);
    try {
      await onSubmit(payload);
    } finally {
      setSaving(false);
    }
  };

  const clothingTypes = [
    'Saree',
    'Lehenga',
    'Kurti',
    'Salwar Suit',
    'Anarkali',
    'Palazzo Set',
    'Sharara',
    'Gharara',
    'Indo-Western',
    'Blouse',
    'Dupatta',
    'Ethnic Dress',
  ];
  const fabricOptions = [
    'Cotton',
    'Silk',
    'Chiffon',
    'Georgette',
    'Crepe',
    'Net',
    'Velvet',
    'Satin',
    'Organza',
    'Banarasi',
    'Chanderi',
    'Linen',
    'Rayon',
    'Polyester',
    'Art Silk',
  ];
  const occasionOptions = ['Casual', 'Party', 'Wedding', 'Festival', 'Office', 'Traditional', 'Formal', 'Bridal'];
  const workTypeOptions = ['Embroidered', 'Printed', 'Plain', 'Hand Work', 'Machine Work', 'Block Print', 'Digital Print', 'Mirror Work', 'Sequin Work', 'Zari Work'];
  const neckTypeOptions = ['Round Neck', 'V-Neck', 'Boat Neck', 'High Neck', 'Off Shoulder', 'Halter Neck', 'Square Neck'];
  const sleeveTypeOptions = ['Full Sleeve', 'Half Sleeve', '3/4 Sleeve', 'Sleeveless', 'Cap Sleeve'];
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size'];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-light text-black">{product ? 'Edit Product' : 'Add New Product'}</h2>
          {selectedCategoryName && <p className="text-sm text-gray-500 mt-1">Selected category: {selectedCategoryName}</p>}
        </div>
        <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-light text-gray-700 mb-2">Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-light"
            placeholder="Product name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-light text-gray-700 mb-2">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-light resize-none"
            placeholder="Product description"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">Price *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-light"
              placeholder="₹0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">Stock Count *</label>
            <input
              type="number"
              name="countInStock"
              value={formData.countInStock}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-light"
              placeholder="0"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-light"
              disabled={loadingCategories}
            >
              <option value="">{loadingCategories ? 'Loading categories...' : 'Select category'}</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-light"
              placeholder="ONS"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">Clothing Type *</label>
            <select
              name="clothingType"
              value={formData.clothingType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-light"
            >
              <option value="">Select type</option>
              {clothingTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">Occasion</label>
            <select
              name="occasion"
              value={formData.occasion}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-light"
            >
              <option value="">Select occasion</option>
              {occasionOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">Fabric</label>
            <select
              name="fabric"
              value={formData.fabric}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-light"
            >
              <option value="">Select fabric</option>
              {fabricOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">Colors</label>
            <input
              type="text"
              name="colors"
              value={formData.colors}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-light"
              placeholder="Red, Gold, Ivory"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">Work Type</label>
            <select
              name="workType"
              value={formData.workType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-light"
            >
              <option value="">Select work type</option>
              {workTypeOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">Neck Type</label>
            <select
              name="neckType"
              value={formData.neckType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-light"
            >
              <option value="">Select neck type</option>
              {neckTypeOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">Sleeve Type</label>
            <select
              name="sleeveType"
              value={formData.sleeveType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-light"
            >
              <option value="">Select sleeve type</option>
              {sleeveTypeOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-light text-gray-700">Sizes Available</label>
            <button
              type="button"
              onClick={addSizeRow}
              className="text-sm font-light text-black hover:underline inline-flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add size row
            </button>
          </div>
          <div className="space-y-3">
            {formData.sizes.map((entry, index) => (
              <div key={`${entry.size || 'size'}-${index}`} className="grid grid-cols-1 md:grid-cols-[1fr_120px_auto] gap-3 items-center">
                <select
                  value={entry.size}
                  onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-light"
                >
                  <option value="">Select size</option>
                  {sizeOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0"
                  value={entry.stock}
                  onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-light"
                  placeholder="Stock"
                />
                <button
                  type="button"
                  onClick={() => removeSizeRow(index)}
                  className="inline-flex items-center justify-center h-10 w-10 border border-gray-300 rounded text-gray-600 hover:text-black hover:bg-gray-50"
                  aria-label="Remove size row"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-light text-gray-700 mb-2">Main Image {product ? '' : '*'}</label>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
              <ImageIcon className="w-4 h-4" />
              <span className="font-light">Choose image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleMainImageChange} />
            </label>
            <span className="text-sm text-gray-500 font-light">
              {mainImageFile ? mainImageFile.name : product?.mainImage?.originalName || 'No new image selected'}
            </span>
          </div>
          {(mainImagePreview || product?.mainImage?.url) && (
            <div className="mt-3">
              <img
                src={mainImagePreview || product.mainImage.url}
                alt="Main preview"
                className="h-40 w-full max-w-sm object-cover rounded border border-gray-200"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-light text-gray-700 mb-2">Additional Images</label>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
              <Plus className="w-4 h-4" />
              <span className="font-light">Choose images</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleAdditionalImagesChange} />
            </label>
            <span className="text-sm text-gray-500 font-light">
              {additionalImageFiles.length > 0 ? `${additionalImageFiles.length} new files selected` : 'Optional'}
            </span>
          </div>
          {(additionalImagePreviews.length > 0 || (product?.additionalImages || []).length > 0) && (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {(additionalImagePreviews.length > 0 ? additionalImagePreviews : product.additionalImages?.map((image) => image.url) || []).map((preview, index) => (
                <img
                  key={`${preview}-${index}`}
                  src={preview}
                  alt={`Additional ${index + 1}`}
                  className="h-28 w-full object-cover rounded border border-gray-200"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-light rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-4 py-2 bg-black text-white font-light rounded hover:bg-gray-900 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
