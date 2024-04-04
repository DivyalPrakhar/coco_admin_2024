import moment from "moment";
import {
  Tag,
  Tooltip,
  Avatar,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Row,
  Form,
  Modal,
  Button,
  Input,
  DatePicker,
} from "antd";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import { FcGraduationCap, FcManager } from "react-icons/fc";
import React, { useEffect, useState } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import {
  getAlumniAction,
  addEducationAction,
  editEducationAction,
  resetEducationStatusAction,
  deleteAlumniEducationAction,
} from "../../redux/reducers/student";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { STATUS } from "../../Constants";
import { getSingleInstituteAction } from "../../redux/reducers/instituteStaff";
import { AssignStudentGroups } from "../../components/AssignStudentGroups";

import _ from "lodash";
import { UpdateProfile } from "../../components/UpdateStudentProfile";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

const tailLayout = {
  wrapperCol: { offset:3, span: 21 },
};

export const AddAlumniEducationModal = (props) => {
  const dispatch = useDispatch();

  const [stateData, stateChange] = useState({
    school: "",
    degree: "",
    studyField: "",
    memberId: props.alumni.currentAlumni.id,
    startYear: "",
    endYear: "",
  });

  const curretStateData = () => {
    stateChange({
      school: props.preSelected.school ? props.preSelected.school : "",
      degree: props.preSelected.degree ? props.preSelected.degree : "",
      studyField: props.preSelected.studyField
        ? props.preSelected.studyField
        : "",
      memberId: props.alumni.currentAlumni.id,
      startYear: props.preSelected.startYear
        ? moment(props.preSelected.startYear, "YYYY")
        : "",
      endYear: props.preSelected.endYear
        ? moment(props.preSelected.endYear, "YYYY")
        : "",
    });
  };

  useEffect(() => {
    if (props.preSelected) {
      curretStateData();
    }
  }, [props.preSelected]);

  useEffect(() => {
    if (props.alumni.addEducationStatus == "SUCCESS" || props.alumni.deleteAlumniEducationStatus == 'SUCCESS') {
      stateChange({
        school: "",
        degree: "",
        studyField: "",
        memberId: props.alumni.currentAlumni.id,
        startYear: "",
        endYear: "",
      });
      dispatch(resetEducationStatusAction());
      props.closeModal();
    }
  }, [props.alumni.addEducationStatus, props.alumni.deleteAlumniEducationStatus]);

  const onFinish = () => {
    let data;
    if (props.preSelected) {
      data = {
        id: props.preSelected.id,
        school: stateData.school,
        degree: stateData.degree,
        studyField: stateData.studyField,
        startYear: moment(stateData.startYear).format("YYYY"),
        endYear: moment(stateData.endYear).format("YYYY"),
      };
      dispatch(editEducationAction(data));
    } else {
      data = {
        school: stateData.school,
        degree: stateData.degree,
        studyField: stateData.studyField,
        memberId: props.alumni.currentAlumni.id,
        startYear: moment(stateData.startYear).format("YYYY"),
        endYear: moment(stateData.endYear).format("YYYY"),
      };
      dispatch(addEducationAction(data));
    }
  };

  let selectFormData = (value, type) => {
    stateChange({ ...stateData, [type]: value });
  };

  const deleteAlumniEducation = (id) => {
    dispatch(deleteAlumniEducationAction({id}));
  }

  return (
    <Modal
      visible={props.educationModal}
      footer={null}
      width="1000px"
      onOk={() => console.log("")}
      onCancel={() => props.closeModal()}
    >
      <div style={{ padding: "20px" }}>
        <Card title={
          <div>
            <span>{props.preSelected ? "Edit Education" : "Add Education"}</span>
            {props.preSelected ? 
              <span style={{float: 'right'}}>
                <Tooltip placement="top" title='Delete Education'>
                  <AiOutlineDelete 
                    fontSize="24px"
                    cursor="pointer"
                    onClick={() => deleteAlumniEducation(props.preSelected.id)}
                  />
                </Tooltip>
              </span>
            : null}
          </div>} 
        bordered={false} style={{ width: "100%" }}>
          <Form {...formItemLayout} layout="horizontal">
            <Form.Item label="School">
              <Input
                placeholder="Input School Name"
                onChange={(e) => selectFormData(e.target.value, "school")}
                defaultValue={stateData.school}
                value={stateData.school}
              />
            </Form.Item>
            <Form.Item label="Degree">
              <Input
                placeholder="Input Degree"
                onChange={(e) => selectFormData(e.target.value, "degree")}
                defaultValue={stateData.degree}
                value={stateData.degree}
              />
            </Form.Item>
            <Form.Item label="Study Field">
              <Input
                placeholder="Input StudyField"
                onChange={(e) => selectFormData(e.target.value, "studyField")}
                defaultValue={stateData.studyField}
                value={stateData.studyField}
              />
            </Form.Item>
            <Form.Item label="Start Year" style={{ marginBottom: 0 }}>
              <Form.Item style={{ display: "inline-block", width: "43%" }}>
                <DatePicker
                  picker="year"
                  format="YYYY"
                  onChange={(e) => selectFormData(e, "startYear")}
                  defaultValue={stateData.startYear}
                  value={stateData.startYear}
                />
              </Form.Item>
              <span
                style={{
                  display: "inline-block",
                  width: "80px",
                  lineHeight: "32px",
                  textAlign: "center",
                }}
              >
                End Year:
              </span>
              <Form.Item style={{ display: "inline-block", width: "30%" }}>
                <DatePicker
                  picker="year"
                  format="YYYY"
                  onChange={(e) => selectFormData(e, "endYear")}
                  defaultValue={stateData.endYear}
                  value={stateData.endYear}
                />
              </Form.Item>
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Button type="primary" onClick={() => onFinish()}>
                  {props.preSelected ? "Edit Education" : "Add Education"}
                </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Modal>
  );
};
