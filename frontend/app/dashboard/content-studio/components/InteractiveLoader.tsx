"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ContentGenerationLoaderProps {
  onComplete: () => void;
  duration?: number;
  isLoading: boolean;
}

const ContentGenerationLoader: React.FC<ContentGenerationLoaderProps> = ({ 
  onComplete, 
  duration = 30000,
  isLoading 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showFinalLoader, setShowFinalLoader] = useState(false);

  const steps = [
    { number: "01", title: "Analyzing your product", description: "Understanding your product details and target audience" },
    { number: "02", title: "Generating creative concepts", description: "Creating unique ideas tailored to your platform" },
    { number: "03", title: "Optimizing for engagement", description: "Fine-tuning content for maximum impact" },
    { number: "04", title: "Preparing final content", description: "Putting the finishing touches on your content" },
  ];

  useEffect(() => {
    if (!isLoading && progress >= 100) {
      setTimeout(() => {
        onComplete();
      }, 1000);
      return;
    }

    const stepDuration = duration / steps.length;

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          if (!isLoading) {
            setShowFinalLoader(true);
          }
          return prev;
        }
      });
    }, stepDuration);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (isLoading) {
          // While loading, progress gradually to 95%
          const targetProgress = Math.min(95, (currentStep / (steps.length - 1)) * 95);
          if (prev < targetProgress) {
            return Math.min(prev + 1, targetProgress);
          }
          return prev;
        } else {
          // When loading is complete, quickly go to 100%
          if (prev < 100) {
            return Math.min(prev + 5, 100);
          }
          return prev;
        }
      });
    }, 200);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [duration, onComplete, steps.length, currentStep, isLoading, progress]);

  // Show final loader when all steps are complete
  useEffect(() => {
    if (currentStep >= steps.length - 1 && !isLoading && !showFinalLoader) {
      setShowFinalLoader(true);
    }
  }, [currentStep, isLoading, showFinalLoader, steps.length]);

  if (showFinalLoader || (!isLoading && progress >= 100)) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl z-50 flex flex-col items-center justify-center"
      >
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center max-w-md">
          <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
          <p className="text-xl text-slate-700 font-semibold mb-2">
            Content Ready!
          </p>
          <p className="text-sm text-slate-500 text-center">
            Redirecting you now...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: "95%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-gradient-to-br from-blue-50/95 to-purple-50/95 backdrop-blur-sm rounded-2xl z-50 flex flex-col items-center justify-center p-8"
    >
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-lg w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Creating Your Content
          </h2>
          <p className="text-slate-600">
            We're crafting the perfect content for your platform
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-slate-600">Progress</span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={`flex items-start space-x-4 p-4 rounded-xl transition-all duration-500 ${
                index === currentStep
                  ? "bg-blue-50 border-2 border-blue-200"
                  : index < currentStep
                  ? "bg-green-50 border-2 border-green-200"
                  : "bg-gray-50 border-2 border-gray-200"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                  index === currentStep
                    ? "bg-blue-500 text-white animate-pulse"
                    : index < currentStep
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {index < currentStep ? (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </motion.svg>
                ) : (
                  step.number
                )}
              </div>
              <div className="flex-grow">
                <h3
                  className={`font-semibold transition-all duration-500 ${
                    index === currentStep
                      ? "text-blue-700"
                      : index < currentStep
                      ? "text-green-700"
                      : "text-gray-600"
                  }`}
                >
                  {step.title}
                  {index === currentStep && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="ml-2"
                    >
                      ...
                    </motion.span>
                  )}
                </h3>
                <p
                  className={`text-sm transition-all duration-500 ${
                    index === currentStep
                      ? "text-blue-600"
                      : index < currentStep
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center space-x-2">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-blue-400 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
          <span className="text-sm text-slate-500 ml-3">
            This usually takes 20-30 seconds
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentGenerationLoader;