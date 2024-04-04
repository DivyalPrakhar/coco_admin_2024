import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { map } from "lodash";
import { STATUS } from "../../../Constants";
import { SuccessMessage } from "../../../Constants/CommonAlerts";
import { apis } from "../../../services/api/apis";

export const getCareerJobApplicationAction = createAsyncThunk(
    'get/jobApplication',
    async(payload, thunkApi) => {
        const response = await apis.getCareerJobApplicationApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else
            return thunkApi.rejectWithValue(problem)
    }
)

export const updateCareerJobApplicationAction = createAsyncThunk(
    'update/career',
    async (payload, thunkAPI) => {
        const response = await apis.updateCareerJobApplicationApi(payload)
        const { ok, problem, data } = response

        if (ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

let initialState = {careerJobApplicationList:[]}

export const CareerSlice = createSlice({
    initialState,
    name:'career',
    reduce:{},
    extraReducers:{
        [getCareerJobApplicationAction.pending]:state => {
            state.getCareerJobApplicationStatus = STATUS.FETCHING
        },
        [getCareerJobApplicationAction.fulfilled]:(state, action) => {
            state.getCareerJobApplicationStatus = STATUS.SUCCESS
            state.careerJobApplicationList = action.payload
        },
        [getCareerJobApplicationAction.rejected]:state => {
            state.getCareerJobApplicationStatus = STATUS.FAILED
        },
        [updateCareerJobApplicationAction.pending]:state => {
            state.updateCareerJobApplicationStatus = STATUS.FETCHING
        },
        [updateCareerJobApplicationAction.fulfilled]:(state, action) => {
            state.updateCareerJobApplicationStatus = STATUS.SUCCESS
            state.careerJobApplicationList.docs = map(current(state.careerJobApplicationList?.docs), d => d._id === action.payload._id ? action.payload : d)
            SuccessMessage()
        },
        [updateCareerJobApplicationAction.rejected]:state => {
            state.updateCareerJobApplicationStatus = STATUS.FAILED
        },
    }
})

export const CareerJobApplicationReducer = CareerSlice.reducer 