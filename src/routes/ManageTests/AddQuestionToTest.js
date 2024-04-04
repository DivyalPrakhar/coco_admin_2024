import { DeleteOutlined, DeleteTwoTone, PlusOutlined, SelectOutlined, UnorderedListOutlined, DownOutlined, CheckCircleOutlined, EditOutlined, WarningOutlined} from '@ant-design/icons'
import { Row, Col, Button, Card, Descriptions, Form, Radio, Select, Space, Table, Tag, Tabs, Tooltip, Badge, Alert, Popover} from 'antd'
import Text from 'antd/lib/typography/Text'
import React, { useCallback, useMemo } from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import { CurrentTestContext } from './AddTest'
import {SelectQuestionModal} from './SelectQuestionModal'
import _ from 'lodash'
import { AddTestQuestionModal } from './AddTestQuestionModal'
import { QuestionTypes, incorrectQuestion, QUESTION_ERRORS, colorArray } from '../../utils/QuestionTypeHelper'
import Title from 'antd/lib/typography/Title'
import { removeTestQueAction, newUpdatedQuestionAction, removeDocQuestionAction, addReviewedQuestionsAction } from '../../redux/reducers/test'
import { ConfirmAlert } from '../../Constants/CommonAlerts'
import { TestQuestionsOrdering } from './TestQuestionsOrderingModal'
import { useHistory, useParams } from 'react-router-dom'
import {WordQuestionModalData} from './WordQuestionModalData'
import { UpdateQuestionModal } from '../../components/UpdateQuestionModal'
import { renderMathTex } from '../../utils/FileHelper'

export const AddQuestionToTest = () => {
    const currentTest = useContext(CurrentTestContext)
    const dispatch = useDispatch()
    const params = useParams()

    const {getTestStatus, removeQuesionStatus, addNewTestQuestionStatus, wordQuestionUploadStatus, questionsOrderStatus, addReviewedQuestionsStatus} = useSelector(state => ({
        getTestStatus:state.test.getTestStatus,
        removeQuesionStatus:state.test.removeTestQueStatus,
        addNewTestQuestionStatus:state.test.addNewTestQuestionStatus,
        wordQuestionUploadStatus: state.test?.wordQuestionUploadStatus,
        addReviewedQuestionsStatus: state.test?.addReviewedQuestionsStatus,
        questionsOrderStatus: state.test?.questionsOrderStatus
    }))
    
    const [subjects, setSubject] = useState([])
    let [addTestModal, changeAddTestModal] = useState({status:false, data:''})
    const [questionModalData, questionModalChange] = useState({status: false, data: '', subject: ''})
    const [questionsOrderModal, changeQuestionsOrderModal] = useState({status: false, data: ''})
    const [groupIdToRemove, changeGroupIdToRemove] = useState()
    const [selectedQuestions, changeSelectedQuestions] = useState([])
    const [currentLanguage, setCurrentLanguage] = useState('en')
    const [wordQuestionModal, changeWordQuestionModal] = useState({modal: false, data: ''})
    const [wordUploadTab, changeWordUploadTab] = useState(1)
    const [incorrectQuestions, changeIncorrectQuestions] = useState([])
    const [updateQueModal, changeUpdateQueModal] = useState({modal: false, data: ''})
    const [groupQuestionData, changeGroupQuestionData] = useState([])
    const [selectedSubject, selectSubject] = useState()

    const _updateQueModal = (data) => {
        changeUpdateQueModal({modal:true, data: data})
    }

    const closeUpdateQueModal = () => {
        changeUpdateQueModal({modal: false, data: ''})
    }

    let currentSubject = useMemo(()=> {
        let currentSubject = _.find(currentTest.sections,s => s._id === selectedSubject?._id) 
        return currentSubject ? {...currentSubject, questionTypeGroup:currentSubject?.questionTypeGroup.map(grp => ({...grp, questions:_.filter(currentSubject?.questions,que => que.type?.questionGroupId === grp._id)}))} : null

    },[currentTest.sections, selectedSubject])


    useEffect(() => {
        if(selectedSubject?._id){
            let doc = currentTest.doc &&
            currentTest.doc.length && _.find(currentTest.doc, d => d.subject._id === currentSubject?.subjectRefId._id)
            changeIncorrectQuestions( 
               doc?.questions?.length ?
                        _.filter(doc?.questions.map(que => incorrectQuestion(que)),que => que.errors)
                        : [])
        }
        changeGroupQuestionData([])

    }, [currentSubject?.subjectRefId._id, currentTest?.doc, selectedSubject?._id])



    useEffect(() => {
        if(getTestStatus === STATUS.SUCCESS && currentTest && currentTest.sections.length){
            setSubject(currentTest.sections)
        }

        if(params.step == 4 && currentTest?.sections.length && !selectedSubject){
            selectSubject(currentTest.sections[0])
        }

    }, [currentTest, getTestStatus, params.step, selectedSubject])


    useEffect(() => {
        if(document.getElementById('math-tex-id'))
            renderMathTex()
    })

    // useEffect(() => {
    //     if(document.getElementById("math-tex-id"))
    //         window.renderMathInElement(document.getElementById("math-tex-id", {
    //             delimiters: [
    //                 { left: "$", right: "$", display: true }
    //             ]
    //     }))
    // }, [ selectedSubject?._id, currentLanguage, addTestModal.status])

    useEffect(() => {
        if(removeQuesionStatus == STATUS.SUCCESS){
            changeGroupIdToRemove(null)
            changeSelectedQuestions([])
        }
    }, [removeQuesionStatus])

    const changeSubject = (id) => {
        let data = _.find(subjects,s => s._id === id)
        selectSubject(data)
    }

    const selectQuestions = (data, subject) => {
        questionModalChange({status:true, data:data, subject: subject})
    }

    const _changeAddTestModal = (group) => {
        const data = group ? {type:group.type, testId:currentTest._id, sectionId:selectedSubject?._id, questions:[{order:group.questions?.length + 1, type:{questionType:group.type, questionGroupId:group._id}}]} : null
        changeAddTestModal({status:!addTestModal.status, data})
    }

    const removeQuestion = (que) => {
        let data = {testId:currentTest._id, sectionId:selectedSubject?._id, questionRefIds:[que.questionRefId._id]}
        ConfirmAlert(() => dispatch(removeTestQueAction(data)), 'Sure ?')
    }

    const _changeQuestionsOrderModal = (data) => {
        changeQuestionsOrderModal({status:!questionsOrderModal.status, data:data?.questions})
    }

    const removeMultQuestions = (grp) => {
        let id = grp._id == groupIdToRemove ? null : grp._id
        changeGroupIdToRemove(id)
        changeSelectedQuestions([])
    }

    const selectQuestionsToRemove = (e) => {
        changeSelectedQuestions(e)
    }

    const removeQuestions = () => {
        let data = {testId:currentTest._id, sectionId:selectedSubject?._id, questionRefIds:selectedQuestions}
        ConfirmAlert(() => dispatch(removeTestQueAction(data)), 'Sure ?')
    }
    

    // useEffect(() => {
    //     if(document.getElementById("math-tex-id")){
    //         setTimeout(() => (
    //             window.renderMathInElement(document.getElementById("math-tex-id", {
    //                 delimiters: [
    //                     { left: "$", right: "$", display: true }
    //                 ]
    //             }))
    //         ), 1000)
    
    //     }
    // }, [questionsOrderModal, selectedQuestions, questionModalData])
    
    const selectLanguage = (e) => {
        setCurrentLanguage(e)
    }

    const removeDocQuestion = (queIds, secId) => {
        let data = {testId: currentTest._id, sections:[{subjectId: secId, questionIds: queIds}]}
        dispatch(removeDocQuestionAction(data))
    }

    const addReviewedQuestions = (section) => {
        let subject = _.find(currentTest.doc, d => d.subject._id == section.subjectRefId._id)
        let questionsObj = [{subjectId:section.subjectRefId._id, questions:subject.questions.map((que, i) => ({questionRefId:que._id, type: _.get(_.find(groupQuestionData, gq => gq.id === que._id), 'type', ''), 
            order:(_.maxBy(section.questions, 'order')?.order || 0) + i + 1
        }))}]

        dispatch(addReviewedQuestionsAction({testId: currentTest._id, questionsObj: questionsObj}))
    }


    const changeGroupData = (question, tag) => {
        let data = {
            id: question._id,
            type: {
                questionGroupId: tag._id,
                questionType: tag.type
            }
        }
        let findQue = _.findIndex(groupQuestionData, d => d.id === question._id)
        if(findQue != -1){
            changeGroupQuestionData(_.filter(groupQuestionData, d => d.id != question._id))
        }else{
            changeGroupQuestionData(_.compact(_.concat(groupQuestionData, data)))
        }
    }

  

    const changeAllQuestionGroup = useCallback((tag) => {
        if(tag != ''){
            if(tag === 'all'){
                let allQuestions = _.find(currentTest.doc, d => d.subject._id == currentSubject?.subjectRefId._id)?.questions || [] 
                let data = _.compact(_.map(allQuestions, s => {
                    let findTagType = _.find(currentSubject?.questionTypeGroup, qg => qg.type === s.type) 
                    return(findTagType ? {
                        id: s._id,
                        type: {
                            questionGroupId: findTagType._id,
                            questionType: findTagType.type
                        }
                    } : null)
                }))
                changeGroupQuestionData(data)
            }
            else{
                let allQuestions = _.find(currentTest.doc, d => d.subject._id == currentSubject?.subjectRefId._id)?.questions || [] 
                let data = _.compact(_.map(allQuestions, s => {
                    let findTagType = _.findIndex(currentSubject?.questionTypeGroup, qg => qg.type === s.type) != -1 
                    let currentTagCheck = s.type === tag.type
                    return(findTagType && currentTagCheck ? {
                        id: s._id,
                        type: {
                            questionGroupId: tag._id,
                            questionType: tag.type
                        }
                    } : null)
                }))

                changeGroupQuestionData(data)
            }
        }
    },[currentSubject?.questionTypeGroup, currentSubject?.subjectRefId._id, currentTest.doc])

    useEffect(() => {
        if(_.uniqBy(currentSubject?.questionTypeGroup, 'type').length === currentSubject?.questionTypeGroup.length){
            changeAllQuestionGroup('all')
        }
    }, [changeAllQuestionGroup, currentSubject?.questionTypeGroup, currentTest.sections, selectedSubject])
   
    let questionInDoc = _.find(currentTest?.doc, d => d.subject._id == currentSubject?.subjectRefId?._id)?.questions
    
    let queTypeGroups = currentSubject?.questionTypeGroup?.length ? 
        currentSubject?.questionTypeGroup.map(grp => ({...grp, docQuestions:_.filter(questionInDoc, d => d.type == grp.type)})) 
        : []

    queTypeGroups = queTypeGroups.length ? _.chain(queTypeGroups).map(q => 
            ({type:q.type, requiredQuestions:q.noOfQuestions - q.questions.length, docQuestions:q.docQuestions.length, invalid:q.docQuestions.length > (q.noOfQuestions - q.questions.length)})
        ).filter(d => d.invalid).value(): []

    let addDocQuestions = queTypeGroups.length ? true : false

    return(
        currentSubject ?
            <div id='math-tex-id'>
                <Tabs activeKey={selectedSubject._id} style={{height: '80px'}} size='large' type="card" centered onChange={(e) => changeSubject(e)}>
                    {subjects.length ?
                        subjects.map((subj, i) => {
                            return(
                                <Tabs.TabPane forceRender tab={subj.subjectRefId?.name.en} key={subj._id} value={subj._id}>
                                    <div style={{display: 'none',maxHeight: '0px'}}></div>
                                </Tabs.TabPane>
                            )} 
                        )
                        : null
                    }
                </Tabs>
                {/*<br/>
                <div style={{display:'flex', alignItems:'stretch', overflowX: 'auto'}}>
                    {subjects.length ?
                        subjects.map((subj, i) =>
                            {
                                let active = selectedSubject?._id == subj._id
                                return(
                                    <div key={subj._id} onClick={() => changeSubject(subj._id)} className={active ? 'active-subjectTab' : 'subjectTab'} 
                                        style={{border:'1px solid #D6DBDF', padding:5, cursor:'pointer', minWidth: subjects.length < 6 ? `${100/subjects.length}%` : '200px', fontSize:'18px', textAlign:'center',
                                            display:'flex', alignItems:'center', justifyContent:'center' 
                                        }}
                                    >
                                            {subj.subjectRefId?.name.en} 
                                    </div>
                                )
                            } 
                        )
                        : null
                    }
                </div>
                <br/>*/}
                {/* <Radio.Group size='large' onChange={changeSubject} buttonStyle="solid" value={selectedSubject?._id} style={{width:'100%'}}>
                    {subjects.length ?
                        subjects.map(subj => 
                            <Radio.Button key={subj._id} value={subj._id} style={{width:`${100/subjects.length}%`, fontSize:'auto', textAlign:'center'}}>
                                {subj.subjectRefId?.name.en} 
                            </Radio.Button>
                        )
                        : null
                    }
                </Radio.Group> */}
                
                <Button style={{float: 'right'}} icon={<SelectOutlined />} onClick={() => changeWordQuestionModal({modal: true, data: currentSubject})}>Import Document</Button>
                <br/><br/>
                <AddQuestionCard key={selectedSubject?._id+questionModalData.status+addTestModal.status+removeQuesionStatus+addReviewedQuestionsStatus} currentSubject={currentSubject} selectQuestions={(data) => selectQuestions(data, currentSubject)} changeAddTestModal={_changeAddTestModal}/>
                <br/><br/>
                {currentTest.testOption?.bilingual ? 
                    <Form.Item label={<b>Select Language</b>}>
                        <Select value={currentLanguage} style={{width:'200px'}} onChange={selectLanguage}>
                            <Select.Option value='en'>English</Select.Option>
                            <Select.Option value='hn'>Hindi</Select.Option>
                        </Select>
                    </Form.Item>
                    :
                    null
                }


                {
                 questionInDoc?.length ?
                    <div>
                        <br/>   
                        <h4 style={{fontWeight:'bold', textAlign:'center', fontSize:'22px'}}>Review Word Questions</h4>
                        <div style={{padding:'12px 5px', fontSize:'16px', margin:'0px 10px', border:'1px solid #F2F3F4', minHeight:'300px', borderRadius:'5px', boxShadow:' inset 2px 0px 11px 5px rgba(0,0,0,0.05)'}}>
                            <Row style={{cursor:'pointer', textAlign:'center', margin:'0px 6px'}}>
                                <Col sm={12} 
                                    onClick={() => changeWordUploadTab(1)} 
                                    style={{background:wordUploadTab == 1 ? '#2471A3' : '', 
                                        border:wordUploadTab == 1 ? '1px solid #2471A3' : '1px solid #D6DBDF', 
                                        color:wordUploadTab == 1 ? 'white' : '', padding:3,
                                        boxShadow:wordUploadTab == 1 ? '3px 3px 8px rgba(0, 0, 0, 0.5)' : ''
                                    }}
                                >
                                    <b>Questions Preview</b>
                                </Col>
                                <Col sm={12}
                                    onClick={() => changeWordUploadTab(2)} 
                                    style={{background:wordUploadTab == 2 ? '#2471A3' : '', 
                                        border:wordUploadTab == 2 ? '1px solid #2471A3' : '1px solid #D6DBDF', 
                                        color:wordUploadTab == 2 ? 'white' : '',
                                        boxShadow:wordUploadTab == 2 ? '3px 3px 8px rgba(0, 0, 0, 0.5)' : ''
                                    }}
                                >
                                    <b>Errors</b>&nbsp;&nbsp;
                                    <Badge count={incorrectQuestions.length} />
                                </Col>
                            </Row>
                            <div style={{background:'white', padding:'9px', background:'#F4F6F7', border:'1px solid #D6DBDF', borderRadius:'3px', margin:'10px'}}>
                                No errors in uploaded questions. You can add them to test now. &nbsp;
                                <Tooltip placement="bottom" title={groupQuestionData.length === questionInDoc.length ? '' : <div style={{textAlign: 'center', fontSize: '12px'}}>PLEASE ADD ALL QUESTIONS TO A QUESTION GROUP AND DELETE EXTRA QUESTIONS.</div>}>
                                    <Button 
                                        disabled={incorrectQuestions.length || groupQuestionData.length < questionInDoc.length || addDocQuestions} 
                                        type='primary' 
                                        onClick={() => ConfirmAlert(() => addReviewedQuestions(currentSubject), 'You reviewed all questions?')}
                                    >
                                        Add Questions to test
                                    </Button>
                                </Tooltip>
                            </div>
                            {addDocQuestions ? 
                                <Alert type='error'
                                    description={
                                        <div>
                                            <Text style={{color:'red'}}><WarningOutlined style={{fontSize:16}} /> Can't add more then required questions </Text><br/>
                                            {queTypeGroups.map((grp, grpIndx) => 
                                                <div key={grpIndx}>
                                                    <Space size='large' style={{color:grp.invalid && 'red'}}>
                                                        <div>Type: <Text style={{fontWeight:'bold', color:grp.invalid && 'red'}}>{grp.type}</Text></div>
                                                        <div>Required Questions: <Text style={{fontWeight:'bold', color:grp.invalid && 'red'}}>{grp.requiredQuestions}</Text></div>
                                                        <div>Uploaded Questions: <Text style={{fontWeight:'bold', color:grp.invalid && 'red'}}>{grp.docQuestions}</Text></div>
                                                    </Space>
                                                </div>
                                            )}
                                        </div>
                                    }
                                />
                                : null
                            }
                            <br/>
                            {wordUploadTab == 1 ?
                                <div>
                                    <div style={{padding:'0 10px'}}>
                                        <Button 
                                            type='danger' 
                                            onClick={() => 
                                                ConfirmAlert(() => removeDocQuestion(_.filter(_.find(currentTest.doc, d => d.subject._id == currentSubject?.subjectRefId._id).questions).map((que,i) => que._id), currentSubject?.subjectRefId._id), 'Sure?')}
                                        >
                                            Delete All Questions
                                        </Button>
                                        <span style={{float: 'right'}}>
                                        {_.map(currentSubject?.questionTypeGroup, d => {
                                            let currentQuestionG = _.filter(groupQuestionData, g => g.type.questionGroupId === d._id).length
                                            let currentQuestionLeft = d.noOfQuestions - d.questions.length
                                            return(
                                                <Tag 
                                                    color={currentQuestionG < currentQuestionLeft ? 'warning' : currentQuestionG == currentQuestionLeft ? 'green' : 'red'} 
                                                    key={d._id+groupQuestionData.length+d.questions.length}
                                                >
                                                    {d.type+': '+currentQuestionG+'/'+currentQuestionLeft}
                                                </Tag>
                                            )}
                                        )}
                                        </span>
                                    </div>
                                    <br/>
                                    <div style={{overflow:'auto', maxHeight:'400px', padding:'0px 20px'}}> 
                                        <table style={{width: '100%', border: '1px solid #e2e0e0', padding: '3px'}}>
                                            <thead style={{border: '1px solid #e2e0e0', padding: '3px'}}>
                                                <tr style={{border: '1px solid #e2e0e0', padding: '3px'}}>
                                                    <th style={{border: '1px solid #e2e0e0', padding: '3px'}}>#</th>
                                                    <th style={{border: '1px solid #e2e0e0', padding: '3px'}}>QUESTION</th>
                                                    <th style={{border: '1px solid #e2e0e0', padding: '3px'}}>TYPE</th>
                                                    <th style={{border: '1px solid #e2e0e0', padding: '3px'}}>OPTIONS</th>
                                                    <th style={{border: '1px solid #e2e0e0', padding: '3px'}}>ACTIONS</th>
                                                    <th style={{border: '1px solid #e2e0e0', padding: '3px'}}>
                                                        <Popover 
                                                            content={
                                                                _.map(currentSubject?.questionTypeGroup, cq => {
                                                                    return(
                                                                        <Tag onClick={() => changeAllQuestionGroup(cq)} color='grey' key={cq._id} style={{width: '100%', textAlign: 'center', fontSize: '18px'}}>{cq.type}</Tag>
                                                                    )}
                                                                )
                                                            } 
                                                            placement="bottom" 
                                                            trigger="hover"
                                                        >
                                                          QUESTION GROUP <DownOutlined />
                                                        </Popover>
                                                    </th>
                                                </tr>
                                            </thead>
                                            {_.filter(_.find(currentTest.doc, d => d.subject._id == currentSubject?.subjectRefId._id).questions.map(que => incorrectQuestion(que)),que => !que.errors).map((que,i) =>
                                                <tbody key={i} style={{border: '1px solid #e2e0e0', padding: '3px'}}>
                                                    <tr style={{border: '1px solid #e2e0e0', padding: '3px'}}>
                                                        <td style={{border: '1px solid #e2e0e0', padding: '3px'}} rowSpan={que.options.length + 1}>{++i}</td>
                                                        <td style={{border: '1px solid #e2e0e0', padding: '3px'}} rowSpan={que.options.length + 1}>
                                                            {que.question.en ? <div dangerouslySetInnerHTML={{__html:que.question.en}} /> : null }
                                                            {que.question.hn ? <div dangerouslySetInnerHTML={{__html:que.question.hn}} /> : null }
                                                        </td>
                                                        <td style={{border: '1px solid #e2e0e0', padding: '3px'}} rowSpan={que.options.length + 1}>
                                                            {que.type}
                                                        </td>
                                                        {que.options[0] ? 
                                                            <td style={{border: '1px solid #e2e0e0', padding: '3px', background:_.findIndex(que.answer, ans => ans == que.options[0]._id ) != -1 ? '#DCEDC8' : ''}}>
                                                                <div style={{display:'flex'}}>
                                                                    <div style={{paddingRight:'9px'}}>
                                                                        {_.findIndex(que.answer, ans => ans == que.options[0]._id ) != -1 ? 
                                                                            <CheckCircleOutlined style={{color:'#4CAF50', fontSize:'18px'}}/> : null
                                                                        }
                                                                    </div>
                                                                    <div>
                                                                        {que.options[0].body.en ? <div dangerouslySetInnerHTML={{__html:que.options[0].body.en}} /> : null }
                                                                        {que.options[0].body.hn ? <div dangerouslySetInnerHTML={{__html:que.options[0].body.hn}} /> : null }
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            :
                                                            <td style={{border: '1px solid #e2e0e0', padding: '3px'}}>{_.join(que.answer, ', ')}</td>
                                                        }
                                                        <td rowSpan={que.options.length + 1} style={{width:'100px', textAlign:'center', border: '1px solid #e2e0e0', padding: '3px'}}>
                                                            <Space align='center' style={{width:'100%'}}>
                                                                <Tooltip title='Edit'>
                                                                    <Button bsStyle='primary' outlined icon={<EditOutlined />}
                                                                        onClick={() => _updateQueModal(que)}
                                                                    />
                                                                </Tooltip>
                                                                <Tooltip title='Delete'>
                                                                    <Button bsStyle='danger' outlined icon={<DeleteOutlined />}
                                                                        onClick={() => ConfirmAlert(() =>  removeDocQuestion([que._id], currentSubject?.subjectRefId._id), 'Sure?')}
                                                                    />
                                                                </Tooltip>
                                                            </Space>
                                                            
                                                        </td>
                                                        <td style={{ textAlign: 'center', border: '1px solid #e2e0e0', padding: '3px', width:'200px'}} rowSpan={que.options.length + 1}>
                                                            {_.filter(currentSubject?.questionTypeGroup, f => f.type === que.type).length ? 
                                                                _.map(_.filter(currentSubject?.questionTypeGroup, f => f.type === que.type), (tag, inde) => {
                                                                    return(
                                                                        <div key={inde} style={{padding: '3px'}}>
                                                                            <Tooltip title={
                                                                                    <div>
                                                                                        <div>Max Questions: {tag.noOfQuestions}</div>
                                                                                        <div>Marks: &nbsp;&nbsp;&nbsp;{tag.markingScheme.correct ? `+${tag.markingScheme.correct}` : null}{tag.markingScheme.incorrect ? ` / -${tag.markingScheme.incorrect}` : null}</div>
                                                                                    </div>
                                                                                }>
                                                                                <Tag 
                                                                                    style={{cursor: 'pointer'}} 
                                                                                    color={_.findIndex(groupQuestionData, d => d.type.questionGroupId == tag._id && d.id == que._id) != -1 ? 'green' : 'grey'}
                                                                                    onClick={() => changeGroupData(que, tag)}
                                                                                >
                                                                                    {tag?.type}
                                                                                </Tag>
                                                                            </Tooltip>
                                                                        </div>
                                                                    )}
                                                                )
                                                            :
                                                                <Tag color='red' style={{fontSize: '10px'}}>
                                                                    {que.type != ''? 
                                                                        `NO ${_.toUpper(que.type)} GROUP IN ${_.toUpper(currentSubject?.subjectRefId?.name?.en)}`
                                                                    :  
                                                                        'NO QUESTION TYPE ADDED'
                                                                    }
                                                                </Tag>
                                                            }
                                                        </td>
                                                    </tr>
                                                    {que.type == 'MCQ' ||  que.type == 'SCQ' || que.type == 'mtc_mcq' || que.type == 'mtc_scq' ?
                                                        que.options.length ?
                                                            que.options.map((opt, optIndx) => {
                                                            return(
                                                                    optIndx > 0 ?
                                                                        <tr key={optIndx} style={{border: '1px solid #e2e0e0', padding: '3px'}}>
                                                                            <td style={{border: '1px solid #e2e0e0', padding: '3px', backgroundColor:_.findIndex(que.answer, ans => ans == opt._id ) != -1 ? '#DCEDC8' : ''}}>
                                                                                <div style={{display:'flex'}}>
                                                                                    <div style={{paddingRight:'9px'}}>
                                                                                        {_.findIndex(que.answer, ans => ans == opt._id ) != -1 ? 
                                                                                            <CheckCircleOutlined style={{color:'#4CAF50', fontSize:'18px'}}/>
                                                                                            : null
                                                                                        }
                                                                                    </div>
                                                                                    <div>
                                                                                        {opt.body.en ? <div dangerouslySetInnerHTML={{__html:opt.body.en}} /> : null }
                                                                                        {opt.body.hn ? <div dangerouslySetInnerHTML={{__html:opt.body.hn}} /> : null }
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        :
                                                                    null
                                                                )}
                                                            )
                                                            :
                                                            null
                                                        :
                                                        null
                                                    }
                                                </tbody>
                                            )}
                                        </table>
                                    </div>
                                </div> 
                            : null }
                            {wordUploadTab == 2 ? 
                                <div>
                                    <br/>
                                    {incorrectQuestions.length ?
                                        <table style={{width: '100%', border: '1px solid #e2e0e0', padding: '3px'}}>
                                            <thead style={{border: '1px solid #e2e0e0', padding: '3px'}}>
                                                <tr style={{border: '1px solid #e2e0e0', padding: '3px'}}>
                                                    <th style={{border: '1px solid #e2e0e0', padding: '3px'}}>#</th>
                                                    <th style={{border: '1px solid #e2e0e0', padding: '3px'}}>Question</th>
                                                    <th style={{border: '1px solid #e2e0e0', padding: '3px'}}>Type</th>
                                                    <th style={{border: '1px solid #e2e0e0', padding: '3px'}}>Options</th>
                                                    <th style={{border: '1px solid #e2e0e0', padding: '3px'}}>Answer</th>
                                                    <th style={{border: '1px solid #e2e0e0', padding: '3px'}}>Error</th>
                                                    <th style={{border: '1px solid #e2e0e0', padding: '3px'}}>Actions</th>
                                                </tr>
                                            </thead>
                                            {incorrectQuestions.map((que, i) =>  
                                                <tbody key={i}  style={{border: '1px solid #e2e0e0', padding: '3px'}}>
                                                    <tr  style={{border: '1px solid #e2e0e0', padding: '3px'}}>
                                                        <td style={{border: '1px solid #e2e0e0', padding: '3px'}} rowSpan={que.options.length + 1}>{++i}</td>
                                                        <td style={{border: '1px solid #e2e0e0', padding: '3px'}} rowSpan={que.options.length+ 1}>
                                                            {que.question.en ? <div dangerouslySetInnerHTML={{__html:que.question.en}} /> : null }
                                                            {que.question.hn ? <div dangerouslySetInnerHTML={{__html:que.question.hn}} /> : null }
                                                        </td>
                                                        <td style={{border: '1px solid #e2e0e0', padding: '3px'}} rowSpan={que.options.length + 1}>
                                                            {que.type}
                                                        </td>
                                                        {que.options[0] ? 
                                                            <td style={{border: '1px solid #e2e0e0', padding: '3px', background:_.findIndex(que.answer, ans => ans == que.options[0]._id ) != -1 ? '#DCEDC8' : ''}}>
                                                                <div style={{display:'flex'}}>
                                                                    <div style={{paddingRight:'9px'}}>
                                                                        {_.findIndex(que.answer, ans => ans == que.options[0]._id ) != -1 ? 
                                                                            <CheckCircleOutlined style={{color:'#4CAF50', fontSize:'18px'}}/>
                                                                            : null
                                                                        }
                                                                    </div>
                                                                    <div>
                                                                        {que.options[0].body.en ? <div dangerouslySetInnerHTML={{__html:que.options[0].body.en}} /> : null }
                                                                        {que.options[0].body.hn ? <div dangerouslySetInnerHTML={{__html:que.options[0].body.hn}} /> : null }
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            : 
                                                            <td style={{border: '1px solid #e2e0e0', padding: '3px'}}></td>
                                                        }
                                                        <td rowSpan={que.options.length + 1} style={{border: '1px solid #e2e0e0', padding: '3px'}}>
                                                            {que.type == 'MCQ' || que.type == 'SCQ' || que.type == 'mtc_mcq' || que.type == 'mtc_scq' 
                                                                || que.type == 'paragraph_mcq' || que.type == 'paragprah_scq' ? 
                                                                null
                                                                :
                                                                _.join(que.answer, ',')
                                                            }
                                                        </td>
                                                        <td style={{border: '1px solid #e2e0e0', padding: '3px'}} className='fg-danger' rowSpan={que.options.length + 1}>{QUESTION_ERRORS[que.errors]}</td>
                                                        <td style={{border: '1px solid #e2e0e0', padding: '3px'}} rowSpan={que.options.length + 1}>
                                                            <Button bsStyle='primary' style={{border:'none', padding:'5px'}}  outlined icon={<EditOutlined />}
                                                                onClick={() => _updateQueModal(que)}
                                                            >
                                                            </Button>
                                                            <Button bsStyle='danger' style={{border:'none', padding:'5px'}}  outlined icon={<DeleteOutlined />}
                                                                onClick={() => ConfirmAlert(() =>  removeDocQuestion([que._id], currentSubject?.subjectRefId._id), 'Sure?')} 
                                                            >
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                    {que.options.length ? 
                                                        que.options.map((opt, optIndx) =>
                                                            optIndx > 0 ? 
                                                                <tr key={opt._id} style={{border: '1px solid #e2e0e0', padding: '3px'}}> 
                                                                    <td style={{border: '1px solid #e2e0e0', padding: '3px', background:_.findIndex(que.answer, ans => ans == opt._id ) != -1 ? '#DCEDC8' : ''}}>
                                                                        <div style={{display:'flex'}}>
                                                                            <div style={{paddingRight:'9px'}}>
                                                                                {_.findIndex(que.answer, ans => ans == opt._id ) != -1 ? 
                                                                                    <CheckCircleOutlined style={{color:'#4CAF50', fontSize:'18px'}}/>
                                                                                    : null
                                                                                }
                                                                            </div>
                                                                            <div>
                                                                                {opt.body.en ? <div dangerouslySetInnerHTML={{__html:opt.body.en}} /> : null }
                                                                                {opt.body.hn ? <div dangerouslySetInnerHTML={{__html:opt.body.hn}} /> : null }
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                : null
                                                        )
                                                        :
                                                        null
                                                    }
                                                </tbody>
                                            )}
                                        </table>
                                        : 
                                        <h4 className='text-center'>No Error Questions</h4>
                                    }
                                </div>
                                : null
                            }
                        </div>
                    </div>
                    :
                    null
                }



                <Title style={{textAlign:'center'}} level={2}>Questions</Title>
                {currentSubject?.questionTypeGroup.length ? 
                    currentSubject?.questionTypeGroup.map(grp => 
                        <div key={grp._id}>
                            {grp.questions.length == grp.noOfQuestions ? null : 
                                <Alert 
                                    style={{color: 'white'}}
                                    message={grp.questions.length < grp.noOfQuestions ? `ADD ${grp.noOfQuestions - grp.questions.length} MORE QUESTIONS` : grp.questions.length == grp.noOfQuestions ? 'success' : `ADDED ${grp.questions.length - grp.noOfQuestions} MORE QUESTION THEN REQUIRED`} 
                                    type={grp.questions.length < grp.noOfQuestions ? 'warning' : grp.questions.length == grp.noOfQuestions ? 'success' : 'error'}
                                />
                            }
                            <Card style={{border:'1px solid #D6DBDF', marginBlock:'20px'}} headStyle={{background:'#F4F6F7'}} bodyStyle={{padding:'10px'}}
                                title={<Text style={{fontWeight:'bold'}}>
                                            <Tag color='blue' style={{fontSize:'16px', padding:'6px', border:0, fontWeight:'bold'}}>{QuestionTypes[grp.type]?.shortName}</Tag> 
                                            type questions
                                        </Text>
                                }
                                extra={[<Button disabled={!grp.questions.length} onClick={() => _changeQuestionsOrderModal(grp)} icon={<UnorderedListOutlined />}>Change Order</Button>,
                                    <Button disabled={!grp.questions.length} danger style={{marginLeft:'10px'}} 
                                        onClick={() => removeMultQuestions(grp)} 
                                        icon={<DeleteOutlined />}
                                    >
                                        {groupIdToRemove == grp._id ? 'Cancel' : 'Remove Multiple Questions'}
                                    </Button>
                                ]}
                            >
                                {groupIdToRemove == grp._id ? <Text style={{fontWeight:'bold'}} type='danger'>Select Question To Remove</Text> : null}
                                <Table
                                    key={addReviewedQuestionsStatus+removeQuesionStatus+questionsOrderStatus+addNewTestQuestionStatus}
                                    rowSelection={groupIdToRemove == grp._id ? {type:'selectionType', onChange:selectQuestionsToRemove} : false} 
                                    loading={removeQuesionStatus === STATUS.FETCHING} size='small' bordered 
                                    style={{marginTop:'10px'}} 
                                    dataSource={_.orderBy(grp.questions.map(q => ({...q, key:q.questionRefId._id})), ['order'], ['asc'])} pagination={false}
                                >
                                    <Table.Column width={100} title={<b>#</b>} dataIndex='index' key='index'
                                        render={(d, a, indx) => ++indx}
                                    ></Table.Column>
                                    <Table.Column title={<b>Question</b>} dataIndex='questionRefId' key='questionRefId'
                                        render={que => 
                                            <div id='math-tex-id' dangerouslySetInnerHTML={{__html:que.question && que.question[currentLanguage] ? que.question[currentLanguage] : ''}}/>
                                        }
                                    ></Table.Column>
                                    <Table.Column width={200} title={<b>Actions</b>} dataIndex='actions' key='actions'
                                        render={(a, que) =>
                                            groupIdToRemove == grp._id ? null :
                                            <Tooltip title='Remove'>
                                                <Button onClick={() => removeQuestion(que)} icon={<DeleteTwoTone twoToneColor='#eb2f96'/>}></Button>
                                            </Tooltip>
                                        }
                                    ></Table.Column>
                                </Table>
                                {groupIdToRemove == grp._id ?
                                    <Button disabled={!selectedQuestions.length || (selectedQuestions.length &&  !_.intersection(selectedQuestions, grp.questions.map(q => q._id).length))} 
                                        onClick={removeQuestions}
                                        style={{marginTop:'10px', float:'right'}} icon={<DeleteOutlined/>} danger 
                                    >
                                        Remove Selected Questions
                                    </Button> : null
                                }

                            </Card>
                        </div>
                    )
                    :
                    null
                }
                {questionModalData.status ? 
                    <SelectQuestionModal visible={questionModalData.status} queTypeGroup={questionModalData.data} subject={questionModalData.subject} closeModal={() => questionModalChange({status: false, data: '', subject: ''})}/>
                : null}
                {addTestModal.status ?
                    <AddTestQuestionModal closeModal={_changeAddTestModal} testData={{...addTestModal, data:{...addTestModal.data, subjects:[currentSubject?.subjectRefId._id], exams:currentTest.examRefId?._id ? [currentTest.examRefId._id] : []}}}/>
                    : null
                }
                {questionsOrderModal.status ?
                    <TestQuestionsOrdering visible={questionsOrderModal.status}  closeModal={_changeQuestionsOrderModal} questionsList={questionsOrderModal.data}
                        testData={{testId:currentTest._id, sectionId:currentSubject?._id}}
                    />
                    : null
                }
                {updateQueModal.modal ? 
                    <UpdateQuestionModal 
                        data={updateQueModal.data} 
                        closeModal={closeUpdateQueModal} 
                        visible={updateQueModal.modal}
                        wordUpload={true}
                        newUpdatedQuestion={(que) => dispatch(newUpdatedQuestionAction({que: que, subjectId: currentSubject?.subjectRefId._id}))}
                    /> 
                : null}
                {wordQuestionModal.modal ? 
                    <WordQuestionModalData 
                        visible={wordQuestionModal.modal} 
                        subject={wordQuestionModal.data}
                        currentTest={currentTest} 
                        closeModal={() => changeWordQuestionModal({modal: false, data: ''})}
                    />
                : null}
            </div>
        : 
        <div style={{textAlign:'center'}}>
            <Text style={{fontSize:'18px' }} type='secondary'>Add Subjects First</Text>
        </div>
    )
}

const AddQuestionCard = ({currentSubject, selectQuestions, changeAddTestModal}) => {
    return(
        <Table bordered size='small' dataSource={currentSubject?.questionTypeGroup} pagination={false}>
            <Table.Column title={<b>Question Type</b>} dataIndex='type' key='type'
                render={d => <Tag color='blue' style={{fontSize:'14px'}}>{QuestionTypes[d]?.shortName}</Tag>}
            ></Table.Column>
            <Table.Column title={<b>Marks</b>} dataIndex='markingScheme' key='markingScheme'
                render={(marking, a) => { 
                    return(<Text >{marking.correct ? `+${marking.correct}` : null}{marking.incorrect ? ` / -${marking.incorrect}` : null}</Text>)
                }}
            ></Table.Column>
            <Table.Column title={<b>Added Questions</b>} dataIndex='noOfQuestions' key='noOfQuestions'
                render={(d, a) => { 
                    let type =  a.questions.length < d ? 'warning' : a.questions.length == d ? 'success' : 'danger'
                    return(<Text type={type} style={{fontWeight:'bold'}} >{a.questions.length}/{d}</Text>)
                }}
            ></Table.Column>
            <Table.Column title={<b>Actions</b>} dataIndex='actions' key='actions'
                render={(d, group) => {
                    let disable = group.questions?.length === group.noOfQuestions
                    return (
                        <Space>
                            <Button icon={<SelectOutlined />} disabled={disable} onClick={() => selectQuestions(group)}>Select From Question Bank</Button>
                            <Button icon={<PlusOutlined/>} disabled={disable} onClick={() => changeAddTestModal(group)}>Add New Question</Button>
                        </Space>
                    )
                }}
            ></Table.Column>
        </Table>
    )
}