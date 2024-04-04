import {
  DeleteOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tooltip,
} from "antd";

import { Button as ChakraButton, Input as ChakraInput } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Text } from "@chakra-ui/react";

import { filter, map, orderBy } from "lodash";
import moment from "moment";

import React, { useEffect, useReducer, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { STATUS } from "../../Constants";
import {
  deleteBatchSubjectLectureAction,
  getAllLiveClassBatchAction,
  getBatchSubjectLectureAction,
  resetBatchSchedule,
  resetScheduleLectures,
  updateBatchSubjectLectureAction,
  uploadFileAction,
} from "../../redux/reducers/LiveClasses";
import { BaseURL } from "../../BaseUrl";
import { URIS } from "../../services/api";
import { FormReducer } from "../../utils/FormReducer";
import { UploadFilesModal } from "../ManagePackages/UplodaFilesModal";

export default function BatchScheduleList() {
  const dispatch = useDispatch();
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [editLecture, setEditLecture] = useState(null);

  useEffect(() => {
    dispatch(getAllLiveClassBatchAction());
    return () => {
      dispatch(resetBatchSchedule());
      dispatch(resetScheduleLectures());
    };
  }, [dispatch]);

  const getBatchLectures = () => {
    dispatch(
      getBatchSubjectLectureAction({ batch: selectedBatch, showZoomData: 1 })
    );
  };

  const {
    batchSubjectLectures,
    allLiveClassBatch,
    getBatchSubjectLectureStatus,
  } = useSelector((s) => s.liveClasses);
  const { confirm } = Modal;

  const handleClose = () => {
    setEditLecture(null);
  };

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

  const getColumnSearchProps = (dataIndex, key) => ({
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
          placeholder={`Search ${key}`}
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
      key === "Subject"
        ? record[dataIndex]?.subject.name.en
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : record["staff"]
        ? record["staff"]?.user.name
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : record[dataIndex].staff.user.name
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
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
  const sortSubject = (a, b) => {
    if (a.batchSubject?.subject?.name.en > b.batchSubject?.subject?.name.en) {
      return -1;
    }
    if (a.batchSubject?.subject?.name.en < b.batchSubject?.subject?.name.en) {
      return 1;
    }
    return 0;
  };
  const sortTeacher = (a, b) => {
    if (
      a.staff
        ? a.staff?.user.name
        : a.batchSubject?.subject?.name.en > b.staff
        ? b.staff?.user.name
        : b.batchSubject?.subject?.name.en
    ) {
      return -1;
    }
    if (
      a.staff
        ? a.staff.user.name
        : a.batchSubject?.subject?.name.en < b.staff
        ? b.staff.user.name
        : b.batchSubject?.subject?.name.en
    ) {
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
      title: "Schedule",
      dataIndex: "scheduleDateTime",
      sorter: (a, b) =>
        new Date(b.scheduleDateTime) - new Date(a.scheduleDateTime),
      render: (d) => (
        <Col>{d ? moment(d).format("DD MMM YYYY hh:mm a") : "-"}</Col>
      ),
    },
    {
      title: "Duration",
      dataIndex: "",
      render: (d) => <Col>{d.batchSubject?.batch?.duration}</Col>,
    },
    {
      title: "Subject/Chapter",
      dataIndex: "",
      sorter: (a, b) => sortSubject(a, b),
      ...getColumnSearchProps("batchSubject", "Subject"),
      render: (d) => (
        <Col>
          {d.batchSubject?.subject?.name.en} / {d?.description}
        </Col>
      ),
    },
    {
      title: "Teacher",
      dataIndex: "",
      sorter: (a, b) => sortTeacher(a, b),
      ...getColumnSearchProps("batchSubject", "Teacher", "staff"),
      render: (d) => (
        <Col>{d?.staff?.user?.name || d.batchSubject.staff?.user?.name}</Col>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      dataIndex: "",
      width: "125px",
      render: (d) => (
        <Row
          justify="space-around"
          align="middle"
          style={{ cursor: "pointer" }}
        >
          <Col>
            <Tooltip placement="top" title="Download Live Class Video">
              <DownloadOutlined style={{ paddingTop: "10px" }} />
            </Tooltip>
          </Col>
          <Col>
            <Tooltip placement="top" title="Download Attendance">
              <DownloadOutlined style={{ paddingTop: "10px" }} />
            </Tooltip>
          </Col>
          <Col onClick={() => setEditLecture(d)}>
            <Tooltip placement="top" title="Edit">
              <EditIcon />
            </Tooltip>
          </Col>
          <Col>
            <Tooltip placement="top" title="Delete">
              <DeleteIcon onClick={() => deleteConfirmation(d._id)} />
            </Tooltip>
          </Col>
        </Row>
      ),
    },
  ];
  return (
    <Card style={{ minHeight: "75vh" }}>
      <Row justify="space-between">
        <Col style={{ fontSize: "16px", fontWeight: "semibold" }}>
          Batch Schedule List
        </Col>
        <Col>
          <Button
            onClick={() =>
              window.open(
                selectedBatch
                  ? BaseURL +
                      URIS.BATCH_SUBJECT_LECTURE +
                      "?batch=" +
                      selectedBatch +
                      "&excel=true"
                  : BaseURL + URIS.BATCH_SUBJECT_LECTURE + "?excel=true"
              )
            }
          >
            Download CSV
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={6} style={{ marginRight: "10px" }}>
          <Select
            style={{ width: "100%" }}
            placeholder="Select Batch"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e)}
          >
            {allLiveClassBatch?.length
              ? map(allLiveClassBatch, (batch) => (
                  <option value={batch._id}>{batch.name}</option>
                ))
              : null}
          </Select>
        </Col>
        <Col>
          <Button
            type="primary"
            disabled={selectedBatch ? false : true}
            onClick={getBatchLectures}
          >
            Get
          </Button>
        </Col>
      </Row>
      {getBatchSubjectLectureStatus === STATUS.FETCHING ? (
        <Row style={{ height: "300px" }} align="middle" justify="center">
          <Spin size="large" />
        </Row>
      ) : (
        <Table
          style={{ marginTop: 10 }}
          loading={getBatchSubjectLectureStatus === STATUS.FETCHING}
          bordered
          dataSource={orderBy(batchSubjectLectures, "createdAt", "desc")}
          columns={columns}
        />
      )}
      {editLecture && (
        <EditLectureDetails lecture={editLecture} handleClose={handleClose} />
      )}
    </Card>
  );
}

const EditLectureDetails = ({ lecture, handleClose }) => {
    const dispatch = useDispatch()
    const [uploadedFiles, setUploadedFiles] = useState([])
    const [input, setInput] = useState(
        lecture?.youtubeVideoId ?
            { meetingType: "youtube", youtubeUrl: lecture.youtubeUrl, youtubeVideoId: lecture.youtubeVideoId }
            :
            lecture?.zoomData ?
                { meetingType: "zoom" }
                :
                {}
    )

  useEffect(() => {
    if (lecture?.files)
      dispatchPropertyChange({
        type: "merge",
        value: { files: lecture?.files },
      });
  }, [lecture]);

  const [uploaded, dispatchPropertyChange] = useReducer(FormReducer);

  const [filesModal, openFilesModal] = useState();

  const _openFilesModal = () => {
    openFilesModal(!filesModal);
  };
  const _changeFiles = (files) => {
    dispatchPropertyChange({ type: "files", value: files });
  };

  const { uploadedFile, uploadFileStatus, updateBatchSubjectLectureStatus } =
    useSelector((s) => s.liveClasses);

  useEffect(() => {
    if (uploadFileStatus === STATUS.SUCCESS)
      setUploadedFiles([...uploadedFiles, uploadedFile]);
    dispatch(resetBatchSchedule());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedFile, uploadFileStatus]);

  const deleteFile = (file) => {
    setUploadedFiles(
      filter(uploadedFiles, (f) => f.fileName !== file || f.name !== file)
    );
  };

  const handleYouTubeUrl = (url) => {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)|(live\/))\??v?=?([^#&?]*).*/;;
    var match = url.match(regExp);
    if (match && match[8].length === 11) {
        setInput(p => ({ ...p, youtubeUrl: url, youtubeVideoId: match[8] }));
    }
}

  const onFinish = (data) => {
    let meetingUrl = data.zoomMeetingUrl || "";
    let meetingNumber = meetingUrl?.split("/")?.at(-1)?.split("?")?.[0] || "";
    let password = meetingUrl.split("=")?.[1] || "";
    const newZoomData = { meetingUrl: meetingUrl, password, meetingNumber };
    delete data["zoomMeetingUrl"];
    dispatch(
      updateBatchSubjectLectureAction({
        ...data,
        id: lecture._id,
        batchSubject: lecture.batchSubject?._id,
        scheduleDateTime: data.scheduleDateTime
          ? moment(data.scheduleDateTime).toISOString(true)
          : null,
        zoomData: input?.meetingType === "zoom" ? newZoomData : {},
        youtubeUrl: input?.meetingType === "youtube" ? input?.youtubeUrl : '',
        youtubeVideoId: input?.meetingType === "youtube" ? input?.youtubeVideoId : '',
        files: map(uploaded?.files, (file) => ({
          name: file.name,
          mimeType: file.type,
          url: file.url,
        })),
      })
    );
  };

  useEffect(() => {
    if (updateBatchSubjectLectureStatus === STATUS.SUCCESS) {
      dispatch(resetBatchSchedule());
      handleClose();
    }
  }, [dispatch, handleClose, updateBatchSubjectLectureStatus]);

  return (
    <Modal
      width={700}
      title="Edit Schedule Lecture"
      visible={lecture ? true : false}
      footer={false}
      onCancel={handleClose}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        initialValues={{
          batchSubject: lecture.batchSubject?.subject?.name.en,
          lectureNo: lecture?.lectureNo,
          description: lecture?.description,
          scheduleDateTime: lecture?.scheduleDateTime
            ? moment(lecture?.scheduleDateTime)
            : null,
          zoomMeetingUrl: lecture.zoomData?.meetingUrl || "",
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="batchSubject"
          label="Batch Subject"
          rules={[{ required: true }]}
        >
          <Input disabled placeholder="Batch Subject" />
        </Form.Item>
        <Form.Item
          name="lectureNo"
          label="Lecture No"
          rules={[{ required: true }]}
        >
          <Input disabled placeholder="Lecture" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <Input placeholder="Description" />
        </Form.Item>
        <Form.Item
          name="scheduleDateTime"
          label="Schedule Date Time"
          rules={[{ required: true }]}
        >
          <DatePicker
            name="scheduleDateTime"
            showTime
            format="DD-MM-YYYY HH:mm:ss"
          />
        </Form.Item>
        {/* <Form.Item name="zoomMeetingUrl" label="Zoom Meeting Url">
                    <Input name="zoomMeetingUrl" />
                </Form.Item> */}
        <Form.Item label="Select Meeting Type" placeholder="Select Meeting Type">
          <Select name="meetingType" placeholder="Select Meeting Type" allowClear value={input?.meetingType} onChange={(e) => setInput({ meetingType: e })}>
            <option value={"zoom"}>Zoom Meeting</option>
            <option value={"youtube"}>YouTube Meeting</option>
          </Select>
        </Form.Item>
        {input?.meetingType === "zoom" ?
          <Form.Item name="zoomMeetingUrl" label="Zoom Meeting Url">
            <Input name="zoomMeetingUrl" />
          </Form.Item>
          : input?.meetingType === "youtube" ?
            <>
              < Form.Item label="YouTube URL">
                <Input type="text" placeholder="Enter YouTube URL" value={input?.youtubeUrl} onChange={(e) => handleYouTubeUrl(e.target.value)} />
              </Form.Item>
              < Form.Item label="YouTube Video Id">
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
                  <Text ml={10} mb={0}>
                    upload multiple files [PDF/Word/Excel/PPT/TXT]
                  </Text>
                </Row>
              </Col>
              {/* <ChakraInput type="file" visibility={"hidden"} accept=".xlsx,.xls,.doc,.docx,.ppt,.pptx,.txt,.pdf" onChange={(e) => uploadFile(e)} ref={uploadFilesRef} /> */}
            </Row>
            <Row>
              <Col>
                {uploaded?.files?.length
                  ? map(uploaded.files, (file, i) => (
                      <Row>
                        {/* <Col style={{ marginRight: "5px" }}><DeleteOutlined onClick={() => deleteFile(file.fileName || file.name)} /></Col>
                                            <Col style={{ marginRight: "5px" }}>{i + 1}.</Col> */}
                        <Col>{file.name}</Col>
                      </Row>
                    ))
                  : null}
              </Col>
            </Row>
          </Col>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            loading={updateBatchSubjectLectureStatus === STATUS.FETCHING}
            htmlType="submit"
          >
            Save
          </Button>
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
      </Form>
    </Modal>
  );
};
