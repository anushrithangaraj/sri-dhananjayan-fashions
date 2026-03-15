// frontend/src/components/common/Toast.jsx
import React, { useEffect } from 'react';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineInformationCircle, HiOutlineX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ message, type = 'info', duration = 4000, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <HiOutlineCheckCircle className="w-6 h-6 text-green-500" />,
        error: <HiOutlineExclamationCircle className="w-6 h-6 text-red-500" />,
        info: <HiOutlineInformationCircle className="w-6 h-6 text-blue-500" />,
        warning: <HiOutlineExclamationCircle className="w-6 h-6 text-yellow-500" />
    };

    const colors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200',
        warning: 'bg-yellow-50 border-yellow-200'
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg border shadow-soft-lg ${colors[type]}`}
        >
            {icons[type]}
            <span className="ml-3 mr-8 text-gray-700">{message}</span>
            <button
                onClick={onClose}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
                <HiOutlineX className="w-5 h-5" />
            </button>
        </motion.div>
    );
};

// Toast Container
export const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default Toast;