import { concat, filter, map } from "lodash"
import { STATUS } from "../../../Constants"
import { ErrorMessage, SuccessMessage } from "../../../Constants/CommonAlerts"
import { apis } from "../../../services/api/apis"

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")

export const addLiveClassBatchAction = createAsyncThunk(
    'live-class/batch/add',
    async (payload, thunkAPI) => {
        const response = await apis.addLiveClassBatchApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getAllLiveClassBatchAction = createAsyncThunk(
    'live-class/batch/get/all',
    async (payload, thunkAPI) => {
        const response = await apis.getAllLiveClassBatchApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getLiveClassBatchAction = createAsyncThunk(
    'live-class/batch/get',
    async (payload, thunkAPI) => {
        const response = await apis.getLiveClassBatchApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const updateLiveClassBatchAction = createAsyncThunk(
    'live-class/batch/update',
    async (payload, thunkAPI) => {
        const response = await apis.updateLiveClassBatchApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const deleteLiveClassBatchAction = createAsyncThunk(
    'live-class/batch/delete',
    async (payload, thunkAPI) => {
        const response = await apis.deleteLiveClassBatchApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const addLiveClassRoomAction = createAsyncThunk(
    'live-class/room/add',
    async (payload, thunkAPI) => {
        const response = await apis.addLiveClassRoomApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getLiveClassRoomAction = createAsyncThunk(
    'live-class/room/get',
    async (payload, thunkAPI) => {
        const response = await apis.getLiveClassRoomApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getLiveClassBatchSubjectAction = createAsyncThunk(
    'live-class/batch/subject/get',
    async (payload, thunkAPI) => {
        const response = await apis.getLiveClassBatchSubjectApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const updateLiveClassBatchSubjectAction = createAsyncThunk(
    'live-class/batch/subject/update',
    async (payload, thunkAPI) => {
        const response = await apis.updateLiveClassBatchSubjectApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const uploadFileAction = createAsyncThunk(
    'live-class/file/add',
    async (payload, thunkAPI) => {
        const response = await apis.uploadFileApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const addBatchSubjectLectureAction = createAsyncThunk(
    'live-class/batch/lecture/add',
    async (payload, thunkAPI) => {
        const response = await apis.addBatchSubjectLectureApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getBatchSubjectLectureAction = createAsyncThunk(
    'live-class/batch/lecture/get',
    async (payload, thunkAPI) => {
        const response = await apis.getBatchSubjectLectureApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const updateBatchSubjectLectureAction = createAsyncThunk(
    'live-class/batch/lecture/update',
    async (payload, thunkAPI) => {
        const response = await apis.updateBatchSubjectLectureApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const deleteBatchSubjectLectureAction = createAsyncThunk(
    'live-class/batch/lecture/delete',
    async (payload, thunkAPI) => {
        const response = await apis.deleteBatchSubjectLectureApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getStaffReviews = createAsyncThunk(
    'live-class-reviews/get',
    async (payload, thunkAPI) => {
        const response = await apis.getStaffReviewsApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return {...data }
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getMoreStaffReviews = createAsyncThunk(
    'live-class-reviews/get/more',
    async (payload, thunkAPI) => {
        const response = await apis.getStaffReviewsApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return {...data }
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)
export const updateStaffReview = createAsyncThunk(
    'live-class-reviews/patch',
    async (payload, thunkAPI) => {
        const response = await apis.updateStaffReviewApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

const initialState = {
    batchSubjectLectures: [],
    allStafffReviews : []
}

export const LiveClasses = createSlice({
    name: 'liveClasses',
    initialState,
    reducers: {
        resetLiveClassBatch: (state) => {
            state.addLiveClassBatchStatus = STATUS.NOT_STARTED
            state.updateLiveClassBatchStatus = STATUS.NOT_STARTED
            state.addLiveClassRoomStatus = STATUS.NOT_STARTED
        },
        resetBatchDetails: (state) => {
            state.liveClassBatch = []
            state.liveClassRooms = []
        },
        resetBatchSchedule: (state) => {
            state.addBatchSubjectLectureStatus = STATUS.NOT_STARTED
            state.updateBatchSubjectLectureStatus = STATUS.NOT_STARTED
            state.deleteBatchSubjectLectureStatus = STATUS.NOT_STARTED
            state.uploadFileStatus = STATUS.NOT_STARTED
            state.uploadedFile = null
        },
        resetScheduleLectures: (state) => {
            state.batchSubjectLectures = []
            state.liveClassBatchSubject = []
        }
    },
    extraReducers: {
        [addLiveClassBatchAction.pending]: (state) => {
            state.addLiveClassBatchStatus = STATUS.FETCHING
        },
        [addLiveClassBatchAction.fulfilled]: (state, action) => {
            state.liveClassBatch = concat(state.liveClassBatch, action.payload)
            SuccessMessage()
            state.addLiveClassBatchStatus = STATUS.SUCCESS
        },
        [addLiveClassBatchAction.rejected]: (state, action) => {
            ErrorMessage()
            state.addLiveClassBatchStatus = STATUS.FAILED
        },

        [getAllLiveClassBatchAction.pending]: (state) => {
            state.getAllLiveClassBatchStatus = STATUS.FETCHING
        },
        [getAllLiveClassBatchAction.fulfilled]: (state, action) => {
            state.allLiveClassBatch = action.payload
            state.getAllLiveClassBatchStatus = STATUS.SUCCESS
        },
        [getAllLiveClassBatchAction.rejected]: (state, action) => {
            ErrorMessage()
            state.getAllLiveClassBatchStatus = STATUS.FAILED
        },

        [getLiveClassBatchAction.pending]: (state) => {
            state.getLiveClassBatchStatus = STATUS.FETCHING
        },
        [getLiveClassBatchAction.fulfilled]: (state, action) => {
            state.liveClassBatch = action.payload
            state.getLiveClassBatchStatus = STATUS.SUCCESS
        },
        [getLiveClassBatchAction.rejected]: (state, action) => {
            ErrorMessage()
            state.getLiveClassBatchStatus = STATUS.FAILED
        },

        [updateLiveClassBatchAction.pending]: (state) => {
            state.updateLiveClassBatchStatus = STATUS.FETCHING
        },
        [updateLiveClassBatchAction.fulfilled]: (state, action) => {
            state.liveClassBatch = map(state.liveClassBatch, batch => batch?._id === action.payload._id ? action.payload : batch)
            SuccessMessage()
            state.updateLiveClassBatchStatus = STATUS.SUCCESS
        },
        [updateLiveClassBatchAction.rejected]: (state, action) => {
            ErrorMessage()
            state.updateLiveClassBatchStatus = STATUS.FAILED
        },

        [deleteLiveClassBatchAction.pending]: (state) => {
            state.deleteLiveClassBatchStatus = STATUS.FETCHING
        },
        [deleteLiveClassBatchAction.fulfilled]: (state, action) => {
            state.allLiveClassBatch = filter(state.allLiveClassBatch, batch => batch._id !== action.payload._id)
            SuccessMessage()
            state.deleteLiveClassBatchStatus = STATUS.SUCCESS
        },
        [deleteLiveClassBatchAction.rejected]: (state, action) => {
            ErrorMessage()
            state.deleteLiveClassBatchStatus = STATUS.FAILED
        },

        [addLiveClassRoomAction.pending]: (state) => {
            state.addLiveClassRoomStatus = STATUS.FETCHING
        },
        [addLiveClassRoomAction.fulfilled]: (state, action) => {
            state.liveClassRooms = concat(state.liveClassRooms, action.payload)
            SuccessMessage()
            state.addLiveClassRoomStatus = STATUS.SUCCESS
        },
        [addLiveClassRoomAction.rejected]: (state, action) => {
            ErrorMessage()
            state.addLiveClassRoomStatus = STATUS.FAILED
        },

        [getLiveClassRoomAction.pending]: (state) => {
            state.getLiveClassRoomStatus = STATUS.FETCHING
        },
        [getLiveClassRoomAction.fulfilled]: (state, action) => {
            state.liveClassRooms = action.payload
            state.getLiveClassRoomStatus = STATUS.SUCCESS
        },
        [getLiveClassRoomAction.rejected]: (state, action) => {
            ErrorMessage()
            state.getLiveClassRoomStatus = STATUS.FAILED
        },

        [getLiveClassBatchSubjectAction.pending]: (state) => {
            state.getLiveClassBatchSubjectStatus = STATUS.FETCHING
        },
        [getLiveClassBatchSubjectAction.fulfilled]: (state, action) => {
            state.liveClassBatchSubject = action.payload
            state.getLiveClassBatchSubjectStatus = STATUS.SUCCESS
        },
        [getLiveClassBatchSubjectAction.rejected]: (state, action) => {
            ErrorMessage()
            state.getLiveClassBatchSubjectStatus = STATUS.FAILED
        },

        [updateLiveClassBatchSubjectAction.pending]: (state) => {
            state.updateLiveClassBatchSubjectStatus = STATUS.FETCHING
        },
        [updateLiveClassBatchSubjectAction.fulfilled]: (state, action) => {
            state.liveClassBatchSubject = map(state.liveClassBatchSubject, sub => sub._id === action.payload._id ? ({ ...sub, noOfLectures: action.payload.noOfLectures, staff: action.payload.staff }) : sub)
            state.updateLiveClassBatchSubjectStatus = STATUS.SUCCESS
        },
        [updateLiveClassBatchSubjectAction.rejected]: (state, action) => {
            ErrorMessage()
            state.updateLiveClassBatchSubjectStatus = STATUS.FAILED
        },

        [uploadFileAction.pending]: (state) => {
            state.uploadFileStatus = STATUS.FETCHING
        },
        [uploadFileAction.fulfilled]: (state, action) => {
            state.uploadedFile = action.payload
            SuccessMessage()
            state.uploadFileStatus = STATUS.SUCCESS
        },
        [uploadFileAction.rejected]: (state, action) => {
            ErrorMessage()
            state.uploadFileStatus = STATUS.FAILED
        },

        [addBatchSubjectLectureAction.pending]: (state) => {
            state.addBatchSubjectLectureStatus = STATUS.FETCHING
        },
        [addBatchSubjectLectureAction.fulfilled]: (state, action) => {
            state.batchSubjectLectures = concat(state.batchSubjectLectures, action.payload)
            SuccessMessage()
            state.addBatchSubjectLectureStatus = STATUS.SUCCESS
        },
        [addBatchSubjectLectureAction.rejected]: (state, action) => {
            ErrorMessage()
            state.addBatchSubjectLectureStatus = STATUS.FAILED
        },

        [getBatchSubjectLectureAction.pending]: (state) => {
            state.getBatchSubjectLectureStatus = STATUS.FETCHING
        },
        [getBatchSubjectLectureAction.fulfilled]: (state, action) => {
            state.batchSubjectLectures = action.payload
            state.getBatchSubjectLectureStatus = STATUS.SUCCESS
        },
        [getBatchSubjectLectureAction.rejected]: (state, action) => {
            ErrorMessage()
            state.getBatchSubjectLectureStatus = STATUS.FAILED
        },

        [updateBatchSubjectLectureAction.pending]: (state) => {
            state.updateBatchSubjectLectureStatus = STATUS.FETCHING
        },
        [updateBatchSubjectLectureAction.fulfilled]: (state, action) => {
            state.batchSubjectLectures = map(state.batchSubjectLectures, lecture => lecture._id === action.payload._id ? action.payload : lecture)
            SuccessMessage()
            state.updateBatchSubjectLectureStatus = STATUS.SUCCESS
        },
        [updateBatchSubjectLectureAction.rejected]: (state, action) => {
            ErrorMessage()
            state.updateBatchSubjectLectureStatus = STATUS.FAILED
        },

        [deleteBatchSubjectLectureAction.pending]: (state) => {
            state.deleteBatchSubjectLectureStatus = STATUS.FETCHING
        },
        [deleteBatchSubjectLectureAction.fulfilled]: (state, action) => {
            state.batchSubjectLectures = filter(state.batchSubjectLectures, lecture => lecture._id !== action.payload._id)
            SuccessMessage()
            state.deleteBatchSubjectLectureStatus = STATUS.SUCCESS
        },
        [deleteBatchSubjectLectureAction.rejected]: (state, action) => {
            ErrorMessage()
            state.deleteBatchSubjectLectureStatus = STATUS.FAILED
        },

        
        [getStaffReviews.pending]: (state, action) => {
            state.getStaffReviewsStatus = STATUS.FETCHING;
            state.allStafffReviews = [];
            state.staffReviews = null;
        },
        [getStaffReviews.fulfilled]: (state, action) => {
            state.getStaffReviewsStatus = STATUS.SUCCESS;
            state.staffReviews = action.payload;
            state.allStafffReviews = concat(state.allStafffReviews, action.payload.docs);
        
        },
        [getStaffReviews.rejected]: (state, action) => {
            ErrorMessage()
            state.getStaffReviewsStatus = STATUS.FAILED;
        },

        
        [getMoreStaffReviews.pending]: (state, action) => {
            state.getMoreStaffReviewsStatus = STATUS.FETCHING;
            state.staffReviews = null;
        },
        [getMoreStaffReviews.fulfilled]: (state, action) => {
            state.getMoreStaffReviewsStatus = STATUS.SUCCESS;
            state.staffReviews = action.payload;
            state.allStafffReviews = concat(state.allStafffReviews, action.payload.docs);
        },
        [getMoreStaffReviews.rejected]: (state, action) => {
            ErrorMessage()
            state.getMoreStaffReviewsStatus = STATUS.FAILED;
        },
        
        [updateStaffReview.pending]: (state) => {
            state.updateStaffReviewStatus = STATUS.FETCHING;
            
        },
        [updateStaffReview.fulfilled]: (state, action) => {
            state.updateStaffReviewStatus = STATUS.SUCCESS;
            state.allStafffReviews = map(state.allStafffReviews, review => review._id === action.payload._id ? action.payload : review )
        },
        [updateStaffReview.rejected]: (state, action) => {
            ErrorMessage()
            state.updateStaffReviewStatus = STATUS.FAILED
        },
    }
})

export const { resetLiveClassBatch, resetBatchDetails, resetBatchSchedule, resetScheduleLectures } = LiveClasses.actions
export const liveClassesReducer = LiveClasses.reducer