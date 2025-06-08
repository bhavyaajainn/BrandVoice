'use client';

import React, { useState, useEffect } from 'react';
import { FaImage, FaVideo, FaFileAlt, FaHashtag } from 'react-icons/fa';

export interface GetStartedProps {
    navigate: (page: string) => void;
}

const faqs = [
    {
        question: "What is Content Library?",
        answer: "Content Library is your centralized hub for managing and organizing all your digital content. It provides an intuitive interface to store, categorize, and access your media files, documents, and social media content."
    },
    {
        question: "How do I organize my content?",
        answer: "You can organize content using tags, folders, and custom categories. Our smart AI-powered system also helps automatically categorize content based on type and context."
    },
    {
        question: "Can I share content with my team?",
        answer: "Yes! Content Library supports team collaboration. You can share specific content or entire folders with team members and set appropriate access permissions."
    },
    {
        question: "What file types are supported?",
        answer: "We support a wide range of file types including images (JPG, PNG, GIF), videos (MP4, MOV), documents (PDF, DOC), and social media content formats."
    }
];

export default function GetStarted({ navigate }: GetStartedProps) {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [iconSize, setIconSize] = useState(24);
    const [preferences, setPreferences] = useState({
        images: false,
        videos: false,
        documents: false,
        hashtags: false
    });

    useEffect(() => {
        const handleResize = () => {
            setIconSize(window.innerWidth < 640 ? 16 : 24);
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handlePreferenceChange = (type: keyof typeof preferences) => {
        setPreferences(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const handleSavePreferences = () => {
        // Implementation for saving preferences
    };

    return (
        <div className="space-y-2 sm:space-y-4 px-4 sm:px-8 md:px-12 bg-white backdrop-blur-sm rounded-2xl p-8 w-full max-w-7xl mx-auto pr-4 sm:pr-6">
            <section className="text-center w-full">
                <h1 className="text-2xl sm:text-4xl font-bold text-slate-800 mb-1 sm:mb-4">Content Library</h1>
                <p className="text-sm sm:text-lg text-slate-600 max-w-3xl mx-auto w-full">
                    Your centralized hub for managing, organizing, and accessing all your digital content
                </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-6 w-full">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-sm p-2 sm:p-8 w-full">
                    <h2 className="text-lg sm:text-2xl font-semibold text-slate-800 mb-2 sm:mb-4">What is Content Library?</h2>
                    <p className="text-sm sm:text-lg text-slate-600">
                        Content Library is your intelligent content management system that helps you organize,
                        store, and retrieve your digital assets efficiently. With AI-powered categorization
                        and smart search features, finding and managing your content has never been easier.
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-sm p-2 sm:p-8 w-full">
                    <h2 className="text-lg sm:text-2xl font-semibold text-slate-800 mb-2 sm:mb-4">Content Preferences</h2>
                    <div className="flex flex-col sm:flex-row justify-between items-stretch w-full gap-2 sm:gap-6">
                        <div className="flex flex-col gap-2 sm:gap-6 sm:w-1/2">
                            <div className="flex items-center">
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        id="images" 
                                        checked={preferences.images}
                                        onChange={() => handlePreferenceChange('images')}
                                        className="w-4 sm:w-6 h-4 sm:h-6 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor="images" className="ml-2 sm:ml-4 flex items-center text-slate-700 text-sm sm:text-lg">
                                        <span className="mr-1 sm:mr-3 text-green-600">
                                            <FaImage size={iconSize} />
                                        </span>
                                        Images
                                    </label>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        id="videos" 
                                        checked={preferences.videos}
                                        onChange={() => handlePreferenceChange('videos')}
                                        className="w-4 sm:w-6 h-4 sm:h-6 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor="videos" className="ml-2 sm:ml-4 flex items-center text-slate-700 text-sm sm:text-lg">
                                        <span className="mr-1 sm:mr-3 text-red-600">
                                            <FaVideo size={iconSize} />
                                        </span>
                                        Videos
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 sm:gap-6 sm:w-1/2">
                            <div className="flex items-center">
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        id="documents" 
                                        checked={preferences.documents}
                                        onChange={() => handlePreferenceChange('documents')}
                                        className="w-4 sm:w-6 h-4 sm:h-6 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor="documents" className="ml-2 sm:ml-4 flex items-center text-slate-700 text-sm sm:text-lg">
                                        <span className="mr-1 sm:mr-3 text-blue-600">
                                            <FaFileAlt size={iconSize} />
                                        </span>
                                        Documents
                                    </label>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        id="hashtags" 
                                        checked={preferences.hashtags}
                                        onChange={() => handlePreferenceChange('hashtags')}
                                        className="w-4 sm:w-6 h-4 sm:h-6 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor="hashtags" className="ml-2 sm:ml-4 flex items-center text-slate-700 text-sm sm:text-lg">
                                        <span className="mr-1 sm:mr-3 text-purple-600">
                                            <FaHashtag size={iconSize} />
                                        </span>
                                        Hashtags
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-4 sm:mt-8">
                        <button
                            onClick={handleSavePreferences}
                            className="inline-flex px-4 sm:px-8 py-1.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-lg font-semibold rounded-md sm:rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Save Preferences
                        </button>
                    </div>
                </div>
            </section>

            <section className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-sm p-2 sm:p-8 w-full">
                <h2 className="text-lg sm:text-2xl font-semibold text-slate-800 mb-2 sm:mb-6">FAQs</h2>
                <div className="flex flex-col justify-between items-stretch w-full gap-2 sm:gap-6">
                    {faqs.map((faq, index) => (
                        <div 
                            key={index}
                            className="flex flex-col bg-slate-50 rounded-md sm:rounded-lg p-2 sm:p-6 cursor-pointer"
                            onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        >
                            <div className="flex justify-between items-start">
                                <h3 className="text-sm sm:text-lg font-medium text-slate-800 pr-2 sm:pr-4">{faq.question}</h3>
                                <svg 
                                    className={`w-4 h-4 sm:w-6 sm:h-6 transform transition-transform flex-shrink-0 ${expandedFaq === index ? 'rotate-180' : ''}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {expandedFaq === index && (
                                <p className="text-xs sm:text-base text-slate-600 mt-1 sm:mt-3">{faq.answer}</p>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <div className="text-center w-full">
                <button 
                    onClick={() => navigate('library')}
                    className="inline-flex items-center px-4 sm:px-8 py-1.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-lg font-semibold rounded-md sm:rounded-lg hover:bg-blue-700 transition-colors shadow-sm sm:shadow-lg"
                >
                    Get Started
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 ml-1.5 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
} 