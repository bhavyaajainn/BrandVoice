import React, { useState } from "react";
import { Download } from "lucide-react";
import {
  YouTubeFormProps,
  YouTubePrivacy,
} from "../../types";
import { YOUTUBE_CATEGORIES } from "./helper";
import { downloadContentAssets } from '../utils';

export const YouTubeForm: React.FC<YouTubeFormProps & { uploadedFiles?: File[] }> = ({
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
    await downloadContentAssets(post, 'YouTube', setIsDownloading, uploadedFiles);
  };
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Title</label>
        </div>
        <input
          type="text"
          value={post.title ?? ""}
          onChange={(e) => onInputChange("title", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter video title"
          maxLength={100}
        />
        <p className="mt-1 text-xs text-gray-500 text-right">
          {post.title?.length}/100 characters
        </p>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
        </div>
        <textarea
          value={post.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter video description"
          maxLength={5000}
        />
        <p className="mt-1 text-xs text-gray-500 text-right">
          {post.description?.length}/5000 characters
        </p>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Tags</label>
        </div>
        <input
          type="text"
          value={post.tags?.join(" ") ?? ""}
          onChange={(e) => onArrayInput("tags", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter tags separated by spaces"
        />
        <p className="mt-1 text-xs text-gray-500">
          Maximum 500 characters total
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Video</label>
        </div>
        <div
          className="mt-1 border-2 border-dashed rounded-lg border-gray-300"
          onDrop={onDrop}
          onDragOver={onDragOver}
          onClick={() => {
            const input = document.getElementById("video-input");
            if (input) {
              input.click();
            }
          }}
        >
          <input
            id="video-input"
            type="file"
            className="hidden"
            onChange={onFileUpload}
            accept="video/*"
          />
          {post.videoUrl ? (
            <div className="relative w-full aspect-video">
              <video
                key={post.videoUrl}
                src={post.videoUrl}
                className="w-full h-full rounded-lg"
                controls
                playsInline
                preload="metadata"
              >
                <source src={post.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onInputChange("videoUrl", "");
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="space-y-1 text-center p-6">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <div className="flex text-sm text-gray-600 justify-center">
                <span>Drop your video here, or click to select</span>
              </div>
              <p className="text-xs text-gray-500">
                MP4, WebM, Ogg (max 100MB)
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={post.categoryId}
          onChange={(e) => onInputChange("categoryId", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          {YOUTUBE_CATEGORIES?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Privacy
        </label>
        <select
          value={post.privacyStatus}
          onChange={(e) =>
            onInputChange("privacyStatus", e.target.value as YouTubePrivacy)
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="public">Public</option>
          <option value="unlisted">Unlisted</option>
          <option value="private">Private</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Playlist
        </label>
        <input
          type="text"
          value={post.playlistId || ""}
          onChange={(e) => onInputChange("playlistId", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter playlist ID"
        />
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ width: "fit-content" }}
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