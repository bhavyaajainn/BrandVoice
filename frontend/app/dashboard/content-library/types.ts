import { ROUTE_CONFIG } from './config';

export type RouteKey = keyof typeof ROUTE_CONFIG | 'content-preview';

export interface NavigationProps {
    navigate: (routeKey: RouteKey | string) => void;
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

export interface ContentPreviewItem {
    id: string;
    title: string;
    type: 'image' | 'video' | 'text';
    status: 'draft' | 'published';
    platforms: string[];
    createdAt: string;
    publishedAt?: string;
    publishedBy?: string;
    thumbnail?: string;
    productCategory: string;
    originalTitle: string;
}

export interface ContentPreviewProps {
    contentId: string;
    navigate: (routeKey: string) => void;
}

export interface ContentLibraryItem {
    id: string;
    title: string;
    type: 'image' | 'video' | 'text';
    status: 'draft' | 'published';
    platforms: string[];
    createdAt: string;
    publishedAt?: string;
    publishedBy?: string;
    thumbnail?: string;
    productCategory: string;
    originalTitle: string;
}