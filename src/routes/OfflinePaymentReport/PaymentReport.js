import { DownloadOutlined } from "@ant-design/icons";
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Space, Table, Tag } from "antd";
import { find, forEach, map, omit } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BaseURL } from "../../BaseUrl";
import { CommonPageHeader } from "../../components/CommonPageHeader";
import { printHelper, PRINT_TYPE, STATUS } from "../../Constants";
import { getAllStudentsPayment, getBatchRequest, getPrintReceiptAction } from "../../redux/reducers/batches";
import { getAllCenterAction } from "../../redux/reducers/center";
import { getSingleInstituteAction } from "../../redux/reducers/instituteStaff";
import { getOfflineCourseAction } from "../../redux/reducers/offlineEnquiry/OfflineCourse";
import { URIS } from "../../services/api";

export default function OfflinePaymentReport() {
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const [filterInput, setFilterInput] = useState([])

    const { allStudentsPayment, getAllStudentsPaymentStatus } = useSelector(s => s.batches)
    const { singleInstitute, user } = useSelector(s => ({
        singleInstitute: s.instituteStaff.singleInstitute?.[0],
        user: s.user.user,
    }))

    const { allOfflineCourses, getOfflineCourseStatus } = useSelector(s => s.offlineCourse)
    const { batch, getBatchStatus } = useSelector(s => s.batches)
    const { allCenterList, getAllCenterStatus } = useSelector(s => s.center)

    useEffect(() => {
        if (getOfflineCourseStatus !== STATUS.SUCCESS) {
            dispatch(getOfflineCourseAction())
        }
        if (getBatchStatus !== STATUS.SUCCESS) {
            dispatch(getBatchRequest())
        }
        if (getAllCenterStatus !== STATUS.SUCCESS) {
            dispatch(getAllCenterAction())
        }
    }, [dispatch, getAllCenterStatus, getBatchStatus, getOfflineCourseStatus])

    useEffect(() => {
        dispatch(getSingleInstituteAction({ id: user.staff?.institute._id }))
        dispatch(getAllStudentsPayment())

    }, [dispatch, user?.staff?.institute._id])

    const handleTableChange = (d) => {
        let data = d.current ? { page: d.current }
            :
            ({
                ...d,
                page: 1,
                startDate: d?.startDate ? moment(d.startDate).format("YYYY-MM-DD") : '',
                endDate: d?.endDate ? moment(d.endDate).format("YYYY-MM-DD") : ''
            })
        setFilterInput(pre => ({ ...pre, ...data }))
    }

    useEffect(() => {
        dispatch(getAllStudentsPayment(filterInput))
    }, [dispatch, filterInput])

    const resetFields = () => {
        form.resetFields()
        setFilterInput()
        dispatch(getAllStudentsPayment())
    }

    const downloadExcel = () => {
        let stringify = ''
        let objValues = Object.keys(filterInput)
        forEach(omit(objValues, 'page'), val => filterInput[val] ? stringify = stringify + val + "=" + filterInput[val] + "&" : stringify)

        window.open(BaseURL + URIS.GET_All_STUDENTS_PAYMENT + "?" + stringify + "excel=true")
    }

    const printReceipt = (d) => {
        if (d.paymentType === "ADMISSION") {
            printHelper(PRINT_TYPE.PRINT_PAYMENT_RECEIPT, { isPrint: true, course: allOfflineCourses, offlinePaymentDetails: d })
        }
        else {
            dispatch(getPrintReceiptAction({ id: d._id }))
        }
    }
    const { printReceiptData, getPrintReceiptStatus } = useSelector(s => s.batches)

    useEffect(() => {
        if (getPrintReceiptStatus === STATUS.SUCCESS)
            printHelper(PRINT_TYPE.PRINT_TUTIONFESS_RECEIPT, { isPrint: true, collectedPayment: printReceiptData, allOfflineCourses: allOfflineCourses, allCenterList: allCenterList, batch: batch })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getPrintReceiptStatus, printReceiptData])


    const columns = [
        {
            title: 'Student Name',
            dataIndex: 'userId',
            render: (d) => d.name
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
            title: 'Invoice No',
            dataIndex: 'receiptNumber',
        },
        {
            title: 'Payment Type',
            dataIndex: 'paymentType',
        },
        {
            title: 'Payment Details',
            dataIndex: '',
            width: '100px',
            render: (d) => d.mode === "CASH" ? "CASH" : d.mode === "CHEQUE" ? (d?.paymentMeta?.cheque_dd ? `CHEQUE - ${d?.paymentMeta?.cheque_dd}` : "CHEQUE") : 'OTHER'
        },
        {
            title: 'Amount (₹)',
            dataIndex: 'amount',
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            width: "170px",
            render: (d) => d ? moment(d).format("DD-MM-YYYY hh:mm A") : '-'
        },
        {
            title: 'Created By',
            dataIndex: 'createdBy',
            render: (d) => singleInstitute?.staffs?.length ? find(singleInstitute?.staffs, staff => staff.user._id === d)?.user.name : '-'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (d) => <Tag color={d === 'success' ? "green" : d === "pending" ? "orange" : "red"} > {d}</Tag >
        },
        {
            title: 'Action',
            dataIndex: '',
            render: (d) => d.amount !== 0 ? <Button onClick={() => printReceipt(d)}>Print Receipt</Button> : null
        },
    ];

    return (
        <div>
            <CommonPageHeader
                title="Offline Payment Report"
                extra={
                    <Button shape='round' icon={<DownloadOutlined />} size='large' onClick={downloadExcel}>Download Excel</Button>
                }
            />
            <br />
            <Card>
                <Form
                    form={form}
                    // labelCol={{ span: 8 }}
                    // wrapperCol={{ span: 16 }}
                    layout="horizontal"
                    size='medium'
                    onFinish={handleTableChange}
                >
                    <Row align="bottom">
                        <Col style={{ width: "70%" }}>
                            <Space>
                                <CustomInput label="Name" name='name' width='200px' placeholder='Name' />
                                <Form.Item label="Course" name='course' labelCol={{ offset: (1), span: 6 }}>
                                    <Select style={{ width: 200 }} showSearch allowClear placeholder='Select Course'>
                                        {map(allOfflineCourses, course => (
                                            <Select.Option value={course._id}>{course.name}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Payment" name='mode' labelCol={{ offset: 2, span: 7 }}>
                                    <Select style={{ width: 200 }} showSearch allowClear placeholder='Select Payment'>
                                        <Select.Option value={'CASH'}>CASH</Select.Option>
                                        <Select.Option value={'CHEQUE'}>CHEQUE</Select.Option>
                                        <Select.Option value={'OTHER'}>OTHER</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Space>
                            <Space>
                                <Form.Item label="Status" name='status'>
                                    <Select style={{ width: 200 }} showSearch allowClear placeholder='Select Status'>
                                        <Select.Option value={'pending'}>Pending</Select.Option>
                                        <Select.Option value={'success'}>Success</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Start Date" name='startDate' labelCol={{ offset: 1, span: 6 }}>
                                    <DatePicker style={{ width: 200 }} format="DD-MM-YYYY" name placeholder='Start Date' />
                                </Form.Item>
                                <Form.Item label="End Date" name='endDate' labelCol={{ offset: 1, span: 6 }}>
                                    <DatePicker style={{ width: 200 }} format="DD-MM-YYYY" name placeholder='End Date' />
                                </Form.Item>

                            </Space>
                        </Col>
                        <Col style={{ width: "30%" }}>
                            <Row>
                                <Form.Item>
                                    <Button type="primary" span={4} htmlType="submit">
                                        Apply
                                    </Button>
                                </Form.Item>
                                <Form.Item wrapperCol={{ offset: 3 }}>
                                    <Button span={4} onClick={resetFields}>
                                        Reset
                                    </Button>
                                </Form.Item>
                            </Row>
                        </Col>
                    </Row>
                </Form>

                {allStudentsPayment?.docs?.length ?
                    <Table
                        id='math-tex-id-que-data'
                        loading={getAllStudentsPaymentStatus === STATUS.FETCHING}
                        columns={columns}
                        dataSource={allStudentsPayment.docs}
                        pagination={{
                            position: 'bottomCenter',
                            showSizeChanger: false,
                            total: allStudentsPayment?.total,
                            current: allStudentsPayment?.page,
                            pageSize: allStudentsPayment?.limit,
                        }}
                        onChange={(e) => handleTableChange(e)}

                    />
                    :
                    <Row style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>No Offline payment Found</Row>
                }
            </Card>
        </div>
    )
}

const CustomInput = ({ label, required, name, width, placeholder, type, rules, hidden, value, labelCol }) => {
    return (
        <Form.Item label={label} hidden={hidden} rules={rules} initialValue={value} name={name} labelCol={labelCol}>
            <Input placeholder={placeholder} style={{ width: width }} type={type || 'text'} />
        </Form.Item>
    )
}