import { STATUS } from "../../../Constants"
import { ErrorMessage, SuccessMessage } from "../../../Constants/CommonAlerts"
import { apis } from "../../../services/api/apis"
import _ from 'lodash'

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")

export const addCouponAction = createAsyncThunk(
    'coupon/create',
    async(payload, thunkAPI) => {
        const response = await apis.createCouponsApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getCouponsAction = createAsyncThunk(
    'coupon/all',
    async(payload, thunkAPI) => {
        // console.log('Calling...')
        const response = await apis.getAllCouponsApi(payload)
        const {ok, problem, data} = response

        if(ok){
            // console.log('Get Coupon Success : ', data)
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const updateCouponAction = createAsyncThunk(
    'coupon/update',
    async(payload, thunkAPI) => {
        const response = await apis.updateCouponsApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return {data, extraData:payload}
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const deleteCouponAction = createAsyncThunk(
    'coupon/delete',
    async(payload, thunkAPI) => {
        const response = await apis.deleteCouponsApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return {data, extraData:payload}
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)


const initialState = { CouponsList:[], addCouponStatus: STATUS.NOT_STARTED}

export const CouponSlice = createSlice({
    name:'coupon',
    initialState,
    reducers:{
        resetAddCoupon: (state) => {
            state.addCouponStatus = STATUS.NOT_STARTED
        }
    },
    extraReducers:{
        [addCouponAction.pending]: (state) => {
            state.addCouponStatus = STATUS.FETCHING
        },
        [addCouponAction.fulfilled]: (state, action) => {
            state.addCouponStatus = STATUS.SUCCESS
            state.CouponsList = _.concat(state.CouponsList, action.payload)
            state.currentCoupon = action.payload
        },
        [addCouponAction.rejected]:(state) => {
            state.addCouponStatus = STATUS.FAILED
        },

        [getCouponsAction.pending]: (state) => {
            state.getCouponsStatus = STATUS.FETCHING
        },
        [getCouponsAction.fulfilled]: (state, action) => {
            state.getCouponsStatus = STATUS.SUCCESS
            state.CouponsList = action.payload
        },
        [getCouponsAction.rejected]:(state) => {
            state.getCouponsStatus = STATUS.FAILED
        },
        [updateCouponAction.pending]: (state) => {
            state.updateCouponStatus = STATUS.FETCHING
        },
        [updateCouponAction.fulfilled]: (state, action) => {
            state.updateCouponStatus = STATUS.SUCCESS
            state.CouponsList = _.map(state.CouponsList, s => {
                let newData =_.find(action.payload.data, d => d.couponId == s.couponId)
                return newData ? newData : s
            })
        },
        [updateCouponAction.rejected]:(state) => {
            state.updateCouponStatus = STATUS.FAILED
        },

        [deleteCouponAction.pending]: (state) => {
            state.updateCouponStatus = STATUS.FETCHING
        },
        [deleteCouponAction.fulfilled]: (state, action) => {
            state.updateCouponStatus = STATUS.SUCCESS
            state.CouponsList = _.filter(state.CouponsList, d => _.findIndex(action.payload.extraData.couponIds, p => p === d.couponId) == -1)
        },

        [deleteCouponAction.rejected]:(state) => {
            state.updateCouponStatus = STATUS.FAILED
        }
    }

})


export const {resetGetSinglePkg, resetAddCoupon} = CouponSlice.actions
export const couponReducer =  CouponSlice.reducer