import { PercentageOutlined } from '@ant-design/icons'
import { Button, DatePicker, Drawer, Form, Input, Radio, Select } from 'antd'
import FormItem from 'antd/lib/form/FormItem'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import { addWalletOfferAction, updateWalletOfferAction } from '../../redux/reducers/wallet'
import _ from 'lodash'

export const AddWalletOffer = ({visible, closeModal, defaultOffer}) => {
    const dispatch = useDispatch()

    const {addOfferStatus, updateOfferStatus} = useSelector(state => ({
        addOfferStatus:state.wallet.addOfferStatus,
        updateOfferStatus:state.wallet.updateOfferStatus
    }))
    const [offerData, setOfferDate] = useState({type:'percent', active:false})
    const [offerType, setOfferType] = useState('percent')

    useEffect(() => {
        if(defaultOffer){
            let {title, type, percent, description, flat, minAmount, maxCashback, startDate, endDate, active} = defaultOffer
            let data = {title, type, percent, description, flat, minAmount, maxCashback, date:startDate ? [moment(startDate), moment(endDate)] : [] , active}
            setOfferType(type || 'percent')
            setOfferDate(data)
        }
    }, [defaultOffer])

    const handleSubmit = (e) => {
        let data = {...e, startDate:e.date ? moment(e.date[0]).format('YYYY-MM-DD') : null, endDate:e.date ? moment(e.date[1]).format('YYYY-MM-DD') : null}
        
        data = _.omit(data, 'date')
        if(defaultOffer)
            dispatch(updateWalletOfferAction({...data, _id:defaultOffer._id}))
        else
            dispatch(addWalletOfferAction(data))
        
        // setOfferDate({...e, startDate:e.date ? moment(e.date[0]).format('YYYY-MM-DD') : null, endDate:e.date ? moment(e.date[1]).format('YYYY-MM-DD') : null})
    }
    
    const handleType = (e) => {
        setOfferType(e)
    }

    return(
        <Drawer title={defaultOffer ? 'Edit Offer' : 'Add Offer'} width='50%' visible={visible} onClose={closeModal} >
                <Form onFinish={handleSubmit} key={offerData.title}
                    wrapperCol={{ span: 14 }}
                    labelCol={{ span: 6 }}
                >
                    <Form.Item value rules={[{required:true, message:'Please fill the field.'}]} initialValue={offerData.title} label='Title' name='title'>
                        <Input placeholder='Title'/>
                    </Form.Item>
                    <Form.Item label='Description' name='description' initialValue={offerData.description}>
                        <Input.TextArea placeholder='Description' rows={4}/>
                    </Form.Item>
                    <Form.Item rules={[{required:true, message:'Please fill the field.'}]} label='Type' name='type' initialValue={offerData.type || 'percent'}>
                        <Select placeholder='Select type' value={offerData.type} onChange={handleType}>
                            <Select.Option value='percent'>Percent</Select.Option>
                            <Select.Option value='flat'>Flat</Select.Option>
                        </Select>
                    </Form.Item>
                    {offerType === 'percent' ?
                        <>
                            <Form.Item rules={[{required:true, message:'Please fill the field.'}]} label='Percent' name='percent' initialValue={offerData.percent}>
                                <Input placeholder='Percent' type='number' min={0} prefix={<PercentageOutlined />} />
                            </Form.Item>
                            <Form.Item label='Max Cashback' name='maxCashback' initialValue={offerData.maxCashback}>
                                <Input placeholder='Max cashback' type='number' min={0} prefix={'₹'}/>
                            </Form.Item>
                        </>
                        :
                        <Form.Item rules={[{required:true, message:'Please fill the field.'}]} label='Flat Amount' name='flat' initialValue={offerData.flat}>
                            <Input placeholder='Flat amount' type='number' min={0} prefix={'₹'}/>
                        </Form.Item>
                    }
                    <Form.Item label='Minimum Amount' name='minAmount' initialValue={offerData.minAmount}>
                        <Input placeholder='Minimum amount' type='number' min={0} prefix={'₹'} />
                    </Form.Item>
                    <Form.Item label='Start & End Date' name='date' initialValue={offerData.date?.[0] ? offerData.date : []}>
                        <DatePicker.RangePicker/>
                    </Form.Item>
                    <Form.Item label='Active Status' name='active' initialValue={offerData.active}>
                        <Radio.Group>
                            <Radio value={true}>Active</Radio>
                            <Radio value={false}>Not Active</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <FormItem wrapperCol={{offset:6}}>
                        <Button htmlType='submit' loading={addOfferStatus === STATUS.FETCHING || updateOfferStatus === STATUS.FETCHING}>
                            {defaultOffer ? 'Update' : 'Add'}
                        </Button>
                    </FormItem>
                </Form>
        </Drawer>
    )
}