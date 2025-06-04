'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface GeneratedContent {
    text: string;
    hashtags: string[];
    imageUrl: string;
}

export default function GenerateContent() {
    const [generatedContent, setGeneratedContent] = useState<GeneratedContent>({
        text: 'Experience luxury redefined with our premium leather collection. Each piece tells a story of craftsmanship and elegance, designed for the modern trendsetter. 🌟',
        hashtags: ['#luxuryfashion', '#premiumquality', '#fashionista', '#trending', '#style'],
        imageUrl: '/placeholder-image.jpg'
    });

    const [isRegenerating, setIsRegenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [imagePrompt, setImagePrompt] = useState('');
    const [showImagePrompt, setShowImagePrompt] = useState(false);

    const handleRegenerateImage = () => {
        setShowImagePrompt(true);
    };

    const handleRegenerateContent = () => {
        setIsRegenerating(true);
        // Simulate content regeneration
        setTimeout(() => {
            setIsRegenerating(false);
        }, 2000);
    };

    const handleSaveContent = () => {
        // Save content logic
        console.log('Content saved');
    };

    const handleSchedulePost = () => {
        // Navigate to scheduler
        console.log('Navigate to scheduler');
    };

    const handleDownloadAssets = () => {
        // Download assets logic
        console.log('Downloading assets');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto"
            >
                {!showPreview ? (
                    <div className="bg-white rounded-xl shadow-sm p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">Generated Content</h1>
                        
                        {/* Content Editor */}
                        <div className="space-y-8">
                            {/* Image Preview */}
                            <div className="relative">
                                <div className="aspect-square w-full relative rounded-lg overflow-hidden">
                                    <Image
                                        src={generatedContent.imageUrl}
                                        alt="Generated content"
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                                <button
                                    onClick={handleRegenerateImage}
                                    className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-sm hover:bg-gray-50"
                                >
                                    <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            </div>

                            {/* Text Editor */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Caption
                                </label>
                                <textarea
                                    rows={4}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={generatedContent.text}
                                    onChange={(e) => setGeneratedContent(prev => ({ ...prev, text: e.target.value }))}
                                />
                            </div>

                            {/* Hashtags */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hashtags
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {generatedContent.hashtags.map((hashtag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                        >
                                            {hashtag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center pt-6">
                                <button
                                    onClick={handleRegenerateContent}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    {isRegenerating ? 'Regenerating...' : 'Regenerate Content'}
                                </button>
                                <button
                                    onClick={() => setShowPreview(true)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Preview Post
                                </button>
                            </div>
                        </div>

                        {/* Image Regeneration Modal */}
                        {showImagePrompt && (
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Describe the image you want</h3>
                                    <textarea
                                        rows={4}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-4"
                                        value={imagePrompt}
                                        onChange={(e) => setImagePrompt(e.target.value)}
                                        placeholder="Describe the image you want to generate..."
                                    />
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            onClick={() => setShowImagePrompt(false)}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                // Handle image regeneration
                                                setShowImagePrompt(false);
                                            }}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            Generate Image
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Preview Section */}
                        <div className="bg-white rounded-xl shadow-sm p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Post Preview</h2>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="text-blue-600 hover:text-blue-500"
                                >
                                    Edit Content
                                </button>
                            </div>

                            {/* Mobile Preview */}
                            <div className="max-w-sm mx-auto border-2 border-gray-200 rounded-3xl p-4 bg-gray-50">
                                <div className="aspect-square w-full relative rounded-lg overflow-hidden mb-4">
                                    <Image
                                        src={generatedContent.imageUrl}
                                        alt="Preview content"
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <p className="text-gray-900">{generatedContent.text}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {generatedContent.hashtags.map((hashtag, index) => (
                                            <span key={index} className="text-blue-600">{hashtag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-center space-x-4 mt-8">
                                <button
                                    onClick={handleSaveContent}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Save Content
                                </button>
                                <button
                                    onClick={handleSchedulePost}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Schedule Post
                                </button>
                                <button
                                    onClick={handleDownloadAssets}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Download Assets
                                </button>
                            </div>
                        </div>

                        {/* Compliance Check */}
                        <div className="bg-white rounded-xl shadow-sm p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Compliance Check</h2>
                            <div className="space-y-4">
                                <div className="flex items-center text-green-600">
                                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Content follows community guidelines</span>
                                </div>
                                <div className="flex items-center text-green-600">
                                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>No trademark violations detected</span>
                                </div>
                                <div className="flex items-center text-green-600">
                                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Content is appropriate for target audience</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
} 