import React, { useState } from "react";
import { InstagramPost, InstagramPreviewProps } from "../../types";
import { ErrorImage } from "../../helper";
import { hasMentions, MediaCarousel, MediaDefault, MediaVideo } from "./helper";
import { useBrandData } from "@/lib/hooks/useBrandData";

export const InstagramPreview: React.FC<InstagramPreviewProps> = ({ post }) => {
  const [imageError, setImageError] = useState(false);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const { brand } = useBrandData();

  const renderMedia = () => {
    if (imageError) {
      return <ErrorImage />;
    }
    switch (post.mediaType) {
      case "video":
        return MediaVideo(post as InstagramPost);
      case "carousel":
        if (!post.mediaUrls.length) {
          return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-500">No images in carousel</p>
            </div>
          );
        }
        return MediaCarousel(
          post as InstagramPost,
          currentCarouselIndex,
          setCurrentCarouselIndex,
          setImageError
        );
      default:
        return (
          MediaDefault(post as InstagramPost, setImageError)
        );
    }
  };

  const brandName = brand?.brand_name || "Your Business";
  const brandLogo = brand?.logo_url;

  return (
    <div className="bg-white border border-gray-200 rounded-lg max-w-md mx-auto">
      <div className="flex items-center p-3">
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] flex items-center justify-center">
          {brandLogo ? (
            <img
              src={brandLogo}
              alt={brandName}
              className="h-7 w-7 rounded-full object-cover border-2 border-white"
            />
          ) : (
            <div className="h-7 w-7 rounded-full border-2 border-white bg-gray-200"></div>
          )}
        </div>
        <div className="ml-3">
          <p className="text-sm font-semibold">{brandName}</p>
          <p className="text-xs text-gray-500">Original</p>
        </div>
        <button className="ml-auto">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
      </div>
      <div className="aspect-square relative bg-gray-100">
        {renderMedia()}
        {post.mediaType === "carousel" && post.mediaUrls.length > 1 && (
          <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
            {currentCarouselIndex + 1}/{post.mediaUrls.length}
          </div>
        )}
          <div className="absolute bottom-3 left-3 flex items-center">
            <div className="relative group">
              <div className="w-8 h-8 rounded-full bg-black bg-opacity-75 flex items-center justify-center cursor-pointer hover:bg-opacity-90 transition-opacity">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block">
                <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  {post?.mentions?.join(", ")}
                </div>
                <div className="w-2 h-2 bg-black transform rotate-45 absolute -bottom-1 left-4"></div>
              </div>
            </div>
          </div>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex space-x-4">
            <svg
              className="w-6 h-6"
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
            <svg
              className="w-6 h-6"
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
            <svg
              className="w-6 h-6"
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
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </div>

        <div className="text-sm">
          <p>
            <span className="font-semibold mr-1">{brandName}</span>
            {post.text}
          </p>
          <div className="mt-2">
            <div className="text-[#833AB4] text-xs flex flex-wrap gap-1">
              {post.hashtags.map((tag, index) => (
                <span key={index} className="hover:underline cursor-pointer">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};