import { Button, Card, Form, Input, List, Select, Tag } from 'antd'
import Text from 'antd/lib/typography/Text'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuthUser } from '../../App/Context'
import { STATUS } from '../../Constants'
import { getChapterTemplateAction } from '../../redux/reducers/Syllabus'
import { CurrentTestContext } from './AddTest'
import _ from 'lodash'
import { assignTestSyllabusAction } from '../../redux/reducers/test'
import { SearchOutlined } from '@ant-design/icons'

export const AssignTestSyllabus = () => {
    const currentTest = useContext(CurrentTestContext)
    const auth = useAuthUser()
    const dispatch = useDispatch()

    const {syllabus, assignTestSyllabusStatus} = useSelector(state => ({
        syllabus: state.syllabus,
        assignTestSyllabusStatus: state.test.assignTestSyllabusStatus
    }))

    let [selectedTemps, changeSelectedTemps] = useState([])
    const [searchText, setSearchText] = useState()
    
    useEffect(() => {
        dispatch(getChapterTemplateAction({instituteId: auth.staff.institute._id}))
    }, [])

    useEffect(() => {
        if(syllabus.getChapterTemplateStatus == STATUS.SUCCESS && currentTest.syllabus?.length){
            const data = currentTest.syllabus.map(syl => 
                ({chapters:syl.chapters, subject:syl.subject?._id, templateId:syl.templateId?._id, syllabusId:syl._id})    
            )

            changeSelectedTemps(data)
        }
    }, [syllabus.getChapterTemplateStatus])

    const selectTemplate = (e, sub) => {
        const temps = [...selectedTemps]
        let indx = _.findIndex(temps,d => d.subject == sub.subjectRefId._id)
        if(indx != -1){
            temps[indx].templateId = e
            temps[indx].chapters = []
        }else{
            temps.push({subject:sub.subjectRefId._id, templateId:e, chapters:[]})
        }

        changeSelectedTemps(temps)
    }

    const selectChanpter = (checked, chapter, subject) => {
        const temps = [...selectedTemps]
        let indx = _.findIndex(temps,d => d.subject == subject.subjectRefId._id)

        if(indx != -1){
            temps[indx].chapters = _.xor(temps[indx].chapters, [chapter.chapterId._id])
        }else{
            if(indx > -1)
            temps[indx].chapters.push(chapter.chapterId._id)
        }

        changeSelectedTemps(temps)
    }

    const assignSyllabus = (sub) => {
        let data = _.findIndex(selectedTemps,t => t.subject == sub.subjectRefId._id) != -1 ? _.find(selectedTemps,t => t.subject == sub.subjectRefId._id) : {subject:sub.subjectRefId._id} 
        data = {testId:currentTest._id, ...data}
        dispatch(assignTestSyllabusAction(data))
    }

    const searchChapter = (value, subjectId) => {
        let data = value ? {value, subjectId} : null
        setSearchText(data)
    }

    return(
        <div>
            {currentTest.sections.length ? 
                <Card loading={syllabus.getChapterTemplateStatus == STATUS.FETCHING} style={{border:0}}>
                    {currentTest.sections.map(sec => 
                        {
                            let value = selectedTemps.length && _.findIndex(selectedTemps,t => t.subject == sec.subjectRefId._id) != -1 ?
                                _.find(selectedTemps,t => t.subject == sec.subjectRefId._id) : null

                            let template =  value && _.find(syllabus.chapterTemplateData,d => d._id == value.templateId)
                            let chaptersList = template ? template.chapters   : null
                            chaptersList = chaptersList?.length && searchText?.subjectId == sec._id ? 
                                _.filter(chaptersList,d => _.includes(_.toLower(d.chapterId?.name?.en), _.toLower(searchText.value))) 
                                : chaptersList
                            return(
                                <div key={sec.subjectRefId._id}>
                                    <Card style={{margin:'10px'}} key={sec.subjectRefId._id} title={<b>{sec.subjectRefId?.name?.en}</b>} bodyStyle={{padding:'10px'}}>
                                        <Form.Item label={<b>Chapter Template</b>} style={{marginBottom:'20px'}}>
                                            <Select placeholder='Select' value={value?.templateId} onChange={(e) => selectTemplate(e, sec)}>
                                                {syllabus.chapterTemplateData?.length ? 
                                                    _.compact(_.map(syllabus.chapterTemplateData, d => {
                                                        return(
                                                            d.name?.en ? 
                                                                <Select.Option key={d._id}>{d.name?.en}</Select.Option>
                                                            : null
                                                        )}
                                                    ))
                                                : null}
                                            </Select>
                                        </Form.Item>
                                        {value ? 
                                            <div style={{display:'flex'}}>
                                                <div style={{paddingRight:'10px'}}>
                                                    <b>Select Chapters:</b>
                                                </div>
                                                <div>
                                                    <List size='small' bordered style={{maxHeight:'400px', minWidth:'200px', overflow:'auto'}}
                                                        header={
                                                            <div>
                                                                <Input value={searchText && searchText.subjectId == sec._id ? searchText.value : null }  allowClear
                                                                    prefix={<SearchOutlined />} onChange={e => searchChapter(e.target.value, sec._id)} 
                                                                    placeholder='Search Chapter'
                                                                />
                                                            </div>
                                                        }
                                                    >
                                                        {chaptersList ?
                                                            chaptersList.map(ch => 
                                                                {
                                                                    let checked = _.findIndex(value.chapters,c => c == ch.chapterId._id) != -1
                                                                    return(
                                                                        <List.Item checked={checked} key={ch._id} className={checked && 'active-subjectTab'} style={{color:checked && 'white', cursor:'pointer'}}
                                                                            onClick={checked => selectChanpter(checked, ch, sec)}
                                                                        >
                                                                            {ch.chapterId?.name?.en}
                                                                        </List.Item>
                                                                    )
                                                                }
                                                            )
                                                            :
                                                            null
                                                        }
                                                    </List>
                                                </div>
                                            </div>
                                            : null
                                        }
                                        <br/><br/>
                                        <br/>
                                        <br/>
                                        <Button type='primary' loading={assignTestSyllabusStatus == STATUS.FETCHING} onClick={() => assignSyllabus(sec)} style={{float:'right'}} ghost>Save</Button>
                                    </Card>
                                </div>
                            )
                        }
                    )}
                </Card>
                :
                <div style={{textAlign:'center'}}>
                    <br/>
                    <Text style={{fontSize:'18px', color:'#85929E'}}>Assign Subjects First</Text>
                </div>
            }
        </div>
    )
}