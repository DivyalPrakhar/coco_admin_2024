import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { STATUS } from '../../../Constants'
import { apis } from '../../../services/api/apis'

export const getDashboardAciton = createAsyncThunk(
    'dashboard/get',
    async(payload, thunkApi) => {
        const response = await apis.getDashboardApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else
            return thunkApi.rejectWithValue(problem)
    }
)

const initialState = {}

const DashboardSlice = createSlice({
    name:'dashboard',
    initialState,
    extraReducers:{
        [getDashboardAciton.pending]:state => {
            state.getDashboardStatus = STATUS.FETCHING
        },
        [getDashboardAciton.fulfilled]:(state, action) => {
            state.getDashboardStatus = STATUS.SUCCESS
            state.dashboardData = action.payload
        },
        [getDashboardAciton.rejected]:state => {
            state.getDashboardStatus = STATUS.FAILED
        }
    }
})

export const dashboardReducer = DashboardSlice.reducer