import { call, put, select, takeLatest } from "redux-saga/effects";
import { API_BASE_URL } from "./util";
import { SagaIterator } from "redux-saga";
import { RootState } from "@/lib/store";
import {
  getBrandProductsRequest,
  getBrandProductsSuccess,
  getBrandProductsFailure,
  getProductPlatformContentRequest,
  getProductPlatformContentSuccess,
  getProductPlatformContentFailure,
  CONTENT_LIBRARY_ACTIONS
} from "../actions/contentLibraryActions";

function* getBrandProductsSaga(
  action: ReturnType<typeof getBrandProductsRequest>
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

    const brandId: string = action.payload;
    const url = `${API_BASE_URL}/brand/${brandId}/products`;

    const response: Response = yield call(fetch, url, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = yield call([response, "json"]);
      throw new Error(error.message ?? "Failed to get brand products");
    }

    const data = yield call([response, "json"]);
    yield put(getBrandProductsSuccess(data));
  } catch (error) {
    yield put(
      getBrandProductsFailure(
        error instanceof Error ? error.message : "Unknown error"
      )
    );
  }
}

function* getProductPlatformContentSaga(
  action: ReturnType<typeof getProductPlatformContentRequest>
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

    const { productId, platform } = action.payload;
    const url = `${API_BASE_URL}/products/${productId}/platform/${platform}`;

    const response: Response = yield call(fetch, url, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = yield call([response, "json"]);
      throw new Error(error.message ?? "Failed to get product platform content");
    }

    const data = yield call([response, "json"]);
    yield put(getProductPlatformContentSuccess(data));
  } catch (error) {
    yield put(
      getProductPlatformContentFailure(
        error instanceof Error ? error.message : "Unknown error"
      )
    );
  }
}

export default function* contentLibrarySaga() {
  yield takeLatest(
    CONTENT_LIBRARY_ACTIONS.GET_BRAND_PRODUCTS_REQUEST,
    getBrandProductsSaga
  );
  yield takeLatest(
    CONTENT_LIBRARY_ACTIONS.GET_PRODUCT_PLATFORM_CONTENT_REQUEST,
    getProductPlatformContentSaga
  );
}