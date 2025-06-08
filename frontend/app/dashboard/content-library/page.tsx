'use client';

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTE_CONFIG } from "./config";
import { NavigationProps, RouteKey } from "./types";

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
  
    useEffect(() => {
      setIsLoading(true);
      const typeParam = searchParams.get('type');
      if (typeParam) {
        const matchingRoute = Object.keys(ROUTE_CONFIG).find(
          key => key.toLowerCase() === typeParam.toLowerCase()
        ) as RouteKey | undefined;
        if (matchingRoute) {
          setCurrentRoute(matchingRoute);
        }
      } else {
        setCurrentRoute('getstarted');
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }, [searchParams]); 
  
    const navigate = (routeKey: RouteKey) => {
      const route = ROUTE_CONFIG[routeKey];
      if (route) {
        router.push(route.path);
      }
    };
  
    const CurrentComponent = ROUTE_CONFIG[currentRoute]?.component as React.ComponentType<NavigationProps>;
  
    if (isLoading) {
      return <CircleProgress />;
    }
  
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