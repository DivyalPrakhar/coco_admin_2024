import { Row, Col, Button, Card, Input, Form, Table, Tag, Divider, List, Modal, Space, Alert } from 'antd';
import {useDispatch, useSelector} from 'react-redux' 
import { useState, useEffect } from 'react';
import _ from 'lodash';
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { uploadBasechaptersAction, resetBaseChapterError } from '../../redux/reducers/Syllabus'
import { STATUS } from "../../Constants";
import { ExportExcel } from '../../components/ExportExcel';
import { sheetToJSON } from '../../utils/FileHelper';
import { ExamCompetitionSelector } from "../../components/ExamCompetitionSelector";
import { CaretRightOutlined, SelectOutlined } from "@ant-design/icons";

export const UploadBasechapters = () => {
  const dispatch = useDispatch()
  const [excelData, onSave] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [dataColumns, setDataColumns] = useState([])
  const [required, setRequired] = useState(0)
  const [files, setFiles] = useState('')
  const [stateData, stateDataChange] = useState({subjects: [], competitions: [], exams: []})
  const [compExamModal, compExamChange] = useState(false);
  const [reqColumns, setReqColumns] = useState([]);

  const {syllabus, configData} = useSelector(s => ({
      user: s.user,
      configData: s.lmsConfig,
      syllabus: s.syllabus,
  }))
  //console.log(syllabus);

  const selectItem = (name, newItem) => {
    let items = stateData[name]
    let select = _.findIndex(items, it => it == newItem) == -1

    if(select) {
        stateDataChange({...stateData, [name]: _.concat(items, newItem)})
    } else {
        stateDataChange({...stateData, [name]: _.filter(items, it => it != newItem)})
    }
  }

  const convertFile = (e) => {
    setFiles(e.target.value)
    sheetToJSON(e.target.files, onSave)
    
  } 

  const data = [{
    name:'', 
    unique_code:'',
    //standards:'', 
    // subjects:'', 
    // competitions:'', 
    // exams:''
  }]

  useEffect(() => {
    if(excelData.length){
      let reqColumns = []
      let data = excelData.map(d => ({name:d.name, unique_code:d.unique_code}))
      data.map((d) => _.map(d, (value, key) => (key === 'name' || key === 'unique_code') && !value ? reqColumns.push(key) : null))

      let columns = data.length ? _.keys(data[0]).map(d => ({title:d, dataIndex:d, key:d})) : []
      
      columns = columns.map((d, i) => d.title == 'name' || d.title == 'unique_code' ? 
        Object.assign(d, {render:tags => tags || <Tag color='red' key={i}>Required</Tag>}) : d
      )


      setReqColumns(_.uniq(reqColumns))
      setDataColumns(columns)
      _.forEach(columns, d => d.render ? setRequired(r => r + 1) : null)
      setDataSource(data.length ? data.map((d, i) => ({...d, key:++i})) : [])
    }
  }, [excelData])

  const removeExam = (id) => {
    let exams = stateData.exams
    _.remove(exams,e => e == id)
    stateDataChange({...stateData, exams})
  }

   useEffect(() => {
      if(syllabus.basechaptersUploadStatus == STATUS.SUCCESS){
        onSave([])
        setDataSource([])
        setDataColumns([])
        setRequired(0)
        setFiles('')
        stateDataChange({subjects: [], competitions: [], exams: []})
      }
   }, [syllabus.basechaptersUploadStatus])

  const addExcel = () => {
    let uploadData = {
      data:_.map(dataSource, d => (
        {
          name: d.name || d.NAME, 
          unique_code: d.unique_code || d.UNIQUE_CODE || d['unique code'] || d['UNIQUE CODE'] || d['uniquecode'] || d['UNIQUECODE']
        }
      )), 
      subjects: stateData.subjects, 
      //competitions: stateData.competitions, 
      exams: stateData.exams
    }
    dispatch(uploadBasechaptersAction(uploadData))
  }

  const { CheckableTag } = Tag;
  
  return(
    <div>
    	<CommonPageHeader
      	title='Upload Basechapters'
    	/>
    	<br/>
    	<Card loading={configData.defaultDataStatus === STATUS.FETCHING}>
        {configData.defaultDataStatus === STATUS.SUCCESS ? (
        <div>
          <Row>
            <Col sm={24}>
              <Form.Item requiredMark label={<b>Subject</b>}>
                {configData.defaultData.subjects.map((s, i) => (
                  <CheckableTag style={{ border: ".1px solid black", margin: '4px'}} key={i} checked={_.findIndex(stateData.subjects, b => b == s._id) != -1} onChange={() => selectItem("subjects", s._id)}>
                    {s.name.en}
                  </CheckableTag>
                ))}
              </Form.Item>
              <Form.Item requiredMark label={<b>Exams</b>}>
                <Space>
                  {stateData.exams ? 
                    _.map(stateData.exams, exm => {
                      let currentExams = _.find(configData.defaultData.exams,e => e._id == exm )
                      return(
                        <Tag color='blue' key={exm} closable onClose={() => removeExam(exm)}>
                          {currentExams.name.en}{currentExams.name.en && currentExams.name.hn && '/'}{currentExams.name.hn}
                        </Tag> 
                      )}
                    )
                    : null
                  }
                  <Button shape='round' icon={<SelectOutlined />} onClick={() => compExamChange(true)}>Select</Button>
                </Space>
              </Form.Item>
              <Divider/>
              {/*<div>
                <h3><b>Competition</b></h3>
                  {configData.defaultData.competitions.map((s,i) => (
                    <CheckableTag style={{border: '.1px solid black', margin: '4px'}} key={i} checked={_.findIndex(stateData.competitions, b => b == s._id) != -1} onChange={() => selectItem('competitions', s._id)}>
                      {s.name.en}
                    </CheckableTag>
                  ))}
              </div>
              <br/>*/}
              {/* <h3><b>Exams <Button shape="round"  type="link" size='large' onClick={() => compExamChange(true)} >Select<CaretRightOutlined /></Button> </b></h3>
              <div style={{marginTop: '10px'}}>
                <div>
                  {_.map(stateData.exams, exm => {
                    let currentExams = _.find(configData.defaultData.exams,e => e._id == exm )
                    return(
                      <Tag color='blue' key={exm} closable onClose={() => removeExam(exm)}>
                        {currentExams.name.en}{currentExams.name.en && currentExams.name.hn && '/'}{currentExams.name.hn}
                      </Tag> 
                    )}
                  )}
                </div>
              </div> */}
              {compExamModal ? 
                <ExamCompetitionSelector 
                  modalStatus={compExamModal} 
                  closeModal={() => compExamChange(false)}
                  competitionsData={configData.defaultData.competitions} 
                  examsData={configData.defaultData.exams} 
                  multipleSelect={true} 
                  defaultExams={stateData.exams}
                  selectedExamsData={(exams) => (stateDataChange({...stateData, exams: exams}), compExamChange(false))}
                />
              : null}
            </Col>
          </Row>
          <br/>
          <br/>
          <Row>
            <Col sm={24}>
              <Form labelCol={{ span:4 }} wrapperCol={{ span: 13 }} layout="horizontal">
                <Form.Item label={<div>Download Template</div>}>
                  <ExportExcel data={data} title='Download' filename='Basechapters'/>
                </Form.Item>
                <Form.Item label='Upload Excel'>
                  <Input type='file' value={files} onChange={convertFile} accept=".xlsx, .xls, .csv"/>
                </Form.Item>
              </Form>
              {dataSource.length ? 
                <Table
                    bordered
                    dataSource={dataSource}
                    columns={dataColumns}
                    pagination={{position:['bottomLeft']}}
                />
                : null
              }
              {reqColumns?.length ? 
                <Alert type='error' showIcon message={'required columns ' + _.join(reqColumns, ', ')}/>
                :
                null
              }
              <br/> 
              {dataSource.length && (stateData.exams.length || stateData.subjects.length) ? 
                <div style={{textAlign:'center'}}>
                  <Button type="primary" shape='round' size='large' disabled={reqColumns.length} loading={syllabus.basechaptersUploadStatus == STATUS.FETCHING} onClick={addExcel}>
                    Upload Basechapters
                  </Button>
                </div>
              : null}
            </Col>
          </Row>
          </div>
        )
        : null}
      </Card>
      {syllabus?.basechapterErrorData ? 
        <BaseChapterErrorModal 
          visible={syllabus?.basechapterErrorData ? true : false}
          onClose={() => dispatch(resetBaseChapterError())}
          errorData={syllabus.basechapterErrorData}
        /> 
      : null}
    </div>
  )
}


export const BaseChapterErrorModal = ({visible, onClose, errorData}) => {
  return(
    <Modal title='Already Added Unique Codes' visible={visible} width={'70%'} onCancel={onClose} footer={false} closable>
        <div style={{color: 'red'}}>*You have already added these unique codes to the basechapters. Please delete them and re-upload the data.</div>
        <Card>
          <List
            style={{maxHeight: '300px', overflowY: 'auto'}}
            itemLayout="horizontal"
            dataSource={_.compact(errorData.uniqueCodes)}
            renderItem={item => (
              <List.Item>
                  {item}
              </List.Item>
            )}
          />
        </Card>
    </Modal>
  )
}