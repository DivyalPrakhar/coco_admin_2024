import { Button, Drawer, Form, Input, DatePicker, Select, Checkbox} from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import moment from 'moment'
import _ from 'lodash'
import { addDiscussionTopicAction, resetDiscussionTopicStatus } from '../../redux/reducers/discussionTopicReducer'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'

export const DiscussionTopicDrawer = ({ visible, closeDrawer, updateData, community, parentId }) => {
    const [form] = Form.useForm()
    const dispatch = useDispatch()

     const { user, discussionTopicData } = useSelector((state) => ({
        user: state.user.user,
        discussionTopicData: state.discussionTopicReducer
    }))

    useEffect(() => {
        if (discussionTopicData.addDiscussionTopicStatus === STATUS.SUCCESS) {
            closeDrawer()
            dispatch(resetDiscussionTopicStatus())
        }
    }, [closeDrawer, discussionTopicData.addDiscussionTopicStatus, dispatch])

    const _addDiscussionTopic = (data) => {
        dispatch(addDiscussionTopicAction({data, apiType: updateData ? 'patch' : 'post'}))
    }

    const _closeDrawer = () => {
        closeDrawer()
        form.resetFields()
    }

    return (
        <Drawer placement='right' onClose={_closeDrawer} visible={visible} width='50%' title={updateData ? _.toUpper(`Update ${community} ${parentId ? 'Sub ' : ''} Topic`) : _.toUpper(`Add ${community} ${parentId ? 'Sub ' : ''} Topic`)}>
            <Form
                onFinish={_addDiscussionTopic}
                form={form}
                wrapperCol={{ span: 12 }}
                labelCol={{ span: 6 }}
                layout="horizontal"
            >
                {parentId ?
                    <Form.Item hidden name={'parentTopic'} initialValue={parentId}>
                        <Input />
                    </Form.Item>
                : null}
                {updateData ? 
                    <Form.Item hidden name={'topicId'} initialValue={updateData._id}>
                        <Input />
                    </Form.Item>
                : null}
                <Form.Item hidden name='community' initialValue={community}>
                    <Input />
                </Form.Item>

                <Form.Item name='topic' label='Topic' required initialValue={updateData?.topic}>
                    <Input placeholder='Topic' required />
                </Form.Item>
                <Form.Item name='body' label='Body' required initialValue={updateData?.body}>
                    <Input placeholder='Body' required />
                </Form.Item>
                <Form.Item name='studentsAllowed' label='Students Allowed' valuePropName="checked" initialValue={updateData?.studentsAllowed}>
                    <Checkbox></Checkbox>
                </Form.Item>
                <Form.Item name='active' label='Active' valuePropName="checked" initialValue={updateData?.active}>
                    <Checkbox></Checkbox>
                </Form.Item>
                <Form.Item name='commentsAllowed' label='Allowed Comments' valuePropName="checked" initialValue={updateData ? updateData.commentsAllowed : true}>
                    <Checkbox></Checkbox>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 6 }}>
                    <Button type="primary" loading={discussionTopicData.addDiscussionTopicStatus === STATUS.FETCHING} htmlType="submit">
                       {updateData ? _.toUpper(`Update ${community} ${parentId ? 'Sub ' : ''} Topic`) : _.toUpper(`Add ${community} ${parentId ? 'Sub ' : ''} Topic`)}
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    )
}