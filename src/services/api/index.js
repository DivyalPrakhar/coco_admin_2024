import { create } from "apisauce";
import apiMonitor from "./monitor";
import { BaseURL } from "../../BaseUrl";

export const URIS = {
  VERSION: "/app/version",
  LOGIN: "/auth/login",
  STUDENT_LOGIN: "/auth/login/user",
  REFRESH: "/refresh",
  LOGOUT: "/logout",
  STATES: "/app/states",
  ME: "/auth/me",
  ADD_STUDENT: "/student/create",
  GET_ALUMNI: "/student",
  SEARCH_STUDENTS: "/student/search",
  ADD_GROUP: "group/create",

  ADD_INSTITUTE: "/institute/create",
  ADD_BATCH: "/batch/create",
  GET_BATCH: "batch",
  GET_BATCHES: "/institute",
  GET_INSTITUTES: "/institute/all",
  ADD_INSTITUTE_STAFF: "/staff/create",
  GET_SINGLE_INSTITUTE: "/institute",
  ADD_EDUCATION: "/student/education",
  ASSIGN_GROUPS: "/student/groups",
  INSTITUTE: "/institute",
  STAFF: "/staff",
  UPDATE_STUDENT: "/user/update",
  GROUP: "/group",
  UPDATE_BATCH: "/batch",
  REMOVE_GROUP: "/group/remove-members",
  ADD_STUDENT_EXCEL: "/student/multiple",
  UPDATE_MEMBER: "/student",
  ALUMNI_EXPERIENCE: "/student/experience",
  ADD_COURSE: "/course",
  GET_COURSES: "/course/institute",
  DELETE_COURSE: "/course",
  ADD_LMS_CONFIG: "/lmsConfig/params/add",
  EDIT_LMS_CONFIG: "/lmsconfig/params/edit",
  GET_DEFAULT_DATA: "/lmsConfig/default",
  INSTITUTE_DEFAULT: "/lmsConfig/institute",
  QUESTION: "/question-bank/question",
  GET_ALL_QUESTIONS: "/question-bank",
  ADD_PARAGRAPH: "/question-bank/paragraph",
  LIST_PARAGRAPH: "/question-bank/paragraph/all",
  UPLOAD_BASECHAPTERS: "/syllabus/basechapters/json",
  GET_BASECHAPTERS: "/syllabus/basechapters/get",
  ADD_CHAPTER_TEMPLATE: "/syllabus/template/json",
  GET_CHAPTER_TEMPLATE: "/syllabus/templates",
  GET_SYLLABUS_CHAPTER_DATA: "/syllabus/template",
  GET_OLD_CHAPTER_TEMPLATE_EXCEL: "/syllabus/template/json",
  ADD_COURSE_SUBJECT: "/course/subject",
  GET_PARA_QUESTIONS: "/question-bank/paragraph/questions",
  REMOVE_PARA_QUESTION: "/question-bank/question/paragraph",
  ADD_COURSE_CONTENT: "/course/content",
  GET_ALL_CENTER: "/center-manage/all",
  EXAM_CENTER: "/center-manage",
  PACKAGE: "/package",
  GET_ALL_PACKAGES: "/package/all",
  DELETE_QUESTION: "/question-bank/question",
  GET_ALL_PRODUCTS: "/product/all",
  ADD_PRODUCT: "/product",
  UPDATE_PRODUCT: "/product",

  UPDATE_CONTENT_ORDER: "/course/content/order",
  STUDENT_COURSES: "/student/course",

  CREATE_COUPON: "/coupons/create",
  UPDATE_COUPON: "/coupons",
  GET_ALL_COUPONS: "/coupons/all",

  GET_ALL_LEADS: "/leads",

  GET_SURVEY_TOPIC: "/survey/topic/all",
  GET_FEEDBACK_SURVEY: "/survey/all",
  POST_FEEDBACK_SURVEY: "/survey",
  PATCH_FEEDBACK_SURVEY_LIST: "/survey",
  DELETE_FEEDBACK_SURVEY_LIST: "/survey",
  POST_SURVEY_TOPIC: "/survey/topic",
  PATCH_SURVEY_TOPIC: "/survey/topic",
  DELETE_SURVEY_TOPIC: "/survey/topic",
  GET_SINGLE_SURVEY: "/survey",

  TEST: "/tests/paper",
  GET_ALL_TESTS: "/tests/papers",
  STUDENT_FILTER: "/student/filter",
  ADD_TEST_SUBJECTS: "/tests/paper/section",
  ADD_TEST_SETTINGS: "/tests/paper/settings",
  ADD_NEW_TEST_QUESTION: "/tests/paper/section/question/new",
  ADD_QUESTION_TO_TEST: "/tests/paper/section/question",
  REMOVE_TEST_QUESTION: "/tests/paper/section/questions",
  CHANGE_TEST_QUESTIONS_ORDER: "/tests/paper/section/question-order",
  REMOVE_TEST: "/tests/paper/soft",
  GET_ALL_INSTRUCTION: "/instruction",
  TAG: "/tag",
  ANSWER_KEYS: "/tests/answers",
  UPDATE_PACKAGE_NEW_API: "/package/assign",
  SCHEDULE_PACKAGE_TEST: "/package/test/schedule",
  CREATE_PACKAGE_OFFER: "/package/offer",
  ASSIGN_TEST_SYLLABUS: "/tests/paper/syllabus",
  ASSIGNMENT: "/assignment",
  PACKAGE_ASSIGNMENT: "/package/assignment",
  ANSWER_SHEET: "/answersheet",
  ASSIGN_TEST_QAQC: "/tests/assign",
  USER_QAQC_TESTS: "/tests/user-tests",
  GET_TEST_QUESTIONS: "/tests/questions/id",
  VERIFY_QUESTION: "/question-bank/verify-question",
  UNVERIFY_QUESTION: "/question-bank/unverify-question",
  ADD_WEBSITE_DATA: "/website-content",
  GET_PROMO_CODE_DATA: "/promo",
  GET_TEST_ATTEMPT_DATA: "/test-attempt/paper",
  COPY_TEST: "/tests/copy-test",
  GET_DISCUSSION_TOPIC: "/topic/all",
  ADD_DISCUSSION_TOPIC: "/topic",
  APPROVE_TOPIC_QUESTION: "/topic/question/approve",
  ADD_CONTENT_IMAGE: "course/content/image",
  SEARCH_STAFF_DATA: "/staff",
  WORD_QUESTION_UPLOAD: "/tests/doc",
  DELETE_DOCUMENT_QUESTION: "/tests/remove-doc-questions",
  ADD_WORD_QUESTION_TO_TEST: "tests/doc-questions",
  ADD_ADDRESS: "/address",
  ASSIGN_STUDENT_PKG: "/student/package/assign",
  BULK_QUESTIONS_TO_BANK: "/tests/doc/bulk-questions",
  UPLOAD_SUBJECT_EXCEL: "/lmsconfig/bulk-subjects",
  GET_DEMO_ATTEMPT: "/test-attempt/demo",
  DELETE_TEST_ATTEMPT: "/test-attempt",
  DELETE_COURSE_SUBJECT: "/course/subject",
  ADD_NOTICE: "/notice",
  GET_ALL_NOTICE: "/notice/all",
  ADD_EVENT: "/events",
  GET_ALL_EVENT: "/events/all",
  GET_ALL_EVENT_USER: "/event-users/all/filter",
  UPDATE_USER_EVENT: "/event-users",
  UPLOAD_QUE_PAPER: "/tests/paper",
  CHANGE_ATTEMPT_STATUS: "/test-attempt/status",
  RESULT_CALCULATE: "/tests/paper/test-result",
  NOTIFICATION: "/messaging",
  GET_NOTIFICATIONS: "/notification/all",
  GET_COMMENTS: "/comment/item",
  DELETE_COMMENT: "/comment",
  GET_COMMENT_REPLIES: "/comment/replies",
  GET_PACKAGE_STUDENTS: "/student/all/package",
  GET_SUBSCRIPTION_STUDENTS: "/student/report",
  GET_TRIAL_STUDENTS: "/student/report",
  DELETE_MULTIPLE_QUESTIONS: "/question-bank/multiple",
  GET_ORDER_HISTORY: "/order/report",
  RECHECK_ORDER: "/order/reverify",
  GET_FEEDBACKS: "/feedback/all",
  GET_OFFLINE_ORDERS: "/order/report",
  UPDATE_ORDER_DELIVERY_STATUS: "/order/delivery-status",
  GET_WALLET_HISTORY: "/wallet/order/report",
  GET_WALLET_OFFERS: "/wallet/offer",
  ALL_TICKETS: "/ticket/all",
  TICKETS: "/ticket",
  COMMENT: "/comment",
  GET_ALL_STUDENTS: "/student/all",
  ADD_LIKE: "/comment/likes",
  UPDATE_SUBJECTS_ORDER: "/course/subject/order",
  GET_DASHBOARD: "/dashboard",
  READY_TEST: "/tests/ready",
  GET_DOUBTS: "/doubt/all",
  GET_ALL_TEACHER: "/staff/all-teachers",
  GET_SINGLE_DOUBT: "/doubt",
  POST_COMMENT: "/comment",
  DELETE_STUDENT_PACKAGE: "/student/package",
  GET_SINGLE_ASSIGNMENT: "/assignment/single-assignment-data",
  GET_ASSIGNMENT_SUBMISSIONS: "/assignment/assignment-submissions",
  // UPLOAD_CHECKED_FILE:'/assignment/submit/upload-checked',
  ASSINGMENT_SUBMIT: "/assignment/submit-by-staff",
  GET_TYPE_PACKAGES: "/package/content/usage",
  GET_ALL_SUBMISSIONS: "/assignment/assignment-submissions-zip",
  NOTIFY_ADMIN_CARD: "/student/sms-roll-to-students-offline",
  NOTIFY_ADMIN_CARD_ANY: "/student/sms-roll-to-students",

  GET_PACKAGE_ROLLS: "/package/package-rolls",
  GENERATE_ROLL_PACAKGE: "/student/package-student-roll-refresh",
  UPDATE_PACKAGE_STUDENT_MODE: "/student/package/update",
  ASSIGNMENT_RESULT_CALCULATE: "/assignment/result",
  GET_STUDENT_ADDRESS: "/address",
  RESET_PASS: "user/password/reset",
  GET_LEADS: "/leads/all",
  USER_LEADS: "/leads/user",
  UPLOAD_ASSIGNMENT_ZIP: "/assignment/submit/upload-checked/zip",
  UPLOAD_ASSIGNMENT_MARKS: "assignment/submit-by-staff/marks-excel",
  ADD_PACKAGE_DEMO_CONTENT: "/package/content",
  UPDATE_PACKAGE_DEMO_CONTENT_ORDER: "/package/content/order",
  ASSIGN_COURSE_TEACHER: "/doubt/teacher/assign",
  GET_COURSE_TEACHERS: "/doubt/teacher",
  UPDATE_ORDER: "/order",
  ADD_EXAM_CONTENT: "/exam-free-content/content",
  GET_EXAM_CONTENT: "/exam-free-content/exam-content",
  GET_CATEGORIES: "/category",
  POST_CATEGORY: "/category",
  GET_XII_EXAM_RESULT: "/auth/school-analysis-data",
  GET_SCHOOL_BY_DISTRICT: "/auth/schools-by-district",
  GET_X_SCHOOL_BY_DISTRICT: "/rbse/schools-by-district",
  GET_EXAM_DISTRICTS: "/auth/districts",
  GET_X_EXAM_COMPARE: "/rbse/10",
  GET_X_EXAM_RESULT: "/rbse/school-analysis-data",
  POST_OFFLINE_TEST_RESULT: "test-attempt/offline",
  GET_X_EXAM_DISTRICTS: "/rbse/districts",
  GET_SURVEY_TOPIC_ANSWER: "/survey/topic/answer/all",
  GET_SURVEY_PARTICIPANT: "/survey/participate",
  UPLOAD_STUDENT_BULK_VALIDATE: "/student/bulk/validate",
  UPLOAD_STUDENT_BULK_UPDATE: "/student/bulk/update",
  UPLOAD_STUDENT_BULK_ASSIGN: "/student/bulk/assign",
  GET_STUDENT_BULK_PENDING: "/student/bulk/pending",
  DELETE_STUDENT_BULK_UPLOAD: "/student/bulk/delete",
  REMOVE_PACKAGE_SUBSCRIPTION: "package/subscription/remove",
  GET_DISCOUNT_CONFIGS: "/discount-config/all",
  ADD_DISCOUNT_OFFFER: "/discount-config",

  ADD_PROMO_COUPON: "/promo-coupons/create",
  GET_ALL_PROMO_COUPON: "/promo-coupons/all",
  PROMO_COUPON: "/promo-coupons",

  GET_FRANCHISE_ENQUIRY: "/franchise-request/all",
  UPDATE_FRANCHISE_ENQUIRY: "/franchise-request",
  UPDATE_CAREER_JOBAPPLICATION: "/career-request",
  GET_CAREER_JOBAPPLICATION: "/career-request/all",
  GET_ALL_CAREER_REQUEST: "/career-request/all",
  CAREER_REQUEST: "/career-request",
  COPY_COURSE_SUBJECT: "/course/import/subject",
  COPY_COURSE_SUBJECT_CHAPTER: "/course/import/chapter",
  GET_LIVE_BATCH: "/batch",

  ADD_USER_ENQUIRY: "/user-enquiry",
  GET_USER_ENQUIRY: "/user-enquiry/all",
  OFFLINE_COURSE: "/offline-course",
  GET_OFFLINE_COURSE: "/offline-course/all",
  ADD_OFFLINE_PAYMENT: "/offline-payment",
  ASSIGN_BATCH: "student/offline-batch",
  ADD_STUDENT_INSTALLMENT: "/student-fees",
  GET_STUDENT_INSTALLMENT: "/student-fees/all",
  COLLECT_TUTIONFESS_PAYMENT: "/offline-payment/tution",
  GET_All_STUDENTS_PAYMENT: "offline-payment/all",
  GET_ALL_DEFAULTERS: "/student-fees/all",
  LIVE_CLASS_ROOM: "/live-class-room",
  LIVE_CLASS_BATCH: "/batch",
  GET_LIVE_CLASS_BATCH: "/batch/id",
  GET_LIVE_CLASS_BATCH_SUBJECT: "/batch-subject",
  UPLOAD_FILE: "/app/file",
  BATCH_SUBJECT_LECTURE: "batch-subject-lecture",
  GET_STAFF_REVIEW: "/review-batch-live-staff",
  INVENTORY_ITEM: "inventory-item",
  INVENTORY_GROUP: "inventory-group",
  UPLOAD_STUDENT_ROLLNO_EXCEL: "/student/package-student-roll-refresh-excel",
  GET_STUDENT_BATCH: "student-Offline-Batch/all",
  GET_PRINT_RECEIPT: "offline-payment/print-receipt",
  SINGLE_INVENTORY_GROUP: "inventory-group/id",
  ADD_RECEIVED_ITEM: "student-offline-batch-inventory/multiple",
  GET_RECEIVED_ITEM_LIST: "student-offline-batch-inventory/all",
  TEST_RESULT_EXCEL: "test-attempt/paper-excel",
};

let api = create({
  baseURL: BaseURL,
  headers: {
    Accept: "application/json",
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
  },
  timeout: 145000,
});

api.addMonitor(apiMonitor);
// setInterceptor(api);

export const setAuthorizationHeader = (access_token) =>
  api.setHeader("Authorization", "Bearer " + access_token);

export const removeAuthorizationHeader = (access_token) => {
  delete api.headers["Authorization"];
};

export { api as apiClient };

//for swr fetcher
export const getFetcher = (url, params, config) =>
  api
    .get(url, params, config)
    .then((response) => {
      return response.data;
    })
    .catch((er) => {
      throw er;
    });
