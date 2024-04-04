import { STATUS } from "../../../Constants";
import {
  ErrorMessage,
  FetchingMessage,
  SuccessMessage,
} from "../../../Constants/CommonAlerts";
import { apis } from "../../../services/api/apis";
import _, { find, map, size } from "lodash";

const { createSlice, createAsyncThunk, current } = require("@reduxjs/toolkit");

export const addPackageAction = createAsyncThunk(
  "pagagraph/create",
  async (payload, thunkAPI) => {
    const response = await apis.addPackageApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const updatePackageAction = createAsyncThunk(
  "pagagraph/update",
  async (payload, thunkAPI) => {
    const response = await apis.updatePackageApi(payload);
    const { ok, problem, data } = response;
    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const getPackagesAction = createAsyncThunk(
  "pagagraph/all",
  async (payload, thunkAPI) => {
    const response = await apis.getPackagesApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const getSinglePackageAction = createAsyncThunk(
  "pagagraph/get",
  async (payload, thunkAPI) => {
    const response = await apis.getSinglePackageApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const updatePackageContentAction = createAsyncThunk(
  "pagagraph/content/update",
  async (payload, thunkAPI) => {
    const response = await apis.updatePackageNewApi(payload);
    //const response = await apis.updatePackageApi(payload)
    const { ok, problem, data } = response;

    if (ok) {
      return { data, extraData: payload };
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const schedulePackageTestAction = createAsyncThunk(
  "package/scheduleTest",
  async (payload, thunkAPI) => {
    const response = await apis.schedulePackageTestApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return { data, extraData: payload };
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const addTagAction = createAsyncThunk(
  "/tag/create",
  async (payload, thunkAPI) => {
    const response = await apis.addTagApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const getTagsAction = createAsyncThunk(
  "/tag/get",
  async (payload, thunkAPI) => {
    const response = await apis.getTagsApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const getModalTagsAction = createAsyncThunk(
  "/modal/tag/get",
  async (payload, thunkAPI) => {
    const response = await apis.getTagsApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const updateTagAction = createAsyncThunk(
  "/tag/update",
  async (payload, thunkAPI) => {
    const response = await apis.updateTagApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const createPackageOfferAction = createAsyncThunk(
  "/packageOffer",
  async (payload, thunkAPI) => {
    const response = await apis.createPackageOfferApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const updatePackageOfferAction = createAsyncThunk(
  "/updatePackageOffer",
  async (payload, thunkAPI) => {
    const response = await apis.updatePackageOfferApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const addAssignmentToPkgAction = createAsyncThunk(
  "/package/assignment/add",
  async (payload, thunkAPI) => {
    const response = await apis.addAssignmentToPkgApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const removePkgAssignmentAction = createAsyncThunk(
  "/package/assignment/remove",
  async (payload, thunkAPI) => {
    const response = await apis.removePkgAssingmentApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const deletePackageAction = createAsyncThunk(
  "/package/remove",
  async (payload, thunkAPI) => {
    const response = await apis.deletePackageApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return { data, extraData: payload };
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const updatePkgAssignmentAction = createAsyncThunk(
  "/package/assignment/update",
  async (payload, thunkAPI) => {
    const response = await apis.updatePkgAssignmentApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const getPkgStudentsAction = createAsyncThunk(
  "/package/students/get",
  async (payload, thunkAPI) => {
    const response = await apis.getPkgStudentsApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const updateStudentPackageDetails = createAsyncThunk(
  "/package/students/update",
  async (payload, thunkAPI) => {
    const response = await apis.updateStudentPackageDetails(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const updateStudentSubPackageDetails = createAsyncThunk(
  "/package/sub/students/update",
  async (payload, thunkAPI) => {
    const response = await apis.updateStudentPackageDetails(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const updateStudentTrialPackageDetails = createAsyncThunk(
  "/package/trial/students/update",
  async (payload, thunkAPI) => {
    const response = await apis.updateStudentPackageDetails(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const getSubStudentsAction = createAsyncThunk(
  "/subscription/students/get",
  async (payload, thunkAPI) => {
    const response = await apis.getSubStudentsApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const getTrialStudentsAction = createAsyncThunk(
  "/trial/students/get",
  async (payload, thunkAPI) => {
    const response = await apis.getTrialStudentsApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const getTypePackagsAction = createAsyncThunk(
  "/package/type/get",
  async (payload, thunkAPI) => {
    const response = await apis.getTypePackagsApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const notifyAdmitCardAction = createAsyncThunk(
  "/package/admit-card/notify",
  async (payload, thunkAPI) => {
    let api = apis.notifyAdmitCardApi;
    if (payload.userIds && size(payload.userIds)) {
      api = apis.notifyAdmitCardAnyApi;
    }
    const response = await api(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const getPackageRollsAction = createAsyncThunk(
  "/package/rolls/get",
  async (payload, thunkAPI) => {
    const response = await apis.getPackageRollsApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const addPkgDemoAction = createAsyncThunk(
  "/package/demo/add",
  async (payload, thunkAPI) => {
    const response = await apis.addPkgDemoApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const deleteContentAction = createAsyncThunk(
  "/package/demo/delete",
  async (payload, thunkAPI) => {
    const response = await apis.deleteContentApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const updatePkgDemoAction = createAsyncThunk(
  "/package/demo/update",
  async (payload, thunkAPI) => {
    const response = await apis.updatePkgDemoApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const updatePkgDemoOrderAction = createAsyncThunk(
  "/package/demo/update/order",
  async (payload, thunkAPI) => {
    const response = await apis.updatePkgDemoOrderApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const removePkgSubscriptionAction = createAsyncThunk(
  "/package/demo/remove/subscription",
  async (payload, thunkAPI) => {
    const response = await apis.removePkgSubscriptionApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const uploadStudentTimingAction = createAsyncThunk(
  "/upload/student/timing",
  async (payload, thunkAPI) => {
    const response = await apis.uploadStudentTimingApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

export const uploadStudentRollNoAction = createAsyncThunk(
  "/upload/student/rollno",
  async (payload, thunkAPI) => {
    const response = await apis.uploadStudentRollNoApi(payload);
    const { ok, problem, data } = response;

    if (ok) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(problem);
    }
  }
);

const initialState = {
  packagesList: [],
  getTagsStatus: STATUS.NOT_STARTED,
  createPackageOfferStatus: STATUS.NOT_STARTED,
  updatePackageOfferStatus: STATUS.NOT_STARTED,
  tagsList: [],
  modalTagsList: [],
};

export const PackageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {
    resetGetSinglePkg: (state) => {
      state.getSinglePackgStatus = STATUS.NOT_STARTED;
      state.currentPackage = {};
    },

    resetAddPackage: (state) => {
      state.addPackageStatus = STATUS.NOT_STARTED;
      state.updatePkgContentStatus = STATUS.NOT_STARTED;
    },

    resetAddTag: (state) => {
      state.addTagStatus = STATUS.NOT_STARTED;
      state.updateTagStatus = STATUS.NOT_STARTED;
      state.recentTag = null;
    },

    resetTagsListdata: (state) => {
      state.getModalTagsStatus = STATUS.NOT_STARTED;
      state.modalTagsList = [];
    },

    resetOfferStatusAction: (state) => {
      state.createPackageOfferStatus = STATUS.NOT_STARTED;
      state.updatePackageOfferStatus = STATUS.NOT_STARTED;
    },
  },
  extraReducers: {
    [updatePkgDemoOrderAction.pending]: (state) => {
      state.updatePkgDemoOrderStatus = STATUS.FETCHING;
    },
    [updatePkgDemoOrderAction.fulfilled]: (state, action) => {
      state.currentPackage.demoContent[action.payload.path] =
        action.payload.data;
      SuccessMessage();
      state.updatePkgDemoOrderStatus = STATUS.SUCCESS;
    },
    [updatePkgDemoOrderAction.rejected]: (state, action) => {
      ErrorMessage();
      state.updatePkgDemoOrderStatus = STATUS.FAILED;
    },

    [updatePkgDemoAction.pending]: (state) => {
      state.updateDemoStatus = STATUS.FETCHING;
    },
    [updatePkgDemoAction.fulfilled]: (state, action) => {
      state.currentPackage.demoContent = action.payload.data;
      SuccessMessage();
      state.updateDemoStatus = STATUS.SUCCESS;
    },
    [updatePkgDemoAction.rejected]: (state, action) => {
      ErrorMessage();
      state.updateDemoStatus = STATUS.FAILED;
    },

    [deleteContentAction.pending]: (state) => {
      state.deleteContentStatus = STATUS.FETCHING;
    },
    [deleteContentAction.fulfilled]: (state, action) => {
      state.currentPackage.demoContent[action.payload.path] =
        action.payload.data;
      SuccessMessage();
      state.deleteContentStatus = STATUS.SUCCESS;
    },
    [deleteContentAction.rejected]: (state, action) => {
      ErrorMessage();
      state.deleteContentStatus = STATUS.FAILED;
    },

    [addPkgDemoAction.pending]: (state) => {
      state.addPkgDemoStatus = STATUS.FETCHING;
    },
    [addPkgDemoAction.fulfilled]: (state, action) => {
      if (state.currentPackage.demoContent) {
        state.currentPackage.demoContent = action.payload.data;
      } else {
        state.currentPackage = {
          ...state.currentPackage,
          demoContent: action.payload.data,
        };
      }
      SuccessMessage();
      state.addPkgDemoStatus = STATUS.SUCCESS;
    },
    [addPkgDemoAction.rejected]: (state, action) => {
      ErrorMessage();
      state.addPkgDemoStatus = STATUS.FAILED;
    },

    [getPackageRollsAction.pending]: (state) => {
      state.getPackageRollsStatus = STATUS.FETCHING;
    },
    [getPackageRollsAction.fulfilled]: (state, action) => {
      state.getPackageRollsStatus = STATUS.SUCCESS;
      state.allStudentRolls = action.payload;
    },
    [getPackageRollsAction.rejected]: (state, action) => {
      ErrorMessage();
      state.getPackageRollsStatus = STATUS.FAILED;
    },

    [notifyAdmitCardAction.pending]: (state) => {
      FetchingMessage("Sending...");
      state.notifyAdmitCardStatus = STATUS.FETCHING;
    },
    [notifyAdmitCardAction.fulfilled]: (state, action) => {
      state.notifyAdmitCardStatus = STATUS.SUCCESS;
      SuccessMessage();
    },
    [notifyAdmitCardAction.rejected]: (state, action) => {
      ErrorMessage();
      state.notifyAdmitCardStatus = STATUS.FAILED;
    },

    [getTypePackagsAction.pending]: (state) => {
      state.getTypePackagssTATUS = STATUS.FETCHING;
    },
    [getTypePackagsAction.fulfilled]: (state, action) => {
      state.getTypePackagssTATUS = STATUS.SUCCESS;
      state.allPackages = action.payload;
    },
    [getTypePackagsAction.rejected]: (state, action) => {
      ErrorMessage();
      state.getTypePackagssTATUS = STATUS.FAILED;
    },

    [getPkgStudentsAction.pending]: (state) => {
      state.getPkgStudentsStatus = STATUS.FETCHING;
    },
    [getPkgStudentsAction.fulfilled]: (state, action) => {
      state.getPkgStudentsStatus = STATUS.SUCCESS;
      state.pkgStudents = action.payload;
    },
    [getPkgStudentsAction.rejected]: (state, action) => {
      ErrorMessage();
      state.getPkgStudentsStatus = STATUS.FAILED;
    },

    [updateStudentPackageDetails.pending]: (state) => {
      state.updateStudentPackageStatus = STATUS.FETCHING;
    },
    [updateStudentPackageDetails.fulfilled]: (state, action) => {
      state.updateStudentPackageStatus = STATUS.SUCCESS;
      // state.pkgStudents = action.payload
      state.pkgStudents = {
        ...state.pkgStudents,
        docs: map(state.pkgStudents.docs, (d) =>
          d._id === action.payload._id
            ? {
                ...d,
                packages: find(
                  action.payload.packages,
                  (pkg) => pkg._id === d.packages._id
                ),
              }
            : d
        ),
      };
      SuccessMessage();
    },
    [updateStudentPackageDetails.rejected]: (state, action) => {
      ErrorMessage();
      state.updateStudentPackageStatus = STATUS.FAILED;
    },

    [getSubStudentsAction.pending]: (state) => {
      state.getSubStudentsStatus = STATUS.FETCHING;
    },
    [getSubStudentsAction.fulfilled]: (state, action) => {
      state.getSubStudentsStatus = STATUS.SUCCESS;
      state.subStudents = action.payload;
    },
    [getSubStudentsAction.rejected]: (state, action) => {
      ErrorMessage();
      state.getSubStudentsStatus = STATUS.FAILED;
    },

    [updateStudentSubPackageDetails.pending]: (state) => {
      state.updateStudentSubPackageStatus = STATUS.FETCHING;
    },
    [updateStudentSubPackageDetails.fulfilled]: (state, action) => {
      state.updateStudentSubPackageStatus = STATUS.SUCCESS;
      state.subStudents = {
        ...state.subStudents,
        docs: map(state.subStudents.docs, (d) =>
          d._id === action.payload._id
            ? {
                ...d,
                packages: find(
                  action.payload.packages,
                  (pkg) => pkg._id === d.packages._id
                ),
              }
            : d
        ),
      };

      SuccessMessage();
    },
    [updateStudentSubPackageDetails.rejected]: (state, action) => {
      ErrorMessage();
      state.updateStudentSubPackageStatus = STATUS.FAILED;
    },

    [getTrialStudentsAction.pending]: (state) => {
      state.getTrialStudentsStatus = STATUS.FETCHING;
    },
    [getTrialStudentsAction.fulfilled]: (state, action) => {
      state.getTrialStudentsStatus = STATUS.SUCCESS;
      state.trialStudents = action.payload;
    },
    [getTrialStudentsAction.rejected]: (state, action) => {
      ErrorMessage();
      state.getTrialStudentsStatus = STATUS.FAILED;
    },

    [updateStudentTrialPackageDetails.pending]: (state) => {
      state.updateStudentTrialPackageStatus = STATUS.FETCHING;
    },
    [updateStudentTrialPackageDetails.fulfilled]: (state, action) => {
      state.updateStudentTrialPackageStatus = STATUS.SUCCESS;
      state.trialStudents = {
        ...state.trialStudents,
        docs: map(state.trialStudents.docs, (d) =>
          d._id === action.payload._id
            ? {
                ...d,
                packages: find(
                  action.payload.packages,
                  (pkg) => pkg._id === d.packages._id
                ),
              }
            : d
        ),
      };
      console.log("action trial");
      SuccessMessage();
    },
    [updateStudentTrialPackageDetails.rejected]: (state, action) => {
      ErrorMessage();
      state.updateStudentTrialPackageStatus = STATUS.FAILED;
    },

    [addPackageAction.pending]: (state) => {
      state.addPackageStatus = STATUS.FETCHING;
    },
    [addPackageAction.fulfilled]: (state, action) => {
      SuccessMessage("Packages Added");
      state.addPackageStatus = STATUS.SUCCESS;
      state.currentPackage = action.payload;
    },
    [addPackageAction.rejected]: (state, action) => {
      ErrorMessage();
      state.addPackageStatus = STATUS.FAILED;
    },

    [updatePackageAction.pending]: (state) => {
      state.updatePackageStatus = STATUS.FETCHING;
    },
    [updatePackageAction.fulfilled]: (state, action) => {
      SuccessMessage("Packages Updated");
      state.updatePackageStatus = STATUS.SUCCESS;
      state.currentPackage = action.payload;
    },
    [updatePackageAction.rejected]: (state, action) => {
      ErrorMessage();
      state.updatePackageStatus = STATUS.FAILED;
    },

    [getPackagesAction.pending]: (state) => {
      state.getPackagesStatus = STATUS.FETCHING;
    },
    [getPackagesAction.fulfilled]: (state, action) => {
      state.getPackagesStatus = STATUS.SUCCESS;
      state.packagesList = action.payload;
    },
    [getPackagesAction.rejected]: (state) => {
      state.getPackagesStatus = STATUS.FAILED;
    },

    [getSinglePackageAction.pending]: (state) => {
      state.getSinglePackgStatus = STATUS.FETCHING;
      state.currentPackage = {};
    },
    [getSinglePackageAction.fulfilled]: (state, action) => {
      state.getSinglePackgStatus = STATUS.SUCCESS;
      state.currentPackage =
        action.payload && action.payload.length > 0 ? action.payload[0] : {};
    },
    [getSinglePackageAction.rejected]: (state) => {
      state.getSinglePackgStatus = STATUS.FAILED;
    },

    [updatePackageContentAction.pending]: (state) => {
      state.updatePkgContentStatus = STATUS.FETCHING;
    },
    [updatePackageContentAction.fulfilled]: (state, action) => {
      SuccessMessage();
      const { courses, tests, books, drives, magazines } = action.payload.data;
      if (state.currentPackage) {
        let data = action.payload.data;

        if (courses) state.currentPackage.courses = data.courses;
        if (tests) state.currentPackage.tests = data.tests;
        if (books) state.currentPackage.books = data.books;
        if (drives) state.currentPackage.drives = data.drives;
        if (magazines) state.currentPackage.magazines = data.magazines;
      }

      state.updatePkgContentStatus = STATUS.SUCCESS;
    },
    [updatePackageContentAction.rejected]: (state) => {
      ErrorMessage();
      state.updatePkgContentStatus = STATUS.FAILED;
    },

    [schedulePackageTestAction.pending]: (state) => {
      state.updatePkgContentStatus = STATUS.FETCHING;
    },
    [schedulePackageTestAction.fulfilled]: (state, action) => {
      SuccessMessage();
      const { courses, tests, books, drives, magazines } = action.payload.data;
      if (state.currentPackage) {
        let data = action.payload.data;
        if (courses) state.currentPackage.courses = data.courses;
        if (tests) state.currentPackage.tests = data.tests;
        if (books) state.currentPackage.books = data.books;
        if (drives) state.currentPackage.drives = data.drives;
        if (magazines) state.currentPackage.magazines = data.magazines;
      }

      state.updatePkgContentStatus = STATUS.SUCCESS;
    },
    [schedulePackageTestAction.rejected]: (state) => {
      ErrorMessage();
      state.updatePkgContentStatus = STATUS.FAILED;
    },

    [addTagAction.pending]: (state) => {
      state.addTagStatus = STATUS.FETCHING;
    },
    [addTagAction.fulfilled]: (state, action) => {
      SuccessMessage("Tag added");
      state.tagsList.push(action.payload);
      state.recentTag = action.payload;
      state.addTagStatus = STATUS.SUCCESS;
    },
    [addTagAction.rejected]: (state) => {
      ErrorMessage();
      state.addTagStatus = STATUS.FAILED;
    },

    [getTagsAction.pending]: (state) => {
      state.getTagsStatus = STATUS.FETCHING;
    },
    [getTagsAction.fulfilled]: (state, action) => {
      state.getTagsStatus = STATUS.SUCCESS;
      state.tagsList = action.payload;
    },
    [getTagsAction.rejected]: (state) => {
      state.getTagsStatus = STATUS.FAILED;
    },

    [getModalTagsAction.pending]: (state) => {
      state.getModalTagsStatus = STATUS.FETCHING;
    },
    [getModalTagsAction.fulfilled]: (state, action) => {
      state.getModalTagsStatus = STATUS.SUCCESS;
      state.modalTagsList = action.payload;
    },
    [getModalTagsAction.rejected]: (state) => {
      state.getModalTagsStatus = STATUS.FAILED;
    },

    [updateTagAction.pending]: (state) => {
      state.updateTagStatus = STATUS.FETCHING;
    },
    [updateTagAction.fulfilled]: (state, action) => {
      SuccessMessage("Tag updated");
      state.updateTagStatus = STATUS.SUCCESS;
      let indx = _.findIndex(
        state.tagsList,
        (t) => t._id == action.payload._id
      );
      state.tagsList[indx] = action.payload;
    },
    [updateTagAction.rejected]: (state) => {
      ErrorMessage();
      state.updateTagStatus = STATUS.FAILED;
    },

    [createPackageOfferAction.pending]: (state) => {
      state.createPackageOfferStatus = STATUS.FETCHING;
    },
    [createPackageOfferAction.fulfilled]: (state, action) => {
      state.createPackageOfferStatus = STATUS.SUCCESS;
      state.currentPackage = action.payload;
    },
    [createPackageOfferAction.rejected]: (state) => {
      state.createPackageOfferStatus = STATUS.FAILED;
    },

    [updatePackageOfferAction.pending]: (state) => {
      state.updatePackageOfferStatus = STATUS.FETCHING;
    },
    [updatePackageOfferAction.fulfilled]: (state, action) => {
      state.updatePackageOfferStatus = STATUS.SUCCESS;
      state.currentPackage = action.payload;
    },
    [updatePackageOfferAction.rejected]: (state) => {
      ErrorMessage();
      state.updatePackageOfferStatus = STATUS.FAILED;
    },

    [addAssignmentToPkgAction.pending]: (state) => {
      state.addAssignmentStatus = STATUS.FETCHING;
    },
    [addAssignmentToPkgAction.fulfilled]: (state, action) => {
      state.currentPackage.assignments = action.payload.assignments;
      state.addAssignmentStatus = STATUS.SUCCESS;
    },
    [addAssignmentToPkgAction.rejected]: (state) => {
      ErrorMessage();
      state.addAssignmentStatus = STATUS.FAILED;
    },

    [removePkgAssignmentAction.pending]: (state) => {
      state.removeAssignmentStatus = STATUS.FETCHING;
    },
    [removePkgAssignmentAction.fulfilled]: (state, action) => {
      SuccessMessage("Assignment Removed");
      state.currentPackage.assignments = action.payload.assignments;
      state.removeAssignmentStatus = STATUS.SUCCESS;
    },
    [removePkgAssignmentAction.rejected]: (state) => {
      ErrorMessage();
      state.removeAssignmentStatus = STATUS.FAILED;
    },

    [updatePkgAssignmentAction.pending]: (state) => {
      state.updateAssignmentStatus = STATUS.FETCHING;
    },
    [updatePkgAssignmentAction.fulfilled]: (state, action) => {
      SuccessMessage("Assignment Updated");
      state.currentPackage.assignments = action.payload.assignments;

      state.updateAssignmentStatus = STATUS.SUCCESS;
    },
    [updatePkgAssignmentAction.rejected]: (state) => {
      ErrorMessage();
      state.updateAssignmentStatus = STATUS.FAILED;
    },

    [deletePackageAction.pending]: (state) => {
      state.deletePackageStatus = STATUS.FETCHING;
    },
    [deletePackageAction.fulfilled]: (state, action) => {
      SuccessMessage("Package Removed");
      _.remove(state.packagesList, (d) => d._id == action.payload.extraData.id);
      state.deletePackageStatus = STATUS.SUCCESS;
    },
    [deletePackageAction.rejected]: (state) => {
      ErrorMessage();
      state.deletePackageStatus = STATUS.FAILED;
    },

    [removePkgSubscriptionAction.pending]: (state) => {
      state.removePckSubStatus = STATUS.FETCHING;
    },
    [removePkgSubscriptionAction.fulfilled]: (state, action) => {
      SuccessMessage("Package Subscription Removed!");
      state.currentPackage = action.payload;
      state.removePckSubStatus = STATUS.SUCCESS;
    },
    [removePkgSubscriptionAction.rejected]: (state) => {
      ErrorMessage();
      state.removePckSubStatus = STATUS.FAILED;
    },

    [uploadStudentTimingAction.pending]: (state) => {
      state.uploadStudentTimingStatus = STATUS.FETCHING;
    },
    [uploadStudentTimingAction.fulfilled]: (state) => {
      SuccessMessage();
      state.uploadStudentTimingStatus = STATUS.SUCCESS;
    },
    [uploadStudentTimingAction.rejected]: (state) => {
      ErrorMessage();
      state.uploadStudentTimingStatus = STATUS.FAILED;
    },

    [uploadStudentRollNoAction.pending]: (state) => {
      state.uploadStudentRollNoStatus = STATUS.FETCHING;
    },
    [uploadStudentRollNoAction.fulfilled]: (state) => {
      SuccessMessage();
      state.uploadStudentRollNoStatus = STATUS.SUCCESS;
    },
    [uploadStudentRollNoAction.rejected]: (state) => {
      ErrorMessage();
      state.uploadStudentRollNoStatus = STATUS.FAILED;
    },
  },
});

export const {
  resetGetSinglePkg,
  resetAddPackage,
  resetAddTag,
  resetTagsListdata,
  resetOfferStatusAction,
} = PackageSlice.actions;
export const packageReducer = PackageSlice.reducer;
