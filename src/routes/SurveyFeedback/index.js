import React from 'react'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import {
    Card,
    Button,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { SurveyFeedbackForm } from './SurveyFeedBackForm';

export const tableicons = () => {
    <>
        <div><Button shape='circle'><EditOutlined /></Button><Button shape='circle'><DeleteOutlined /></Button></div>
    </>
}
const SurveyFeedback = () => {

    return (
        <div>
            <CommonPageHeader title='Create Survey/Feedback' />
            <br />
            <Card>
                <SurveyFeedbackForm />
            </Card>
           
        </div>
    )
}

export default SurveyFeedback
