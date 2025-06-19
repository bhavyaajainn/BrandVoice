import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

type DeleteSchedulePayload = {
    userId: string
    scheduleId: string
}

export const deleteSchedule = createAsyncThunk(
    'schedule/delete',
    async ({ userId, scheduleId }: DeleteSchedulePayload) => {
        const response = await axios.delete(
            `https://brandvoice-backend-v61p.onrender.com/api/v1/users/${userId}/schedules/${scheduleId}`,
            {
                headers: {
                    accept: '*/*',
                },
            }
        )
        return response.data;
    }
)

const deleteScheduleSlice = createSlice({
    name: 'deleteSchedule',
    initialState: {
        loading: false,
        error: null as string | null,
        success: false,
    },
    reducers: {
        resetDeleteState: (state) => {
            state.loading = false
            state.error = null
            state.success = false
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteSchedule.pending, (state) => {
                state.loading = true
                state.error = null
                state.success = false
            })
            .addCase(deleteSchedule.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(deleteSchedule.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Error deleting schedule'
            })
    },
})

export const { resetDeleteState } = deleteScheduleSlice.actions
export default deleteScheduleSlice.reducer
