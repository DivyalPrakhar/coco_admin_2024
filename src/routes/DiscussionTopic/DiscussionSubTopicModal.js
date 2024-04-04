import { Button, DatePicker, Drawer, Form, Input, Space, Badge, Tooltip, Modal, Row, Col, Table, Tabs, Checkbox } from 'antd';
import { useEffect, useReducer, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment'
import _ from 'lodash'
import { STATUS } from '../../Constants'
import { 
   getSingleDiscussionTopicAction
} from '../../redux/reducers/discussionTopicReducer'
import {  PlusOutlined, EditOutlined, ScheduleOutlined } from '@ant-design/icons'

export const DiscussionSubTopicModal = (props) => {
    const dispatch = useDispatch()

    let questionData = props.data?.doubtQuestion
    return (
        <Modal visible={props.visible} footer={null} width='1000px' onOk={() => console.log('')} onCancel={() => props.closeModal()}>
            <>
                <Row>
                    <Col span={4}>
                        <b>Question</b>
                    </Col>
                </Row>
                <Row style={{padding: '10px'}}>
                    <Col span={24}>
                        {questionData?.question?.en}
                    </Col>
                </Row>
                <Row style={{padding: '10px'}}>
                    <Col span={24}>
                        {questionData?.question?.hn}
                    </Col>
                </Row>
                <Row>
                    <Col span={4}>
                        <b>Options</b>
                    </Col>
                </Row>
                {_.map(questionData?.options || [], d => {
                    return(
                        <div style={{padding: '10px'}}  key={d._id}>
                            <Row>
                                <Col span={2}>
                                    <span style={{background: d._id === questionData.correctOption ? '#d8d8d8' : '', borderRadius: '30px', padding: '6px', border: '1px solid #b5b5b5', height: '15px', width: '20px'}}>{d?.key?.en}</span>
                                </Col>
                                <Col span={20}>
                                    {d?.body?.en}
                                </Col>
                            </Row>
                            {/*<Row key={d._id}>
                                <Col span={2}>
                                    {d?.key?.hn}
                                </Col>
                                <Col span={20}>
                                    {d?.body?.hn}
                                </Col>
                            </Row>*/}
                        </div>
                    )}
                )}
            </>
        </Modal>
    )
}

