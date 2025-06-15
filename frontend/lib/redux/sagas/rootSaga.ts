// frontend/lib/redux/sagas/rootSaga.ts
import { all } from 'redux-saga/effects';
import { authSaga } from './authSaga';
import { brandSaga } from './brandSaga';

export default function* rootSaga() {
  yield all([
    authSaga(),
    brandSaga(),
  ]);
}