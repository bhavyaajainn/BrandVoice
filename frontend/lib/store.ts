
import { authReducer } from "./redux/reducers/authReducer";
import { brandReducer } from "./redux/reducers/brandReducer";
import rootSaga from "./redux/sagas/rootSaga";
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import userDataReducer from './slices/userslice'
import userSchedulesReducer from './slices/userschedules'
import createScheduleReducer from './slices/createschedule'
import updateScheduleReducer from './slices/updateschedule'
import deleteScheduleReducer from './slices/deleteschedule'

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
export type AppDispatch = typeof store.dispatch;

