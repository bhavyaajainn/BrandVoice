'use client';

import React, { useState } from 'react';
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaRegImage, FaRegFileAlt, FaRegPlayCircle } from 'react-icons/fa';
import { AiOutlineFile, AiOutlineEye } from 'react-icons/ai';

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
    productCategory: string;
    originalTitle: string;
}

interface LibraryProps {
    navigate: (routeKey: string) => void;
}

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
        productCategory: 'Company'
    },
    {
        id: '4',
        originalTitle: 'Product Features Showcase',
        title: 'X-Product Features Showcase',
        type: 'image',
        status: 'draft',
        platforms: ['twitter'],
        createdAt: '2024-01-12',
        productCategory: 'Software'
    }
];

const BRAND_NAME = "TechFlow Solutions";

export default function Library({ navigate }: LibraryProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');
    const [expandedFolders, setExpandedFolders] = useState<string[]>(['Clothing', 'Software']);
    const [content, setContent] = useState<ContentItem[]>(mockContent);
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const [selectedView, setSelectedView] = useState<'all' | string>('all');

    const groupedContent = content.reduce((acc, item) => {
        if (!acc[item.productCategory]) {
            acc[item.productCategory] = [];
        }
        acc[item.productCategory].push(item);
        return acc;
    }, {} as Record<string, ContentItem[]>);

    const filteredContent = content.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||        
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
                return <FaInstagram className="w-5 h-5 text-white drop-shadow-sm" />;
            case 'facebook': 
                return <FaFacebook className="w-5 h-5 text-white drop-shadow-sm" />;
            case 'twitter': 
                return <FaTwitter className="w-5 h-5 text-white drop-shadow-sm" />;
            case 'youtube': 
                return <FaYoutube className="w-5 h-5 text-white drop-shadow-sm" />;
            default: 
                return <AiOutlineEye className="w-5 h-5 text-gray-500" />;
        }
    };

    const getPlatformTheme = (platform: string) => {
        switch (platform) {
            case 'instagram':
                return {
                    background: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
                    text: 'text-white',
                    icon: 'text-white',
                    isLight: false
                };
            case 'facebook':
                return {
                    background: 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800',
                    text: 'text-white', 
                    icon: 'text-white',
                    isLight: false
                };
            case 'twitter':
                return {
                    background: 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-700',
                    text: 'text-white',
                    icon: 'text-white',
                    isLight: false
                };
            case 'youtube':
                return {
                    background: 'bg-gradient-to-br from-red-600 via-red-700 to-red-800',
                    text: 'text-white',
                    icon: 'text-white',
                    isLight: false
                };
            default:
                return {
                    background: 'bg-white',
                    text: 'text-gray-900',
                    icon: 'text-gray-600',
                    isLight: true
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
                return <FaRegImage className="w-5 h-5 text-green-500" />;
            case 'video': 
                return <FaRegPlayCircle className="w-5 h-5 text-red-500" />;
            case 'text': 
                return <FaRegFileAlt className="w-5 h-5 text-blue-500" />;
            default: 
                return <AiOutlineFile className="w-5 h-5 text-blue-500" />;
        }
    };

    const handleContentClick = (item: ContentItem) => {
        navigate(`${item.id}-library`);
    };

    const renderFolderStructure = () => (
        <div className="space-y-2">
            <div className="p-3 bg-blue-50 rounded-lg mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-blue-900">{BRAND_NAME}</h2>
                {isDrawerOpen && (
                    <button
                        onClick={() => setIsDrawerOpen(false)}
                        className="ml-2 bg-white border border-gray-300 shadow-md rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        title="Close Drawer"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}
            </div>

            {!isDrawerOpen && (
                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="fixed top-1/2 left-0 transform -translate-y-1/2 z-50 bg-white border border-gray-300 shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    title="Open Drawer"
                >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            <div 
                className={`flex items-center justify-between p-3 rounded cursor-pointer transition-colors ${
                    selectedView === 'all' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedView('all')}
            >
                <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14-7l-7 7-7-7m14 18l-7-7-7 7" />
                    </svg>
                    <span className="font-medium">View All</span>
                </div>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {content.length}
                </span>
            </div>

            {Object.entries(groupedContent).map(([productCategory, items]) => (
                <div key={productCategory} className="space-y-1">
                    <div 
                        className={`flex items-center justify-between p-3 rounded cursor-pointer transition-colors ${
                            selectedView === productCategory ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => {
                            setSelectedView(productCategory);
                            toggleFolder(productCategory);
                        }}
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
                                    onClick={() => handleContentClick(item)}
                                >
                                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                                        {getContentIcon(item.type)}
                                        <span className="break-words">{item.title}</span>
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

    const getContentToShow = () => {
        if (selectedView === 'all') {
            return filteredContent;
        } else {
            return filteredContent.filter(item => item.productCategory === selectedView);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 relative">
            {isDrawerOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsDrawerOpen(false)}
                />
            )}

            <div className={`${
                isDrawerOpen ? 'w-80' : 'w-0'
            } transition-all duration-300 ease-in-out bg-white border-r border-gray-200 overflow-hidden fixed lg:relative h-full z-50 lg:z-auto`}>
                <div className="p-4 h-full overflow-y-auto">
                    {renderFolderStructure()}
                </div>
            </div>

            <div className={`flex-1 p-4 lg:p-6 overflow-y-auto transition-all duration-300 ease-in-out ${
                isDrawerOpen ? 'lg:ml-0' : 'ml-0'
            }`}>
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getContentToShow().map((item) => {
                        const platform = item.platforms[0];
                        const theme = getPlatformTheme(platform);
                        
                        return (
                            <div 
                                key={item.id} 
                                className={`${theme.background} rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-200 cursor-pointer`}
                                onClick={() => handleContentClick(item)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className={`${theme.icon} flex-shrink-0`}>
                                            {getPlatformIcon(item.platforms[0])}
                                        </div>
                                        <h3 className={`font-semibold break-words ${theme.text}`}>{item.title}</h3>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${
                                        item.status === 'published' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {item.status}
                                    </span>
                                </div>

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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleContentClick(item);
                                        }}
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate('generateContent');
                                        }}
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
                                            theme.background.includes('white') 
                                                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                                : 'bg-white text-gray-800 hover:bg-white/90'
                                        }`}
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

                {getContentToShow().length === 0 && (
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
        </div>
    );
}