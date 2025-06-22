import { CONTENT_STUDIO_ACTIONS } from "../actions/contentStudioActions";
import { SaveContentState } from "../types";

export const initialState: SaveContentState = {
  loading: false,
  error: null,
  data: null,
  success: false,
};

export const saveContentReducer = (state = initialState, action: any): SaveContentState => {
  switch (action.type) {
    case CONTENT_STUDIO_ACTIONS.SAVE_CONTENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case CONTENT_STUDIO_ACTIONS.SAVE_CONTENT_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        success: true,
        error: null,
      };
    case CONTENT_STUDIO_ACTIONS.SAVE_CONTENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    case CONTENT_STUDIO_ACTIONS.RESET_SAVE_CONTENT_STATE:
      return {
        ...initialState
      };
    default:
      return state;
  }
};