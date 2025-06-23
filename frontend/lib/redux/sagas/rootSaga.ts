
import { all, fork } from 'redux-saga/effects';
import { authSaga } from './authSaga';
import { brandSaga } from './brandSaga';
import contentStudioSaga from './contentStudioSaga';
import contentLibrarySaga from './contentLibrarySaga';

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(brandSaga),
    fork(contentStudioSaga),
    fork(contentLibrarySaga)
  ]);
}