import React, { useState } from "react";

import { XPreviewProps } from "../../types";
import { ErrorImage } from "../../helper";
import { MediaVideo, MediaDefault, renderPoll } from "./helper";

export const XPreview: React.FC<XPreviewProps> = ({ post }) => {
  const [imageError, setImageError] = useState(false);
  const [selectedPollOption, setSelectedPollOption] = useState<number | null>(
    null
  );

  const renderMedia = () => {
    if (imageError) {
      return <ErrorImage />;
    }
    switch (post.mediaType) {
      case "video":
        return MediaVideo(post);
      default:
        if (!post.mediaUrls.length) return null;
        return MediaDefault(post, setImageError);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl max-w-xl mx-auto w-full">
      <div className="flex items-start p-3 sm:p-4">
        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="ml-2 sm:ml-3 flex-grow min-w-0">
          <div className="flex items-center flex-wrap gap-1">
            <p className="font-bold text-sm sm:text-base">Your Business</p>
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1D9BF0]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
            </svg>
            <span className="text-gray-500 text-sm truncate">
              @yourbusiness
            </span>
          </div>
          <div className="mt-1 sm:mt-2 text-sm whitespace-pre-wrap break-words">
            {post.text}
            {post.hashtags.length > 0 && (
              <span className="text-[#1D9BF0]"> {post.hashtags.join(" ")}</span>
            )}
            {post.mentions.length > 0 && (
              <span className="text-[#1D9BF0]"> {post.mentions.join(" ")}</span>
            )}
          </div>
          {(post.mediaUrls.length > 0 || post.poll) && (
            <div className="mt-2 sm:mt-3 rounded-2xl overflow-hidden border border-gray-200">
              {renderMedia()}
              {renderPoll(post, selectedPollOption, setSelectedPollOption)}
            </div>
          )}
          {post.quoteTweetId && (
            <div className="mt-2 sm:mt-3 border border-gray-200 rounded-xl p-2 sm:p-3">
              <p className="text-gray-500 text-sm">
                Quoted tweet {post.quoteTweetId}
              </p>
            </div>
          )}
          <div className="mt-2 sm:mt-3 flex items-center text-gray-500 text-xs sm:text-sm">
            <span>4:20 PM · Jul 15, 2024</span>
            <span className="mx-1">·</span>
            <span className="font-bold text-black">42</span>
            <span className="ml-1">Views</span>
          </div>
          <div className="mt-2 sm:mt-3 flex justify-between items-center border-t border-gray-200 pt-2 sm:pt-3">
            <button className="flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-[#1D9BF0] group">
              <div className="p-1.5 sm:p-2 rounded-full group-hover:bg-[#1D9BF0]/10">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <span className="text-xs sm:text-sm">12</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 group">
              <div className="p-2 rounded-full group-hover:bg-green-500/10">
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
              </div>
              <span className="text-sm">8</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-pink-500 group">
              <div className="p-2 rounded-full group-hover:bg-pink-500/10">
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <span className="text-sm">24</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-[#1D9BF0] group">
              <div className="p-2 rounded-full group-hover:bg-[#1D9BF0]/10">
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
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
        <button className="ml-2 sm:ml-auto text-gray-500">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
