// frontend/src/components/common/Rating.jsx
import React from 'react';
import { HiOutlineStar, HiStar } from 'react-icons/hi';

const Rating = ({ value, text, color = '#ffd700', size = 20 }) => {
    return (
        <div className="flex items-center">
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="relative">
                        {value >= star ? (
                            <HiStar style={{ color }} size={size} />
                        ) : value >= star - 0.5 ? (
                            <div className="relative">
                                <HiOutlineStar style={{ color }} size={size} />
                                <HiStar 
                                    style={{ color, clipPath: 'inset(0 50% 0 0)' }} 
                                    size={size} 
                                    className="absolute top-0 left-0"
                                />
                            </div>
                        ) : (
                            <HiOutlineStar style={{ color }} size={size} />
                        )}
                    </span>
                ))}
            </div>
            {text && <span className="ml-2 text-sm text-gray-600">{text}</span>}
        </div>
    );
};

export default Rating;