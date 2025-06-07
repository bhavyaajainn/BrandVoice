import React from 'react';
import { FacebookFormProps, MediaType } from '../../types';
import { Link, Media } from './helper';

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
            {post.mediaType !== 'link' && (
               Media(post, onDrop, onDragOver, onFileUpload, renderUploadPreview, imageError)
            )}      
            {post.mediaType === 'link' && 
                Link(post, onInputChange)
            }           
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