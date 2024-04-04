import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { orderBy } from "lodash";
import { STATUS } from "../../../Constants";
import { ErrorMessage, SuccessMessage } from "../../../Constants/CommonAlerts";
import { apis } from "../../../services/api/apis";
import _ from 'lodash'

export const postFeedbackSurvey = createAsyncThunk(
    'post/feedback_survey',
    async (payload, thunkApi) => {
        const response = await apis.postSurveyFeedback(payload)
        const { ok, problem, data } = response
        if (ok)
            return data
        else
            return thunkApi.rejectWithValue(problem)
    }
)
export const getFeedbackSurvey = createAsyncThunk(
    'get/feedback_survey',
    async (payload, thunkApi) => {
        const response = await apis.getSurveyFeedback(payload)
        const { ok, problem, data } = response
        if (ok)
            return data
        else
            return thunkApi.rejectWithValue(problem)
    }
)

export const getSingleSurveyData = createAsyncThunk(
    'get/survey/single',
    async (payload, thunkApi) => {
        const response = await apis.getSingleSurvey(payload)
        const { ok, problem, data } = response
        if (ok)
            return data
        else
            return thunkApi.rejectWithValue(problem)
    }
)

export const patchFeedbackSurveyList = createAsyncThunk(
    'patch/feedback_survey_list',
    async (payload, thunkApi) => {
        const response = await apis.patchSurveyFeedbacklist(payload)
        const { ok, problem, data } = response
        if (ok)
            return data
        else
            return thunkApi.rejectWithValue(problem)
    }
)
export const deleteFeedbackSurveyList = createAsyncThunk(
    'delete/feedback_survey_list',
    async (payload, thunkApi) => {
        const response = await apis.deleteSurveyFeedbacklist(payload)
        const { ok, problem, data } = response
        if (ok)
            return data
        else
            return thunkApi.rejectWithValue(problem)
    }
)

export const postFeedbackSurveyTopic = createAsyncThunk(
    'post/survey_topic',
    async (payload, thunkApi) => {
        const response = await apis.postSurveyTopic(payload)
        const { ok, problem, data } = response

        if (ok)
            return data
        else
            return thunkApi.rejectWithValue(problem)
    }
)
export const getFeedbackSurveyTopic = createAsyncThunk(
    'get/survey_topic',
    async (payload, thunkApi) => {
        const response = await apis.getSurveyTopic(payload)
        const { ok, problem, data } = response

        if (ok)
            return data
        else
            return thunkApi.rejectWithValue(problem)
    }
)

export const getSurveyTopicAnswers = createAsyncThunk(
    'get/surveytopic/answer',
    async (payload, thunkApi) => {
        const response = await apis.getSurveyTopicAnswers(payload)
        const { ok, problem, data } = response

        if (ok)
            return data
        else
            return thunkApi.rejectWithValue(problem)
    }
)
export const patchFeedbackSurveyTopic = createAsyncThunk(
    'patch/survey_topic',
    async (payload, thunkApi) => {
        const response = await apis.patchSurveyTopic(payload)
        const { ok, problem, data } = response
        if (ok)
            return data
        else
            return thunkApi.rejectWithValue(problem)
    }
)
export const deleteFeedbackSurveyTopic = createAsyncThunk(
    'delete/survey_topic',
    async (payload, thunkApi) => {
        const response = await apis.deleteSurveyTopic(payload)
        const { ok, problem, data } = response

        if (ok)
            return data
        else
            return thunkApi.rejectWithValue(problem)
    }
)

let initialState = { feedbackSurveyList: [] }

export const FeedbackSurveySlice = createSlice({
    initialState,
    name: 'feedbacksurvey',
    reducers: {
        resetFeedbackData: (state) => {
            state.getsurveytopic = [];
            state.feedbacksurveydata = null;
        },
        resetFeedbackStatus: (state) => {
            state.postFeedbackSurveyStatus = STATUS.NOT_STARTED;
        },
    },
    extraReducers: {
        [postFeedbackSurvey.pending]: state => {
            state.postFeedbackSurveyStatus = STATUS.FETCHING
        },
        [postFeedbackSurvey.fulfilled]: (state, action) => {
            SuccessMessage('Successfully created Survey/Feedback form')
            state.postFeedbackSurveyStatus = STATUS.SUCCESS
            state.feedbacksurveydata = action.payload;
            const newData = state.getfeedbacksurveydata ? [action.payload, ...state.getfeedbacksurveydata] : [action.payload];
            state.getfeedbacksurveydata = orderBy(newData, ['createdAt'], ['desc'])
            state.CurrentSurveyData = state.feedbacksurveydata
        },
        [postFeedbackSurvey.rejected]: state => {
            state.postFeedbackSurveyStatus = STATUS.FAILED
        },
        [getFeedbackSurvey.pending]: state => {
            state.getFeedbackSurveyStatus = STATUS.FETCHING
        },
        [getFeedbackSurvey.fulfilled]: (state, action) => {
            state.getFeedbackSurveyStatus = STATUS.SUCCESS
            state.getfeedbacksurveydata = orderBy([...action.payload], ['createdAt'], ['desc'])
        },
        [getFeedbackSurvey.rejected]: state => {
            state.getFeedbackSurveyStatus = STATUS.FAILED
        },
        [patchFeedbackSurveyList.pending]: state => {
            state.patchSurveylistStatus = STATUS.FETCHING
        },
        [patchFeedbackSurveyList.fulfilled]: (state, action) => {
            SuccessMessage('Updated Successfully ')
            state.patchSurveylistStatus = STATUS.SUCCESS
            state.getfeedbacksurveydata = state.getfeedbacksurveydata.map(d => d._id == action.payload._id ? action.payload : d)
        },
        [patchFeedbackSurveyList.rejected]: state => {
            ErrorMessage() 
            state.patchSurveylistStatus = STATUS.FAILED
        },
        [deleteFeedbackSurveyList.pending]: state => {
            state.deleteSurveylistStatus = STATUS.FETCHING
        },
        [deleteFeedbackSurveyList.fulfilled]: (state, action) => {
            SuccessMessage('Delete Successfully ')
            state.deleteSurveylistStatus = STATUS.SUCCESS
            // state.deleteSurveylistdata = action.payload
            state.getfeedbacksurveydata = state.getfeedbacksurveydata?.filter(surveylistData => surveylistData?._id !== action.payload._id)
            // state.allStaffs = state.allStaffs.filter(staffDATA => staffDATA.id !== action.meta.arg.id)
        },
        [deleteFeedbackSurveyList.rejected]: state => {
            state.deleteSurveylistStatus = STATUS.FAILED
        },
        [postFeedbackSurveyTopic.pending]: state => {
            state.postSurveyTopicStatus = STATUS.FETCHING
        },
        [postFeedbackSurveyTopic.fulfilled]: (state, action) => {
            SuccessMessage('Survey topic add Successfully')
            state.postSurveyTopicStatus = STATUS.SUCCESS
            state.surveytopic = action.payload
            state.getsurveytopic = _.concat(action.payload, state.getsurveytopic)
        },
        [postFeedbackSurveyTopic.rejected]: state => {
            state.postSurveyTopicStatus = STATUS.FAILED
        },
        [getFeedbackSurveyTopic.pending]: state => {
            state.getSurveyTopicStatus = STATUS.FETCHING
        },
        [getFeedbackSurveyTopic.fulfilled]: (state, action) => {
            state.getSurveyTopicStatus = STATUS.SUCCESS;
            state.getsurveytopic = action.payload
        },
        [getFeedbackSurveyTopic.rejected]: state => {
            state.getSurveyTopicStatus = STATUS.FAILED
        },
        [patchFeedbackSurveyTopic.pending]: state => {
            state.patchSurveyTopicStatus = STATUS.FETCHING
        },
        [patchFeedbackSurveyTopic.fulfilled]: (state, action) => {
            state.patchSurveyTopicStatus = STATUS.SUCCESS
            state.getsurveytopic = state.getsurveytopic.map(d => d._id == action.payload._id ? action.payload : d)
            SuccessMessage('Survey topic Update Successfully')
        },
        [patchFeedbackSurveyTopic.rejected]: state => {
            ErrorMessage()
            state.patchSurveyTopicStatus = STATUS.FAILED
        },
        [deleteFeedbackSurveyTopic.pending]: state => {
            state.deleteSurveyTopicStatus = STATUS.FETCHING
        },
        [deleteFeedbackSurveyTopic.fulfilled]: (state, action) => {
            SuccessMessage('Delete Successfully')
            state.deleteSurveyTopicStatus = STATUS.SUCCESS
            state.getsurveytopic = state.getsurveytopic?.filter(surveyTopicData => surveyTopicData?._id !== action.payload?._id)
        },
        [deleteFeedbackSurveyTopic.rejected]: state => {
            ErrorMessage()
            state.deleteSurveyTopicStatus = STATUS.FAILED
        },

        [getSingleSurveyData.pending]: state => {
            state.getSingleSurveyStatus = STATUS.FETCHING;
            state.singleSurveyData = []
        },
        [getSingleSurveyData.fulfilled]: (state, action) => {
            state.getSingleSurveyStatus = STATUS.SUCCESS
            state.singleSurveyData = action.payload;
        },
        [getSingleSurveyData.rejected]: state => {
            ErrorMessage()
            state.singleSurveyData = STATUS.FAILED
        },

        [getSurveyTopicAnswers.pending]: state => {
            state.getSurveyTopicAnsStatus = STATUS.FETCHING;
            state.surveyTopicAnswer = []
        },
        [getSurveyTopicAnswers.fulfilled]: (state, action) => {
            state.getSurveyTopicAnsStatus = STATUS.SUCCESS
            state.surveyTopicAnswer = action.payload;
        },
        [getSurveyTopicAnswers.rejected]: state => {
            ErrorMessage()
            state.getSurveyTopicAnsStatus = STATUS.FAILED
        },
    }
})


export const { resetFeedbackData, resetFeedbackStatus, resetGetParticipantStatus } = FeedbackSurveySlice.actions
export const feedbacksurveyReducer = FeedbackSurveySlice.reducer 