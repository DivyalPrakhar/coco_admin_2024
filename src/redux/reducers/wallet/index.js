import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { STATUS } from '../../../Constants'
import { apis } from '../../../services/api/apis'
import _ from 'lodash'

export const getWalletHistoryAction = createAsyncThunk(
    "get/wallet-data",
    async (payload, thunkAPI) => {
      const response = await apis.getWalletHistoryApi(payload)
      const { ok, problem, data } = response
      if (ok) {
        return data
      } else {
       return thunkAPI.rejectWithValue(problem)
      }
    }
)

export const getWalletOffersAction = createAsyncThunk(
    "get/wallet-offers",
    async (payload, thunkAPI) => {
      const response = await apis.getWalletOffersApi(payload)
      const { ok, problem, data } = response
      if (ok) {
        return data
      } else {
       return thunkAPI.rejectWithValue(problem)
      }
    }
)

export const addWalletOfferAction = createAsyncThunk(
    "add/wallet-offers",
    async (payload, thunkAPI) => {
      const response = await apis.addWalletOfferApi(payload)
      const { ok, problem, data } = response
      if (ok) {
        return data
      } else {
       return thunkAPI.rejectWithValue(problem)
      }
    }
)

export const updateWalletOfferAction = createAsyncThunk(
    "update/wallet-offers",
    async (payload, thunkAPI) => {
      const response = await apis.updateWalletOfferApi(payload)
      const { ok, problem, data } = response
      if (ok) {
        return data
      } else {
       return thunkAPI.rejectWithValue(problem)
      }
    }
)
  
export const deleteOfferAction = createAsyncThunk(
    "delete/wallet-offers",
    async (payload, thunkAPI) => {
      const response = await apis.deleteOfferApi(payload)
      const { ok, problem, data } = response
      if (ok) {
        return {data, extraData:payload}
      } else {
       return thunkAPI.rejectWithValue(problem)
      }
    }
)

let initialState = {walletOffers:[]}
const walletSlice = createSlice({
    name:'wallet',
    initialState,
    extraReducers:{
        [getWalletHistoryAction.pending]:state => {
            state.getWalletStatus = STATUS.FETCHING
        },
        [getWalletHistoryAction.fulfilled]:(state, action) => {
            state.getWalletStatus = STATUS.SUCCESS
            state.walletData = action.payload
        },
        [getWalletHistoryAction.rejected]:state => {
            state.getWalletStatus = STATUS.FAILED
        },

        [getWalletOffersAction.pending]:state => {
            state.getOffersStatus = STATUS.FETCHING
        },
        [getWalletOffersAction.fulfilled]:(state, action) => {
            state.getOffersStatus = STATUS.SUCCESS
            state.walletOffers = action.payload
        },
        [getWalletOffersAction.rejected]:state => {
            state.getOffersStatus = STATUS.FAILED
        },

        [addWalletOfferAction.pending]:state => {
            state.addOfferStatus = STATUS.FETCHING
        },
        [addWalletOfferAction.fulfilled]:(state, action) => {
            state.addOfferStatus = STATUS.SUCCESS
            state.walletOffers.push(action.payload)
        },
        [addWalletOfferAction.rejected]:state => {
            state.addOfferStatus = STATUS.FAILED
        },

        [updateWalletOfferAction.pending]:state => {
            state.updateOfferStatus = STATUS.FETCHING
        },
        [updateWalletOfferAction.fulfilled]:(state, action) => {
            state.updateOfferStatus = STATUS.SUCCESS
            let indx = _.findIndex(state.walletOffers,o => o._id === action.payload._id)

            if(indx != -1)
                state.walletOffers[indx] = action.payload
        },
        [updateWalletOfferAction.rejected]:state => {
            state.updateOfferStatus = STATUS.FAILED
        },

        [deleteOfferAction.pending]:state => {
            state.deleteOfferStatus = STATUS.FETCHING
        },
        [deleteOfferAction.fulfilled]:(state, action) => {
            state.deleteOfferStatus = STATUS.SUCCESS
            _.remove(state.walletOffers,d => d._id === action.payload.extraData.walletOfferId)
        },
        [deleteOfferAction.rejected]:state => {
            state.deleteOfferStatus = STATUS.FAILED
        },
    }
})

export const walletReducer = walletSlice.reducer