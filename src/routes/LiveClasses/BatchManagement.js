import { Button, Card, Checkbox, Col, DatePicker, Form, Input, Row, Select, Space, Table, Tooltip, Typography } from "antd";
import { DeleteOutlined, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";

import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { filter, find, map, orderBy, sumBy } from "lodash";
import moment from "moment";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import { STATUS } from "../../Constants";
import { getSingleInstituteAction } from "../../redux/reducers/instituteStaff";
import { addLiveClassBatchAction, addLiveClassRoomAction, getBatchSubjectLectureAction, getLiveClassBatchAction, getLiveClassBatchSubjectAction, getLiveClassRoomAction, resetBatchDetails, resetLiveClassBatch, updateLiveClassBatchAction, updateLiveClassBatchSubjectAction } from "../../redux/reducers/LiveClasses";
import { getAllCenterAction } from "../../redux/reducers/center";
import { getInventoryGroupAction } from "../../redux/reducers/inventory";

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function BatchManagement() {
    let query = useQuery();
    const history = useHistory()
    const id = query.get('id')
    const name = query.get('type')
    const [classRoomModal, setOpenClassRoom] = useState(null)
    const [editTeacher, setEditTeacher] = useState(null)
    const [selectedExam, setSelectedExam] = useState('')
    const [subjects, setSubjects] = useState([])
    const dispatch = useDispatch()

    const formRef = useRef(null);

    const { configData } = useSelector(state => ({
        configData: state.lmsConfig,
    }))
    const { instituteId, institute } = useSelector((state) => ({
        instituteId: state.user.user.staff.institute._id,
        institute: state.instituteStaff
    }))
    const singleInstitute = institute.singleInstitute
    const { allCenterList, getAllCenterStatus } = useSelector(s => s.center)

    useEffect(() => {
        const data = find(configData?.defaultData?.exams, exam => exam._id === selectedExam)?.subjects?.map(subject => { return { subject: { _id: subject }, batch: null, noOfLectures: 0, staff: null } });
        if (data)
            setSubjects(data);
        else
            setSubjects([]);
    }, [configData?.defaultData?.exams, selectedExam])

    useEffect(() => {
        formRef.current?.resetFields();
        if (id && name === 'batch') {
            dispatch(getLiveClassRoomAction())
            dispatch(getLiveClassBatchAction({ id }))
            if (getAllCenterStatus !== STATUS.SUCCESS) {
                dispatch(getAllCenterAction())
            }
        }
        if (id && name === "subject") {
            dispatch(getLiveClassBatchAction({ id }))
            dispatch(getLiveClassBatchSubjectAction({ batch: id }))
            dispatch(getSingleInstituteAction({ id: instituteId }))
        }
        else {
            dispatch(getLiveClassRoomAction())
            dispatch(getSingleInstituteAction({ id: instituteId }))
            if (getAllCenterStatus !== STATUS.SUCCESS) {
                dispatch(getAllCenterAction())
            }
        }
        return () => {
            dispatch(resetBatchDetails())
            dispatch(resetLiveClassBatch())
            setSelectedExam([])
            setSubjects([])
        }
    }, [dispatch, id, instituteId, name])

    const updateSubjects = (val, e, obj) => {
        dispatch(updateLiveClassBatchAction({
            id: id,
            noOfLectures: val
        }))
        dispatch(updateLiveClassBatchSubjectAction({
            ...obj,
            noOfLectures: e
        }))
    }

    const deleteSubject = (s) => {
        setSubjects(filter(subjects, sub => sub.subject._id !== s.subject._id))
    }

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                {dataIndex === "staff" ?
                    <Select ref={searchInput} value={selectedKeys[0]} placeholder="Search Teacher" allowClear onChange={(e) => setSelectedKeys(e ? [e] : [])}
                        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        style={{
                            marginBottom: 8,
                            display: 'block',
                        }}
                    >
                        {map(singleInstitute?.[0]?.staffs, staff => (
                            <option value={staff._id}>{staff.user?.name}</option>
                        ))}
                    </Select>
                    :
                    <Select ref={searchInput} value={selectedKeys[0]} placeholder="Search Subject" allowClear onChange={(e) => setSelectedKeys(e ? [e] : [])}
                        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        style={{
                            marginBottom: 8,
                            display: 'block',
                        }}
                    >
                        {map(configData.defaultData?.subjects, sub => (
                            <option value={sub._id}>{sub?.name.en}</option>
                        ))}
                    </Select>
                }
                <Space>
                    <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{ width: 90 }} >
                        Search
                    </Button>
                    <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            dataIndex === "staff" ?
                record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                :
                record[dataIndex]?._id.toString().toLowerCase().includes(value.toLowerCase())
        ,
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            // searchedColumn === dataIndex ? (
            //     <Highlighter
            //         highlightStyle={{
            //             backgroundColor: '#ffc069',
            //             padding: 0,
            //         }}
            //         searchWords={[searchText]}
            //         autoEscape
            //         textToHighlight={text ? text.toString() : ''}
            //     />
            // ) : (
            text
        // ),
    })

    const sortData = (a, b) => {
        if (a > b) {
            return -1;
        }
        if (a < b) {
            return 1;
        }
        return 0
    }

    const columns = [
        {
            title: 'Subject Name',
            dataIndex: 'subject',
            key: '_id',
            width: '30%',
            ...getColumnSearchProps('subject'),
            sorter: (a, b) => sortData(find(configData.defaultData?.subjects, subject => subject._id === a?.subject._id)?.name.en, find(configData.defaultData?.subjects, subject => subject._id === b?.subject._id)?.name.en),
            render: (d) => <Col>{find(configData.defaultData?.subjects, subject => subject._id === d?._id)?.name.en}</Col>
        },
        {
            title: 'Lectures',
            dataIndex: '',
            sorter: (a, b) => a.noOfLectures - b.noOfLectures,
            render: (d) => <Typography.Paragraph editable={{
                onChange: (e) => id && name === "subject" ?
                    updateSubjects((sumBy(subjects, s => parseFloat(s.noOfLectures)) - Number(d.noOfLectures) + Number(e)), e, d)
                    :
                    setSubjects(map(subjects, subject => (subject.subject._id === d.subject._id ? ({ ...subject, noOfLectures: e }) : subject)))
            }}>{d?.noOfLectures || 0}</Typography.Paragraph>
        },
        {
            title: 'Teacher',
            dataIndex: '',
            ...getColumnSearchProps('staff'),
            sorter: (a, b) => sortData(a?.staff ? find(singleInstitute?.[0]?.staffs, staff => staff._id === a.staff)?.user?.name : '', b?.staff ? find(singleInstitute?.[0]?.staffs, staff => staff._id === b.staff)?.user?.name : ''),
            render: (d) => <Row justify="space-between">
                <Col>{d?.staff ? find(singleInstitute?.[0]?.staffs, staff => staff._id === d.staff)?.user?.name : ''}</Col>
                <Row>
                    <Col style={{ marginRight: "5px" }}>
                        {d.staff ?
                            <Tooltip placement="top" title="Edit Teacher">
                                <EditIcon onClick={() => setEditTeacher(d)} />
                            </Tooltip>
                            :
                            <Tooltip placement="top" title="Add Teacher">
                                <PlusCircleOutlined onClick={() => setEditTeacher(d)} />
                            </Tooltip>
                        }
                    </Col>
                    <Col>
                        <Tooltip placement="top" title="Delete Subject">
                            <DeleteOutlined onClick={() => deleteSubject(d)} />
                        </Tooltip>
                    </Col>
                </Row>
            </Row>
        },
    ];

    const { getSubjectListStatus } = useSelector(s => s.lmsConfig)
    const { liveClassRooms, liveClassBatch, getLiveClassBatchStatus, liveClassBatchSubject, addLiveClassBatchStatus, updateLiveClassBatchStatus } = useSelector(s => ({
        liveClassRooms: s.liveClasses.liveClassRooms,
        liveClassBatch: s.liveClasses.liveClassBatch,
        getLiveClassBatchStatus: s.liveClasses.getLiveClassBatchStatus,
        liveClassBatchSubject: s.liveClasses.liveClassBatchSubject,
        addLiveClassBatchStatus: s.liveClasses.addLiveClassBatchStatus,
        updateLiveClassBatchStatus: s.liveClasses.updateLiveClassBatchStatus
    }))

    const [showOfflineDetails, setShowOfflineDetails] = useState(false)

    useEffect(() => {
        if (liveClassBatch?.inventoryGroup) {
            setShowOfflineDetails(true)
        }
    }, [liveClassBatch?.inventoryGroup])
    const { allInventoryGroups, getInventoryGroupStatus } = useSelector(s => s.inventory)
    useEffect(() => {
        if (getInventoryGroupStatus !== STATUS.SUCCESS) {
            dispatch(getInventoryGroupAction())
        }
    }, [dispatch, getInventoryGroupStatus])

    useEffect(() => {
        setSubjects(map(liveClassBatchSubject, sub => ({
            batch: sub.batch,
            noOfLectures: sub.noOfLectures,
            staff: sub.staff?._id,
            name: sub.name,
            subject: { _id: sub.subject._id },
            id: sub._id
        })))
    }, [liveClassBatchSubject])

    const onFinish = (value) => {
        if (id && name === "batch") {
            dispatch(updateLiveClassBatchAction({
                ...value,
                id: id,
                inventoryGroup: showOfflineDetails ? value.inventoryGroup : null,
                offlineValidity: value.offlineValidity ? moment(value.offlineValidity).set('date', 1).format("YYYY-MM-DD") : null
            }))
        }
        else {
            dispatch(addLiveClassBatchAction({
                ...value,
                noOfLectures: sumBy(subjects, s => parseFloat(s.noOfLectures)),
                inventoryGroup: showOfflineDetails ? value.inventoryGroup : null,
                offlineValidity: value.offlineValidity ? moment(value.offlineValidity).set('date', 1).format("YYYY-MM-DD") : null,
                subjects: map(subjects, sub => ({
                    subject: sub.subject._id,
                    noOfLectures: sub.noOfLectures,
                    staff: sub.staff
                }))
            }))
        }
    }

    const handleClose = () => {
        setOpenClassRoom(null)
    }
    const closeTeacherModal = () => {
        setEditTeacher(null)
    }

    const addSubjectTeacher = (value) => {
        if (id && name === "subject") {
            dispatch(updateLiveClassBatchSubjectAction({
                ...editTeacher,
                ...value
            }))
        }
        else {
            setSubjects(map(subjects, subject => (subject.subject._id === editTeacher.subject._id ? ({ ...subject, staff: value.staff }) : subject)))
        }
        closeTeacherModal()
    }

    useEffect(() => {
        if (addLiveClassBatchStatus === STATUS.SUCCESS && name !== "subject") {
            dispatch(resetLiveClassBatch())
            setShowOfflineDetails(false)
            history.push("/batch-management-list")
        }
        if (updateLiveClassBatchStatus === STATUS.SUCCESS && name !== "subject") {
            dispatch(resetLiveClassBatch())
            setShowOfflineDetails(false)
            history.push("/batch-management-list")
        }
    }, [addLiveClassBatchStatus, dispatch, history, name, updateLiveClassBatchStatus])

    useEffect(() => {
        if (name === "batch") {
            dispatch(getBatchSubjectLectureAction({ batchIds: [id] }))
        }
    }, [dispatch, id, name])
    const { batchSubjectLectures } = useSelector(s => s.liveClasses)

    return (
        <Card bg="white">
            <Col style={{ fontSize: "18px", fontWeight: "semibold", marginBottom: "20px" }}>Batch Management</Col>
            {name !== "subject" ?
                getLiveClassBatchStatus === STATUS.FETCHING ?
                    "loading..."
                    :
                    <Form
                        ref={formRef}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        layout="horizontal"
                        initialValues={id ?
                            {
                                name: liveClassBatch?.name,
                                duration: liveClassBatch?.duration,
                                center: liveClassBatch?.center,
                                code: liveClassBatch?.code,
                                startDateTime: liveClassBatch?.startDateTime ? moment(liveClassBatch?.startDateTime) : null,
                                days: liveClassBatch?.days,
                                liveClassRoom: liveClassBatch?.liveClassRoom?._id,
                                exam: liveClassBatch?.exam?._id,
                                inventoryGroup: liveClassBatch?.inventoryGroup,
                                offlineValidity: liveClassBatch?.offlineValidity ? moment(liveClassBatch?.offlineValidity) : null
                            }
                            :
                            null
                        }
                        onFinish={onFinish}
                    >
                        <Form.Item name="name" label="Create a batch" rules={[{ required: true }]}>
                            <Input placeholder="Enter batch name" />
                        </Form.Item>
                        <Form.Item label="Duration">
                            <Row>
                                <Col span={20}>
                                    <Form.Item name="duration" style={{ marginBottom: -20 }}>
                                        <Input type={"text"} />
                                    </Form.Item>
                                </Col>
                                <Col style={{ marginLeft: "10px" }}>in minutes</Col>
                            </Row>
                        </Form.Item>
                        <Form.Item label="Select Center" name="center" rules={[{ required: true }]}>
                            <Select placeholder="Select an option" allowClear>
                                {map(allCenterList, center => (
                                    <option value={center._id}>{center.name}</option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="code" label="Batch Code" rules={[{ required: true }]}>
                            <Input placeholder="Enter batch code" />
                        </Form.Item>
                        <Form.Item name="startDateTime" label="Batch Start date/time">
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                        </Form.Item>
                        <Form.Item name="days" label="Days">
                            <Checkbox.Group >
                                <Checkbox value="M">Mon</Checkbox>
                                <Checkbox value="Tu">Tue</Checkbox>
                                <Checkbox value="W">Wed</Checkbox>
                                <Checkbox value="Th">Thu</Checkbox>
                                <Checkbox value="F">Fri</Checkbox>
                                <Checkbox value="Sa">Sat</Checkbox>
                                <Checkbox value="S">Sun</Checkbox>
                            </Checkbox.Group>
                        </Form.Item>
                        <Form.Item label="Select Live Class Room">
                            <Row>
                                <Col span={22}>
                                    <Form.Item name="liveClassRoom" rules={[{ required: true }]} style={{ marginBottom: -20 }}>
                                        <Select placeholder="Select a option and change input text above" allowClear>
                                            {map(orderBy(liveClassRooms, 'createdAt', 'desc'), classes => (
                                                <option value={classes._id}>{classes.name}</option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Button style={{ marginLeft: "13px" }} onClick={() => setOpenClassRoom("open")}><AddIcon /></Button>
                                </Col>
                            </Row>
                        </Form.Item>

                        <Form.Item name="exam" label="Select Exam" rules={[{ required: true }]}>
                            <Select disabled={(name === "batch" && batchSubjectLectures.length) ? true : false} placeholder="Select a option and change input text above" onChange={(val) => setSelectedExam(val)} allowClear>
                                {map(configData?.defaultData?.exams, exam => (
                                    <Select value={exam._id}>{exam.name.en}</Select>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="offlineBatch" label="Offline Batch Details">
                            <Checkbox checked={showOfflineDetails} onChange={(e) => setShowOfflineDetails(e.target.checked)} />
                        </Form.Item>
                        {showOfflineDetails ?
                            <>
                                <Form.Item name="inventoryGroup" label="Select Inventory Group">
                                    <Select placeholder="Select a option and change input text above" allowClear>
                                        {map(allInventoryGroups, group => (
                                            <Select value={group._id}>{group.name}</Select>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="offlineValidity" label="Batch Validity">
                                    <DatePicker picker={"month"} format="MMM-YYYY" />
                                </Form.Item>
                            </>
                            :
                            null
                        }
                        <Row>
                            {name !== "batch" ?
                                <Card p={20} style={{ width: "100%" }}>
                                    <Row justify="space-between">
                                        <Col style={{ fontSize: "16px", fontWeight: "semibold" }}>Linking the teacher with the subject</Col>
                                        <Col>
                                            <Button>Download CSV</Button>
                                        </Col>
                                    </Row>
                                    {subjects?.length ?
                                        <Table style={{ marginTop: 10 }} loading={getSubjectListStatus === STATUS.FETCHING ? true : false} bordered dataSource={subjects}
                                            columns={columns} pagination={false}
                                        >
                                        </Table>
                                        :
                                        <Col>No Subjects Found</Col>
                                    }
                                </Card>
                                :
                                null
                            }
                        </Row>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Save</Button>
                        </Form.Item>

                    </Form>
                :
                null
            }
            {name === "subject" ?
                <Card p={20} style={{ width: "100%" }}>
                    <Col>
                        <Row>
                            <Col style={{ marginBottom: "10px", fontSize: "18px" }}>{liveClassBatch?.name}</Col>
                        </Row>
                        <Row justify="space-between">
                            <Col style={{ fontSize: "16px", fontWeight: "semibold" }}>Linking the teacher with the subject</Col>
                            <Col>
                                <Button>Download CSV</Button>
                            </Col>
                        </Row>
                    </Col>
                    {subjects?.length ?
                        <Table style={{ marginTop: 10 }} loading={getSubjectListStatus === STATUS.FETCHING ? true : false} bordered dataSource={subjects}
                            columns={columns} pagination={false}
                        >
                        </Table>
                        :
                        <Col>No Subjects Found</Col>
                    }
                </Card>
                :
                null
            }
            {classRoomModal && <AddLiveClassRoom classRoomModal={classRoomModal} handleClose={handleClose} />}
            {editTeacher && <AddSubjectTeacher staffs={singleInstitute?.[0]?.staffs} editTeacher={editTeacher} handleClose={closeTeacherModal} onFinish={addSubjectTeacher} />}
        </Card>
    )
}

const AddLiveClassRoom = ({ classRoomModal, handleClose }) => {
    const dispatch = useDispatch()

    const { addLiveClassRoomStatus } = useSelector(s => ({
        addLiveClassRoomStatus: s.liveClasses.addLiveClassRoomStatus
    }))

    const onFinish = (value) => {
        const data = {
            name: value.name,
            code: value.code,
            zoomData: { apikey: value.zoomApikey, apisecret: value.zoomApisecret }
        }
        dispatch(addLiveClassRoomAction(data))
    }

    useEffect(() => {
        if (addLiveClassRoomStatus === STATUS.SUCCESS) {
            dispatch(resetLiveClassBatch())
            handleClose()
        }
    })
    return (
        <Modal title="Add Live Class Room" visible={classRoomModal ? true : false} footer={false} onCancel={handleClose}>
            <Form
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                onFinish={onFinish}
            >
                <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                    <Input placeholder="Enter Name" />
                </Form.Item>
                <Form.Item name="code" label="Code" rules={[{ required: true }]}>
                    <Input type="text" placeholder="Enter Code" />
                </Form.Item>
                <Form.Item name="zoomApikey" label="Zoom Api Key" rules={[{ required: true }]}>
                    <Input type="text" placeholder="Enter Key" />
                </Form.Item>
                <Form.Item name="zoomApisecret" label="Zoom Api Secret" rules={[{ required: true }]}>
                    <Input type="text" placeholder="Enter Secret" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Save</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export const AddSubjectTeacher = ({ staffs, editTeacher, handleClose, onFinish }) => {
    return (
        <Modal title="Add Live Class Room" visible={editTeacher ? true : false} footer={false} onCancel={handleClose}>
            <Form
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                onFinish={onFinish}
            >
                <Form.Item name="staff" label=" Select Teacher">
                    <Select placeholder="Select Teacher" defaultValue={editTeacher.staff} allowClear>
                        {map(staffs, staff => (
                            <option value={staff._id}>{staff.user?.name}</option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Save</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}