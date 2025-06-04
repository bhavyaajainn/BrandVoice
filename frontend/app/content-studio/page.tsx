'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ContentStudio() {
    const showInitialLayout = true;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {showInitialLayout ? (
                <main className="max-w-7xl mx-auto py-12 px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-12"
                    >
                        <section className="text-center">
                            <h1 className="text-5xl font-bold text-gray-900 mb-6">Content Studio</h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Your AI-powered creative companion for generating engaging content across all platforms
                            </p>
                        </section>

                        <section className="grid md:grid-cols-2 gap-8 mt-12">
                            <div className="bg-white rounded-xl shadow-sm p-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">What is Designer&apos;s Hub?</h2>
                                <p className="text-gray-600">
                                    Designer&apos;s Hub is your all-in-one content creation platform that helps you create
                                    stunning visuals, engaging copy, and professional videos. Powered by AI, it understands
                                    your brand and delivers content that resonates with your audience.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Basic Preferences</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <input type="checkbox" id="instagram" className="rounded text-blue-600" />
                                        <label htmlFor="instagram">Instagram</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="checkbox" id="facebook" className="rounded text-blue-600" />
                                        <label htmlFor="facebook">Facebook</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="checkbox" id="twitter" className="rounded text-blue-600" />
                                        <label htmlFor="twitter">Twitter</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="checkbox" id="linkedin" className="rounded text-blue-600" />
                                        <label htmlFor="linkedin">LinkedIn</label>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-xl shadow-sm p-8 mt-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">FAQs</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">How does the content generation work?</h3>
                                    <p className="text-gray-600 mt-2">Our AI analyzes your brand preferences and creates tailored content that matches your style and tone while maintaining brand consistency.</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Can I edit the generated content?</h3>
                                    <p className="text-gray-600 mt-2">Yes, all generated content is fully editable. You can modify text, images, and video scripts to perfectly match your needs.</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">What formats are supported?</h3>
                                    <p className="text-gray-600 mt-2">We support various content formats including images, videos, and text posts optimized for different social media platforms.</p>
                                </div>
                            </div>
                        </section>

                        <div className="text-center mt-12">
                            <Link 
                                href="/content-studio/create"
                                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Get Started
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </motion.div>
                </main>
            ) : null}
        </div>
    );
} 