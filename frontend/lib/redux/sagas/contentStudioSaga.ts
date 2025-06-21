import { call, put, select, takeLatest } from "redux-saga/effects";
import { API_BASE_URL } from "./util";

import { ContentGenerationResponse } from "../types/contentStudioTypes";
import { SagaIterator } from "redux-saga";
import { RootState } from "@/lib/store";
import { 
  createPlatformInformationFailure, 
  createPlatformInformationRequest, 
  createPlatformInformationSuccess, 
  createProductInformationFailure, 
  createProductInformationRequest, 
  createProductInformationSuccess,
  getTextContentRequest,
  getTextContentSuccess,
  getTextContentFailure,
  getMediaContentRequest,
  getMediaContentSuccess,
  getMediaContentFailure
} from "../actions/contentStudioActions";

function*  createPlatformInformationSaga(
  action: ReturnType<typeof createPlatformInformationRequest>
): SagaIterator {
  try {
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('authToken');
    }
    
    if (!token) {
      token = yield select((state: RootState) => state.auth.token);
    }

    if (!token) {
      throw new Error("No authentication token available");
    }

    const { product_id, platform, media_type, content_only, media_only } =
      action.payload;
    const params = new URLSearchParams();
    if (media_type) params.append("media_type", media_type);
    if (content_only) params.append("content_only", "true");
    if (media_only) params.append("media_only", "true");

    const queryString = params.toString();
    const url = `${API_BASE_URL}/products/${product_id}/platform/${platform}/generate-content${
      queryString ? `?${queryString}` : ""
    }`;

    const response: Response = yield call(fetch, url, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(action.payload),
    });

    if (!response.ok) {
      const error = yield call([response, "json"]);
      throw new Error(error.message ?? "Failed to generate platform content");
    }

    const data: ContentGenerationResponse = yield call([response, "json"]);
    yield put(createPlatformInformationSuccess(data));
  } catch (error) {
    yield put(
      createPlatformInformationFailure(
        error instanceof Error ? error.message : "Unknown error"
      )
    );
  }
}

function* createProductInformationSaga(
  action: ReturnType<typeof createProductInformationRequest>
): SagaIterator {
  try {
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('authToken');
    }
    if (!token) {
      token = yield select((state: RootState) => state.auth.token);
    }

    if (!token) {
      throw new Error("No authentication token available");
    }
    const { brand_id, product } = action.payload;
    const url = `${API_BASE_URL}/brand/${brand_id}/product`;
    const response: Response = yield call(fetch, url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_name: product.product_name,
        description: product.description,
        category: product.category,
      }),
    });

    if (!response.ok) {
      const error = yield call([response, "json"]);
      throw new Error(error.message ?? "Failed to create product");
    }

    const responseData = yield call([response, "json"]);
    yield put(createProductInformationSuccess(responseData));
  } catch (error) {
    yield put(
      createProductInformationFailure(
        error instanceof Error ? error.message : "Unknown error occurred"
      )
    );
  }
}

function* getTextContentSaga(
  action: ReturnType<typeof getTextContentRequest>
): SagaIterator {
  try {
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('authToken');
    }
    
    if (!token) {
      token = yield select((state: RootState) => state.auth.token);
    }

    if (!token) {
      throw new Error("No authentication token available");
    }

    const { product_id, platform } = action.payload;
    const url = `${API_BASE_URL}/products/${product_id}/platform/${platform}/text`;

    const response: Response = yield call(fetch, url, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = yield call([response, "json"]);
      throw new Error(error.message ?? "Failed to get platform text");
    }

    const data = yield call([response, "json"]);
    yield put(getTextContentSuccess(data));
  } catch (error) {
    yield put(
      getTextContentFailure(
        error instanceof Error ? error.message : "Unknown error"
      )
    );
  }
}

function* getMediaContentSaga(
  action: ReturnType<typeof getMediaContentRequest>
): SagaIterator {
  try {
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('authToken');
    }
    
    if (!token) {
      token = yield select((state: RootState) => state.auth.token);
    }

    if (!token) {
      throw new Error("No authentication token available");
    }

    const { product_id, platform } = action.payload;
    const url = `${API_BASE_URL}/products/${product_id}/platform/${platform}/media`;

    const response: Response = yield call(fetch, url, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = yield call([response, "json"]);
      throw new Error(error.message ?? "Failed to get platform media");
    }

    const data = yield call([response, "json"]);
    yield put(getMediaContentSuccess(data));
  } catch (error) {
    yield put(
      getMediaContentFailure(
        error instanceof Error ? error.message : "Unknown error"
      )
    );
  }
}

export default function* contentStudioSaga() {
  yield takeLatest(
    "CREATE_PLATFORM_INFORMATION_REQUEST",
    createPlatformInformationSaga
  );
  yield takeLatest("CREATE_PRODUCT_INFORMATION_REQUEST", createProductInformationSaga);
  yield takeLatest("GET_TEXT_CONTENT_REQUEST", getTextContentSaga);
  yield takeLatest("GET_MEDIA_CONTENT_REQUEST", getMediaContentSaga);
}