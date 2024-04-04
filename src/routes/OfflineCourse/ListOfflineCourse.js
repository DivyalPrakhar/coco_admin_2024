import { EditFilled, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, List, Modal, Radio, Row, Space, Table, Tag, Tooltip } from "antd";
import { find, map, reduce } from "lodash";
import moment from "moment";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CommonPageHeader } from "../../components/CommonPageHeader";
import { STATUS } from "../../Constants";
import { getBatchRequest, updateBatchAction } from "../../redux/reducers/batches";
import { getOfflineCourseAction } from "../../redux/reducers/offlineEnquiry/OfflineCourse";
import { useCheckStatus } from "../../utils/useCheckStatus";
import AddOfflineCourse from "./AddOfflineCourse";

export default function ListOfflineCourse() {
    const dispatch = useDispatch()
    const [toggleCourseDrawer, setToggleCourseDrawer] = useState()
    const [toggleBatchFeesModal, setToggleBatchFeesModal] = useState(false)

    useEffect(() => {
        dispatch(getOfflineCourseAction())
        dispatch(getBatchRequest())
    }, [dispatch])

    const { batch } = useSelector(s => s.batches)
    const { allOfflineCourses, getOfflineCourseStatus } = useSelector(s => s.offlineCourse)
    const user = useSelector(state => state.user.user)
    const { defaultData } = useSelector(s => s.lmsConfig)

    const assignBatches = reduce(allOfflineCourses, function (result, value, key) {
        (result = value?.batches ? ([...result, ...value?.batches]) : result)
        return result;
    }, []);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'desc',
            width: "150px",
            key: 'desc',
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
        Table.EXPAND_COLUMN,
        {
            title: 'Batches',
            dataIndex: 'batches',
            key: 'batches',
            render: d => <Col>
                {map(d, (b, i) =>
                    <Row>{find(batch, batch => batch._id === b)?.name} {d.length === i + 1 ? '' : ','}</Row>
                )}
            </Col>
        },
        {
            title: 'Exam',
            dataIndex: 'exam',
            key: 'exam',
            width: "200px",
            render: d => find(defaultData.exams, exam => exam._id === d)?.name.en
        },
        {
            title: 'Admission Fees',
            dataIndex: 'admissionFees',
            width: "80px",
            key: 'admissionFees',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            width: "90px",
            key: 'createdAt',
            render: d => d ? moment(d).format("DD-MM-YYYY") : null
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: d => <Tag color={d === true ? "green" : "red"}>{d === true ? "Active" : "InActive"}</Tag>
        },
        {
            title: 'Action',
            dataIndex: '',
            width: "175px",
            key: 'action',
            render: d => {
                return (
                    <div>
                        <Tooltip title='Edit'>
                            <Button icon={<EditFilled style={{ color: '#1890ff' }} onClick={() => setToggleCourseDrawer(d)} />}></Button>
                        </Tooltip>
                        <Tooltip title='Add Batch Fees'>
                            <Button style={{ marginLeft: "5px" }} onClick={() => setToggleBatchFeesModal(d.batches)} icon={<PlusOutlined twoToneColor='#eb2f96' />}> Batch Fees</Button>
                        </Tooltip>
                    </div>
                )
            }
        },
    ]

    const expandedRowRender = () => {
        const columns = [
            {
                title: 'Batch',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Base Fees',
                dataIndex: 'desc',
                key: 'desc',
            },
            {
                title: 'Gst',
                dataIndex: 'code',
                key: 'code',
            },
            {
                title: 'Gst Percentage',
                dataIndex: 'code',
                key: 'code',
            },
        ]
        return <Table columns={columns} dataSource={allOfflineCourses} pagination={false} />;
    }

    const closeDrawer = () => {
        setToggleCourseDrawer(null)
    }
    const closeModal = () => {
        setToggleBatchFeesModal(null)
    }
    return (
        <div>
            <CommonPageHeader
                title="List Offline Course"
                extra={
                    <Button shape='round' icon={<PlusOutlined />} onClick={() => setToggleCourseDrawer([])} size='large'>Add Offline Course</Button>
                }
            />
            <br />
            <Card>
                <Table pagination={false} size='small'
                    //  expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }} 
                    dataSource={allOfflineCourses} columns={columns}
                    loading={getOfflineCourseStatus === STATUS.FETCHING}
                />
            </Card>
            {toggleCourseDrawer && <AddOfflineCourse batches={batch} assignBatches={assignBatches} user={user} editCourse={toggleCourseDrawer} closeDrawer={closeDrawer} />}
            {toggleBatchFeesModal && <BatchFeesModal visible={toggleBatchFeesModal} closeModal={closeModal} batches={batch} />}
        </div>
    )
}

export const BatchFeesModal = ({ batches, closeModal, visible }) => {
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const [selectBatch, setSelectBatch] = useState(find(batches, b => b._id === visible?.[0]))
    const [selectedBatch, setSelectedBatch] = useState()
    const gstonReceipt = Form.useWatch('gstShowOnReceipt', form)

    useEffect(() => {
        const values = {
            id: selectBatch._id,
            name: selectBatch.name,
            offlineTutionFees: selectBatch.offlineTutionFees,
            gstPercent: selectBatch.gstPercent,
            gstShowOnReceipt: selectBatch.gstShowOnReceipt || false
        }
        form.setFieldsValue(values)
        setSelectedBatch(values)
    }, [form, selectBatch])


    useEffect(() => {
        if (gstonReceipt === true)
            form.setFieldsValue({ gstPercent: selectedBatch?.gstPercent || 0 })
        else
            form.setFieldsValue({ gstPercent: 0 })
    }, [form, gstonReceipt, selectedBatch?.gstPercent])


    const onFinish = (data) => {
        dispatch(updateBatchAction(data))
    }

    const { updateBatchStatus } = useSelector(s => s.batches)

    useCheckStatus({
        status: updateBatchStatus,
        onSuccess: () => {
            closeModal()
        },
    }, [updateBatchStatus]);
    return (
        <Modal width="900px" title='Assign Batch Fees' okText='Add' visible={visible} footer={false} onCancel={closeModal} >
            <Card>
                <Row>
                    <Col style={{ width: "30%", borderRight: "1px solid #F4F4F4" }}>
                        <List
                            bordered
                            size="small"
                            itemLayout="horizontal"
                            dataSource={visible}
                            rowKey={visible?.[0]}
                            renderItem={(item) => {
                                const batch = find(batches, batch => batch._id === item)
                                const style = selectedBatch?.id === item ? { background: '#F8F9F9', border: "none", borderLeft: '2px solid', borderColor: '#2566e8' } : {}
                                return (
                                    <List.Item style={{ cursor: 'pointer', ...style }} onClick={() => setSelectBatch(batch)}>
                                        <List.Item.Meta
                                            title={batch?.name}
                                        />
                                    </List.Item>
                                )
                            }}
                        />
                    </Col>
                    <Col style={{ width: "70%" }}>
                        {selectedBatch ?
                            <Form
                                form={form}
                                labelCol={{ span: 10 }}
                                wrapperCol={{ span: 12 }}
                                layout="horizontal"
                                size='large'
                                onFinish={onFinish}
                            >
                                <Card style={{ padding: 0, border: 0 }}>
                                    <Form.Item label={'Batch Name'} >
                                        <div>{selectedBatch.name}</div>
                                    </Form.Item>
                                    <CustomInput hidden name='id' />
                                    <CustomInput label="Offline Tution Fees" type="number" min={0} rules={[{ required: true, message: 'Please fill in the field.' }]} name='offlineTutionFees' placeholder='Tution Fees' />
                                    <Form.Item label="Gst Show On Receipt" name='gstShowOnReceipt'>
                                        <Radio.Group required>
                                            <Radio.Button required value={true} >Yes</Radio.Button>
                                            <Radio.Button required value={false}>No</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                    {gstonReceipt === true ?
                                        <CustomInput label="Gst Percent" type="number" min={0} rules={[{ required: true, message: 'Please fill in the field.' }]} name='gstPercent' placeholder='Gst Precent' />
                                        :
                                        null
                                    }
                                    <Form.Item wrapperCol={{ offset: 10, span: 12 }}>
                                        <Button type="primary" htmlType="submit" loading={updateBatchStatus === STATUS.FETCHING}>Save</Button>
                                    </Form.Item>
                                </Card>
                            </Form>
                            :
                            <Row align="center" style={{ fontSize: 18 }} >Select a batch</Row>
                        }
                    </Col>
                </Row>
            </Card>
        </Modal >
    )
}

const CustomInput = ({ label, required, name, placeholder, type, min, rules, hidden, value }) => {
    return (
        <Form.Item label={label} hidden={hidden} rules={rules} name={name} initialValue={value}>
            <Input placeholder={placeholder} type={type || 'text'} min={min} />
        </Form.Item>
    )
}