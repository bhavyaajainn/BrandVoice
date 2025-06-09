import React from "react";
import {
  YouTubeFormProps,
  YouTubePrivacy,
} from "../../types";
import { YOUTUBE_CATEGORIES } from "./helper";

export const YouTubeForm: React.FC<YouTubeFormProps> = ({
  post,
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
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Title</label>
          <button
            onClick={() => onRegenerate("title")}
            className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors"
            title="Regenerate title"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
        <input
          type="text"
          value={post.title}
          onChange={(e) => onInputChange("title", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter video title"
          maxLength={100}
        />
        <p className="mt-1 text-xs text-gray-500 text-right">
          {post.title.length}/100 characters
        </p>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <button
            onClick={() => onRegenerate("description")}
            className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors"
            title="Regenerate description"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
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
          {post.description.length}/5000 characters
        </p>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Tags</label>
          <button
            onClick={() => onRegenerate("tags")}
            className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors"
            title="Regenerate tags"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
        <input
          type="text"
          value={post.tags.join(" ")}
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
          <button
            onClick={() => onRegenerate("video")}
            className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors"
            title="Regenerate video"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
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
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Thumbnail</label>
          <button
            onClick={() => onRegenerate("thumbnail")}
            className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors"
            title="Regenerate thumbnail"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`mt-1 border-2 border-dashed rounded-lg ${
            imageError ? "border-red-500" : "border-gray-300"
          }`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onClick={() => {
            const input = document.getElementById("thumbnail-input");
            if (input) {
              input.click();
            }
          }}
        >
          <input
            id="thumbnail-input"
            type="file"
            className="hidden"
            onChange={onFileUpload}
            accept="image/*"
          />
          {renderUploadPreview()}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          JPG, PNG (max 2MB, 1280x720 recommended)
        </p>
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
          {YOUTUBE_CATEGORIES.map((category) => (
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
          onClick={() => onRegenerate("video")}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
          Generate Content
        </button>
      </div>
    </div>
  );
};
