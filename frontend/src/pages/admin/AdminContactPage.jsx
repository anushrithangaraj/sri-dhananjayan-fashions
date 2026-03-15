// frontend/src/pages/admin/AdminContactPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import { HiOutlineTrash, HiOutlineEye, HiOutlineMail, HiOutlineX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminContactPage = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [reply, setReply] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            const response = await api.get('/contact');
            setMessages(response.data);
        } catch (error) {
            console.error('Error loading messages:', error);
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMessage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) {
            return;
        }

        try {
            await api.delete(`/contact/${id}`);
            toast.success('Message deleted');
            loadMessages();
        } catch (error) {
            toast.error('Failed to delete message');
        }
    };

    const handleReply = async (id) => {
        if (!reply.trim()) {
            toast.error('Please enter a reply');
            return;
        }

        try {
            await api.put(`/contact/${id}`, { reply });
            toast.success('Reply sent successfully');
            setReply('');
            setSelectedMessage(null);
            loadMessages();
        } catch (error) {
            toast.error('Failed to send reply');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'New':
                return 'bg-blue-100 text-blue-800';
            case 'Read':
                return 'bg-yellow-100 text-yellow-800';
            case 'Replied':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredMessages = filterStatus === 'all' 
        ? messages 
        : messages.filter(msg => msg.status === filterStatus);

    if (loading) {
        return <Loader fullScreen />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 py-8">
            <div className="container-custom">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Contact Messages</h1>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-4 py-2 rounded-lg transition ${
                            filterStatus === 'all'
                                ? 'bg-rose-600 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600'
                        }`}
                    >
                        All ({messages.length})
                    </button>
                    {['New', 'Read', 'Replied'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg transition ${
                                filterStatus === status
                                    ? 'bg-rose-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600'
                            }`}
                        >
                            {status} ({messages.filter(m => m.status === status).length})
                        </button>
                    ))}
                </div>

                {/* Messages List */}
                <div className="space-y-4">
                    {filteredMessages.length === 0 ? (
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 text-center border border-amber-100">
                            <HiOutlineMail className="w-16 h-16 mx-auto text-rose-300 mb-4" />
                            <p className="text-gray-600">No messages found</p>
                        </div>
                    ) : (
                        filteredMessages.map((message) => (
                            <motion.div
                                key={message._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition border border-amber-100"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-800">{message.name}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                                                    {message.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-1">{message.email}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(message.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedMessage(message)}
                                                className="p-2 text-gray-600 hover:bg-rose-100 hover:text-rose-600 rounded-lg transition"
                                                title="View"
                                            >
                                                <HiOutlineEye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteMessage(message._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Delete"
                                            >
                                                <HiOutlineTrash className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="border-t border-amber-200 pt-4">
                                        <p className="font-semibold text-gray-800 mb-2">Subject: {message.subject}</p>
                                        <p className="text-gray-700 text-sm line-clamp-2">{message.message}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Message Details Modal */}
                <AnimatePresence>
                    {selectedMessage && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white/90 backdrop-blur-sm rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-amber-100"
                            >
                                {/* Modal Header */}
                                <div className="sticky top-0 bg-gradient-to-r from-rose-50 to-amber-50 border-b border-amber-200 px-6 py-4 flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-800">Message Details</h2>
                                    <button
                                        onClick={() => setSelectedMessage(null)}
                                        className="p-2 text-gray-600 hover:bg-rose-200 rounded-lg transition"
                                    >
                                        <HiOutlineX className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <div className="p-6 space-y-6">
                                    {/* Sender Info */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Sender Information</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-600">Name</p>
                                                <p className="font-medium text-gray-800">{selectedMessage.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Email</p>
                                                <a 
                                                    href={`mailto:${selectedMessage.email}`}
                                                    className="font-medium text-rose-600 hover:text-rose-700 transition"
                                                >
                                                    {selectedMessage.email}
                                                </a>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Date</p>
                                                <p className="font-medium text-gray-800">
                                                    {new Date(selectedMessage.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Status</p>
                                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(selectedMessage.status)}`}>
                                                    {selectedMessage.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Message</h3>
                                        <div className="bg-gradient-to-r from-rose-50 to-amber-50 p-4 rounded-lg border border-amber-200">
                                            <p className="font-semibold text-gray-800 mb-3">Subject: {selectedMessage.subject}</p>
                                            <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                                        </div>
                                    </div>

                                    {/* Previous Reply */}
                                    {selectedMessage.reply && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Your Reply</h3>
                                            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                                <p className="text-green-800 whitespace-pre-wrap">{selectedMessage.reply}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Reply Form */}
                                    {selectedMessage.status !== 'Replied' && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Send Reply</h3>
                                            <div className="space-y-3">
                                                <textarea
                                                    value={reply}
                                                    onChange={(e) => setReply(e.target.value)}
                                                    placeholder="Type your reply here..."
                                                    rows="5"
                                                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white resize-none"
                                                />
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleReply(selectedMessage._id)}
                                                        className="flex-1 bg-rose-600 text-white py-2 rounded-lg font-semibold hover:bg-rose-700 transition shadow-md"
                                                    >
                                                        Send Reply
                                                    </button>
                                                    <button
                                                        onClick={() => setSelectedMessage(null)}
                                                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-amber-100 hover:text-rose-600 transition"
                                                    >
                                                        Close
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminContactPage;