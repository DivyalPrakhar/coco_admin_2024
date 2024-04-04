import { Button, Breadcrumb, Badge, Space, Tooltip, Select, Card, Row, Col, Table, Empty, Form } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import {useParams} from 'react-router-dom';
import {useHistory} from 'react-router';
import moment from 'moment'
import _ from 'lodash'
import { 
    getDiscussionTopicAction, approveTopicQuestionAction, deleteTopicAction
} from '../../redux/reducers/discussionTopicReducer'
import {  PlusOutlined, EditOutlined, ScheduleOutlined, EyeOutlined, MessageOutlined, DeleteOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { DiscussionTopicDrawer } from './DiscussionTopicDrawer'
import { DiscussionSubTopicModal } from './DiscussionSubTopicModal'
import { CommonPageHeader } from "../../components/CommonPageHeader";
import { CommentsModal } from './CommentsModal'
import { ConfirmAlert } from '../../Constants/CommonAlerts';
import { render } from 'less';

export const DiscussionTopic = (props) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const params = useParams()
    const { discussionData } = useSelector((state) => ({
        discussionData: state.discussionTopicReducer
    }))

    const [community, changeCommunity] = useState(params.community ? params.community : history.location.pathname === '/question' ? 'question' : 'discussion')

    const [addDiscussionTopicDrawer, setAddDiscussionTopicDrawer] = useState(false)
    const [updateData, setUpdateData] = useState(null)
    const [parentId, setParentId] = useState(null)
    const [subTopicModal, changeSubTopicModal] = useState({modal: false, data: ''})

    useEffect(() => {
        if(!params.id){
            dispatch(getDiscussionTopicAction({community}))
        }
    }, [community, dispatch])

    const closeDrawer = () => {
        setAddDiscussionTopicDrawer(false)
        setUpdateData(null)
        setParentId(null)
    }

    const addNewItem = (id) => {
        setAddDiscussionTopicDrawer(true)
        setParentId(id)
    }

    const addChildTopic = (data) => {
        setAddDiscussionTopicDrawer(true)
        setParentId(data._id)
    }

    const editTopic = (data) => {
        setAddDiscussionTopicDrawer(true)
        setUpdateData(data)
        setParentId(data?.parentTopic ? data.parentTopic._id : null)
    }

    const changePage = (e) => {
        dispatch(getDiscussionTopicAction({topicId: params?.id, community, limit:10, page:e}))
    }

    const handleChange = (e) => {
        changeCommunity(e)
        history.push(e)
        dispatch(getDiscussionTopicAction({topicId: params?.id, community: e}))
    }

    // useState(() => {
    //     dispatch(getDiscussionTopicAction({topicId: params?.id, community}))
    // }, [params.id])

    const [showComments, changeShowCmnts] = useState()
    const _showComments = (topic) => {
        changeShowCmnts(topic)
    }

    const delteTopic = (d) => {
        ConfirmAlert(() => dispatch(deleteTopicAction({topicId:d._id})), 'Sure?', null, discussionData.deleteTopicStatus === STATUS.FETCHING)
    }

    let columns = _.compact([
        {
            title: 'Topic',
            key: 'topic',
            dataIndex: 'topic'
        },
        {
            title: 'Body',
            key: 'body',
            dataIndex: 'body',
            // ellipsis: {
            //     showTitle: false,
            // },
            // render: d => (
            //     <Tooltip placement="topLeft" title={d}>
            //         <div>{d}</div>
            //     </Tooltip>
            // )
        },
        {
            title: 'Added On',
            key: 'createdAt',
            render: d => (
                <div>
                    {moment(d.createdAt).format('DD-MM-YYYY HH:mm')}
                </div>
            )
        },
        {
            title: 'Created By',
            key: 'createdBy',
            dataIndex:'createdBy',
        },
        {
            title: 'Active',
            key: 'active',
            render: d => (
                <div>
                    <Badge 
                        style={{background: d.active ? '#dee9ff' : '#ffe9de', padding: '2px 10px', borderRadius: '4px'}} 
                        status={d.active ? 'processing' : 'error'} 
                        text={<span>{d.active ? 'Yes' : 'No'}</span>} 
                    />
                </div>
            )
        },
        (params.id && params.community === 'question' ? 
        {
            title: 'Doubt Question',
            key: 'dountQuestion',
            render: d => (
                <div>
                    <Space>
                        <Tooltip placement="top" title='View Question'>
                            <Button type='default' shape='circle' icon={<EyeOutlined />} onClick={() => changeSubTopicModal({modal: true, data: d})}/>
                        </Tooltip>
                        <Tooltip placement="top" title='Approve Question'>
                            <Badge 
                                onClick={() => dispatch(approveTopicQuestionAction({topicId: d._id}))}
                                style={{cursor: 'pointer', background: d?.doubtQuestion?.approved ? '#dee9ff' : '#ffe9de', padding: '2px 10px', borderRadius: '4px'}} 
                                status={d?.doubtQuestion?.approved ? 'processing' : 'error'} 
                                text={<span>{d?.doubtQuestion?.approved ? 'Yes' : 'No'}</span>} 
                            />
                        </Tooltip>
                    </Space>
                </div>
            )
        }
        : null),
        (community !== 'discussion' ? 
        {
            title: 'Student Allowed',
            key: 'studentsAllowed',
            render: d => (
                <div>
                    <Badge 
                        style={{background: d.studentsAllowed ? '#dee9ff' : '#ffe9de', padding: '2px 10px', borderRadius: '4px'}} 
                        status={d.studentsAllowed ? 'processing' : 'error'} 
                        text={<span>{d.studentsAllowed ? 'Yes' : 'No'}</span>} 
                    />
                </div>
            )
        }
        : null),
        (params.id ? null : 
        {
            title: 'SubTopics',
            key: 'subTopics',
            render: d => (
                <div>
                    <Space>
                        <Tooltip placement="top" title={community === 'discussion' ? 'Sub Discussion Topics' : 'Sub Question Topics'}>
                            <Button
                                icon={<ScheduleOutlined />}  
                                //onClick={() => changeSubTopicModal({modal: true, data: d})}
                                onClick={() => params.id ? history.push(d._id) : history.push('sub-discussion/'+community+'/'+d._id)}
                            >
                                Subtopics
                            </Button>
                        </Tooltip>
                    </Space>
                </div>
            )
        }
        ),
        {
            title: 'Action',
            key: 'action',
            render: d => (
                <div>
                    <Space>
                        <Tooltip placement="top" title={'Edit'}>
                            <Button type='default' shape='circle' icon={<EditOutlined />}  onClick={() => editTopic(d)} />
                        </Tooltip>
                        {community === 'discussion' && params.id ? 
                            <Tooltip placement="top" title={'Comments'}>
                                <Button type='default' shape='circle' icon={<MessageOutlined />}  onClick={() => _showComments(d)} />
                            </Tooltip> : null
                        }
                        <Tooltip placement="top" title={'Delete'}>
                            <Button type='default' shape='circle' icon={<DeleteOutlined />}  onClick={() => delteTopic(d)} />
                        </Tooltip>
                        {params.id ? null : 
                            <Tooltip placement="top" title={community === 'discussion' ? 'Add Sub Discussion Topics' : 'Add Sub Question Topics'}>
                                <Button type='default' shape='circle' icon={<PlusOutlined />}  onClick={() => addChildTopic(d)} />
                            </Tooltip>
                        }
                    </Space>
                </div>
            )
        }
    ])

    columns = community === 'question' ? [{
        title: 'Added By ',
        key: 'user',
        dataIndex: 'userId',
        render:d => d?.name
    },...columns] : columns

    console.log('columns', columns)
    const changeCreatedBy = (e) => {
        dispatch(getDiscussionTopicAction({community, createdBy:e, topicId: params?.id, subTopics : params?.id ? true : false}))
    }

    const [sortValue, changeSortValue] = useState(-1)

    const handleSorting = (value) => {
        dispatch(getDiscussionTopicAction({topicId: params?.id, community, sorting:{createdAt:value}}))
        changeSortValue(value)
    }
    
    const localData = JSON.parse(localStorage.getItem("topicRoute"))
    return(
        <div>
            <div>
                <CommonPageHeader
                    title={<div>{community === 'question' ? 'Question' : 'Discussion'} Topic</div>}
                    extra={
                        <Button shape='round' icon={<PlusOutlined />} onClick={() => addNewItem(params?.id)} size='large'>
                            Add {community === 'question' ? 'Question' : 'Discussion'} {discussionData?.parentTopic?.topic ? 'Sub ' : ''}Topic
                        </Button>
                    }
                />
                <br/>
                <Card>
                        <Row>
                            <div>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item style={{cursor: 'pointer'}} onClick={() => history.push('/'+community)}>Home</Breadcrumb.Item>
                                {_.map(localData, d => {
                                    return(
                                        <Breadcrumb.Item style={{cursor: 'pointer'}} key={d._id} onClick={() => history.push(d._id)}>{d.topic}</Breadcrumb.Item>
                                    )
                                })}
                            </Breadcrumb>
                            <br/>
                            {discussionData?.parentTopic?.topic ? 
                                <div style={{paddingBottom: '7px'}}>
                                    <br/>
                                    <div><b>Title:</b> {discussionData?.parentTopic?.topic}</div>
                                    <div><b>Body:</b> {discussionData?.parentTopic?.body}</div> 
                                    <div><b>Added On:</b> {moment(discussionData?.parentTopic?.createdAt).format('DD-MM-YYYY HH:mm')}</div>
                                </div> 
                            : null}
                            <Space size='large'>
                                {params.id ? null :
                                    <Form.Item label='Select Community'>
                                        <Select defaultValue={community} style={{ width: 120 }} onChange={handleChange}>
                                            <Select.Option value="discussion">Discussion</Select.Option>
                                            <Select.Option value="question">Question</Select.Option>
                                        </Select>
                                    </Form.Item>
                                }
                                <Form.Item label='Added By'>
                                    <Select defaultValue={null} style={{width:'150px'}} onChange={changeCreatedBy} placeholder='Added on'>
                                        <Select.Option value={null}>All</Select.Option>
                                        <Select.Option value='STUDENT'>STUDENT</Select.Option>
                                        <Select.Option value='STAFF'>STAFF</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label='Sort By Added On'>
                                    <Select value={sortValue} style={{width:'150px'}} onChange={handleSorting} placeholder='Sort by added on'>
                                        <Select.Option value={-1}>Descending</Select.Option>
                                        <Select.Option value={1}>Ascending</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Space>
                            </div>
                            <Col span={24}>
                                <br/>
                                <Table 
                                    align='center' 
                                    bordered loading={discussionData.discussionTopicStatus === STATUS.FETCHING}
                                    dataSource={discussionData.discussionTopicData?.docs} 
                                    columns={columns} 
                                    pagination={{ 
                                        current: discussionData.discussionTopicData?.page,
                                        pageSize: discussionData.discussionTopicData?.limit,
                                        total: discussionData.discussionTopicData?.total,
                                        onChange: (e) => changePage(e) 
                                    }}
                                /> 
                            </Col>
                        </Row>
                </Card>
            </div>
            {addDiscussionTopicDrawer ? 
                <DiscussionTopicDrawer 
                    community={community}
                    parentId={parentId}
                    updateData={updateData} 
                    visible={addDiscussionTopicDrawer} 
                    closeDrawer={closeDrawer}
                /> 
            : null}
            {subTopicModal.modal ? 
                <DiscussionSubTopicModal 
                    community={community}
                    editTopic={(d) => editTopic(d)}
                    data={subTopicModal.data} 
                    visible={subTopicModal.modal} 
                    closeModal={() => changeSubTopicModal({modal: false, data: ''})}
                /> 
            : null}

            {showComments ? 
                <CommentsModal visible={showComments} topic={showComments} closeModal={() => _showComments(null)}/>
                : null
            }
        </div> 
    )
}

