import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SelectOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Descriptions,
  Drawer,
  Empty,
  Form,
  Input,
  List,
  Radio,
  Select,
  Space,
  Tooltip,
} from "antd";
import Title from "antd/lib/typography/Title";
import React, { useCallback, useMemo } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuthUser } from "../../App/Context";
import { STATUS } from "../../Constants";
import {
  assignStudPkgAction,
  getStudentAddressAction,
  removeStudPkgeAction,
  resetAssignPkg,
} from "../../redux/reducers/student";
import _, { find } from "lodash";
import { ConfirmAlert } from "../../Constants/CommonAlerts";
import Text from "antd/lib/typography/Text";
import { useHistory } from "react-router";
import { bilingualText } from "../../utils/FileHelper";
import moment from "moment";
import { EditStudentPackageModal } from "./EditStudentPackageModa";
import { getStatesAction } from "../../redux/reducers/states";
import { SelectPackageModal } from "../ManagePackages/SelectPackageModal";
import { PackageValidtyModal } from "./PackageValidtyModal";

export const DURATION_TYPE = {
  d: "Days",
  w: "Weeks",
  m: "Months",
  y: "Years",
};

export const AssignPackage = ({ student }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showDrawer, changeShowDrawer] = useState();
  const [editPkgModal, openEditPkg] = useState();
  const [validityModal, openValidityModal] = useState();

  const {
    removePackageStatus,
    getStudentAddressStatus,
    updateStudentPackageStatus,
  } = useSelector((state) => ({
    removePackageStatus: state.student.removeStudPkgStatus,
    getStudentAddressStatus: state.student.getStudentAddressStatus,
    updateStudentPackageStatus: state.student.updateStudentPackageStatus,
  }));

  useEffect(() => {
    if (updateStudentPackageStatus === STATUS.SUCCESS) openValidityModal();
  }, [updateStudentPackageStatus]);

  useEffect(() => {
    if (student)
      dispatch(getStudentAddressAction({ userId: student.user._id }));
  }, [dispatch, student]);

  const _changeShowDrawer = () => {
    changeShowDrawer(!showDrawer);
  };

  const removePackage = (id) => {
    ConfirmAlert(
      () =>
        dispatch(
          removeStudPkgeAction({
            studentId: student._id,
            packageId: id,
            remove: true,
          })
        ),
      "Are you sure?",
      null,
      removePackageStatus == STATUS.FETCHING
    );
  };

  const calculateDays = (endDate) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date();
    const secondDate = new Date(endDate);

    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
  };

  const openCourse = (id) => {
    history.push("/courses/" + id);
  };

  const openPaackage = (id) => {
    history.push("/update-package/1/" + id);
  };

  const handleEditPackage = (pkg) => {
    openEditPkg(pkg);
  };

  const _addValidity = (pkg) => {
    openValidityModal((d) => (d ? null : pkg));
  };

  return (
    <Card loading={getStudentAddressStatus === STATUS.FETCHING}>
      {validityModal && (
        <PackageValidtyModal
          student={student}
          packageDetails={validityModal}
          visible={validityModal}
          closeModal={_addValidity}
        />
      )}
      <Title style={{ fontSize: "18px" }}>
        Packages
        <Button
          type="link"
          style={{ float: "right" }}
          onClick={_changeShowDrawer}
          icon={<PlusOutlined style={{ fontSize: "30px" }} />}
        ></Button>
      </Title>

      <br />

      {/* <Table dataSource={student.packages} bordered pagination={false}>
            <Table.Column title='Package' 
                render={d => bilingualText(d.package?.name)}
            ></Table.Column>
            <Table.Column title='Assigned On' 
                render={d => moment(d.assignedOn).format('DD-MM-YYYY')}
            ></Table.Column>
        </Table> */}
      {student.packages?.length ? (
        <div>
          {_.orderBy(student.packages, ["assignedOn"], ["desc"]).map((c) => {
            let pkg = c.package;
            let courses =
              c.package.courses?.length && student.courses?.length
                ? _.intersectionBy(
                    student.courses.map((d) => {
                      return {
                        ...d,
                        courseId: d.course?._id,
                      };
                    }),
                    pkg.courses.map((d) => ({ courseId: d })),
                    "courseId"
                  )
                : [];

            return (
              <>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #D6DBDF",
                    margin: "0 0 30px 0",
                  }}
                >
                  {/* <div>
                                    {pkg.carousel?.length ? 
                                        <div style={{overflow:'hidden', textAlign:'center', background:'#F5F5F5'}}>
                                            <Image preview={false} style={{objectFit:'cover', width: 240, height: 150}} src={pkg.carousel[0]}/>
                                        </div>
                                        :
                                        <div style={{padding:'45px', display:'flex', justifyContent:'center', width: 240, height: 150, background:'#F5F5F5'}}>
                                            <FileImageOutlined style={{fontSize:'80px'}} />
                                        </div>
                                    }
                                </div> */}
                  <div style={{ padding: "0 0 0 20px", flexGrow: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ paddingRight: 20 }}>
                        {pkg ? (
                          <Text style={{ fontSize: "18px", color: "#3498DB" }}>
                            {pkg.name?.en}{" "}
                            {pkg.name?.en && pkg.name?.hn ? " / " : null}{" "}
                            {pkg.name?.hn}{" "}
                            {pkg.slug ? "(" + pkg.slug + ")" : ""}
                          </Text>
                        ) : (
                          <Text></Text>
                        )}
                      </div>
                      <Space>
                        <Button
                          size="small"
                          icon={<EditOutlined />}
                          style={{ width: 100 }}
                          onClick={() => _addValidity(c)}
                        >
                          Validity
                        </Button>
                        <Button
                          size="small"
                          icon={<DeleteOutlined />}
                          style={{ width: 100 }}
                          onClick={() => removePackage(pkg._id)}
                        >
                          Remove
                        </Button>
                        <Button
                          size="small"
                          icon={<EditOutlined />}
                          style={{ width: 100 }}
                          onClick={() => handleEditPackage(c)}
                        >
                          Edit
                        </Button>
                      </Space>
                    </div>
                    {/* <Divider style={{margin:'10px'}}/> */}
                    <Space
                      direction="vertical"
                      style={{ fontSize: "13px", marginTop: 10, width: "100%" }}
                      size={6}
                    >
                      {/* <Row>
                                            <Col span={8}>
                                                <Text>Mode: </Text> <b>{pkg.mode}</b>
                                            </Col>
                                            <Col span={8}>
                                                <Text>Medium: </Text> <b>{_.capitalize(pkg.medium)}</b>
                                            </Col>
                                            <Col span={8}>
                                                <Text>Target Year: </Text> <b>{pkg.targetYear}</b>
                                            </Col>
                                        </Row> */}
                      <Space size={30}>
                        {/* <Col span={8}>
                                                <Text>Target Year: </Text> <b>{pkg.targetYear}</b>
                                            </Col> */}
                        <div>
                          <Text>Assign On:</Text>{" "}
                          <b>{moment(c.assignedOn).format("DD-MM-YYYY")}</b>
                        </div>
                        <div>
                          <Text>Content Type:</Text>{" "}
                          <b>{_.capitalize(pkg.type)}</b>
                        </div>
                        {pkg.tests?.length ? (
                          <Text>
                            Tests:<b> {pkg.tests.length}</b>
                          </Text>
                        ) : null}
                        {pkg.assignments?.length ? (
                          <Text>
                            Assignments:<b> {pkg.assignments.length}</b>
                          </Text>
                        ) : null}
                        {pkg.books?.length ? (
                          <Text>
                            Books:<b> {pkg.books.length}</b>
                          </Text>
                        ) : null}
                        {pkg.drives?.length ? (
                          <Text>
                            Drives:<b> {pkg.drives.length}</b>
                          </Text>
                        ) : null}
                        {pkg.magazines?.length ? (
                          <Text>
                            Magazines:<b> {pkg.magazines.length}</b>
                          </Text>
                        ) : null}
                        {/* <Col span={12}>
                                                <Text>Expire On: </Text> <b>{c.package.endDate ? moment(c.package.endDate).format('DD-MM-YYYY') : '-'}</b>
                                            </Col> */}
                      </Space>
                      {c.validity?.date && (
                        <Space size={30} style={{ marginTop: 4 }}>
                          <Space>
                            <Text>Validity:</Text>
                            <Text type="danger">
                              {moment(c.validity.date).format("ll")}
                            </Text>
                          </Space>
                          <Space>
                            <Text>Remark:</Text>
                            <Text type="secondary">
                              {c.validity.remark || "-"}
                            </Text>
                          </Space>
                        </Space>
                      )}
                      {pkg.type === "COURSE" && courses.length ? (
                        <div>
                          <br />
                          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                            Courses{" "}
                          </Text>
                          <br />
                          <Space size="large" wrap={true}>
                            {courses.map((cr) => (
                              <div
                                key={cr._id}
                                style={{
                                  borderRight: "1px solid #D6DBDF",
                                  padding: "10px 10px 10px 0",
                                }}
                              >
                                <Text
                                  type="secondary"
                                  style={{ fontWeight: "bold" }}
                                >
                                  {cr?.course?.name}
                                </Text>
                                <br />
                                {/* <Text>Reference Id: <b>{cr.code || '-'}</b></Text><br/> */}
                                <Space size="large">
                                  <Text>
                                    Start on:{" "}
                                    <b>
                                      {cr.assignedOn
                                        ? moment(cr.assignedOn).format(
                                            "DD-MM-YYYY"
                                          )
                                        : "-"}
                                    </b>
                                  </Text>
                                  <Text>
                                    Expire on:{" "}
                                    <b>
                                      {cr.expireOn
                                        ? moment(cr.expireOn).format(
                                            "DD-MM-YYYY"
                                          )
                                        : "-"}
                                    </b>
                                  </Text>
                                </Space>
                                <br />
                                {/* <Text>Active: <Tag color={cr.isActive ? 'success' : 'error'}>{cr.isActive ? 'Active' : 'Not Active'}</Tag></Text><br/> */}
                                {/* {cr.subjects?.length ? 
                                                                <Text>Subjects : <b>{_.join(cr.subjects.map(sub => sub.displayName), ', ')}</b></Text> 
                                                                : null
                                                            } */}
                                {/* <Tag onClick={() => openCourse(cr._id)} style={{cursor:'pointer'}} color='processing' key={cr._id}>{cr.name}</Tag> */}
                              </div>
                            ))}
                          </Space>
                        </div>
                      ) : null}
                      {/* <Row>
                                            <Col>
                                                <Text>Price: </Text>
                                                <Text type="success" style={{fontWeight:'bold', fontSize:'16px'}}>₹ {pkg.price}</Text>&nbsp;&nbsp;&nbsp;
                                                {pkg.fakePrice ?  <Text style={{fontWeight:''}} type='secondary' delete>₹ {pkg.fakePrice}</Text>  : null}
                                            </Col>
                                        </Row> */}
                    </Space>
                  </div>
                </div>
                {/* <Card style={{margin:10}}
                                cover={
                                    pkg.carousel?.length ? 
                                        <div style={{overflow:'hidden', textAlign:'center', background:'#F5F5F5'}}>
                                            <Image preview={false} style={{objectFit:'cover', width: 310, height: 180}} src={pkg.carousel[0]}/>
                                        </div>
                                        :
                                        <div style={{padding:'45px', display:'flex', justifyContent:'center', width: 310, height: 180, background:'#F5F5F5'}}>
                                            <FileImageOutlined style={{fontSize:'80px'}} />
                                        </div>
                                        
                                }
                            >
                            </Card> */}
              </>
            );
          })}
        </div>
      ) : (
        <Empty description="no packages assigned" />
      )}
      {editPkgModal ? (
        <EditStudentPackageModal
          student={student}
          visible={editPkgModal}
          currentPkg={editPkgModal}
          closeModal={() => handleEditPackage(null)}
        />
      ) : null}
      {showDrawer ? (
        <AssignPackageDrawer
          assignedPkgs={
            student.packages?.length
              ? student.packages.map((p) => p.package)
              : []
          }
          visible={showDrawer}
          student={student}
          closeDrawer={_changeShowDrawer}
        />
      ) : null}
    </Card>
  );
};

const AssignPackageDrawer = ({
  closeDrawer,
  visible,
  student,
  assignedPkgs,
}) => {
  const auth = useAuthUser();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { assignPkgStatus, getStatesStatus, statesList, studentAddress } =
    useSelector((state) => ({
      assignPkgStatus: state.student.assignPkgStatus,
      getStatesStatus: state.states.getStatesStatus,
      statesList: state.states.statesList,
      studentAddress: state.student.studentAddress,
    }));

  const [selectedPackage, setPackage] = useState();
  const [selectedState, setState] = useState();
  const [selectAddress, setAddressType] = useState();
  const [selectedAddress, setSelectedAddress] = useState();
  const [requiredfields, setRequired] = useState();
  const [subDetails, setSubDetials] = useState();
  const [selectPackageModal, openSelectPackageModal] = useState();

  useEffect(() => {
    return () => dispatch(resetAssignPkg());
  }, [dispatch]);

  useEffect(() => {
    if (getStatesStatus !== STATUS.SUCCESS) dispatch(getStatesAction());
  }, [dispatch, getStatesStatus]);

  const deliverable = Form.useWatch("deliverable", form);

  const checkOffline = (pkg) => {
    return (
      pkg.mode === "offline" || pkg.type === "BOOK" || pkg.type === "DRIVE"
    );
  };

  // const _selectPkg = (data) => {
  //     let pkg = _.find(packagesList, p => p._id === data)
  //     if (pkg && checkOffline(pkg))
  //         setDeliverable(true)
  //     else
  //         setDeliverable(false)

  //     if(pkg.priceMode !== 'sub' && subDetails){
  //         setSubDetials()
  //         form.setFieldsValue({amount:0})
  //     }

  //     setPackage(data)
  // }

  // const assignPackage = () => {
  //     dispatch(assignStudPkgAction({studentId:student._id, packageId:selectedPackage}))
  // }

  const _closeDrawer = useCallback(() => {
    setPackage([]);
    closeDrawer();
  }, [closeDrawer]);

  useEffect(() => {
    if (assignPkgStatus === STATUS.SUCCESS) _closeDrawer();
  }, [_closeDrawer, assignPkgStatus]);

  const submitForm = (e) => {
    let address = selectedAddress
      ? {
          address: selectedAddress.address,
          landmark: selectedAddress.landmark,
          state: selectedAddress.state,
          city: selectedAddress.city,
          pincode: selectedAddress.pincode,
        }
      : {
          address: e.address,
          landmark: e.landmark,
          state: selectedState?.name,
          city: e.city,
          pincode: e.pincode,
        };

    let pkg = selectedPackage;

    let data = {
      assigneeId: student.user._id,
      packageId: selectedPackage?._id,
      packageStartDate: e.packageStartDate
        ? moment(e.packageStartDate).format("YYYY-MM-DD")
        : null,
      orderDetails: {
        ..._.omit(e, [
          "packageStartDate",
          "city",
          "address",
          "landmark",
          "pincode",
        ]),
        address,
      },
      subscriptionData: subDetails || null,
    };

    // let req = pkg && checkOffline(pkg) && (!address.address || !address.state || !address.city || !address.pincode)
    let req =
      pkg &&
      deliverable &&
      (!address.address || !address.state || !address.city || !address.pincode);

    setRequired(req);

    data = {
      ..._.omitBy(data, (d) => !d),
      orderDetails: {
        ..._.omitBy(data.orderDetails, (d) => !d),
        amount: data.orderDetails.amount || "0",
      },
    };

    if (!req) dispatch(assignStudPkgAction(data));
  };

  const handleSelectState = (id) => {
    let state = _.find(statesList, (s) => s.id === id);
    setState(state);
  };

  const handleAddressType = (d) => {
    if (!d.target.value) setSelectedAddress(false);

    setAddressType(d.target.value);
  };

  const handleSelectAddress = (e) => {
    let address = _.find(studentAddress, (a) => a._id === e.target.value);

    setSelectedAddress(address);
  };

  const currentPackageSubscriptions = useMemo(() => {
    if (selectedPackage) {
      const pkg = selectedPackage;
      const data = pkg?.subscriptions?.length
        ? _.filter(pkg.subscriptions, (s) => s.active)
        : [];

      return data;
    }
  }, [selectedPackage]);

  const duration = (duration) => {
    const arr = duration?.split(/([0-9]+)/);
    const obj = arr
      ? { duration: arr[1], type: arr && DURATION_TYPE[arr[2]] }
      : {};
    return obj.duration ? `${obj.duration} ${obj.type}` : null;
  };

  const handleSelectPlan = (subId) => {
    const sub = find(currentPackageSubscriptions, (s) => s._id === subId);
    setSubDetials({
      subscriptionId: sub._id,
      mode: sub.mode,
      lang: sub.lang,
      duration: sub.duration,
      durationString: sub.durationString,
    });
    form.setFieldsValue({
      mode: sub.mode,
      lang: sub.lang === "english" ? "en" : "hn",
      amount: sub.price,
    });
  };

  const _selectPackageModal = () => {
    openSelectPackageModal((d) => !d);
  };

  const _setPackage = (pkg) => {
    const p = pkg?.length && pkg[0];
    setPackage(p);

    if (pkg && checkOffline(pkg)) form.setFieldsValue({ deliverable: true });
    else form.setFieldsValue({ deliverable: true });
  };

  const removePackage = () => {
    setPackage();
  };

  return (
    <Drawer
      visible={visible}
      width={"50%"}
      style={{ padding: 0 }}
      onClose={_closeDrawer}
      title="Assign Package"
    >
      {selectPackageModal ? (
        <SelectPackageModal
          defaultPackages={assignedPkgs}
          singleSelect
          onSubmit={_setPackage}
          visible={selectPackageModal}
          closeModal={_selectPackageModal}
        />
      ) : null}
      <Card
        bodyStyle={{ paddingTop: 0 }}
        style={{ border: 0 }}
        loading={getStatesStatus === STATUS.FETCHING}
      >
        {getStatesStatus === STATUS.SUCCESS ? (
          <div>
            <Form
              form={form}
              layout="vertical"
              onFinish={submitForm}
              initialValues={{
                mode: "online",
                lang: "hn",
              }}
            >
              <Form.Item label="Select Package" required>
                {/* <Select placeholder='select package' value={selectedPackage} onChange={_selectPkg} showSearch
                                    filterOption={(input, option) =>
                                        option.children[0]?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {packagesList?.length ?
                                        _.xorBy(_.orderBy(packagesList, ['createdAt'], ['desc']), assignedPkgs, '_id').map(c =>
                                            <Select.Option key={c?._id} value={c?._id}>{c?.name?.en}{c?.name?.en && c?.name?.hn ? ' / ' : null}{c?.name?.hn}</Select.Option>
                                        ) : null
                                    }
                                </Select> */}
                <div>
                  <Button
                    style={{ marginBottom: 4 }}
                    icon={<SelectOutlined />}
                    onClick={_selectPackageModal}
                  >
                    Select Package
                  </Button>
                  <br />
                  {selectedPackage && (
                    <Text
                      closable
                      style={{ color: "#3498DB", fontSize: 14 }}
                      onClose={removePackage}
                    >
                      {bilingualText(selectedPackage.name)}&nbsp;
                      <Tooltip title="remove">
                        <CloseCircleOutlined
                          onClick={removePackage}
                          style={{
                            cursor: "pointer",
                            fontSize: 14,
                            color: "red",
                          }}
                        />
                      </Tooltip>
                    </Text>
                  )}
                </div>
              </Form.Item>
              {selectedPackage?.priceMode === "sub" ? (
                <Form.Item required label="Select Subscription Plan">
                  <Select
                    placeholder="Subscription Plan"
                    onChange={handleSelectPlan}
                  >
                    {currentPackageSubscriptions?.length
                      ? currentPackageSubscriptions.map((sub) => (
                          <Select.Option key={sub._id} value={sub._id}>
                            {`${sub.lang} - ${sub.mode} ${
                              duration(sub.durationString)
                                ? "-" + duration(sub.durationString) + "-"
                                : "-"
                            } ₹${sub.price || 0}`}
                          </Select.Option>
                        ))
                      : null}
                  </Select>
                </Form.Item>
              ) : null}
              <Form.Item label="Start Date" name="packageStartDate">
                <DatePicker />
              </Form.Item>
              <Form.Item label="Amount" name="amount" initialValue={0}>
                <Input type="number" prefix="₹" placeholder="Amount" min={0} />
              </Form.Item>
              <Form.Item label="UTR" name="utr">
                <Input placeholder="UTR" />
              </Form.Item>
              {selectedPackage?.priceMode === "sub" && !subDetails ? null : (
                <>
                  <Form.Item label="Language" name="lang">
                    <Radio.Group disabled={subDetails}>
                      {/* onChange={changePublishStatus}> */}
                      <Radio value="hn">Hindi</Radio>
                      <Radio value="en">English</Radio>
                      {/* <Radio value={2}>Coming Soon</Radio> */}
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item label="Mode" name="mode">
                    <Radio.Group disabled={subDetails}>
                      <Radio value="online">online</Radio>
                      <Radio value="offline">offline</Radio>
                    </Radio.Group>
                  </Form.Item>
                </>
              )}
              <Form.Item label="Remark" name="remark">
                <Input placeholder="Remark" />
              </Form.Item>
              <Form.Item label="Installment" name="installment">
                <Input placeholder="Installment" />
              </Form.Item>
              <Form.Item label="Pending" name="pending">
                <Input placeholder="pending" />
              </Form.Item>
              <Form.Item label="Deliverable" name="deliverable">
                <Radio.Group>
                  <Radio value={true}>True</Radio>
                  <Radio value={false}>False</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Receipt No" name="receiptNo">
                <Input placeholder="Receipt No" />
              </Form.Item>
              {deliverable ? (
                <>
                  <Text style={{ fontSize: 18 }} type="secondary">
                    Deliverable Address
                  </Text>
                  <br />
                  <br />
                  <Radio.Group
                    onChange={handleAddressType}
                    defaultValue={false}
                  >
                    <Radio value={true}>Select From Addresses</Radio>
                    <Radio value={false}>Add New Address</Radio>
                  </Radio.Group>
                  <br />
                  <br />

                  {selectAddress ? (
                    studentAddress.length ? (
                      <div>
                        <div style={{ marginBottom: 4 }}>
                          <Text className="required">Select Address</Text>
                        </div>
                        <List
                          size="small"
                          bordered
                          dataSource={studentAddress}
                          renderItem={(add, i) => (
                            <List.Item>
                              <Descriptions
                                title={
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Text>
                                      {"Address " + (parseInt(i) + 1)}
                                    </Text>
                                    <Checkbox
                                      value={add._id}
                                      onChange={handleSelectAddress}
                                      checked={selectedAddress?._id === add._id}
                                    >
                                      Select
                                    </Checkbox>
                                  </div>
                                }
                              >
                                <Descriptions.Item label="Address">
                                  {add.address || "-"}
                                </Descriptions.Item>
                                <Descriptions.Item label="Landmark">
                                  {add.landmark || "-"}
                                </Descriptions.Item>
                                <Descriptions.Item label="City">
                                  {add.city || "-"}
                                </Descriptions.Item>
                                <Descriptions.Item label="State">
                                  {add.state || "-"}
                                </Descriptions.Item>
                                <Descriptions.Item label="Pincode">
                                  {add.pincode || "-"}
                                </Descriptions.Item>
                              </Descriptions>
                            </List.Item>
                          )}
                        />
                      </div>
                    ) : (
                      <div>
                        <Text>No address added</Text>
                        <br />
                      </div>
                    )
                  ) : (
                    <>
                      <Form.Item required label="Address" name="address">
                        <Input placeholder="Address" />
                      </Form.Item>
                      <Form.Item label="Landmark" name="landmark">
                        <Input placeholder="Landmark" />
                      </Form.Item>
                      <Form.Item required label="State" name="state">
                        <Select
                          placeholder="State"
                          onChange={handleSelectState}
                          showSearch
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {statesList?.length
                            ? statesList.map((st) => (
                                <Select.Option value={st.id} key={st.id}>
                                  {st.name}
                                </Select.Option>
                              ))
                            : null}
                        </Select>
                      </Form.Item>
                      <Form.Item required label="City" name="city">
                        <Select
                          placeholder="City"
                          disabled={!selectedState}
                          showSearch
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {selectedState?.cities?.length
                            ? selectedState.cities.map((ct) => (
                                <Select.Option value={ct.name} key={ct.id}>
                                  {ct.name}
                                </Select.Option>
                              ))
                            : null}
                        </Select>
                      </Form.Item>
                      <Form.Item required label="Pincode" name="pincode">
                        <Input type="number" placeholder="Pincode" />
                      </Form.Item>
                    </>
                  )}
                </>
              ) : null}
              <br />
              {requiredfields ? (
                <div style={{ marginBottom: 10 }}>
                  <Text type="danger">
                    * please select or add required fields{" "}
                    <b>state, city, address and picode</b>{" "}
                  </Text>
                </div>
              ) : null}
              <Button
                disabled={
                  !selectedPackage ||
                  (selectedPackage?.priceMode === "sub" && !subDetails)
                }
                htmlType="submit"
                // onClick={assignPackage}
                loading={assignPkgStatus === STATUS.FETCHING}
                type="primary"
              >
                Assign
              </Button>
            </Form>
          </div>
        ) : (
          <Text>something went wrong</Text>
        )}
      </Card>
    </Drawer>
  );
};
