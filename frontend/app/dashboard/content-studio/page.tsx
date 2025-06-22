"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTE_CONFIG } from "./config";
import { NavigationProps, RouteKey } from "./types";
import { CircleProgress } from "../../dashboard/helper";
import { useBrandProducts } from "@/lib/hooks/useBrandProducts";

const DashboardContentInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const [currentRoute, setCurrentRoute] = useState<RouteKey>("getstarted");
  const [isLoading, setIsLoading] = useState(true);

  const {
    data: brandProducts,
    loading: productsLoading,
    hasProducts,
  } = useBrandProducts();

  useEffect(() => {
    setIsLoading(true);
    const typeParam = searchParams.get("type");

    if (typeParam) {
      const matchingRoute = Object.keys(ROUTE_CONFIG).find(
        (key) => key.toLowerCase() === typeParam.toLowerCase()
      ) as RouteKey | undefined;
      if (matchingRoute) {
        setCurrentRoute(matchingRoute);
      }
    } else {
      if (hasProducts && !productsLoading) {
        router.push("/dashboard/content-studio?type=productDetails");
        return;
      }
      setCurrentRoute("getstarted");
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, [searchParams, hasProducts, productsLoading, router]);

  const navigate = (routeKey: RouteKey) => {
    const route = ROUTE_CONFIG[routeKey];
    if (route) {
      router.push(route.path);
    }
  };

  const CurrentComponent = ROUTE_CONFIG[currentRoute]
    ?.component as React.ComponentType<NavigationProps>;

  if (isLoading || productsLoading) {
    return <CircleProgress />;
  }

  return (
    <div>{CurrentComponent && <CurrentComponent navigate={navigate} />}</div>
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
