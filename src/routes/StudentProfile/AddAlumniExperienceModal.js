import moment from "moment";
import {
  Card,
  Form,
  Modal,
  Button,
  Input,
  DatePicker,
  Switch,
  Select,
  Tooltip
} from "antd";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import {
  addExperienceAction,
  editExperienceAction,
  resetExperienceStatusAction,
  deleteAlumniExperienceAction,
} from "../../redux/reducers/student";
import { useDispatch } from "react-redux";

import _ from "lodash";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

const tailLayout = {
  wrapperCol: { offset:3, span: 21 },
};

const EmploymentTypeData = [
  {id: 1, type: "Full-time"}, 
  {id: 2, type: "Part-time"},
  {id: 3, type: "Self-employeed"},
  {id: 4, type: "Freelance"},
  {id: 5, type: "Internship"},
  {id: 6, type: "Trainee"}
]

export const AddAlumniExperienceModal = (props) => {
  const dispatch = useDispatch();

  let [formKey, setFromKey] = useState(1)
  const [stateData, stateChange] = useState({
    memberId: props.student.currentAlumni.id,
    location: '',
    title: '',
    company: '',
    employmentType: "",
    description: '',
    startDate: '',
    endDate: '',
    current: false
  });

  const curretStateData = () => {
    stateChange({
      memberId: props.student.currentAlumni.id,
      location: props.preSelected.location ? props.preSelected.location : "",
      title: props.preSelected.title ? props.preSelected.title : "",
      company: props.preSelected.company ? props.preSelected.company : "",
      employmentType: props.preSelected.employmentType ? _.get(_.find(EmploymentTypeData, e => e.type == props.preSelected.employmentType), 'id', '') : "",
      description: props.preSelected.description ? props.preSelected.description : "",
      startDate: props.preSelected.startDate ? moment(props.preSelected.startDate) : "",
      endDate: props.preSelected.endDate ? moment(props.preSelected.endDate) : "",
      current: props.preSelected.current ? props.preSelected.current : false,
    });
  };

  useEffect(() => {
    if (props.preSelected) {
      curretStateData();
      setFromKey(++formKey)
    }
  }, [props.preSelected]);

  useEffect(() => {
    if (props.alumni.addExperienceStatus == "SUCCESS" || props.alumni.deleteAlumniExperienceStatus == 'SUCCESS') {
      stateChange({
        memberId: props.alumni.currentAlumni.id,
        location: '',
        title: '',
        company: '',
        employmentType: '',  
        description: '',
        startDate: '',
        endDate: '',
        current: false
      });
      dispatch(resetExperienceStatusAction());
      props.closeModal();
    }
  }, [props.alumni.addExperienceStatus, props.alumni.deleteAlumniExperienceStatus]);

  const onFinish = () => {
    let data;
    if (props.preSelected) {
      data = {
        id: props.preSelected.id,
        location:  stateData.location,
        title:  stateData.title,
        company:  stateData.company,
        employmentType: _.get(_.find(EmploymentTypeData, e => e.id == stateData.employmentType), 'type', ''),
        description:  stateData.description,
        startDate:  moment(stateData.startDate).format('YYYY/MM/DD'),
        endDate:  stateData.current ? null : moment(stateData.endDate).format('YYYY/MM/DD'),
        current:  stateData.current
      };
      dispatch(editExperienceAction(data));
    } else {
      data = {
        memberId: props.alumni.currentAlumni.id,
        location:  stateData.location,
        title:  stateData.title,
        company:  stateData.company,
        employmentType: _.get(_.find(EmploymentTypeData, e => e.id == stateData.employmentType), 'type', ''),
        description: stateData.description,
        startDate: moment(stateData.startDate).format('YYYY/MM/DD'),
        endDate:  stateData.current ? null : moment(stateData.endDate).format('YYYY/MM/DD'),
        current: stateData.current
      };
      dispatch(addExperienceAction(data));
    } 
  };

  let selectFormData = (value, type) => {
    if(type == 'current' && value == true){
      stateChange({ ...stateData, endDate: '', [type]: value });
    }else{
      stateChange({ ...stateData, [type]: value });
    }
  };

  const deleteAlumniExperience = (id) => {
    dispatch(deleteAlumniExperienceAction({id}));
  }
  
  return (
    <Modal
      visible={props.experienceModal}
      footer={null}
      width="1000px"
      onOk={() => console.log("")}
      onCancel={() => props.closeModal()}
      key={formKey}
    >
      <div style={{ padding: "20px" }}>
        <Card title={
          <div>
            <span>{props.preSelected ? "Edit Experience" : "Add Experience"}</span>
            {props.preSelected ? 
              <span style={{float: 'right'}}>
                <Tooltip placement="top" title='Delete Experience'>
                  <AiOutlineDelete 
                    fontSize="24px"
                    cursor="pointer"
                    onClick={() => deleteAlumniExperience(props.preSelected.id)}
                  />
                </Tooltip>
              </span>
            : null}
          </div>} 
        bordered={false} style={{ width: "100%" }}>
          <Form {...formItemLayout} layout="horizontal">
            <Form.Item label="Title">
              <Input
                placeholder="Input Title"
                onChange={(e) => selectFormData(e.target.value, "title")}
                defaultValue={stateData.title}
                value={stateData.title}
              />
            </Form.Item>
            <Form.Item label="Company">
              <Input
                placeholder="Input Company"
                onChange={(e) => selectFormData(e.target.value, "company")}
                defaultValue={stateData.company}
                value={stateData.company}
              />
            </Form.Item>
            <Form.Item label="Employment Type" >
              <Select placeholder='Select Employment Type' defaultValue={stateData.employmentType} onChange={(e) => selectFormData(e, "employmentType")}>
                  
                  {EmploymentTypeData.map((s,i) => {
                    return(
                      <Select.Option value={s.id} key={i}>{s.type}</Select.Option>
                    )}
                  )}
              </Select>
            </Form.Item>
            <Form.Item label="Description">
              <Input
                placeholder="Input Description"
                onChange={(e) => selectFormData(e.target.value, "description")}
                defaultValue={stateData.description}
                value={stateData.description}
              />
            </Form.Item>
            <Form.Item label="Location">
              <Input
                placeholder="Input Location"
                onChange={(e) => selectFormData(e.target.value, "location")}
                defaultValue={stateData.location}
                value={stateData.location}
              />
            </Form.Item>
            <Form.Item label="Start Date" style={{ marginBottom: 0 }}>
              <Form.Item style={{ display: "inline-block", width: "43%" }}>
                <DatePicker onChange={(e) => selectFormData(e, "startDate")} defaultValue={stateData.startDate} value={stateData.startDate}/>
              </Form.Item>
              <span style={{ display: "inline-block", width: "80px", lineHeight: "32px", textAlign: "center" }}>
                End Date:
              </span>
              <Form.Item style={{ display: "inline-block", width: "30%" }}>
                <DatePicker disabled={stateData.current} onChange={(e) => selectFormData(e, "endDate")} defaultValue={stateData.endDate} value={stateData.endDate}/>
              </Form.Item>
            </Form.Item>
            <Form.Item label="Currently Working">
              <Switch checked={stateData.current} defaultChecked={false} onChange={(e) => selectFormData(e, "current")}/>
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Button type="primary" onClick={() => onFinish()}>
                  {props.preSelected ? "Edit Experience" : "Add Experience"}
                </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Modal>
  );
};
