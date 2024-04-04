import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { Modal, Form, Input, Space, Button, Tooltip } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { filter } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import { addCenterAction, resetCenter } from '../../redux/reducers/center'

export const AddExamCenter = ({ closeModal }) => {
    const dispatch = useDispatch()
    const { addCenterStatus } = useSelector(s => ({ addCenterStatus: s.center.addCenterStatus }))
    const [form] = Form.useForm();

    const onFinish = (val) => {
        dispatch(addCenterAction(val))
    }

    useEffect(() => {
        if (addCenterStatus === STATUS.SUCCESS) {
            dispatch(resetCenter())
            closeModal()
        }
    })


    return (
        <Modal title='Exam Centers' visible={true} okText='Done' width={'50%'} onCancel={closeModal} footer={false}>
            <Form form={form} name="control-hooks" onFinish={onFinish}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 12 }}
            >
                <Form.Item name="name" label="Center Name" rules={[{ required: true }]}>
                    <Input placeholder='name' />
                </Form.Item>
                <Form.Item name="code" label="Code" rules={[{ required: true }]}>
                    <Input placeholder='code' />
                </Form.Item>
                <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                    <TextArea rows={4} placeholder='address' />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
                    <Button loading={addCenterStatus === STATUS.FETCHING} type="primary" htmlType="submit">Save</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}