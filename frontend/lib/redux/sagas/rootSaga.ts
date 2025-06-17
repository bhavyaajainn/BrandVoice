
import { all, fork } from 'redux-saga/effects';
import { authSaga } from './authSaga';
import { brandSaga } from './brandSaga';

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(brandSaga),
  ]);
}