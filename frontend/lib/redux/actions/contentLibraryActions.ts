export const CONTENT_LIBRARY_ACTIONS = {
    GET_BRAND_PRODUCTS_REQUEST: 'GET_BRAND_PRODUCTS_REQUEST',
    GET_BRAND_PRODUCTS_SUCCESS: 'GET_BRAND_PRODUCTS_SUCCESS',
    GET_BRAND_PRODUCTS_FAILURE: 'GET_BRAND_PRODUCTS_FAILURE',
    GET_PRODUCT_PLATFORM_CONTENT_REQUEST: 'GET_PRODUCT_PLATFORM_CONTENT_REQUEST',
    GET_PRODUCT_PLATFORM_CONTENT_SUCCESS: 'GET_PRODUCT_PLATFORM_CONTENT_SUCCESS',
    GET_PRODUCT_PLATFORM_CONTENT_FAILURE: 'GET_PRODUCT_PLATFORM_CONTENT_FAILURE',
    RESET_BRAND_PRODUCTS_STATE: 'RESET_BRAND_PRODUCTS_STATE',
    RESET_PRODUCT_PLATFORM_CONTENT_STATE: 'RESET_PRODUCT_PLATFORM_CONTENT_STATE',
  } as const;
  
  export const getBrandProductsRequest = (brandId: string) => ({
    type: CONTENT_LIBRARY_ACTIONS.GET_BRAND_PRODUCTS_REQUEST,
    payload: brandId,
  });
  
  export const getBrandProductsSuccess = (products: any[]) => ({
    type: CONTENT_LIBRARY_ACTIONS.GET_BRAND_PRODUCTS_SUCCESS,
    payload: products,
  });
  
  export const getBrandProductsFailure = (error: string) => ({
    type: CONTENT_LIBRARY_ACTIONS.GET_BRAND_PRODUCTS_FAILURE,
    payload: error,
  });
  
  export const getProductPlatformContentRequest = (payload: { productId: string; platform: string }) => ({
    type: CONTENT_LIBRARY_ACTIONS.GET_PRODUCT_PLATFORM_CONTENT_REQUEST,
    payload,
  });
  
  export const getProductPlatformContentSuccess = (content: any) => ({
    type: CONTENT_LIBRARY_ACTIONS.GET_PRODUCT_PLATFORM_CONTENT_SUCCESS,
    payload: content,
  });
  
  export const getProductPlatformContentFailure = (error: string) => ({
    type: CONTENT_LIBRARY_ACTIONS.GET_PRODUCT_PLATFORM_CONTENT_FAILURE,
    payload: error,
  });
  
  export const resetBrandProductsState = () => ({
    type: CONTENT_LIBRARY_ACTIONS.RESET_BRAND_PRODUCTS_STATE,
  });
  
  export const resetProductPlatformContentState = () => ({
    type: CONTENT_LIBRARY_ACTIONS.RESET_PRODUCT_PLATFORM_CONTENT_STATE,
  });