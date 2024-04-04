import _, { concat, map } from 'lodash';
import { message } from "antd";
import { STATUS } from "../../../Constants";
import { ErrorMessage, SuccessMessage } from "../../../Constants/CommonAlerts";
import { apis } from "../../../services/api/apis";
const { createSlice, createAsyncThunk, current } = require("@reduxjs/toolkit");

export const addStudentAction = createAsyncThunk(
    'create/member',
    async(payload, thunkAPI) => {
        const response = await apis.addStudentApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const addAddressAction = createAsyncThunk(
    'address/add',
    async(payload, thunkAPI) => {
        const response = await apis.addAddressApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const updateStudentAction = createAsyncThunk(
    'student/update',
    async(payload, thunkAPI) => {
        const response = await apis.updateStudentApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else 
        return thunkAPI.rejectWithValue(problem)

    }
)

export const getStudentAction = createAsyncThunk(
    'member/get',
    async(payload, thunkAPI) => {
        const response = await apis.getAlumniApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem) 
    }
)

export const searchStudentsAction = createAsyncThunk(
    'student/search',
    async(payload, thunkAPI) => {
        const response = await apis.searchStudents(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const addEducationAction = createAsyncThunk(
    'member/addEducation',
    async(payload, thunkAPI) => {
        const response = await apis.addEducationApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const assignGroupsAction = createAsyncThunk(
    'member/groups',
    async(payload, thunkAPI) => {
        const response = await apis.assignGroupsApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const editEducationAction = createAsyncThunk(
    'member/editEducation',
    async(payload, thunkAPI) => {
        const response = await apis.editEducationApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const removeGroupAction = createAsyncThunk(
    'group/remove',
    async(payload, thunkAPI) => {
        const response = await apis.removeGroupApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const updateMemberAction = createAsyncThunk(
    'member/update',
    async(payload, thunkAPI) => {
        const response = await apis.updateMemberApi(payload.data)
        const {ok, problem, data} = response

        if(ok)
            return {data, extraData:payload.batch}
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const addStudentExcelAction = createAsyncThunk(
    'student/batch-member',
    async(payload, thunkAPI) => {
        const response = await apis.addStudentExcelApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const deleteAlumniEducationAction = createAsyncThunk(
    'member/deleteEducation', 
    async(payload, thunkAPI) => {
        const response = await apis.deleteAlumniEducationApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return ({data, extraData:payload})
        else 
            return thunkAPI.rejectWithValue(problem)
    }
)


export const addExperienceAction = createAsyncThunk(
    'member/addExperience',
    async(payload, thunkAPI) => {
        const response = await apis.addExperienceApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const editExperienceAction = createAsyncThunk(
    'member/editExperience',
    async(payload, thunkAPI) => {
        const response = await apis.editExperienceApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const deleteAlumniExperienceAction = createAsyncThunk(
    'member/deleteExperience', 
    async(payload, thunkAPI) => {
        const response = await apis.deleteAlumniExperienceApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return ({data, extraData:payload})
        else 
            return thunkAPI.rejectWithValue(problem)
    }
)

export const assignStudCoursesAction = createAsyncThunk(
    'student/courses/assign', 
    async(payload, thunkAPI) => {
        const response = await apis.assignStudCoursesApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return data
        else 
            return thunkAPI.rejectWithValue(problem)
    }
)

export const removeStudCourseAction = createAsyncThunk(
    'student/courses/remove', 
    async(payload, thunkAPI) => {
        const response = await apis.removeStudCoursesApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return {data, extraData:payload}
        else 
            return thunkAPI.rejectWithValue(problem)
    }
)

export const updateAddressAction = createAsyncThunk(
    'address/update', 
    async(payload, thunkAPI) => {
        const response = await apis.updateAddressApi(payload)
        const {ok, problem, data} = response

        if(ok)
            return {data, extraData:payload}
        else 
            return thunkAPI.rejectWithValue(problem)
    }
)

export const assignStudPkgAction = createAsyncThunk(
    '/package/assign',
    async(payload, thunkAPI) => {
        const response = await apis.assignStudPkgApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const removeStudPkgeAction = createAsyncThunk(
    'student/package/remove',
    async(payload, thunkAPI) => {
        const response = await apis.deleteStudPkgApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return {data, extraData:payload}
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getAllStudentsAction = createAsyncThunk(
    'all-students/get',
    async(payload, thunkAPI) => {
        const response = await apis.getAllStudentsApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getStudentAddressAction = createAsyncThunk(
    'student-address/get',
    async(payload, thunkAPI) => {
        const response = await apis.getStudentAddressApi(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const studentBulkValidateAction = createAsyncThunk(
    'student-bulk-validate/post',
    async(payload, thunkAPI) => {
        const response = await apis.uploadStudentBulkValidate(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const studentBulkUpdateAction = createAsyncThunk(
    'student-bulk-update/post',
    async(payload, thunkAPI) => {
        const response = await apis.uploadStudentBulkUpdate(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const studentBulkAssignAction = createAsyncThunk(
    'student-bulk-assign/post',
    async(payload, thunkAPI) => {
        const response = await apis.uploadStudentBulkAssign(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getStdentBulkPendingAction = createAsyncThunk(
    'student-bulk-validate-get/get',
    async(payload, thunkAPI) => {
        const response = await apis.getStudentBulkPending(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const deleteBulkUploadAction = createAsyncThunk(
    'student-bulk-validate-cancel/delete',
    async(payload, thunkAPI) => {
        const response = await apis.deleteStudentBulkUpload(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const updateStudentPackageAction = createAsyncThunk(
    'student-package/patch',
    async(payload, thunkAPI) => {
        const response = await apis.updateStudentPackageDetails(payload)
        const {ok, problem, data} = response

        if(ok){
            return data
        }else{
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const assignBatchAction = createAsyncThunk(
    'add/batch',
    async (payload, thunkAPI) => {
        const response = await apis.assignBatchApi(payload)
        const { ok, problem, data } = response
        if (ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const getStudentAssignBatchAction = createAsyncThunk(
    'get/assigned/batch',
    async (payload, thunkAPI) => {
        const response = await apis.getAssignedBatchApi(payload)
        const { ok, problem, data } = response
        if (ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

const initialState = {
    addEducationStatus: STATUS.NOT_STARTED,
    addExperienceStatus: STATUS.NOT_STARTED,
    deleteAlumniEducationStatus: STATUS.NOT_STARTED,
    deleteAlumniExperienceStatus: STATUS.NOT_STARTED
}

const studentSlice = createSlice({
    name:'student',
    initialState,
    reducers: {
        resetAssignPkg : (state) => {
            state.assignPkgStatus = STATUS.NOT_STARTED
        },

        resetEducationStatusAction: (state) => {
          state.addEducationStatus = STATUS.NOT_STARTED
          state.deleteAlumniEducationStatus = STATUS.NOT_STARTED
        },
        
        resetExperienceStatusAction: (state) => {
          state.addExperienceStatus = STATUS.NOT_STARTED
          state.deleteStudentExperienceStatus = STATUS.NOT_STARTED
        },

        resetDuplicateEntries: (state) => {
            state.duplicateEntries = null
        },

        resetAddStudent: (state) => {
            state.addStudentStatus = STATUS.NOT_STARTED
            state.updateAddressStatus = STATUS.NOT_STARTED
            state.addAddressStatus = STATUS.NOT_STARTED
            state.currentStudent = null
        },

        resetUpdateStudent:state => {
            state.updateStudentStatus = STATUS.NOT_STARTED
        },

        resetUpdateAddress:(state) => {
            state.updateAddressStatus = STATUS.NOT_STARTED
            state.addAddressStatus = STATUS.NOT_STARTED
        },
        resetBulkUploadData: (state) => {
            state.bulkStudentUpload = null;
            state.deleteBulkUploadStatus = STATUS.NOT_STARTED;
            state.uploadBulkStatus = STATUS.NOT_STARTED
        }
    },
    extraReducers:{
        [updateStudentPackageAction.pending] : (state) => {
            state.updateStudentPackageStatus = STATUS.FETCHING
        },
        [updateStudentPackageAction.fulfilled]:(state, action)=>{
            state.updateStudentPackageStatus = STATUS.SUCCESS
            state.currentStudent.packages = state.currentStudent.packages.map(pkg => 
                ({...pkg, validity:_.find(action.payload?.packages || [],p => p._id === pkg._id)?.validity})    
            )
            SuccessMessage()
        },
        [updateStudentPackageAction.rejected] : (state) => {
            state.updateStudentPackageStatus = STATUS.FAILED
        },
        
        [getStudentAddressAction.pending] : (state) => {
            state.getStudentAddressStatus = STATUS.FETCHING
        },
        [getStudentAddressAction.fulfilled]:(state, action)=>{
            state.getStudentAddressStatus = STATUS.SUCCESS
            state.studentAddress = action.payload
        },
        [getStudentAddressAction.rejected] : (state) => {
            state.getStudentAddressStatus = STATUS.FAILED
        },


        [getAllStudentsAction.fulfilled]:(state, action)=>{
            state.getAllStudentsStatus = STATUS.SUCCESS
            state.allStudents = action.payload
        },

        [getAllStudentsAction.rejected]:(state)=>{
            state.getAllStudentsStatus = STATUS.FAILED
        },
        
        [removeStudPkgeAction.pending] : (state) => {
            state.removeStudPkgStatus = STATUS.FETCHING
        },
        [removeStudPkgeAction.fulfilled]:(state, action)=>{
            state.removeStudPkgStatus = STATUS.SUCCESS
            _.remove(state.currentStudent.packages, p => p.package._id === action.payload.extraData.packageId )
            SuccessMessage("Package Removed")
        },
        [removeStudPkgeAction.rejected]:(state, action)=>{
            state.removeStudPkgStatus = STATUS.FAILED
            ErrorMessage(action.error.message)
        },
        
        [assignStudPkgAction.pending] : (state) => {
            state.assignPkgStatus = STATUS.FETCHING
        },
        [assignStudPkgAction.fulfilled]:(state, action)=>{
            state.assignPkgStatus = STATUS.SUCCESS
            // state.currentStudent.packages = action.payload.packages
            SuccessMessage("Package Assigned")
        },
        [assignStudPkgAction.rejected]:(state, action)=>{
            state.assignPkgStatus = STATUS.FAILED
            ErrorMessage(action.error.message)
        },
        
        [addStudentAction.pending] : (state) => {
            state.addStudentStatus = STATUS.FETCHING
        },
        [addStudentAction.fulfilled]:(state, action)=>{
            state.addStudentStatus = STATUS.SUCCESS
            state.addedStudent = action.payload
            SuccessMessage("Student Added")
        },
        [addStudentAction.rejected]:(state, action)=>{
            state.addStudentStatus = STATUS.FAILED
            ErrorMessage(action.error.message)
        },

        [updateAddressAction.pending] : (state) => {
            state.updateAddressStatus = STATUS.FETCHING
        },
        [updateAddressAction.fulfilled]:(state, action)=>{
            state.updateAddressStatus = STATUS.SUCCESS
            state.currentStudent.address = action.payload.data
        },
        [updateAddressAction.rejected]:(state, action)=>{
            state.updateAddressStatus = STATUS.FAILED
        },

        [addAddressAction.pending] : (state) => {
            state.addAddressStatus = STATUS.FETCHING
        },
        [addAddressAction.fulfilled]:(state, action)=>{
            state.addAddressStatus = STATUS.SUCCESS
            if(state.currentStudent)
                state.currentStudent.address = action.payload
            
                SuccessMessage("Address Added")
        },
        [addAddressAction.rejected]:(state, action)=>{
            state.addAddressStatus = STATUS.FAILED
            ErrorMessage(action.error.message)
        },

        [getStudentAction.pending] : (state) => {
            state.getStudentStatus = STATUS.FETCHING
        },
        [getStudentAction.fulfilled]:(state, action)=>{
            state.getStudentStatus = STATUS.SUCCESS
            state.currentStudent = action.payload
        },
        [getStudentAction.rejected]:(state)=>{
            state.getStudentStatus = STATUS.FAILED
        },

        [searchStudentsAction.pending] : (state) => {
            state.searchStudentStatus = STATUS.FETCHING
        },
        [searchStudentsAction.fulfilled]:(state, action)=>{
            state.searchStudentStatus = STATUS.SUCCESS
            state.studentsList = action.payload
        },
        [searchStudentsAction.rejected]:(state, action)=>{
            state.searchStudentStatus = STATUS.FAILED
            ErrorMessage(action.error.message)
        },

        [addEducationAction.pending] : (state) => {
            state.addEducationStatus = STATUS.FETCHING
        },

        [addEducationAction.fulfilled]:(state, action)=>{
            SuccessMessage()
            state.addEducationStatus = STATUS.SUCCESS
            state.currentStudent = Object.assign({}, state.currentStudent, {educations: state.currentStudent.educations ? _.concat(state.currentStudent.educations, action.payload) : [action.payload]})
        },

        [addEducationAction.rejected]:(state, action)=>{
            state.addEducationStatus = STATUS.FAILED
            ErrorMessage(action.error.message)
        },

        [editEducationAction.pending] : (state) => {
            state.editEducationStatus = STATUS.FETCHING
        },

        [editEducationAction.fulfilled]:(state, action)=>{
            let findEducation = state.currentStudent.educations ? _.findIndex(state.currentStudent.educations, s => s.id == action.payload.id) : -1
            if(findEducation != -1){
                state.currentStudent.educations[findEducation] = action.payload 
            }

            state.editEducationStatus = STATUS.SUCCESS
            SuccessMessage()
        //    state.currentStudent = state.currentStudent
        },

        [editEducationAction.rejected]:(state, action)=>{
            state.addEducationStatus = STATUS.FAILED
            ErrorMessage(action.error.message)
        },

        [deleteAlumniEducationAction.pending] : (state) => {
            state.deleteAlumniEducationStatus = STATUS.FETCHING
        },
        [deleteAlumniEducationAction.fulfilled] : (state, action) => {
            SuccessMessage('Profile Updated')
            state.currentStudent.educations = _.filter(state.currentStudent.educations, g => g.id != action.payload.extraData.id)
            state.deleteAlumniEducationStatus = STATUS.SUCCESS
        },
        [deleteAlumniEducationAction.rejected]: (state) => {
            state.deleteAlumniEducationStatus = STATUS.FAILED
        },

        [assignGroupsAction.pending] : (state) => {
            state.assignGroupsStatus = STATUS.FETCHING
        },
        [assignGroupsAction.fulfilled]:(state, action)=>{
            SuccessMessage('Groups assigned to student')
            state.assignGroupsStatus = STATUS.SUCCESS
            action.payload.map(grp => state.currentStudent.groups.push(grp))
        },
        [assignGroupsAction.rejected]:(state)=>{
            state.assignGroupsStatus = STATUS.FAILED
        },

        [updateStudentAction.pending] : (state) => {
            state.updateStudentStatus = STATUS.FETCHING
        },
        [updateStudentAction.fulfilled] : (state, action) => {
            SuccessMessage('Profile Updated')
            state.updateStudentStatus = STATUS.SUCCESS
            state.currentStudent.user = Object.assign(state.currentStudent.user, {...action.payload})
        },
        [updateStudentAction.rejected]: (state) => {
            ErrorMessage()
            state.updateStudentStatus = STATUS.FAILED
        },

        [removeGroupAction.pending] : (state) => {
            state.removeGroupStatus = STATUS.FETCHING
        },
        [removeGroupAction.fulfilled] : (state) => {
            SuccessMessage('Group Removed')
            state.removeGroupStatus = STATUS.SUCCESS
        },
        [removeGroupAction.rejected]: (state) => {
            state.removeGroupStatus = STATUS.FAILED
        },

        [addStudentExcelAction.pending] : (state) => {
            state.studentExcelStatus = STATUS.FETCHING
        },
        [addStudentExcelAction.fulfilled] : (state, action) => {
            if(action.payload.error){
                ErrorMessage(action.payload.msg)
                state.studentExcelStatus = STATUS.FAILED
                state.duplicateEntries = action.payload
            }else{
                SuccessMessage('Students Added')
                state.studentExcelStatus = STATUS.SUCCESS
                state.duplicateEntries = null
            } 
        },
        [addStudentExcelAction.rejected]: (state) => {
            ErrorMessage()
            state.studentExcelStatus = STATUS.FAILED
        },

        [updateMemberAction.pending] : (state) => {
            state.updateMemberStatus = STATUS.FETCHING
        },
        [updateMemberAction.fulfilled] : (state, action) => {
            SuccessMessage()
            state.updateMemberStatus = STATUS.SUCCESS
            state.currentStudent.batch = action.payload.extraData
        },
        [updateMemberAction.rejected]: (state) => {
            ErrorMessage()
            state.updateMemberStatus = STATUS.FAILED
        },

        [addExperienceAction.pending] : (state) => {
            state.addExperienceStatus = STATUS.FETCHING
        },

        [addExperienceAction.fulfilled]:(state, action)=>{
            SuccessMessage()
            state.addExperienceStatus = STATUS.SUCCESS
            state.currentStudent = Object.assign({}, state.currentStudent, {experiences: state.currentStudent.experiences ? _.concat(state.currentStudent.experiences, action.payload) : [action.payload]})
        },

        [addExperienceAction.rejected]:(state, action)=>{
            state.addExperienceStatus = STATUS.FAILED
            ErrorMessage(action.error.message)
        },

        [editExperienceAction.pending] : (state) => {
            state.addExperienceStatus = STATUS.FETCHING
        },

        [editExperienceAction.fulfilled]:(state, action)=>{
            let findExperience = state.currentStudent.experiences ? _.findIndex(state.currentStudent.experiences, s => s.id == action.payload.id) : -1
            if(findExperience != -1){
                state.currentStudent.experiences[findExperience] = action.payload 
            }

            state.addExperienceStatus = STATUS.SUCCESS
            SuccessMessage()
        //    state.currentStudent = state.currentStudent
        },

        [editExperienceAction.rejected]:(state, action)=>{
            state.addExperienceStatus = STATUS.FAILED
            ErrorMessage(action.error.message)
        },

        [deleteAlumniExperienceAction.pending] : (state) => {
            state.deleteAlumniExperienceStatus = STATUS.FETCHING
        },
        [deleteAlumniExperienceAction.fulfilled] : (state, action) => {
            SuccessMessage('Profile Updated')
            state.currentStudent.experiences = _.filter(state.currentStudent.experiences, g => g.id != action.payload.extraData.id)
            state.deleteAlumniExperienceStatus = STATUS.SUCCESS
        },
        [deleteAlumniExperienceAction.rejected]: (state) => {
            state.deleteAlumniExperienceStatus = STATUS.FAILED
        },

        [assignStudCoursesAction.pending] : (state) => {
            state.studCoursesAssignStatus = STATUS.FETCHING
        },
        [assignStudCoursesAction.fulfilled] : (state, action) => {
            SuccessMessage('Course Assigned')
            state.currentStudent.courses = action.payload.courses
            state.studCoursesAssignStatus = STATUS.SUCCESS
        },
        [assignStudCoursesAction.rejected]: (state) => {
            ErrorMessage()
            state.studCoursesAssignStatus = STATUS.FAILED
        },

        [removeStudCourseAction.pending] : (state) => {
            state.removeStudCourseStatus = STATUS.FETCHING
        },
        [removeStudCourseAction.fulfilled] : (state, action) => {
            SuccessMessage('Course removed')
            _.remove(state.currentStudent.courses,d => d.course._id == action.payload.extraData.courseId)
            state.removeStudCourseStatus = STATUS.SUCCESS
        },
        [removeStudCourseAction.rejected]: (state) => {
            ErrorMessage()
            state.removeStudCourseStatus = STATUS.FAILED
        },

        
        [studentBulkValidateAction.pending] : (state) => {
            state.uploadBulkStatus = STATUS.FETCHING
        },
        [studentBulkValidateAction.fulfilled] : (state, action) => {
            if(action.payload.status === "success"){
                SuccessMessage('Excel uploaded!')
                state.bulkStudentUpload = action.payload.data;
                state.uploadBulkStatus = STATUS.SUCCESS
            }else{
                ErrorMessage(action.payload.msg);
                state.uploadBulkStatus = STATUS.FAILED
            }
        },
        [studentBulkValidateAction.rejected]: (state) => {
            ErrorMessage()
            state.uploadBulkStatus = STATUS.FAILED
        },

        
        [studentBulkUpdateAction.pending] : (state) => {
            state.uploadBulkStatus = STATUS.FETCHING
        },
        [studentBulkUpdateAction.fulfilled] : (state, action) => {
            if(action.payload.status === "success"){
                SuccessMessage()
                state.bulkStudentUpload = action.payload.data;
                state.uploadBulkStatus = STATUS.SUCCESS
            }else{
                ErrorMessage();
                state.uploadBulkStatus = STATUS.FAILED
            }
        },
        [studentBulkUpdateAction.rejected]: (state) => {
            ErrorMessage()
            state.uploadBulkStatus = STATUS.FAILED
        },

        [studentBulkAssignAction.pending] : (state) => {
            state.uploadBulkStatus = STATUS.FETCHING
        },
        [studentBulkAssignAction.fulfilled] : (state, action) => {
            if(action.payload.status === "success"){
                SuccessMessage()
                state.bulkStudentUpload = action.payload.data;
                state.uploadBulkStatus = STATUS.SUCCESS
            }else{
                ErrorMessage();
                state.uploadBulkStatus = STATUS.FAILED
            }
        },
        [studentBulkAssignAction.rejected]: (state) => {
            ErrorMessage()
            state.uploadBulkStatus = STATUS.FAILED
        },

        [getStdentBulkPendingAction.pending] : (state) => {
            state.getBulkUploadStatus = STATUS.FETCHING
        },
        [getStdentBulkPendingAction.fulfilled] : (state, action) => {
            if(action.payload.length > 0)
                state.bulkStudentUpload = action.payload[action.payload.length - 1];
            state.getBulkUploadStatus = STATUS.SUCCESS
        },
        [getStdentBulkPendingAction.rejected]: (state) => {
            ErrorMessage()
            state.getBulkUploadStatus = STATUS.FAILED
        },

        [deleteBulkUploadAction.pending] : (state) => {
            state.deleteBulkUploadStatus = STATUS.FETCHING
        },
        [deleteBulkUploadAction.fulfilled] : (state, action) => {
            state.bulkStudentUpload = null;
            state.deleteBulkUploadStatus = STATUS.SUCCESS
        },
        [deleteBulkUploadAction.rejected]: (state) => {
            ErrorMessage()
            state.deleteBulkUploadStatus = STATUS.FAILED
        },

        [assignBatchAction.pending]: (state) => {
            state.assignBatchStatus = STATUS.FETCHING
        },
        [assignBatchAction.fulfilled]: (state, action) => {
            state.assignBatchStatus = STATUS.SUCCESS
            // state.currentStudent= action.payload
            state.studentAssignedBatch = concat(state.studentAssignedBatch, action.payload)
            state.assignedBatch = action.payload
            SuccessMessage()
        },
        [assignBatchAction.rejected]: (state) => {
            ErrorMessage()
            state.assignBatchStatus = STATUS.FAILED
        },

        [getStudentAssignBatchAction.pending]: (state) => {
            state.getAssignBatchStatus = STATUS.FETCHING
        },
        [getStudentAssignBatchAction.fulfilled]: (state, action) => {
            state.getAssignBatchStatus = STATUS.SUCCESS
            // state.currentStudent= action.payload
            state.studentAssignedBatch = action.payload
        },
        [getStudentAssignBatchAction.rejected]: (state) => {
            ErrorMessage()
            state.getAssignBatchStatus = STATUS.FAILED
        },
    }
})

export const { resetEducationStatusAction, resetExperienceStatusAction, resetDuplicateEntries, resetUpdateAddress, resetAddStudent, resetUpdateStudent,resetBulkUploadData,
        resetAssignPkg
    } = studentSlice.actions
export const studentReducer = studentSlice.reducer