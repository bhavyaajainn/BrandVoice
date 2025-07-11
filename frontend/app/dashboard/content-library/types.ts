import { ROUTE_CONFIG } from './config';

export type RouteKey = 'getstarted' | 'library' | 'content-preview';

export interface RouteConfig {
    component: React.ComponentType<any>;
    path: string;
}

export interface NavigationProps {
    navigate: (routeKey: string) => void;
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