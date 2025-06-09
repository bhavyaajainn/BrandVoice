import React, { useState, useEffect } from 'react';
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaRegImage, FaRegFileAlt, FaRegPlayCircle } from 'react-icons/fa';
import { AiOutlineFile, AiOutlineEye, AiOutlineEdit, AiOutlineInfo, AiOutlineClose } from 'react-icons/ai';
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
    const [content, setContent] = useState<ContentItem[]>(mockContent);
    const [expandedFolders, setExpandedFolders] = useState<string[]>(['Clothing', 'Software']);
    const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(true);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
    const [previewScale, setPreviewScale] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    // On small screens, collapse drawer by default
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            
            // Auto-close drawer on small screens only on initial load
            if (window.innerWidth < 768 && isLeftDrawerOpen === true) {
                setIsLeftDrawerOpen(false);
            }
            
            // Calculate preview scale based on screen width
            calculatePreviewScale();
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        
        // Simulate content loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 300);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
        };
    }, []);
    
    // Calculate the appropriate scale for preview content based on screen size
    const calculatePreviewScale = () => {
        const width = window.innerWidth;
        if (width < 480) {
            setPreviewScale(0.75); // Small mobile
        } else if (width < 768) {
            setPreviewScale(0.85); // Mobile
        } else if (width < 1024) {
            setPreviewScale(0.9); // Tablet
        } else {
            setPreviewScale(1); // Desktop
        }
    };

    // When drawer state changes, recalculate preview
    useEffect(() => {
        calculatePreviewScale();
    }, [isLeftDrawerOpen]);

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
        // On mobile, close drawer after selection
        if (windowWidth < 768) {
            setIsLeftDrawerOpen(false);
        }
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

    const renderLoading = () => (
        <div className="flex items-center justify-center h-full w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    const renderPreview = () => {
        if (isLoading) {
            return renderLoading();
        }

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

        // Select the appropriate preview component
        const PreviewComponent = () => {
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

        return (
            <div className="max-w-md mx-auto">
                <PreviewComponent />
            </div>
        );
    };

    const renderLeftDrawer = () => (
        <div className="space-y-2">
            <div className="p-3 bg-blue-50 rounded-lg mb-4 flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-blue-900 truncate pr-2">{BRAND_NAME}</h2>
                <button
                    onClick={() => setIsLeftDrawerOpen(false)}
                    className="ml-2 bg-white border border-gray-300 shadow-md rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
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
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14-7l-7 7-7-7m14 18l-7-7-7 7" />
                    </svg>
                    <span className="text-sm sm:text-base font-medium">View All</span>
                </div>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {content.length}
                </span>
            </div>

            {Object.entries(groupedContent).map(([productCategory, items]) => (
                <div key={productCategory} className="space-y-1">
                    <div 
                        className="flex items-center justify-between p-2 sm:p-3 rounded cursor-pointer transition-colors hover:bg-gray-100"
                        onClick={() => toggleFolder(productCategory)}
                    >
                        <div className="flex items-center space-x-2 min-w-0">
                            {expandedFolders.includes(productCategory) ? (
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            ) : (
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            <span className="text-sm sm:text-base font-medium truncate">{productCategory}</span>
                        </div>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded flex-shrink-0 ml-2">
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
                                        <span className="flex-shrink-0">{getContentIcon(item.type)}</span>
                                        <span className="truncate">{item.title}</span>
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

    // Generate dynamic drawer width based on screen size
    const getDrawerWidth = () => {
        if (windowWidth < 640) return 'w-3/4'; // Mobile: 75% width
        if (windowWidth < 768) return 'w-64';  // Small tablets: 16rem
        if (windowWidth < 1024) return 'w-72'; // Tablets: 18rem
        return 'w-80';                        // Desktop: 20rem
    };

    return (
        <div className="flex h-screen bg-white relative overflow-hidden">
            {/* Main Content Area - ALWAYS visible, positioned beneath the drawer on mobile */}
            <div className="w-full h-full flex items-center justify-center bg-white absolute inset-0">
                {/* Top Right Controls - Responsive positioning */}
                {selectedContent && (
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 flex flex-row items-center space-x-3">
                        {/* Publish/Draft Toggle */}
                        <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm border border-gray-200 px-2 sm:px-3 py-1 sm:py-2">
                            <span className={`text-xs sm:text-sm font-medium ${selectedContent.status === 'published' ? 'text-green-600' : 'text-yellow-600'}`}>
                                {selectedContent.status === 'published' ? 'Published' : 'Draft'}
                            </span>
                            <button
                                onClick={() => {
                                    // Toggle between 'published' and 'draft'
                                    const newStatus = selectedContent.status === 'published' ? 'draft' : 'published';
                                    setContent(prevContent =>
                                        prevContent.map(item =>
                                            item.id === selectedContent.id
                                                ? { ...item, status: newStatus }
                                                : item
                                        )
                                    );
                                }}
                                className={`relative inline-flex h-5 sm:h-6 w-9 sm:w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                    selectedContent.status === 'published' ? 'bg-green-600' : 'bg-gray-300'
                                }`}
                            >
                                <span
                                    className={`inline-block h-3 sm:h-4 w-3 sm:w-4 transform rounded-full bg-white transition-transform ${
                                        selectedContent.status === 'published' ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Edit Button - Only changing size, not flex layout */}
                        <button
                            onClick={() => {
                                const platform = selectedContent?.platforms[0] || '';
                                // Convert platform name to proper case for Platform type in content-studio
                                const platformType = platform === 'instagram' ? 'Instagram' :
                                                    platform === 'facebook' ? 'Facebook' :
                                                    platform === 'twitter' ? 'X' :
                                                    platform === 'youtube' ? 'YouTube' : '';
                                // Use window.location to navigate to content-studio with query params
                                window.location.href = `/dashboard/content-studio?type=generateContent&platform=${platformType}`;
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm border border-blue-600 px-3 sm:px-4 py-1 sm:py-2 flex items-center space-x-2 transition-colors"
                        >
                            <AiOutlineEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="text-xs sm:text-sm font-medium">Edit</span>
                        </button>
                    </div>
                )}

                {/* Preview Container - Always visible under the drawer */}
                <div className="h-full w-full flex items-center justify-center p-4 sm:p-6 overflow-auto">
                    {renderPreview()}
                </div>
            </div>

            {/* Left Drawer - Positioned above content with proper z-index */}
            <div 
                className={`${
                    isLeftDrawerOpen ? getDrawerWidth() : 'w-0'
                } transition-all duration-300 ease-in-out bg-white border-r border-gray-200 overflow-hidden fixed h-full z-50`}
                style={{
                    boxShadow: isLeftDrawerOpen ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
                }}
            >
                <div className="p-3 sm:p-4 h-full overflow-y-auto">
                    {renderLeftDrawer()}
                </div>
            </div>

            {/* Left Drawer Toggle Button - Always visible when drawer is closed */}
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

            {/* Overlay for mobile - Only affects the drawer's background, not the content */}
            {isLeftDrawerOpen && windowWidth < 1024 && (
                <div 
                    className="fixed inset-0 bg-opacity-25 z-40"
                    onClick={() => setIsLeftDrawerOpen(false)}
                />
            )}
        </div>
    );
}