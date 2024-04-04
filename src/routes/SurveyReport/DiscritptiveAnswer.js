import { Button, Col, Row } from 'antd'
import React, { useMemo } from 'react'
import { Collapse } from 'antd';
import _, { forEach } from 'lodash';
import { DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import { printHelper, PRINT_TYPE } from '../../Constants';
import { ExportExcel } from '../../components/ExportExcel';
import moment from 'moment';

const { Panel } = Collapse;

export default function DiscritptiveAnswer(props) {
    const { isPrint, data, surveyData, totalParticipant } = props;

    const surveyDiscriptiveData = useMemo( () => {

        return _.reduce(data, (last,curr) => {
            let topic = false;
            forEach(curr.answer, a => {
                let topush = {Topic: topic ? undefined : curr.title,
                    Answer: a
                }
                last.push(topush)
                topic = true
            })
            console.log({last})
            return last

        },[])

      },[data])

      console.log(surveyDiscriptiveData)
  
    const handlePrint = () => {
        printHelper(PRINT_TYPE.PRINT_SURVEY_DISCRIPTIVE_ANSWER, { isPrint: true, data: data, surveyData, totalParticipant })
    }
    
    return (
        <div>
            {
                !isPrint &&
                <div>
                    <Row justify='end'>
                        <Row>
                           <Col style={{ marginRight: '10px' }}>
                               <ExportExcel type='primary' data={surveyDiscriptiveData} filename='surveyDescriptiveAnswer'/>
                           </Col>
                           <Col>
                               <Button icon={<PrinterOutlined/>} type='primary' onClick={handlePrint}>Print</Button>
                           </Col>
                        </Row>
                    </Row>
                </div>
            }
             {
                isPrint && 
                <div style={{ margin: '20px 0px', fontWeight:'bold' }}>
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
            <div style={{ marginTop: '5px' }}>
                {
                    !isPrint &&
                    <div style={{ fontSize: '18px', fontWeight:'700', padding: '18px 10px' }}>
                        Descriptive Answer
                    </div>
                }
                <div>
                    <Collapse defaultActiveKey={ isPrint && _.map(data, (d, i) => i )}>
                        {
                            _.map(data, (topic, index) => 
                                (<Panel key={index} style={{ fontSize: '12px' }} showArrow={!isPrint} header={ (isPrint ? index + 1 +". " : '')+ topic.title} key={index}>
                                    {
                                        _.map(topic?.answer, (ans, idx) => <p key={idx} style={{ fontSize: '12px' }}>• {ans}</p> )
                                    }
                                </Panel>)
                            )
                        }
                    </Collapse>
                </div>
            </div>
            
        </div>
    )
}
