import { Modal, Form, Select, Input, DatePicker } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { UploadImageBox } from '../../components/UploadImageBox'
import { PAYMENT_STATUS, STATUS } from '../../Constants'
import { updateOrderStatusAction } from '../../redux/reducers/orders'

export const DeliveryStatusModal = ({closeModal, visible, orderData}) => {
    const dispatch = useDispatch()

    const {updatStatus} = useSelector(state => ({
        updatStatus:state.orders.updateOrderStatus
    }))
    
    const [selectedStatus, setStatus] = useState()
    const [remark, setRemark] = useState()
    const [imageUrl, setImage] = useState()
    const [date, setDate] = useState(moment())

    const handleSelectStatus = (e) => {
        setStatus(e)
    }

    const handleRemark = (e) => {
        setRemark(e.target.value)
    }

    const updateStatus = () => {
        let data = {remark, status:selectedStatus, fileUrl:imageUrl, orderId:orderData._id}
        dispatch(updateOrderStatusAction(data))
    }

    const handleDate = (e) => {
        setDate(moment(e).format())
    }

    const handleImage = (e) => {
        setImage(e?.file?.response?.url)
    }
    
    const status = [{value:'Processed', id:1, color:'blue'}, {value:'Shipped', id:2, color:'orange'}, {value:'In-Transit', id:3, color:'orange'}, {value:'Delivered', id:4, color:'green'}, {value:'Cancelled', id:4, color:'red'}]
    return(
        <Modal visible={visible} width={'40%'} onCancel={closeModal} okButtonProps={{disabled:!selectedStatus, loading:updatStatus === STATUS.FETCHING}} 
            title='Delivery Status' onOk={updateStatus}
        >
            <Form labelCol={{span:6}} wrapperCol={{span:16}}>
                <Form.Item required label='Delivery Status'>
                    <Select value={selectedStatus} placeholder='Select Status' onChange={handleSelectStatus}>
                        {status.map(status => 
                            <option value={status.value}>{status.value}</option>
                        )}
                    </Select>
                </Form.Item>
                <Form.Item label='Image'>
                    <UploadImageBox disableAlert getImage={handleImage} onRemove={handleImage}/>
                </Form.Item>
                {/* <Form.Item label='Date'>
                    <DatePicker defaultValue={date} format="YYYY-MM-DD HH:mm" showTime rows={4} onChange={handleDate}/>
                </Form.Item> */}
                <Form.Item label='Remark'>
                    <Input.TextArea value={remark} rows={4} onChange={handleRemark} placeholder='Remark'/>
                </Form.Item>
            </Form>
        </Modal>
    )
}