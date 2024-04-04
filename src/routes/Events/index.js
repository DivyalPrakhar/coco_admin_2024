import {
  DeleteOutlined,
  DeleteTwoTone,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  PaperClipOutlined,
  PlusOutlined,
  SelectOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  Radio,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonPageHeader } from "../../components/CommonPageHeader";
import {
  filter,
  findIndex,
  indexOf,
  isElement,
  isEmpty,
  omit,
  orderBy,
  remove,
  uniqBy,
  xor,
} from "lodash";
import {
  addEventAction,
  deleteEventAction,
  getAllEventAction,
  updateEventAction,
} from "../../redux/reducers/events";
import { STATUS } from "../../Constants";
import { ConfirmAlert } from "../../Constants/CommonAlerts";
import TextArea from "antd/lib/input/TextArea";
import { BaseURL } from "../../BaseUrl";
import { Link } from "react-router-dom";
import { UploadImageBox } from "../../components/UploadImageBox";

export const Events = () => {
  const dispatch = useDispatch();
  const [eventDrawer, openEventDrawer] = useState();
  const [editEventDrawer, openEditEventDrawer] = useState();
  const [descriptions, openDescription] = useState([]);

  const {
    getAllEventStatus,
    eventList,
    deleteEventStatus,
    addEventStatus,
    updateEventStatus,
  } = useSelector((state) => ({
    getAllEventStatus: state.event.getAllEventStatus,
    eventList: state.event.eventList || [],
    deleteEventStatus: state.event.deleteEventStatus,
    addEventStatus: state.event.addEventStatus,
    updateEventStatus: state.event.updateEventStatus,
  }));

  useEffect(() => {
    if (
      addEventStatus === STATUS.SUCCESS ||
      updateEventStatus === STATUS.SUCCESS
    ) {
      openEditEventDrawer();
      openEventDrawer();
    }
  }, [addEventStatus, updateEventStatus]);

  useEffect(() => {
    dispatch(getAllEventAction());
  }, [dispatch]);

  const _openEventDrawer = () => {
    openEventDrawer(!eventDrawer);
  };

  const editEvent = (d) => {
    openEditEventDrawer(d?._id ? d : false);
  };

  const deleteEvent = (d) => {
    ConfirmAlert(
      () => dispatch(deleteEventAction({ eventId: d._id })),
      "Sure?",
      null,
      deleteEventStatus === STATUS.FETCHING
    );
  };
  const previewEvent = (id) => {
    window.open("https://student.competitioncommunity.com/events/" + id)
  }

  const _openDescirpton = (obj) => {
    openDescription((d) => xor(d, [obj._id]));
  };

  const filters = [
    {
      text: "Active",
      value: true,
    },
    {
      text: "InActive",
      value: false,
    },
  ];
  const onFilter = (value, record) => {
    record = Object.assign({}, record, {
      active: record.active || false,
    });
    return record.active === value;
  };

  return (
    <div>
      <CommonPageHeader
        title="Manage Events"
        extra={
          <Button
            size="large"
            onClick={_openEventDrawer}
            icon={<PlusOutlined />}
          >
            Add Event
          </Button>
        }
      />
      <br />
      <Card>
        <Table
          loading={getAllEventStatus === STATUS.FETCHING}
          bordered
          dataSource={orderBy(eventList, ["createdAt"], ["desc"])}
        >
          <Table.Column
            title="Title"
            render={(d) => (
              <div>
                <Typography.Text>{d.title}</Typography.Text>
                <br />
                {d.slug && (
                  <Typography.Text type="danger">
                    <i>{d.slug}</i>
                  </Typography.Text>
                )}
              </div>
            )}
          ></Table.Column>
          <Table.Column
            width="20%"
            title="Description"
            dataIndex="body"
            render={(d, obj) => {
              let readMore =
                findIndex(descriptions, (des) => des === obj._id) !== -1;
              return d?.length > 240 ? (
                <div>
                  {readMore ? d : d.substring(0, 240) + "..."}
                  {readMore ? (
                    <Button
                      type="link"
                      color="blue"
                      style={{ padding: 0 }}
                      size="xs"
                      onClick={() => _openDescirpton(obj)}
                    >
                      read less
                    </Button>
                  ) : (
                    <Button
                      type="link"
                      color="blue"
                      style={{ padding: 0 }}
                      size="xs"
                      onClick={() => _openDescirpton(obj)}
                    >
                      read more
                    </Button>
                  )}
                </div>
              ) : (
                d
              );
            }}
          ></Table.Column>
          <Table.Column
            width="240px"
            title="Start & End Date / Time"
            key="date"
            render={(d) =>
              d.startDate ? (
                <div>
                  <Typography.Text>
                    <Typography.Text type="secondary">Start: </Typography.Text>
                    {moment(d.startDate).format("DD-MM-YYYY")}
                    {d.startTime && " " + moment(d.startTime).format("HH:mm A")}
                  </Typography.Text>
                  <br />
                  <Typography.Text>
                    <Typography.Text type="secondary">End: </Typography.Text>
                    {moment(d.endDate).format("DD-MM-YYYY")}
                    {d.endTime && " " + moment(d.endTime).format("HH:mm A")}
                  </Typography.Text>
                </div>
              ) : (
                "-"
              )
            }
          ></Table.Column>
          <Table.Column
            title="Result Date"
            width="150px"
            key="resultDate"
            render={(d) =>
              d.resultDate ? (
                <div>
                  <Typography.Text>
                    {moment(d.resultDate).format("DD-MM-YYYY")}
                  </Typography.Text>
                  <br />
                </div>
              ) : (
                "-"
              )
            }
          ></Table.Column>
          <Table.Column
            title="Input Type"
            render={(d) => (
              <Typography.Text>
                {d.userInputText && !isElement(d.userInputText) && (
                  <Tag>Text</Tag>
                )}{" "}
                {d.userInputFile && !isEmpty(d.userInputFile) && (
                  <Tag>File</Tag>
                )}
              </Typography.Text>
            )}
          />
          <Table.Column
            filters={filters}
            onFilter={onFilter}
            title="Active"
            dataIndex="active"
            key="active"
            render={(d) =>
              d ? (
                <Tag color="success">Active</Tag>
              ) : (
                <Tag color="red">Inactive</Tag>
              )
            }
          ></Table.Column>
          <Table.Column title="Priority" dataIndex="priority"></Table.Column>
          <Table.Column
            title="Actions"
            key="actions"
            render={(d) => (
              <Space>
                <Tooltip title="Students">
                  <Link to={"/event-student-list/" + d._id}>
                    <Button icon={<UserOutlined />}></Button>
                  </Link>
                </Tooltip>
                <Tooltip title="Edit">
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => editEvent(d)}
                  ></Button>
                </Tooltip>
                <Tooltip title="Preview">
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => previewEvent(d._id)}
                  ></Button>
                </Tooltip>
                <Tooltip title="Delete">
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => deleteEvent(d)}
                  ></Button>
                </Tooltip>
              </Space>
            )}
          ></Table.Column>
        </Table>
      </Card>
      {eventDrawer ? (
        <AddEvent visible={eventDrawer} closeModal={_openEventDrawer} />
      ) : null}
      {editEventDrawer ? (
        <AddEvent
          visible={editEventDrawer}
          closeModal={editEvent}
          currentEvent={editEventDrawer}
        />
      ) : null}
    </div>
  );
};

const AddEvent = ({ visible, closeModal, currentEvent }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { addEventStatus, updateEventStatus } = useSelector((state) => ({
    addEventStatus: state.event.addEventStatus,
    updateEventStatus: state.event.updateEventStatus,
  }));

  const [uploadFileModal, openUploadFileModal] = useState();
  const [eventFiles, setEventFiles] = useState([]);
  const [image, setImage] = useState();

  useEffect(() => {
    if (currentEvent?.eventFiles?.length) {
      setEventFiles(currentEvent.eventFiles.map((f) => omit(f, "_id")));
    }

    if (currentEvent?.image) {
      setImage(currentEvent.image);
    }
  }, [currentEvent]);

  const addEvent = (formData) => {
    let data = {
      ...omit(formData, ["date"]),
      startDate: formData.date?.[0]?.format("YYYY-MM-DD") || "",
      endDate: formData.date?.[1]?.format("YYYY-MM-DD") || "",
      priority: parseInt(formData.priority),
      startTime: formData.startTime?.toDate() || "",
      endTime: formData.endTime?.toDate() || "",
      resultDate: formData.resultDate?.format("YYYY-MM-DD") || "",
      userInput: formData.userInput?.length ? true : false,
      userInputFile:
        formData.userInput && indexOf(formData.userInput, "file") !== -1
          ? formData.userInputFile
          : null,
      userInputText:
        formData.userInput && indexOf(formData.userInput, "text") !== -1
          ? formData.userInputText
          : null,
      eventFiles,
      image: image || null,
    };

    if (currentEvent)
      dispatch(updateEventAction({ ...data, eventId: currentEvent._id }));
    else dispatch(addEventAction(data));
  };

  const files = ["All", "Image", "PDF", "Documents", "Excel"];

  const inputType = Form.useWatch("userInput", form);

  const initialValues = useMemo(() => {
    if (currentEvent) {
      const {
        title,
        body,
        startDate,
        endDate,
        startTime,
        endTime,
        resultDate,
        active,
        slug,
        priority,
        showOnHomePage,
        userInput,
        userInputText,
        userInputFile,
      } = currentEvent;
      let data = {
        title,
        body,
        active,
        slug,
        priority,
        showOnHomePage,
        userInputText,
        userInputFile,
        date: startDate ? [moment(startDate), moment(endDate)] : [],
        startTime: startTime ? moment(startTime) : null,
        endTime: endTime ? moment(endTime) : null,
        resultDate: resultDate ? moment(resultDate) : null,
      };

      let userInputTypes = [];
      console.log("iiii", userInputFile, userInputText);
      if (userInput) {
        if (userInputFile && !isEmpty(userInputFile)) {
          userInputTypes.push("file");
        }

        if (userInputText && !isEmpty(userInputText)) {
          userInputTypes.push("text");
        }
      }

      console.log("userInputTypes", userInputTypes);
      data = { ...data, userInput: userInputTypes };

      return data;
    }
    return {};
  }, [currentEvent]);

  const _uploadFile = () => {
    openUploadFileModal((d) => !d);
  };

  const _saveFiles = (files) => {
    setEventFiles((d) => [...d, ...files]);
  };

  const _removeFile = (url) => {
    const files = [...eventFiles];
    remove(files, (f) => f.url === url);
    setEventFiles(files);
  };

  const _changeImage = (img) => {
    if (img?.file?.response) setImage(img.file.response.url);
  };

  return (
    <Drawer
      width="60%"
      visible={visible}
      onClose={closeModal}
      title={currentEvent ? "Update Event" : "Add Event"}
    >
      {uploadFileModal ? (
        <UploadFileModal
          saveFiles={_saveFiles}
          visible={uploadFileModal}
          closeModal={_uploadFile}
        />
      ) : null}
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        onFinish={addEvent}
        form={form}
        initialValues={initialValues}
      >
        <Form.Item
          label="Image"
          rules={[{ required: true, message: "Please fill in the field." }]}
          name="title"
        >
          <UploadImageBox
            onRemove={() => setImage()}
            key={image}
            defaultImg={image}
            disableAlert
            getImage={_changeImage}
          />
        </Form.Item>
        <Form.Item
          label="Title"
          rules={[{ required: true, message: "Please fill in the field." }]}
          name="title"
        >
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item label="Slug" name="slug">
          <Input placeholder="Slug" min={0} />
        </Form.Item>
        <Form.Item label="Description" name="body">
          <TextArea rows={4} placeholder="Description" />
        </Form.Item>
        <Form.Item label="Upload Files" name="eventFiles">
          <Button icon={<SelectOutlined />} onClick={_uploadFile}>
            Select Files
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Space wrap>
            {eventFiles?.length
              ? eventFiles.map((file, i) => (
                <Space size={0}>
                  <Button
                    icon={<FileTextOutlined />}
                    onClick={() => window.open(file.url, "_blank")}
                  >
                    {file.name}
                  </Button>
                  <Tooltip title="remove">
                    <Button
                      onClick={() => _removeFile(file.url)}
                      icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
                    ></Button>
                  </Tooltip>
                </Space>
              ))
              : null}
          </Space>
        </Form.Item>
        <Form.Item label="Event Start & End Date" name="date">
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item label="Event Start Time" name="startTime">
          <DatePicker picker="time" placeholder="Start Time" format="HH:mm" />
        </Form.Item>
        <Form.Item label="Event End Time" name="endTime">
          <DatePicker picker="time" placeholder="End Time" format="HH:mm" />
        </Form.Item>
        <Form.Item label="Result Date Time" name="resultDate">
          <DatePicker />
        </Form.Item>
        {console.log("inputType", inputType)}
        <Form.Item label="Input Type" name={"userInput"}>
          <Checkbox.Group
            options={[
              { label: "Text", value: "text" },
              { label: "File", value: "file" },
            ]}
            optionType="default"
          />
        </Form.Item>
        {inputType && findIndex(inputType, (d) => d === "text") !== -1 ? (
          <>
            <Form.Item
              label="Max. Text Characters"
              name={["userInputText", "maxTextLength"]}
            >
              <InputNumber type="number" placeholder="max" min={1} />
            </Form.Item>
            <Form.Item
              label="Min. Text Characters"
              name={["userInputText", "minTextLength"]}
            >
              <InputNumber type="number" placeholder="min" min={1} />
            </Form.Item>
          </>
        ) : null}
        {inputType && findIndex(inputType, (d) => d === "file") !== -1 ? (
          <>
            <Form.Item
              label="Type of Files"
              name={["userInputFile", "fileTypes"]}
            >
              <Select allowClear placeholder="select file type">
                {files.map((file) => (
                  <Select.Option key={file}>{file}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Number of Files"
              name={["userInputFile", "noOfFiles"]}
            >
              <InputNumber type="number" placeholder="count" min={1} />
            </Form.Item>
            <Form.Item
              label="Max. Size of Files"
              name={["userInputFile", "maxSizeOfFile"]}
            >
              <Input placeholder="eg. 20KB" />
            </Form.Item>
          </>
        ) : null}
        <Form.Item label="Active" name="active">
          <Radio.Group>
            <Radio.Button value={true}>Yes</Radio.Button>
            <Radio.Button value={false}>No</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Priority" name="priority">
          <Input type="number" placeholder="Priority" min={0} />
        </Form.Item>
        <Form.Item label="Show on Home" name="showOnHomePage">
          <Switch defaultChecked={initialValues.showOnHomePage} />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 16, offset: 6 }}>
          <Space>
            <Button onClick={closeModal}>Cancel</Button>
            <Button
              type="primary"
              loading={
                addEventStatus === STATUS.FETCHING ||
                updateEventStatus === STATUS.FETCHING
              }
              htmlType="submit"
            >
              {currentEvent ? "Update" : "Add"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

const UploadFileModal = ({ visible, closeModal, saveFiles }) => {
  const [filesList, setFiles] = useState([]);
  const [loading, setLoading] = useState();

  const _change = (resp) => {
    setLoading(resp.file.status);
    if (resp?.fileList?.length) {
      let data = filter(resp.fileList, (file) => file.status === "done");
      data = data.length
        ? data.map((d) => ({ url: d.response.url, name: "" }))
        : [];
      setFiles((d) => uniqBy([...d, ...data], (d) => d.url));
    }
  };

  const _removeFile = (id) => {
    let files = [...filesList];
    const indx = findIndex(files, (f) => f.url === id);
    files.splice(indx, 1);
    setFiles(files);
  };

  const _handleChange = (id, value) => {
    let files = [...filesList];
    const indx = findIndex(files, (f) => f.url === id);
    files[indx].name = value;
    setFiles(files);
  };

  const _submit = () => {
    const list = filter(filesList, (f) => f.name);
    saveFiles(list);
    closeModal();
  };

  return (
    <Modal
      title="Upload File"
      onOk={_submit}
      okText="Done"
      visible={visible}
      onCancel={closeModal}
    >
      <Form.Item label="Select Files">
        <Upload
          maxCount={1}
          showUploadList={false}
          action={BaseURL + "app/file"}
          onChange={_change}
        >
          <Button loading={loading === "uploading"} icon={<UploadOutlined />}>
            Upload File
          </Button>
        </Upload>
      </Form.Item>
      <List
        dataSource={filesList}
        renderItem={(file) => (
          <List.Item>
            <Space>
              <Space>
                <Input
                  value={file.name}
                  onChange={(e) => _handleChange(file.url, e.target.value)}
                  placeholder="*File Name"
                />
                <Button
                  onClick={() => window.open(file.url)}
                  icon={<PaperClipOutlined />}
                >
                  View File
                </Button>
              </Space>
              <Tooltip title="Remove">
                <Button
                  danger
                  onClick={() => _removeFile(file.url)}
                  icon={<DeleteOutlined />}
                />
              </Tooltip>
            </Space>
          </List.Item>
        )}
      />
    </Modal>
  );
};
