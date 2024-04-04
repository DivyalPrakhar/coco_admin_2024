import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCareerJobApplicationAction, updateCareerJobApplicationAction } from '../../redux/reducers/career'
import { RedoOutlined } from '@ant-design/icons'
import { Card, Table, Select, Form, Button, DatePicker, Row, Col, Tooltip } from 'antd'

import { find } from 'lodash'
import moment from 'moment'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { ExportExcel } from '../../components/ExportExcel'
import { ENQUIRY_STATUS, STATUS } from '../../Constants'
import { ViewMoreCareerDetailModal } from './viewMoreCareerDetailModal'
import { CareerRemarkModal } from './CareerRemarkModal'


export default function CareerJobApplicationList() {
    const dispatch = useDispatch()
    const { getCareerJobApplicationStatus, careerJobApplicationList, updateCareerJobApplicationStatus } = useSelector(state => ({
        getCareerJobApplicationStatus: state.career.getCareerJobApplicationStatus,
        careerJobApplicationList: state.career.careerJobApplicationList,
        updateCareerJobApplicationStatus: state.career.updateCareerJobApplicationStatus,
    }))

    const [selectedDates, setDates] = useState()
    const [changeStatus, setChangeStatus] = useState()
    const [selectStatus, setSelectStatus] = useState()
    const [showViewMoreModal, setShowViewMoreModal] = useState(false)
    const [showRemarkModal, setShowRemarkModal] = useState(false)
    const [careerId, setCareerId] = useState()

    useEffect(() => {
        dispatch(getCareerJobApplicationAction())
    }, [dispatch])

    const handleChangeStatus = (status, id) => {
        const isCheck = find(careerJobApplicationList?.docs, f => f._id === id) ? true : false
        if (isCheck) {
            setChangeStatus(status)
            dispatch(updateCareerJobApplicationAction({ id, status }))
        }
    }

    const handleDateChange = (d) => {
        if (d) {
            let startDate = moment(d[0]).format('YYYY-MM-DD')
            let endDate = moment(d[1]).format('YYYY-MM-DD')
            setDates([startDate, endDate])
        }
        else
            setDates(null)
    }

    const applyFilters = () => {
        dispatch(getCareerJobApplicationAction({ status: selectStatus, startDate: selectedDates?.[0], endDate: selectedDates?.[1] }))
    }

    const resetfilter = () => {
        setSelectStatus(null)
        setDates(null)
        dispatch(getCareerJobApplicationAction())
    }

    const excelData = useMemo(() => {

        if (careerJobApplicationList?.docs && careerJobApplicationList?.docs.length) {

            let data = careerJobApplicationList?.docs.map(d => (
                {
                    Name: d.name,
                    Contact: d.contact,
                    Email: d.email,
                    Position: d.position,
                    'Reference Medium': d.referenceMedium,
                    Resume: d.resume,
                    Status: d.status,
                    Date: moment(d.createdAt).format('DD-MM-YYYY')
                }))
            return data
        }

        return []

    }, [careerJobApplicationList])

    console.log('careerJobApplicationList', careerJobApplicationList)

    const handleViewMoreModal = (id) => {
        setShowViewMoreModal(d => !d)
        setCareerId(id)
    }
    
    const handleOpenRemarkModal = (id = false) => {
        setShowRemarkModal(id)
    }
    return (
        <div>
            <CommonPageHeader title='Job Appication List' />
            <br />
            <Card>

                <Row size='large' style={{ justifyContent: 'space-between' }}>
                    <Row>
                        <Form.Item label='Status'>
                            <Select style={{ width: 200 }} allowClear value={selectStatus} onChange={(status) => setSelectStatus(status)} placeholder='select status'>
                                {ENQUIRY_STATUS.map(r =>
                                    <Select.Option key={r.value} value={r.value}>{r.title}</Select.Option>
                                )}
                            </Select>
                        </Form.Item>
                        <Form.Item label='Start & End Date' style={{ marginLeft: '10px' }}>
                            <DatePicker.RangePicker
                                value={selectedDates?.[0] ? [moment(selectedDates[0]), moment(selectedDates[1])] : null}
                                onChange={handleDateChange} placeholder={['start date', 'end date']}
                                format={'DD-MM-YYYY'}
                            />
                        </Form.Item>
                        <Col style={{ marginLeft: '10px' }}>
                            <Button onClick={applyFilters}>Apply</Button>
                            <Button onClick={resetfilter} icon={<RedoOutlined />} style={{ marginLeft: 6 }}>Reset</Button>
                        </Col>
                    </Row>
                    <ExportExcel filename={'careerJobApplicationList'} title='Download' data={excelData} />
                </Row>
                <br />
                <Table bordered loading={getCareerJobApplicationStatus === STATUS.FETCHING} scroll pagination={{ position: ['topCenter', 'bottomCenter'] }} dataSource={careerJobApplicationList?.docs || []}>
                    <Table.Column title='Name' width={200} dataIndex='name' render={d => d}></Table.Column>
                    <Table.Column title='Contact' width={120} dataIndex='contact' render={d => d}></Table.Column>
                    <Table.Column width={120} title='Date' dataIndex='createdAt' render={d => <Col style={{minWidth:'118px'}}>{moment(d).format('DD-MM-YYYY')}</Col>}
                        sorter={(a, b) => new Date(a.createdAt) - new Date(b.createdAt)} defaultSortOrder='descend'
                        key='date'
                    ></Table.Column>
                    <Table.Column title='Position' dataIndex='position' w={100}
                        render={d => d}
                    ></Table.Column>
                    <Table.Column title='Resume' dataIndex='resume' w={120}
                        render={d => <a target={'_blank'} href={d}><span style={{ width: '180px', overflow: 'hidden', display: 'inline-block', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{d}</span></a>}
                    ></Table.Column>
                    <Table.Column width={120} title='Remark' dataIndex='remark'
                        render={d => <Tooltip title={d}><span style={{ width: '180px', overflow: 'hidden', display: 'inline-block', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{d}</span></Tooltip>}
                    ></Table.Column>
                    <Table.Column width={40} title='Status' dataIndex='status'
                        render={(d, obj) => {
                            return (
                                <div>
                                    <Select style={{ width: '130px' }} allowClear value={d} onChange={(status) => handleChangeStatus(status, obj._id)} placeholder='select status'>
                                        {ENQUIRY_STATUS.map(r =>
                                            <Select.Option key={r.value} value={r.value}>{r.title}</Select.Option>
                                        )}
                                    </Select>
                                </div>
                            )
                        }}
                    ></Table.Column>

                    <Table.Column width={150} title='Action' dataIndex='createdAt'
                        render={(d, obj) => {
                            return (
                                <Row style={{ minWidth: 150 }}>
                                    <Button size='small' type='primary' onClick={() => handleOpenRemarkModal(obj._id)} >Remark</Button>
                                    <Button size='small' onClick={() => handleViewMoreModal(obj._id)} style={{ marginLeft: 6 }}>View More</Button>
                                </Row>
                            )
                        }}
                        key='date'
                    ></Table.Column>

                </Table>
            </Card>
            <CareerRemarkModal
                loading={updateCareerJobApplicationStatus === STATUS.FETCHING}
                visible={showRemarkModal}
                showRemarkModal={showRemarkModal}
                closeModal={() => handleOpenRemarkModal(false)}
            />
            <ViewMoreCareerDetailModal visible={showViewMoreModal} careerId={careerId} closeModal={handleViewMoreModal} />
        </div>
    )
}