import _ from "lodash"
import { STATUS } from "../../../Constants"
import { SuccessMessage } from "../../../Constants/CommonAlerts"
import { apis } from "../../../services/api/apis"
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")

export const addEventAction = createAsyncThunk(
    'event/add',
    async(payload, thunkAPI) => {
        const response = await apis.addEventApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getAllEventAction = createAsyncThunk(
    'all-event/get',
    async(payload, thunkAPI) => {
        const response = await apis.getAllEventApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getEventAction = createAsyncThunk(
    'event/get',
    async(payload, thunkAPI) => {
        const response = await apis.getEventApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const updateEventAction = createAsyncThunk(
    'event/update',
    async(payload, thunkAPI) => {
        const response = await apis.updateEventApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const deleteEventAction = createAsyncThunk(
    'event/delete',
    async(payload, thunkAPI) => {
        const response = await apis.deleteEventApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return {data, extraData:payload}
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getAllEventUser = createAsyncThunk(
    'event-user/all/filter',
    async(payload, thunkAPI) => {
        const response = await apis.getAllEventUserApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const updateUserEventAction = createAsyncThunk(
    'event-user/update',
    async(payload, thunkAPI) => {
        const response = await apis.updateUserEventApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

const initialState = { eventList:[]}

export const eventSlice = createSlice({
    name:'event',
    initialState,
    reducers:{
        resetAddEvent:(state) => {
            state.addEventStatus = STATUS.NOT_STARTED
            state.updateEventStatus = STATUS.NOT_STARTED
        }
    },
    extraReducers:{
        [deleteEventAction.pending]: (state) => {
            state.deleteEventStatus = STATUS.FETCHING
        },
        [deleteEventAction.fulfilled]: (state, action) => {
            state.deleteEventStatus = STATUS.SUCCESS
            _.remove(state.eventList,d => d._id == action.payload.extraData.eventId)
            SuccessMessage('Event removed')
        },
        [deleteEventAction.rejected]:(state) => {
            state.deleteEventStatus = STATUS.FAILED
        },
        
        [updateEventAction.pending]: (state) => {
            state.updateEventStatus = STATUS.FETCHING
        },
        [updateEventAction.fulfilled]: (state, action) => {
            state.updateEventStatus = STATUS.SUCCESS
            state.eventList = state.eventList.map(d => d._id == action.payload._id ? action.payload : d)
            SuccessMessage('Event updated')
        },
        [updateEventAction.rejected]:(state) => {
            state.updateEventStatus = STATUS.FAILED
        },
        
        [addEventAction.pending]: (state) => {
            state.addEventStatus = STATUS.FETCHING
        },
        [addEventAction.fulfilled]: (state, action) => {
            state.addEventStatus = STATUS.SUCCESS
            state.eventList.push(action.payload)
            SuccessMessage('Event added')
        },
        [addEventAction.rejected]:(state) => {
            state.addEventStatus = STATUS.FAILED
        },
        
        [getAllEventAction.pending]: (state) => {
            state.getallEventStatus = STATUS.FETCHING
        },
        [getAllEventAction.fulfilled]: (state, action) => {
            state.getallEventStatus = STATUS.SUCCESS
            state.eventList = action.payload
        },
        [getAllEventAction.rejected]:(state) => {
            state.getallEventStatus = STATUS.FAILED
        },
        [getEventAction.pending]: (state) => {
            state.getEventStatus = STATUS.FETCHING
        },
        [getEventAction.fulfilled]: (state, action) => {
            state.getEventStatus = STATUS.SUCCESS
            state.eventDetails = action.payload
        },
        [getEventAction.rejected]:(state) => {
            state.getEventStatus = STATUS.FAILED
        },

        [getAllEventUser.pending]: (state) => {
            state.getAllEventUserStatus = STATUS.FETCHING
        },
        [getAllEventUser.fulfilled]: (state, action) => {
            state.getAllEventUserStatus = STATUS.SUCCESS
            state.eventUserList = action.payload
        },
        [getAllEventUser.rejected]:(state) => {
            state.getAllEventUserStatus = STATUS.FAILED
        },

        [updateUserEventAction.pending]: (state) => {
            state.updateUserEventStatus = STATUS.FETCHING
        },
        [updateUserEventAction.fulfilled]: (state, action) => {
            SuccessMessage()
            state.updateUserEventStatus = STATUS.SUCCESS
            state.eventUserList = ({ ...state.eventUserList , docs: state.eventUserList.docs.map(d => d._id === action.payload._id ? action.payload : d)})
        },
        [updateUserEventAction.rejected]:(state) => {
            state.updateUserEventStatus = STATUS.FAILED
        },
    }

})

export const {resetAddEvent} = eventSlice.actions
export const eventReducer =  eventSlice.reducer