import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RedoOutlined } from '@ant-design/icons'
import { Card, Table, Select, Form, Button, DatePicker, Tooltip, Row, Col } from 'antd'

import { find } from 'lodash'
import moment from 'moment'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { ExportExcel } from '../../components/ExportExcel'
import { ENQUIRY_STATUS, STATUS } from '../../Constants'
import { getFranchiseEnquiryAction, updateFranchiseEnquiryAction } from '../../redux/reducers/franchise'
import { RemarkModal } from './RemarkModal'
import { ViewMoreDetailModal } from './ViewMoreDetailModal'


export default function FranchiseEnquiryList() {
    const dispatch = useDispatch()
    const { getFranchiseEnquiryStatus, franchiseEnquiryList, updateFranchiseEnquiryStatus } = useSelector(state => ({
        getFranchiseEnquiryStatus: state.franchiseEnquiry.getFranchiseEnquiryStatus,
        updateFranchiseEnquiryStatus: state.franchiseEnquiry.updateFranchiseEnquiryStatus,
        franchiseEnquiryList: state.franchiseEnquiry.franchiseEnquiryList

    }))

    const [changeStatus, setChangeStatus] = useState()
    const [selectStatus, setSelectStatus] = useState()
    const [showRemarkModal, setShowRemarkModal] = useState(false)
    const [showViewMoreModal, setShowViewMoreModal] = useState(false)
    const [franchiseEnquiryId, setFranchiseEnquiryId] = useState()
    const [selectedDates, setDates] = useState()

    useEffect(() => {
        dispatch(getFranchiseEnquiryAction())
    }, [dispatch])


    const handleChangeStatus = (status, id) => {
        const isCheck = find(franchiseEnquiryList?.docs, f => f._id === id) ? true : false
        if (isCheck) {
            setChangeStatus(status)
            dispatch(updateFranchiseEnquiryAction({ id, status }))
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

    const handleProjectedTimeLine = (projectedTimeLine) => {
        switch (projectedTimeLine) {
            case 'oneMonth': return "One Month";
            case 'twoMonth': return "Two Month"
            case 'immediate': return "Immediate"
            default: return null;
        }
    }
    const handleOpenRemarkModal = (id = false) => {
        setShowRemarkModal(id)
    }
    const handleViewMoreModal = (id) => {
        setShowViewMoreModal(d => !d)
        setFranchiseEnquiryId(id)
    }
    const applyFilters = () => {
        dispatch(getFranchiseEnquiryAction({ status: selectStatus, startDate: selectedDates?.[0], endDate: selectedDates?.[1] }))
    }

    const resetfilter = () => {
        setSelectStatus(null)
        setDates(null)
        dispatch(getFranchiseEnquiryAction())
    }

    const excelData = useMemo(() => {

        if (franchiseEnquiryList?.docs && franchiseEnquiryList?.docs.length) {
            let data = franchiseEnquiryList?.docs.map(d => (
                {
                    Name: d.name,
                    Contact: d.contact,
                    Email: d.email,
                    Address: d.address,
                    'Work Experience': d.workExperience,
                    "Business Experience": d.businessExperience,
                    "Projected Timeline": handleProjectedTimeLine(d.projectedTimeline),
                    Remark: d.remark,
                    Status: d.status,
                    Date: moment(d.createdAt).format('DD-MM-YYYY')
                }))
            return data
        }

        return []

    }, [franchiseEnquiryList])

    return (
        <div>
            <CommonPageHeader title='Franchise Enquiry List' />
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
                    <ExportExcel filename={'franchiseEnquiryList'} title='Download' data={excelData} />
                </Row>
                <br />
                <Table bordered loading={getFranchiseEnquiryStatus === STATUS.FETCHING} scroll pagination={{ position: ['topCenter', 'bottomCenter'] }} dataSource={franchiseEnquiryList?.docs || []}>
                    <Table.Column title='Name' width={200} dataIndex='name' render={d => d}></Table.Column>
                    <Table.Column title='Contact' width={120} dataIndex='contact' render={d => d}></Table.Column>
                    <Table.Column width={150} title='Date' dataIndex='createdAt' render={d => moment(d).format('DD-MM-YYYY')}
                        sorter={(a, b) => new Date(a.createdAt) - new Date(b.createdAt)} defaultSortOrder='descend'
                        key='date'
                    ></Table.Column>
                    <Table.Column width={200} title='Address' dataIndex='address'
                        render={d => <Tooltip title={d}><span style={{ width: '180px', overflow: 'hidden', display: 'inline-block', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{d}</span></Tooltip>}
                    ></Table.Column>
                    <Table.Column width={120} title='Projected Timeline' dataIndex='projectedTimeline'
                        render={d => handleProjectedTimeLine(d)}
                    ></Table.Column>
                    <Table.Column width={120} title='Status' dataIndex='status'
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
                    <Table.Column width={120} title='Remark' dataIndex='remark'
                        render={d => <Tooltip title={d}><span style={{ width: '180px', overflow: 'hidden', display: 'inline-block', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{d}</span></Tooltip>}
                    ></Table.Column>

                    <Table.Column width={150} title='Action' dataIndex='createdAt'
                        render={(d, obj) => {
                            return (
                                <Row style={{minWidth:150}}>
                                        <Button size='small' type='primary' onClick={() => handleOpenRemarkModal(obj._id)} >Remark</Button>
                                        <Button size='small' onClick={() => handleViewMoreModal(obj._id)} style={{ marginLeft:6 }}>View More</Button>
                                </Row>
                            )
                        }}
                        key='date'
                    ></Table.Column>
                </Table>
            </Card>
            <RemarkModal
                loading={updateFranchiseEnquiryStatus === STATUS.FETCHING}
                visible={showRemarkModal}
                showRemarkModal={showRemarkModal}
                closeModal={() => handleOpenRemarkModal(false)}
            />
            <ViewMoreDetailModal visible={showViewMoreModal} franchiseEnquiryId={franchiseEnquiryId} closeModal={handleViewMoreModal} />
        </div>
    )
}