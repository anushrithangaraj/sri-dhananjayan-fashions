// frontend/src/components/products/ModelViewer.jsx
import React, { useRef, useEffect, useState } from 'react';

const ModelViewer = ({ modelUrl, productName, onClose }) => {
    const viewerRef = useRef(null);
    const [isARSupported, setIsARSupported] = useState(false);

    useEffect(() => {
        // Load model-viewer script if not already loaded
        if (!window.customElements.get('model-viewer')) {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
            script.type = 'module';
            document.head.appendChild(script);
        }

        // Check if AR is supported
        const checkARSupport = async () => {
            if (navigator.xr && navigator.xr.isSessionSupported) {
                const supported = await navigator.xr.isSessionSupported('immersive-ar');
                setIsARSupported(supported);
            }
        };

        checkARSupport();
    }, []);

    const handleARClick = () => {
        if (viewerRef.current) {
            viewerRef.current.activateAR();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">
                        3D View: {productName}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>
                <div className="p-4">
                    <div className="relative" style={{ height: '60vh' }}>
                        <model-viewer
                            ref={viewerRef}
                            src={modelUrl}
                            alt={productName}
                            ar
                            ar-modes="webxr scene-viewer quick-look"
                            camera-controls
                            touch-action="pan-y"
                            style={{ width: '100%', height: '100%' }}
                            exposure="1"
                            shadow-intensity="1"
                            environment-image="neutral"
                        >
                            {isARSupported && (
                                <button
                                    slot="ar-button"
                                    className="absolute bottom-4 right-4 bg-rose-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-rose-700 transition"
                                    onClick={handleARClick}
                                >
                                    View in AR
                                </button>
                            )}
                            <div className="absolute bottom-4 left-4 text-sm text-gray-600 max-w-xs">
                                <p>💡 <strong>Desktop:</strong> Use mouse to rotate, scroll to zoom</p>
                                {isARSupported ? (
                                    <p>📱 <strong>Mobile:</strong> Tap AR button for augmented reality</p>
                                ) : (
                                    <p>📱 <strong>Mobile:</strong> AR available on compatible devices</p>
                                )}
                            </div>
                        </model-viewer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelViewer;