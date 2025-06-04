'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ProductDetails {
    description: string;
    selectedPlatform: string;
    images: File[];
    language: string;
}

export default function CreateContent() {
    const [productDetails, setProductDetails] = useState<ProductDetails>({
        description: '',
        selectedPlatform: '',
        images: [],
        language: 'English'
    });

    const platforms = [
        { id: 'instagram', name: 'Instagram', icon: '📸' },
        { id: 'facebook', name: 'Facebook', icon: '👥' },
        { id: 'twitter', name: 'Twitter', icon: '🐦' },
        { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
        { id: 'tiktok', name: 'TikTok', icon: '🎵' }
    ];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setProductDetails(prev => ({
                ...prev,
                images: [...prev.images, ...filesArray]
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', productDetails);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto"
            >
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Tell us about your product</h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Product Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Product Description
                            </label>
                            <textarea
                                id="description"
                                rows={5}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Provide a detailed description of your product..."
                                value={productDetails.description}
                                onChange={(e) => setProductDetails(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>

                        {/* Platform Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                Select Platform
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {platforms.map((platform) => (
                                    <button
                                        key={platform.id}
                                        type="button"
                                        onClick={() => setProductDetails(prev => ({ ...prev, selectedPlatform: platform.id }))}
                                        className={`p-4 rounded-lg border-2 text-left hover:border-blue-500 transition-colors ${
                                            productDetails.selectedPlatform === platform.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200'
                                        }`}
                                    >
                                        <span className="text-2xl mr-2">{platform.icon}</span>
                                        <span className="font-medium">{platform.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Images (Optional)
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                <div className="space-y-1 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                        >
                                            <span>Upload files</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>

                        {/* Language Selection */}
                        <div>
                            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                                Content Language
                            </label>
                            <select
                                id="language"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                value={productDetails.language}
                                onChange={(e) => setProductDetails(prev => ({ ...prev, language: e.target.value }))}
                            >
                                <option value="English">English</option>
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                                <option value="German">German</option>
                                <option value="Italian">Italian</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Continue to Content Generation
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
} 