'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

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
    const [selectedPlatform, setSelectedPlatform] = useState<Platform>('Instagram');
    const [postData, setPostData] = useState<InstagramPost>({
        text: "Exciting news! 🌿 Just launched our new collection of indoor plants that bring life to any space. Perfect for both beginners and plant enthusiasts. Visit our store to discover your next green companion! 🪴✨",
        hashtags: ["#PlantLover", "#IndoorPlants", "#GreenLiving", "#PlantCare", "#BotanicalBeauty"],
        mentions: ["@plantlovers", "@urbanjungle"],
        mediaType: "image",
        mediaUrls: ["https://images.unsplash.com/photo-1470058869958-2a77ade41c02"],
        locationId: "17841400008460056",
        scheduleTime: ""
    });
    const [previewUrl, setPreviewUrl] = useState<string>("https://images.unsplash.com/photo-1470058869958-2a77ade41c02");
    const [imageError, setImageError] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const platforms: Platform[] = ['Instagram', 'Facebook', 'X', 'YouTube'];

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
            handleInputChange('mediaUrls', [url]);
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
            setPreviewUrl(url);
            handleInputChange('mediaUrls', [url]);
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
                                onChange={(e) => handleInputChange('mediaType', e.target.value)}
                            >
                                <option value="image">Image</option>
                                <option value="video">Video</option>
                                <option value="carousel">Carousel</option>
                            </select>
                        </div>

                        {/* Media Upload Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload {postData.mediaType}
                            </label>
                            <div
                                className="mt-1 flex flex-col items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-indigo-500 transition-colors"
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {previewUrl ? (
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
                                ) : (
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
                                            <span>Drop your file here, or click to select</span>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                className="sr-only"
                                                accept={postData.mediaType === 'video' ? 'video/*' : 'image/*'}
                                                onChange={handleFileUpload}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {postData.mediaType === 'video' ? 'MP4, WebM, Ogg' : 'PNG, JPG, GIF up to 10MB'}
                                        </p>
                                    </div>
                                )}
                                {imageError && (
                                    <p className="text-red-500 text-sm mt-2">Failed to load image. Please try another.</p>
                                )}
                            </div>
                        </div>

                        {/* Caption/Text Input */}
                        <div>
                            <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                                Caption
                            </label>
                            <textarea
                                id="text"
                                rows={4}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                                value={postData.text}
                                onChange={(e) => handleInputChange('text', e.target.value)}
                                placeholder="Write your caption here..."
                            />
                        </div>

                        {/* Hashtags Input */}
                        <div>
                            <label htmlFor="hashtags" className="block text-sm font-medium text-gray-700 mb-2">
                                Hashtags
                            </label>
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

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#833AB4] hover:bg-[#6d2f96] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#833AB4] transition-colors"
                                onClick={(e) => {
                                    e.preventDefault();
                                    // Handle form submission here
                                }}
                            >
                                Generate
                            </button>
                        </div>
                    </form>
                </div>
                
                {/* Vertical Divider - Only visible on desktop */}
                <div className="hidden md:block w-px bg-gray-200" />
                
                {/* Right Section - Preview */}
                <div className="w-full md:w-1/2 overflow-y-auto p-4">
                    <div className="max-w-md mx-auto">
                        {selectedPlatform === 'Instagram' && (
                            <InstagramPreview post={postData} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const InstagramPreview: React.FC<{ post: InstagramPost }> = ({ post }) => {
    const [imageError, setImageError] = useState(false);

    return (
        <div className="bg-white border border-gray-200 rounded-lg">
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
                {post.mediaUrls[0] && !imageError ? (
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
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
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
                        <p className="text-[#833AB4] text-xs mt-1 space-x-1">
                            {post.mentions.map((mention, index) => (
                                <span 
                                    key={index} 
                                    className="relative group inline-block hover:underline cursor-pointer"
                                >
                                    {mention}
                                    <span className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap">
                                        View profile
                                    </span>
                                </span>
                            ))}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}; 