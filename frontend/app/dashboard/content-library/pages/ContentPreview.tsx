'use client';

import React, { useState } from 'react';
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaRegImage, FaRegFileAlt, FaRegPlayCircle } from 'react-icons/fa';
import { AiOutlineFile, AiOutlineEye, AiOutlineEdit, AiOutlineArrowLeft, AiOutlineInfo, AiOutlineClose } from 'react-icons/ai';
import { InstagramPreview } from '../../../dashboard/content-studio/platforms/instagram/InstagramPreview';
import { FacebookPreview } from '../../../dashboard/content-studio/platforms/facebook/FacebookPreview';
import { XPreview } from '../../../dashboard/content-studio/platforms/X/XPreview';
import { YouTubePreview } from '../../../dashboard/content-studio/platforms/youtube/YouTubePreview';
import { sampleAssets } from '../../../dashboard/content-studio/helper';

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

interface ContentPreviewProps {
    contentId: string;
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

export default function ContentPreview({ contentId, navigate }: ContentPreviewProps) {
    const [content] = useState<ContentItem[]>(mockContent);
    const [expandedFolders, setExpandedFolders] = useState<string[]>(['Clothing', 'Software']);
    const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(true);
    const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);

    const selectedContent = content.find(item => item.id === contentId);
    
    const groupedContent = content.reduce((acc, item) => {
        if (!acc[item.productCategory]) {
            acc[item.productCategory] = [];
        }
        acc[item.productCategory].push(item);
        return acc;
    }, {} as Record<string, ContentItem[]>);

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
                return <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />;
            case 'facebook': 
                return <FaFacebook className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />;
            case 'twitter': 
                return <FaTwitter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />;
            case 'youtube': 
                return <FaYoutube className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />;
            default: 
                return <AiOutlineEye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />;
        }
    };

    const getContentIcon = (type: string) => {
        switch (type) {
            case 'image': 
                return <FaRegImage className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />;
            case 'video': 
                return <FaRegPlayCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />;
            case 'text': 
                return <FaRegFileAlt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />;
            default: 
                return <AiOutlineFile className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />;
        }
    };

    const handleContentClick = (item: ContentItem) => {
        navigate(`${item.id}-library`);
    };

    const togglePublishStatus = (itemId: string) => {
        console.log('Toggle publish status for:', itemId);
    };

    const getPreviewData = (item: ContentItem) => {
        const baseData = {
            text: `Check out our amazing ${item.originalTitle}! 🚀 #brand #content`,
            hashtags: ['#brand', '#content', '#amazing'],
            mediaType: item.type === 'text' ? 'image' : item.type,
            mediaUrls: item.type === 'video' ? [sampleAssets.video] : [sampleAssets.image],
            locationId: '',
        };

        const platform = item.platforms[0];
        switch (platform) {
            case 'instagram':
                return {
                    ...baseData,
                    mentions: ['@brandvoice', '@ai'],
                };
            case 'facebook':
                return {
                    ...baseData,
                    taggedPages: ['@BrandVoice'],
                    privacy: 'Public' as const,
                    linkUrl: 'https://brandvoice.ai',
                };
            case 'twitter':
                return {
                    ...baseData,
                    mentions: ['@brandvoice'],
                    poll: undefined,
                    quoteTweetId: undefined,
                };
            case 'youtube':
                return {
                    ...baseData,
                    title: item.originalTitle,
                    description: `Learn more about ${item.originalTitle} in this comprehensive guide.`,
                    tags: ['tutorial', 'guide', 'brand'],
                    videoUrl: sampleAssets.video,
                    thumbnailUrl: sampleAssets.image,
                    categoryId: '26',
                    privacyStatus: 'public' as const,
                    playlistId: 'PLf1XPHghri',
                };
            default:
                return baseData;
        }
    };

    const renderPreview = () => {
        if (!selectedContent) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center p-4">
                        <div className="text-gray-500">
                            <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-lg sm:text-xl font-medium mb-2 text-gray-700">Content not found</h3>
                            <p className="text-sm sm:text-base text-gray-500">The requested content could not be found.</p>
                        </div>
                    </div>
                </div>
            );
        }

        const previewData = getPreviewData(selectedContent);
        const platform = selectedContent.platforms[0];

        switch (platform) {
            case 'instagram':
                return <InstagramPreview post={previewData as any} />;
            case 'facebook':
                return <FacebookPreview post={previewData as any} />;
            case 'twitter':
                    return <XPreview post={previewData as any} />;
            case 'youtube':
                return <YouTubePreview post={previewData as any} />;
            default:
                return (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center p-4">
                            <p className="text-sm sm:text-base text-gray-500">Preview not available for this platform.</p>
                        </div>
                    </div>
                );
        }
    };

    const renderLeftDrawer = () => (
        <div className="space-y-2">
            <div className="p-3 bg-blue-50 rounded-lg mb-4 flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-blue-900">{BRAND_NAME}</h2>
                <button
                    onClick={() => setIsLeftDrawerOpen(false)}
                    className="ml-2 bg-white border border-gray-300 shadow-md rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-100 transition-colors lg:hidden"
                    title="Close Drawer"
                >
                    <svg className="w-3 h-3 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            <div 
                className="flex items-center justify-between p-2 sm:p-3 rounded cursor-pointer transition-colors hover:bg-gray-100"
                onClick={() => navigate('library')}
            >
                <div className="flex items-center space-x-2">
                    <AiOutlineArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                    <span className="text-sm sm:text-base font-medium">Back to Library</span>
                </div>
            </div>

            {Object.entries(groupedContent).map(([productCategory, items]) => (
                <div key={productCategory} className="space-y-1">
                    <div 
                        className="flex items-center justify-between p-2 sm:p-3 rounded cursor-pointer transition-colors hover:bg-gray-100"
                        onClick={() => toggleFolder(productCategory)}
                    >
                        <div className="flex items-center space-x-2">
                            {expandedFolders.includes(productCategory) ? (
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            ) : (
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            <span className="text-sm sm:text-base font-medium">{productCategory}</span>
                        </div>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                            {items.length}
                        </span>
                    </div>
                    
                    {expandedFolders.includes(productCategory) && (
                        <div className="ml-4 sm:ml-6 space-y-1">
                            {items.map((item) => (
                                <div 
                                    key={item.id}
                                    className={`flex items-center justify-between p-2 rounded cursor-pointer text-xs sm:text-sm transition-colors ${
                                        item.id === contentId ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-50'
                                    }`}
                                    onClick={() => handleContentClick(item)}
                                >
                                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                                        {getContentIcon(item.type)}
                                        <span className="break-words">{item.title}</span>
                                    </div>
                                    <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs flex-shrink-0 ml-2 ${
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

    const renderRightDrawer = () => {
        if (!selectedContent) return null;

        return (
            <div className="space-y-4 sm:space-y-6 h-full overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Content Details</h3>
                    <button
                        onClick={() => setIsRightDrawerOpen(false)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors lg:hidden"
                    >
                        <AiOutlineClose className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{selectedContent.originalTitle}</h4>
                        <div className="flex items-center space-x-2 mb-2">
                            {getPlatformIcon(selectedContent.platforms[0])}
                            <span className="text-sm sm:text-base text-gray-600 capitalize">{selectedContent.platforms[0]}</span>
                        </div>
                        <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                            selectedContent.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {selectedContent.status}
                        </span>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Content Type</label>
                            <div className="flex items-center space-x-2">
                                {getContentIcon(selectedContent.type)}
                                <span className="text-sm sm:text-base text-gray-900 capitalize">{selectedContent.type}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Category</label>
                            <span className="text-sm sm:text-base text-gray-900">{selectedContent.productCategory}</span>
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Created</label>
                            <span className="text-sm sm:text-base text-gray-900">{selectedContent.createdAt}</span>
                        </div>

                        {selectedContent.publishedAt && (
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Published</label>
                                <span className="text-sm sm:text-base text-gray-900">{selectedContent.publishedAt}</span>
                                {selectedContent.publishedBy && (
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">by {selectedContent.publishedBy}</p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Platform</label>
                            <div className="flex items-center space-x-2">
                                {getPlatformIcon(selectedContent.platforms[0])}
                                <span className="text-sm sm:text-base text-gray-900 capitalize">{selectedContent.platforms[0]}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 space-y-3">
                        <button 
                            onClick={() => navigate('generateContent')}
                            className="w-full flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                        >
                            <AiOutlineEdit className="w-4 h-4" />
                            <span>Edit in Studio</span>
                        </button>
                        <button 
                            onClick={() => togglePublishStatus(selectedContent.id)}
                            className={`w-full flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                                selectedContent.status === 'draft'
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gray-600 text-white hover:bg-gray-700'
                            }`}
                        >
                            {selectedContent.status === 'draft' ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            <span>{selectedContent.status === 'draft' ? 'Publish' : 'Unpublish'}</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-gray-50 relative overflow-hidden">
            {/* Left Drawer Overlay for mobile */}
            {isLeftDrawerOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsLeftDrawerOpen(false)}
                />
            )}

            {/* Right Drawer Overlay for mobile */}
            {isRightDrawerOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsRightDrawerOpen(false)}
                />
            )}

            {/* Left Drawer */}
            <div className={`${
                isLeftDrawerOpen ? 'w-64 sm:w-80' : 'w-0'
            } transition-all duration-300 ease-in-out bg-white border-r border-gray-200 overflow-hidden fixed lg:relative h-full z-50 lg:z-auto`}>
                <div className="p-3 sm:p-4 h-full overflow-y-auto">
                    {renderLeftDrawer()}
                </div>
            </div>

            {/* Left Drawer Toggle Button */}
            {!isLeftDrawerOpen && (
                <button
                    onClick={() => setIsLeftDrawerOpen(true)}
                    className="fixed top-1/2 left-2 transform -translate-y-1/2 z-50 bg-white border border-gray-300 shadow-lg rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    title="Open Library"
                >
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative">
                <div className="h-full flex items-center justify-center p-4 sm:p-6">
                    <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl">
                        {renderPreview()}
                    </div>
                </div>

                {/* Right Drawer Toggle Button */}
                {!isRightDrawerOpen && selectedContent && (
                    <button
                        onClick={() => setIsRightDrawerOpen(true)}
                        className="fixed top-1/2 right-2 transform -translate-y-1/2 z-50 bg-white border border-gray-300 shadow-lg rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-50 transition-colors lg:hidden"
                        title="Content Info"
                    >
                        <AiOutlineInfo className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    </button>
                )}
            </div>

            {/* Right Drawer */}
            <div className={`${
                isRightDrawerOpen ? 'w-64 sm:w-80' : 'w-0 lg:w-80'
            } transition-all duration-300 ease-in-out bg-white border-l border-gray-200 overflow-hidden fixed lg:relative h-full z-50 lg:z-auto right-0`}>
                <div className="p-3 sm:p-4 h-full">
                    {renderRightDrawer()}
                </div>
            </div>
        </div>
    );
}