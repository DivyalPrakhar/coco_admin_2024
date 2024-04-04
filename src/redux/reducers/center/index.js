import { STATUS } from "../../../Constants"
import { ErrorMessage, SuccessMessage } from "../../../Constants/CommonAlerts"
import { apis } from "../../../services/api/apis"
import _ from 'lodash'

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")

export const getAllCenterAction = createAsyncThunk(
    'get/all-center',
    async (payload, thunkAPI) => {
        const response = await apis.getALLCenterApi(payload)
        const { ok, problem, data } = response

        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const addCenterAction = createAsyncThunk(
    'add/center',
    async (payload, thunkAPI) => {
        const response = await apis.addCenterApi(payload)
        const { ok, problem, data } = response

        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

const initialState = {}

export const centersSlice = createSlice({
    name: 'center',
    initialState,
    reducers: {
        resetCenter:(state) => {
            state.addCenterStatus = STATUS.NOT_STARTED
        }
    },
    extraReducers: {
        [getAllCenterAction.pending]: (state) => {
            state.getAllCenterStatus = STATUS.FETCHING
        },
        [getAllCenterAction.fulfilled]: (state, action) => {
            state.getAllCenterStatus = STATUS.SUCCESS
            state.allCenterList = action.payload
        },
        [getAllCenterAction.rejected]: (state) => {
            state.getAllCenterStatus = STATUS.FAILED
        },

        [addCenterAction.pending]: (state) => {
            state.addCenterStatus = STATUS.FETCHING
        },
        [addCenterAction.fulfilled]: (state, action) => {
            state.addCenterStatus = STATUS.SUCCESS
            console.log(state.allCenterList)
            state.allCenterList = [...state.allCenterList, action.payload]
        },
        [addCenterAction.rejected]: (state) => {
            state.addCenterStatus = STATUS.FAILED
        },
    }
})

export const { resetCenter } = centersSlice.actions
export const centerReducer = centersSlice.reducer