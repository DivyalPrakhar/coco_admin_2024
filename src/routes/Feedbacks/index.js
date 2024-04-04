import { RedoOutlined } from '@ant-design/icons'
import { Card, Table, Select, Form, Button, Space, DatePicker, Input } from 'antd'
import Text from 'antd/lib/typography/Text'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { Truncate } from '../../components/Truncate'
import { STATUS } from '../../Constants'
import { getFeedbacksAction } from '../../redux/reducers/feedbacks'

export const Feedbacks = () => {
    const dispatch = useDispatch()
    const {getFeedbackStatus, feedbackList} = useSelector(state => ({
        getFeedbackStatus:state.feedbacks.getFeedbackStatus,
        feedbackList:state.feedbacks.feedbackList

    }))

    const [selectedRating, changeRating] = useState()
    const [selectedDates, setDates] = useState()
    const [contact, changeContact] = useState()

    useEffect(() => {
        dispatch(getFeedbacksAction())
    }, [dispatch])

    const ratings = [0, 1, 2, 3, 4, 5]

    const handleSelectRating = (rating) => {
        changeRating(rating)
    }

    const appyFilters = () => {
        dispatch(getFeedbacksAction({rating:selectedRating, startDate:selectedDates?.[0], endDate:selectedDates?.[1], contact}))
    }

    const handleDateChange = (d) => {
        if(d){
            let startDate = moment(d[0]).format('YYYY-MM-DD')
            let endDate = moment(d[1]).format('YYYY-MM-DD')
            setDates([startDate, endDate])
        }
        else
            setDates(null)
    }

    const handleContact = (e) => {
        changeContact(e.target.value)
    }

    const resetfilter =() => {
        changeRating(null)
        setDates(null)
        changeContact(null)
        dispatch(getFeedbacksAction())
    }
    
    return(
        <div>
            <CommonPageHeader title='Feedbacks'/>
            <br/>
            <Card>
                <Space size='large'>
                    <Form.Item label='contact'>
                        <Input type='number' value={contact} allowClear placeholder='contact' min={0} onChange={handleContact}  />
                    </Form.Item>
                    <Form.Item label='Rating'>
                        <Select style={{width:200}} allowClear value={selectedRating} onChange={handleSelectRating} placeholder='select rating'>
                            {ratings.map(r => 
                                <Select.Option value={r}>{r}</Select.Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item label='Start & End Date'>
                        <DatePicker.RangePicker 
                            value={selectedDates?.[0] ? [moment(selectedDates[0]), moment(selectedDates[1])] : null} 
                            onChange={handleDateChange} placeholder={['start date', 'end date']}
                            format={'DD-MM-YYYY'}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button onClick={appyFilters}>Apply</Button>
                            <Button onClick={resetfilter} icon={<RedoOutlined />}>Reset</Button>
                        </Space>
                    </Form.Item>
                </Space>
                <Card bodyStyle={{padding:10}}>
                    <Text><b>Total Feedbacks:</b> {feedbackList.length}</Text>
                </Card>
                <br/>
                <Table bordered loading={getFeedbackStatus === STATUS.FETCHING} pagination={{position:['topCenter', 'bottomCenter']}} dataSource={feedbackList || []}>
                    <Table.Column title='User Name' width={200} dataIndex='userId' render={d => d?.name}></Table.Column>
                    <Table.Column title='Contact' width={120} dataIndex='userId' render={d => d?.contact}></Table.Column>
                    <Table.Column title='Message' dataIndex='message' 
                        render={d => <Truncate length='100'>{d}</Truncate>}
                    ></Table.Column>
                    <Table.Column width={120} title='Rating (5)' dataIndex='rating'
                      sorter={ (a, b) => a.rating - b.rating}
                    ></Table.Column>
                    <Table.Column width={150} title='Date' dataIndex='createdAt' render={d => moment(d).format('DD-MM-YYYY')}
                      sorter={ (a, b) => new Date(a.createdAt) - new Date(b.createdAt)} defaultSortOrder='descend'
                      key='date'
                    ></Table.Column>
                </Table>
            </Card>
        </div>
    )
}