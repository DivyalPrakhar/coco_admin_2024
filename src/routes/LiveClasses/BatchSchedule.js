import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { Button as ChakraButton, Input as ChakraInput } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

import { concat, filter, find, map, orderBy } from "lodash";
import moment from "moment";

import React, { useEffect, useReducer, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  addBatchSubjectLectureAction,
  deleteBatchSubjectLectureAction,
  getAllLiveClassBatchAction,
  getBatchSubjectLectureAction,
  getLiveClassBatchSubjectAction,
  resetBatchSchedule,
  resetScheduleLectures,
  updateBatchSubjectLectureAction,
  uploadFileAction,
} from "../../redux/reducers/LiveClasses";
import { STATUS } from "../../Constants";
import { AddSubjectTeacher } from "./BatchManagement";
import { getSingleInstituteAction } from "../../redux/reducers/instituteStaff";
import { UploadFilesModal } from "../ManagePackages/UplodaFilesModal";
import { FormReducer } from "../../utils/FormReducer";

export default function BatchSchedule() {
  const dispatch = useDispatch();
  const [selectedBatch, setSelectedBatch] = useState();
  const [input, setInput] = useState();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [editTeacher, setEditTeacher] = useState(null);
  const { instituteId, institute } = useSelector((state) => ({
    instituteId: state.user.user.staff.institute._id,
    institute: state.instituteStaff,
  }));
  const singleInstitute = institute.singleInstitute;

  useEffect(() => {
    dispatch(getAllLiveClassBatchAction());
    dispatch(getSingleInstituteAction({ id: instituteId }));
    return () => {
      dispatch(resetBatchSchedule());
      dispatch(resetScheduleLectures());
    };
  }, [dispatch, instituteId]);

  useEffect(() => {
    setInput();
    dispatch(resetBatchSchedule());
    dispatch(resetScheduleLectures());
  }, [dispatch, selectedBatch]);

  useEffect(() => {
    if (input?.batchSubject) {
      dispatch(
        getBatchSubjectLectureAction({
          batchSubject: input?.batchSubject,
          showZoomData: 1,
        })
      );
    }
  }, [dispatch, input?.batchSubject]);

  const {
    allLiveClassBatch,
    liveClassBatchSubject,
    uploadFileStatus,
    batchSubjectLectures,
    addBatchSubjectLectureStatus,
    updateBatchSubjectLectureStatus,
  } = useSelector((s) => s.liveClasses);

  const handleBatchSelect = (e) => {
    setSelectedBatch(find(allLiveClassBatch, (batch) => batch._id === e));
    if (e) dispatch(getLiveClassBatchSubjectAction({ batch: e }));
  };

  const inputHandler = (name, value) => {
    // const { name, value } = e.target;
    setInput((preval) => ({ ...preval, [name]: value }));
  };

  const [uploaded, dispatchPropertyChange] = useReducer(
    FormReducer,
    uploadedFiles
  );

  const [filesModal, openFilesModal] = useState();

  const _openFilesModal = () => {
    openFilesModal(!filesModal);
  };
  const _changeFiles = (files) => {
    dispatchPropertyChange({ type: "files", value: files });
  };

  const uploadFile = (e) => {
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    dispatch(uploadFileAction(formData));
  };

  const deleteInputFile = (file) => {
    setInput((pre) => ({
      ...pre,
      files: filter(input?.files, (f) => f.name !== file),
    }));
  };

  const { confirm } = Modal;

  const deleteConfirmation = (id) => {
    confirm({
      title: "Do you Want to delete Lecture?",
      icon: <ExclamationCircleOutlined />,

      onOk() {
        dispatch(deleteBatchSubjectLectureAction({ id }));
      },
      onCancel() {},
    });
  };

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      // searchedColumn === dataIndex ? (
      //     <Highlighter
      //         highlightStyle={{
      //             backgroundColor: '#ffc069',
      //             padding: 0,
      //         }}
      //         searchWords={[searchText]}
      //         autoEscape
      //         textToHighlight={text ? text.toString() : ''}
      //     />
      // ) : (
      text,
    // ),
  });

  const sortTopic = (a, b) => {
    if (a.description > b.description) {
      return -1;
    }
    if (a.description < b.description) {
      return 1;
    }
    return 0;
  };

  const columns = [
    {
      title: "Lecture",
      dataIndex: "lectureNo",
      render: (d) => <Col>Lecture - {d}</Col>,
    },
    {
      title: "Topic/Chapter",
      dataIndex: "description",
      sorter: (a, b) => sortTopic(a, b),
      ...getColumnSearchProps("description"),
    },
    {
      title: "Schedule",
      dataIndex: "scheduleDateTime",
      render: (d) => (
        <Col>{d ? moment(d).format("DD-MM-YYYY hh:mm A") : "-"}</Col>
      ),
    },
    {
      title: "Attached Files",
      dataIndex: "files",
      render: (d) => <Col>{d?.length}</Col>,
    },
    {
      title: "Metting Url",
      dataIndex: "",
      width: 180,
      render: (d) => <Col>{d?.zoomData ? d.zoomData?.meetingUrl : d?.youtubeUrl ? d.youtubeUrl : null}</Col>
    },
    {
      title: "Action",
      dataIndex: "",
      render: (d) => (
        <Row>
          <Col
            onClick={() => {
              setInput({ ...d, batchSubject: d.batchSubject._id, meetingType: d?.zoomData ? "zoom" : d?.youtubeUrl ? "youtube" : '' });
              dispatchPropertyChange({
                type: "merge",
                value: { files: d?.files },
              });
            }}
          >
            <EditIcon />
          </Col>
          <Col
            style={{ marginLeft: "10px" }}
            onClick={() => deleteConfirmation(d._id)}
          >
            <DeleteIcon />
          </Col>
        </Row>
      ),
    },
  ];

  const lectures = find(
    liveClassBatchSubject,
    (sub) => sub._id === input?.batchSubject
  )?.noOfLectures;
  const addLecture = () => {
    if (input?._id) {
      dispatch(
        updateBatchSubjectLectureAction({
          ...input,
          zoomData: input?.meetingType === "zoom" ? input.ZoomData : '',
          youtubeUrl: input?.meetingType === "youtube" ? input?.youtubeUrl : '',
          youtubeVideoId: input?.meetingType === "youtube" ? input?.youtubeVideoId : '',
          files: map(uploaded?.files, (file) => ({
            name: file.name,
            mimeType: file.type,
            url: file.url,
          })),
          id: input._id,
        })
      );
    } else {
      dispatch(
        addBatchSubjectLectureAction({
          ...input,
          files: map(uploaded?.files, (file) => ({
            name: file.name,
            mimeType: file.type,
            url: file.url,
          })),
        })
      );
    }
  };
  const resetlinks = () => {
        setInput(p => ({ ...p, youtubeUrl: undefined, youtubeVideoId: undefined, zoomData: undefined }))
    }

  useEffect(() => {
    if (
      addBatchSubjectLectureStatus === STATUS.SUCCESS ||
      updateBatchSubjectLectureStatus === STATUS.SUCCESS
    ) {
      dispatch(resetBatchSchedule());
      setUploadedFiles([]);
      setInput({ batchSubject: input?.batchSubject });
      dispatchPropertyChange({ type: "reset", value: [] });
    }
  }, [
    addBatchSubjectLectureStatus,
    dispatch,
    input?.batchSubject,
    updateBatchSubjectLectureStatus,
  ]);

  const onFinish = (value) => {
    setInput((pre) => ({ ...pre, staff: value.staff }));
    setEditTeacher(null);
  };

  const handleMeetingUrlChange = (url) => {
    let meetingUrl = url || "";
    let meetingNumber = meetingUrl?.split("/")?.at(-1)?.split("?")?.[0] || "";
    let password = meetingUrl.split("=")?.[1] || "";
    const newZoomData = { meetingUrl: meetingUrl, password, meetingNumber };
    setInput((p) => ({ ...p, zoomData: newZoomData }));
  };

  const handleYouTubeUrl = (url) => {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)|(live\/))\??v?=?([^#&?]*).*/;;
    var match = url.match(regExp);
    if (match && match[8].length === 11) {
        setInput(p => ({ ...p, youtubeUrl: url, youtubeVideoId: match[8] }));
    }
}

  return (
    <Card>
      <Row>
        <Col
          style={{
            fontSize: "18px",
            fontWeight: "semibold",
            marginBottom: "10px",
          }}
        >
          Batch Schedule
        </Col>
      </Row>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
      >
        <Form.Item
          name="batchName"
          label="Select a batch"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Select batch"
            onChange={(e) => handleBatchSelect(e)}
            allowClear
          >
            {map(orderBy(allLiveClassBatch, "createdAt", "desc"), (batch) => (
              <Select value={batch._id}>{batch.name}</Select>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="duration" label="Duration">
          <Row>
            <Col span={20}>
              <Input
                disabled
                type={"text"}
                value={selectedBatch?.duration}
                onChange={(e) =>
                  setSelectedBatch((pre) => ({
                    ...pre,
                    duration: e.target.value,
                  }))
                }
              />
            </Col>
            <Col style={{ marginLeft: "10px" }}>in minutes</Col>
          </Row>
        </Form.Item>
        <Form.Item name="days" label="Days">
          <Col>
            <Checkbox.Group
              disabled
              value={selectedBatch?.days}
              onChange={(e) => setSelectedBatch((pre) => ({ ...pre, days: e }))}
            >
              <Checkbox value="M">Mon</Checkbox>
              <Checkbox value="Tu">Tue</Checkbox>
              <Checkbox value="W">Wed</Checkbox>
              <Checkbox value="Th">Thu</Checkbox>
              <Checkbox value="F">Fri</Checkbox>
              <Checkbox value="Sa">Sat</Checkbox>
              <Checkbox value="S">Sun</Checkbox>
            </Checkbox.Group>
          </Col>
        </Form.Item>
        <Form.Item label="Select Subject">
          <Row>
            <Col span={18}>
              <Select
                name="batchSubject"
                placeholder="Select a option"
                value={input?.batchSubject}
                onChange={(e) => inputHandler("batchSubject", e)}
                allowClear
              >
                {liveClassBatchSubject?.length
                  ? map(liveClassBatchSubject, (batch) => (
                      <Select value={batch._id}>
                        {batch?.subject?.name.en}
                      </Select>
                    ))
                  : null}
              </Select>
            </Col>
            {input?.batchSubject ? (
              <Col style={{ paddingLeft: "10px", justify: "space-between" }}>
                {input.staff
                  ? find(
                      singleInstitute?.[0]?.staffs,
                      (staff) => staff._id === input.staff
                    )?.user?.name
                  : find(
                      liveClassBatchSubject,
                      (sub) => sub._id === input?.batchSubject
                    )?.staff?.user?.name}
                <EditIcon
                  ml={10}
                  onClick={() =>
                    setEditTeacher(
                      find(
                        liveClassBatchSubject,
                        (sub) => sub._id === input?.batchSubject
                      )?.staff?.user?.name || []
                    )
                  }
                />
              </Col>
            ) : null}
          </Row>
        </Form.Item>
        {editTeacher && (
          <AddSubjectTeacher
            staffs={singleInstitute?.[0]?.staffs}
            editTeacher={{ staff: input?.staff || editTeacher }}
            handleClose={() => setEditTeacher(null)}
            onFinish={onFinish}
          />
        )}
        {batchSubjectLectures?.length ? (
          <Table
            size="small"
            style={{ marginTop: 10, marginBottom: "10px" }}
            bordered
            dataSource={batchSubjectLectures}
            columns={columns}
            pagination={false}
          />
        ) : null}
        <Form.Item name="selectLectures" label="Select Lecture">
          <Col>
            {lectures ? (
              <Col style={{ fontSize: "10px" }}>Total Lectures: {lectures}</Col>
            ) : null}
            <Select
              name="lectureNo"
              placeholder="Select Lecture No"
              value={input?.lectureNo}
              onChange={(e) => inputHandler("lectureNo", e)}
            >
              {map(new Array(lectures), (val, key) => (
                <option
                  disabled={
                    find(batchSubjectLectures, (l) => l.lectureNo === key + 1)
                      ? true
                      : false
                  }
                  value={key + 1}
                >
                  Lecture - {key + 1}
                </option>
              ))}
            </Select>
          </Col>
        </Form.Item>
        <Form.Item label="Description">
          <Col>
            <Input
              type="text"
              placeholder="Enter Chapter/topic name"
              value={input?.description}
              onChange={(e) => inputHandler("description", e.target.value)}
            />
          </Col>
        </Form.Item>
        <Form.Item label="Lecture Start date/time">
          <Col>
            <DatePicker
              name="scheduleDateTime"
              value={
                input?.scheduleDateTime ? moment(input?.scheduleDateTime) : null
              }
              onChange={(e) =>
                inputHandler(
                  "scheduleDateTime",
                  e ? moment(e).toISOString(true) : null
                )
              }
              showTime
              format="DD-MM-YYYY HH:mm:ss"
            />
          </Col>
        </Form.Item>

        <Form.Item label="Select Meeting Type" placeholder="Select Meeting Type">
            <Select name="meetingType" placeholder="Select Meeting Type" allowClear value={input?.meetingType} onChange={(e) => ((inputHandler("meetingType", e), resetlinks()))}>
                <option value={"zoom"}>Zoom Meeting</option>
                <option value={"youtube"}>YouTube Meeting</option>
            </Select>
        </Form.Item>
        {input?.meetingType === "zoom" ?
            <Form.Item label="Metting URL">
                <Col>
                    <Input type="text" placeholder="Enter Metting URL" value={input?.zoomData?.meetingUrl} onChange={(e) => handleMeetingUrlChange(e.target.value)} />
                </Col>
            </Form.Item>
            : input?.meetingType === "youtube" ?
                <>
                    < Form.Item label="YouTube URL" rules={[{ required: true }]}>
                        <Input type="text" placeholder="Enter YouTube URL" value={input?.youtubeUrl} onChange={(e) => handleYouTubeUrl(e.target.value)} />
                    </Form.Item>
                    < Form.Item label="YouTube Video Id" rules={[{ required: true }]}>
                        <Input type="text" readOnly placeholder="YouTube Video Id" value={input?.youtubeVideoId} />
                    </Form.Item>
                </>
                :
                null
        }
        <Form.Item label="Upload Notes">
          <Col>
            <Row>
              <Col>
                <Row>
                  <ChakraButton
                    w="150px"
                    isLoading={uploadFileStatus === STATUS.FETCHING}
                    onClick={_openFilesModal}
                    variant="outline"
                  >
                    Upload
                  </ChakraButton>
                  <Col style={{ marginLeft: "10px" }}>
                    upload multiple files [PDF/Word/Excel/PPT/TXT]
                  </Col>
                </Row>
              </Col>
              {/* <ChakraInput type="file" visibility={"hidden"} accept=".xlsx,.xls,.doc,.docx,.ppt,.pptx,.txt,.pdf" onChange={(e) => uploadFile(e)} ref={uploadFilesRef} /> */}
            </Row>
            <Row>
              <Col>
                {/* {input?.files?.length ?
                                    map(input?.files, (file, i) => (
                                        <Row>
                                            <Col style={{ marginRight: "5px" }}><DeleteOutlined onClick={() => deleteInputFile(file.name)} /></Col>
                                            <Col style={{ marginRight: "5px" }}>{i + 1}.</Col>
                                            <Col>{file.name}</Col>
                                        </Row>
                                    ))
                                    :
                                    null
                                } */}
                {uploaded?.files?.length
                  ? map(uploaded.files, (file, i) => (
                      <Row style={{ marginTop: 3 }}>
                        {/* <Col style={{ marginRight: "5px" }}><DeleteOutlined onClick={() => deleteFile(file.name)} /></Col> */}
                        {/* <Col style={{ marginRight: "5px" }}>{i + 1}.</Col> */}
                        <Col>{file.name}</Col>
                      </Row>
                    ))
                  : null}
              </Col>
            </Row>
          </Col>
        </Form.Item>
        {filesModal ? (
          <UploadFilesModal
            closeModal={_openFilesModal}
            visible={filesModal}
            getFiles={_changeFiles}
            defaultFiles={uploaded?.files}
            url={"/app/file"}
          />
        ) : null}
        <Form.Item>
          <Button
            disabled={input?.batchSubject && input?.lectureNo ? false : true}
            onClick={addLecture}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
