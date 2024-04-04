import { Button, Card, Collapse, Form, Input, Select } from 'antd'
import Text from 'antd/lib/typography/Text'
import React, { useEffect, useReducer, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import { getAllQuestionsAction } from '../../redux/reducers/questions'
import { FormReducer } from '../../utils/FormReducer'
import { QuestionTypeNames } from '../../utils/QuestionTypeHelper'
import _ from 'lodash'

export const SelectQuestionFilter = ({filteredData, setFilteredData, singleSelect = false, resetData}) => {
    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const {configData} = useSelector(s => ({
        configData: s.lmsConfig
    }))

    let [formKey, setformKey] = useState(1)
    const [defaultSyllabus, setDefaultSyllabus] = useState({subjects: [], standards: [], boards: [], competitions: [], exams: []})

    useEffect(() => {
        if(configData.defaultDataStatus === STATUS.SUCCESS){
            let defaultData = configData.defaultData
            setDefaultSyllabus({
                subjects: defaultData?.subjects, 
                standards: defaultData?.standards,
                boards: defaultData?.boards,
                competitions: defaultData?.competitions,
                exams: defaultData?.exams
            })
        }
    }, [configData.defaultDataStatus])

    const setFilterValues = (type, value) => {
        setFilteredData({type, value })
    }

    // const selectQueType = (value) => {
    //     setFilterValues('type', value)
    // }

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
        dispatch(getAllQuestionsAction({limit:20, filters: Object.assign({}, {..._.omitBy(filteredData, _.isEmpty), questionUsage:filteredData?.questionUsage})}))
    }

    const resetFilter = () => {
        dispatch(getAllQuestionsAction({limit:20, filters:resetData}))
        setFilterValues('reset', resetData)
        setformKey(++formKey)
        form.resetFields()
    }

    return(
        <div>
            <div style={{fontSize:'18px', marginBottom:'10px'}}>
                <Text >Filters</Text>
            </div>
            <Card bodyStyle={{padding:5, height:'400px', overflow:'auto'}} 
                loading={configData.defaultDataStatus === STATUS.FETCHING}
            >
                {configData.defaultDataStatus === STATUS.SUCCESS ? 
                    <Form form={form} key={formKey}>
                        <Collapse defaultActiveKey={2}>
                            {/* <Collapse.Panel header="Question Type" key="1">
                                <Form.Item name='queType'>
                                    <Select style={{width:'100%'}} allowClear onChange={selectQueType} placeholder='Select Question Type'>
                                        {QuestionTypeNames.map(qType => 
                                            <Select.Option value={qType.type} key={qType.id}>
                                                {qType.shortName}
                                            </Select.Option>
                                        )}
                                    </Select>
                                </Form.Item>
                            </Collapse.Panel> */}
                            <Collapse.Panel header="Subject" key="2">
                                <Form.Item name='subject' key={filteredData.subjects}>
                                    <Select style={{width:'100%'}} allowClear onChange={selectSubjects} defaultValue={filteredData?.subjects} value={filteredData?.subjects} placeholder='Select Subjects'
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
                                    <Select style={{width:'100%'}} allowClear onChange={selectBoards} placeholder='Select Boards'
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
                                    <Select style={{width:'100%'}} allowClear onChange={selectExams} placeholder='Select Exams'
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
                                    <Select style={{width:'100%'}} allowClear onChange={selectStandards} placeholder='Select standards'
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
                                    <Input onChange={searchQueId} placeholder='search id'/>
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

