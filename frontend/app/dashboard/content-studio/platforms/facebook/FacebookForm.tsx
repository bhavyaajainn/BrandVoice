import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { FacebookFormProps, MediaType } from '../../types';
import { Link, Media } from './helper';
import { downloadContentAssets } from '../utils';


export const FacebookForm: React.FC<FacebookFormProps & { uploadedFiles?: File[] }> = ({
    post,
    onInputChange,
    onArrayInput,
        onFileUpload,
        onDrop,
    onDragOver,
    renderUploadPreview,
    imageError,
    uploadedFiles,
}) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (isDownloading) return;
        await downloadContentAssets(post, 'Facebook', setIsDownloading, uploadedFiles);
    };
    return (
        <div className="space-y-6">      
            {post?.mediaType !== 'link' && (
               Media(post, onDrop, onDragOver, onFileUpload, renderUploadPreview, imageError)
            )}      
            {post?.mediaType === 'link' && 
                Link(post, onInputChange)
            }           
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                <textarea
                    value={post?.text}
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
                    value={post?.hashtags?.join(' ')}
                    onChange={(e) => onArrayInput('hashtags', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="#example #hashtags"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tagged Pages</label>
                <input
                    type="text"
                    value={post?.taggedPages?.join(' ') ?? ""}
                    onChange={(e) => onArrayInput('taggedPages', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="@page1 @page2"
                />
            </div>         
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Privacy</label>
                <select
                    value={post?.privacy}
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
                    value={post?.locationId}
                    onChange={(e) => onInputChange('locationId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add location..."
                />
            </div>
            <div className="pt-4">
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-[#1877F2] rounded-lg hover:bg-[#1666d4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ width: 'fit-content' }}
                >
                    {isDownloading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Downloading...
                        </>
                    ) : (
                        <>
                            <Download className="w-5 h-5 mr-2" />
                            Download Assets
                        </>
                    )}
                </button>
            </div> 
        </div>
        
    );
};