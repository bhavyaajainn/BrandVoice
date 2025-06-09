import GetStarted from "./pages/GetStarted";
import Moodboard from "./pages/Moodboard";
import ProductDetails from "./pages/ProductDetails";
import GenerateContent from "./pages/Content";
import { RouteConfig } from "../types";

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