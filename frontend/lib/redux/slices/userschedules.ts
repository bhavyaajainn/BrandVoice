import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchUserSchedules = createAsyncThunk(
    'userSchedules/fetch',
    async (userId: string) => {
        const response = await axios.get(
            `https://brandvoice-backend-v61p.onrender.com/api/v1/users/${userId}/schedules/`,
            {
                headers: {
                    accept: 'application/json',
                },
            }
        )
        return response.data;
    }
)

const userSchedulesSlice = createSlice({
    name: 'userSchedules',
    initialState: {
        data: null,
        loading: false,
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserSchedules.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchUserSchedules.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(fetchUserSchedules.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Error fetching schedules'
            })
    },
})

export default userSchedulesSlice.reducer
