import { PlayCircleOutlined, DeleteTwoTone, RedoOutlined } from '@ant-design/icons'
import { Button, Card, Col, Empty, Row, Tooltip, Tag, Table, Badge, Alert, Space } from 'antd'
import React, { useState, useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import _ from 'lodash'
import { getDemoAttemptAction, deleteTestAttemptAction } from '../../redux/reducers/test'
import { useHistory, useParams } from 'react-router-dom'
import moment from 'moment'
import {CurrentTestContext} from './AddTest'
import { BaseURL_WEB } from '../../BaseUrl'
import Text from 'antd/lib/typography/Text'

export const FinalTestStep = ({testData}) => {
    const dispatch = useDispatch()
    const params = useParams()
    const history = useHistory()
    const currenTest = useContext(CurrentTestContext) || testData
    const [reloadWindow, setReloadWindod] = useState(false)

    const {test} = useSelector(state => ({
        test:state.test,
    }))

    useEffect(() => {
        dispatch(getDemoAttemptAction({testId: params?.id}))
    }, [dispatch, params.id, params.step])

    useEffect(() => {
        if(test.getDemoAttemptStatus === STATUS.SUCCESS){
            setReloadWindod(false)
        }
    }, [test.getDemoAttemptStatus])

    const startDemoAttempt = (attemptId, status) => {
        let testId = currenTest._id
        let testAttemptId = attemptId || null
        let attemptMode = status || 'Start'
        let token = localStorage.getItem("@login/alumni")

        let url = `${BaseURL_WEB}exam/start/?testId=${testId}&testAttemptId=${testAttemptId}&mode=${attemptMode}&token=${token}&platform=web&demo=1`
        window.open(url,'_blank',false)

        setReloadWindod(true)
    }

    const columns = [
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createAt',
            render: d => moment(d).format('DD-MM-YYYY HH:mm')
        },
        {
            title: 'Status',
            dataIndex: 'progressStatus',
            key: 'progressStatus',
            render: d => <div>{d === 'in-progress' ? <Tag color="#f50">IN PROGRESS</Tag>  : <Tag color="#87d068">COMPLETED</Tag>}</div>
        },
        {
            title: 'Action',
            key: 'action',
            render: d => {
                return(
                    <div>
                    {d.progressStatus === 'in-progress' ? 
                        <Tooltip title='Resume Attempt'>
                            <Button icon={<PlayCircleOutlined style={{color: '#1890ff'}} onClick={() => startDemoAttempt(d._id, 'resume')}/>}></Button>
                        </Tooltip>
                    : null}
                    <Tooltip title='Remove Attempt'>
                        <Button icon={<DeleteTwoTone twoToneColor='#eb2f96'/>} onClick={() => dispatch(deleteTestAttemptAction({id: d._id}))}></Button>
                    </Tooltip>
                    </div>
                )
            } 
        },
    ]
    return(
        <Card style={{border:0}} loading={test.getDemoAttemptStatus === STATUS.FETCHING}>
            {test.getDemoAttemptStatus === STATUS.SUCCESS ? 
                <>
                    <Row>
                        <Col span={24}>
                            {currenTest?.visibility ? 
                                <div>
                                    <div style={{marginBottom:'10px'}}>
                                        <Alert type='success'
                                            message={
                                                <Space>
                                                    <Text>Always refresh data after closing demo attempt window.</Text>
                                                    <Tag icon={<RedoOutlined />} 
                                                        style={{cursor: 'pointer'}} color={reloadWindow ? '#2db7f5' : 'blue'} 
                                                        onClick={() => dispatch(getDemoAttemptAction({testId: params?.id}))}
                                                    >
                                                        <span>REFRESH DATA</span>
                                                        {reloadWindow ?  <Badge style={{margin:'0 5px'}} status="processing" /> : null}
                                                    </Tag>
                                                </Space>    
                                            }
                                        />
                                        <br/>
                                        <Button icon={<PlayCircleOutlined twoToneColor='#eb2f96'/>} 
                                            onClick={() => startDemoAttempt()} type='primary'
                                        >
                                            Demo Attempt
                                        </Button>
                                    </div>
                                    <div>
                                        <Table 
                                            dataSource={_.orderBy(test?.demoAttemptData || [], ['createdAt'], ['desc'])} 
                                            columns={columns}
                                            pagination={false}
                                        />
                                    </div>
                                </div>
                            : 
                                <div style={{color: 'red', textAlign: 'center'}}>
                                    You can't try a demo, the test status hasn't made visible yet.
                                </div>
                            }
                        </Col>
                    </Row>          
                </>
                :
                <Empty description='something went wrong'/>
            }
        </Card>
    )
}
