import { CloseOutlined, EditOutlined, EyeOutlined, LinkOutlined, PlusOutlined, SelectOutlined, UserAddOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Popconfirm, Select, Space, Table, Tag, Tooltip } from 'antd'
import React, { useMemo } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { STATUS } from '../../Constants'
import { getAnswerSheetsAction, getAssignmentsAction } from '../../redux/reducers/assignments'
import { AddAssignment } from './AddAssignment'
import _, { chain, orderBy } from 'lodash'
import { resetTagsListdata } from '../../redux/reducers/packages'
import Text from 'antd/lib/typography/Text'
import { SelectTagsModal } from '../ManagePackages/SelectTagsModal'
import { TotalCountBox } from '../../components/TotalCountBox'
import { useHistory } from 'react-router'
import moment from 'moment'
import { SelectTeacherModal } from '../ManageCourses.js/SelectTeacherModal'
import { assignCourseTeacherAction, getCourseTeachersAction, removeCourseTeacherAction } from '../../redux/reducers/courses'

export const ManageAssignment = ( ) => {
    const dispatch = useDispatch()
    const history = useHistory()

    const {getAnswerSheetsStatus, answersheetsList, getAssignmentsStatus, assignmentsList, tagsList, configData, user, assignedTeachers} = useSelector((state) => ({
        getAssignmentsStatus:state.assignments.getAssignmentsStatus,
        assignmentsList:state.assignments.assignmentsList,
        getAnswerSheetsStatus:state.assignments.getAnswerSheetsStatus,
        answersheetsList:state.assignments.answersheetsList,
        configData: state.lmsConfig,
        user:state.user.user,
        assignedTeachers:state.course.courseSubjects || []
    }))

    const [showAddAssignmentDrawer, changeShowAddAssignmentDrawer] = useState()
    const [currentAssignment, changeCurrentAssingment] = useState()
    const [tagsModal, changeTagsModal] = useState()
    const [selectedTags, changeSelectedTags] = useState([])
    const [selectedExams, changeSelectedExams] = useState([])
    const [title, changeTitle] = useState([])
    const [teacherModal, openTeacherModal] = useState()

    useEffect(() => {
        dispatch(getAssignmentsAction())
        dispatch(getAnswerSheetsAction())

        return () => dispatch(resetTagsListdata())
    }, [dispatch])

    useEffect(() => {
        dispatch(getCourseTeachersAction())
      }, [dispatch])

    const addAssignment = () => {
        changeCurrentAssingment(null)
        changeShowAddAssignmentDrawer(!showAddAssignmentDrawer)
    }

    const editAssignment = (row) => {
        changeCurrentAssingment(row)
        changeShowAddAssignmentDrawer(!showAddAssignmentDrawer)
    }

    const _tagsModal = () => {
        changeTagsModal(!tagsModal)
    }

    const _selectTags = (data) => {
        changeSelectedTags(data)
    }

    const removeTag = (id) => {
        let data = selectedTags.map(t => t)
        _.remove(data,d => d._id === id)
        changeSelectedTags(data)
    }

    const selectExams = (exams) => {
        changeSelectedExams(exams)
    }

    const _changeTitle= (e) => {
        changeTitle(e.target.value)
    }

    const fetchAssinments = () => {
        let data = {exams:selectedExams, tags:selectedTags?.length ? selectedTags.map(t => t._id) : [] , title}
        dispatch(getAssignmentsAction(data))
    }

    const handleView = (data) => {
        history.push('/assignment/'+data._id)
    }

    const handleTeacherAssign = (assignment) => {
        if(assignment) changeCurrentAssingment(assignment)
        openTeacherModal(d => d ? null : assignment)
    }

    const handleTeacherSubmit = (teachers) => {
        console.log('teachers', teachers)

        let data = {
            teachers:teachers.map(t => t.user._id), 
            assignment: currentAssignment._id,
            assignedToIds:teachers.map(t => t.user._id),
            assignedBy:user._id,
          }
          dispatch(assignCourseTeacherAction(data))
    }

    console.log('assignmentsList', assignmentsList, assignedTeachers)
    const allAssignments = useMemo(() => {
        if(assignmentsList?.length)
        return _.chain(assignmentsList)
            .orderBy(['createdAt'], ['desc'])
            .map(d => ({...d, teachers:_.filter(assignedTeachers,t => t.assignment?._id === d._id)}))
            .value()
    }, [assignmentsList, assignedTeachers])

    const handleRemoveTeacher = (teacher) => {
        dispatch(removeCourseTeacherAction({doubtTeacherId:teacher._id}))
    }

    console.log('assignmentsList', allAssignments)
    return(
        <div>
            <CommonPageHeader title='Manage Assigment' extra={<Button size='large' onClick={addAssignment} icon={<PlusOutlined/>}>Add Assigment</Button>}/>
            <br/>
            <Card  loading={ getAnswerSheetsStatus === STATUS.FETCHING || configData.defaultDataStatus === STATUS.FETCHING}>
                {configData.defaultDataStatus === STATUS.SUCCESS ? 
                    <>
                        <Form layout='vertical'>
                            <div style={{marginBottom:'10px'}}>
                                <Text style={{fontSize:'16px', fontWeight:'bold', color:'#3498DB'}}>Filters</Text>
                            </div>
                            <Space size='large' wrap>
                                <Form.Item label='Title' style={{minWidth:'300px'}}>
                                    <Input onChange={_changeTitle} placeholder='Title'/>
                                </Form.Item>
                                <Form.Item label='Select Exams'>
                                    <Select placeholder='Select' mode='multiple' onChange={selectExams} style={{minWidth:'300px'}}>
                                        {configData.defaultData.exams?.length ?
                                            configData.defaultData.exams.map(e =>
                                                <Select.Option key={e._id} value={e._id}>{e.name?.en}</Select.Option>
                                            )
                                            :
                                            null
                                        }         
                                    </Select>
                                </Form.Item>
                                <Form.Item label='Select Tags'>
                                    <Space wrap style={{maxWidth:'400px'}} size={5}>
                                        {selectedTags.length ? selectedTags.map(tag => <Tag key={tag._id} closable onClose={() => removeTag(tag._id)}>{tag.name}</Tag>) : null}
                                        <Button onClick={_tagsModal} type='primary' ghost icon={<SelectOutlined />}>Select Tags</Button>
                                    </Space>
                                </Form.Item>
                                <Form.Item>
                                    <br/>
                                    <Button onClick={fetchAssinments}>Apply</Button>
                                </Form.Item>
                            </Space>
                        </Form>
                        <br/>
                        <TotalCountBox count={assignmentsList?.length} title='Assignments' />
                        <br/>
                        {getAnswerSheetsStatus === STATUS.SUCCESS?
                            <Table bordered scroll={{x:1800}} dataSource={allAssignments} loading={getAssignmentsStatus === STATUS.FETCHING} pagination={{position:['bottomCenter']}}>
                                <Table.Column title={<b>Title</b>} fixed='left' dataIndex='title' key='title'></Table.Column>
                                <Table.Column title={<b>Description</b>} dataIndex='description' key='description'></Table.Column>
                                <Table.Column title={<b>Question Paper</b>} dataIndex='questionPaper' key='questionPaper'
                                    render={(d) =>
                                        d && <a href={d} target='_black'><LinkOutlined/>attachment</a>
                                    }
                                ></Table.Column>
                                <Table.Column title={<b>Answer Sheet</b>} key='answerSheet'
                                    render={(d, obj) => {
                                            return d?.answerSheet ? 
                                                <a href={d.answerSheet.file} target='_black'><LinkOutlined/>{d.answerSheet.title}</a> 
                                                    : obj?.localAnswerSheet ? 
                                                        <a href={obj.localAnswerSheet} target='_black'><LinkOutlined/>AnswerSheet</a> 
                                                        : "-" 
                                        }
                                    }
                                ></Table.Column>
                                 <Table.Column title={<b>Modal Answer Sheet</b>} dataIndex='modalAnswerSheet' key='modalAnswerSheet'
                                    render={(d) =>
                                        d && <a href={d} target='_black'><LinkOutlined/>Modal Answer Sheet</a>
                                    }
                                ></Table.Column>
                                <Table.Column title={<b>Instructions</b>} dataIndex='instructions' key='instructions'
                                    render={(d) => {
                                            return d && <div>{d?.name?.en}</div>
                                        }
                                    }
                                ></Table.Column>
                                <Table.Column title={<b>Exams</b>} dataIndex='exams' key='exams'
                                    render={(exams) =>
                                        exams?.length ? 
                                        <Space wrap>
                                            {exams.map(exam => <Tag key={exam._id}>{exam.name?.en}</Tag>)}
                                        </Space> : '-'
                                    }
                                ></Table.Column>
                                <Table.Column title={<b>Tags</b>} dataIndex='tags' key='tags'
                                    render={(tags) =>
                                        tags?.length ? 
                                        <Space wrap>
                                            {tags.map(tag => <Tag key={tag._id}>{tag.name}</Tag>)}
                                        </Space> : '-'
                                    }
                                ></Table.Column>
                                <Table.Column title={<b>Created On</b>} dataIndex='createdAt'
                                    render={(d) => moment(d).format('l')}
                                ></Table.Column>
                                <Table.Column title={<b>Teachers</b>} dataIndex='teachers'
                                    render={(array) => 
                                        <Space wrap>
                                            {console.log('arry', array)}
                                            {array?.length ? 
                                                array.map(t => 
                                                    <Popconfirm title='Sure?' onConfirm={() => handleRemoveTeacher(t)} okText='Remove'>
                                                        <Tooltip title='Remove' placement='bottom' >
                                                            <Tag style={{cursor:'pointer'}} icon={<CloseOutlined />}>{t.assignedTo?.name}</Tag>
                                                        </Tooltip>
                                                    </Popconfirm>
                                                )
                                                :
                                                null
                                            }
                                        </Space>
                                    }
                                ></Table.Column>
                                <Table.Column fixed='right' title={<b>Actions</b>} dataIndex='actions' key='actions'
                                    render={(d, row) => 
                                        <Space direction='vertical'>
                                            <Button size='small' onClick={() => handleView(row)} icon={<EyeOutlined />}>Submissions</Button>
                                            <Button size='small' onClick={() => editAssignment(row)} icon={<EditOutlined/>}>Edit</Button>
                                            <Button size='small' onClick={() => handleTeacherAssign(row)} icon={<UserAddOutlined />}>Assign Teacher</Button>
                                        </Space>
                                    }
                                ></Table.Column>
                            </Table>
                            :
                            <div style={{fontSize:'18px', color:'#AEB6BF'}}>Something went wrong</div>
                        }
                        {showAddAssignmentDrawer ? 
                            <AddAssignment
                                currentAssignment={currentAssignment} 
                                tagsList={tagsList}
                                closeDrawer={addAssignment} 
                                visible={showAddAssignmentDrawer}
                                answersheetsList={answersheetsList}
                            /> : null 
                        }
                    </>
                    : null
                }
            </Card>
            {teacherModal && 
                <SelectTeacherModal 
                    teachers={teacherModal.teachers?.length ? _.filter(teacherModal.teachers,t => t.assignedTo).map(t => t.assignedTo) : []} 
                    disabled 
                    onSubmit={handleTeacherSubmit} 
                    visible={teacherModal} 
                    closeModal={handleTeacherAssign} 
                />
            }
            {tagsModal && <SelectTagsModal visible={tagsModal} selectedData={selectedTags} closeModal={_tagsModal} submitTags={_selectTags}/>}
        </div>
    )
}