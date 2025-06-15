import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

type UpdateSchedulePayload = {
    userId: string
    scheduleId: string
    platforms: string[]
    run_at: string
    timezone: string
    status: 'upcoming' | 'published' | 'failed' 
}

export const updateSchedule = createAsyncThunk(
    'schedule/update',
    async (payload: UpdateSchedulePayload) => {
        const { userId, scheduleId, ...body } = payload
        const response = await axios.put(
            `https://brandvoice-backend-v61p.onrender.com/api/v1/users/${userId}/schedules/${scheduleId}`,
            body,
            {
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        )
        return response.data;
    }
)

const updateScheduleSlice = createSlice({
    name: 'updateSchedule',
    initialState: {
        data: null,
        loading: false,
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateSchedule.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateSchedule.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(updateSchedule.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Error updating schedule'
            })
    },
})

export default updateScheduleSlice.reducer
