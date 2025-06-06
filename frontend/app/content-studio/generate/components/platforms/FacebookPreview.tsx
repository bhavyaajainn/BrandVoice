import React, { useState } from 'react';
import Image from 'next/image';
import { Post } from '../types';

interface FacebookPreviewProps {
    post: Post;
}

export const FacebookPreview: React.FC<FacebookPreviewProps> = ({ post }) => {
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
                    <div className="relative w-full aspect-video">
                        {post.mediaUrls[currentCarouselIndex] && (
                            <Image
                                src={post.mediaUrls[currentCarouselIndex]}
                                alt={`Slide ${currentCarouselIndex + 1}`}
                                fill
                                className="object-cover"
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
                                            className={`w-2 h-2 rounded-full transition-colors ${
                                                index === currentCarouselIndex ? 'bg-white' : 'bg-white/50'
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
                    <div className="relative w-full aspect-video">
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
        <div className="bg-white border border-gray-200 rounded-lg max-w-xl mx-auto">
            {/* Header */}
            <div className="flex items-center p-3">
                <div className="h-10 w-10 rounded-full bg-[#1877F2] flex items-center justify-center">
                    <div className="h-9 w-9 rounded-full border-2 border-white bg-gray-200"></div>
                </div>
                <div className="ml-3">
                    <div className="flex items-center">
                        <p className="text-sm font-semibold text-[#1877F2]">Your Business</p>
                        <span className="mx-1 text-gray-500">•</span>
                        <span className="text-xs text-gray-500">Follow</span>
                    </div>
                    <p className="text-xs text-gray-500">Just now • 🌍</p>
                </div>
                <button className="ml-auto">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                </button>
            </div>

            {/* Caption */}
            <div className="px-3 pb-2">
                <p className="text-sm">{post.text}</p>
                {post.hashtags.length > 0 && (
                    <p className="mt-1 text-sm text-[#1877F2] space-x-1">
                        {post.hashtags.map((tag, index) => (
                            <span key={index} className="hover:underline cursor-pointer">{tag}</span>
                        ))}
                    </p>
                )}
            </div>

            {/* Media */}
            <div className="relative bg-gray-100">
                {renderMedia()}
            </div>

            {/* Action Buttons */}
            <div className="p-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                    <div className="flex items-center gap-1">
                        <div className="flex -space-x-1">
                            <div className="w-5 h-5 rounded-full bg-[#1877F2] flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14 9h3l-4-4-4 4h3v7a1 1 0 0 0 2 0V9z"/>
                                </svg>
                            </div>
                            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                            </div>
                        </div>
                        <span className="text-sm text-gray-500">42</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>5 comments</span>
                        <span>•</span>
                        <span>2 shares</span>
                    </div>
                </div>

                <div className="flex justify-between pt-2">
                    <button className="flex items-center gap-2 px-4 py-1 hover:bg-gray-100 rounded-md transition-colors">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <span className="text-sm text-gray-500">Like</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-1 hover:bg-gray-100 rounded-md transition-colors">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-sm text-gray-500">Comment</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-1 hover:bg-gray-100 rounded-md transition-colors">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <span className="text-sm text-gray-500">Share</span>
                    </button>
                </div>
            </div>
        </div>
    );
}; 