export type RouteConfig = {
    [key: string]: {
        component: React.ComponentType<any>;
        path: string;
    };
};