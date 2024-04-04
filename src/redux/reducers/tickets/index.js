import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { STATUS } from '../../../Constants'
import { apis } from '../../../services/api/apis'
import _ from 'lodash'
import { SuccessMessage } from '../../../Constants/CommonAlerts'

export const getAllTicketsAction = createAsyncThunk(
    "get/tickets",
    async(payload, thunkAPI) => {
        const response = await apis.getAllTicketsApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const getSingleTicketAction = createAsyncThunk(
    "get/single-tickets",
    async(payload, thunkAPI) => {
        const response = await apis.getSingleTicketApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const addTicketCommentAction = createAsyncThunk(
    "add/ticket-comment",
    async(payload, thunkAPI) => {
        const response = await apis.addTicketCommentApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const updateTicketAction = createAsyncThunk(
    "update/single-tickets",
    async(payload, thunkAPI) => {
        const response = await apis.updateTicketApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

let initialState = {}
const ticketsSlice = createSlice({
    name:'tickets',
    initialState,
    extraReducers:{
        [getAllTicketsAction.pending]:state => {
            state.getAllTicketsStatus = STATUS.FETCHING
        },
        [getAllTicketsAction.fulfilled]:(state, action) => {
            state.getAllTicketsStatus = STATUS.SUCCESS
            state.allTickets = action.payload
        },
        [getAllTicketsAction.rejected]:state => {
            state.getAllTicketsStatus = STATUS.FAILED
        },

        [getSingleTicketAction.pending]:state => {
            state.getTicketStatus = STATUS.FETCHING
        },
        [getSingleTicketAction.fulfilled]:(state, action) => {
            state.getTicketStatus = STATUS.SUCCESS
            state.currentTicket = action.payload
        },
        [getSingleTicketAction.rejected]:state => {
            state.getTicketStatus = STATUS.FAILED
        },

        [addTicketCommentAction.pending]:state => {
            state.addTicketCommentStatus = STATUS.FETCHING
        },
        [addTicketCommentAction.fulfilled]:(state, action) => {
            state.addTicketCommentStatus = STATUS.SUCCESS
            state.currentTicket.comments.docs.push(action.payload)
        },
        [addTicketCommentAction.rejected]:state => {
            state.addTicketCommentStatus = STATUS.FAILED
        },

        [updateTicketAction.pending]:state => {
            state.updateTicktStatus = STATUS.FETCHING
        },
        [updateTicketAction.fulfilled]:(state, action) => {
            SuccessMessage('Ticket Closed')
            state.updateTicktStatus = STATUS.SUCCESS
            let indx = _.findIndex(state.allTickets.docs,t => t._id === action.payload._id)

            if(indx !== -1)
                state.allTickets.docs[indx].status = action.payload.status
        },
        [updateTicketAction.rejected]:state => {
            state.updateTicktStatus = STATUS.FAILED
        }
    }
}) 

export const ticketsReducer = ticketsSlice.reducer