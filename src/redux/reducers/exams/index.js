import _ from "lodash"
import { STATUS } from "../../../Constants"
import { SuccessMessage } from "../../../Constants/CommonAlerts"
import { apis } from "../../../services/api/apis"
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")

export const addExamContentAction = createAsyncThunk(
    'add-exam-content/post',
    async(payload, thunkAPI) => {
        const response = await apis.addExamContentApi(payload)
        const {ok, problem, data} = response
        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getExamContentAction = createAsyncThunk(
    'get-exam-content/get',
    async(payload, thunkAPI) => {
        const response = await apis.getExamContentApi(payload)
        const {ok, problem, data} = response
        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const deleteExamContentAction = createAsyncThunk(
    'delete-exam-content/delete',
    async(payload, thunkAPI) => {
        const response = await apis.deleteExamContentApi(payload)
        const {ok, problem, data} = response
        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const updateExamContentAction = createAsyncThunk(
    'update-exam-content/update',
    async(payload, thunkAPI) => {
        const response = await apis.updateExamContentApi(payload)
        const {ok, problem, data} = response
        if(ok){
            return payload.type === 'magazine' ? {...data, path:'magazines'} : data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

const initialState = {}

export const examsSlice = createSlice({
    name:'exams',
    initialState,
    reducers:{},
    extraReducers:{
        [updateExamContentAction.pending]: (state) => {
            state.updateExamContentStatus = STATUS.FETCHING
        },
        [updateExamContentAction.fulfilled]: (state, action) => {
            state.updateExamContentStatus = STATUS.SUCCESS
            if(action.payload)
                state.examContent[action.payload.path] = action.payload.data[action.payload.path]
            SuccessMessage()
        },
        [updateExamContentAction.rejected]:(state) => {
            state.updateExamContentStatus = STATUS.FAILED
        },
        
        [addExamContentAction.pending]: (state) => {
            state.addExamContentStatus = STATUS.FETCHING
        },
        [addExamContentAction.fulfilled]: (state, action) => {
            state.addExamContentStatus = STATUS.SUCCESS
            if(action.payload)
                if(state.examContent)
                    state.examContent[action.payload.path] = action.payload.data[action.payload.path]
                else
                    state.examContent = action.payload.data
            
            SuccessMessage()
        },
        [addExamContentAction.rejected]:(state) => {
            state.addExamContentStatus = STATUS.FAILED
        },

        [deleteExamContentAction.pending]: (state) => {
            state.deleteExamContentStatus = STATUS.FETCHING
        },
        [deleteExamContentAction.fulfilled]: (state, action) => {
            state.deleteExamContentStatus = STATUS.SUCCESS
            if(action.payload)
                state.examContent[action.payload.path] = action.payload.data
            
                SuccessMessage()
        },
        [deleteExamContentAction.rejected]:(state) => {
            state.deleteExamContentStatus = STATUS.FAILED
        },

        [getExamContentAction.pending]: (state) => {
            state.getExamContentStatus = STATUS.FETCHING
        },
        [getExamContentAction.fulfilled]: (state, action) => {
            state.getExamContentStatus = STATUS.SUCCESS
            state.examContent = action.payload?.[0]
        },
        [getExamContentAction.rejected]:(state) => {
            state.getExamContentStatus = STATUS.FAILED
        },
    }

})

export const examsReducer =  examsSlice.reducer