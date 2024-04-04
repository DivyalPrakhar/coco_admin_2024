import _ from 'lodash';
import { message } from "antd";
import { STATUS } from "../../../Constants";
import { ErrorMessage, SuccessMessage } from "../../../Constants/CommonAlerts";
import { apis } from "../../../services/api/apis";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const getPromoCodeAction = createAsyncThunk(
    'create/getPromoCode',
    async(payload, thunkAPI) => {
        const response = await apis.getPromoCodeApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const addPromoCodeAction = createAsyncThunk(
    'create/addPromoCode',
    async(payload, thunkAPI) => {
        const response = await apis.addPromoCodeApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(data)
    }
)

export const updatePromoCodeAction = createAsyncThunk(
    'create/updatePromoCode',
    async(payload, thunkAPI) => {
        const response = await apis.updatePromoCodeApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(data)
    }
)

export const deletePromoCodeAction = createAsyncThunk(
    'create/deletePromoCode',
    async(payload, thunkAPI) => {
        const response = await apis.deletePromoCodeApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return {data: data, extraData: payload}
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

const initialState = {
    promoCodeStatus: STATUS.NOT_STARTED,
    promoCodeData: [],
    addPromoCodeStatus: STATUS.NOT_STARTED,
    updatePromoCodeStatus: STATUS.NOT_STARTED,
    deletePromoCodeStatus: STATUS.NOT_STARTED,
}

const promoCodeSlice = createSlice({
    name:'promoCodeReducer',
    initialState,
    reducers: {
        resetPromoCodeStatus:(state) => {
            state.addPromoCodeStatus = STATUS.NOT_STARTED
            state.updatePromoCodeStatus = STATUS.NOT_STARTED
            state.deletePromoCodeStatus = STATUS.NOT_STARTED
        }
    },
    extraReducers:{
        [getPromoCodeAction.pending] : (state, action) => {
            state.promoCodeStatus = STATUS.FETCHING
        },

        [getPromoCodeAction.fulfilled]:(state, action)=>{
            state.promoCodeStatus = STATUS.SUCCESS
            state.promoCodeData = action.payload
        },

        [getPromoCodeAction.rejected]:(state, action)=>{
            state.promoCodeStatus = STATUS.FAILED
        },

        [addPromoCodeAction.pending]: (state) => {
            state.addPromoCodeStatus = STATUS.FETCHING
        },

        [addPromoCodeAction.fulfilled]: (state, action) => {
            SuccessMessage('Promo Code Added.')
            state.addPromoCodeStatus = STATUS.SUCCESS
            state.promoCodeData.push(action.payload)
        },

        [addPromoCodeAction.rejected]:(state, action) => {
            ErrorMessage(action.payload.message)
            state.addPromoCodeStatus = STATUS.FAILED
        },

        [updatePromoCodeAction.pending]: (state) => {
            state.updatePromoCodeStatus = STATUS.FETCHING
        },

        [updatePromoCodeAction.fulfilled]: (state, action) => {
            SuccessMessage('Promo Code Updated.')
            state.updatePromoCodeStatus = STATUS.SUCCESS
            state.promoCodeData = state.promoCodeData.map(d => d._id == action.payload._id ? action.payload : d)
        },

        [updatePromoCodeAction.rejected]:(state, action) => {
            ErrorMessage(action.payload.message)
            state.updatePromoCodeStatus = STATUS.FAILED
        },

        [deletePromoCodeAction.pending]: (state) => {
            state.deletePromoCodeStatus = STATUS.FETCHING
        },
        [deletePromoCodeAction.fulfilled]: (state, action) => {
            SuccessMessage()
            state.deletePromoCodeStatus = STATUS.SUCCESS
            _.remove(state.promoCodeData, d => d._id == action.payload.extraData.id)
        },
        [deletePromoCodeAction.rejected]:(state) => {
            state.deletePromoCodeStatus = STATUS.FAILED
        },
    }
})

export const {resetPromoCodeStatus} = promoCodeSlice.actions
export const promoCodeReducer = promoCodeSlice.reducer