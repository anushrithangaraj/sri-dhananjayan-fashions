// frontend/src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineLocationMarker,
  HiOutlineHeart 
} from 'react-icons/hi';
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaPinterest 
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-primary-800 mb-4">
              About Dhananjayan Fashions
            </h3>
            <p className="text-gray-600 mb-4">
              Discover the latest trends in fashion with our premium collection 
              of dresses for men, women, and kids. Quality meets style at 
              Dhananjayan Fashions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-600 transition">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600 transition">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600 transition">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600 transition">
                <FaPinterest className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-primary-800 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-600 hover:text-primary-600">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/products?category=Men" className="text-gray-600 hover:text-primary-600">
                  Men's Collection
                </Link>
              </li>
              <li>
                <Link to="/products?category=Women" className="text-gray-600 hover:text-primary-600">
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link to="/products?category=Kids" className="text-gray-600 hover:text-primary-600">
                  Kids' Collection
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary-600">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-primary-800 mb-4">
              Contact Info
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <HiOutlineLocationMarker className="w-5 h-5 text-primary-600 mt-0.5" />
                <span className="text-gray-600">
                 1/113, Pallagoundanpalayam & (Po), Vijayamangalam (Via), Uthukuli (Tk), Tiruppur - 638056.
Tamilnadu
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <HiOutlinePhone className="w-5 h-5 text-primary-600" />
                <a href="tel:+919876543210" className="text-gray-600 hover:text-primary-600">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <HiOutlineMail className="w-5 h-5 text-primary-600" />
                <a href="mailto:info@dhananjayan.com" className="text-gray-600 hover:text-primary-600">
                  dhananjayanrealty@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-primary-800 mb-4">
              Stay Updated
            </h3>
            <p className="text-gray-600 mb-4">
              Subscribe to get updates on new arrivals and special offers.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600 flex items-center justify-center">
            © {new Date().getFullYear()} Dhananjayan Fashions. All rights reserved.
            Made with <HiOutlineHeart className="w-4 h-4 text-red-500 mx-1" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;