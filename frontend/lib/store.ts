import { authReducer } from "./redux/reducers/authReducer";
import { brandReducer } from "./redux/reducers/brandReducer";
import rootSaga from "./redux/sagas/rootSaga";
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    brand: brandReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware: (arg0: { thunk: boolean; serializableCheck: { ignoredActions: string[]; }; }) => any[]) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;