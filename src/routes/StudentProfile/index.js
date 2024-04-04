import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Empty,
  Row,
  Form,
  Button,
  Space,
  Modal,
  Select,
  Input,
  Tabs,
  Image,
} from "antd";
import Text from "antd/lib/typography/Text";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import _, { filter, find, map, omit } from "lodash";

import { printHelper, PRINT_TYPE, STATUS } from "../../Constants";
import { assignBatchAction, getStudentAction, getStudentAssignBatchAction } from "../../redux/reducers/student";
import { UpdateProfile } from "../../components/UpdateStudentProfile";
import { UpdateAddress } from "../../components/UpdateStudentAddress";
import { ProfilePicModal } from "./ProfilePicModal";
import { AssignPackage } from "./AssignStudentPackage";
import { CommonPageHeader } from "../../components/CommonPageHeader";
import { apis } from "../../services/api/apis";
import { StudentPortalURL } from "../../BaseUrl";
import { getEnquiryAction, resetBatchStatus } from "../../redux/reducers/offlineEnquiry/Enquiry";
import { getOfflineCourseAction } from "../../redux/reducers/offlineEnquiry/OfflineCourse";
import { getBatchRequest, getStudentInstallment } from "../../redux/reducers/batches";
import { useCheckStatus } from "../../utils/useCheckStatus";
import AssignBatch from "./AssignBatch";
import BatchPayment, { CollectBatchPayment } from "./BatchPayment";
import BatchInstallment from "./BatchPayment";
import StudentPaymentHistory from "./StudentPaymentHistory";
import { getAllCenterAction } from "../../redux/reducers/center";
import StudentBatchInventory from "./StudentBatchInventory";
import { AdmissionForm } from "./AdmissionPayment";
import { getDeliveredItemList, getInventoryItemAction, getReceivedItemList } from "../../redux/reducers/inventory";
import { UserSwitchOutlined } from '@ant-design/icons';
import axios from "axios";

export const StudentProfile = () => {
  const dispatch = useDispatch();
  const [] = Form.useForm();
  const params = useParams();

  const { student, course, assignCourseStatus, assignPkgStatus } = useSelector(
    (state) => ({
      student: state.student,
      instituteId: state.user.user?.staff.institute._id,
      institute: state.instituteStaff,
      batches: state.batches,
      assignCourseStatus: state.student.studCoursesAssignStatus,
      assignPkgStatus: state.student.assignPkgStatus,
    })
  );

  const [updateProfileDrawer, setUpdateProfileDrawer] = useState(false);
  const [updateAddressDrawer, setUpdateAddressDrawer] = useState(false);
  const [imageModal, openImageModal] = useState();
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    dispatch(getStudentAction({ userId: params.id }));
    dispatch(getEnquiryAction({ userId: params.id }))
  }, [params.id, dispatch]);




  const fetchData = async () => {
    try {
      const userId = params.id;
      console.log("userId....", userId);
      const response = await axios.get('https://api.competitioncommunity.com/user/getModeratorStatus', {
        params: {
          userId: userId
        }
      });

      console.log("request made..", response.data);

      if (response.data.isModerator === true) {
        setRole("Moderator");
      } else {
        setRole("Student");
      }
    } catch (error) {
      console.error("Error:", error);

    }
  };


  const { allEnquirys } = useSelector(s => s.enquiry)

  const { allOfflineCourses, getOfflineCourseStatus } = useSelector(s => s.offlineCourse)
  const { batch, getBatchStatus } = useSelector(s => s.batches)
  const { studentAssignedBatch, getAssignBatchStatus } = useSelector(s => s.student)

  useEffect(() => {
    dispatch(getStudentAssignBatchAction({ user: params.id }))
    if (getOfflineCourseStatus !== STATUS.SUCCESS) {
      dispatch(getOfflineCourseAction())
    }
    if (getBatchStatus !== STATUS.SUCCESS) {
      dispatch(getBatchRequest())
    }
  }, [dispatch, getBatchStatus, getOfflineCourseStatus, params.id])

  useEffect(() => {
    if (
      assignCourseStatus === STATUS.SUCCESS ||
      assignPkgStatus === STATUS.SUCCESS
    )
      dispatch(getStudentAction({ userId: params.id }));
  }, [assignCourseStatus, dispatch, assignPkgStatus, params.id]);

  useEffect(() => {
    if (student.updateStudentStatus === STATUS.SUCCESS)
      setUpdateProfileDrawer(false);
  }, [student.updateStudentStatus]);


  useEffect(() => {
    dispatch(getStudentInstallment({ userId: student.currentStudent?.user?._id }))
  }, [student.currentStudent?.user?._id, dispatch])

  const { studentInstallments } = useSelector(s => s.batches)

  const openImage = (img) => {
    openImageModal(img);
  };

  const [loading, setLoading] = useState();
  const _studentLogin = async () => {
    const resp = await apis.studentLoginApi({
      userId: student.currentStudent.user._id,
    });
    setLoading(true);
    if (resp.ok) {
      setLoading();
      window.open(StudentPortalURL + "?token=" + resp.data.token);
    }
  };

  const _viewWebsiteProfile = () => {
    _studentLogin();
  };


  const handleModerator = async () => {
    try {
      const response = await axios.patch('https://api.competitioncommunity.com/user/updateModerator', {
        userId: params.id
      });
      console.log('Request successful:', response.data.data);
      const isModerator = response.data.data.isModerator;
      if (isModerator) {
        setRole("Moderator");

      } else {
        setRole("Student")
      }

    } catch (error) {
      console.error('Request failed:', error);
    }
  }

  const currentStudent = student.currentStudent && student.currentStudent.user;
  return (
    <div style={{ margin: "0 130px" }}>
      {student.getStudentStatus === STATUS.SUCCESS && currentStudent ? (
        <>
          <div style={{ position: "relative" }}>
            <CommonPageHeader title={"Profile"} />
            <br />
            <div style={{ height: "110px" }} className="profileContainer"></div>
            <Card style={{ paddingTop: "90px" }}>
              {currentStudent.avatar ? (
                <Avatar
                  className="profileImg"
                  onClick={() => openImage(currentStudent)}
                  style={{
                    position: "absolute",
                    top: -90,
                    cursor: "pointer",
                    background: "white",
                  }}
                  size={180}
                  src={currentStudent.avatar}
                />
              ) : (
                <div
                  style={{
                    position: "absolute",
                    width: "180px",
                    height: "180px",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    border: "2px solid #348A7A",
                    alignItems: "center",
                    top: -90,
                    cursor: "pointer",
                    background: "white",
                  }}
                  onClick={() => openImage(currentStudent)}
                >
                  Upload Pic
                </div>
              )}
              <Row>
                <Col span={20}>
                  <Text style={{ fontSize: "30px" }}>
                    {currentStudent.name}
                  </Text>
                  <br />
                </Col>
                <Col span={4} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Button onClick={handleModerator}>
                      <UserSwitchOutlined style={{ fontSize: "24px", marginRight: "5px" }} />
                    </Button>

                    <span>{role}</span>
                  </div>
                  <Button
                    loading={loading}
                    onClick={_viewWebsiteProfile}
                    style={{
                      background: "#348A7A",
                      color: "white",
                      border: "none",
                      marginTop: "10px", // Add some spacing between the buttons
                    }}
                  >
                    Open Student Portal
                  </Button>
                </Col>
              </Row>
            </Card>
          </div>
          {allEnquirys?.docs?.length && filter(allEnquirys?.docs, doc => doc.status === "OPEN" || doc.status === "CHEQUE_PAYMENT")?.length ?
            <>
              <br />
              <Enquiry allEnquirys={allEnquirys} allOfflineCourses={allOfflineCourses} currentStudent={student.currentStudent} />
            </>
            :
            null
          }
          <br />
          <PersonalInfo
            currentStudent={currentStudent}
            student={student}
            updateProfile={() => setUpdateProfileDrawer(true)}
            userId={params.id}
          />
          <br />
          <Address
            currentStudent={student.currentStudent}
            updateAddress={() => setUpdateAddressDrawer(true)}
          />
          <br />
          {allEnquirys?.docs?.length && filter(allEnquirys?.docs, doc => doc.status === "ADMITTED")?.length ?
            <Courses allEnquirys={allEnquirys} allOfflineCourses={allOfflineCourses} assignBatchStatus={student.assignBatchStatus} batch={batch} studentAssignedBatch={studentAssignedBatch} currentStudent={student.currentStudent} />
            :
            null
          }
          <Image style={{ display: "none" }} src={"/images/student-id-card.png"} />
          {studentAssignedBatch?.length ?
            <Batches allOfflineCourses={allOfflineCourses} batches={batch} studentAssignedBatch={studentAssignedBatch} currentStudent={student.currentStudent} />
            :
            null
          }
          {studentAssignedBatch?.length ?
            <>
              <br />
              <BatchInventory batches={batch} currentStudent={student.currentStudent} studentAssignedBatch={studentAssignedBatch} />
            </>
            :
            null
          }
          {studentInstallments?.length ?
            <>
              <br />
              <CollectTutionFees allOfflineCourses={allOfflineCourses} batches={batch} currentStudent={student.currentStudent} studentAssignedBatch={studentAssignedBatch} />
            </>
            :
            null
          }
          <br />
          <AssignPackage course={course} student={student.currentStudent} />
          {/* <br/>
          <AssignCourses course={course} student={student.currentStudent}/> */}
        </>
      ) : student.getStudentStatus === STATUS.FETCHING ? (
        <Card loading={student.getStudentStatus === STATUS.FETCHING}></Card>
      ) : (
        <Card>
          <Empty description="something went wrong" />
        </Card>
      )}

      {updateProfileDrawer ? (
        <UpdateProfile
          currentStudent={student.currentStudent}
          visible={updateProfileDrawer}
          closeDrawer={() => setUpdateProfileDrawer(false)}
        />
      ) : null}
      {updateAddressDrawer ? (
        <UpdateAddress
          currentStudent={student.currentStudent}
          visible={updateAddressDrawer}
          closeDrawer={() => setUpdateAddressDrawer(false)}
        />
      ) : null}
      {imageModal ? (
        <ProfilePicModal
          closeModal={() => openImageModal(null)}
          visible={imageModal}
          student={currentStudent}
        />
      ) : null}
      <br />
    </div>
  );
};

const PersonalInfo = ({ currentStudent, student, updateProfile, userId }) => {
  const [viewMoreDetails, setToggleViewMore] = useState(null)
  return (
    <Card>
      <Descriptions
        extra={[
          <Button
            type="link"
            onClick={() => updateProfile()}
            icon={<EditOutlined style={{ fontSize: "30px" }} />}
          ></Button>,
        ]}
        title={<Text style={{ fontSize: "18px" }}>Personal Information</Text>}
        bordered
      >
        <Descriptions.Item label="Gender">
          {currentStudent.gender}
        </Descriptions.Item>
        <Descriptions.Item label="Date of Birth">
          {(currentStudent.dob &&
            moment(currentStudent.dob).format("DD-MM-YYYY")) ||
            "-"}
        </Descriptions.Item>
        <Descriptions.Item label="E-mail">
          {" "}
          {currentStudent.email || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Contact Number">
          {currentStudent.contact || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Username">
          {currentStudent.username || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Details">
          <Button
            type="link"
            onClick={() => setToggleViewMore(student)}
          >View More Details</Button>
        </Descriptions.Item>
      </Descriptions>
      {viewMoreDetails &&
        <Modal width="800px" title='Student Details' okText='Update' visible={true} footer={false} onCancel={() => setToggleViewMore(null)} >
          <AdmissionForm student={student} userId={userId} updateData={viewMoreDetails} closeModal={() => setToggleViewMore(null)} />
        </Modal>
      }
    </Card>
  );
};

const Courses = ({ allEnquirys, assignBatchStatus, studentAssignedBatch, batch, currentStudent, allOfflineCourses }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch()
  const [toggleAssignBatch, setToggleAssignBatch] = useState(null)

  const handleBatchModal = (batch, course) => {
    setToggleAssignBatch({ batch, course })
  }
  const closeDrawer = () => {
    setToggleAssignBatch(null)
  }

  const _assignBatch = (data) => {
    dispatch(assignBatchAction({ batchDetails: { ...omit(data, 'batchId', 'userId') }, batch: data.batch, userId: data.userId }))
  }

  const { allCenterList, getAllCenterStatus } = useSelector(s => s.center)
  useEffect(() => {
    if (getAllCenterStatus !== STATUS.SUCCESS) {
      dispatch(getAllCenterAction())
    }
  }, [dispatch, getAllCenterStatus])

  useCheckStatus({
    status: assignBatchStatus,
    onSuccess: () => {
      dispatch(resetBatchStatus())
      setToggleAssignBatch(null)
    },
  }, [assignBatchStatus]);

  const handlePrint = (assignedBatch, studentBatchData) => {
    printHelper(PRINT_TYPE.PRINT_ID_CARD, { isPrint: true, currentStudent: currentStudent, assignedBatch: assignedBatch, allCenterList: allCenterList, studentBatchData })
  }
  return (
    <Card>
      {allEnquirys?.docs?.length ?
        map(filter(allEnquirys.docs, doc => doc.status === 'ADMITTED'), (enquiry, i) => {
          const studentCourse = find(allOfflineCourses, course => course._id === enquiry?.course)
          const studentBatchData = map(studentCourse?.batches, stdBatch => find(studentAssignedBatch, batch => batch?.batch === stdBatch))
          const assignedBatch = map(studentCourse?.batches, stdBatch => find(batch, b => b._id === find(studentAssignedBatch, batch => batch?.batch === stdBatch)?.batch))
          return (
            <Descriptions
              key={i}
              title={<Text style={{ fontSize: "18px" }}>{i < 1 ? "Courses" : ''}</Text>}
              bordered
              style={{ fontSize: "18px" }}
            >
              <Descriptions.Item label="Course">
                {studentCourse?.name || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Batch">
                {assignedBatch?.[0] ?
                  assignedBatch[0]?.name :
                  <Button
                    type="link"
                    onClick={() => handleBatchModal(studentCourse?.batches, studentCourse)}
                  >Assign Batch</Button>
                }
              </Descriptions.Item>
              <Descriptions.Item label="Print Id Card">
                <Button
                  type="link"
                  onClick={() => handlePrint(assignedBatch, studentBatchData)}
                >Print</Button>
              </Descriptions.Item>
            </Descriptions>
          )
        })
        :
        null
      }
      {toggleAssignBatch &&
        <AssignBatch _assignBatch={_assignBatch} assignBatchStatus={assignBatchStatus} toggleAssignBatch={toggleAssignBatch} batch={batch} currentStudent={currentStudent} closeDrawer={closeDrawer} />
      }
    </Card>
  )
}

const Batches = ({ allOfflineCourses, batches, currentStudent, studentAssignedBatch }) => {
  const dispatch = useDispatch()
  const [toggleAddInstallment, setToggleAddInstallment] = useState(null)
  const [togglePaymentModal, setTogglePaymentModal] = useState(null)
  const [toggleInventory, setToggleInventory] = useState(null)

  useEffect(() => {
    dispatch(getStudentInstallment({ userId: currentStudent.user._id }))
    dispatch(getDeliveredItemList({ user: currentStudent.user._id }))
    dispatch(getInventoryItemAction())
  }, [currentStudent.user._id, dispatch])

  const { studentInstallments } = useSelector(s => s.batches)
  const { studentDeliveredItem, allInventoryItem, getDeliveredItemListStatus } = useSelector(s => s.inventory)
  // const handlepaymentModal = (batchDetail, batch, installments) => {
  //   setTogglePaymentModal({ batchDetail, batch, installments })
  // }
  const handleInstallmentModal = (batchDetail, batch) => {
    setToggleAddInstallment({ batchDetail, batch })
  }
  const closeModal = () => {
    setToggleAddInstallment(null)
    setTogglePaymentModal(null)
    setToggleInventory(null)
  }

  return (
    <Card>
      {map(studentAssignedBatch, (batch, i) => {
        const batchDetail = find(batches, b => b._id === batch.batch)
        const installments = find(studentInstallments, i => i.batch === batch.batch)
        const batchDeliveredItem = filter(studentDeliveredItem, item => item.batch === batch.batch)
        return (
          <Descriptions key={batch._id}
            title={<Text style={{ fontSize: "18px" }}>{i < 1 ? "Batches" : ''}</Text>}
            bordered
            style={{ fontSize: "18px" }}
          >
            <Descriptions.Item label="Batch">
              {batchDetail?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Admission Date">
              {moment(batch?.offlieBatchDetails?.admissionDate).format("DD-MM-YYYY")}
            </Descriptions.Item>
            {installments ?
              <>
                <Descriptions.Item label="Due Amount">
                  {installments.dueAmount}
                </Descriptions.Item>

                {installments.installments?.length ?
                  map(installments.installments, (installment, i) => (
                    <>
                      <Descriptions.Item label={"Installment " + (i + 1)}>
                        <Row>Amount: {installment.amount}</Row>
                        <Row>Due Date: {moment(installment.dueDate).format("DD-MM-YYYY")}</Row>
                      </Descriptions.Item>
                    </>
                  ))
                  :
                  null
                }
              </>
              :
              null
            }
            {!installments ?
              <Descriptions.Item label="Payment">
                <Button
                  type="link"
                  onClick={() => handleInstallmentModal(batchDetail, batch)}
                >Add Installments</Button>
              </Descriptions.Item>
              :
              null
            }

            {/* <Descriptions.Item label="Inventory">
              <Button
                type="link"
                onClick={() => setToggleInventory({ batchDetail, batchDeliveredItem })}
              >Add Delivered Item</Button>
            </Descriptions.Item>
            <Descriptions.Item label="Delivered Item">
              {map(batchDeliveredItem, (delivered, i) => {
                const itemName = find(allInventoryItem, item => item._id === delivered.inventoryItem)?.name
                return (
                  <Row key={delivered._id}>{itemName + " - " + moment(delivered.deliveryDate).format("DD-MM-YYYY") + (batchDeliveredItem.length === i + 1 ? "" : ", ")}</Row>
                )
              })}
            </Descriptions.Item> */}
          </Descriptions>
        )
      })}
      {togglePaymentModal &&
        <CollectBatchPayment visible={togglePaymentModal} currentStudent={currentStudent} closeModal={closeModal} />
      }
      {toggleAddInstallment &&
        <BatchInstallment visible={toggleAddInstallment} currentStudent={currentStudent} closeModal={closeModal} />
      }
      {/* {toggleInventory &&
        <StudentBatchInventory closeModal={closeModal} data={toggleInventory} currentStudent={currentStudent} />} */}
    </Card>
  )
}
const BatchInventory = ({ batches, currentStudent, studentAssignedBatch }) => {
  return (
    <Card>
      <Descriptions
        title={<Text style={{ fontSize: "18px" }}>Batch Inventory</Text>}
        bordered
        style={{ fontSize: "18px" }}
      ></Descriptions>

      <Tabs defaultActiveKey="1">
        {map(studentAssignedBatch, (batch, i) => {
          const batchDetail = find(batches, b => b._id === batch.batch)
          return (
            <Tabs.TabPane key={i + 1} tab={batchDetail?.name}>
              {/* <CollectBatchPayment visible={{ batchDetail, batch, installments }} currentStudent={currentStudent} allOfflineCourses={allOfflineCourses} /> */}
              <StudentBatchInventory currentStudent={currentStudent} batchDetail={batchDetail} />
            </Tabs.TabPane>
          )
        })}
        {/* <Tabs.TabPane tab={"Transaction History"}>
          <StudentPaymentHistory currentStudent={currentStudent} />
        </Tabs.TabPane> */}
      </Tabs>
    </Card>
  )
}

const CollectTutionFees = ({ allOfflineCourses, batches, currentStudent, studentAssignedBatch }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getStudentInstallment({ userId: currentStudent.user._id }))
  }, [currentStudent.user._id, dispatch])

  const { studentInstallments } = useSelector(s => s.batches)

  return (
    <Card>
      <Descriptions
        title={<Text style={{ fontSize: "18px" }}>Collect Tution Fees</Text>}
        bordered
        style={{ fontSize: "18px" }}
      ></Descriptions>

      <Tabs defaultActiveKey="1">
        {map(studentAssignedBatch, (batch, i) => {
          const batchDetail = find(batches, b => b._id === batch.batch)
          const installments = find(studentInstallments, i => i.batch === batch.batch)
          return (
            <Tabs.TabPane key={i + 1} tab={batchDetail?.name}>
              <CollectBatchPayment visible={{ batchDetail, batch, installments }} currentStudent={currentStudent} allOfflineCourses={allOfflineCourses} />
            </Tabs.TabPane>
          )
        })}
        <Tabs.TabPane tab={"Transaction History"}>
          <StudentPaymentHistory currentStudent={currentStudent} />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  )
}

const Address = ({ currentStudent, updateAddress }) => {
  return (
    <Card>
      <Descriptions
        title={<Text style={{ fontSize: "18px" }}>Address</Text>}
        bordered
        style={{ fontSize: "18px" }}
        extra={[
          <Space size="large">
            <Button
              onClick={updateAddress}
              icon={<EditOutlined style={{ fontSize: "30px" }} />}
              type="link"
            ></Button>
            {/* <Button onClick={updateAddress} icon={<PlusOutlined style={{fontSize:"30px"}} />} type='link'></Button> */}
          </Space>,
        ]}
      >
        <>
          <Descriptions.Item label="Address" span={4}>
            {currentStudent.address?.address || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="State">
            {currentStudent.address?.state || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="City">
            {currentStudent.address?.city || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Pincode">
            {currentStudent.address?.pincode || "-"}
          </Descriptions.Item>
        </>
      </Descriptions>
    </Card>
  );
};

const Enquiry = ({ allEnquirys, allOfflineCourses, currentStudent }) => {
  const history = useHistory()
  const enquiry = allEnquirys?.docs?.[0]
  const studentCourse = find(allOfflineCourses, course => course._id === enquiry?.course)

  return (
    <Card>
      {enquiry ?
        <Descriptions
          title={<Text style={{ fontSize: "18px" }}>Enquiry</Text>}
          bordered
          style={{ fontSize: "18px" }}
        >
          <Descriptions.Item label="Course" span={2}>
            {studentCourse?.name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Admission">
            <Button type="link" onClick={() => history.push('/admission/payment/' + currentStudent.user._id + '/' + studentCourse?._id + "/" + enquiry._id)}
            >Admit Student</Button>
          </Descriptions.Item>
          <Descriptions.Item label="Created At" span={2}>
            {moment(enquiry?.createdAt).format('DD-MM-YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {enquiry?.status}
          </Descriptions.Item>
        </Descriptions>
        :
        null
      }

    </Card>
  )
}