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
import { handleDragOver } from "../helper";
import { getGridColumns} from "./Contenthelper";
import { 
  getMediaContentRequest, 
  getTextContentRequest, 
  saveContentRequest,
  resetMediaContentState,
  resetTextContentState,
  resetSaveContentState
} from "@/lib/redux/actions/contentStudioActions";
import { useAppSelector } from "@/lib/store";
import InteractiveLoader from "../components/InteractiveLoader";

export default function GenerateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const platform = searchParams?.get("platform");
  const dispatch = useDispatch();
  const { data: textData, loading: textLoading } = useAppSelector((state) => state.textContent);
  const { data: mediaData, loading: mediaLoading } = useAppSelector((state) => state.mediaContent);
  const { data: saveData, loading: saveLoading, success: saveSuccess } = useAppSelector((state) => state.saveContent);
  
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(platform as Platform);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imageError, setImageError] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showInitialLoader, setShowInitialLoader] = useState(false);
  const [initialLoadingComplete, setInitialLoadingComplete] = useState(false);
  const [postData, setPostData] = useState<Post>({
    text: "",
    hashtags: [],
    mediaType: "image",
    mediaUrls: [],
    locationId: "",
  });

  
  const shouldShowInitialLoader = () => {
    const product_id = searchParams?.get("product_id");
    const contentId = searchParams?.get("contentId");
    return product_id && !contentId && !initialLoadingComplete;
  };

  
  const isContentLoading = textLoading || mediaLoading;

  useEffect(() => {
    if (shouldShowInitialLoader()) {
      setShowInitialLoader(true);
    }
  }, []);

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
        setPostData((prev) => ({
          ...prev,
          mediaType: savedMediaType as MediaType,
          mediaUrls: [],
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
    if (product_id && selectedPlatform && !textData && !textLoading) {
      dispatch(getTextContentRequest({ 
        product_id, 
        platform: selectedPlatform.toLowerCase() 
      }));
    }
    if (product_id && selectedPlatform && !mediaData && !mediaLoading) {
      dispatch(getMediaContentRequest({ 
        product_id, 
        platform: selectedPlatform.toLowerCase() 
      }));
    }
  }, [dispatch, searchParams, selectedPlatform, textData, textLoading, mediaData, mediaLoading]);

  
  useEffect(() => {
    if (showInitialLoader && !isContentLoading && (textData || mediaData)) {
      setInitialLoadingComplete(true);
      setShowInitialLoader(false);
    }
  }, [showInitialLoader, isContentLoading, textData, mediaData]);

  useEffect(() => {
    if (textData && typeof textData === 'object' && 'marketing_content' in textData) {
      const marketingContent = textData.marketing_content as MarketingContent;
      
      if (marketingContent && typeof marketingContent === 'object') {
        const { caption, hashtags, call_to_action } = marketingContent?.content;
        
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
      let newPreviewUrl = "";

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
          thumbnailUrl: social_media_image_url || "",
        }),
      }));
      
      setPreviewUrl(newPreviewUrl);
    }
  }, [mediaData, selectedPlatform]);

  useEffect(() => {
    if (saveSuccess && saveData) {

      localStorage.removeItem("savedContent");
      localStorage.removeItem("editContentData");
      localStorage.removeItem("editContentItem");
      localStorage.removeItem("mediaType");     
      
      dispatch(resetMediaContentState());
      dispatch(resetTextContentState());
      dispatch(resetSaveContentState());     
      
      router.push('/dashboard/content-studio');
    }
  }, [saveSuccess, saveData, dispatch, router]);

  const handleMediaTypeChange = (type: MediaType) => {
    localStorage.setItem("mediaType", type);
    setPostData((prev) => ({
      ...prev,
      mediaType: type,
      mediaUrls: [],
    }));
    setPreviewUrl("");
    setImageError(false);
    setUploadedFiles([]);
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
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (postData.mediaType === "carousel") {
      const newFiles = Array.from(files);
      const remainingSlots = 20 - uploadedFiles.length;
      const filesToAdd = newFiles.slice(0, remainingSlots);
      
      setUploadedFiles((prev) => [...prev, ...filesToAdd]);
      
      const newUrls = filesToAdd.map((file) => URL.createObjectURL(file));
      setPostData((prev) => ({
        ...prev,
        mediaUrls: [...prev.mediaUrls, ...newUrls],
      }));
    } else {
      const file = files[0];
      if (file) {
        setUploadedFiles([file]);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setPostData((prev) => ({
          ...prev,
          mediaUrls: [url],
        }));
      }
    }

    
    event.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (!files) return;

    if (postData.mediaType === "carousel") {
      const newFiles = Array.from(files);
      const remainingSlots = 20 - uploadedFiles.length;
      const filesToAdd = newFiles.slice(0, remainingSlots);
      
      setUploadedFiles((prev) => [...prev, ...filesToAdd]);
      
      const newUrls = filesToAdd.map((file) => URL.createObjectURL(file));
      setPostData((prev) => ({
        ...prev,
        mediaUrls: [...prev.mediaUrls, ...newUrls],
      }));
    } else {
      const file = files[0];
      if (file) {
        setUploadedFiles([file]);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setPostData((prev) => ({
          ...prev,
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

  const createSaveFormData = () => {
    const formData = new FormData();
    const product_id = searchParams?.get("product_id");
    
    if (!product_id) {
      throw new Error("Product ID is required");
    }

    formData.append("media_type", postData.mediaType);

    
    if (postData.mediaType === "carousel") {
      if (uploadedFiles.length > 0) {
        
        uploadedFiles.forEach((file) => {
          formData.append("carousel_files", file);
        });
      } else if (postData.mediaUrls.length > 0) {
        
        postData.mediaUrls.forEach((url) => {
          formData.append("carousel_urls", url);
        });
      }
    } else if (postData.mediaType === "video") {
      if (uploadedFiles.length > 0) {
        formData.append("video_file", uploadedFiles[0]);
      } else if (postData.mediaUrls[0]) {
        
        formData.append("video_url", postData.mediaUrls[0]);
      }
    } else if (postData.mediaType === "image") {
      if (uploadedFiles.length > 0) {
        formData.append("file", uploadedFiles[0]);
      } else if (postData.mediaUrls[0]) {
        
        formData.append("file_url", postData.mediaUrls[0]);
      }
    }

    const contentData = {
      caption: postData.text,
      hashtags: postData.hashtags,
      locationId: postData.locationId,
      ...(selectedPlatform === "Instagram" && {
        mentions: (postData as InstagramPost).mentions || [],
      }),
      ...(selectedPlatform === "Facebook" && {
        taggedPages: (postData as FacebookPost).taggedPages || [],
        privacy: (postData as FacebookPost).privacy || "Public",
        linkUrl: (postData as FacebookPost).linkUrl || "",
      }),
      ...(selectedPlatform === "Twitter" && {
        mentions: (postData as XPost).mentions || [],
        poll: (postData as XPost).poll || undefined,
        quoteTweetId: (postData as XPost).quoteTweetId || "",
      }),
      ...(selectedPlatform === "YouTube" && {
        title: (postData as YouTubePost).title || "",
        description: (postData as YouTubePost).description || "",
        tags: (postData as YouTubePost).tags || [],
        categoryId: (postData as YouTubePost).categoryId || "",
        privacyStatus: (postData as YouTubePost).privacyStatus || "public",
        playlistId: (postData as YouTubePost).playlistId || "",
        ...(postData.mediaUrls[0] && uploadedFiles.length === 0 && {
          videoUrl: postData.mediaUrls[0],
          thumbnailUrl: (postData as YouTubePost).thumbnailUrl || "",
        }),
      }),
    };

    formData.append("content", JSON.stringify(contentData));

    return formData;
  };

  const handleSave = () => {
    try {
      const product_id = searchParams?.get("product_id");
      if (!product_id) {
        alert("Product ID is required to save content");
        return;
      }

      const formData = createSaveFormData();
      
      dispatch(saveContentRequest({
        product_id,
        platform: selectedPlatform.toLowerCase(),
        data: formData,
      }));

      localStorage.setItem("savedContent", JSON.stringify(postData));
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Error saving content. Please try again.");
    }
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
      const remainingSlots = 20 - uploadedFiles.length;
      const filesToAdd = files.slice(0, remainingSlots);

      setUploadedFiles((prev) => [...prev, ...filesToAdd]);
      const newUrls = filesToAdd.map((file) => URL.createObjectURL(file));

      setPostData((prev) => ({
        ...prev,
        mediaUrls: [...prev.mediaUrls, ...newUrls],
      }));
    }
  };

  const removeCarouselImage = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
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
                      target.style.display = 'none';
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
                  setUploadedFiles([]);
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
          <div 
            className="space-y-1 text-center p-6 cursor-pointer"
            onClick={() => {
              const input = document.getElementById("video-input");
              if (input) {
                input.click();
              }
            }}
          >
            <Video className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600 justify-center">
              <span>Drop your video here, or click to select</span>
            </div>
            <p className="text-xs text-gray-500">MP4, WebM, Ogg (max 100MB)</p>
            <input
              id="video-input"
              type="file"
              className="hidden"
              accept="video/*"
              onChange={handleFileUpload}
            />
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
                  setUploadedFiles([]);
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
          <div 
            className="space-y-1 text-center p-6 cursor-pointer"
            onClick={() => {
              const input = document.getElementById("file-input");
              if (input) {
                input.click();
              }
            }}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600 justify-center">
              <span>Drop your image here, or click to select</span>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF (max 10MB)</p>
            <input
              id="file-input"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
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

  
  if (showInitialLoader) {
    return (
      <ContentLayout
        platform={selectedPlatform}
        platformIcon={platformIcons[selectedPlatform]}
      >
        <InteractiveLoader 
          onComplete={() => setShowInitialLoader(false)} 
          isLoading={isContentLoading}
        />
      </ContentLayout>
    );
  }

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
                disabled={saveLoading}
                className={`inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-colors w-full sm:w-56 ${
                  selectedPlatform === "YouTube"
                    ? "bg-red-600"
                    : selectedPlatform === "Instagram"
                    ? "bg-[#833AB4]"
                    : selectedPlatform === "Facebook"
                    ? "bg-[#1877F2]"
                    : "bg-[#000000]"
                } ${saveLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {saveLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FileUp className="w-5 h-5 mr-2" />
                    Save
                  </>
                )}
              </button>

              <button
                onClick={handleCancel}
                disabled={saveLoading}
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-colors w-full sm:w-56 disabled:opacity-50 disabled:cursor-not-allowed"
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