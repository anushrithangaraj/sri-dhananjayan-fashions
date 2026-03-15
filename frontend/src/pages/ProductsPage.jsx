// frontend/src/pages/ProductsPage.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';
import Loader from '../components/common/Loader';
import { HiOutlineFilter, HiOutlineViewGrid, HiOutlineViewList } from 'react-icons/hi';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const { products, loading, pagination, filters, fetchProducts, updateFilters } = useProducts();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    // Update filters from URL params
    const category = searchParams.get('category');
    if (category) {
      updateFilters({ category });
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts(currentPage, filters);
  }, [currentPage, filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 font-serif">Our Collection</h1>
            <div className="h-1 w-20 bg-gradient-to-r from-rose-400 to-amber-400 mt-2 rounded-full" />
          </div>
          
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="hidden md:flex bg-white rounded-lg shadow-md p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white' 
                    : 'text-gray-500 hover:text-rose-500'
                }`}
              >
                <HiOutlineViewGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white' 
                    : 'text-gray-500 hover:text-rose-500'
                }`}
              >
                <HiOutlineViewList className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <HiOutlineFilter className="w-5 h-5 text-rose-500" />
              <span className="text-gray-700">Filters</span>
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters - Desktop */}
          <ProductFilters 
            isOpen={isFilterOpen} 
            onClose={() => setIsFilterOpen(false)} 
          />

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort and Results Info */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-amber-100">
              <p className="text-gray-600 mb-2 sm:mb-0">
                <span className="font-semibold text-rose-600">{products.length}</span> of{' '}
                <span className="font-semibold text-amber-600">{pagination.totalCount}</span> products
              </p>
              
              <div className="flex items-center space-x-3">
                <label className="text-gray-600 text-sm">Sort by:</label>
                <select
                  value={filters.sort}
                  onChange={(e) => updateFilters({ sort: e.target.value })}
                  className="border border-amber-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader />
              </div>
            ) : (
              <>
                {products.length === 0 ? (
                  <div className="text-center py-16 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
                    <p className="text-gray-500 text-lg mb-4">No products found</p>
                    <button
                      onClick={() => {
                        updateFilters({ category: '', priceRange: '', rating: '' });
                        setCurrentPage(1);
                      }}
                      className="text-rose-600 hover:text-rose-700 font-semibold"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <>
                    <ProductGrid products={products} viewMode={viewMode} />
                    
                    {/* Pagination */}
                    {pagination.pages > 1 && (
                      <div className="flex justify-center mt-12">
                        <div className="flex space-x-2 bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-lg">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                              currentPage === 1
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-rose-50 hover:text-rose-600'
                            }`}
                          >
                            ←
                          </button>
                          
                          {[...Array(pagination.pages)].map((_, i) => {
                            const pageNum = i + 1;
                            // Show limited page numbers with ellipsis
                            if (
                              pageNum === 1 ||
                              pageNum === pagination.pages ||
                              (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                            ) {
                              return (
                                <button
                                  key={i}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`w-10 h-10 rounded-lg font-medium transition ${
                                    currentPage === pageNum
                                      ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md'
                                      : 'text-gray-700 hover:bg-rose-50 hover:text-rose-600'
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            } else if (
                              pageNum === currentPage - 2 ||
                              pageNum === currentPage + 2
                            ) {
                              return <span key={i} className="text-gray-400 px-1">...</span>;
                            }
                            return null;
                          })}
                          
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
                            disabled={currentPage === pagination.pages}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                              currentPage === pagination.pages
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-rose-50 hover:text-rose-600'
                            }`}
                          >
                            →
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default ProductsPage;