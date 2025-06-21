"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { Upload, X, Plus, Video, ImageIcon, Save, ArrowRight, FileUp } from "lucide-react";

import {
  Platform,
  Post,
  MediaType,
  InstagramPost,
  FacebookPost,
  XPost,
  YouTubePost,
  MarketingContent,
  MediaContentResponse,
  TextContentResponse,
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
import { getGridColumns, getInitialPlatformData } from "./Contenthelper";
import { getMediaContentRequest, getTextContentRequest } from "@/lib/redux/actions/contentStudioActions";
import { useAppSelector } from "@/lib/store";

export default function GenerateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { data: textData, loading: textLoading } = useAppSelector((state) => state.textContent);
  const { data: mediaData, loading: mediaLoading } = useAppSelector((state) => state.mediaContent);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("Instagram");
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
      }));
    }
  }, [selectedPlatform, searchParams]);

  useEffect(() => {
    const product_id = searchParams?.get("product_id");
    if (product_id && selectedPlatform && !textData) {
      dispatch(getTextContentRequest({ 
        product_id, 
        platform: selectedPlatform.toLowerCase() 
      }));
    }
    if (product_id && selectedPlatform && !mediaData) {
      dispatch(getMediaContentRequest({ 
        product_id, 
        platform: selectedPlatform.toLowerCase() 
      }));
    }
  }, [dispatch, searchParams, selectedPlatform]);

  useEffect(() => {
    if (textData && typeof textData === 'object' && 'marketing_content' in textData) {
      const marketingContent = textData.marketing_content as MarketingContent;
      
      if (marketingContent && typeof marketingContent === 'object') {
        const { caption, hashtags, call_to_action } = marketingContent.content;
        
        const validCaption = caption || "";
        const validHashtags = Array.isArray(hashtags) ? hashtags : [];
        const validCallToAction = call_to_action || "";
        
        if (selectedPlatform === "Facebook") {
          setPostData((prev) => ({
            ...prev,
            text: validCaption + (validCallToAction ? `\n\n${validCallToAction}` : ""),
            hashtags: validHashtags,
          }));
        } else if (selectedPlatform === "YouTube") {
          setPostData((prev) => ({
            ...prev,
            title: (textData as TextContentResponse).product_name || "",
            description: validCaption + (validCallToAction ? `\n\n${validCallToAction}` : ""),
            tags: validHashtags,
            text: validCaption,
            hashtags: validHashtags,
          }));
        } else if (selectedPlatform === "Twitter") {
          const hashtagsText = validHashtags.map(tag => `#${tag}`).join(' ');
          const combinedText = [validCaption, hashtagsText, validCallToAction].filter(Boolean).join(' ');
          setPostData((prev) => ({
            ...prev,
            text: combinedText,
            hashtags: validHashtags,
          }));
        } else {
          setPostData((prev) => ({
            ...prev,
            text: validCaption,
            hashtags: validHashtags,
          }));
        }
      }
    }
  }, [textData, selectedPlatform]);

  useEffect(() => {
    if (mediaData && typeof mediaData === 'object') {
      const mediaResponse = mediaData as MediaContentResponse;
      const { 
        social_media_image_url, 
        social_media_carousel_urls, 
        social_media_video_url, 
        media_type 
      } = mediaResponse;

      let newMediaUrls: string[] = [];
      let mediaType: MediaType = "image";
      let newPreviewUrl = sampleAssets.image;

      if (media_type === "carousel" && social_media_carousel_urls?.length) {
        mediaType = "carousel";
        newMediaUrls = social_media_carousel_urls;
        newPreviewUrl = social_media_carousel_urls[0];
      } else if (media_type === "video" && social_media_video_url) {
        mediaType = "video";
        newMediaUrls = [social_media_video_url];
        newPreviewUrl = social_media_video_url;
      } else if (media_type === "image" && social_media_image_url) {
        mediaType = "image";
        newMediaUrls = [social_media_image_url];
        newPreviewUrl = social_media_image_url;
      }

      setPostData((prev) => ({
        ...prev,
        mediaType,
        mediaUrls: newMediaUrls,
        ...(selectedPlatform === "YouTube" && social_media_video_url && {
          videoUrl: social_media_video_url,
          thumbnailUrl: social_media_image_url || sampleAssets.image,
        }),
      }));
      
      setPreviewUrl(newPreviewUrl);
    }
  }, [mediaData, selectedPlatform]);

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
                    <X className="w-4 h-4" />
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
                    <Plus className="mx-auto h-8 w-8 text-gray-400" />
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
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
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
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        }
        return (
          <div className="space-y-1 text-center">
            <Video className="mx-auto h-12 w-12 text-gray-400" />
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
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        }
        return (
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
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
              renderUploadPreview={renderUploadPreview}
              imageError={imageError}
            />
          ) : selectedPlatform === "Twitter" ? (
            <XForm
              post={postData as XPost}
              onMediaTypeChange={handleMediaTypeChange}
              onInputChange={handleXInputChange}
              onArrayInput={handleArrayInput}
              onFileUpload={handleFileUpload}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
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
            {selectedPlatform === "Twitter" && <XPreview post={postData as XPost} />}
            <div className="mt-8 flex flex-col items-center space-y-4">
              <button
                onClick={handleSave}
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors w-full sm:w-56"
              >
                <FileUp className="w-5 h-5 mr-2" />
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
                <ArrowRight className="w-5 h-5 mr-2" />
                Next Platform
              </button>

              <button
                onClick={handleCancel}
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-colors w-full sm:w-56"
              >
                <X className="w-5 h-5 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}