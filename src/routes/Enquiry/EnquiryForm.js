import { Button, Card, DatePicker, Form, Input, Radio, Select } from "antd";
import { filter, find, findIndex, lowerCase, map, omit, sortBy } from "lodash";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { CommonPageHeader } from "../../components/CommonPageHeader";
import { UploadImageBox } from "../../components/UploadImageBox";
import { STATUS } from "../../Constants";
import { addEnquiryAction } from "../../redux/reducers/offlineEnquiry/Enquiry";
import { getOfflineCourseAction } from "../../redux/reducers/offlineEnquiry/OfflineCourse";
import { getStatesAction } from "../../redux/reducers/states";
import { useCheckStatus } from "../../utils/useCheckStatus";

export default function EnquiryForm() {
    const dispatch = useDispatch()
    const history = useHistory()
    const [form] = Form.useForm();
    const [profilePic, changeProfilePic] = useState()

    const { states, user } = useSelector((state) => ({
        states: state.states,
        user: state.user.user,
    }))

    
    useEffect(() => {
        if (states.getStatesStatus !== STATUS.SUCCESS)
            dispatch(getStatesAction())
    }, [dispatch, states.getStatesStatus])

    const { allOfflineCourses, getOfflineCourseStatus } = useSelector(s => s.offlineCourse)

    useEffect(() => {
        if (getOfflineCourseStatus !== STATUS.SUCCESS) {
            dispatch(getOfflineCourseAction())
        }
    }, [dispatch, getOfflineCourseStatus])

    const [selectedState, setState] = useState('')
    const [selectedCity, setCity] = useState('')
    const [formKey, setFormKey] = useState(1)

    useEffect(() => {
        if (states.getStatesStatus === STATUS.SUCCESS) {
            // let state = find(states.statesList, st => lowerCase(st.name) === lowerCase(currentStudent?.address?.state))
            // let city = state?.cities?.length ? find(state.cities, c => lowerCase(c.name) === lowerCase(currentStudent?.address?.city)) : null
            setState('')
            setCity('')
            setFormKey(formKey + 1)

        }
    }, [states.getStatesStatus])

    const selectState = (name) => {
        if (find(states.statesList, s => s.name === name))
            setState(find(states.statesList, s => s.name === name))
        else
            setState([])
    }
    const _selectState = (e) => {
        selectState(e)
        setFormKey(formKey + 1)
        setCity(null)
    }

    const changeImage = (img) => {
        changeProfilePic(img)
    }

    const addEnquiry = (data) => {
        // let address = {
        //     address: data.address,
        //     landmark: data.landmark,
        //     city: data.city,
        //     state: data.state,
        //     pincode: data.pincode
        // }
        dispatch(addEnquiryAction({
            course: data.course,
            reference: data.reference,
            userData: ({ ...omit(data, 'course', 'reference') })
        }))
    }
    const { addEnquiryStatus } = useSelector(s => s.enquiry)


    useCheckStatus({
        status: addEnquiryStatus,
        onSuccess: () => {
            history.push('/list-enquiry')
        },
    });
    return (
        <div>
            <CommonPageHeader
                title='Add Enquiry'
            />
            <br />
            <Card >
                <Form
                    form={form}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    size='large'
                    onFinish={addEnquiry}
                >
                    <Card style={{ padding: 0, border: 0 }}>
                        {/* <Form.Item label="Student Image">
                            <UploadImageBox ratio={'1:1'} getImage={changeImage} />
                        </Form.Item> */}
                        <CustomInput label="Full Name" rules={[{ required: true, message: 'Please fill in the field.' }]} name='name' placeholder='Name' />
                        <CustomInput hidden name='instituteId' value={user?.staff.institute._id} />
                        <CustomInput hidden name='avatar' value={profilePic?.file?.response?.url} />
                        <CustomInput hidden name='default' value={true} />
                        {/* <Form.Item label="Gender" rules={[{ required: true, message: 'Please pick a gender.' }]} name='gender'>
                            <Radio.Group required>
                                <Radio.Button required value="male" >Male</Radio.Button>
                                <Radio.Button required value="female">Female</Radio.Button>
                            </Radio.Group>
                        </Form.Item> */}
                        {/* <Form.Item label="Date of Birth" rules={[{ required: true, message: 'Please select date of birth.' }]} name='dob'>
                            <DatePicker name placeholder='Date Of Birth' />
                        </Form.Item> */}
                        <CustomInput label="E-mail" type='email' rules={[{ required: true, message: 'Please fill in the field.' }]} name='email' placeholder='Email' />
                        <Form.Item label='Contact Number'
                            rules={[{ required: true, message: 'Please fill in the field.' }, { pattern: '^[6-9][0-9]{9}$', message: 'Enter valid contact number' }]} name='contact'
                        >
                            <Input placeholder='Contact Number' type='number' />
                        </Form.Item>
                        {/* <CustomInput label="Father Name" name='fatherName' placeholder='Father Name' />
                        <CustomInput label="Father Contact" rules={[{ pattern: '^[6-9][0-9]{9}$', message: 'Enter valid contact number' }]} name='fatherContact' placeholder='Father Contact' />
                        <CustomInput label="Mother Name" name='motherName' placeholder='Mother Name' /> */}
                        <CustomInput label="Qualifications" rules={[{ required: true, message: 'Please fill in the field.' }]} name='qualifcations' placeholder='Qualifications' />
                        <Form.Item label="Interested Course" rules={[{ required: true, message: 'Please select course.' }]} name='course'>
                            <Select showSearch autoComplete='invalid' allowClear placeholder='Select Course'>
                                {allOfflineCourses?.length ?
                                    map(filter(allOfflineCourses, c => c.isActive === true), course => (
                                        <Select.Option value={course._id}>{course.name}</Select.Option>
                                    ))
                                    :
                                    null
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="How did you come to know about CoCo" name='reference'>
                            <Select showSearch autoComplete='invalid' allowClear placeholder='Select One'>
                                <Select.Option value={"Promotion Team"}>Promotion Team</Select.Option>
                                <Select.Option value={"Newspaper"}>Newspaper</Select.Option>
                                <Select.Option value={"Teachers"}>Teachers</Select.Option>
                                <Select.Option value={"Friends/Relatives"}>Friends/Relatives</Select.Option>
                                <Select.Option value={"College Seminar"}>College Seminar</Select.Option>
                                <Select.Option value={"Ex-Student"}>Ex-Student</Select.Option>
                                <Select.Option value={"Website"}>Website</Select.Option>
                                <Select.Option value={"Radio/TV"}>Radio/TV</Select.Option>
                                <Select.Option value={"Facebook"}>Facebook</Select.Option>
                                <Select.Option value={"Instagram"}>Instagram</Select.Option>
                                <Select.Option value={"Youtube"}>Youtube</Select.Option>
                                <Select.Option value={"Telegram"}>Telegram</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Address" rules={[{ required: true, message: 'Please fill in the field.' }]} name='address'>
                            <Input.TextArea placeholder='Address' />
                        </Form.Item>
                        <Form.Item label="Landmark" name='landmark'>
                            <Input placeholder='Landmark' />
                        </Form.Item>
                        <Form.Item label="State" initialValue={selectedState?.name} required name='state' >
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
                        <CustomInput
                            rules={[
                                { pattern: '^[1-9][0-9]{5}$', message: 'Pincode should have 6 digits' }
                            ]}
                            label="Pin Code" required name='pincode' type='number' placeholder='Pincode'
                        />
                    </Card>
                    <Form.Item wrapperCol={{ offset: 4 }}>
                        <Button type="primary" shape='round'
                            htmlType="submit"
                        >
                            Add
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

const CustomInput = ({ label, required, name, placeholder, type, rules, hidden, value }) => {
    return (
        <Form.Item label={label} hidden={hidden} rules={rules} initialValue={value} name={name}>
            <Input placeholder={placeholder} type={type || 'text'} />
        </Form.Item>
    )
}