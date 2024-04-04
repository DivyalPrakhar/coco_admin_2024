import { Card, Table, Tag } from 'antd'
import Text from 'antd/lib/typography/Text'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { STATUS } from '../../Constants'
import { getNotificationsAction } from '../../redux/reducers/notificaitons'

export const ManageNotifications = () => {
    const dispatch = useDispatch()
    const params = useParams()
    const history = useHistory()

    const {getNotificationStatus, notificationList} = useSelector(state => ({
        getNotificationStatus:state.notifications.getNotificationStatus,
        notificationList:state.notifications.notificationList
    }))

    useEffect(() => {
        dispatch(getNotificationsAction({type:'notification', limit:10}))
    }, [])

    const changePage = (e) => {
        dispatch(getNotificationsAction({type:'notification', page:e.current, limit:10}))
        history.push('/list-notifications/'+e.current)
    } 

    return(
        <div>
            <CommonPageHeader title='Notifications'/>
            <br/>
            <Card>
                <Table dataSource={notificationList?.docs} loading={getNotificationStatus === STATUS.FETCHING} bordered
                    pagination={{current:parseInt(params.page) || 1, pageSize:10, total:notificationList?.total, showSizeChanger:false}} onChange={changePage}
                >
                    <Table.Column dataIndex='title' title='Title'></Table.Column>
                    <Table.Column dataIndex='body' title='Message'></Table.Column>
                    <Table.Column width='110px' dataIndex='sentCount' title='Sent count'></Table.Column>
                    <Table.Column width='130px' title='Message type' render={d =>
                        {
                            let type = !d.sms && !d.email ? 'notification' :d.sms && !d.email ? 'sms' :!d.sms && d.email ? 'email' : null  
                            return(
                                type ? <Tag color='blue'>{type}</Tag> : null
                            )
                        }
                    }></Table.Column>
                </Table>
            </Card>
        </div>
    )
}