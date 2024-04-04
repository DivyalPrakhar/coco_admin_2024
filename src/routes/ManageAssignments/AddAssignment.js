import {
  DeleteOutlined,
  FileOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Tag,
  Tooltip,
  Upload,
} from "antd";
import { Alert } from "antd";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BaseURL } from "../../BaseUrl";
import { STATUS } from "../../Constants";
import {
  addAssignmentAction,
  resetAddAssignmentStatus,
  resetUpdateAssignmentStatus,
  updateAssignmentsAction,
} from "../../redux/reducers/assignments";
import { getAllInstructionAction } from "../../redux/reducers/test";
import { FormReducer } from "../../utils/FormReducer";
import { TagsSearch } from "../ManagePackages/AddPackage";
import { AddAnswerSheetModal } from "./AddAnswerSheetModal";
import _ from "lodash";
import { SelectTagsModal } from "../ManagePackages/SelectTagsModal";
import { AddTestInstructionsModal } from "../ManageTests/AddTestInstructions";
import { useAuthUser } from "../../App/Context";
import Text from "antd/lib/typography/Text";

export const AddAssignment = ({
  closeDrawer,
  visible,
  currentAssignment,
  answersheetsList,
  exams,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const auth = useAuthUser();

  const [assignmentData, changeAssignmentData] = useReducer(FormReducer, {});

  const {
    addAssignmentStatus,
    updateAssignmentStatus,
    configData,
    allInstructionData,
  } = useSelector((state) => ({
    addAssignmentStatus: state.assignments.addAssignmentStatus,
    updateAssignmentStatus: state.assignments.updateAssignmentStatus,
    configData: state.lmsConfig,
    allInstructionData: state.test?.allInstructionData || [],
  }));

  const [fileUploadStatus, changeFileUploadStatus] = useState();
  const [answerSheetModal, changeAnswerSheetModal] = useState();
  const [tagModal, openTagsModal] = useState();
  const [selectedTags, changeSelectedTags] = useState([]);
  const [instructionsModal, changeInstructionModal] = useState({
    modal: false,
    testData: "",
  });

  useEffect(() => {
    dispatch(
      getAllInstructionAction({ instituteId: auth.staff.institute._id })
    );

    return () => {
      changeAssignmentData({ type: resetAddAssignmentStatus, value: {} });
    };
  }, [auth, dispatch]);

  useEffect(() => {
    if (currentAssignment) {
      let {
        description,
        title,
        questionPaper,
        exams,
        answerSheet,
        localAnswerSheet,
        instructions,
        modalAnswerSheet
      } = currentAssignment;
      changeAssignmentData({
        type: "reset",
        value: {
          description,
          title,
          localAnswerSheet,
          instructions: instructions?._id,
          answerSheet: answerSheet?._id,
          questionPaper,
          exams: exams?.length ? exams.map((e) => e._id) : [],
          modalAnswerSheet
        },
      });

      changeSelectedTags(
        currentAssignment.tags?.length ? currentAssignment.tags : []
      );
    }
  }, [currentAssignment]);

  useEffect(() => {
    if (
      addAssignmentStatus === STATUS.SUCCESS ||
      updateAssignmentStatus === STATUS.SUCCESS
    ) {
      form.resetFields();
      closeDrawer();
    }

    return () => {
      dispatch(resetAddAssignmentStatus());
      dispatch(resetUpdateAssignmentStatus());
    };
  }, [addAssignmentStatus, updateAssignmentStatus]);

  const changeTitle = (e) => {
    changeAssignmentData({ type: "title", value: e.target.value });
  };

  const changeDescription = (e) => {
    changeAssignmentData({ type: "description", value: e.target.value });
  };

  const changeQuestionPaper = (e) => {
    changeFileUploadStatus(e.file.status);

    if (e.file.status == "done" && e.fileList[0]?.response) {
      changeAssignmentData({
        type: "questionPaper",
        value: e.fileList[0].response.url,
      });
    }
  };

  const [modalAnswSheet, changemodalAnswSheet] = useState();


  const changeModalAnswerSheet = (e) => {
    changemodalAnswSheet(e.file.status);

    if (e.file.status == "done" && e.fileList[0]?.response) {
      changeAssignmentData({
        type: "modalAnswerSheet",
        value: e.fileList[0].response.url,
      });
    }
  };
  const changeAnswerSheet = (e) => {
    changeAssignmentData({ type: "answerSheet", value: e });
    changeAssignmentData({ type: "localAnswerSheet", value: null });
  };

  const removeFile = (e) => {
    e.stopPropagation();
    changeAssignmentData({ type: "questionPaper", value: null });
  };

  const removeModalAnswerSheet = (e) => {
    e.stopPropagation();
    changeAssignmentData({ type: "modalAnswerSheet", value: null });
  };

  const addAnswerSheet = () => {
    changeAnswerSheetModal(!answerSheetModal);
  };

  const _openTagsModal = () => {
    openTagsModal(!tagModal);
  };

  const _selectTags = (tags) => {
    changeSelectedTags(tags);
  };

  const removeTag = (id) => {
    let data = selectedTags.map((t) => t);
    _.remove(data, (d) => d._id === id);
    changeSelectedTags(data);
  };

  const selectExams = (exams) => {
    changeAssignmentData({ type: "exams", value: exams });
  };

  const updateAssignment = () => {
    const data = {
      ...assignmentData,
      assignmentId: currentAssignment._id,
      tags: selectedTags.length ? selectedTags.map((t) => t._id) : [],
    };
    dispatch(updateAssignmentsAction(data));
  };

  const changeIntroduction = (e) => {
    changeAssignmentData({ type: "instructions", value: e });
  };

  const addAssignment = () => {
    let data = Object.assign({}, assignmentData);
    data = {
      ...data,
      tags: selectedTags.length ? selectedTags.map((t) => t._id) : [],
    };
    dispatch(addAssignmentAction(data));
  };

  const [loadAnsSheet, changeLoadAnsSheet] = useState();

  const uploadAnswerSheet = (e) => {
    changeLoadAnsSheet(e.file.status);

    if (e.file.status === "done" && e.fileList[0]?.response) {
      changeAssignmentData({ type: "answerSheet", value: null });
      changeAssignmentData({
        type: "localAnswerSheet",
        value: e.fileList[0].response.url,
      });
    }
  };

  const removeAnswerSheet = (e) => {
    e.stopPropagation();
    changeAssignmentData({ type: "localAnswerSheet", value: null });
  };

  const disabled = !assignmentData.title;
  return (
    <Drawer
      title={<b>{currentAssignment ? 'Update Assignment' : 'Add Assignment'}</b>}
      visible={visible}
      width={"50%"}
      onClose={closeDrawer}
    >
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
        <Form.Item label="Title" required>
          <Input
            onChange={changeTitle}
            value={assignmentData.title}
            placeholder="Title"
          />
        </Form.Item>
        <Form.Item label="Description">
          <Input
            onChange={changeDescription}
            value={assignmentData.description}
            placeholder="Description"
          />
        </Form.Item>
        <Form.Item label="Question Paper" required>
          <Upload
            showUploadList={false}
            maxCount={1}
            onChange={changeQuestionPaper}
            listType="picture"
            // fileList={assignmentData?.questionPaper ? [{uid:1, name:'question paper', status:'done', url:assignmentData.questionPaper}] : []}
            action={BaseURL + "app/file"}
            onRemove={removeFile}
          >
            <Button
              loading={fileUploadStatus === "uploading"}
              icon={<UploadOutlined />}
            >
              {fileUploadStatus === "uploading" ? "Uploading..." : "Upload"}
            </Button>
          </Upload>
          {assignmentData?.questionPaper ? (
            <div
              onClick={() => window.open(assignmentData.questionPaper.url)}
              style={{
                padding: "4px 6px",
                cursor: "pointer",
                border: "1px solid #D6DBDF",
                alignItems: "center",
                background: "#F8F9F9",
                marginTop: 4,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Text>
                <FileOutlined /> Question Paper
              </Text>
              <Button
                icon={<DeleteOutlined />}
                size="small"
                onClick={removeFile}
              ></Button>
            </div>
          ) : null}
        </Form.Item>
        <Form.Item label="Answer Sheet">
          <div>
            <Upload
              showUploadList={false}
              onChange={uploadAnswerSheet}
              maxCount={1}
              listType="picture"
              // fileList={assignmentData?.upload ? [{uid:1, name:'Answer Sheet', status:'done', url:assignmentData.upload}] : []}
              action={BaseURL + "app/file"}
              onRemove={removeAnswerSheet}
            >
              <Button
                loading={loadAnsSheet === "uploading"}
                icon={<UploadOutlined />}
              >
                {loadAnsSheet === "uploading" ? "Uploading..." : "Upload"}
              </Button>
            </Upload>
          </div>
          {assignmentData?.localAnswerSheet ? (
            <div
              onClick={() => window.open(assignmentData.localAnswerSheet)}
              style={{
                padding: "4px 6px",
                cursor: "pointer",
                border: "1px solid #D6DBDF",
                alignItems: "center",
                background: "#F8F9F9",
                marginTop: 4,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Text>
                <FileOutlined /> Answer Sheet
              </Text>
              <Button
                icon={<DeleteOutlined />}
                size="small"
                onClick={removeAnswerSheet}
              ></Button>
            </div>
          ) : null}
          <div style={{ margin: "10px  0" }}>OR</div>
          <div style={{ display: "flex" }}>
            <div style={{ flexGrow: 1, paddingRight: "10px" }}>
              <Select
                showSearch
                placeholder="Select Answer Sheet"
                style={{ width: "100%" }}
                onClear={changeAnswerSheet}
                allowClear
                onChange={changeAnswerSheet}
                value={assignmentData.answerSheet}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {answersheetsList.length
                  ? answersheetsList.map((sheet) => (
                    <Select.Option key={sheet._id} value={sheet._id}>
                      {sheet.title}
                    </Select.Option>
                  ))
                  : null}
              </Select>
            </div>
            <div>
              <Tooltip title="Add New Answer Sheet">
                <Button
                  icon={<PlusOutlined />}
                  onClick={addAnswerSheet}
                ></Button>
              </Tooltip>
            </div>
          </div>
        </Form.Item>
        <Form.Item label="Select Instructions">
          <div style={{ display: "flex", width: "100%" }}>
            <div style={{ flexGrow: 1, paddingRight: 10 }}>
              <Select
                style={{ width: "100%" }}
                placeholder="Select Instructions"
                onChange={changeIntroduction}
                value={assignmentData?.instructions}
              >
                {_.map(allInstructionData, (s) => {
                  return (
                    <Select.Option key={s._id}>
                      {s?.name?.en || s?.name?.hn}
                    </Select.Option>
                  );
                })}
              </Select>
            </div>
            <Tooltip title="Add More">
              <Button
                icon={<PlusOutlined />}
                onClick={() => changeInstructionModal({ modal: true })}
              ></Button>
            </Tooltip>
          </div>
        </Form.Item>


        <Form.Item label="Modal Answer Sheet" required>
          <Upload
            showUploadList={false}
            maxCount={1}
            onChange={changeModalAnswerSheet}
            listType="picture"
            // fileList={assignmentData?.questionPaper ? [{uid:1, name:'question paper', status:'done', url:assignmentData.questionPaper}] : []}
            action={BaseURL + "app/file"}
            onRemove={removeModalAnswerSheet}
          >
            <Button
              loading={modalAnswSheet === "uploading"}
              icon={<UploadOutlined />}
            >
              {modalAnswSheet === "uploading" ? "Uploading..." : "Upload"}
            </Button>
          </Upload>
          {assignmentData?.modalAnswerSheet ? (
            <div
              onClick={() => window.open(assignmentData.modalAnswerSheet)}
              style={{
                padding: "4px 6px",
                cursor: "pointer",
                border: "1px solid #D6DBDF",
                alignItems: "center",
                background: "#F8F9F9",
                marginTop: 4,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Text>
                <FileOutlined /> Modal Answer Sheet
              </Text>
              <Button
                icon={<DeleteOutlined />}
                size="small"
                onClick={removeModalAnswerSheet}
              ></Button>
            </div>
          ) : null}
        </Form.Item>

        <Form.Item label="Select Exams">
          <Select
            placeholder="Select Exam"
            mode="multiple"
            value={assignmentData.exams}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={selectExams}
          >
            {configData.defaultData?.exams?.length
              ? configData.defaultData.exams.map((exam) => (
                <Select.Option key={exam._id} value={exam._id}>
                  {exam.name.en}
                </Select.Option>
              ))
              : null}
          </Select>
        </Form.Item>
        <Form.Item label="Select Tags">
          {selectedTags.length
            ? selectedTags.map((tag) => (
              <Tag
                closable
                key={tag._id}
                onClose={() => removeTag(tag._id)}
                style={{ padding: "5px 10px", marginTop: "5px" }}
              >
                {tag.name}
              </Tag>
            ))
            : null}
          <Button
            type="primary"
            ghost
            icon={<PlusOutlined />}
            style={{ marginTop: "5px" }}
            onClick={_openTagsModal}
          >
            Select Tags
          </Button>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6 }}>
          {currentAssignment ? (
            <Button
              disabled={disabled}
              loading={updateAssignmentStatus === STATUS.FETCHING}
              type="primary"
              onClick={updateAssignment}
            >
              Update
            </Button>
          ) : (
            <Button
              disabled={disabled}
              loading={addAssignmentStatus === STATUS.FETCHING}
              type="primary"
              onClick={addAssignment}
            >
              Save
            </Button>
          )}
        </Form.Item>
      </Form>
      {answerSheetModal ? (
        <AddAnswerSheetModal
          visible={answerSheetModal}
          closeModal={addAnswerSheet}
        />
      ) : null}
      {tagModal ? (
        <SelectTagsModal
          allTags
          selectedData={selectedTags}
          visible={tagModal}
          closeModal={_openTagsModal}
          submitTags={(tags) => _selectTags(tags)}
        />
      ) : null}
      {instructionsModal.modal ? (
        <AddTestInstructionsModal
          visible={instructionsModal.modal}
          closeModal={() => changeInstructionModal({ modal: false })}
        />
      ) : null}
    </Drawer>
  );
};
