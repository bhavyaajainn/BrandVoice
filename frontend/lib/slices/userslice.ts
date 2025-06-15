import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchUserData = createAsyncThunk(
    'userData/fetch',
    async (accessToken: string) => {
        const response = await axios.get(
            'https://brandvoice-backend-v61p.onrender.com/api/v1/auth/me',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )
        return response.data
    }
)
const userDataSlice = createSlice({
    name: 'userData',
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(fetchUserData.rejected, (state: any, action) => {
                state.loading = false
                state.error = action.error.message || 'Error fetching user data'
            })
    },
})

export default userDataSlice.reducer
