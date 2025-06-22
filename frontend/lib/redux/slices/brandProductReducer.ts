import { AUTH_ACTIONS } from "../actions/authActions";
import { CONTENT_LIBRARY_ACTIONS } from "../actions/contentLibraryActions";
import { ProductPlatformContentState } from "../types";

export const initialState: ProductPlatformContentState = {
  loading: false,
  error: null,
  data: null,
  success: false,
};

export const brandProductReducer = (state = initialState, action: any): ProductPlatformContentState => {
  switch (action.type) {
    case CONTENT_LIBRARY_ACTIONS.GET_PRODUCT_PLATFORM_CONTENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case CONTENT_LIBRARY_ACTIONS.GET_PRODUCT_PLATFORM_CONTENT_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        success: true,
        error: null,
      };
    case CONTENT_LIBRARY_ACTIONS.GET_PRODUCT_PLATFORM_CONTENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    case CONTENT_LIBRARY_ACTIONS.RESET_PRODUCT_PLATFORM_CONTENT_STATE:
      return {
        ...initialState
      };
    case AUTH_ACTIONS.LOGOUT:
      return initialState;
    default:
      return state;
  }
};