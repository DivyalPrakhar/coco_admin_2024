import React, { useEffect, useReducer, useState } from 'react'
import {Card, Table, Form, DatePicker, Input, Button, Select, Tag, Popover, Row, Col, Alert} from 'antd'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { useDispatch, useSelector } from 'react-redux'
import { PAYMENT_STATUS, STATUS } from '../../Constants'
import { getOrderHistoryAction, recheckOrderAction } from '../../redux/reducers/orders'
import moment from 'moment'
import { FileExcelOutlined, RedoOutlined } from '@ant-design/icons'
import { FormReducer } from '../../utils/FormReducer'
import { useHistory, useParams } from 'react-router'
import Text from 'antd/lib/typography/Text'
import { BaseURL } from '../../BaseUrl'
import { URIS } from '../../services/api'
import _ from 'lodash'
import { getWalletHistoryAction } from '../../redux/reducers/wallet'

export const WalletHistory = () => {
    const StatusTypes = [{name:'SUCCESS', value:'Success'}, {value:'Failed', name:'FAILED'}, {name:'PROCESSING', value:'Processing'}, {name:'CANCELLED', value:'Cancelled'}]
    const dispatch = useDispatch()
    const history = useHistory()

    const {getWalletStatus, walletData} = useSelector(state => ({
        recheckOrderStatus: state.orders.recheckOrderStatus,
        getWalletStatus:state.wallet.getWalletStatus,
        walletData:state.wallet.walletData
    }))

    const [filterData, changeFilter] = useReducer(FormReducer, {})

    useEffect(() => {
        dispatch(getWalletHistoryAction({...filterData}))
    }, [dispatch])


    const handleApply = () => {
        dispatch(getWalletHistoryAction({...filterData}))
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
        let data = serialize({..._.omitBy(filterData,d => !d),excel:true})
        window.open(_.trimEnd(BaseURL, '/')+URIS.GET_WALLET_HISTORY + '?' + data, '_blank')
    }

    const handleChangeFilter = (value, type) => {
        if(type === 'date')
            changeFilter({type:'merge', value})
        else
            changeFilter({type, value})
    }

    const handleChangePage =(e) => {
        dispatch(getWalletHistoryAction({page:e.current, ...filterData}))
    }

    const resetHistory = () => {
        changeFilter({type:'reset'})
        dispatch(getWalletHistoryAction())
    }

    return(
        <div>
            <CommonPageHeader title='Wallet History'/>
            <br/>
            <Card>
                <Alert type='success' message={'For more details see order history.'} 
                    action={<Button onClick={() => history.push('/order-history')}>Order History</Button>}
                />
                <br/>
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item label='User Contact'>
                            <Input type='number' onChange={e => handleChangeFilter(e.target.value, 'contact')}
                                placeholder='User contact' value={filterData?.contact} min={0}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label='Transaction Type'>
                            <Select allowClear placeholder='Select type' onChange={e => handleChangeFilter(e, 'type')}
                                value={filterData?.type}
                            >
                                <Select.Option value='credit'>Credit</Select.Option>
                                <Select.Option value='debit'>Debit</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label='Status'>
                            <Select allowClear placeholder='Select status' onChange={e => handleChangeFilter(e, 'status')}
                                value={filterData?.status}
                            >
                                {PAYMENT_STATUS.map(p => 
                                    <Select.Option key={p._id} value={p.value}>{p.name}</Select.Option>
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
                    <Col span={8}>
                        <Button onClick={handleApply}>Apply</Button>&nbsp;
                        <Button icon={<FileExcelOutlined />} onClick={printExcel}>Excel</Button>&nbsp;
                        <Button icon={<RedoOutlined />} onClick={resetHistory}>Reset</Button>
                    </Col>
                </Row>
                {/* <br/>
                <Card bodyStyle={{padding:10}}>
                    <Text><b>Total:</b> {walletData?.meta.total}</Text>
                </Card> */}
                <br/>

                <Table dataSource={walletData?.docs || []} bordered scroll={{x: 1500}} loading={getWalletStatus === STATUS.FETCHING}
                    pagination={{position:['bottomCenter', 'topCenter'], current:walletData?.meta.page, total:walletData?.meta.total, showSizeChanger:false}} 
                    onChange={handleChangePage}
                >
                    <Table.Column title='Name' fixed='left' dataIndex='user' render={d => d.name}></Table.Column>
                    <Table.Column title='Contact' dataIndex='user' render={d => d.contact}></Table.Column>
                    <Table.Column title='Type' dataIndex='type'></Table.Column>
                    <Table.Column title='Amount' dataIndex='payableAmount'></Table.Column>
                    <Table.Column title='Status' dataIndex='status' render={d => <Tag color={_.find(PAYMENT_STATUS,p => p.value === d)?.color}>{d}</Tag>}></Table.Column>   
                    <Table.Column title='Date' dataIndex='createdAt' render={d => moment(d).format('DD-MM-YYYY hh:mm')}></Table.Column>
                    <Table.Column title='Transaction Id' dataIndex='payment' render={d => d?.txnId || '-'}></Table.Column>
                    {/* <Table.Column title='Payment Status' dataIndex='payment' render={d => d?.status || '-'}></Table.Column> */}
                    <Table.Column title='Error' dataIndex='payment' render={d => 
                        d?.response?.error ?
                            <div>
                                <Text type='danger'>{d.response.error.description}</Text>&nbsp;&nbsp; 
                                <Popover
                                    content={
                                        <div>
                                            <div><Text type='danger'><b>Source:</b> {d.response.error.source}</Text></div>
                                            <div><Text type='danger'><b>Reason:</b> {d.response.error.reason}</Text></div>
                                        </div>
                                    }
                                >
                                    <Button size='small'>more</Button>
                                </Popover>
                            </div>
                            : '-'
                    }></Table.Column>
                    
                </Table>
            </Card>
        </div>
    )
}

// export const WalletReport = () => {
//     const dispatch = useDispatch()

//     const {getWalletStatus, walletData} = useSelector(state => ({
//         getWalletStatus:state.wallet.getWalletStatus,
//         walletData:state.wallet.walletData
//     }))

//     useEffect(() => {
//         dispatch(getWalletHistoryAction())
//     }, [dispatch])

//     console.log('data', walletData, getWalletStatus)
//     return(
//         <div>
//             <CommonPageHeader title='Wallet History'/>

//             <Card>
//                 <Table dataSource={walletData} loading={getWalletStatus === STATUS.FETCHING}>
//                     <Table.Column title='Name'></Table.Column>
//                     <Table.Column title='Contact'></Table.Column>
//                     <Table.Column title='Type'></Table.Column>
//                     <Table.Column title='Amount'></Table.Column>
//                     <Table.Column title='Status'></Table.Column>

//                 </Table>
//             </Card>
//         </div>
//     )
// }