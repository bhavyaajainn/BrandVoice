'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface SavedContent {
    id: string;
    title: string;
    description: string;
    preview: string;
    status: 'published' | 'scheduled' | 'draft';
    date: string;
}

export default function YourContent() {
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');

    const mockContent: SavedContent[] = [
        {
            id: '1',
            title: 'Summer Collection Launch',
            description: 'Introducing our latest summer collection with vibrant colors and fresh designs.',
            preview: '/images/content/summer-collection.jpg',
            status: 'published',
            date: 'June 15, 2024'
        },
        {
            id: '2',
            title: 'Product Showcase',
            description: 'Highlighting our best-selling products with detailed features and benefits.',
            preview: '/images/content/product-showcase.jpg',
            status: 'scheduled',
            date: 'June 20, 2024'
        },
        {
            id: '3',
            title: 'Brand Story',
            description: 'Sharing our journey and vision through engaging visuals and storytelling.',
            preview: '/images/content/brand-story.jpg',
            status: 'draft',
            date: 'June 25, 2024'
        }
    ];

    const sortedContent = mockContent
        .filter(content => {
            if (filter !== 'all' && content.status !== filter) return false;
            if (searchQuery) {
                return content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       content.description.toLowerCase().includes(searchQuery.toLowerCase());
            }
            return true;
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
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-slate-200 rounded-xl shadow-lg p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <h1 className="text-3xl font-bold text-slate-800">Your Content</h1>
                        
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            {/* Filter Dropdown */}
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="rounded-xl border bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="all">All Content</option>
                                <option value="published">Published</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="draft">Drafts</option>
                            </select>

                            {/* Search Input */}
                            <input
                                type="text"
                                placeholder="Search content..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full md:w-64 rounded-xl border bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sortedContent.map((content) => (
                            <motion.div
                                key={content.id}
                                initial={{ opacity: 0.8 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white rounded-lg shadow-sm overflow-hidden"
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
                                    <h3 className="text-lg font-medium text-slate-800 mb-1">{content.title}</h3>
                                    <p className="text-sm text-slate-600 mb-4">{content.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-500">{content.date}</span>
                                        <button className="text-blue-600 hover:text-blue-700">
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}