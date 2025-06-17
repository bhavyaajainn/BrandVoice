
import { call, put, takeEvery } from 'redux-saga/effects';
import { auth } from '../../firebase';
import { AUTH_ACTIONS, getTokenFailure, getTokenSuccess } from '../actions/authActions';


function* getTokenSaga(): Generator<any, void, any> {
  try {
    const user = auth?.currentUser;
    if (user) {
      const token: string = yield call([user, 'getIdToken']);
      
      yield put(getTokenSuccess(token));
    } else {
      throw new Error('No authenticated user found');
    }
  } catch (error: any) {
    console.error('Error getting auth token:', error);
    yield put(getTokenFailure(error.message || 'Failed to get auth token'));
  }
}

export function* authSaga() {
  yield takeEvery(AUTH_ACTIONS.GET_TOKEN_REQUEST, getTokenSaga);
}