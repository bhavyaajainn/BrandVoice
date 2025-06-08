import { ROUTE_CONFIG } from './config';

export type ContentType = 'Images' | 'Videos' | 'Documents' | 'Hashtags';

export type RouteKey = keyof typeof ROUTE_CONFIG;

export interface NavigationProps {
    navigate: (routeKey: RouteKey) => void;
}

export interface GetStartedProps {
    navigate: (routeKey: string) => void;
}

export interface LibraryProps {
    navigate: (routeKey: string) => void;
}

export interface ContentItem {
    id: string;
    title: string;
    type: 'image' | 'video' | 'text';
    status: 'draft' | 'published';
    platforms: string[];
    createdAt: string;
    publishedAt?: string;
    publishedBy?: string;
    thumbnail?: string;
    content: string;
    brandName: string;
    productType: string;
    productName: string;
}

export interface FolderStructure {
    [brandName: string]: {
        [productType: string]: {
            [productName: string]: ContentItem[];
        };
    };
}