'use client';

import React, { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface ContentForm {
    prompt: string;
    tone: string;
    platform: string;
    contentType: string;
}

export default function GenerateContent() {
    const router = useRouter();
    const [isGenerating, setIsGenerating] = useState(false);
    const [form, setForm] = useState<ContentForm>({
        prompt: '',
        tone: 'Professional',
        platform: 'Instagram',
        contentType: 'Post'
    });

    console.log('Generate Content Page Rendered');

    const toneOptions = [
        'Professional', 'Casual', 'Friendly', 'Formal', 
        'Humorous', 'Inspirational', 'Educational'
    ];

    const platformOptions = [
        'Instagram', 'Twitter', 'LinkedIn', 'Facebook', 
        'TikTok', 'Blog', 'Email'
    ];

    const contentTypeOptions = [
        'Post', 'Caption', 'Article', 'Story', 
        'Thread', 'Newsletter', 'Ad Copy'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);
        // Add your content generation logic here
        setTimeout(() => {
            setIsGenerating(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5 text-slate-600" />
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Generate Content</h1>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Prompt Input */}
                    <div>
                        <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 mb-2">
                            What would you like to create?
                        </label>
                        <textarea
                            id="prompt"
                            rows={4}
                            className="w-full rounded-lg border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-none"
                            placeholder="Describe what you want to create..."
                            value={form.prompt}
                            onChange={(e) => setForm({ ...form, prompt: e.target.value })}
                            required
                        />
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {/* Tone Selection */}
                        <div>
                            <label htmlFor="tone" className="block text-sm font-medium text-slate-700 mb-2">
                                Tone
                            </label>
                            <select
                                id="tone"
                                className="w-full rounded-lg border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={form.tone}
                                onChange={(e) => setForm({ ...form, tone: e.target.value })}
                            >
                                {toneOptions.map((tone) => (
                                    <option key={tone} value={tone}>{tone}</option>
                                ))}
                            </select>
                        </div>

                        {/* Platform Selection */}
                        <div>
                            <label htmlFor="platform" className="block text-sm font-medium text-slate-700 mb-2">
                                Platform
                            </label>
                            <select
                                id="platform"
                                className="w-full rounded-lg border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={form.platform}
                                onChange={(e) => setForm({ ...form, platform: e.target.value })}
                            >
                                {platformOptions.map((platform) => (
                                    <option key={platform} value={platform}>{platform}</option>
                                ))}
                            </select>
                        </div>

                        {/* Content Type Selection */}
                        <div>
                            <label htmlFor="contentType" className="block text-sm font-medium text-slate-700 mb-2">
                                Content Type
                            </label>
                            <select
                                id="contentType"
                                className="w-full rounded-lg border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={form.contentType}
                                onChange={(e) => setForm({ ...form, contentType: e.target.value })}
                            >
                                {contentTypeOptions.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isGenerating}
                            className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </>
                            ) : (
                                'Generate Content'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 