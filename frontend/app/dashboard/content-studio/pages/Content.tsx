"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";

import {
  Platform,
  Post,
  MediaType,
  InstagramPost,
  FacebookPost,
  XPost,
  YouTubePost,
} from "../types";
import { platformIcons } from "../components/PlatformIcons";
import { ContentLayout } from "../components/ContentLayout";
import { FacebookForm } from "../platforms/facebook/FacebookForm";
import { FacebookPreview } from "../platforms/facebook/FacebookPreview";
import { ContentForm } from "../platforms/instagram/InstagramForm";
import { InstagramPreview } from "../platforms/instagram/InstagramPreview";
import { XForm } from "../platforms/X/XForm";
import { XPreview } from "../platforms/X/XPreview";
import { YouTubeForm } from "../platforms/youtube/YouTubeForm";
import { YouTubePreview } from "../platforms/youtube/YouTubePreview";
import { handleDragOver, sampleAssets } from "../helper";
import { getInitialPlatformData } from "./Contenthelper";
import { getMediaContentRequest, getTextContentRequest } from "@/lib/redux/actions/contentStudioActions";


export default function GenerateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [selectedPlatform, setSelectedPlatform] =
    useState<Platform>("Instagram");
  const [previewUrl, setPreviewUrl] = useState<string>(sampleAssets.image);
  const [imageError, setImageError] = useState(false);
  const [postData, setPostData] = useState<Post>({
    text: "",
    hashtags: [],
    mediaType: "video",
    mediaUrls: [sampleAssets.video],
    locationId: "",
    ...getInitialPlatformData(selectedPlatform),
  });

  useEffect(() => {
    const platformParam = searchParams?.get("platform");
    if (
      platformParam &&
      ["Instagram", "Facebook", "X", "YouTube"].includes(platformParam)
    ) {
      setSelectedPlatform(platformParam as Platform);
    }
    const contentId = searchParams?.get("contentId");
    if (contentId) {
      try {
        const savedContentData = localStorage.getItem("editContentData");
        const savedContentItem = localStorage.getItem("editContentItem");

        if (savedContentData && savedContentItem) {
          const contentData = JSON.parse(savedContentData);
          const contentItem = JSON.parse(savedContentItem);

          setPostData((prev) => ({
            ...prev,
            ...contentData,
          }));

          if (
            contentData.mediaType === "image" &&
            contentData.mediaUrls?.length > 0
          ) {
            setPreviewUrl(contentData.mediaUrls[0]);
          }
        }
      } catch (error) {
        console.error("Error loading saved content:", error);
      }
    } else {
      const savedMediaType = localStorage.getItem("mediaType");
      if (
        savedMediaType &&
        (savedMediaType === "image" ||
          savedMediaType === "video" ||
          savedMediaType === "carousel" ||
          savedMediaType === "gif")
      ) {
        let newMediaUrls: string[] = [];
        switch (savedMediaType) {
          case "carousel":
            newMediaUrls = [...sampleAssets.carousel];
            setPreviewUrl(sampleAssets.carousel[0]);
            break;
          case "video":
            newMediaUrls = [sampleAssets.video];
            setPreviewUrl(sampleAssets.video);
            break;
          case "gif":
            newMediaUrls = [sampleAssets.gif];
            setPreviewUrl(sampleAssets.gif);
            break;
          default:
            newMediaUrls = [sampleAssets.image];
            setPreviewUrl(sampleAssets.image);
        }

        setPostData((prev) => ({
          ...prev,
          mediaType: savedMediaType as MediaType,
          mediaUrls: newMediaUrls,
        }));
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const contentId = searchParams?.get("contentId");
    if (!contentId) {
      setPostData((prev) => ({
        ...prev,
        ...getInitialPlatformData(selectedPlatform),
      }));
    }
  }, [selectedPlatform, searchParams]);

  useEffect(() => {
    const product_id = searchParams?.get("product_id");
    if (product_id && selectedPlatform) {
      dispatch(getTextContentRequest({ 
        product_id, 
        platform: selectedPlatform.toLowerCase() 
      }));
      
      dispatch(getMediaContentRequest({ 
        product_id, 
        platform: selectedPlatform.toLowerCase() 
      }));
    }
  }, [dispatch, searchParams, selectedPlatform]);

  const handleMediaTypeChange = (type: MediaType) => {
    let newMediaUrls: string[] = [];
    switch (type) {
      case "carousel":
        newMediaUrls = [...sampleAssets.carousel];
        setPreviewUrl(sampleAssets.carousel[0]);
        break;
      case "video":
        newMediaUrls = [sampleAssets.video];
        setPreviewUrl(sampleAssets.video);
        break;
      case "gif":
        newMediaUrls = [sampleAssets.gif];
        setPreviewUrl(sampleAssets.gif);
        break;
      default:
        newMediaUrls = [sampleAssets.image];
        setPreviewUrl(sampleAssets.image);
    }

    localStorage.setItem("mediaType", type);
    setPostData((prev) => ({
      ...prev,
      mediaType: type,
      mediaUrls: newMediaUrls,
    }));
    setImageError(false);
  };

  const handleInputChange = (
    field: keyof (InstagramPost | FacebookPost | XPost | YouTubePost),
    value: any
  ) => {
    setPostData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (postData.mediaType === "carousel") {
        if (postData.mediaUrls.length < 20) {
          setPostData((prev) => ({
            ...prev,
            mediaUrls: [...prev.mediaUrls, url],
          }));
        }
      } else {
        setPreviewUrl(url);
        setPostData((prev) => ({
          ...prev,
          mediaType: "image",
          mediaUrls: [url],
        }));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (postData.mediaType === "carousel") {
        if (postData.mediaUrls.length < 20) {
          setPostData((prev) => ({
            ...prev,
            mediaUrls: [...prev.mediaUrls, url],
          }));
        }
      } else {
        setPreviewUrl(url);
        setPostData((prev) => ({
          ...prev,
          mediaType: "image",
          mediaUrls: [url],
        }));
      }
    }
  };

  const handlePlatformChange = (platform: Platform) => {
    setSelectedPlatform(platform);
    const contentId = searchParams?.get("contentId");
    if (!contentId) {
      if (platform === "Instagram") {
        setPostData(
          (prev) =>
            ({
              ...prev,
              mentions: [],
            } as InstagramPost)
        );
      } else if (platform === "Facebook") {
        setPostData(
          (prev) =>
            ({
              ...prev,
              taggedPages: [],
              privacy: "Public",
              linkUrl: "",
            } as FacebookPost)
        );
      } else if (platform === "X") {
        setPostData(
          (prev) =>
            ({
              ...prev,
              mentions: [],
              poll: undefined,
              quoteTweetId: undefined,
            } as XPost)
        );
      } else if (platform === "YouTube") {
        setPostData(
          (prev) =>
            ({
              ...prev,
              title: "Top 5 Indoor Plants to Boost Productivity 🌱",
              description:
                "Explore the best indoor plants for your home office.\n#IndoorPlants #ProductivityBoost",
              tags: ["IndoorPlants", "PlantCare", "WorkFromHome"],
              videoUrl: sampleAssets.video,
              thumbnailUrl: sampleAssets.image,
              categoryId: "26",
              privacyStatus: "public" as const,
              playlistId: "PLf1XPHghri",
            } as YouTubePost)
        );
      }
    }
  };

  const handleArrayInput = (
    field: "hashtags" | "mentions" | "taggedPages" | "tags",
    value: string
  ) => {
    const items = value.split(" ").filter((item) => item.trim() !== "");
    setPostData((prev) => ({
      ...prev,
      [field]: items,
    }));
  };

  const handleRegenerate = (
    field:
      | "media"
      | "caption"
      | "hashtags"
      | "title"
      | "description"
      | "tags"
      | "thumbnail"
      | "video"
  ) => {};

  const handleInstagramRegenerate = (
    field: "media" | "caption" | "hashtags" | "mentions"
  ) => {
    handleRegenerate(field === "mentions" ? "caption" : field);
  };

  const handleSave = () => {
    localStorage.setItem("savedContent", JSON.stringify(postData));

    const contentId = searchParams?.get("contentId");
    if (contentId) {
    }

    alert("Content saved successfully!");
  };

  const handleNextPlatform = () => {
    router.push("/dashboard/content-studio?type=productDetails");
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? All changes will be lost."
      )
    ) {
      const contentId = searchParams?.get("contentId");
      if (contentId) {
        window.location.href = `/dashboard/content-library?type=${contentId}-library`;
      } else {
        router.back();
      }
    }
  };

  const getGridColumns = (imageCount: number) => {
    if (imageCount <= 2) return "grid-cols-2";
    if (imageCount <= 6) return "grid-cols-3";
    return "grid-cols-4";
  };

  const handleCarouselImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const remainingSlots = 20 - postData.mediaUrls.length;
      const filesToAdd = files.slice(0, remainingSlots);

      const newUrls = filesToAdd.map((file) => URL.createObjectURL(file));

      setPostData((prev) => ({
        ...prev,
        mediaUrls: [...prev.mediaUrls, ...newUrls],
      }));
    }
  };

  const removeCarouselImage = (index: number) => {
    setPostData((prev) => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter((_, i) => i !== index),
    }));
  };

  const renderUploadPreview = () => {
    if (postData.mediaType === "carousel") {
      if (postData.mediaUrls.length > 0) {
        return (
          <div className="w-full">
            <div
              className={`grid ${getGridColumns(
                postData.mediaUrls.length
              )} gap-2 p-2`}
            >
              {postData.mediaUrls.map((url, index) => (
                <div key={`${url}-${index}`} className="relative aspect-square">
                  <Image
                    src={url}
                    alt={`Carousel image ${index + 1}`}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover rounded-lg"
                    unoptimized
                    priority={index === 0}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      const target = e.target as HTMLImageElement;
                      target.src = sampleAssets.image;
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeCarouselImage(index)}
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
              ))}
              {postData.mediaUrls.length < 20 && (
                <div
                  className="aspect-square flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors bg-gray-50 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const input = document.getElementById(
                      "carousel-file-input"
                    );
                    if (input) {
                      input.click();
                    }
                  }}
                >
                  <div className="text-center">
                    <svg
                      className="mx-auto h-8 w-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="mt-1 text-xs text-gray-500 block">
                      <span className="text-sm">
                        {20 - postData.mediaUrls.length}
                      </span>
                      <span className="hidden sm:inline"> remaining</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
            <input
              id="carousel-file-input"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleCarouselImageAdd}
              multiple
            />
          </div>
        );
      }
      return (
        <div
          className="mt-1 flex flex-col items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-indigo-500 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const input = document.getElementById("carousel-file-input");
            if (input) {
              input.click();
            }
          }}
        >
          <div className="text-center">
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-1 text-sm text-gray-500">
              Add up to 20 images for your carousel
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Click to add your first image
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, GIF (max 10MB each)
            </p>
          </div>
        </div>
      );
    }

    switch (postData.mediaType) {
      case "video":
        if (postData.mediaUrls[0]) {
          return (
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <iframe
                src={postData.mediaUrls[0]}
                className="absolute inset-0 w-full h-full rounded-lg"
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewUrl("");
                  handleInputChange("mediaUrls", []);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
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
          );
        }
        return (
          <div className="space-y-1 text-center">
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
            <p className="text-xs text-gray-500">MP4, WebM, Ogg (max 100MB)</p>
          </div>
        );
      default:
        if (previewUrl) {
          return (
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover rounded-lg"
                onError={() => setImageError(true)}
                unoptimized
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewUrl("");
                  setImageError(false);
                  handleInputChange("mediaUrls", []);
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
          );
        }
        return (
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600 justify-center">
              <span>Drop your image here, or click to select</span>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF (max 10MB)</p>
          </div>
        );
    }
  };

  const handleYouTubeInputChange = (
    field: string | number | symbol,
    value: any
  ) => {
    setPostData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFacebookInputChange = (
    field: string | number | symbol,
    value: any
  ) => {
    setPostData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleXInputChange = (field: string | number | symbol, value: any) => {
    setPostData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInstagramInputChange = (
    field: keyof InstagramPost,
    value: any
  ) => {
    setPostData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <ContentLayout
      platform={selectedPlatform}
      platformIcon={platformIcons[selectedPlatform]}
    >
      <div className="flex flex-col lg:flex-row flex-1 bg-white">
        <div className="w-full lg:w-1/2 overflow-y-auto p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
          {selectedPlatform === "YouTube" ? (
            <YouTubeForm
              post={postData as YouTubePost}
              onInputChange={handleYouTubeInputChange}
              onArrayInput={handleArrayInput}
              onFileUpload={handleFileUpload}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onRegenerate={handleRegenerate}
              renderUploadPreview={renderUploadPreview}
              imageError={imageError}
            />
          ) : selectedPlatform === "Instagram" ? (
            <ContentForm
              post={postData as InstagramPost}
              onMediaTypeChange={handleMediaTypeChange}
              onInputChange={handleInstagramInputChange}
              onArrayInput={handleArrayInput}
              onFileUpload={handleFileUpload}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onRegenerate={handleInstagramRegenerate}
              renderUploadPreview={renderUploadPreview}
              imageError={imageError}
            />
          ) : selectedPlatform === "Facebook" ? (
            <FacebookForm
              post={postData as FacebookPost}
              onMediaTypeChange={handleMediaTypeChange}
              onInputChange={handleFacebookInputChange}
              onArrayInput={handleArrayInput}
              onFileUpload={handleFileUpload}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onRegenerate={handleRegenerate}
              renderUploadPreview={renderUploadPreview}
              imageError={imageError}
            />
          ) : selectedPlatform === "X" ? (
            <XForm
              post={postData as XPost}
              onMediaTypeChange={handleMediaTypeChange}
              onInputChange={handleXInputChange}
              onArrayInput={handleArrayInput}
              onFileUpload={handleFileUpload}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onRegenerate={handleRegenerate}
              renderUploadPreview={renderUploadPreview}
              imageError={imageError}
            />
          ) : null}
        </div>

        <div className="w-full lg:w-1/2 overflow-y-auto p-4 flex flex-col">
          <div className="flex-grow max-w-lg mx-auto w-full">
            {selectedPlatform === "YouTube" && (
              <YouTubePreview post={postData as YouTubePost} />
            )}
            {selectedPlatform === "Instagram" && (
              <InstagramPreview post={postData as InstagramPost} />
            )}
            {selectedPlatform === "Facebook" && (
              <FacebookPreview post={postData as FacebookPost} />
            )}
            {selectedPlatform === "X" && <XPreview post={postData as XPost} />}
            <div className="mt-8 flex flex-col items-center space-y-4">
              <button
                onClick={handleSave}
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors w-full sm:w-56"
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
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Save
              </button>

              <button
                onClick={handleNextPlatform}
                className={`inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-colors w-full sm:w-56 ${
                  selectedPlatform === "YouTube"
                    ? "bg-red-600"
                    : selectedPlatform === "Instagram"
                    ? "bg-[#833AB4]"
                    : selectedPlatform === "Facebook"
                    ? "bg-[#1877F2]"
                    : "bg-[#000000]"
                }`}
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
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
                Next Platform
              </button>

              <button
                onClick={handleCancel}
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-colors w-full sm:w-56"
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
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}