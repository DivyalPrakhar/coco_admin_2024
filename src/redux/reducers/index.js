import { combineReducers } from "redux";
import { batchReducer } from "./batches";
import { userReducer } from "./user";
import { statesReducer } from "./states";
import { instituteReducer } from "./institute";
import { instituteStaffReducer } from "./instituteStaff";
import { studentReducer } from "./student";
import { courseReducer } from "./courses";
import { lmsConfigReducer } from "./LmsConfig";
import { questionsReducer } from "./questions";
import { syllabusReducer } from "./Syllabus";
import { packageReducer } from "./packages";
import { productReducer } from "./products";
import { couponReducer } from "./coupons";
import { leadReducer } from "./leads";
import { testReducer } from "./test";
import { assignmentReducer } from "./assignments";
import { qaqcReducer } from "./qaqc";
import { websiteReducer } from "./website";
import { xExamResultReducer } from "./xExamResult";
import { promoCodeReducer } from "./promoCodeReducer";
import { discussionTopicReducer } from "./discussionTopicReducer";
import { noticeReducer } from "./notice";
import { eventReducer } from "./events";
import { notificationReducer } from "./notificaitons";
import { commentsReducer } from "./comments";
import { OrdersReducer } from "./orders";
import { feedbackReducer } from "./feedbacks";
import { walletReducer } from "./wallet";
import { ticketsReducer } from "./tickets";
import { dashboardReducer } from "./dashboard";
import { doubtReducer } from "./doubts";
import { examsReducer } from "./exams";
import { feedbacksurveyReducer } from "./feedbackSurvey";
import { discountConfigReducer } from "./discountConfigs";
import { liveClassesReducer } from "./LiveClasses";
import { centerReducer } from "./center";
import { promoCouponReducer } from "./promoCoupon";
import { FranchiseEnquiryReducer } from "./franchise";
import { CareerJobApplicationReducer } from "./career";
import { offlineCourseReducer } from "./offlineEnquiry/OfflineCourse";
import { enquiryReducer } from "./offlineEnquiry/Enquiry";
import { inventoryReducer } from "./inventory";

const appReducer = combineReducers({
    user: userReducer,
    institute: instituteReducer,
    batches: batchReducer,
    states: statesReducer,
    instituteStaff: instituteStaffReducer,
    student: studentReducer,
    course: courseReducer,
    lmsConfig: lmsConfigReducer,
    questions: questionsReducer,
    syllabus: syllabusReducer,
    center: centerReducer,
    packages: packageReducer,
    product: productReducer,
    coupon: couponReducer,
    leads: leadReducer,
    test: testReducer,
    assignments: assignmentReducer,
    qaqc: qaqcReducer,
    website: websiteReducer,
    promoCodeReducer: promoCodeReducer,
    discussionTopicReducer: discussionTopicReducer,
    notice: noticeReducer,
    event: eventReducer,
    notifications: notificationReducer,
    comments: commentsReducer,
    orders: OrdersReducer,
    feedbacks: feedbackReducer,
    wallet: walletReducer,
    tickets: ticketsReducer,
    dashboard: dashboardReducer,
    doubts: doubtReducer,
    exams: examsReducer,
    xExamResult: xExamResultReducer,
    feedbacksurvey: feedbacksurveyReducer,
    discountConfigs: discountConfigReducer,
    liveClasses: liveClassesReducer,
    promoCoupon: promoCouponReducer,
    franchiseEnquiry: FranchiseEnquiryReducer,
    career: CareerJobApplicationReducer,
    offlineCourse: offlineCourseReducer,
    enquiry: enquiryReducer,
    inventory: inventoryReducer,
});

export const reducer = (state, action) => {
  if (action.type === "CLEAR_LOGIN") {
    state = undefined;
  }
  return appReducer(state, action);
};
