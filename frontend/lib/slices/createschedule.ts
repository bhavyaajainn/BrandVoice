import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

type SchedulePayload = {
    userId: string
    content_id: string
    platforms: string[]
    run_at: string
    timezone: string
}

export const createSchedule = createAsyncThunk(
    'schedules/create',
    async (payload: SchedulePayload) => {
        const { userId, ...body } = payload
        const response = await axios.post(
            `https://brandvoice-backend-v61p.onrender.com/api/v1/users/${userId}/schedules/`,
            body,
            {
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        )
        return response.data
    }
)

const createScheduleSlice = createSlice({
    name: 'createSchedule',
    initialState: {
        data: null,
        loading: false,
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createSchedule.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createSchedule.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(createSchedule.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Error creating schedule'
            })
    },
})

export default createScheduleSlice.reducer
