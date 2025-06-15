// frontend/lib/redux/sagas/authSaga.ts


import { call, put, takeEvery } from 'redux-saga/effects';
import { auth } from '../../firebase';
import { getTokenSuccess, getTokenFailure, AUTH_ACTIONS } from '../actions/brandActions';


function* getTokenSaga(): Generator<any, void, any> {
  try {
    const user = auth.currentUser;
    if (user) {
      const token: string = yield call([user, 'getIdToken']);
      console.log('Firebase Auth Token:', token);
      yield put(getTokenSuccess(token));
    } else {
      throw new Error('No authenticated user found');
    }
  } catch (error: any) {
    console.error('Error getting auth token:', error);
    yield put(getTokenFailure(error.message));
  }
}

export function* authSaga() {
  yield takeEvery(AUTH_ACTIONS.GET_TOKEN_REQUEST, getTokenSaga);
}

