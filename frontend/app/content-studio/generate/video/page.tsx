'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface VideoScript {
    title: string;
    scenes: {
        description: string;
        duration: number;
        voiceOver: string;
    }[];
}

interface VideoDetails {
    description: string;
    style: string;
    duration: string;
    format: string;
}

export default function VideoGeneration() {
    const [videoDetails, setVideoDetails] = useState<VideoDetails>({
        description: '',
        style: 'modern',
        duration: '30',
        format: 'landscape'
    });

    const [generatedScript, setGeneratedScript] = useState<VideoScript | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    const handleGenerateScript = async () => {
        setIsGenerating(true);
        // Simulate script generation
        setTimeout(() => {
            setGeneratedScript({
                title: "Premium Product Showcase",
                scenes: [
                    {
                        description: "Opening shot of the product with dynamic lighting",
                        duration: 5,
                        voiceOver: "Introducing our premium collection..."
                    },
                    {
                        description: "Close-up of product details and craftsmanship",
                        duration: 8,
                        voiceOver: "Crafted with precision and care..."
                    },
                    {
                        description: "Lifestyle shots showing product in use",
                        duration: 12,
                        voiceOver: "Experience luxury in every moment..."
                    },
                    {
                        description: "Final product showcase with call-to-action",
                        duration: 5,
                        voiceOver: "Elevate your lifestyle today."
                    }
                ]
            });
            setIsGenerating(false);
        }, 2000);
    };

    const handleGenerateVideo = async () => {
        // Video generation logic would go here
        setVideoUrl('/sample-video.mp4');
    };

    const handleScriptUpdate = (index: number, field: string, value: string) => {
        if (!generatedScript) return;

        const updatedScenes = [...generatedScript.scenes];
        updatedScenes[index] = {
            ...updatedScenes[index],
            [field]: field === 'duration' ? Number(value) : value
        };

        setGeneratedScript({
            ...generatedScript,
            scenes: updatedScenes
        });
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-slate-200 rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-8">Generate Video</h1>
                    
                    <form className="space-y-6">
                        {/* Video Details */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Video Description
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Describe your video concept..."
                                className="w-full rounded-xl border bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={videoDetails.description}
                                onChange={(e) => setVideoDetails(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Style
                                </label>
                                <select
                                    className="w-full rounded-lg border bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={videoDetails.style}
                                    onChange={(e) => setVideoDetails(prev => ({ ...prev, style: e.target.value }))}
                                >
                                    <option value="modern">Modern</option>
                                    <option value="classic">Classic</option>
                                    <option value="minimalist">Minimalist</option>
                                    <option value="dynamic">Dynamic</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Duration
                                </label>
                                <select
                                    className="w-full rounded-lg border bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={videoDetails.duration}
                                    onChange={(e) => setVideoDetails(prev => ({ ...prev, duration: e.target.value }))}
                                >
                                    <option value="15">15 seconds</option>
                                    <option value="30">30 seconds</option>
                                    <option value="60">1 minute</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Format
                                </label>
                                <select
                                    className="w-full rounded-lg border bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={videoDetails.format}
                                    onChange={(e) => setVideoDetails(prev => ({ ...prev, format: e.target.value }))}
                                >
                                    <option value="landscape">Landscape (16:9)</option>
                                    <option value="square">Square (1:1)</option>
                                    <option value="portrait">Portrait (9:16)</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 rounded-xl shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                            >
                                Generate Video
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 