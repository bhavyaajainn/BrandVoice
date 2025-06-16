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

