// frontend/lib/redux/sagas/brandSaga.ts
import { call, put, takeEvery, select } from 'redux-saga/effects';
import { BrandData } from '../types';
import { BRAND_ACTIONS, createBrandSuccess, createBrandFailure } from '../actions/brandActions';
import { RootState } from '../../store';

function createFormData(brandData: BrandData): FormData {
  const formData = new FormData();
  
  formData.append('brand_id', brandData.brand_id);
  formData.append('brand_name', brandData.brand_name);
  
  if (brandData.description) {
    formData.append('description', brandData.description);
  }
  
  if (brandData.platforms) {
    formData.append('platforms', brandData.platforms);
  }
  
  if (brandData.logo) {
    formData.append('logo', brandData.logo);
  }
  
  if (brandData.user_id) {
    formData.append('user_id', brandData.user_id);
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
    
    const response: Response = yield call(fetch, 'https://brandvoice-backend-172212688771.us-central1.run.app/brand', {
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
    console.log('Brand created successfully:', result);
    yield put(createBrandSuccess(result));
  } catch (error: any) {
    console.error('Error creating brand:', error);
    yield put(createBrandFailure(error.message));
  }
}

export function* brandSaga() {
  yield takeEvery(BRAND_ACTIONS.CREATE_BRAND_REQUEST, createBrandSaga);
}

