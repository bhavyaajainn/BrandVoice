'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface MoodBoard {
    colors: {
        name: string;
        hex: string;
    }[];
    typography: {
        name: string;
        category: string;
        example: string;
    }[];
    images: string[];
    textures: string[];
}

export default function MoodBoard() {
    const moodBoard = {
        colors: [
            { name: 'Primary', hex: '#2563EB' },
            { name: 'Secondary', hex: '#4F46E5' },
            { name: 'Accent', hex: '#EC4899' },
            { name: 'Background', hex: '#F9FAFB' },
            { name: 'Text', hex: '#111827' }
        ],
        typography: [
            { name: 'Playfair Display', category: 'Heading', example: 'Experience Luxury' },
            { name: 'Montserrat', category: 'Subheading', example: 'Modern Elegance Defined' },
            { name: 'Inter', category: 'Body', example: 'Clean and contemporary design for the modern audience' }
        ],
        images: [
            '/mood/image1.jpg',
            '/mood/image2.jpg',
            '/mood/image3.jpg',
            '/mood/image4.jpg'
        ],
        textures: [
            '/textures/texture1.jpg',
            '/textures/texture2.jpg',
            '/textures/texture3.jpg'
        ]
    }

    const [isGenerating, setIsGenerating] = useState(false);

    const handleRegenerateMoodBoard = () => {
        setIsGenerating(true);
        // Simulate mood board regeneration
        setTimeout(() => {
            setIsGenerating(false);
        }, 2000);
    };

    const handleDownloadMoodBoard = () => {
        // Handle mood board download logic
        console.log('Downloading mood board...');
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-slate-200 rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-8">Brand Mood Board</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Color Palette */}
                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-slate-800">Color Palette</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {moodBoard.colors.map((color, index) => (
                                    <div key={index} className="p-4 rounded-lg bg-white shadow-sm">
                                        <div
                                            className="w-full h-20 rounded-md mb-2"
                                            style={{ backgroundColor: color.hex }}
                                        />
                                        <div className="space-y-1">
                                            <p className="font-medium text-slate-800">{color.name}</p>
                                            <p className="text-sm text-slate-600">{color.hex}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Typography */}
                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-slate-800">Typography</h2>
                            <div className="space-y-4">
                                {moodBoard.typography.map((font, index) => (
                                    <div key={index} className="p-4 rounded-lg bg-white shadow-sm">
                                        <p className="text-sm text-slate-600 mb-2">{font.category}</p>
                                        <p className="font-medium text-slate-800 mb-1">{font.name}</p>
                                        <p
                                            className="text-lg"
                                            style={{ fontFamily: font.name.split(',')[0] }}
                                        >
                                            {font.example}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Inspiration Images */}
                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-slate-800">Inspiration Images</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {moodBoard.images.map((image, index) => (
                                    <div key={index} className="aspect-square relative rounded-lg overflow-hidden bg-white shadow-sm">
                                        <Image
                                            src={image}
                                            alt={`Inspiration ${index + 1}`}
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Textures */}
                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-slate-800">Textures</h2>
                            <div className="grid grid-cols-3 gap-3">
                                {moodBoard.textures.map((texture, index) => (
                                    <div key={index} className="aspect-square relative rounded-lg overflow-hidden bg-white shadow-sm">
                                        <Image
                                            src={texture}
                                            alt={`Texture ${index + 1}`}
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 