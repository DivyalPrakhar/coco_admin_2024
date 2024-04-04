import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { concat } from "lodash";
import { STATUS } from "../../../Constants";
import { ErrorMessage, SuccessMessage } from "../../../Constants/CommonAlerts";
import { URIS } from "../../../services/api";
import { apis } from "../../../services/api/apis";

export const addBatchAction = createAsyncThunk(
  URIS.ADD_BATCH,
  async (payload, thunkAPI) => {
    const response = await apis.addBatchApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const updateBatchAction = createAsyncThunk(
  "batch/update",
  async (payload, thunkAPI) => {
    const response = await apis.updateBatchApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const getLiveBatchAction = createAsyncThunk(
  "batch/live/get",
  async (payload, thunkAPI) => {
    const response = await apis.getLiveBatchApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const getBatchesRequest = createAsyncThunk(
  URIS.GET_BATCHES,
  async (payload, thunkAPI) => {
    const response = await apis.getBatchesApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const getBatchRequest = createAsyncThunk(
  URIS.GET_BATCH,
  async (payload, thunkAPI) => {
    const response = await apis.getBatchApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const addStudentInstallment = createAsyncThunk(
  "add/batch/installment",
  async (payload, thunkAPI) => {
    const response = await apis.addStudentInstallmentApi(payload);
    const { ok, problem, data } = response;
    if (ok) return data;
    else return thunkAPI.rejectWithValue(problem);
  }
);

export const getStudentInstallment = createAsyncThunk(
  "get/batch/installment",
  async (payload, thunkAPI) => {
    const response = await apis.getStudentInstallmentApi(payload);
    const { ok, problem, data } = response;
    if (ok) return data;
    else return thunkAPI.rejectWithValue(problem);
  }
);

export const collectTutionFeesPayment = createAsyncThunk(
  "collect/tutionFees",
  async (payload, thunkAPI) => {
    const response = await apis.collectTutionFeesPaymentApi(payload);
    const { ok, problem, data } = response;
    if (ok) return data;
    else return thunkAPI.rejectWithValue(problem);
  }
);

export const getAllStudentsPayment = createAsyncThunk(
  "get/all/collect/tutionFees",
  async (payload, thunkAPI) => {
    const response = await apis.getAllStudentsPaymentApi(payload);
    const { ok, problem, data } = response;
    if (ok) return data;
    else return thunkAPI.rejectWithValue(problem);
  }
);

export const getStudentPayments = createAsyncThunk(
  "get/collect/tutionFees",
  async (payload, thunkAPI) => {
    const response = await apis.getAllStudentsPaymentApi(payload);
    const { ok, problem, data } = response;
    if (ok) return data;
    else return thunkAPI.rejectWithValue(problem);
  }
);

export const getAllDefaultersAction = createAsyncThunk(
  "get/all/defaulters",
  async (payload, thunkAPI) => {
    const response = await apis.getAllDefaultersApi(payload);
    const { ok, problem, data } = response;
    if (ok) return data;
    else return thunkAPI.rejectWithValue(problem);
  }
);

export const getPrintReceiptAction = createAsyncThunk(
  "get/print-receipt",
  async (payload, thunkAPI) => {
    const response = await apis.getPrintReceiptApi(payload);
    const { ok, problem, data } = response;
    if (ok) return data;
    else return thunkAPI.rejectWithValue(problem);
  }
);

const initialState = {
  // addBatchStatus: STATUS.NOT_STARTED,
  // getBatchesStatus: STATUS.NOT_STARTED,
  getLiveBatchStatus: 'NOT_STARTED',
};

const userSlice = createSlice({
  name: "batches",
  initialState,
  reducers: {
    setActiveStaff: (state, action) => {
      state.activeStaff = action.payload;
      state.user = action.payload?.user;
    },
    resetAddInstallment: (state) => {
      state.updateStudentStatus = STATUS.NOT_STARTED;
    },
    resetTutionFees: (state) => {
      state.collectTutionFeesPaymentStatus = STATUS.NOT_STARTED;
      state.collectedPayment = {};
    },
  },
  extraReducers: {
    [addBatchAction.pending]: (state, action) => {
      state.addBatchStatus = STATUS.FETCHING;
    },
    [addBatchAction.fulfilled]: (state, action) => {
      SuccessMessage("Batch Added");
      state.addBatchStatus = STATUS.SUCCESS;
      state.batches.push(action.payload);
    },
    [addBatchAction.rejected]: (state, action) => {
      state.addBatchStatus = STATUS.FAILED;
    },

    [getBatchesRequest.pending]: (state, action) => {
      state.getBatchesStatus = STATUS.FETCHING;
    },
    [getBatchesRequest.fulfilled]: (state, action) => {
      state.getBatchesStatus = STATUS.SUCCESS;
      state.batches = action.payload.batches;
    },
    [getBatchesRequest.rejected]: (state, action) => {
      state.getBatchesStatus = STATUS.FAILED;
    },

    [getBatchRequest.pending]: (state, action) => {
      state.getBatchStatus = STATUS.FETCHING;
    },
    [getBatchRequest.fulfilled]: (state, action) => {
      state.getBatchStatus = STATUS.SUCCESS;
      state.batch = action.payload;
    },
    [getBatchRequest.rejected]: (state, action) => {
      state.getBatchStatus = STATUS.FAILED;
    },

    [updateBatchAction.pending]: (state, action) => {
      state.updateBatchStatus = STATUS.FETCHING;
    },
    [updateBatchAction.fulfilled]: (state, action) => {
      SuccessMessage("Batch Updated");
      state.updateBatchStatus = STATUS.SUCCESS;
      state.batches = state.batches?.map((b) =>
        b.id === action.payload.id ? action.payload : b
      );
      state.batch = state.batch?.map((b) =>
        b._id === action.payload._id ? action.payload : b
      );
    },
    [updateBatchAction.rejected]: (state, action) => {
      state.updateBatchStatus = STATUS.FAILED;
    },

    [getLiveBatchAction.pending]: (state, action) => {
      state.getLiveBatchStatus = STATUS.FETCHING;
    },
    [getLiveBatchAction.fulfilled]: (state, action) => {
      state.getLiveBatchStatus = STATUS.SUCCESS;
      state.liveBatches = action.payload;
    },
    [getLiveBatchAction.rejected]: (state, action) => {
      state.getLiveBatchStatus = STATUS.FAILED;
    },

    [addStudentInstallment.pending]: (state) => {
      state.addStudentInstallmentStatus = STATUS.FETCHING;
    },
    [addStudentInstallment.fulfilled]: (state, action) => {
      state.addStudentInstallmentStatus = STATUS.SUCCESS;
      state.studentInstallments = concat(
        state.studentInstallments,
        action.payload
      );
      SuccessMessage();
    },
    [addStudentInstallment.rejected]: (state) => {
      ErrorMessage();
      state.addStudentInstallmentStatus = STATUS.FAILED;
    },

    [getStudentInstallment.pending]: (state) => {
      state.getStudentInstallmentStatus = STATUS.FETCHING;
    },
    [getStudentInstallment.fulfilled]: (state, action) => {
      state.getStudentInstallmentStatus = STATUS.SUCCESS;
      state.studentInstallments = action.payload;
    },
    [getStudentInstallment.rejected]: (state) => {
      ErrorMessage();
      state.getStudentInstallmentStatus = STATUS.FAILED;
    },

    [collectTutionFeesPayment.pending]: (state) => {
      state.collectTutionFeesPaymentStatus = STATUS.FETCHING;
    },
    [collectTutionFeesPayment.fulfilled]: (state, action) => {
      state.collectTutionFeesPaymentStatus = STATUS.SUCCESS;
      state.collectedPayment = action.payload;
      SuccessMessage();
    },
    [collectTutionFeesPayment.rejected]: (state) => {
      ErrorMessage();
      state.collectTutionFeesPaymentStatus = STATUS.FAILED;
    },

    [getAllStudentsPayment.pending]: (state) => {
      state.getAllStudentsPaymentStatus = STATUS.FETCHING;
    },
    [getAllStudentsPayment.fulfilled]: (state, action) => {
      state.getAllStudentsPaymentStatus = STATUS.SUCCESS;
      state.allStudentsPayment = action.payload;
    },
    [getAllStudentsPayment.rejected]: (state) => {
      ErrorMessage();
      state.getAllStudentsPaymentStatus = STATUS.FAILED;
    },

    [getStudentPayments.pending]: (state) => {
      state.getStudentPaymentsStatus = STATUS.FETCHING;
    },
    [getStudentPayments.fulfilled]: (state, action) => {
      state.getStudentPaymentsStatus = STATUS.SUCCESS;
      state.studentPayments = action.payload;
    },
    [getStudentPayments.rejected]: (state) => {
      ErrorMessage();
      state.getStudentPaymentsStatus = STATUS.FAILED;
    },

    [getAllDefaultersAction.pending]: (state) => {
      state.getAllDefaultersStatus = STATUS.FETCHING;
    },
    [getAllDefaultersAction.fulfilled]: (state, action) => {
      state.getAllDefaultersStatus = STATUS.SUCCESS;
      state.defaulterStudents = action.payload;
    },
    [getAllDefaultersAction.rejected]: (state) => {
      ErrorMessage();
      state.getAllDefaultersStatus = STATUS.FAILED;
    },

    [getPrintReceiptAction.pending]: (state) => {
      state.getPrintReceiptStatus = STATUS.FETCHING;
    },
    [getPrintReceiptAction.fulfilled]: (state, action) => {
      state.getPrintReceiptStatus = STATUS.SUCCESS;
      state.printReceiptData = action.payload;
    },
    [getPrintReceiptAction.rejected]: (state) => {
      ErrorMessage();
      state.getPrintReceiptStatus = STATUS.FAILED;
    },
  },
});
export const { resetAddInstallment, resetTutionFees } = userSlice.actions;
export const batchReducer = userSlice.reducer;
