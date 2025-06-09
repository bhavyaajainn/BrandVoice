import { RouteConfig } from "../types";
import GetStarted from "./pages/GetStarted";
import Library from "./pages/Library";

export const ROUTE_CONFIG: RouteConfig = {
    'getstarted': {
        component: GetStarted,
        path: '/dashboard/content-library'
    },
    'library': {
        component: Library,
        path: '/dashboard/content-library?type=library'
    }
};

export const isDynamicContentRoute = (routeKey: string): boolean => {
    return routeKey.endsWith('-library');
};

export const getContentIdFromRoute = (routeKey: string): string => {
    return routeKey.replace('-library', '');
};