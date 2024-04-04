import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit"
import { STATUS } from "../../../Constants"
import { SuccessMessage, FetchingMessage, ErrorMessage} from "../../../Constants/CommonAlerts"
import { apis } from "../../../services/api/apis"
import _ from 'lodash';
// import { requestUserApi } from "../../services/api/UserApis"

export const addInstituteStaffAction = createAsyncThunk(
  "institute/addinstituteStaff",
  async (payload, thunkAPI) => {
    const response = await apis.addInstituteStaffApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
     return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const getSingleInstituteAction = createAsyncThunk(
  "institute/getSingleinstitute",
  async (payload, thunkAPI) => {
    const response = await apis.getSingleInstituteApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
     return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const editInstituteStaffAction = createAsyncThunk(
  "institute/editInstituteStaff",
  async (payload, thunkAPI) => {
    const response = await apis.editInstituteStaffApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
     return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const editStaffRoleAction = createAsyncThunk(
  "institute/editStaffRole",
  async (payload, thunkAPI) => {
    const response = await apis.editInstituteStaffApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
     return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const deleteInstituteStaffAction = createAsyncThunk(
  "institute/deleteInstituteStaff",
  async (payload, thunkAPI) => {
    const response = await apis.deleteInstituteStaffApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return {data, payload}
    } else {
     return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const addGroupAction = createAsyncThunk(
  'create/group',
  async(payload, thunkAPI) => {
      const response = await apis.addGroupApi(payload)
      const {ok, problem, data} = response

      if(ok)
          return data
      else
          return thunkAPI.rejectWithValue(problem)
  }
)

export const updateGroupAction = createAsyncThunk(
  'update/group',
  async(payload, thunkAPI) => {
      const response = await apis.updateGroupApi(payload)
      const {ok, problem, data} = response

      if(ok)
          return data
      else
          return thunkAPI.rejectWithValue(problem)
  }
)

export const deleteGroupAction = createAsyncThunk(
  'group/delete',
  async(payload, thunkAPI) => {
    const response = await apis.deleteGroupApi(payload)
    const {ok, problem, data} = response

    if(ok)
      return ({data, extraData:payload})
    else
      return thunkAPI.rejectWithValue(problem)
  }
)

export const searchStaffAction = createAsyncThunk(
  'search/staff',
  async(payload, thunkAPI) => {
    const response = await apis.searchStaffApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
     return thunkAPI.rejectWithValue(problem)
    }
  }
)
export const addCategoryAction = createAsyncThunk(
  'category/post',
  async(payload, thunkAPI) => {
    const response = await apis.postCategory(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
     return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const updateCategoryAction = createAsyncThunk(
  'category/patch',
  async(payload, thunkAPI) => {
    const response = await apis.updateCategoryApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
     return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const getCategoryAction = createAsyncThunk(
  'category/get',
  async(payload, thunkAPI) => {
    const response = await apis.getCategory(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
     return thunkAPI.rejectWithValue(problem)
    }
  }
)


export const getCategoriesAction = createAsyncThunk(
  'get/category',
  async(payload, thunkAPI) => {
    const response = await apis.getCategoriesApi(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
     return thunkAPI.rejectWithValue(problem)
    }
  }
)

const initialState = {
  addStatus:STATUS.NOT_STARTED,
  getStatus: STATUS.NOT_STARTED
}

const instituteStaffSlice = createSlice({
  name: "instituteStaff",
  initialState,
  reducers: {
      resetEditStatusAction: (state, action) => {
        state.addStatus = STATUS.NOT_STARTED
        state.updateStaffStatus = STATUS.NOT_STARTED
      },
  },
  extraReducers: {
    [updateCategoryAction.pending]: (state, action) => {
      state.updateCategoryStatus = STATUS.FETCHING
    },
    [updateCategoryAction.rejected]: (state, action) => {
      state.updateCategoryStatus = STATUS.FAILED
    },
    [updateCategoryAction.fulfilled]: (state, action) => {
      state.updateCategoryStatus = STATUS.SUCCESS
      SuccessMessage()
      state.allCategory = state.allCategory.map(d => d._id === action.payload._id ? action.payload : d)

    },
    
    [getCategoriesAction.pending]: (state, action) => {
      state.getCategoriesStatus = STATUS.FETCHING
    },
    [getCategoriesAction.rejected]: (state, action) => {
      state.getCategoriesStatus = STATUS.FAILED
    },
    [getCategoriesAction.fulfilled]: (state, action) => {
      state.getCategoriesStatus = STATUS.SUCCESS
      state.allCategories = action.payload
    },

    [addInstituteStaffAction.pending]: (state, action) => {
      state.addStatus = STATUS.FETCHING
    },
    [addInstituteStaffAction.rejected]: (state, action) => {
      state.addStatus = STATUS.FAILED
    },
    [addInstituteStaffAction.fulfilled]: (state, action) => {
      state.addStatus = STATUS.SUCCESS
      state.added = action.payload
    },

    [editInstituteStaffAction.pending]: (state, action) => {
      state.updateStaffStatus = STATUS.FETCHING
    },

    [editInstituteStaffAction.rejected]: (state, action) => {
      ErrorMessage()
      state.updateStaffStatus = STATUS.FAILED
    },

    [editInstituteStaffAction.fulfilled]: (state, action) => {
      SuccessMessage()
      let updatedIndex = _.findIndex(state.singleInstitute[0].staffs, s => s._id == action.payload._id)
      if(updatedIndex !== -1){
        state.singleInstitute[0].staffs[updatedIndex] = action.payload
      }
      state.updateStaffStatus = STATUS.SUCCESS
      state.added = action.payload
    },

    [editStaffRoleAction.pending]: (state, action) => {
      state.editStaffRoleStatus = STATUS.FETCHING
    },

    [editStaffRoleAction.rejected]: (state, action) => {
      ErrorMessage();
      state.editStaffRoleStatus = STATUS.FAILED
    },

    [editStaffRoleAction.fulfilled]: (state, action) => {
      SuccessMessage();
      state.editStaffRoleStatus = STATUS.SUCCESS
      let updatedIndex = _.findIndex(state.singleInstitute[0].staffs, s => s._id === action.payload._id)
      if(updatedIndex !== -1){
        state.singleInstitute[0].staffs[updatedIndex] = action.payload
      }    
    },

    [deleteInstituteStaffAction.pending]: (state, action) => {
      state.deleteStatus = STATUS.FETCHING
    },

    [deleteInstituteStaffAction.rejected]: (state, action) => {
      state.deleteStatus = STATUS.FAILED
    },

    [deleteInstituteStaffAction.fulfilled]: (state, action) => {
      state.deleteStatus = STATUS.SUCCESS
      state.singleInstitute = Object.assign({} ,state.singleInstitute, {staffs: _.filter(state.singleInstitute.staffs, s => s.id != action.payload.payload.id)})
    },

    [getSingleInstituteAction.pending]: (state, action) => {
      state.getStatus = STATUS.FETCHING
    },

    [getSingleInstituteAction.rejected]: (state, action) => {
      state.getStatus = STATUS.FAILED
    },
    [getSingleInstituteAction.fulfilled]: (state, action) => {
      state.getStatus = STATUS.SUCCESS
      state.singleInstitute = action.payload
    },

    [searchStaffAction.pending]: (state, action) => {
      state.getStatus = STATUS.FETCHING
    },

    [searchStaffAction.rejected]: (state, action) => {
      state.getStatus = STATUS.FAILED
    },
    [searchStaffAction.fulfilled]: (state, action) => {
      state.getStatus = STATUS.SUCCESS
      state.singleInstitute = Object.assign({}, state.singleInstitute, {staffs: action.payload})
    },

    [addGroupAction.pending]: (state, action) => {
      state.addGroupStatus = STATUS.FETCHING
    },
    [addGroupAction.fulfilled]: (state, action) => {
      SuccessMessage('Group Added')
      state.addGroupStatus = STATUS.SUCCESS
      state.singleInstitute.groups.unshift(action.payload)
    },
    [addGroupAction.rejected]: (state, action) => {
        state.addGroupStatus = STATUS.FAILED
    },

    [deleteGroupAction.pending]:(state,action) => {
      state.deleteGroupStatus = STATUS.FETCHING
    },
    [deleteGroupAction.fulfilled]:(state,action) => {
      SuccessMessage('Group Deleted')
      _.remove(state.singleInstitute.groups,grp => grp.id == action.payload.extraData.id)
      state.deleteGroupStatus = STATUS.SUCCESS
    },
    [deleteGroupAction.rejected]:(state,action) => {
      state.deleteGroupStatus = STATUS.FAILED
    },

    [updateGroupAction.pending]: (state, action) => {
      state.updateGroupStatus = STATUS.FETCHING
    },
    [updateGroupAction.fulfilled]: (state, action) => {
      SuccessMessage('Group Added')
      state.updateGroupStatus = STATUS.SUCCESS
      state.singleInstitute.groups = state.singleInstitute.groups.map(grp => grp.id == action.payload.id ? action.payload : grp )
    },
    [updateGroupAction.rejected]: (state, action) => {
        state.updateGroupStatus = STATUS.FAILED
    },
    [addCategoryAction.pending]: (state, action) => {
      state.addCategoryStatus = STATUS.FETCHING
    },
    [addCategoryAction.rejected]: (state, action) => {
      state.addCategoryStatus = STATUS.FAILED
    },
    [addCategoryAction.fulfilled]: (state, action) => {
      state.addCategoryStatus = STATUS.SUCCESS
      state.allCategory = _.concat(action.payload, state.allCategory)

    },
    [getCategoryAction.pending]: (state, action) => {
      state.getCategoryStatus = STATUS.FETCHING
      state.allCategory = action.payload
    },
    [getCategoryAction.rejected]: (state, action) => {
      state.getCategoryStatus = STATUS.FAILED
    },
    [getCategoryAction.fulfilled]: (state, action) => {
      state.getCategoryStatus = STATUS.SUCCESS
      state.allCategory = action.payload
    },
  },
})

export const { resetEditStatusAction } = instituteStaffSlice.actions
export const instituteStaffReducer = instituteStaffSlice.reducer