import React from 'react';
import Image from 'next/image';
import { YouTubePreviewProps } from '../../types';
import { YOUTUBE_CATEGORIES } from './helper';

export const YouTubePreview: React.FC<YouTubePreviewProps> = ({ post }) => {
    return (
        <div className="bg-white rounded-lg overflow-hidden max-w-2xl mx-auto">
            <div className="relative aspect-video w-full">
                {post.videoUrl ? (
                    <video
                        key={post.videoUrl}
                        src={post.videoUrl}
                        controls
                        className="w-full h-full object-cover"
                        poster={post.thumbnailUrl}
                        playsInline
                        preload="metadata"
                    >
                        <source src={post.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    post.thumbnailUrl ? (
                        <Image
                            src={post.thumbnailUrl}
                            alt={post.title || "YouTube video thumbnail"}
                            fill
                        />
                    ) : null
                )}
                <div className="absolute bottom-2 right-2 bg-black text-white text-xs px-1 rounded">
                    HD
                </div>
            </div>
            <div className="p-4">
                <div className="flex">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0" />  
                    <div className="ml-3 flex-grow">
                        <h2 className="font-semibold text-base line-clamp-2">
                            {post.title}
                        </h2>
                        <div className="mt-1 flex items-center text-sm text-gray-600">
                            <span className="font-medium">Your Channel</span>
                            <svg className="w-4 h-4 ml-1 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        </div>
                        <div className="text-sm text-gray-600 mt-0.5">
                            <span>No views</span>
                            <span className="mx-1">•</span>
                            <span>Just now</span>
                        </div>
                    </div>
                    <button className="ml-2 text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                    </button>
                </div>
                <div className="mt-4 text-sm text-gray-800 whitespace-pre-wrap line-clamp-2">
                    {post.description}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags?.map((tag, index) => (
                        <span
                            key={index}
                            className="text-blue-600 text-sm hover:text-blue-800 cursor-pointer"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-600">
                    <span className="capitalize">{post.privacyStatus}</span>
                    <span className="mx-2">•</span>
                    {YOUTUBE_CATEGORIES.find(cat => cat.id === post.categoryId)?.name}
                </div>
                {post.playlistId && (
                    <div className="mt-2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                        <span>Added to playlist: {post.playlistId}</span>
                    </div>
                )}
            </div>
        </div>
    );
};