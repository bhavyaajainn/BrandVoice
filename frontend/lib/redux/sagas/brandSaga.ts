import { call, put, takeEvery, select } from 'redux-saga/effects';
import { BrandData } from '../types';
import { BRAND_ACTIONS, createBrandSuccess, createBrandFailure, getBrandSuccess, getBrandFailure, updateBrandSuccess, updateBrandFailure } from '../actions/brandActions';
import { RootState } from '../../store';
import { API_BASE_URL } from './util';

function createFormData(brandData: BrandData): FormData {
  const formData = new FormData();

  formData.append('brand_id', brandData.brand_id);
  formData.append('brand_name', brandData.brand_name);

  if (brandData.description) {
    formData.append('description', brandData.description);
  }

  if (brandData.platforms) {
    brandData.platforms.forEach((platform, index) => {
      formData.append(`platforms[${index}]`, platform);
    });
  }

  if (brandData.logo) {
    formData.append('logo', brandData.logo);
  }

  return formData;
}

function createUpdateFormData(brandData: Partial<BrandData>): FormData {
  const formData = new FormData();

  if (brandData.brand_name) {
    formData.append('brand_name', brandData.brand_name);
  }

  if (brandData.description) {
    formData.append('description', brandData.description);
  }

  if (brandData.platforms) {
    brandData.platforms.forEach((platform, index) => {
      formData.append(`platforms[${index}]`, platform);
    });
  }

  if (brandData.logo) {
    formData.append('logo', brandData.logo);
  }

  return formData;
}

function* createBrandSaga(action: any): Generator<any, void, any> {
  try {
    const brandData: BrandData = action.payload;
    const token: string = yield select((state: RootState) => state.auth.token);

    if (!token) {
      throw new Error('No authentication token available');
    }

    const formData = createFormData(brandData);

    const response: Response = yield call(fetch, `${API_BASE_URL}/brand`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = yield call([response, 'text']);
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    const result = yield call([response, 'json']);
    yield put(createBrandSuccess(result));
  } catch (error: any) {
    console.error('Error creating brand:', error);
    yield put(createBrandFailure(error.message || 'Failed to create brand'));
  }
}

function* getBrandSaga(action: any): Generator<any, void, any> {
  try {
    const brandId: string = action.payload;
    const token: string = yield select((state: RootState) => state.auth.token);

    if (!token) {
      throw new Error('No authentication token available');
    }

    const response: Response = yield call(fetch, `${API_BASE_URL}/brand/${brandId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });


    if (!response.ok) {
      const errorData = yield call([response, 'text']);
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    const result = yield call([response, 'json']);
    yield put(getBrandSuccess(result));
  } catch (error: any) {
    console.error('Error fetching brand:', error);
    yield put(getBrandFailure(error.message || 'Failed to fetch brand'));
  }
}

function* updateBrandSaga(action: any): Generator<any, void, any> {
  try {
    const { brandId, brandData }: { brandId: string; brandData: Partial<BrandData> } = action.payload;
    const token: string = yield select((state: RootState) => state.auth.token);

    if (!token) {
      throw new Error('No authentication token available');
    }

    const formData = createUpdateFormData(brandData);

    const response: Response = yield call(fetch, `${API_BASE_URL}/brand/${brandId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = yield call([response, 'text']);
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    const result = yield call([response, 'json']);
    yield put(updateBrandSuccess(result));
  } catch (error: any) {
    console.error('Error updating brand:', error);
    yield put(updateBrandFailure(error.message || 'Failed to update brand'));
  }
}

export function* brandSaga() {
  yield takeEvery(BRAND_ACTIONS.CREATE_BRAND_REQUEST, createBrandSaga);
  yield takeEvery(BRAND_ACTIONS.GET_BRAND_REQUEST, getBrandSaga);
  yield takeEvery(BRAND_ACTIONS.UPDATE_BRAND_REQUEST, updateBrandSaga);
}