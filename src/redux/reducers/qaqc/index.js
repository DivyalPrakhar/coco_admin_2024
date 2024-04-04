import { STATUS } from "../../../Constants";
import { ErrorMessage, SuccessMessage } from "../../../Constants/CommonAlerts";
import { apis } from "../../../services/api/apis";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const getAssignedQaqcUsersAction = createAsyncThunk(
    "test/assigned/get",
    async (payload, thunkAPI) => {
        const response = await apis.getAssignedQaqcUsersApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
) 

export const assignTestQaqcAction = createAsyncThunk(
    "test/assigned/post",
    async(payload, thunkAPI) => {
        const response = await apis.assignTestQaqcApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return {data: data, extraData: payload}
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const getUserQaqcTestsAction = createAsyncThunk(
    "tests/user-tests",
    async(payload, thunkAPI) => {
        const response = await apis.getUserQaqcTestsApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return {data: data, extraData: payload}
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

const initialState = {userTests:[]}

const qaqcSlice = createSlice({
    name:'qaqc',
    initialState,
    reducers:{
        resetAssignTestQaqc: (state) => {
            state.assignTestQaqcStatus = STATUS.NOT_STARTED
        }
    },
    extraReducers:{
        [getAssignedQaqcUsersAction.pending]: (state) => {
            state.getAssignedQaqcUsersStatus = STATUS.FETCHING
        },
        [getAssignedQaqcUsersAction.fulfilled]: (state, action) => {
            state.getAssignedQaqcUsersStatus = STATUS.SUCCESS
            state.assignedTestQaqcUsers = action.payload
        },
        [getAssignedQaqcUsersAction.rejected]: (state) => {
            state.getAssignedQaqcUsersStatus = STATUS.FAILED
        },

        [assignTestQaqcAction.pending]: (state) => {
            state.assignTestQaqcStatus = STATUS.FETCHING
        },
        [assignTestQaqcAction.fulfilled]: (state, action) => {
            SuccessMessage()
            state.assignTestQaqcStatus = STATUS.SUCCESS
        },
        [assignTestQaqcAction.rejected]: (state) => {
            ErrorMessage()
            state.assignTestQaqcStatus = STATUS.FAILED
        },

        [getUserQaqcTestsAction.pending]: (state) => {
            state.getUserQaqcTestsStatus = STATUS.FETCHING
        },
        [getUserQaqcTestsAction.fulfilled]: (state, action) => {
            state.getUserQaqcTestsStatus = STATUS.SUCCESS
            state.userTests = action.payload?.data
        },
        [getUserQaqcTestsAction.rejected]: (state) => {
            state.getUserQaqcTestsStatus = STATUS.FAILED
        }
    }
})

export const {resetAssignTestQaqc} = qaqcSlice.actions
export const qaqcReducer = qaqcSlice.reducer 