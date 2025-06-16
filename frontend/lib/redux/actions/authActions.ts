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