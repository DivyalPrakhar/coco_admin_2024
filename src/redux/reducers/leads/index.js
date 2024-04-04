import { STATUS } from "../../../Constants"
import { apis } from "../../../services/api/apis"

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")


export const getLeadsAction = createAsyncThunk(
    'leads/all',
    async(payload, thunkAPI) => {
        // console.log('Calling...')
        const response = await apis.getAllLeadsApi(payload)
        const {ok, problem, data} = response

        if(ok){
            // console.log('Get Lead Success : ', data)
            return data
        }else{
            console.log('Failed : ', problem)
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getAllLeadsAction = createAsyncThunk(
    'leads/leads-all',
    async(payload, thunkAPI) => {
        // console.log('Calling...')
        const response = await apis.getLeadsApi(payload)
        const {ok, problem, data} = response

        if(ok){
            // console.log('Get Lead Success : ', data)
            return data
        }else{
            console.log('Failed : ', problem)
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getUserLeadsAction = createAsyncThunk(
    'leads/user/get',
    async(payload, thunkAPI) => {
        // console.log('Calling...')
        const response = await apis.getUserLeadsApi(payload)
        const {ok, problem, data} = response

        if(ok){
            // console.log('Get Lead Success : ', data)
            return data
        }else{
            console.log('Failed : ', problem)
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

const initialState = { LeadsList:[]}

export const LeadSlice = createSlice({
    name:'lead',
    initialState,
    extraReducers:{
        [getUserLeadsAction.pending]: (state) => {
            state.getUserLeadsStatus = STATUS.FETCHING
        },
        [getUserLeadsAction.fulfilled]: (state, action) => {
            state.getUserLeadsStatus = STATUS.SUCCESS
            state.userLeads = action.payload
        },
        [getUserLeadsAction.rejected]:(state) => {
            state.getUserLeadsStatus = STATUS.FAILED
        },
        
        [getLeadsAction.pending]: (state) => {
            state.getLeadsStatus = STATUS.FETCHING
        },
        [getLeadsAction.fulfilled]: (state, action) => {
            state.getLeadsStatus = STATUS.SUCCESS
            state.LeadsList = action.payload
        },
        [getLeadsAction.rejected]:(state) => {
            state.getLeadsStatus = STATUS.FAILED
        },

        [getAllLeadsAction.pending]: (state) => {
            state.getLeadsStatus = STATUS.FETCHING
        },
        [getAllLeadsAction.fulfilled]: (state, action) => {
            state.getLeadsStatus = STATUS.SUCCESS
            state.allLeads = action.payload?.[0]
        },
        [getAllLeadsAction.rejected]:(state) => {
            state.getLeadsStatus = STATUS.FAILED
        },
    }

})


export const {resetGetSinglePkg, resetAddLead} = LeadSlice.actions
export const leadReducer =  LeadSlice.reducer