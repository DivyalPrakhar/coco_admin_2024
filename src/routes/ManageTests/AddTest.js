import { CheckCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Space, Switch, Tabs, Tag } from 'antd'
import Text from 'antd/lib/typography/Text'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { STATUS } from '../../Constants'
import { getSingleTestAction, resetAddTest, resetSingleTestAction, getAllInstructionAction, updateTestAction, readyTestAction } from '../../redux/reducers/test'
import { AddQuestionToTest } from './AddQuestionToTest'
import { AddSubjectToTest } from './AddSubjectToTest'
import { AddTestDeatils } from './AddTestDetails'
import { ScheduleTest } from './ScheduleTest'
import { TestSettings } from './TestSettings'
import { useAuthUser } from "../../App/Context";
import { AssignTestSyllabus } from './AssignTestSyllabus'
import { FinalTestStep } from './FinalTestStep'

export const CurrentTestContext = React.createContext()

export const AddTest = () => {
    const history = useHistory()
    const auth = useAuthUser()
    const params = useParams()
    const dispatch = useDispatch()
    let tabs = [
        {id:1, title:'Test Details', step:1},
        {id:2, title:'Add Subjects', step:2},
        //{id:3, title:'Assign and Schedule', step:3},
        {id:4, title:'Assign Syllabus', step:3},
        {id:5, title:'Add Questions', step:4},
        {id:6, title:'Test Settings', step:5},
        {id:7, title:'Review', step:6}
    ]

    const {test, wordQuestionUploadStatus, addReviewedQuestionsStatus, readyTestStatus} = useSelector((state) => ({
        test:state.test,
        wordQuestionUploadStatus: state.test.wordQuestionUploadStatus,
        addReviewedQuestionsStatus: state.test.addReviewedQuestionsStatus,
        readyTestStatus:state.test.readyTestStatus
    }))

    useEffect(() => {
        dispatch(getAllInstructionAction({instituteId: auth?.staff.institute._id}))
        
        return () => {
            dispatch(resetSingleTestAction())
        }
    }, [auth?.staff?.institute._id, dispatch])

    useEffect(() => {
        if(params.id && test.currentTest?._id !== params.id){
            dispatch(getSingleTestAction({testId:params.id, withSyllabus:true}))
        }
    }, [dispatch, params.id, test.currentTest?._id])

    // useEffect(() => {
    //     if(params.id && wordQuestionUploadStatus === STATUS.SUCCESS){
    //         dispatch(getSingleTestAction({testId:params.id, withSyllabus:true}))
    //     }
    // }, [dispatch, params.id, wordQuestionUploadStatus])

    const changeTab = (tab) => {
        if(params.step != tab)
            if(params.step && params.id)
                history.push(`/update-test/${params.id}/${tab}`)
    }

    const prevTab = () => {
        history.push(`/update-test/${params.id}/${parseInt(params.step) - 1}`)
    }

    const nextTab = () => {
        history.push(`/update-test/${params.id}/${parseInt(params.step) + 1}`)
    }

    const handleTestReady = (e) => {
        dispatch(readyTestAction({testId:params.id, testReady:e}))
    }

    let currentTabs = params.id ? tabs : [tabs[0]]

    return(
        <div>
            <CommonPageHeader 
                title='Add Test' 
                extra={params.id ? [
                    <div style={{display:'inline'}}>
                        Test Ready &nbsp;
                        <Switch loading={readyTestStatus === STATUS.FETCHING} onChange={handleTestReady} checked={test.currentTest?.testReady}/>
                    </div>, 
                    <div style={{display:'inline'}}>
                        <Tag color="volcano" style={{marginTop: '5px', fontSize:17}}>
                            {test?.currentTest?.name?.en}
                        </Tag>
                    </div>
                ]: null}
            />
            <br/>
            <div className="card-container">
                <CurrentTestContext.Provider value={test.currentTest}>
                    <Tabs type="card" size='large' onChange={changeTab} activeKey={params.step} centered>
                        {currentTabs.map(tab => 
                            <Tabs.TabPane key={tab.step} value={tab.step}
                                tab={
                                    <div style={{textAlign:'center', padding:'10px', minWidth:'150px'}}>
                                        <Text style={{fontWeight:'bold', fontSize:'16px'}}>Step {tab.step}</Text><br/>
                                        <Text style={{fontSize:'15px'}}>{tab.title}</Text>
                                    </div>
                                } 
                            >
                                <div style={{cursor:test.currentTest?.testReady ? 'not-allowed' : ''}}>
                                <Card bodyStyle={{padding:0}} loading={params.id && test.getTestStatus === STATUS.FETCHING}
                                    style={{pointerEvents:test.currentTest?.testReady ? 'none' : '', border:0}}
                                >
                                    {test.currentTest ? 
                                            tab.step == 1 ?
                                                <AddTestDeatils/>
                                            :tab.step == 2 ?
                                                <AddSubjectToTest/>
                                            :tab.step == 3 ?
                                                <AssignTestSyllabus/>
                                            :tab.step == 4 ?
                                                <AddQuestionToTest/>
                                            :tab.step == 5 ?
                                                <TestSettings/>
                                            :tab.step == 6 ?
                                                <FinalTestStep />
                                            : null
                                        :
                                        tab.step == 1 ?
                                            <AddTestDeatils/>
                                            : null
                                    }
                                    {/* <ScheduleTest/> */}
                                </Card>
                            </div>
                            </Tabs.TabPane>
                        )}
                    </Tabs>
                </CurrentTestContext.Provider>
                {test.getTestStatus == STATUS.SUCCESS ?
                    <Card>
                        <Row style={{textAlign:'center'}}>
                            <Col span={24}>
                                <Space>
                                    {params.step == 1 ? null :  <Button style={{width:'150px'}} size='large' onClick={prevTab}><LeftOutlined /> Previous</Button>}
                                    {params.step == 6 ? null : <Button style={{width:'150px'}} onClick={nextTab} size='large'>Next <RightOutlined /></Button>}
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                    : null
                }
            </div>
        </div>
    )
}