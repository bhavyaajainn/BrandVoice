import GetStarted from "./pages/GetStarted";
import Library from "./pages/Library";

type RouteConfig = {
    [key: string]: {
        component: React.ComponentType<any>;
        path: string;
    };
};

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

// Dynamic content preview routes - these will be handled differently
export const isDynamicContentRoute = (routeKey: string): boolean => {
    return routeKey.endsWith('-library');
};

export const getContentIdFromRoute = (routeKey: string): string => {
    return routeKey.replace('-library', '');
};