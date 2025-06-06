export type Platform = 'Instagram' | 'Facebook' | 'X' | 'YouTube';
export type MediaType = 'image' | 'video' | 'carousel';

export interface Post {
    text: string;
    hashtags: string[];
    mentions: string[];
    mediaType: MediaType;
    mediaUrls: string[];
    locationId?: string;
    scheduleTime?: string;
}

export interface SampleAssets {
    image: string;
    video: string;
    carousel: string[];
} 