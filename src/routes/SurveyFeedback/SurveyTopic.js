import React, { useEffect, useState } from 'react'
import {
    Form,
    Select,
    Card,
    Button,
    Switch,
} from 'antd';
import { patchFeedbackSurveyTopic, postFeedbackSurveyTopic } from '../../redux/reducers/feedbackSurvey' 
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '../../Constants';
import TextArea from 'antd/lib/input/TextArea';
import { Header } from 'antd/lib/layout/layout';
import { SurveyTopicTable } from './SurveyTopicTable';
import { useParams } from 'react-router-dom';

export const SurveyTopic = (props) => {
    
    const id = useParams()
    const dispatch = useDispatch()
    const surveyTopicData = useSelector(s => s?.feedbacksurvey?.surveytopic)
    const postSurveyTopicStatus = useSelector(s => s?.feedbacksurvey?.postSurveyTopicStatus)
    const patchSurveyTopicStatus = useSelector(s => s?.feedbacksurvey?.patchSurveyTopicStatus)
    const postFeedbackSurveyStatus = useSelector(s => s?.feedbacksurvey?.postFeedbackSurveyStatus)
    const { getSurveyTopic } = useSelector(s => ({
        getSurveyTopic: s?.feedbacksurvey?.getsurveytopic
    }))

    const [form] = Form.useForm()
    const [editdata, setEditData] = useState({
        fieldType: 'rating',
        required: true
    })

    const [formKey, changeFormKey] = useState(0)
    const postSurveyTopic = (d) => {
        if (d?._id) {
            dispatch(patchFeedbackSurveyTopic({
                surveyId: props.surveyId,
                surveyTopicId: d?._id,
                topicName: d?.topicName,
                fieldType: d?.fieldType,
                required: d?.required
            }))
        }
        else {
            dispatch(postFeedbackSurveyTopic({
                surveyId: props.surveyId,
                topicName: d?.topicName,
                fieldType: d?.fieldType,
                required: d?.required
            }))
        }
    }
    const handleSurveyTopic = (values) => {
        postSurveyTopic(editdata)
    }

    const [loadings, setLoadings] = useState(false);
   
    useEffect(() => {
        if (postSurveyTopicStatus === STATUS.FETCHING) {
            setLoadings(true)
        }
        else {
            setLoadings(false)
        }
        if (postSurveyTopicStatus === STATUS.SUCCESS) {
            setEditData({
                topicName: '',
                fieldType: 'rating',
                required: true
            })
        }
    }, [postSurveyTopicStatus])


    useEffect(() => {
        if (patchSurveyTopicStatus === STATUS.SUCCESS) {
            setEditData({
                topicName: '',
                fieldType: 'rating',
                required: true
            })
        }
    }, [patchSurveyTopicStatus])

    const handleEdit = (id) => {
        const Data = getSurveyTopic?.find((d) => d._id === id)
        setEditData(Data)
        changeFormKey(d => ++d)
    }
    const changeValue = (id, value) => {
        setEditData((preval) => ({ ...preval, [id]: value }))
    }
    return (
        <>
            {postFeedbackSurveyStatus === STATUS.SUCCESS  || id?.[0] != '*' ?
                <Card id='SurveyTopic'>
                    {editdata ?

                        <Form key={formKey} labelCol={{
                            span: 4,
                        }}
                            wrapperCol={{
                                span: 14,
                            }}
                            layout="horizontal"
                            onFinish={handleSurveyTopic}
                        >
                            <Header style={{ backgroundColor: 'white' }}>{editdata?._id ? 'Update' : 'Add'} Survey topics</Header>
                            <Form.Item label="Topic Name:" name='topic' required>
                                <div>
                                    <TextArea required value={editdata?.topicName} onChange={(e) => changeValue('topicName', e.target.value)} />
                                </div>
                            </Form.Item>
                            <Form.Item label="Field Type" name='fieldType' required >
                                <div>
                                    <Select required  value={editdata.fieldType} onChange={(e) => changeValue('fieldType', e)}>
                                        <Select.Option value="rating" >Rating</Select.Option>
                                        <Select.Option value="description">Description</Select.Option>
                                    </Select>
                                </div>
                            </Form.Item>
                            <Form.Item label="Required" name='required' required >
                                <Switch required checked={editdata.required} onChange={(e) => changeValue('required', e)} />
                            </Form.Item>
                            <Form.Item style={{ marginLeft: 100 }} >
                                <Button type="primary" htmlType="submit" loading={loadings === true}>{editdata?._id ? 'Update' : 'Submit'}</Button>
                            </Form.Item>
                        </Form>

                        :
                        null
                    }
                </Card>
                :
                ""
            }
            <Card>
                <Form.Item>
                    <SurveyTopicTable surveyId={props.surveyId} handleEdit={handleEdit} />
                </Form.Item>
            </Card>
        </>
    )
}