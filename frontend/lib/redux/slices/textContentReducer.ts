
import { CONTENT_STUDIO_ACTIONS } from "../actions/contentStudioActions";
import {  TextContentState } from "../types";

export const initialState: TextContentState = {
  loading: false,
  error: null,
  data: null,
  success: false,
};

export const textContentReducer = (state = initialState, action: any): TextContentState => {
  switch (action.type) {
    case CONTENT_STUDIO_ACTIONS.GET_TEXT_CONTENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case CONTENT_STUDIO_ACTIONS.GET_TEXT_CONTENT_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        success: true,
        error: null,
      };
    case CONTENT_STUDIO_ACTIONS.GET_TEXT_CONTENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    case CONTENT_STUDIO_ACTIONS.RESET_TEXT_CONTENT_STATE:
      return {
        ...initialState
      };
    default:
      return state;
  }
};