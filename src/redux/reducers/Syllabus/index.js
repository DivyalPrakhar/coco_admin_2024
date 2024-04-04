import _ from 'lodash';
import { message } from "antd";
import { STATUS } from "../../../Constants";
import { ErrorMessage, SuccessMessage } from "../../../Constants/CommonAlerts";
import { apis } from "../../../services/api/apis";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const getBasechaptersAction = createAsyncThunk(
    'create/getBasechapters',
    async(payload, thunkAPI) => {
        const response = await apis.getBasechaptersApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const uploadBasechaptersAction = createAsyncThunk(
    'create/uploadBasechapters',
    async(payload, thunkAPI) => {
        const response = await apis.uploadBasechaptersApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(data)
    }
)

export const addChapterTemplateAction  = createAsyncThunk(
    'create/addChapterTemplate',
    async(payload, thunkAPI) => {
        const response = await apis.addChapterTemplateApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const getChapterTemplateAction  = createAsyncThunk(
    'create/getChapterTemplate',
    async(payload, thunkAPI) => {
        const response = await apis.getChapterTemplateApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const getSyllabusChaptersDataAction = createAsyncThunk(
    'create/getSyllabusChaptersData',
    async(payload, thunkAPI) => {
        const response = await apis.getSyllabusChaptersDataApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
) 

export const getOldChapterTemplateExcelAction = createAsyncThunk(
    'create/getOldChapterTemplateExcel',
    async(payload, thunkAPI) => {
        const response = await apis.getOldChapterTemplateExcelApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)  

const initialState = {
    basechaptersStatus: STATUS.NOT_STARTED,
    chapterTemplateDemoExcelStatus: STATUS.NOT_STARTED,
    basechaptersUploadStatus: STATUS.NOT_STARTED,
    basechapterErrorData: undefined
}

const syllabusSlice = createSlice({
    name:'syllabus',
    initialState,
    reducers: {
        resetAddChapterStatus:(state) => {
            state.addChapterTemplateStatus = STATUS.NOT_STARTED
        },
        resetBaseChapterError: (state) => {
            state.basechapterErrorData = undefined
        }
    },
    extraReducers:{
        [getBasechaptersAction.pending] : (state, action) => {
            state.basechaptersStatus = STATUS.FETCHING
        },
        [getBasechaptersAction.fulfilled]:(state, action)=>{
            state.basechaptersStatus = STATUS.SUCCESS
            state.basechaptersData = action.payload
        },
        [getBasechaptersAction.rejected]:(state, action)=>{
            state.basechaptersStatus = STATUS.FAILED
        },

        [uploadBasechaptersAction.pending] : (state, action) => {
            state.basechaptersUploadStatus = STATUS.FETCHING
        },

        [uploadBasechaptersAction.fulfilled]:(state, action)=>{
            if(action.payload?.error){
                state.basechaptersUploadStatus = STATUS.FAILED
                state.basechapterErrorData = action.payload
            }else{
                SuccessMessage('Basechapter added')
                state.basechaptersUploadStatus = STATUS.SUCCESS
            }
        },

        [uploadBasechaptersAction.rejected]:(state, action)=>{
            ErrorMessage(action.payload.message)
            state.basechaptersUploadStatus = STATUS.FAILED
        },

        [addChapterTemplateAction.pending] : (state, action) => {
            state.addChapterTemplateStatus = STATUS.FETCHING
        },
        [addChapterTemplateAction.fulfilled]:(state, action)=>{
            state.addChapterTemplateStatus = STATUS.SUCCESS
            SuccessMessage()
        },
        [addChapterTemplateAction.rejected]:(state, action)=>{
            state.addChapterTemplateStatus = STATUS.FAILED
        },

        [getChapterTemplateAction.pending] : (state, action) => {
            state.getChapterTemplateStatus = STATUS.FETCHING
        },
        [getChapterTemplateAction.fulfilled]:(state, action)=>{
            state.getChapterTemplateStatus = STATUS.SUCCESS
            state.chapterTemplateData = action.payload
        },
        [getChapterTemplateAction.rejected]:(state, action)=>{
            state.getChapterTemplateStatus = STATUS.FAILED
        },

        [getSyllabusChaptersDataAction.pending] : (state, action) => {
            state.getSyllabusChaptersDataStatus = STATUS.FETCHING
        },
        [getSyllabusChaptersDataAction.fulfilled]:(state, action)=>{
            state.getSyllabusChaptersDataStatus = STATUS.SUCCESS
            state.syllabusChapterData = action.payload
        },
        [getSyllabusChaptersDataAction.rejected]:(state, action)=>{
            state.getSyllabusChaptersDataStatus = STATUS.FAILED
        },

        [getOldChapterTemplateExcelAction.pending] : (state, action) => {
            state.getOldChapterTemplateExcelStatus = STATUS.FETCHING
        },
        [getOldChapterTemplateExcelAction.fulfilled]:(state, action)=>{
            state.getOldChapterTemplateExcelStatus = STATUS.SUCCESS
            state.oldChapterTemplateExcel = action.payload
        },
        [getOldChapterTemplateExcelAction.rejected]:(state, action)=>{
            state.getOldChapterTemplateExcelStatus = STATUS.FAILED
        },
    }
})

export const {resetAddChapterStatus, resetBaseChapterError} = syllabusSlice.actions
export const syllabusReducer = syllabusSlice.reducer