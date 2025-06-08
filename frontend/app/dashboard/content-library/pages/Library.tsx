'use client';

import React, { useState } from 'react';
import { FaImage, FaVideo, FaFileAlt, FaHashtag } from 'react-icons/fa';
import { LibraryProps } from '../types';

export default function Library({ navigate }: LibraryProps) {
    const [activeTab, setActiveTab] = useState<'images' | 'videos' | 'documents' | 'hashtags'>('images');

    return (
        <div className="space-y-2 sm:space-y-4 px-4 sm:px-8 md:px-12 bg-white backdrop-blur-sm rounded-2xl p-8 w-full max-w-7xl mx-auto">
            <section className="text-center w-full">
                <h1 className="text-2xl sm:text-4xl font-bold text-slate-800 mb-1 sm:mb-4">Content Library</h1>
                <p className="text-sm sm:text-lg text-slate-600 max-w-3xl mx-auto w-full">
                    Access and manage all your digital content in one place
                </p>
            </section>

            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center mb-4 sm:mb-8">
                <button
                    onClick={() => setActiveTab('images')}
                    className={`flex items-center px-4 py-2 rounded-lg ${
                        activeTab === 'images'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    <FaImage className="mr-2" />
                    Images
                </button>
                <button
                    onClick={() => setActiveTab('videos')}
                    className={`flex items-center px-4 py-2 rounded-lg ${
                        activeTab === 'videos'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    <FaVideo className="mr-2" />
                    Videos
                </button>
                <button
                    onClick={() => setActiveTab('documents')}
                    className={`flex items-center px-4 py-2 rounded-lg ${
                        activeTab === 'documents'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    <FaFileAlt className="mr-2" />
                    Documents
                </button>
                <button
                    onClick={() => setActiveTab('hashtags')}
                    className={`flex items-center px-4 py-2 rounded-lg ${
                        activeTab === 'hashtags'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    <FaHashtag className="mr-2" />
                    Hashtags
                </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 sm:p-8 min-h-[400px]">
                <div className="text-center text-gray-500">
                    <p>No {activeTab} found</p>
                    <button
                        onClick={() => {}} // Add upload functionality
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Upload {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </button>
                </div>
            </div>
        </div>
    );
} 