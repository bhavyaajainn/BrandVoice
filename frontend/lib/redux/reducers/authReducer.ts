// frontend/lib/redux/reducers/authReducer.ts
import { AuthState } from '../types';
import { AUTH_ACTIONS } from '../actions/authActions';

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
};

export const authReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case AUTH_ACTIONS.GET_TOKEN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case AUTH_ACTIONS.GET_TOKEN_SUCCESS:
      return {
        ...state,
        loading: false,
        token: action.payload,
        error: null,
      };
    case AUTH_ACTIONS.GET_TOKEN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};