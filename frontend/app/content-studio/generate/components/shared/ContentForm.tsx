import React, { useRef } from 'react';
import { Post, MediaType } from '../types';
import { RegenerateIcon } from './RegenerateIcon';

interface ContentFormProps {
    post: Post;
    onMediaTypeChange: (type: MediaType) => void;
    onInputChange: (field: keyof Post, value: any) => void;
    onArrayInput: (field: 'hashtags' | 'mentions', value: string) => void;
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onRegenerate: (field: 'media' | 'caption' | 'hashtags') => void;
    renderUploadPreview: () => React.ReactNode;
    imageError: boolean;
}

export const ContentForm: React.FC<ContentFormProps> = ({
    post,
    onMediaTypeChange,
    onInputChange,
    onArrayInput,
    onFileUpload,
    onDrop,
    onDragOver,
    onRegenerate,
    renderUploadPreview,
    imageError,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <form className="space-y-6 max-w-2xl mx-auto">
            {/* Media Type Selection */}
            <div>
                <label htmlFor="mediaType" className="block text-sm font-medium text-gray-700 mb-2">
                    Media Type
                </label>
                <select
                    id="mediaType"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                    value={post.mediaType}
                    onChange={(e) => onMediaTypeChange(e.target.value as MediaType)}
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
                        Upload {post.mediaType}
                    </label>
                    <RegenerateIcon onClick={() => onRegenerate('media')} />
                </div>
                <div
                    className="mt-1 flex flex-col items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-indigo-500 transition-colors"
                    onDragOver={onDragOver}
                    onDrop={onDrop}
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
                    <RegenerateIcon onClick={() => onRegenerate('caption')} />
                </div>
                <textarea
                    id="text"
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    value={post.text}
                    onChange={(e) => onInputChange('text', e.target.value)}
                    placeholder="Write your caption here..."
                />
            </div>

            {/* Hashtags Input with Regenerate */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label htmlFor="hashtags" className="block text-sm font-medium text-gray-700">
                        Hashtags
                    </label>
                    <RegenerateIcon onClick={() => onRegenerate('hashtags')} />
                </div>
                <input
                    type="text"
                    id="hashtags"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    value={post.hashtags.join(' ')}
                    onChange={(e) => onArrayInput('hashtags', e.target.value)}
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
                        value={post.mentions.join(' ')}
                        onChange={(e) => onArrayInput('mentions', e.target.value)}
                        placeholder="@username1 @username2"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
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
                    value={post.locationId || ''}
                    onChange={(e) => onInputChange('locationId', e.target.value)}
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

            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={onFileUpload}
                multiple={post.mediaType === 'carousel'}
            />
        </form>
    );
}; 