import React, { useState } from 'react';
import Image from 'next/image';
import { XPost } from '../types';

interface XPreviewProps {
    post: XPost;
}

export const XPreview: React.FC<XPreviewProps> = ({ post }) => {
    const [imageError, setImageError] = useState(false);
    const [selectedPollOption, setSelectedPollOption] = useState<number | null>(null);

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
                    <div className="w-full aspect-video relative rounded-2xl overflow-hidden">
                        <iframe
                            src={post.mediaUrls[0]}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                );
            default:
                if (!post.mediaUrls.length) return null;

                const gridClass = post.mediaUrls.length === 1 ? 'grid-cols-1' :
                                post.mediaUrls.length === 2 ? 'grid-cols-2' :
                                post.mediaUrls.length === 3 ? 'grid-cols-2' :
                                'grid-cols-2';

                return (
                    <div className={`grid ${gridClass} gap-0.5 rounded-2xl overflow-hidden`}>
                        {post.mediaUrls.map((url, index) => (
                            <div key={index} className={`relative ${
                                post.mediaUrls.length === 3 && index === 0 ? 'col-span-2' : ''
                            }`}>
                                <div className="aspect-square relative">
                                    <Image
                                        src={url}
                                        alt={`Media ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        onError={() => setImageError(true)}
                                        unoptimized
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                );
        }
    };

    const renderPoll = () => {
        if (!post.poll) return null;

        const totalVotes = 100; // Mock total votes
        const mockVotes = post.poll?.options?.map((_, index) => 
            Math.floor(totalVotes / (post.poll?.options?.length || 1)) + (index === 0 ? totalVotes % (post.poll?.options?.length || 1) : 0)
        ) || [];

        return (
            <div className="mt-3 space-y-2 px-3 pb-3">
                {post.poll?.options?.map((option, index) => {
                    const percentage = mockVotes[index];
                    return (
                        <button
                            key={index}
                            onClick={() => setSelectedPollOption(index)}
                            className={`w-full text-left ${
                                selectedPollOption !== null ? 'cursor-default' : 'hover:bg-gray-50'
                            }`}
                            disabled={selectedPollOption !== null}
                        >
                            <div className="relative">
                                <div
                                    className={`absolute inset-0 ${
                                        selectedPollOption === index ? 'bg-[#1D9BF0]/20' : 'bg-gray-100'
                                    } rounded-full transition-all duration-200 ease-in-out`}
                                    style={{ width: `${percentage}%` }}
                                />
                                <div className="relative px-4 py-2 flex justify-between items-center">
                                    <span className="font-medium">{option}</span>
                                    {selectedPollOption !== null && (
                                        <span className="text-gray-500 ml-2">{percentage}%</span>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
                <div className="flex items-center text-sm text-gray-500 mt-2">
                    {selectedPollOption !== null ? (
                        <>
                            <span className="font-medium text-black">{totalVotes}</span>
                            <span className="ml-1">votes</span>
                            <span className="mx-1">•</span>
                            <span>Final results</span>
                        </>
                    ) : (
                        <>
                            <span>{Math.floor(post.poll.durationMinutes / 1440)}</span>
                            <span className="ml-1">
                                {post.poll.durationMinutes === 1440 ? 'day' : 'days'}
                            </span>
                            <span className="ml-1">left</span>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl max-w-xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-start p-3 sm:p-4">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 flex-shrink-0" />
                <div className="ml-2 sm:ml-3 flex-grow min-w-0">
                    <div className="flex items-center flex-wrap gap-1">
                        <p className="font-bold text-sm sm:text-base">Your Business</p>
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1D9BF0]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                        </svg>
                        <span className="text-gray-500 text-sm truncate">@yourbusiness</span>
                    </div>
                    <div className="mt-1 sm:mt-2 text-sm whitespace-pre-wrap break-words">
                        {post.text}
                        {post.hashtags.length > 0 && (
                            <span className="text-[#1D9BF0]">
                                {' '}{post.hashtags.join(' ')}
                            </span>
                        )}
                        {post.mentions.length > 0 && (
                            <span className="text-[#1D9BF0]">
                                {' '}{post.mentions.join(' ')}
                            </span>
                        )}
                    </div>

                    {/* Media */}
                    {(post.mediaUrls.length > 0 || post.poll) && (
                        <div className="mt-2 sm:mt-3 rounded-2xl overflow-hidden border border-gray-200">
                            {renderMedia()}
                            {renderPoll()}
                        </div>
                    )}

                    {/* Quote Tweet */}
                    {post.quoteTweetId && (
                        <div className="mt-2 sm:mt-3 border border-gray-200 rounded-xl p-2 sm:p-3">
                            <p className="text-gray-500 text-sm">Quoted tweet {post.quoteTweetId}</p>
                        </div>
                    )}

                    {/* Timestamp and Stats */}
                    <div className="mt-2 sm:mt-3 flex items-center text-gray-500 text-xs sm:text-sm">
                        <span>4:20 PM · Jul 15, 2024</span>
                        <span className="mx-1">·</span>
                        <span className="font-bold text-black">42</span>
                        <span className="ml-1">Views</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-2 sm:mt-3 flex justify-between items-center border-t border-gray-200 pt-2 sm:pt-3">
                        <button className="flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-[#1D9BF0] group">
                            <div className="p-1.5 sm:p-2 rounded-full group-hover:bg-[#1D9BF0]/10">
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <span className="text-xs sm:text-sm">12</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 group">
                            <div className="p-2 rounded-full group-hover:bg-green-500/10">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <span className="text-sm">8</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-500 hover:text-pink-500 group">
                            <div className="p-2 rounded-full group-hover:bg-pink-500/10">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <span className="text-sm">24</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-500 hover:text-[#1D9BF0] group">
                            <div className="p-2 rounded-full group-hover:bg-[#1D9BF0]/10">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
                <button className="ml-2 sm:ml-auto text-gray-500">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}; 