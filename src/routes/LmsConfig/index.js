import { Button, Card, Col, Divider, Row, Tag } from 'antd';
import {useDispatch, useSelector} from 'react-redux' 
import { useState, useEffect } from 'react';
import { LoadingRef } from "../../App/AppProvider";
import _ from 'lodash';
import { ExamCompetitionSelector } from '../../components/ExamCompetitionSelector'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import {getDefaultDataActionForLms, getInstituteDefaultAction, addInstituteDefaultAction, getDefaultDataAction} from '../../redux/reducers/LmsConfig'
import { STATUS } from "../../Constants";
import { useAuthUser } from "../../App/Context";
import { CaretRightOutlined} from '@ant-design/icons';

export const LmsConfig = (props) => {
  const auth = useAuthUser()
  const dispatch = useDispatch()
  const [compExamModal, compExamChange] = useState(false)
  const [stateData, stateDataChange] = useState({subjects: [], standards: [], boards: [], competitions: [], exams: []})
  
  const {configData} = useSelector(s => ({
      configData: s.lmsConfig
  }))

  useEffect(() => {
  	dispatch(getDefaultDataActionForLms())
  	dispatch(getInstituteDefaultAction({instituteId: auth.staff.institute._id, key: "syllabus",}))
  }, [auth.staff.institute._id, dispatch])

  useEffect(() => {
  	if(configData.instituteDefaultStatus === STATUS.SUCCESS){
  		let data = configData.instituteDefaultData.data
  		data && stateDataChange({
  			subjects: data.subjects, 
  			standards: data.standards, 
  			boards: data.boards,
  			competitions: data.competitions, 
  			exams: data.exams
  		})
  	}
  }, [configData.defaultDataLms, configData.instituteDefaultData?.data, configData.instituteDefaultStatus])

  useEffect(() => {
  	if(configData.addInstituteDefaultStatus === STATUS.SUCCESS){
  		LoadingRef.current.hide()
      dispatch(getDefaultDataAction({instituteId: auth.staff.institute._id}))
  	}
  }, [auth.staff.institute._id, configData.addInstituteDefaultStatus, dispatch])

  const changeInData = (value, type) => {
  	let findData = _.findIndex(stateData[type], d => d === value)

  	if(findData === -1){
  		stateDataChange({...stateData, [type]: _.concat(stateData[type], value)})
  	}else{
  		stateDataChange({...stateData, [type]: _.filter(stateData[type], s => s !== value)})
  	}
  }	

  const submitData = () => {
  	LoadingRef.current.show()
  	dispatch(addInstituteDefaultAction({
  		data: {
	  		standards: stateData.standards,
	  		subjects: stateData.subjects,
	  		exams: stateData.exams,
	  		competitions: stateData.competitions,
	  		boards: stateData.boards
  		},
  		instituteId: auth.staff.institute._id,
  		key: "syllabus"
  	}))
  }

  const { CheckableTag } = Tag;
  return(
    <div>
      	<CommonPageHeader
        	title='LMS Config'
      	/>
      	<br/>
      	<Card>
      	{configData.defaultDataLmsStatus === STATUS.SUCCESS ? 
	      	<div>
		        <div>
		          <h3><b>Standards:</b></h3>
		          {_.map(configData.defaultDataLms.standards, (s,i) => (
		          	<CheckableTag key={i} checked={_.findIndex(stateData.standards, ss => ss === s._id) !== -1} style={{border: '.1px solid black', fontSize:'15px', margin:'5px'}} onChange={() => changeInData(s._id, 'standards')}>{s.name.en}</CheckableTag>
		          ))}
		        </div>
				<Divider/>
		        <div>
		          <h3><b>Subjects:</b></h3>
		          {_.map(configData.defaultDataLms.subjects, (s,i) => (
		          	<CheckableTag key={i} checked={_.findIndex(stateData.subjects, ss => ss === s._id) !== -1} style={{border: '.1px solid black', fontSize:'15px', margin:'5px'}} onChange={() => changeInData(s._id, 'subjects')}>{s.name.en}{s.name.hn ? `/${s.name.hn}` :null}</CheckableTag>
		          ))}
		        </div>
				<Divider/>
		        <div>
		          <h3><b>Boards:</b></h3>
		          {_.map(configData.defaultDataLms.boards, (s,i) => (
		          	<CheckableTag key={i} checked={_.findIndex(stateData.boards, ss => ss === s._id) !== -1} style={{border: '.1px solid black', fontSize:'15px', margin:'5px'}} onChange={() => changeInData(s._id, 'boards')}>{s.name.en}</CheckableTag>
		          ))}
		        </div>
				<Divider/>
				<h3><b>Competitions | Exams: <Button shape="round"  type="link" size='large' onClick={() => compExamChange(true)} >Select<CaretRightOutlined /></Button> </b></h3>
				<br/>
		        <div style={{marginTop: '0'}}>
					<h4>Selected Competitions/Exams:</h4>
					<div>
						<div>
							{_.map(stateData.competitions, s => {
							let currentCompetition = _.find(configData.defaultDataLms.competitions, com => com._id === s)
							let currentExams = currentCompetition &&_.chain(stateData.exams).filter(ex => _.findIndex(currentCompetition?.exams, ce => ce === ex) !== -1).map(ex => _.find(configData.defaultDataLms.exams, s => s._id === ex)).value()
							return(
				
							<Row gutter={[0, 8]}>
								<Col span={4}><span style={{fontFamily:'monospace',fontSize:'0.9rem', fontWeight:'lighter'}} >{currentCompetition?.name.en}</span></Col>
								<Col span={20}>{_.map(currentExams, ex => {return(<Tag color='blue' style={{marginLeft: '3px',borderRadius:'10px',padding:'0px 10px', userSelect:'none'}}>{ex.name.en}</Tag>)})}</Col>
							  </Row>
							)}
						)}
						</div>
					</div>
		        </div>
		        {compExamModal ? 
		          <ExamCompetitionSelector 
		            modalStatus={compExamModal}
		            closeModal={() => compExamChange(false)}
		            competitionsData={configData.defaultDataLms.competitions} 
		            examsData={configData.defaultDataLms.exams} 
		            multipleSelect={true} 
		            defaultExams={stateData.exams}
		            defaultCompetitions={stateData.competitions}
		            competitionCheckbox={true}
		            competitionOnlyExams={true}
		            selectedExamsData={(exams, competitions) => (stateDataChange({...stateData, exams: exams, competitions: competitions}), compExamChange(false))}
		          />
		        : null}
			    <br/>
			    <div style={{textAlign: 'center'}}>
			    	<Button shape='round' type='primary' size='large' onClick={() => submitData()}>Submit</Button>
			    </div>
		    </div>
	    : null}
      </Card>
    </div>
  )
}
