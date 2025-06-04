'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface SavedContent {
    id: string;
    type: 'post' | 'video';
    platform: string;
    title: string;
    preview: string;
    createdAt: string;
    status: 'draft' | 'scheduled' | 'published';
}

export default function YourContent() {
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data - replace with actual data from your backend
    const [savedContent] = useState<SavedContent[]>([
        {
            id: '1',
            type: 'post',
            platform: 'Instagram',
            title: 'Product Launch Post',
            preview: '/content/preview1.jpg',
            createdAt: '2024-03-15',
            status: 'published'
        },
        {
            id: '2',
            type: 'video',
            platform: 'Instagram',
            title: 'Brand Story Video',
            preview: '/content/preview2.jpg',
            createdAt: '2024-03-14',
            status: 'scheduled'
        },
        // Add more mock content items
    ]);

    const filteredContent = savedContent.filter(content => {
        if (filter !== 'all' && content.type !== filter) return false;
        if (searchQuery && !content.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const sortedContent = [...filteredContent].sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    const handleEdit = (id: string) => {
        // Handle edit functionality
        console.log('Edit content:', id);
    };

    const handleDelete = (id: string) => {
        // Handle delete functionality
        console.log('Delete content:', id);
    };

    const handleSchedule = (id: string) => {
        // Handle schedule functionality
        console.log('Schedule content:', id);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-7xl mx-auto"
            >
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Content</h1>

                    {/* Filters and Search */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-8">
                        <div className="flex flex-wrap gap-4">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="all">All Types</option>
                                <option value="post">Posts</option>
                                <option value="video">Videos</option>
                            </select>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                        <div className="w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Search content..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedContent.map((content) => (
                            <motion.div
                                key={content.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                            >
                                <div className="aspect-video relative">
                                    <Image
                                        src={content.preview}
                                        alt={content.title}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            content.status === 'published' ? 'bg-green-100 text-green-800' :
                                            content.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-medium text-gray-900">{content.title}</h3>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {content.platform}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Created on {new Date(content.createdAt).toLocaleDateString()}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(content.id)}
                                                className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(content.id)}
                                                className="inline-flex items-center px-2.5 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                        {content.status === 'draft' && (
                                            <button
                                                onClick={() => handleSchedule(content.id)}
                                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                                            >
                                                Schedule
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {sortedContent.length === 0 && (
                        <div className="text-center py-12">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No content found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchQuery
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'Get started by creating some content'}
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
} 