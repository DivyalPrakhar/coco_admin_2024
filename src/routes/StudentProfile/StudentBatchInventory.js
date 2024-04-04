import { CheckCircleOutlined, InfoCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Col, DatePicker, Form, Input, Modal, Popover, Row, Select, Tag } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { find, map, omit } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { STATUS } from "../../Constants";
import { addDeliveredItem, getDeliveredItemList, getInventoryGroupAction, getInventoryItemAction, getSingleInventorygroup, resetDeliveredItemStatus } from "../../redux/reducers/inventory";
import { updateMemberAction, updateStudentAction } from "../../redux/reducers/student";
import { useCheckStatus } from "../../utils/useCheckStatus";

export default function StudentBatchInventory({ currentStudent, batchDetail }) {
    const [form] = Form.useForm()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getSingleInventorygroup({ id: batchDetail?.inventoryGroup }))
        dispatch(getDeliveredItemList({ user: currentStudent.user._id, batch: batchDetail?._id }))
    }, [currentStudent.user._id, batchDetail?.inventoryGroup, dispatch, batchDetail?._id])


    const { singleInventoryGroup, getSingleInventorygroupStatus, studentDeliveredItem, allInventoryItem, getDeliveredItemListStatus } = useSelector(s => s.inventory)

    const [selectedItems, setSelectedItems] = useState([])

    const checkHandler = (e, id) => {
        if (e.target.checked === true) {
            setSelectedItems([...selectedItems, id])
        }
        else {
            var index = selectedItems.indexOf(id);
            if (index > -1) {
                selectedItems.splice(index, 1);
            }
            setSelectedItems(selectedItems)
        }
    }

    const onFinish = (data) => {
        var array = map(selectedItems, item =>
        ({
            ...omit(data, 'remark'),
            inventoryItem: item
        })
        )
        dispatch(addDeliveredItem(array))
        dispatch(updateMemberAction({ data: { studentId: currentStudent._id, offlineInventoryRemark: data.remark } }))
    }

    const { addDeliveredItemStatus } = useSelector(s => s.inventory)

    useCheckStatus({
        status: addDeliveredItemStatus,
        onSuccess: () => {
            resetDeliveredItemStatus()
            form.resetFields()
            setSelectedItems([])
        },
    }, [addDeliveredItemStatus]);

    return (
        <Card>
            <Row>
                <Col style={{ width: "50%" }}>
                    {map(singleInventoryGroup?.items, item => {
                        const givenItem = find(studentDeliveredItem, i => i.inventoryItem === item._id)
                        return (
                            <Row align="middle" style={{ margin: "10px" }}>
                                <Col style={{ width: "50%", fontSize: 16 }}>{item.name}</Col>
                                {givenItem ?
                                    <Row>
                                        <Tag icon={<CheckCircleOutlined />} color="success">Given</Tag>
                                        <Popover placement="right" content={
                                            <div>
                                                <p style={{ margin: 0 }}>{moment(givenItem.deliveryDate).format("DD-MM-YYYY")}</p>
                                                <p style={{ margin: 0 }}>{currentStudent.offlineInventoryRemark}</p>
                                            </div>
                                        }>
                                            <Row align="middle">
                                                <InfoCircleOutlined />
                                            </Row>
                                        </Popover>
                                    </Row>
                                    :
                                    <Checkbox onChange={(e) => checkHandler(e, item._id)} />
                                }
                            </Row>
                        )
                    })}
                </Col>

                {selectedItems.length ?
                    <Col style={{ width: "50%" }}>
                        <Form
                            loading={getSingleInventorygroupStatus === STATUS.FETCHING}
                            form={form}
                            labelCol={{ span: 7 }}
                            wrapperCol={{ span: 12 }}
                            layout="horizontal"
                            size='large'
                            onFinish={onFinish}
                        >
                            <Form.Item label="Delivery Date" name={"deliveryDate"} rules={[{ required: true }]}>
                                <DatePicker format={"DD-MM-YYYY"} />
                            </Form.Item>
                            <Form.Item label="Remark" name={"remark"} >
                                <TextArea />
                            </Form.Item>
                            <Form.Item hidden={true} initialValue={currentStudent.user._id} name={"user"}>
                                <Input />
                            </Form.Item>
                            <Form.Item hidden={true} initialValue={batchDetail._id} name={"batch"}>
                                <Input />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={addDeliveredItemStatus === STATUS.FETCHING}>Save</Button>
                            </Form.Item>
                        </Form>
                    </Col>
                    :
                    null
                }
            </Row>
        </Card>
    )
}