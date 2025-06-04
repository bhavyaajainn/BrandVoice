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

export default function VideoGeneration() {
    const [videoDetails, setVideoDetails] = useState({
        description: '',
        style: 'modern',
        duration: '30',
        tone: 'professional'
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
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto"
            >
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Video Generation</h1>

                    {!generatedScript ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Video Description
                                </label>
                                <textarea
                                    rows={4}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Describe the video you want to create..."
                                    value={videoDetails.description}
                                    onChange={(e) => setVideoDetails(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Style
                                    </label>
                                    <select
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Duration (seconds)
                                    </label>
                                    <select
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={videoDetails.duration}
                                        onChange={(e) => setVideoDetails(prev => ({ ...prev, duration: e.target.value }))}
                                    >
                                        <option value="15">15 seconds</option>
                                        <option value="30">30 seconds</option>
                                        <option value="60">60 seconds</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tone
                                    </label>
                                    <select
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={videoDetails.tone}
                                        onChange={(e) => setVideoDetails(prev => ({ ...prev, tone: e.target.value }))}
                                    >
                                        <option value="professional">Professional</option>
                                        <option value="casual">Casual</option>
                                        <option value="energetic">Energetic</option>
                                        <option value="luxury">Luxury</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleGenerateScript}
                                    disabled={isGenerating}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    {isGenerating ? 'Generating Script...' : 'Generate Video Script'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{generatedScript.title}</h2>
                                <div className="space-y-6">
                                    {generatedScript.scenes.map((scene, index) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Scene {index + 1} Description
                                                </label>
                                                <textarea
                                                    rows={2}
                                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    value={scene.description}
                                                    onChange={(e) => handleScriptUpdate(index, 'description', e.target.value)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Duration (seconds)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        value={scene.duration}
                                                        onChange={(e) => handleScriptUpdate(index, 'duration', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Voice Over
                                                    </label>
                                                    <textarea
                                                        rows={2}
                                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        value={scene.voiceOver}
                                                        onChange={(e) => handleScriptUpdate(index, 'voiceOver', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {videoUrl ? (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">Generated Video</h3>
                                    <video
                                        controls
                                        className="w-full rounded-lg shadow-sm"
                                        src={videoUrl}
                                    />
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            onClick={() => setVideoUrl(null)}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Regenerate Video
                                        </button>
                                        <button
                                            onClick={() => {/* Handle download */}}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            Download Video
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => setGeneratedScript(null)}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Start Over
                                    </button>
                                    <button
                                        onClick={handleGenerateVideo}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        Generate Video
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
} 