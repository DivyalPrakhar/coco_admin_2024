import { Button, Card, DatePicker, Form, Input, Modal, Row, Select, TimePicker } from "antd";
import { find, map } from "lodash";
import moment from "moment";
import React, { useState } from "react";
import { STATUS } from "../../Constants";

export default function AssignBatch({ _assignBatch, assignBatchStatus, toggleAssignBatch, closeDrawer, batch, currentStudent }) {
    const [form] = Form.useForm()
    const [ selectedBatch, setSelectedBatch ]= useState()
    return (
        <Modal width="800px" title='Assign Batch' okText='Add' visible={toggleAssignBatch} footer={false} onCancel={closeDrawer} >
            <Form
                form={form}
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 12 }}
                layout="horizontal"
                size='large'
                onFinish={_assignBatch}
            // onFinish={onFinish}
            >
                <Card style={{ padding: 0, border: 0 }}>
                    <Row style={{ fontSize: 20 }}>Basic Details</Row>
                    <Form.Item label="Batch" rules={[{ required: true, message: 'Please pick a batch.' }]} name='batch'>
                        <Select showSearch autoComplete='invalid' allowClear placeholder='Select Batch' onChange={(e) => setSelectedBatch(e)} >
                            {toggleAssignBatch?.batch?.length ?
                                map(toggleAssignBatch.batch, bat => (
                                    <Select.Option value={find(batch, b => b._id === bat)?._id}>{find(batch, b => b._id === bat)?.name}</Select.Option>
                                ))
                                :
                                null
                            }
                        </Select>
                    </Form.Item>
                    {/* <CustomInput label="Batch Code" name='batchCode' placeholder='Batch Code' /> */}
                    <Form.Item label="Start Date Time">
                        <Row>{selectedBatch? moment(find(batch, b => b._id === selectedBatch)?.startDateTime, "YYYY-MM-DD hh:mm:ss").format("DD-MM-YYYY hh:mm A") : null}</Row>
                    </Form.Item>
                    {/* <Form.Item label="Batch Date" rules={[{ required: true, message: 'Please select batch date.' }]} name='batchDate'>
                        <DatePicker name placeholder='Batch Date' format="DD-MM-YYYY" />
                    </Form.Item>
                    <Form.Item label="Batch Time" rules={[{ required: true, message: 'Please select batch time.' }]} name='batchTime'>
                        <TimePicker name placeholder='Batch Time' format={"hh:mm"} />
                    </Form.Item> */}
                    <Form.Item label="Admission Date" rules={[{ required: true, message: 'Please select admission date.' }]} name='admissionDate'>
                        <DatePicker name placeholder='Admission Date' format="DD-MM-YYYY" />
                    </Form.Item>
                    {/* <CustomInput label="Session" name='session' placeholder='Session' /> */}
                    <CustomInput label="Batch Remark" name='batchRemark' placeholder='Batch Remark' />
                    {/* <Form.Item label="Medium" name='medium'>
                        <Select showSearch autoComplete='invalid' allowClear placeholder='Select medium'>
                            <Select.Option value={"HINDI"}>HINDI</Select.Option>
                            <Select.Option value={"ENGLISH"}>ENGLISH</Select.Option>
                        </Select>
                    </Form.Item> */}
                    <Form.Item hidden={true} initialValue={currentStudent.user._id} name={"userId"}>
                        <Input />
                    </Form.Item>
                    <Form.Item hidden={true} initialValue={toggleAssignBatch.course?._id} name={"course"}>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={assignBatchStatus === STATUS.FETCHING}>Assign</Button>
                    </Form.Item>
                </Card>
            </Form>
        </Modal >
    )
}

const CustomInput = ({ label, required, name, placeholder, type, rules, hidden, max, value }) => {
    return (
        <Form.Item label={label} hidden={hidden} rules={rules} initialValue={value} name={name}>
            <Input placeholder={placeholder} type={type || 'text'} max={max} />
        </Form.Item>
    )
}