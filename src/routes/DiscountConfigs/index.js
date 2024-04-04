import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Card, Space, Table, Tag, Tooltip } from 'antd'
import Text from 'antd/lib/typography/Text'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { STATUS } from '../../Constants'
import { getDiscountConfigsAction } from '../../redux/reducers/discountConfigs'
import { AddDiscountOfferModal } from './AddDiscountOfferModal'

export const DiscountConfigs = () => {
    const dispatch = useDispatch()

    const {getConfigsStatus, discountConfigs, addDiscountOfferStatus, updateDiscountOfferStatus} = useSelector((state) => ({
        getConfigsStatus:state.discountConfigs.getConfigsStatus,
        discountConfigs:state.discountConfigs.discountConfigs,
        addDiscountOfferStatus:state.discountConfigs.addDiscountOfferStatus,
        updateDiscountOfferStatus:state.discountConfigs.updateDiscountOfferStatus
    }))

    const [discountOfferModal, openDiscountOfferModal] = useState()
    const [updateOfferModal, openUpdateOfferModal] = useState()

    useEffect(() => {
        dispatch(getDiscountConfigsAction())
    }, [dispatch])

    useEffect(() => {
        if(updateDiscountOfferStatus === STATUS.SUCCESS){
            openUpdateOfferModal()
        }
    }, [updateDiscountOfferStatus])
    
    useEffect(() => {
        if(addDiscountOfferStatus === STATUS.SUCCESS){
            openDiscountOfferModal()
        }
    }, [addDiscountOfferStatus])

    const handleUpdate = (offer) => {
        openUpdateOfferModal(d => d ? null : offer)
    }
    
    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
          },
          {
            title: 'Type',
            dataIndex: 'discountType',
            key: 'type',
            render:d => <Tag color={d === 'fresh' ? 'green':d === 'any' ? 'blue' : 'orange'}>{d}</Tag>,
            filters: [
                {
                    text: 'Fresh',
                    value: 'fresh',
                },
                {
                    text: 'Old',
                    value: 'old',
                },
                {
                    text: 'Any',
                    value: 'any',
                }
            ],
            onFilter: (value, record) => record.discountType.indexOf(value) === 0,

          },
          {
            title: 'Percent (%)',
            dataIndex: 'percentDiscount',
            key: 'percent',
          },
          {
            title: 'Installation ( start - end )',
            key: 'appInstallStart',
            render:d => <Text>{d?.appInstallStart ? moment(d.appInstallStart).format('ll')+' - '+moment(d.appInstallEnd).format('ll') : '-'}</Text>
          },
          {
            title: 'Session ( start - end )',
            key: 'discountSessionStart',
            render:d => <Text>{d?.discountSessionStart ? moment(d.discountSessionStart).format('ll')+' - '+moment(d.discountSessionEnd).format('ll') : '-'}</Text>
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                {
                    text: 'Active',
                    value: 1,
                },
                {
                    text: 'In-Active',
                    value: 0,
                },
            ],
            onFilter: (value, record) => record.status?.indexOf(value) === 0,
            render:d => d === 1 ? <Tag color={'green'}>Active</Tag> : <Tag color='red'>In-Active</Tag>
          },
          {
            title: 'Actions',
            key: 'actions',
            render:d => 
                <Space>
                    <Tooltip title='Edit'>
                        <Button onClick={() => handleUpdate(d)} icon={<EditOutlined />}/>
                    </Tooltip>
                </Space>
          },
    ]

    const handleAddOffer = () => {
        openDiscountOfferModal(d => !d)
    }

    return(
        <div>
            <CommonPageHeader title='App Install Discount Offers' />
            <br />
            <Card loading={getConfigsStatus === STATUS.FETCHING}>
                <Button onClick={handleAddOffer} icon={<PlusOutlined />}>Add Discount Offer</Button>
                <br/><br/>
                {/* {getConfigsStatus === STATUS.SUCCESS ? 
                    <Table pagination={false} dataSource={discountConfigs || []} columns={columns}/>
                    :
                    <Text type='secondary'>Something went wrong</Text>
                } */}
            </Card>
            {updateOfferModal && <AddDiscountOfferModal  defaultOffer={updateOfferModal} visible={updateOfferModal} closeModal={handleUpdate}/>}
            {discountOfferModal && <AddDiscountOfferModal visible={discountOfferModal} closeModal={handleAddOffer}/>}
        </div>
    )
}