import { PrinterOutlined, SyncOutlined, WifiOutlined, CommentOutlined, ContainerOutlined, ProfileOutlined, CheckCircleOutlined, GlobalOutlined, TabletOutlined, ClockCircleOutlined, CloseCircleOutlined, ReconciliationOutlined, MessageOutlined, SafetyOutlined, SearchOutlined, BackwardOutlined, DeleteOutlined, ForwardOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Col, Row, Descriptions, Tabs, Table, Progress, Tag, Form, Input, Space, Tooltip, Upload } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { printHelper, PRINT_TYPE, STATUS } from '../../Constants'
import { changeAttmptStatusAction, getOfflineTestResult, getTestAttemptDataAction, resetUploadOfflineResultStatus, resultCalculateAction, updateTestAction, uploadOfflineTestResult } from '../../redux/reducers/test'
import { TestPaperPrint } from './TestPaperPrint'
import _, { map, toUpper } from 'lodash'
import Text from 'antd/lib/typography/Text'
import { UpdateQuestionModal } from '../../components/UpdateQuestionModal'
import { ResultDataTable } from './ResultReportTable'
import { ExportExcel } from '../../components/ExportExcel'
import moment from 'moment'
import { ConfirmAlert } from '../../Constants/CommonAlerts'
import { AiOutlineCalculator } from "react-icons/ai"
import { sheetToJSON } from '../../utils/FileHelper'
import { getPackageRollsAction } from '../../redux/reducers/packages'
import { DownloadIcon } from '@chakra-ui/icons'
import { BaseURL } from '../../BaseUrl'
import { URIS } from '../../services/api'

const { TabPane } = Tabs
const packageColumns = [
    {
        title: 'Package',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
    },

    {
        title: 'Start',
        dataIndex: 'startDate',
        key: 'startDate'
    },

    {
        title: 'End',
        dataIndex: 'endDate',
        key: 'endDate'
    },

    {
        title: 'Max Marks',
        dataIndex: 'maximumMarks',
        key: 'maximumMarks'
    },
]

export const StudentsAndResult = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const params = useParams()

    const [currentTab, changeTab] = useState('attempt')

    const { attemptData, attemptStatus, user, getTestStatus } = useSelector(state => ({
        //currentTest:state.test.currentTest,
        attemptData: state.test.testAttemptData,
        attemptStatus: state.test.getTestAttemptDataStatus,
        getTestStatus: state.test.getTestStatus,
        user: state.user
    }))

    useEffect(() => {
        // dispatch(getSingleTestAction({testId:params.id}))
        dispatch(getTestAttemptDataAction({ testId: params.id }))
    }, [dispatch])


    const testPackages = useMemo(() => {
        if (!attemptData?.packages) return [];
        return _.map(attemptData?.packages, p => {
            const curTest = _.find(p.tests, t => t.test === params.id);
            return ({
                name: p.name.en,
                startDate: curTest?.startDate && moment(curTest.startDate).format("DD MMM YYYY hh:mm a"),
                endDate: curTest?.endDate && moment(curTest.endDate).format("DD MMM YYYY hh:mm a"),
                maximumMarks: attemptData.maxMarks
            })
        })
    }, [attemptData, params.id])

    return (
        <div>
            <CommonPageHeader title='Students And Result' />
            <br />
            <Card loading={attemptStatus == STATUS.FETCHING}>
                {attemptStatus == STATUS.SUCCESS && attemptData ?
                    <>
                        <Card bodyStyle={{ padding: '10px' }}>
                            <Descriptions title="TEST DETAILS" bordered>
                                <Descriptions.Item label="Name">{attemptData?.name?.en}</Descriptions.Item>
                                <Descriptions.Item label="Test Id">{attemptData?.referenceId}</Descriptions.Item>
                                <Descriptions.Item label="Test Type">{attemptData?.testType}</Descriptions.Item>
                                <Descriptions.Item label="Total Time">{attemptData?.totalTime + ' Minutes'}</Descriptions.Item>
                            </Descriptions>
                            <br />
                            {
                                testPackages?.length > 0 &&
                                <>
                                    <Table size='small' pagination={false} columns={packageColumns} dataSource={testPackages} />
                                    <br />
                                </>
                            }
                            <Row>
                                <Col span={12}>
                                    <Button type="primary" shape="round" icon={<SyncOutlined />} size='middle' onClick={() => dispatch(getTestAttemptDataAction({ testId: params.id }))}>
                                        Refresh
                                    </Button>
                                </Col>
                                <Col span={12}>
                                    <div style={{ float: 'right' }}>
                                        <Button shape="round" size='middle' onClick={() => history.push('/answer-keys/' + params.id)}>
                                            Answer Key
                                        </Button>&nbsp;&nbsp;
                                        {/*<Button shape="round" size='middle'>
                                            Start Demo Attempt
                                        </Button>*/}
                                    </div>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={24}>
                                    <Tabs defaultActiveKey={currentTab} type='card' size='large' centered onChange={(e) => changeTab(e)}>
                                        <TabPane tab="ATTEMPT" key="attempt">
                                            {currentTab === 'attempt' ?
                                                <Row>
                                                    <Col span={24}>
                                                        <AttemptListComponent data={attemptData} />
                                                    </Col>
                                                </Row>
                                                : null}
                                        </TabPane>
                                        {attemptData?.testType === "offline" || attemptData?.testType === 'online+offline' || true ?
                                            <TabPane tab="OFFLINE RESULT" key="offline">
                                                {currentTab === 'offline' ?
                                                    <Row>
                                                        <Col span={24}>
                                                            <OfflineResultComponent testId={params.id} sections={attemptData.sections} />
                                                        </Col>
                                                    </Row>
                                                    : null}
                                            </TabPane>
                                            : null}
                                        <TabPane tab="RESULT" key="result">
                                            {currentTab === 'result' ?
                                                <Row>
                                                    <Col span={24}>
                                                        <ResultDataComponent data={attemptData} />
                                                    </Col>
                                                </Row>
                                                : null}
                                        </TabPane>
                                    </Tabs>
                                </Col>
                            </Row>
                        </Card>
                    </>
                    :
                    <div>

                    </div>
                }
            </Card>
        </div>
    )
}

const AttemptListComponent = ({ data }) => {
    const [state, setState] = useState({})

    let attemptData = data.attempts?.length ? { ...data, attempts: _.uniqBy(data.attempts, d => d.userId?._id) } : data

    useEffect(() => {
        saveAttemptDataInState()
    }, [data])

    const saveAttemptDataInState = () => {
        let notStarted = _.filter(attemptData.attempts, a => a.progressStatus == null || a.progressStatus === 'absent').length
        let onWeb = _.filter(attemptData.attempts, a => a.progressStatus != null && (a.progressStatus === 'in-progress' || a.progressStatus === 'completed') && a.platform != null && a.platform == 'web').length
        let onApp = _.filter(attemptData.attempts, a => a.progressStatus != null && (a.progressStatus === 'in-progress' || a.progressStatus === 'completed') && (!a.platform || a.platform != 'web') && !a.offline).length
        let onOffline = _.filter(attemptData.attempts, a => a.progressStatus != null && (a.offline && a.offline == 1 && a.offlineType)).length
        let ongoing = _.filter(attemptData.attempts, a => a.progressStatus === 'in-progress').length
        let completed = _.filter(attemptData.attempts, a => a.progressStatus === 'completed').length
        let total = attemptData.attempts.length
        setState({ onOffline, notStarted, ongoing, completed, total, onWeb, onApp })
    }

    const excelFieldData = map(attemptData.attempts, d => {
        let startDateIst = new Date(new Date(d.createdAt).getTime());
        startDateIst.setHours(startDateIst.getHours() + 5);
        startDateIst.setMinutes(startDateIst.getMinutes() + 30);
        startDateIst = moment(startDateIst);
        return ({
            Name: d.userId?.name,
            Platform: d.platform === 'web' ? "WEB" : d.platform === 'offline' ? "Offline" : "MOBILE",
            AttempDate: d?.createdAt ? moment(d.createdAt).format('DD-MM-YYYY') : '--',
            StartTime: d?.createdAt ? moment(d.createdAt).format('hh:mm a') : '--',
            EndTime: d.progressStatus === 'completed' && d.submittedAt ? moment(d.submittedAt).format('hh:mm a') : '--',
            Status: toUpper(d?.progressStatus),
            UserName: d?.userId?.username,
            Contact: d?.userId?.contact,
            Email: d?.userId?.email
        })
    })
    return (
        <div style={{ padding: '10px' }}>
            <Row>
                <Col span={12}>
                    <div>
                        <Tag icon={<ClockCircleOutlined />} color="default">
                            NOT-STARTED: {state?.notStarted + '/' + state?.total}
                        </Tag>
                        <Tag icon={<SyncOutlined />} color="processing">
                            ATTEMPTING: {state?.ongoing + '/' + state?.total}
                        </Tag>
                        <Tag icon={<CheckCircleOutlined />} color="success">
                            COMPLETED: {state?.completed + '/' + state?.total}
                        </Tag>
                    </div>
                    <div style={{ paddingTop: '10px' }}>
                        <Tag icon={<TabletOutlined />} color="magenta">
                            MOBILE: {state?.onApp + '/' + (state?.ongoing + state?.completed)}
                        </Tag>
                        <Tag icon={<GlobalOutlined />} color="cyan">
                            WEB: {state?.onWeb + '/' + (state?.ongoing + state?.completed)}
                        </Tag>
                    </div>
                </Col>
                <Col span={12}>
                    <div style={{ float: 'right' }}>
                        {/* <Button style={{marginTop: '5px', backgroundColor: '#5cb85c', color: 'white', border: 'white'}} shape="round" size='small' icon={<MessageOutlined />}>
                            Notify Student
                        </Button>&nbsp;&nbsp; */}
                        {/*<Button type='primary' shape="round" size='small' icon={<SafetyOutlined />}>
                            SMS Password
                        </Button>&nbsp;&nbsp;*/}
                        {/*<Button style={{backgroundColor: 'orange', color: 'white', border: 'white'}} shape="round" size='small' icon={<ContainerOutlined />}>
                            Export Excel
                        </Button>*/}
                        <ExportExcel filename={"Test Attempt List"} data={excelFieldData} />
                    </div>
                </Col>
            </Row>
            <br />
            <AttemptListTable data={attemptData} />
        </div>
    )
}

const AttemptListTable = ({ data }) => {
    let searchInput = useRef();
    const dispatch = useDispatch()

    const changeAttmptStatus = useSelector(state => state.test.changeAttmptStatus)

    const filter = (name) => ({
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.select(), 100);
            }
        },

        onFilter: (value, record) =>
            record?.userId?.[name]
                ? record?.userId?.[name]
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
                    <Input ref={(node) => { searchInput = node; }}
                        placeholder={`Search ${name}`}
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
        ),
    })

    const changeAttemptStatus = (id, status) => {
        dispatch(changeAttmptStatusAction({ attemptIds: [id], progressStatus: status }))
    }

    const [page, changePage] = useState(1)
    let pageSize = 20

    const columns = [
        {
            title: '#',
            key: 'index',
            render: (text, pData, id) => (page - 1) * pageSize + id + 1,
            width: '70px',
            fixed: 'left',
        },
        {
            title: 'Name',
            key: 'name',
            render: d => d?.userId?.name,
            ...filter('name'),
            fixed: 'left',
            width: '200px',
        },
        {
            title: 'Platform',
            key: 'platform',
            dataIndex: 'platform',
            render: d => <div>{d === 'web' ? <Tag icon={<GlobalOutlined />} color="cyan">WEB</Tag> : d === 'offline' ? <Tag icon={<GlobalOutlined />} color="gray">Offline</Tag> : <Tag icon={<TabletOutlined />} color="magenta">MOBILE</Tag>}</div>,
            filters: [
                {
                    text: 'WEB',
                    value: 'web',
                },
                {
                    text: 'MOBILE',
                    value: 'mobile',
                },
            ],
            onFilter: (value, record) => record.platform.indexOf(value) === 0

        },
        {
            title: 'Attempt Date',
            key: 'attempt',
            render: d => {
                let startDateIst = new Date(new Date(d.createdAt).getTime());
                startDateIst.setHours(startDateIst.getHours() + 5);
                startDateIst.setMinutes(startDateIst.getMinutes() + 30);
                startDateIst = moment(startDateIst);

                return d?.createdAt ? moment(d.createdAt).format('DD-MM-YYYY') : '--'
            },
        },
        {
            title: 'Start Time',
            key: 'start_time',
            render: d => {
                // let startDateIst = new Date( new Date(d.createdAt).getTime() );
                // 	startDateIst.setHours(startDateIst.getHours() + 5); 
                // 	startDateIst.setMinutes(startDateIst.getMinutes() + 30);
                // 	startDateIst = moment(startDateIst);

                return d?.createdAt ? moment(d.createdAt).format('hh:mm a') : '--'
            },
        },
        {
            title: 'End Time',
            key: 'start_time',
            render: d => d.progressStatus === 'completed' && d.submittedAt ? moment(d.submittedAt).format('hh:mm a') : '--',
        },
        {
            title: 'Status',
            key: 'status',
            render: d => <Tag color={d.progressStatus === 'in-progress' ? 'blue' : d.progressStatus === 'completed' ? 'green' : 'red'}>{_.toUpper(d?.progressStatus)}</Tag>
        },
        {
            title: 'Username',
            key: 'username',
            render: d => d?.userId?.username,
            ...filter('username')
        },
        {
            title: 'Contact',
            key: 'contact',
            render: d => d?.userId?.contact,
            ...filter('contact')
        },
        {
            title: 'Email',
            key: 'email',
            render: d => d?.userId?.email,
            ...filter('email')
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right',
            render: d => <Space>
                {d.progressStatus == 'completed' ?
                    <Tooltip title='Re-Attempt Test'>
                        <Button icon={<BackwardOutlined />} onClick={() => changeAttemptStatus(d._id, 'in-progress')}></Button>
                    </Tooltip>
                    :
                    null
                }
                {d.progressStatus == 'in-progress' ?
                    <Tooltip title='Submit'>
                        <Button icon={<ForwardOutlined />} onClick={() => changeAttemptStatus(d._id, 'completed')}></Button>
                    </Tooltip>
                    :
                    null
                }
                <Tooltip title='Delete'>
                    <Button icon={<DeleteOutlined />} onClick={() => changeAttemptStatus(d._id, 'absent')}></Button>
                </Tooltip>
            </Space>
        },

    ]

    return (
        <Row>
            <Col span={24}>
                <Table scroll={{ x: 1500 }} sticky columns={columns} loading={changeAttmptStatus === STATUS.FETCHING} dataSource={data.attempts} bordered
                    pagination={{ pageSize, page, position: ['topCenter', 'bottomCenter'], showSizeChanger: false }} onChange={e => changePage(e.current)}
                />
            </Col>
        </Row>
    )
}

const OfflineResultComponent = ({ testId, sections }) => {
    const [tableData, setTableData] = useState([]);
    const [curTab, setCurTab] = useState("1");
    const [deletePre, setDeletePre] = useState(true);
    const [editTableData, setEditTableData] = useState([]);
    const { offlineResultData, uplOfflineTestResultStatus, getOfflineTestResultStatus } = useSelector(s => ({ offlineResultData: s.test.offlineResultData, uplOfflineTestResultStatus: s.test.uplOfflineTestResultStatus, getOfflineTestResultStatus: s.test.getOfflineTestResultStatus }))
    const { allStudentRolls, attemptData, getPackageRollsStatus } = useSelector(s => ({ allStudentRolls: s.packages.allStudentRolls, getPackageRollsStatus: s.packages.getPackageRollsStatus, attemptData: s.test.testAttemptData }))
    const dispatch = useDispatch();

    const packageIds = useMemo(() => {
        return attemptData?.packages?.map(p => p._id)
    }, [attemptData])

    const columns = useMemo(
        () => {
            const newCols = _.concat(
                {
                    title: 'Roll no',
                    dataIndex: 'roll',
                    key: 'roll'
                }, {
                title: 'Name',
                dataIndex: 'name',
                key: 'name'
            },
                {
                    title: 'Total Score',
                    dataIndex: 'totalMarks',
                    key: 'totalMarks'
                }, _.map(sections, s => {
                    const title = s.subjectRefId?.name.en;
                    return (
                        {
                            title: title,
                            dataIndex: s.subjectRefId._id,
                            key: s.subjectRefId._id,
                        }
                    )
                })
            )
            return newCols;
        }, [sections])

    const excelColumns = useMemo(
        () => {
            const newCols = _.concat(
                {
                    title: 'Roll no',
                    dataIndex: 'roll',
                    key: 'roll'
                },
                {
                    title: 'Total Score',
                    dataIndex: 'totalMarks',
                    key: 'totalMarks'
                }, _.map(sections, s => {
                    const title = s.subjectRefId?.name.en + "::" + s.subjectRefId._id;
                    return (
                        {
                            title: title,
                            dataIndex: title,
                            key: title,
                        }
                    )
                })
            )
            return newCols;
        }, [sections])

    const downloadExcelData = useMemo(() => {
        let newExcelDonloadData = _.map(excelColumns, c => ({ [c.title]: '' }));
        return newExcelDonloadData;
    }, [excelColumns])

    const tableExcelData = useMemo(() => {
        const curExcelData = _.map(offlineResultData, r => {
            const studentResult = r.studentResult;
            const rollNo = _.find(allStudentRolls, student => student.user._id === r.userId?._id)?.finalRoll || '';
            const otherCols = _.reduce(sections, (obj, s) => {
                const key = s.subjectRefId?.name.en + "::" + s.subjectRefId._id;
                const marks = _.find(studentResult?.sectionwiseStats, section => section.subjectRefId === s.subjectRefId._id);
                obj[key] = marks?.sectionScore;
                return obj;
            }, {});
            return ({ 'Roll no': rollNo, 'Total Score': studentResult?.totalScore, ...otherCols })
        });
        return curExcelData;
    }, [sections, offlineResultData, allStudentRolls])

    useEffect(() => {
        dispatch(getOfflineTestResult({ testId: testId }))
    }, [testId, dispatch])

    useEffect(() => {
        if (uplOfflineTestResultStatus !== STATUS.SUCCESS) return;
        dispatch(getOfflineTestResult({ testId: testId }))
        dispatch(resetUploadOfflineResultStatus())
        setCurTab("1");
        setEditTableData([]);
    }, [uplOfflineTestResultStatus, testId, dispatch])

    useEffect(() => {
        dispatch(getPackageRollsAction({ user: false, packageIds: packageIds }))
    }, [packageIds, dispatch])

    useEffect(() => {
        if (!offlineResultData) return;
        const newData = _.map(offlineResultData, r => {
            const studentResult = r.studentResult;
            const rollNo = _.find(allStudentRolls, student => student.user._id === r.userId?._id)?.finalRoll || '';
            const otherCols = _.reduce(sections, (obj, s) => {
                const key = s.subjectRefId._id;
                const marks = _.find(studentResult?.sectionwiseStats, section => section.subjectRefId === s.subjectRefId._id);
                obj[key] = marks?.sectionScore;
                return obj;
            }, {});
            return ({
                roll: rollNo,
                totalMarks: studentResult?.totalScore,
                name: r?.userId?.name || '',
                ...otherCols
            })
        });

        setTableData(newData);
    }, [offlineResultData, sections, allStudentRolls])

    const onExcelParserSave = (data) => {
        const removeEmptyData = _.filter(data, d => Object.values(d).join(''))
        const newResult = _.map(removeEmptyData, d => {
            d['totalMarks'] = d['Total Score'] || null;
            d['roll'] = d['Roll no'] || null;
            Object.keys(d).forEach(k => { d[k] = d[k] && parseFloat(d[k]) ? parseFloat(d[k]) : ''; })
            return _.omit(d, ['Total Score', 'Roll no']);
        })
        setEditTableData(newResult);
    }

    const convertFile = (e) => {
        sheetToJSON(e.target.files, onExcelParserSave)
    }

    const handleUpload = () => {
        let data = {};
        data['testId'] = testId;
        data['attemptData'] = editTableData;
        data['mode'] = sections.length > 0 ? "SUBJECT_WISE" : 'OVERALL';
        data['delete'] = deletePre;
        dispatch(uploadOfflineTestResult(data));
    }

    return (
        <div>
            <Tabs activeKey={curTab} onChange={(k) => setCurTab(k)}>
                <TabPane tab="Previous upload" key="1">
                    <Card loading={getOfflineTestResultStatus === STATUS.FETCHING || getPackageRollsStatus === STATUS.FETCHING} >
                        <div>
                            <Row style={{ justifyContent: 'flex-end', margin: '10px' }}>
                                <Col>
                                    <ExportExcel type='primary' data={tableExcelData} filename='offlineTestResult' />
                                </Col>
                            </Row>
                            <div style={{ overflow: 'scroll' }}>
                                <Table columns={columns} dataSource={tableData} bordered pagination={false} />
                            </div>
                        </div>
                    </Card>
                </TabPane>
                <TabPane tab="Upload new" key="2">
                    <Card loading={uplOfflineTestResultStatus === STATUS.FETCHING} >
                        <div>
                            {
                                tableData.length > 0 &&
                                <div style={{ margin: '20px 0px', textAlign: 'center', fontWeight: 'bold', backgroundColor: "#bababa", padding: "10px" }}>
                                    {tableData.length} offline results have been already added to this test
                                </div>
                            }

                            <Row style={{ margin: '20px 0px', justifyContent: 'space-between' }}>
                                <Col>
                                    <div style={{ marginBottom: '10px' }}>
                                        <Checkbox checked={deletePre} onChange={e => setDeletePre(e.target.checked)}>Delete all offline and upload</Checkbox>
                                    </div>
                                    <Button disabled={!editTableData?.length} type='primary' onClick={handleUpload}>Save</Button>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col>
                                            <Row>
                                                <Col span={10}>
                                                    <div>Download Template</div>
                                                </Col>
                                                <Col span={10}>
                                                    <ExportExcel data={downloadExcelData} filename='offlineTestResult' />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col>
                                            <Row>
                                                <Col style={{ marginRight: '15px' }}>
                                                    <div>Upload Excel</div>
                                                </Col>
                                                <Col>
                                                    <Input type="file" accept=".xlsx, .xls, .csv" onChange={convertFile} />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            {
                                editTableData?.length > 0 &&
                                <div style={{ overflow: 'scroll' }}>
                                    <Table columns={excelColumns} dataSource={editTableData} bordered pagination={false} />
                                </div>
                            }
                        </div>
                    </Card>
                </TabPane>
            </Tabs>
        </div>
    )
}

const ResultDataComponent = ({ data }) => {
    const dispatch = useDispatch()

    const { resultCalculateStatus, unpublishResultStatus } = useSelector(state => ({
        resultCalculateStatus: state.test.resultCalculateStatus,
        unpublishResultStatus: state.test.updateTestStatus
    }))

    const printPaper = (printData) => {
        printHelper(PRINT_TYPE.STUDENTS_RESULT_TABLE, printData)
    }

    console.log('data123', data,
        data.attempts.map(d => {
            let subjects = data.sections.map(s => {
                let data = _.find(d.studentResult.sectionwiseStats, sec => sec.sectionId == s._id)
                return ({
                    [s?.subjectRefId?.name?.en + 'total']: data?.sectionScore,
                    correctQue: data?.correctNo,
                    correctMarks: data?.correctMarks,
                    incorrectQue: data?.incorrectNo,
                    incorrectMarks: data?.incorrectMarks
                })
            })
            subjects = _.reduce(subjects, (result, current) => ({ ...result, ...current }))
            console.log('subjects', subjects)
            return ({
                name: d.userId.name,
                total: d.studentResult?.totalScore,
                rank: data?.testOption?.rankSetting ? d?.result?.continuousRank : d?.studentResult?.skippedRank,
                percentile: d?.studentResult?.percentile,
                customRank: data?.testOption?.fakeRanks ? d.studentResult.fakeRank : null,
                customPercentile: d?.studentResult?.fakePercentile
            })
        }),
    )

    // console.log('data', data, 
    //     data.attempts.map(d => {
    //         let subjects = data.sections.map(s => {
    //             let data = _.find(d.studentResult.sectionwiseStats, sec => sec.sectionId == s._id)
    //             return({[s?.subjectRefId?.name?.en+'total']:data?.sectionScore, correctQue:data?.correctNo, 
    //                 correctMarks:data?.correctMarks, incorrectQue:data?.incorrectNo, incorrectMarks:data?.incorrectMarks
    //             })
    //         })
    //         subjects = _.reduce(subjects, (result, current) => ({...result, ...current}))
    //         console.log('subjects', subjects)
    //         return ({name:d.userId.name, total:d.studentResult?.totalScore, rank:data?.testOption?.rankSetting ?  d?.result?.continuousRank : d?.studentResult?.skippedRank,
    //             percentile:d?.studentResult?.percentile, customRank:data?.testOption?.fakeRanks ?  d.studentResult.fakeRank : null,
    //             customPercentile:d?.studentResult?.fakePercentile
    //         })
    //     }),  
    // )

    const calculateResult = () => {
        ConfirmAlert(() => dispatch(resultCalculateAction({ testId: data._id })), 'Are you sure?', null, resultCalculateStatus === STATUS.FETCHING)
    }

    const unpublishResult = () => {
        ConfirmAlert(() => dispatch(updateTestAction({ testId: data._id, resultPublished: false })), 'Test will be unpublished?', null, unpublishResultStatus === STATUS.FETCHING)
    }
    const downloadExcel = (id) => {
        window.open(BaseURL + URIS.TEST_RESULT_EXCEL + "?testId=" + id)
    }

    return (
        <div style={{ padding: '10px' }}>
            <Row>
                <Col span={12}>
                    <div>
                        {data?.resultPublished ?
                            <Button style={{ marginTop: '5px', backgroundColor: '#e5342e', color: 'white', border: 'white' }} shape="round" size='small' icon={<SyncOutlined />}
                                onClick={calculateResult}
                            >
                                Recalculate Result
                            </Button>
                            :
                            <Button style={{ marginTop: '5px', backgroundColor: '#3498DB', color: 'white', border: 'white' }} shape="round" size='small'
                                onClick={calculateResult}
                            >
                                Calculate Result
                            </Button>
                        }
                        &nbsp;&nbsp;
                        {/* {data?.resultPublished && data?.groupId ?
                            <Button style={{marginTop: '5px', backgroundColor: '#2ebee7', color: 'white', border: 'white'}} shape="round" size='small' icon={<ReconciliationOutlined />}>
                                Cummulative Result
                            </Button>
                        : null}&nbsp;&nbsp; */}
                        {data?.resultPublished ?
                            <Button style={{ marginTop: '5px', backgroundColor: '#ee682f', color: 'white', border: 'white' }}
                                shape="round" size='small' icon={<WifiOutlined />}
                                onClick={() => unpublishResult()}
                            >
                                Unpublish Result
                            </Button>
                            : null}&nbsp;&nbsp;
                        {/* <Button style={{marginTop: '5px', backgroundColor: 'orange', color: 'white', border: 'white'}} shape="round" size='small' icon={<MessageOutlined />}>
                            SMS Result
                        </Button> */}
                    </div>
                </Col>
                <Col span={12}>
                    <div style={{ float: 'right' }}>
                        <Space>
                            <Button style={{ marginTop: '5px', backgroundColor: '#5cb85c', color: 'white', border: 'white' }} onClick={() => printPaper(data)} shape="round" size='small' icon={<PrinterOutlined />}>
                                Print Result
                            </Button>&nbsp;&nbsp;
                            <Button style={{ marginTop: '5px', backgroundColor: '#5cb85c', color: 'white', border: 'white' }} onClick={() => downloadExcel(data._id)} shape="round" size='small' icon={<DownloadIcon />}>
                                Expory Excel
                            </Button>&nbsp;&nbsp;
                            {/* <ExportExcel data={[]} filename='ResultExcel' title='Download Excel' size='small'/> */}
                        </Space>

                        {/*<Button style={{marginTop: '5px', }} type='primary' shape="round" size='small' icon={<ContainerOutlined />}>
                            Export Student Response Excel
                        </Button>&nbsp;&nbsp;*/}
                        {/*<Button style={{marginTop: '5px', backgroundColor: 'orange', color: 'white', border: 'white'}} shape="round" size='small' icon={<ProfileOutlined/>} >
                            Export Excel
                        </Button>*/}
                    </div>
                </Col>
            </Row>
            <br />
            <Row>
                <Col span={24}>
                    <ResultDataTable data={data} />
                </Col>
            </Row>
        </div>
    )
}

