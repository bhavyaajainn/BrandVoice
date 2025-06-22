import { RouteConfig } from "../types";
import GetStarted from "./pages/GetStarted";
import Library from "./pages/Library";
import ContentPreview from "./pages/ContentPreview";

export const ROUTE_CONFIG: Record<string, {
    component: React.ComponentType<any>;
    path: string;
}> = {
    'getstarted': {
        component: GetStarted,
        path: '/dashboard/content-library'
    },
    'library': {
        component: Library,
        path: '/dashboard/content-library?type=library'
    },
    'content-preview': {
        component: ContentPreview,
        path: '/dashboard/content-library?type=content-preview'
    }
};

export const isDynamicContentRoute = (routeKey: string): boolean => {
    return routeKey.endsWith('-library');
};

export const getContentIdFromRoute = (routeKey: string): string => {
    return routeKey.replace('-library', '');
};