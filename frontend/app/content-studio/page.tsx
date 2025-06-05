'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function ContentStudio() {
    const [showInitialLayout, setShowInitialLayout] = useState(true);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [iconSize, setIconSize] = useState(24);
    const [preferences, setPreferences] = useState({
        instagram: false,
        facebook: false,
        twitter: false,
        linkedin: false
    });

    useEffect(() => {
        const handleResize = () => {
            setIconSize(window.innerWidth < 640 ? 16 : 24);
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const faqs = [
        {
            question: "How does the content generation work?",
            answer: "Our AI analyzes your brand preferences and creates tailored content that matches your style and tone while maintaining brand consistency."
        },
        {
            question: "Can I edit the generated content?",
            answer: "Yes, all generated content is fully editable. You can modify text, images, and video scripts to perfectly match your needs."
        },
        {
            question: "What formats are supported?",
            answer: "We support various content formats including images, videos, and text posts optimized for different social media platforms."
        }
    ];

    const handlePreferenceChange = (platform: keyof typeof preferences) => {
        setPreferences(prev => ({
            ...prev,
            [platform]: !prev[platform]
        }));
    };

    const handleSavePreferences = () => {
        // Save preferences logic here
        console.log('Saving preferences:', preferences);
    };

    return (
        <div className="space-y-2 sm:space-y-4 px-4 sm:px-8 md:px-12 bg-white backdrop-blur-sm rounded-2xl p-8 w-full max-w-7xl mx-auto pr-4 sm:pr-6">
            <section className="text-center w-full">
                <h1 className="text-2xl sm:text-4xl font-bold text-slate-800 mb-1 sm:mb-4">Content Studio</h1>
                <p className="text-sm sm:text-lg text-slate-600 max-w-3xl mx-auto w-full">
                    Your AI-powered creative companion for generating engaging content across all platforms
                </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-6 w-full">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-sm p-2 sm:p-8 w-full">
                    <h2 className="text-lg sm:text-2xl font-semibold text-slate-800 mb-2 sm:mb-4">What is Content Studio?</h2>
                    <p className="text-sm sm:text-lg text-slate-600">
                        Content Studio is your all-in-one content creation platform that helps you create
                        stunning visuals, engaging copy, and professional videos. Powered by AI, it understands
                        your brand and delivers content that resonates with your audience.
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-sm p-2 sm:p-8 w-full">
                    <h2 className="text-lg sm:text-2xl font-semibold text-slate-800 mb-2 sm:mb-4">Basic Preferences</h2>
                    <div className="flex flex-col sm:flex-row justify-between items-stretch w-full gap-2 sm:gap-6">
                        <div className="flex flex-col gap-2 sm:gap-6 sm:w-1/2">
                            <div className="flex items-center">
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        id="instagram" 
                                        checked={preferences.instagram}
                                        onChange={() => handlePreferenceChange('instagram')}
                                        className="w-4 sm:w-6 h-4 sm:h-6 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor="instagram" className="ml-2 sm:ml-4 flex items-center text-slate-700 text-sm sm:text-lg">
                                        <span className="mr-1 sm:mr-3 text-pink-600">
                                            <FaInstagram size={iconSize} />
                                        </span>
                                        Instagram
                                    </label>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        id="twitter" 
                                        checked={preferences.twitter}
                                        onChange={() => handlePreferenceChange('twitter')}
                                        className="w-4 sm:w-6 h-4 sm:h-6 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor="twitter" className="ml-2 sm:ml-4 flex items-center text-slate-700 text-sm sm:text-lg">
                                        <span className="mr-1 sm:mr-3 text-blue-400">
                                            <FaTwitter size={iconSize} />
                                        </span>
                                        Twitter
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 sm:gap-6 sm:w-1/2">
                            <div className="flex items-center">
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        id="facebook" 
                                        checked={preferences.facebook}
                                        onChange={() => handlePreferenceChange('facebook')}
                                        className="w-4 sm:w-6 h-4 sm:h-6 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor="facebook" className="ml-2 sm:ml-4 flex items-center text-slate-700 text-sm sm:text-lg">
                                        <span className="mr-1 sm:mr-3 text-blue-600">
                                            <FaFacebook size={iconSize} />
                                        </span>
                                        Facebook
                                    </label>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        id="linkedin" 
                                        checked={preferences.linkedin}
                                        onChange={() => handlePreferenceChange('linkedin')}
                                        className="w-4 sm:w-6 h-4 sm:h-6 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor="linkedin" className="ml-2 sm:ml-4 flex items-center text-slate-700 text-sm sm:text-lg">
                                        <span className="mr-1 sm:mr-3 text-blue-700">
                                            <FaLinkedin size={iconSize} />
                                        </span>
                                        LinkedIn
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
                <Link 
                    href="/content-studio/create"
                    className="inline-flex items-center px-4 sm:px-8 py-1.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-lg font-semibold rounded-md sm:rounded-lg hover:bg-blue-700 transition-colors shadow-sm sm:shadow-lg"
                >
                    Get Started
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 ml-1.5 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>
        </div>
    );
} 