import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { STATUS } from "../../../Constants";
import { apis } from "../../../services/api/apis";

export const getFeedbacksAction = createAsyncThunk(
    'get/feedback',
    async(payload, thunkApi) => {
        const response = await apis.getFeedbackApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else
            return thunkApi.rejectWithValue(problem)
    }
)

let initialState = {feedbackList:[]}

export const FeedbackSlice = createSlice({
    initialState,
    name:'feedback',
    reduce:{},
    extraReducers:{
        [getFeedbacksAction.pending]:state => {
            state.getFeedbackStatus = STATUS.FETCHING
        },
        [getFeedbacksAction.fulfilled]:(state, action) => {
            state.getFeedbackStatus = STATUS.SUCCESS
            state.feedbackList = action.payload
        },
        [getFeedbacksAction.rejected]:state => {
            state.getFeedbackStatus = STATUS.FAILED
        }
    }
})

export const feedbackReducer = FeedbackSlice.reducer 