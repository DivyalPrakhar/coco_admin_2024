import { Button, Card, Row, Table } from "antd";
import { find } from "lodash";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { printHelper, PRINT_TYPE, STATUS } from "../../Constants";
import { getAllStudentsPayment, getBatchRequest, getPrintReceiptAction } from "../../redux/reducers/batches";
import { getAllCenterAction } from "../../redux/reducers/center";
import { getOfflineCourseAction } from "../../redux/reducers/offlineEnquiry/OfflineCourse";

export default function StudentPaymentHistory({ currentStudent }) {
    const dispatch = useDispatch()
    const { allStudentsPayment, getAllStudentsPaymentStatus } = useSelector(s => s.batches)
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
        dispatch(getAllStudentsPayment({ userId: currentStudent.user._id }))
    }, [currentStudent.user._id, dispatch])

    const handleTableChange = (d) => {
        dispatch(getAllStudentsPayment({ userId: currentStudent.user._id }))
    }

    const columns = [
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
        // {
        //     title: 'Created By',
        //     dataIndex: 'createdBy',
        //     render: (d) => singleInstitute?.staffs?.length ? find(singleInstitute?.staffs, staff => staff.user._id === d)?.user.name : '-'
        // },
        // {
        //     title: 'Status',
        //     dataIndex: 'status',
        //     render: (d) => <Ta color={d === 'success' ? "green" : d === "pending" ? "orange" : "red"} > {d}</Tag >
        // },
        {
            title: 'Action',
            dataIndex: '',
            render: (d) => d.amount !== 0 ? <Button onClick={() => printReceipt(d)}>Print Receipt</Button> : null
        },
    ];

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
    }, [printReceiptData, getPrintReceiptStatus]) 

    return (
        <Card>
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
                <Row align="center" style={{ fontSize: 18, fontWeight: "bold" }}>No Transaction Found</Row>
            }
        </Card>
    )
}