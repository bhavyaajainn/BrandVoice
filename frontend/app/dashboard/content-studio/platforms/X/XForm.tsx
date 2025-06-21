import React, { useState } from "react";
import { MediaType, XFormProps } from "../../types";

export const XForm: React.FC<XFormProps> = ({
  post,
  onMediaTypeChange,
  onInputChange,
  onArrayInput,
  onFileUpload,
  onDrop,
  onDragOver,
  renderUploadPreview,
  imageError,
}) => {
  const [showPollForm, setShowPollForm] = useState(false);
  const [pollOption, setPollOption] = useState("");

  const handleAddPollOption = () => {
    if (!pollOption.trim()) return;
    const currentPoll = post.poll || { options: [], durationMinutes: 1440 };
    if (currentPoll.options.length >= 4) return;
    const newOptions = [...currentPoll.options, pollOption.trim()];
    onInputChange("poll", { ...currentPoll, options: newOptions });
    setPollOption("");
  };

  const handleRemovePollOption = (index: number) => {
    if (!post.poll) return;
    const newOptions = post.poll.options.filter((_, i) => i !== index);
    if (newOptions.length === 0) {
      onInputChange("poll", undefined);
      setShowPollForm(false);
    } else {
      onInputChange("poll", { ...post.poll, options: newOptions });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Media Type
        </label>
        <select
          value={post.mediaType}
          onChange={(e) => onMediaTypeChange(e.target.value as MediaType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="image">Image</option>
          <option value="gif">GIF</option>
          <option value="video">Video</option>
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Media</label>
        </div>
        <div
          className={`mt-1 border-2 border-dashed rounded-lg ${
            imageError ? "border-red-500" : "border-gray-300"
          }`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onClick={() => {
            const input = document.getElementById("file-input");
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
            accept={
              post.mediaType === "video"
                ? "video/*"
                : post.mediaType === "gif"
                ? "image/gif"
                : "image/*"
            }
            multiple={post.mediaType === "image"}
          />
          {renderUploadPreview()}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {post.mediaType === "image"
            ? "Up to 4 images allowed"
            : post.mediaType === "gif"
            ? "Single GIF allowed"
            : "Single video allowed"}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Tweet</label>
        </div>
        <textarea
          value={post.text}
          onChange={(e) => onInputChange("text", e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="What's happening?"
          maxLength={280}
        />
        <p className="mt-1 text-xs text-gray-500 text-right">
          {post.text.length}/280 characters
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Hashtags</label>
        </div>
        <input
          type="text"
          value={post.hashtags.join(" ")}
          onChange={(e) => onArrayInput("hashtags", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="#example #hashtags"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mentions
        </label>
        <input
          type="text"
          value={post.mentions.join(" ")}
          onChange={(e) => onArrayInput("mentions", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="@username1 @username2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quote Tweet ID
        </label>
        <input
          type="text"
          value={post.quoteTweetId || ""}
          onChange={(e) => onInputChange("quoteTweetId", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter tweet ID to quote"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Poll
          </label>
          <button
            type="button"
            onClick={() => {
              setShowPollForm(!showPollForm);
              if (!showPollForm && !post.poll) {
                onInputChange("poll", { options: [], durationMinutes: 1440 });
              }
            }}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            {showPollForm ? "Remove Poll" : "Add Poll"}
          </button>
        </div>
        {showPollForm && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={pollOption}
                onChange={(e) => setPollOption(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add poll option"
                maxLength={25}
              />
              <button
                type="button"
                onClick={handleAddPollOption}
                disabled={
                  !pollOption.trim() || (post.poll?.options.length || 0) >= 4
                }
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            {post.poll?.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
              >
                <span>{option}</span>
                <button
                  type="button"
                  onClick={() => handleRemovePollOption(index)}
                  className="text-red-500 hover:text-red-600"
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
            ))}
            {post.poll && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poll Duration
                </label>
                <select
                  value={post.poll.durationMinutes}
                  onChange={(e) =>
                    onInputChange("poll", {
                      ...post.poll,
                      durationMinutes: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={1440}>1 day</option>
                  <option value={2880}>2 days</option>
                  <option value={4320}>3 days</option>
                  <option value={10080}>7 days</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-4">
        <button
          className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-black rounded-full hover:bg-gray-900 transition-colors"
          style={{ width: "fit-content" }}
        >
          Generate Content
        </button>
      </div>
    </div>
  );
};
