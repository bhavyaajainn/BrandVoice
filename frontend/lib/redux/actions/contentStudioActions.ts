export const CONTENT_STUDIO_ACTIONS = {
   CREATE_PRODUCT_INFORMATION_REQUEST: 'CREATE_PRODUCT_INFORMATION_REQUEST',
   CREATE_PRODUCT_INFORMATION_SUCCESS: 'CREATE_PRODUCT_INFORMATION_SUCCESS',
   CREATE_PRODUCT_INFORMATION_FAILURE: 'CREATE_PRODUCT_INFORMATION_FAILURE',
   GET_PRODUCT_INFORMATION_REQUEST: 'GET_PRODUCT_INFORMATION_REQUEST',
   GET_PRODUCT_INFORMATION_SUCCESS: 'GET_PRODUCT_INFORMATION_SUCCESS',
   GET_PRODUCT_INFORMATION_FAILURE: 'GET_PRODUCT_INFORMATION_FAILURE',
   CREATE_PLATFORM_INFORMATION_REQUEST: 'CREATE_PLATFORM_INFORMATION_REQUEST',
   CREATE_PLATFORM_INFORMATION_SUCCESS: 'CREATE_PLATFORM_INFORMATION_SUCCESS',
   CREATE_PLATFORM_INFORMATION_FAILURE: 'CREATE_PLATFORM_INFORMATION_FAILURE',
   GET_PLATFORM_INFORMATION_REQUEST: 'GET_PLATFORM_INFORMATION_REQUEST',
   GET_PLATFORM_INFORMATION_SUCCESS: 'GET_PLATFORM_INFORMATION_SUCCESS',
   GET_PLATFORM_INFORMATION_FAILURE: 'GET_PLATFORM_INFORMATION_FAILURE',
} as const;

export const createProductInformationRequest = (productInformation: any) => ({
   type: CONTENT_STUDIO_ACTIONS.CREATE_PRODUCT_INFORMATION_REQUEST,
   payload: productInformation,
});
   
export const createProductInformationSuccess = (productInformation: any) => ({
   type: CONTENT_STUDIO_ACTIONS.CREATE_PRODUCT_INFORMATION_SUCCESS,
   payload: productInformation,
});
   
export const createProductInformationFailure = (error: string) => ({
   type: CONTENT_STUDIO_ACTIONS.CREATE_PRODUCT_INFORMATION_FAILURE,
   payload: error,
});
    
export const getProductInformationRequest = (brandId: string) => ({
   type: CONTENT_STUDIO_ACTIONS.GET_PRODUCT_INFORMATION_REQUEST,
   payload: brandId,
});
   
export const getProductInformationSuccess = (productInformation: any) => ({
   type: CONTENT_STUDIO_ACTIONS.GET_PRODUCT_INFORMATION_SUCCESS,
   payload: productInformation,
});
   
export const getProductInformationFailure = (error: string) => ({
   type: CONTENT_STUDIO_ACTIONS.GET_PRODUCT_INFORMATION_FAILURE,
   payload: error,
});
   
export const createPlatformInformationRequest = (platformInformation: any) => ({
   type: CONTENT_STUDIO_ACTIONS.CREATE_PLATFORM_INFORMATION_REQUEST,
   payload: platformInformation,
});
   
export const createPlatformInformationSuccess = (platformInformation: any) => ({
   type: CONTENT_STUDIO_ACTIONS.CREATE_PLATFORM_INFORMATION_SUCCESS,
   payload: platformInformation,
});
   
export const createPlatformInformationFailure = (error: string) => ({
   type: CONTENT_STUDIO_ACTIONS.CREATE_PLATFORM_INFORMATION_FAILURE,
   payload: error,
});
   
export const getPlatformInformationRequest = (brandId: string) => ({
   type: CONTENT_STUDIO_ACTIONS.GET_PLATFORM_INFORMATION_REQUEST,
   payload: brandId,
});
   
export const getPlatformInformationSuccess = (platformInformation: any) => ({
   type: CONTENT_STUDIO_ACTIONS.GET_PLATFORM_INFORMATION_SUCCESS,
   payload: platformInformation,
});
   
export const getPlatformInformationFailure = (error: string) => ({
   type: CONTENT_STUDIO_ACTIONS.GET_PLATFORM_INFORMATION_FAILURE,
   payload: error,
});
   
    