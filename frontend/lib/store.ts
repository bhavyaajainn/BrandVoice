import { configureStore } from '@reduxjs/toolkit'
import userDataReducer from './slices/userslice'
import userSchedulesReducer from './slices/userschedules'
import createScheduleReducer from './slices/createschedule'
import updateScheduleReducer from './slices/updateschedule'
import deleteScheduleReducer from './slices/deleteschedule'

export const store = configureStore({
  reducer: {
    userData: userDataReducer,
    userSchedules: userSchedulesReducer,
    createSchedule: createScheduleReducer,
    updateSchedule: updateScheduleReducer,
    deleteSchedule: deleteScheduleReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
