import { PercentageOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, Input, Modal, Radio, Select, Space } from 'antd'
import _ from 'lodash';
import moment from 'moment';
import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { STATUS } from '../../Constants';
import { addDiscountOfferAction, updateDiscountOfferAction } from '../../redux/reducers/discountConfigs';

export const AddDiscountOfferModal = ({visible, closeModal, defaultOffer}) => {
    const dispatch = useDispatch()

    const {addDiscountOfferStatus, updateDiscountOfferStatus} = useSelector(state => ({
        addDiscountOfferStatus:state.discountConfigs.addDiscountOfferStatus,
        updateDiscountOfferStatus:state.discountConfigs.updateDiscountOfferStatus
    }))
    const formItemLayout = {
        labelCol: {
          xs: { span: 22 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 },
        },
    };

    const handleFinish = (d) => {
        const {installation, session} = d
        const appInstallStart = installation?.[0] ?  moment(installation?.[0]).format('YYYY-MM-DD') : ''
        const appInstallEnd = installation?.[1] ?  moment(installation?.[1]).format('YYYY-MM-DD') : ''
        const discountSessionStart = session?.[0] ?  moment(session?.[0]).format('YYYY-MM-DD') : ''
        const discountSessionEnd = session?.[1] ?  moment(session?.[1]).format('YYYY-MM-DD') : ''
        const data = {appInstallStart, appInstallEnd, discountSessionStart, discountSessionEnd, ..._.omit(d, ['installation', 'session'])}
        
        if(defaultOffer){
            dispatch(updateDiscountOfferAction({...data, discountConfigId:defaultOffer._id}))
        }else
            dispatch(addDiscountOfferAction(data))
    }

    const initalData = useMemo(() => {
        if(defaultOffer){
            const {appInstallStart, appInstallEnd, discountSessionEnd, discountSessionStart, title, discountType, percentDiscount, status} = defaultOffer
            const installation = appInstallStart  ? [moment(appInstallStart), moment(appInstallEnd)] : []
            const session = discountSessionStart  ? [moment(discountSessionStart), moment(discountSessionEnd)] : []
            return {installation, session, title, discountType, percentDiscount, status}
        }
    }, [defaultOffer])

    console.log('initalData', initalData, defaultOffer)
    return(
        <Modal width={800} title={defaultOffer ? 'Update Discount Offer' : 'Add Discount Offer'} footer={false} visible={visible} onCancel={closeModal}>
            <Form {...formItemLayout}
                onFinish={handleFinish}
                initialValues={initalData || {
                    status:1,
                    discountType:'any'

                }}
            >
                <Form.Item label='Title' name='title' rules={[{ required: true, message: 'Please input title!' }]}>
                    <Input placeholder='title'/>
                </Form.Item>
                <Form.Item label='Type' name={'discountType'} rules={[{ required: true, message: 'Please input discount type' }]}>
                    <Select>
                        <Select.Option value='any'>Any</Select.Option>
                        <Select.Option value='fresh'>Fresh</Select.Option>
                        <Select.Option value='old'>Old</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label='Percent' name={'percentDiscount'}>
                    <Input min={0} prefix={<PercentageOutlined/>} type='number' placeholder='percent'/>
                </Form.Item>
                <Form.Item label='Isntallation Date' name={'installation'}>
                    <DatePicker.RangePicker />
                </Form.Item>
                <Form.Item label='Session Date' name={'session'}>
                    <DatePicker.RangePicker />
                </Form.Item>
                <Form.Item label='Status' name='status'>
                    <Radio.Group
                        options={[
                            {label:'Active', value:1},
                            {label:'In-Active', value:0}
                        ]}
                    />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 6 }}>
                    <Space>
                        <Button onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button loading={addDiscountOfferStatus === STATUS.FETCHING || updateDiscountOfferStatus === STATUS.FETCHING} type="primary" htmlType="submit">
                            {defaultOffer ? 'Update' : 'Add'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    )
}