import { configureStore, ThunkDispatch, AnyAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./redux/sagas/rootSaga";
import userDataReducer from './redux/slices/userslice';
import userSchedulesReducer from './redux/slices/userschedules';
import createScheduleReducer from './redux/slices/createschedule';
import updateScheduleReducer from './redux/slices/updateschedule';
import deleteScheduleReducer from './redux/slices/deleteschedule';
import { authReducer } from "./redux/slices/authReducer";
import { brandReducer } from "./redux/slices/brandReducer";
import { platformReducer } from "./redux/slices/platformReducer";
import { productReducer } from "./redux/slices/productReducer";
import { mediaContentReducer } from "./redux/slices/mediaContentReducer";
import { textContentReducer } from "./redux/slices/textContentReducer";
import { saveContentReducer } from "./redux/slices/saveContentReducer";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    brand: brandReducer,
    auth: authReducer,
    userData: userDataReducer,
    product: productReducer,
    platform: platformReducer,
    userSchedules: userSchedulesReducer,
    createSchedule: createScheduleReducer,
    updateSchedule: updateScheduleReducer,
    deleteSchedule: deleteScheduleReducer,
    textContent: textContentReducer,
    mediaContent: mediaContentReducer,
    saveContent: saveContentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST', 
          'persist/REHYDRATE',
          'CREATE_BRAND_REQUEST',
          'SAVE_CONTENT_REQUEST'
        ],
        ignoredPaths: ['brand.brandData.logo', 'payload.logo', 'saveContent.data', 'payload.data'], 
      },
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;