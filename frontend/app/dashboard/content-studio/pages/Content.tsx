"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
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
import { handleDragOver, getGridColumns } from "./Contenthelper";
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
import ContentFetchLoader from "../components/ContentFetchLoader";
import {
  useContentData,
  useInitialLoader,
  useUploadHandlers,
  createSaveFormData,
  shouldShowInitialLoader,
  renderUploadPreview,
  processTextData,
  processMediaData
} from "./Contenthelper";

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
  const [postData, setPostData] = useState<Post>({
    text: "",
    hashtags: [],
    mediaType: "image",
    mediaUrls: [],
    locationId: "",
  });

  const { showInitialLoader, setShowInitialLoader, initialLoadingComplete, setInitialLoadingComplete } = useInitialLoader();
  const isContentLoading = textLoading || mediaLoading;

  const {
    handleFileUpload,
    handleDrop,
    handleCarouselImageAdd,
    removeCarouselImage
  } = useUploadHandlers(postData, setPostData, setUploadedFiles, setPreviewUrl);

  useEffect(() => {
    if (shouldShowInitialLoader(searchParams, initialLoadingComplete)) {
      setShowInitialLoader(true);
    }
  }, []);

  useEffect(() => {
    const platformParam = searchParams?.get("platform");
    if (platformParam && ["Instagram", "Facebook", "X", "YouTube"].includes(platformParam)) {
      setSelectedPlatform(platformParam as Platform);
    }
    
    const contentId = searchParams?.get("contentId");
    if (contentId) {
      try {
        const savedContentData = localStorage.getItem("editContentData");
        if (savedContentData) {
          const contentData = JSON.parse(savedContentData);
          setPostData((prev) => ({ ...prev, ...contentData }));
          if (contentData.mediaType === "image" && contentData.mediaUrls?.length > 0) {
            setPreviewUrl(contentData.mediaUrls[0]);
          }
        }
      } catch (error) {
        console.error("Error loading saved content:", error);
      }
    } else {
      const savedMediaType = localStorage.getItem("mediaType");
      if (savedMediaType && ["image", "video", "carousel", "gif"].includes(savedMediaType)) {
        setPostData((prev) => ({
          ...prev,
          mediaType: savedMediaType as MediaType,
          mediaUrls: [],
        }));
      }
    }
  }, [searchParams]);

  useContentData(dispatch, searchParams, selectedPlatform, textData, textLoading, mediaData, mediaLoading);

  useEffect(() => {
    if (showInitialLoader && !isContentLoading && (textData || mediaData)) {
      setInitialLoadingComplete(true);
      setShowInitialLoader(false);
    }
  }, [showInitialLoader, isContentLoading, textData, mediaData]);

  useEffect(() => {
    if (textData) {
      processTextData(textData, selectedPlatform, setPostData);
    }
  }, [textData, selectedPlatform]);

  useEffect(() => {
    if (mediaData) {
      processMediaData(mediaData, selectedPlatform, setPostData, setPreviewUrl);
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
    setPostData((prev) => ({ ...prev, mediaType: type, mediaUrls: [] }));
    setPreviewUrl("");
    setImageError(false);
    setUploadedFiles([]);
  };

  const handleInputChange = (field: any, value: any) => {
    setPostData((prev) => ({ ...prev, [field]: value }));
  };

  const handleYouTubeInputChange = (field: keyof YouTubePost, value: any) => {
    setPostData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFacebookInputChange = (field: keyof FacebookPost, value: any) => {
    setPostData((prev) => ({ ...prev, [field]: value }));
  };

  const handleXInputChange = (field: keyof XPost, value: any) => {
    setPostData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInstagramInputChange = (field: keyof InstagramPost, value: any) => {
    setPostData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field: "hashtags" | "mentions" | "taggedPages" | "tags", value: string) => {
    const items = value.split(" ").filter((item) => item.trim() !== "");
    setPostData((prev) => ({ ...prev, [field]: items }));
  };

  const handleSave = () => {
    try {
      const product_id = searchParams?.get("product_id");
      if (!product_id) {
        alert("Product ID is required to save content");
        return;
      }

      const formData = createSaveFormData(postData, searchParams, selectedPlatform, uploadedFiles);
      
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
    if (window.confirm("Are you sure you want to cancel? All changes will be lost.")) {
      const contentId = searchParams?.get("contentId");
      if (contentId) {
        window.location.href = `/dashboard/content-library?type=${contentId}-library`;
      } else {
        router.back();
      }
    }
  };

  const renderUploadPreviewComponent = () => {
    return renderUploadPreview(
      postData,
      previewUrl,
      setPreviewUrl,
      setImageError,
      setUploadedFiles,
      handleInputChange,
      removeCarouselImage,
      handleCarouselImageAdd
    );
  };

  if (showInitialLoader) {
    return (
      <ContentLayout platform={selectedPlatform} platformIcon={platformIcons[selectedPlatform]}>
        <InteractiveLoader onComplete={() => setShowInitialLoader(false)} isLoading={isContentLoading} />
      </ContentLayout>
    );
  }

  if(textLoading || mediaLoading){
    return (
      <ContentLayout platform={selectedPlatform} platformIcon={platformIcons[selectedPlatform]}>
        <ContentFetchLoader 
          message={textLoading && mediaLoading ? "Loading content and media..." : 
                  textLoading ? "Loading content..." : "Loading media..."}
        />
      </ContentLayout>
    );
  }

  return (
    <ContentLayout platform={selectedPlatform} platformIcon={platformIcons[selectedPlatform]}>
      <div className="flex flex-col lg:flex-row flex-1 bg-white relative">
        {isContentLoading && !showInitialLoader && (
          <ContentFetchLoader 
            message={textLoading && mediaLoading ? "Loading content and media..." : 
                    textLoading ? "Loading content..." : "Loading media..."}
          />
        )}
        
        <div className="w-full lg:w-1/2 overflow-y-auto p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
          {selectedPlatform === "YouTube" ? (
            <YouTubeForm
              post={postData as YouTubePost}
              onInputChange={handleYouTubeInputChange}
              onArrayInput={handleArrayInput}
              onFileUpload={handleFileUpload}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              renderUploadPreview={renderUploadPreviewComponent}
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
              renderUploadPreview={renderUploadPreviewComponent}
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
              renderUploadPreview={renderUploadPreviewComponent}
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
              renderUploadPreview={renderUploadPreviewComponent}
              imageError={imageError}
            />
          ) : null}
        </div>

        <div className="w-full lg:w-1/2 overflow-y-auto p-4 flex flex-col">
          <div className="flex-grow max-w-lg mx-auto w-full">
            {selectedPlatform === "YouTube" && <YouTubePreview post={postData as YouTubePost} />}
            {selectedPlatform === "Instagram" && <InstagramPreview post={postData as InstagramPost} />}
            {selectedPlatform === "Facebook" && <FacebookPreview post={postData as FacebookPost} />}
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