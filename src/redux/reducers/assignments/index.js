import _, { forEach } from 'lodash';
import { STATUS } from "../../../Constants";
import { ErrorMessage, FetchingMessage, SuccessMessage } from '../../../Constants/CommonAlerts';
import { apis } from "../../../services/api/apis";
const { createSlice, createAsyncThunk, current } = require("@reduxjs/toolkit");

export const addAssignmentAction = createAsyncThunk(
    'create/assignment',
    async(payload, thunkAPI) => {
        const response = await apis.addAssignmentApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const getAssignmentsAction = createAsyncThunk(
    'get/assignment',
    async(payload, thunkAPI) => {
        const response = await apis.getAssignmentsApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const updateAssignmentsAction = createAsyncThunk(
    'update/assignment',
    async(payload, thunkAPI) => {
        const response = await apis.updateAssignmentApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const addAnswerSheetAction = createAsyncThunk(
    'add/asnwersheet',
    async(payload, thunkAPI) => {
        const response = await apis.addAnswerSheetApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const getAnswerSheetsAction = createAsyncThunk(
    'get/asnwersheet',
    async(payload, thunkAPI) => {
        const response = await apis.getAnswerSheetsApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const getFilteredAssignmentsAction = createAsyncThunk(
    'get/assignments/filtered',
    async(payload, thunkAPI) => {
        const response = await apis.getFilteredAssignmentsApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const getAssignmentAction = createAsyncThunk(
    'get/single-assignment',
    async(payload, thunkAPI) => {
        const response = await apis.getAssignmentApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const getSubmissionsAction = createAsyncThunk(
    'get/assingment-submission',
    async(payload, thunkAPI) => {
        const response = await apis.getAssignmentSubmissionsApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const uploadCheckedFileAction = createAsyncThunk(
    'post/upload-check-file',
    async(payload, thunkAPI) => {
        const response = await apis.uploadCheckedFileApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const addAssignmentResultAction = createAsyncThunk(
    'post/assignment-result',
    async(payload, thunkAPI) => {
        const response = await apis.addAssignmentResultApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const downloadSubmissionsAction = createAsyncThunk(
    'get/submissions',
    async(payload, thunkAPI) => {
        const response = await apis.downloadSubmissionsApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const assignmentResultCalAction = createAsyncThunk(
    'get/assignment-result',
    async(payload, thunkAPI) => {
        const response = await apis.assignmentResultCalApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const assignmentZipAction = createAsyncThunk(
    'assignment/zip',
    async(payload, thunkAPI) => {
        const response = await apis.assignmentZipApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const assingmentMarksAction = createAsyncThunk(
    'assignment/marks/excel',
    async(payload, thunkAPI) => {
        const response = await apis.assingmentMarksApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)


const initialState = {assignmentsList:[], answersheetsList:[]}

const assignmentSlice = createSlice({
    name:'assignments',
    initialState,
    reducers:{
        resetAddAssignmentStatus:(state) => {
            state.addAssignmentStatus = STATUS.NOT_STARTED
        },
        resetUpdateAssignmentStatus:(state) => {
            state.updateAssignmentStatus = STATUS.NOT_STARTED
        },
        resetGetAssignments:(state) => {
            state.getAssignmentsStatus = STATUS.NOT_STARTED
        },

        resetAddSheetStatus:(state) => {
            state.addAnswerSheetStatus = STATUS.NOT_STARTED
        }
    },
    extraReducers:{
        [assingmentMarksAction.pending]: (state) => {
            state.assingmentMarksStatus = STATUS.FETCHING
        },
        [assingmentMarksAction.fulfilled]: (state, action) => {
            if(action.payload?.length){
                state.allSubmissions.docs = _.concat(action.payload, state.allSubmissions.docs || [])
                state.allSubmissions.docs = _.uniqBy(state.allSubmissions.docs, '_id')
            }

            state.assingmentMarksStatus = STATUS.SUCCESS
            state.zipErrors = null
            SuccessMessage()
        },
        [assingmentMarksAction.rejected]:(state) => {
            ErrorMessage('File data is not correct')
            state.assingmentMarksStatus = STATUS.FAILED
        },

        [assignmentZipAction.pending]: (state) => {
            state.assignmentZipStatus = STATUS.FETCHING
        },
        [assignmentZipAction.fulfilled]: (state, action) => {
            if(action.payload.data?.length){
                state.allSubmissions.docs = _.concat(action.payload.data, state.allSubmissions.docs || [])
                state.allSubmissions.docs = _.uniqBy(state.allSubmissions.docs, '_id')
            }

            state.zipErrors = action.payload.error

            console.log('action', action.payload.error)
            if(action.payload.error?.length){
                ErrorMessage(_.join(action.payload.error.map(d => d.message), ', '), 5)
            }else{
                SuccessMessage()
            }

            state.assignmentZipStatus = STATUS.SUCCESS
        },
        [assignmentZipAction.rejected]:(state) => {
            ErrorMessage('Select correct file')
            state.assignmentZipStatus = STATUS.FAILED
        },

        [assignmentResultCalAction.pending] : (state) => {
            state.assignmentResultStatus = STATUS.FETCHING
        },
        [assignmentResultCalAction.fulfilled]:(state, action)=>{
            SuccessMessage()
            state.assignmentResultStatus = STATUS.SUCCESS
        },
        [assignmentResultCalAction.rejected]:(state)=>{
            ErrorMessage()
            state.assignmentResultStatus = STATUS.FAILED
        },
        
        [downloadSubmissionsAction.pending] : (state) => {
            state.downloadSubmissionsStatus = STATUS.FETCHING
        },
        [downloadSubmissionsAction.fulfilled]:(state, action)=>{
            SuccessMessage()
            state.downloadSubmissionsStatus = STATUS.SUCCESS
        },
        [downloadSubmissionsAction.rejected]:(state)=>{
            ErrorMessage()
            state.downloadSubmissionsStatus = STATUS.FAILED
        },
        
        [addAssignmentResultAction.pending] : (state) => {
            state.addAssignmentStatus = STATUS.FETCHING
        },
        [addAssignmentResultAction.fulfilled]:(state, action)=>{
            let indx = _.findIndex(state.allSubmissions.docs,d => d._id === action.payload._id)
            
            if(indx === -1)
                state.allSubmissions.docs.push(action.payload)
            else
                state.allSubmissions.docs[indx] = action.payload
            
            SuccessMessage()
            state.zipErrors = null
            state.addAssignmentStatus = STATUS.SUCCESS
        },
        [addAssignmentResultAction.rejected]:(state)=>{
            ErrorMessage()
            state.addAssignmentStatus = STATUS.FAILED
        },
        
        [uploadCheckedFileAction.pending] : (state) => {
            state.uploadCheckedFileStatus = STATUS.FETCHING
        },
        [uploadCheckedFileAction.fulfilled]:(state, action)=>{
            let indx = _.findIndex(state.allSubmissions.docs,d => d?._id === action.payload._id)
            
            if(indx === -1)
                state.allSubmissions.docs.push(action.payload)
            else
                state.allSubmissions.docs[indx] = action.payload
            
            SuccessMessage()
            state.zipErrors = null
            state.uploadCheckedFileStatus = STATUS.SUCCESS
        },
        [uploadCheckedFileAction.rejected]:(state)=>{
            ErrorMessage()
            state.uploadCheckedFileStatus = STATUS.FAILED
        },
        
        [getSubmissionsAction.pending] : (state) => {
            state.getSubmissionsStatus = STATUS.FETCHING
        },
        [getSubmissionsAction.fulfilled]:(state, action)=>{
            state.getSubmissionsStatus = STATUS.SUCCESS
            state.allSubmissions = action.payload
            state.zipErrors = null
        },
        [getSubmissionsAction.rejected]:(state)=>{
            ErrorMessage()
            state.getSubmissionsStatus = STATUS.FAILED
        },
        
        [getAssignmentAction.pending] : (state) => {
            state.getSingleAssignmentStatus = STATUS.FETCHING
        },
        [getAssignmentAction.fulfilled]:(state, action)=>{
            state.getSingleAssignmentStatus = STATUS.SUCCESS
            state.currentAssignment = action.payload
        },
        [getAssignmentAction.rejected]:(state)=>{
            ErrorMessage()
            state.getSingleAssignmentStatus = STATUS.FAILED
        },
        
        [addAssignmentAction.pending] : (state) => {
            FetchingMessage()
            state.addAssignmentStatus = STATUS.FETCHING
        },
        [addAssignmentAction.fulfilled]:(state, action)=>{
            SuccessMessage('Assignment Added')
            state.assignmentsList.push(action.payload)
            state.addAssignmentStatus = STATUS.SUCCESS
        },
        [addAssignmentAction.rejected]:(state)=>{
            ErrorMessage()
            state.addAssignmentStatus = STATUS.FAILED
        },

        [getAssignmentsAction.pending] : (state) => {
            state.getAssignmentsStatus = STATUS.FETCHING
        },
        [getAssignmentsAction.fulfilled]:(state, action)=>{
            state.getAssignmentsStatus = STATUS.SUCCESS
            state.assignmentsList = action.payload
        },
        [getAssignmentsAction.rejected]:(state)=>{
            ErrorMessage()
            state.getAssignmentsStatus = STATUS.FAILED
        },

        [updateAssignmentsAction.pending] : (state) => {
            FetchingMessage()
            state.updateAssignmentStatus = STATUS.FETCHING
        },
        [updateAssignmentsAction.fulfilled]:(state, action)=>{
            SuccessMessage('Assignment Updated')

            let indx = _.findIndex(state.assignmentsList, a => a._id == action.payload._id)
            state.assignmentsList[indx] = action.payload

            if(state.currentAssignment)
                state.currentAssignment = {...action.payload, packages:state.currentAssignment.packages}

            state.updateAssignmentStatus = STATUS.SUCCESS
        },
        [updateAssignmentsAction.rejected]:(state)=>{
            ErrorMessage()
            state.updateAssignmentStatus = STATUS.FAILED
        },

        [addAnswerSheetAction.pending] : (state) => {
            state.addAnswerSheetStatus = STATUS.FETCHING
        },
        [addAnswerSheetAction.fulfilled]:(state, action)=>{
            SuccessMessage('Answersheet Added')
            state.answersheetsList.push(action.payload)
            state.addAnswerSheetStatus = STATUS.SUCCESS
        },
        [addAnswerSheetAction.rejected]:(state)=>{
            ErrorMessage()
            state.addAnswerSheetStatus = STATUS.FAILED
        },

        [getAnswerSheetsAction.pending] : (state) => {
            state.getAnswerSheetsStatus = STATUS.FETCHING
        },
        [getAnswerSheetsAction.fulfilled]:(state, action)=>{
            state.answersheetsList = action.payload
            state.getAnswerSheetsStatus = STATUS.SUCCESS
        },
        [getAnswerSheetsAction.rejected]:(state)=>{
            ErrorMessage()
            state.getAnswerSheetsStatus = STATUS.FAILED
        },

        [getFilteredAssignmentsAction.pending] : (state) => {
            state.getFilteredAssignmentsStatus = STATUS.FETCHING
        },
        [getFilteredAssignmentsAction.fulfilled]:(state, action)=>{
            state.filteredAssignmentsList = action.payload
            state.getFilteredAssignmentsStatus = STATUS.SUCCESS
        },
        [getFilteredAssignmentsAction.rejected]:(state)=>{
            ErrorMessage()
            state.getFilteredAssignmentsStatus = STATUS.FAILED
        },
    }
})

export const {resetAddAssignmentStatus, resetUpdateAssignmentStatus, resetAddSheetStatus, resetGetAssignments} = assignmentSlice.actions
export const assignmentReducer = assignmentSlice.reducer