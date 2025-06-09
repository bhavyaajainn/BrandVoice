import React, { useState, useEffect } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { ContentPreviewItem, ContentPreviewProps } from "../types";
import {
  mockContent,
  BRAND_NAME,
  getPreviewData,
  PreviewComponent,
  getContentIcon,
  getDrawerWidth,
  ContentNotFound,
} from "../helper";
import { CircleProgress } from "../../helper";

export default function ContentPreview({
  contentId,
  navigate,
}: ContentPreviewProps) {
  const [content, setContent] = useState<ContentPreviewItem[]>(mockContent);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([
    "Clothing",
    "Software",
  ]);
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [isLoading, setIsLoading] = useState(true);

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

  const renderPreview = () => {
    if (isLoading) {
      return <CircleProgress />;
    }
    if (!selectedContent) {
      return <ContentNotFound />;
    }

    const previewData = getPreviewData(selectedContent);
    const platform = selectedContent.platforms[0];
    return (
      <div className="max-w-md mx-auto">
        {PreviewComponent(platform, previewData)}
      </div>
    );
  };

  const renderLeftDrawer = () => (
    <div className="space-y-2">
      <div className="p-3 bg-blue-50 rounded-lg mb-4 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-blue-900 truncate pr-2">
          {BRAND_NAME}
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
                  <span
                    className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs flex-shrink-0 ml-2 ${
                      item.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {item.status === "published" ? "P" : "D"}
                  </span>
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
      <div className="w-full h-full flex items-center justify-center bg-white absolute inset-0">
        {selectedContent && (
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 flex flex-row items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm border border-gray-200 px-2 sm:px-3 py-1 sm:py-2">
              <span
                className={`text-xs sm:text-sm font-medium ${
                  selectedContent.status === "published"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {selectedContent.status === "published" ? "Published" : "Draft"}
              </span>
              <button
                onClick={() => {
                  const newStatus =
                    selectedContent.status === "published"
                      ? "draft"
                      : "published";
                  setContent((prevContent) =>
                    prevContent.map((item) =>
                      item.id === selectedContent.id
                        ? { ...item, status: newStatus }
                        : item
                    )
                  );
                }}
                className={`relative inline-flex h-5 sm:h-6 w-9 sm:w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  selectedContent.status === "published"
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-3 sm:h-4 w-3 sm:w-4 transform rounded-full bg-white transition-transform ${
                    selectedContent.status === "published"
                      ? "translate-x-5 sm:translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <button
              onClick={() => {
                const platform = selectedContent?.platforms[0] || "";

                const platformType =
                  platform === "instagram"
                    ? "Instagram"
                    : platform === "facebook"
                    ? "Facebook"
                    : platform === "twitter"
                    ? "X"
                    : platform === "youtube"
                    ? "YouTube"
                    : "";

                const previewData = getPreviewData(selectedContent);
                localStorage.setItem(
                  "editContentData",
                  JSON.stringify(previewData)
                );
                localStorage.setItem(
                  "editContentItem",
                  JSON.stringify(selectedContent)
                );

                window.location.href = `/dashboard/content-studio?type=generateContent&platform=${platformType}&contentId=${selectedContent.id}`;
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm border border-blue-600 px-3 sm:px-4 py-1 sm:py-2 flex items-center space-x-2 transition-colors"
            >
              <AiOutlineEdit className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">Edit</span>
            </button>
          </div>
        )}

        <div className="h-full w-full flex items-center justify-center p-4 sm:p-6 overflow-auto">
          {renderPreview()}
        </div>
      </div>

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

      {isLeftDrawerOpen && windowWidth < 1024 && (
        <div
          className="fixed inset-0 bg-opacity-25 z-40"
          onClick={() => setIsLeftDrawerOpen(false)}
        />
      )}
    </div>
  );
}
