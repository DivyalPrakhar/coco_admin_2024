import _ from "lodash"
import { STATUS } from "../../../Constants"
import { SuccessMessage } from "../../../Constants/CommonAlerts"
import { apis } from "../../../services/api/apis"
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")

export const addNoticeAction = createAsyncThunk(
    'notice/add',
    async(payload, thunkAPI) => {
        const response = await apis.addNoticeApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getAllNoticeAction = createAsyncThunk(
    'all-notice/get',
    async(payload, thunkAPI) => {
        const response = await apis.getAllNoticeApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const updateNoticeAction = createAsyncThunk(
    'notice/update',
    async(payload, thunkAPI) => {
        const response = await apis.updateNoticeApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const deleteNoticeAction = createAsyncThunk(
    'notice/delete',
    async(payload, thunkAPI) => {
        const response = await apis.deleteNoticeApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return {data, extraData:payload}
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

const initialState = { noticeList:[]}

export const noticeSlice = createSlice({
    name:'notice',
    initialState,
    reducers:{
        resetAddNotice:(state) => {
            state.addNoticeStatus = STATUS.NOT_STARTED
            state.updateNoticeStatus = STATUS.NOT_STARTED
        }
    },
    extraReducers:{
        [deleteNoticeAction.pending]: (state) => {
            state.deleteNoticeStatus = STATUS.FETCHING
        },
        [deleteNoticeAction.fulfilled]: (state, action) => {
            state.deleteNoticeStatus = STATUS.SUCCESS
            _.remove(state.noticeList,d => d._id == action.payload.extraData.noticeId)
            SuccessMessage('Notice removed')
        },
        [deleteNoticeAction.rejected]:(state) => {
            state.deleteNoticeStatus = STATUS.FAILED
        },
        
        [updateNoticeAction.pending]: (state) => {
            state.updateNoticeStatus = STATUS.FETCHING
        },
        [updateNoticeAction.fulfilled]: (state, action) => {
            state.updateNoticeStatus = STATUS.SUCCESS
            state.noticeList = state.noticeList.map(d => d._id == action.payload._id ? action.payload : d)
            SuccessMessage('Notice updated')
        },
        [updateNoticeAction.rejected]:(state) => {
            state.updateNoticeStatus = STATUS.FAILED
        },
        
        [addNoticeAction.pending]: (state) => {
            state.addNoticeStatus = STATUS.FETCHING
        },
        [addNoticeAction.fulfilled]: (state, action) => {
            state.addNoticeStatus = STATUS.SUCCESS
            state.noticeList.push(action.payload)
            SuccessMessage('Notice added')
        },
        [addNoticeAction.rejected]:(state) => {
            state.addNoticeStatus = STATUS.FAILED
        },
        
        [getAllNoticeAction.pending]: (state) => {
            state.getallNoticeStatus = STATUS.FETCHING
        },
        [getAllNoticeAction.fulfilled]: (state, action) => {
            state.getallNoticeStatus = STATUS.SUCCESS
            state.noticeList = action.payload
        },
        [getAllNoticeAction.rejected]:(state) => {
            state.getallNoticeStatus = STATUS.FAILED
        },
    }

})

export const {resetAddNotice} = noticeSlice.actions
export const noticeReducer =  noticeSlice.reducer