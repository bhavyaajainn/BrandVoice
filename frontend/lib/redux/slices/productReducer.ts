import { AUTH_ACTIONS } from "../actions/authActions";
import { CONTENT_STUDIO_ACTIONS } from "../actions/contentStudioActions";
import { ProductInfoResponse, ProductState } from "../types";

const initialState: ProductState = {
    loading: false,
    error: null,
    data: {} as ProductInfoResponse,
    success: false,
};

export const productReducer = (state = initialState, action: any): ProductState => {
    switch (action.type) {
        case CONTENT_STUDIO_ACTIONS.CREATE_PRODUCT_INFORMATION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: false,
            };
        case CONTENT_STUDIO_ACTIONS.CREATE_PRODUCT_INFORMATION_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                success: true,
                error: null,
            };
        case CONTENT_STUDIO_ACTIONS.CREATE_PRODUCT_INFORMATION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false,
            };
        case CONTENT_STUDIO_ACTIONS.GET_PRODUCT_INFORMATION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case CONTENT_STUDIO_ACTIONS.GET_PRODUCT_INFORMATION_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case CONTENT_STUDIO_ACTIONS.GET_PRODUCT_INFORMATION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false,
                data: {} as ProductInfoResponse
            };
        case AUTH_ACTIONS.LOGOUT:
            return initialState;
        default:
            return state;
    }
};