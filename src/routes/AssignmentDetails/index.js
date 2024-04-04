import { CalculatorOutlined, CloseOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, UploadOutlined, PoweroffOutlined, SearchOutlined } from '@ant-design/icons'
import { Card, Typography, Form, Space, Button, Table, Upload, Input, Modal, Tag, Tooltip, Descriptions, Tabs, Popconfirm, Alert } from 'antd'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { BaseURL, getBaseUrl } from '../../BaseUrl'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { STATUS } from '../../Constants'
import { addAssignmentResultAction, assignmentResultCalAction, downloadSubmissionsAction, getAssignmentAction, getSubmissionsAction, updateAssignmentsAction, uploadCheckedFileAction } from '../../redux/reducers/assignments'
import _, { filter, find, map } from 'lodash'
import moment from 'moment'
import { getPackageRollsAction, getTypePackagsAction } from '../../redux/reducers/packages'
import { assignmentZipAction } from '../../redux/reducers/assignments'
import { UploadAssignmentMarksModal } from './UploadAssignmentMarksModal'
const Text = Typography.Text

export const AssignmentDetails = () => {
    const dispatch = useDispatch()
    const params = useParams()

    const { getSingleAssignmentStatus, currentAssignment, allSubmissions, downloadSubmissionsStatus, allStudentRolls,
        getPackageRollsStatus, assignmentResultStatus, assingmentMarksStatus, assignmentZipStatus, zipErrors
    } = useSelector(state => ({
        getSingleAssignmentStatus: state.assignments.getSingleAssignmentStatus,
        currentAssignment: state.assignments.currentAssignment,
        allSubmissions: state.assignments.allSubmissions,
        allStudentRolls: state.packages.allStudentRolls,
        getPackageRollsStatus: state.packages.getPackageRollsStatus,
        assignmentResultStatus: state.assignments.assignmentResultStatus,
        assingmentMarksStatus: state.assignments.assingmentMarksStatus,
        assignmentZipStatus: state.assignments.assignmentZipStatus,
        zipErrors: state.assignments.zipErrors
    }))

    const [zipModal, openZipModal] = useState()
    const [marksModal, openMarksModal] = useState()

    const assignmentPackages = useMemo(() => {

        return map(currentAssignment?.packages, p => {
            const assignment = find(p.assignments, a => a.assignmentId === currentAssignment._id)
            return { ...p, assignment }
        })
    }, [currentAssignment?._id, currentAssignment?.packages])

    useEffect(() => {
        if (assingmentMarksStatus === STATUS.SUCCESS)
            openMarksModal()
    }, [assingmentMarksStatus])

    useEffect(() => {
        if (assignmentZipStatus === STATUS.SUCCESS)
            openZipModal()
    }, [assignmentZipStatus])

    useEffect(() => {
        if (assignmentResultStatus === STATUS.SUCCESS) {
            dispatch(getAssignmentAction({ id: params.id }))
            dispatch(getSubmissionsAction({ assignmentId: params.id, page: 1, limit: 100000 }))
        }
    }, [assignmentResultStatus, dispatch, params.id])

    useEffect(() => {
        if (params.id) {
            dispatch(getAssignmentAction({ id: params.id }))
            dispatch(getSubmissionsAction({ assignmentId: params.id, page: 1, limit: 100000 }))
            // dispatch(getTypePackagsAction({type:'assignment', _id:params.id}))
        }
    }, [dispatch, params])

    useEffect(() => {
        if (assignmentPackages?.length) {
            dispatch(getPackageRollsAction({ user: true, packageIds: assignmentPackages.map(p => p._id) }))
        }
    }, [assignmentPackages, dispatch])

    // const handleMarks = (value, id) => {
    //     setMarks(value ? {id, value} : null)
    // }

    // const handleSaveMarks = () => {
    //     dispatch(addAssignmentResultAction({assignmentSubmitId:marks.id, result:marks.value}))
    // }

    const handleDownloadFiles = () => {
        // dispatch(downloadSubmissionsAction({assignmentId:params.id}))
        window.open(BaseURL + 'assignment/assignment-submissions-zip?assignmentId=' + params.id, '_blank')
    }

    console.log('data', currentAssignment)

    const columns = [
        {
            title: 'Package',
            dataIndex: 'name',
            key: 'name',
            render: text => <a>{text?.en}</a>,
        },

        {
            title: 'Start',
            dataIndex: '',
            key: 'startDate',
            render: text => {
                return text.assignment.startDate && moment(text.assignment.startDate).format("DD MMM YYYY hh:mm a")
            },
        },

        {
            title: 'End',
            dataIndex: '',
            key: 'endDate',
            render: text => {
                return text.assignment.endDate && moment(text.assignment.endDate).format("DD MMM YYYY hh:mm a")
            },
        },

        {
            title: 'Max Marks',
            dataIndex: '',
            key: 'maximumMarks',
            render: text => text.assignment?.maximumMarks,
        },
    ]

    const finaldata = useMemo(() => {
        let allAssignments = allSubmissions ? allSubmissions.docs : []
        if (allAssignments.length && allStudentRolls?.length) {
            return allStudentRolls.map(r => {
                return {
                    ...r, submission: find(allAssignments, a => {
                        const sbUser = typeof a.userId === 'object' ? a.userId._id : a.userId
                        return sbUser === r.user?._id
                    })
                }
            })
        }
    }, [allStudentRolls, allSubmissions])

    const handleCalculate = () => {
        dispatch(assignmentResultCalAction({ id: params.id }))
    }

    const handleDiscussion = () => {
        dispatch(updateAssignmentsAction({ assignmentId: params.id, discussion: !currentAssignment.discussion }));
    }
    const _unpublishResult = () => {
        dispatch(updateAssignmentsAction({ assignmentId: params.id, resultPublished: false }));
    }
    const _publishResult = () => {
        dispatch(updateAssignmentsAction({ assignmentId: params.id, resultPublished: true }));

    }

    const handleLeads = () => {
        dispatch(updateAssignmentsAction({ assignmentId: params.id, leaderBoard: !currentAssignment.leaderBoard }));
    }

    const handleUploadZip = () => {
        openZipModal(d => !d)
    }

    const handleUploadMarks = () => {
        openMarksModal(d => !d)
    }

    return (
        <div>
            <CommonPageHeader title={'Assignment Submissions'} />
            <br />
            <Card style={{ minHeight: 500 }} loading={getSingleAssignmentStatus === STATUS.FETCHING || getPackageRollsStatus === STATUS.FETCHING}>
                {getSingleAssignmentStatus === STATUS.SUCCESS && getPackageRollsStatus === STATUS.SUCCESS && currentAssignment ?
                    <div>
                        <Space>
                            <Text style={{ fontSize: 16 }}>Assignment Title: </Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{currentAssignment.title}</Text>
                        </Space>
                        <br /><br />
                        <Space size='large'>
                            {/* <Form.Item label='Assignment Period'>
                                -
                            </Form.Item> */}
                            <Form.Item label='Question Paper'>
                                {currentAssignment.questionPaper ?
                                    <Button href={currentAssignment.questionPaper} target='_blank' icon={<DownloadOutlined />}>Download</Button>
                                    : '-'
                                }
                            </Form.Item>
                            <Form.Item label='Answer Sheet'>
                                {currentAssignment.answerSheet ?
                                    <Button href={currentAssignment.answerSheet.file} target='_blank' icon={<DownloadOutlined />}>
                                        {currentAssignment.answerSheet.title}
                                    </Button>
                                    : '-'
                                }
                            </Form.Item>
                            <Form.Item label='Download All Students Answer Sheets'>
                                <Button onClick={handleDownloadFiles} target='_blank' icon={<DownloadOutlined />}
                                    loading={downloadSubmissionsStatus === STATUS.FETCHING}
                                >
                                    Download
                                </Button>
                            </Form.Item>
                        </Space>
                        <br />

                        <Table size='small' pagination={false} columns={columns} dataSource={assignmentPackages} />

                        <br /><br />
                        <Card bodyStyle={{ padding: 10 }} style={{ margin: '8px 0' }}>
                            <Space size='large' wrap>
                                {currentAssignment.result ?
                                    <Space wrap size='large'>
                                        <div>
                                            <Text>Total Submissions: </Text>
                                            <Text style={{ fontWeight: 'bold', color: '#3498DB' }}>
                                                {currentAssignment.result.totalAttempt}
                                            </Text>
                                        </div>
                                        <div>
                                            <Text>Average Score: </Text>
                                            <Text style={{ fontWeight: 'bold', color: '#3498DB' }}>
                                                {_.round(currentAssignment.result.averageScore, 2)}
                                            </Text>
                                        </div>
                                        <div>
                                            <Text>Highest Score: </Text>
                                            <Text style={{ fontWeight: 'bold', color: '#3498DB' }}>
                                                {currentAssignment.result.highestScore}
                                            </Text>
                                        </div>
                                        <div>
                                            <Text>Lowest Score: </Text>
                                            <Text style={{ fontWeight: 'bold', color: '#3498DB' }}>
                                                {currentAssignment.result.lowestScore}
                                            </Text>
                                        </div>
                                        <Button size='small' icon={<PoweroffOutlined />}
                                            onClick={handleDiscussion} danger={currentAssignment.discussion}
                                        >
                                            {currentAssignment.discussion ? 'Disable Discussion' : 'Enable Discussion'}
                                        </Button>

                                        <Button size='small' icon={<PoweroffOutlined />}
                                            onClick={_unpublishResult}
                                        >
                                            Unpublish Result
                                        </Button>
                                    </Space>
                                    :
                                    <Text type='danger'>Result Not Calculated</Text>
                                }
                                <Space wrap>
                                    <Button size='small' type='primary' icon={<CalculatorOutlined />}
                                        loading={assignmentResultStatus === STATUS.FETCHING}
                                        onClick={handleCalculate}
                                    >
                                        {
                                            currentAssignment.result ?
                                                "Recalculate Result" : "Calculate Result"
                                        }
                                    </Button>
                                    {currentAssignment.result ?
                                        <Button size='small' icon={<PoweroffOutlined />}
                                            onClick={handleDiscussion} danger={currentAssignment.discussion}
                                        >
                                            {currentAssignment.discussion ? 'Disable Discussion' : 'Enable Discussion'}
                                        </Button> : null
                                    }
                                    <Button icon={<UploadOutlined />} onClick={handleUploadZip} size='small' >
                                        Upload Checked Answer Sheets
                                    </Button>
                                    <Button icon={<UploadOutlined />} onClick={handleUploadMarks} size='small' >
                                        Upload Marks
                                    </Button>
                                    {/* <Button size='small' icon={<PoweroffOutlined />}
                                        onClick={handleLeads} danger={currentAssignment.leaderBoard}
                                    >
                                        {currentAssignment.discussion ? 'Disable Leader Board' : 'Enable Leader Board'}
                                    </Button> */}
                                </Space>
                            </Space>
                        </Card>
                        {console.log('zipErrors', zipErrors)}
                        {zipErrors?.length ?
                            <Space direction='vertical' size={1} style={{ marginBottom: 10 }}>
                                {
                                    zipErrors.map((err, i) => <Text style={{ fontSize: 12 }} type='danger'>* {err.message}</Text>)
                                }
                            </Space>
                            :
                            null
                        }
                        <br />

                        <StudentsTable allAssignments={finaldata} />


                    </div>
                    :
                    null
                }
            </Card>
            {marksModal ? <UploadAssignmentMarksModal assignment={currentAssignment} visible={marksModal} closeModal={handleUploadMarks} /> : null}
            {zipModal ? <UploadZipModal visible={zipModal} closeModal={() => handleUploadZip(null)} data={zipModal} /> : null}
        </div>
    )
}


const StudentsTable = ({ allAssignments }) => {
    const datasource = allAssignments //filter(allAssignments, a => a.packageType === "online")
    const dispatch = useDispatch()
    const params = useParams();


    useEffect(() => {
        console.log("d1234", allAssignments);
    }, []);

    const { getSubmissionsStatus, uploadCheckedFileStatus, allSubmissions, addAssignmentStatus, currentAssignment } = useSelector((state) => ({
        getSubmissionsStatus: state.assignments.getSubmissionsStatus,
        uploadCheckedFileStatus: state.assignments.uploadCheckedFileStatus,
        allSubmissions: state.assignments.allSubmissions,
        addAssignmentStatus: state.assignments.addAssignmentStatus,
        currentAssignment: state.assignments.currentAssignment,
    }))

    const [marksModal, openMarksModal] = useState()
    const [files, changeFiles] = useState({})
    const [marks, setMarks] = useState()
    const [uploading, setUploading] = useState()

    let sheetUrl = useRef()
    const publicStatusRef = useRef()
    let searchInput = useRef();

    let filter = (type, more) => ({
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.select(), 100);
            }
        },

        onFilter: (value, record) =>
            more ?
                record[more]?.[type]
                    ? record[more][type]
                        .toString()
                        .toLowerCase()
                        .includes(value.toLowerCase())
                    : ""
                :
                record[type]
                    ? record[type]
                        .toString()
                        .toLowerCase()
                        .includes(value.toLowerCase())
                    : "",

        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Form
                    onFinish={() => {
                        confirm({ closeDropdown: false });
                    }}
                >
                    <Input
                        ref={(node) => {
                            searchInput = node;
                        }}
                        placeholder={`Search ${type}`}
                        value={selectedKeys[0]}
                        onChange={(e) =>
                            setSelectedKeys(e.target.value ? [e.target.value] : [])
                        }
                        style={{ marginBottom: 8, display: "block" }}
                    />
                    <Space>
                        <Button
                            htmlType="submit"
                            type="primary"
                            icon={<SearchOutlined />}
                            size="small"
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

    useEffect(() => {
        if (uploadCheckedFileStatus === STATUS.SUCCESS) {
            sheetUrl.current = null
            publicStatusRef.current = null
            changeFiles(null)
        }
    }, [uploadCheckedFileStatus])

    useEffect(() => {
        if (addAssignmentStatus === STATUS.SUCCESS)
            openMarksModal(false)
    }, [addAssignmentStatus])

    const _changeFile = (e, id) => {
        let data = { ...files }
        let url = e.file.response?.url

        if (url) {
            if (data && data.id === id) {
                changeFiles({ id, list: [...data.list, url] })
            } else {
                changeFiles({ id, list: [url] })
            }

            setUploading(false)
        } else if (e.file.status === 'uploading') {
            setUploading(id)
        }
    }

    const handleMarks = (d) => {
        openMarksModal(d)
    }

    const removeFile = () => {
        changeFiles({})
    }

    const handleRemoveFile = (file) => {
        let data = { ...files }
        _.remove(data.list, d => d === file)
        changeFiles(data)
    }

    const handleUploadCheckSheet = (ass) => {
        let newSheets = ass.submission?.answerSheetChecked || []
        let data = ass.submission ?
            { assignmentSubmitId: ass.submission._id, upload_checked: [...files.list, ...newSheets] }
            :
            { assignmentId: ass._id, userId: ass.user._id, submitMode: ass.packageType, upload_checked: [...files.list, ...newSheets] }

        dispatch(uploadCheckedFileAction(data))
    }

    const handleRemoveSavedFile = (data, url, ass) => {
        let newData = [...data]
        _.remove(newData, d => d === url)
        sheetUrl.current = url
        dispatch(uploadCheckedFileAction({ assignmentSubmitId: ass._id, upload_checked: newData }))

    }

    const [page, setPage] = useState(1)
    const handlePageChange = (e) => {
        setPage(e.current)
        // dispatch(getSubmissionsAction({ assignmentId: params.id, page: e.current }))
    }

    const filters = [
        {
            text: "Online",
            value: true,
        },
        {
            text: "Offline",
            value: false,
        },
    ]

    const onFilter = (value, record) => {
        record = Object.assign({}, record, {
            active: record.packageType === 'online' ? true : false,
        });
        return record.active === value;
    }

    const handlePublicSheet = (id, status) => {
        let data = { assignmentSubmitId: id, publicAnswerSheet: status }
        publicStatusRef.current = id
        dispatch(uploadCheckedFileAction(data))
    }

    return (
        <>
            <Table loading={getSubmissionsStatus === STATUS.FETCHING}
                dataSource={datasource} bordered scroll={{ x: 1800 }}
                // pagination={{ total: allSubmissions?.total, current: allSubmissions?.page, pageSize: allSubmissions?.limit, position: ['bottomCenter', 'topCenter'] }}
                onChange={handlePageChange}
            >
                <Table.Column title='Sr. No' dataIndex='userId' width={100}
                    render={(d, a, indx) => indx + 1 + ((page - 1) * 10)}
                />
                <Table.Column title='Roll Number' width={150} {...filter('finalRoll')}
                    render={(d) => d.finalRoll}
                />
                <Table.Column title='Student Name' dataIndex='user' {...filter('name', 'user')}
                    render={d => d.name}
                />
                {currentAssignment.resultPublished ?
                    <Table.Column title='Rank' dataIndex='submission' width={100}
                        sorter={(a, b) => parseInt(a.submission?.studentResult?.rank || 100000) - parseInt(b.submission?.studentResult?.rank || 100000)}
                        render={d => d?.studentResult?.rank}
                    />
                    :
                    null
                }
                <Table.Column key='active' title='Package Mode' width={130} filters={filters} onFilter={onFilter} dataIndex='packageType' />
                <Table.Column title='Answer Sheet (Submitted By Student)' dataIndex='submission'
                    render={arr => arr?.answerSheet?.length ? arr?.answerSheet?.map((d, i) =>
                        <Button style={{ margin: 4 }} size='small' href={d} target='_black'>
                            {d.substring(d.length - 8, d.length)}
                        </Button>
                    ) : <Text type='secondary'>Not Submitted</Text>
                    }
                />
                <Table.Column title='Upload Check Answer Sheet'
                    render={d =>
                        <Space direction='vertical'>
                            {d.submission?.answerSheetChecked?.length ?
                                <Space wrap size='small'>
                                    {d.submission.answerSheetChecked?.map((sheet, i) =>
                                        <Space size={0}>
                                            <Tooltip title='view'>
                                                <Button style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} size='small' href={sheet} target='_black'
                                                    loading={sheetUrl.current === sheet && uploadCheckedFileStatus === STATUS.FETCHING}
                                                >
                                                    {sheet.substring(sheet.length - 8, sheet.length)}
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title='delete'>
                                                <Tag color='red' style={{ cursor: 'pointer', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                                                    onClick={() => handleRemoveSavedFile(d.submission.answerSheetChecked, sheet, d.submission)}
                                                >
                                                    <DeleteOutlined />
                                                </Tag>
                                            </Tooltip>
                                        </Space>
                                    )}
                                </Space>
                                : null
                            }
                            <Space wrap>
                                <Upload showUploadList={false} action={BaseURL + "app/image"}
                                    onChange={(e) => _changeFile(e, d._id)} onRemove={removeFile}
                                >
                                    <Button loading={uploading === d._id} icon={<UploadOutlined />} size='small' >
                                        Upload
                                    </Button>
                                </Upload>
                                {files?.list?.length && files.id === d._id ?
                                    <Space wrap>
                                        {files.list.map((file, i) =>
                                            <Tooltip title='remove'>
                                                <Button size='small' key={i} onClick={() => handleRemoveFile(file)}>
                                                    {file.substring(file.length - 8, file.length)} <CloseOutlined />
                                                </Button>
                                            </Tooltip>
                                        )}
                                        <Button size='small' type='primary'
                                            onClick={() => handleUploadCheckSheet(d)}
                                            loading={uploadCheckedFileStatus === STATUS.FETCHING}
                                        >
                                            Save
                                        </Button>
                                    </Space>
                                    :
                                    null
                                }
                            </Space>
                        </Space>
                    }
                />
                <Table.Column title='Grades' width={140}
                    sorter={(a, b) => (a.submission?.result || a.submission?.result === 0 ? a.submission?.result : -1) - (b.submission?.result || b.submission?.result === 0 ? b.submission?.result : -1)}
                    render={d =>
                        <Space>
                            {d.submission?.result || d.submission?.result === 0 ?
                                <Text style={{ color: '#3498DB' }}>{d.submission.result}</Text>
                                :
                                <Text type='secondary'>Not Graded</Text>
                            }

                            <Button type='link' icon={<EditOutlined />} size='small' onClick={() => handleMarks(d)}></Button>
                        </Space>
                    }
                />
                <Table.Column title='Uploading Date' width={150}
                    render={d => d?.submission?.submittedAt ? moment(d?.submission?.submittedAt).format('DD-MM-YYYY') : null}
                />
                <Table.Column title='Actions' fixed='right' width={180}
                    render={d =>
                        d.submission?.answerSheetChecked?.length ?
                            <Popconfirm placement="top"
                                title={d.submission.publicAnswerSheet ? 'Are you sure you want to make checked sheets private?' : 'Are you sure you want to make checked sheets public?'}
                                onConfirm={() => handlePublicSheet(d.submission._id, !d.submission.publicAnswerSheet)} okText="Yes" cancelText="No"
                            >
                                <Button danger={d.submission.publicAnswerSheet} size='small'
                                    loading={uploadCheckedFileStatus === STATUS.FETCHING && publicStatusRef.current === d.submission._id}
                                >
                                    {d.submission.publicAnswerSheet ? 'Disable Public' : 'Public Checked Sheet'}
                                </Button>
                            </Popconfirm>
                            : null
                    }
                >
                </Table.Column>
            </Table>

            {marksModal ? <MarksModal visible={marksModal} assignment={marksModal} cloeModal={() => handleMarks(null)} /> : null}
        </>
    )
}

const UploadZipModal = ({ visible, closeModal, data }) => {
    const dispatch = useDispatch()
    const params = useParams()

    const { assignmentZipStatus } = useSelector(state => ({
        assignmentZipStatus: state.assignments.assignmentZipStatus
    }))

    const [files, setFiles] = useState()

    const handleChangeFile = (e) => {
        setFiles(e.target.files[0])
        return false
    }

    const handleRemove = () => {
        setFiles([])
    }

    const handleSubmit = () => {
        let formData = new FormData()
        formData.append('upload', files)
        formData.append('assignmentId', params.id)
        dispatch(assignmentZipAction(formData))
    }

    return (
        <Modal title={'Upload Checked Files'} okText='Upload' visible={visible} onCancel={closeModal}
            onOk={handleSubmit} okButtonProps={{ loading: assignmentZipStatus === STATUS.FETCHING }}
        >
            <Alert type="warning"
                message={
                    <div>
                        <Text>Instructions</Text>
                        <ul>
                            <li>Create zip of all the checked files and then upload the zip file.</li>
                            <li>All files should be of PDF type.</li>
                            <li>File's name should be student's roll number whome you are uploading to. eg. 1234567890.pdf</li>
                        </ul>
                    </div>
                }
            />
            <br />
            <Form.Item label='Select Zip File'>
                <Input type={'file'} onChange={handleChangeFile} accept='.zip,.rar,.7zip' />
                {/* <Upload multiple={false} accept='.zip,.rar,.7zip' fileList={files}
                    beforeUpload={handleChangeFile} onRemove={handleRemove}
                >
                    <Button icon={<UploadOutlined />} size='small' >
                        Upload
                    </Button>
                </Upload> */}
            </Form.Item>
        </Modal>
    )
}

const MarksModal = ({ visible, cloeModal, assignment }) => {
    const params = useParams()
    const dispatch = useDispatch()
    const [marks, setMarks] = useState()

    const addAssignmentStatus = useSelector(state => state.assignments.addAssignmentStatus)

    const handleChange = (e) => {
        setMarks(e.target.value)
    }

    const handleSubmit = () => {
        let data = assignment.submission ?
            { assignmentSubmitId: assignment.submission._id, result: marks }
            :
            { assignmentId: params.id, userId: assignment.user._id, result: marks, submitMode: assignment.packageType }

        dispatch(addAssignmentResultAction(data))
    }

    return (
        <Modal title='Update Grade' visible={visible} onOk={handleSubmit}
            okButtonProps={{ htmlType: 'submit', loading: addAssignmentStatus === STATUS.FETCHING }} onCancel={cloeModal}
        >
            <Form onFinish={handleSubmit}>
                <Form.Item label='Grade' name='marks'>
                    <Input placeholder='Grade' type='number' defaultValue={assignment.submission?.result} onChange={handleChange} />
                </Form.Item>
            </Form>
        </Modal>
    )
}