import { configureStore } from '@reduxjs/toolkit'
import userDataReducer from './slices/userslice'
import userSchedulesReducer from './slices/userschedules'
import createScheduleReducer from './slices/createschedule'

export const store = configureStore({
  reducer: {
    userData: userDataReducer,
    userSchedules: userSchedulesReducer,
    createSchedule: createScheduleReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
