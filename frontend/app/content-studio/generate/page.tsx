'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Platform, Post, MediaType } from './components/types';
import { ContentLayout } from './components/shared/ContentLayout';
import { ContentForm } from './components/shared/ContentForm';
import { InstagramPreview } from './components/platforms/InstagramPreview';
import { platformIcons } from './components/shared/PlatformIcons';
import { FacebookPreview } from './components/platforms/FacebookPreview';

const sampleAssets = {
    image: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02",
    video: "https://player.vimeo.com/video/367512707?background=1",
    carousel: [
        "https://images.unsplash.com/photo-1470058869958-2a77ade41c02",
        "https://images.unsplash.com/photo-1542728928-0011f81446e5",
        "https://images.unsplash.com/photo-1530968464165-7a1861cbaf9f"
    ]
};

export default function GenerateContent() {
    const router = useRouter();
    const [selectedPlatform] = useState<Platform>('Instagram');
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [imageError, setImageError] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [postData, setPostData] = useState<Post>({
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

    const handleInputChange = (field: keyof Post, value: any) => {
        setPostData(prev => ({
            ...prev,
            [field]: value
        }));
    };

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

    const handleArrayInput = (field: 'hashtags' | 'mentions', value: string) => {
        const items = value.split(' ').filter(item => item.trim() !== '');
        setPostData(prev => ({
            ...prev,
            [field]: items
        }));
    };

    const handleRegenerate = (field: 'media' | 'caption' | 'hashtags') => {
        // TODO: Implement AI regeneration for each field
        console.log(`Regenerating ${field}`);
    };

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

    const renderUploadPreview = () => {
        if (postData.mediaType === 'carousel') {
            if (postData.mediaUrls.length > 0) {
                return (
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
                                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
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
        <ContentLayout platform={selectedPlatform} platformIcon={platformIcons[selectedPlatform]}>
            {/* Main Content Area with Split */}
            <div className="flex flex-col md:flex-row flex-1 bg-white">
                {/* Left Section - Form */}
                <div className="w-full md:w-1/2 overflow-y-auto p-4 md:p-6">
                    <ContentForm
                        post={postData}
                        onMediaTypeChange={handleMediaTypeChange}
                        onInputChange={handleInputChange}
                        onArrayInput={handleArrayInput}
                        onFileUpload={handleFileUpload}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onRegenerate={handleRegenerate}
                        renderUploadPreview={renderUploadPreview}
                        imageError={imageError}
                    />
                </div>
                
                {/* Vertical Divider - Only visible on desktop */}
                <div className="hidden md:block w-px bg-gray-200" />
                
                {/* Right Section - Preview */}
                <div className="w-full md:w-1/2 overflow-y-auto p-4 flex flex-col">
                    <div className="flex-grow">
                        {selectedPlatform === 'Instagram' && (
                            <InstagramPreview post={postData} />
                        )}
                        {selectedPlatform === 'Facebook' && (
                            <FacebookPreview post={postData} />
                        )}
                        {/* Add other platform previews here */}
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
        </ContentLayout>
    );
} 