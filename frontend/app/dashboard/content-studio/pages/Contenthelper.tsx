import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Upload, X, Plus, Video, ImageIcon } from "lucide-react";
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

export const getGridColumns = (imageCount: number) => {
  if (imageCount <= 2) return "grid-cols-2";
  if (imageCount <= 6) return "grid-cols-3";
  return "grid-cols-4";
};

export const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

export const shouldShowInitialLoader = (searchParams: URLSearchParams | null, initialLoadingComplete: boolean) => {
  const product_id = searchParams?.get("product_id");
  const contentId = searchParams?.get("contentId");
  return product_id && !contentId && !initialLoadingComplete;
};

export const useInitialLoader = () => {
  const [showInitialLoader, setShowInitialLoader] = useState(false);
  const [initialLoadingComplete, setInitialLoadingComplete] = useState(false);
  
  return {
    showInitialLoader,
    setShowInitialLoader,
    initialLoadingComplete,
    setInitialLoadingComplete
  };
};

export const useContentData = (
  dispatch: any,
  searchParams: URLSearchParams | null,
  selectedPlatform: Platform,
  textData: any,
  textLoading: boolean,
  mediaData: any,
  mediaLoading: boolean
) => {
  useEffect(() => {
    const product_id = searchParams?.get("product_id");
    if (product_id && selectedPlatform && !textData && !textLoading) {
      dispatch({
        type: 'GET_TEXT_CONTENT_REQUEST',
        payload: { 
          product_id, 
          platform: selectedPlatform.toLowerCase() 
        }
      });
    }
    if (product_id && selectedPlatform && !mediaData && !mediaLoading) {
      dispatch({
        type: 'GET_MEDIA_CONTENT_REQUEST',
        payload: { 
          product_id, 
          platform: selectedPlatform.toLowerCase() 
        }
      });
    }
  }, [dispatch, searchParams, selectedPlatform, textData, textLoading, mediaData, mediaLoading]);
};

export const useUploadHandlers = (
  postData: Post,
  setPostData: React.Dispatch<React.SetStateAction<Post>>,
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>,
  setPreviewUrl: React.Dispatch<React.SetStateAction<string>>
) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (postData.mediaType === "carousel") {
      const newFiles = Array.from(files);
      const remainingSlots = 20 - (postData.mediaUrls?.length || 0);
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
      const remainingSlots = 20 - (postData.mediaUrls?.length || 0);
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

  const handleCarouselImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const remainingSlots = 20 - (postData.mediaUrls?.length || 0);
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

  return {
    handleFileUpload,
    handleDrop,
    handleCarouselImageAdd,
    removeCarouselImage
  };
};

export const renderUploadPreview = (
  postData: Post,
  previewUrl: string,
  setPreviewUrl: React.Dispatch<React.SetStateAction<string>>,
  setImageError: React.Dispatch<React.SetStateAction<boolean>>,
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>,
  handleInputChange: (field: any, value: any) => void,
  removeCarouselImage: (index: number) => void,
  handleCarouselImageAdd: (e: React.ChangeEvent<HTMLInputElement>) => void
) => {
  if (postData.mediaType === "carousel") {
    if (postData.mediaUrls.length > 0) {
      return (
        <div className="w-full">
          <div className={`grid ${getGridColumns(postData.mediaUrls.length)} gap-2 p-2`}>
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
                  const input = document.getElementById("carousel-file-input");
                  if (input) {
                    input.click();
                  }
                }}
              >
                <div className="text-center">
                  <Plus className="mx-auto h-8 w-8 text-gray-400" />
                  <span className="mt-1 text-xs text-gray-500 block">
                    <span className="text-sm">{20 - postData.mediaUrls.length}</span>
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
          <p className="mt-1 text-sm text-gray-500">Add up to 20 images for your carousel</p>
          <p className="mt-2 text-xs text-gray-500">Click to add your first image</p>
          <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF (max 10MB each)</p>
        </div>
      </div>
    );
  }

  switch (postData.mediaType) {
    case "video":
      if (postData.mediaUrls[0]) {
        return (
          <div className="relative w-full aspect-square max-w-md mx-auto">
            <video
              src={postData.mediaUrls[0]}
              className="absolute inset-0 w-full h-full rounded-lg"
              controls
              playsInline
              preload="metadata"
            >
              <source src={postData.mediaUrls[0]} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
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
            onChange={(e) => {
              const files = e.target.files;
              if (files && files[0]) {
                setUploadedFiles([files[0]]);
                const url = URL.createObjectURL(files[0]);
                setPreviewUrl(url);
                handleInputChange("mediaUrls", [url]);
              }
            }}
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
            onChange={(e) => {
              const files = e.target.files;
              if (files && files[0]) {
                setUploadedFiles([files[0]]);
                const url = URL.createObjectURL(files[0]);
                setPreviewUrl(url);
                handleInputChange("mediaUrls", [url]);
              }
            }}
          />
        </div>
      );
  }
};

export const createSaveFormData = (
  postData: Post,
  searchParams: URLSearchParams | null,
  selectedPlatform: Platform,
  uploadedFiles: File[]
) => {
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
      }),
    }),
  };

  formData.append("content_json", JSON.stringify(contentData));

  return formData;
};

export const processTextData = (
  textData: any,
  selectedPlatform: Platform,
  setPostData: React.Dispatch<React.SetStateAction<Post>>
) => {
  if (!textData || typeof textData !== 'object') {
    console.warn('Invalid textData:', textData);
    return;
  }

  if (!textData.marketing_content) {
    console.warn('Missing marketing_content in textData:', textData);
    return;
  }

  const marketingContent = textData.marketing_content as MarketingContent;
  
  if (!marketingContent || typeof marketingContent !== 'object') {
    console.warn('Invalid marketingContent:', marketingContent);
    return;
  }

  if (!marketingContent.content) {
    console.warn('Missing content in marketingContent:', marketingContent);
    return;
  }

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
};

export const processMediaData = (
  mediaData: any,
  selectedPlatform: Platform,
  setPostData: React.Dispatch<React.SetStateAction<Post>>,
  setPreviewUrl: React.Dispatch<React.SetStateAction<string>>
) => {
  if (mediaData && typeof mediaData === 'object') {
    const mediaResponse = mediaData as MediaContentResponse;
    const { 
      social_media_image_url, 
      social_media_carousel_urls, 
      social_media_video_url, 
      media_type 
    } = mediaResponse;

    let newMediaUrls: string[] = [];
    let mediaType: any = "image";
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
      }),
    }));
    
    setPreviewUrl(newPreviewUrl);
  }
};