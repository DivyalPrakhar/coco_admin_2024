import { Button, Card, Collapse, Form, Input, Select } from 'antd'
import Text from 'antd/lib/typography/Text'
import React, { useEffect, useReducer, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuthUser } from '../App/Context'
import { STATUS } from '../Constants'
//import { getDefaultDataAction, getInstituteDefaultAction } from '../redux/reducers/LmsConfig'
import { getAllQuestionsAction } from '../redux/reducers/questions'
import { FormReducer } from '../utils/FormReducer'
import { QuestionTypeNames } from '../utils/QuestionTypeHelper'
import _ from 'lodash'

export const QuestionFilters = ({filteredData, setFilteredData}) => {
    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const auth = useAuthUser()
    const {configData} = useSelector(s => ({
        configData: s.lmsConfig
    }))

    let [formKey, setformKey] = useState(1)
    const [defaultSyllabus, setDefaultSyllabus] = useState({subjects: [], standards: [], boards: [], competitions: [], exams: []})

   /* useEffect(() => {
  	    dispatch(getDefaultDataAction())
        dispatch(getInstituteDefaultAction({instituteId: auth.staff.institute._id, platform: 'examstudent', key: "syllabus",}))
    }, [])*/

    useEffect(() => {
        if(configData.defaultDataStatus == STATUS.SUCCESS){
            //let data = configData.instituteDefaultData.data
            let defaultData = configData.defaultData
            setDefaultSyllabus({
                subjects: defaultData?.subjects,//_.intersectionBy(defaultData?.subjects, data.subjects.map(d => ({_id:d})), '_id'), 
                standards: defaultData?.standards,//_.intersectionBy(defaultData?.standards, data.standards.map(d => ({_id:d})), '_id'), 
                boards: defaultData?.boards,//_.intersectionBy(defaultData?.boards, data.boards.map(d => ({_id:d})), '_id'),
                competitions: defaultData?.competitions,//_.intersectionBy(defaultData?.competitions//, data.competitions.map(d => ({_id:d})), '_id'), 
                exams: defaultData?.exams//_.intersectionBy(defaultData?.exams, data.exams.map(d => ({_id:d})), '_id')
            })
        }
    }, [configData.defaultDataStatus])

    const setFilterValues = (type, value) => {
        setFilteredData({type, value })
    }

    const selectQueType = (value) => {
        setFilterValues('type', value)
    }

    const selectSubjects = (value) => {
        setFilterValues('subjects', value)
    }

    const selectStandards = (value) => {
        setFilterValues('standards', value)
    }

    const selectBoards = (value) => {
        setFilterValues('boards', value)
    }

    const selectExams = (value) => {
        setFilterValues('exams', value)
    }

    const searchQueId = (e) => {
        setFilterValues('display_id', e.target.value)
    }

    const filterQuestions = () =>{
        dispatch(getAllQuestionsAction({filters:{..._.omitBy(filteredData, _.isEmpty), questionUsage:filteredData?.questionUsage,}, limit:20}))
    }

    const resetFilter = () => {
        dispatch(getAllQuestionsAction({filters:{}, limit:20}))
        setFilterValues('reset')
        setformKey(++formKey)
        form.resetFields()
    }

    return(
        <div>
            <div style={{fontSize:'18px', marginBottom:'10px'}}>
                <Text >Filters</Text>
            </div>
            <Card bodyStyle={{padding:5, height:'400px', overflow:'auto'}} 
                loading={configData.defaultDataStatus == STATUS.FETCHING}
            >
                {configData.defaultDataStatus == STATUS.SUCCESS ? 
                    <Form form={form} key={formKey}>
                        <Collapse >
                            <Collapse.Panel header="Question Type" key="1">
                                <Form.Item name='queType'>
                                    <Select style={{width:'100%'}} allowClear onChange={selectQueType} placeholder='Select Question Type'>
                                        {QuestionTypeNames.map(qType => 
                                            <Select.Option value={qType.type} key={qType.id}>
                                                {qType.shortName}
                                            </Select.Option>
                                        )}
                                    </Select>
                                </Form.Item>
                            </Collapse.Panel>
                            <Collapse.Panel header="Subject" key="2">
                                <Form.Item name='subject'>
                                    <Select style={{width:'100%'}} allowClear mode="multiple" onChange={selectSubjects} placeholder='Select Subjects'
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {defaultSyllabus.subjects?.map(qType => 
                                            <Select.Option value={qType._id} key={qType._id}>
                                                {qType.name.en}
                                            </Select.Option>
                                        )}
                                    </Select>
                                </Form.Item>
                            </Collapse.Panel>
                            {/*<Collapse.Panel header="Board" key="3">
                                <Form.Item name='board'>
                                    <Select style={{width:'100%'}} allowClear mode="multiple" onChange={selectBoards} placeholder='Select Boards'
                                        filterOption={(input, option) =>option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {defaultSyllabus.boards?.map(qType => 
                                            <Select.Option value={qType._id} key={qType._id}>
                                                {qType.name.en}
                                            </Select.Option>
                                        )}
                                    </Select>
                                </Form.Item>
                            </Collapse.Panel>*/}
                            <Collapse.Panel header="Exam" key="4">
                                <Form.Item name='exam'>
                                    <Select style={{width:'100%'}} allowClear mode="multiple" onChange={selectExams} placeholder='Select Exams'
                                        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {defaultSyllabus.exams?.map(qType => 
                                            <Select.Option value={qType._id} key={qType._id}>
                                                {qType.name.en}
                                            </Select.Option>
                                        )}
                                    </Select>
                                </Form.Item>
                            </Collapse.Panel>
                            {/*<Collapse.Panel header="Standard" key="5">
                                <Form.Item name='standard'>
                                    <Select style={{width:'100%'}} allowClear mode="multiple" onChange={selectStandards} placeholder='Select standards'
                                        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {defaultSyllabus.standards?.map(qType => 
                                            <Select.Option value={qType._id} key={qType._id}>
                                                {qType.name.en}
                                            </Select.Option>
                                        )}
                                    </Select>
                                </Form.Item>
                            </Collapse.Panel>*/}
                            <Collapse.Panel header="Search Question Id" key="6">
                                <Form.Item name='queId'>
                                    <Input onChange={searchQueId} placeholder='Search Id'/>
                                </Form.Item>
                            </Collapse.Panel>
                        </Collapse>
                    </Form>
                    : null
                }
            </Card>
            <Button block style={{width:'50%'}} onClick={filterQuestions} type='primary'>Apply</Button>
            <Button block style={{width:'50%'}} onClick={resetFilter}>Reset</Button>
        </div>
    )
}



export const useFilterDataReducer = (initialData = {}) => {
    return useReducer(FormReducer, initialData)
}

