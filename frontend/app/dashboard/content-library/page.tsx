'use client';

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTE_CONFIG, isDynamicContentRoute, getContentIdFromRoute } from "./config";
import { NavigationProps, RouteKey } from "./types";
import ContentPreview from "./pages/ContentPreview";
import { CircleProgress } from "../helper";

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
      if (isDynamicContentRoute(typeParam)) {
        const extractedContentId = getContentIdFromRoute(typeParam);
        setContentId(extractedContentId);
        setCurrentRoute('content-preview' as RouteKey);
      } else {
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
    if (typeof routeKey === 'string' && isDynamicContentRoute(routeKey)) {
      router.push(`/dashboard/content-library?type=${routeKey}`);
      return;
    }
    const route = ROUTE_CONFIG[routeKey as RouteKey];
    if (route) {
      router.push(route.path);
    }
  };

  if (isLoading) {
    return <CircleProgress />;
  }

  if (currentRoute === 'content-preview') {
    return <ContentPreview contentId={contentId} navigate={navigate} />;
  }
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