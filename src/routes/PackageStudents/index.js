import { Button, Card, Descriptions, Input, Space, Table, Form, Typography, Tabs, Popconfirm } from 'antd'
import moment from 'moment'
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { STATUS } from '../../Constants'
import { getPackageRollsAction, getPkgStudentsAction, getSubStudentsAction, getTrialStudentsAction, getSinglePackageAction, notifyAdmitCardAction } from '../../redux/reducers/packages'
import _ from 'lodash'
import { bilingualText } from '../../utils/FileHelper'
import { NotificationOutlined, SearchOutlined } from '@ant-design/icons'
import { ExportExcel } from '../../components/ExportExcel'
import { apis } from '../../services/api/apis'
import { ErrorMessage, FetchingMessage, SuccessMessage } from '../../Constants/CommonAlerts'
import { UpdateStudentPackageModal } from './EditStuPackageModal'
import { EditIcon } from '@chakra-ui/icons'
import { AssignTimeModal } from './AssignTimeModal'
const Text = Typography.Text

export const PackageStudents = () => {
    const dispatch = useDispatch()
    const params = useParams()
    const { TabPane } = Tabs
    const [allStudents, setStudentData] = useState()
    const [tabvalue, setChangeTabs] = useState('1')
    const [editRoll, setEditRoll] = React.useState()
    const [visible, setVisible] = React.useState(false)
    const [assignTimeModal, openTimeModal] = useState()

    const { updateStudentPackageStatus, updateStudentSubPackageStatus, updateStudentTrialPackageStatus, getStudentsStatus, studentsList, getPkgStatus, allStudentRolls, currentPackage,
        getSubStudentsStatus, substudentsList, getTrialStudentsStatus, trialstudentsList, uploadStudentTimingStatus, uploadStudentRollNoStatus
    } = useSelector(state => ({
        getStudentsStatus: state.packages.getPkgStudentsStatus,
        studentsList: state.packages.pkgStudents,
        getPkgStatus: state.packages.getSinglePackgStatus,
        currentPackage: state.packages.currentPackage,
        allStudentRolls: state.packages.allStudentRolls,
        getSubStudentsStatus: state.packages.getSubStudentsStatus,
        substudentsList: state.packages.subStudents,
        getTrialStudentsStatus: state.packages.getTrialStudentsStatus,
        trialstudentsList: state.packages.trialStudents,
        updateStudentPackageStatus: state.packages.updateStudentPackageStatus,
        updateStudentSubPackageStatus: state.packages.updateStudentSubPackageStatus,
        updateStudentTrialPackageStatus: state.packages.updateStudentTrialPackageStatus,
        uploadStudentTimingStatus: state.packages.uploadStudentTimingStatus,
        uploadStudentRollNoStatus: state.packages.uploadStudentRollNoStatus,

    }))

    useEffect(() => {
        dispatch(getSinglePackageAction({ id: params.id, admin: true }))
        dispatch(getPackageRollsAction({ packageId: params.id }))
        dispatch(getPkgStudentsAction({ packageId: params.id, limit: 20000 }))
        dispatch(getSubStudentsAction({ packageId: params.id, subscription: true, limit: 20000 }))
        dispatch(getTrialStudentsAction({ packageId: params.id, trials: true, limit: 20000 }))
    }, [dispatch, params.id])

    let searchInput = useRef()

    const search = (title) => ({
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.select(), 100);
            }
        },

        onFilter: (value, record) => {
            return (record.user?.[title]
                ? record.user[title]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
                : "")
        }
        ,

        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Form
                    onFinish={() => confirm({ closeDropdown: true })}
                >
                    <Input
                        ref={(node) => { searchInput = node; }}
                        placeholder={`Search ${title}`}
                        value={selectedKeys[0]}
                        onChange={(e) =>
                            setSelectedKeys(e.target.value ? [e.target.value] : [])
                        }
                        style={{ marginBottom: 8, display: "block" }}
                    />
                    <Space>
                        <Button
                            // htmlType="submit"
                            type="primary"
                            icon={<SearchOutlined />}
                            size="small"
                            onClick={() => confirm({ closeDropdown: true })}
                            style={{ width: 90 }}
                        >
                            Search
                        </Button>
                        <Button
                            onClick={() => {
                                clearFilters();
                            }}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Reset
                        </Button>
                    </Space>
                </Form>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{ fontSize: "18px", color: filtered ? "#1890ff" : undefined }}
            />
        )
    })

    let getStudentData = useCallback((data) => {
        return (
            data?.docs?.length ?
                allStudentRolls?.length ?
                    data.docs.map(d => ({ ...d, rollNumber: _.find(allStudentRolls, r => r.user === d.user?._id) }))
                    :
                    data.docs
                : [])
    }, [allStudentRolls])

    useEffect(() => {
        if (uploadStudentTimingStatus === STATUS.SUCCESS || uploadStudentRollNoStatus === STATUS.SUCCESS) {
            dispatch(getSinglePackageAction({ id: params.id, admin: true }))
            dispatch(getPackageRollsAction({ packageId: params.id }))
            openTimeModal()
        }
    }, [dispatch, params.id, uploadStudentTimingStatus, uploadStudentRollNoStatus])

    useEffect(() => {
        const tab = parseInt(tabvalue)
        const allstudentdata = getStudentData(tab === 1 ? studentsList : tab === 2 ? substudentsList : tab === 3 ? trialstudentsList : null)
        setStudentData(allstudentdata)
    }, [tabvalue, getStudentData, studentsList, substudentsList, trialstudentsList])

    const data = useMemo(() => {
        let dd = allStudents?.length ? _.filter(allStudents, d => d.user) : []
        dd = dd.length ? _.sortBy(dd, d => _.lowerCase(d.user.name)).map(stud =>
            stud.user ? ({
                rollNo: stud.rollNumber?.finalRoll,
                name: stud.user.name, contact: stud.user.contact, email: stud.user.email,
                dob: stud.user.dob ? moment(stud.user.dob).format('DD-MM-YYYY') : '',
                packageStartDate: stud.packages ?
                    moment(stud.packages.assignedOn).format('DD-MM-YYYY')
                    : '',
                examCenter: stud.packages && stud.packages.center ?
                    stud.packages.center.name : null,
                examCode: stud.packages && stud.packages.center ?
                    stud.packages.center.code : null,
                Timing: stud.rollNumber?.timing,
            }) : {}
        ) : []
        return dd
    }, [allStudents])


    const handleNotificationSend = () => {
        dispatch(notifyAdmitCardAction({ packageId: params.id }))
    }

    const handleGenerateRoll = async () => {
        FetchingMessage("please wait")
        const res = await apis.refreshPackageRollnos({ packageId: params.id })
        if (res.ok) {
            SuccessMessage("Success")
            dispatch(getSinglePackageAction({ id: params.id, admin: true }))
            dispatch(getPackageRollsAction({ packageId: params.id }))
        } else {
            ErrorMessage("Failed")
        }
    }

    const openEdit = (u, trial) => {
        setEditRoll(u)
        setVisible(trial || true)
    }
    const closeEdit = () => {
        setEditRoll()
        setVisible(false)
    }

    useEffect(() => {
        if (updateStudentPackageStatus === STATUS.SUCCESS || updateStudentSubPackageStatus === STATUS.SUCCESS || updateStudentTrialPackageStatus === STATUS.SUCCESS) {
            closeEdit()
            dispatch(getPackageRollsAction({ packageId: params.id }))
        }
    }, [updateStudentPackageStatus, updateStudentSubPackageStatus, dispatch, params, updateStudentTrialPackageStatus])

    const _timeSlotModal = () => {
        openTimeModal(d => !d)
    }

    return (
        <div>
            <CommonPageHeader title='Students' />
            <br />
            {assignTimeModal && <AssignTimeModal packageId={params.id} studentsData={allStudents || []} visible={assignTimeModal} closeModal={_timeSlotModal} />}
            <Card loading={getPkgStatus === STATUS.FETCHING}>
                {getPkgStatus === STATUS.SUCCESS ?
                    <div>
                        <Descriptions bordered column={1}>
                            <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label="Package">{bilingualText(currentPackage.name)}</Descriptions.Item>
                            <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label="Total Students">{allStudents?.length}</Descriptions.Item>
                            {/* <Descriptions.Item labelStyle={{fontWeight:'bold'}} label="Current Students">{studentsList?.total}</Descriptions.Item> */}
                            <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label="Download Students Excel">
                                <ExportExcel filename={bilingualText(currentPackage?.name)} title='download' data={data} />
                            </Descriptions.Item>
                            <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label="Notify To Download Admit Card">
                                <Button shape='round' onClick={handleNotificationSend}
                                    icon={<NotificationOutlined />}
                                >
                                    Send Notification / SMS to Offline students
                                </Button>
                            </Descriptions.Item>
                            {/* <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label="Generate Roll No.">
                                <Popconfirm placement="bottom" onConfirm={handleGenerateRoll} okText="Confirm" cancelText="No"
                                    title={'Are you sure, you want to generate roll number and send sms to all students?'}
                                >
                                    <Button shape='round'
                                        icon={<NotificationOutlined />}
                                    >
                                        Generate Roll numbers and send message
                                    </Button>
                                </Popconfirm>
                            </Descriptions.Item> */}
                            <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label="Assign Roll Number / Time Slot">
                                <Button shape='round' onClick={_timeSlotModal}
                                    icon={<NotificationOutlined />}
                                >
                                    Assign Roll Number / Time Slot
                                </Button>
                            </Descriptions.Item>
                        </Descriptions>
                        <br />
                        <Tabs activeKey={tabvalue} type='card' defaultActiveKey="1" onChange={(key) => setChangeTabs(key)}>
                            {currentPackage?.priceMode === "sub" ? null : (
                                <TabPane tab="Package" key="1">
                                    <TableData data={allStudents} getStudentsStatus={getStudentsStatus} search={search} params={params} openEdit={openEdit} />
                                </TabPane>
                            )}

                            {currentPackage?.priceMode === "oneTime" ? null : <TabPane tab='Subscription' key='2'>
                                <TableData data={allStudents} getStudentsStatus={getSubStudentsStatus} search={search} params={params} openEdit={openEdit} />
                            </TabPane>}
                            <TabPane tab='Trial' key='3'>
                                <TableData type='trial' data={allStudents} getStudentsStatus={getTrialStudentsStatus} search={search} params={params} openEdit={(d) => openEdit(d, 'trial')} />
                            </TabPane>
                        </Tabs>

                        <UpdateStudentPackageModal
                            visible={visible}
                            studentPackageRoll={editRoll}
                            closeModal={closeEdit}
                            currentPkg={currentPackage}
                            assignedPkg={allStudents?.[0]?.packages}
                        />
                    </div>
                    :
                    null
                }
            </Card>

        </div>
    )
}
export const TableData = (props) => {
    const dispatch = useDispatch()
    const params = useParams()
    const allStudents = props.data
    const getStudentsStatus = props?.getStudentsStatus
    const search = props?.search
    const openEdit = props.openEdit

    const { getPackageRollsStatus } = useSelector((state) => ({
        getPackageRollsStatus: state.packages.getPackageRollsStatus,

    }))

    const sendSms = (userId) => {
        dispatch(notifyAdmitCardAction({ packageId: params.id, userIds: [userId] }));
    }

    return (
        <Table
            pagination={{
                pageSize: 10,
                showSizeChanger: false,
            }}
            dataSource={allStudents?.length ? _.filter(allStudents, d => d) : []} bordered
            loading={getStudentsStatus === STATUS.FETCHING || getPackageRollsStatus === STATUS.FETCHING}
        >
            <Table.Column dataIndex='' title='Roll No.'
                render={d => {
                    return (
                        <div>
                            {d?.rollNumber?.finalRoll || '-'}<br />
                            {!d?.rollNumber?.finalRoll || props.type === 'trial' ? null : <Button size='small' type='link' onClick={() => sendSms(d.user?._id)}>Send SMS</Button>}
                        </div>
                    )
                }}
            />
            <Table.Column dataIndex='' title='Student Name' {...search('name')}
                sortDirections={['descend']} defaultSortOrder='descend'
                sorter={(a, b, c) => _.lowerCase(a.user?.name) < _.lowerCase(b.user?.name)}
                render={d => d.user?.name}
            />
            <Table.Column dataIndex='' title='Contact' render={d => d.user?.contact}
                {...search('contact')}
            />
            <Table.Column dataIndex='' title='Email' render={d =>
                d.user?.email
            } />
            <Table.Column dataIndex='' title='Date of Birth' render={d =>
                d.user?.dob ? moment(d.user?.dob).format('DD-MM-YYYY') : null
            } />
            <Table.Column title='Exam Center' dataIndex='' render={d => {
                let pkg = d?.packages
                let center = pkg?.center

                return (<div>
                    {
                        pkg && center ?
                            <Space direction='vertical'>
                                <Space>
                                    <Text type='secondary'>Center Name:</Text> <Text>{center.name}</Text>
                                </Space>
                                <Space>
                                    <Text type='secondary'>Address:</Text> <Text>{center.address}</Text>
                                </Space>
                                <Space>
                                    <Text type='secondary'>Code:</Text> <Text>{center.code || '-'}</Text>
                                </Space>

                            </Space>
                            :
                            null
                    }
                    <Space style={{ padding: '0 0 0 6px' }}>
                        <Button icon={<EditIcon />} onClick={() => openEdit(d)} />
                    </Space>
                </div>
                )
            }} />
            <Table.Column title='Timing'
                render={d => d.rollNumber?.timing}
            />
            <Table.Column dataIndex='' title='Assigned On'
                defaultSortOrder='descend'
                sorter={(a, b) =>
                    a.packages && b.packages ?
                        new Date(moment(a.packages.assignedOn)) - new Date(moment(b.packages.assignedOn))
                        : false
                }
                key="assignedAt"
                render={d =>
                    d.packages ?
                        moment(d.packages.assignedOn).format('DD-MM-YYYY')
                        : null
                }
            />

            <Table.Column dataIndex='' title='Expired on'
                defaultSortOrder='descend'
                sorter={(a, b) =>
                    a.packages && b.packages ?
                        new Date(moment(a.packages.expireOn)) - new Date(moment(b.packages.expireOn))
                        : false
                }
                key="expiredAt"
                render={d =>
                    d.packages ?
                        moment(d.packages.expireOn).format('DD-MM-YYYY')
                        : null
                }
            />
            <Table.Column dataIndex='' title='Remaining Days'
                defaultSortOrder='descend'
                key="remainingdays"
                render={d => {
                    const pkg = d.packages
                    const expireOn = pkg?.expireOn
                    const expired = moment(expireOn).isBefore(moment())
                    return expired ? <Text style={{ color: 'red' }}>Expired</Text> : `${moment(expireOn).diff(moment(), 'days')} days`
                }
                }
            />
        </Table>
    )
}
