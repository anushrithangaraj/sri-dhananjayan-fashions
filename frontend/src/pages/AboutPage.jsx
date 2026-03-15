// frontend/src/pages/AboutPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineHeart, HiOutlineStar, HiOutlineTruck, HiOutlineShieldCheck } from 'react-icons/hi';

const AboutPage = () => {
    const features = [
        {
            icon: HiOutlineHeart,
            title: 'Quality First',
            description: 'We source only the finest materials and work with skilled artisans to create timeless pieces.'
        },
        {
            icon: HiOutlineStar,
            title: 'Trendy Designs',
            description: 'Stay ahead of fashion with our curated collections that blend tradition with modernity.'
        },
        {
            icon: HiOutlineTruck,
            title: 'Fast Delivery',
            description: 'Quick and reliable shipping across India with real-time tracking.'
        },
        {
            icon: HiOutlineShieldCheck,
            title: 'Secure Shopping',
            description: '100% secure payments and easy returns within 15 days.'
        }
    ];

    const team = [
        {
            name: 'Dhananjayan',
            role: 'Founder & Creative Director',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            bio: 'With over 20 years in fashion industry, Dhananjayan brings visionary designs to life.'
        },
        {
            name: 'Priya Sharma',
            role: 'Head of Design',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            bio: 'Award-winning designer creating unique collections that celebrate Indian heritage.'
        },
        {
            name: 'Arjun Kumar',
            role: 'Quality Assurance',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            bio: 'Ensuring every piece meets our rigorous quality standards before reaching you.'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
            {/* Hero Section */}
            <section className="relative h-[500px] overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-900/80 to-amber-900/80" />
                </div>
                
                <div className="relative container-custom h-full flex items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-white max-w-2xl"
                    >
                        <h1 className="text-5xl font-bold mb-4 font-serif">Our Story</h1>
                        <p className="text-xl text-rose-100">
                            Crafting elegance since 2005 - Dhananjayan Fashions brings you the finest 
                            collection of traditional and contemporary wear.
                        </p>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100px' }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-1 bg-gradient-to-r from-rose-300 to-amber-300 mt-6 rounded-full"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl font-bold mb-6 text-gray-800 font-serif">Our Mission</h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                At Dhananjayan Fashions, we believe that clothing is more than just fabric - 
                                it's an expression of your personality. Our mission is to empower individuals 
                                to express themselves through elegant, high-quality fashion that celebrates 
                                both tradition and modernity.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                We work closely with skilled artisans and use sustainable practices to create 
                                pieces that not only look beautiful but also tell a story. Every garment is 
                                crafted with attention to detail, ensuring that you receive nothing but the best.
                            </p>
                            <div className="mt-6 flex gap-4">
                                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
                                    <span className="text-2xl font-bold text-rose-700">20</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Years of Excellence</p>
                                    <p className="text-sm text-gray-500">Serving since 2005</p>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-r from-rose-200 to-amber-200 rounded-3xl blur-2xl opacity-30" />
                            <img
                                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Our Workshop"
                                className="relative rounded-2xl shadow-2xl"
                            />
                            <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-rose-600 to-amber-600 text-white p-6 rounded-2xl shadow-xl">
                                <p className="text-4xl font-bold">20+</p>
                                <p className="text-sm text-rose-100">Years of Excellence</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white/70 backdrop-blur-sm">
                <div className="container-custom">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 font-serif">Why Choose Us</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center group"
                            >
                                <div className="inline-block p-5 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-8 h-8 text-rose-700" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-gradient-to-r from-rose-900 to-amber-900 text-white relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-300 rounded-full blur-3xl" />
                </div>
                
                <div className="container-custom text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-bold mb-6 font-serif">Our Values</h2>
                        <p className="text-xl mb-12 max-w-3xl mx-auto text-rose-100">
                            We are committed to ethical fashion, sustainable practices, and creating 
                            a positive impact on communities through our work.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
                            >
                                <p className="text-4xl font-bold mb-2">100%</p>
                                <p className="text-rose-100">Handcrafted with Love</p>
                            </motion.div>
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
                            >
                                <p className="text-4xl font-bold mb-2">2K+</p>
                                <p className="text-rose-100">Happy Customers</p>
                            </motion.div>
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
                            >
                                <p className="text-4xl font-bold mb-2">5+</p>
                                <p className="text-rose-100">Cities Served</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-white">
                <div className="container-custom text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Ready to Experience Fashion Redefined?</h2>
                        <p className="text-gray-600 mb-8">Explore our latest collections and find your perfect style</p>
                        <a 
                            href="/shop" 
                            className="inline-block bg-gradient-to-r from-rose-600 to-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-rose-700 hover:to-amber-700 transition shadow-lg"
                        >
                            Shop Now
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;