import { concat, map } from 'lodash';
import { STATUS } from '../../../Constants';
import { ErrorMessage, SuccessMessage } from '../../../Constants/CommonAlerts';
import { apis } from "../../../services/api/apis";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const addEnquiryAction = createAsyncThunk(
    'add/enquiry',
    async (payload, thunkAPI) => {
        const response = await apis.addEnquiryApi(payload)
        const { ok, problem, data } = response
        if (ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const getEnquiryAction = createAsyncThunk(
    'get/enquiry',
    async (payload, thunkAPI) => {
        const response = await apis.getEnquiryApi(payload)
        const { ok, problem, data } = response
        if (ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const updateEnquiryAction = createAsyncThunk(
    'update/enquiry',
    async (payload, thunkAPI) => {
        const response = await apis.updateEnquiryApi(payload)
        const { ok, problem, data } = response
        if (ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const addOfflinePaymentAction = createAsyncThunk(
    'add/payment/enquiry',
    async (payload, thunkAPI) => {
        const response = await apis.addOfflinePaymentApi(payload)
        const { ok, problem, data } = response
        if (ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const addRemarksAction = createAsyncThunk(
    'add/remark/enquiry',
    async (payload, thunkAPI) => {
        const response = await apis.updateEnquiryApi(payload)
        const { ok, problem, data } = response
        if (ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

const initialState = { assignmentsList: [], answersheetsList: [] }

const enquirySlice = createSlice({
    name: 'enquiry',
    initialState,
    reducers: {
        resetBatchStatus: (state) => {
            state.assignBatchStatus = STATUS.NOT_STARTED
        },
        resetPaymentStatus: (state) => {
            state.addOfflinePaymentStatus = STATUS.NOT_STARTED
        },
        resetRemarkStatus: (state) => {
            state.addRemarksStatus = STATUS.NOT_STARTED
        },
        resetRemarksData: (state) => {
            state.remarkList = []
        }
    },
    extraReducers: {
        [addEnquiryAction.pending]: (state) => {
            state.addEnquiryStatus = STATUS.FETCHING
        },
        [addEnquiryAction.fulfilled]: (state, action) => {
            state.addEnquiryStatus = STATUS.SUCCESS
            state.allEnquirys = concat(state.allEnquirys, action.payload)
            SuccessMessage()
        },
        [addEnquiryAction.rejected]: (state) => {
            ErrorMessage()
            state.addEnquiryStatus = STATUS.FAILED
        },

        [getEnquiryAction.pending]: (state) => {
            state.getEnquiryStatus = STATUS.FETCHING
        },
        [getEnquiryAction.fulfilled]: (state, action) => {
            state.getEnquiryStatus = STATUS.SUCCESS
            state.allEnquirys = action.payload
        },
        [getEnquiryAction.rejected]: (state) => {
            ErrorMessage()
            state.getEnquiryStatus = STATUS.FAILED
        },

        [updateEnquiryAction.pending]: (state) => {
            state.updateEnquiryStatus = STATUS.FETCHING
        },
        [updateEnquiryAction.fulfilled]: (state, action) => {
            state.updateEnquiryStatus = STATUS.SUCCESS
            state.allEnquirys = ({ ...state.allEnquirys, docs: map(state.allEnquirys.docs, doc => doc._id === action.payload._id ? ({ ...doc, status: action.payload.status, remarks: action.payload.remarks }) : doc) })
        },
        [updateEnquiryAction.rejected]: (state) => {
            ErrorMessage()
            state.updateEnquiryStatus = STATUS.FAILED
        },

        [addRemarksAction.pending]: (state) => {
            state.addRemarksStatus = STATUS.FETCHING
        },
        [addRemarksAction.fulfilled]: (state, action) => {
            state.addRemarksStatus = STATUS.SUCCESS
            state.remarkList = action.payload.remarks
            state.allEnquirys = ({ ...state.allEnquirys, docs: map(state.allEnquirys.docs, doc => doc._id === action.payload._id ? ({ ...doc, status: action.payload.status, remarks: action.payload.remarks }) : doc) })
        },
        [addRemarksAction.rejected]: (state) => {
            ErrorMessage()
            state.addRemarksStatus = STATUS.FAILED
        },

        [addOfflinePaymentAction.pending]: (state) => {
            state.addOfflinePaymentStatus = STATUS.FETCHING
        },
        [addOfflinePaymentAction.fulfilled]: (state, action) => {
            state.addOfflinePaymentStatus = STATUS.SUCCESS
            state.offlinePaymentDetails = action.payload
            SuccessMessage()
        },
        [addOfflinePaymentAction.rejected]: (state) => {
            ErrorMessage()
            state.addOfflinePaymentStatus = STATUS.FAILED
        },
    }
})

export const { resetBatchStatus, resetPaymentStatus, resetRemarkStatus, resetRemarksData } = enquirySlice.actions
export const enquiryReducer = enquirySlice.reducer