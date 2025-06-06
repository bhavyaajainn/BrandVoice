'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Platform, Post, MediaType, InstagramPost, FacebookPost } from './components/types';
import { ContentLayout } from './components/shared/ContentLayout';
import { ContentForm } from './components/shared/ContentForm';
import { InstagramPreview } from './components/platforms/InstagramPreview';
import { platformIcons } from './components/shared/PlatformIcons';
import { FacebookPreview } from './components/platforms/FacebookPreview';
import { FacebookForm } from './components/platforms/FacebookForm';

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
    const [selectedPlatform, setSelectedPlatform] = useState<Platform>('Facebook');
    const [previewUrl, setPreviewUrl] = useState<string>(sampleAssets.image);
    const [imageError, setImageError] = useState(false);
    
    const [postData, setPostData] = useState<Post>({
        text: "Exciting news! 🌿 Just launched our new collection of indoor plants that bring life to any space. Perfect for both beginners and plant enthusiasts. Visit our store to discover your next green companion! 🪴✨",
        hashtags: ["#PlantLover", "#IndoorPlants", "#GreenLiving", "#PlantCare", "#BotanicalBeauty"],
        mediaType: "image",
        mediaUrls: [sampleAssets.image],
        locationId: "17841400008460056",
        ...(selectedPlatform === 'Instagram' 
            ? {
                mentions: ["@plantlovers", "@urbanjungle"],
            }
            : {
                taggedPages: ["@GreenRoots"],
                privacy: "Public" as const,
                linkUrl: "https://yourstore.com/indoor-plants",
            })
    });

    // Load saved media type from localStorage on mount
    React.useEffect(() => {
        const savedMediaType = localStorage.getItem('mediaType');
        if (savedMediaType && (savedMediaType === 'image' || savedMediaType === 'video' || savedMediaType === 'carousel')) {
            let newMediaUrls: string[] = [];
            switch (savedMediaType) {
                case 'carousel':
                    newMediaUrls = [...sampleAssets.carousel];
                    setPreviewUrl(sampleAssets.carousel[0]);
                    break;
                case 'video':
                    newMediaUrls = [sampleAssets.video];
                    setPreviewUrl(sampleAssets.video);
                    break;
                default:
                    newMediaUrls = [sampleAssets.image];
                    setPreviewUrl(sampleAssets.image);
            }
            
            setPostData(prev => ({
                ...prev,
                mediaType: savedMediaType as MediaType,
                mediaUrls: newMediaUrls
            }));
        }
    }, []);

    const platforms: Platform[] = ['Instagram', 'Facebook', 'X', 'YouTube'];

    const handleMediaTypeChange = (type: MediaType) => {
        let newMediaUrls: string[] = [];
        switch (type) {
            case 'carousel':
                newMediaUrls = [...sampleAssets.carousel];
                setPreviewUrl(sampleAssets.carousel[0]);
                break;
            case 'video':
                newMediaUrls = [sampleAssets.video];
                setPreviewUrl(sampleAssets.video);
                break;
            default:
                newMediaUrls = [sampleAssets.image];
                setPreviewUrl(sampleAssets.image);
        }
        
        // Save media type to localStorage
        localStorage.setItem('mediaType', type);
        
        setPostData(prev => ({
            ...prev,
            mediaType: type,
            mediaUrls: newMediaUrls
        }));
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
                    mediaType: 'image',
                    mediaUrls: [url]
                }));
            }
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
                    mediaType: 'image',
                    mediaUrls: [url]
                }));
            }
        }
    };

    const handlePlatformChange = (platform: Platform) => {
        setSelectedPlatform(platform);
        // Convert post data to the new platform format
        if (platform === 'Instagram') {
            setPostData(prev => ({
                ...prev,
                mentions: [],
            } as InstagramPost));
        } else if (platform === 'Facebook') {
            setPostData(prev => ({
                ...prev,
                taggedPages: [],
                privacy: 'Public',
                linkUrl: '',
            } as FacebookPost));
        }
    };

    const handleArrayInput = (field: 'hashtags' | 'mentions' | 'taggedPages', value: string) => {
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
        return 'aspect-square w-full';
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
                                <div key={`${url}-${index}`} className="relative aspect-square">
                                    <Image
                                        src={url}
                                        alt={`Carousel image ${index + 1}`}
                                        width={300}
                                        height={300}
                                        className="w-full h-full object-cover rounded-lg"
                                        unoptimized
                                        priority={index === 0}
                                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = sampleAssets.image;
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeCarouselImage(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                            {postData.mediaUrls.length < 20 && (
                                <div 
                                    className="aspect-square flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors bg-gray-50 cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const input = document.getElementById('carousel-file-input');
                                        if (input) {
                                            input.click();
                                        }
                                    }}
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
                                            <span className="text-sm">{20 - postData.mediaUrls.length}</span>
                                            <span className="hidden sm:inline"> remaining</span>
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <input
                            id="carousel-file-input"
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
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const input = document.getElementById('carousel-file-input');
                        if (input) {
                            input.click();
                        }
                    }}
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

    const handleFacebookInputChange = (field: keyof FacebookPost, value: any) => {
        setPostData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <ContentLayout platform={selectedPlatform} platformIcon={platformIcons[selectedPlatform]}>
            {/* Main Content Area with Split */}
            <div className="flex flex-col md:flex-row flex-1 bg-white">
                {/* Left Section - Form */}
                <div className="w-full md:w-1/2 overflow-y-auto p-4 md:p-6">
                    {selectedPlatform === 'Instagram' ? (
                        <ContentForm
                            post={postData as InstagramPost}
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
                    ) : selectedPlatform === 'Facebook' ? (
                        <FacebookForm
                            post={postData as FacebookPost}
                            onMediaTypeChange={handleMediaTypeChange}
                            onInputChange={handleFacebookInputChange}
                            onArrayInput={handleArrayInput}
                            onFileUpload={handleFileUpload}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onRegenerate={handleRegenerate}
                            renderUploadPreview={renderUploadPreview}
                            imageError={imageError}
                        />
                    ) : null}
                </div>
                
                {/* Vertical Divider - Only visible on desktop */}
                <div className="hidden md:block w-px bg-gray-200" />
                
                {/* Right Section - Preview */}
                <div className="w-full md:w-1/2 overflow-y-auto p-4 flex flex-col">
                    <div className="flex-grow">
                        {selectedPlatform === 'Instagram' && (
                            <InstagramPreview post={postData as InstagramPost} />
                        )}
                        {selectedPlatform === 'Facebook' && (
                            <FacebookPreview post={postData as FacebookPost} />
                        )}
                        {/* Action Buttons - Vertical Layout */}
                        <div className="mt-8 flex flex-col items-center space-y-4">
                            {/* Save Button */}
                            <button
                                onClick={handleSave}
                                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors w-56"
                            >
                                <svg 
                                    className="w-5 h-5 mr-2" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                    />
                                </svg>
                                Save
                            </button>

                            {/* Next Platform Button */}
                            <button
                                onClick={handleNextPlatform}
                                className={`inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-colors w-56 ${
                                    selectedPlatform === 'Instagram' ? 'bg-[#833AB4]' : 'bg-[#1877F2]'
                                }`}
                            >
                                <svg 
                                    className="w-5 h-5 mr-2" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                                Next Platform
                            </button>

                            {/* Cancel Button */}
                            <button
                                onClick={handleCancel}
                                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-colors w-56"
                            >
                                <svg 
                                    className="w-5 h-5 mr-2" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ContentLayout>
    );
} 