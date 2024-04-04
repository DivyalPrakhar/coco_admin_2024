import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import { STATUS } from '../../../Constants'
import { apis } from '../../../services/api/apis'
import _ from 'lodash'

export const getOrderHistoryAction = createAsyncThunk(
    'get/order-history',
    async(payload, thunkAPI) => {
        const response = await apis.getOrderHistoryApi(payload)
        const {ok, problem, data} = response
        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const recheckOrderAction = createAsyncThunk(
    'post/payment-recheck',
    async(payload, thunkAPI) => {
        const response = await apis.recheckOrderApi(payload)
        const {ok, problem, data} = response
        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

// export const gerOfflineOrdersAction = createAsyncThunk(
//     'orders-offline/get',
//     async(payload, thunkAPI) => {
//         const response = await apis.getOfflineOrdersApi(payload)
//         const {ok, problem, data} = response
//         if(ok){
//             return data
//         }else{
//             return thunkAPI.rejectWithValue(problem)
//         }
//     }
// )

export const updateOrderStatusAction = createAsyncThunk(
    'order-status/update',
    async(payload, thunkAPI) => {
        const response = await apis.updateOrderStatusApi(payload)
        const {ok, problem, data} = response
        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)  

export const updateOrderAction = createAsyncThunk(
    'update-order/update',
    async(payload, thunkAPI) => {
        const response = await apis.updateOrderApi(payload)
        const {ok, problem, data} = response
        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)  

const initialState = {}
const OrdersSlice = createSlice({
    name:'orders',
    initialState,
    reducers:{
        resetRecheckAction: state => {
            state.recheckOrderStatus = STATUS.NOT_STARTED
        }
    },
    extraReducers:{
        [updateOrderAction.pending]: state => {
            state.updateOrderStatus = STATUS.FETCHING
        },
        [updateOrderAction.fulfilled]: (state, action) => {
            state.updateOrderStatus = STATUS.SUCCESS
        },
        [updateOrderAction.rejected]: state => {
            state.updateOrderStatus = STATUS.FAILED
        },
        
        [getOrderHistoryAction.pending]: state => {
            state.getHistoryStatus = STATUS.FETCHING
        },
        [getOrderHistoryAction.fulfilled]: (state, action) => {
            state.getHistoryStatus = STATUS.SUCCESS
            state.orderHistory = action.payload
        },
        [getOrderHistoryAction.rejected]: state => {
            state.getHistoryStatus = STATUS.FAILED
        },

        [recheckOrderAction.pending]: state => {
            state.recheckOrderStatus = STATUS.FETCHING
        },
        [recheckOrderAction.fulfilled]: (state, action) => {
            state.recheckOrderStatus = STATUS.SUCCESS
        },
        [recheckOrderAction.rejected]: state => {
            state.recheckOrderStatus = STATUS.FAILED
        },

        [updateOrderStatusAction.pending]: state => {
            state.updateOrderStatus = STATUS.FETCHING
        },
        [updateOrderStatusAction.fulfilled]: (state, action) => {
            state.updateOrderStatus = STATUS.SUCCESS
            let indx = _.findIndex(state.orderHistory.docs,d => d._id === action.payload._id)
            state.orderHistory.docs[indx].deliveryStatus = action.payload.deliveryStatus
            state.orderHistory.docs[indx].currentDeliveryStatus = action.payload.currentDeliveryStatus
        
        },
        [updateOrderStatusAction.rejected]: state => {
            state.updateOrderStatus = STATUS.FAILED
        },
    }
})

export const {resetRecheckAction} = OrdersSlice.actions
export const OrdersReducer = OrdersSlice.reducer