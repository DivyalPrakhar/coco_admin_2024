import React, { useEffect, useReducer, useState } from 'react'
import {Card, Table, Form, DatePicker, Input, Button, Select, Tag, Popover, Row, Col, Space, Image, Tooltip} from 'antd'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { useDispatch, useSelector } from 'react-redux'
import { getPackagesAction } from '../../redux/reducers/packages'
import { STATUS } from '../../Constants'
import { bilingualText } from '../../utils/FileHelper'
import { getOrderHistoryAction, recheckOrderAction, resetRecheckAction } from '../../redux/reducers/orders'
import moment from 'moment'
import { FileExcelOutlined, InfoCircleTwoTone, RedoOutlined } from '@ant-design/icons'
import { FormReducer } from '../../utils/FormReducer'
import { useParams } from 'react-router'
import Text from 'antd/lib/typography/Text'
import { BaseURL } from '../../BaseUrl'
import { URIS } from '../../services/api'
import _ from 'lodash'
import { DeliveryStatusModal } from './DeliveryStatusModal'

export const OfflineOrders = () => {
    const StatusTypes = [{name:'SUCCESS', value:'Success'}, {value:'Failed', name:'FAILED'}, {name:'PROCESSING', value:'Processing'}, {name:'CANCELLED', value:'Cancelled'}]
    const dispatch = useDispatch()
    const params = useParams()

    const {getPackagesStatus, packagesList, getHistoryStatus, orderHistory, recheckOrderStatus, updateOrderStatus} = useSelector(state => ({
        getPackagesStatus:state.packages.getPackagesStatus,
        packagesList:state.packages.packagesList,
        getHistoryStatus:state.orders.getHistoryStatus,
        orderHistory:state.orders.orderHistory,
        recheckOrderStatus: state.orders.recheckOrderStatus,
        updateOrderStatus:state.orders.updateOrderStatus,
    }))

    const [filterData, changeFilter] = useReducer(FormReducer, {})
    const [recheckId, changeRecheckId] = useState()
    const [deliveryStatusModal, changeDeliveryStatusModal] = useState()


    useEffect(() => {
        if(updateOrderStatus === STATUS.SUCCESS)
            changeDeliveryStatusModal(false)
    }, [updateOrderStatus])

    useEffect(() => {
        dispatch(getOrderHistoryAction({deliverable:true}))

        return () => dispatch(resetRecheckAction())
    }, [])
    
    useEffect(() => {
        dispatch(getPackagesAction())
    }, [dispatch])

    const handleApply = () => {
        dispatch(getOrderHistoryAction({...filterData, deliverable:true}))
    }

    const serialize = function(obj, prefix) {
        var str = [],
          p;
        for (p in obj) {
          if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p,
              v = obj[p];
            str.push((v !== null && typeof v === "object") ?
              serialize(v, k) :
              encodeURIComponent(k) + "=" + encodeURIComponent(v));
          }
        }
        return str.join("&");
    }

    const printExcel = () => {
        // history.push('/order-history/1')
        let data = serialize({...filterData, excel:true, deliverable:true})
        window.open(_.trimEnd(BaseURL, '/')+URIS.GET_ORDER_HISTORY + '?' + data, '_blank')
        // dispatch(getOrderHistoryAction({page:currentPage, ...filterData, excel:true}))
    }

    const handleChangeFilter = (value, type) => {
        if(type === 'date')
            changeFilter({type:'merge', value})
        else
            changeFilter({type, value})
    }

    const handleChangePage =(e) => {
        dispatch(getOrderHistoryAction({page:e.current, ...filterData, deliverable:true}))
    }

    const resetHistory = () => {
        changeFilter({type:'reset'})
        dispatch(getOrderHistoryAction({deliverable:true}))
    }

    const clearData = () => {
        changeFilter({type:'merge', value:{startDate:null, endDate:null}})
    }

    const handleRecheck = (id) => {
        changeRecheckId(id)
        dispatch(recheckOrderAction({orderId:id}))
    }

    const handleDeliveryStatus = (data) => {
        changeDeliveryStatusModal(data)
    }

    const statusList = [{value:'Processed', id:1, color:'blue'}, {value:'Shipped', id:2, color:'orange'}, {value:'In-Transit', id:3, color:'orange'}, {value:'Delivered', id:4, color:'green'}, {value:'Cancelled', id:4, color:'red'}]

    console.log('orderHistory', orderHistory)
    return(
        <div>
            <CommonPageHeader title='Deliverable Order History'/>
            <br/>
            <Card loading={getPackagesStatus === STATUS.FETCHING}>
                {getPackagesStatus === STATUS.SUCCESS ? 
                    <>
                        <Row gutter={24}>
                            <Col span={8}>
                                <Form.Item label='User Contact' al>
                                    <Input type='number' onChange={e => handleChangeFilter(e.target.value, 'contact')}
                                        placeholder='User contact' value={filterData?.contact} min={0}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label='Packages'>
                                    <Select mode='multiple' allowClear placeholder='Select packages' onChange={e => handleChangeFilter(e, 'pId')}
                                        value={filterData?.pId}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {packagesList?.length ? 
                                            packagesList.map(pkg => 
                                                <Select.Option key={pkg._id}>{bilingualText(pkg.name)}</Select.Option>
                                            )
                                            :
                                                null
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label='Delivery Status'>
                                    <Select allowClear placeholder='Select delivery status' value={filterData?.deliveryStatus} onChange={e => handleChangeFilter(e, 'deliveryStatus')}>
                                        {statusList.map((st, i) => 
                                            <Select.Option key={st.value}>{st.value}</Select.Option>
                                        )}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label='Order Status'>
                                    <Select allowClear placeholder='Select order status' value={filterData?.status} onChange={e => handleChangeFilter(e, 'status')}>
                                        {StatusTypes.map((st, i) => 
                                            <Select.Option key={st.value}>{st.name}</Select.Option>
                                        )}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label='Start & End Date '>
                                    <div style={{display:'flex'}}>
                                        <DatePicker.RangePicker style={{width:'100%'}} placeholder={['Start date', 'End date']}
                                            value={filterData?.startDate ? [ moment(filterData.startDate), moment(filterData.endDate)] : []}
                                            onChange={(e) => handleChangeFilter({startDate:e ? moment(e[0]).format('YYYY-MM-DD') : null, endDate:e ? moment(e[1]).format('YYYY-MM-DD') : null}, 'date')} 
                                        />
                                    </div>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Button onClick={handleApply}>Apply</Button>&nbsp;
                                <Button icon={<FileExcelOutlined />} onClick={printExcel}>Excel</Button>&nbsp;
                                <Button icon={<RedoOutlined />} onClick={resetHistory}>Reset</Button>
                            </Col>
                        </Row>
                        <Card bodyStyle={{padding:10}}>
                            <Text><b>Total Orders:</b> {orderHistory?.meta.total}</Text>
                        </Card>
                        <br/>

                        <Table dataSource={orderHistory?.docs || []} bordered scroll={{ x: 2200 }} loading={getHistoryStatus === STATUS.FETCHING}
                            pagination={{total:orderHistory?.meta.total, current:orderHistory?.meta.page || 1, showSizeChanger:false, position:['bottomCenter', 'topCenter']}} 
                            onChange={handleChangePage}
                        >
                            <Table.Column fixed='left' title='User Name' render={d => d.user.name}></Table.Column>
                            <Table.Column title='Order Id' render={d => d.payment?.orderId}></Table.Column>
                            <Table.Column title='Date' width={120} render={d => moment(d.createdAt).format('DD-MM-YYYY LT')}></Table.Column>
                            <Table.Column title='Amount (₹)' dataIndex='amount'></Table.Column>
                            <Table.Column title='Contact' render={d => d.user.contact}></Table.Column>
                            <Table.Column title='Address' width={300} 
                                render={d => 
                                    d.addressShipping ? 
                                        <Space direction='vertical'>
                                            <Space align='start'>
                                                <Text type='secondary'>Address:</Text>
                                                <Text>{d.addressShipping.address}</Text>
                                            </Space>
                                            <Space>
                                                <Text type='secondary'>Landmark:</Text>
                                                <Text>{d.addressShipping.landmark}</Text>
                                            </Space>
                                            <Space>
                                                <Text type='secondary'>City:</Text>
                                                <Text>{d.addressShipping.city}</Text>
                                            </Space>
                                            <Space>
                                                <Text type='secondary'>Pincode:</Text>
                                                <Text>{d.addressShipping.pincode}</Text>
                                            </Space>
                                        </Space>
                                        :d.addressBilling ? 
                                            <Space direction='vertical'>
                                                <Space align='start'>
                                                    <Text type='secondary'>Address:</Text>
                                                    <Text>{d.addressBilling.address}</Text>
                                                </Space>
                                                <Space>
                                                    <Text type='secondary'>Landmark:</Text>
                                                    <Text>{d.addressBilling.landmark}</Text>
                                                </Space>
                                                <Space>
                                                    <Text type='secondary'>City:</Text>
                                                    <Text>{d.addressBilling.city}</Text>
                                                </Space>
                                                <Space>
                                                    <Text type='secondary'>Pincode:</Text>
                                                    <Text>{d.addressBilling.pincode}</Text>
                                                </Space>
                                            </Space>
                                            : 
                                            null
                                }
                            ></Table.Column>
                            <Table.Column title='Order Status' dataIndex='status'
                                render={d => <Tag color={d === 'Success' ? 'green' :d === 'Failed' ? 'red' : d === 'Cancelled' ? 'red' : 'blue'}>{d}</Tag>}
                            ></Table.Column>
                            <Table.Column title='Packages' width={400}
                                render={d =>
                                    d.packages?.length ? d.packages.map(pkg => bilingualText(pkg.name)).join(', ') : '-'
                                }
                            ></Table.Column>
                           
                            <Table.Column title='Language' render={d => d.lang === 'hn' || d.lang === 'hindi' ? 'Hindi' :d.lang === 'en' || d.lang === 'english' ?  'English' : ''}></Table.Column>

                            <Table.Column title='remark' dataIndex='remark'></Table.Column>
                            <Table.Column  title='Delivery Status & Remark' width='280px'
                                render={d => 
                                    {
                                        let currentStatus = d.currentDeliveryStatus
                                        return(
                                            currentStatus?.status ? 
                                                <div>
                                                    <div style={{display:'flex', justifyContent:'space-between'}}>
                                                        <Tag color={_.find(statusList,p => p.value === currentStatus?.status)?.color}>{currentStatus?.status}</Tag> 
                                                        <Text>-</Text>
                                                        <div>
                                                            {moment(currentStatus?.createdAt).format('DD-MM-YYYY LT')}&nbsp;
                                                            <Popover placement='bottom' content={
                                                                <div>
                                                                    <Text><b>Remark:</b> {currentStatus?.remark || '-'}</Text>
                                                                    <Table size='small' dataSource={d.deliveryStatus} pagination={false}>
                                                                        <Table.Column dataIndex='status' 
                                                                            render={d => <Tag color={_.find(statusList,p => p.value === d)?.color}>{d}</Tag>}
                                                                        ></Table.Column>
                                                                        <Table.Column dataIndex='createdAt' render={d => moment(d).format('DD-MM-YYYY LT')}></Table.Column>
                                                                    </Table>
                                                                </div>
                                                            }>
                                                                <InfoCircleTwoTone />
                                                            </Popover>
                                                        </div>
                                                    </div>
                                                    {d.deliveryStatus?.length && _.filter(d.deliveryStatus,d => d.fileUrl)?.length ?
                                                        <Space wrap style={{marginTop:4}}>
                                                            { _.filter(d.deliveryStatus,d => d.fileUrl).map(d => 
                                                                <div style={{padding:4, border:'1px solid #D6DBDF', borderRadius:5}} key={d._id}>
                                                                    <Tooltip title={d.status}>
                                                                        <Image src={d.fileUrl} style={{width:50, height:50, objectFit:'cover', cursor:'pointer'}}/>
                                                                    </Tooltip>
                                                                </div>
                                                            )}
                                                        </Space>
                                                        : null
                                                    }
                                                </div>
                                                :
                                                null
                                        )
                                    }
                                }
                            ></Table.Column>
                            {/* <Table.Column title='Remark' render={d => d.user.contact}></Table.Column> */}
                            
                            <Table.Column fixed='right' title='Action'
                                render={d =>
                                    <Button size='small' onClick={() => handleDeliveryStatus(d)}>Delivery Status</Button>
                                } 
                            ></Table.Column>
                        </Table>
                    </>
                    :
                    null
                }
            </Card>
            {deliveryStatusModal ? <DeliveryStatusModal orderData={deliveryStatusModal} visible={deliveryStatusModal} closeModal={() => handleDeliveryStatus(null)}/> : null}
        </div>
    )
}