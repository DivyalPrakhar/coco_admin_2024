import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { STATUS } from '../../../Constants'
import { SuccessMessage } from '../../../Constants/CommonAlerts'
import { apis } from '../../../services/api/apis'

export const sendNotificaitonAction = createAsyncThunk(
    'send/notification',
    async(payload, thunkAPI) => {
        const response = await apis.sendNotificaitonApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getNotificationsAction = createAsyncThunk(
    'get/notifications',
    async(payload, thunkAPI) => {
        const response = await apis.getNotificationApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

const initialState = {}
export const notificationSlice = createSlice({
    name:'notifications',
    initialState,
    reducers:{
        resetSendNotification:(state) => {
            state.sendNotificationStatus = STATUS.NOT_STARTED
        }
    },
    extraReducers:{
        [sendNotificaitonAction.pending]: (state) => {
            state.sendNotificationStatus = STATUS.FETCHING
        },
        [sendNotificaitonAction.fulfilled]: (state, action) => {
            SuccessMessage('Message sent')
            state.sendNotificationStatus = STATUS.SUCCESS
        },
        [sendNotificaitonAction.rejected]:(state) => {
            state.sendNotificationStatus = STATUS.FAILED
        },

        [getNotificationsAction.pending]: (state) => {
            state.getNotificationStatus = STATUS.FETCHING
        },
        [getNotificationsAction.fulfilled]: (state, action) => {
            state.getNotificationStatus = STATUS.SUCCESS
            state.notificationList = action.payload
        },
        [getNotificationsAction.rejected]:(state) => {
            state.getNotificationStatus = STATUS.FAILED
        },
    }
})

export const notificationReducer = notificationSlice.reducer
export const {resetSendNotification} = notificationSlice.actions