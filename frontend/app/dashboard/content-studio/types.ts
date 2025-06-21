import { ROUTE_CONFIG } from './config';

export type Platform = 'Instagram' | 'Facebook' | 'Twitter' | 'YouTube';
export type MediaType = 'image' | 'video' | 'carousel' | 'link' | 'gif';
export type FacebookPrivacy = 'Public' | 'Friends' | 'OnlyMe';
export type YouTubePrivacy = 'public' | 'private' | 'unlisted';
export type RouteKey = keyof typeof ROUTE_CONFIG;

export interface NavigationProps {
    navigate: (routeKey: RouteKey) => void;
}
export interface BasePost {
    text: string;
    hashtags: string[];
    mediaType: MediaType;
    mediaUrls: string[];
    locationId?: string;
}

export interface InstagramPost extends BasePost {
    mentions: string[];
}

export interface FacebookPost extends BasePost {
    linkUrl?: string;
    taggedPages: string[];
    privacy: FacebookPrivacy;
}

export interface XPoll {
    options: string[];
    durationMinutes: number;
}

export interface XPost extends BasePost {
    mentions: string[];
    poll?: XPoll;
    quoteTweetId?: string;
}

export interface YouTubePost extends BasePost {
    title: string;
    description: string;
    tags: string[];
    videoUrl: string;
    thumbnailUrl: string;
    categoryId: string;
    privacyStatus: YouTubePrivacy;
    playlistId?: string;
}

export type Post = InstagramPost | FacebookPost | XPost | YouTubePost;

export interface SampleAssets {
    image: string;
    video: string;
    carousel: string[];
    gif: string;
} 

export interface FacebookFormProps {
    post: FacebookPost;
    onMediaTypeChange: (type: MediaType) => void;
    onInputChange: (field: keyof FacebookPost, value: any) => void;
    onArrayInput: (field: 'hashtags' | 'taggedPages', value: string) => void;
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    renderUploadPreview: () => React.ReactNode;
    imageError: boolean;
}

export interface FacebookPreviewProps {
    post: FacebookPost;
}

export interface ContentFormProps {
    post: InstagramPost;
    onMediaTypeChange: (type: MediaType) => void;
    onInputChange: (field: keyof InstagramPost, value: any) => void;
    onArrayInput: (field: 'hashtags' | 'mentions', value: string) => void;
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    renderUploadPreview: () => React.ReactNode;
    imageError: boolean;
}

export interface InstagramPreviewProps {
    post: Post;
}

export interface XFormProps {
    post: XPost;
    onMediaTypeChange: (type: MediaType) => void;
    onInputChange: (field: keyof XPost, value: any) => void;
    onArrayInput: (field: 'hashtags' | 'mentions', value: string) => void;
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    renderUploadPreview: () => React.ReactNode;
    imageError: boolean;
}

export interface XPreviewProps {
    post: XPost;
}

export interface YouTubeFormProps {
    post: YouTubePost;
    onInputChange: (field: keyof YouTubePost, value: any) => void;
    onArrayInput: (field: 'tags', value: string) => void;
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    renderUploadPreview: () => React.ReactNode;
    imageError: boolean;
}

export interface YouTubePreviewProps {
    post: YouTubePost;
}

export interface GetStartedProps {
    navigate: (routeKey: string) => void;
}

export interface ProductDetailsType {
    description: string;
    selectedPlatform: string;
    images: File[];
    language: string;
}

export interface ProductDetailsProps {
    navigate: (routeKey: string) => void;
}

export interface StepperProps {
    step: number;
    children: React.ReactNode[];
}

export interface StepProps {
    step: number;
    index: number;
    children: React.ReactNode;
}

export interface MarketingContent {
    content: {
      hashtags: string[];
      caption: string;
      call_to_action: string;
    };
  }
  
  export interface TextContentResponse {
    product_id: string;
    platform: string;
    product_name: string;
    brand_id: string;
    marketing_content: MarketingContent;
    timestamp: string;
  }
  
  export interface MediaContentResponse {
    product_id: string;
    platform: string;
    product_name: string;
    brand_id: string;
    social_media_image_url: string | null;
    social_media_carousel_urls: string[] | null;
    social_media_video_url: string | null;
    media_type: "image" | "carousel" | "video";
    timestamp: string;
  }
  