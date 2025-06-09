'use client';

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTE_CONFIG, isDynamicContentRoute, getContentIdFromRoute } from "./config";
import { NavigationProps, RouteKey } from "./types";
import ContentPreview from "./pages/ContentPreview";

const CircleProgress = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const DashboardContentInner = () => {
    const router = useRouter();
    const searchParams = useSearchParams() ?? new URLSearchParams();
    const [currentRoute, setCurrentRoute] = useState<RouteKey>('getstarted');
    const [isLoading, setIsLoading] = useState(true);
    const [contentId, setContentId] = useState<string>('');
  
    useEffect(() => {
      setIsLoading(true);
      const typeParam = searchParams.get('type');
      
      if (typeParam) {
        // Check if it's a dynamic content route
        if (isDynamicContentRoute(typeParam)) {
          const extractedContentId = getContentIdFromRoute(typeParam);
          setContentId(extractedContentId);
          setCurrentRoute('content-preview' as RouteKey);
        } else {
          // Handle regular routes
          const matchingRoute = Object.keys(ROUTE_CONFIG).find(
            key => key.toLowerCase() === typeParam.toLowerCase()
          ) as RouteKey | undefined;
          if (matchingRoute) {
            setCurrentRoute(matchingRoute);
          }
        }
      } else {
        setCurrentRoute('getstarted');
      }
      
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }, [searchParams]); 
  
    const navigate = (routeKey: RouteKey | string) => {
      // Handle dynamic content routes
      if (typeof routeKey === 'string' && isDynamicContentRoute(routeKey)) {
        router.push(`/dashboard/content-library?type=${routeKey}`);
        return;
      }
      
      // Handle regular routes
      const route = ROUTE_CONFIG[routeKey as RouteKey];
      if (route) {
        router.push(route.path);
      }
    };
  
    if (isLoading) {
      return <CircleProgress />;
    }

    // Render dynamic content preview
    if (currentRoute === 'content-preview') {
      return <ContentPreview contentId={contentId} navigate={navigate} />;
    }
  
    // Render regular components
    const CurrentComponent = ROUTE_CONFIG[currentRoute]?.component as React.ComponentType<NavigationProps>;
  
    return (
      <div>
        {CurrentComponent && <CurrentComponent navigate={navigate} />}
      </div>
    );
};

const DashboardContent = () => {
  return (
    <Suspense fallback={<CircleProgress />}>
      <DashboardContentInner />
    </Suspense>
  );
};

export default DashboardContent;