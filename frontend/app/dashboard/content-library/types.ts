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