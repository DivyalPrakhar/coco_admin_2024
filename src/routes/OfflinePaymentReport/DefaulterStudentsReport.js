import { DownloadOutlined } from "@ant-design/icons";
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Space, Table, Tag } from "antd";
import { find, map } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { CommonPageHeader } from "../../components/CommonPageHeader";
import { ExportExcel } from "../../components/ExportExcel";
import { STATUS } from "../../Constants";
import { getAllDefaultersAction, getAllStudentsPayment, getBatchRequest } from "../../redux/reducers/batches";
import { getOfflineCourseAction } from "../../redux/reducers/offlineEnquiry/OfflineCourse";

export default function DefaulterStudentsReport() {
    const [form] = Form.useForm()
    const history = useHistory()
    const dispatch = useDispatch()
    const [filterInput, setFilterInput] = useState()

    const startDate = Form.useWatch('startDate', form)
    const endDate = Form.useWatch('endDate', form)

    const { defaulterStudents, getAllDefaultersStatus } = useSelector(s => s.batches)
    const { singleInstitute, user } = useSelector(s => ({
        singleInstitute: s.instituteStaff.singleInstitute?.[0],
        user: s.user.user,
    }))

    const { allOfflineCourses, getOfflineCourseStatus } = useSelector(s => s.offlineCourse)
    const { batch, getBatchStatus } = useSelector(s => s.batches)

    useEffect(() => {
        if (getOfflineCourseStatus !== STATUS.SUCCESS) {
            dispatch(getOfflineCourseAction())
        }
        if (getBatchStatus !== STATUS.SUCCESS) {
            dispatch(getBatchRequest())
        }
    }, [dispatch, getBatchStatus, getOfflineCourseStatus])

    const getDefaulterReport = (data) => {
        dispatch(getAllDefaultersAction({
            defaulterStartDate: moment(data.startDate).format("YYYY-MM-DD"),
            defaulterEndDate: moment(data.endDate).format("YYYY-MM-DD")
        }))
    }

    useEffect(() => {
        dispatch(getAllStudentsPayment(filterInput))
    }, [dispatch, filterInput])

    const _studentProfile = (id) => {
        history.push("student/profile/" + id)
    }
    const columns = [
        {
            title: 'Student Name',
            dataIndex: 'userId',
            render: (d) => <Row style={{ cursor: "pointer", color: 'blue' }} onClick={() => _studentProfile(d._id)}>{d.name}</Row>
        },
        {
            title: 'Course',
            dataIndex: 'course',
            render: (d) => allOfflineCourses?.length ? find(allOfflineCourses, course => course._id === d)?.name : '-'
        },
        {
            title: 'Batch',
            dataIndex: 'batch',
            render: (d) => batch?.length ? find(batch, b => b._id === d)?.name : '-'
        },
        {
            title: 'Total Due Amount',
            dataIndex: 'defaulterDetails',
            render: (d) => d.totalDueAmount || '-'
        },
        {
            title: 'Total Paid Amount',
            dataIndex: 'defaulterDetails',
            render: (d) => d.totalPaidAmount || 0
        },
        {
            title: 'Due Amount (₹)',
            dataIndex: 'defaulterDetails',
            render: (d) => d.dueAmount || 0
        },
        {
            title: 'Due Date',
            dataIndex: 'defaulterDetails',
            render: (d) => d.dueDate ? moment(d.dueDate).format("DD-MM-YYYY") : '-'
        },
        // {
        //     title: 'Due Date ',
        //     dataIndex: 'amount',
        // },
    ];

    const data = defaulterStudents?.map(d => (
        {
            StudentName: d.userId.name,
            Course: find(allOfflineCourses, course => course._id === d.course)?.name,
            Batch: find(batch, b => b._id === d.batch)?.name,
            TotalDueAmount: d.defaulterDetails.totalDueAmount,
            TotalPaidAmount: d.defaulterDetails.totalPaidAmount,
            DueAmount: d.defaulterDetails.dueAmount,
            DueDate: moment(d.defaulterDetails.dueDate).format("DD-MM-YYYY"),
        }))
    return (
        <div>
            <CommonPageHeader
                title="Defaulter Report"
                extra={
                    <ExportExcel data={data} filename={"Defaulter Students Report"} />
                    // <Button shape='round' icon={<DownloadOutlined />} disabled size='large' onClick={downloadExcel}>Download Excel</Button>
                }
            />
            <br />
            <Card style={{ minHeight: "75vh" }}>
                <Form
                    form={form}
                    layout="horizontal"
                    size='medium'
                    onFinish={getDefaulterReport}
                >
                    <Row>
                        <Col style={{ width: "50%" }}>
                            <Space>
                                <Form.Item label="Start Date" name='startDate' labelCol={{ offset: 1, span: 8 }}>
                                    <DatePicker style={{ width: 200 }} disabledTime format="DD-MM-YYYY" name placeholder='Start Date' />
                                </Form.Item>
                                <Form.Item label="End Date" name='endDate' labelCol={{ offset: 1, span: 8 }}>
                                    <DatePicker style={{ width: 200 }} format="DD-MM-YYYY" name placeholder='End Date' />
                                </Form.Item>
                            </Space>
                        </Col>
                        <Col style={{ width: "15%" }}>
                            <Form.Item>
                                <Button type="primary" span={4} htmlType="submit" loading={getAllDefaultersStatus === STATUS.FETCHING} disabled={(!startDate || !endDate) ? true : false}>
                                    Get
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                {getAllDefaultersStatus !== STATUS.SUCCESS ?
                    <Row align="center" style={{ fontSize: 18, fontWeight: "bold", marginTop: 30 }}>Select Start Date & End Date</Row>
                    :
                    defaulterStudents?.length && getAllDefaultersStatus === STATUS.SUCCESS ?
                        <Table
                            loading={getAllDefaultersStatus === STATUS.FETCHING}
                            columns={columns}
                            dataSource={defaulterStudents}
                            pagination={false}
                        />
                        :
                        <Row align="center" style={{ fontSize: 18, fontWeight: "bold", marginTop: 30 }}>No Defaulter Students Found</Row>
                }
            </Card>
        </div>
    )
}

const CustomInput = ({ label, required, name, placeholder, type, rules, hidden, max, value }) => {
    return (
        <Form.Item label={label} hidden={hidden} rules={rules} initialValue={value} name={name}>
            <Input placeholder={placeholder} type={type || 'text'} max={max} />
        </Form.Item>
    )
}