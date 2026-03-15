// frontend/src/components/common/StarRating.jsx
import React from 'react';
import { HiStar } from 'react-icons/hi';

const StarRating = ({ value = 0, count = 5, size = 24, activeColor = '#ffd700', edit = false }) => {
    return (
        <div className="flex items-center gap-1">
            {[...Array(count)].map((_, index) => (
                <HiStar
                    key={index}
                    size={size}
                    className={`transition-colors ${
                        index < Math.round(value)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 fill-gray-300'
                    }`}
                    style={{
                        color: index < Math.round(value) ? activeColor : '#d1d5db',
                        fill: index < Math.round(value) ? activeColor : '#d1d5db'
                    }}
                />
            ))}
        </div>
    );
};

export default StarRating;
