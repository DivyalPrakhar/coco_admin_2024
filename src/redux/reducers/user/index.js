import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { message } from "antd"
import { STATUS } from "../../../Constants"
import { SuccessMessage } from "../../../Constants/CommonAlerts"
import { apis } from "../../../services/api/apis"
// import { requestUserApi } from "../../services/api/UserApis"
import {getDefaultDataAction} from '../LmsConfig'
function isUserAuthorized(user){
//
  return true
}

export const requestUserProfileAction = createAsyncThunk(
  "user/me",
  async (payload, thunkAPI) => {
    const response = await apis.requestUserApi()
    const { ok, problem, data } = response
    if (ok) {
      if(!isUserAuthorized(data)){
        return thunkAPI.rejectWithValue("Not Authorized")
      }
      if(!data.staff){
        message.error("Not Authorized");
        return thunkAPI.rejectWithValue("Not Authorized")
      }
      
      thunkAPI.dispatch(getDefaultDataAction())//{instituteId: data.staff.institute._id}
      return data
    } else {
     return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const updateCurrentUser = createAsyncThunk(
  "user/update",
  async (payload, thunkAPI) => {
    const response = await apis.updateStudentApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
     return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const updatePassAction = createAsyncThunk(
  "user/update/password",
  async (payload, thunkAPI) => {
    const response = await apis.updatePassApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
     return thunkAPI.rejectWithValue(problem)
    }
  }
)

const initialState = {}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setActiveStaff: (state, action) => {
      state.activeStaff = action.payload
      state.user = action.payload?.user
    },
  },
  extraReducers: {
    [updatePassAction.pending]: (state, action) => {
      state.updatePassStatus = STATUS.FETCHING
    },
    [updatePassAction.rejected]: (state, action) => {
      state.updatePassStatus = STATUS.FAILED
    },
    [updatePassAction.fulfilled]: (state, action) => {
      SuccessMessage('Password Reset')
      state.updatePassStatus = STATUS.SUCCESS
    },
    
    [requestUserProfileAction.pending]: (state, action) => {
      state.status = STATUS.FETCHING
    },

    [requestUserProfileAction.rejected]: (state, action) => {
      state.status = STATUS.FAILED
    },

    [requestUserProfileAction.fulfilled]: (state, action) => {
      state.status = STATUS.SUCCESS
      state.user = action.payload
    },

    [updateCurrentUser.pending]: (state, action) => {
      state.updateUserStatus = STATUS.FETCHING
    },

    [updateCurrentUser.rejected]: (state, action) => {
      state.updateUserStatus = STATUS.FAILED
    },

    [updateCurrentUser.fulfilled]: (state, action) => {
      state.updateUserStatus = STATUS.SUCCESS
      state.user = {...state.user, ...action.payload}
    },
  },
})

export const { setActiveStaff } = userSlice.actions
export const userReducer = userSlice.reducer