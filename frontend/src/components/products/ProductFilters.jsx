// frontend/src/components/products/ProductFilters.jsx
import React, { useState } from 'react';
import { HiOutlineX, HiOutlineFilter } from 'react-icons/hi';
import ReactSlider from 'react-slider';
import { useProducts } from '../../context/ProductContext';

const ProductFilters = ({ isOpen, onClose }) => {
  const { filters, updateFilters } = useProducts();
  const [localFilters, setLocalFilters] = useState(filters);
  const [priceRange, setPriceRange] = useState([0, 10000]);

  const categories = ['Men', 'Women', 'Kids'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple'];

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    updateFilters(localFilters);
    onClose();
  };

  const clearFilters = () => {
    const resetFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      size: '',
      color: '',
      sort: 'newest',
      search: ''
    };
    setLocalFilters(resetFilters);
    updateFilters(resetFilters);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category}
                checked={localFilters.category === category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-4 h-4 text-primary-600"
              />
              <span className="ml-2 text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Price Range</h3>
        <div className="px-2">
          <ReactSlider
            className="w-full h-2 bg-gray-200 rounded-full"
            thumbClassName="w-5 h-5 bg-primary-600 rounded-full cursor-pointer -top-1.5 focus:outline-none"
            trackClassName="bg-primary-300"
            value={[
              Number(localFilters.minPrice) || 0,
              Number(localFilters.maxPrice) || 10000
            ]}
            min={0}
            max={10000}
            onChange={([min, max]) => {
              handleFilterChange('minPrice', min);
              handleFilterChange('maxPrice', max);
            }}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>₹{localFilters.minPrice || 0}</span>
            <span>₹{localFilters.maxPrice || 10000}</span>
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleFilterChange('size', size)}
              className={`px-3 py-1 border rounded-md transition ${
                localFilters.size === size
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'border-gray-300 text-gray-700 hover:border-primary-600'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Colors</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleFilterChange('color', color.toLowerCase())}
              className={`px-3 py-1 border rounded-md transition ${
                localFilters.color === color.toLowerCase()
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'border-gray-300 text-gray-700 hover:border-primary-600'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Sort By</h3>
        <select
          value={localFilters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        <button
          onClick={applyFilters}
          className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition"
        >
          Apply Filters
        </button>
        <button
          onClick={clearFilters}
          className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          Clear
        </button>
      </div>
    </div>
  );

  // Mobile Drawer
  if (isOpen) {
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />
        
        {/* Drawer */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <HiOutlineFilter className="mr-2" /> Filters
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <HiOutlineX className="w-5 h-5" />
            </button>
          </div>
          <FilterContent />
        </div>
      </div>
    );
  }

  // Desktop Sidebar
  return (
    <div className="hidden lg:block w-64 bg-white p-6 rounded-xl shadow-soft">
      <FilterContent />
    </div>
  );
};

export default ProductFilters;