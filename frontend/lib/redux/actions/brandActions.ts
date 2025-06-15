// frontend/lib/redux/actions/brandActions.ts
import { BrandData } from '../types';

export const BRAND_ACTIONS = {
  CREATE_BRAND_REQUEST: 'CREATE_BRAND_REQUEST',
  CREATE_BRAND_SUCCESS: 'CREATE_BRAND_SUCCESS',
  CREATE_BRAND_FAILURE: 'CREATE_BRAND_FAILURE',
  RESET_BRAND_STATE: 'RESET_BRAND_STATE',
} as const;

export const createBrandRequest = (brandData: BrandData) => ({
  type: BRAND_ACTIONS.CREATE_BRAND_REQUEST,
  payload: brandData,
});

export const createBrandSuccess = (brand: any) => ({
  type: BRAND_ACTIONS.CREATE_BRAND_SUCCESS,
  payload: brand,
});

export const createBrandFailure = (error: string) => ({
  type: BRAND_ACTIONS.CREATE_BRAND_FAILURE,
  payload: error,
});

export const resetBrandState = () => ({
  type: BRAND_ACTIONS.RESET_BRAND_STATE,
});

// frontend/lib/redux/actions/authActions.ts
export const AUTH_ACTIONS = {
  GET_TOKEN_REQUEST: 'GET_TOKEN_REQUEST',
  GET_TOKEN_SUCCESS: 'GET_TOKEN_SUCCESS',
  GET_TOKEN_FAILURE: 'GET_TOKEN_FAILURE',
} as const;

export const getTokenRequest = () => ({
  type: AUTH_ACTIONS.GET_TOKEN_REQUEST,
});

export const getTokenSuccess = (token: string) => ({
  type: AUTH_ACTIONS.GET_TOKEN_SUCCESS,
  payload: token,
});

export const getTokenFailure = (error: string) => ({
  type: AUTH_ACTIONS.GET_TOKEN_FAILURE,
  payload: error,
});