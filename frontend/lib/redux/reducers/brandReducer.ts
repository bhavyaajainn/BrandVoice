// frontend/lib/redux/reducers/brandReducer.ts
import { BrandState } from '../types';
import { BRAND_ACTIONS } from '../actions/brandActions';

const initialState: BrandState = {
  loading: false,
  error: null,
  brand: null,
  success: false,
};

export const brandReducer = (state = initialState, action: any): BrandState => {
  switch (action.type) {
    case BRAND_ACTIONS.CREATE_BRAND_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case BRAND_ACTIONS.CREATE_BRAND_SUCCESS:
      return {
        ...state,
        loading: false,
        brand: action.payload,
        success: true,
        error: null,
      };
    case BRAND_ACTIONS.CREATE_BRAND_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    case BRAND_ACTIONS.RESET_BRAND_STATE:
      return initialState;
    default:
      return state;
  }
};

