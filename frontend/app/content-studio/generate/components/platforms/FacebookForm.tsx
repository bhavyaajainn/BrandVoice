import React from 'react';
import { FacebookPost, MediaType } from '../types';

interface FacebookFormProps {
    post: FacebookPost;
    onMediaTypeChange: (type: MediaType) => void;
    onInputChange: (field: keyof FacebookPost, value: any) => void;
    onArrayInput: (field: 'hashtags' | 'taggedPages', value: string) => void;
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onRegenerate: (field: 'media' | 'caption' | 'hashtags') => void;
    renderUploadPreview: () => React.ReactNode;
    imageError: boolean;
}

export const FacebookForm: React.FC<FacebookFormProps> = ({
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
    return (
        <div className="space-y-6">
            {/* Media Type Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
                <select
                    value={post.mediaType}
                    onChange={(e) => onMediaTypeChange(e.target.value as MediaType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="link">Link</option>
                </select>
            </div>

            {/* Media Upload */}
            {post.mediaType !== 'link' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Media</label>
                    <div
                        className={`mt-1 border-2 border-dashed rounded-lg ${
                            imageError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onClick={() => {
                            const input = document.getElementById('file-input');
                            if (input) {
                                input.click();
                            }
                        }}
                    >
                        <input
                            id="file-input"
                            type="file"
                            className="hidden"
                            onChange={onFileUpload}
                            accept={post.mediaType === 'video' ? 'video/*' : 'image/*'}
                            multiple={false}
                        />
                        {renderUploadPreview()}
                    </div>
                </div>
            )}

            {/* Link URL - Only shown for link type */}
            {post.mediaType === 'link' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link URL</label>
                    <input
                        type="url"
                        value={post.linkUrl || ''}
                        onChange={(e) => onInputChange('linkUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com"
                    />
                </div>
            )}

            {/* Caption */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                <textarea
                    value={post.text}
                    onChange={(e) => onInputChange('text', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write your caption here..."
                />
            </div>

            {/* Hashtags */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hashtags</label>
                <input
                    type="text"
                    value={post.hashtags.join(' ')}
                    onChange={(e) => onArrayInput('hashtags', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="#example #hashtags"
                />
            </div>

            {/* Tagged Pages */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tagged Pages</label>
                <input
                    type="text"
                    value={post.taggedPages.join(' ')}
                    onChange={(e) => onArrayInput('taggedPages', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="@page1 @page2"
                />
            </div>

            {/* Privacy Setting */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Privacy</label>
                <select
                    value={post.privacy}
                    onChange={(e) => onInputChange('privacy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="Public">Public</option>
                    <option value="Friends">Friends</option>
                    <option value="OnlyMe">Only Me</option>
                </select>
            </div>

            {/* Location */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                    type="text"
                    value={post.locationId}
                    onChange={(e) => onInputChange('locationId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add location..."
                />
            </div>

            {/* Generate Button */}
            <div className="pt-4">
                <button
                    onClick={() => {
                        onRegenerate('caption');
                        onRegenerate('hashtags');
                    }}
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-[#1877F2] rounded-lg hover:bg-[#1666d4] transition-colors"
                    style={{ width: 'fit-content' }}
                >
                    Generate Content
                </button>
            </div>
        </div>
    );
}; 