import { Form, Modal } from 'antd'
import Text from 'antd/lib/typography/Text'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MessageBox } from '.'
import { STATUS } from '../../Constants'
import { resetSendNotification } from '../../redux/reducers/notificaitons'
import { bilingualText } from '../../utils/FileHelper'

export const NotificationModal = ({closeModal, visible, notifiableIds, notifiableType}) => {
    const dispatch = useDispatch()

    const {sendNotificationStatus} = useSelector(state => ({
        sendNotificationStatus:state.notifications.sendNotificationStatus
    }))

    useEffect(() => {
        return () => dispatch(resetSendNotification())
    }, [])
    
    useEffect(() => {
        if(sendNotificationStatus === STATUS.SUCCESS)
            closeModal()
    }, [sendNotificationStatus])


    return(
        <Modal title='Send Notification' width={1000} footer={null} visible={visible} onCancel={closeModal}>
            {notifiableIds?.length ? 
                <>
                    <Form.Item label={<b>Send to</b>}>
                        {notifiableIds.map(n => 
                            <Text>{notifiableType == 'Package' ? bilingualText(n.name) : n.name}</Text>
                        )}
                    </Form.Item>
                </>
                :
                null
            }
            <MessageBox notifiableType={notifiableType} notifiableIds={notifiableIds.map(d => d._id)}/>
        </Modal>
    )
}