export type Platform = 'Instagram' | 'Facebook' | 'X' | 'YouTube';
export type MediaType = 'image' | 'video' | 'carousel' | 'link' | 'gif';
export type FacebookPrivacy = 'Public' | 'Friends' | 'OnlyMe';
export type YouTubePrivacy = 'public' | 'private' | 'unlisted';

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