import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Card, DatePicker, Drawer, Form, Input, Modal, Radio, Space, Table, Tag, Tooltip } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import _, { filter } from 'lodash'
import { addNoticeAction, deleteNoticeAction, getAllNoticeAction, resetAddNotice, updateNoticeAction } from '../../redux/reducers/notice'
import { STATUS } from '../../Constants'
import confirm from 'antd/lib/modal/confirm'
import { ConfirmAlert } from '../../Constants/CommonAlerts'
import TextArea from 'antd/lib/input/TextArea'

export const Notice = () => {
    const dispatch = useDispatch()
    const [noticeDrawer, openNoticeDrawer] = useState()
    const [editNoticeDrawer, openEditNoticeDrawer] = useState()
    const [descriptions, openDescription] = useState([])

    const {getAllNoticeStatus, noticeList, deleteNoticeStatus} = useSelector(state => ({
        getAllNoticeStatus:state.notice.getAllNoticeStatus,
        noticeList:state.notice.noticeList,
        deleteNoticeStatus:state.notice.deleteNoticeStatus
    }))
    
    useEffect(() => {
        dispatch(getAllNoticeAction())
    }, [])

    const _openNoticeDrawer = () => {
        openNoticeDrawer(!noticeDrawer)
    }

    const editNotice = (d) => {
        openEditNoticeDrawer(d?._id ? d : false)
    }

    const deleteNotice = (d) => {
        ConfirmAlert(() => dispatch(deleteNoticeAction({noticeId:d._id})), 'Sure?', null, deleteNoticeStatus === STATUS.FETCHING)
    }

    const _openDescirpton = (obj) => {
        openDescription(d => _.xor(d, [obj._id]))
    }

    const filters = [
        {
            text: "Active",
            value: true,
          },
          {
            text: "InActive",
            value: false,
          },
    ]
    const onFilter = (value, record) => {
        record = Object.assign({}, record, {
          active: record.active || false,
        });
        return record.active === value;
      }

    return(
        <div>
            <CommonPageHeader title='Manage Notices'
                extra={<Button size='large' onClick={_openNoticeDrawer} icon={<PlusOutlined/>}>Add Notice</Button>}
            />
            <br/>
            <Card>
                <Table  loading={getAllNoticeStatus === STATUS.FETCHING} bordered dataSource={noticeList}>
                    <Table.Column title='Title' dataIndex='title'></Table.Column>
                    <Table.Column width='40%' title='Description' dataIndex='body'
                        render={(d, obj) => {
                            let readMore = _.findIndex(descriptions,des => des === obj._id) != -1
                            return d?.length > 240 ? 
                             <div>
                                {readMore ? d : d.substring(0, 240)+'...'}
                                {readMore ? 
                                    <Button type='link' color='blue' style={{padding:0}} size='xs' onClick={() => _openDescirpton(obj)}>read less</Button>
                                    :
                                    <Button type='link' color='blue' style={{padding:0}} size='xs' onClick={() => _openDescirpton(obj)}>read more</Button>
                                }
                            </div> : d
                        }}
                    ></Table.Column>
                    <Table.Column title='Start & End Date' key='date'
                        render={d => d.startDate ? moment(d.startDate).format('DD-MM-YYYY') + ' to ' + moment(d.endDate).format('DD-MM-YYYY') : '-'}
                    ></Table.Column>
                    <Table.Column filters={filters} onFilter = {onFilter} title='Active' dataIndex='active' key='active'
                        render={d => d ? <Tag color='success'>Active</Tag> : <Tag color='red'>Inactive</Tag> }
                    ></Table.Column>
                    <Table.Column title='Priority' dataIndex='priority'></Table.Column>
                    <Table.Column title='Actions' key='actions'
                        render={d => 
                            <Space>
                                <Tooltip title='Edit'>
                                    <Button icon={<EditOutlined />} onClick={() => editNotice(d)}></Button>
                                </Tooltip>
                                <Tooltip title='Delete'>
                                    <Button icon={<DeleteOutlined />} onClick={() => deleteNotice(d)}></Button>
                                </Tooltip>
                            </Space>
                        }
                    ></Table.Column>
                </Table>
            </Card>
            {noticeDrawer ? <AddNotice visible={noticeDrawer} closeModal={_openNoticeDrawer}  /> : null}
            {editNoticeDrawer ? <AddNotice visible={editNoticeDrawer} closeModal={editNotice} currentNotice={editNoticeDrawer} /> : null}
        </div>
    )
}

const AddNotice = ({visible, closeModal, currentNotice}) => {
    const dispatch = useDispatch()

    const {addNoticeStatus, updateNoticeStatus} = useSelector(state => ({
        addNoticeStatus:state.notice.addNoticeStatus,
        updateNoticeStatus:state.notice.updateNoticeStatus
    }))

    useEffect(() => {
        return () => dispatch(resetAddNotice())
    }, [])

    useEffect(() => {
        if(addNoticeStatus === STATUS.SUCCESS || updateNoticeStatus === STATUS.SUCCESS)
            closeModal()
    }, [addNoticeStatus, updateNoticeStatus])
    
    const addNotice = (formData) => {
        let data = {..._.omit(formData, ['date']), startDate:formData.date?.[0]?.format('YYYY-MM-DD') || '', endDate:formData.date?.[1]?.format('YYYY-MM-DD') || '', priority:parseInt(formData.priority)}

        if(currentNotice)
            dispatch(updateNoticeAction({...data, noticeId:currentNotice._id}))
        else
            dispatch(addNoticeAction(data))
    }

    return(
        <Drawer width='50%' visible={visible} onClose={closeModal} title={currentNotice ? 'Update Notice' : 'Add Notice'}>
            <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}
                onFinish={addNotice}
            >
                <Form.Item label='Title' initialValue={currentNotice?.title} rules={[{required:true, message:'Please fill in the field.'}]} name='title'>
                    <Input placeholder='Name'/>
                </Form.Item>
                <Form.Item label='Description' initialValue={currentNotice?.body} name='body'>
                    <TextArea rows={4} placeholder='Description'/>
                </Form.Item>
                <Form.Item label='Start & End Date' initialValue={currentNotice?.startDate ? [moment(currentNotice?.startDate) , moment(currentNotice?.endDate)] : []} name='date'>
                    <DatePicker.RangePicker />
                </Form.Item>
                <Form.Item label='Active' name='active' initialValue={currentNotice? currentNotice.active : true}>
                    <Radio.Group>
                        <Radio.Button value={true}>
                            Yes
                        </Radio.Button>
                        <Radio.Button value={false}>
                            No
                        </Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='Priority' name='priority' initialValue={currentNotice?.priority}>
                    <Input type='number' placeholder='Priority' min={0}/>
                </Form.Item>
                <Form.Item wrapperCol={{span:16, offset:6}}>
                    <Button loading={addNoticeStatus === STATUS.FETCHING || updateNoticeStatus === STATUS.FETCHING} htmlType='submit'>
                        {currentNotice ? 'Update' : 'Add'}
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    )
}