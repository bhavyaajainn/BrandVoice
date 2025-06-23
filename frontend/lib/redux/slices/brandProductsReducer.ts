import { AUTH_ACTIONS } from "../actions/authActions";
import { CONTENT_LIBRARY_ACTIONS } from "../actions/contentLibraryActions";
import { BrandProductsState } from "../types";

export const initialState: BrandProductsState = {
  loading: false,
  error: null,
  data: [],
  success: false,
};

export const brandProductsReducer = (state = initialState, action: any): BrandProductsState => {
  switch (action.type) {
    case CONTENT_LIBRARY_ACTIONS.GET_BRAND_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case CONTENT_LIBRARY_ACTIONS.GET_BRAND_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        success: true,
        error: null,
      };
    case CONTENT_LIBRARY_ACTIONS.GET_BRAND_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    case CONTENT_LIBRARY_ACTIONS.RESET_BRAND_PRODUCTS_STATE:
      return {
        ...initialState
      };
    case AUTH_ACTIONS.LOGOUT:
      return initialState;
    default:
      return state;
  }
};