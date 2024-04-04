import { STATUS } from "../../../Constants"
import { ErrorMessage, SuccessMessage } from "../../../Constants/CommonAlerts"
import { apis } from "../../../services/api/apis"
import _ from 'lodash'

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")

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

export const addCommentsAction = createAsyncThunk(
    'add/comments',
    async(payload, thunkAPI) => {
        const response = await apis.addCommentsApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const addLikeAction = createAsyncThunk(
    'add/like',
    async(payload, thunkAPI) => {
        const response = await apis.addLikeApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

const initialState = { }

export const commentsSlice = createSlice({
    name:'comments',
    initialState,
    reducers:{
        
    },
    extraReducers:{
        [addLikeAction.pending]: (state) => {
            state.addLikeStatus = STATUS.FETCHING
        },
        [addLikeAction.fulfilled]: (state, action) => {
            state.addLikeStatus = STATUS.SUCCESS
        },
        [addLikeAction.rejected]:(state) => {
            state.addLikeStatus = STATUS.FAILED
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

        [addCommentsAction.pending]: (state) => {
            state.addCommentsStatus = STATUS.FETCHING
        },
        [addCommentsAction.fulfilled]: (state, action) => {
            state.addCommentsStatus = STATUS.SUCCESS
            let data = action.payload
            let c = state.commentsList?.docs
            let final = []
            if (data.parentComment) {
                final = _.map(c, (it) => {
                if (it._id === data.parentComment._id) {
                    return Object.assign({}, it, {
                    replies: data.parentComment.replies,
                    childComments:
                        it.childComments && Array.isArray(it.childComments)
                        ? [data, ...it.childComments]
                        : [data],
                    });
                }
                return it;
                });
                return final;
            } else {
                final = [data, ...c] 
                return final
            }
            state.commentsList = final 
        },
        [addCommentsAction.rejected]:(state) => {
            state.addCommentsStatus = STATUS.FAILED
        }
    }

})

// export const {} = commentsSlice.actions
export const commentsReducer =  commentsSlice.reducer