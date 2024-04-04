import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { STATUS } from "../../../Constants"
import { ErrorMessage, SuccessMessage } from "../../../Constants/CommonAlerts"
import { apis } from "../../../services/api/apis"

export const addWebsiteDataAction = createAsyncThunk(
  "website/data",
  async (payload, thunkAPI) => {
    const response = await apis.addWebsiteDataApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
     return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const addOffersAction = createAsyncThunk(
  "website/offers",
  async (payload, thunkAPI) => {
    const response = await apis.addOffersApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
     return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const getWebsiteDataAction = createAsyncThunk(
    "website/data/get",
    async (payload, thunkAPI) => {
      const response = await apis.getWebsiteDataApi(payload)
      const { ok, problem, data } = response
      if (ok) {
        return data
      } else {
       return thunkAPI.rejectWithValue(problem)
      }
    }
  )

const initialState = {}

const websiteSlice = createSlice({
  name: "website",
  initialState,
  reducers: {
    resetAddWebsiteData:(state) => {
      state.addWebsiteDataStatus = STATUS.NOT_STARTED
    }
  },
  extraReducers: {
    [addOffersAction.pending]: (state) => {
        state.addOffersStatus = STATUS.FETCHING
    },

    [addOffersAction.rejected]: (state) => {
        ErrorMessage()
        state.addOffersStatus = STATUS.FAILED
    },

    [addOffersAction.fulfilled]: (state, action) => {
        SuccessMessage()
        state.websiteData = action.payload
        state.addOffersStatus = STATUS.SUCCESS
    },
    
    [addWebsiteDataAction.pending]: (state) => {
        state.addWebsiteDataStatus = STATUS.FETCHING
    },
    [addWebsiteDataAction.rejected]: (state) => {
        ErrorMessage()
        state.addWebsiteDataStatus = STATUS.FAILED
    },
    [addWebsiteDataAction.fulfilled]: (state, action) => {
        SuccessMessage()
        state.websiteData = action.payload
        state.addWebsiteDataStatus = STATUS.SUCCESS
    },

    [getWebsiteDataAction.pending]: (state) => {
        state.getWebsiteDataStatus = STATUS.FETCHING
    },

    [getWebsiteDataAction.rejected]: (state) => {
        state.getWebsiteDataStatus = STATUS.FAILED
    },

    [getWebsiteDataAction.fulfilled]: (state, action) => {
        state.getWebsiteDataStatus = STATUS.SUCCESS
        state.websiteData = action.payload
    },
  },
})

export const {resetAddWebsiteData} = websiteSlice.actions
export const websiteReducer = websiteSlice.reducer