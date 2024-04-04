import { Button, Card, Input, Form, Select, DatePicker, Modal, Table, Checkbox, Row, Col, Tag, Divider } from 'antd';
import moment from 'moment';
import {RoleType} from '../../Constants'
import {useDispatch, useSelector} from 'react-redux' 
import { useState, useEffect } from 'react';
import { EditOutlined, DeleteOutlined, CaretRightOutlined } from '@ant-design/icons';
import { LoadingRef } from "../../App/AppProvider";
import _ from 'lodash';
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { ExamCompetitionSelector } from '../../components/ExamCompetitionSelector'

//import {getDefaultDataAction} from '../../redux/reducers/LmsConfig'
import {getBasechaptersAction} from '../../redux/reducers/Syllabus'
import { STATUS } from "../../Constants";
import { useAuthUser } from "../../App/Context";

export const ListBasechaptersModal = (props) => {
  return(
    <Modal visible={props.baseChptersList} footer={null} width='1000px' onOk={() => console.log('')} onCancel={() => props.closeModal()}>
      <ListBasechapters />
    </Modal>
  )
}

export const ListBasechapters = () => {
  const auth = useAuthUser()
  const dispatch = useDispatch()  
  const {configData, user, syllabus} = useSelector(s => ({
      user: s.user,
      configData: s.lmsConfig,
      syllabus: s.syllabus
  }))

  // useEffect(() => {
  //   dispatch(getDefaultDataAction({instituteId: auth.staff.institute._id}))
  // }, [])

  return(
    <div>
    	<CommonPageHeader
      	title='List Base Chapters'
    	/>
    	<br/>
    	<Card loading={configData.defaultDataStatus == STATUS.FETCHING}>
        <Row>
          {configData.defaultDataStatus == STATUS.SUCCESS ?
            <div style={{width: '100%'}}>
              <Col sm={24}>
                <SelectSyllabusData 
                  syllabus={configData.defaultData} 
                  syllabusStatus={syllabus.basechaptersStatus}
                  fetchData={(data) => dispatch(getBasechaptersAction({...data}))}
                />
              </Col>
              <Card loading={syllabus.basechaptersStatus === STATUS.FETCHING}>
                {syllabus.basechaptersStatus == STATUS.SUCCESS ?
                  <Col sm={24} style={{marginTop: '20px'}}>
                    <div>
                      <BasechaptersTable basechaptersData={syllabus.basechaptersData} syllabus={configData.defaultData}/>
                    </div>
                  </Col>
                : null}
              </Card>
            </div>
          : null}
        </Row>
      </Card>
    </div>
  )
} 

export const SelectSyllabusData = (props) => {
  const [stateData, stateDataChange] = useState({standards: [], subjects: [], competitions: [], exams: [], name: '', unique_code: ''})
  const [compExamModal, compExamChange] = useState(false)
  
  const selectItem = (name, newItem) => {
    let items = stateData[name]
    let select = _.findIndex(items, it => it == newItem) == -1

    if(select) {
        stateDataChange({...stateData, [name]: _.concat(items, newItem)})
    } else {
        stateDataChange({...stateData, [name]: _.filter(items, it => it != newItem)})
    }
  }

  const removeExam = (id) => {
    let exams = stateData.exams
    _.remove(exams,e => e == id)
    stateDataChange({...stateData, exams})
  }

  const { CheckableTag } = Tag;
  return(
    <div>
      
          {/*<div>
            <h3><b>Standards:</b></h3>
            {props.syllabus.standards.map((s,i) => (
              <CheckableTag style={{border: '.1px solid black'}} key={i} checked={_.findIndex(stateData.standards, b => b == s._id) != -1} onChange={() => selectItem('standards', s._id)}>
                {s.name.en}
              </CheckableTag>
            ))}
          </div>
          <Divider/>*/}

          <div>
            <h3><b>Subjects</b></h3>
            {props.syllabus.subjects.map((s,i) => (
              <CheckableTag style={{border: '.1px solid black', margin: '4px'}} key={i} checked={_.findIndex(stateData.subjects, b => b == s._id) != -1} onChange={() => selectItem('subjects', s._id)}>
                {s.name.en}
              </CheckableTag>
            ))}
          </div>

          <br/>

          <div>
            <h3><b>Competition</b></h3>
            {props.syllabus.competitions.map((s,i) => (
              <CheckableTag style={{border: '.1px solid black', margin: '4px'}} key={i} checked={_.findIndex(stateData.competitions, b => b == s._id) != -1} onChange={() => selectItem('competitions', s._id)}>
                {s.name.en}
              </CheckableTag>
            ))}
          </div>

          <br/>

          <h3><b>Exams <Button shape="round"  type="link" size='large' onClick={() => compExamChange(true)} >Select<CaretRightOutlined /></Button> </b></h3>
          <div style={{marginTop: '10px'}}>
            <div>
              {_.map(stateData.exams, exm => {
                {/* let currentCompetition = _.find(props.syllabus.competitions, com => com._id == comp) */}
                let currentExams = _.find(props.syllabus.exams,e => e._id == exm )
                return(
                  <Tag color='blue' key={exm} closable onClose={() => removeExam(exm)}>
                    {currentExams.name.en}{currentExams.name.en && currentExams.name.hn && '/'}{currentExams.name.hn}
                  </Tag> 
                )}
              )}
            </div>
          </div>

      {compExamModal ? 
        <ExamCompetitionSelector 
          modalStatus={compExamModal} 
          closeModal={() => compExamChange(false)}
          competitionsData={props.syllabus.competitions} 
          examsData={props.syllabus.exams} 
          multipleSelect={true} 
          defaultExams={stateData.exams}
          // defaultCompetitions={stateData.competitions}
          // competitionOnlyExams={true}
          selectedExamsData={(exams) => (stateDataChange({...stateData, exams: exams}), compExamChange(false))}
        />
      : null}
      <Row style={{paddingTop: '15px'}}>
        <Col sm={12} style={{padding: '0px 10px 0px 0px'}}>
            <Input addonBefore="Search By Name" type="text" placeholder="Name" onChange={(e) => stateDataChange({...stateData, name: e.target.value})} />
           
        </Col>
        <Col sm={12} style={{padding: '0px 0px 0px 10px'}}>
            <Input addonBefore="Search By Unique Code" type="text" placeholder="Unique Code" onChange={(e) => stateDataChange({...stateData, unique_code: e.target.value})}/>
        </Col>
      </Row>

      <Col sm={24} style={{textAlign: 'center', marginTop:'40px'}}>
            <Button type='primary'  size='large' shape='round' style={{marginLeft:'20px'}} onClick={() => props.fetchData({...stateData})}>Fetch</Button>
      </Col>
      <br/>
    </div>
  )
}

export const BasechaptersTable = (props) => {
  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: d => d.name.en
    },
    {
      title: 'Unique Code',
      dataIndex: 'unique_code',
      key: 'unique_code',
    },
    {
      title: 'Subjects',
      key: 'subjects',
      render: d => (
        <div>{_.map(d.subjects, s => _.get(_.find(props.syllabus.subjects, dd => dd._id == s), 'name.en', '')).join(', ')}</div>
      )
    },
    // {
    //   title: 'Standards',
    //   key: 'standards',
    //   render: d => (
    //     <div>{_.map(d.standards, s => _.get(_.find(props.syllabus.standards, dd => dd._id == s), 'name.en', '')).join(', ')}</div>
    //   )
    // },
    {
      title: 'Competitions',
      key: 'competitions',
      render: d => (
        <div>{_.map(d.competitions, s => _.get(_.find(props.syllabus.competitions, dd => dd._id == s), 'name.en', '')).join(', ')}</div>
      )
    },
    {
      title: 'Exams',
      key: 'exams',
      render: d => (
        <div>{_.map(d.exams, s => _.get(_.find(props.syllabus.exams, dd => dd._id == s), 'name.en', '')).join(', ')}</div>
      )
    },
  ];

  return(
    <div>
      <Row>
        <Col sm={24}>
          {props.basechaptersData.length != 0 ? 
            <Table pagination={{showSizeChanger:false}} dataSource={props.basechaptersData} columns={columns} />
          : 
            <div style={{textAlign: 'center'}}>
              <h4>There are no Basechapters assigned.</h4>  
            </div>
          }
        </Col>
      </Row>
    </div>
  )
}
