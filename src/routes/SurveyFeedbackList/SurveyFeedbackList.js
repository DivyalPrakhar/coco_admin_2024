import React, { useEffect, useState } from 'react'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import {
    Card,
    Table,
    Button,
    Space,
    Row,
    Modal,
    Form,
    Input,
    Tooltip,
    message,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFeedbackSurveyList } from '../../redux/reducers/feedbackSurvey';
import Column from 'antd/lib/table/Column';
import { getFeedbackSurvey } from '../../redux/reducers/feedbackSurvey';
import { DeleteOutlined, DownloadOutlined, EditOutlined, ExclamationCircleOutlined, FileDoneOutlined, SearchOutlined, CopyOutlined } from '@ant-design/icons';
import moment from 'moment';
import { BaseURL } from '../../BaseUrl';
import { URIS } from '../../services/api';
import { Link } from 'react-router-dom';
import { PackageAccessibility } from '../../Constants';
import _ from 'lodash'
import { ErrorMessage } from '../../Constants/CommonAlerts';

const onFilter = (name) => (value, record) => {
   return record[name]
    ? record[name]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase())
    : ""
}
const filterDropdown = ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
    }) => (
        <div style={{ padding: 8 }}>
            <Form
                onFinish={() => {
                confirm({ closeDropdown: false });}}
            >
                <Input 
                    placeholder={`Search `}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        htmlType="submit"
                        type="primary"
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => {
                        clearFilters();
                        }}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </Form>
        </div>
    )
const filterIcon = (filtered) => (
        <SearchOutlined
            style={{ fontSize: "18px", color: filtered ? "#1890ff" : undefined }}
        />
    )
export const SurveyFeedbackList = () => {
    const dispatch = useDispatch()
    const [ showCopyModal, setShowCopyModal ] = useState(null);
    const feedbacksurvey = useSelector(s => s.feedbacksurvey)
    const { getfeedbacksurveydata:getallFeedbackSurvey} = feedbacksurvey;
    let todayDate = moment()


    const Status = (startdate, surveyduration) => {
        const new_date =  moment(startdate, "DD-MM-YYYY").add(surveyduration, "days")
        // const surveystatus = new_date.diff(todayDate)  ? 'Scheduled' : 'Completed'
        const surveystatus = new_date <  todayDate ? 'Completed' : 'Scheduled'
        return surveystatus
    }

    useEffect(() => {
        dispatch(getFeedbackSurvey({}))
    }, [dispatch])
    const tabledata =
        _.map(getallFeedbackSurvey, (d, i) =>
        ({
            key: d?._id,
            number: ++i,
            title: d.title,
            duration: parseFloat(d.duration),
            startDate: d.startDate,
            sdate: d.startDate ? moment(d.startDate).format('DD-MM-YYYY') : '',
            accessibility: PackageAccessibility.find((s) => s.value === d.accessibility)?.title,
            description: d.description,
            status: Status(moment(d.startDate) , d.duration)
        }),
    );

    // console.log('new_date', new_date);

    const handleDownload = async () => {
        window.open(_.trimEnd(BaseURL, '/') + URIS.GET_FEEDBACK_SURVEY + '?excel=1', '_blank')
    }

    const handleParticipantDownload = (surveyId) => {
        window.open(_.trimEnd(BaseURL, '/') + URIS.GET_SURVEY_PARTICIPANT + `?surveyId=${surveyId}&excel=1`, '_blank')
    }

    const { confirm } = Modal;
    const showConfirm = (isDelete) => {
        confirm({
            title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleOutlined />,

            onOk() {
                dispatch(deleteFeedbackSurveyList({ surveyId: isDelete }))
            },
            onCancel() { },
        });
    };

    const copyMessage = () => {
        message.destroy('message')
        return message?.success({content: "Copied To Clipboard" || 'Success', key: 'message'})
    }

    const copytoClipboard = (id)=>{
        var input = document.createElement('input');
        input.setAttribute('value', "https://student.competitioncommunity.com/survey?survey="+id);
        document.body.appendChild(input);
        input.select();
        var result = document.execCommand('copy');
        document.body.removeChild(input);
        copyMessage()
        return result;
    }

    return (
        <div>
            <CommonPageHeader title='Survey/Feedback list' />
            <br />
            <Card
                bodyStyle={{ padding: '10px', }}
                extra={
                    <Row >
                        <div style={{ width: 60, cursor:'pointer' }} onClick={handleDownload} ><DownloadOutlined /> CSV </div>
                        {/* <div style={{ width: 70 }}><PrinterOutlined /> Print</div> */}
                    </Row>}>
            </Card>
            <Card>
                <Table dataSource={tabledata}>
                    <Column title="Sr.No." dataIndex="number" key="number"/>
                    <Column title="Survey/Feedback title" dataIndex="title" filterSearch={true} key="title"
                        render={(key) => <TextWrap text={key}/> }
                      filterDropdown={filterDropdown} filterIcon={filterIcon} onFilter = {onFilter('title')}/>
                    <Column title="Description" dataIndex="description" key="description" 
                        render={(key) => <TextWrap text={key}/>}/>
                    <Column title="Accessibility" dataIndex="accessibility" key="accessibility" filters={_.map(PackageAccessibility, (p) => ({ text: p.title, value: p.title }))} onFilter = {(value, d) => { return d.accessibility === value }}/>
                    <Column title="Start Date" dataIndex="sdate" key="sdate" showSorterTooltip={true} sorter={(a,b) => { return moment(a.startDate).diff(b.startDate, 'days')}}/>
                    <Column title="Duration(days)" dataIndex="duration" key="duration"/>
                    <Column title="Status" dataIndex="status" key="status" filters={[
                {
                  text: 'Completed',
                  value: 'Completed',
                },
                {
                  text: 'Scheduled',
                  value: 'Scheduled',
                },
              ]} onFilter = {(value, d) => {return d.status === value }}/>
                    <Column title="Participant" key="participant"
                     render={(key) => {
                        return  <Button onClick={ () => handleParticipantDownload(key.key) }><DownloadOutlined /></Button>;
                     }}/>
                    <Column
                        title="Action"
                        key="action"
                        render={(key) => (
                            <Space size="middle">
                                {/* <Button shape='circle'> <EyeOutlined /></Button> */}
                                <Tooltip placement="top" title={"Survey Report"}>
                                    <Link to={'/survey-report/' + key.key}><Button shape='circle'><FileDoneOutlined /></Button></Link>
                                </Tooltip>
                                <Tooltip placement="top" title={"Copy Link"}>
                                    <Button shape='circle' onClick={() => copytoClipboard(key.key)}><CopyOutlined /></Button>
                                </Tooltip>
                                <Tooltip placement="top" title={"Edit"}>
                                    <Link to={'/survey-feedback/' + key.key}><Button shape='circle'><EditOutlined /></Button></Link>
                                </Tooltip>
                                <Tooltip placement="top" title={"Delete"}>
                                    <Button onClick={() => showConfirm(key.key)} shape='circle'><DeleteOutlined /></Button>
                                </Tooltip>
                            </Space>
                        )}
                    />
                </Table>
            </Card>
            { showCopyModal && <CopyModal survey={showCopyModal} setVisible={ () => setShowCopyModal(null) }/> }
        </div >

    )
}

const TextWrap = ({text}) => {
    return (<Tooltip title={text} placement='bottom'>
        <div style={{ cursor: 'pointer' ,display: '-webkit-box',maxWidth: '200px','-webkit-line-clamp': '2', '-webkit-box-orient': 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {text}
        </div>
    </Tooltip>)
}

const CopyModal = (props) => {
    const { setVisible, survey } = props;
    const handleCopy = async () => {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(survey.key)
          }
        setVisible(false);
    }
    return (
        <Modal
        title="Copy survey"
        centered
        visible={true}
        okText={'Copy'}
        onOk={ handleCopy }
        onCancel={() => setVisible(false)}
      > 
      <div>
        Copy survey id : {survey.key}
      </div>
      </Modal>
    )
} 

