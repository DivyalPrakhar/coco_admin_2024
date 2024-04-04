import { Button, Card, DatePicker, Drawer, Form, Input, Radio, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../Constants'
import { getBatchesRequest } from '../redux/reducers/batches'
import { getStatesAction } from '../redux/reducers/states'
import _ from 'lodash'
import { updateStudentAction } from '../redux/reducers/student'
import moment from 'moment'

export const UpdateProfile = ({currentStudent, visible, closeDrawer}) => {
    const dispatch = useDispatch()
    const [from] = Form.useForm()
    const {states, batches, user, student} = useSelector((state) => ({
        states:state.states,
        batches:state.batches,
        user:state.user.user,
        student:state.student,
    }))
    
    useEffect(() => {
        if(states.getStatesStatus != STATUS.SUCCESS)
            dispatch(getStatesAction())

        if(states.getBatchesStatus != STATUS.SUCCESS)
            dispatch(getBatchesRequest({id:user.staff.institute._id}))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [selectedState, setState] = useState('')
    const [selectedCity, setCity] = useState('')
    const [formKey, setFormKey] = useState(1)

    useEffect(() => {
        if(states.getStatesStatus == STATUS.SUCCESS && currentStudent.user.addresses){
            let state= _.find(states.statesList, st => st.id == currentStudent.user.addresses[0]?.district?.state.id) 
            setState(state)
            setCity(currentStudent.user.addresses?.[0]?.district?.id)
        }
    }, [currentStudent.user.addresses, states.getStatesStatus, states.statesList])


    const selectState = (id) => {
        if(_.find(states.statesList,s => s.id == id))
            setState(_.find(states.statesList,s => s.id == id))
        else
            setState([])
    }

    const updateStudent = (e) => {
        let data = {...e, dob:e.dob? e.dob.format('YYYY-MM-DD') : null}
        dispatch(updateStudentAction(data))
    }

    const _selectState = (e) => {
        selectState(e) 
        setFormKey(formKey + 1)
        setCity(null)
    }

    return(
        <Drawer title='Update Profile' width='50%' onClose={closeDrawer} visible={visible}>
                <Card bordered={false} loading={states.getStatesStatus == STATUS.FETCHING || batches.getBatchesStatus == STATUS.FETCHING}>
                    {states.getStatesStatus == STATUS.SUCCESS && batches.getBatchesStatus == STATUS.SUCCESS ?
                        <Form
                            from={from}
                            layout="horizontal"
                            size='large'
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 14 }}
                            onFinish={updateStudent}
                            key={formKey}
                        >
                            <CustomInput label='Name' required name='name' value={currentStudent.user.name}/>
                            <CustomInput hidden name='id' value={currentStudent.user._id}/>
                            <Form.Item label="Gender" initialValue={_.lowerCase(currentStudent.user.gender)} required name='gender'>
                                <Radio.Group required defaultValue={_.lowerCase(currentStudent.user.gender)}>
                                    <Radio.Button required value="male" >Male</Radio.Button>
                                    <Radio.Button required value="female">Female</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="Date of Birth" name='dob' initialValue={currentStudent.user.dob && moment(String(currentStudent.user.dob))}>
                                <DatePicker placeholder='date of birth' defaultValue={currentStudent.user.dob && moment(String(currentStudent.user.dob))}/>
                            </Form.Item>
                            <Form.Item label='Contact Number' required name='contact' initialValue={currentStudent.user.contact}>
                                <Input placeholder='contact number' required type='number'/>
                            </Form.Item>
                            <CustomInput label='E-mail' type='email' name='email' value={currentStudent.user.email}/>
                            {/* <Form.Item label="Address" required name='address' initialValue={currentStudent.user.addresses[0]?.address}>
                                <Input.TextArea required placeholder='address'/>
                            </Form.Item>
                            <Form.Item label="State" initialValue={currentStudent.user.addresses[0]?.district.state.id} required name='stateId'>
                                <Select required showSearch autoComplete='invalid' allowClear placeholder='select state'
                                    defaultValue={currentStudent.user.addresses[0]?.district.state.id}
                                    onChange={(e) => _selectState(e)}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {states?.statesList?.map(state => 
                                        <Select.Option value={state.id} key={state.id}>{state.name}</Select.Option>
                                    )}
                                </Select>
                            </Form.Item>
                            <Form.Item initialValue={selectedCity} key={formKey} label="City" name='cityId' required>
                                <Select required showSearch autoComplete='invalid' allowClear placeholder='select city'
                                    defaultValue={selectedCity}
                                    value={selectedCity}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {selectedState?.cities?.length ? selectedState.cities.map(city => 
                                        <Select.Option value={city.id} key={city.id}>{city.name}</Select.Option>
                                    ) : null}
                                </Select>
                            </Form.Item>
                            <CustomInput label='Pin Code' type='number' value={currentStudent.user.addresses[0]?.pincode} required name='pincode'/> */}
                            <Form.Item wrapperCol={ {offset: 4}}>
                                <Button loading={student.updateStudentStatus == STATUS.FETCHING} type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                        :
                        null
                    }
                </Card>
        </Drawer>
    )
}

const CustomInput = ({label, required, name, placeholder, type, hidden, value}) => {
    return(
        <Form.Item label={label} hidden={hidden} required={required} initialValue={value} name={name}>
            <Input placeholder={placeholder} required={required} type={type || 'text'}/>
        </Form.Item>
    )
}