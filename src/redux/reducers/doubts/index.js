import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import { STATUS } from "../../../Constants";
import { apis } from '../../../services/api/apis'
import _ from 'lodash'
import { SuccessMessage } from '../../../Constants/CommonAlerts';

export const getDoubtsAction = createAsyncThunk(
    'doubts/getdoubt',
    async(payload, thunkAPI) => {
        const response = await apis.getDoubtApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getAllTeachers = createAsyncThunk(
    'doubts/getAllTeachers',
    async(payload, thunkAPI) => {
        const response = await apis.getAllTeachersApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getSingleDoubtAction = createAsyncThunk(
    'doubts/singledoubt',
    async(payload, thunkAPI) => {
        const response = await apis.getSingleDoubtApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const postDoubtCommentAction = createAsyncThunk(
    'doubts/postcomment',
    async(payload, thunkAPI) => {
        const response = await apis.postDoubtCommentApi(payload)
        const {ok, problem, data} = response
        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const updateDoubtDetailAction = createAsyncThunk(
    'doubts/updateDoubtDetail',
    async(payload, thunkAPI) => {
        const response = await apis.updateDoubtDetailApi(payload)
        const {ok, problem, data} = response
        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)


let initialState = {
        doubts:{},
        getDoubtStatus: STATUS.NOT_STARTED
    }

const doubtSlice = createSlice({
    name:'doubt',
    initialState,
    reducers:{
    },
    extraReducers:{
        [getDoubtsAction.pending]: (state) => {
            state.getDoubtStatus = STATUS.FETCHING
        },

        [getDoubtsAction.fulfilled]: (state, action) => {
            state.getDoubtStatus = STATUS.SUCCESS;
            state.doubts = action.payload
        },

        [getDoubtsAction.rejected]:(state) => {
            state.getDoubtStatus = STATUS.FAILED
        },

        [postDoubtCommentAction.pending]: (state) => {
            state.postDoubtCommentStatus = STATUS.FETCHING;
        },

        [postDoubtCommentAction.fulfilled]: (state, action) => {
            state.postDoubtCommentStatus = STATUS.SUCCESS;
            state.currentDoubt.comments.docs = _.union( [action.payload] , state.currentDoubt?.comments?.docs)
        },

        [postDoubtCommentAction.rejected]:(state) => {
            state.postDoubtCommentStatus = STATUS.FAILED
        },

        [getAllTeachers.pending]: (state) => {
            state.getAllTeachersStatus = STATUS.FETCHING;
            state.allTeachers = [];
        },

        [getAllTeachers.fulfilled]: (state, action) => {
            state.getAllTeachersStatus = STATUS.SUCCESS;
            state.allTeachers = action.payload;
        },

        [getAllTeachers.rejected]:(state) => {
            state.getAllTeachersStatus = STATUS.FAILED
        },

        
        [getSingleDoubtAction.pending]: (state) => {
            state.getSingleDoubtStatus = STATUS.FETCHING;
            state.currentDoubt = {};
        },

        [getSingleDoubtAction.fulfilled]: (state, action) => {
            state.getSingleDoubtStatus = STATUS.SUCCESS;
            state.currentDoubt = action.payload;
        },

        [getSingleDoubtAction.rejected]:(state) => {
            state.getSingleDoubtStatus = STATUS.FAILED;
        },


        [updateDoubtDetailAction.pending]: (state) => {
            state.updateDoubtDetailStatus = STATUS.FETCHING;
        },

        [updateDoubtDetailAction.fulfilled]: (state, action) => {
            SuccessMessage()
            state.updateDoubtDetailStatus = STATUS.SUCCESS;
            let newCurrDoubt = Object.assign({}, current(state.currentDoubt), action.payload);
            state.currentDoubt = newCurrDoubt;
            state.doubts.docs = _.map(current(state.doubts?.docs), d => { if( d._id === newCurrDoubt._id){ return newCurrDoubt;} return d;} )
        },

        [updateDoubtDetailAction.rejected]:(state) => {
            state.updateDoubtDetailStatus = STATUS.FAILED;
        },

    }
})

// export const {resetModalStatus} = discussionSlice.actions

export const doubtReducer = doubtSlice.reducer