import { UploadOutlined, PrinterOutlined, FileOutlined, CloseCircleOutlined, FileTwoTone, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { current } from '@reduxjs/toolkit'
import { Button, Card, Form, Input, Select, Space, Table, Tag, Tooltip, Upload } from 'antd'
import Text from 'antd/lib/typography/Text'
import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { printHelper, PRINT_TYPE, STATUS } from '../../Constants'
import { downloadAnswerKeysAction, getSingleTestAction, uploadAnswerKeysAction, uploadQuePaperAction } from '../../redux/reducers/test'
import _ from 'lodash'
import { useState } from 'react'
import { renderMathTex, sheetToJSON } from '../../utils/FileHelper'
import {AnswerKeyTable} from './AnswerKeyTable'
import { BaseURL } from '../../BaseUrl'
import { ConfirmAlert } from '../../Constants/CommonAlerts'

export const AnswerKeys = () => {
    const dispatch = useDispatch()
    const params = useParams()
    const [form] = Form.useForm()

    const {getTestStatus, currentTest, configData, downloadKeysStatus, uploadKeysStatus, uploadQuePaperStatus} = useSelector(state => ({
        getTestStatus:state.test.getTestStatus,
        currentTest:state.test.currentTest,
        configData: state.lmsConfig,
        downloadKeysStatus:state.test.downloadAnswerKeysStatus,
        uploadKeysStatus:state.test.uploadAnswerKeysStatus,
        uploadQuePaperStatus:state.test.uploadQuePaperStatus
    }))

    const [subjects, setsubjects] = useState([])
    const [excelData, onSave] = useState([])
    const [formKey, changeFormKey] = useState()
    const [language, changeLanguage] = useState('en')

    useEffect(() => {
        dispatch(getSingleTestAction({testId:params.id}))
    }, [])

    useEffect(() => {
        if(uploadKeysStatus == STATUS.SUCCESS){
            form.resetFields()
            changeFormKey(formKey+1)
        }
    }, [uploadKeysStatus])

    useEffect(() => {
        if(configData.defaultDataStatus == STATUS.SUCCESS){
            let defaultData = configData.defaultData
            if(defaultData)
            setsubjects(defaultData.subjects)
        }
    }, [configData.defaultData, configData.defaultDataStatus])

    const selectFile = (data) => {
        sheetToJSON(data.target.files, onSave)
    }

    const uploadFile = () => {
        dispatch(uploadAnswerKeysAction({answerData:excelData, testId:params.id}))
    }

    const downloadExcel = () => {
        dispatch(downloadAnswerKeysAction({testId:params.id}))
    }

    const selectLanguage = (e) => {
        changeLanguage(e)
    }

    useEffect(() => {
        if(document.getElementById('math-tex-id'))
            renderMathTex()
    })

    // useEffect(() => {
    //     if(getTestStatus === STATUS.SUCCESS){
    //         renderFun()
    //     }
    // }, [getTestStatus])

    // const renderFun = () => {
    //     window.renderMathInElement(document.getElementById("math-tex-id", {
    //         delimiters: [
    //             { left: "$", right: "$", display: true }
    //         ]
    //     })); 
    // }


    const questions = currentTest?.sections?.length ? _.flatMap(currentTest.sections, sec => sec.questions) : []

    const printAnswerKey = (answerData) => {
        const data = {...answerData}
        printHelper(PRINT_TYPE.TEST_ANSWER_KEY, data)
    }

    const [paperUploading, setPaperUploading] = useState()
    const uploadPaper = (obj) => {
        setPaperUploading(obj.file.status === "uploading")
        
        if(obj.file?.response)
            dispatch(uploadQuePaperAction({testId:currentTest._id, answerKey:obj.file.response.url}))
    }

    const deleteAnswerKeysFile = () => {
        ConfirmAlert(() => dispatch(uploadQuePaperAction({testId:currentTest._id, answerKey:''})), 
            'Are you sure?', null, 
            uploadQuePaperStatus === STATUS.FETCHING
        )
    }

    return(
        <div>
            <CommonPageHeader title='Answer Keys'/>
            <br/>
            <Card loading={getTestStatus == STATUS.FETCHING} style={{minHeight:'400px'}}>
                {getTestStatus == STATUS.SUCCESS ? 
                    <>
                        <Text style={{fontSize:'18px', fontWeight:'bold'}}>Instructions</Text>
                        <ul>
                            <li>For Single correct answers, enter single option (Eg. B).</li>
                            <li>For Multiple correct answers, enter correct options without any separator in between (Eg. BC ; ACD).</li>
                            <li>For Numerical answers, enter single number in case of single correct answer (Eg. 2.5).</li>
                            <li>For Numerical answers, enter minimum, maximum in case of range of correct answer (Eg. 2,3).</li>
                            <li>For marking questions as Bonus (positive marks given to all students), write bonus in answer column in excel.</li>
                            <li>For marking questions as Discarded (zero marks given to all students), write discarded in answer column in excel.</li>
                        </ul>
                        <br/>
                        <Space size='large'>
                            <Form.Item label='Language'>
                                <Select defaultValue='en' style={{width:'200px'}} onChange={selectLanguage}>
                                    <Select.Option value='en'>English</Select.Option>
                                    <Select.Option value='hn'>Hindi</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label='Download Excel'>
                                <Button onClick={downloadExcel} loading={downloadKeysStatus == STATUS.FETCHING}>Download</Button>
                            </Form.Item>
                            <Form form={form} key={formKey}>
                                <Form.Item label='Upload Excel'>
                                    <div style={{display:'flex'}}>
                                        <Input style={{padding:0}} type='file' onChange={selectFile}/>
                                        {excelData?.length ? <Button icon={<UploadOutlined/>} loading={uploadKeysStatus == STATUS.FETCHING} onClick={uploadFile} style={{marginLeft:'10px'}} >Upload</Button> : null }
                                    </div>
                                </Form.Item>
                            </Form>
                            <Form form={form} key={formKey}>
                                <Form.Item label='Print Answer Key'>
                                    <div style={{display:'flex'}}>
                                        <Button icon={<PrinterOutlined/>} type='primary' onClick={() => printAnswerKey({questions: questions, subjects:subjects, language:language})}>Print Answer Key</Button>
                                    </div>
                                </Form.Item>
                            </Form>
                        </Space>
                        <div>
                            <Form.Item label='Upload answer keys for students'>
                                <Upload
                                    action={BaseURL + "app/file"}
                                    listType="picture"
                                    showUploadList={false}
                                    onChange={uploadPaper}
                                    maxCount={1}
                                >
                                    <Button loading={paperUploading} icon={<UploadOutlined />}>Upload</Button>
                                </Upload>&nbsp;&nbsp;&nbsp;
                            </Form.Item>
                        </div>
                        {currentTest.answerKey ?
                            <div style={{display:'flex', justifyContent:'space-between', border:'1px solid #D6DBDF', width:'30vw', background:'#FAFAFA', 
                                fontSize:'14px', padding:8}}
                            >
                                <div><FileTwoTone /> Uploaded Answer Keys</div>
                                <Space>
                                    <Tooltip title='view'>
                                        <EyeOutlined style={{cursor:'pointer', fontSize:'16px'}} onClick={() => window.open(currentTest.answerKey)} />
                                    </Tooltip>
                                    <Tooltip title='delete file'>
                                        <DeleteOutlined style={{cursor:'pointer', fontSize:'16px'}} onClick={deleteAnswerKeysFile} />
                                    </Tooltip>
                                </Space>
                            </div>
                            : null
                        }<br/><br/>
                        <div id='math-tex-id'>
                            <AnswerKeyTable questions={questions} subjects={subjects} language={language}/>
                        </div>
                    </>
                    :
                    <div style={{textAlign:'center'}}>
                        <Text style={{ fontSize:'16px'}}>Something Went Wrong</Text>
                    </div>
                }
            </Card>
        </div>
    )
}
