import { CheckSquareOutlined, CopyOutlined, DeleteOutlined, EditOutlined, ExportOutlined, FileDoneOutlined, MessageOutlined, ProfileOutlined, QuestionCircleOutlined, SearchOutlined, WarningOutlined } from '@ant-design/icons'
import { Button, Card, Input, List, Popover, Space, Table, Form } from 'antd'
import Text from 'antd/lib/typography/Text'
import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { STATUS } from '../../Constants'
import { ConfirmAlert } from '../../Constants/CommonAlerts'
import { getAllTestsAction, removeTestAction, resetRemoveTest } from '../../redux/reducers/test'
import _ from 'lodash'
import { getUserQaqcTestsAction } from '../../redux/reducers/qaqc'
import { ROUTES } from '../../Constants/Routes'
import { bilingualText } from '../../utils/FileHelper'
import { TotalCountBox } from '../../components/TotalCountBox'

export const QAQCTests = () => {
    const history = useHistory() 
    const dispatch = useDispatch()
    const params = useParams()
    const {getUserQaqcTestsStatus, userTests} = useSelector((state) => ({
        getUserQaqcTestsStatus:state.qaqc.getUserQaqcTestsStatus,
        userTests:state.qaqc.userTests,

    }))

    useEffect(() => {
        dispatch(getUserQaqcTestsAction())
    }, [dispatch])

    useEffect(() => {
        if(getUserQaqcTestsStatus === STATUS.SUCCESS){
            let data = userTests
            setDataSource(data)
        }
    }, [getUserQaqcTestsStatus])

    const [popupVisible, changePopupVisible] = useState()
    const [dataSource, setDataSource] = useState()

    const testQuestions = (test) => {
        history.push('/test-questions/'+test._id)
        changePopupVisible(false)
    }

    const exportTest = (test) => {
        history.push('/export-test-paper/'+test._id)
        changePopupVisible(false)
    }

    const actionsList = [
        {title:'Test Questions', icon:<QuestionCircleOutlined />, callback:(e) => history.push('/verify-test-questions/'+e._id)},
        {title:'Export Test', icon:<ExportOutlined />, callback:exportTest},
        // {title:'Students and Result', icon:<ProfileOutlined />},
    ]

    const openActions = (id) => {
        changePopupVisible(id === popupVisible ? false : id)
    }

    const changePage = (e) => {
        history.push(`/qaqc-tests/${e.current}`)
    }

    let searchInput = useRef()
    
    const search = (title) => ({
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.select(), 100);
            }
        },

        onFilter: (value, record) =>
            record[title]
                ? bilingualText(record[title])
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
                : "",

        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Form
                    onFinish={() => {confirm({ closeDropdown: false });}}
                >
                    <Input
                        ref={(node) => {searchInput = node;}}
                        placeholder={`Search ${title}`}
                        value={selectedKeys[0]}
                        onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                        }
                        style={{ marginBottom: 8, display: "block" }}
                    />
                    <Space>
                        <Button
                            htmlType="submit"
                            type="primary"
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Search
                        </Button>
                        <Button
                            onClick={() => {
                                clearFilters();
                            }}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Reset
                        </Button>
                    </Space>
                </Form>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{ fontSize: "18px", color: filtered ? "#1890ff" : undefined }}
            />
        )
    })

    return(
        <div>
            <CommonPageHeader title='QAQC Tests'/>
            <br/>
            <Card>
                <TotalCountBox count={userTests.length} title='Tests'/>
                <br/> 
                    <Table loading={getUserQaqcTestsStatus === STATUS.FETCHING} bordered 
                        dataSource={userTests.length ? userTests.map(t => t.testId) : []} 
                        pagination={{position:['bottomCenter', 'topCenter'], pageSize:20, current:parseInt(params.page) || 1, total:dataSource?.total}} 
                        onChange={changePage}
                    >
                        <Table.Column title='Ref Id' dataIndex='referenceId' key='referenceId'
                            render={id => <Text>{id}</Text>}

                        ></Table.Column>
                        <Table.Column title='Name' dataIndex='name'
                            render={d => bilingualText(d) } {...search('name')}
                        ></Table.Column>
                        <Table.Column title='Platform' dataIndex='testType' key='testType'></Table.Column>
                        <Table.Column title='Time Duration (min)' dataIndex='totalTime' key='time'></Table.Column>
                        <Table.Column title='Number of questions' dataIndex='queCont' key='queCont'
                            render={(d, test) => <Text>{test.sections?.length ? _.flattenDeep(test.sections.map(sec => sec.questions)).length : 0 }</Text>}
                        ></Table.Column>
                        {/* <Table.Column title='Start Date' dataIndex='startData' key='startData'></Table.Column> */}
                        {/* <Table.Column title='Status' dataIndex='status' key='status'></Table.Column> */}
                        <Table.Column title='Actions' dataIndex='actions' key='actions'
                            render={(d, test) =>(
                                <Popover trigger="click" onVisibleChange={() => openActions(test._id)} placement='bottom' style={{padding:0}} visible={test._id === popupVisible}
                                    content={
                                        <List size='small' style={{padding:'0'}} dataSource={actionsList}
                                            renderItem={item =>
                                                <List.Item className='hover-list-item' onClick={() => item.callback(test)} style={{cursor:'pointer', padding:5}}>
                                                    {item.icon}&nbsp; {item.title}
                                                </List.Item>
                                            }
                                        />
                                    }
                                >
                                    <Button>Actions</Button>
                                </Popover>
                            )}
                        ></Table.Column>
                    </Table>
            </Card>
        </div>
    )
} 