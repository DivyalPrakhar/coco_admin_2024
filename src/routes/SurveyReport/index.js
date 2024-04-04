import { DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Col, Radio, Row, Table, Tooltip } from 'antd'
import _ from 'lodash'
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ExportExcel } from '../../components/ExportExcel';
import { printHelper, PRINT_TYPE } from '../../Constants';
import { getFeedbackSurveyTopic, getSurveyTopicAnswers, getSingleSurveyData } from '../../redux/reducers/feedbackSurvey';
import DiscritptiveAnswer from './DiscritptiveAnswer';

const MAX_STARTS_COUNT = 5;
export default function SurveyReport(props) {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [ topics, setTopics ] = useState([])
    const [ discriptiveAnswers, setDiscriptiveAnswer ] = useState([]);
    const surveyReducer = useSelector( s => s.feedbacksurvey);
    const { getsurveytopic, surveyTopicAnswer, singleSurveyData } = surveyReducer;
    useEffect( () => {
        if(!id) return;
        dispatch(getSingleSurveyData({ surveyId: id }) )
        dispatch(getFeedbackSurveyTopic({ surveyId: id }))
        dispatch(getSurveyTopicAnswers({ surveyId: id }))
    },[id, dispatch])

    useEffect( () => {
        setTopics(_.map(_.filter(getsurveytopic, topic => topic.fieldType !== 'description' ), (topic, index) => {
            const topicAnswers = _.filter(surveyTopicAnswer, ans => ans.topicId?._id === topic._id )
            const averageCount = topicAnswers?.length > 0 ? parseFloat(parseFloat( _.sumBy(topicAnswers, a => a.answer ? parseFloat(a.answer) : 0) / topicAnswers?.length).toFixed(2)) : 0;
             return ({
            title: topic.topicName,
            star: averageCount,
            srno: index+1,
            createdAt: topic?.startDate ? moment(topic?.startDate).format('DD-MM-YYYY') : ''
            })
            }
        ))
        setDiscriptiveAnswer(_.map(_.filter(getsurveytopic, topic => topic.fieldType === 'description' ), (topic, index) => {
            return  ({
                    title: topic.topicName,
                    answer: _.map(_.filter(surveyTopicAnswer, ans => ans.topicId?._id === topic._id ), t => t.answer )
                })
        }))
    },[getsurveytopic, surveyTopicAnswer])
    const totalParticipant = useMemo( () => Object.keys(_.groupBy(surveyTopicAnswer , 'studentId')).length );
    return (
        <div style={{ padding: '10px 10px' }}>
            <Row style={{fontWeight:'600', fontSize: '18px' }}>
                <Col style={{ marginRight: '15px' }}>Survey name: {singleSurveyData?.title}</Col>
                <Col style={{ marginRight: '15px' }}>Total Participant : {totalParticipant}</Col>
                { singleSurveyData?.startDate && <Col style={{ marginRight: '15px' }}>Date: {moment(singleSurveyData.startDate).format("DD MMM, YY")}</Col>}
            </Row>
            <Row style={{ marginTop: '25px' }}>
                <Col span={18} style={{ paddingRight: '25px' }}>
                    <TopicReview totalParticipant={totalParticipant} surveyData={singleSurveyData} topics={topics}/>
                </Col>
                <Col span={6}>
                    <DiscritptiveAnswer totalParticipant={totalParticipant} surveyData={singleSurveyData} data={discriptiveAnswers}/>
                </Col>
            </Row>
        </div>
    )
}

export const TopicReview = ({ topics, isPrint, tab, surveyData, totalParticipant }) => {
    const [ activeTab, setActiveTab ] = useState('graph')
    const surveyReportData = useMemo( () => {
      return _.map(topics, t => ({
        "Survey Topic": t.title,
        "Rating Count": t.star
       }))
    },[topics])

    useEffect(() => {
        if(!tab) return;
        setActiveTab(tab);
    }, [tab])

    const handlePrint = () => {
        printHelper(PRINT_TYPE.PRINT_SURVEY_REPORT, { isPrint: true, topics, tab: activeTab, surveyData, totalParticipant })
    }

    return (
        <div>
            {
                !isPrint &&
                <div>
                    <Row justify='space-between'>
                        <Col>    
                            <Radio.Group size="md" value={activeTab} onChange={ (e) => setActiveTab(e.target.value) }>
                                <Radio.Button value="graph">Graph view</Radio.Button>
                                <Radio.Button value="table">Table view</Radio.Button>
                            </Radio.Group>
                        </Col>
                        <Col>
                           <Row>
                           <Col style={{ marginRight: '10px' }}>
                               <ExportExcel type='primary' data={surveyReportData} filename='surveyReport'/>
                           </Col>
                           <Col>
                               <Button icon={<PrinterOutlined/>} type='primary' onClick={handlePrint}>Print</Button>
                            </Col>
                            </Row> 
                        </Col>
                    </Row>
                </div>
            }
            {
                isPrint && 
                <div style={{ marginTop: '20px', fontWeight:'bold' }}>
                    <div>
                        Survey name: {surveyData.title}
                    </div>
                    <div>
                        Total Participant : {totalParticipant}
                    </div>
                    {
                        surveyData?.startDate &&
                        <div>
                            Date : {moment(surveyData.startDate).format("DD MMM, YY")}
                        </div>
                    }
                </div>
            }
            
                <div style={{ margin: '20px 0px', backgroundColor:'white', padding: '25px 10px', borderRadius: '5px', minHeight: '90vh' }}>
               {
                    topics?.length > 0 ?
                        activeTab === 'graph' ?
                        <TopicReviewChart topics={topics} isPrint={isPrint}/> 
                    :
                    <TopicReviewTable topics={topics}/>
                    :
                   <div style={{ textAlign: 'center' }}>No Topics!</div>
               }
            </div>           
        </div>
    )
}

export const TopicReviewChart = ({ isPrint, topics }) => {
    const stars = [ 1,2,3,4, 5];
    return (
        <div style={{ marginTop: isPrint && '15px', padding: '25px 35px', paddingRight: '70px' }}>
            {
                _.map(topics, (topic, i) => <SigleSurveyTopicRow isPrint={isPrint} key={i} index={i} isLast={ i === (topics.length -1) } {...topic}/> )
            }
            
            <Row justify='end'>
                <Col span={8}></Col>
                <Col span={14} style={{ paddingLeft : '20px', marginTop: '9px' }}>
                    <div style={{ display: 'flex', position:'relative'}}>
                        {
                            _.map( stars, s => {
                                const right = ( 100 - (( 100 / stars.length ) * s) ) + '%';
                                return (
                                    <div key={s}>
                                        <div style={{ position: 'absolute', right: right, textAlign: 'center', display:'flex', justifyContent:'center' }}>
                                            <div style={{ position:'relative', top : '-10px', width: '2px', height: '5px', left: '5px', background: '#0000008a' }}></div>
                                            <div style={{ fontSize:"14px", color:'#0000008a' ,fontWeight:'bold' }}>{s}</div>
                                        </div>
                                    </div>
                                )
                            } )
                        }
                    </div>
                </Col>
            </Row>
        </div>
    )
}

const TopicReviewTable = ({ topics }) => {
    const columns = useMemo( () => ([
        {
            title: 'Sr no.',
            dataIndex: 'srno',
        }, 
        {
            title: 'Survey topic',
            dataIndex: 'title',
        },
        {
            title: 'Rating Count',
            dataIndex: 'star',
        }, 
        // {
        //     title: 'created at',
        //     dataIndex: 'createdAt',
        // }, 
    ]),[]);

    return (
        <Table
        pagination={false}
        columns={columns}
        dataSource={topics}
      />
    )
}

const SigleSurveyTopicRow = ({ title, star, isLast, isPrint,index}) => {
    return (
    <Row justify='end'>
        <Col span={10} style={{ textAlign:'right', paddingTop:'5px', paddingRight: '20px' }}>
            <Row justify='end'>
                <Tooltip placement="topLeft" title={title}>
                    <div style={{ maxW: !isPrint ? '200px' : 'auto' , wordBreak : isPrint && 'break-all', textOverflow:'ellipsis', overflow:'hidden', cursor: 'pointer' }}>{ title }</div>
                </Tooltip>
            </Row>
        </Col>
        <Col span={12} style={{ paddingLeft : '20px' }}>
            <div style={{ position:'relative', height: '100%' }}>
                <div style={{ position: 'relative' , height: '100%' ,width: '100%' , paddingTop: '5px', paddingBottom: isLast ? '20px' : '5px', borderLeft: '1px solid #00000038',borderRight: '1px solid #00000038', borderBottom: !isLast ? 'none' : '1px solid #00000038', zIndex:2 }}>
                    <div style={{ position:'absolute', left: '102%',padding: '0px 4px', height: '28px' , fontWeight:'bold', backgroundColor:'white'}}>{ star }</div>
                    <div style={{ height: '28px', width: ( (star / MAX_STARTS_COUNT * 100) + "%"  ), background: '#1161d0', display: 'flex', alignItems:'center' }}>
                    </div>
                </div>
                <div style={{ position: 'absolute', top:'50%', width: '100%', height: '1px', background: '#00000017' }}></div>
                    
            </div>
        </Col>
    </Row>
    )
}

