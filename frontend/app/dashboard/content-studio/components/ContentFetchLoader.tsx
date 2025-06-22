"use client";

import React from "react";
import { motion } from "framer-motion";

interface ContentFetchLoaderProps {
  message?: string;
}

const ContentFetchLoader: React.FC<ContentFetchLoaderProps> = ({ 
  message = "Loading content..." 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg z-40 flex flex-col items-center justify-center"
    >
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-base text-slate-700 font-medium mb-2">
          {message}
        </p>
        <p className="text-sm text-slate-500 text-center">
          Please wait a moment...
        </p>
      </div>
    </motion.div>
  );
};

export default ContentFetchLoader;