import { CopyOutlined, DeleteTwoTone, MinusOutlined, PlusOutlined, UnorderedListOutlined, UserSwitchOutlined } from '@ant-design/icons'
import { Button, Card, Col, Empty, Form, Input, InputNumber, Row, Select, Space, Switch, Table, Tooltip } from 'antd'
import React, { useEffect } from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import { addTestSubjectsAction } from '../../redux/reducers/test'
import { QuestionTypeNames } from '../../utils/QuestionTypeHelper'
import { CurrentTestContext } from './AddTest'
import { QueTypeOrderingModal } from './QueTypeOrderingModal'
import { SubjectOrderingModal } from './SubjectOrderingModal'
import _, { orderBy } from 'lodash'
import Text from 'antd/lib/typography/Text'
import { ConfirmAlert } from '../../Constants/CommonAlerts'
import { AssignQAQCModal } from './AssignQAQCModal'

export const AddSubjectToTest = () => {

    const dispatch = useDispatch()
    const currentTest = useContext(CurrentTestContext)

    const {configData, addTestSubjectStatus, getTestStatus} = useSelector((state) => ({
        configData:state.lmsConfig,
        addTestSubjectStatus:state.test.addTestSubjectStatus,
        getTestStatus:state.test.getTestStatus
    }))

    const defaultDataSource = [
            {maxMarks:null, numberOfQuestions:null, order:1, subjectRefId:null, time:null,
                questionTypeGroup:[{markingScheme:{correct:null, incorrect:null}, noOfQuestions:null, order:1, partialMarking:null, type:null}]
            }
        ]

    let [subjects, setSubjects] = useState([]) 
    let [dataSource, setDataSource] = useState(defaultDataSource)
    let [queTypeOrderingModal, showQueTypeOrderingModal] = useState(false)
    let [subjOrderingModal, showSubjOrderingModal] = useState(false)
    let [currentSubjIndx, setCurrentSubjIndx] = useState()
    let [currentQueTypes, setCurrentQueTypes] = useState()
    let [deleted, setDeleted] = useState([])
    let [assignQAQCModal, showAssignQAQCModal] = useState()

    useEffect(() => {
        if(getTestStatus === STATUS.SUCCESS && currentTest && currentTest.sections.length){
            let data = currentTest.sections.map(d => ({...d, sectionId:d._id, subjectRefId:d.subjectRefId?._id, questionTypeGroup:d.questionTypeGroup.map(grp => _.omit(grp, []))}))
            data = data.map(d => _.omit(d, ['questions', '_id']))
            data = orderBy(data, 'order');
            setDataSource(data)
        }
    }, [currentTest, getTestStatus])

    useEffect(() => {
        if(configData.defaultDataStatus === STATUS.SUCCESS){
            let defaultData = configData.defaultData
            if(defaultData)
                setSubjects(defaultData.subjects)
        }
    }, [configData.defaultData, configData.defaultDataStatus])

    const selectSubject = (indx, id) => {
        let data = [...dataSource]
        data[indx].subjectRefId = id
        setDataSource(data)
    }

    const changeNoOfQue = (indx, e) => {
        let data = [...dataSource]
        data[indx].numberOfQuestions = e.target.value
        setDataSource(data)
    }

    const addMoreQueType = (indx) => {
        let data = [...dataSource]
        data[indx].questionTypeGroup.push({markingScheme:{correct:null, incorrect:null}, noOfQuestions:null, 
            order:data[indx].questionTypeGroup.length + 1, partialMarking:null, type:null}
        )
        setDataSource(data)
    }

    const removeQueType = (indx, typeIndx) => {
        let data = [...dataSource]
        data[indx].questionTypeGroup.splice(typeIndx, 1)
        setDataSource(data)
    }

    const selectQueType = (indx, typeIndx, e) => {
        let data = [...dataSource]
        data[indx].questionTypeGroup[typeIndx].type = e
        setDataSource(data)
    }

    const changeTypeQueCount = (indx, typeIndx, e) => {
        let data = [...dataSource]
        data[indx].questionTypeGroup[typeIndx].noOfQuestions = e.target.value
        setDataSource(data)
    }

    const changeMarkingScheme = (indx, typeIndx, e) => {
        let data = [...dataSource]
        data[indx].questionTypeGroup[typeIndx].markingScheme = {...data[indx].questionTypeGroup[typeIndx].markingScheme, correct:e.target.value}
        setDataSource(data)
    }

    const changeNegMarks = (indx, typeIndx, e) => {
        let data = [...dataSource]
        data[indx].questionTypeGroup[typeIndx].markingScheme = {...data[indx].questionTypeGroup[typeIndx].markingScheme, incorrect:e.target.value}
        setDataSource(data)
    }

    const changePartialMarking = (indx, typeIndx, e) => {
        let data = [...dataSource]
        data[indx].questionTypeGroup[typeIndx].partialMarking = e
        setDataSource(data)
    }

    const changeQueTypeOrderModal = (indx) => {
        let data = [...dataSource]
        setCurrentSubjIndx(indx)
        setCurrentQueTypes(data[indx]?.questionTypeGroup)
        showQueTypeOrderingModal(!queTypeOrderingModal)
    }

    const changeOrder = (types) => {
        let data = [...dataSource]
        data[currentSubjIndx].questionTypeGroup = types.map((d, i) => ({...d, order:++i}))
        setDataSource(data)
        showQueTypeOrderingModal(false)
    }

    const addMoreSubject = () => {
        let data = [...dataSource]
        data.push({...defaultDataSource[0], order:dataSource.length + 1})
        setDataSource(data)
    }

    const removeSubject = (indx) => {
        // const removed = deleted
        let data = [...dataSource]
        if(data[indx].sectionId){
            data = {deleted:[data[indx].sectionId], testId:currentTest._id}
            dispatch(addTestSubjectsAction(data))
        }
        else{
            data.splice(indx, 1)
            setDataSource(data)
        }
        // if(data[indx].sectionId){
        //     removed.push(data[indx].sectionId)
        //     setDeleted(removed)
        // }
    }

    const changeSubjOrderModal = () => {
        setDataSource(dataSource)
        showSubjOrderingModal(!subjOrderingModal)
    }

    const changeSubjectOrder =(data) => {
        setDataSource(data)
        showSubjOrderingModal(false)
    }

    const saveSubjects = () => {
        let data = dataSource
        data = _.filter(data, d => d.subjectRefId).map(d => ({...d, questionTypeGroup:_.filter(d.questionTypeGroup,g => g.type && g.noOfQuestions)}))
        
        let edited = _.filter(data,d => d.sectionId).map(d => Object.assign(d, {maxMarks:_.reduce(d.questionTypeGroup,(sum, n) => {return sum + (n.markingScheme.correct * n.noOfQuestions)}, 0 )}))
        let added = _.filter(data,d => !d.sectionId).map(d => Object.assign(d, {maxMarks:_.reduce(d.questionTypeGroup,(sum, n) => {return sum + (n.markingScheme.correct * n.noOfQuestions)}, 0 )}))

        data = {added, edited, deleted, testId:currentTest._id}
        dispatch(addTestSubjectsAction(data))
    }

    const copyQuestionTypes = (sec) => {
        let groups = sec.questionTypeGroup
        let data = [...dataSource]
        data = data.map(d => ({...d, questionTypeGroup:_.cloneDeep(groups), numberOfQuestions:sec.numberOfQuestions}))
        setDataSource(data)
    }

    const assignQAQC = () => {
        showAssignQAQCModal(!assignQAQCModal)
    }

    const assignedMarks = _.chain(dataSource)
        .flatMap(d => d.questionTypeGroup)
        .flatMap(d => d.markingScheme.correct * d.noOfQuestions)
        .sum()
        .value()
    
    return(
        configData.defaultDataStatus === STATUS.SUCCESS ?
            <div>
                <br/>
                <Card bodyStyle={{padding:'10px'}} style={{marginBottom:'20px', border: assignedMarks > currentTest.maxMarks ? '1px solid red' : assignedMarks < currentTest.maxMarks ? '1px solid orange' : '1px solid green'}}>
                    <Space size={28}>
                        <Button type='primary' icon={<UnorderedListOutlined />} onClick={changeSubjOrderModal}>Change Subjects Order</Button>
                        <div><b>Maximum Marks:</b> {currentTest.maxMarks}</div>
                        <div>
                            <b>Total Marks Assigned:</b>&nbsp; 
                            <Text style={{fontWeight:'bold', fontSize:'16px'}} type={assignedMarks > currentTest.maxMarks ? 'danger' : assignedMarks < currentTest.maxMarks ? 'warning' : 'success'}>
                                {assignedMarks}
                            </Text>
                        </div>
                    </Space>
                </Card>
                <Table bordered  dataSource={dataSource} pagination={false}>
                    <Table.Column title={<b>Subject</b>} dataIndex="subjectRefId" key="subjectRefId" 
                        render={(d, a, indx) =>
                            <Select placeholder='Select Subject' value={d} style={{width:'100%'}} onChange={(e) => selectSubject(indx, e)}>
                                {subjects.map(sub => 
                                    <Select.Option key={sub._id} value={sub._id}>{sub.name.en}</Select.Option>
                                )}
                            </Select>
                        }
                    />
                    <Table.Column title={<b>Question Types</b>} dataIndex="questionTypeGroup" key="questionTypeGroup" 
                        render={(grps, section, indx) => {
                            const totalQuestionsAssigned = _.sum(grps.map(d => d.noOfQuestions ? parseInt(d.noOfQuestions) : 0))
                            return(
                                <div>
                                    <Card bodyStyle={{padding:'5px'}} style={{marginBottom:'10px'}}>
                                        <Row>
                                            <Col span={8}>
                                                <Form.Item label='Enter no of questions' style={{padding:0}} validateStatus={section.numberOfQuestions != totalQuestionsAssigned ? "error" : null}
                                                    help={totalQuestionsAssigned && section.numberOfQuestions != totalQuestionsAssigned ? "Number of questions mismatch" : null}
                                                >
                                                    <Input onChange={e => changeNoOfQue(indx, e)} min={0} value={section.numberOfQuestions} placeholder='Enter No Of Questions' type='number'/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={14} offset={2}>
                                                <Space style={{float:'right'}}>
                                                    <Button size='small' icon={<PlusOutlined/>} onClick={() => addMoreQueType(indx)}>Add More Que Types</Button>
                                                    <Button size='small' icon={<UnorderedListOutlined />} onClick={() => changeQueTypeOrderModal(indx)}>Change Order</Button>
                                                    <Button size='small' icon={<CopyOutlined />} onClick={() => copyQuestionTypes(section)}>Copy to all subjects</Button>
                                                    {/* <Button size='small' icon={<CopyOutlined />} onClick={() => copyQuestionTypes(section)}>Assign Weightage</Button> */}
                                                </Space>
                                            </Col>
                                        </Row>
                                    </Card>
                                    <Table size='small' bordered pagination={false} key={section.questionTypeGroup.length}
                                        dataSource={section.questionTypeGroup}
                                    >
                                        <Table.Column title={<b>Type</b>} dataIndex="type" key="type" 
                                            render={(type, group, typeIndx) =>
                                                <Select style={{width:'100%'}} placeholder='Select Question Type' 
                                                    value={type} 
                                                    onChange={(e) => selectQueType(indx, typeIndx, e)}
                                                >
                                                    {QuestionTypeNames.map(type => 
                                                        <Select.Option value={type.type} key={type.type}>{type.shortName}</Select.Option>
                                                    )}
                                                </Select>
                                            }
                                        />
                                        <Table.Column title={<b>No. of Questions</b>} dataIndex="noOfQuestions" key="noOfQuestions" 
                                            render={(count, group, typeIndx) =>
                                                <Input style={{width:'100%'}} type='number' value={count} onChange={(e) => changeTypeQueCount(indx, typeIndx, e)} placeholder='Enter No Of Questions' min={0} type='number'/>
                                            }
                                        />
                                        <Table.Column title={<b>Marks (per question)</b>} dataIndex="markingScheme" key="markingScheme" 
                                            render={(marking, group, typeIndx) =>
                                                <Input prefix='+' style={{width:'100%'}} type='number' value={marking.correct} onChange={(e) => changeMarkingScheme(indx, typeIndx, e)} placeholder='Enter Marks' min={0} type='number'/>
                                            }
                                        />
                                        <Table.Column title={<b>Negative Marks (per question)</b>} dataIndex="markingScheme" key="negative" 
                                            render={(marking, group, typeIndx) =>
                                                <Input prefix='-' style={{width:'100%'}} type='number' value={marking.incorrect} onChange={(e) => changeNegMarks(indx, typeIndx, e)} placeholder='Enter Negative marks' min={0} type='number'/>
                                            }
                                        />
                                        {/* <Table.Column title={<b>Positive weightage</b>} dataIndex="markingScheme" key="markingScheme" 
                                            render={(marking, group, typeIndx) =>
                                                group.type == 'MCQ' || group.type == 'SCQ' ?
                                                    <Input prefix='+' style={{width:'100%'}} type='number' value={''} onChange={(e) => changeMarkingScheme(indx, typeIndx, e)} placeholder='enter marks' min={0} type='number'/>
                                                    : null
                                            }
                                        />
                                        <Table.Column title={<b>Negative weightage</b>} dataIndex="markingScheme" key="negative" 
                                            render={(marking, group, typeIndx) =>
                                                group.type == 'MCQ' || group.type == 'SCQ' ?
                                                    <Input prefix='-' style={{width:'100%'}} type='number' value={''} onChange={(e) => changeNegMarks(indx, typeIndx, e)} placeholder='enter nagative marks' min={0} type='number'/>
                                                    : null
                                            }
                                        /> */}
                                        {/* <Table.Column title={<b>Partial Marking</b>} dataIndex="partialMarking" key="partialMarking" 
                                            render={(partialMarking, group, typeIndx) =>
                                                <Switch checked={partialMarking} onChange={e => changePartialMarking(indx, typeIndx, e)}/>
                                            }
                                        /> */}
                                        <Table.Column title={<b>Action</b>} dataIndex="action" key="action" 
                                            render={(action, group, typeIndx) =>
                                                <Tooltip title='Remove'>
                                                    <Button onClick={() => removeQueType(indx, typeIndx)} icon={<DeleteTwoTone twoToneColor='#eb2f96'/>}></Button>
                                                </Tooltip>
                                            }
                                        />
                                    </Table>
                                </div>
                        )}}
                    />
                    <Table.Column title={<b>Actions</b>} dataIndex="actions" key="actions" 
                        render={(action, subj, indx) =>
                            <Tooltip title='Remove'>
                                <Button 
                                    onClick={() => subj.sectionId ? ConfirmAlert(() => removeSubject(indx), 'Sure?') : removeSubject(indx)} 
                                    icon={<DeleteTwoTone twoToneColor='#eb2f96'/>}
                                ></Button>
                            </Tooltip>
                        }
                    />
                </Table>
                <Button type='primary' style={{marginTop:'20px'}} onClick={addMoreSubject} icon={<PlusOutlined/>}>Add More Subject</Button>
                <br/><br/>
                <div style={{display:'flex', width:'100%', justifyContent:'space-between'}}>
                    <div><Button onClick={assignQAQC} icon={<UserSwitchOutlined />}>Assign QA/QC</Button></div>
                    <div><Button shape='round' style={{width:'150px'}} disabled={_.findIndex(dataSource,d => !d.subjectRefId) != -1 || assignedMarks > currentTest.maxMarks} size='large' loading={addTestSubjectStatus === STATUS.FETCHING} type='primary' onClick={saveSubjects}>Save</Button></div>
                    <div></div>
                </div>
                {queTypeOrderingModal ? <QueTypeOrderingModal submit={changeOrder} questionTypes={currentQueTypes} closeModal={changeQueTypeOrderModal} visible={queTypeOrderingModal} /> : null}
                {subjOrderingModal ? <SubjectOrderingModal submit={changeSubjectOrder} allSubjects={subjects} selectedSubjects={dataSource} closeModal={changeSubjOrderModal} visible={subjOrderingModal} /> : null}
                {assignQAQCModal && currentTest.sections?.length ? <AssignQAQCModal visible={assignQAQCModal} currentTest={currentTest} closeModal={assignQAQC}/> : null}
            </div>
            : 
            <Empty description='Something went wrong'/>
    )
}