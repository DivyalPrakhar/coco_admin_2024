import { concat, map } from 'lodash';
import { STATUS } from '../../../Constants';
import { ErrorMessage, SuccessMessage } from '../../../Constants/CommonAlerts';
import { apis } from "../../../services/api/apis";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const addOfflineCourseAction = createAsyncThunk(
    'add/offline-course',
    async (payload, thunkAPI) => {
        const response = await apis.addOfflineCourseApi(payload)
        const { ok, problem, data } = response
        if (ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const getOfflineCourseAction = createAsyncThunk(
    'get/offline-course',
    async (payload, thunkAPI) => {
        const response = await apis.getOfflineCourseApi(payload)
        const { ok, problem, data } = response
        if (ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const updateOfflineCourseAction = createAsyncThunk(
    'update/offline-course',
    async (payload, thunkAPI) => {
        const response = await apis.updateOfflineCourseApi(payload)
        const { ok, problem, data } = response
        if (ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

const initialState = { assignmentsList: [], answersheetsList: [] }

const offlineCourseSlice = createSlice({
    name: 'offline-course',
    initialState,
    reducers: {
        resetOfflineCourseStatus: (state) => {
            state.addOfflineCourseStatus = STATUS.NOT_STARTED
        },
    },
    extraReducers: {
        [addOfflineCourseAction.pending]: (state) => {
            state.addOfflineCourseStatus = STATUS.FETCHING
        },
        [addOfflineCourseAction.fulfilled]: (state, action) => {
            state.addOfflineCourseStatus = STATUS.SUCCESS
            state.allOfflineCourses = concat(state.allOfflineCourses, action.payload)
            SuccessMessage()
        },
        [addOfflineCourseAction.rejected]: (state) => {
            ErrorMessage()
            state.addOfflineCourseStatus = STATUS.FAILED
        },

        [getOfflineCourseAction.pending]: (state) => {
            state.getOfflineCourseStatus = STATUS.FETCHING
        },
        [getOfflineCourseAction.fulfilled]: (state, action) => {
            state.getOfflineCourseStatus = STATUS.SUCCESS
            state.allOfflineCourses = action.payload
        },
        [getOfflineCourseAction.rejected]: (state) => {
            ErrorMessage()
            state.getOfflineCourseStatus = STATUS.FAILED
        },

        [updateOfflineCourseAction.pending]: (state) => {
            state.updateOfflineCourseStatus = STATUS.FETCHING
        },
        [updateOfflineCourseAction.fulfilled]: (state, action) => {
            state.updateOfflineCourseStatus = STATUS.SUCCESS
            state.allOfflineCourses = map(state.allOfflineCourses, course => course._id === action.payload._id ? action.payload : course)
        },
        [updateOfflineCourseAction.rejected]: (state) => {
            ErrorMessage()
            state.updateOfflineCourseStatus = STATUS.FAILED
        },
    }
})

export const { resetOfflineCourseStatus } = offlineCourseSlice.actions
export const offlineCourseReducer = offlineCourseSlice.reducer