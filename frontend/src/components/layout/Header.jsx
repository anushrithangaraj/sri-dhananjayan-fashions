// frontend/src/components/layout/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { 
  HiOutlineUser, 
  HiOutlineShoppingBag, 
  HiOutlineMenu, 
  HiOutlineX,
  HiOutlineHome,
  HiOutlineCube,
  HiOutlineShoppingCart,
  HiOutlineLogout,
  HiOutlineMail
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Admin menu items - ONLY these four items
  const adminMenuItems = [
    { name: 'Admin Dashboard', path: '/admin', icon: HiOutlineHome },
    { name: 'Product Management', path: '/admin/products', icon: HiOutlineCube },
    { name: 'Customer Orders', path: '/admin/orders', icon: HiOutlineShoppingCart },
    { name: 'Contact Messages', path: '/admin/contact', icon: HiOutlineMail },
    { name: 'My Profile', path: '/profile', icon: HiOutlineUser },
  ];

  // Normal user menu items
  const userMenuItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md border-b border-amber-100">
      <nav className="container-custom">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between h-20">
          {/* Left - Navigation Links (Conditional based on role) */}
          <div className="flex items-center space-x-8">
            {isAuthenticated && isAdmin ? (
              /* Admin Menu - Only admin items */
              adminMenuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-gray-700 hover:text-rose-600 font-medium transition duration-200 flex items-center"
                >
                  <item.icon className="w-4 h-4 mr-1" />
                  {item.name}
                </Link>
              ))
            ) : (
              /* Normal User Menu */
              userMenuItems.map((link) => (
                (!link.protected || isAuthenticated) && (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-gray-700 hover:text-rose-600 font-medium transition duration-200"
                  >
                    {link.name}
                  </Link>
                )
              ))
            )}
          </div>

          {/* Center - Company Title (Always visible) */}
          <Link to={isAdmin ? "/admin" : "/"} className="text-2xl font-bold tracking-wide">
            <span className="text-rose-800">DHANANJAYAN</span>{' '}
            <span className="text-amber-700">FASHIONS</span>
          </Link>

          {/* Right - Icons (Conditional) */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {/* Admin Profile - Simple link, no dropdown */}
                {isAdmin ? (
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-gray-700 hover:text-rose-600"
                  >
                    <HiOutlineUser className="w-6 h-6" />
                    <span className="text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                  </Link>
                ) : (
                  /* Normal User Profile with Dropdown */
                  <div className="relative group">
                    <button className="flex items-center space-x-2 text-gray-700 hover:text-rose-600">
                      <HiOutlineUser className="w-6 h-6" />
                      <span className="text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                    </button>
                    
                    {/* Dropdown Menu - Only for normal users */}
                    <div className="absolute right-0 mt-0 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-amber-100">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}

                {/* Cart Icon - Only for normal users, hide for admin */}
                {!isAdmin && (
                  <Link to="/cart" className="relative text-gray-700 hover:text-rose-600">
                    <HiOutlineShoppingBag className="w-6 h-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}
              </>
            ) : (
              /* Not logged in - Show login link */
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-1 text-gray-700 hover:text-rose-600"
                >
                  <HiOutlineUser className="w-6 h-6" />
                  <span className="text-sm font-medium">Login</span>
                </Link>
                <Link to="/cart" className="relative text-gray-700 hover:text-rose-600">
                  <HiOutlineShoppingBag className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 hover:text-rose-600"
          >
            {isMobileMenuOpen ? (
              <HiOutlineX className="w-6 h-6" />
            ) : (
              <HiOutlineMenu className="w-6 h-6" />
            )}
          </button>

          {/* Company Title - Mobile */}
          <Link to={isAdmin ? "/admin" : "/"} className="text-lg font-bold tracking-wide">
            <span className="text-rose-800">DHANANJAYAN</span>{' '}
            <span className="text-amber-700">FASHIONS</span>
          </Link>

          {/* Cart Icon - Mobile (Hide for admin) */}
          {!isAdmin && (
            <Link to="/cart" className="relative text-gray-700">
              <HiOutlineShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          
          {/* Empty div for spacing when admin (no cart icon) */}
          {isAdmin && <div className="w-6"></div>}
        </div>

        {/* Mobile Menu - Conditional based on role */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-amber-100"
            >
              <div className="py-4 space-y-2">
                {isAuthenticated && isAdmin ? (
                  /* Admin Mobile Menu */
                  <>
                    {adminMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Icon className="w-5 h-5 mr-3" />
                          {item.name}
                        </Link>
                      );
                    })}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-3 text-rose-600 hover:bg-rose-50"
                    >
                      <HiOutlineLogout className="w-5 h-5 mr-3" />
                      Logout
                    </button>
                  </>
                ) : (
                  /* Normal User Mobile Menu */
                  <>
                    {userMenuItems.map((link) => (
                      (!link.protected || isAuthenticated) && (
                        <Link
                          key={link.path}
                          to={link.path}
                          className="block px-4 py-3 text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.name}
                        </Link>
                      )
                    ))}
                    
                    {!isAuthenticated ? (
                      <Link
                        to="/login"
                        className="block px-4 py-3 text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Login / Register
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/profile"
                          className="block px-4 py-3 text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-3 text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-3 text-rose-600 hover:bg-rose-50"
                        >
                          Logout
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;