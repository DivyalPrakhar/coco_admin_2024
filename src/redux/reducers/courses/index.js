import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import { STATUS } from '../../../Constants'
import { ErrorMessage, SuccessMessage, FetchingMessage } from '../../../Constants/CommonAlerts'
import { apis } from '../../../services/api/apis'
import _, { concat, differenceBy } from 'lodash'

export const addCourseAction = createAsyncThunk(
    'add/course',
    async(payload, thunkAPI) => {
        const response = await apis.addCourseApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getCoursesAction = createAsyncThunk(
    'course/institute',
    async(payload, thunkAPI) => {
        const response = await apis.getCoursesApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const updateCourseAction = createAsyncThunk(
    'course/update',
    async(payload, thunkAPI) => {
        const response = await apis.updateCourseApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const deleteCourseAction = createAsyncThunk(
    'course/delete',
    async(payload, thunkAPI) => {
        const response = await apis.deleteCourseApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return {data, extraData:payload}
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const addCourseSubjectAction = createAsyncThunk(
    'add/courseSubject',
    async(payload, thunkAPI) => {
        const response = await apis.addCourseSubjectApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const updateCourseSubjectAction = createAsyncThunk(
    'course/updateSubject',
    async(payload, thunkAPI) => {
        const response = await apis.updateCourseSubjectApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const getCoursesContentAction = createAsyncThunk(
    'course/getContent',
    async(payload, thunkAPI) => {
        const response = await apis.getCoursesContentApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const addCourseContentAction = createAsyncThunk(
    'course/addContent',
    async(payload, thunkAPI) => {
        const response = await apis.addCourseContentApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const updateCourseContentAction = createAsyncThunk(
    'course/updateContent',
    async(payload, thunkAPI) => {
        const response = await apis.updateCourseContentApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const deleteCourseContentAction = createAsyncThunk(
    'course/deleteContent',
    async(payload, thunkAPI) => {
        const response = await apis.deleteCourseContentApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const updateCourseContentOrderAction = createAsyncThunk(
    'course/updateContentOrder',
    async(payload, thunkAPI) => {
        const response = await apis.updateCourseContentOrderApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const getCourseStudentAction = createAsyncThunk(
    'course/getCoursesStudent',
    async(payload, thunkAPI) => {
        const response = await apis.studentFilterApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const addContentImageAction = createAsyncThunk(
    'course/content-image/add',
    async(payload, thunkAPI) => {
        const response = await apis.addContentImageApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const deleteCourseSubjAction = createAsyncThunk(
    'course/subject/delete',
    async(payload, thunkAPI) => {
        const response = await apis.deleteCourseSubjApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return {data, extraData:payload}
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const updateSubjectsOrderAction = createAsyncThunk(
    'subject-order/update',
    async(payload, thunkAPI) => {
        const response = await apis.updateSubjectsOrderApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const assignCourseTeacherAction = createAsyncThunk(
    'assign-course-teacher/post',
    async(payload, thunkAPI) => {
        const response = await apis.assignCourseTeacherApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const getCourseTeachersAction = createAsyncThunk(
    'get-course-teachers/get',
    async(payload, thunkAPI) => {
        const response = await apis.getCourseTeacherApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const removeCourseTeacherAction = createAsyncThunk(
    'remove-course-teachers/delete',
    async(payload, thunkAPI) => {
        const response = await apis.removeCourseTeacherApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

let initialState = {
        courseList:[],
        getCourseStudentStatus: STATUS.NOT_STARTED
    }

const courseSlice = createSlice({
    name:'course',
    initialState,
    reducers:{
        resetCourseStatus:(state) => {
            state.addCourseStatus = STATUS.NOT_STARTED
            state.updateCourseStatus = STATUS.NOT_STARTED
        },

        resetCourseSubjectStatus:(state) => {
            state.addCourseSubjectStatus = STATUS.NOT_STARTED
            state.updateCourseSubjectStatus = STATUS.NOT_STARTED
        }, 

        resetCourseState: (state) => {
            state.addCourseContentStatus = STATUS.NOT_STARTED
        },

        resetAddContentImage: (state) => {
            state.addContentImageStatus = STATUS.NOT_STARTED
        },
    },
    extraReducers:{
        [removeCourseTeacherAction.pending]: (state) => {
            state.removeCourseTeacherStatus = STATUS.FETCHING
        },
        [removeCourseTeacherAction.fulfilled]: (state, action) => {
            _.remove(state.courseSubjects,d => d._id === action.payload._id)
            SuccessMessage('removed')
            state.removeCourseTeacherStatus = STATUS.SUCCESS
        },
        [removeCourseTeacherAction.rejected]:(state) => {
            state.removeCourseTeacherStatus = STATUS.FAILED
        },
        
        [getCourseTeachersAction.pending]: (state) => {
            state.getCourseTeachersStatus = STATUS.FETCHING
        },
        [getCourseTeachersAction.fulfilled]: (state, action) => {
            state.getCourseTeachersStatus = STATUS.SUCCESS
            state.courseSubjects = action.payload || []
            // state.courseList = state.courseList.map(d => d._id == action.payload._id ? action.payload : d)
        },
        [getCourseTeachersAction.rejected]:(state) => {
            state.getCourseTeachersStatus = STATUS.FAILED
        },
        
        [assignCourseTeacherAction.pending]: (state) => {
            state.assignCourseTeacherStatus = STATUS.FETCHING
        },
        [assignCourseTeacherAction.fulfilled]: (state, action) => {
            state.assignCourseTeacherStatus = STATUS.SUCCESS

            if(action.payload?.length){
                if(state.courseSubjects?.length){
                    state.courseSubjects = _.concat(state.courseSubjects, action.payload) 
                }
                else{
                    state.courseSubjects = action.payload
                }
            }

            // state.courseList = state.courseList.map(d => d._id == action.payload._id ? action.payload : d)
            SuccessMessage()
        },
        [assignCourseTeacherAction.rejected]:(state) => {
            state.assignCourseTeacherStatus = STATUS.FAILED
        },

        [addContentImageAction.pending]: (state) => {
            state.addContentImageStatus = STATUS.FETCHING
        },
        [addContentImageAction.fulfilled]: (state, action) => {
            SuccessMessage('Image Added')
            state.courseList = state.courseList.map(c => ({...c, subjects:c.subjects.map((sub, i) => ({...sub, image:action.payload.subjects[i]?.image}))}))
            state.addContentImageStatus = STATUS.SUCCESS
        },
        [addContentImageAction.rejected]:(state) => {
            ErrorMessage()
            state.addContentImageStatus = STATUS.FAILED
        },
        
        [addCourseAction.pending]: (state) => {
            state.addCourseStatus = STATUS.FETCHING
        },
        [addCourseAction.fulfilled]: (state, action) => {
            SuccessMessage('Course Added')
            state.addCourseStatus = STATUS.SUCCESS
            state.courseList.unshift(action.payload)
        },
        [addCourseAction.rejected]:(state) => {
            ErrorMessage()
            state.addCourseStatus = STATUS.FAILED
        },

        [deleteCourseSubjAction.pending]: (state) => {
            state.deleteCourseSubjStatus = STATUS.FETCHING
        },
        [deleteCourseSubjAction.fulfilled]: (state, action) => {
            SuccessMessage('Subject deleted')
            let extraData = action.payload.extraData
            let courseIndx = _.findIndex(state.courseList,c => c._id == extraData.courseId)

            if(courseIndx != -1)
                _.remove(state.courseList[courseIndx].subjects,s => s._id == extraData.syllabusId)
            state.deleteCourseSubjStatus = STATUS.SUCCESS
        },
        [deleteCourseSubjAction.rejected]:(state) => {
            ErrorMessage()
            state.deleteCourseSubjStatus = STATUS.FAILED
        },

        [getCoursesAction.pending]: (state) => {
            state.getCoursesStatus = STATUS.FETCHING
        },
        [getCoursesAction.fulfilled]: (state, action) => {
            state.getCoursesStatus = STATUS.SUCCESS
            state.courseList=action.payload
        },
        [getCoursesAction.rejected]:(state) => {
            state.getCoursesStatus = STATUS.FAILED
        },

        [updateCourseAction.pending]: (state) => {
            state.updateCourseStatus = STATUS.FETCHING
        },
        [updateCourseAction.fulfilled]: (state, action) => {
            state.updateCourseStatus = STATUS.SUCCESS
            state.courseList = state.courseList.map(d => d._id == action.payload._id ? action.payload : d)
            SuccessMessage()
        },
        [updateCourseAction.rejected]:(state) => {
            state.updateCourseStatus = STATUS.FAILED
        },

        [deleteCourseAction.pending]: (state) => {
            state.deleteCourseStatus = STATUS.FETCHING
        },
        [deleteCourseAction.fulfilled]: (state, action) => {
            state.deleteCourseStatus = STATUS.SUCCESS
            _.remove(state.courseList, d => d._id == action.payload.extraData.id)
        },
        [deleteCourseAction.rejected]:(state) => {
            state.deleteCourseStatus = STATUS.FAILED
        },

        [addCourseSubjectAction.pending]: (state) => {
            state.addCourseSubjectStatus = STATUS.FETCHING
        },
        [addCourseSubjectAction.fulfilled]: (state, action) => {
            SuccessMessage('Course Added')
            state.addCourseSubjectStatus = STATUS.SUCCESS
            state.courseList = state.courseList.map(d => d._id == action.payload._id ? action.payload : d)
        },
        [addCourseSubjectAction.rejected]:(state) => {
            ErrorMessage()
            state.addCourseSubjectStatus = STATUS.FAILED
        },

        [updateCourseSubjectAction.pending]: (state) => {
            state.updateCourseSubjectStatus = STATUS.FETCHING
        },
        [updateCourseSubjectAction.fulfilled]: (state, action) => {
            state.updateCourseSubjectStatus = STATUS.SUCCESS
            let courseIndx = _.findIndex(state.courseList, c => c._id == action.payload.course)
            let subjectIndx = _.findIndex(state.courseList[courseIndx].subjects, s => s._id == action.payload.subject._id)
            
            state.courseList[courseIndx].subjects[subjectIndx].displayName = action.payload.subject.displayName
            state.courseList[courseIndx].subjects[subjectIndx].teachers = action.payload.subject.teachers?.length ? action.payload.subject.teachers : []
            //state.courseList = state.courseList.map(d => d.id == action.payload.id ? action.payload : d)
            SuccessMessage()
        },
        [updateCourseSubjectAction.rejected]:(state) => {
            state.updateCourseSubjectStatus = STATUS.FAILED
        },

        [getCoursesContentAction.pending]: (state) => {
            state.getCoursesContentStatus = STATUS.FETCHING
        },
        [getCoursesContentAction.fulfilled]: (state, action) => {
            state.getCoursesContentStatus =  STATUS.SUCCESS
            state.courseContentData = action.payload
        },
        [getCoursesContentAction.rejected]:(state) => {
            state.getCoursesContentStatus = STATUS.FAILED
        },

        [addCourseContentAction.pending]: (state) => {
            state.addCourseContentStatus = STATUS.FETCHING
        },
        [addCourseContentAction.fulfilled]: (state, action) => {
            state.addCourseContentStatus =  STATUS.SUCCESS
            state.courseContentData[action.payload.path] = action.payload.data
        },
        [addCourseContentAction.rejected]:(state) => {
            state.addCourseContentStatus = STATUS.FAILED
        },

        [updateCourseContentAction.pending]: (state) => {
            state.addCourseContentStatus = STATUS.FETCHING
        },
        [updateCourseContentAction.fulfilled]: (state, action) => {
            state.addCourseContentStatus =  STATUS.SUCCESS
            state.courseContentData[action.payload.path] = action.payload.data
        },
        [updateCourseContentAction.rejected]:(state) => {
            state.addCourseContentStatus = STATUS.FAILED
        },

        [updateCourseContentOrderAction.pending]: (state) => {
            state.addCourseContentStatus = STATUS.FETCHING
        },
        [updateCourseContentOrderAction.fulfilled]: (state, action) => {
            state.addCourseContentStatus =  STATUS.SUCCESS
            state.courseContentData[action.payload.path] = action.payload.data
        },
        [updateCourseContentOrderAction.rejected]:(state) => {
            state.addCourseContentStatus = STATUS.FAILED
        },

        [deleteCourseContentAction.pending]: (state) => {
            state.deleteCourseContentStatus = STATUS.FETCHING
        },
        [deleteCourseContentAction.fulfilled]: (state, action) => {
            state.deleteCourseContentStatus =  STATUS.SUCCESS
            state.courseContentData[action.payload.path] = action.payload.data
        },
        [deleteCourseContentAction.rejected]:(state) => {
            state.deleteCourseContentStatus = STATUS.FAILED
        },

        [getCourseStudentAction.pending]: (state) => {
            state.getCourseStudentStatus = STATUS.FETCHING
        },
        [getCourseStudentAction.fulfilled]: (state, action) => {
            state.getCourseStudentStatus =  STATUS.SUCCESS
            state.courseStudentData = action.payload
        },
        [getCourseStudentAction.rejected]:(state) => {
            state.getCourseStudentStatus = STATUS.FAILED
        },

        [updateSubjectsOrderAction.pending]: (state) => {
            state.subjectOrderStatus = STATUS.FETCHING
        },
        [updateSubjectsOrderAction.fulfilled]: (state, action) => {
            state.subjectOrderStatus =  STATUS.SUCCESS

            let courseIndx =  _.findIndex(state.courseList,c => c._id === action.payload._id)
            if(courseIndx !== -1){
                let subs = state.courseList[courseIndx].subjects
                state.courseList[courseIndx].subjects = subs.map(s => ({...s, order:_.intersectionBy(action.payload.subjects, [s], '_id')?.[0].order}))
            }

            SuccessMessage()

        },
        [updateSubjectsOrderAction.rejected]:(state) => {
            state.subjectOrderStatus = STATUS.FAILED
        },

    }
})

export const {resetCourseStatus, resetAddContentImage, resetCourseSubjectStatus, resetCourseState} = courseSlice.actions

export const courseReducer = courseSlice.reducer