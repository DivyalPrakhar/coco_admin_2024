import _ from 'lodash';
import { message } from "antd";
import { STATUS } from "../../../Constants";
import { ErrorMessage, SuccessMessage } from "../../../Constants/CommonAlerts";
import { apis } from "../../../services/api/apis";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
  
export const addProductAction = createAsyncThunk(
    'product/addProduct',
    async(payload, thunkAPI) => {
        const response = await apis.addProductApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const updateProductAction = createAsyncThunk(
    'product/updateProduct',
    async(payload, thunkAPI) => {
        const response = await apis.updateProductApi(payload)
        const {ok, problem, data} = response
        if(ok)
            return data
        else
            return thunkAPI.rejectWithValue(problem)
    }
)


export const getAllProductsAction = createAsyncThunk(
    'product/getAllProducts',
    async(payload, thunkAPI) => {
        const response = await apis.getAllProductsApi(payload)

        const {ok, problem, data} = response
        let examsdata = thunkAPI.getState()
        examsdata = examsdata.lmsConfig?.keyedData?.exams
        let groupedData = _.map(response.data, d => {
            return Object.assign({}, d, {
                exams : _.map(d.exams, e => {
                    return examsdata[e]
                })
            })
        })
         groupedData = _.groupBy(groupedData,(d)=>(d.type))
        if(ok)
            return groupedData
        else
            return thunkAPI.rejectWithValue(problem)
    }
)

export const deleteProductAction = createAsyncThunk(
    'product/deleteProduct',
    async(payload, thunkAPI) => {
        const response = await apis.deleteProductApi({id: payload.id})
        const {ok, problem, data} = response
        if(ok)
            return {data, extraData: payload}
        else
            return thunkAPI.rejectWithValue(problem)
    }
)


let initialState = {
    allProductStatus : STATUS.NOT_STARTED,
    productStatus : STATUS.NOT_STARTED
}

const productSlice = createSlice({
    name:'product',
    initialState,
    reducers: {
        resetProductStatusAction: (state, action) => {
          state.productStatus = STATUS.NOT_STARTED
        //   state.deleteAlumniEducationStatus = STATUS.NOT_STARTED
        }
    },
    extraReducers:{

        // Add Product
        [addProductAction.pending] : (state, action) => {
            state.productStatus = STATUS.FETCHING
        },
        [addProductAction.fulfilled]:(state, action)=>{
            state.productStatus = STATUS.SUCCESS
        },
        [addProductAction.rejected]:(state, action)=>{
            state.productStatus = STATUS.FAILED
        },

        // Update Product
        [updateProductAction.pending] : (state, action) => {
            state.productStatus = STATUS.FETCHING
        },
        [updateProductAction.fulfilled]:(state, action)=>{
            state.productStatus = STATUS.SUCCESS
        },
        [updateProductAction.rejected]:(state, action)=>{
            state.productStatus = STATUS.FAILED
        },

        // Get Product List
        [getAllProductsAction.pending] : (state, action) => {
            state.allProductStatus = STATUS.FETCHING
        },
        [getAllProductsAction.fulfilled]:(state, action)=>{
            state.allProductStatus = STATUS.SUCCESS
            state.productsData = action.payload
        },
        [getAllProductsAction.rejected]:(state, action)=>{
            state.allProductStatus = STATUS.FAILED
        },

        [deleteProductAction.pending] : (state, action) => {
            state.deleteProductStatus = STATUS.FETCHING
        },
        [deleteProductAction.fulfilled]:(state, action)=>{
            state.deleteProductStatus = STATUS.SUCCESS
            state.productsData[action.payload.extraData.type] = _.filter(state.productsData[action.payload.extraData.type], d => d._id != action.payload.extraData.id)
            SuccessMessage('Product Deleted')
        },
        [deleteProductAction.rejected]:(state, action)=>{
            state.deleteProductStatus = STATUS.FAILED
            ErrorMessage(action.payload?.message)
        },
    }
})

export const { resetProductStatusAction } = productSlice.actions
export const productReducer = productSlice.reducer