import { BrandState } from '../types';
import { BRAND_ACTIONS } from '../actions/brandActions';
import { AUTH_ACTIONS } from '../actions/authActions';

const initialState: BrandState = {
    loading: false,
    error: null,
    brand: null,
    success: false,
};

/**
 * Reducer for managing the state of a brand in the store.
 *
 * @param {BrandState} state - The current state of the brand.
 * @param {any} action - The action to be handled.
 *
 * @returns {BrandState} The new state of the brand.
 */
export const brandReducer = (state = initialState, action: any): BrandState => {
    switch (action.type) {
        case BRAND_ACTIONS.CREATE_BRAND_REQUEST:
        case BRAND_ACTIONS.UPDATE_BRAND_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: false,
            };
        case BRAND_ACTIONS.CREATE_BRAND_SUCCESS:
        case BRAND_ACTIONS.UPDATE_BRAND_SUCCESS:
            return {
                ...state,
                loading: false,
                brand: action.payload,
                success: true,
                error: null,
            };
        case BRAND_ACTIONS.CREATE_BRAND_FAILURE:
        case BRAND_ACTIONS.UPDATE_BRAND_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false,
            };
        case BRAND_ACTIONS.GET_BRAND_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case BRAND_ACTIONS.GET_BRAND_SUCCESS:
            return {
                ...state,
                loading: false,
                brand: action.payload,
                error: null,
            };
        case BRAND_ACTIONS.GET_BRAND_FAILURE:
            
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false,
                brand: null
            };
        case BRAND_ACTIONS.RESET_BRAND_STATE:
            return initialState;
        // Reset brand state when user logs out
        case AUTH_ACTIONS.LOGOUT:
            return initialState;
        default:
            return state;
    }
};