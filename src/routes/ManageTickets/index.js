import { RedoOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Space, Table, Tag, Form, DatePicker, Select } from 'antd'
import Text from 'antd/lib/typography/Text'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { STATUS } from '../../Constants'
import { ConfirmAlert } from '../../Constants/CommonAlerts'
import { getAllTicketsAction, updateTicketAction } from '../../redux/reducers/tickets'
import { TicketModal } from './TicketModal'
import _ from 'lodash'
import { useHistory } from 'react-router'
import { Truncate } from '../../components/Truncate'
import { TotalCountBox } from '../../components/TotalCountBox'

export const ManageTickets = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const {getAllTicketsStatus, allTickets, updateTicktStatus} = useSelector(state => ({
        getAllTicketsStatus:state.tickets.getAllTicketsStatus,
        allTickets:state.tickets.allTickets,
        updateTicktStatus:state.tickets.updateTicktStatus
    }))

    const [ticketModal, openTicketModal] = useState()
    const [filterData, changefilterData] = useState()

    useEffect(() => {
        dispatch(getAllTicketsAction())
    }, [dispatch])

    const handleTicketModal = (data) => {
        openTicketModal(data)
    }

    const handleFilter = (value, name) => {
        let filters = filterData

        if(name === 'date')
            filters = {...filters, startDate:value?.[0] ? moment(value[0]).format('YYYY-MM-DD') : null, endDate:value?.[0] ? moment(value[1]).format('YYYY-MM-DD') : null}
        else
            filters = {...filters, [name]:value} 
    
        changefilterData(filters)
    }

    const handleSubmit = () => {
        dispatch(getAllTicketsAction(filterData))
    }
    
    const handleReset = () => {
        changefilterData(null)
        dispatch(getAllTicketsAction())
    }

    const handleCloseTicket = (d) => {
        ConfirmAlert(() => dispatch(updateTicketAction({ticketId:d._id, status:'Closed'})), 'Are you sure?', null, updateTicktStatus === STATUS.FETCHING)
    }

    const handlePageChange = (e) => {
        dispatch(getAllTicketsAction({page:e.current}))
    }
    

    const handleStudent = (id) => {
        history.push('student-desk/'+id)
    }
    
    let statusList = [{value:'Pending', color:'blue'}, {value:'Open', color:'green'}, {value:'Closed', color:'red'}, {value:'Duplicate', color:'yellow'}]
    return(
        <div>
            <CommonPageHeader title='Desk'/>
            <br/>
            <Card>
                <Row>
                    <Col span={8}>
                        <Form.Item label='Start & End Date'>
                            <DatePicker.RangePicker value={filterData?.startDate ? [moment(filterData.startDate), moment(filterData.endDate)] : null} onChange={(d) => handleFilter(d, 'date')}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label='Status'>
                            <Select value={filterData?.status} allowClear placeholder='Select status' onChange={(e => handleFilter(e, 'status'))}>
                                {statusList.map(status => 
                                    <Select.Option key={status.value} value={status.value}>{status.value}</Select.Option>
                                )}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={7} offset={1}>
                        <Space>
                            <Button onClick={handleSubmit}>Apply</Button>
                            <Button onClick={handleReset} icon={<RedoOutlined />}>Reset</Button>
                        </Space>
                    </Col>
                </Row>
                <TotalCountBox count={allTickets?.total} title={'Tickets'} />
                <Table dataSource={allTickets?.docs || []} loading={getAllTicketsStatus === STATUS.FETCHING} onChange={handlePageChange} bordered
                    pagination={{showSizeChanger:false, total:allTickets?.total, current:allTickets?.page, pageSize:allTickets?.limit, position:['bottomCenter', 'topCenter']}}
                >
                    <Table.Column title='Student' dataIndex='userId' 
                        render={d => <Button style={{color:'#3498DB'}} onClick={() => handleStudent(d._id)} type='link'>{d.name}</Button> || '-'}
                    ></Table.Column>
                    <Table.Column title='Subject' dataIndex='subject'></Table.Column>
                    <Table.Column title='Category' dataIndex='category'></Table.Column>
                    <Table.Column title='Message' dataIndex='message'
                        render={message => 
                            <Truncate length='100'>
                                {message}
                            </Truncate>
                        }
                    ></Table.Column>
                    <Table.Column title='Status' dataIndex='status' width={100} render={d => 
                        <Tag color={_.find(statusList,l => l.value === d)?.color}>{d}</Tag>
                    }></Table.Column>
                    <Table.Column title='Date' dataIndex='createdAt' width={110} render={d => moment(d).format('DD-MM-YYYY LT')}></Table.Column>
                    <Table.Column title='Actions' width={130}
                        render={d => 
                            <Space>
                                <Button size='small' onClick={() => handleTicketModal(d)}>Show</Button>
                                <Button size='small' onClick={() => handleCloseTicket(d)}>Close Ticket</Button>
                            </Space>
                        }
                    ></Table.Column>
                    
                </Table>
            </Card>
            {ticketModal ? <TicketModal visible={ticketModal} ticketData={ticketModal} closeModal={() => handleTicketModal(null)}/> : null}
        </div>
    )
}