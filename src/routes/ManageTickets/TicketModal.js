import { FileOutlined } from '@ant-design/icons'
import { Card, Descriptions, Drawer, Input, Form, Button, Comment, Space, Image } from 'antd'
import Text from 'antd/lib/typography/Text'
import _ from 'lodash'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import { ConfirmAlert } from '../../Constants/CommonAlerts'
import { addTicketCommentAction, getSingleTicketAction, updateTicketAction } from '../../redux/reducers/tickets'
import { AiOutlineFileText } from "react-icons/ai";

export const TicketModal = ({visible, closeModal, ticketData}) => {
    const dispatch = useDispatch()
    const {getTicketStatus, currentTicket, addTicketCommentStatus, updateTicktStatus} = useSelector(state => ({
        getTicketStatus:state.tickets.getTicketStatus,
        currentTicket:state.tickets.currentTicket,
        addTicketCommentStatus:state.tickets.addTicketCommentStatus,
        updateTicktStatus:state.tickets.updateTicktStatus
    }))

    const [yourComment, changeComment] = useState('')

    useEffect(() => {
        if(addTicketCommentStatus === STATUS.SUCCESS)
            changeComment(null)
    }, [addTicketCommentStatus])

    useEffect(() => {
        if(ticketData)
            dispatch(getSingleTicketAction({ticketId:ticketData._id}))
    }, [dispatch, ticketData])

    const handleSendComment = () => {
        dispatch(addTicketCommentAction({itemId:ticketData._id, comment:yourComment, itemModel:'Ticket'}))
    }

    const handleComment = (e) => {
        changeComment(e.target.value)
    }

    const handleCloseTicket = () => {
        ConfirmAlert(() => dispatch(updateTicketAction({ticketId:ticketData._id, status:'Closed'})), 'Are you sure?', null, updateTicktStatus === STATUS.FETCHING)
    }

    return(
        <Drawer title='Ticket' width='50%' visible={visible} onClose={closeModal}>
            {ticketData.status === 'Closed' ? null :
                <div style={{display:'flex', justifyContent:'right'}}>
                    <Button onClick={handleCloseTicket}>Close Ticket</Button>
                </div>
            }
            <Card loading={getTicketStatus === STATUS.FETCHING} bodyStyle={{padding:0}} style={{border:0}}>
                {currentTicket ?
                    <div>
                        <Descriptions>
                            <Descriptions.Item span={3} label='Subject'>{currentTicket.subject}</Descriptions.Item>
                            {currentTicket.category ? <Descriptions.Item span={3} label='Category'>{currentTicket.category}</Descriptions.Item> : null}
                            <Descriptions.Item span={3} label='Message'>{currentTicket.message}</Descriptions.Item>
                            {currentTicket.files?.length ?  
                                <Descriptions.Item span={3} label='Attachments'>
                                    <Space ali wrap size='large' align='end'>
                                        {currentTicket.files.map((d, i) => {
                                            let image = d.mimeType.split('/')[0] === 'image'
                                            return(
                                                <div key={d._id} style={{width:60, cursor:'pointer', textAlign:'center', display:'flex', flexDirection:'column', justifyContent:'end'}}>
                                                    {image ?
                                                        <div>
                                                            <Image src={d.url} style={{width:70, height:70, objectFit:'cover'}} /> 
                                                        </div>
                                                        : 
                                                        <AiOutlineFileText onClick={() => window.open(d.url, '_blank')} style={{fontSize:70}} />
                                                    }
                                                    <Text style={{marginTop:2}}>File {++i}</Text>
                                                </div>
                                            )
                                        })}
                                    </Space>
                                </Descriptions.Item>
                                : null
                            }
                        </Descriptions>
                        <br/>
                        <Form layout='vertical' onFinish={handleSendComment}>
                            <Form.Item>
                                <Input.TextArea rows={3} value={yourComment} placeholder='Write your comment' onChange={handleComment}/>
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType='submit' loading={addTicketCommentStatus === STATUS.FETCHING}>Send</Button>
                            </Form.Item>
                        </Form>
                        <div style={{margin:'5px 0'}}>
                            <Text>Comments <b>{currentTicket.comments?.docs?.length}</b></Text>
                        </div>
                        <div style={{height:'350px', overflow:'auto', border:'1px solid #D6DBDF', padding:'0 10px'}}>
                            {currentTicket.comments.docs.length ?  
                                _.orderBy(currentTicket.comments.docs, ['createdAt'], ['desc']).map(cmnt => 
                                    <Comment author={cmnt.user.name} datetime={moment(cmnt.createdAt).format('LLL')}
                                        content={<p>{cmnt.comment}</p>}
                                    />     
                                ) 
                                :
                                <div style={{padding:'6px'}}>
                                    <Text type='secondary'>No comments added</Text>
                                </div>
                            }
                        </div>
                    </div>
                    :
                    null
                }
            </Card>
        </Drawer>
    )
}