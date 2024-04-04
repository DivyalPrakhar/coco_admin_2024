import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { STATUS } from "../../../Constants"
import { removeAuthorizationHeader } from "../../../services/api"
import { apis } from "../../../services/api/apis"
import _ from 'lodash';

// import { requestUserApi } from "../../services/api/UserApis"

export const addInstituteAction = createAsyncThunk(
  "institute/addinstitute",
  async (payload, thunkAPI) => {
    const response = await apis.addInstituteApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
     return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const editInstituteAction = createAsyncThunk(
  "institute/editInstitute",
  async (payload, thunkAPI) => {
    const response = await apis.editInstituteApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
     return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const deleteInstituteAction = createAsyncThunk(
  "institute/deleteInstitute",
  async (payload, thunkAPI) => {
    const response = await apis.deleteInstituteApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return {data, payload}
    } else {
     return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const getAllInstituteAction = createAsyncThunk(
  "institute/getinstitute",
  async (payload, thunkAPI) => {
    const response = await apis.getInstituteApi()
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
     return thunkAPI.rejectWithValue(problem)
    }
  }
)

const initialState = {}

const instituteSlice = createSlice({
  name: "institute",
  initialState,
  reducers: {
    resetEditStatusAction: (state, action) => {
      state.addStatus = STATUS.NOT_STARTED
    },
  },
  extraReducers: {
    [addInstituteAction.pending]: (state, action) => {
      state.addStatus = STATUS.FETCHING
    },

    [addInstituteAction.rejected]: (state, action) => {
      state.addStatus = STATUS.FAILED
    },

    [addInstituteAction.fulfilled]: (state, action) => {
      state.addStatus = STATUS.SUCCESS
      state.added = action.payload
    },

    [editInstituteAction.pending]: (state, action) => {
      state.addStatus = STATUS.FETCHING
    },

    [editInstituteAction.rejected]: (state, action) => {
      state.addStatus = STATUS.FAILED
    },

    [editInstituteAction.fulfilled]: (state, action) => {
      let findInstitute = _.findIndex(state.instituteList, s => s.id == action.payload.id)
      if(findInstitute != -1){
        state.instituteList[findInstitute] = action.payload
      }
      state.addStatus = STATUS.SUCCESS
      state.added = action.payload
      state.instituteList = state.instituteList
    },

    [deleteInstituteAction.pending]: (state, action) => {
      state.deleteStatus = STATUS.FETCHING
    },

    [deleteInstituteAction.rejected]: (state, action) => {
      state.deleteStatus = STATUS.FAILED
    },

    [deleteInstituteAction.fulfilled]: (state, action) => {
      state.instituteList = _.filter(state.instituteList, s => s.id != action.payload.payload.id)
      state.deleteStatus = STATUS.SUCCESS
    },

    [getAllInstituteAction.pending]: (state, action) => {
      state.getStatus = STATUS.FETCHING
    },

    [getAllInstituteAction.rejected]: (state, action) => {
      state.getStatus = STATUS.FAILED
    },

    [getAllInstituteAction.fulfilled]: (state, action) => {
      state.getStatus = STATUS.SUCCESS
      state.instituteList = action.payload
    },
  },
})

export const { resetEditStatusAction } = instituteSlice.actions
export const instituteReducer = instituteSlice.reducer