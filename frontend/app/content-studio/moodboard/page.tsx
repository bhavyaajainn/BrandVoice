'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { EffectCoverflow, Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ArrowDownTrayIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useRouter } from 'next/navigation';

const moodboardImages = [
    {
        url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45',
        title: 'Modern Minimalist'
    },
    {
        url: 'https://images.unsplash.com/photo-1463320726281-696a485928c7',
        title: 'Natural Elegance'
    },
    {
        url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411',
        title: 'Organic Design'
    },
    {
        url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36',
        title: 'Contemporary Green'
    },
    {
        url: 'https://images.unsplash.com/photo-1505066211281-ed125c006f4c',
        title: 'Botanical Luxury'
    }
];

const colorPalette = [
    { name: 'Primary', hex: '#174D7C' },
    { name: 'Secondary', hex: '#4C7D8E' },
    { name: 'Text', hex: '#1F2937' },
    { name: 'Subtext', hex: '#6B7280' },
    { name: 'Accent', hex: '#3B82F6' },
    { name: 'Success', hex: '#10B981' },
    { name: 'Warning', hex: '#F59E0B' },
    { name: 'Error', hex: '#EF4444' }
];

const typographyStyles = [
    {
        category: 'Headings',
        styles: [
            { name: 'H1', font: 'Playfair Display', size: '36px', weight: '700', lineHeight: '1.2' },
            { name: 'H2', font: 'Playfair Display', size: '30px', weight: '700', lineHeight: '1.3' },
            { name: 'H3', font: 'Playfair Display', size: '24px', weight: '600', lineHeight: '1.4' }
        ]
    },
    {
        category: 'Body',
        styles: [
            { name: 'Large', font: 'Inter', size: '18px', weight: '400', lineHeight: '1.6' },
            { name: 'Regular', font: 'Inter', size: '16px', weight: '400', lineHeight: '1.5' },
            { name: 'Small', font: 'Inter', size: '14px', weight: '400', lineHeight: '1.5' }
        ]
    },
    {
        category: 'UI Elements',
        styles: [
            { name: 'Button', font: 'Montserrat', size: '16px', weight: '600', lineHeight: '1' },
            { name: 'Caption', font: 'Inter', size: '12px', weight: '400', lineHeight: '1.4' },
            { name: 'Label', font: 'Inter', size: '14px', weight: '500', lineHeight: '1' }
        ]
    }
];

export default function MoodBoard() {
    const router = useRouter();
    const [hoveredColor, setHoveredColor] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const generateColorPaletteText = () => {
        return colorPalette.map(color => 
            `${color.name}: ${color.hex}`
        ).join('\n');
    };

    const generateTypographyText = () => {
        return typographyStyles.map(category => {
            const styles = category.styles.map(style =>
                `${style.name}:\n` +
                `  Font: ${style.font}\n` +
                `  Size: ${style.size}\n` +
                `  Weight: ${style.weight}\n` +
                `  Line Height: ${style.lineHeight}\n`
            ).join('\n');
            return `${category.category}:\n${styles}`;
        }).join('\n\n');
    };

    const downloadAssets = async () => {
        try {
            setIsDownloading(true);
            const zip = new JSZip();

            // Add color palette information
            zip.file('color-palette.txt', generateColorPaletteText());

            // Add typography information
            zip.file('typography.txt', generateTypographyText());

            // Create images folder
            const imagesFolder = zip.folder('images');
            
            // Download and add images to zip
            const imagePromises = moodboardImages.map(async (image, index) => {
                try {
                    const response = await fetch(image.url);
                    const blob = await response.blob();
                    const fileName = `image-${index + 1}${image.url.match(/\.[^.]*$/)?.[0] || '.jpg'}`;
                    imagesFolder?.file(fileName, blob);
                } catch (error) {
                    console.error(`Failed to download image: ${image.url}`, error);
                }
            });

            await Promise.all(imagePromises);

            // Generate and download zip file
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, 'brand-assets.zip');
        } catch (error) {
            console.error('Failed to create zip file:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 lg:mb-10">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 leading-tight">
                        Brand Mood Board
                    </h1>
                    <button
                        onClick={downloadAssets}
                        disabled={isDownloading}
                        className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg bg-slate-800 text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Download Assets</span>
                        {isDownloading && (
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                    </button>
                </div>
                
                <div className="space-y-6 sm:space-y-8 lg:space-y-10">
                    {/* Image Carousel Section */}
                    <section>
                        <div className="relative h-[250px] sm:h-[350px] lg:h-[450px] rounded-lg sm:rounded-xl overflow-hidden bg-slate-100">
                            <Swiper
                                modules={[EffectCoverflow, Autoplay, Navigation, Pagination]}
                                effect="coverflow"
                                grabCursor={true}
                                centeredSlides={true}
                                slidesPerView={2}
                                coverflowEffect={{
                                    rotate: 50,
                                    stretch: 0,
                                    depth: 100,
                                    modifier: 1,
                                    slideShadows: true,
                                }}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true
                                }}
                                navigation={{
                                    prevEl: '.swiper-button-prev',
                                    nextEl: '.swiper-button-next',
                                }}
                                pagination={{ 
                                    clickable: true,
                                    dynamicBullets: true,
                                }}
                                loop={true}
                                speed={600}
                                className="h-full w-full"
                            >
                                {moodboardImages.map((image, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="relative h-full w-full">
                                            <img
                                                src={image.url}
                                                alt={image.title}
                                                className="w-full h-full object-cover rounded-lg"
                                                loading="eager"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                                                <div className="p-4 sm:p-6">
                                                    <h3 className="text-base sm:text-xl lg:text-2xl font-semibold text-white">{image.title}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <button className="swiper-button-prev absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 rounded-full p-1 sm:p-2 transition-all hover:scale-110 !w-8 !h-8 sm:!w-10 sm:!h-10 bg-white/80 backdrop-blur-sm after:!hidden">
                                <ChevronLeftIcon className="w-6 h-6 sm:w-8 sm:h-8 text-slate-700" />
                            </button>
                            <button className="swiper-button-next absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 rounded-full p-1 sm:p-2 transition-all hover:scale-110 !w-8 !h-8 sm:!w-10 sm:!h-10 bg-white/80 backdrop-blur-sm after:!hidden">
                                <ChevronRightIcon className="w-6 h-6 sm:w-8 sm:h-8 text-slate-700" />
                            </button>
                        </div>
                    </section>

                    {/* Color Palette Section */}
                    <section>
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-slate-800">Color Palette</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
                            {colorPalette.map((color) => (
                                <div 
                                    key={color.name}
                                    className="relative group aspect-square sm:aspect-auto sm:h-32 lg:h-40"
                                    onMouseEnter={() => setHoveredColor(color.hex)}
                                    onMouseLeave={() => setHoveredColor(null)}
                                >
                                    <div 
                                        className="h-full rounded-lg transition-transform duration-200 group-hover:scale-105 shadow-sm"
                                        style={{ backgroundColor: color.hex }}
                                    >
                                        {hoveredColor === color.hex && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                                                <p className="text-white font-mono text-xs sm:text-sm">{color.hex}</p>
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 bg-white/90 backdrop-blur-sm rounded-b-lg">
                                            <p className="text-xs sm:text-sm font-medium truncate text-center">{color.name}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Typography Section */}
                    <section>
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-slate-800">Typography</h2>
                        <div className="overflow-x-auto -mx-3 sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full align-middle">
                                <div className="overflow-hidden border border-slate-200 rounded-lg bg-white shadow-sm">
                                    <table className="min-w-full divide-y divide-slate-200">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs sm:text-sm font-semibold text-slate-900">Category</th>
                                                <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-slate-900">Style</th>
                                                <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-slate-900">Font</th>
                                                <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-slate-900">Size</th>
                                                <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-slate-900">Weight</th>
                                                <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-slate-900">Line Height</th>
                                                <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-slate-900">Preview</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 bg-white">
                                            {typographyStyles.map((category) => (
                                                category.styles.map((style, styleIndex) => (
                                                    <tr 
                                                        key={`${category.category}-${style.name}`}
                                                        className={styleIndex === 0 ? 'bg-slate-50/50' : ''}
                                                    >
                                                        {styleIndex === 0 && (
                                                            <td 
                                                                className="py-3 pl-4 pr-3 text-xs sm:text-sm font-medium text-slate-900"
                                                                rowSpan={category.styles.length}
                                                            >
                                                                {category.category}
                                                            </td>
                                                        )}
                                                        <td className="whitespace-nowrap px-3 py-3 text-xs sm:text-sm text-slate-900">{style.name}</td>
                                                        <td className="whitespace-nowrap px-3 py-3 text-xs sm:text-sm text-slate-600 font-mono">{style.font}</td>
                                                        <td className="whitespace-nowrap px-3 py-3 text-xs sm:text-sm text-slate-600">{style.size}</td>
                                                        <td className="whitespace-nowrap px-3 py-3 text-xs sm:text-sm text-slate-600">{style.weight}</td>
                                                        <td className="whitespace-nowrap px-3 py-3 text-xs sm:text-sm text-slate-600">{style.lineHeight}</td>
                                                        <td className="px-3 py-3 min-w-[200px]">
                                                            <p 
                                                                className="text-slate-900"
                                                                style={{
                                                                    fontFamily: style.font,
                                                                    fontSize: style.size,
                                                                    fontWeight: style.weight,
                                                                    lineHeight: style.lineHeight
                                                                }}
                                                            >
                                                                Brand Voice
                                                            </p>
                                                        </td>
                                                    </tr>
                                                ))
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-4 sm:pt-6">
                        <button
                            type="button"
                            className="flex justify-center items-center py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200 group"
                            onClick={() => {
                                console.log('Navigating to generate content...');
                                router.push('/content-studio/generate-content');
                            }}
                        >
                            Continue generating
                            <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                        </button>
                        <button
                            type="button"
                            className="flex justify-center items-center py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            Finish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 