import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { STATUS } from '../../../Constants'
import { ErrorMessage, SuccessMessage } from '../../../Constants/CommonAlerts'
import { apis } from '../../../services/api/apis'
import _ from 'lodash'


export const addQuestionAction = createAsyncThunk(
    '/question-bank/create',
    async(payload, thunkAPI) => {
        const response = await apis.addQuestionApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const addParagraphAction = createAsyncThunk(
    '/paragraph/create',
    async(payload, thunkAPI) => {
        const response = await apis.addParagraphApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getParaListAction = createAsyncThunk(
    '/paragraph/get',
    async(payload, thunkAPI) => {
        const response = await apis.getParaListApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getAllQuestionsAction = createAsyncThunk(
    '/question/all',
    async(payload, thunkAPI) => {
        const response = await apis.getAllQuestionsApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const updateParaAction = createAsyncThunk(
    '/paragraph/update',
    async(payload, thunkAPI) => {
        const response = await apis.updateParaApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getParaQsnsAction = createAsyncThunk(
    '/paragraph/questions',
    async(payload, thunkAPI) => {
        const response = await apis.getParaQsnsApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const removeParaQueAction = createAsyncThunk(
    '/question/paragraph',
    async(payload, thunkAPI) => {
        const response = await apis.removeParaQueApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return {data, extraData:payload}
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const filterQuestionsAction = createAsyncThunk(
    '/question/filter',
    async(payload, thunkAPI) => {
        const response = await apis.getAllQuestionsApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return {data, extraData:payload}
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const deleteQuestionAction = createAsyncThunk(
    '/question/delete',
    async(payload, thunkAPI) => {
        const response = await apis.deleteQuestionApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return {data, extraData:payload}
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const deleteMultQuestionsAction = createAsyncThunk(
    '/question/delete/multiple',
    async(payload, thunkAPI) => {
        const response = await apis.deleteMultQuestionsApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return {data, extraData:payload}
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const updateQuestionAction = createAsyncThunk(
    '/question/update',
    async(payload, thunkAPI) => {
        const response = await apis.updateQuestionApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const wordBulkQuestionUploadAction = createAsyncThunk(
    "tests/wordBulkQuestionUpload",
    async(payload, thunkAPI) => {
        const response = await apis.wordQuestionUploadApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const bulkQuestionsToBankAction = createAsyncThunk(
    "questionbank/bulkQuestionsToBank",
    async(payload, thunkAPI) => {
        const response = await apis.bulkQuestionsToBankApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)


let initialState = {questionsList:[], paragraphList:{}, bulkQuestionData: []}

const questionSlice = createSlice({
    name:'question',
    initialState,
    reducers:{
        resetUpdatePara:(state) => {
            state.updateParaStatus = STATUS.NOT_STARTED
        },
        resetUpdateQuestion:(state) => {
            state.updateQueStatus = STATUS.NOT_STARTED
        },

        resetParaList:(state) => {
            state.paragraphList = {}
        },

        resetAddQuestion:(state) => {
            state.addQuestionStatus = STATUS.NOT_STARTED
        },
        resetAddNewBulkQuestion:(state) => {
            state.wordBulkQuestionUploadStatus = STATUS.NOT_STARTED
        },

        excelBulkQuestionUploadAction: (state, action) => {
            state.wordBulkQuestionUploadStatus = STATUS.SUCCESS
            state.bulkQuestionData = action.payload
        },

        updateQuestionData: (state, action) => {
            let findQues = _.findIndex(state.bulkQuestionData, d => d.display_id === action.payload.display_id)
            if(findQues != -1){
                state.bulkQuestionData[findQues] = Object.assign({}, state.bulkQuestionData[findQues], action.payload)
            }
        },

        removeDocQuestion: (state, action) => {
            if(action?.payload?.display_id){
                state.bulkQuestionData = _.filter(state.bulkQuestionData, d => d.display_id != action.payload.display_id)
            }else{
                state.bulkQuestionData = []
            }
        }
    },
    extraReducers:{
        [addQuestionAction.pending]: (state) => {
            state.addQuestionStatus = STATUS.FETCHING
        },
        [addQuestionAction.fulfilled]: (state, action) => {
            SuccessMessage('Question Added')
            state.addQuestionStatus = STATUS.SUCCESS

            if(state.paragraphList?.docs?.length){
                let indx = _.findIndex(state.paragraphList.docs, para => para._id == action.payload.paragraph?._id)
                if(indx != -1)
                    state.paragraphList.docs[indx].questions.push(action.payload)
            }
        },
        [addQuestionAction.rejected]:(state) => {
            ErrorMessage()
            state.addQuestionStatus = STATUS.FAILED
        },

        [addParagraphAction.pending]: (state) => {
            state.addParaStatus = STATUS.FETCHING
        },
        [addParagraphAction.fulfilled]: (state, action) => {
            SuccessMessage('Paragraph Added')
            state.addParaStatus = STATUS.SUCCESS
        },
        [addParagraphAction.rejected]:(state) => {
            ErrorMessage()
            state.addParaStatus = STATUS.FAILED
        },

        [getParaListAction.pending]: (state) => {
            state.getParaListStatus = STATUS.FETCHING
        },
        [getParaListAction.fulfilled]: (state, action) => {
            state.getParaListStatus = STATUS.SUCCESS
            state.paragraphList = action.payload
        },
        [getParaListAction.rejected]:(state) => {
            ErrorMessage()
            state.getParaListStatus = STATUS.FAILED
        },

        [getAllQuestionsAction.pending]: (state) => {
            state.getQueListStatus = STATUS.FETCHING
        },
        [getAllQuestionsAction.fulfilled]: (state, action) => {
            state.getQueListStatus = STATUS.SUCCESS
            state.questionsList = action.payload
        },
        [getAllQuestionsAction.rejected]:(state) => {
            ErrorMessage()
            state.getQueListStatus = STATUS.FAILED
        },

        [updateParaAction.pending]: (state) => {
            state.updateParaStatus = STATUS.FETCHING
        },
        [updateParaAction.fulfilled]: (state, action) => {
            SuccessMessage('Paragraph updated')
            state.updateParaStatus = STATUS.SUCCESS
            let indx = _.findIndex(state.paragraphList.docs,d => d._id == action.payload._id)
            state.paragraphList.docs[indx] = action.payload
        },
        [updateParaAction.rejected]:(state) => {
            ErrorMessage()
            state.updateParaStatus = STATUS.FAILED
        },

        [getParaQsnsAction.pending]: (state) => {
            state.getParaQsnsStatus = STATUS.FETCHING
        },
        [getParaQsnsAction.fulfilled]: (state, action) => {
            state.getParaQsnsStatus = STATUS.SUCCESS
            state.paraQuestions = action.payload
        },
        [getParaQsnsAction.rejected]:(state) => {
            ErrorMessage()
            state.getParaQsnsStatus = STATUS.FAILED
        },

        [removeParaQueAction.pending]: (state) => {
            state.removeParaQueStatus = STATUS.FETCHING
        },
        [removeParaQueAction.fulfilled]: (state, action) => {
            SuccessMessage('Question Removed')
            let indx = _.findIndex(state.paragraphList.docs,para => para._id == action.payload.extraData.paragraphId)
            _.remove(state.paraQuestions,q => q._id == action.payload.extraData.questionId)
            _.remove(state.paragraphList.docs[indx].questions,q => q._id == action.payload.extraData.questionId)
            state.removeParaQueStatus = STATUS.SUCCESS
        },
        [removeParaQueAction.rejected]:(state) => {
            ErrorMessage()
            state.removeParaQueStatus = STATUS.FAILED
        },

        [deleteQuestionAction.pending]: (state) => {
            state.deleteQueStatus = STATUS.FETCHING
        },
        [deleteQuestionAction.fulfilled]: (state, action) => {
            SuccessMessage('Question Deleted')
            // _.remove(state.questionsList.docs,q => q._id === action.payload.extraData.id)
            state.deleteQueStatus = STATUS.SUCCESS
        },
        [deleteQuestionAction.rejected]:(state) => {
            ErrorMessage()
            state.deleteQueStatus = STATUS.FAILED
        },

        [deleteMultQuestionsAction.pending]: (state) => {
            state.deleteMultQuestionsStatus = STATUS.FETCHING
        },
        [deleteMultQuestionsAction.fulfilled]: (state, action) => {
            SuccessMessage('Questions Deleted')
            // console.log({action})
            // state.questionsList.docs = _.differenceBy(state.questionsList.docs, action.payload.extraData.questionIds.map(d => ({_id:d})), '_id' )
            state.deleteMultQuestionsStatus = STATUS.SUCCESS
        },
        [deleteMultQuestionsAction.rejected]:(state) => {
            ErrorMessage()
            state.deleteMultQuestionsStatus = STATUS.FAILED
        },

        [updateQuestionAction.pending]: (state) => {
            state.updateQueStatus = STATUS.FETCHING
        },
        [updateQuestionAction.fulfilled]: (state, action) => {
            SuccessMessage('Question updated')
            let indx = _.findIndex(state.questionsList.docs,que => que._id == action.payload._id)
            state.newUpdatedQuestion = action.payload
            state.updateQueStatus = STATUS.SUCCESS
            if(indx != -1){
                state.questionsList.docs[indx] = action.payload
            }
        },
        [updateQuestionAction.rejected]:(state) => {
            ErrorMessage()
            state.updateQueStatus = STATUS.FAILED
        },

        [wordBulkQuestionUploadAction.pending]: (state) => {
            state.wordBulkQuestionUploadStatus = STATUS.FETCHING
        },
        [wordBulkQuestionUploadAction.fulfilled]: (state, action) => {
            state.wordBulkQuestionUploadStatus = STATUS.SUCCESS
            state.bulkQuestionData = action.payload
        },
        [wordBulkQuestionUploadAction.rejected]: (state) => {
            state.wordBulkQuestionUploadStatus = STATUS.FAILED
        },

        [bulkQuestionsToBankAction.pending]: (state) => {
            state.bulkQuestionsToBankStatus = STATUS.FETCHING
        },
        [bulkQuestionsToBankAction.fulfilled]: (state, action) => {
            SuccessMessage('Question Added.')
            state.bulkQuestionsToBankStatus = STATUS.SUCCESS
            state.bulkQuestionData = []
        },
        [bulkQuestionsToBankAction.rejected]:(state) => {
            ErrorMessage()
            state.bulkQuestionsToBankStatus = STATUS.FAILED
        },

    }
})

export const {removeDocQuestion, updateQuestionData, excelBulkQuestionUploadAction, resetUpdatePara, resetUpdateQuestion, resetParaList, resetAddQuestion, resetAddNewBulkQuestion} = questionSlice.actions

export const questionsReducer = questionSlice.reducer