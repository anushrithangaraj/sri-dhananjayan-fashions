// frontend/src/pages/HomePage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductGrid from '../components/products/ProductGrid';
import Loader from '../components/common/Loader';
import { motion } from 'framer-motion';

const HomePage = () => {
  const { featuredProducts, fetchFeaturedProducts, loading } = useProducts();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const categories = [
    {
      name: 'Men',
      image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      link: '/products?category=Men'
    },
    {
      name: 'Women',
      image: 'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      link: '/products?category=Women'
    },
    {
      name: 'Kids',
      image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      link: '/products?category=Kids'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(data:image/jpeg;base64,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)',
          }}
        >
          <div className="absolute inset-0 bg-rose-900/50" />
        </div>
        
        <div className="relative container-custom h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Discover Your Style
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Explore the latest collection of premium fashion at Dhananjayan Fashions. 
              Quality meets elegance in every piece.
            </p>
            <Link
              to="/products"
              className="inline-block bg-white text-rose-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-rose-600 hover:text-white transition duration-300"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Shop by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={category.link}
                  className="group block relative h-80 rounded-xl overflow-hidden shadow-lg"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-900/80 to-transparent flex items-end">
                    <h3 className="text-white text-2xl font-bold p-6 w-full text-center">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white/50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Featured Collection</h2>
          
          {loading ? (
            <Loader />
          ) : (
            <ProductGrid products={featuredProducts} />
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-block border-2 border-rose-600 text-rose-600 px-8 py-3 rounded-lg font-semibold hover:bg-rose-600 hover:text-white transition"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;