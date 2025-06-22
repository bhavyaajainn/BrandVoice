import React, { useState, useEffect } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { ContentPreviewItem, ContentPreviewProps } from "../types";
import {
  BRAND_NAME,
  getPreviewData,
  PreviewComponent,
  getContentIcon,
  getDrawerWidth,
  ContentNotFound,
} from "../helper";
import { CircleProgress } from "../../helper";
import { useBrandData } from "@/lib/hooks/useBrandData";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getBrandProductsRequest, getProductPlatformContentRequest } from "@/lib/redux/actions/contentLibraryActions";

export default function ContentPreview({
  contentId,
  navigate,
}: ContentPreviewProps) {
  const dispatch = useAppDispatch();
  const { brand } = useBrandData();
  const { data: brandProducts, loading: productsLoading } = useAppSelector(
    (state) => state.brandProducts
  );
  const { data: productPlatformContent, loading: contentLoading } = useAppSelector(
    (state) => state.brandProduct
  );
  
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('instagram');

  useEffect(() => {
    if (brand?.brand_id && !brandProducts?.length && !productsLoading) {
      dispatch(getBrandProductsRequest(brand.brand_id));
    }
  }, [brand, brandProducts, productsLoading, dispatch]);

  useEffect(() => {
    if (brandProducts?.length) {
      const categories = [...new Set(brandProducts.map(product => product.category))];
      setExpandedFolders(categories);
    }
  }, [brandProducts]);

  useEffect(() => {
    const selectedProduct = brandProducts?.find(product => product.product_id === contentId);
    if (selectedProduct && selectedProduct.platforms?.length > 0) {
      const platform = selectedProduct.platforms[0];
      setSelectedPlatform(platform);
      
      dispatch(getProductPlatformContentRequest({
        productId: contentId,
        platform: platform
      }));
    }
  }, [contentId, brandProducts, dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);

      if (window.innerWidth < 768 && isLeftDrawerOpen === true) {
        setIsLeftDrawerOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  const content: ContentPreviewItem[] = brandProducts?.map(product => ({
    id: product.product_id,
    title: product.product_name,
    type: 'text' as const,
    status: 'published' as const,
    platforms: product.platforms || ['instagram'],
    createdAt: new Date(product.timestamp).toISOString().split('T')[0],
    productCategory: product.category,
    originalTitle: product.product_name,
  })) || [];

  const selectedContent = content.find((item) => item.id === contentId);

  const groupedContent = content.reduce((acc, item) => {
    if (!acc[item.productCategory]) {
      acc[item.productCategory] = [];
    }
    acc[item.productCategory].push(item);
    return acc;
  }, {} as Record<string, ContentPreviewItem[]>);

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderPath)
        ? prev.filter((f) => f !== folderPath)
        : [...prev, folderPath]
    );
  };

  const handleContentClick = (item: ContentPreviewItem) => {
    navigate(`${item.id}-library`);

    if (windowWidth < 768) {
      setIsLeftDrawerOpen(false);
    }
  };

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    dispatch(getProductPlatformContentRequest({
      productId: contentId,
      platform: platform
    }));
  };

  const getPreviewDataFromAPI = () => {
    if (!productPlatformContent || !selectedContent) {
      return getPreviewData(selectedContent || {
        id: contentId,
        title: 'Loading...',
        type: 'text',
        status: 'published',
        platforms: [selectedPlatform],
        createdAt: new Date().toISOString().split('T')[0],
        productCategory: 'General',
        originalTitle: 'Loading...'
      });
    }

    const content = productPlatformContent;
    let mediaUrls: string[] = [];
    let mediaType = 'text';

    if (content.media_type === 'carousel' && content.social_media_carousel_urls?.length) {
      mediaUrls = content.social_media_carousel_urls;
      mediaType = 'carousel';
    } else if (content.media_type === 'video' && content.social_media_video_url) {
      mediaUrls = [content.social_media_video_url];
      mediaType = 'video';
    } else if (content.media_type === 'image' && content.social_media_image_url) {
      mediaUrls = [content.social_media_image_url];
      mediaType = 'image';
    }

    let text = '';
    let hashtags: string[] = [];

    if (content.marketing_content && typeof content.marketing_content === 'object') {
      const marketingContent = content.marketing_content as any;
      if (marketingContent.content) {
        text = marketingContent.content.caption || '';
        hashtags = Array.isArray(marketingContent.content.hashtags) 
          ? marketingContent.content.hashtags 
          : [];
      }
    }

    const baseData = {
      text,
      hashtags,
      mediaType,
      mediaUrls,
      locationId: '',
    };

    switch (selectedPlatform.toLowerCase()) {
      case 'instagram':
        return {
          ...baseData,
          mentions: ['@brandvoice', '@ai'],
        };
      case 'facebook':
        return {
          ...baseData,
          taggedPages: ['@BrandVoice'],
          privacy: 'Public' as const,
          linkUrl: 'https://brandvoice.ai'
        };
      case 'twitter':
        return {
          ...baseData,
          mentions: ['@brandvoice'],
          poll: undefined,
          quoteTweetId: undefined,
        };
      case 'youtube':
        return {
          ...baseData,
          title: content.product_name || selectedContent?.originalTitle || '',
          description: text,
          tags: hashtags,
          videoUrl: content.social_media_video_url || '',
          thumbnailUrl: content.social_media_image_url || '',
        };
      default:
        return baseData;
    }
  };

  const renderPreview = () => {
    if (isLoading || productsLoading || contentLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <CircleProgress />
        </div>
      );
    }
    if (!selectedContent) {
      return <ContentNotFound />;
    }

    const previewData = getPreviewDataFromAPI();
    return (
      <div className="w-full max-w-md mx-auto">
        {PreviewComponent(selectedPlatform, previewData)}
      </div>
    );
  };

  const renderLeftDrawer = () => (
    <div className="space-y-2">
      <div className="p-3 bg-blue-50 rounded-lg mb-4 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-blue-900 truncate pr-2">
          {brand?.brand_name || BRAND_NAME}
        </h2>
        <button
          onClick={() => setIsLeftDrawerOpen(false)}
          className="ml-2 bg-white border border-gray-300 shadow-md rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
          title="Close Drawer"
        >
          <svg
            className="w-3 h-3 sm:w-5 sm:h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <div
        className="flex items-center justify-between p-2 sm:p-3 rounded cursor-pointer transition-colors hover:bg-gray-100"
        onClick={() => navigate("library")}
      >
        <div className="flex items-center space-x-2">
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11H5m14-7l-7 7-7-7m14 18l-7-7-7 7"
            />
          </svg>
          <span className="text-sm sm:text-base font-medium">View All</span>
        </div>
        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
          {content.length}
        </span>
      </div>

      {Object.entries(groupedContent).map(([productCategory, items]) => (
        <div key={productCategory} className="space-y-1">
          <div
            className="flex items-center justify-between p-2 sm:p-3 rounded cursor-pointer transition-colors hover:bg-gray-100"
            onClick={() => toggleFolder(productCategory)}
          >
            <div className="flex items-center space-x-2 min-w-0">
              {expandedFolders.includes(productCategory) ? (
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              <span className="text-sm sm:text-base font-medium truncate">
                {productCategory}
              </span>
            </div>
            <span className="text-xs bg-gray-200 px-2 py-1 rounded flex-shrink-0 ml-2">
              {items.length}
            </span>
          </div>

          {expandedFolders.includes(productCategory) && (
            <div className="ml-4 sm:ml-6 space-y-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer text-xs sm:text-sm transition-colors ${
                    item.id === contentId
                      ? "bg-blue-100 text-blue-800"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleContentClick(item)}
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <span className="flex-shrink-0">
                      {getContentIcon(item.type)}
                    </span>
                    <span className="truncate">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex h-screen bg-white relative overflow-hidden">
      {/* Main Preview Area - Scrollable */}
      <div className="flex-1 h-full flex flex-col bg-white relative">
        {/* Fixed Action Buttons */}
        {selectedContent && (
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 flex flex-col items-end space-y-3">
            {selectedContent.platforms && selectedContent.platforms.length > 1 && (
              <div className="flex flex-wrap gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                {selectedContent.platforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => handlePlatformChange(platform)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedPlatform === platform
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </button>
                ))}
              </div>
            )}
            
            <button
              onClick={() => {
                const platformType =
                  selectedPlatform === "instagram"
                    ? "Instagram"
                    : selectedPlatform === "facebook"
                    ? "Facebook"
                    : selectedPlatform === "twitter"
                    ? "Twitter"
                    : selectedPlatform === "youtube"
                    ? "YouTube"
                    : "Instagram";

                const previewData = getPreviewDataFromAPI();
                localStorage.setItem(
                  "editContentData",
                  JSON.stringify(previewData)
                );
                localStorage.setItem(
                  "editContentItem",
                  JSON.stringify(selectedContent)
                );

                window.location.href = `/dashboard/content-studio?type=generateContent&platform=${platformType}&product_id=${selectedContent.id}`;
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm border border-blue-600 px-3 sm:px-4 py-1 sm:py-2 flex items-center space-x-2 transition-colors"
            >
              <AiOutlineEdit className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">Edit</span>
            </button>
          </div>
        )}

        {/* Scrollable Preview Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-lg">
              {renderPreview()}
            </div>
          </div>
        </div>
      </div>

      {/* Left Drawer */}
      <div
        className={`${
          isLeftDrawerOpen ? getDrawerWidth(windowWidth) : "w-0"
        } transition-all duration-300 ease-in-out bg-white border-r border-gray-200 overflow-hidden fixed h-full z-50`}
        style={{
          boxShadow: isLeftDrawerOpen
            ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            : "none",
        }}
      >
        <div className="p-3 sm:p-4 h-full overflow-y-auto">
          {renderLeftDrawer()}
        </div>
      </div>

      {/* Open Drawer Button */}
      {!isLeftDrawerOpen && (
        <button
          onClick={() => setIsLeftDrawerOpen(true)}
          className="fixed top-1/2 left-2 transform -translate-y-1/2 z-50 bg-white border border-gray-300 shadow-lg rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="Open Library"
        >
          <svg
            className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* Mobile Overlay */}
      {isLeftDrawerOpen && windowWidth < 1024 && (
        <div
          className="fixed inset-0 bg-opacity-25 z-40"
          onClick={() => setIsLeftDrawerOpen(false)}
        />
      )}
    </div>
  );
}