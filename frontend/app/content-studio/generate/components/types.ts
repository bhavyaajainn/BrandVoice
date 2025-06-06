export type Platform = 'Instagram' | 'Facebook' | 'X' | 'YouTube';
export type MediaType = 'image' | 'video' | 'carousel' | 'link';
export type FacebookPrivacy = 'Public' | 'Friends' | 'OnlyMe';

export interface BasePost {
    text: string;
    hashtags: string[];
    mediaType: MediaType;
    mediaUrls: string[];
    locationId: string;
}

export interface InstagramPost extends BasePost {
    mentions: string[];
}

export interface FacebookPost extends BasePost {
    linkUrl?: string;
    taggedPages: string[];
    privacy: FacebookPrivacy;
}

export type Post = InstagramPost | FacebookPost;

export interface SampleAssets {
    image: string;
    video: string;
    carousel: string[];
} 