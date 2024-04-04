import { Button, Drawer, Form, Input, DatePicker, Select, Space, Tooltip, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import moment from 'moment'
import _, { intersectionBy, remove } from 'lodash'
import { addPromoCodeAction, resetPromoCodeStatus, updatePromoCodeAction } from '../../redux/reducers/promoCodeReducer'
import { CloseCircleOutlined, PercentageOutlined, PlusOutlined, SelectOutlined, UploadOutlined } from '@ant-design/icons'
import { SelectPackageModal } from '../ManagePackages/SelectPackageModal'
import { bilingualText } from '../../utils/FileHelper'

export const PromoCodeDrawer = ({ visible, closeDrawer, currentPromoCode }) => {
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const [selectedData, setSelectedData] = useState({})
    const [selectPackageModal, openSelectPackageModal] = useState()
    const [selectedPackages, setPackages] = useState([])

    const { user, promoCode } = useSelector((state) => ({
        user: state.user.user,
        promoCode: state.promoCodeReducer
    }))

    useEffect(() => {
        if(currentPromoCode?.packages?.length){
            setPackages(currentPromoCode.packages)
        }
    }, [currentPromoCode])

    useEffect(() => {
        setSelectedData({ type: currentPromoCode?.type })
    }, [currentPromoCode])

    useEffect(() => {
        if (promoCode.addPromoCodeStatus === STATUS.SUCCESS || promoCode.updatePromoCodeStatus === STATUS.SUCCESS) {
            closeDrawer()
            dispatch(resetPromoCodeStatus())
        }
    }, [closeDrawer, promoCode.addPromoCodeStatus, promoCode.updatePromoCodeStatus, dispatch])

    const _addPromoCode = (data) => {
        let removeArray = data['type'] == 'percent' ? ['flat', 'date-range'] : ['date-range', 'maxDiscount', 'percent']
        const rangeValue = data['date-range'];
        let dataValue = _.omit({
            ...data,
            startDate: rangeValue?.length > 1 ? rangeValue[0].format('YYYY-MM-DD') : currentPromoCode?.startDate,
            endDate: rangeValue?.length > 1 ? rangeValue[1].format('YYYY-MM-DD') : currentPromoCode?.endDate,
            type: selectedData.type,
            packages:selectedPackages?.length ? selectedPackages.map(p => p._id) : null
        }, removeArray)

        if (currentPromoCode)
            dispatch(updatePromoCodeAction({ ...dataValue }))
        else
            dispatch(addPromoCodeAction({ ...dataValue }))
    }

    const _closeDrawer = () => {
        closeDrawer()
        form.resetFields()
    }

    const _selectPackageModal = () => {
        openSelectPackageModal(d => !d)
    }

    const _setPackages = (packages) => {
        setPackages(p => [...p, ...packages])
    }

    const _removePackage = (id) => {
        const pkgList = [...selectedPackages]
        console.log('id', id)
        remove(pkgList,p => p._id === id)
        setPackages(pkgList)
    }

    const { Option } = Select;
    const { RangePicker } = DatePicker;

    return (
        <Drawer placement='right' onClose={_closeDrawer} visible={visible} width='50%' title='Add Promo Code'>
            {selectPackageModal ? <SelectPackageModal defaultPackages={selectedPackages} onSubmit={_setPackages} visible={selectPackageModal} closeModal={_selectPackageModal} /> : null}

            <Form
                onFinish={_addPromoCode}
                form={form}
                wrapperCol={{ span: 14 }}
                labelCol={{ span: 4 }}
                layout="horizontal"
            >
                <Form.Item name='title' label='Title' required initialValue={currentPromoCode?.title}>
                    <Input placeholder='Title' required />
                </Form.Item>
                <Form.Item name='code' label='Promo Code' required initialValue={currentPromoCode?.code}>
                    <Input placeholder='Promo Code' required />
                </Form.Item>
                <Form.Item name='code' label='Packages' required >
                    <Space direction='vertical'>
                        <Button type="dashed"   icon={<SelectOutlined />} onClick={_selectPackageModal}>Select Package</Button>
                        {selectedPackages?.length ?
                            <Space wrap direction='vertical'>
                                {selectedPackages.map(pkg =>
                                <div key={pkg._id} style={{padding:5, border:'1px solid #EAEDED'}}> 
                                    <Typography.Text link>
                                        {bilingualText(pkg.name)}&nbsp;&nbsp;&nbsp;
                                        <Tooltip title='remove'>
                                            <CloseCircleOutlined style={{fontSize:16, cursor:'pointer', color:'#E74C3C'}} onClick={() =>_removePackage(pkg._id)} />
                                        </Tooltip>
                                    </Typography.Text>
                                    </div>
                                )}
                            </Space>
                            :
                            null
                        }
                    </Space>
                </Form.Item>
                {currentPromoCode ?
                    <Form.Item hidden name='promoId' initialValue={currentPromoCode._id}>
                        <Input />
                    </Form.Item>
                    : null}
                <Form.Item name='type' label='Type' initialValue={currentPromoCode?.type} required>
                    <Select style={{ width: 120 }} placeholder='Select Type' onChange={(e) => setSelectedData({ ...selectedData, type: e })}>
                        <Option value='percent'>Percent</Option>
                        <Option value='flat'>Flat</Option>
                    </Select>
                </Form.Item>
                {selectedData.type == 'percent' ?
                    <div>
                        <Form.Item name='percent' label='Percent' required initialValue={currentPromoCode?.percent}>
                            <Input prefix={<PercentageOutlined />} placeholder='Add Percent' type='text' required />
                        </Form.Item>
                        <Form.Item name='maxDiscount' label='Max Discount' initialValue={currentPromoCode?.maxDiscount}>
                            <Input prefix={'₹'} placeholder='Max Discount' type='text' />
                        </Form.Item>
                    </div>
                    : null}
                {selectedData.type == 'flat' ?
                    <Form.Item name='flat' label='Flat' required initialValue={currentPromoCode?.flat}>
                        <Input prefix={'₹'} placeholder='Flat' type='text' required />
                    </Form.Item>
                    : null}
                <Form.Item name='date-range' label='Date'>
                    <RangePicker
                        defaultValue={[currentPromoCode?.startDate ? moment(currentPromoCode?.startDate, 'YYYY/MM/DD') : null, currentPromoCode?.endDate ? moment(currentPromoCode?.endDate, 'YYYY/MM/DD') : null]}
                    />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 4 }}>
                    <Button type="primary" disabled={!selectedData?.type} loading={promoCode.addPromoCodeStatus === STATUS.FETCHING || promoCode.updatePromoCodeStatus === STATUS.FETCHING} htmlType="submit">
                        {currentPromoCode ? 'Update' : 'Add'}
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    )
}