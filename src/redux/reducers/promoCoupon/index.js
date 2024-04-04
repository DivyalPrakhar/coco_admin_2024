import { filter, find, map } from "lodash";
import { STATUS } from "../../../Constants";
import {
  ErrorMessage,
  FetchingMessage,
  SuccessMessage,
} from "../../../Constants/CommonAlerts";
import { apis } from "../../../services/api/apis";
const { createSlice, createAsyncThunk, current } = require("@reduxjs/toolkit");

export const addPromoCoupon = createAsyncThunk(
  "create/PromoCoupon",
  async (payload, thunkAPI) => {
    const response = await apis.addPromoCouponApi(payload);
    const { ok, problem, data } = response;
    if (ok) return data;
    else return thunkAPI.rejectWithValue(problem);
  }
);

export const getAllPromoCoupon = createAsyncThunk(
  "get/all/PromoCoupon",
  async (payload, thunkAPI) => {
    const response = await apis.getAllPromoCouponApi(payload);
    const { ok, problem, data } = response;
    if (ok) return data;
    else return thunkAPI.rejectWithValue(problem);
  }
);
export const updatePromoCoupon = createAsyncThunk(
  "update/PromoCoupon",
  async (payload, thunkAPI) => {
    const response = await apis.updatePromoCouponApi(payload);
    const { ok, problem, data } = response;
    if (ok) return data;
    else return thunkAPI.rejectWithValue(problem);
  }
);
export const deletePromoCoupon = createAsyncThunk(
  "delete/PromoCoupon",
  async (payload, thunkAPI) => {
    const response = await apis.deletePromoCouponApi(payload);
    const { ok, problem, data } = response;
    if (ok) return { data, couponIds: payload.couponIds };
    else return thunkAPI.rejectWithValue(problem);
  }
);

const initialState = {
  promoCodeStatus: STATUS.NOT_STARTED,
  promoCodeData: [],
};

const promoCouponSlice = createSlice({
  name: "promoCoupon",
  initialState,
  reducers: {
    resetPromoCoupon: (state) => {
      state.addPromoCouponStatus = STATUS.NOT_STARTED;
    },
  },
  extraReducers: {
    [addPromoCoupon.pending]: (state, action) => {
      FetchingMessage();
      state.addPromoCouponStatus = STATUS.FETCHING;
    },

    [addPromoCoupon.fulfilled]: (state, action) => {
      state.addPromoCouponStatus = STATUS.SUCCESS;
      SuccessMessage("Added coupons");

      state.promoCoupons = state.promoCoupons.concat(action.payload);
    },

    [addPromoCoupon.rejected]: (state, action) => {
      ErrorMessage("Failed adding coupons");

      state.addPromoCouponStatus = STATUS.FAILED;
    },
    [getAllPromoCoupon.pending]: (state, action) => {
      state.getAllPromoCouponStatus = STATUS.FETCHING;
    },

    [getAllPromoCoupon.fulfilled]: (state, action) => {
      state.getAllPromoCouponStatus = STATUS.SUCCESS;
      state.promoCoupons = action.payload;
    },

    [getAllPromoCoupon.rejected]: (state, action) => {
      state.getAllPromoCouponStatus = STATUS.FAILED;
    },
    [updatePromoCoupon.pending]: (state, action) => {
      state.updatePromoCouponStatus = STATUS.FETCHING;
    },

    [updatePromoCoupon.fulfilled]: (state, action) => {
      SuccessMessage();
      state.updatePromoCouponStatus = STATUS.SUCCESS;
      const currentData = current(state.promoCoupons);
      state.promoCoupons = map(
        currentData,
        (coupon) =>
          find(action.payload, (id) => id.couponId === coupon.couponId) ||
          coupon
      );
    },

    [updatePromoCoupon.rejected]: (state, action) => {
      state.updatePromoCouponStatus = STATUS.FAILED;
    },
    [deletePromoCoupon.pending]: (state, action) => {
      state.deletePromoCouponStatus = STATUS.FETCHING;
    },

    [deletePromoCoupon.fulfilled]: (state, action) => {
      SuccessMessage();
      state.deletePromoCouponStatus = STATUS.SUCCESS;
      state.promoCoupons = filter(
        state.promoCoupons,
        (coupon) =>
          !find(action.payload.couponIds, (id) => id === coupon.couponId)
      );
    },

    [deletePromoCoupon.rejected]: (state, action) => {
      ErrorMessage();
      state.deletePromoCouponStatus = STATUS.FAILED;
    },
  },
});

export const { resetPromoCoupon } = promoCouponSlice.actions;
export const promoCouponReducer = promoCouponSlice.reducer;
