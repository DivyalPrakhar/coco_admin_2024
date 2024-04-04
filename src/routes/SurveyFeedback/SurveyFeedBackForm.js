import React, { useEffect, useState } from 'react'
import {
    DatePicker,
    Form,
    Input,
    Select,
    Card,
    Button,
    Modal,
    Tag,
    Row,
} from 'antd';
import { BiAddToQueue } from "react-icons/bi";
import { getFeedbackSurvey, patchFeedbackSurveyList, postFeedbackSurvey, resetFeedbackData, resetFeedbackStatus } from '../../redux/reducers/feedbackSurvey';
import { STATUS } from '../../Constants';
import { getSingleInstituteAction } from '../../redux/reducers/instituteStaff';
import { useDispatch, useSelector } from 'react-redux';
import TextArea from 'antd/lib/input/TextArea';
import { SurveyTopic } from './SurveyTopic';
import { useHistory, useParams } from 'react-router-dom';
import { SpecificPackages } from './Specific_Packages';
import moment from 'moment';
import _, { compact } from 'lodash';
import { PackageAccessibility } from '../../Constants';


export const SurveyFeedbackForm = (props) => {
    const dispatch = useDispatch();
    const history = useHistory()
    const surveyData = useSelector(s => s?.feedbacksurvey?.feedbacksurveydata)
    const getStatus = useSelector(s => s.instituteStaff.getStatus)
    const getallFeedbackSurvey = useSelector(s => s.feedbacksurvey.getfeedbacksurveydata)
    const getFeedbackSurveyStatus = useSelector(s => s.feedbacksurvey.getFeedbackSurveyStatus)
    const postFeedbackSurveyStatus = useSelector(s => s.feedbacksurvey.postFeedbackSurveyStatus)
    const patchSurveylistStatus = useSelector(s => s.feedbacksurvey.patchSurveylistStatus)

    const id = useParams()
    const surveyId = surveyData?._id || id[0]; 

    useEffect( () => {
        dispatch(resetFeedbackData())
    },[id])
    const resetEditData = () => {
        setEditSurveyData({
            title: '',
            desc: '',
            teachers: [],
            duration: '',
            startDate: moment().format('YYYY-MM-DD'),
            accessibility: 'all',
        })
    }

    const handleAddSurvey = (values, e) => {
        let data = {}
        let formData = new FormData(e?.target)
        for (const pair of formData.entries()) {
            data[pair[0]] = pair[1]
        }
        postSurveyData()
    }

    const { data, user } = useSelector(s => ({
        data: s.instituteStaff,
        user: s.user
    }))

    useEffect(() => {
        if (getFeedbackSurveyStatus !== STATUS.SUCCESS) {
            dispatch(getFeedbackSurvey({}))
        }
    }, [])

    useEffect(() => {
        if (getStatus !== STATUS.SUCCESS) {
            dispatch(getSingleInstituteAction({ id: user?.user?.staff?.institute._id }))
        }
    }, [])

    const postSurveyData = () => {
        if (editsurevydata._id) {
            dispatch(patchFeedbackSurveyList({
                surveyId: editsurevydata?._id,
                title: editsurevydata?.title,
                description: editsurevydata?.description,
                teachers: editsurevydata?.teachers,
                duration: editsurevydata?.duration,
                startDate: editsurevydata?.startDate,
                accessibility: editsurevydata?.accessibility,
                specific_packages: editsurevydata?.accessibility == 'specific' ? selectedPackages?.map((i) => i?.[0].key) : null
            }))
        } else {
            dispatch(postFeedbackSurvey({
                title: editsurevydata.title,
                description: editsurevydata.description,
                teachers: editsurevydata.teachers,
                duration: editsurevydata.duration,
                startDate: editsurevydata.startDate,
                accessibility: editsurevydata.accessibility,
                specific_packages: editsurevydata.accessibility == 'specific' ? selectedPackages.map((i) => i?.[0].key) : null
            }))
        }
    }



    useEffect(() => {
        if (postFeedbackSurveyStatus === STATUS.SUCCESS) {
            // resetEditData()
            history.push('/survey-feedback/'+surveyData?._id);
            dispatch(resetFeedbackStatus())
        }
    }, [dispatch, history, postFeedbackSurveyStatus, surveyData?._id])


    let todayDate = moment()
    const dateformat = 'YYYY-MM-DD'

    // useEffect(() => {
    //     if (patchSurveylistStatus === STATUS.SUCCESS) {
    //         resetEditData()
    //     }
    // }, [patchSurveylistStatus])

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const [selectedPackages, setPackages] = useState()
    const handleGetData = (data) => {
        setPackages(data)
    }
    const handleTags = (removedTag) => {
        const newTags = selectedPackages.filter((tag) => tag[0].key !== removedTag);
        setPackages(newTags);
    };

    const [editsurevydata, setEditSurveyData] = useState({
        title: '',
        desc: '',
        teachers: [],
        duration: '',
        startDate: moment().format('YYYY-MM-DD'),
        accessibility: 'all',
    })
    const handleEdit = (id) => {
        let Data = getallFeedbackSurvey ? [...getallFeedbackSurvey]?.find((d) => d._id == id?.[0]) : null;
        if (!Data) { 
            resetEditData();
            setPackages([]);
            return null;
        }
        
        setPackages(_.map(compact(Data.specific_packages), d => { const keyPack = d._id ? d._id : d.key; return ( [{ ...d,package: { en: d?.name?.en }, key: keyPack }]) }))
        const teacherId = _.map(Data?.teachers, d => d?._id)
        const fd = { ...Data }
        fd['teachers'] = teacherId
        setEditSurveyData(fd)
    }
    useEffect(() => {
        handleEdit(id)
    }, [id])

    const changeValue = (id, value) => {
        setEditSurveyData((preval) => ({ ...preval, [id]: value }))
    }
    const handleDate = (id, value) => {
        setEditSurveyData((preval) => ({ ...preval, [id]: value }))
    }
    const handleAddNewSurveyBt = () => {
        history.push('/survey-feedback/*');
    }

    return (
        <>
            <Card>
                <Form
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 14,
                    }}
                    layout="horizontal"
                    onFinish={handleAddSurvey}
                >
                    <Form.Item
                        label="Survey/Feedback title"
                        name='title' required>
                        <div>
                            <Input required
                                value={editsurevydata?.title}
                                onChange={(e) => changeValue('title', e.target.value)} />
                        </div>
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name='desc'>
                        <div>
                            <TextArea
                                rows={4}
                                value={editsurevydata?.description}
                                onChange={(e) => changeValue('description', e.target.value)} />
                        </div>
                    </Form.Item>
                    <Form.Item
                        label="Teacher"
                        name='teachers'>
                        <div>
                            <Select showSearch
                                style={{
                                    width: '100%',
                                }}
                                mode="multiple"
                                placeholder="Search to Select"
                                optionFilterProp="children"
                                value={editsurevydata?.teachers}
                                onChange={(e) => { changeValue('teachers', e) }}
                            >
                                {data && data.singleInstitute?.[0].staffs?.filter((staff) => staff.staffRole == 'TEACHER')?.map(teacher =>
                                    <Select.Option value={teacher.user._id} key={teacher._id}>{teacher.user.name}</Select.Option>)}
                            </Select>
                        </div>
                    </Form.Item>
                    <Form.Item
                        label="Duration"
                        name='duration' required>
                        <div>
                            <Input required
                                type='number'
                                placeholder='Duration in Days'
                                value={editsurevydata?.duration}
                                onChange={(e) => changeValue('duration', e.target.value)} />
                        </div>
                    </Form.Item>
                    <Form.Item
                        label="Start date"
                        name='startDate'>
                        <>
                            <DatePicker
                            defaultValue={moment(todayDate, dateformat)}
                            value={ editsurevydata?.startDate ? moment(editsurevydata?.startDate) : ''}
                            onChange={(e) => { handleDate('startDate', e.format('YYYY-MM-DD')) }} />
                        </>
                    </Form.Item>
                    <Form.Item required
                        label="Accessibility"
                        name='accessibility'>
                        <div>
                            <Select
                                value={editsurevydata?.accessibility}
                                onChange={(e) => changeValue('accessibility', e)}>
                                {PackageAccessibility.map((access) =>
                                    <Select.Option key={access.value} value={access.value} >{access?.title} </Select.Option>
                                )}
                            </Select>
                        </div>
                        <br />
                        {editsurevydata?.accessibility == 'specific' ?
                            <Row>
                                <Button
                                    type='primary'
                                    onClick={showModal} >Select Packages</Button>
                                <br /><br/>
                                <Card style={{ width: 800 }}>
                                    {_.map(selectedPackages, i => _.map(i, d =>
                                        <Tag key={d.key} closable onClose={() => { handleTags(d?.key) }} >
                                            {d?.package?.en}
                                        </Tag>
                                    ))}
                                </Card>
                            </Row>
                            :
                            null
                        }
                        <Modal
                            width={1000}
                            footer={null}
                            title={<b>Select Specific Packages</b>}
                            visible={isModalVisible} onOk={handleOk}
                            onCancel={handleCancel}>
                            <p><SpecificPackages getData={handleGetData} handleCancel={handleCancel} /></p>
                        </Modal>
                    </Form.Item>
                    <Form.Item style={{ marginLeft: 100 }} >
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={patchSurveylistStatus === STATUS.FETCHING || postFeedbackSurveyStatus === STATUS.FETCHING} >
                            {editsurevydata?._id ? 'Update' : 'Submit'}
                        </Button>
                        {
                            editsurevydata?._id &&
                            <Button style={{ marginLeft: '10px' }} onClick={handleAddNewSurveyBt}>
                               <BiAddToQueue style={{  marginRight: '3px' }}/> Add new
                            </Button>
                        }
                    </Form.Item>
                </Form >
            </Card >
            <br />
            <SurveyTopic surveyId={surveyId} />
        </>
    )
}