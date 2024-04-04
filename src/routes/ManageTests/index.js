import { CheckSquareOutlined, CopyOutlined, DeleteOutlined, PlusOutlined, EditOutlined, InfoCircleOutlined, CloseCircleOutlined, ExportOutlined, FileDoneOutlined, MessageOutlined, ProfileOutlined, QuestionCircleOutlined, WarningOutlined, UserAddOutlined, CloseOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, List, Popover, Select, Table, Tag, Row, Col, Tooltip, Space, Popconfirm } from 'antd'
import Text from 'antd/lib/typography/Text'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { STATUS } from '../../Constants'
import { ConfirmAlert } from '../../Constants/CommonAlerts'
import { getAllTestsAction, removeTestAction, resetRemoveTest } from '../../redux/reducers/test'
import _ from 'lodash'
import { CopyTestModal } from './CopyTestModal'
import { formatNumberFloatInteger } from '../../utils/QuestionTypeHelper'
import { SelectTagsModal } from '../ManagePackages/SelectTagsModal'
import moment from 'moment'
import { bilingualText, useQueryParams } from '../../utils/FileHelper'
import { TotalCountBox } from '../../components/TotalCountBox'
import { SelectTeacherModal } from '../ManageCourses.js/SelectTeacherModal'
import { assignCourseTeacherAction, getCourseTeachersAction, removeCourseTeacherAction } from '../../redux/reducers/courses'

export const ManageTests = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const params = useParams()
    const { getAllTestsStatus, testsList, removeTestStatus, allTestData, copyTestStatus, user, getCourseTeachersStatus, courseSubjects,
        assignCourseTeacherStatus,
    } = useSelector((state) => ({
        getAllTestsStatus: state.test.getAllTestsStatus,
        testsList: state.test.testsList,
        allTestData: state.test,
        removeTestStatus: state.test.removeTestStatus,
        copyTestStatus: state.test.copyTestStatus,
        user: state.user.user,
        getCourseTeachersStatus: state.course.getCourseTeachersStatus,
        courseSubjects: state.course.courseSubjects || [],
        assignCourseTeacherStatus: state.course.assignCourseTeacherStatus
    }))

    const [testNameType, changeTestNameType] = useState('phrase')
    const [testName, changeTestName] = useState('')
    const [popupVisible, changePopupVisible] = useState()
    const [dataSource, setDataSource] = useState()
    const [copyTestModal, changeCopyTestModal] = useState(false)
    const [testUsage, setTestUsage] = useState(null)
    const [selectedTags, changeSelectedTags] = useState([])
    const [tagsModal, changeTagsModal] = useState(false)
    const [currentTest, setCurrentTest] = useState(false)

    const [teacherModal, openTeacherModal] = useState()

    const query = useQueryParams()
    const testType = query.get('testUsageType')
    const searchName = query.get('search_text')

    useEffect(() => {
        if (assignCourseTeacherStatus === STATUS.SUCCESS)
            setCurrentTest()
    }, [assignCourseTeacherStatus])

    useEffect(() => {
        if (testType || searchName) {
            setTestUsage(testType)
            changeTestName(searchName)
        }
    }, [searchName, testType])

    useEffect(() => {
        dispatch(getCourseTeachersAction())
    }, [dispatch])

    // useEffect(() => {
    //     if (params.page || removeTestStatus === STATUS.SUCCESS || copyTestStatus === STATUS.SUCCESS) {
    //         dispatch(getAllTestsAction({ paginate: true, page: params.page, limit: 20 }))
    //     }
    // }, [dispatch, params.page, removeTestStatus, copyTestStatus])

    useEffect(() => {
        if (getAllTestsStatus === STATUS.SUCCESS && getCourseTeachersStatus === STATUS.SUCCESS) {
            let data = { ...testsList, docs: testsList.docs.map(t => ({ ...t, teachers: _.filter(courseSubjects, sub => sub.test?._id === t._id) })) }
            setDataSource(data)
        }
    }, [getAllTestsStatus, testsList, courseSubjects, getCourseTeachersStatus])

    // useEffect(() => {
    //     searchTest()
    // }, [selectedTags])

    const updateTest = (test) => {
        history.push(`/update-test/${test._id}/1`)
        changePopupVisible(false)
    }

    const removeTest = (test) => {
        changePopupVisible(false)
        ConfirmAlert(() => dispatch(removeTestAction({ testId: test._id })), 'Sure?')
    }

    const uploadAnswerKeys = (test) => {
        history.push('/answer-keys/' + test._id)
    }

    const testQuestions = (test) => {
        history.push('/test-questions/' + test._id)
        changePopupVisible(false)
    }

    const exportTest = (test) => {
        history.push('/export-test-paper/' + test._id)
        changePopupVisible(false)
    }

    const StudentsAndResult = (test) => {
        history.push('/students-and-result/' + test._id)
    }
    const _copyTestModal = (test) => {
        changeCopyTestModal(d => d ? null : test)
        changePopupVisible(false)
    }

    const handleAssignTeacher = (test) => {
        if (test) setCurrentTest(test)

        openTeacherModal(d => d ? null : test)
        changePopupVisible(false)
    }

    const actionsList = [
        { title: 'Edit Test', icon: <EditOutlined />, callback: updateTest },
        { title: 'View Added Questions', icon: <QuestionCircleOutlined />, callback: testQuestions },
        { title: 'Export Test', icon: <ExportOutlined />, callback: exportTest },
        { title: 'Students and Result', icon: <ProfileOutlined />, callback: StudentsAndResult },
        { title: 'Answer Keys', icon: <CheckSquareOutlined />, callback: uploadAnswerKeys },
        { title: 'Assign Teacher', icon: <UserAddOutlined />, callback: handleAssignTeacher },
        // {title:'Reported Questions', icon:<WarningOutlined />, callback:() => console.log('hello')},
        // {title:'Correction History', icon:<FileDoneOutlined />, callback:() => console.log('hello')},
        // {title:'SMS Result', icon:<MessageOutlined />, callback:() => console.log('hello')},
        { title: 'Copy Test', icon: <CopyOutlined />, callback: _copyTestModal },
        { title: 'Delete', icon: <DeleteOutlined />, callback: removeTest }
    ]

    const openActions = (id) => {
        changePopupVisible(id === popupVisible ? false : id)
    }

    const changePage = (e) => {
        searchTest(e.current)
    }

    const _changeTestName = (e) => {
        changeTestName(e.target.value)
    }

    const _changeTestNameType = (e) => {
        changeTestNameType(e)
    }

    const searchTest = (page) => {
        // let data = { paginate: true, page: params.page, limit: 20, search_type: testNameType, search_text: testName, testUsageType: testUsage, tags: _.map(selectedTags, s => s._id) }
        history.push({ pathname: `/manage-tests/${page || 1}`, search: `?testUsageType=${testUsage || ''}&search_text=${testName || ''}` })
        // dispatch(getAllTestsAction(data))
    }

    const clearData = () => {
        setTestUsage()
        changeTestName()
        changeSelectedTags()
        history.push({ pathname: `/manage-tests/1` })
        // dispatch(getAllTestsAction({ paginate: true, page: params.page, limit: 20 }))
    }

    useEffect(() => {
        if (params.page || removeTestStatus === STATUS.SUCCESS || copyTestStatus === STATUS.SUCCESS) {
            const data = { paginate: true, page: params.page, limit: 20, search_type: testNameType, search_text: searchName, testUsageType: testType, tags: _.map(selectedTags, s => s._id) }
            dispatch(getAllTestsAction(data))
        }
    }, [testType, searchName, params, testNameType, selectedTags, dispatch, removeTestStatus, copyTestStatus])

    const handleTeachersAssign = (teachers) => {
        let data = {
            teachers: teachers.map(t => t.user._id),
            test: currentTest._id,
            assignedToIds: teachers.map(t => t.user._id),
            assignedBy: user._id,
        }
        dispatch(assignCourseTeacherAction(data))
    }

    const handleRemoveTeacher = (teacher) => {
        dispatch(removeCourseTeacherAction({ doubtTeacherId: teacher._id }))
    }

    const { Option } = Select
    return (
        <div>
            <CommonPageHeader title='Manage Tests' />
            <br />
            <Card>
                <Row>
                    <Col sm={4}>
                        <Select allowClear value={testUsage} placeholder='Select Test Usage' style={{ width: 200 }} onChange={(e) => setTestUsage(e)}>
                            <Option value='testSeries'>Test Series</Option>
                            <Option value='mock'>Mock</Option>
                            <Option value='previousYear'>Previous Year</Option>
                        </Select>
                    </Col>
                    <Col sm={6} style={{ marginLeft: '40px' }}>
                        <Input onChange={_changeTestName} value={testName} placeholder='Search test name' defaultValue="" /> &nbsp;&nbsp;&nbsp;
                    </Col>
                    <Col sm={6} style={{ marginLeft: '10px' }}>
                        <Button onClick={() => searchTest()}>Apply</Button>
                        <Button style={{ marginLeft: '10px' }} icon={<CloseCircleOutlined />} onClick={clearData}>Clear</Button>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <Form.Item>
                            {_.map(selectedTags, s => {
                                return (
                                    s &&
                                    <Tag
                                        key={s._id}
                                        style={{ fontSize: '14px', padding: '5px 10px', marginTop: '5px' }}
                                        color="blue"
                                        closable
                                        onClose={() => changeSelectedTags(_.filter(selectedTags, pack => pack._id !== s._id))}
                                    >
                                        {s.name}
                                    </Tag>
                                )
                            }
                            )}
                            <Tag style={{ fontSize: '14px', cursor: 'pointer', padding: '5px 10px', marginTop: '5px' }} color='#348a7a' onClick={() => changeTagsModal(true)}>SEARCH BY TAGS</Tag>
                        </Form.Item>
                    </Col>
                    {tagsModal ?
                        <SelectTagsModal selectedData={selectedTags || []} visible={tagsModal} closeModal={() => changeTagsModal(false)} submitTags={(data) => (changeSelectedTags(data), changeTagsModal(false))} />
                        : null}
                </Row>
                <br />
                <TotalCountBox count={dataSource ? dataSource.total : 0} title={'Tests'} />
                {/*<Form layout='vertical' onFinish={searchTest}>
                    <Form.Item label={<b>Search Test</b>}>
                        <Input.Group compact>
                            { <Select defaultValue={testNameType} onChange={_changeTestNameType}>
                                <Select.Option value="phrase">Phrase</Select.Option>
                                <Select.Option value="keywords">Keywords</Select.Option>
                            </Select> }
                            <Input style={{ width: '500px' }} onChange={_changeTestName} placeholder='Test Name' defaultValue="" />&nbsp;&nbsp;
                            <Button type='primary' htmlType='submit'>Fetch</Button>
                        </Input.Group>
                    </Form.Item>
                </Form>*/}
                <Table
                    loading={getAllTestsStatus === STATUS.FETCHING}
                    bordered
                    dataSource={dataSource ?
                        _.orderBy(_.compact(_.concat(_.filter(dataSource.docs, d => d._id != allTestData?.recentTest?._id), allTestData?.recentTest)), ['recentStatus'])
                        : []
                    }
                    pagination={{ position: ['bottomCenter', 'topCenter'], pageSize: 20, current: parseInt(params.page), showSizeChanger: false, total: dataSource?.total }}
                    onChange={changePage}
                >
                    <Table.Column title='Ref Id' dataIndex='referenceId' key='referenceId'
                        render={id => <Text>{id}</Text>}
                    ></Table.Column>
                    <Table.Column title='Name' dataIndex='name' key='name' defaultSortOrder='descent'
                        // sorter={(a,b) => console.log('a', a)}
                        render={(d, data) =>
                            <div>
                                <Text>{bilingualText(d)}</Text><br />
                                {data?.recentStatus ? <Tag color='#108ee9' style={{ fontSize: '10px' }}>RECENTLY VISITED</Tag> : null}
                            </div>
                        }
                    ></Table.Column>
                    <Table.Column title='Platform' dataIndex='testType' key='testType'></Table.Column>
                    <Table.Column title='Time Duration (min)' dataIndex='totalTime' key='time'></Table.Column>
                    <Table.Column title='Number of questions' dataIndex='queCont' key='queCont'
                        // sorter={(a,b) => _.flattenDeep(a.sections.map(sec => sec.questions)).length - _.flattenDeep(b.sections.map(sec => sec.questions)).length}
                        render={(d, test) => <Text>{test.sections?.length ? _.flattenDeep(test.sections.map(sec => sec.questions)).length : 0}</Text>}
                    ></Table.Column>
                    <Table.Column title='Created At' dataIndex='createdAt' key='createdAt'
                        render={(d, test) => <Text>{moment(d).format('DD/MM/YYYY')}</Text>}
                    ></Table.Column>
                    <Table.Column title='Teachers' dataIndex='teachers' key='teachers'
                        render={(array) =>
                            <Space wrap>
                                {array?.map(t =>
                                    <Popconfirm key={t._id} title='Sure?' onConfirm={() => handleRemoveTeacher(t)} okText='Remove'>
                                        <Tooltip title='Remove' placement='bottom' >
                                            <Tag style={{ cursor: 'pointer' }} icon={<CloseOutlined />}>{t.assignedTo?.name}</Tag>
                                        </Tooltip>
                                    </Popconfirm>
                                )}
                            </Space>
                        }
                    ></Table.Column>
                    <Table.Column title='Free Test' dataIndex='isFree' key='isFree'
                        render={d => d && <Tag color={'green'}>Free</Tag>}
                    ></Table.Column>

                    {/* <Table.Column title='Start Date' dataIndex='startData' key='startData'></Table.Column> */}
                    <Table.Column title='Status' key='status'
                        render={(d) => {
                            let testObject = d
                            return (
                                <div>
                                    <Row style={{ padding: '3px' }}>
                                        <Col>{testObject?.visibility ? <Tag color='green'>Visible To Student</Tag> : <Tag color='red'>Not Visible To Student</Tag>}</Col>
                                    </Row>
                                    <Row style={{ padding: '3px' }}>
                                        <Col>{testObject.testReady ? <Tag color='green'>Test Ready</Tag> : <Tag color='red'>Not Ready</Tag>}</Col>
                                    </Row>
                                    <Row style={{ padding: '3px' }}>
                                        <Col>{testObject.testStarted ? <Tag color='green'>Started</Tag> : <Tag color='red'>Not Started</Tag>}</Col>
                                    </Row>
                                    <Row style={{ padding: '3px' }}>
                                        <Col>
                                            {testObject.resultPublished ?
                                                <div style={{ display: 'flex' }}>
                                                    <div>
                                                        <Tag color='green'>Result Published</Tag>&nbsp;
                                                    </div>
                                                    <div>
                                                        <Tooltip
                                                            placement="left"
                                                            title={
                                                                <div>
                                                                    <div>Average: <b>{formatNumberFloatInteger(testObject.testResult.averageScore)}</b></div>
                                                                    <div>Highest: <b>{formatNumberFloatInteger(testObject.testResult.highestScore)}</b></div>
                                                                    <div>Lowest: <b>{formatNumberFloatInteger(testObject.testResult.lowestScore)}</b></div>
                                                                </div>
                                                            }
                                                        >
                                                            <InfoCircleOutlined />
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                                :
                                                <Tag color='red'>Result Not Published</Tag>
                                            }
                                        </Col>
                                    </Row>
                                    <Row style={{ padding: '3px' }}>
                                        <Col>
                                            <div style={{ display: 'flex' }}>
                                                <div>
                                                    {testObject.allAnswersAvailable ? <Tag color='green'>Answer Keys Added</Tag> : <Tag color='red'>Answer Keys Not Added</Tag>}&nbsp;&nbsp;
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            )
                        }}
                    ></Table.Column>
                    <Table.Column title='Actions' dataIndex='actions' key='actions'
                        render={(d, test) => (
                            <Popover trigger="click" onVisibleChange={() => openActions(test._id)} placement='bottom' style={{ padding: 0 }} visible={test._id === popupVisible}
                                content={
                                    <List size='small' style={{ padding: '0' }} dataSource={actionsList}
                                        renderItem={item =>
                                            <List.Item className='hover-list-item' onClick={() => item.callback(test)} style={{ cursor: 'pointer', padding: 5 }}>
                                                {item.icon}&nbsp; {item.title}
                                            </List.Item>
                                        }
                                    />
                                }
                            >
                                <Button>Actions</Button>
                            </Popover>
                        )}
                    ></Table.Column>
                </Table>
            </Card>
            {teacherModal ?
                <SelectTeacherModal
                    disabled
                    teachers={teacherModal.teachers?.length ? _.filter(teacherModal.teachers, t => t.assignedTo).map(t => t.assignedTo) : []}
                    visible={teacherModal}
                    closeModal={handleAssignTeacher}
                    onSubmit={handleTeachersAssign}
                />
                : null
            }
            {copyTestModal ? <CopyTestModal visible={copyTestModal} test={copyTestModal} closeModal={_copyTestModal} /> : null}
        </div>
    )
} 