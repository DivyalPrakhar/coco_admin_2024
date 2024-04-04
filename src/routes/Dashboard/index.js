import { Avatar, Layout, Popconfirm, Space, Tooltip } from "antd";
import "./Dashboard.css";

import { AddInstitute } from "../Institute/AddInstitute";
import { ListInstitute } from "../Institute/ListInstitute";

import { SideMenu } from "../../components/SideMenu";
import { Route, Switch, useHistory } from "react-router-dom";
import { ROUTES } from "../../Constants/Routes";
import { AddStudent } from "../AddStudent/index.js";
import { SearchStudent } from "../SearchStudent";
import { StudentProfile } from "../StudentProfile/index.js";
import ProLayout, { PageContainer } from "@ant-design/pro-layout";
import { useState } from "react";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useAppContext, useAuthUser } from "../../App/Context";
import { ManageStaff } from "../ManageStaff";
import { ManageCourses } from "../ManageCourses.js/index.js";
import { ConfigData } from "../ConfigData";
import { UploadBasechapters } from "../Basechapters/UploadBasechapters";
import DoubtsPanel from "../Doubts/DoubtsPanel";
import { ListBasechapters } from "../Basechapters/ListBasechapters";
import { CkeditorComponent } from "../../components/CkeditorComponent";
import { AddQuestions } from "../ManageQuestions/AddQuestion";
import { ListQuestions } from "../ManageQuestions/ListQuestions";
import { AddParagraph } from "../Paragraph/AddParagraph";
import { ListParagraph } from "../Paragraph/ListParagraph";
import { AddChapterTemplate } from "../ChapterTemplate/AddChapterTemplate";
import { ListChapterTemplate } from "../ChapterTemplate/ListChapterTemplate";
import { AddPackage } from "../ManagePackages/AddPackage";
import { ManagePackages } from "../ManagePackages";
import { ManageProducts } from "../ManageProducts/index.js";
import { AddTest } from "../ManageTests/AddTest";
import { ManageCoupons } from "../ManageCoupons/index.js";
import { ManageLeads } from "../ManageLeads/index.js";

import { ManageTests } from "../ManageTests";
import { ManageTags } from "../ManageTags";
import { AddTestInstructions } from "../ManageTests/AddTestInstructions";
import { AnswerKeys } from "../AnswerKeys";
import { TestQuestions } from "../ManageTests/TestQuestions";
import { ExportTestPaper } from "../ManageTests/ExportTestPaper";
import { ManageAssignment } from "../ManageAssignments";
import { QAQCTests } from "../QAQCTests/index.js";
import { TestQuestionsQAQC } from "../QAQCTests/TestQuestionsQAQC";
import { WebsiteData } from "../Website/Index";
import { PromoCode } from "../PromoCode";
import { StudentsAndResult } from "../ManageTests/StudentsAndResult";
import { DiscussionTopic } from "../DiscussionTopic";
import { DiscussionSubTopic } from "../DiscussionTopic/DiscussionSubTopic";
import { BulkQuestionUpload } from "../ManageQuestions/BulkQuestionUpload";
import { Notice } from "../Notice";
import { Events } from "../Events";
import { Notifications } from "../Notifications";
import { ManageNotifications } from "../Notifications/ManageNotifications";
import { UserProfile } from "../UserProfile";
import { useSelector } from "react-redux";
import Text from "antd/lib/typography/Text";
import { PackageStudents } from "../PackageStudents";
import { OrderHistory } from "../OrderHistory.js";
import { Feedbacks } from "../Feedbacks";
import SurveyFeedback from "../SurveyFeedback/index";
import { OfflineOrders } from "../OfflineOrders.js";
import { WalletHistory } from "../WalletHistory";
import { WalletOffers } from "../WalletOffers";
import { ManageTickets } from "../ManageTickets";
import { StudentTickets } from "../ManageTickets/StudentTickets";
import { Students } from "../StudentsList";
import { HomeDashboard } from "./HomeDashboard";
import { AssignmentDetails } from "../AssignmentDetails";
import { AllLeads } from "../Leads";
import { ExamContent } from "../ExamContent";
import { Category } from "../Category";
import { XIIExamResult } from "../XIIExamResult";
import { XCompareResult } from "../newXResult";
import { XExamResult } from "../XExamResult";
import { SurveyFeedbackList } from "../SurveyFeedbackList/SurveyFeedbackList";
import { SpecificPackages } from "../SurveyFeedback/Specific_Packages";
import SurveyReport from "../SurveyReport";
import { ROLES } from "../../Constants";
import { DiscountConfigs } from "../DiscountConfigs";
import EventStudentList from "../Events/EventStudentList";
import ManageCenter from "../ManageCenter";
import { PromoCoupon } from "../PromoCoupon";
import FranchiseEnquiryList from "../Franchise";
import CareerJobApplicationList from "../CareerJobApplicationList";
import EnquiryForm from "../Enquiry/EnquiryForm";
import ListOfflineCourse from "../OfflineCourse/ListOfflineCourse";
import ListEnquiry from "../Enquiry/ListEnquiry";
import AdmissionPayment from "../StudentProfile/AdmissionPayment";
import OfflinePaymentReport from "../OfflinePaymentReport/PaymentReport";
import BatchManagement from "../LiveClasses/BatchManagement";
import BatchManagementList from "../LiveClasses/BatchManagementList";
import BatchSchedule from "../LiveClasses/BatchSchedule";
import BatchScheduleList from "../LiveClasses/BatchScheduleList";
import StaffReviews from "../LiveClasses/StaffReviews";
import DefaulterStudentsReport from "../OfflinePaymentReport/DefaulterStudentsReport";
import InventoryItemList from "../Inventory/ListInventoryItem";
import InventoryGroupList from "../Inventory/ListInventoryGroup";

const { Content } = Layout;

export function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAppContext();
  const history = useHistory();

  const user = useSelector((state) => state.user.user);

  const openUser = () => {
    history.push("/user-profile");
  };

  return (
    <ProLayout
      navTheme="dark"
      title=""
      fixedHeader
      onCollapse={setCollapsed}
      menuHeaderRender={() => {
        return (
          <div style={{ textAlign: "center", width: "100%" }}>
            <img
              alt="logo"
              src={collapsed ? "/images/logos.png" : "/images/logo-coco.png"}
              onClick={() => history.push("/")}
            />
          </div>
        );
      }}
      fixSiderbar
      headerContentRender={() => {
        return (
          <div style={{ display: "flex", flexDirection: "row-reverse" }}>
            <Space align="center" size="small">
              <div>
                <Tooltip placement="bottom" title={"User"}>
                  <Space className="nav-item" onClick={openUser}>
                    {user?.avatar ? (
                      <Avatar src={user?.avatar} />
                    ) : (
                      <Avatar icon={<UserOutlined />} />
                    )}
                    <Text>{user?.name}</Text>
                  </Space>
                </Tooltip>
              </div>
              <Popconfirm
                title="Are you sure you want to logout now?"
                onConfirm={logout}
                onCancel={() => { }}
                okText="Logout"
                cancelText="Cancel"
                placement="bottomLeft"
              >
                <Tooltip placement="topLeft" title={"logout"}>
                  <div className="nav-item">
                    <Avatar
                      style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                      icon={<LogoutOutlined />}
                    />
                  </div>
                </Tooltip>
              </Popconfirm>
            </Space>
          </div>
        );
      }}
      onPageChange={(p) => {
        "";
      }}
      menuContentRender={SideMenu}
      onMenuHeaderClick={() => {
        console.log("menu header");
      }}
    >
      <MainContent />
    </ProLayout>
  );
}

// export function Dashboardd() {
//   return (
//     <Layout>
//       <Layout className="site-layout" style={{ position: "relative" }}>
//         <DashboardHeader />
//         <MainContent />
//         <Footer
//           style={{
//             textAlign: "center",
//             position: "absolute",
//             bottom: 0,
//             right: 0,
//             left: 0,
//           }}
//         >
//           Alumni Copyright @schoollog 2020
//         </Footer>
//       </Layout>
//     </Layout>
//   );
// }

const MainContent = (props) => {
  const authuser = useAuthUser();
  console.log("maincontent", authuser);

  // if (authuser?.staff?.staffRole === 'DELIVERY_ACCESS') {
  //   return (
  //     <div style={{ padding: '0px' }}>
  //       <Switch>
  //         <Route exact path={ROUTES.OFFLINE_ORDERS} component={OfflineOrders} />
  //         <Redirect to={ROUTES.OFFLINE_ORDERS} />
  //       </Switch>
  //     </div>
  //   )
  // }
  return (
    <div style={{ padding: "0px" }}>
      <Switch>
        <Route roles={[ROLES.ADMIN]} exact path="/" component={MainView} />
        <Route
          roles={[ROLES.SYSADMIN]}
          exact
          path={ROUTES.INSTITUTE_ADD}
          component={AddInstitute}
        />
        <Route
          roles={[ROLES.SYSADMIN]}
          exact
          path={ROUTES.INSTITUE_LIST}
          component={ListInstitute}
        />
        {/* <Route
          exact
          roles={[ROLES.ADMIN]}
          path={ROUTES.MANAGE_BATCHES.key}
          component={ManageBatchRoute}
        /> */}
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.ADD_STUDENT}
          component={AddStudent}
        />
        <Route
          roles={[ROLES.ADMIN, ROLES.QA_QC]}
          exact
          path={ROUTES.SEARCH_STUDENT}
          component={SearchStudent}
        />
        <Route
          roles={[ROLES.ADMIN, ROLES.QA_QC]}
          exact
          path={ROUTES.STUDENT_PROFILE}
          component={StudentProfile}
        />
        {/* <Route exact path={ROUTES.ADD_GROUP.key} component={ManageGroups} /> */}
        {/* <Route exact path={ROUTES.ALUMNIS_LIST} component={ManageAlumni} /> */}
        <Route
          roles={[ROLES.ADMIN, ROLES.HEAD_TEACHER]}
          exact
          path={ROUTES.MANAGE_STAFF}
          component={ManageStaff}
        />
        {/*<Route exact path={ROUTES.LMS_CONFIG} component={LmsConfig} />*/}

        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.WEBSITE_DATA}
          component={WebsiteData}
        />
        <Route
          roles={[ROLES.ADMIN]}
          path={ROUTES.MANAGE_COURSES}
          component={ManageCourses}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.CONFIG_DATA}
          component={ConfigData}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.UPLOAD_BASECHAPTERS}
          component={UploadBasechapters}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.LIST_BASECHAPTERS}
          component={ListBasechapters}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.CKEDITOR}
          component={CkeditorComponent}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.ADD_QUESTIONS}
          component={AddQuestions}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.ADD_PARAGRAPH}
          component={AddParagraph}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.LIST_PARAGRAPH}
          component={ListParagraph}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.ADD_CHAPTER_TEMPLATE}
          component={AddChapterTemplate}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.LIST_CHAPTER_TEMPLATE.key}
          component={ListChapterTemplate}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.UPDATE_CHAPTER_TEMPLATE}
          component={AddChapterTemplate}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.LIST_QUESTIONS}
          component={ListQuestions}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.ADD_PACKAGE}
          component={AddPackage}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.LIST_PACKAGES.key}
          component={ManagePackages}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.UPDATE_PACKAGE}
          component={AddPackage}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.PREVIEW_PACKAGE}
          component={AddPackage}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.LIST_CENTER.key}
          component={ManageCenter}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.MANAGE_PRODUCTS}
          component={ManageProducts}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.ADD_TEST}
          component={AddTest}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.UPDATE_TEST}
          component={AddTest}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.MANAGE_COUPONS}
          component={ManageCoupons}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.MANAGE_LEADS}
          component={ManageLeads}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.MANAGE_TAGS}
          component={ManageTags}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.MANAGE_TESTS}
          component={ManageTests}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.ANSWER_KEYS}
          component={AnswerKeys}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.TEST_QUESTIONS}
          component={TestQuestions}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.EXPORT_TEST}
          component={ExportTestPaper}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.VERIFY_TEST_QUESTIONS}
          component={TestQuestionsQAQC}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.STUDENTS_AND_RESULT}
          component={StudentsAndResult}
        />
        <Route
          roles={[ROLES.ADMIN]}
          path={ROUTES.DISCUSSION_TOPIC}
          component={DiscussionTopic}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.QUESTION_TOPIC}
          component={DiscussionTopic}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.DISCUSSION_SUB_TOPIC}
          component={DiscussionSubTopic}
        />
        <Route roles={[ROLES.ADMIN]} path={ROUTES.MANAGE_ASSIGNMENTS}>
          <ManageAssignment />
        </Route>
        <Route
          roles={[ROLES.ADMIN]}
          path={ROUTES.ADD_INSTRUCTIONS}
          component={AddTestInstructions}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.QAQC_TESTS}
          component={QAQCTests}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.PROMO_CODE}
          component={PromoCode}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.PROMO_COUPONS}
          component={PromoCoupon}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.BULK_QUESTION_UPLOAD}
          component={BulkQuestionUpload}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.NOTICE}
          component={Notice}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.EVENTS}
          component={Events}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.NOTIFICATIONS}
          component={Notifications}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.LIST_NOTIFICATIONS}
          component={ManageNotifications}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.USER_PROFILE}
          component={UserProfile}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.PACKAGE_STUDENTS}
          component={PackageStudents}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.ORDER_HISTORY}
          component={OrderHistory}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.FEEDBACKS}
          component={Feedbacks}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.SURVEY_FEEDBACKS}
          component={SurveyFeedback}
        />

        <Route 
        roles={[ROLES.ADMIN]} 
        exact 
        path={ROUTES.FRANCHISE_ENQUIRY_LIST} 
        component={FranchiseEnquiryList} 
        />
        <Route 
        roles={[ROLES.ADMIN]} 
        exact 
        path={ROUTES.CAREER_JOBAPPLICATION_LIST} 
        component={CareerJobApplicationList} />
        {/* <Route exact path={ROUTES.SURVEY_FEEDBACKS} component={SurveyFeedback} /> */}
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.SURVEY_FEEDBACKS_LIST}
          component={SurveyFeedbackList}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.SPECIFIC_PACKAGES}
          component={SpecificPackages}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.OFFLINE_ORDERS}
          component={OfflineOrders}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.WALLET_REPORT}
          component={WalletHistory}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.WALLET_OFFERS}
          component={WalletOffers}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.TICKETS}
          component={ManageTickets}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.STUDENT_TICKETS}
          component={StudentTickets}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.STUDENT_LIST}
          component={Students}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.DOUBTS_PANEL}
          component={DoubtsPanel}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.ASSIGNMENT_DETAILS}
          component={AssignmentDetails}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.ALL_LEADS}
          component={AllLeads}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.EXAM_CONTENT}
          component={ExamContent}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.CATEGORY}
          component={Category}
        />
        <Route
          roles={[ROLES.ADMIN]}
          exact
          path={ROUTES.CHART_RESULT}
          component={XIIExamResult}
        />
        <Route
          roles={[ROLES.ADMIN]}
          path={ROUTES.X_COMPARE_RESULT}
          component={XCompareResult}
        />
        <Route
          roles={[ROLES.ADMIN]}
          path={ROUTES.X_EXAM_RESULT}
          component={XExamResult}
        />
        <Route
          roles={[ROLES.ADMIN]}
          path={ROUTES.SURVEY_REPORT}
          component={SurveyReport}
        />
        <Route
          roles={[ROLES.ADMIN]}
          path={ROUTES.DISCOUNT_CONFIGS}
          component={DiscountConfigs}
        />

        <Route
          roles={[ROLES.ADMIN]}
          path={ROUTES.EVENT_STUDENTS_LIST}
          component={EventStudentList}
        />

        <Route
          roles={[ROLES.ADMIN]}
          path={ROUTES.ENQUIRY_FORM}
          component={EnquiryForm}
        />

        <Route
          roles={[ROLES.ADMIN]}
          path={ROUTES.LIST_ENQUIRY}
          component={ListEnquiry}
        />

        <Route
          roles={[ROLES.ADMIN]}
          path={ROUTES.OFFLINE_COURSE}
          component={ListOfflineCourse}
        />

        <Route
          roles={[ROLES.ADMIN]}
          path={ROUTES.OFFLINE_PAYMENT_REPORT}
          component={OfflinePaymentReport}
        />

        <Route
          roles={[ROLES.ADMIN]}
          path={ROUTES.DEFAULTER_STUDENTS_REPORT}
          component={DefaulterStudentsReport}
        />

        <Route
          roles={[ROLES.ADMIN]}
          path={ROUTES.ADMISSION_PAYMENT}
          component={AdmissionPayment}
        />

        <Route roles={[ROLES.ADMIN]} exact path={ROUTES.SURVEY_FEEDBACKS_LIST} component={SurveyFeedbackList} />
        <Route roles={[ROLES.ADMIN]} exact path={ROUTES.SPECIFIC_PACKAGES} component={SpecificPackages} />
        <Route roles={[ROLES.ADMIN]} exact path={ROUTES.OFFLINE_ORDERS} component={OfflineOrders} />
        <Route roles={[ROLES.ADMIN]} exact path={ROUTES.WALLET_REPORT} component={WalletHistory} />
        <Route roles={[ROLES.ADMIN]} exact path={ROUTES.WALLET_OFFERS} component={WalletOffers} />
        <Route roles={[ROLES.ADMIN]} exact path={ROUTES.TICKETS} component={ManageTickets} />
        <Route roles={[ROLES.ADMIN]} exact path={ROUTES.STUDENT_TICKETS} component={StudentTickets} />
        <Route roles={[ROLES.ADMIN]} exact path={ROUTES.STUDENT_LIST} component={Students} />
        <Route roles={[ROLES.ADMIN]} exact path={ROUTES.DOUBTS_PANEL} component={DoubtsPanel} />
        <Route roles={[ROLES.ADMIN]} exact path={ROUTES.ASSIGNMENT_DETAILS} component={AssignmentDetails} />
        <Route roles={[ROLES.ADMIN]} exact path={ROUTES.ALL_LEADS} component={AllLeads} />
        <Route roles={[ROLES.ADMIN]} exact path={ROUTES.EXAM_CONTENT} component={ExamContent} />
        <Route roles={[ROLES.ADMIN]} exact path={ROUTES.CATEGORY} component={Category} />
        <Route roles={[ROLES.ADMIN]} exact path={ROUTES.CHART_RESULT} component={XIIExamResult} />
        <Route roles={[ROLES.ADMIN]} path={ROUTES.X_COMPARE_RESULT} component={XCompareResult}/>
        <Route roles={[ROLES.ADMIN]} path={ROUTES.X_EXAM_RESULT} component={XExamResult}/>
        <Route roles={[ROLES.ADMIN]} path={ROUTES.SURVEY_REPORT} component={SurveyReport}/>
        <Route roles={[ROLES.ADMIN]} path={ROUTES.DISCOUNT_CONFIGS} component={DiscountConfigs}/>
        <Route roles={[ROLES.ADMIN]} path={ROUTES.BATCH_MANAGEMENT} component={BatchManagement}/>
        <Route roles={[ROLES.ADMIN]} path={ROUTES.BATCH_MANAGEMENT_LIST} component={BatchManagementList}/>
        <Route roles={[ROLES.ADMIN]} path={ROUTES.BATCH_TEACHERS_REVIEWS} component={StaffReviews}/>
        <Route roles={[ROLES.ADMIN]} path={ROUTES.BATCH_SCHEDULE} component={BatchSchedule}/>
        <Route roles={[ROLES.ADMIN]} path={ROUTES.BATCH_SCHEDULE_LIST} component={BatchScheduleList}/>
        <Route roles={[ROLES.ADMIN]} path={ROUTES.INVENTORY_ITEM_LIST} component={InventoryItemList}/>
        <Route roles={[ROLES.ADMIN]} path={ROUTES.INVENTORY_ITEM_GROUP} component={InventoryGroupList}/>
        
        <Route path={"/"} component={Test} />
      </Switch>
    </div>
  );
};

const Test = (props) => {
  return (
    <Content
      style={{
        margin: "24px 16px 0",
        overflow: "initial",
        backgroundColor: "#dadada",
      }}
    >
      404
    </Content>
  );
};

const MainView = (props) => {
  return (
    <PageContainer ghost>
      <Content style={{ overflow: "initial" }}>
        <div className="site-layout-background" style={{ padding: 10 }}>
          <HomeDashboard />
        </div>
      </Content>
    </PageContainer>
  );
};
