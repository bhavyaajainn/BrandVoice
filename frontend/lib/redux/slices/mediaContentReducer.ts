import { CONTENT_STUDIO_ACTIONS } from "../actions/contentStudioActions";
import { MediaContentState } from "../types";

export const initialState: MediaContentState = {
  loading: false,
  error: null,
  data: null,
  success: false,
};

export const mediaContentReducer = (state = initialState, action: any): MediaContentState => {
  switch (action.type) {
    case CONTENT_STUDIO_ACTIONS.GET_MEDIA_CONTENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case CONTENT_STUDIO_ACTIONS.GET_MEDIA_CONTENT_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        success: true,
        error: null,
      };
    case CONTENT_STUDIO_ACTIONS.GET_MEDIA_CONTENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    case CONTENT_STUDIO_ACTIONS.RESET_MEDIA_CONTENT_STATE:
      return {
        ...initialState
      };
    default:
      return state;
  }
};
