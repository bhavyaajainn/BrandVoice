import { AUTH_ACTIONS } from "../actions/authActions";
import { CONTENT_STUDIO_ACTIONS } from "../actions/contentStudioActions";
import { PlatformInfoResponse, PlatformState } from "../types";

export const initialState: PlatformState = {
    loading: false,
    error: null,
    data: {} as PlatformInfoResponse,
    success: false,
};



export const platformReducer = (state = initialState, action: any): PlatformState => {
    switch (action.type) {
        case CONTENT_STUDIO_ACTIONS.CREATE_PLATFORM_INFORMATION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: false,
            };
        case CONTENT_STUDIO_ACTIONS.CREATE_PLATFORM_INFORMATION_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                success: true,
                error: null,
            };
        case CONTENT_STUDIO_ACTIONS.CREATE_PLATFORM_INFORMATION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false,
            };
        case CONTENT_STUDIO_ACTIONS.GET_PLATFORM_INFORMATION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case CONTENT_STUDIO_ACTIONS.GET_PLATFORM_INFORMATION_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case CONTENT_STUDIO_ACTIONS.GET_PLATFORM_INFORMATION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false,
                data: {} as PlatformInfoResponse
            };
        case AUTH_ACTIONS.LOGOUT:
            return initialState;
        case CONTENT_STUDIO_ACTIONS.RESET_PLATFORM_STATE:
            return { ...initialState };
        default:
            return state;
    }
};