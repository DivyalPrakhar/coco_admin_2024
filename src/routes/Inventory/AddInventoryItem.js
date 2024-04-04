import { Button, Card, Col, Form, Input, Modal, Space } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { STATUS } from "../../Constants";
import { addInventoryItemAction, resetInventoryItem, updateInventoryItemAction } from "../../redux/reducers/inventory";
import { useCheckStatus } from "../../utils/useCheckStatus";

export default function AddInventoryItem({ closeModal, visible }) {
    const [form] = Form.useForm();
    const dispatch = useDispatch()

    const onFinish = (data) => {
        if (visible?._id) {
            dispatch(updateInventoryItemAction(data))
        }
        else {
            dispatch(addInventoryItemAction(data))
        }
    }

    const { addInventoryItemStatus, updateInventoryItemStatus } = useSelector(s => s.inventory)

    useCheckStatus({
        status: addInventoryItemStatus,
        onSuccess: () => {
            dispatch(resetInventoryItem())
            closeModal()
        },
    }, [addInventoryItemStatus]);

    useCheckStatus({
        status: updateInventoryItemStatus,
        onSuccess: () => {
            dispatch(resetInventoryItem())
            closeModal()
        },
    }, [updateInventoryItemStatus]);

    return (
        <Modal width={700} title="Add New Inventory Item" visible={visible} footer={false} onCancel={closeModal}>
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
                        <CustomInput label="Full Name" rules={[{ required: true, message: 'Please fill in the field.' }]} value={visible?.name} name='name' placeholder='Name' />
                        <Form.Item label="Description" rules={[{ required: true, message: 'Please fill in the field.' }]} initialValue={visible?.desc} name='desc'>
                            <Input.TextArea placeholder='Description' />
                        </Form.Item>
                        <CustomInput hidden name='id' value={visible._id} />
                        <Form.Item wrapperCol={{ offset: 7, span: 6 }}>
                            <Space style={{ justifyContent: "center" }}>
                                <Col>
                                    <Button onClick={closeModal}>Cancel</Button>
                                </Col>
                                <Col>
                                    <Button type="primary" htmlType="submit" loading={addInventoryItemStatus === STATUS.FETCHING || updateInventoryItemStatus === STATUS.FETCHING}>Save</Button>
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