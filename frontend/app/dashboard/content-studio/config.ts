import GetStarted from "./pages/GetStarted";
import Moodboard from "./pages/Moodboard";
import ProductDetails from "./pages/ProductDetails";
import GenerateContent from "./pages/Content";

type RouteConfig = {
    [key: string]: {
        component: React.ComponentType<any>;
        path: string;
    };
};

export const ROUTE_CONFIG: RouteConfig = {
    'getstarted': {
        component: GetStarted,
        path: '/dashboard/content-studio'
    },
    'productDetails': {
        component: ProductDetails,
        path: '/dashboard/content-studio?type=productDetails'
    },
    'moodboard': {
        component: Moodboard,
        path: '/dashboard/content-studio?type=moodboard'
    },
    'generateContent': {
        component: GenerateContent,
        path: '/dashboard/content-studio?type=generateContent'
    }
};