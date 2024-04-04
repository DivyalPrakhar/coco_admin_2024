import { Modal, Input, Row, Col, Button, Alert, Tag, Divider } from 'antd'
import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import { resetAddNewBulkQuestion, wordBulkQuestionUploadAction, excelBulkQuestionUploadAction } from '../../redux/reducers/questions'
import {QuestionTypeNames} from '../../utils/QuestionTypeHelper'
import _ from 'lodash';
import { sheetToJSON } from '../../utils/FileHelper';

export const BulkQuestionUploadModal = ({visible, closeModal}) => {
    const dispatch = useDispatch()
    const [enState, setEnState] = useState()
    const [hnState, setHnState] = useState()
    const [excelQuestions, setExcelQuestion] = useState([])

    const {wordBulkQuestionUploadStatus} = useSelector((state) => ({
        wordBulkQuestionUploadStatus: state.questions?.wordBulkQuestionUploadStatus,
    }))

    useEffect(() => {
        dispatch(resetAddNewBulkQuestion())
    }, [])

    const onSave = (excelData) => {
        let columns = _.keys(excelData[0]).map(d => ({title:d, dataIndex:d, key:d}))
        
        columns = columns.map((d, i) => d)
        //_.forEach(columns, d => d.render ? setRequired(r => r + 1) : null)
        let optionColums = _.filter(columns, c => _.includes(c.key, 'Option'))
        optionColums = _.map(_.filter(optionColums, o => _.includes(o.key, 'Option-En')), opt => opt.key.split('-')[2])
        
        let newExcelData = excelData.map((d, i) => ({...d, key:++i}))
        let bulkQuestions = _.map(excelData, e => {
            return({
                answer: [e.answer],
                boards: [],
                display_id: new Date(),
                exams: [],
                options: _.map(optionColums, (d,i) => {
                    return({
                        'body':{
                            en: e['Option-En-'+d],
                            hn: e['Option-Hn-'+d]
                        },
                        'key':{
                            en: d,
                            hn: d
                        }
                    })
                }),
                paragraph: null,
                question: {en: e['Question-En'], hn: e['Question-Hn'], html: false},
                solution: {en: e['Solution-En'], hn:  e['Solution-Hn'], html: false},
                standards: [],
                subjects: [],
                type: e.type
            })
        })
        setExcelQuestion(bulkQuestions)
    }

    const uploadWordQuestion = () => {
        if(enState?.type === 'text/csv'){
            dispatch(excelBulkQuestionUploadAction(excelQuestions))
        }else{
            let formData = new FormData()
            formData.append('testId', '')
            formData.append('subjectId', '')
            formData.append('questionsData',true)
            if(enState){
                formData.append('upload', enState)
            }
            // if(hnState){
            //     formData.append('hn', hnState)
            // }
            dispatch(wordBulkQuestionUploadAction(formData))
        }
    }

    const excelDataUpload = (e) => {
        setEnState(e.target.files[0])
        sheetToJSON(e.target.files, onSave)
    }

    return(
        <Modal visible={visible} width={1400} onCancel={closeModal} title={<b>Upload Question</b>} footer={null}>
            <div>
                <Alert message={
                    <div>
                        <b>Question Document Upload Instructions</b><br/>
                        <ul>
                          <li>Use the exact format given in <i>Sample Document</i></li>
                          <li>
                            {'Use Question Type from below ' + _.filter(QuestionTypeNames, d => d.type != 'paragraph_scq' && d.type != 'paragraph_mcq').length + ' types only:'}
                            <div style={{ display: 'flex', flexWrap: 'wrap'}}>
                              {_.chain(QuestionTypeNames).filter(d => d.type != 'paragraph_scq' && d.type != 'paragraph_mcq').map((s,i) =>(
                                <div style={{ flex: '1 1 200px' }}>
                                  <span style={{margin: '5px'}}>{i+1}.</span>
                                  <span>
                                    {s.type == 'Integer' ? 'Integer (Numerical)' : s.type}
                                  </span>
                                </div>
                              )).value()}
                            </div>
                          </li>
                          <li>Use "Integer" for range between two numbers. For example, if answer is between 1 and 4, write 1,4 in answer section.</li>
                        </ul>
                    </div>
                } type="success" />
                <br/>
                <Divider plain>UPLOAD WORD FILE</Divider>
                <Row>
                    <Col span={24}>
                        <div>
                            <div>Select Questions Word File</div>
                            <Input onChange={(e) => setEnState(e.target.files[0])} type='file' accept="application/msword, .doc, .docx, .odt"/>
                        </div>
                        <b>Download Doc Sample: </b><a href='/sample_files/BilingualQueDoc.doc' download='BilingualQueDoc.doc'>Download</a>
                    </Col>
                    {/*<Col span={11} offset={2}>
                        <div>
                            <div>Select Hindi Questions Word File</div>
                            <Input onChange={(e) => setHnState(e.target.files[0])} type='file' accept="application/msword, .doc, .docx, .odt" /> 
                        </div>
                        <b>Download Hindi Doc Sample: </b> <a href='/sample_files/hindiQuestionsDoc.doc' download='HindiQuestionsDocSample.doc'>Download</a>&nbsp;&nbsp;*Hindi Kruti dev font preferred
                    </Col>*/}
                </Row>
                <Divider plain>UPLOAD EXCEL FILE</Divider>
                <Row>
                    <Col span={24}>
                        <div>
                            <div>Select English Questions Excel File</div>
                            <Input onChange={(e) => excelDataUpload(e)} type='file' accept=".csv"/>
                        </div>
                        <b>Download Excel Sample: </b><a href='/sample_files/QuestionExcel.csv' download='QuestionExcel.csv'>Download</a>
                    </Col>
                </Row>
                <br/><br/>
                <Row>
                    <Col span={24}>
                        <Button type="primary" loading={wordBulkQuestionUploadStatus === STATUS.FETCHING} block onClick={() => uploadWordQuestion()}>Add Question To Review</Button>
                    </Col>
                </Row>
            </div>
        </Modal>
    )
}