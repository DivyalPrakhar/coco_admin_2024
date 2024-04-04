import { Button, Input, Modal, Checkbox, Row, Col, Radio,  } from 'antd';
import { useState } from 'react';
import { RightOutlined } from '@ant-design/icons';
import _ from 'lodash';

export const ExamCompetitionSelector = (props) => {
  const [searchData, changeSearchData] = useState('')

  const [selectedData, changeSelectedData] = useState({selectedExams: props.defaultExams ? _.concat(props.defaultExams) : [], selectedCompetition: props.defaultCompetitions ? _.concat(props.defaultCompetitions) : []}) 

  const examChange = (exam, competition) => {
    let findExam = _.findIndex(selectedData.selectedExams, e => e == exam)
    if(props.competitionCheckbox){
      //if we have to select exams and compitions separately
      if(findExam == -1){
        if(props.multipleSelect){
          selectedData.selectedExams.push(exam)
        }else{
          selectedData.selectedExams = [exam]
        }
        changeSelectedData({...selectedData, selectedExams: selectedData.selectedExams})
      }else{
        let filterExams = _.filter(selectedData.selectedExams, s => s != exam)
        changeSelectedData({...selectedData, selectedExams: filterExams})
      }
    }else{
      //if we have to select exams and compitions combinedly
      if(findExam == -1){
        if(props.multipleSelect){
          selectedData.selectedExams.push(exam)
        }else{
          selectedData.selectedExams = [exam]
        }
        changeSelectedData({...selectedData, selectedExams: selectedData.selectedExams, selectedCompetition: _.uniq(_.concat(selectedData.selectedCompetition, competition))})
      }else{
        let filterExams = _.filter(selectedData.selectedExams, s => s != exam)
        changeSelectedData({...selectedData, 
          selectedExams: filterExams, 
          selectedCompetition: _.compact(_.map(props.competitionsData, com => _.findIndex(filterExams, ex => _.findIndex(com.exams, ce => ex == ce) != -1) != -1 ? com : null)) 
        })
      }
    }
  }

  const competitionChange = (competition_id) => {
    let findCompIndex = _.findIndex(selectedData.selectedCompetition, e => e == competition_id)
    if(findCompIndex == -1){
      changeSelectedData({...selectedData, selectedCompetition: _.concat(selectedData.selectedCompetition, competition_id)})
    }else{
      let competition = _.find(props.competitionsData, cd => cd._id == selectedData.selectedCompetition[findCompIndex])
      changeSelectedData({...selectedData, 
        selectedCompetition: _.filter(selectedData.selectedCompetition, s => s != competition._id),
        selectedExams: _.difference(selectedData.selectedExams, competition.exams)
      })
    }
  }

  const { Search } = Input;

  return(
      <Modal title='COMPETITION AND EXAM' visible={props.modalStatus} footer={null} width='1100px' onOk={() => console.log('')} onCancel={() => props.closeModal()}>
        <div>
          <Row>
            <Col sm={24} style={{padding: '0px 10px 10px 10px'}}>
              <Search placeholder="Search Text Here" onSearch={(e) => changeSearchData(e)} style={{ width: '100%' }} />
              {props.singleCompetitions ? 
                <h6 style={{color: 'red'}}>*You Can Only Select Exams From One Competition.</h6>
              : null}
            </Col>
          </Row>
          <Row>
            <Col sm={24}>
              <div style={{flex: 1, display: 'flex', flexWrap: 'wrap'}}>
                {_.map(props.competitionsData, (c,i) => {
                  let comChecked = _.findIndex(selectedData.selectedCompetition, sc => sc == c._id) != -1
                  return(
                    <div style={{minWidth: '33.3%', marginBottom: '10px'}} key={i}>
                      {props.competitionCheckbox ? 
                        <div key={i} style={{border: comChecked ? '.5px solid #73e9ff' : '.5px solid #b1b1b1', textAlign: 'center', borderRadius: '3px', backgroundColor: comChecked ? '#dffaff' : 'white', padding:'0px 10px', margin:'10px'}}>
                            <Checkbox style={{marginTop: '5px', marginBottom: '5px'}} checked={comChecked} onClick={() => competitionChange(c._id)}>
                                {c.name.en}
                            </Checkbox>
                        </div>
                      :
                        <div style={{color: '#303e52'}}><RightOutlined style={{fontSize: '13px'}}/>&nbsp;{c.name.en}</div>
                      }
                      <div style={{paddingLeft: '15px', color: '#7b8692'}}>
                        {_.map(_.filter(props.examsData, e => _.includes(_.toUpper(e.name.en), _.toUpper(searchData)) && _.findIndex(c.exams, ce => ce == e._id) != -1), (e,id) => (
                          <div key={id}>
                            {props.multipleSelect ? 
                              <Checkbox disabled={(props.singleCompetitions && _.findIndex(selectedData.selectedCompetition, sc => sc != c._id) != -1) || (props.competitionOnlyExams && _.findIndex(selectedData.selectedCompetition, sc => sc == c._id) == -1)} style={{margin: '0px'}} checked={_.findIndex(selectedData.selectedExams, ex => ex == e._id) != -1} onClick={() => examChange(e._id, c._id)}>
                                {e.name.en}
                              </Checkbox> 
                            :
                              <Radio disabled={(props.singleCompetitions && _.findIndex(selectedData.selectedCompetition, sc => sc != c._id) != -1) || (props.competitionOnlyExams && _.findIndex(selectedData.selectedCompetition, sc => sc == c._id) == -1)} style={{margin: '0px'}} checked={_.findIndex(selectedData.selectedExams, ex => ex == e._id) != -1} onClick={() => examChange(e._id, c._id)}>
                                {e.name.en}
                              </Radio>
                            }
                          </div>      
                        ))}
                      </div>
                    </div>
                  )}
                )}
              </div>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col sm={24} style={{textAlign: 'center'}}>
              <Button block type='primary' disabled={selectedData.selectedExams.length == 0} onClick={() => props.selectedExamsData(selectedData.selectedExams, props.singleCompetitions ? selectedData.selectedCompetition[0] : selectedData.selectedCompetition)}>Add</Button>
            </Col>
          </Row>
        </div>
      </Modal>
  )
}

