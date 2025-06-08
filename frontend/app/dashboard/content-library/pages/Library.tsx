'use client';

import React, { useState } from 'react';

interface ContentItem {
    id: string;
    title: string;
    type: 'image' | 'video' | 'text';
    status: 'draft' | 'published';
    platforms: string[];
    createdAt: string;
    publishedAt?: string;
    publishedBy?: string;
    thumbnail?: string;
    content: string;
    productCategory: string;
    originalTitle: string; // Store original title without platform prefix
}

interface LibraryProps {
    navigate: (routeKey: string) => void;
}

// Mock data for demonstration - separate cards for each platform
const mockContent: ContentItem[] = [
    {
        id: '1',
        originalTitle: 'Summer Collection Launch',
        title: 'Instagram-Summer Collection Launch',
        type: 'image',
        status: 'published',
        platforms: ['instagram'],
        createdAt: '2024-01-15',
        publishedAt: '2024-01-16',
        publishedBy: 'John Doe',
        content: 'Introducing our stunning summer collection! 🌞 #SummerVibes #Fashion',
        productCategory: 'Clothing'
    },
    {
        id: '1-fb',
        originalTitle: 'Summer Collection Launch',
        title: 'Facebook-Summer Collection Launch', 
        type: 'image',
        status: 'published',
        platforms: ['facebook'],
        createdAt: '2024-01-15',
        publishedAt: '2024-01-16',
        publishedBy: 'John Doe',
        content: 'Introducing our stunning summer collection! 🌞 #SummerVibes #Fashion',
        productCategory: 'Clothing'
    },
    {
        id: '2',
        originalTitle: 'Product Tutorial Video',
        title: 'YouTube-Product Tutorial Video',
        type: 'video',
        status: 'draft',
        platforms: ['youtube'],
        createdAt: '2024-01-14',
        content: 'Learn how to use our latest product with this comprehensive tutorial.',
        productCategory: 'Software'
    },
    {
        id: '3',
        originalTitle: 'Brand Story Blog Post',
        title: 'Facebook-Brand Story Blog Post',
        type: 'text',
        status: 'published',
        platforms: ['facebook'],
        createdAt: '2024-01-13',
        publishedAt: '2024-01-14',
        publishedBy: 'Jane Smith',
        content: 'Our journey began 10 years ago with a simple vision...',
        productCategory: 'Company'
    },
    {
        id: '4',
        originalTitle: 'Product Features Showcase',
        title: 'Twitter-Product Features Showcase',
        type: 'image',
        status: 'draft',
        platforms: ['twitter'],
        createdAt: '2024-01-12',
        content: 'Check out the amazing features of our latest product! #Innovation #Tech',
        productCategory: 'Software'
    }
];

const BRAND_NAME = "TechFlow Solutions"; // This would come from user's brand settings

export default function Library({ navigate }: LibraryProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');
    const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
    const [expandedFolders, setExpandedFolders] = useState<string[]>(['Clothing', 'Software']);
    const [content, setContent] = useState<ContentItem[]>(mockContent);
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);

    // Group content by product category
    const groupedContent = content.reduce((acc, item) => {
        if (!acc[item.productCategory]) {
            acc[item.productCategory] = [];
        }
        acc[item.productCategory].push(item);
        return acc;
    }, {} as Record<string, ContentItem[]>);

    // Filter content based on search and status
    const filteredContent = content.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.originalTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const toggleFolder = (folderPath: string) => {
        setExpandedFolders(prev => 
            prev.includes(folderPath) 
                ? prev.filter(f => f !== folderPath)
                : [...prev, folderPath]
        );
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'instagram': 
                return (
                    <svg className="w-5 h-5 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                );
            case 'facebook': 
                return (
                    <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                );
            case 'twitter': 
                return (
                    <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                );
            case 'youtube': 
                return (
                    <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                );
            default: 
                return (
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                );
        }
    };

    const getPlatformTheme = (platform: string) => {
        switch (platform) {
            case 'instagram':
                return {
                    background: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-400',
                    text: 'text-white',
                    icon: 'text-white'
                };
            case 'facebook':
                return {
                    background: 'bg-blue-600',
                    text: 'text-white', 
                    icon: 'text-white'
                };
            case 'twitter':
                return {
                    background: 'bg-black',
                    text: 'text-white',
                    icon: 'text-white'
                };
            case 'youtube':
                return {
                    background: 'bg-red-600',
                    text: 'text-white',
                    icon: 'text-white'
                };
            default:
                return {
                    background: 'bg-white',
                    text: 'text-gray-900',
                    icon: 'text-gray-600'
                };
        }
    };

    const togglePublishStatus = (itemId: string) => {
        setContent(prev => prev.map(item => {
            if (item.id === itemId) {
                const newStatus = item.status === 'draft' ? 'published' : 'draft';
                return {
                    ...item,
                    status: newStatus,
                    publishedAt: newStatus === 'published' ? new Date().toISOString().split('T')[0] : undefined,
                    publishedBy: newStatus === 'published' ? 'Current User' : undefined
                };
            }
            return item;
        }));
    };

    const getContentIcon = (type: string) => {
        switch (type) {
            case 'image': 
                return (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            case 'video': 
                return (
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                );
            case 'text': 
                return (
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            default: 
                return (
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
        }
    };

    const renderFolderStructure = () => (
        <div className="space-y-2">
            {/* Brand Name Header */}
            <div className="p-3 bg-blue-50 rounded-lg mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-blue-900">{BRAND_NAME}</h2>
                {isDrawerOpen && (
                    <button
                        onClick={() => setIsDrawerOpen(false)}
                        className="ml-2 bg-white border border-gray-300 shadow-md rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        title="Close Drawer"
                    >
                        {/* Left Arrow (Close) */}
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Toggle Button - Outside when drawer is closed */}
            {!isDrawerOpen && (
                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="fixed top-1/2 left-0 transform -translate-y-1/2 z-50 bg-white border border-gray-300 shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    title="Open Drawer"
                >
                    {/* Right Arrow (Open) */}
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {/* Product Categories */}
            {Object.entries(groupedContent).map(([productCategory, items]) => (
                <div key={productCategory} className="space-y-1">
                    <div 
                        className="flex items-center justify-between p-3 hover:bg-gray-100 rounded cursor-pointer"
                        onClick={() => toggleFolder(productCategory)}
                    >
                        <div className="flex items-center space-x-2">
                            {expandedFolders.includes(productCategory) ? (
                                <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            <span className="font-medium">{productCategory}</span>
                        </div>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                            {items.length}
                        </span>
                    </div>
                    
                    {expandedFolders.includes(productCategory) && (
                        <div className="ml-6 space-y-1">
                            {items.map((item) => (
                                <div 
                                    key={item.id}
                                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer text-sm"
                                    onClick={() => setSelectedContent(item)}
                                >
                                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                                        {getContentIcon(item.type)}
                                        <span className="truncate">{item.title}</span>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs flex-shrink-0 ml-2 ${
                                        item.status === 'published' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {item.status === 'published' ? 'P' : 'D'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    const renderContentPreview = (item: ContentItem) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold">{item.originalTitle}</h3>
                        <button 
                            onClick={() => setSelectedContent(null)}
                            className="text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            ×
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                {getContentIcon(item.type)}
                                <span className="capitalize">{item.type}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 rounded text-sm font-medium ${
                                    item.status === 'published' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {item.status}
                                </span>
                            </div>
                            <div className="text-sm text-gray-500">
                                Category: {item.productCategory}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Content:</h4>
                            <p className="text-gray-700">{item.content}</p>
                        </div>

                        <div>
                            <h4 className="font-medium mb-3">Platforms:</h4>
                            <div className="flex flex-wrap gap-3">
                                {item.platforms.map(platform => (
                                    <div key={platform} className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                                        {getPlatformIcon(platform)}
                                        <span className="capitalize font-medium">{platform}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-600">Created:</span>
                                <div className="flex items-center space-x-2 mt-1">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{item.createdAt}</span>
                                </div>
                            </div>
                            {item.status === 'published' && item.publishedAt && (
                                <div>
                                    <span className="font-medium text-gray-600">Published:</span>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{item.publishedAt}</span>
                                    </div>
                                    {item.publishedBy && (
                                        <div className="flex items-center space-x-2 mt-1">
                                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-sm">by {item.publishedBy}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex space-x-3 pt-6 border-t">
                            <button 
                                onClick={() => {
                                    setSelectedContent(null);
                                    navigate('generateContent');
                                }}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Edit in Studio</span>
                            </button>
                            <button 
                                onClick={() => {
                                    togglePublishStatus(item.id);
                                    setSelectedContent({...item, status: item.status === 'draft' ? 'published' : 'draft'});
                                }}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                                    item.status === 'draft'
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-gray-600 text-white hover:bg-gray-700'
                                }`}
                            >
                                {item.status === 'draft' ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                                <span>{item.status === 'draft' ? 'Mark Published' : 'Mark as Draft'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50 relative">
            {/* Overlay for mobile */}
            {isDrawerOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsDrawerOpen(false)}
                />
            )}

            {/* Collapsible Left Sidebar */}
            <div className={`${
                isDrawerOpen ? 'w-80' : 'w-0'
            } transition-all duration-300 ease-in-out bg-white border-r border-gray-200 overflow-hidden fixed lg:relative h-full z-50 lg:z-auto`}>
                <div className="p-4 h-full overflow-y-auto">
                    {renderFolderStructure()}
                </div>
            </div>

            {/* Main Content Area */}
            <div className={`flex-1 p-4 lg:p-6 overflow-y-auto transition-all duration-300 ease-in-out ${
                isDrawerOpen ? 'lg:ml-0' : 'ml-0'
            }`}>
                {/* Search and Filter Bar */}
                <div className="mb-6 space-y-4">
                    <div className="flex items-center space-x-4">
                        <div className="relative flex-1">
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search content..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'draft' | 'published')}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[120px]"
                            >
                                <option value="all">All Status</option>
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredContent.map((item) => {
                        const platform = item.platforms[0]; // Get first platform since each card represents one platform
                        const theme = getPlatformTheme(platform);
                        
                        return (
                            <div key={item.id} className={`${theme.background} rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-200`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                                        <div className={theme.icon}>
                                            {getContentIcon(item.type)}
                                        </div>
                                        <h3 className={`font-semibold truncate ${theme.text}`}>{item.title}</h3>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${
                                        item.status === 'published' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {item.status}
                                    </span>
                                </div>

                                <p className={`text-sm mb-4 line-clamp-2 leading-relaxed ${
                                    theme.background.includes('white') ? 'text-gray-600' : 'text-white/90'
                                }`}>{item.content}</p>

                                <div className={`text-xs mb-4 space-y-1 ${
                                    theme.background.includes('white') ? 'text-gray-500' : 'text-white/75'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <span>Category: {item.productCategory}</span>
                                    </div>
                                    <div>Created: {item.createdAt}</div>
                                    {item.publishedAt && (
                                        <div className="text-green-200">Published: {item.publishedAt}</div>
                                    )}
                                </div>

                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() => setSelectedContent(item)}
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
                                            theme.background.includes('white') 
                                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                                                : 'bg-white/20 text-white hover:bg-white/30'
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <span>Preview</span>
                                    </button>
                                    <button 
                                        onClick={() => navigate('generateContent')}
                                        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors flex-1 justify-center"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <span>Edit</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredContent.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-gray-500">
                            <svg className="mx-auto h-16 w-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-xl font-medium mb-2 text-gray-700">No content found</h3>
                            <p className="text-gray-500">Try adjusting your search terms or filter criteria</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Preview Modal */}
            {selectedContent && renderContentPreview(selectedContent)}
        </div>
    );
}