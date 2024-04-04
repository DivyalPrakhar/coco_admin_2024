import { STATUS } from "../../../Constants";
import { apis } from "../../../services/api/apis";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const getStatesAction = createAsyncThunk(
    "app/states",
    async (payload, thunkAPI) => {
        const response = await apis.requestStateApi()
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
) 

const initialState = {getStatesStatus:STATUS.NOT_STARTED}

const statesSlice = createSlice({
    name:'states',
    initialState,
    extraReducers:{
        [getStatesAction.pending]: (state, action) => {
            state.getStatesStatus = STATUS.FETCHING
        },
        [getStatesAction.rejected]: (state, action) => {
            state.getStatesStatus = STATUS.FAILED
        },
        [getStatesAction.fulfilled]: (state, action) => {
            state.getStatesStatus = STATUS.SUCCESS
            state.statesList = action.payload
        }
    }
})

export const statesReducer = statesSlice.reducer 