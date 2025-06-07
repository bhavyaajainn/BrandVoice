'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTE_CONFIG } from "./config";

type RouteKey = keyof typeof ROUTE_CONFIG;

interface NavigationProps {
    navigate: (routeKey: RouteKey) => void;
}

const DashboardContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams() ?? new URLSearchParams();
    const [currentRoute, setCurrentRoute] = useState<RouteKey>('getstarted');
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      setIsLoading(true);
      const typeParam = searchParams.get('type');
      console.log('Raw type parameter:', typeParam);
      
      if (typeParam) {
        // Find the matching route key regardless of case
        const matchingRoute = Object.keys(ROUTE_CONFIG).find(
          key => key.toLowerCase() === typeParam.toLowerCase()
        ) as RouteKey | undefined;
        
        console.log('Matched route:', matchingRoute);
        
        if (matchingRoute) {
          console.log('Setting current route to:', matchingRoute);
          setCurrentRoute(matchingRoute);
        }
      } else {
        console.log('No type parameter, defaulting to getstarted');
        setCurrentRoute('getstarted');
      }
      
      // Short delay to prevent flash
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }, [searchParams]); // Re-run effect when searchParams changes
  
    const navigate = (routeKey: RouteKey) => {
      console.log('Navigating to:', routeKey);
      const route = ROUTE_CONFIG[routeKey];
      if (route) {
        console.log('Navigating to path:', route.path);
        router.push(route.path);
      } else {
        console.log('No route found for:', routeKey);
      }
    };
  
    console.log('Current route:', currentRoute);
    console.log('Available components:', Object.keys(ROUTE_CONFIG));
    console.log('Component to render:', ROUTE_CONFIG[currentRoute]?.component.name);
    
    const CurrentComponent = ROUTE_CONFIG[currentRoute]?.component as React.ComponentType<NavigationProps>;
  
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }
  
    return (
      <div>
        {CurrentComponent && <CurrentComponent navigate={navigate} />}
      </div>
    );
  };

export default DashboardContent;