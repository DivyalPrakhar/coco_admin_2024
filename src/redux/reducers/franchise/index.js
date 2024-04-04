import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { map } from "lodash";
import { STATUS } from "../../../Constants";
import { SuccessMessage } from "../../../Constants/CommonAlerts";
import { apis } from "../../../services/api/apis";

export const getFranchiseEnquiryAction = createAsyncThunk(
    'get/franchise',
    async (payload, thunkApi) => {
        const response = await apis.getFranchiseEnquiryApi(payload)
        const { ok, problem, data } = response

        if (ok)
            return data
        else
            return thunkApi.rejectWithValue(problem)
    }
)

export const updateFranchiseEnquiryAction = createAsyncThunk(
    'update/franchiseEnquiry',
    async (payload, thunkAPI) => {
        const response = await apis.updateFranchiseEnquiryApi(payload)
        const { ok, problem, data } = response

        if (ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

let initialState = { franchiseEnquiryList: [] }

export const FranchiseSlice = createSlice({
    initialState,
    name: 'franshise',
    reduce: {},
    extraReducers: {
        [getFranchiseEnquiryAction.pending]: state => {
            state.getFranchiseEnquiryStatus = STATUS.FETCHING
        },
        [getFranchiseEnquiryAction.fulfilled]: (state, action) => {
            state.getFranchiseEnquiryStatus = STATUS.SUCCESS
            state.franchiseEnquiryList = action.payload
        },
        [getFranchiseEnquiryAction.rejected]: state => {
            state.getFranchiseEnquiryStatus = STATUS.FAILED
        },

        [updateFranchiseEnquiryAction.pending]: state => {
            state.updateFranchiseEnquiryStatus = STATUS.FETCHING
        },
        [updateFranchiseEnquiryAction.fulfilled]: (state, action) => {
            state.updateFranchiseEnquiryStatus = STATUS.SUCCESS
            state.franchiseEnquiryList.docs = map(current(state.franchiseEnquiryList?.docs), d => d._id === action.payload._id ? action.payload : d)
            SuccessMessage()
        },
        [updateFranchiseEnquiryAction.rejected]: state => {
            state.updateFranchiseEnquiryStatus = STATUS.FAILED
        }
    }
})

export const FranchiseEnquiryReducer = FranchiseSlice.reducer 