import GetStarted from "./pages/GetStarted";
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
    'generateContent': {
        component: GenerateContent,
        path: '/dashboard/content-studio?type=generateContent&product_id=:product_id&platform=:platform'
    }
};