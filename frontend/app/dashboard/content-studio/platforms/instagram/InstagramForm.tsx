import React, { useRef } from 'react';
import { RegenerateIcon } from '../../components/RegenerateIcon';
import { MediaType, ContentFormProps } from '../../types';
import { hasMentions } from './helper';


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
            <div>
                <label htmlFor="mediaType" className="block text-sm font-medium text-gray-700 mb-2">
                    Media Type
                </label>
                <select
                    id="mediaType"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                    value={post.mediaType}
                    onChange={(e) => onMediaTypeChange(e.target.value as MediaType)}
                    suppressHydrationWarning
                >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="carousel">Carousel</option>
                </select>
            </div>
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
                >
                    {renderUploadPreview()}
                </div>
                {imageError && (
                    <p className="text-red-500 text-sm mt-2">Failed to load media. Please try another.</p>
                )}
            </div>
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
                    placeholder="Add hashtags separated by spaces"
                />
            </div>
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label htmlFor="mentions" className="block text-sm font-medium text-gray-700">
                        Mentions
                    </label>
                    <RegenerateIcon onClick={() => onRegenerate('mentions')} />
                </div>
                <input
                    type="text"
                    id="mentions"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    value={hasMentions(post) ? post.mentions.join(' ') : ''}
                    onChange={(e) => onArrayInput('mentions', e.target.value)}
                    placeholder="Add mentions separated by spaces"
                />
            </div>
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
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
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