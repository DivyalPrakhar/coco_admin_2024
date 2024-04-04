import {
  DeleteOutlined,
  SyncOutlined,
  EditOutlined,
  PlusOutlined,
  HddOutlined,
  TeamOutlined,
  SearchOutlined,
  MessageOutlined,
  OrderedListOutlined,
  FileOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Tag,
  Col,
  Empty,
  Row,
  Table,
  Tooltip,
  Space,
  Image,
  Upload,
  Input,
  Form,
  Divider,
  Menu,
  Dropdown,
  Popconfirm,
} from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { AddCourseDrawer } from "../../components/AddCourseDrawer";
import { AddCourseSubjectDrawer } from "../../components/AddCourseSubjectDrawer";
import { UploadImageBox } from "../../components/UploadImageBox";
import { CommonPageHeader } from "../../components/CommonPageHeader";
import { STATUS } from "../../Constants";
//import {getDefaultDataAction} from '../../redux/reducers/LmsConfig'
import {
  addContentImageAction, resetCourseSubjectStatus,
  deleteCourseAction,
  getCoursesAction,
  resetAddContentImage,
  updateCourseAction,
  updateCourseSubjectAction,
  deleteCourseSubjAction,
  assignCourseTeacherAction,
  getCourseTeachersAction,
  removeCourseTeacherAction,
} from "../../redux/reducers/courses";
import _ from "lodash";
import { ConfirmAlert } from "../../Constants/CommonAlerts";
import { useAuthUser, useInstituteId } from "../../App/Context";
import { CourseContent } from "./CourseContent";
import { CourseStudentListModal } from "./CourseStudentList";
import { Switch, Route } from "react-router-dom";
import { ROUTES } from "../../Constants/Routes";
import Modal from "antd/lib/modal/Modal";
import { BaseURL } from "../../BaseUrl";
import moment from "moment";
import Text from "antd/lib/typography/Text";
import Paragraph from "antd/lib/typography/Paragraph";
import { NotificationModal } from "../Notifications/NotificationModal";
import { TotalCountBox } from "../../components/TotalCountBox";
import { OrderModal } from "./OrderCourseStubjectsModal";
import { AddFilesModal } from "./AddFilesModal";
import { FilesDrawer } from "./FilesDrawer";
import { SelectTeacherModal } from "./SelectTeacherModal";
import { useQueryParams } from "../../utils/FileHelper";

export const ManageCourses = () => {
  const instituteId = useInstituteId();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => ({
    user: state.user,
    course: state.course,
    configData: state.lmsConfig,
  }));

  useEffect(() => {
    dispatch(getCoursesAction({ instituteId }));
  }, [dispatch, user.user.staff.institute._id]);

  return (
    <Switch>
      <Route path={ROUTES.MANAGE_COURSES} exact component={Courses} />
      <Route
        path={ROUTES.MANAGE_COURSES + "/:id?"}
        exact
        component={CourseDetailsView}
      />
      <Route
        path={ROUTES.MANAGE_COURSES + "/:id?/:syllabusId?"}
        component={CourseContent}
      />
    </Switch>
  );
};

export const Courses = () => {
  const [addCourseDrawer, setAddCourseDrawer] = useState(false);

  const { course } = useSelector((state) => ({
    course: state.course,
    configData: state.lmsConfig,
  }));

  const closeDrawer = () => {
    setAddCourseDrawer(false);
  };

  const _setAddCourseDrawer = () => {
    setAddCourseDrawer(true);
  };

  return (
    <div>
      <CommonPageHeader
        title="Courses"
        extra={
          <Button
            shape="round"
            icon={<PlusOutlined />}
            onClick={_setAddCourseDrawer}
            size="large"
          >
            Add Course
          </Button>
        }
      />
      <br />
      <Card loading={course.getCoursesStatus === STATUS.FETCHING}>
        {course.getCoursesStatus === STATUS.SUCCESS &&
          course.courseList?.length ? (
          <Row>
            <Col span={24}>
              <CourseList courseList={course.courseList} />
            </Col>
          </Row>
        ) : (
          <Empty description="No course added" />
        )
        }
      </Card>
      {addCourseDrawer ? (
        <AddCourseDrawer visible={addCourseDrawer} closeDrawer={closeDrawer} />
      ) : null}
    </div>
  );
};

const CourseList = ({ courseList }) => {
  const { courseUpdateStatus } = useSelector((state) => ({
    courseUpdateStatus: state.course.updateCourseStatus,
  }));
  const history = useHistory();
  const dispatch = useDispatch();
  const [addCourseDrawer, setAddCourseDrawer] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [hoverId, setHoverId] = useState();
  const [updateStatusState, setUpdateStatus] = useState({ id: "", type: "" });
  const [sortInfo, changeSortInfo] = useState();
  const [openedDescriptions, setOpenDescription] = useState([]);

  const updateCourse = (d) => {
    setAddCourseDrawer(true);
    setCurrentCourse(d);
  };

  const closeDrawer = () => {
    setAddCourseDrawer(false);
    setCurrentCourse(null);
  };

  const deleteCourse = (id) => {
    const ds = () => dispatch(deleteCourseAction({ id: id }));
    ConfirmAlert(ds);
  };

  const updateCourseStatus = (data, type, id) => {
    setUpdateStatus({ id: id, type: type });
    dispatch(updateCourseAction({ [type]: data, id: id }));
  };

  const openDescription = (obj) => {
    setOpenDescription(d => [...d, obj._id])
  }

  const [notifyModal, openNotifyModal] = useState()
  const [filesDrawer, openFilesDrawer] = useState()

  useEffect(() => {
    if (courseUpdateStatus === STATUS.SUCCESS)
      openFilesDrawer(false)
  }, [courseUpdateStatus])

  const sendMessage = (obj) => {
    openNotifyModal(obj)
  }

  const handleOpenFiles = (course) => {
    openFilesDrawer(d => d ? false : course)
  }

  let searchInput = useRef();

  const columns = [
    {
      title: "Cover Images",
      key: "carousel",
      dataIndex: "carousel",
      render: (d) => (
        <Space wrap style={{ minWidth: "120px", alignContent: "center" }}>
          {d?.length
            ? d.map((img) => (
              <div
                style={{
                  padding: "4px",
                  border: "1px solid #AEB6BF",
                  width: "100px",
                }}
              >
                <Image src={img} />
              </div>
            ))
            : null}
        </Space>
      ),
    },
    {
      // className: 'normalTableRow',
      title: "Name",
      dataIndex: "name",
      key: "name",
      // sorter: (a, b, c) => _.lowerCase(a.name) > _.lowerCase(b.name),

      // sortOrder: sortInfo?.sortedInfo.columnKey === 'name' && sortInfo?.sortedInfo.order,
      // onCell: (record) => {
      //     return {
      //         onClick: () => history.push('/courses/'+record._id),
      //     }
      // },
      render: (d, obj) => {
        let ellipsis = _.findIndex(openedDescriptions, d => d == obj._id) == -1
        return (
          // <Tooltip placement="top" title='Click To View Course'>
          <div style={{ border: "" }}>
            <div>{obj.name}</div>
            <div>
              <Text style={{ color: "gray" }}>
                {ellipsis && obj.description?.length > 180 ? obj.description.substring(0, 180) + '...' : obj.description}
              </Text>
              {ellipsis && obj.description?.length > 180 ? <Button size='small' onClick={() => openDescription(obj)} type='link' color='blue'>more</Button> : null}
            </div>
          </div>
          // </Tooltip>
        )
      },

      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.select(), 100);
        }
      },

      onFilter: (value, record) =>
        record["name"]
          ? record["name"]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
          : "",

      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Form
            onFinish={() => {
              confirm({ closeDropdown: false });
            }}
          >
            <Input
              ref={(node) => {
                searchInput = node;
              }}
              placeholder={`Search ${"name"}`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              style={{ marginBottom: 8, display: "block" }}
            />
            <Space>
              <Button
                htmlType="submit"
                type="primary"
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button
                onClick={() => {
                  clearFilters();
                }}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
            </Space>
          </Form>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{ fontSize: "18px", color: filtered ? "#1890ff" : undefined }}
        />
      ),
    },
    {
      title: "Language",
      dataIndex: 'lang',
      render: (d) => d === 'en' ? <Text style={{ color: 'orange' }}>English</Text>
        : d === 'hn' ? <Text style={{ color: 'green' }}>Hindi</Text>
          : d === 'bi' ? <Text style={{ color: 'blue' }}>Bilingual</Text>
            : null,
    },
    {
      title: "Reference Id",
      key: "code",
      dataIndex: "code",
      sorter: (a, b) => a.code - b.code,
    },
    {
      title: "Status",
      key: "status",
      render: (d) => (
        <div>
          {/*<Tooltip placement="top" title={!d.isActive ? 'Click To Change Status' : <div style={{textAlign: 'center'}}>Status Can't Be Change<br/>Course Is Active</div>}>
                        <Tag style={{cursor: 'pointer'}} icon={courseUpdateStatus === STATUS.FETCHING && updateStatusState.id === d._id && updateStatusState.type === 'isReady' ? <SyncOutlined spin /> : ''} onClick={() => d.isActive ? '' : ConfirmAlert(() => updateCourseStatus(!d.isReady, 'isReady', d._id), 'Are You Sure You Want To Change Ready Status?')} color={d.isReady ? 'green' : 'red'}>{d.isReady ? 'Ready' : 'Not Ready'}</Tag>
                    </Tooltip>*/}
          {/*<Tooltip placement="top" title={d.isReady ? 'Click To Change Status' : <div style={{textAlign: 'center'}}>Status Can't Be Change<br/>Course Is Not Ready</div>}>
                        <Tag style={{cursor: 'pointer'}} icon={courseUpdateStatus === STATUS.FETCHING && updateStatusState.id === d._id && updateStatusState.type === 'isActive' ? <SyncOutlined spin /> : ''} onClick={() => !d.isReady ? '' : ConfirmAlert(() => updateCourseStatus(!d.isActive, 'isActive', d._id), 'Are You Sure You Want To Change Active Status?')} color={d.isActive ? 'green' : 'red'}>{d.isActive ? 'Active' : 'Not Active'}</Tag>
                    </Tooltip>*/}
          <Tooltip placement="top" title="Click To Change Status">
            <Tag
              style={{ cursor: "pointer" }}
              icon={
                courseUpdateStatus === STATUS.FETCHING &&
                  updateStatusState.id === d._id &&
                  updateStatusState.type === "isActive" ? (
                  <SyncOutlined spin />
                ) : (
                  ""
                )
              }
              onClick={() =>
                ConfirmAlert(
                  () => updateCourseStatus(!d.isActive, "isActive", d._id),
                  "Are You Sure You Want To Change Active Status?"
                )
              }
              color={d.isActive ? "green" : "red"}
            >
              {d.isActive ? "Active" : "Not Active"}
            </Tag>
          </Tooltip>
        </div>
      ),
      filters: [
        {
          text: "Active",
          value: true,
        },
        {
          text: "InActive",
          value: false,
        },
      ],
      onFilter: (value, record) => {
        record = Object.assign({}, record, {
          isActive: record.isActive || false,
        });
        return record.isActive === value;
      },
    },
    {
      title: "Created At",
      defaultSortOrder: 'descend',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      key: "createdAt",
      dataIndex: "createdAt",
      render: (d) => moment(d).format("DD-MM-YYYY"),
      width: 130,
    },
    {
      title: "Files Count",
      dataIndex: 'files',
      render: (d) => d?.length || 0,
    },
    {
      title: "Action",
      key: "action",
      width: 130,
      render: (d) => (
        <div>
          <Space>
            <Button
              size="small"
              type="default"
              onClick={() => history.push("/courses/" + d._id)}
            >
              Subjects
            </Button>
            <Button
              size="small"
              type="default"
              onClick={() => handleOpenFiles(d)}
            >
              Files
            </Button>
            <Dropdown placement="bottomLeft"
              overlay={
                <Menu>
                  <Menu.Item icon={<MessageOutlined />} onClick={() => sendMessage(d)}>
                    Notify
                  </Menu.Item>
                  <Menu.Item icon={<EditOutlined />} onClick={() => updateCourse(d)}>
                    Update
                  </Menu.Item>
                  <Menu.Item icon={<DeleteOutlined />} onClick={() => deleteCourse(d._id)}>
                    Delete
                  </Menu.Item>
                </Menu>
              }
            >
              <Button size="small">More</Button>
            </Dropdown>
          </Space>
        </div>
      ),
    },
  ];

  const [totalCourses, setTotalCourses] = useState(0)

  const queries = useQueryParams()
  const currentPage = parseInt(queries.get('page') || 1)

  useEffect(() => {
    setTotalCourses(courseList?.length)
  }, [courseList])

  useEffect(() => {
    if (currentPage) {
      history.push('/courses?page=' + currentPage)
    }
  }, [currentPage, history])

  const handleChange = (pagination, filters, sorter, extra) => {
    setTotalCourses(extra.currentDataSource?.length)

    changeSortInfo({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  const changePage = (page) => {
    history.push('/courses?page=' + page)
  }

  return (
    <div>
      <TotalCountBox count={totalCourses} title={'Courses'} />
      <br />
      <Table
        pagination={{ onChange: e => changePage(e), current: currentPage || 1 }}
        align="center"
        onChange={handleChange}
        bordered
        dataSource={courseList}
        columns={columns}
      />

      {addCourseDrawer ? (
        <AddCourseDrawer
          currentCourse={currentCourse}
          visible={addCourseDrawer}
          closeDrawer={closeDrawer}
        />
      ) : null}
      {filesDrawer ? <FilesDrawer visible={filesDrawer} closeModal={handleOpenFiles} course={filesDrawer} /> : null}
      {notifyModal ? <NotificationModal visible={notifyModal} closeModal={() => sendMessage()} notifiableType='Course' notifiableIds={[notifyModal]} /> : null}
    </div>
  );
};

const CourseDetailsView = () => {
  const params = useParams();
  const auth = useAuthUser();
  const dispatch = useDispatch();

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [addCourseSubjectDrawer, setAddCourseSubjectDrawer] = useState(false);
  const [studentListModal, setShowStudentModal] = useState(false);

  const { course, configData } = useSelector((state) => ({
    user: state.user,
    course: state.course,
    configData: state.lmsConfig,
  }));

  // useEffect(() => {
  //     dispatch(getDefaultDataAction({instituteId: auth.staff.institute._id}))
  // }, [auth.staff.institute._id, dispatch])

  // useEffect(() => {
  //     if(course.deleteCourseStatus === STATUS.SUCCESS && _.findIndex(course.courseList, c => c._id === params.id) === -1){
  //         history.push('/courses')
  //     }
  // }, [course.courseList, course.deleteCourseStatus, history, params.id])

  useEffect(() => {
    if (params.id)
      setSelectedCourse(_.find(course.courseList, (b) => b._id === params.id));
    else setSelectedCourse(null);
  }, [
    params.id,
    course.updateCourseStatus,
    course.getCoursesStatus,
    course.courseList,
  ]);

  const _addSubject = () => {
    setAddCourseSubjectDrawer(true);
    setCurrentCourse(selectedCourse);
  };

  const closeCourseSubjectDrawer = () => {
    setAddCourseSubjectDrawer(false);
    setCurrentCourse(null);
  };

  const _showStudentList = () => {
    setShowStudentModal(true);
    setCurrentCourse(selectedCourse);
  };

  return !selectedCourse ? (
    "Please Wait..."
  ) : (
    <div>
      <CommonPageHeader title="Course Details" />
      <br />
      <Card>
        <CourseDetails
          course={selectedCourse}
          addSubject={_addSubject}
          showStudentList={_showStudentList}
        />
      </Card>
      {addCourseSubjectDrawer ? (
        <AddCourseSubjectDrawer
          currentCourse={currentCourse}
          visible={addCourseSubjectDrawer}
          syllabus={configData.defaultData}
          closeDrawer={closeCourseSubjectDrawer}
        />
      ) : null}
      {studentListModal ? (
        <CourseStudentListModal
          currentCourse={currentCourse}
          showModal={studentListModal}
          closeModal={() => (
            setShowStudentModal(false), setCurrentCourse(null)
          )}
        />
      ) : (
        false
      )}
    </div>
  );
};

const CourseDetails = ({
  course,
  updateCourse,
  addSubject,
  showStudentList,
}) => {
  return (
    <div>
      {/*<Tabs onChange={key => changeTabs(key)} defaultValue={selectedTabs} type="card">
                <TabPane tab="Info" key="info">
                    <Descriptions bordered layout="vertical"
                        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                        extra={[<Button style={{marginRight:'10px'}} key='1' onClick={updateCourse} icon={<EditOutlined/>}>Update</Button>,
                            <Button danger icon={<DeleteOutlined/>} key='2' onClick={deleteCourse}>Delete</Button>
                        ]}
                    >
                        <Descriptions.Item label={<b>Name</b>}>{course.name}</Descriptions.Item>
                        <Descriptions.Item label={<b>Description</b>}>{course.description || '-'}</Descriptions.Item>
                        <Descriptions.Item label={<b>Code</b>}>{course.code || '-'}</Descriptions.Item>
                    </Descriptions>
                </TabPane>
                <TabPane tab="Subject | Content" key="subject-content">
                </TabPane>
            </Tabs>*/}
      <SubjectContent
        addSubject={addSubject}
        showStudentList={showStudentList}
        currentCourse={course}
        syllabus
      />
    </div>
  );
};

const SubjectContent = ({ addSubject, currentCourse, showStudentList }) => {
  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch()

  const [imageModal, openImageModal] = useState();
  const [updateSubjModal, updateSubject] = useState()
  const [deletingSubj, setDeletingSubj] = useState()
  const [orderModal, openOrderModal] = useState()
  const [teacherModal, openTeacherModal] = useState()
  const [selectedSubjectId, setSubjectId] = useState()

  const { deleteCourseSubjStatus, subjectOrderStatus, updateCourseSubjectStatus, user, courseSubjects, removeCourseTeacherStatus } = useSelector((state) => ({
    deleteCourseSubjStatus: state.course.deleteCourseSubjStatus,
    subjectOrderStatus: state.course.subjectOrderStatus,
    updateCourseSubjectStatus: state.course.updateCourseSubjectStatus,
    user: state.user.user,
    courseSubjects: state.course.courseSubjects || [],
    removeCourseTeacherStatus: state.course.removeCourseTeacherStatus
  }))

  const subjectIds = useMemo(() => currentCourse.subjects.map(sub => sub._id), [currentCourse])

  useEffect(() => {
    if (updateCourseSubjectStatus === STATUS.SUCCESS) {
      openTeacherModal(false)
      setSubjectId(null)
    }
  }, [updateCourseSubjectStatus])

  useEffect(() => {
    if (deleteCourseSubjStatus === STATUS.SUCCESS)
      setDeletingSubj(null)
  }, [deleteCourseSubjStatus])

  useEffect(() => {
    if (subjectOrderStatus === STATUS.SUCCESS)
      openOrderModal(false)
  }, [subjectOrderStatus])

  useEffect(() => {
    if (subjectIds?.length)
      dispatch(getCourseTeachersAction({ assignedToId: subjectIds }))
  }, [dispatch, subjectIds])

  const uploadImage = (subject) => {
    openImageModal(subject);
  };

  const _updateSubject = (d) => {
    updateSubject(d)
  }

  const _deleteSubject = (d) => {
    setDeletingSubj(d._id)
    ConfirmAlert(() => dispatch(deleteCourseSubjAction({ syllabusId: d._id, courseId: currentCourse._id })), 'Are you sure?', '', deleteCourseSubjStatus === STATUS.FETCHING)
  }

  const handleTeacherModal = (obj) => {
    if (obj)
      setSubjectId(obj._id)

    openTeacherModal(d => d ? null : obj)
  }

  const handleRemove = (teacher) => {
    dispatch(removeCourseTeacherAction({ doubtTeacherId: teacher._id }))
  }

  const columns = [
    {
      title: "Cover",
      key: "image",
      render: (d) => (
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {d.image && <Image src={d.image} style={{ objectFit: 'cover', width: '60pt', height: '60pt', border: '1px solid #D6DBDF' }} />}
        </div>
      ),
    },
    {
      title: "Name",
      key: "displayName",
      dataIndex: 'displayName'
    },
    {
      title: "Syllabus Template",
      key: "syllabusId",
      render: (d) => (
        // <Tooltip placement="top" title='Click To View'>
        <div>{d?.template?.name ? d.template.name.en : ""}</div>
      ),
      // </Tooltip>
    },
    {
      title: "Teachers",
      key: "teachers",
      dataIndex: 'teachers',
      render: (array) => (
        // <Tooltip placement="top" title='Click To View'>
        <Space wrap size={1}>
          {array?.length ? array.map(t =>
            <Popconfirm placement="top" title={'Sure?'} onConfirm={() => handleRemove(t)} okText="Remove" cancelText="No"
              okButtonProps={{ loading: removeCourseTeacherStatus === STATUS.FETCHING }}
            >
              <Tooltip title='Remove' placement="bottom">
                <Tag style={{ marginBottom: 5, cursor: 'pointer' }} icon={<CloseOutlined />}>{t.assignedTo?.name}</Tag>
              </Tooltip>
            </Popconfirm>
          )
            : null
          }
        </Space>
      ),
      // </Tooltip>
    },
    {
      title: "Subject",
      key: "subjectId",
      render: (d) => (d?.subject?.name ? d.subject.name.en : ""),
    },
    {
      title: "Actions",
      key: "actions",
      render: (d) => (
        <Space wrap>
          <Button size="small"
            onClick={(event) =>
              history.push("/courses/" + params.id + "/" + d.content)
            }
          >
            Content
          </Button>
          <Button size="small" onClick={() => handleTeacherModal(d)}>Assign Teacher</Button>
          <Button size="small" onClick={() => uploadImage(d)}>Upload Cover</Button>
          <Button size="small" onClick={() => _updateSubject(d)}>Edit</Button>
          <Button size="small" danger onClick={() => _deleteSubject(d)}>
            {deleteCourseSubjStatus === STATUS.FETCHING && deletingSubj == d._id ? 'deleting...' : 'Delete'}
          </Button>
        </Space>
      ),
    },
  ];

  const handleOrder = () => {
    openOrderModal(!orderModal)
  }

  const [filesModal, openFilesModal] = useState()
  const handleAddFiles = () => {
    openFilesModal(d => !d)
  }

  const handleTeachersAssign = (teachers, content) => {
    console.log('teachers', teachers)
    if (teachers.length) {
      let data = {
        teachers: teachers.map(t => t.user._id),
        course: currentCourse._id,
        courseSubject: selectedSubjectId,
        courseContent: content,
        assignedToIds: teachers.map(t => t.user._id),
        assignedBy: user._id,
      }
      dispatch(assignCourseTeacherAction(data))
    }
  }

  const allSubjects = useMemo(() => {
    return currentCourse.subjects?.length ?
      _.chain(currentCourse.subjects)
        .map(s => ({ ...s, order: parseInt(s.order) }))
        .orderBy(['order'], ['asc'])
        .map(s =>
          ({ ...s, teachers: _.filter(courseSubjects, courseSub => courseSub.courseContent === s.content) })
        )
        .value()
      :
      []
  }, [courseSubjects, currentCourse.subjects])

  console.log('user', courseSubjects, allSubjects)
  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <Text
          style={{ color: "#5D6D7E", fontWeight: "bold", fontSize: "25px" }}
        >
          {currentCourse.name}
        </Text>
      </div>
      <Divider style={{ margin: "10px 0 " }} />
      <br />
      <div style={{ padding: "" }}>
        <div
          style={{
            display: "flex",
            marginBottom: "10px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontSize: "18px", fontWeight: "bold", color: "#85929E" }}
          >
            Subject List
          </Text>
          <Space>
            <Button
              icon={<FileOutlined />}
              onClick={handleAddFiles}
            >
              Add Files
            </Button>
            <Button
              icon={<HddOutlined />}
              onClick={addSubject}
            >
              Add Subject
            </Button>
            <Button
              icon={<TeamOutlined />}
              onClick={showStudentList}
            >
              Student List
            </Button>
            <Button
              icon={<OrderedListOutlined />}
              onClick={handleOrder}
            >
              Change Order
            </Button>
          </Space>
        </div>
        <Table
          pagination={{ showSizeChanger: false, position: ['bottomCenter', 'topCenter'] }}
          bordered
          dataSource={allSubjects}
          columns={columns}
        />
      </div>
      {filesModal &&
        <AddFilesModal visible={filesModal} closeModal={handleAddFiles} />
      }
      {orderModal ?
        <OrderModal visible={orderModal} course={currentCourse}
          defaultData={currentCourse.subjects?.length ? _.orderBy(currentCourse.subjects, ['_id'], ['desc']) : []} closeModal={handleOrder}
        />
        : null
      }
      {updateSubjModal ? <UpdateSubjectModal visible={updateSubjModal} course={currentCourse} subject={updateSubjModal} closeModal={() => _updateSubject(null)} /> : null}
      {imageModal ? (
        <UploadImageModal
          subject={imageModal}
          visible={imageModal}
          closeModal={() => uploadImage()}
        />
      ) : null}
      {teacherModal ?
        <SelectTeacherModal
          disabled
          teachers={teacherModal.teachers?.length ? _.filter(teacherModal.teachers, t => t.assignedTo).map(t => t.assignedTo) : []}
          subject={teacherModal}
          onSubmit={(d) => handleTeachersAssign(d, teacherModal.content)}
          visible={teacherModal}
          closeModal={handleTeacherModal}
          status={updateCourseSubjectStatus}
        />
        : null
      }
    </div>
  );
};

const UpdateSubjectModal = ({ visible, closeModal, subject, course }) => {
  const dispatch = useDispatch()

  const { updateSubjectStatus } = useSelector(state => ({
    updateSubjectStatus: state.course.updateCourseSubjectStatus
  }))

  let [name, changeName] = useState(subject?.displayName)

  useEffect(() => {
    return () => dispatch(resetCourseSubjectStatus())
  }, [])

  useEffect(() => {
    if (updateSubjectStatus == STATUS.SUCCESS)
      closeModal()
  }, [updateSubjectStatus])

  const _changeName = (e) => {
    changeName(e.target.value)
  }

  const updateSubject = () => {
    dispatch(updateCourseSubjectAction({ displayName: name, courseId: course._id, subjectId: subject._id }))
  }

  return (
    <Modal title='Edit Subject' okButtonProps={{ disabled: !name }} confirmLoading={updateSubjectStatus == STATUS.FETCHING} onOk={updateSubject} visible={visible} onCancel={closeModal}>
      <Form onFinish={updateSubject}>
        <Form.Item label='Name'>
          <Input placeholder='name' value={name} onChange={_changeName} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

const UploadImageModal = ({ visible, closeModal, subject }) => {
  const dispatch = useDispatch();
  const params = useParams();
  const { addContentImageStatus } = useSelector((state) => ({
    addContentImageStatus: state.course.addContentImageStatus,
  }));
  const [image, changeImage] = useState();

  useEffect(() => {
    return () => dispatch(resetAddContentImage());
  }, []);

  useEffect(() => {
    if (addContentImageStatus == STATUS.SUCCESS) closeModal();
  }, [addContentImageStatus]);

  const _changeImage = (e) => {
    if (e?.file?.response) changeImage(e.file.response.url);
  };

  const uploadImage = () => {
    dispatch(
      addContentImageAction({
        image,
        courseContentId: subject.content,
        courseId: params.id,
        subjectId: subject._id,
      })
    );
  };

  return (
    <Modal
      visible={visible}
      title="Upload Image"
      okText="Upload"
      okButtonProps={{
        loading: addContentImageStatus == STATUS.FETCHING,
      }}
      onOk={uploadImage}
      onCancel={closeModal}
    >
      <UploadImageBox defaultImg={subject.image} getImage={_changeImage} />
      {/* <Upload
                showUploadList={false}
                name="file"
                action= {BaseURL+"app/image"}
                listType="picture-card"
                accept="image/png, image/jpeg"
                onChange={changeImage}
            >
                {uploadButton}
            </Upload> */}
    </Modal>
  );
};
