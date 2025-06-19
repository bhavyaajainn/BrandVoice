"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import {
  createPlatformInformationRequest,
  createProductInformationRequest,
  getProductInformationRequest,
} from "@/lib/redux/actions/contentStudioActions";
import { ProductDetailsProps, Platform, MediaType } from "../types";
import { platformIcons } from "../components/PlatformIcons";
import { platformData, Step, Stepper } from "./ProductDetailshelper";
import { useAuthContext } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";

export default function ProductDetails({ navigate }: ProductDetailsProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: productData } = useAppSelector((state) => state.product);
  const { data: platformInfoData } = useAppSelector((state) => state.platform);
  const [currentStep, setCurrentStep] = useState(0);
  const [productDetails, setProductDetails] = useState<{
    description: string;
    productName: string;
    selectedPlatform: Platform | null;
    mediaType: MediaType | null;
  }>({
    description: "",
    productName: "",
    selectedPlatform: null,
    mediaType: null,
  });
  const { user } = useAuthContext();
  const handleNext = () => {
    if (currentStep === 0) {
      if (
        !productDetails.productName.trim() ||
        !productDetails.description.trim()
      ) {
        alert("Please fill in both product name and description");
        return;
      } else {
        dispatch(
          createProductInformationRequest({
            brand_id: user?.uid,
            product: {
              product_name: productDetails.productName,
              description: productDetails.description,
            },
          })
        );
      }
    }
    if (currentStep < 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
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

  const handleCancel = () => {
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
    productDetails.productName.trim() && productDetails.description.trim();
  const isStep2Valid =
    productDetails.selectedPlatform && productDetails.mediaType;

  return (
    <div className="bg-slate-50/95 backdrop-blur-sm rounded-2xl p-8 shadow-sm max-w-4xl mx-auto">
      <div className="p-4 sm:p-6">
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
                />
                <p className="text-sm text-slate-500 mt-3">
                  💡 The more details you provide, the better we can tailor your
                  content
                </p>
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
                  {(Object.keys(platformData) as Platform[]).map((platform) => (
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
                    {platformData[productDetails.selectedPlatform].map(
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
                onClick={() => navigate("moodboard")}
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
                (currentStep === 1 && !isStep2Valid)
                  ? {}
                  : { scale: 1.02 }
              }
              whileTap={
                (currentStep === 0 && !isStep1Valid) ||
                (currentStep === 1 && !isStep2Valid)
                  ? {}
                  : { scale: 0.98 }
              }
              className={`flex justify-center items-center py-3 px-8 rounded-xl text-base font-medium transition-all duration-200 shadow-lg ${
                (currentStep === 0 && !isStep1Valid) ||
                (currentStep === 1 && !isStep2Valid)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 ring-4 ring-blue-100"
              }`}
              onClick={handleNext}
              disabled={
                (currentStep === 0 && !isStep1Valid) ||
                (currentStep === 1 && !isStep2Valid)
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
