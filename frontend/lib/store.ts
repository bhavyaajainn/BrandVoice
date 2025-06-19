
import { configureStore, ThunkDispatch, AnyAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./redux/sagas/rootSaga";
import userDataReducer from './slices/userslice';
import userSchedulesReducer from './slices/userschedules';
import createScheduleReducer from './slices/createschedule';
import updateScheduleReducer from './slices/updateschedule';
import deleteScheduleReducer from './slices/deleteschedule';
import { authReducer } from "./slices/authReducer";
import { brandReducer } from "./slices/brandReducer";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    brand: brandReducer,
    auth: authReducer,
    userData: userDataReducer,
    userSchedules: userSchedulesReducer,
    createSchedule: createScheduleReducer,
    updateSchedule: updateScheduleReducer,
    deleteSchedule: deleteScheduleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST', 
          'persist/REHYDRATE',
          'CREATE_BRAND_REQUEST' 
        ],
        ignoredPaths: ['brand.brandData.logo', 'payload.logo'], 
      },
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

