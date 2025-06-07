'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { ProductDetailsProps, ProductDetailsType } from '../types';

export default function ProductDetails({ navigate }: ProductDetailsProps) {
    const [productDetails, setProductDetails] = useState<ProductDetailsType>({
        description: '',
        selectedPlatform: '',
        images: [],
        language: 'English'
    });
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (productDetails.images.length > 0) {
            return;
        }
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            if (productDetails.images.length + filesArray.length > 10) {
                alert('You can only upload up to 10 images');
                return;
            }
            setProductDetails(prev => ({
                ...prev,
                images: [...prev.images, ...filesArray]
            }));
        }
    };

    const handleRemoveImage = (index: number) => {
        setProductDetails(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', productDetails);
    };

    const handleDragOver = (e: React.DragEvent) => {
        if (productDetails.images.length > 0) {
            e.preventDefault();
            return;
        }
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (productDetails.images.length > 0) {
            return;
        }

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            if (productDetails.images.length + files.length > 10) {
                alert('You can only upload up to 10 images');
                return;
            }
            setProductDetails(prev => ({
                ...prev,
                images: [...prev.images, ...files]
            }));
        }
    };

    return (
        <div className="bg-slate-50/95 backdrop-blur-sm rounded-2xl p-8 shadow-sm max-w-7xl mx-auto pr-4 sm:pr-6">
            <div className="p-4 sm:p-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-slate-800">Tell us about your product</h1>
                
                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                    <div>
                        <label className="block text-sm sm:text-base font-medium text-slate-700 mb-2">
                            Product Description
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Provide a detailed description of your product..."
                            className="w-full rounded-2xl border bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 sm:p-4 text-sm sm:text-base"
                            value={productDetails.description}
                            onChange={(e) => setProductDetails(prev => ({ ...prev, description: e.target.value }))}
                        />
                        <p className="text-xs sm:text-sm text-slate-500 mt-2">
                            Describe your product in detail to help us generate better content
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm sm:text-base font-medium text-slate-700 mb-3">
                            Select Platform
                        </label>
                        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4">
                            <button
                                type="button"
                                className={`flex items-center justify-center py-2.5 sm:py-3 px-5 sm:px-6 rounded-2xl sm:rounded-3xl bg-white shadow-sm transition-all duration-200 ${
                                    productDetails.selectedPlatform === 'instagram'
                                        ? 'ring-2 ring-pink-500 shadow-md'
                                        : 'hover:shadow-md hover:ring-1 hover:ring-pink-200 hover:-translate-y-0.5'
                                }`}
                                onClick={() => setProductDetails(prev => ({ ...prev, selectedPlatform: 'instagram' }))}
                            >
                                <div className="flex items-center gap-2">
                                    <svg 
                                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${
                                            productDetails.selectedPlatform === 'instagram'
                                                ? 'text-pink-600'
                                                : 'text-gray-500 group-hover:text-pink-400'
                                        }`} 
                                        viewBox="0 0 24 24" 
                                        fill="currentColor"
                                    >
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                    <span className={`text-sm sm:text-base font-medium transition-colors duration-200 ${
                                        productDetails.selectedPlatform === 'instagram'
                                            ? 'text-pink-600'
                                            : 'text-slate-800 hover:text-pink-500'
                                    }`}>
                                        Instagram
                                    </span>
                                </div>
                            </button>
                            <button
                                type="button"
                                className={`flex items-center justify-center py-2.5 sm:py-3 px-5 sm:px-6 rounded-2xl sm:rounded-3xl bg-white shadow-sm transition-all duration-200 ${
                                    productDetails.selectedPlatform === 'facebook'
                                        ? 'ring-2 ring-blue-500 shadow-md'
                                        : 'hover:shadow-md hover:ring-1 hover:ring-blue-200 hover:-translate-y-0.5'
                                }`}
                                onClick={() => setProductDetails(prev => ({ ...prev, selectedPlatform: 'facebook' }))}
                            >
                                <div className="flex items-center gap-2">
                                    <svg 
                                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${
                                            productDetails.selectedPlatform === 'facebook'
                                                ? 'text-blue-600'
                                                : 'text-gray-500 group-hover:text-blue-400'
                                        }`} 
                                        viewBox="0 0 24 24" 
                                        fill="currentColor"
                                    >
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                    <span className={`text-sm sm:text-base font-medium transition-colors duration-200 ${
                                        productDetails.selectedPlatform === 'facebook'
                                            ? 'text-blue-600'
                                            : 'text-slate-800 hover:text-blue-500'
                                    }`}>
                                        Facebook
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm sm:text-base font-medium text-slate-700 mb-2">
                            Upload Images (Optional)
                        </label>
                        <div 
                            className={`mt-1 flex justify-center px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-6 border-2 border-dashed rounded-xl ${productDetails.images.length === 0 ? 'hover:border-gray-300' : ''} transition-colors ${productDetails.images.length > 0 ? 'cursor-not-allowed bg-gray-50' : ''}`}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <div className="space-y-2 text-center">
                                <svg
                                    className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400"
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
                                <div className="flex text-sm justify-center">
                                    {productDetails.images.length === 0 ? (
                                        <>
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
                                        </>
                                    ) : (
                                        <p className="text-slate-600">Remove current image to upload a new one</p>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                                <p className="text-xs text-slate-500">{10 - productDetails.images.length} images remaining</p>
                            </div>
                        </div>

                        {productDetails.images.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                                {productDetails.images.map((file, index) => (
                                    <div key={index} className="relative">
                                        <div 
                                            className="aspect-square w-full rounded-lg overflow-hidden cursor-pointer"
                                        >
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Upload ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm sm:text-base font-medium text-slate-700 mb-2">
                            Content Language
                        </label>
                        <div className="relative">
                            <div className="mt-1 w-32 sm:w-40 pl-2 sm:pl-3 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-base border rounded-xl shadow-sm bg-white text-slate-700 flex items-center justify-between">
                                <span>{productDetails.language}</span>
                                <svg className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <select
                                value={productDetails.language}
                                onChange={(e) => setProductDetails(prev => ({ ...prev, language: e.target.value }))}
                                className="absolute inset-0 w-32 sm:w-40 opacity-0 cursor-pointer"
                            >
                                <option>English</option>
                                <option>Spanish</option>
                                <option>French</option>
                                <option>German</option>
                                <option>Italian</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex justify-center items-center py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl shadow-md text-sm sm:text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                            onClick={() => navigate('moodboard')}
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <path d="M21 15l-5-5L5 21"/>
                            </svg>
                            Generate Mood Board
                        </motion.button>
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex justify-center items-center py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl shadow-md text-sm sm:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            onClick={() => navigate('generateContent')}
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                                <path d="M2 2l7.586 7.586"/>
                                <circle cx="11" cy="11" r="2"/>
                            </svg>
                            Generate Content
                        </motion.button>
                    </div>
                </form>
            </div>

            {selectedImage && (
                <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <div className="relative max-w-4xl w-full max-h-[90vh]">
                            <img
                                src={selectedImage}
                                alt="Selected image"
                                className="w-full h-full object-contain"
                            />
                            <button
                                type="button"
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-sm"
                            >
                                <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </Dialog>
            )}
        </div>
    );
} 