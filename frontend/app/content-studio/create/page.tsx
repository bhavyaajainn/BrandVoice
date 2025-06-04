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
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="rounded-xl shadow-lg p-8 bg-slate-200">
                        <h1 className="text-3xl font-bold mb-8 text-slate-800">Tell us about your product</h1>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Product Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Product Description
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Provide a detailed description of your product..."
                                    className="w-full rounded-xl border bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={productDetails.description}
                                    onChange={(e) => setProductDetails(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </div>

                            {/* Platform Selection */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3">
                                    Select Platform
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {platforms.map((platform) => (
                                        <button
                                            key={platform.id}
                                            className={`flex items-center justify-center p-4 rounded-xl border shadow-sm transition-all duration-200 bg-white ${
                                                productDetails.selectedPlatform === platform.id
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                                                    : 'hover:shadow-md hover:border-gray-300'
                                            }`}
                                            onClick={() => setProductDetails(prev => ({ ...prev, selectedPlatform: platform.id }))}
                                        >
                                            <span className="text-2xl mr-2">{platform.icon}</span>
                                            <span className="font-medium">{platform.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Upload Images (Optional)
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl bg-white hover:border-gray-300 transition-colors">
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
                                        <div className="flex text-sm">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
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
                                            <p className="pl-1 text-slate-600">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            </div>

                            {/* Language Selection */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Content Language
                                </label>
                                <select
                                    value={productDetails.language}
                                    onChange={(e) => setProductDetails(prev => ({ ...prev, language: e.target.value }))}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border rounded-xl focus:outline-none focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white text-slate-700"
                                >
                                    <option>English</option>
                                    <option>Spanish</option>
                                    <option>French</option>
                                    <option>German</option>
                                    <option>Italian</option>
                                </select>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 rounded-xl shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                                >
                                    Generate Content
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 