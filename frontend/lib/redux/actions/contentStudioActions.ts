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
   GET_MEDIA_CONTENT_REQUEST: 'GET_MEDIA_CONTENT_REQUEST',
   GET_MEDIA_CONTENT_SUCCESS: 'GET_MEDIA_CONTENT_SUCCESS',
   GET_MEDIA_CONTENT_FAILURE: 'GET_MEDIA_CONTENT_FAILURE',
   GET_TEXT_CONTENT_REQUEST: 'GET_TEXT_CONTENT_REQUEST',
   GET_TEXT_CONTENT_SUCCESS: 'GET_TEXT_CONTENT_SUCCESS',
   GET_TEXT_CONTENT_FAILURE: 'GET_TEXT_CONTENT_FAILURE',
   RESET_PRODUCT_STATE: 'RESET_PRODUCT_STATE',
   RESET_PLATFORM_STATE: 'RESET_PLATFORM_STATE',
   RESET_TEXT_CONTENT_STATE: 'RESET_TEXT_CONTENT_STATE',
   RESET_MEDIA_CONTENT_STATE: 'RESET_MEDIA_CONTENT_STATE',
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

export const resetProductState = () => ({
   type: CONTENT_STUDIO_ACTIONS.RESET_PRODUCT_STATE,
});

export const resetPlatformState = () => ({
   type: CONTENT_STUDIO_ACTIONS.RESET_PLATFORM_STATE,
});

export const resetTextContentState = () => ({
   type: CONTENT_STUDIO_ACTIONS.RESET_TEXT_CONTENT_STATE,
});

export const resetMediaContentState = () => ({
   type: CONTENT_STUDIO_ACTIONS.RESET_MEDIA_CONTENT_STATE,
});


export const getTextContentRequest = (payload: { product_id: string; platform: string }) => ({
   type: CONTENT_STUDIO_ACTIONS.GET_TEXT_CONTENT_REQUEST,
   payload,
});

export const getTextContentSuccess = (data: any) => ({
   type: CONTENT_STUDIO_ACTIONS.GET_TEXT_CONTENT_SUCCESS,
   payload: data,
});

export const getTextContentFailure = (error: string) => ({
   type: CONTENT_STUDIO_ACTIONS.GET_TEXT_CONTENT_FAILURE,
   payload: error,
});


export const getMediaContentRequest = (payload: { product_id: string; platform: string }) => ({
   type: CONTENT_STUDIO_ACTIONS.GET_MEDIA_CONTENT_REQUEST,
   payload,
});

export const getMediaContentSuccess = (data: any) => ({
   type: CONTENT_STUDIO_ACTIONS.GET_MEDIA_CONTENT_SUCCESS,
   payload: data,
});

export const getMediaContentFailure = (error: string) => ({
   type: CONTENT_STUDIO_ACTIONS.GET_MEDIA_CONTENT_FAILURE,
   payload: error,
});

