"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import {
  createPlatformInformationRequest,
  createProductInformationRequest,
  resetProductState,
  resetPlatformState,
} from "@/lib/redux/actions/contentStudioActions";
import { ProductDetailsProps, Platform, MediaType } from "../types";
import { platformIcons } from "../components/PlatformIcons";
import { platformData, PRODUCT_CATEGORIES, Step, Stepper } from "./ProductDetailshelper";
import { useAuthContext } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";

const CustomLoader = () => (
  <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
);

export default function ProductDetails({ navigate }: ProductDetailsProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: productData, loading: productLoading } = useAppSelector((state) => state.product);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSubmittedStep1, setHasSubmittedStep1] = useState(false);
  const [productDetails, setProductDetails] = useState<{
    description: string;
    productName: string;
    category: string;
    selectedPlatform: Platform | null;
    mediaType: MediaType | null;
  }>({
    description: "",
    productName: "",
    category: "",
    selectedPlatform: null,
    mediaType: null,
  });
  const { user } = useAuthContext();
  const [availablePlatforms, setAvailablePlatforms] = useState<Record<string, string[]>>({});
  const { brand } = useAppSelector((state) => state.brand);

  useEffect(() => {
    if (brand?.marketing_platforms) {
      const filteredPlatforms: Record<string, string[]> = {};
      Object.entries(platformData).forEach(([platform, mediaTypes]) => {
        const platformLower = platform.toLowerCase();
        if (brand.marketing_platforms.some((p: string) => p.toLowerCase() === platformLower)) {
          filteredPlatforms[platform] = mediaTypes;
        }
      });

      setAvailablePlatforms(filteredPlatforms);
    } else {
      setAvailablePlatforms(platformData);
    }
  }, [brand]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      window.history.pushState(null, "", window.location.href);
      return false;
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue =
        "Are you sure you want to leave? Your progress will be lost.";
      return "Are you sure you want to leave? Your progress will be lost.";
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (
      productData &&
      productData.product_name &&
      productData.description &&
      !productLoading &&
      hasSubmittedStep1
    ) {
      setCurrentStep(1);
    }
  }, [productData, productLoading, hasSubmittedStep1]);

  const handleNext = () => {
    if (currentStep === 0) {
      if (
        !productDetails.productName.trim() ||
        !productDetails.description.trim() ||
        !productDetails.category
      ) {
        alert("Please fill in product name, description, and category");
        return;
      }

      dispatch(
        createProductInformationRequest({
          brand_id: user?.uid,
          product: {
            product_name: productDetails.productName,
            description: productDetails.description,
            category: productDetails.category,
          },
        })
      );
      setHasSubmittedStep1(true);
    } else if (currentStep === 1) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    window.removeEventListener("popstate", () => {});
    window.removeEventListener("beforeunload", () => {});
    dispatch(
      createPlatformInformationRequest({
        product_id: productData?.product_id,
        platform: productDetails.selectedPlatform,
        media_type: productDetails.mediaType,
        content_only: false,
        media_only: false,
      })
    );
    navigate("generateContent");
  };

  const handleClickMoodBoard = () => {
    dispatch(resetProductState());
    dispatch(resetPlatformState());
    dispatch(
      createProductInformationRequest({
        brand_id: user?.uid,
        product: {
          product_name: productDetails.productName,
          description: productDetails.description,
          category: productDetails.category,
        },
      })
    );
    setHasSubmittedStep1(true);

    setTimeout(() => {
      window.removeEventListener("popstate", () => {});
      window.removeEventListener("beforeunload", () => {});
      dispatch(
        createPlatformInformationRequest({
          product_id: productData?.product_id,
          platform: productDetails.selectedPlatform,
          media_type: "carousel",
          content_only: false,
          media_only: true,
        })
      );
      navigate("moodboard");
    }, 100);
  };

  const handleCancel = () => {
    window.removeEventListener("popstate", () => {});
    window.removeEventListener("beforeunload", () => {});
    router.push("/dashboard");
  };

  const handlePlatformSelect = (platform: Platform) => {
    const defaultMediaType = platformData[platform][0] as MediaType;
    setProductDetails((prev) => ({
      ...prev,
      selectedPlatform: platform,
      mediaType: defaultMediaType,
    }));
  };

  const handleMediaTypeChange = (mediaType: MediaType) => {
    setProductDetails((prev) => ({
      ...prev,
      mediaType: mediaType,
    }));
  };

  const isStep1Valid =
    productDetails.productName.trim() && 
    productDetails.description.trim() && 
    productDetails.category;
  const isStep2Valid =
    productDetails.selectedPlatform && productDetails.mediaType;

  const isLoading = hasSubmittedStep1 && productLoading;

  return (
    <div className="bg-slate-50/95 backdrop-blur-sm rounded-2xl p-8 shadow-sm max-w-4xl mx-auto relative">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl z-50 flex flex-col items-center justify-center"
        >
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center">
            <CustomLoader />
            <p className="text-lg text-slate-700 font-semibold mt-4">
              Processing your product information...
            </p>
            <p className="text-sm text-slate-500 mt-2 text-center">
              Please wait while we prepare your content
            </p>
          </div>
        </motion.div>
      )}

      <div className={`p-4 sm:p-6 ${isLoading ? 'pointer-events-none' : ''}`}>
        <motion.h1
          className="text-2xl sm:text-3xl font-bold mb-8 text-slate-800 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Tell us about your product
        </motion.h1>
        <Stepper step={currentStep}>
          <Step step={currentStep} index={0}>
            Product Description
          </Step>
          <Step step={currentStep} index={1}>
            Platform Information
          </Step>
        </Stepper>

        <div className="mt-8 min-h-[420px]">
          {currentStep === 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <label className="block text-lg font-semibold text-slate-800 mb-4">
                  What's your product name? *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Nike Air Max 270, iPhone 15 Pro, Tesla Model S..."
                  className="w-full rounded-xl border-2 border-gray-200 bg-white shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-4 text-base transition-all duration-200"
                  value={productDetails.productName}
                  onChange={(e) =>
                    setProductDetails((prev) => ({
                      ...prev,
                      productName: e.target.value,
                    }))
                  }
                  disabled={isLoading}
                />
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <label className="block text-lg font-semibold text-slate-800 mb-4">
                  Describe your product *
                </label>
                <textarea
                  rows={6}
                  placeholder="Tell us about your product's features, benefits, target audience, and what makes it special..."
                  className="w-full rounded-xl border-2 border-gray-200 bg-white shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-4 text-base transition-all duration-200 resize-none"
                  value={productDetails.description}
                  onChange={(e) =>
                    setProductDetails((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  disabled={isLoading}
                />
                <p className="text-sm text-slate-500 mt-3">
                  💡 The more details you provide, the better we can tailor your
                  content
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
                <label className="block text-lg font-semibold text-slate-800 mb-4">
                  Category *
                </label>
                <div className="relative">
                  <select
                    className="w-full rounded-xl border-2 border-gray-200 bg-white shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-4 pr-12 text-base transition-all duration-200 appearance-none"
                    value={productDetails.category}
                    onChange={(e) =>
                      setProductDetails((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    disabled={isLoading}
                  >
                    <option value="">Select a category...</option>
                    {PRODUCT_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
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
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <label className="block text-lg font-semibold text-slate-800 mb-6">
                  Choose your platform *
                </label>
                <div className="flex flex-wrap gap-3 justify-center">
                  {(Object.keys(availablePlatforms) as Platform[]).map((platform) => (
                    <motion.button
                      key={platform}
                      type="button"
                      className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 border-2 ${
                        productDetails.selectedPlatform === platform
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg ring-4 ring-blue-100 scale-105"
                          : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 shadow-sm hover:shadow-md"
                      }`}
                      onClick={() => handlePlatformSelect(platform)}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoading}
                    >
                      <div
                        className={`w-5 h-5 transition-colors duration-200 ${
                          productDetails.selectedPlatform === platform
                            ? "text-white"
                            : platform === "Instagram"
                            ? "text-pink-500"
                            : platform === "Facebook"
                            ? "text-blue-600"
                            : platform === "X"
                            ? "text-gray-800"
                            : "text-red-600"
                        }`}
                      >
                        {platformIcons[platform]}
                      </div>
                      <span className="font-medium text-sm">{platform}</span>
                      {productDetails.selectedPlatform === platform && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className="w-4 h-4 text-white"
                        >
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
                <p className="text-sm text-slate-500 mt-4 text-center">
                  Select the platform where you want to create content
                </p>
              </div>

              {productDetails.selectedPlatform && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                >
                  <div className="flex items-center mb-6">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                        productDetails.selectedPlatform === "Instagram"
                          ? "bg-pink-100"
                          : productDetails.selectedPlatform === "Facebook"
                          ? "bg-blue-100"
                          : productDetails.selectedPlatform === "X"
                          ? "bg-gray-100"
                          : "bg-red-100"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 ${
                          productDetails.selectedPlatform === "Instagram"
                            ? "text-pink-600"
                            : productDetails.selectedPlatform === "Facebook"
                            ? "text-blue-600"
                            : productDetails.selectedPlatform === "X"
                            ? "text-gray-800"
                            : "text-red-600"
                        }`}
                      >
                        {platformIcons[productDetails.selectedPlatform]}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Choose content type for {productDetails.selectedPlatform}{" "}
                      *
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {availablePlatforms[productDetails.selectedPlatform].map(
                      (mediaType) => (
                        <motion.button
                          key={mediaType}
                          type="button"
                          className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                            productDetails.mediaType === mediaType
                              ? "bg-blue-600 text-white shadow-lg ring-4 ring-blue-100"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                          }`}
                          onClick={() =>
                            handleMediaTypeChange(mediaType as MediaType)
                          }
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={isLoading}
                        >
                          {mediaType.charAt(0).toUpperCase() +
                            mediaType.slice(1)}
                        </motion.button>
                      )
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex justify-center items-center py-3 px-8 rounded-xl text-base font-medium text-red-600 border-2 border-red-300 hover:bg-red-50 transition-all duration-200 shadow-sm"
            onClick={handleCancel}
            disabled={isLoading}
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
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Cancel
          </motion.button>

          <div className="flex flex-col sm:flex-row gap-3">
            {currentStep === 1 && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex justify-center items-center py-3 px-8 rounded-xl text-base font-medium text-purple-600 border-2 border-purple-300 hover:bg-purple-50 transition-all duration-200 shadow-sm"
                onClick={() => handleClickMoodBoard()}
                disabled={isLoading}
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
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Generate Moodboard
              </motion.button>
            )}

            <motion.button
              type="button"
              whileHover={
                (currentStep === 0 && !isStep1Valid) ||
                (currentStep === 1 && !isStep2Valid) ||
                isLoading
                  ? {}
                  : { scale: 1.02 }
              }
              whileTap={
                (currentStep === 0 && !isStep1Valid) ||
                (currentStep === 1 && !isStep2Valid) ||
                isLoading
                  ? {}
                  : { scale: 0.98 }
              }
              className={`flex justify-center items-center py-3 px-8 rounded-xl text-base font-medium transition-all duration-200 shadow-lg ${
                (currentStep === 0 && !isStep1Valid) ||
                (currentStep === 1 && !isStep2Valid) ||
                isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 ring-4 ring-blue-100"
              }`}
              onClick={handleNext}
              disabled={
                (currentStep === 0 && !isStep1Valid) ||
                (currentStep === 1 && !isStep2Valid) ||
                isLoading
              }
            >
              {currentStep === 1 ? (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Generate Content
                </>
              ) : (
                <>
                  Next Step
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}