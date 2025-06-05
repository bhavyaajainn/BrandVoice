'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Platform = 'Instagram' | 'Facebook' | 'X' | 'YouTube';
type MediaType = 'image' | 'video' | 'carousel';

interface InstagramPost {
    text: string;
    hashtags: string[];
    mentions: string[];
    mediaType: MediaType;
    mediaUrls: string[];
    locationId?: string;
    scheduleTime?: string;
}

export default function GenerateContent() {
    const router = useRouter();
    const [selectedPlatform, setSelectedPlatform] = useState<Platform>('Instagram');
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [imageError, setImageError] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const sampleAssets = {
        image: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02",
        video: "https://player.vimeo.com/video/367512707?background=1",
        carousel: [
            "https://images.unsplash.com/photo-1470058869958-2a77ade41c02",
            "https://images.unsplash.com/photo-1542728928-0011f81446e5",
            "https://images.unsplash.com/photo-1530968464165-7a1861cbaf9f"
        ]
    };

    const [postData, setPostData] = useState<InstagramPost>({
        text: "Exciting news! 🌿 Just launched our new collection of indoor plants that bring life to any space. Perfect for both beginners and plant enthusiasts. Visit our store to discover your next green companion! 🪴✨",
        hashtags: ["#PlantLover", "#IndoorPlants", "#GreenLiving", "#PlantCare", "#BotanicalBeauty"],
        mentions: ["@plantlovers", "@urbanjungle"],
        mediaType: "carousel",
        mediaUrls: sampleAssets.carousel,
        locationId: "17841400008460056",
        scheduleTime: ""
    });
    const platforms: Platform[] = ['Instagram', 'Facebook', 'X', 'YouTube'];

    const handleMediaTypeChange = (type: MediaType) => {
        let newMediaUrls: string[] = [];
        switch (type) {
            case 'carousel':
                newMediaUrls = [...sampleAssets.carousel];
                break;
            case 'video':
                newMediaUrls = [sampleAssets.video];
                break;
            default:
                newMediaUrls = [sampleAssets.image];
        }
        
        setPostData(prev => ({
            ...prev,
            mediaType: type,
            mediaUrls: newMediaUrls
        }));
        setPreviewUrl(newMediaUrls[0]);
        setImageError(false);
    };

    // Handle form input changes
    const handleInputChange = (field: keyof InstagramPost, value: any) => {
        setPostData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle file upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setPostData(prev => ({
                ...prev,
                mediaUrls: [url]
            }));
        }
    };

    // Handle drag and drop
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            if (postData.mediaType === 'carousel') {
                if (postData.mediaUrls.length < 20) {
                    setPostData(prev => ({
                        ...prev,
                        mediaUrls: [...prev.mediaUrls, url]
                    }));
                }
            } else {
                setPreviewUrl(url);
                setPostData(prev => ({
                    ...prev,
                    mediaUrls: [url]
                }));
            }
        }
    };

    // Handle hashtags and mentions input
    const handleArrayInput = (field: 'hashtags' | 'mentions', value: string) => {
        const items = value.split(' ').filter(item => item.trim() !== '');
        setPostData(prev => ({
            ...prev,
            [field]: items
        }));
    };

    // Sample Instagram post data
    const samplePost: InstagramPost = {
        text: "New plant launch 🌿 #greenlife #indoorplants",
        hashtags: ["#greenlife", "#indoorplants"],
        mentions: ["@urbanjungleshop"],
        mediaType: "image",
        mediaUrls: ["https://example.com/image1.jpg"],
        locationId: "17841400008460056",
        scheduleTime: "2025-06-05T10:30:00Z"
    };

    const platformIcons = {
        Instagram: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.98 0a6.9 6.9 0 0 1 5.08 1.98A6.94 6.94 0 0 1 24 7.02v9.96c0 2.08-.68 3.87-1.98 5.13A7.14 7.14 0 0 1 16.94 24H7.06a7.06 7.06 0 0 1-5.03-1.89A6.96 6.96 0 0 1 0 16.94V7.02C0 2.8 2.8 0 7.02 0h9.96zm.05 2.23H7.06c-1.45 0-2.7.43-3.53 1.25a4.82 4.82 0 0 0-1.3 3.54v9.92c0 1.5.43 2.7 1.3 3.58a5 5 0 0 0 3.53 1.25h9.88a5 5 0 0 0 3.53-1.25 4.73 4.73 0 0 0 1.4-3.54V7.02a5 5 0 0 0-1.3-3.49 4.82 4.82 0 0 0-3.54-1.3zM12 5.76c3.39 0 6.2 2.8 6.2 6.2a6.2 6.2 0 0 1-12.4 0 6.2 6.2 0 0 1 6.2-6.2zm0 2.22a3.98 3.98 0 0 0-3.97 3.97A3.98 3.98 0 0 0 12 15.92a3.98 3.98 0 0 0 3.97-3.97A3.98 3.98 0 0 0 12 7.98zm6.44-3.77a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z" />
            </svg>
        ),
        Facebook: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
        ),
        X: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
        ),
        YouTube: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
        ),
    };

    const getPlatformStyles = (platform: Platform) => {
        switch (platform) {
            case 'Instagram':
                return {
                    modeBg: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045]',
                    modeText: 'text-white',
                    icon: 'text-white'
                };
            case 'Facebook':
                return {
                    modeBg: 'bg-[#1877F2]',
                    modeText: 'text-white',
                    icon: 'text-white'
                };
            case 'X':
                return {
                    modeBg: 'bg-black',
                    modeText: 'text-white',
                    icon: 'text-white'
                };
            case 'YouTube':
                return {
                    modeBg: 'bg-[#FF0000]',
                    modeText: 'text-white',
                    icon: 'text-white'
                };
            default:
                return {
                    modeBg: 'bg-white',
                    modeText: 'text-gray-900',
                    icon: 'text-gray-900'
                };
        }
    };

    const platformStyle = getPlatformStyles(selectedPlatform);

    const handleSave = () => {
        // TODO: Implement save functionality
        console.log('Saving post:', postData);
    };

    const handleNextPlatform = () => {
        router.push('/content-studio/product');
    };

    const handleCancel = () => {
        // Reset form to initial state or handle cancellation
        if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
            router.back();
        }
    };

    const handleRegenerate = (field: 'media' | 'caption' | 'hashtags') => {
        // TODO: Implement AI regeneration for each field
        console.log(`Regenerating ${field}`);
    };

    const RegenerateIcon = ({ onClick }: { onClick: () => void }) => (
        <button
            onClick={onClick}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            title="Regenerate"
        >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        </button>
    );

    const getGridColumns = (imageCount: number) => {
        if (imageCount <= 2) return 'grid-cols-2';
        if (imageCount <= 6) return 'grid-cols-3';
        return 'grid-cols-4';
    };

    const getGridItemSize = (imageCount: number) => {
        if (imageCount <= 2) return 'h-48';
        if (imageCount <= 6) return 'h-36';
        return 'h-24';
    };

    const handleCarouselImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const remainingSlots = 20 - postData.mediaUrls.length;
            const filesToAdd = files.slice(0, remainingSlots);
            
            const newUrls = filesToAdd.map(file => URL.createObjectURL(file));
            
            setPostData(prev => ({
                ...prev,
                mediaUrls: [...prev.mediaUrls, ...newUrls]
            }));
        }
    };

    const removeCarouselImage = (index: number) => {
        setPostData(prev => ({
            ...prev,
            mediaUrls: prev.mediaUrls.filter((_, i) => i !== index)
        }));
    };

    const renderCarouselPreview = () => (
        <div className="w-full">
            <div className={`grid ${getGridColumns(postData.mediaUrls.length)} gap-2 p-2`}>
                {postData.mediaUrls.map((url, index) => (
                    <div 
                        key={`${url}-${index}`}
                        className={`relative ${getGridItemSize(postData.mediaUrls.length)} rounded-lg overflow-hidden group bg-gray-50`}
                    >
                        <Image
                            src={url}
                            alt={`Carousel image ${index + 1}`}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover"
                            unoptimized
                            priority={index === 0}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = sampleAssets.image;
                            }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeCarouselImage(index);
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
                {postData.mediaUrls.length < 20 && (
                    <div 
                        className={`${getGridItemSize(postData.mediaUrls.length)} border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-indigo-500 transition-colors bg-gray-50 cursor-pointer`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="text-center">
                            <svg
                                className="mx-auto h-8 w-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            <span className="mt-1 text-xs text-gray-500 block">
                                {20 - postData.mediaUrls.length} remaining
                            </span>
                        </div>
                    </div>
                )}
            </div>
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleCarouselImageAdd}
                multiple
            />
        </div>
    );

    const renderUploadPreview = () => {
        if (postData.mediaType === 'carousel') {
            if (postData.mediaUrls.length > 0) {
                return renderCarouselPreview();
            }
            return (
                <div 
                    className="mt-1 flex flex-col items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-indigo-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <p className="mt-1 text-sm text-gray-500">Add up to 20 images for your carousel</p>
                        <p className="mt-2 text-xs text-gray-500">Click to add your first image</p>
                        <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF (max 10MB each)</p>
                    </div>
                </div>
            );
        }

        switch (postData.mediaType) {
            case 'video':
                if (postData.mediaUrls[0]) {
                    return (
                        <div className="relative w-full aspect-square max-w-md mx-auto">
                            <iframe
                                src={postData.mediaUrls[0]}
                                className="absolute inset-0 w-full h-full rounded-lg"
                                frameBorder="0"
                                allow="autoplay; fullscreen"
                                allowFullScreen
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewUrl('');
                                    handleInputChange('mediaUrls', []);
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    );
                }
                return (
                    <div className="space-y-1 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                        </svg>
                        <div className="flex text-sm text-gray-600 justify-center">
                            <span>Drop your video here, or click to select</span>
                        </div>
                        <p className="text-xs text-gray-500">MP4, WebM, Ogg (max 100MB)</p>
                    </div>
                );
            default:
                if (previewUrl) {
                    return (
                        <div className="relative w-full aspect-square max-w-md mx-auto">
                            <Image
                                src={previewUrl}
                                alt="Preview"
                                fill
                                className="object-cover rounded-lg"
                                onError={() => setImageError(true)}
                                unoptimized
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewUrl('');
                                    setImageError(false);
                                    handleInputChange('mediaUrls', []);
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    );
                }
                return (
                    <div className="space-y-1 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div className="flex text-sm text-gray-600 justify-center">
                            <span>Drop your image here, or click to select</span>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF (max 10MB)</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col">
            {/* Mode Banner */}
            <div className={`h-8 ${platformStyle.modeBg}`}>
                <div className="flex items-center justify-center h-full">
                    <span className={`${platformStyle.icon} mr-2`}>{platformIcons[selectedPlatform]}</span>
                    <span className={`${platformStyle.modeText}`}>{selectedPlatform} mode</span>
                </div>
            </div>

            {/* Main Content Area with Split */}
            <div className="flex flex-col md:flex-row flex-1 bg-white">
                {/* Left Section - Form */}
                <div className="w-full md:w-1/2 overflow-y-auto p-4 md:p-6">
                    <form className="space-y-6 max-w-2xl mx-auto">
                        {/* Media Type Selection */}
                        <div>
                            <label htmlFor="mediaType" className="block text-sm font-medium text-gray-700 mb-2">
                                Media Type
                            </label>
                            <select
                                id="mediaType"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                value={postData.mediaType}
                                onChange={(e) => {
                                    handleMediaTypeChange(e.target.value as MediaType);
                                }}
                            >
                                <option value="image">Image</option>
                                <option value="video">Video</option>
                                <option value="carousel">Carousel</option>
                            </select>
                        </div>

                        {/* Media Upload Section with Regenerate */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Upload {postData.mediaType}
                                </label>
                                <RegenerateIcon onClick={() => handleRegenerate('media')} />
                            </div>
                            <div
                                className="mt-1 flex flex-col items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-indigo-500 transition-colors"
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {renderUploadPreview()}
                            </div>
                            {imageError && (
                                <p className="text-red-500 text-sm mt-2">Failed to load media. Please try another.</p>
                            )}
                        </div>

                        {/* Caption/Text Input with Regenerate */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="text" className="block text-sm font-medium text-gray-700">
                                    Caption
                                </label>
                                <RegenerateIcon onClick={() => handleRegenerate('caption')} />
                            </div>
                            <textarea
                                id="text"
                                rows={4}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                                value={postData.text}
                                onChange={(e) => handleInputChange('text', e.target.value)}
                                placeholder="Write your caption here..."
                            />
                        </div>

                        {/* Hashtags Input with Regenerate */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="hashtags" className="block text-sm font-medium text-gray-700">
                                    Hashtags
                                </label>
                                <RegenerateIcon onClick={() => handleRegenerate('hashtags')} />
                            </div>
                            <input
                                type="text"
                                id="hashtags"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                                value={postData.hashtags.join(' ')}
                                onChange={(e) => handleArrayInput('hashtags', e.target.value)}
                                placeholder="#nature #photography"
                            />
                        </div>

                        {/* Mentions Input with Tooltip */}
                        <div>
                            <label htmlFor="mentions" className="block text-sm font-medium text-gray-700 mb-2">
                                Mentions
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="mentions"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                                    value={postData.mentions.join(' ')}
                                    onChange={(e) => handleArrayInput('mentions', e.target.value)}
                                    placeholder="@username1 @username2"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="absolute hidden group-hover:block top-full mt-1 w-48 p-2 bg-black text-white text-xs rounded shadow-lg">
                                    Type @ to mention users
                                </div>
                            </div>
                        </div>

                        {/* Location ID Input */}
                        <div>
                            <label htmlFor="locationId" className="block text-sm font-medium text-gray-700 mb-2">
                                Location ID
                            </label>
                            <input
                                type="text"
                                id="locationId"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                                value={postData.locationId || ''}
                                onChange={(e) => handleInputChange('locationId', e.target.value)}
                                placeholder="Location ID"
                            />
                        </div>

                        {/* Generate Button */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    // Handle generation here
                                    console.log('Generating content...');
                                }}
                                className="inline-flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#833AB4] hover:bg-[#6d2f96] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#833AB4] transition-colors"
                            >
                                Generate
                            </button>
                        </div>
                    </form>
                </div>
                
                {/* Vertical Divider - Only visible on desktop */}
                <div className="hidden md:block w-px bg-gray-200" />
                
                {/* Right Section - Preview */}
                <div className="w-full md:w-1/2 overflow-y-auto p-4 flex flex-col">
                    <div className="flex-grow">
                        {selectedPlatform === 'Instagram' && (
                            <InstagramPreview post={postData} />
                        )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                        <button
                            onClick={handleSave}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleNextPlatform}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#833AB4] hover:bg-[#6d2f96] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#833AB4]"
                        >
                            Next Platform
                        </button>
                        <button
                            onClick={handleCancel}
                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 

const InstagramPreview: React.FC<{ post: InstagramPost }> = ({ post }) => {
    const [imageError, setImageError] = useState(false);
    const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

    const renderMedia = () => {
        if (imageError) {
            return (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            );
        }

        switch (post.mediaType) {
            case 'video':
                return (
                    <div className="w-full h-full relative">
                        <iframe
                            src={post.mediaUrls[0] || ''}
                            className="absolute inset-0 w-full h-full"
                            frameBorder="0"
                            allow="autoplay; fullscreen"
                            allowFullScreen
                        />
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/10 to-transparent" />
                    </div>
                );
            case 'carousel':
                if (!post.mediaUrls.length) {
                    return (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <p className="text-gray-500">No images in carousel</p>
                        </div>
                    );
                }
                return (
                    <div className="relative w-full aspect-square">
                        {post.mediaUrls[currentCarouselIndex] && (
                            <Image
                                src={post.mediaUrls[currentCarouselIndex]}
                                alt={`Slide ${currentCarouselIndex + 1}`}
                                width={500}
                                height={500}
                                className="w-full h-full object-cover"
                                onError={() => setImageError(true)}
                                unoptimized
                            />
                        )}
                        {/* Carousel Navigation */}
                        {post.mediaUrls.length > 1 && (
                            <>
                                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentCarouselIndex(prev => Math.max(0, prev - 1));
                                        }}
                                        className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75 transition-colors"
                                        style={{ visibility: currentCarouselIndex === 0 ? 'hidden' : 'visible' }}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentCarouselIndex(prev => Math.min(post.mediaUrls.length - 1, prev + 1));
                                        }}
                                        className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75 transition-colors"
                                        style={{ visibility: currentCarouselIndex === post.mediaUrls.length - 1 ? 'hidden' : 'visible' }}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                                {/* Carousel Indicators */}
                                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1">
                                    {post.mediaUrls.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCurrentCarouselIndex(index);
                                            }}
                                            className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                                index === currentCarouselIndex ? 'bg-blue-500' : 'bg-white/50'
                                            }`}
                                            aria-label={`Go to slide ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                );
            default:
                return (
                    <div className="relative w-full h-full">
                        {post.mediaUrls[0] ? (
                            <Image
                                src={post.mediaUrls[0]}
                                alt="Post image"
                                fill
                                className="object-cover"
                                onError={() => setImageError(true)}
                                unoptimized
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <p className="text-gray-500">No image selected</p>
                            </div>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg max-w-md mx-auto">
            {/* Header */}
            <div className="flex items-center p-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] flex items-center justify-center">
                    <div className="h-7 w-7 rounded-full border-2 border-white bg-gray-200"></div>
                </div>
                <div className="ml-3">
                    <p className="text-sm font-semibold">Your Business</p>
                    <p className="text-xs text-gray-500">Original</p>
                </div>
                <button className="ml-auto">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                </button>
            </div>

            {/* Media */}
            <div className="aspect-square relative bg-gray-100">
                {renderMedia()}
                {/* Mentions Avatar */}
                {post.mentions.length > 0 && (
                    <div className="absolute bottom-3 left-3 flex items-center">
                        <div className="relative group">
                            <div className="w-8 h-8 rounded-full bg-black bg-opacity-75 flex items-center justify-center cursor-pointer hover:bg-opacity-90 transition-opacity">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            {/* Hover tooltip */}
                            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block">
                                <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                    {post.mentions.join(', ')}
                                </div>
                                <div className="w-2 h-2 bg-black transform rotate-45 absolute -bottom-1 left-4"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex space-x-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </div>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                </div>

                {/* Caption */}
                <div className="text-sm">
                    <p>
                        <span className="font-semibold mr-1">Your Business</span>
                        {post.text}
                    </p>
                    <div className="mt-2">
                        <p className="text-[#833AB4] text-xs space-x-1">
                            {post.hashtags.map((tag, index) => (
                                <span key={index} className="hover:underline cursor-pointer">{tag}</span>
                            ))}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}; 