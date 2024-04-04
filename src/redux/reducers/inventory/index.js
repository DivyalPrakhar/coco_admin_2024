import { concat, filter, map } from "lodash"
import { STATUS } from "../../../Constants"
import { ErrorMessage, SuccessMessage } from "../../../Constants/CommonAlerts"
import { apis } from "../../../services/api/apis"

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")

export const addInventoryItemAction = createAsyncThunk(
    'add/inventory/item',
    async (payload, thunkAPI) => {
        const response = await apis.addInventoryItemApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getInventoryItemAction = createAsyncThunk(
    'get/inventory/item',
    async (payload, thunkAPI) => {
        const response = await apis.getInventoryItemApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const updateInventoryItemAction = createAsyncThunk(
    'update/inventory/item',
    async (payload, thunkAPI) => {
        const response = await apis.updateInventoryItemApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const addInventoryGroupAction = createAsyncThunk(
    'add/inventory/group',
    async (payload, thunkAPI) => {
        const response = await apis.addInventoryGroupApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getInventoryGroupAction = createAsyncThunk(
    'get/inventory/group',
    async (payload, thunkAPI) => {
        const response = await apis.getInventorygroupApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getSingleInventorygroup = createAsyncThunk(
    'get/id/inventory/group',
    async (payload, thunkAPI) => {
        const response = await apis.getSingleInventoryGroupApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const updateInventoryGroupAction = createAsyncThunk(
    'update/inventory/group',
    async (payload, thunkAPI) => {
        const response = await apis.updateInventorygroupApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const addDeliveredItem = createAsyncThunk(
    'add/delivered/item',
    async (payload, thunkAPI) => {
        const response = await apis.addDeliveredItemApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)

export const getDeliveredItemList = createAsyncThunk(
    'get/delivered/item',
    async (payload, thunkAPI) => {
        const response = await apis.getDeliveredItemApi(payload)
        const { ok, problem, data } = response
        if (ok) {
            return data
        } else {
            return thunkAPI.rejectWithValue(problem)
        }
    }
)


const initialState = {
}

export const Inventory = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        resetInventoryItem: (state) => {
            state.addInventoryItemStatus = STATUS.NOT_STARTED
            state.updateInventoryItemStatus = STATUS.NOT_STARTED
        },
        resetInventoryGroup: (state) => {
            state.addInventoryGroupStatus = STATUS.NOT_STARTED
            state.updateInventoryGroupStatus = STATUS.NOT_STARTED
        },
        resetDeliveredItemStatus: (state) => {
            state.addDeliveredItemStatus = STATUS.NOT_STARTED
        }
    },
    extraReducers: {
        [addInventoryItemAction.pending]: (state) => {
            state.addInventoryItemStatus = STATUS.FETCHING
        },
        [addInventoryItemAction.fulfilled]: (state, action) => {
            SuccessMessage()
            state.addInventoryItemStatus = STATUS.SUCCESS
            state.allInventoryItem = concat(state.allInventoryItem, action.payload)
        },
        [addInventoryItemAction.rejected]: (state, action) => {
            ErrorMessage()
            state.addInventoryItemStatus = STATUS.FAILED
        },

        [getInventoryItemAction.pending]: (state) => {
            state.getInventoryItemStatus = STATUS.FETCHING
        },
        [getInventoryItemAction.fulfilled]: (state, action) => {
            state.allInventoryItem = action.payload
            state.getInventoryItemStatus = STATUS.SUCCESS
        },
        [getInventoryItemAction.rejected]: (state, action) => {
            ErrorMessage()
            state.getInventoryItemStatus = STATUS.FAILED
        },

        [updateInventoryItemAction.pending]: (state) => {
            state.updateInventoryItemStatus = STATUS.FETCHING
        },
        [updateInventoryItemAction.fulfilled]: (state, action) => {
            SuccessMessage()
            state.allInventoryItem = map(state.allInventoryItem, item => item._id === action.payload._id ? action.payload : item)
            state.updateInventoryItemStatus = STATUS.SUCCESS
        },
        [updateInventoryItemAction.rejected]: (state, action) => {
            ErrorMessage()
            state.updateInventoryItemStatus = STATUS.FAILED
        },

        [addInventoryGroupAction.pending]: (state) => {
            state.addInventoryGroupStatus = STATUS.FETCHING
        },
        [addInventoryGroupAction.fulfilled]: (state, action) => {
            SuccessMessage()
            state.addInventoryGroupStatus = STATUS.SUCCESS
            state.allInventoryGroups = concat(state.allInventoryGroups, action.payload)
        },
        [addInventoryGroupAction.rejected]: (state, action) => {
            ErrorMessage()
            state.addInventoryGroupStatus = STATUS.FAILED
        },

        [getInventoryGroupAction.pending]: (state) => {
            state.getInventoryGroupStatus = STATUS.FETCHING
        },
        [getInventoryGroupAction.fulfilled]: (state, action) => {
            state.allInventoryGroups = action.payload
            state.getInventoryGroupStatus = STATUS.SUCCESS
        },
        [getInventoryGroupAction.rejected]: (state, action) => {
            ErrorMessage()
            state.getInventoryGroupStatus = STATUS.FAILED
        },

        [getSingleInventorygroup.pending]: (state) => {
            state.getSingleInventorygroupStatus = STATUS.FETCHING
        },
        [getSingleInventorygroup.fulfilled]: (state, action) => {
            state.singleInventoryGroup = action.payload
            state.getSingleInventorygroupStatus = STATUS.SUCCESS
        },
        [getSingleInventorygroup.rejected]: (state, action) => {
            ErrorMessage()
            state.getSingleInventorygroupStatus = STATUS.FAILED
        },

        [updateInventoryGroupAction.pending]: (state) => {
            state.updateInventoryGroupStatus = STATUS.FETCHING
        },
        [updateInventoryGroupAction.fulfilled]: (state, action) => {
            SuccessMessage()
            state.allInventoryGroups = map(state.allInventoryGroups, item => item._id === action.payload._id ? action.payload : item)
            state.updateInventoryGroupStatus = STATUS.SUCCESS
        },
        [updateInventoryGroupAction.rejected]: (state, action) => {
            ErrorMessage()
            state.updateInventoryGroupStatus = STATUS.FAILED
        },

        [addDeliveredItem.pending]: (state) => {
            state.addDeliveredItemStatus = STATUS.FETCHING
        },
        [addDeliveredItem.fulfilled]: (state, action) => {
            SuccessMessage()
            state.studentDeliveredItem = concat(state.studentDeliveredItem, action.payload)
            state.addDeliveredItemStatus = STATUS.SUCCESS
        },
        [addDeliveredItem.rejected]: (state, action) => {
            ErrorMessage()
            state.addDeliveredItemStatus = STATUS.FAILED
        },

        [getDeliveredItemList.pending]: (state) => {
            state.getDeliveredItemListStatus = STATUS.FETCHING
        },
        [getDeliveredItemList.fulfilled]: (state, action) => {
            state.studentDeliveredItem = action.payload
            state.getDeliveredItemListStatus = STATUS.SUCCESS
        },
        [getDeliveredItemList.rejected]: (state, action) => {
            ErrorMessage()
            state.getDeliveredItemListStatus = STATUS.FAILED
        },
    }
})

export const { resetInventoryItem, resetInventoryGroup, resetDeliveredItemStatus } = Inventory.actions
export const inventoryReducer = Inventory.reducer