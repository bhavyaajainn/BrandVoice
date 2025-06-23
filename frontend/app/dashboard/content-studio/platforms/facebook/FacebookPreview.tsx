import React, { useState } from 'react';
import { FacebookPreviewProps } from '../../types';
import { MediaDefault, MediaVideo } from './helper';
import { ErrorImage } from '../../helper';
import { useBrandData } from '@/lib/hooks/useBrandData';

export const FacebookPreview: React.FC<FacebookPreviewProps> = ({ post }) => {
    const [imageError, setImageError] = useState(false);
    const { brand } = useBrandData();

    const renderMedia = () => {
        if (imageError) {
            return (
                <ErrorImage/>
            );
        }
        switch (post.mediaType) {
            case 'video':
                return (
                   MediaVideo(post)
                );
            default:
                return (
                   MediaDefault(post, setImageError)
                );
        }
    };

    const brandName = brand?.brand_name || "Your Business";
    const brandLogo = brand?.logo_url;

    return (
        <div className="bg-white border border-gray-200 rounded-lg max-w-xl mx-auto">
            <div className="flex items-center p-3">
                <div className="h-10 w-10 rounded-full bg-[#1877F2] flex items-center justify-center">
                    {brandLogo ? (
                        <img
                            src={brandLogo}
                            alt={brandName}
                            className="h-9 w-9 rounded-full object-cover border-2 border-white"
                        />
                    ) : (
                        <div className="h-9 w-9 rounded-full border-2 border-white bg-gray-200"></div>
                    )}
                </div>
                <div className="ml-3">
                    <div className="flex items-center">
                        <p className="text-sm font-semibold text-[#1877F2]">{brandName}</p>
                        <span className="mx-1 text-gray-500">•</span>
                        <span className="text-xs text-gray-500">Follow</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 space-x-1">
                        <span>Just now</span>
                        <span>•</span>
                        <span>{post.privacy}</span>
                        {post?.taggedPages?.length || 0 > 0 && (
                            <>
                                <span>•</span>
                                <span>with {post?.taggedPages?.join(', ')}</span>
                            </>
                        )}
                    </div>
                </div>
                <button className="ml-auto">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                </button>
            </div>
            <div className="px-3 pb-2">
                <p className="text-sm">{post.text}</p>
                {post.hashtags.length > 0 && (
                    <p className="mt-1 text-sm text-[#1877F2] flex flex-wrap gap-1">
                        {post.hashtags.map((tag, index) => (
                            <span key={index} className="hover:underline cursor-pointer">{tag}</span>
                        ))}
                    </p>
                )}
            </div>
            <div className="relative bg-gray-100">
                {renderMedia()}
            </div>
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
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                        <span>5 comments</span>
                        <span>•</span>
                        <span>2 shares</span>
                    </div>
                </div>

                <div className="flex justify-between pt-2">
                    <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 hover:bg-gray-100 rounded-md transition-colors">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <span className="text-xs sm:text-sm text-gray-500">Like</span>
                    </button>
                    <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 hover:bg-gray-100 rounded-md transition-colors">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-xs sm:text-sm text-gray-500">Comment</span>
                    </button>
                    <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 hover:bg-gray-100 rounded-md transition-colors">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <span className="text-xs sm:text-sm text-gray-500">Share</span>
                    </button>
                </div>
            </div>
        </div>
    );
};