import { AiOutlineEye, AiOutlineFile } from "react-icons/ai";
import { FaRegImage, FaRegPlayCircle, FaRegFileAlt, FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { ContentLibraryItem, ContentPreviewItem } from "./types";
import { FacebookPreview } from "../content-studio/platforms/facebook/FacebookPreview";
import { InstagramPreview } from "../content-studio/platforms/instagram/InstagramPreview";
import { XPreview } from "../content-studio/platforms/X/XPreview";
import { YouTubePreview } from "../content-studio/platforms/youtube/YouTubePreview";

export const mockContent: ContentPreviewItem[] = [
    {
        id: '1',
        originalTitle: 'Summer Collection Launch',
        title: 'Instagram-Summer Collection Launch',
        type: 'image',
        status: 'published',
        platforms: ['instagram'],
        createdAt: '2024-01-15',
        publishedAt: '2024-01-16',
        publishedBy: 'John Doe',
        productCategory: 'Clothing'
    },
    {
        id: '1-fb',
        originalTitle: 'Summer Collection Launch',
        title: 'Facebook-Summer Collection Launch', 
        type: 'image',
        status: 'published',
        platforms: ['facebook'],
        createdAt: '2024-01-15',
        publishedAt: '2024-01-16',
        publishedBy: 'John Doe',
        productCategory: 'Clothing'
    },
    {
        id: '2',
        originalTitle: 'Product Tutorial Video',
        title: 'YouTube-Product Tutorial Video',
        type: 'video',
        status: 'draft',
        platforms: ['youtube'],
        createdAt: '2024-01-14',
        productCategory: 'Software'
    },
    {
        id: '3',
        originalTitle: 'Brand Story Blog Post',
        title: 'Facebook-Brand Story Blog Post',
        type: 'text',
        status: 'published',
        platforms: ['facebook'],
        createdAt: '2024-01-13',
        publishedAt: '2024-01-14',
        publishedBy: 'Jane Smith',
        productCategory: 'Company'
    },
    {
        id: '4',
        originalTitle: 'Product Features Showcase',
        title: 'X-Product Features Showcase',
        type: 'image',
        status: 'draft',
        platforms: ['twitter'],
        createdAt: '2024-01-12',
        productCategory: 'Software'
    }
];

export const sampleAssets = {
    image: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02",
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    gif: "https://media.giphy.com/media/xT9DPIBYf0pAviBLzO/giphy.gif",
    carousel: [
        "https://images.unsplash.com/photo-1470058869958-2a77ade41c02",
        "https://images.unsplash.com/photo-1542728928-0011f81446e5",
        "https://images.unsplash.com/photo-1530968464165-7a1861cbaf9f"
    ]
  };
export const BRAND_NAME = "TechFlow Solutions";


export const getPreviewData = (item: ContentPreviewItem) => {
    const baseData = {
        text: `Check out our amazing ${item.originalTitle}! 🚀 #brand #content`,
        hashtags: ['#brand', '#content', '#amazing'],
        mediaType: item.type === 'text' ? 'image' : item.type,
        mediaUrls: item.type === 'video' ? [sampleAssets.video] : [sampleAssets.image],
        locationId: '',
    };

    const platform = item.platforms[0];
    switch (platform) {
        case 'instagram':
            return {
                ...baseData,
                mentions: ['@brandvoice', '@ai'],
            };
        case 'facebook':
            return {
                ...baseData,
                taggedPages: ['@BrandVoice'],
                privacy: 'Public' as const,
                linkUrl: 'https://brandvoice.ai'
            };
        case 'twitter':
            return {
                ...baseData,
                mentions: ['@brandvoice'],
                poll: undefined,
                quoteTweetId: undefined,
            };
        case 'youtube':
            return {
                ...baseData,
                title: item.originalTitle,
                description: `Learn more about ${item.originalTitle} in this comprehensive guide.`,
                tags: ['tutorial', 'guide', 'brand'],
                videoUrl: sampleAssets.video,
                thumbnailUrl: sampleAssets.image,
                categoryId: '26',
                privacyStatus: 'public' as const,
                playlistId: 'PLf1XPHghri',
            };
        default:
            return baseData;
    }
};

export const getContentIcon = (type: string) => {
    switch (type) {
        case 'image': 
            return <FaRegImage className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />;
        case 'video': 
            return <FaRegPlayCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />;
        case 'text': 
            return <FaRegFileAlt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />;
        default: 
            return <AiOutlineFile className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />;
    }
};

export const PreviewComponent = (platform: string, previewData: any) => {
    switch (platform) {
        case 'instagram':
            return <InstagramPreview post={previewData as any} />;
        case 'facebook':
            return <FacebookPreview post={previewData as any} />;
        case 'twitter':
            return <XPreview post={previewData as any} />;
        case 'youtube':
            return <YouTubePreview post={previewData as any} />;
        default:
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center p-4">
                        <p className="text-sm sm:text-base text-gray-500">Preview not available for this platform.</p>
                    </div>
                </div>
            );
    }
};

export const getDrawerWidth = (windowWidth: number) => {
    if (windowWidth < 640) return 'w-3/4'; 
    if (windowWidth < 768) return 'w-64';  
    if (windowWidth < 1024) return 'w-72'; 
    return 'w-80';                        
};

export const ContentNotFound = () => {
    return (
        <div className="flex items-center justify-center h-full">
        <div className="text-center p-4">
            <div className="text-gray-500">
                <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg sm:text-xl font-medium mb-2 text-gray-700">Content not found</h3>
                <p className="text-sm sm:text-base text-gray-500">The requested content could not be found.</p>
            </div>
        </div>
    </div>
    );
};

export const faqs = [
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

export const mockContentLibrary: ContentLibraryItem[] = [
    {
        id: '1',
        originalTitle: 'Summer Collection Launch',
        title: 'Instagram-Summer Collection Launch',
        type: 'image',
        status: 'published',
        platforms: ['instagram'],
        createdAt: '2024-01-15',
        publishedAt: '2024-01-16',
        publishedBy: 'John Doe',
        productCategory: 'Clothing'
    },
    {
        id: '1-fb',
        originalTitle: 'Summer Collection Launch',
        title: 'Facebook-Summer Collection Launch', 
        type: 'image',
        status: 'published',
        platforms: ['facebook'],
        createdAt: '2024-01-15',
        publishedAt: '2024-01-16',
        publishedBy: 'John Doe',
        productCategory: 'Clothing'
    },
    {
        id: '2',
        originalTitle: 'Product Tutorial Video',
        title: 'YouTube-Product Tutorial Video',
        type: 'video',
        status: 'draft',
        platforms: ['youtube'],
        createdAt: '2024-01-14',
        productCategory: 'Software'
    },
    {
        id: '3',
        originalTitle: 'Brand Story Blog Post',
        title: 'Facebook-Brand Story Blog Post',
        type: 'text',
        status: 'published',
        platforms: ['facebook'],
        createdAt: '2024-01-13',
        publishedAt: '2024-01-14',
        publishedBy: 'Jane Smith',
        productCategory: 'Company'
    },
    {
        id: '4',
        originalTitle: 'Product Features Showcase',
        title: 'X-Product Features Showcase',
        type: 'image',
        status: 'draft',
        platforms: ['twitter'],
        createdAt: '2024-01-12',
        productCategory: 'Software'
    }
];

export const getPlatformIcon = (platform: string) => {
    switch (platform) {
        case 'instagram': 
            return <FaInstagram className="w-5 h-5 text-white drop-shadow-sm" />;
        case 'facebook': 
            return <FaFacebook className="w-5 h-5 text-white drop-shadow-sm" />;
        case 'twitter': 
            return <FaTwitter className="w-5 h-5 text-white drop-shadow-sm" />;
        case 'youtube': 
            return <FaYoutube className="w-5 h-5 text-white drop-shadow-sm" />;
        default: 
            return <AiOutlineEye className="w-5 h-5 text-gray-500" />;
    }
};

export const getPlatformTheme = (platform: string) => {
    switch (platform) {
        case 'instagram':
            return {
                background: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
                text: 'text-white',
                icon: 'text-white',
                isLight: false
            };
        case 'facebook':
            return {
                background: 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800',
                text: 'text-white', 
                icon: 'text-white',
                isLight: false
            };
        case 'twitter':
            return {
                background: 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-700',
                text: 'text-white',
                icon: 'text-white',
                isLight: false
            };
        case 'youtube':
            return {
                background: 'bg-gradient-to-br from-red-600 via-red-700 to-red-800',
                text: 'text-white',
                icon: 'text-white',
                isLight: false
            };
        default:
            return {
                background: 'bg-white',
                text: 'text-gray-900',
                icon: 'text-gray-600',
                isLight: true
            };
    }
};