import _ from 'lodash';
import { STATUS } from "../../../Constants";
import { ErrorMessage, FetchingMessage, SuccessMessage } from "../../../Constants/CommonAlerts";
import { apis } from "../../../services/api/apis";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const getDiscussionTopicAction = createAsyncThunk(
    'create/getDiscussionTopic',
    async(payload, thunkAPI) => {
        let response  
        if(payload.topicId){
            response = await apis.getSingleDiscussionTopicApi(payload)
        } else{        
            response = await apis.getDiscussionTopicApi(payload)
        }

        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const getSingleDiscussionTopicAction =  createAsyncThunk(
    'get/newGetSingleDiscussionTopic',
    async(payload, thunkAPI) => {
        const response = await apis.getSingleDiscussionTopicApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const addDiscussionTopicAction = createAsyncThunk(
    'create/addDiscussionTopic',
    async(payload, thunkAPI) => {
        let response 
        
        if(payload.apiType === 'post'){
            response = await apis.addDiscussionTopicApi({...payload.data})
        }else{
            response = await apis.updateDiscussionTopicApi({...payload.data})
        }

        const {ok, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(data)
    }
)

export const approveTopicQuestionAction = createAsyncThunk(
    'create/approveTopicQuestion',
    async(payload, thunkAPI) => {
        let response = await apis.approveTopicQuestionApi(payload)

        const {ok, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(data)
    }
)

export const deleteTopicAction = createAsyncThunk(
    'delete/topic',
    async(payload, thunkAPI) => {
        let response = await apis.deleteTopicApi(payload)

        const {ok, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(data)
    }
)

export const deleteCommentAction = createAsyncThunk(
    'delete/comment',
    async(payload, thunkAPI) => {
        let response = await apis.deleteCommentApi(payload)

        const {ok, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(data)
    }
)

export const getCommentsAction = createAsyncThunk(
    'get/comments',
    async(payload, thunkAPI) => {
        const response = await apis.getCommentsApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getRepliesAction = createAsyncThunk(
    'get/replies',
    async(payload, thunkAPI) => {
        const response = await apis.getRepliesApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

const initialState = {
    discussionTopicStatus: STATUS.NOT_STARTED,
    discussionTopicData: undefined,
    addDiscussionTopicStatus: STATUS.NOT_STARTED,
    parentTopic: null,
    allParentTopic: []
}

const filterRouteData = (action) => {
    let data = JSON.parse(localStorage.getItem("topicRoute")) || []
    let oldDataIndex = _.findIndex(data, d => d._id === action.payload._id) //get the last index from data

    if(oldDataIndex !== -1){
        //get all the data till particuler index
        let dataTillIndex = _.slice(data, 0, oldDataIndex+1)
        localStorage.setItem("topicRoute", JSON.stringify(_.uniqBy(_.compact(dataTillIndex))))
    }else{
        //check if there is already data
        if(data.length > 0){
            //if data then check for last index and see if there is same subTopic that we got in the action 
            let lastData = data[data.length - 1]
            let findSubChild = _.findIndex(lastData.subTopics.docs, d => d._id === action.payload._id)
            
            if(findSubChild !== -1){
                localStorage.setItem("topicRoute", JSON.stringify(_.uniqBy(_.compact(_.concat(data, action.payload)), '_id')))    
            }else{
                localStorage.removeItem("topicRoute")
                return 'reload'
            }
        }else{
            localStorage.setItem("topicRoute", JSON.stringify(_.uniqBy(_.compact(_.concat(data, action.payload)), '_id')))
        }
    }
}

const discussionTopicSlice = createSlice({
    name:'discussionTopicReducer',
    initialState,
    reducers: {
        resetDiscussionTopicStatus:(state) => {
            state.addDiscussionTopicStatus = STATUS.NOT_STARTED
        }
    },
    extraReducers:{
        [deleteCommentAction.pending] : (state, action) => {
            state.deleteCommentAction = STATUS.FETCHING
        },
        [deleteCommentAction.fulfilled]:(state, action)=>{
            state.deleteCommentAction = STATUS.SUCCESS
            SuccessMessage('Comment removed')

            if(action.payload?.parentComment){
                let cmntIndx = _.findIndex(state.commentsList.docs,d => d._id === action.payload?.parentComment)

                if(cmntIndx != -1){
                    if(state.commentsList.docs[cmntIndx].childComments?.length)
                    _.remove(state.commentsList.docs[cmntIndx].childComments,l => l._id == action.payload._id)
                }
            }
            else
                _.remove(state.commentsList.docs,l => l._id == action.payload._id)
        },
        [deleteCommentAction.rejected]:(state, action)=>{
            state.deleteCommentAction = STATUS.FAILED
        },

        [getRepliesAction.pending]: (state) => {
            state.getRepliesStatus = STATUS.FETCHING
        },
        [getRepliesAction.fulfilled]: (state, action) => {
            state.getRepliesStatus = STATUS.SUCCESS
            // state.commentsList = action.payload
            if(action.payload?.docs?.length){
                let indx = _.findIndex(state.commentsList.docs,l => l._id === action.payload.docs[0].parentComment._id)
                if(indx != -1){
                    state.commentsList.docs[indx].childComments = action.payload.docs
                }
            }
        },
        [getRepliesAction.rejected]:(state) => {
            state.getRepliesStatus = STATUS.FAILED
        },

        [getCommentsAction.pending]: (state) => {
            state.getCommentsStatus = STATUS.FETCHING
        },
        [getCommentsAction.fulfilled]: (state, action) => {
            state.getCommentsStatus = STATUS.SUCCESS
            state.commentsList = action.payload
        },
        [getCommentsAction.rejected]:(state) => {
            state.getCommentsStatus = STATUS.FAILED
        },

        [getDiscussionTopicAction.pending] : (state, action) => {
            state.discussionTopicStatus = STATUS.FETCHING
        },

        [getDiscussionTopicAction.fulfilled]:(state, action)=>{
            state.discussionTopicStatus = STATUS.SUCCESS
            if(action.payload.subTopics){
                filterRouteData(action)
                state.discussionTopicData = action.payload.subTopics
                state.parentTopic = action.payload
                state.allParentTopic.push(action.payload)
            }else{
                localStorage.removeItem("topicRoute")
                state.discussionTopicData = action.payload
                state.parentTopic = null
                state.allParentTopic = []
            }
        },
        [getDiscussionTopicAction.rejected]:(state)=>{
            state.discussionTopicStatus = STATUS.FAILED
        },

        [deleteTopicAction.pending] : (state) => {
            state.deleteTopicStatus = STATUS.FETCHING
        },

        [deleteTopicAction.fulfilled]:(state, action)=>{
            state.deleteTopicStatus = STATUS.SUCCESS
            SuccessMessage('Topic removed')
            
            if(state.discussionTopicData?.docs?.length){
                _.remove(state.discussionTopicData.docs,d => d._id === action?.payload?._id)
            }
        },

        [deleteTopicAction.rejected]:(state, action)=>{
            state.deleteTopicStatus = STATUS.FAILED
        },

        [getSingleDiscussionTopicAction.pending] : (state, action) => {
            state.singleDiscussionTopicStatus = STATUS.FETCHING
        },
        [getSingleDiscussionTopicAction.fulfilled]:(state, action)=>{
            state.singleDiscussionTopicStatus = STATUS.SUCCESS
            state.currentDiscussionData = action.payload
        },
        [getSingleDiscussionTopicAction.rejected]:(state, action)=>{
            state.singleDiscussionTopicStatus = STATUS.FAILED
        },

        [addDiscussionTopicAction.pending]: (state) => {
            FetchingMessage()
            state.addDiscussionTopicStatus = STATUS.FETCHING
        },

        [addDiscussionTopicAction.fulfilled]: (state, action) => {
            SuccessMessage();
            state.addDiscussionTopicStatus = STATUS.SUCCESS

            let topicIndx = _.findIndex(state.discussionTopicData.docs, d => d._id === action.payload._id)
            console.log('actions', action, topicIndx)
            if( topicIndx != -1){
                let dataIndex = topicIndx
                state.discussionTopicData.docs[dataIndex] = action.payload 
            }else{
                state.discussionTopicData.docs.push(action.payload)
            }
        },

        [addDiscussionTopicAction.rejected]:(state, action) => {
            ErrorMessage(action?.payload?.message || '')
            state.addDiscussionTopicStatus = STATUS.FAILED
        },

        [approveTopicQuestionAction.pending]: (state) => {
            FetchingMessage();
            state.addDiscussionTopicStatus = STATUS.FETCHING
        },

        [approveTopicQuestionAction.fulfilled]: (state, action) => {
            SuccessMessage();
            state.addDiscussionTopicStatus = STATUS.SUCCESS
            if(_.findIndex(state.discussionTopicData.docs, d => d._id === action.payload._id) !== -1){
                let dataIndex = _.findIndex(state.discussionTopicData.docs, d => d._id === action.payload._id)
                state.discussionTopicData.docs[dataIndex] = action.payload 
            }else{
                state.discussionTopicData.docs.push(action.payload)
            }
        },

        [approveTopicQuestionAction.rejected]:(state, action) => {
            ErrorMessage(action?.payload?.message || '')
            state.addDiscussionTopicStatus = STATUS.FAILED
        }
    }
})

export const {resetDiscussionTopicStatus} = discussionTopicSlice.actions
export const discussionTopicReducer = discussionTopicSlice.reducer