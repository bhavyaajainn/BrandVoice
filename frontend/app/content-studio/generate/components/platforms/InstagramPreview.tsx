import React, { useState } from 'react';
import Image from 'next/image';
import { Post } from '../types';

interface InstagramPreviewProps {
    post: Post;
}

export const InstagramPreview: React.FC<InstagramPreviewProps> = ({ post }) => {
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