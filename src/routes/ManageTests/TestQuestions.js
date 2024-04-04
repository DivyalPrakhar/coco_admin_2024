import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Tabs, Table, Popover, List } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import { useParams } from 'react-router-dom'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { STATUS } from '../../Constants'
import { getSingleTestAction, resetSingleTestAction, deleteQuestionFromTestAction } from '../../redux/reducers/test'
import { QuestionComponent } from '../ManageQuestions/ListQuestions'
import { UpdateQuestionModal } from '../../components/UpdateQuestionModal'
import { ConfirmAlert } from '../../Constants/CommonAlerts'
import { renderMathTex } from '../../utils/FileHelper'

export const TestQuestions = () => {
    const params = useParams()
    const dispatch = useDispatch()
    const [currentTab, changeCurrentTab] = useState()
    const [openedAction, setOpenedAction] = useState()
    const [updateQueModal, changeUpdateQueModal] = useState(false)

    const {test} = useSelector((state) => ({
        test:state.test
    }))

    useEffect(() => {
        return () => {
            dispatch(resetSingleTestAction())
        }
    }, [])

    const deleteQuestion = (data) => {
        ConfirmAlert(() => dispatch(deleteQuestionFromTestAction({'questionRefIds[]':data._id, sectionId: data.sectionId, testId: params.id})), 'Are you sure?', null, test.deleteQuestionFromTestStatus == STATUS.FETCHING, 'Yes')
        setOpenedAction(false)
    }

    const _updateQueModal = (data) => {
        changeUpdateQueModal(data)
        setOpenedAction(false)
    }

    const closeUpdateQueModal = () => {
        changeUpdateQueModal(false)
    }

    useEffect(() => {
        if(params.id && test.getTestStatus != STATUS.SUCCESS){
            dispatch(getSingleTestAction({testId:params.id}))
        }
    }, [params])

    useEffect(() => {
        if(test.updateTestQuestionDataStatus === STATUS.SUCCESS && updateQueModal){
            changeUpdateQueModal(false)
        }
    }, [test.updateTestQuestionDataStatus])

    const _openActions = (id) => {
        setOpenedAction(id == openedAction ? null : id)
    }

    // const renderFun = () => {
    //     window.renderMathInElement(document.getElementById("math-tex-id-que-data", {
    //         delimiters: [
    //             { left: "$", right: "$", display: true }
    //         ]
    //     })); 
    // }

    const callTheChange = () => {
        // renderFun()
    }

    const actionsList = [
        {title:'Edit', callback:_updateQueModal, icon:<EditOutlined/>},
        {title:'Delete', callback:deleteQuestion, icon:<DeleteOutlined/>}
    ]

    const columns = [
        {title:<b>Id</b>, dataIndex:'id', key:1,},
        {title:<b>Questions</b>, dataIndex:'question', key:3, width:'90%',
            render:que => {
                return <QuestionComponent que={que} callTheChange={() => callTheChange()}/> 
            }
        },
        {title:<b>Actions</b>, dataIndex:'action', key:1,
            render:d => {
                return(<Actions data={d} actionsList={actionsList} openAction={_openActions} visible={openedAction}/>)}
        },
    ]

    useEffect(() => {
        if(document.getElementById('math-tex-id-que-data'))
            renderMathTex('math-tex-id-que-data')
    })

    // useEffect(() => {
    //     if(test.getTestStatus == STATUS.SUCCESS && test.currentTest.sections.length){
    //         renderFun()
    //     }
    // }, [test.getTestStatus])

    return(
        <div>
            <CommonPageHeader title='Added Test Questions'/>
            <br/>
            <div className="card-container">
                <Card style={{border:0}} bodyStyle={{padding:0}} loading={params.id && test.getTestStatus == STATUS.FETCHING}>
                    {test.getTestStatus == STATUS.SUCCESS ? 
                        <Row style={{padding: '15px'}}>
                            <Col sm={24}>
                                <Tabs defaultActiveKey={currentTab} onChange={(key) => changeCurrentTab(key)}>
                                    {_.map(test.currentTest.sections, s => {
                                        return(
                                            <Tabs.TabPane tab={s?.subjectRefId?.name?.en} key={s._id}>
                                                <Table 
                                                    id='math-tex-id-que-data'
                                                    bordered
                                                    columns={columns}
                                                    dataSource={s?.questions?.length ? s.questions.map(que => ({id:que.questionRefId.display_id, question:que.questionRefId, action: Object.assign({}, que.questionRefId, {sectionId: s._id, updateType: 'testQuestion'})})) : []}
                                                    pagination={false}
                                                />
                                            </Tabs.TabPane>
                                        )
                                    })}
                                </Tabs>
                            </Col>
                            {updateQueModal ? <UpdateQuestionModal data={updateQueModal} closeModal={closeUpdateQueModal} visible={updateQueModal}/> : null}
                        </Row> 
                    : 
                        null
                    }
                </Card>
            </div>
        </div>
    )
}

const Actions = ({data, actionsList, openAction, visible}) => {
    return(
        <Popover placement='bottom' trigger="click" visible={data._id == visible}
            onVisibleChange={() => openAction(data._id)}
            content={
                <div>
                    <List size='small' dataSource={actionsList}
                        renderItem={item => (
                            <List.Item className='hover-list-item' style={{cursor:'pointer'}} onClick={() => item.callback(data)}>
                                <span style={{marginRight:'10px'}}>{item.icon}</span>{item.title}
                            </List.Item>   
                        )}
                    />
                </div>
            }
        >
            <Button shape='round' >Actions</Button>
        </Popover>
    )
}