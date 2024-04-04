import {
  ShopOutlined,
  TagOutlined,
  TagsOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  GiftOutlined,
  CalendarOutlined,
  ScheduleOutlined,
  PushpinOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  WalletOutlined,
  QuestionCircleOutlined,
  FileDoneOutlined,
  ReadOutlined,
  GlobalOutlined,
  DesktopOutlined,
  InboxOutlined,
  VideoCameraOutlined,
  FileSearchOutlined,
  HistoryOutlined,
  FileSyncOutlined
} from "@ant-design/icons";
import { RiCoupon2Line } from "react-icons/ri";
import { Menu } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { ROUTES } from "../Constants/Routes";
import { IoTicketOutline, IoChatbubblesOutline } from "react-icons/io5";
import { ROLES, RoleType } from "../Constants";
import { intersection, intersectionWith, reduce, size } from "lodash";


const MainMenu = [
  //{ key: "/", label: "Home", icon: <ShopOutlined /> },
  {
    index: 1,
    key: ROUTES.MANAGE_PRODUCTS,
    label: "Products",
    roles: [ROLES.ADMIN],
    icon: <ShopOutlined />,
  },
  {
    index: 2,
    key: 2,
    label: "Packages",
    roles: [ROLES.ADMIN],
    icon: <InboxOutlined />,
    items: [
      { key: ROUTES.ADD_PACKAGE, label: "Package" },
      { key: ROUTES.LIST_PACKAGES, label: "Packages List" },
      { key: ROUTES.LIST_CENTER, label: "Center List" }
    ],
  },
  // {
  //   index: 3,
  //   key: ROUTES.MANAGE_LEADS,
  //   label: "Leads",
  //   roles: [ROLES.ADMIN],

  //   icon: <UsergroupAddOutlined />,
  // },
  {
    index: 20,
    key: ROUTES.ALL_LEADS,
    label: "Leads New",
    roles: [ROLES.ADMIN],

    icon: <UsergroupAddOutlined />,
  },
  {
    index: 4,
    label: "Users",
    key: "managestudents",
    roles: [ROLES.ADMIN],

    icon: <TeamOutlined />,
    items: [
      { label: "Admin Role", key: ROUTES.MANAGE_STAFF },
      { label: "Add Students", key: ROUTES.ADD_STUDENT },
      { label: "Search Student", key: ROUTES.SEARCH_STUDENT },
      { label: "Students List", key: ROUTES.STUDENT_LIST },
      { label: "Promo Code", key: ROUTES.PROMO_CODE },
      { label: "Coupons", key: ROUTES.MANAGE_COUPONS },
      { label: "Promo Coupons", key: ROUTES.PROMO_COUPONS },
      { label: "Categories", key: ROUTES.CATEGORY },
      { label: "Discount Config", key: ROUTES.DISCOUNT_CONFIGS },
    ],
  },
  {
    index: 104,
    label: "Admin Role", 
    key: ROUTES.MANAGE_STAFF, 
    roles: [ROLES.HEAD_TEACHER],
    icon: <TeamOutlined />,

  },
  {
    index: 105,
    label: "Search Student", 
    key: ROUTES.SEARCH_STUDENT, 
    roles: [ROLES.QA_QC, ROLES.CONTENT_OPERATOR],
    icon: <TeamOutlined />,

  },
  {
    index: 5,
    label: "Courses",
    key: 5,
    roles: [ROLES.ADMIN, ROLES.CONTENT_ADMIN],

    icon: <DesktopOutlined />,
    items: [
      { label: "Courses", key: ROUTES.MANAGE_COURSES },
      { label: "Subjects", key: ROUTES.CONFIG_DATA },
      { label: "Upload Chapters", key: ROUTES.UPLOAD_BASECHAPTERS },
      { label: "Chapters List", key: ROUTES.LIST_BASECHAPTERS },
      { label: "Chapter Template", key: ROUTES.ADD_CHAPTER_TEMPLATE },
      { label: "Template List", key: ROUTES.LIST_CHAPTER_TEMPLATE },
    ],
  },
  {
    index: 6,
    key: 6,
    label: "Questions Bank",
    roles: [ROLES.ADMIN, ROLES.QA_QC,ROLES.CONTENT_OPERATOR],

    icon: <QuestionCircleOutlined />,
    items: [
      { key: ROUTES.ADD_QUESTIONS, label: "Add Questions" },
      { key: ROUTES.LIST_QUESTIONS, label: "Questions List " },
      { key: ROUTES.ADD_PARAGRAPH, label: "Add Paragraph" },
      { key: ROUTES.LIST_PARAGRAPH, label: "Paragraph List" },
      { key: ROUTES.BULK_QUESTION_UPLOAD, label: "Bulk Question Upload" },
    ],
  },

  {
    index: 7,
    key: 7,
    label: "Tests/Assignments",
    roles: [ROLES.ADMIN, ROLES.QA_QC,ROLES.CONTENT_OPERATOR],

    icon: <FileDoneOutlined />,
    items: [
      { key: ROUTES.ADD_TEST, label: "Tests" },
      { key: ROUTES.MANAGE_TESTS, label: "Test List" },
      { key: ROUTES.MANAGE_ASSIGNMENTS, label: "Assignments" },
      { key: ROUTES.ADD_INSTRUCTIONS, label: "Instructions" },
    ],
  },
  {
    index: 8,
    key: ROUTES.QAQC_TESTS,
    roles: [ROLES.ADMIN,ROLES.QA_QC,ROLES.CONTENT_OPERATOR],

    label: "QA/QC Tests",
    icon: <FileDoneOutlined />,
  },
  {
    index: 9,
    key: ROUTES.MANAGE_TAGS,
    label: "Tags",
    roles: [ROLES.ADMIN],

    icon: <TagsOutlined />,
  },
  {
    index: 10,
    key: ROUTES.DISCUSSION_TOPIC,
    label: "Discussion Topic",
    icon: <ReadOutlined />,
    roles: [ROLES.ADMIN],

  },
  {
    index: 11,
    key: ROUTES.WEBSITE_DATA,
    roles: [ROLES.ADMIN],

    label: "Website",
    icon: <GlobalOutlined />,
  },
  {
    index: 12,
    key: ROUTES.EVENTS,
    roles: [ROLES.ADMIN],

    label: "Events",
    icon: <CalendarOutlined />,
  },
  {
    index: 13,
    key: ROUTES.NOTICE,
    roles: [ROLES.ADMIN],

    label: "Notices",
    icon: <PushpinOutlined />,
  },
  {
    index: 14,
    key: 14,
    label: "Notifications",
    roles: [ROLES.ADMIN],

    icon: <MessageOutlined />,
    items: [
      { key: ROUTES.NOTIFICATIONS, label: "Send Notification" },
      { key: ROUTES.LIST_NOTIFICATIONS, label: "List Notifications" },
    ],
  },
  {
    index: 15,
    label: "Orders",
    roles: [ROLES.ADMIN],
    icon: <ShoppingCartOutlined />,
    key: ROUTES.ORDER_HISTORY,
    // items: [
    //   { label: "Orders", key: ROUTES.ORDER_HISTORY },
    //   { label: "Deliverable", key: ROUTES.OFFLINE_ORDERS },
    // ],
  },
  {
    index: 151,
    label: "Deliverable Orders",
    roles: [ ROLES.DELIVERY_ACCESS],
    // label: "Deliverable", 
    key: ROUTES.OFFLINE_ORDERS,
    icon: <ShoppingCartOutlined />
  },
  {
    index: 16,
    label: "Wallet",
    roles: [ROLES.ADMIN],

    key: 16,
    icon: <WalletOutlined />,
    items: [
      { label: "History", key: ROUTES.WALLET_REPORT },
      { label: "Offers", key: ROUTES.WALLET_OFFERS },
    ],
  },
  {
    index: 17,
    key: ROUTES.FEEDBACKS,
    roles: [ROLES.ADMIN],

    label: "Feedbacks",
    icon: <MessageOutlined />,
  },
  {
    index: 23,
    key: 23,
    label: "Feedback Survey",
    roles: [ROLES.ADMIN],

    icon: <MessageOutlined />,
    items: [
      { key: ROUTES.SURVEY_FEEDBACKS, label: "Create survey/feedback" },
      { key: ROUTES.SURVEY_FEEDBACKS_LIST, label: "survey/feedback list" }
    ]
  },

  {
    index: 19,
    key: ROUTES.DOUBTS_PANEL,
    label: "Doubts",
    roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.HEAD_TEACHER],

    icon: <IoChatbubblesOutline />,
  },
  {
    index: 18,
    key: ROUTES.TICKETS,
    roles: [ROLES.ADMIN, ROLES.SUPPORT_EXECUTIVE],

    label: "Desk",
    icon: <IoTicketOutline />,
  },
  
  {
    index: 21,
    roles: [ROLES.ADMIN],

    key: ROUTES.EXAM_CONTENT,
    label: "Exam Content",
    icon: <VideoCameraOutlined />,
  },
  {
    index: 25,
    roles: [ROLES.CAREER],

    key: ROUTES.CAREER_JOBAPPLICATION_LIST,
    label: "Career Enquiry",
    icon: <TeamOutlined />,
  },
  {
    index: 26,
    roles: [ROLES.BUSINESS_PARTNER],

    key: ROUTES.FRANCHISE_ENQUIRY_LIST,
    label: "Business Enquiry",
    icon: <TeamOutlined />,
  },
  {
    index: 27,
    key: 27,
    label: "Enquiries",
    roles: [ROLES.ADMIN],
    icon: <TeamOutlined />,
    items: [
      { key: ROUTES.CAREER_JOBAPPLICATION_LIST, label: "Career Enquiry" },
      { key: ROUTES.FRANCHISE_ENQUIRY_LIST, label: "Business Enquiry" },
    ],
  },
  {
    index: 28,
    key: 28,
    label: "Upcoming",
    roles: [ROLES.ADMIN],
    icon: <HistoryOutlined />,
    items: [
      { key: ROUTES.LIST_ENQUIRY, label: "Enquiry" },
      { key: ROUTES.OFFLINE_COURSE, label: "Offline Courses" },
      { key: ROUTES.OFFLINE_PAYMENT_REPORT, label: "Offline Payments Report" },
      { key: ROUTES.DEFAULTER_STUDENTS_REPORT, label: "Defaulter Students Report" },
      { key: ROUTES.INVENTORY_ITEM_LIST, label: "Inventory Item" },
      { key: ROUTES.INVENTORY_ITEM_GROUP, label: "Inventory Group" },
    ],
  },
  {
    index: 29,
    key: 29,
    label: "Live Classes",
    roles: [ROLES.ADMIN, ROLES.LIVE_CLASS],

    icon: <VideoCameraOutlined />,
    items: [
      { key: ROUTES.BATCH_MANAGEMENT, label: "Add Batch" },
      { key: ROUTES.BATCH_MANAGEMENT_LIST, label: "Batch Management" },
      { key: ROUTES.BATCH_SCHEDULE, label: "Batch Schedule" },
      { key: ROUTES.BATCH_SCHEDULE_LIST, label: "Batch Schedule List" },
      { key: ROUTES.BATCH_TEACHERS_REVIEWS, label: "Staff reviews" },
    ]
  },

];

const sysadminMenu = [
  {
    index: 1,
    key: ROUTES.INSTITUTE_ADD,
    label: "Add Institute",
    icon: <TeamOutlined />,
  },

  {
    index: 2,
    key: ROUTES.INSTITUE_LIST,
    label: "List Institute",
    icon: <TeamOutlined />,
  },
];

const getMenuItems = (staff) => {
  // if(staff?.staffRole === ROLES.ADMIN){
  //   return MainMenu
  // }

  return reduce(MainMenu, (last, m, i) => {
    const allowed = intersection(m.roles, [staff?.staffRole, ...(staff?.otherRoles||[])])
    if (size(allowed)) {
      last.push(m)
    }
    return last
  }, [])
}

export const SideMenu = (props) => {
  const user = useSelector((s) => s.user.user);

  const history = useHistory();

  // const items =
  //   user?.role === "SYSADMIN"
  //     ? sysadminMenu
  //     : user?.staff?.staffRole === "SUPPORT_EXECUTIVE"
  //       ? supportMenu
  //       : user?.staff?.staffRole === "DELIVERY_ACCESS"
  //         ? deliveryExecMenu
  //         : user?.staff?.staffRole === "HEAD_TEACHER"
  //           ? httmenu
  //           : user?.staff?.staffRole === "TEACHER"
  //             ? tmenu
  //             : adminMenu; //rolecheck


  const items =
    user?.role === "SYSADMIN"
      ? sysadminMenu
      : getMenuItems(user?.staff)

  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["4"]}
    >
      {items.map((m) => {
        let key = m.key;

        if (typeof key === "object") {
          key = key.rootPath || key.key;
        }
        // console.log('m', m);
        return m.items ? (

          <SubMenu key={key} icon={m.icon} title={m.label}>
            {/* {console.log('m.items', m.items)} */}
            {m.items.map((sm) => {
              let ikey = sm.key;
              if (typeof ikey === "object") {
                ikey = ikey.rootPath || ikey.key;
              }

              return (
                <Menu.Item as="a" href={ikey} key={ikey} icon={sm.icon}>
                  <Link to={ikey} href={ikey}>
                    {sm.label}
                  </Link>
                </Menu.Item>
              );
            })}
          </SubMenu>
        ) : (
          <Menu.Item key={key} icon={m.icon}>
            <Link to={key} href={key}>
              {m.label}
            </Link>
          </Menu.Item>
        );
      })}
    </Menu>
  );
};
