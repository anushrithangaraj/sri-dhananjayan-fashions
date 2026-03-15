// frontend/src/pages/ContactPage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    HiOutlineMail, 
    HiOutlinePhone, 
    HiOutlineLocationMarker,
    HiOutlineClock,
    HiOutlineUser,
    HiOutlineChat
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../services/api';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await api.post('/contact', formData);
            toast.success('Message sent successfully! We\'ll get back to you soon.');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: HiOutlinePhone,
            title: 'Phone',
            details: ['+91 98765 43210', '+91 98765 43211'],
            action: 'tel:+919876543210'
        },
        {
            icon: HiOutlineMail,
            title: 'Email',
            details: ['dhananjayanfashions@gmail.com'],
            action: 'mailto:info@dhananjayan.com'
        },
        {
            icon: HiOutlineLocationMarker,
            title: 'Visit Us',
            details: ['', 'Design District, Mumbai - 400001'],
            action: 'https://maps.google.com/?q=Mumbai'
        },
        {
            icon: HiOutlineClock,
            title: 'Business Hours',
            details: ['Monday - Saturday: 10am - 8pm', 'Sunday: 11am - 6pm']
        }
    ];

    const faqs = [
        {
            question: 'How can I track my order?',
            answer: 'Once your order is shipped, you will receive a tracking link via email and SMS. You can also track your order from your account dashboard.'
        },
        {
            question: 'What is your return policy?',
            answer: 'We offer 15-day easy returns on all products. Items must be unused with original tags attached. Return shipping is free.'
        },
        {
            question: 'Do you ship internationally?',
            answer: 'Currently, we ship only within India. We plan to start international shipping soon.'
        },
        {
            question: 'How can I cancel my order?',
            answer: 'Orders can be cancelled within 24 hours of placement. Please contact our support team immediately for cancellation.'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-rose-900 to-amber-800 text-white py-16">
                <div className="container-custom text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl font-bold mb-4 font-serif">Get in Touch</h1>
                        <p className="text-xl text-rose-100 max-w-2xl mx-auto">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-16">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-20">
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 text-center border border-amber-100 hover:border-rose-200 transition-all"
                            >
                                <div className="inline-block p-3 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full mb-4">
                                    <info.icon className="w-6 h-6 text-rose-700" />
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-2 font-serif">{info.title}</h3>
                                {info.details.map((detail, i) => (
                                    info.action ? (
                                        <a
                                            key={i}
                                            href={info.action}
                                            className="block text-gray-600 hover:text-rose-600 transition"
                                        >
                                            {detail}
                                        </a>
                                    ) : (
                                        <p key={i} className="text-gray-600">{detail}</p>
                                    )
                                ))}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form & Map */}
            <section className="py-16 bg-white/70 backdrop-blur-sm">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 font-serif">Send us a Message</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Name *
                                    </label>
                                    <div className="relative">
                                        <HiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/80"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <HiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/80"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <div className="relative">
                                        <HiOutlineChat className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-400" />
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/80"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="5"
                                        className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/80"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-rose-600 to-amber-700 text-white py-3 rounded-lg font-semibold hover:from-rose-700 hover:to-amber-800 transition disabled:opacity-50 shadow-lg"
                                >
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </motion.div>

                        {/* Map */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 font-serif">Visit Our Store</h2>
                            <div className="bg-gradient-to-br from-rose-100 to-amber-100 rounded-xl overflow-hidden h-[400px] shadow-xl">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.555123456789!2d72.8777!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Store Location"
                                    className="grayscale hover:grayscale-0 transition"
                                />
                            </div>
                            
                            {/* Store Hours Note */}
                            <div className="mt-6 bg-gradient-to-r from-rose-50 to-amber-50 p-4 rounded-lg border border-rose-100">
                                <h3 className="font-semibold text-rose-800 mb-2 font-serif">Store Hours</h3>
                                <p className="text-gray-600">Monday - Saturday: 10:00 AM - 8:00 PM</p>
                                <p className="text-gray-600">Sunday: 11:00 AM - 6:00 PM</p>
                                <p className="text-sm text-rose-600 mt-2">* Closed on public holidays</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16">
                <div className="container-custom">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 font-serif">Frequently Asked Questions</h2>
                    
                    <div className="max-w-3xl mx-auto">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="mb-4"
                            >
                                <details className="group bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-amber-100">
                                    <summary className="flex items-center justify-between p-4 cursor-pointer list-none hover:bg-rose-50/50 rounded-lg transition">
                                        <h3 className="font-semibold text-gray-800 font-serif">{faq.question}</h3>
                                        <span className="transition group-open:rotate-180">
                                            <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </span>
                                    </summary>
                                    <div className="p-4 pt-0 text-gray-600 border-t border-rose-100">
                                        {faq.answer}
                                    </div>
                                </details>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-rose-900 to-amber-900">
                <div className="container-custom text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-bold text-white mb-4 font-serif">Need Immediate Assistance?</h2>
                        <p className="text-xl text-rose-100 mb-8">
                            Our customer support team is available 24/7 to help you.
                        </p>
                        <a
                            href="tel:+919876543210"
                            className="inline-flex items-center bg-white text-rose-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-50 transition shadow-xl"
                        >
                            <HiOutlinePhone className="w-6 h-6 mr-2" />
                            Call Us Now
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;