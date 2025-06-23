export const AUTH_ACTIONS = {
  GET_TOKEN_REQUEST: 'GET_TOKEN_REQUEST',
  GET_TOKEN_SUCCESS: 'GET_TOKEN_SUCCESS',
  GET_TOKEN_FAILURE: 'GET_TOKEN_FAILURE',
  LOGOUT: 'LOGOUT',
  RESET_AUTH_STATE: 'RESET_AUTH_STATE',
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

export const logout = () => ({
  type: AUTH_ACTIONS.LOGOUT,
});

export const resetAuthState = () => ({
  type: AUTH_ACTIONS.RESET_AUTH_STATE,
});