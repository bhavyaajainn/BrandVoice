import React, { useRef, useState } from 'react';
import { Download } from 'lucide-react';
import { MediaType, ContentFormProps } from '../../types';
import { hasMentions } from './helper';
import { downloadContentAssets } from '../utils';


export const ContentForm: React.FC<ContentFormProps & { uploadedFiles?: File[] }> = ({
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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (isDownloading) return;
        await downloadContentAssets(post, 'Instagram', setIsDownloading, uploadedFiles);
    };
    return (
        <form className="space-y-6 max-w-2xl mx-auto">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Upload {post.mediaType}
                    </label>
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
                </div>
                <input
                    type="text"
                    id="mentions"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    value={hasMentions(post) ? post?.mentions?.join(' ') : ''}
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
            <div className="flex justify-start">
                <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="inline-flex justify-center items-center py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#833AB4] hover:bg-[#6d2f96] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#833AB4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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