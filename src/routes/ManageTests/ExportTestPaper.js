import { DeleteOutlined, EyeOutlined, FileTwoTone, LoadingOutlined, PrinterOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Col, Form, Radio, Row, Space, Tooltip, Upload } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { printHelper, PRINT_TYPE, STATUS } from '../../Constants'
import { getSingleTestAction, uploadQuePaperAction } from '../../redux/reducers/test'
import { TestPaperPrint } from './TestPaperPrint'
import _ from 'lodash'
import Text from 'antd/lib/typography/Text'
import { UpdateQuestionModal } from '../../components/UpdateQuestionModal'
import { BaseURL } from '../../BaseUrl'
import { ConfirmAlert } from '../../Constants/CommonAlerts'

export const ExportTestPaper = () => {
    const dispatch = useDispatch()
    const params = useParams()

    const {currentTest, user, getTestStatus, uploadQuePaperStatus} = useSelector(state => ({
        currentTest:state.test.currentTest,
        getTestStatus:state.test.getTestStatus,
        user:state.user,
        uploadQuePaperStatus:state.test.uploadQuePaperStatus
    }))

    let [bilingual, setBilingual] = useState({column:false, languages:['en']})
    let [showSolution, changeShowSolution] = useState(false)
    let [showAnswer, changeShowAnswer] = useState(false)
    let [questionsIndexing, changeQuestionsIndexing] = useState(false)
    const [updateQueModal, changeUpdateQueModal] = useState(false)
    const [loading, setLoading] = useState(false) 

    const filters = {test:currentTest, user, bilingual, showSolution, showAnswer, questionsIndexing}
    
    useEffect(() => {
        dispatch(getSingleTestAction({testId:params.id}))
    }, [dispatch])

    const printPaper = () => {
        const data = { ...filters, user, timeout:2000}
        printHelper(PRINT_TYPE.TEST_PAPER, data)
    }

    const changeBilingual =(e) => {
        if(e.target.value == 'english'){
            setBilingual({column:false, languages:['en']})
        }else if(e.target.value == 'bilingualRow'){
            setBilingual({column:false, languages:['hn', 'en']})
        }else if(e.target.value == 'bilingualColumn'){
            setBilingual({column:true, languages:['hn', 'en']})
            setLoading(true)
            setTimeout(() => setLoading(false), 2000)
        }
    }

    const _showSolution = () => {
        changeShowSolution(!showSolution)
    }

    const _showAnswer = () => {
        changeShowAnswer(!showAnswer)
    }

    const _questionsIndexing = () => {
        changeQuestionsIndexing(!questionsIndexing)
    }
    
    const _updateQueModal = (data) => {
        changeUpdateQueModal(data)
    }

    const closeUpdateQue = (data) => {
        changeUpdateQueModal(false)
    }

    const [paperUploading, setPaperUploading] = useState()
    const uploadPaper = (obj) => {
        setPaperUploading(obj.file.status === "uploading")
        
        if(obj.file?.response)
            dispatch(uploadQuePaperAction({testId:currentTest._id, questionPaper:obj.file.response.url}))
    }

    const deleteQuePaper = (e) => {
        ConfirmAlert(() => dispatch(uploadQuePaperAction({testId:currentTest._id, questionPaper:''})), 
            'Are you sure?', null, 
            uploadQuePaperStatus === STATUS.FETCHING
        )
    }

    let lastIndex = 0
    let subjects = currentTest ?
        questionsIndexing ?
            _.orderBy(currentTest.sections, ['order'], ['asc']).map(sec => ({...sec, questionTypeGroup:_.orderBy(sec.questionTypeGroup, ['order'], ['asc']).map(grp => 
                ({...grp, questions:sec.questions.length ? _.orderBy(_.filter(sec.questions,que => que.type?.questionGroupId == grp._id), ['order'], ['asc']) : []}))})
            ).map(sec => ({...sec, questions:_.flatMap(sec.questionTypeGroup,grp => _.map(grp.questions,(que) => que)).map((que, i) => ({...que, finalSequence:++i}))}))
            .map(sec => ({...sec, questionTypeGroup:sec.questionTypeGroup.map(grp => ({...grp, questions:_.filter(sec.questions,q => q.type?.questionGroupId == grp._id)}))}))
            :
            _.orderBy(currentTest.sections, ['order'], ['asc']).map(sec => ({...sec, questionTypeGroup:_.orderBy(sec.questionTypeGroup, ['order'], ['asc']).map(grp => 
                ({...grp, questions:sec.questions.length ? _.orderBy(_.filter(sec.questions,que => que.type?.questionGroupId == grp._id), ['order'], ['asc']) : []}))})
            ).map(sec => ({...sec, questions:_.flatMap(sec.questionTypeGroup,grp => _.map(grp.questions,(que) => que)).map((que) => ({...que, finalSequence:++lastIndex}))}))
            .map(sec => ({...sec, questionTypeGroup:sec.questionTypeGroup.map(grp => ({...grp, questions:_.filter(sec.questions,q => q.type?.questionGroupId == grp._id)}))}))
        :   
        []
    
    return(
        <div>
            <CommonPageHeader title='Export Test Paper'/>
            <br/>
            <Card loading={getTestStatus == STATUS.FETCHING}>
                {getTestStatus == STATUS.SUCCESS && currentTest ? 
                    <>
                        <Card bodyStyle={{padding:'10px'}}>
                            <Form.Item label=''>
                                <Radio.Group name='language' onChange={changeBilingual}
                                    value={bilingual.languages.length == 1 ? 'english' : 
                                        bilingual.column ? 'bilingualColumn' : 'bilingualRow'
                                    }
                                >
                                    <Radio value='english'>English</Radio>
                                    <Radio value='bilingualRow'>Bilingual (rows)</Radio>
                                    <Radio value='bilingualColumn'>Bilingual (columns)</Radio>
                                </Radio.Group>
                                <br/><br/>
                                <Checkbox checked={showSolution} onClick={_showSolution}>Show Solution</Checkbox>
                                <Checkbox checked={showAnswer} onClick={_showAnswer}>Show Answers</Checkbox>
                                <Checkbox checked={questionsIndexing} onClick={_questionsIndexing}>Subject wise indexing of questions</Checkbox>
                            </Form.Item>
                            <Button icon={<PrinterOutlined/>} type='primary' onClick={printPaper}>Print Paper</Button><br/><br/>
                            <Space>
                                <Upload
                                    action={BaseURL + "app/file"}
                                    listType="picture"
                                    showUploadList={false}
                                    onChange={uploadPaper}
                                    maxCount={1}
                                >
                                    <Button loading={paperUploading} icon={<UploadOutlined />}>Upload Question Paper</Button>
                                </Upload>
                                {currentTest.questionPaper ?
                                    <div style={{display:'flex', justifyContent:'space-between', border:'1px solid #D6DBDF', width:'30vw', background:'#FAFAFA', 
                                        fontSize:'14px', padding:8}}
                                    >
                                        <div><FileTwoTone /> Uploaded Question Paper</div>
                                        <Space>
                                            <Tooltip title='view'>
                                                <EyeOutlined style={{cursor:'pointer', fontSize:'16px'}} onClick={() => window.open(currentTest.questionPaper)} />
                                            </Tooltip>
                                            <Tooltip title='delete file'>
                                                <DeleteOutlined style={{cursor:'pointer', fontSize:'16px'}} onClick={deleteQuePaper} />
                                            </Tooltip>
                                        </Space>
                                    </div>
                                    : null
                                }
                            </Space>
                        </Card>
                        <br/><br/>
                        <Row>
                            <Col span={24}>
                                <Text style={{fontSize:'20px', fontWeight:'bold'}} >Edit Questions</Text><br/>
                                {subjects.length ?
                                    subjects.map(subj => 
                                        <div key={subj._id} style={{padding:'10px'}}>
                                            <Text style={{fontSize:'16px', display:'flex', flexWrap:'wrap', fontWeight:'bold', marginBottom:'5px'}} >{subj.subjectRefId.name.en} </Text>
                                            {subj.questionTypeGroup.length ?
                                                subj.questionTypeGroup.map(grp => 
                                                    grp.questions.length ? 
                                                        grp.questions.map(que => 
                                                            <Button key={que._id} type='primary' ghost style={{margin:'0 0 5px 5px', borderRadius:'10px'}}
                                                                onClick={() => _updateQueModal({...que.questionRefId, updateType:'testQuestion', sectionId:subj._id})}
                                                            >
                                                                <b>Que {que.finalSequence}</b>
                                                            </Button>
                                                        )
                                                        :
                                                        null
                                                )
                                                :
                                                null
                                            
                                            }
                                        </div>
                                    )
                                    :
                                    null
                                }
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col span={28}>
                                <div style={{backgroundColor:'white', overflowY:'auto', overflowX:'hidden', position:'relative', boxShadow:'0 0 5px rgba(0, 0, 0, 0.4)', width:'610pt', height:'742pt', paddingLeft:"20pt"}}>
                                    <div style={{ width:'700px'}}>
                                        {loading ?
                                            <LoadingOutlined />
                                            :
                                            <TestPaperPrint {...filters} notPrint
                                                user={user}  
                                            />
                                        }
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </>
                    :
                    <div>

                    </div>
                }
            </Card>
            {updateQueModal ? <UpdateQuestionModal data={updateQueModal} closeModal={closeUpdateQue} visible={updateQueModal}/> : null}
        </div>
    )
}