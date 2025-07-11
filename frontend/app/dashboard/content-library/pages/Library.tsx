"use client";

import React, { useEffect, useState } from "react";
import { ContentLibraryItem, LibraryProps } from "../types";
import {
  BRAND_NAME,
  getPlatformIcon,
  getPlatformTheme,
  getContentIcon,
  getPreviewData,
} from "../helper";
import { useBrandData } from "@/lib/hooks/useBrandData";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getBrandProductsRequest, getProductPlatformContentRequest } from "@/lib/redux/actions/contentLibraryActions";
import { CircleProgress } from "../../helper";

export default function Library({ navigate }: LibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [selectedView, setSelectedView] = useState<"all" | string>("all");
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
  const { brand } = useBrandData();
  const { data: brandProducts, loading: productsLoading, error: productsError } = useAppSelector(
    (state) => state.brandProducts
  );
  const { data: productPlatformContent, loading: contentLoading } = useAppSelector(
    (state) => state.brandProduct
  );

  useEffect(() => {
    if (brand?.brand_id && !brandProducts?.length && !productsLoading && !productsError) {
      dispatch(getBrandProductsRequest(brand.brand_id));
    }
  }, [brand, brandProducts, productsLoading, productsError, dispatch]);

  useEffect(() => {
    if (brandProducts?.length) {
      const categories = [...new Set(brandProducts.map(product => product.category))];
      setExpandedFolders(categories);
    }
  }, [brandProducts]);

  const content: ContentLibraryItem[] = brandProducts?.map(product => ({
    id: product.product_id,
    title: product.product_name,
    type: 'text' as const,
    status: 'published' as const,
    platforms: product.platforms || ['instagram'],
    createdAt: new Date(product.timestamp).toISOString().split('T')[0],
    productCategory: product.category,
    originalTitle: product.product_name,
  })) || [];

  const groupedContent = content.reduce((acc, item) => {
    if (!acc[item.productCategory]) {
      acc[item.productCategory] = [];
    }
    acc[item.productCategory].push(item);
    return acc;
  }, {} as Record<string, ContentLibraryItem[]>);

  const filteredContent = content.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.originalTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderPath)
        ? prev.filter((f) => f !== folderPath)
        : [...prev, folderPath]
    );
  };

  const handleContentClick = (item: ContentLibraryItem) => {
    navigate(`${item.id}-library`);
  };

  const handlePreviewClick = (item: ContentLibraryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`${item.id}-library`);
  };

  const handleEditClick = async (item: ContentLibraryItem, e: React.MouseEvent) => {
    e.stopPropagation();

    const platform = item.platforms[0] || 'instagram';
    const platformType =
      platform === "instagram"
        ? "Instagram"
        : platform === "facebook"
        ? "Facebook"
        : platform === "twitter"
        ? "Twitter"
        : platform === "youtube"
        ? "YouTube"
        : "Instagram";

    setLoadingItems(prev => ({ ...prev, [item.id]: true }));

    try {
      await dispatch(getProductPlatformContentRequest({
        productId: item.id,
        platform: platform
      }));

      const getPreviewDataFromAPI = () => {
        if (!productPlatformContent) {
          return getPreviewData(item);
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

        switch (platform.toLowerCase()) {
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
              title: content.product_name || item.originalTitle || '',
              description: text,
              tags: hashtags,
              videoUrl: content.social_media_video_url || '',
              thumbnailUrl: content.social_media_image_url || '',
            };
          default:
            return baseData;
        }
      };

      const previewData = getPreviewDataFromAPI();
      
      localStorage.setItem("editContentData", JSON.stringify(previewData));
      localStorage.setItem("editContentItem", JSON.stringify(item));

      window.location.href = `/dashboard/content-studio?type=generateContent&platform=${platformType}&product_id=${item.id}`;
    } catch (error) {
      console.error('Error fetching content data:', error);
      
      const fallbackPreviewData = getPreviewData(item);
      localStorage.setItem("editContentData", JSON.stringify(fallbackPreviewData));
      localStorage.setItem("editContentItem", JSON.stringify(item));

      window.location.href = `/dashboard/content-studio?type=generateContent&platform=${platformType}&product_id=${item.id}`;
    } finally {
      setLoadingItems(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const renderFolderStructure = () => (
    <div className="space-y-2">
      <div className="p-3 bg-blue-50 rounded-lg mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-blue-900">{brand?.brand_name || BRAND_NAME}</h2>
        {isDrawerOpen && (
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="ml-2 bg-white border border-gray-300 shadow-md rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
            title="Close Drawer"
          >
            <svg
              className="w-5 h-5 text-gray-600"
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
        )}
      </div>

      {!isDrawerOpen && (
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="fixed top-1/2 left-0 transform -translate-y-1/2 z-50 bg-white border border-gray-300 shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="Open Drawer"
        >
          <svg
            className="w-6 h-6 text-gray-600"
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

      <div
        className={`flex items-center justify-between p-3 rounded cursor-pointer transition-colors ${
          selectedView === "all"
            ? "bg-blue-100 text-blue-800"
            : "hover:bg-gray-100"
        }`}
        onClick={() => setSelectedView("all")}
      >
        <div className="flex items-center space-x-2">
          <svg
            className="w-4 h-4 text-blue-500"
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
          <span className="font-medium">View All</span>
        </div>
        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
          {content.length}
        </span>
      </div>

      {Object.entries(groupedContent).map(([productCategory, items]) => (
        <div key={productCategory} className="space-y-1">
          <div
            className={`flex items-center justify-between p-3 rounded cursor-pointer transition-colors ${
              selectedView === productCategory
                ? "bg-blue-100 text-blue-800"
                : "hover:bg-gray-100"
            }`}
            onClick={() => {
              setSelectedView(productCategory);
              toggleFolder(productCategory);
            }}
          >
            <div className="flex items-center space-x-2">
              {expandedFolders.includes(productCategory) ? (
                <svg
                  className="w-4 h-4 text-yellow-500"
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
                  className="w-4 h-4 text-yellow-500"
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
                className="w-5 h-5 text-yellow-500"
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
              <span className="font-medium">{productCategory}</span>
            </div>
            <span className="text-xs bg-gray-200 px-2 py-1 rounded">
              {items.length}
            </span>
          </div>

          {expandedFolders.includes(productCategory) && (
            <div className="ml-6 space-y-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer text-sm"
                  onClick={() => handleContentClick(item)}
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    {getContentIcon(item.type)}
                    <span className="break-words">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const getContentToShow = () => {
    if (selectedView === "all") {
      return filteredContent;
    } else {
      return filteredContent.filter(
        (item) => item.productCategory === selectedView
      );
    }
  };

  if (productsLoading) {
    return <CircleProgress />;
  }

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {isDrawerOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      <div
        className={`${
          isDrawerOpen ? "w-80" : "w-0"
        } transition-all duration-300 ease-in-out bg-white border-r border-gray-200 overflow-hidden fixed lg:relative h-full z-50 lg:z-auto`}
      >
        <div className="p-4 h-full overflow-y-auto">
          {renderFolderStructure()}
        </div>
      </div>

      <div
        className={`flex-1 p-4 lg:p-6 overflow-y-auto transition-all duration-300 ease-in-out ${
          isDrawerOpen ? "lg:ml-0" : "ml-0"
        }`}
      >
        <div className="mb-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getContentToShow().map((item) => {
            const platform = item.platforms[0] || 'instagram';
            const theme = getPlatformTheme(platform);

            return (
              <div
                key={item.id}
                className={`${theme.background} rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-200 cursor-pointer`}
                onClick={() => handleContentClick(item)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`${theme.icon} flex-shrink-0`}>
                      {getPlatformIcon(platform)}
                    </div>
                    <h3 className={`font-semibold break-words ${theme.text}`}>
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div
                  className={`text-xs mb-4 space-y-1 ${
                    theme.background.includes("white")
                      ? "text-gray-500"
                      : "text-white/75"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Category: {item.productCategory}</span>
                  </div>
                  <div>Created: {item.createdAt}</div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={(e) => handlePreviewClick(item, e)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
                      theme.background.includes("white")
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={(e) => handleEditClick(item, e)}
                    disabled={loadingItems[item.id]}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
                      theme.background.includes("white")
                        ? "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400"
                        : "bg-white text-gray-800 hover:bg-white/90 disabled:bg-white/70"
                    }`}
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span>{loadingItems[item.id] ? 'Loading...' : 'Edit'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {getContentToShow().length === 0 && !productsLoading && (
          <div className="text-center py-16">
            <div className="text-gray-500">
              <svg
                className="mx-auto h-16 w-16 mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-xl font-medium mb-2 text-gray-700">
                No content found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search terms or create new content
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}