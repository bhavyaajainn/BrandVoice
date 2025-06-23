"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTE_CONFIG, isDynamicContentRoute, getContentIdFromRoute } from "./config";
import { NavigationProps, RouteKey } from "./types";
import { CircleProgress } from "../../dashboard/helper";
import { useBrandProducts } from "@/lib/hooks/useBrandProducts";
import ContentPreview from "./pages/ContentPreview";

const DashboardContentInner: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const [currentRoute, setCurrentRoute] = useState<RouteKey>("getstarted");
  const [isLoading, setIsLoading] = useState(true);
  const [contentId, setContentId] = useState<string>("");

  const {
    data: brandProducts,
    loading: productsLoading,
    hasProducts,
  } = useBrandProducts();

  useEffect(() => {
    setIsLoading(true);
    const typeParam = searchParams.get("type");
    const contentParam = searchParams.get("content");

    if (contentParam) {
      setContentId(contentParam);
      setCurrentRoute("content-preview");
    } else if (typeParam) {
      const matchingRoute = Object.keys(ROUTE_CONFIG).find(
        (key) => key.toLowerCase() === typeParam.toLowerCase()
      ) as RouteKey | undefined;
      if (matchingRoute) {
        setCurrentRoute(matchingRoute);
      }
    } else {
      if (hasProducts && !productsLoading) {
        router.push("/dashboard/content-library?type=library");
        return;
      }
      setCurrentRoute("getstarted");
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, [searchParams, hasProducts, productsLoading, router]);

  const navigate = (routeKey: string) => {
    if (isDynamicContentRoute(routeKey)) {
      const contentId = getContentIdFromRoute(routeKey);
      router.push(`/dashboard/content-library?type=content-preview&content=${contentId}`);
    } else {
      const route = ROUTE_CONFIG[routeKey as RouteKey];
      if (route) {
        router.push(route.path);
      }
    }
  };

  if (isLoading || productsLoading) {
    return <CircleProgress />;
  }

  if (currentRoute === "content-preview" && contentId) {
    return <ContentPreview contentId={contentId} navigate={navigate} />;
  }

  const CurrentComponent = ROUTE_CONFIG[currentRoute]
    ?.component as React.ComponentType<NavigationProps>;

  return (
    <div>{CurrentComponent && <CurrentComponent navigate={navigate} />}</div>
  );
};

const DashboardContent: React.FC = () => {
  return (
    <Suspense fallback={<CircleProgress />}>
      <DashboardContentInner />
    </Suspense>
  );
};

export default DashboardContent;