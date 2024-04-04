import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { STATUS } from "../../../Constants"
import { ErrorMessage, SuccessMessage } from "../../../Constants/CommonAlerts"
import { apis } from "../../../services/api/apis"
import _ from 'lodash'

export const getXIIExamResult = createAsyncThunk(
  "exam/xiiresult",
  async (payload, thunkAPI) => {
    const response = await apis.getXIIExamResult(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
      return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const getXExamResult = createAsyncThunk(
  "exam/xresult",
  async (payload, thunkAPI) => {
    const response = await apis.getXExamResult(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
      return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const getSchoolsByDistrict = createAsyncThunk(
  "exam/getschools",
  async (payload, thunkAPI) => {
    const response = await apis.getSchoolByDistrict(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
      return thunkAPI.rejectWithValue(problem)
    }
  }
)
export const getXSchoolsByDistrict = createAsyncThunk(
  "exam/getxschools",
  async (payload, thunkAPI) => {
    const response = await apis.getXSchoolByDistrict(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
      return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const getAllDistrict = createAsyncThunk(
  "exam/getAllDistrict",
  async (payload, thunkAPI) => {
    const response = await apis.getExamAllDistrict(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
      return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const getXAllDistrict = createAsyncThunk(
  "exam/getxAllDistrict",
  async (payload, thunkAPI) => {
    
    const response = await apis.getXExamAllDistrict(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
      return thunkAPI.rejectWithValue(problem)
    }
  }
)

export const getXExamDResultData = createAsyncThunk(
  "exam/getXExamDResultData",
  async (payload, thunkAPI) => {
    const response = await apis.getXExamCompareData(payload)
    const { ok, problem, data } = response
    if (ok) {
      return data
    } else {
      return thunkAPI.rejectWithValue(problem)
    }
  }
)

const initialState = {
  data: {},
  districtSchools: [],
  districts: []
}

const xExamResultSlice = createSlice({
  name: "xExamResult",
  initialState,
  reducers: {
  },
  extraReducers: {
    [getXIIExamResult.pending]: (state) => {
      state.getXExamResultStatus = STATUS.FETCHING;
      state.data = {};
    },
    [getXIIExamResult.rejected]: (state) => {
      ErrorMessage()
      state.getXExamResultStatus = STATUS.FAILED
    },
    [getXIIExamResult.fulfilled]: (state, action) => {
      let examResult = action.payload;
      let curMaxRank = { marksObtained: 0, rank: 1 };
      examResult['toppersList'] = _.orderBy( examResult['toppersList'], 'marksObtained', 'desc' )
      examResult['toppersList'] = _.map(examResult['toppersList'], (s, i) => {
        if(parseFloat(s.marksObtained) === parseFloat(curMaxRank.marksObtained)){
          return ({ ...s, schoolRank: curMaxRank.rank })
        }
        curMaxRank = { marksObtained: parseFloat(s.marksObtained), rank: i + 1 }
        return ({ ...s, schoolRank: i + 1 })

      } ) 
      state.data = examResult;
      state.getXExamResultStatus = STATUS.SUCCESS
    },

    
    [getXExamResult.pending]: (state) => {
      state.getXExamResultStatus = STATUS.FETCHING;
      state.data = {};
    },
    [getXExamResult.rejected]: (state) => {
      ErrorMessage()
      state.getXExamResultStatus = STATUS.FAILED
    },
    [getXExamResult.fulfilled]: (state, action) => {
      let examResult = action.payload;
      let curMaxRank = { marksObtained: 0, rank: 1 };
      examResult['toppersList'] = _.orderBy( examResult['toppersList'], 'marksObtained', 'desc' )
      examResult['toppersList'] = _.map(examResult['toppersList'], (s, i) => {
        if(parseFloat(s.marksObtained) === parseFloat(curMaxRank.marksObtained)){
          return ({ ...s, schoolRank: curMaxRank.rank })
        }
        curMaxRank = { marksObtained: parseFloat(s.marksObtained), rank: i + 1 }
        return ({ ...s, schoolRank: i + 1 })

      } ) 
      state.data = examResult;
      state.getXExamResultStatus = STATUS.SUCCESS
    },

    [getSchoolsByDistrict.pending]: (state) => {
      state.getSchoolByDistrictStatus = STATUS.FETCHING;
      state.getXExamResultStatus = STATUS.NOT_STARTED;
      state.districtSchools = [];
    },
    [getSchoolsByDistrict.rejected]: (state) => {
      ErrorMessage()
      state.getSchoolByDistrictStatus = STATUS.FAILED
    },
    [getSchoolsByDistrict.fulfilled]: (state, action) => {
      state.districtSchools = action.payload
      state.getSchoolByDistrictStatus = STATUS.SUCCESS
    },

    [getXSchoolsByDistrict.pending]: (state) => {
      state.getSchoolByDistrictStatus = STATUS.FETCHING;
      state.getXExamResultStatus = STATUS.NOT_STARTED;
      state.districtSchools = [];
    },
    [getXSchoolsByDistrict.rejected]: (state) => {
      ErrorMessage()
      state.getSchoolByDistrictStatus = STATUS.FAILED
    },
    [getXSchoolsByDistrict.fulfilled]: (state, action) => {
      state.districtSchools = action.payload
      state.getSchoolByDistrictStatus = STATUS.SUCCESS
    },
    
    [getAllDistrict.pending]: (state) => {
      state.getAllDistrictStatus = STATUS.FETCHING;
      state.districts = [];
      state.data = [];
      state.getXExamResultStatus = STATUS.NOT_STARTED;
    },
    [getAllDistrict.rejected]: (state) => {
      ErrorMessage()
      state.getAllDistrictStatus = STATUS.FAILED
    },
    [getAllDistrict.fulfilled]: (state, action) => {
      state.getAllDistrictStatus = STATUS.SUCCESS;
      state.districts = action.payload;
    },
    
    [getXAllDistrict.pending]: (state) => {
      state.getAllDistrictStatus = STATUS.FETCHING;
      state.districts = [];
      state.data = [];
      state.getXExamResultStatus = STATUS.NOT_STARTED;
    },
    [getXAllDistrict.rejected]: (state) => {
      ErrorMessage()
      state.getAllDistrictStatus = STATUS.FAILED
    },
    [getXAllDistrict.fulfilled]: (state, action) => {
      state.getAllDistrictStatus = STATUS.SUCCESS;
      state.districts = action.payload;
    },
    
    [getXExamDResultData.pending]: (state) => {
      state.getXExamCompareDataStatus = STATUS.FETCHING
      state.XExamCompareData = [];
    },
    [getXExamDResultData.rejected]: (state) => {
      ErrorMessage()
      state.getXExamCompareDataStatus = STATUS.FAILED
    },
    [getXExamDResultData.fulfilled]: (state, action) => {
      state.getXExamCompareDataStatus = STATUS.SUCCESS;
      state.XExamCompareData = action.payload;
    }
  }
});

// export const {resetAddWebsiteData} = websiteSlice.actions
export const xExamResultReducer = xExamResultSlice.reducer

