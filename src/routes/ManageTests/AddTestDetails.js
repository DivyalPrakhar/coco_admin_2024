import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Button, Card, Col, DatePicker, Empty, Form, Input, Radio, Row, Select, Space, Tooltip, Tag, Switch, Popover } from 'antd'
import Title from 'antd/lib/typography/Title'
import React, { useContext, useEffect } from 'react'
import { useReducer } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import { FormReducer } from '../../utils/FormReducer'
import _ from 'lodash'
import { addTestAction, resetAddTest, updateTestAction } from '../../redux/reducers/test'
import { ExamCompetitionSelector } from '../../components/ExamCompetitionSelector'
import { useHistory, useParams } from 'react-router-dom'
import moment from 'moment'
import {AddTestInstructionsModal} from './AddTestInstructions'
import {CurrentTestContext} from './AddTest'
import { SelectTagsModal } from '../ManagePackages/SelectTagsModal'
import Text from 'antd/lib/typography/Text'
import { AddTagModal } from '../ManageTags/AddTagModal'

const TEST_TYPE = { ONLINE: 'online', OFFLINE: 'offline', ONLINE_PLUS_OFFLINE: 'online+offline'}

export const AddTestDeatils = () => {
    const dispatch = useDispatch()
    const params = useParams()
    const history = useHistory()
    const currenTest = useContext(CurrentTestContext)
    const initialTestDetails = { visible:false, testType:'online', name:{en:''}, maxAttempts: null, isFree:false}

    const [testDetails, changeTestDetails] = useReducer(FormReducer, initialTestDetails)
    
    const [instructionsModal, changeInstructionModal] = useState({modal: false, testData: ''})
    const [defaultSyllabus, setDefaultSyllabus] = useState({exams: []})
    const [selectExamModal, changeSelectExamModal] = useState()
    const [formKey] = useState(1)
    const [tagsModal, changeTagsModal] = useState(false)
    const [enableMaxAttempt, changeEnableMaxAttmpt] = useState(false)
    const [addTagModal, changeAddTagModal] = useState()

    const {configData, test} = useSelector(state => ({
        configData: state.lmsConfig,
        test:state.test
    }))

    useEffect(() => {
        if(history.location.pathname == '/add-test'){
            changeTestDetails({type:'reset', value:initialTestDetails})
        }else{
            if(test.getTestStatus == STATUS.SUCCESS && currenTest){
                let {name, referenceId, testType, testUsageType, maxMarks, 
                    maxAttempts, totalTime, resultDate, testOption, resultPublishDate, 
                    examTypeTemplate, visibility, instruction, tags, isFree, forceOnline
                } = currenTest 
                
                const data = {name, referenceId, testType, testUsageType, maxMarks, 
                    maxAttempts, totalTime, resultDate, testOption, resultPublishDate, 
                    examTypeTemplate, visibility, instruction, tags, examRefId:currenTest?.examRefId?._id, 
                    isFree, forceOnline
                }
                changeEnableMaxAttmpt(maxAttempts ? true : false)
                changeTestDetails({type:'reset', value:data})
            }
        }
    }, [history.location.pathname, test.getTestStatus])

    useEffect(() => {
        if(test.addTestStatus == STATUS.SUCCESS){
            history.push(`/update-test/${test.currentTest._id}/2`)            
        }
    }, [test.addTestStatus])

    useEffect(()=>{
       if(test.addTestStatus !== STATUS.NOT_STARTED){
        return () => dispatch(resetAddTest())    
       }
    },[test.addTestStatus])
    
    useEffect(() => {
        if(configData.defaultDataStatus === STATUS.SUCCESS){
            let defaultData = configData.defaultData
            if(defaultData)
                setDefaultSyllabus(defaultData)
        }
    }, [configData.defaultData, configData.defaultDataStatus])

    const changeName = (e) => {
        changeTestDetails({type:'name', value:{en:e.target.value}})
    }

    const changeRefId = (e) => {
        changeTestDetails({type:'referenceId', value:e.target.value})
    }

    const changePlatform = (e) => {
        changeTestDetails({type:'testType', value:e})
    }

    const changeUsageType = (e) => {
        changeTestDetails({type:'testUsageType', value:e})
    }


    const changeExamType = (id) => {
        changeSelectExamModal(false)
        changeTestDetails({type:'examRefId', value:id[0]})
    }

    const changeIntroduction = (e) => {
        changeTestDetails({type:'instruction', value:e})
    }

    const changeMaxMarks = (e) => {
        changeTestDetails({type:'maxMarks', value:e.target.value})
    }

    const changeTestDuration = (e) => {
        changeTestDetails({type:'totalTime', value:e.target.value})
    }

    const changePublishDate = (e) => {
        changeTestDetails({type:'resultPublishDate', value: e ? new Date(e) : null})
    }

    const changeLanguage = (e) => {
        let value = currenTest ? {...currenTest.testOption, bilingual:e.target.value} : {bilingual:e.target.value}
        changeTestDetails({type:'testOption', value})
    }

    const changeBooleanValue = (type, e) => {
        changeTestDetails({type, value:e === 'true' ? true : false})
    }

    const addTest = () => {
        let data = _.cloneDeep(testDetails)
        data.tags = _.compact(_.map(_.compact(data.tags), s => s._id))
        data = data.maxAttempts ? data :  {...data, maxAttempts:null}
        if(params.id)
            dispatch(updateTestAction({...data, testId:params.id, withSyllabus:true}))
        else
            dispatch(addTestAction(data))
    }

    const showSelectExamModal = () => {
        changeSelectExamModal(!selectExamModal)
    }

    const selectTags = (e) => {
        changeTestDetails({type:'tags', value:e})
    }

    const _enableMaxAttempts = (e) => {
        changeEnableMaxAttmpt(e)
        changeTestDetails({type:'maxAttempts', value:testDetails.maxAttempts ? null : 1})
    }

    const _changeMaxAttempts = (e) => {
        changeTestDetails({type:'maxAttempts', value:e.target.value})
    }

    const showAddTagModal = () => {
        changeAddTagModal(!addTagModal)
    }

    const disabled = !testDetails.testUsageType || !testDetails.examRefId || !testDetails.maxMarks || !testDetails.totalTime
    return(
        <Card style={{border:0}} loading={configData.defaultDataStatus === STATUS.FETCHING}>
            {configData.defaultDataStatus === STATUS.SUCCESS ? 
                <>
                    <Title style={{fontSize:'18px'}}>Basic Details</Title>
                    <Form layout='vertical' key={formKey}>
                        <Row>
                            <Col span={7}>
                                <Form.Item label='Test Name' required>
                                    <Input placeholder='Enter Test Name' value={testDetails.name?.en} onChange={changeName}/>
                                </Form.Item>
                            </Col>
                            <Col span={7} offset={1}>
                                <Form.Item label='Reference Id/Paper Code' onChange={changeRefId}>
                                    <Input placeholder='Enter Reference ID/Paper Code' value={testDetails.referenceId}/>
                                </Form.Item>
                            </Col>
                            <Col span={7} offset={1}>
                                <Form.Item label='Test Platform' required>
                                    <Select placeholder='Select Test Platform' onChange={changePlatform} value={testDetails.testType}>
                                        {_.map(TEST_TYPE, type => 
                                            <Select.Option value={type} key={type}>{_.capitalize(type)}</Select.Option>
                                        )}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <Form.Item label='Test Usage Type' required>
                                    <Select placeholder='Select Test Usage Type' onChange={changeUsageType} value={testDetails.testUsageType}>
                                        <Select.Option value='testSeries'>Test Series</Select.Option>
                                        <Select.Option value='mock'>Mock</Select.Option>
                                        <Select.Option value='previousYear'>Previous Year</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    
                    <br/>

                    {/* <Title style={{fontSize:'18px'}}>Exam Configurations</Title> */}
                    <Form layout='vertical'>
                        <Row>
                            {/* <Col span={7}>
                                <Form.Item label='Exam Configuration' >
                                    <Select placeholder='select exam configuration' onChange={changeExamConfig} value={testDetails.examTypeTemplate}>
                                        {EXAM_DETAILS.map(d => 
                                            <Select.Option key={d.id} value={d.value}>{d.name.en}</Select.Option>
                                        )}
                                    </Select>
                                </Form.Item>
                            </Col> */}
                            <Col span={7} >
                                <Form.Item label='Test Type' required>
                                    <div style={{display:'flex', width:'100%', alignItems:'baseline'}}>
                                        {testDetails.examRefId && _.findIndex(defaultSyllabus.exams, d => d._id == testDetails.examRefId) != -1 ? 
                                            <>
                                                <div style={{fontWeight:'bold'}}>
                                                    {_.find(defaultSyllabus.exams, d => d._id == testDetails.examRefId).name.en}
                                                </div>
                                                <div style={{padding:'10px'}}></div>
                                            </>
                                            : null
                                        }
                                        <Tooltip title='Add More'>
                                            <Button onClick={showSelectExamModal}>Select</Button>
                                        </Tooltip>
                                    </div>
                                </Form.Item>
                            </Col>
                            <Col span={7} offset={1}>
                                <Form.Item label='Instructions'>
                                    <div style={{display:'flex', width:'100%'}}>
                                        <Select style={{width:'100%'}} placeholder='Select Instructions' onChange={changeIntroduction} value={testDetails?.instruction}>
                                            {_.map(test.allInstructionData, s => {
                                                return(
                                                    <Select.Option key={s._id}>{s?.name?.en || s?.name?.hn}</Select.Option>
                                                )}
                                            )}
                                        </Select>
                                        <div style={{padding:'10px'}}></div>
                                        <Tooltip title='Add More'>
                                            <Button icon={<PlusOutlined/>} onClick={() => changeInstructionModal({modal: true})}></Button>
                                        </Tooltip>
                                    </div>
                                </Form.Item>
                            </Col>
                            <Col span={7} offset={1}>
                                <Form.Item 
                                    label={<Space>
                                                <Text>
                                                    Maximum Attempts 
                                                </Text>
                                                <Popover content='maximum attempts is unlimited by default'  placement="top">
                                                    <InfoCircleOutlined style={{color: '#3498DB', fontSize:'18px'}}/>
                                                </Popover>
                                                <Switch size='small' checked={enableMaxAttempt} onChange={_enableMaxAttempts}/> <b>Enable</b>
                                            </Space>
                                    }
                                >
                                    <Input type='number' placeholder='Maximum Attempts' value={testDetails.maxAttempts} onChange={_changeMaxAttempts} min={1} disabled={!enableMaxAttempt}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <Form.Item label='Maximum Marks' required>
                                    <Input placeholder='Enter Maximum Marks' type='number' onChange={changeMaxMarks} value={testDetails.maxMarks}/>
                                </Form.Item>
                            </Col>
                            <Col span={7} offset={1}>
                                <Form.Item label='Test Duration (in min)' required>
                                    <Input type='number' placeholder='Test Duration' onChange={changeTestDuration} value={testDetails.totalTime}/>
                                </Form.Item>
                            </Col>
                            <Col span={7} offset={1}>
                                <Form.Item label='Result Publish Date'>
                                    <DatePicker 
                                        placeholder='Select Publish Date' 
                                        style={{width:'100%'}} 
                                        onChange={changePublishDate} 
                                        value={testDetails.resultPublishDate ? moment(testDetails.resultPublishDate) : null}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

                    {/* <Title style={{fontSize:'18px'}}>Exam Details</Title> */}
                    <Form layout='vertical'>
                        <Row>
                            <Col span={7}>
                                <Form.Item label='Free Test'>
                                    <Radio.Group 
                                        onChange={e => changeTestDetails({type:'isFree', value:e.target.value})} 
                                        value={testDetails.isFree}
                                    >
                                        <Radio.Button value={true}>Yes</Radio.Button>
                                        <Radio.Button value={false}>No</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={7} offset={1}>
                                <Form.Item label='Visible to Students' onChange={e => changeBooleanValue('visibility', e.target.value)}>
                                    <Radio.Group value={testDetails.visibility === 'true' || testDetails.visibility === true ? true : false}>
                                        <Radio.Button value={true}>Yes</Radio.Button>
                                        <Radio.Button value={false}>No</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={7} offset={1}>
                                <Form.Item 
                                    label={<Space>
                                                <Text>
                                                    Force Online 
                                                </Text>
                                                <Popover content='switch this test to online for all offline orders'  placement="top">
                                                    <InfoCircleOutlined style={{color: '#3498DB', fontSize:'18px'}}/>
                                                </Popover>
                                            </Space>
                                    } 
                                    onChange={e => changeBooleanValue('forceOnline', e.target.value)}
                                >
                                    <Radio.Group value={testDetails.forceOnline === 'true' || testDetails.forceOnline === true ? true : false}>
                                        <Radio.Button value={true}>Yes</Radio.Button>
                                        <Radio.Button value={false}>No</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <Form.Item label="Select Tags">
                                    {_.map(testDetails?.tags, s => {
                                        return(
                                            s &&
                                            <Tag 
                                                key={s._id}
                                                style={{fontSize:'14px', padding:'5px 10px', marginTop: '5px'}} 
                                                color="blue"
                                                closable
                                                onClose={() => selectTags(_.filter(testDetails?.tags, pack => pack._id !== s._id))}
                                            >
                                                {s.name}
                                            </Tag>
                                        )}
                                    )}
                                    <Tag style={{fontSize:'14px', cursor:'pointer', padding:'5px 10px', marginTop: '5px'}} onClick={() => changeTagsModal(true)}>Select Tags &nbsp;<PlusOutlined /></Tag>
                                    <Tooltip title='Add New Tag'>
                                        <Button onClick={showAddTagModal} style={{marginTop: '5px'}} icon={<PlusOutlined/>}></Button>
                                    </Tooltip>
                                    {tagsModal ? 
                                        <SelectTagsModal selectedData={testDetails?.tags || []} visible={tagsModal} closeModal={() => changeTagsModal(false)} submitTags={(data) => (selectTags(data), changeTagsModal(false))}/>
                                    : null}
                                </Form.Item>
                            </Col>
                        </Row>
                        <br/>
                        <Row style={{textAlign:'center'}}>
                            <Col span={24}>
                                <Space>
                                    <Button shape='round' style={{width:'150px'}} disabled={disabled} loading={test.addTestStatus == STATUS.FETCHING || test.updateTestStatus == STATUS.FETCHING} onClick={addTest} size='large' type='primary'>
                                        Save
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    </Form>
                </>
                :
                <Empty description='something went wrong'/>
            }
            {addTagModal && <AddTagModal visible={addTagModal}  closeModal={showAddTagModal}/>}
            {selectExamModal ? 
                <ExamCompetitionSelector modalStatus={selectExamModal}
                    closeModal={showSelectExamModal}
                    competitionsData={defaultSyllabus.competitions}
                    examsData={defaultSyllabus.exams}
                    multipleSelect={false}
                    // singleCompetitions={true}
                    defaultExams={[testDetails.examRefId]}
                    selectedExamsData={changeExamType}
                /> 
                : null
            }
            {instructionsModal.modal ? 
                <AddTestInstructionsModal 
                    visible={instructionsModal.modal}
                    closeModal={() => changeInstructionModal({modal: false})}
                /> 
                : null
            }
        </Card>
    )
}
