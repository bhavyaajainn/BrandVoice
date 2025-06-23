import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { getBrandProductsRequest } from "@/lib/redux/actions/contentLibraryActions";
import { useBrandData } from "./useBrandData";

interface UseBrandProductsReturn {
  data: any[] | null;
  loading: boolean;
  error: any;
  hasProducts: boolean;
  refetch: () => void;
}

export const useBrandProducts = (): UseBrandProductsReturn => {
  const dispatch = useAppDispatch();
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  const { brand } = useBrandData();

  const {
    data: brandProducts,
    loading: productsLoading,
    error: productsError,
  } = useAppSelector((state) => state.brandProducts);

  useEffect(() => {
    if (
      brand?.brand_id &&
      !brandProducts?.length &&
      !productsLoading &&
      !hasAttemptedFetch
    ) {
      setHasAttemptedFetch(true);
      dispatch(getBrandProductsRequest(brand.brand_id));
    }
  }, [
    brand?.brand_id,
    brandProducts,
    productsLoading,
    hasAttemptedFetch,
    dispatch,
  ]);

  const hasProducts = Array.isArray(brandProducts) && brandProducts.length > 0;

  const refetch = () => {
    if (brand?.brand_id) {
      setHasAttemptedFetch(true);
      dispatch(getBrandProductsRequest(brand.brand_id));
    }
  };

  return {
    data: brandProducts,
    loading: productsLoading,
    error: productsError,
    hasProducts,
    refetch,
  };
};
