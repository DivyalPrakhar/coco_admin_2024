import { Button, Card, Drawer, Form, Input, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../Constants'
import { getStatesAction } from '../redux/reducers/states'
import _ from 'lodash'
import { addAddressAction, resetUpdateAddress, updateAddressAction, updateStudentAction } from '../redux/reducers/student'

export const UpdateAddress = ({currentStudent, visible, closeDrawer}) => {
    const dispatch = useDispatch()
    const [from] = Form.useForm()
    const {states, user, student} = useSelector((state) => ({
        states:state.states,
        user:state.user.user,
        student:state.student,
    }))
    
    useEffect(() => {
        if(states.getStatesStatus != STATUS.SUCCESS)
            dispatch(getStatesAction())

        return () => dispatch(resetUpdateAddress())
    }, [])

    useEffect(() => {
        if(student.updateAddressStatus === STATUS.SUCCESS || student.addAddressStatus === STATUS.SUCCESS)
            closeDrawer()
    }, [student.updateAddressStatus, student.addAddressStatus, closeDrawer])

    const [selectedState, setState] = useState('')
    const [selectedCity, setCity] = useState('')
    const [formKey, setFormKey] = useState(1)

    useEffect(() => {
        if(states.getStatesStatus === STATUS.SUCCESS){
            let state = _.find(states.statesList, st => _.lowerCase(st.name) ===_.lowerCase( currentStudent.address?.state)) 
            let city = state?.cities?.length ? _.find(state.cities, c => _.lowerCase(c.name) === _.lowerCase(currentStudent.address?.city)) : null
            setState(state)
            setCity(city)
            setFormKey(formKey + 1)

        }
    }, [states.getStatesStatus])


    const selectState = (name) => {
        if(_.find(states.statesList,s => s.name == name))
            setState(_.find(states.statesList,s => s.name == name))
        else
            setState([])
    }

    const updateAddress = (e) => {
        if(currentStudent.address)
            dispatch(updateAddressAction({...e, addressId:currentStudent.address?._id}))
        else
            dispatch(addAddressAction({...e, userId:currentStudent.user?._id, default:true}))
    }

    const _selectState = (e) => {
        selectState(e)
        setFormKey(formKey + 1)
        setCity(null)
    }

    return(
        <Drawer title='Update Address' width='50%' onClose={closeDrawer} visible={visible}>
                <Card bordered={false} loading={states.getStatesStatus == STATUS.FETCHING }>
                    {states.getStatesStatus == STATUS.SUCCESS ?
                        <Form
                            from={from}
                            layout="horizontal"
                            size='large'
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 14 }}
                            onFinish={updateAddress}
                            key={formKey}
                        >
                            <CustomInput hidden name='id' value={currentStudent.user._id}/>
                            {/* <CustomInput name='contact' label='Contact' placeholder='contact' type='number' value={currentStudent.address?.contact}
                                rules={[{pattern:'^[7-9][0-9]{9}$', message:'enter valid contact number'}]}
                            /> */}
                            
                            <Form.Item label="Address" required name='address' initialValue={currentStudent.address?.address}>
                                <Input.TextArea required placeholder='address'/>
                            </Form.Item>
                            <Form.Item label="State" initialValue={selectedState?.name} required name='state'>
                                <Select showSearch autoComplete='invalid' allowClear required placeholder='select state'
                                    onChange={(e) => _selectState(e)}
                                    // value={selectedState?.name}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {states?.statesList?.map(state => 
                                        <Select.Option value={state.name} key={state.name}>{state.name}</Select.Option>
                                    )}
                                </Select>
                            </Form.Item>
                            <Form.Item initialValue={selectedCity?.name} key={formKey} label="City" name='city' required>
                                <Select showSearch autoComplete='invalid' required allowClear placeholder='select city'
                                    // value={selectedCity?.name}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {selectedState?.cities?.length ? selectedState.cities.map(city => 
                                        <Select.Option value={city.name} key={city.name}>{city.name}</Select.Option>
                                    ) : null}
                                </Select>
                            </Form.Item>
                            <CustomInput label='Pin Code' placeholder='pincode' type='number' value={currentStudent.address?.pincode} name='pincode'
                                // rules={[
                                //     { pattern:'^[1-9][0-9]{5}$', message:'pincode should have 6 digits'}
                                // ]}
                            />
                            <Form.Item wrapperCol={ {offset: 4}}>
                                <Button loading={student.updateAddressStatus == STATUS.FETCHING || student.addAddressStatus == STATUS.FETCHING} type="primary" htmlType="submit">
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

const CustomInput = ({label, required, name, placeholder, type, hidden, value, rules}) => {
    return(
        <Form.Item label={label} hidden={hidden} initialValue={value} rules={rules} name={name}>
            <Input placeholder={placeholder} defaultValue={value} required={required} type={type || 'text'}/>
        </Form.Item>
    )
}