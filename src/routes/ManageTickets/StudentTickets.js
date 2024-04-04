import { RedoOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Space, Table, Tag, Form, DatePicker, Select, message } from 'antd'
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
import { useHistory, useParams } from 'react-router'
import { getStudentAction } from '../../redux/reducers/student'
import { Truncate } from '../../components/Truncate'
import { TotalCountBox } from '../../components/TotalCountBox'

export const StudentTickets = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const params = useParams()

    const {getAllTicketsStatus, allTickets, updateTicktStatus, currentStudent, getStudentStatus} = useSelector(state => ({
        getAllTicketsStatus:state.tickets.getAllTicketsStatus,
        allTickets:state.tickets.allTickets,
        updateTicktStatus:state.tickets.updateTicktStatus,
        currentStudent: state.student.currentStudent,
        getStudentStatus:state.student.getStudentStatus
    }))

    const [ticketModal, openTicketModal] = useState()
    const [filterData, changefilterData] = useState()

    useEffect(() => {
        dispatch(getAllTicketsAction({userId:params.id}))
        dispatch(getStudentAction({ userId: params.id }));

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
        dispatch(getAllTicketsAction({...filterData, userId:params.id}))
    }
    
    const handleReset = () => {
        changefilterData(null)
        dispatch(getAllTicketsAction({userId:params.id}))
    }

    const handleCloseTicket = (d) => {
        ConfirmAlert(() => dispatch(updateTicketAction({ticketId:d._id, status:'Closed'})), 'Are you sure?', null, updateTicktStatus === STATUS.FETCHING)
    }

    const handlePageChange = (e) => {
        dispatch(getAllTicketsAction({page:e.current, userId:params.id}))
    }
    
    let statusList = [{value:'Pending', color:'blue'}, {value:'Open', color:'green'}, {value:'Closed', color:'red'}, {value:'Duplicate', color:'yellow'}]
    return(
        <div>
            <CommonPageHeader title={currentStudent?.user.name} />
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
                <TotalCountBox count={allTickets?.total} title='Tickets' />
                <Table dataSource={allTickets?.docs || []} loading={getAllTicketsStatus === STATUS.FETCHING} onChange={handlePageChange} bordered
                    pagination={{showSizeChanger:false, total:allTickets?.total, current:allTickets?.page, pageSize:allTickets?.limit, position:['bottomCenter', 'topCenter']}}
                >
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
                                {d.status === 'Closed' ? null : 
                                    <Button size='small' onClick={() => handleCloseTicket(d)}>Close Ticket</Button>
                                }
                            </Space>
                        }
                    ></Table.Column>
                    
                </Table>
            </Card>
            {ticketModal ? <TicketModal visible={ticketModal} ticketData={ticketModal} closeModal={() => handleTicketModal(null)}/> : null}
        </div>
    )
}