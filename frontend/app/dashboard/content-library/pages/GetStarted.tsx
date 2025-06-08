'use client';

import React, { useState } from 'react';
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
        question: "What file types are supported?",
        answer: "We support a wide range of file types including images (JPG, PNG, GIF), videos (MP4, MOV), documents (PDF, DOC), and social media content formats."
    }
];

export default function GetStarted({ navigate }: GetStartedProps) {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    return (
        <div className="space-y-2 sm:space-y-4 px-4 sm:px-8 md:px-12 bg-white backdrop-blur-sm rounded-2xl p-8 w-full max-w-7xl mx-auto pr-4 sm:pr-6">
            <section className="text-center w-full">
                <h1 className="text-2xl sm:text-4xl font-bold text-slate-800 mb-1 sm:mb-4">Content Library</h1>
                <p className="text-sm sm:text-lg text-slate-600 max-w-3xl mx-auto w-full">
                    Your centralized hub for managing, organizing, and accessing all your digital content
                </p>
            </section>

            <section className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-sm p-2 sm:p-8 w-full">
                <h2 className="text-lg sm:text-2xl font-semibold text-slate-800 mb-2 sm:mb-4">What is Content Library?</h2>
                <p className="text-sm sm:text-lg text-slate-600">
                    Content Library is your intelligent content management system that helps you organize,
                    store, and retrieve your digital assets efficiently. With AI-powered categorization
                    and smart search features, finding and managing your content has never been easier.
                </p>
            </section>

            <section className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-sm p-2 sm:p-8 w-full">
                <h2 className="text-lg sm:text-2xl font-semibold text-slate-800 mb-2 sm:mb-6">Frequently Asked Questions</h2>
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