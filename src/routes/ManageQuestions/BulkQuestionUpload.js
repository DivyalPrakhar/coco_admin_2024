import { CheckCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button, Card, Empty, Form, Input, Popover, Space, Tag, Row, Col, Badge,  } from 'antd'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { STATUS } from '../../Constants'
import _ from 'lodash'
import {BulkQuestionUploadModal} from './BulkQuestionUploadModal'
import { QuestionTypes, incorrectQuestion, QUESTION_ERRORS, colorArray } from '../../utils/QuestionTypeHelper'
import { UpdateQuestionModal } from '../../components/UpdateQuestionModal'
import { updateQuestionData, removeDocQuestion, bulkQuestionsToBankAction } from '../../redux/reducers/questions'
import { ConfirmAlert } from '../../Constants/CommonAlerts'

export const BulkQuestionUpload = () => {
    const dispatch = useDispatch()
    let [wordQuestionModal, changeWordQuestionModal] = useState(false)
    const [stateData, stateDataChange] = useState({subjects: [], exams: []})
    const [tagsList, setTagsList] = useState()

    const {defaultSyllabus, wordBulkQuestionUploadStatus, questions} = useSelector((state) => ({
        wordBulkQuestionUploadStatus: state.questions?.wordBulkQuestionUploadStatus,
        questions: state.questions,
        defaultSyllabus : state.lmsConfig.defaultData,
    }))

    const selectItem = (name, newItem) => {
        let items = stateData[name]
        let select = _.findIndex(items, it => it == newItem) == -1

        if(select) {
            stateDataChange({...stateData, [name]: _.concat(items, newItem)})
        } else {
            stateDataChange({...stateData, [name]: _.filter(items, it => it != newItem)})
        }
    }

    useEffect(() => {
        if(wordBulkQuestionUploadStatus === STATUS.SUCCESS){
            changeWordQuestionModal(false)
        }
    }, [wordBulkQuestionUploadStatus])

    useEffect(() => {
        if(questions.bulkQuestionsToBankStatus === STATUS.SUCCESS){
            stateDataChange({subjects: [], exams: []})
        }
    }, [questions.bulkQuestionsToBankStatus])

    const { CheckableTag } = Tag;
    return(
        <div>
            <CommonPageHeader title='Bulk Question Upload' />
            <br/>
            <Card loading={false}>
                <div>
                    <h3><b>Subjects</b></h3>
                    {defaultSyllabus?.subjects.map((s,i) => (
                        <CheckableTag style={{border: '.1px solid black', margin: '4px'}} key={i} checked={_.findIndex(stateData.subjects, b => b == s._id) != -1} onChange={() => selectItem('subjects', s._id)}>
                            {s.name.en}
                        </CheckableTag>
                    ))}
                </div>
                <br/>
                <div>
                    <h3><b>Exams</b></h3>
                    {defaultSyllabus?.exams.map((s,i) => (
                      <CheckableTag style={{border: '.1px solid black', margin: '4px'}} key={i} checked={_.findIndex(stateData.exams, b => b == s._id) != -1} onChange={() => selectItem('exams', s._id)}>
                        {s.name.en}
                      </CheckableTag>
                    ))}
                </div>
                <br/>
                <br/>
                <div>
                    <Button onClick={() => changeWordQuestionModal(true)}>Upload Data</Button>      
                    {questions?.bulkQuestionData?.length != 0 ? 
                        <div>
                            <QuestionReviewComponent 
                                bulkQuestions={questions?.bulkQuestionData}
                                stateData={stateData}
                            />
                        </div>             
                    : null}
                </div>
            </Card>
            {wordQuestionModal ? 
                <BulkQuestionUploadModal 
                    visible={wordQuestionModal} 
                    closeModal={() => changeWordQuestionModal(false)}
                />
            : null}
        </div>
    )
}

const QuestionReviewComponent = ({bulkQuestions, stateData}) => {
    const dispatch = useDispatch()
    const [wordUploadTab, changeWordUploadTab] = useState(1)
    const [incorrectQuestions, changeIncorrectQuestions] = useState([])
    const [updateQueModal, changeUpdateQueModal] = useState({modal: false, data: ''})  

    useEffect(() => {
        if(bulkQuestions){
            changeIncorrectQuestions(bulkQuestions.length != 0 ? _.filter(_.map(bulkQuestions, que => incorrectQuestion(que)), que => que.errors): [])
        }
    }, [bulkQuestions])

    const _updateQueModal = (data) => {
        changeUpdateQueModal({modal:true, data: Object.assign({}, data, {exams: stateData.exams, subjects: stateData.subjects})})
    }

    const closeUpdateQueModal = () => {
        changeUpdateQueModal({modal: false, data: ''})
    }

    const updateQuestion = (que) => {
        dispatch(updateQuestionData({...que, display_id: updateQueModal.data.display_id}))
        changeUpdateQueModal({modal: false, data: ''})
    }

    const addReviewedQuestions = () => {
        let data = _.map(bulkQuestions, d => Object.assign({}, d, {exams: stateData.exams, subjects: stateData.subjects}))
        dispatch(bulkQuestionsToBankAction(data))
    }

    return(
        <div>
        {bulkQuestions?.length != 0 ?
            <div>
                <br/>   
                <h4 style={{fontWeight:'bold', textAlign:'center', fontSize:'22px'}}>Review Word Questions</h4>
                <div style={{padding:'12px 5px', fontSize:'16px', margin:'0px 10px', border:'1px solid #F2F3F4', minHeight:'300px', borderRadius:'5px', boxShadow:' inset 2px 0px 11px 5px rgba(0,0,0,0.05)'}}>
                    <Row style={{cursor:'pointer', textAlign:'center', margin:'0px 6px'}}>
                        <Col sm={12} 
                            onClick={() => changeWordUploadTab(1)} 
                            style={{background:wordUploadTab == 1 ? '#2471A3' : '', 
                                border:wordUploadTab == 1 ? '1px solid #2471A3' : '', 
                                color:wordUploadTab == 1 ? 'white' : '',
                                boxShadow:wordUploadTab == 1 ? '3px 3px 8px rgba(0, 0, 0, 0.5)' : ''
                            }}
                        >
                            <b>Questions Preview</b>
                        </Col>
                        <Col sm={12}
                            onClick={() => changeWordUploadTab(2)} 
                            style={{background:wordUploadTab == 2 ? '#2471A3' : '', 
                                border:wordUploadTab == 2 ? '1px solid #2471A3' : '', 
                                color:wordUploadTab == 2 ? 'white' : '',
                                boxShadow:wordUploadTab == 2 ? '3px 3px 8px rgba(0, 0, 0, 0.5)' : ''
                            }}
                        >
                            <b>Errors</b>&nbsp;&nbsp;
                            <Badge count={incorrectQuestions.length} />
                        </Col>
                    </Row>
                    {wordUploadTab == 1 ?
                        <div>
                            <div style={{background:'white', padding:'9px', background:'#F4F6F7', border:'1px solid #D6DBDF', borderRadius:'3px', margin:'10px'}}>
                                No errors in uploaded questions. You can add them to Question Bank now. &nbsp;
                                <Button 
                                    disabled={incorrectQuestions.length} 
                                    type='primary' 
                                    onClick={() => ConfirmAlert(() => addReviewedQuestions(), 'You reviewed all questions?')}
                                >
                                    Add Questions to Question Bank
                                </Button>
                            </div><br/>

                            <div style={{padding:'0 10px'}}>
                                <Button 
                                    type='danger' 
                                    onClick={() => dispatch(removeDocQuestion())}
                                >
                                    Delete All Questions
                                </Button>
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
                                        </tr>
                                    </thead>
                                    {_.filter(_.map(bulkQuestions || [], que => incorrectQuestion(que)),que => !que.errors).map((que,i) =>
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
                                                                {_.findIndex(que.answer, ans => ans == que.options[0]._id || ans == que.options[0].key.en) != -1 ? 
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
                                                <td rowSpan={que.options.length + 1} style={{width:'100px', border: '1px solid #e2e0e0', padding: '3px'}}>
                                                    <Button bsStyle='primary' style={{border:'none', padding:'5px'}} outlined
                                                        onClick={() => _updateQueModal(que)}
                                                    >
                                                       <EditOutlined />
                                                    </Button>
                                                    <Button bsStyle='danger' style={{border:'none', padding:'5px'}} outlined
                                                        onClick={() => dispatch(removeDocQuestion({display_id: que.display_id}))}
                                                    >
                                                        <DeleteOutlined />
                                                    </Button>
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
                                                                                {_.findIndex(que.answer, ans => ans == opt._id || ans == opt.key.en) != -1 ? 
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
                                                                {_.findIndex(que.answer, ans => ans == que.options[0]._id || ans == que.options[0].key.en) != -1 ? 
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
                                                    <Button bsStyle='primary' style={{border:'none', padding:'5px'}}  outlined
                                                        onClick={() => _updateQueModal(que)}
                                                    >
                                                        <EditOutlined />
                                                    </Button>
                                                    <Button bsStyle='danger' style={{border:'none', padding:'5px'}}  outlined
                                                        onClick={() => dispatch(removeDocQuestion({display_id: que.display_id}))} 
                                                    >
                                                        <DeleteOutlined />
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
                                                                        {_.findIndex(que.answer, ans => ans == opt._id || ans == opt.key.en) != -1 ? 
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
        : null}
        {updateQueModal.modal ? 
            <UpdateQuestionModal 
                data={updateQueModal.data} 
                closeModal={closeUpdateQueModal} 
                visible={updateQueModal.modal}
                bulkQuestions={true}
                dataToBulk={(que) => updateQuestion(que)}
            /> 
        : null}
        </div>
    )
}