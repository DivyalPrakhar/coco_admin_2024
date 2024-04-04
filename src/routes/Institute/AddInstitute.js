import { Button, Card, Input, Form, Select, DatePicker, Modal } from 'antd';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux' 
import { useState, useEffect } from 'react';

import { addInstituteAction, editInstituteAction, resetEditStatusAction } from '../../redux/reducers/institute'
import { getStatesAction } from '../../redux/reducers/states'

import _ from 'lodash';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

export const EditInstituteModal = (props) => {
  return(
    <Modal visible={props.editInstituteModal} footer={null} width='1000px' onOk={() => console.log('')} onCancel={() => props.closeModal()}>
      <AddInstitute {...props}/>
    </Modal>
  )
}

export function AddInstitute(props) {
  const [form] = Form.useForm();
  const dispatch = useDispatch()

  const [stateData, stateChange] = useState({address: '', contact: '', email: '', name: '', code: '', activationDate: '', state: '', city: ''})

  const {data, states} = useSelector(s => ({
        data: s.institute,
        states: s.states
    }))

  const curretStateData = () => {
    stateChange({
      address: props.preSelected.address ? props.preSelected.address : '', 
      contact: props.preSelected.contact ? props.preSelected.contact : '', 
      email: props.preSelected.email ? props.preSelected.email : '', 
      name: props.preSelected.name ? props.preSelected.name : '', 
      code: props.preSelected.code ? props.preSelected.code : '', 
      activationDate: props.preSelected.activationDate ? moment(props.preSelected.activationDate) : '',
      state: props.preSelected.state ? props.preSelected.state : '',
      city: props.preSelected.city ? props.preSelected.city : ''
    })
  }

  useEffect(() => {
    if(props.preSelected){
      curretStateData()
    }
    if(states.getStatesStatus != "SUCCESS"){
      dispatch(getStatesAction())
    }
  }, [props.preSelected])

  useEffect(() => {
    if(data.addStatus == "SUCCESS"){
      if(props.editInstituteModal){
        dispatch(resetEditStatusAction())
        props.closeModal()
      }
      stateChange({address: '', contact: '', email: '', name: '', code: '', activationDate: '', state: '', city: ''})
    }
    
    if(states.getStatesStatus != "SUCCESS"){
      dispatch(getStatesAction())
    }
  }, [data.addStatus])

  const onFinish = () => {
    if(props.preSelected){
      dispatch(editInstituteAction({
          instituteId: _.toString(props.preSelected._id),
          address: stateData.address, 
          city: stateData.city,
          contact: stateData.contact,
          email: stateData.email,
          name: stateData.name,
          state: stateData.state,
          code: stateData.code,
          activationDate: moment(stateData.activationDate).format('YYYY/MM/DD')
        })
      )
    }else{
      dispatch(addInstituteAction({
          address: stateData.address, 
          city: stateData.city,
          contact: stateData.contact,
          email: stateData.email,
          name: stateData.name,
          state: stateData.state,
          code: stateData.code,
          activationDate: moment(stateData.activationDate).format('YYYY/MM/DD')
        })
      )
    }
  };

  let selectFormData = (value, type) => {
    stateChange({...stateData, [type]: value})
  }

  return (
    <div style={{padding: '20px'}}>
    {states.getStatesStatus == "SUCCESS" ?
      <Card title={props.editInstituteModal ? "EDIT INSTITUTE" : "ADD INSTITUTE"} bordered={false} style={{ width: '100%' }}>
        <Form
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          onSubmitCapture={onFinish}
        >
          <Form.Item label="Name">
            <Input placeholder="Input Name" onChange={(e) => selectFormData(e.target.value, 'name')} defaultValue={stateData.name} value={stateData.name}/>
          </Form.Item>
          <Form.Item label="Address">
            <Input placeholder="Input Address"  onChange={(e) => selectFormData(e.target.value, 'address')} defaultValue={stateData.address} value={stateData.address}/>
          </Form.Item>
          <Form.Item label="State">
            <Select showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onChange={(e) => selectFormData(e, 'state')} defaultValue={stateData.state} value={stateData.state}>
              <Select.Option value=''>Select State</Select.Option>
              {_.map(states.statesList, (s,i) => (
                <Select.Option key={i} value={s.name}>{s.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="City">
            <Select showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onChange={(e) => selectFormData(e, 'city')} defaultValue={stateData.city} value={stateData.city}>
              <Select.Option value=''>Select City</Select.Option>
              {stateData.state ? 
                _.map(_.get(_.find(states.statesList, s => stateData.state ? s.name == stateData.state : false), 'cities', []), (c,i) => (
                <Select.Option key={i} value={c.name}>{c.name}</Select.Option>
              ))
                : null
              }
            </Select>
          </Form.Item>
          <Form.Item label="E-mail" rules={[{type: 'email', message: 'The input is not valid E-mail!'}]}>
            <Input placeholder="Input Email" onChange={(e) => selectFormData(e.target.value, 'email')} defaultValue={stateData.email} value={stateData.email}/>
          </Form.Item>
          <Form.Item label="Contact">
            <Input placeholder="Input Contact" onChange={(e) => selectFormData(e.target.value, 'contact')} defaultValue={stateData.contact} value={stateData.contact}/>
          </Form.Item>
          <Form.Item label="Code">
            <Input placeholder="Input Code" onChange={(e) => selectFormData(e.target.value, 'code')} defaultValue={stateData.code} value={stateData.code}/>
          </Form.Item>
          <Form.Item label="Activation Date">
            <DatePicker format='YYYY/MM/DD' onChange={(e) => selectFormData(e, 'activationDate')} defaultValue={stateData.activationDate} value={stateData.activationDate}/>
          </Form.Item>
          <Form.Item wrapperCol={ {offset: 4}}>
              <Button type="primary" shape='round' htmlType="submit">
                Submit
              </Button>
          </Form.Item>
        </Form>
      </Card>
    : null}
    </div> 
  );
}


