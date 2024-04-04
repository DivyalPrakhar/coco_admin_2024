import React, { useEffect } from 'react'
import {
    Form,
    Table,
    Button,
    Modal,
} from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, StarOutlined } from '@ant-design/icons';
import { deleteFeedbackSurveyTopic, getFeedbackSurveyTopic } from '../../redux/reducers/feedbackSurvey';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '../../Constants';
import { useParams } from 'react-router-dom';


export const SurveyTopicTable = props => {
    const dispatch = useDispatch()

    const { getSurveyTopic } = useSelector(s => ({
        getSurveyTopic: s?.feedbacksurvey?.getsurveytopic
    }))
    const CurrentSurveyData = useSelector(s => s.feedbacksurvey.CurrentSurveyData)
    const postSurveyTopicStatus = useSelector(s => s.feedbacksurvey.postSurveyTopicStatus)
    const postFeedbackSurveyStatus = useSelector(s => s.feedbacksurvey.postFeedbackSurveyStatus)

    const id = useParams()

    useEffect(() => {
        if (id?.[0] != '*') {   
            dispatch(getFeedbackSurveyTopic({ surveyId: id?.[0] }))
        }
    }, [id?.[0]])


    const { confirm } = Modal;
    const showConfirm = (isDelete) => {
        confirm({
            title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleOutlined />,

            onOk() {
                dispatch(deleteFeedbackSurveyTopic({ surveyTopicId: isDelete }))
            },
            onCancel() { },
        });
    };

    const columns = [
        {
            title: 'Sr.No.',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: 'Topic',
            dataIndex: 'topic',
            key: 'topic',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Required/NotRequired',
            dataIndex: 'required',
            key: 'required',
        },
        {
            title: 'Edit',
            dataIndex: 'edit',
            key: 'edit',
        },
        {
            title: 'Delete',
            dataIndex: 'delete',
            key: 'delete',
        },
    ];

    const tabledata = getSurveyTopic?.map((d, i) =>
    ({
        key: d?._id,
        number: ++i,
        topic: d?.topicName,
        type: d?.fieldType === 'rating' ? <Rating /> : d?.fieldType,
        required: d?.required === true ? 'Required' : 'NotRequired',
        edit: <Button shape='circle' onClick={() => props.handleEdit(d._id)}><EditOutlined /></Button>,
        delete: <Button shape='circle' onClick={() => showConfirm(d._id)}><DeleteOutlined /></Button>
    }))


    return (
        <>
            <Form.Item label='' >
                <Table pagination={false} columns={columns} style={{ marginLeft: 60 }} dataSource={tabledata} size="small" />
            </Form.Item >
        </>
    )
}


export const Rating = () => {
    const staricon = [1, 2, 3, 4, 5]
    return (
        <div >
            {staricon.map((d) => {
                return (
                    <StarOutlined key={d} />
                )
            })
            }
        </div>
    )
}
