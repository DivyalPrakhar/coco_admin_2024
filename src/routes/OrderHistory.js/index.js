import React, { useEffect, useReducer, useState } from 'react'
import {Card, Table, Form, DatePicker, Input, Button, Select, Tag, Modal, Popover, Row, Col, Space, Radio} from 'antd'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { useDispatch, useSelector } from 'react-redux'
import { getPackagesAction } from '../../redux/reducers/packages'
import { STATUS } from '../../Constants'
import { bilingualText } from '../../utils/FileHelper'
import { getOrderHistoryAction, recheckOrderAction, resetRecheckAction, updateOrderAction } from '../../redux/reducers/orders'
import moment from 'moment'
import { FileExcelOutlined, RedoOutlined } from '@ant-design/icons'
import { FormReducer } from '../../utils/FormReducer'
import { useParams } from 'react-router'
import Text from 'antd/lib/typography/Text'
import { BaseURL } from '../../BaseUrl'
import { URIS } from '../../services/api'
import _ from 'lodash'

export const OrderHistory = () => {
    const StatusTypes = [{name:'SUCCESS', value:'Success'}, {value:'Failed', name:'FAILED'}, {name:'PROCESSING', value:'Processing'}, {name:'CANCELLED', value:'Cancelled'}]
    const dispatch = useDispatch()
    const params = useParams()

    const {getPackagesStatus, updateOrderStatus,  packagesList, getHistoryStatus, orderHistory, recheckOrderStatus} = useSelector(state => ({
        getPackagesStatus:state.packages.getPackagesStatus,
        packagesList:state.packages.packagesList,
        getHistoryStatus:state.orders.getHistoryStatus,
        orderHistory:state.orders.orderHistory,
        recheckOrderStatus: state.orders.recheckOrderStatus,
        updateOrderStatus:state.orders.updateOrderStatus
    }))

    const [filterData, changeFilter] = useReducer(FormReducer, {})
    const [recheckId, changeRecheckId] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [editModal, openEditModal] = useState()

    useEffect(() => {
        if(recheckOrderStatus === STATUS.SUCCESS){
            Modal.info({
                title:'Rechecking successful'
            })
            dispatch(getOrderHistoryAction({...filterData}))
        }
    }, [recheckOrderStatus])

    useEffect(() => {
        if(updateOrderStatus === STATUS.SUCCESS){
            dispatch(getOrderHistoryAction({...filterData, page:currentPage}))
            openEditModal()
        }
    }, [updateOrderStatus, dispatch, filterData])

    // useEffect(() => {
    //     if(getHistoryStatus === STATUS.SUCCESS)
    //         history.push('/order-history/'+orderHistory?.meta.page)
    // }, [getHistoryStatus, history, orderHistory?.meta.page])

    useEffect(() => {
        dispatch(getOrderHistoryAction({...filterData}))

        return () => dispatch(resetRecheckAction())
    }, [])
    
    useEffect(() => {
        dispatch(getPackagesAction())
    }, [dispatch])

    const handleApply = () => {
        dispatch(getOrderHistoryAction({...filterData}))
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
        let data = serialize({...filterData,excel:true})
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
        dispatch(getOrderHistoryAction({page:e.current, ...filterData}))
        setCurrentPage(e.current)
    }

    const resetHistory = () => {
        changeFilter({type:'reset'})
        dispatch(getOrderHistoryAction({}))
    }

    const clearData = () => {
        changeFilter({type:'merge', value:{startDate:null, endDate:null}})
    }

    const handleRecheck = (id) => {
        changeRecheckId(id)
        dispatch(recheckOrderAction({orderId:id}))
    }

    const handleEditOrder = (order) => {
        openEditModal(d => d ? null : order)
    }

    return(
        <div>
            <CommonPageHeader title='Order History'/>
            <br/>
            <Card loading={getPackagesStatus === STATUS.FETCHING}>
                {getPackagesStatus === STATUS.SUCCESS ? 
                    <>
                            <Row gutter={24} >
                                <Col span={8}>
                                    <Form.Item label='User Contact'>
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
                                    <Form.Item label='Order Type'>
                                        <Select allowClear placeholder='Order Type' onChange={e => handleChangeFilter(e, 'type')}
                                            value={filterData?.type}
                                        >
                                            <Select.Option value='Online'>Online</Select.Option>
                                            <Select.Option value='Offline'>Offline</Select.Option>
                                            <Select.Option value='Coupon'>Coupon</Select.Option>
                                            <Select.Option value='Wallet'>Wallet</Select.Option>

                                        </Select>
                                    </Form.Item>
                                </Col><Col span={8}>
                                    <Form.Item label='Pricing mode'>
                                        <Select allowClear placeholder='mode' onChange={e => handleChangeFilter(e, 'subscription')}
                                            value={filterData?.subscription}
                                        >
                                            <Select.Option value={0}>One time</Select.Option>
                                            <Select.Option value={1}>Subscription</Select.Option>
                                            <Select.Option value={undefined}>All</Select.Option>
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
                                        <DatePicker.RangePicker style={{width:'100%'}} placeholder={['Start date', 'End date']}
                                            value={filterData?.startDate ? [ moment(filterData.startDate), moment(filterData.endDate)] : []}
                                            onChange={(e) => handleChangeFilter({startDate:e ? moment(e[0]).format('YYYY-MM-DD') : null, endDate:e ? moment(e[1]).format('YYYY-MM-DD') : null}, 'date')} 
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row justify='end'>
                                <Col style={{ margin: '10px 0px' }}>
                                    <Button onClick={handleApply}>Apply</Button>&nbsp;
                                    <Button icon={<FileExcelOutlined />} onClick={printExcel}>Excel</Button>&nbsp;
                                    <Button icon={<RedoOutlined />} onClick={resetHistory}>Reset</Button>
                                </Col>
                            </Row>
                            <Card bodyStyle={{padding:10}}>
                                <Text><b>Total Orders:</b> {orderHistory?.meta.total}</Text>
                            </Card>
                        <br/>

                        <Table dataSource={orderHistory?.docs || []} bordered scroll={{ x: 3200 }} loading={getHistoryStatus === STATUS.FETCHING}
                            pagination={{total:orderHistory?.meta.total, current:orderHistory?.meta.page || 1, showSizeChanger:false, position:['bottomCenter', 'topCenter']}} 
                            onChange={handleChangePage}
                        >
                            <Table.Column title='Payment Type' fixed='left' 
                                render={d => 
                                    <Space>
                                        <Text>{d.type}</Text>
                                        {d.type === 'Offline' && <Button onClick={() => handleEditOrder(d)} size='small'>Edit</Button>}
                                    </Space>
                                }
                            ></Table.Column>
                            <Table.Column title='Transaction Id' fixed='left' render={d => d.payment?.txnId || d.breakup?.utr}></Table.Column>
                            <Table.Column title='User Name' fixed='left' render={d => d.user.name}></Table.Column>
                            <Table.Column title='Order Id' dataIndex='_id'></Table.Column>
                            <Table.Column title='Date' width={110} render={d => moment(d.createdAt).format('DD-MM-YYYY LT')}></Table.Column>
                            <Table.Column title='Amount' dataIndex='amount'></Table.Column>
                            <Table.Column title='Contact' render={d => d.user.contact}></Table.Column>
                            <Table.Column title='Alt Contact' render={d => d.user.altContact}></Table.Column>
                            <Table.Column title='Order Status' dataIndex='status' 
                                render={d => <Tag color={d === 'Success' ? 'green' :d === 'Failed' ? 'red' : d === 'Cancelled' ? 'red' : 'blue'}>{d}</Tag>}
                            ></Table.Column>
                            <Table.Column width={400} title='Packages'
                                render={d =>
                                    d.packages?.length ? d.packages.map(pkg => bilingualText(pkg.name)).join(', ') : '-'
                                }
                            ></Table.Column>
                            
                            <Table.Column width={110} title='Pricing mode'
                                render={d =>
                                    d.subscription ? "Subscription" : 'One time'
                                }
                            ></Table.Column>
                            <Table.Column title='Language' render={d => d.lang === 'hn' || d.lang === 'hindi' ? 'Hindi' :d.lang === 'en' || d.lang === 'english' ?  'English' : ''}></Table.Column>
                            <Table.Column title='Remark' dataIndex='remark' width={350}></Table.Column>
 
                            <Table.Column title='Error' width='300px' 
                                render={d => 
                                    d.payment?.response?.error ?
                                    <div>
                                        <Text type='danger'>{d.payment.response.error.description}</Text>&nbsp;&nbsp; 
                                        <Popover
                                            content={
                                                <div>
                                                    <div><Text type='danger'><b>Source:</b> {d.payment.response.error.source}</Text></div>
                                                    <div><Text type='danger'><b>Reason:</b> {d.payment.response.error.reason}</Text></div>
                                                </div>
                                            }
                                        >
                                            <Button size='small'>more</Button>
                                        </Popover>
                                    </div>
                                    : '-'
                                }
                            ></Table.Column>
                            <Table.Column title='Payment Status' width='150px' render={d => d.payment?.status}></Table.Column>
                            <Table.Column title='Installment' width={110} render={d => d.installment }></Table.Column>
                            <Table.Column title='Deliverable' width={110} render={d => <div>{ d.deliverable ? "True" : "False"}</div> }></Table.Column>
                            <Table.Column title='Pending' width={110} render={d => d.pending }></Table.Column>
                            <Table.Column title='Mode' width={110} render={d => d.mode }></Table.Column>
                            {/* <Table.Column title='Language' width={110} render={d => d.lang }></Table.Column> */}
                            <Table.Column title='Receipt No' width={110} render={d => d.receiptNo }></Table.Column>
                            <Table.Column title='Actions' width={120} fixed='right'
                                render={d => 
                                        <Button onClick={() => handleRecheck(d.payment?.orderId)} 
                                            loading={recheckOrderStatus === STATUS.FETCHING && recheckId === d.payment?.orderId} 
                                            icon={<RedoOutlined />} size='small'
                                        >
                                            Recheck
                                        </Button>
                                }
                            ></Table.Column>
                        </Table>
                    </>
                    :
                    null
                }
            </Card>
            {editModal ? <EditModal visible={editModal} closeModal={handleEditOrder} order={editModal} /> : null}
        </div>
    )
}

const EditModal = ({visible, closeModal, order}) => {
    const dispatch = useDispatch()
    
    const  {updateOrderStatus} = useSelector(state => ({
        updateOrderStatus:state.orders.updateOrderStatus
    })) 
    const [editData, changeEditData] = useState({})

    useEffect(() => {
        if(order)
            changeEditData({utr:order.breakup?.utr, remark:order.remark, amount:order.amount, installment: order.installment, pending: order.pending, mode: _.lowerCase(order.mode), lang: _.lowerCase(order.lang), receiptNo: order.receiptNo, deliverable: order.deliverable })
    }, [order])
    
    const handleSubmit = () => {
        const {utr, amount, remark, installment, pending, mode, lang, receiptNo, deliverable } = editData
        dispatch(updateOrderAction({
            _id:order._id,
            installment, pending, mode, lang, receiptNo, deliverable,
            amount,
            breakup:{utr, amount},
            oldBreakup:{...order.breakup, remark: order.remark},
            updated:moment().format('YYYY-MM-DD LT'),
            remark,
        }))
    }

    const handleChange = (e, key) => {
        changeEditData(d => ({...d, [ key ||e.target.id]:e.target.value}))
    }

    return(
        <Modal title='Edit' visible={visible} onCancel={closeModal} onOk={handleSubmit} okText='Update'
            okButtonProps={{loading:updateOrderStatus === STATUS.FETCHING, htmlType:'submit'}}
        >
            <Form wrapperCol={{span:20}} labelCol={{span:4}} onFinish={handleSubmit}>
                <Form.Item label='UTR'>
                    <Input placeholder='UTR' value={editData.utr} id='utr' onChange={handleChange} />
                </Form.Item>
                <Form.Item label='Amount'>
                    <Input type={'number'} value={editData.amount} placeholder='Amount' id='amount' onChange={handleChange} />
                </Form.Item>
                <Form.Item label='Remark'>
                    <Input.TextArea placeholder='Remark' value={editData.remark} id='remark' onChange={handleChange}/>
                </Form.Item>
                <Form.Item label='Installment'>
                    <Input placeholder='installment' value={editData.installment} id='installment' onChange={handleChange}/>
                </Form.Item>
                <Form.Item label='Pending'>
                    <Input placeholder='pending' value={editData.pending} id='pending' onChange={handleChange}/>
                </Form.Item>
                <Form.Item label='Mode'>
                    <Radio.Group onChange={ e => handleChange(e, 'mode') } value={editData.mode}>
                        <Radio value='online'>online</Radio>
                        <Radio value='offline'>offline</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='deliverable'>
                    <Radio.Group onChange={ e => handleChange(e, 'deliverable') } value={editData.deliverable}>
                        <Radio value={true}>True</Radio>
                        <Radio value={false}>False</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='Language'>
                    <Radio.Group onChange={ v => handleChange(v, 'lang') } value={editData.lang}>
                        <Radio value='hn'>Hindi</Radio>
                        <Radio value='en'>English</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='Receipt No'>
                    <Input placeholder='Receipt No' value={editData.receiptNo} id='receiptNo' onChange={handleChange}/>
                </Form.Item>
            </Form>
        </Modal>
    )
}