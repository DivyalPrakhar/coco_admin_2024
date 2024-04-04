import { apiClient, URIS } from ".";

const requestUserApi = (payload) => apiClient.get(URIS.ME, payload);
const addBatchApi = (payload) => apiClient.post(URIS.ADD_BATCH, payload);
const getBatchApi = (payload) => apiClient.get(URIS.GET_BATCH, payload);
const getBatchesApi = (payload) => apiClient.get(URIS.GET_BATCHES, payload);

const getInstituteApi = (payload) =>
	apiClient.get(URIS.GET_INSTITUTES, payload);
const addInstituteApi = (payload) =>
	apiClient.post(URIS.ADD_INSTITUTE, payload);
const editInstituteApi = (payload) => apiClient.patch(URIS.INSTITUTE, payload);
const deleteInstituteApi = (payload) =>
	apiClient.delete(URIS.INSTITUTE, payload);

const addInstituteStaffApi = (payload) =>
	apiClient.post(URIS.ADD_INSTITUTE_STAFF, payload);
const editInstituteStaffApi = (payload) => apiClient.patch(URIS.STAFF, payload);
const deleteInstituteStaffApi = (payload) =>
	apiClient.delete(URIS.STAFF, payload);

const requestStateApi = (payload) => apiClient.get(URIS.STATES, payload);
const addStudentApi = (payload) => apiClient.post(URIS.ADD_STUDENT, payload);
const getAlumniApi = (payload) => apiClient.get(URIS.GET_ALUMNI, payload);
const searchStudents = (payload) =>
	apiClient.get(URIS.SEARCH_STUDENTS, payload);
const addGroupApi = (payload) => apiClient.post(URIS.ADD_GROUP, payload);

const getSingleInstituteApi = (payload) =>
	apiClient.get(URIS.GET_SINGLE_INSTITUTE, payload);
const addEducationApi = (payload) =>
	apiClient.post(URIS.ADD_EDUCATION, payload);
const editEducationApi = (payload) =>
	apiClient.patch(URIS.ADD_EDUCATION, payload);
const assignGroupsApi = (payload) =>
	apiClient.post(URIS.ASSIGN_GROUPS, payload);
const updateStudentApi = (payload) =>
	apiClient.patch(URIS.UPDATE_STUDENT, payload);
const deleteGroupApi = (payload) => apiClient.delete(URIS.GROUP, payload);

const getLiveBatchApi = (payload) =>
	apiClient.get(URIS.GET_LIVE_BATCH, payload);
const updateBatchApi = (payload) => apiClient.patch(URIS.UPDATE_BATCH, payload);
const updateGroupApi = (payload) => apiClient.patch(URIS.GROUP, payload);
const removeGroupApi = (payload) => apiClient.post(URIS.REMOVE_GROUP, payload);
const addStudentExcelApi = (payload) =>
	apiClient.post(URIS.ADD_STUDENT_EXCEL, payload);
const updateMemberApi = (payload) =>
	apiClient.patch(URIS.UPDATE_MEMBER, payload);

const deleteAlumniEducationApi = (payload) =>
	apiClient.delete(URIS.ADD_EDUCATION, payload);

const addExperienceApi = (payload) =>
	apiClient.post(URIS.ALUMNI_EXPERIENCE, payload);
const editExperienceApi = (payload) =>
	apiClient.patch(URIS.ALUMNI_EXPERIENCE, payload);
const deleteAlumniExperienceApi = (payload) =>
	apiClient.delete(URIS.ALUMNI_EXPERIENCE, payload);

const addCourseApi = (payload) => apiClient.post(URIS.ADD_COURSE, payload);
const getCoursesApi = (payload) => apiClient.get(URIS.GET_COURSES, payload);
const updateCourseApi = (payload) => apiClient.patch(URIS.ADD_COURSE, payload);
const deleteCourseApi = (payload) =>
	apiClient.delete(URIS.DELETE_COURSE, payload);
const getDefaultDataApi = (payload) =>
	apiClient.get(URIS.GET_DEFAULT_DATA, payload);
const addLmsConfigApi = (payload) =>
	apiClient.post(URIS.ADD_LMS_CONFIG, payload);
const editLmsConfigApi = (payload) =>
	apiClient.patch(URIS.EDIT_LMS_CONFIG, payload);

const getInstituteDefaultApi = (payload) =>
	apiClient.get(URIS.INSTITUTE_DEFAULT, payload);
const addInstituteDefaultApi = (payload) =>
	apiClient.post(URIS.INSTITUTE_DEFAULT, payload);
const addQuestionApi = (payload) => apiClient.post(URIS.QUESTION, payload);
const addParagraphApi = (payload) =>
	apiClient.post(URIS.ADD_PARAGRAPH, payload);
const getParaListApi = (payload) => apiClient.get(URIS.LIST_PARAGRAPH, payload);

const uploadBasechaptersApi = (payload) =>
	apiClient.post(URIS.UPLOAD_BASECHAPTERS, payload);
const getBasechaptersApi = (payload) =>
	apiClient.get(URIS.GET_BASECHAPTERS, payload);
const addChapterTemplateApi = (payload) =>
	apiClient.post(URIS.ADD_CHAPTER_TEMPLATE, payload);

const getChapterTemplateApi = (payload) =>
	apiClient.get(URIS.GET_CHAPTER_TEMPLATE, payload);
const getSyllabusChaptersDataApi = (payload) =>
	apiClient.get(URIS.GET_SYLLABUS_CHAPTER_DATA, payload);
const getOldChapterTemplateExcelApi = (payload) =>
	apiClient.get(URIS.GET_OLD_CHAPTER_TEMPLATE_EXCEL, payload);

const addCourseSubjectApi = (payload) =>
	apiClient.post(URIS.ADD_COURSE_SUBJECT, payload);
const updateCourseSubjectApi = (payload) =>
	apiClient.patch(URIS.ADD_COURSE_SUBJECT, payload);

const getCoursesContentApi = (payload) =>
	apiClient.get(URIS.ADD_COURSE_SUBJECT, payload);
const getAllQuestionsApi = (payload) =>
	apiClient.get(URIS.GET_ALL_QUESTIONS, payload);
const updateParaApi = (payload) => apiClient.patch(URIS.ADD_PARAGRAPH, payload);
const getParaQsnsApi = (payload) =>
	apiClient.get(URIS.GET_PARA_QUESTIONS, payload);
const removeParaQueApi = (payload) =>
	apiClient.delete(URIS.REMOVE_PARA_QUESTION, payload);
const deleteQuestionApi = (payload) => apiClient.delete(URIS.QUESTION, payload);

const addCourseContentApi = (payload) =>
	apiClient.post(URIS.ADD_COURSE_CONTENT, payload);
const updateCourseContentApi = (payload) =>
	apiClient.patch(URIS.ADD_COURSE_CONTENT, payload);
const deleteCourseContentApi = (payload) =>
	apiClient.delete(URIS.ADD_COURSE_CONTENT, payload);
const updateQuestionApi = (payload) => apiClient.patch(URIS.QUESTION, payload);
const getALLCenterApi = (payload) =>
	apiClient.get(URIS.GET_ALL_CENTER, payload);
const addCenterApi = (payload) => apiClient.post(URIS.EXAM_CENTER, payload);
const addPackageApi = (payload) => apiClient.post(URIS.PACKAGE, payload);
const getPackagesApi = (payload) =>
	apiClient.get(URIS.GET_ALL_PACKAGES, payload);
const getSinglePackageApi = (payload) => apiClient.get(URIS.PACKAGE, payload);
const addProductApi = (payload) => apiClient.post(URIS.ADD_PRODUCT, payload);
const updateProductApi = (payload) =>
	apiClient.patch(URIS.UPDATE_PRODUCT, payload);
const getAllProductsApi = (payload) =>
	apiClient.get(URIS.GET_ALL_PRODUCTS, payload);
const updateCourseContentOrderApi = (payload) =>
	apiClient.patch(URIS.UPDATE_CONTENT_ORDER, payload);
const updatePackageApi = (payload) => apiClient.patch(URIS.PACKAGE, payload);
const assignStudCoursesApi = (payload) =>
	apiClient.patch(URIS.STUDENT_COURSES, payload);
const removeStudCoursesApi = (payload) =>
	apiClient.delete(URIS.STUDENT_COURSES, payload);

const addTestApi = (payload) => apiClient.post(URIS.TEST, payload);
const getSingleTestApi = (payload) => apiClient.get(URIS.TEST, payload);
const updateTestApi = (payload) => apiClient.patch(URIS.TEST, payload);
const getAllTestsApi = (payload) => apiClient.get(URIS.GET_ALL_TESTS, payload);

const createCouponsApi = (payload) =>
	apiClient.post(URIS.CREATE_COUPON, payload);

const getAllCouponsApi = (payload) =>
	apiClient.get(URIS.GET_ALL_COUPONS, payload);
const updateCouponsApi = (payload) =>
	apiClient.patch(URIS.UPDATE_COUPON, payload);
const deleteCouponsApi = (payload) =>
	apiClient.delete(URIS.UPDATE_COUPON, payload);

const getAllLeadsApi = (payload) => apiClient.get(URIS.GET_ALL_LEADS, payload);
const getLeadsApi = (payload) => apiClient.get(URIS.GET_LEADS, payload);

const studentFilterApi = (payload) =>
	apiClient.get(URIS.STUDENT_FILTER, payload);
const addTestSubjectsApi = (payload) =>
	apiClient.patch(URIS.ADD_TEST_SUBJECTS, payload);
const addTestSettingsApi = (payload) =>
	apiClient.patch(URIS.ADD_TEST_SETTINGS, payload);
const addNewTestQuestionApi = (payload) =>
	apiClient.post(URIS.ADD_NEW_TEST_QUESTION, payload);

const addQuestionsToTestApi = (payload) =>
	apiClient.post(URIS.ADD_QUESTION_TO_TEST, payload);
const removeTestQueApi = (payload) =>
	apiClient.delete(URIS.REMOVE_TEST_QUESTION, payload);
const changeTestQuesOrderApi = (payload) =>
	apiClient.patch(URIS.CHANGE_TEST_QUESTIONS_ORDER, payload);
const removeTestApi = (payload) => apiClient.delete(URIS.REMOVE_TEST, payload);

const getAllInstructionApi = (payload) =>
	apiClient.get(URIS.GET_ALL_INSTRUCTION, payload);
const addInstructionApi = (payload) =>
	apiClient.post(URIS.GET_ALL_INSTRUCTION, payload);
const editInstructionApi = (payload) =>
	apiClient.patch(URIS.GET_ALL_INSTRUCTION, payload);
const deleteInstructionApi = (payload) =>
	apiClient.delete(URIS.GET_ALL_INSTRUCTION, payload);
const addTagApi = (payload) => apiClient.post(URIS.TAG, payload);
const getTagsApi = (payload) => apiClient.get(URIS.TAG, payload);
const updateTagApi = (payload) => apiClient.patch(URIS.TAG, payload);
const downloadAnswerKeysApi = (payload) =>
	apiClient.get(URIS.ANSWER_KEYS, payload);
const uploadAnswerKeysApi = (payload) =>
	apiClient.post(URIS.ANSWER_KEYS, payload);

const updateTestQuestionDataApi = (payload) =>
	apiClient.patch(URIS.UPDATE_TEST_QUESTION_DATA, payload);

const updatePackageNewApi = (payload) =>
	apiClient.patch(URIS.UPDATE_PACKAGE_NEW_API, payload);

const schedulePackageTestApi = (payload) =>
	apiClient.patch(URIS.SCHEDULE_PACKAGE_TEST, payload);
const createPackageOfferApi = (payload) =>
	apiClient.post(URIS.CREATE_PACKAGE_OFFER, payload);
const updatePackageOfferApi = (payload) =>
	apiClient.patch(URIS.CREATE_PACKAGE_OFFER, payload);
const assignTestSyllabusApi = (payload) =>
	apiClient.post(URIS.ASSIGN_TEST_SYLLABUS, payload);
const addAssignmentApi = (payload) => apiClient.post(URIS.ASSIGNMENT, payload);
const getAssignmentsApi = (payload) => apiClient.get(URIS.ASSIGNMENT, payload);
const updateAssignmentApi = (payload) =>
	apiClient.patch(URIS.ASSIGNMENT, payload);
const addAssignmentToPkgApi = (payload) =>
	apiClient.post(URIS.PACKAGE_ASSIGNMENT, payload);
const removePkgAssingmentApi = (payload) =>
	apiClient.delete(URIS.PACKAGE_ASSIGNMENT, payload);
const updatePkgAssignmentApi = (payload) =>
	apiClient.patch(URIS.PACKAGE_ASSIGNMENT, payload);
const addAnswerSheetApi = (payload) =>
	apiClient.post(URIS.ANSWER_SHEET, payload);
const getAnswerSheetsApi = (payload) =>
	apiClient.get(URIS.ANSWER_SHEET, payload);
const getFilteredAssignmentsApi = (payload) =>
	apiClient.get(URIS.ASSIGNMENT, payload);
const assignTestQaqcApi = (payload) =>
	apiClient.post(URIS.ASSIGN_TEST_QAQC, payload);
const getAssignedQaqcUsersApi = (payload) =>
	apiClient.get(URIS.ASSIGN_TEST_QAQC, payload);
const getUserQaqcTestsApi = (payload) =>
	apiClient.get(URIS.USER_QAQC_TESTS, payload);
const deletePackageApi = (payload) => apiClient.delete(URIS.PACKAGE, payload);
const verifyQuestionApi = (payload) =>
	apiClient.post(URIS.VERIFY_QUESTION, payload);
const unverifyQueApi = (payload) =>
	apiClient.post(URIS.UNVERIFY_QUESTION, payload);
const addOffersApi = (payload) =>
	apiClient.post(URIS.ADD_WEBSITE_DATA, payload);
const addWebsiteDataApi = (payload) =>
	apiClient.patch(URIS.ADD_WEBSITE_DATA, payload);
const getWebsiteDataApi = (payload) =>
	apiClient.get(URIS.ADD_WEBSITE_DATA, payload);

const getPromoCodeApi = (payload) =>
	apiClient.get(URIS.GET_PROMO_CODE_DATA, payload);
const addPromoCodeApi = (payload) =>
	apiClient.post(URIS.GET_PROMO_CODE_DATA, payload);
const updatePromoCodeApi = (payload) =>
	apiClient.patch(URIS.GET_PROMO_CODE_DATA, payload);
const deletePromoCodeApi = (payload) =>
	apiClient.delete(URIS.GET_PROMO_CODE_DATA, payload);

const getTestAttemptDataApi = (payload) =>
	apiClient.get(URIS.GET_TEST_ATTEMPT_DATA, payload);
const copyTestApi = (payload) => apiClient.post(URIS.COPY_TEST, payload);

const getDiscussionTopicApi = (payload) =>
	apiClient.get(URIS.GET_DISCUSSION_TOPIC, payload);
const addDiscussionTopicApi = (payload) =>
	apiClient.post(URIS.ADD_DISCUSSION_TOPIC, payload);
const getSingleDiscussionTopicApi = (payload) =>
	apiClient.get(URIS.ADD_DISCUSSION_TOPIC, payload);

const updateDiscussionTopicApi = (payload) =>
	apiClient.patch(URIS.ADD_DISCUSSION_TOPIC, payload);
const approveTopicQuestionApi = (payload) =>
	apiClient.patch(URIS.APPROVE_TOPIC_QUESTION, payload);
const addContentImageApi = (payload) =>
	apiClient.patch(URIS.ADD_CONTENT_IMAGE, payload);
const addAddressApi = (payload) => apiClient.post(URIS.ADD_ADDRESS, payload);
const updateAddressApi = (payload) =>
	apiClient.patch(URIS.ADD_ADDRESS, payload);

const deleteProductApi = (payload) =>
	apiClient.delete(URIS.ADD_PRODUCT, payload);
const searchStaffApi = (payload) =>
	apiClient.get(URIS.SEARCH_STAFF_DATA, payload);
const wordQuestionUploadApi = (payload) =>
	apiClient.post(URIS.WORD_QUESTION_UPLOAD, payload, {
		timeout: 1000 * 60 * 10,
	});
const removeDocQuestionApi = (payload) =>
	apiClient.post(URIS.DELETE_DOCUMENT_QUESTION, payload);
const addReviewedQuestionsApi = (payload) =>
	apiClient.post(URIS.ADD_WORD_QUESTION_TO_TEST, payload);
const assignStudPkgApi = (payload) => {
	console.log(payload, "payload from patch");
	return apiClient.patch(URIS.ASSIGN_STUDENT_PKG, payload);
};
const bulkQuestionsToBankApi = (payload) =>
	apiClient.post(URIS.BULK_QUESTIONS_TO_BANK, payload);
const addSubjectExcelApi = (payload) =>
	apiClient.post(URIS.UPLOAD_SUBJECT_EXCEL, payload);
const updateSubjectApi = (payload) =>
	apiClient.post(URIS.UPLOAD_SUBJECT_EXCEL, payload);
const getDemoAttemptApi = (payload) =>
	apiClient.get(URIS.GET_DEMO_ATTEMPT, payload);
const deleteTestAttemptApi = (payload) =>
	apiClient.delete(URIS.DELETE_TEST_ATTEMPT, payload);
const deleteCourseSubjApi = (payload) =>
	apiClient.delete(URIS.DELETE_COURSE_SUBJECT, payload);

const getAllNoticeApi = (payload) =>
	apiClient.get(URIS.GET_ALL_NOTICE, payload);
const addNoticeApi = (payload) => apiClient.post(URIS.ADD_NOTICE, payload);
const updateNoticeApi = (payload) => apiClient.patch(URIS.ADD_NOTICE, payload);
const deleteNoticeApi = (payload) => apiClient.delete(URIS.ADD_NOTICE, payload);

const getAllEventApi = (payload) => apiClient.get(URIS.GET_ALL_EVENT, payload);
const getEventApi = (payload) => apiClient.get(URIS.ADD_EVENT, payload);
const addEventApi = (payload) => apiClient.post(URIS.ADD_EVENT, payload);
const updateEventApi = (payload) => apiClient.patch(URIS.ADD_EVENT, payload);
const deleteEventApi = (payload) => apiClient.delete(URIS.ADD_EVENT, payload);
const getAllEventUserApi = (payload) =>
	apiClient.get(URIS.GET_ALL_EVENT_USER, payload);
const updateUserEventApi = (payload) =>
	apiClient.patch(URIS.UPDATE_USER_EVENT, payload);
const uploadQuePaperApi = (payload) =>
	apiClient.patch(URIS.UPLOAD_QUE_PAPER, payload);
const changeAttmptStatusApi = (payload) =>
	apiClient.patch(URIS.CHANGE_ATTEMPT_STATUS, payload);
const resultCalculateApi = (payload) =>
	apiClient.post(URIS.RESULT_CALCULATE, payload);
const sendNotificaitonApi = (payload) =>
	apiClient.post(URIS.NOTIFICATION, payload);
const getNotificationApi = (payload) =>
	apiClient.get(URIS.GET_NOTIFICATIONS, payload);
const getCommentsApi = (payload) => apiClient.get(URIS.GET_COMMENTS, payload);
const deleteTopicApi = (payload) =>
	apiClient.delete(URIS.ADD_DISCUSSION_TOPIC, payload);
const deleteCommentApi = (payload) =>
	apiClient.delete(URIS.DELETE_COMMENT, payload);
const getRepliesApi = (payload) =>
	apiClient.get(URIS.GET_COMMENT_REPLIES, payload);
const getPkgStudentsApi = (payload) =>
	apiClient.get(URIS.GET_PACKAGE_STUDENTS, payload);
const getSubStudentsApi = (payload) =>
	apiClient.get(URIS.GET_SUBSCRIPTION_STUDENTS, payload);
const getTrialStudentsApi = (payload) =>
	apiClient.get(URIS.GET_TRIAL_STUDENTS, payload);
const deleteMultQuestionsApi = (payload) =>
	apiClient.delete(URIS.DELETE_MULTIPLE_QUESTIONS, payload);
const getOrderHistoryApi = (payload) =>
	apiClient.get(URIS.GET_ORDER_HISTORY, payload);
const recheckOrderApi = (payload) => apiClient.get(URIS.RECHECK_ORDER, payload);
const getFeedbackApi = (payload) => apiClient.get(URIS.GET_FEEDBACKS, payload);
const getOfflineOrdersApi = (payload) =>
	apiClient.get(URIS.GET_OFFLINE_ORDERS, payload);
const updateOrderStatusApi = (payload) =>
	apiClient.post(URIS.UPDATE_ORDER_DELIVERY_STATUS, payload);
const getWalletHistoryApi = (payload) =>
	apiClient.get(URIS.GET_WALLET_HISTORY, payload);
const getWalletOffersApi = (payload) =>
	apiClient.get(URIS.GET_WALLET_OFFERS, payload);
const addWalletOfferApi = (payload) =>
	apiClient.post(URIS.GET_WALLET_OFFERS, payload);
const updateWalletOfferApi = (payload) =>
	apiClient.patch(URIS.GET_WALLET_OFFERS, payload);
const deleteOfferApi = (payload) =>
	apiClient.delete(URIS.GET_WALLET_OFFERS, payload);
const getAllTicketsApi = (payload) => apiClient.get(URIS.ALL_TICKETS, payload);
const getSingleTicketApi = (payload) => apiClient.get(URIS.TICKETS, payload);
const addTicketCommentApi = (payload) => apiClient.post(URIS.COMMENT, payload);
const updateTicketApi = (payload) => apiClient.patch(URIS.TICKETS, payload);
const getAllStudentsApi = (payload) =>
	apiClient.get(URIS.GET_ALL_STUDENTS, payload);
const addCommentsApi = (payload) =>
	apiClient.post(URIS.GET_ALL_STUDENTS, payload);
const addLikeApi = (payload) => apiClient.patch(URIS.ADD_LIKE, payload);
const updateSubjectsOrderApi = (payload) =>
	apiClient.patch(URIS.UPDATE_SUBJECTS_ORDER, payload);
const getDashboardApi = (payload) => apiClient.get(URIS.GET_DASHBOARD, payload);
const readyTestApi = (payload) => apiClient.post(URIS.READY_TEST, payload);
const getDoubtApi = (payload) => apiClient.get(URIS.GET_DOUBTS, payload);
const getAllTeachersApi = (payload) =>
	apiClient.get(URIS.GET_ALL_TEACHER, payload);
const getSingleDoubtApi = (payload) =>
	apiClient.get(URIS.GET_SINGLE_DOUBT, payload);
const postDoubtCommentApi = (payload) =>
	apiClient.post(URIS.POST_COMMENT, payload);
const updateDoubtDetailApi = (payload) =>
	apiClient.patch(URIS.GET_SINGLE_DOUBT, payload);
const deleteStudPkgApi = (payload) =>
	apiClient.delete(URIS.DELETE_STUDENT_PACKAGE, payload);
const getAssignmentApi = (payload) =>
	apiClient.get(URIS.GET_SINGLE_ASSIGNMENT, payload);
const getAssignmentSubmissionsApi = (payload) =>
	apiClient.get(URIS.GET_ASSIGNMENT_SUBMISSIONS, payload);
const uploadCheckedFileApi = (payload) =>
	apiClient.patch(URIS.ASSINGMENT_SUBMIT, payload);
const addAssignmentResultApi = (payload) =>
	apiClient.patch(URIS.ASSINGMENT_SUBMIT, payload);
const getTypePackagsApi = (payload) =>
	apiClient.get(URIS.GET_TYPE_PACKAGES, payload);
const downloadSubmissionsApi = (payload) =>
	apiClient.get(URIS.GET_ALL_SUBMISSIONS, payload);
const notifyAdmitCardApi = (payload) =>
	apiClient.get(URIS.NOTIFY_ADMIN_CARD, payload);
const notifyAdmitCardAnyApi = (payload) =>
	apiClient.get(URIS.NOTIFY_ADMIN_CARD_ANY, payload);
const getPackageRollsApi = (payload) =>
	apiClient.get(URIS.GET_PACKAGE_ROLLS, payload);
const refreshPackageRollnos = (payload) =>
	apiClient.get(URIS.GENERATE_ROLL_PACAKGE, payload);
const updateStudentPackageDetails = (payload) =>
	apiClient.patch(URIS.UPDATE_PACKAGE_STUDENT_MODE, payload);
const assignmentResultCalApi = (payload) =>
	apiClient.get(URIS.ASSIGNMENT_RESULT_CALCULATE, payload);
const getStudentAddressApi = (payload) =>
	apiClient.get(URIS.GET_STUDENT_ADDRESS, payload);
const updatePassApi = (payload) => apiClient.patch(URIS.RESET_PASS, payload);
const getUserLeadsApi = (payload) => apiClient.get(URIS.USER_LEADS, payload);
const assignmentZipApi = (payload) =>
	apiClient.patch(URIS.UPLOAD_ASSIGNMENT_ZIP, payload);
const assingmentMarksApi = (payload) =>
	apiClient.patch(URIS.UPLOAD_ASSIGNMENT_MARKS, payload);
const addPkgDemoApi = (payload) =>
	apiClient.post(URIS.ADD_PACKAGE_DEMO_CONTENT, payload);
const deleteContentApi = (payload) =>
	apiClient.delete(URIS.ADD_PACKAGE_DEMO_CONTENT, payload);
const updatePkgDemoApi = (payload) =>
	apiClient.patch(URIS.ADD_PACKAGE_DEMO_CONTENT, payload);
const updatePkgDemoOrderApi = (payload) =>
	apiClient.patch(URIS.UPDATE_PACKAGE_DEMO_CONTENT_ORDER, payload);
const assignCourseTeacherApi = (payload) =>
	apiClient.post(URIS.ASSIGN_COURSE_TEACHER, payload);
const getCourseTeacherApi = (payload) =>
	apiClient.get(URIS.GET_COURSE_TEACHERS, payload);
const removeCourseTeacherApi = (payload) =>
	apiClient.delete(URIS.GET_COURSE_TEACHERS, payload);
const updateOrderApi = (payload) => apiClient.patch(URIS.UPDATE_ORDER, payload);
const addExamContentApi = (payload) =>
	apiClient.post(URIS.ADD_EXAM_CONTENT, payload);
const getExamContentApi = (payload) =>
	apiClient.get(URIS.GET_EXAM_CONTENT, payload);
const deleteExamContentApi = (payload) =>
	apiClient.delete(URIS.ADD_EXAM_CONTENT, payload);
const updateExamContentApi = (payload) =>
	apiClient.patch(URIS.ADD_EXAM_CONTENT, payload);
const getCategoriesApi = (payload) =>
	apiClient.get(URIS.GET_CATEGORIES, payload);

const postCategory = (payload) => apiClient.post(URIS.POST_CATEGORY, payload);
const getCategory = (payload) => apiClient.get(URIS.GET_CATEGORIES, payload);
const updateCategoryApi = (payload) =>
	apiClient.patch(URIS.POST_CATEGORY, payload);
const getXIIExamResult = (payload) =>
	apiClient.get(URIS.GET_XII_EXAM_RESULT, payload);
const getSchoolByDistrict = (payload) =>
	apiClient.get(URIS.GET_SCHOOL_BY_DISTRICT, payload);
const getXSchoolByDistrict = (payload) =>
	apiClient.get(URIS.GET_X_SCHOOL_BY_DISTRICT, payload);
const getExamAllDistrict = (payload) =>
	apiClient.get(URIS.GET_EXAM_DISTRICTS, payload);
const getXExamAllDistrict = (payload) =>
	apiClient.get(URIS.GET_X_EXAM_DISTRICTS, payload);
const getXExamCompareData = (payload) =>
	apiClient.get(URIS.GET_X_EXAM_COMPARE, payload);
const getXExamResult = (payload) =>
	apiClient.get(URIS.GET_X_EXAM_RESULT, payload);
const postOfflineTestExcel = (payload) =>
	apiClient.post(URIS.POST_OFFLINE_TEST_RESULT, payload);
const getOfflineTestResult = (payload) =>
	apiClient.get(URIS.POST_OFFLINE_TEST_RESULT, payload);

const postSurveyFeedback = (payload) =>
	apiClient.post(URIS.POST_FEEDBACK_SURVEY, payload);
const getSurveyFeedback = (payload) =>
	apiClient.get(URIS.GET_FEEDBACK_SURVEY, payload);
const patchSurveyFeedbacklist = (payload) =>
	apiClient.patch(URIS.PATCH_FEEDBACK_SURVEY_LIST, payload);
const deleteSurveyFeedbacklist = (payload) =>
	apiClient.delete(URIS.DELETE_FEEDBACK_SURVEY_LIST, payload);
const postSurveyTopic = (payload) =>
	apiClient.post(URIS.POST_SURVEY_TOPIC, payload);
const getSurveyTopic = (payload) =>
	apiClient.get(URIS.GET_SURVEY_TOPIC, payload);
const patchSurveyTopic = (payload) =>
	apiClient.patch(URIS.PATCH_SURVEY_TOPIC, payload);
const deleteSurveyTopic = (payload) =>
	apiClient.delete(URIS.DELETE_SURVEY_TOPIC, payload);
const getSurveyTopicAnswers = (payload) =>
	apiClient.get(URIS.GET_SURVEY_TOPIC_ANSWER, payload);
const getSingleSurvey = (payload) =>
	apiClient.get(URIS.GET_SINGLE_SURVEY, payload);
const uploadStudentBulkValidate = (payload) =>
	apiClient.post(URIS.UPLOAD_STUDENT_BULK_VALIDATE, payload);
const uploadStudentBulkAssign = (payload) =>
	apiClient.post(URIS.UPLOAD_STUDENT_BULK_ASSIGN, payload);
const uploadStudentBulkUpdate = (payload) =>
	apiClient.post(URIS.UPLOAD_STUDENT_BULK_UPDATE, payload);
const getStudentBulkPending = (payload) =>
	apiClient.get(URIS.GET_STUDENT_BULK_PENDING, payload);
const deleteStudentBulkUpload = (payload) =>
	apiClient.delete(URIS.DELETE_STUDENT_BULK_UPLOAD, payload);
const removePkgSubscriptionApi = (payload) =>
	apiClient.patch(URIS.REMOVE_PACKAGE_SUBSCRIPTION, payload);
const getDiscountConfigsApi = (payload) =>
	apiClient.get(URIS.GET_DISCOUNT_CONFIGS, payload);
const addDiscountOfferApi = (payload) =>
	apiClient.post(URIS.ADD_DISCOUNT_OFFFER, payload);
const updateDiscountOfferApi = (payload) =>
	apiClient.patch(URIS.ADD_DISCOUNT_OFFFER, payload);
const studentLoginApi = (payload) =>
	apiClient.post(URIS.STUDENT_LOGIN, payload);
const upadatPackageStudentCenterApi = (payload) =>
	apiClient.post(URIS.UPDATE_PACKGE_ROLL_CENTER, payload);

const addPromoCouponApi = (payload) =>
	apiClient.post(URIS.ADD_PROMO_COUPON, payload);
const getAllPromoCouponApi = (payload) =>
	apiClient.get(URIS.GET_ALL_PROMO_COUPON, payload);
const updatePromoCouponApi = (payload) =>
	apiClient.patch(URIS.PROMO_COUPON, payload);
const deletePromoCouponApi = (payload) =>
	apiClient.delete(URIS.PROMO_COUPON, payload);

const getFranchiseEnquiryApi = (payload) =>
	apiClient.get(URIS.GET_FRANCHISE_ENQUIRY, payload);
const updateFranchiseEnquiryApi = (payload) =>
	apiClient.patch(URIS.UPDATE_FRANCHISE_ENQUIRY, payload);
const getCareerJobApplicationApi = (payload) =>
	apiClient.get(URIS.GET_CAREER_JOBAPPLICATION, payload);
const updateCareerJobApplicationApi = (payload) =>
	apiClient.patch(URIS.UPDATE_CAREER_JOBAPPLICATION, payload);
const uploadStudentTimingApi = (payload) =>
	apiClient.post(URIS.GENERATE_ROLL_PACAKGE, payload);

const addOfflineCourseApi = (payload) =>
	apiClient.post(URIS.OFFLINE_COURSE, payload);
const getOfflineCourseApi = (payload) =>
	apiClient.get(URIS.GET_OFFLINE_COURSE, payload);
const updateOfflineCourseApi = (payload) =>
	apiClient.patch(URIS.OFFLINE_COURSE, payload);
const addEnquiryApi = (payload) =>
	apiClient.post(URIS.ADD_USER_ENQUIRY, payload);
const getEnquiryApi = (payload) =>
	apiClient.get(URIS.GET_USER_ENQUIRY, payload);
const updateEnquiryApi = (payload) =>
	apiClient.patch(URIS.ADD_USER_ENQUIRY, payload);
const addOfflinePaymentApi = (payload) =>
	apiClient.post(URIS.ADD_OFFLINE_PAYMENT, payload);
const assignBatchApi = (payload) => apiClient.patch(URIS.ASSIGN_BATCH, payload);
const getAssignedBatchApi = (payload) =>
	apiClient.get(URIS.GET_STUDENT_BATCH, payload);
const addStudentInstallmentApi = (payload) =>
	apiClient.post(URIS.ADD_STUDENT_INSTALLMENT, payload);
const getStudentInstallmentApi = (payload) =>
	apiClient.get(URIS.GET_STUDENT_INSTALLMENT, payload);
const collectTutionFeesPaymentApi = (payload) =>
	apiClient.post(URIS.COLLECT_TUTIONFESS_PAYMENT, payload);
const getAllStudentsPaymentApi = (payload) =>
	apiClient.get(URIS.GET_All_STUDENTS_PAYMENT, payload);
const getAllDefaultersApi = (payload) =>
	apiClient.get(URIS.GET_ALL_DEFAULTERS, payload);
const getPrintReceiptApi = (payload) =>
	apiClient.get(URIS.GET_PRINT_RECEIPT, payload);
const addLiveClassRoomApi = (payload) =>
	apiClient.post(URIS.LIVE_CLASS_ROOM, payload);
const getLiveClassRoomApi = (payload) =>
	apiClient.get(URIS.LIVE_CLASS_ROOM, payload);
const addLiveClassBatchApi = (payload) =>
	apiClient.post(URIS.LIVE_CLASS_BATCH, payload);
const getAllLiveClassBatchApi = (payload) =>
	apiClient.get(URIS.LIVE_CLASS_BATCH, payload);
const updateLiveClassBatchApi = (payload) =>
	apiClient.patch(URIS.LIVE_CLASS_BATCH, payload);
const deleteLiveClassBatchApi = (payload) =>
	apiClient.delete(URIS.LIVE_CLASS_BATCH, payload);
const getLiveClassBatchApi = (payload) =>
	apiClient.get(URIS.GET_LIVE_CLASS_BATCH, payload);
const getLiveClassBatchSubjectApi = (payload) =>
	apiClient.get(URIS.GET_LIVE_CLASS_BATCH_SUBJECT, payload);
const updateLiveClassBatchSubjectApi = (payload) =>
	apiClient.patch(URIS.GET_LIVE_CLASS_BATCH_SUBJECT, payload);
const uploadFileApi = (payload) => apiClient.post(URIS.UPLOAD_FILE, payload);
const addBatchSubjectLectureApi = (payload) =>
	apiClient.post(URIS.BATCH_SUBJECT_LECTURE, payload);
const getBatchSubjectLectureApi = (payload) =>
	apiClient.get(URIS.BATCH_SUBJECT_LECTURE, payload);
const updateBatchSubjectLectureApi = (payload) =>
	apiClient.patch(URIS.BATCH_SUBJECT_LECTURE, payload);
const deleteBatchSubjectLectureApi = (payload) =>
	apiClient.delete(URIS.BATCH_SUBJECT_LECTURE, payload);
const getStaffReviewsApi = (payload) =>
	apiClient.get(URIS.GET_STAFF_REVIEW, payload);
const updateStaffReviewApi = (payload) =>
	apiClient.patch(URIS.GET_STAFF_REVIEW, payload);
const addInventoryItemApi = (payload) =>
	apiClient.post(URIS.INVENTORY_ITEM, payload);
const getInventoryItemApi = (payload) =>
	apiClient.get(URIS.INVENTORY_ITEM, payload);
const updateInventoryItemApi = (payload) =>
	apiClient.patch(URIS.INVENTORY_ITEM, payload);
const addInventoryGroupApi = (payload) =>
	apiClient.post(URIS.INVENTORY_GROUP, payload);
const getInventorygroupApi = (payload) =>
	apiClient.get(URIS.INVENTORY_GROUP, payload);
const getSingleInventoryGroupApi = (payload) =>
	apiClient.get(URIS.SINGLE_INVENTORY_GROUP, payload);
const updateInventorygroupApi = (payload) =>
	apiClient.patch(URIS.INVENTORY_GROUP, payload);
const addDeliveredItemApi = (payload) =>
	apiClient.post(URIS.ADD_RECEIVED_ITEM, payload);
const getDeliveredItemApi = (payload) =>
	apiClient.get(URIS.GET_RECEIVED_ITEM_LIST, payload);
const uploadStudentRollNoApi = (payload) =>
	apiClient.post(URIS.UPLOAD_STUDENT_ROLLNO_EXCEL, payload);

export const apis = {
	uploadStudentRollNoApi,
	uploadStudentTimingApi,
	studentLoginApi,
	updateDiscountOfferApi,
	addDiscountOfferApi,
	getDiscountConfigsApi,
	updateCategoryApi,
	getCategoriesApi,
	updateExamContentApi,
	deleteExamContentApi,
	getExamContentApi,
	addExamContentApi,
	updateOrderApi,
	removeCourseTeacherApi,
	getCourseTeacherApi,
	assignCourseTeacherApi,
	updatePkgDemoOrderApi,
	updatePkgDemoApi,
	deleteContentApi,
	addPkgDemoApi,
	assingmentMarksApi,
	assignmentZipApi,
	getUserLeadsApi,
	getLeadsApi,
	updatePassApi,
	getStudentAddressApi,
	assignmentResultCalApi,
	getPackageRollsApi,
	notifyAdmitCardApi,
	notifyAdmitCardAnyApi,
	downloadSubmissionsApi,
	getTypePackagsApi,
	addAssignmentResultApi,
	uploadCheckedFileApi,
	getAssignmentSubmissionsApi,
	getAssignmentApi,
	deleteStudPkgApi,
	updateDoubtDetailApi,
	postDoubtCommentApi,
	getSingleDoubtApi,
	getAllTeachersApi,
	getDoubtApi,
	readyTestApi,
	getDashboardApi,
	updateSubjectsOrderApi,
	addLikeApi,
	addCommentsApi,
	addOffersApi,
	getAllStudentsApi,
	updateTicketApi,
	addTicketCommentApi,
	getAllTicketsApi,
	getSingleTicketApi,
	deleteOfferApi,
	updateWalletOfferApi,
	addWalletOfferApi,
	getWalletOffersApi,
	getWalletHistoryApi,
	updateOrderStatusApi,
	getOfflineOrdersApi,
	getFeedbackApi,
	recheckOrderApi,
	getOrderHistoryApi,
	deleteMultQuestionsApi,
	getPkgStudentsApi,
	getSubStudentsApi,
	getTrialStudentsApi,
	getRepliesApi,
	deleteCommentApi,
	deleteTopicApi,
	getCommentsApi,
	getNotificationApi,
	sendNotificaitonApi,
	resultCalculateApi,
	changeAttmptStatusApi,
	uploadQuePaperApi,
	addEventApi,
	deleteEventApi,
	updateEventApi,
	getAllEventApi,
	getEventApi,
	getAllEventUserApi,
	updateUserEventApi,
	addNoticeApi,
	deleteNoticeApi,
	updateNoticeApi,
	getAllNoticeApi,
	updateAddressApi,
	addAddressApi,
	requestUserApi,
	addInstituteApi,
	requestStateApi,
	addBatchApi,
	getBatchApi,
	getBatchesApi,
	getInstituteApi,
	addInstituteStaffApi,
	getSingleInstituteApi,
	addStudentApi,
	getAlumniApi,
	searchStudents,
	addGroupApi,
	addEducationApi,
	editEducationApi,
	assignGroupsApi,
	editInstituteApi,
	deleteInstituteApi,
	editInstituteStaffApi,
	deleteInstituteStaffApi,
	updateStudentApi,
	deleteGroupApi,
	updateBatchApi,
	getLiveBatchApi,
	updateGroupApi,
	removeGroupApi,
	addStudentExcelApi,
	updateMemberApi,
	deleteAlumniEducationApi,
	addExperienceApi,
	editExperienceApi,
	deleteAlumniExperienceApi,
	addCourseApi,
	getCoursesApi,
	updateCourseApi,
	deleteCourseApi,
	addLmsConfigApi,
	editLmsConfigApi,
	getDefaultDataApi,
	getInstituteDefaultApi,
	addInstituteDefaultApi,
	addQuestionApi,
	addParagraphApi,
	getParaListApi,
	uploadBasechaptersApi,
	getBasechaptersApi,
	addChapterTemplateApi,
	getChapterTemplateApi,
	getSyllabusChaptersDataApi,
	getOldChapterTemplateExcelApi,
	addCourseSubjectApi,
	updateCourseSubjectApi,
	getCoursesContentApi,
	getAllQuestionsApi,
	updateParaApi,
	getParaQsnsApi,
	removeParaQueApi,
	deleteQuestionApi,
	addCourseContentApi,
	updateCourseContentApi,
	deleteCourseContentApi,
	updateQuestionApi,
	getALLCenterApi,
	addCenterApi,
	addPackageApi,
	getPackagesApi,
	getSinglePackageApi,
	addProductApi,
	updateProductApi,
	getAllProductsApi,
	updateCourseContentOrderApi,
	updatePackageApi,
	assignStudCoursesApi,
	removeStudCoursesApi,
	createCouponsApi,
	getAllCouponsApi,
	updateCouponsApi,
	getAllLeadsApi,
	addTestApi,
	getSingleTestApi,
	updateTestApi,
	getAllTestsApi,
	studentFilterApi,
	addTestSubjectsApi,
	addTestSettingsApi,
	addNewTestQuestionApi,
	addQuestionsToTestApi,
	removeTestQueApi,
	changeTestQuesOrderApi,
	removeTestApi,
	getAllInstructionApi,
	addInstructionApi,
	editInstructionApi,
	deleteInstructionApi,
	addTagApi,
	getTagsApi,
	updateTagApi,
	downloadAnswerKeysApi,
	uploadAnswerKeysApi,
	updateTestQuestionDataApi,
	updatePackageNewApi,
	schedulePackageTestApi,
	createPackageOfferApi,
	updatePackageOfferApi,
	assignTestSyllabusApi,
	addAssignmentApi,
	getAssignmentsApi,
	updateAssignmentApi,
	addAssignmentToPkgApi,
	removePkgAssingmentApi,
	updatePkgAssignmentApi,
	addAnswerSheetApi,
	getAnswerSheetsApi,
	getFilteredAssignmentsApi,
	assignTestQaqcApi,
	getAssignedQaqcUsersApi,
	getUserQaqcTestsApi,
	deletePackageApi,
	verifyQuestionApi,
	unverifyQueApi,
	addWebsiteDataApi,
	getWebsiteDataApi,
	getPromoCodeApi,
	addPromoCodeApi,
	updatePromoCodeApi,
	deletePromoCodeApi,
	getTestAttemptDataApi,
	copyTestApi,
	getDiscussionTopicApi,
	addDiscussionTopicApi,
	getSingleDiscussionTopicApi,
	updateDiscussionTopicApi,
	approveTopicQuestionApi,
	deleteCouponsApi,
	addContentImageApi,
	deleteProductApi,
	searchStaffApi,
	wordQuestionUploadApi,
	removeDocQuestionApi,
	addReviewedQuestionsApi,
	assignStudPkgApi,
	bulkQuestionsToBankApi,
	addSubjectExcelApi,
	updateSubjectApi,
	getDemoAttemptApi,
	deleteTestAttemptApi,
	deleteCourseSubjApi,
	refreshPackageRollnos,
	updateStudentPackageDetails,

	postCategory,
	getCategory,
	getXIIExamResult,
	getSchoolByDistrict,
	getXSchoolByDistrict,
	getExamAllDistrict,

	getXExamCompareData,
	getXExamResult,

	addPromoCouponApi,
	getAllPromoCouponApi,
	updatePromoCouponApi,
	deletePromoCouponApi,

	getFranchiseEnquiryApi,
	getCareerJobApplicationApi,
	updateFranchiseEnquiryApi,
	updateCareerJobApplicationApi,

	postOfflineTestExcel,
	getOfflineTestResult,
	getXExamAllDistrict,
	getSurveyFeedback,
	postSurveyFeedback,
	postSurveyTopic,
	getSurveyTopic,
	patchSurveyTopic,
	deleteSurveyTopic,
	patchSurveyFeedbacklist,
	deleteSurveyFeedbacklist,
	getSurveyTopicAnswers,
	getSingleSurvey,
	uploadStudentBulkValidate,
	uploadStudentBulkUpdate,
	uploadStudentBulkAssign,
	getStudentBulkPending,
	deleteStudentBulkUpload,
	upadatPackageStudentCenterApi,

	addOfflineCourseApi,
	getOfflineCourseApi,
	updateOfflineCourseApi,
	addEnquiryApi,
	getEnquiryApi,
	updateEnquiryApi,
	addOfflinePaymentApi,
	assignBatchApi,
	getAssignedBatchApi,
	addStudentInstallmentApi,
	getStudentInstallmentApi,
	collectTutionFeesPaymentApi,
	getAllStudentsPaymentApi,
	getAllDefaultersApi,
	getPrintReceiptApi,
	removePkgSubscriptionApi,

	addLiveClassRoomApi,
	getLiveClassRoomApi,
	addLiveClassBatchApi,
	getAllLiveClassBatchApi,
	updateLiveClassBatchApi,
	deleteLiveClassBatchApi,
	getLiveClassBatchApi,
	getLiveClassBatchSubjectApi,
	updateLiveClassBatchSubjectApi,
	uploadFileApi,
	addBatchSubjectLectureApi,
	getBatchSubjectLectureApi,
	updateBatchSubjectLectureApi,
	deleteBatchSubjectLectureApi,
	getStaffReviewsApi,
	updateStaffReviewApi,
	addInventoryItemApi,
	getInventoryItemApi,
	updateInventoryItemApi,
	addInventoryGroupApi,
	getInventorygroupApi,
	getSingleInventoryGroupApi,
	updateInventorygroupApi,
	addDeliveredItemApi,
	getDeliveredItemApi,
};
