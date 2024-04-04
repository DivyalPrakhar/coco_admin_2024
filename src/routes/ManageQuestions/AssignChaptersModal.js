import { Card, List, Modal } from 'antd'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import { getBasechaptersAction } from '../../redux/reducers/Syllabus'
import _ from 'lodash'
import { CheckCircleTwoTone } from '@ant-design/icons'
import { resetUpdateQuestion, updateQuestionAction } from '../../redux/reducers/questions'

export const AssignChaptersModal = ({visible, closeModal, defaultData}) => {
    const dispatch = useDispatch()

    const {baseChapters, basechaptersStatus, updateQueStatus} = useSelector(s => ({
        baseChapters: s.syllabus.basechaptersData,
        basechaptersStatus: s.syllabus.basechaptersStatus,
        updateQueStatus:s.questions.updateQueStatus
    }))

    const [selectedChapters, setChapters] = useState([])

    useEffect(() => {
        return () => dispatch(resetUpdateQuestion())
    }, [])

    useEffect(() => {
        if(defaultData){
            let data = {subjects: defaultData.subjects, exams: defaultData.exams}
            dispatch(getBasechaptersAction(data))
            
            setChapters(defaultData.basechapters?.length ? defaultData.basechapters.map(ch => ch._id): [])
        }
    }, [defaultData])

    useEffect(() => {
        if(updateQueStatus == STATUS.SUCCESS)
            closeModal()
    }, [updateQueStatus])

    const selectChapter = (ch) => {
        let data = _.xor(selectedChapters, [ch._id])
        setChapters(data)
    }

    const onSave = () => {
        let data = {id:defaultData._id, basechapters:selectedChapters}
        dispatch(updateQuestionAction(data))
    }

    let activeChapterStyle = {background:'#E8F8F5', cursor:'pointer'} 

    return(
        <Modal title='Assign Chapters' visible={visible} confirmLoading={updateQueStatus == STATUS.FETCHING} onCancel={closeModal} okText='Save' onOk={onSave}>
            <Card style={{border:0}} bodyStyle={{padding:0}} loading={basechaptersStatus == STATUS.FETCHING}>
                {basechaptersStatus == STATUS.SUCCESS ? 
                    baseChapters?.length ?
                        <div>
                            <div style={{marginBottom:'10px', fontWeight:'bold'}}>Select Basechapter</div>
                            <List style={{height:'400px', overflow:'auto'}}
                                bordered
                                dataSource={baseChapters}
                                renderItem={ch => 
                                    {
                                        const active = _.findIndex(selectedChapters,d => d == ch._id) != -1
                                        return(
                                            <List.Item onClick={() => selectChapter(ch)} style={ active ? activeChapterStyle : {cursor:'pointer'}} key={ch._id}>
                                                {ch?.name?.en}
                                                {active ? <CheckCircleTwoTone twoToneColor='#52c41a' style={{fontSize:'18px', float:'right'}}/> : null}
                                            </List.Item>
                                        )
                                    }      
                                }
                            />
                        </div>
                        :
                        <div>No chapters available</div>
                    :
                    <div>Something went wrong</div>
                }
            </Card>
        </Modal>
    )
}