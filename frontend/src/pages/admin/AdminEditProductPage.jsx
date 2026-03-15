// frontend/src/pages/admin/AdminEditProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import { HiOutlineUpload, HiOutlineX } from 'react-icons/hi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

const AdminEditProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [modelFile, setModelFile] = useState(null);
    const [existingModelUrl, setExistingModelUrl] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        categories: [],
        sizes: [],
        colors: [],
        stock: '',
        stockByColor: [],
        discount: '0'
    });

    const categories = ['Men', 'Women', 'Kids'];
    const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y'];
    const colorOptions = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown', 'Grey', 'Navy'];

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const product = await productService.getProductById(id);
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                categories: product.categories || (product.category ? [product.category] : []),
                sizes: product.sizes || [],
                colors: product.colors || [],
                stock: product.stock || '',
                stockByColor: product.stockByColor || (product.colors
                    ? product.colors.map(c => ({ color: c, stock: product.stock || 0 }))
                    : []),
                discount: product.discount || '0'
            });
            setExistingImages(product.images || []);
            setExistingModelUrl(product.modelUrl || null);
        } catch (error) {
            toast.error('Failed to load product');
            navigate('/admin/products');
        } finally {
            setFetchLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCategoryToggle = (cat) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.includes(cat)
                ? prev.categories.filter(c => c !== cat)
                : [...prev.categories, cat]
        }));
    };

    const handleSizeToggle = (size) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    const handleColorToggle = (color) => {
        setFormData(prev => {
            const newColors = prev.colors.includes(color)
                ? prev.colors.filter(c => c !== color)
                : [...prev.colors, color];

            let newStockByColor = [...prev.stockByColor];
            if (prev.colors.includes(color)) {
                // removing color
                newStockByColor = newStockByColor.filter(s => s.color !== color);
            } else {
                // adding color
                newStockByColor.push({ color, stock: 0 });
            }

            return {
                ...prev,
                colors: newColors,
                stockByColor: newStockByColor
            };
        });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...newImages]);
    };

    const handleStockByColorChange = (color, value) => {
        setFormData(prev => {
            const updated = prev.stockByColor.map(item =>
                item.color === color ? { ...item, stock: Number(value) } : item
            );
            return { ...prev, stockByColor: updated };
        });
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleModelUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setModelFile(file);
        }
    };

    const removeModel = () => {
        setModelFile(null);
        setExistingModelUrl(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.categories.length === 0) {
            toast.error('Please select at least one category');
            return;
        }

        if (formData.sizes.length === 0) {
            toast.error('Please select at least one size');
            return;
        }

        // if we have colors, ensure each has stock filled
        if (formData.colors.length > 0) {
            const missing = formData.stockByColor.some(s => s.stock === '' || s.stock === null);
            if (missing) {
                toast.error('Please enter stock for each selected color');
                return;
            }
        }

        setLoading(true);

        try {
            // Update product details - only send necessary fields
            const productData = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                categories: formData.categories,
                sizes: formData.sizes,
                colors: formData.colors,
                discount: Number(formData.discount),
                images: existingImages
            };

            // Add stock data based on whether we're using stockByColor or simple stock
            if (formData.stockByColor && formData.stockByColor.length > 0) {
                productData.stockByColor = formData.stockByColor.map(item => ({
                    color: item.color,
                    stock: Number(item.stock)
                }));
            } else {
                productData.stock = Number(formData.stock);
            }

            await productService.updateProduct(id, productData);

            // Upload new images if any
            if (images.length > 0) {
                const formData = new FormData();
                images.forEach(img => {
                    formData.append('images', img.file);
                });
                await productService.uploadImages(id, formData);
            }

            // Upload 3D model if provided
            if (modelFile) {
                const modelFormData = new FormData();
                modelFormData.append('model', modelFile);
                await productService.uploadModel(id, modelFormData);
            }

            toast.success('Product updated successfully');
            navigate('/admin/products');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update product');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return <Loader fullScreen />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 py-8">
            <div className="container-custom max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-amber-100"
                >
                    <h1 className="text-3xl font-bold mb-8 text-gray-800">Edit Product</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => handleCategoryToggle(cat)}
                                            className={`px-4 py-2 border rounded-lg transition ${
                                                formData.categories.includes(cat)
                                                    ? 'bg-rose-600 text-white border-rose-600'
                                                    : 'border-gray-300 text-gray-700 hover:border-rose-500 hover:text-rose-600'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
                                required
                            />
                        </div>

                        {/* Price and Stock */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (₹) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Discount (%)
                                </label>
                                <input
                                    type="number"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleInputChange}
                                    min="0"
                                    max="100"
                                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
                                />
                            </div>

                            {formData.colors.length === 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Stock *
                                    </label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        {/* Sizes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Available Sizes *
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {sizeOptions.map(size => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => handleSizeToggle(size)}
                                        className={`px-4 py-2 border rounded-lg transition ${
                                            formData.sizes.includes(size)
                                                ? 'bg-rose-600 text-white border-rose-600'
                                                : 'border-gray-300 text-gray-700 hover:border-rose-500 hover:text-rose-600'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Colors */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Available Colors *
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {colorOptions.map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => handleColorToggle(color)}
                                        className={`px-4 py-2 border rounded-lg transition ${
                                            formData.colors.includes(color)
                                                ? 'bg-rose-600 text-white border-rose-600'
                                                : 'border-gray-300 text-gray-700 hover:border-rose-500 hover:text-rose-600'
                                        }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color-specific stock inputs */}
                        {formData.colors.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock per Color *
                                </label>
                                <div className="space-y-2">
                                    {formData.stockByColor.map(item => (
                                        <div key={item.color} className="flex items-center gap-2">
                                            <span className="w-24 text-gray-700">{item.color}:</span>
                                            <input
                                                type="number"
                                                min="0"
                                                value={item.stock}
                                                onChange={(e) => handleStockByColorChange(item.color, e.target.value)}
                                                className="w-32 px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Existing Images */}
                        {existingImages.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Existing Images
                                </label>
                                <div className="grid grid-cols-4 gap-4 mb-4">
                                    {existingImages.map((img, index) => (
                                        <div key={index} className="relative aspect-square">
                                            <img
                                                src={img}
                                                alt={`Product ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg border border-amber-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(index)}
                                                className="absolute -top-2 -right-2 bg-rose-600 text-white p-1 rounded-full hover:bg-rose-700 shadow-lg"
                                            >
                                                <HiOutlineX className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Add New Images
                            </label>
                            
                            {/* New Image Preview */}
                            {images.length > 0 && (
                                <div className="grid grid-cols-4 gap-4 mb-4">
                                    {images.map((img, index) => (
                                        <div key={index} className="relative aspect-square">
                                            <img
                                                src={img.preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg border border-amber-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-rose-600 text-white p-1 rounded-full hover:bg-rose-700 shadow-lg"
                                            >
                                                <HiOutlineX className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Upload Button */}
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-amber-300 rounded-lg cursor-pointer hover:border-rose-500 transition bg-white/50">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <HiOutlineUpload className="w-8 h-8 text-rose-400 mb-2" />
                                    <p className="text-sm text-gray-500">
                                        Click to upload new images
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* 3D Model Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                3D Model (Optional)
                            </label>
                            
                            {/* Existing Model */}
                            {existingModelUrl && !modelFile && (
                                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-green-600 font-medium">✓ 3D Model Available</span>
                                            <span className="text-sm text-gray-500">
                                                {existingModelUrl.split('/').pop()}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeModel}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* New Model Preview */}
                            {modelFile && (
                                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-blue-600 font-medium">New Model Selected:</span>
                                            <span className="text-sm text-gray-700">{modelFile.name}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeModel}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Upload Button */}
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-amber-300 rounded-lg cursor-pointer hover:border-rose-500 transition bg-white/50">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <HiOutlineUpload className="w-8 h-8 text-rose-400 mb-2" />
                                    <p className="text-sm text-gray-500 text-center">
                                        Click to upload 3D model<br />
                                        <span className="text-xs">Supports .gltf, .glb, .usdz, .obj files</span>
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    accept=".gltf,.glb,.usdz,.obj"
                                    onChange={handleModelUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/products')}
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition disabled:opacity-50 shadow-lg"
                            >
                                {loading ? 'Updating...' : 'Update Product'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminEditProductPage;