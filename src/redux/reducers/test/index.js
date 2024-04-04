import _ from 'lodash';
import { exportFile } from '../../../components/ExportExcel';
import { STATUS } from "../../../Constants";
import { ErrorMessage, SuccessMessage, FetchingMessage } from "../../../Constants/CommonAlerts";
import { apis } from "../../../services/api/apis";
const { createSlice, createAsyncThunk, current } = require("@reduxjs/toolkit");
  
export const addTestAction = createAsyncThunk(
    'test/add',
    async(payload, thunkAPI) => {
        const response = await apis.addTestApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const getSingleTestAction = createAsyncThunk(
    'test/get',
    async(payload, thunkAPI) => {
        const response = await apis.getSingleTestApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const updateTestAction = createAsyncThunk(
    'test/update',
    async(payload, thunkAPI) => {
        const response = await apis.updateTestApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const getAllTestsAction = createAsyncThunk(
    'test/all',
    async(payload, thunkAPI) => {
        const response = await apis.getAllTestsApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const addTestSubjectsAction = createAsyncThunk(
    'test/subjects',
    async(payload, thunkAPI) => {
        const response = await apis.addTestSubjectsApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const addTestSettingsAction = createAsyncThunk(
    'test/sections',
    async(payload, thunkAPI) => {
        const response = await apis.addTestSettingsApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const addNewTestQuestionAction = createAsyncThunk(
    'test/new/question',
    async(payload, thunkAPI) => {
        const response = await apis.addNewTestQuestionApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return {data, extraData:payload}
        else
            return thunkAPI.rejectWithValue(problem)
})

export const addQuestionsToTestAction = createAsyncThunk(
    'test/addQuestionsToTest',
    async(payload, thunkAPI) => {
        const response = await apis.addQuestionsToTestApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return {data, extraData:payload}
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const removeTestQueAction = createAsyncThunk(
    'test/question/remove',
    async(payload, thunkAPI) => {
        const response = await apis.removeTestQueApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return {data, extraData:payload}
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const changeTestQuesOrderAction = createAsyncThunk(
    'test/question/question-order',
    async(payload, thunkAPI) => {
        const response = await apis.changeTestQuesOrderApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return {data, extraData:payload}
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const removeTestAction = createAsyncThunk(
    'test/remove',
    async(payload, thunkAPI) => {
        const response = await apis.removeTestApi({testId:payload.testId})
        const {ok, problem, data} = response
        if(ok){
            return {data, extraData:payload}
        }
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const getAllInstructionAction = createAsyncThunk(
    'test/getAllInstruction',
    async(payload, thunkAPI) => {
        const response = await apis.getAllInstructionApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const addInstructionAction = createAsyncThunk(
    'test/addAllInstruction',
    async(payload, thunkAPI) => {
        const response = await apis.addInstructionApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const editInstructionAction = createAsyncThunk(
    'test/editAllInstruction',
    async(payload, thunkAPI) => {
        const response = await apis.editInstructionApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const deleteInstructionAction = createAsyncThunk(
    'test/deleteAllInstruction',
    async(payload, thunkAPI) => {
        const response = await apis.deleteInstructionApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const downloadAnswerKeysAction = createAsyncThunk(
    'test/answer-keys/download',
    async(payload, thunkAPI) => {
        const response = await apis.downloadAnswerKeysApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const uploadAnswerKeysAction = createAsyncThunk(
    'test/answer-keys/upload',
    async(payload, thunkAPI) => {
        const response = await apis.uploadAnswerKeysApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const deleteQuestionFromTestAction = createAsyncThunk(
    'deleteQuestionFromTest',
    async(payload, thunkAPI) => {
        const response = await apis.removeTestQueApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return {data: data, extraData: payload}
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const updateTestQuestionDataAction = createAsyncThunk(
    'updateTestQuestionData',
    async(payload, thunkAPI) => {
        const response = await apis.updateQuestionApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return {data: data, extraData: payload}
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const assignTestSyllabusAction = createAsyncThunk(
    'tests/paper/syllabus',
    async(payload, thunkAPI) => {
        const response = await apis.assignTestSyllabusApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return {data: data, extraData: payload}
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const verifyQuestionAction = createAsyncThunk(
    "tests/question/verify",
    async(payload, thunkAPI) => {
        const response = await apis.verifyQuestionApi({questionId:payload.questionId})
        const {ok, problem, data} = response
        if(ok)
            return {data: data, extraData: payload}
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const unverifyQueAction = createAsyncThunk(
    "tests/question/unverify",
    async(payload, thunkAPI) => {
        const response = await apis.unverifyQueApi({questionId:payload.questionId})
        const {ok, problem, data} = response
        if(ok)
            return {data: data, extraData: payload}
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const getTestAttemptDataAction = createAsyncThunk(
    "test/testAttemptData",
    async(payload, thunkAPI) => {
        const response = await apis.getTestAttemptDataApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data

            else
            return thunkAPI.rejectWithValue(problem)
    }
)
export const copyTestAction = createAsyncThunk(
    "tests/copy",
    async(payload, thunkAPI) => {
        const response = await apis.copyTestApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return {data: data, extraData: payload}
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const wordQuestionUploadAction = createAsyncThunk(
    "tests/wordupload",
    async(payload, thunkAPI) => {
        const response = await apis.wordQuestionUploadApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const removeDocQuestionAction = createAsyncThunk(
    "tests/removeWordUpload",
    async(payload, thunkAPI) => {
        const response = await apis.removeDocQuestionApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return {data: data, extraData: payload}
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const addReviewedQuestionsAction = createAsyncThunk(
    "tests/addReviewedQuestions",
    async(payload, thunkAPI) => {
        const response = await apis.addReviewedQuestionsApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return {data: data, extraData: payload}
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const getDemoAttemptAction = createAsyncThunk(
    "tests/getDemoAttempt",
    async(payload, thunkAPI) => {
        const response = await apis.getDemoAttemptApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const deleteTestAttemptAction = createAsyncThunk(
    'test/deleteTestAttempt',
    async(payload, thunkAPI) => {
        const response = await apis.deleteTestAttemptApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const uploadQuePaperAction = createAsyncThunk(
    'upload/questionpaper',
    async(payload, thunkAPI) => {
        const response = await apis.uploadQuePaperApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const changeAttmptStatusAction = createAsyncThunk(
    'test/attempt',
    async(payload, thunkAPI) => {
        const response = await apis.changeAttmptStatusApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return {data, extraData:payload}
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const resultCalculateAction = createAsyncThunk(
    'result-calculated',
    async(payload, thunkAPI) => {
        const response = await apis.resultCalculateApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return {data, extraData:payload}
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const readyTestAction = createAsyncThunk(
    'test-ready',
    async(payload, thunkAPI) => {
        const response = await apis.readyTestApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const uploadOfflineTestResult = createAsyncThunk(
    'upload-test-result-offline',
    async(payload, thunkAPI) => {
        const response = await apis.postOfflineTestExcel(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else{
            ErrorMessage(data?.message);
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getOfflineTestResult = createAsyncThunk(
    'get-test-result-offline',
    async(payload, thunkAPI) => {
        const response = await apis.getOfflineTestResult(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

let initialState = {
    testsList:[],
    resetAddQuestionToTestStatus: STATUS.NOT_STARTED,
    editInstructionStatus: STATUS.NOT_STARTED,
    deleteInstructionStatus: STATUS.NOT_STARTED,
    addInstructionStatus: STATUS.NOT_STARTED,
    updateTestQuestionDataStatus: STATUS.NOT_STARTED, 
    deleteQuestionFromTestStatus: STATUS.NOT_STARTED,
    getTestAttemptDataStatus: STATUS.NOT_STARTED,
    testAttemptData: undefined,
}

const testSlice = createSlice({
    name:'test',
    initialState,
    reducers:{
        
        
        resetAddTest:(state) => {
            state.addTestStatus = STATUS.NOT_STARTED
        },

        resetSingleTestAction:(state) => {
            state.getTestStatus =  STATUS.NOT_STARTED
            state.currentTest = undefined
        },

        resetAddNewTestQuestion:(state) => {
            state.addNewTestQuestionStatus = STATUS.NOT_STARTED
            state.wordQuestionUploadStatus = STATUS.NOT_STARTED
        },

        resetAddQuestionToTestStatus: (state) => {
            state.addQuestionToTestStatus = STATUS.NOT_STARTED
        },

        resetChangeTestQuestionsOrder:state => {
            state.questionsOrderStatus = STATUS.NOT_STARTED
        },

        resetRemoveTest:state => {
            state.removeTestStatus = STATUS.NOT_STARTED
        }, 

        resetAllInstructionStatus: state => {
            state.editInstructionStatus = STATUS.NOT_STARTED
            state.deleteInstructionStatus  = STATUS.NOT_STARTED
            state.addInstructionStatus = STATUS.NOT_STARTED
        },

        newUpdatedQuestionAction: (state, action) => {
            let findSub = _.findIndex(state.currentTest.doc, d => d.subject._id === action.payload.subjectId)
            if(findSub != -1){
                let findQue = _.findIndex(state.currentTest.doc[findSub].questions, s => s._id === action.payload.que._id)
                if(findQue != -1){
                    state.currentTest.doc[findSub].questions[findQue] = {...action.payload.que}
                }
            }
        },

        resetUpdateTestAction : (state) => {
            state.updateTestQuestionDataStatus = STATUS.NOT_STARTED
        },

        resetCopyTest :(state) => {
            state.copyTestStatus = STATUS.NOT_STARTED
        },

        resetUploadOfflineResultStatus: (state) => {
            state.uplOfflineTestResultStatus = STATUS.NOT_STARTED;
        } 
    },
    extraReducers:{
        [readyTestAction.pending]: (state) => {
            state.readyTestStatus = STATUS.FETCHING
        },
        [readyTestAction.fulfilled]: (state, action) => {
            SuccessMessage()
            state.readyTestStatus = STATUS.SUCCESS
            state.currentTest.testReady = action.payload.testReady
        },
        [readyTestAction.rejected]: (state) => {
            ErrorMessage()
            state.readyTestStatus = STATUS.FAILED
        },
        
        [resultCalculateAction.pending]: (state) => {
            state.resultCalculateStatus = STATUS.FETCHING
        },
        [resultCalculateAction.fulfilled]: (state, action) => {
            SuccessMessage()
            state.resultCalculateStatus = STATUS.SUCCESS
            state.testAttemptData = {...state.testAttemptData, attempts:action.payload.data, resultPublished:true}
        },
        [resultCalculateAction.rejected]: (state) => {
            ErrorMessage()
            state.resultCalculateStatus = STATUS.FAILED
        },

        [changeAttmptStatusAction.pending]: (state) => {
            state.changeAttmptStatus = STATUS.FETCHING
        },
        [changeAttmptStatusAction.fulfilled]: (state, action) => {
            SuccessMessage()
            let indx = _.findIndex(state.testAttemptData.attempts,a => a._id == action.payload.extraData.attemptIds[0])
            if(indx != -1){
                state.testAttemptData.attempts[indx].progressStatus = action.payload.extraData.progressStatus
            }

            state.changeAttmptStatus = STATUS.SUCCESS
        },
        [changeAttmptStatusAction.rejected]: (state) => {
            ErrorMessage()
            state.changeAttmptStatus = STATUS.FAILED
        },
        
        [unverifyQueAction.pending]: (state) => {
            state.unverifyQueStatus = STATUS.FETCHING
        },
        [unverifyQueAction.fulfilled]: (state, action) => {
            SuccessMessage('Unverified')
            state.unverifyQueStatus = STATUS.SUCCESS
            let indx = _.findIndex(state.currentTest.sections,s => s._id == action.payload.extraData.secId)
            let queIndx = _.findIndex(state.currentTest.sections[indx].questions,q => q.questionRefId._id == action.payload.data._id)
            state.currentTest.sections[indx].questions[queIndx].questionRefId = action.payload.data
        },
        [unverifyQueAction.rejected]: (state) => {
            ErrorMessage()
            state.unverifyQueStatus = STATUS.FAILED
        },

        [uploadQuePaperAction.pending]: (state) => {
            state.uploadQuePaperStatus = STATUS.FETCHING
        },
        [uploadQuePaperAction.fulfilled]: (state, action) => {
            SuccessMessage()
            state.uploadQuePaperStatus = STATUS.SUCCESS
            state.currentTest = {...state.currentTest, answerKey:action.payload.answerKey, questionPaper:action.payload.questionPaper}
        },
        [uploadQuePaperAction.rejected]: (state) => {
            ErrorMessage()
            state.uploadQuePaperStatus = STATUS.FAILED
        },
        
        [addTestAction.pending]: (state) => {
            state.addTestStatus = STATUS.FETCHING
        },
        [addTestAction.fulfilled]: (state, action) => {
            SuccessMessage('Test Added')
            state.addTestStatus = STATUS.SUCCESS
            state.currentTest = action.payload
        },
        [addTestAction.rejected]: (state) => {
            ErrorMessage()
            state.addTestStatus = STATUS.FAILED
        },

        [getSingleTestAction.pending]: (state) => {
            state.getTestStatus = STATUS.FETCHING
        },
        [getSingleTestAction.fulfilled]: (state, action) => {
            state.getTestStatus = STATUS.SUCCESS
            state.currentTest = action.payload
            state.recentTest = Object.assign({}, action.payload, {recentStatus: true})
        },
        [getSingleTestAction.rejected]: (state) => {
            state.getTestStatus = STATUS.FAILED
        },

        [updateTestAction.pending]: (state) => {
            state.updateTestStatus = STATUS.FETCHING
        },
        [updateTestAction.fulfilled]: (state, action) => {
            SuccessMessage('Test Updated')
            state.updateTestStatus = STATUS.SUCCESS
            state.currentTest = state.currentTest ? {...action.payload, sections:state.currentTest.sections, doc:state.currentTest.doc} : null
            state.testAttemptData = state.testAttemptData ? {...state.testAttemptData, resultPublished:false} : null
        },
        [updateTestAction.rejected]: (state) => {
            ErrorMessage()
            state.updateTestStatus = STATUS.FAILED
        },

        [getAllTestsAction.pending]: (state) => {
            state.getAllTestsStatus = STATUS.FETCHING
        },
        [getAllTestsAction.fulfilled]: (state, action) => {
            state.getAllTestsStatus = STATUS.SUCCESS
            state.testsList = action.payload
        },
        [getAllTestsAction.rejected]: (state) => {
            state.getAllTestsStatus = STATUS.FAILED
        },

        [addTestSubjectsAction.pending]: (state) => {
            state.addTestSubjectStatus = STATUS.FETCHING
        },
        [addTestSubjectsAction.fulfilled]: (state, action) => {
            SuccessMessage()
            state.addTestSubjectStatus = STATUS.SUCCESS
            state.currentTest.sections = action.payload.sections.map(sec => _.findIndex(state.currentTest.sections,s => s._id == sec._id) != -1 ? 
                    Object.assign(sec, {questions:state.currentTest.sections[_.findIndex(state.currentTest.sections,s => s._id == sec._id)].questions}) 
                    : sec
                )
        },
        [addTestSubjectsAction.rejected]: (state) => {
            ErrorMessage()
            state.addTestSubjectStatus = STATUS.FAILED
        },

        [addTestSettingsAction.pending]: (state) => {
            state.addTestSettingsStatus = STATUS.FETCHING
        },
        [addTestSettingsAction.fulfilled]: (state, action) => {
            SuccessMessage()
            state.addTestSettingsStatus = STATUS.SUCCESS
            state.currentTest = {...action.payload, sections:state.currentTest.sections, doc:state.currentTest.doc}
        },
        [addTestSettingsAction.rejected]: (state) => {
            ErrorMessage()
            state.addTestSettingsStatus = STATUS.FAILED
        },

        [addNewTestQuestionAction.pending]: (state) => {
            state.addNewTestQuestionStatus = STATUS.FETCHING
        },
        [addNewTestQuestionAction.fulfilled]: (state, action) => {
            SuccessMessage('Question Added')
            state.addNewTestQuestionStatus = STATUS.SUCCESS
            let indx = _.findIndex(state.currentTest.sections,sec => sec._id == action.payload.extraData.testQuestion.sectionId)
            state.currentTest.sections[indx] = action.payload.data.sections[indx]
        },
        [addNewTestQuestionAction.rejected]: (state) => {
            ErrorMessage()
            state.addNewTestQuestionStatus = STATUS.FAILED
        },

        [addQuestionsToTestAction.pending]: (state) => {
            state.addQuestionToTestStatus = STATUS.FETCHING
        },
        [addQuestionsToTestAction.fulfilled]: (state, action) => {
            if(action.payload.data.error){
                ErrorMessage(action.payload.data.error)
                state.addQuestionToTestStatus = STATUS.FAILED
            }else{
                SuccessMessage()
                const indx = _.findIndex(state.currentTest.sections,s => s._id == action.payload.extraData.sectionId)
                state.currentTest.sections[indx] = action.payload.data.sections[indx]
                state.addQuestionToTestStatus = STATUS.SUCCESS
            }
            
        },
        [addQuestionsToTestAction.rejected]: (state) => {
            ErrorMessage()
            state.addQuestionToTestStatus = STATUS.FAILED
        },

        [removeTestQueAction.pending]: (state) => {
            state.removeTestQueStatus = STATUS.FETCHING
        },
        [removeTestQueAction.fulfilled]: (state, action) => {
            SuccessMessage('Question removed')
            const indx = _.findIndex(state.currentTest.sections,s => s._id == action.payload.extraData.sectionId)
            state.currentTest.sections[indx] = action.payload.data.sections[indx]
            state.removeTestQueStatus = STATUS.SUCCESS
        },
        [removeTestQueAction.rejected]: (state) => {
            ErrorMessage()
            state.removeTestQueStatus = STATUS.FAILED
        },

        [changeTestQuesOrderAction.pending]: (state) => {
            state.questionsOrderStatus = STATUS.FETCHING
        },
        [changeTestQuesOrderAction.fulfilled]: (state, action) => {
            SuccessMessage()
            const indx = _.findIndex(state.currentTest.sections,s => s._id == action.payload.extraData.sectionId)
            state.currentTest.sections[indx] = action.payload.data.sections[indx]
            state.questionsOrderStatus = STATUS.SUCCESS
        },
        [changeTestQuesOrderAction.rejected]: (state) => {
            ErrorMessage()
            state.questionsOrderStatus = STATUS.FAILED
        },
      
        [removeTestAction.pending]: (state) => {
            state.removeTestStatus = STATUS.FETCHING
        },
        [removeTestAction.fulfilled]: (state, action) => {
            SuccessMessage()
            _.remove(state.testsList, t => t._id == action.payload.extraData.testId)
            state.removeTestStatus = STATUS.SUCCESS
        },
        [removeTestAction.rejected]: (state) => {
            ErrorMessage()
            state.removeTestStatus = STATUS.FAILED
        },

        [getAllInstructionAction.pending]: (state) => {
            state.getAllInstructionStatus = STATUS.FETCHING
        },
        [getAllInstructionAction.fulfilled]: (state, action) => {
            state.allInstructionData = action.payload
            state.getAllInstructionStatus = STATUS.SUCCESS
        },
        [getAllInstructionAction.rejected]: (state) => {
            state.getAllInstructionStatus = STATUS.FAILED
        },

        [addInstructionAction.pending]: (state) => {
            state.addInstructionStatus = STATUS.FETCHING
        },
        [addInstructionAction.fulfilled]: (state, action) => {
            SuccessMessage()
            state.addInstructionStatus = STATUS.SUCCESS
            state.allInstructionData = _.concat(state.allInstructionData, action.payload)
        },
        [addInstructionAction.rejected]: (state) => {
            ErrorMessage()
            state.addInstructionStatus = STATUS.FAILED
        },

        [editInstructionAction.pending]: (state) => {
            state.addInstructionStatus = STATUS.FETCHING
        },
        [editInstructionAction.fulfilled]: (state, action) => {
            SuccessMessage()
            state.addInstructionStatus = STATUS.SUCCESS
            let findInst = _.findIndex(state.allInstructionData, s => s._id == action.payload._id) 
            if(findInst != -1){
                state.allInstructionData[findInst] = action.payload
            }
            state.allInstructionData = state.allInstructionData
        },
        [editInstructionAction.rejected]: (state) => {
            ErrorMessage()
            state.addInstructionStatus = STATUS.FAILED
        },

        [deleteInstructionAction.pending]: (state) => {
            state.deleteInstructionStatus = STATUS.FETCHING
        },
        [deleteInstructionAction.fulfilled]: (state, action) => {
            SuccessMessage()
            state.deleteInstructionStatus = STATUS.SUCCESS
            state.allInstructionData = _.filter(state.allInstructionData, s => s._id != action.payload._id)
        },
        [deleteInstructionAction.rejected]: (state) => {
            ErrorMessage()
            state.deleteInstructionStatus = STATUS.FAILED
        },

        [downloadAnswerKeysAction.pending]: (state) => {
            state.downloadAnswerKeysStatus = STATUS.FETCHING
        },
        [downloadAnswerKeysAction.fulfilled]: (state, action) => {
            state.downloadAnswerKeysStatus = STATUS.SUCCESS
            let values = _.filter(action.payload,(d,i) => i != 0 )
            let data = values.map(val => _.zipObject(action.payload[0], val))
            exportFile(data, 'AnswerKeys')
        },
        [downloadAnswerKeysAction.rejected]: (state) => {
            state.downloadAnswerKeysStatus = STATUS.FAILED
        },

        [uploadAnswerKeysAction.pending]: (state) => {
            state.uploadAnswerKeysStatus = STATUS.FETCHING
        },
        [uploadAnswerKeysAction.fulfilled]: (state, action) => {
            SuccessMessage()
            state.uploadAnswerKeysStatus = STATUS.SUCCESS
            state.currentTest.sections = action.payload.sections
        },
        [uploadAnswerKeysAction.rejected]: (state) => {
            ErrorMessage()
            state.uploadAnswerKeysStatus = STATUS.FAILED
        },

        [updateTestQuestionDataAction.pending]: (state) => {
            state.updateTestQuestionDataStatus = STATUS.FETCHING
        },
        [updateTestQuestionDataAction.fulfilled]: (state, action) => {
            SuccessMessage()
            state.updateTestQuestionDataStatus = STATUS.SUCCESS
            let indx = _.findIndex(state.currentTest.sections,sec => sec._id === action.payload.extraData.sectionId)
            if(indx !== -1){
                let findQue = _.findIndex(state.currentTest.sections[indx].questions, q => q.questionRefId._id === action.payload.data._id)
                if(findQue !== -1){
                    state.currentTest.sections[indx].questions[findQue].questionRefId = action.payload.data
                }
            }
        },
        [updateTestQuestionDataAction.rejected]: (state) => {
            ErrorMessage()
            state.updateTestQuestionDataStatus = STATUS.FAILED
        },

        [deleteQuestionFromTestAction.pending]: (state) => {
            state.deleteQuestionFromTestStatus = STATUS.FETCHING
        },
        [deleteQuestionFromTestAction.fulfilled]: (state, action) => {
            SuccessMessage()
            state.deleteQuestionFromTestStatus = STATUS.SUCCESS
            const indx = _.findIndex(state.currentTest.sections,s => s._id == action.payload.extraData.sectionId)
            state.currentTest.sections[indx] = action.payload.data.sections[indx]
            state.removeTestQueStatus = STATUS.SUCCESS
        },
        [deleteQuestionFromTestAction.rejected]: (state) => {
            ErrorMessage()
            state.deleteQuestionFromTestStatus = STATUS.FAILED
        },

        [assignTestSyllabusAction.pending]: (state) => {
            state.assignTestSyllabusStatus = STATUS.FETCHING
        },
        [assignTestSyllabusAction.fulfilled]: (state, action) => {
            SuccessMessage()
            state.assignTestSyllabusStatus = STATUS.SUCCESS
        },
        [assignTestSyllabusAction.rejected]: (state) => {
            ErrorMessage()
            state.assignTestSyllabusStatus = STATUS.FAILED
        },

        [verifyQuestionAction.pending]: (state) => {
            state.verifyQuestionStatus = STATUS.FETCHING
        },
        [verifyQuestionAction.fulfilled]: (state, action) => {
            SuccessMessage('Verified')
            state.verifyQuestionStatus = STATUS.SUCCESS
            
            let indx = _.findIndex(state.currentTest.sections,s => s._id == action.payload.extraData.secId)
            let queIndx = _.findIndex(state.currentTest.sections[indx].questions,q => q.questionRefId._id == action.payload.data._id)
            state.currentTest.sections[indx].questions[queIndx].questionRefId = action.payload.data
        },
        [verifyQuestionAction.rejected]: (state) => {
            ErrorMessage()
            state.verifyQuestionStatus = STATUS.FAILED
        },

        [copyTestAction.pending]: (state) => {
            state.copyTestStatus = STATUS.FETCHING
        },
        [copyTestAction.fulfilled]: (state, action) => {
            SuccessMessage()
            state.copyTestStatus = STATUS.SUCCESS
            state.testsList?.docs && state.testsList.docs.push(action.payload)
        },
        [copyTestAction.rejected]: (state) => {
            ErrorMessage()
            state.copyTestStatus = STATUS.FAILED
        },

        [getTestAttemptDataAction.pending]: (state) => {
            state.getTestAttemptDataStatus = STATUS.FETCHING
        },
        [getTestAttemptDataAction.fulfilled]: (state, action) => {
            state.getTestAttemptDataStatus = STATUS.SUCCESS
            state.testAttemptData = action.payload
        },
        [getTestAttemptDataAction.rejected]: (state) => {
            state.getTestAttemptDataStatus = STATUS.FAILED
        },

        [wordQuestionUploadAction.pending]: (state) => {
            state.wordQuestionUploadStatus = STATUS.FETCHING
        },
        [wordQuestionUploadAction.fulfilled]: (state, action) => {
            state.wordQuestionUploadStatus = STATUS.SUCCESS
            state.currentTest.doc = [...action.payload.doc]
        },
        [wordQuestionUploadAction.rejected]: (state) => {
            state.wordQuestionUploadStatus = STATUS.FAILED
        },

        [removeDocQuestionAction.pending]: (state) => {
            state.removeDocQuestionStatus = STATUS.FETCHING
        },
        [removeDocQuestionAction.fulfilled]: (state, action) => {
            SuccessMessage()
            state.removeDocQuestionStatus = STATUS.SUCCESS
            let extraData = action.payload.extraData
            let secIndx = _.findIndex(state.currentTest.doc, sub => sub.subject._id == extraData.sections[0].subjectId)
            if(state.currentTest.doc[secIndx]){
                state.currentTest.doc[secIndx].questions = _.filter(state.currentTest.doc[secIndx].questions,que => !(_.findIndex(extraData.sections[0].questionIds,id => id == que._id) != -1))
            }
        },
        [removeDocQuestionAction.rejected]: (state) => {
            ErrorMessage()
            state.removeDocQuestionStatus = STATUS.FAILED
        },

        [addReviewedQuestionsAction.pending]: (state) => {
            state.addReviewedQuestionsStatus = STATUS.FETCHING
        },

        [addReviewedQuestionsAction.fulfilled]: (state, action) => {
            state.addReviewedQuestionsStatus = STATUS.SUCCESS
            let subjectIndex = _.findIndex(state.currentTest.sections,sec => sec.subjectRefId._id == action.payload.extraData.questionsObj[0].subjectId)
            state.currentTest.sections[subjectIndex].questions = action.payload.data.sections[subjectIndex].questions
            state.currentTest.doc = action.payload.data.doc
        },

        [addReviewedQuestionsAction.rejected]: (state) => {
            state.addReviewedQuestionsStatus = STATUS.FAILED
        },

        [getDemoAttemptAction.pending]: (state) => {
            state.getDemoAttemptStatus = STATUS.FETCHING
        },

        [getDemoAttemptAction.fulfilled]: (state, action) => {
            state.getDemoAttemptStatus = STATUS.SUCCESS
            state.demoAttemptData = action.payload
        },

        [getDemoAttemptAction.rejected]: (state) => {
            state.getDemoAttemptStatus = STATUS.FAILED
        },

        [deleteTestAttemptAction.pending]: (state) => {
            FetchingMessage('Deleting Attempt')
            state.deleteTestAttemptStatus = STATUS.FETCHING
        },
        [deleteTestAttemptAction.fulfilled]: (state, action) => {
            SuccessMessage()
            state.deleteTestAttemptStatus = STATUS.SUCCESS
            state.demoAttemptData = _.filter(state.demoAttemptData, s => s._id != action.payload._id)
        },
        [deleteTestAttemptAction.rejected]: (state) => {
            ErrorMessage()
            state.deleteTestAttemptStatus = STATUS.FAILED
        },

        
        [uploadOfflineTestResult.pending]: (state) => {
            FetchingMessage('Uploading test results')
            state.uplOfflineTestResultStatus = STATUS.FETCHING
        },
        [uploadOfflineTestResult.fulfilled]: (state, action) => {
            SuccessMessage()
            state.uplOfflineTestResultStatus = STATUS.SUCCESS
            state.offlineResultData = state.offlineResultData ? [ ...state.offlineResultData , ...action.payload ] : action.payload ;
        },
        [uploadOfflineTestResult.rejected]: (state, action) => {
            state.uplOfflineTestResultStatus = STATUS.FAILED
        },

        [getOfflineTestResult.pending]: (state) => {
            state.getOfflineTestResultStatus = STATUS.FETCHING
        },
        [getOfflineTestResult.fulfilled]: (state, action) => {
            state.getOfflineTestResultStatus = STATUS.SUCCESS
            state.offlineResultData = action.payload
        },
        [getOfflineTestResult.rejected]: (state) => {
            ErrorMessage()
            state.getOfflineTestResultStatus = STATUS.FAILED
        },

    }
})



export const {resetAddTest, resetRemoveTest, resetSingleTestAction, resetAddNewTestQuestion, 
    resetChangeTestQuestionsOrder, resetAddQuestionToTestStatus, resetAllInstructionStatus,
    newUpdatedQuestionAction, resetUpdateTestAction, resetCopyTest, resetUploadOfflineResultStatus
} = testSlice.actions

export const testReducer = testSlice.reducer