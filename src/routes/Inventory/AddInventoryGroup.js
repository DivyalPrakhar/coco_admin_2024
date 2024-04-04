import { Button, Card, Col, Form, Input, Modal, Select, Space } from "antd";
import { map } from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { STATUS } from "../../Constants";
import { addInventoryGroupAction, resetInventoryGroup, updateInventoryGroupAction } from "../../redux/reducers/inventory";
import { useCheckStatus } from "../../utils/useCheckStatus";

export default function AddInventoryGroup({ closeModal, visible, allInventoryItem }) {
    const [form] = Form.useForm();
    const dispatch = useDispatch()

    const onFinish = (data) => {
        if (visible?._id) {
            dispatch(updateInventoryGroupAction(data))
        }
        else {
            dispatch(addInventoryGroupAction(data))
        }
    }

    const { addInventoryGroupStatus, updateInventoryGroupStatus } = useSelector(s => s.inventory)

    useCheckStatus({
        status: addInventoryGroupStatus,
        onSuccess: () => {
            dispatch(resetInventoryGroup())
            closeModal()
        },
    }, [addInventoryGroupStatus]);

    useCheckStatus({
        status: updateInventoryGroupStatus,
        onSuccess: () => {
            dispatch(resetInventoryGroup())
            closeModal()
        },
    }, [updateInventoryGroupStatus]);

    return (
        <Modal width={700} title={visible._id ? "Update New Inventory Group" : "Add New Inventory Group"} visible={visible} footer={false} onCancel={closeModal}>
            <Card >
                <Form
                    form={form}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    size='large'
                    onFinish={onFinish}
                >
                    <Card style={{ padding: 0, border: 0 }}>
                        <CustomInput label="Group Name" rules={[{ required: true, message: 'Please fill in the field.' }]} value={visible?.name} name='name' placeholder='Name' />
                        <Form.Item label="Description" rules={[{ required: true, message: 'Please fill in the field.' }]} initialValue={visible?.desc} name='desc'>
                            <Input.TextArea placeholder='Description' />
                        </Form.Item>
                        <CustomInput hidden name='id' value={visible._id} />
                        <Form.Item label="Items" rules={[{ required: true, message: 'Please fill in the field.' }]} initialValue={visible?.items} name='items'>
                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                                placeholder="Please select"
                            >
                                {map(allInventoryItem, item => (
                                    <Select.Option value={item._id}>{item.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 7, span: 6 }}>
                            <Space style={{ justifyContent: "center" }}>
                                <Col>
                                    <Button onClick={closeModal}>Cancel</Button>
                                </Col>
                                <Col>
                                    <Button type="primary" htmlType="submit" loading={addInventoryGroupStatus === STATUS.FETCHING || updateInventoryGroupStatus === STATUS.FETCHING}>{visible?._id ? "Update" : "Add"}</Button>
                                </Col>
                            </Space>
                        </Form.Item>
                    </Card>
                </Form>
            </Card>
        </Modal>
    )
}

const CustomInput = ({ label, required, name, placeholder, type, rules, hidden, value }) => {
    return (
        <Form.Item label={label} hidden={hidden} rules={rules} initialValue={value} name={name}>
            <Input placeholder={placeholder} type={type || 'text'} />
        </Form.Item>
    )
}