import _ from "lodash"
import { STATUS } from "../../../Constants"
import { SuccessMessage } from "../../../Constants/CommonAlerts"
import { apis } from "../../../services/api/apis"
const { createSlice, createAsyncThunk, current } = require("@reduxjs/toolkit")


export const getDiscountConfigsAction = createAsyncThunk(
    'discount-configs/all',
    async(payload, thunkAPI) => {
        const response = await apis.getDiscountConfigsApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const addDiscountOfferAction = createAsyncThunk(
    'discount-configs/post',
    async(payload, thunkAPI) => {
        const response = await apis.addDiscountOfferApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const updateDiscountOfferAction = createAsyncThunk(
    'discount-configs/patch',
    async(payload, thunkAPI) => {
        const response = await apis.updateDiscountOfferApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

const initialState = { }

export const discountConfigsSlice = createSlice({
    name:'discountConfigs',
    initialState,
    reducers:{},
    extraReducers:{
        [getDiscountConfigsAction.pending]: (state) => {
            state.getConfigsStatus = STATUS.FETCHING
        },
        [getDiscountConfigsAction.fulfilled]: (state, action) => {
            state.getConfigsStatus = STATUS.SUCCESS
            state.discountConfigs = action.payload
        },
        [getDiscountConfigsAction.rejected]:(state) => {
            state.getConfigsStatus = STATUS.FAILED
        },
        
        [addDiscountOfferAction.pending]: (state) => {
            state.addDiscountOfferStatus = STATUS.FETCHING
        },
        [addDiscountOfferAction.fulfilled]: (state, action) => {
            state.addDiscountOfferStatus = STATUS.SUCCESS
            state.discountConfigs.push(action.payload)
            SuccessMessage()
        },
        [addDiscountOfferAction.rejected]:(state) => {
            state.addDiscountOfferStatus = STATUS.FAILED
        },

        [updateDiscountOfferAction.pending]: (state) => {
            state.updateDiscountOfferStatus = STATUS.FETCHING
        },
        [updateDiscountOfferAction.fulfilled]: (state, action) => {
            state.updateDiscountOfferStatus = STATUS.SUCCESS
            const indx = _.findIndex(state.discountConfigs,d => d._id === action.payload._id)
            state.discountConfigs[indx] = action.payload
            console.log('action', indx, current(state.discountConfigs), action.payload)
            SuccessMessage()
        },
        [updateDiscountOfferAction.rejected]:(state) => {
            state.updateDiscountOfferStatus = STATUS.FAILED
        },
    }

})

export const discountConfigReducer =  discountConfigsSlice.reducer