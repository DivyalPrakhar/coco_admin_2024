import { Button, Drawer, Form, Input, message, Select} from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../Constants'
import _ from 'lodash'
import { addCourseSubjectAction, resetCourseSubjectStatus, updateCourseSubjectAction } from '../redux/reducers/courses'
import { useApiRequest} from "../services/api/useApiRequest";
import { URIS } from '../services/api'
import { useAuthUser } from "../App/Context";

export const AddCourseSubjectDrawer = ({visible, closeDrawer, currentCourse, syllabus}) => {
    const auth = useAuthUser()
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const [ templateData, setTemplateData ] = useState({})
    const [ selectedData, setSelectedData ] = useState({})

    const {user, course} = useSelector((state) => ({
        user:state.user.user,
        course:state.course
    }))

    useEffect(() => {
        if(course.addCourseSubjectStatus == STATUS.SUCCESS || course.updateCourseSubjectStatus == STATUS.SUCCESS){
            closeDrawer()
        }

        return () => {
            dispatch(resetCourseSubjectStatus())
        }
    }, [course.addCourseSubjectStatus, course.updateCourseSubjectStatus])

    const _addCourse = (data) => {
        if(currentCourse)
            dispatch(updateCourseSubjectAction(data))
        else
            dispatch(addCourseSubjectAction(data))
    }

    const _closeDrawer = () => {
        closeDrawer()
        form.resetFields()
    }

    const { request: fetchTemplateData, loading, reset } = useApiRequest(URIS.GET_CHAPTER_TEMPLATE, {
        onCompleted: (data) => {
          setTemplateData(data)
        },
        onError: (data, response) => {
          message.error(response?.message || data);
        },
    });

    const { Option } = Select;
        
    return(
        <Drawer placement='right' onClose={_closeDrawer} visible={visible} width='50%' title='Add Subject'>
            <Form labelCol={{ span: 6 }}
                onFinish={_addCourse}
                form={form}
                wrapperCol={{ span: 12 }}
                layout="horizontal"
            >
                <Form.Item name='displayName' label='Display Name' wrapperCol={{offset: 1}}>
                    <Input style={{ width: 300 }} placeholder='name' onChange={(e) => setSelectedData({...selectedData, displayName: e.target.value})}/>
                </Form.Item>
                <Form.Item name='subject'  label='Subject' wrapperCol={{offset: 1}}>
                    <Select 
                        style={{ width: 300 }} 
                        showSearch 
                        filterOption={(input, option) => {
                                return(
                                    option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                )
                            }
                        } 
                        placeholder='select subject' 
                        onChange={(e) => (setSelectedData({...selectedData, subject: e}), fetchTemplateData({params: {subjects: [e], instituteId: auth.staff.institute._id}, method: 'GET'}))}
                    >
                        {_.map(syllabus.subjects, s => {
                            return(
                                <Option key={s._id} value={s._id}>{s.name.en}</Option>
                            )}
                        )}
                        
                    </Select>
                </Form.Item>
                {selectedData.subject ? 
                    <Form.Item name='template' label='Template:' wrapperCol={{offset: 1}}>
                        <Select 
                            style={{ width: 300 }} 
                            placeholder='template' 
                            showSearch 
                            filterOption={(input, option) => {
                                    return(
                                        option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    )
                                }
                            } 
                            onChange={(e) => setSelectedData({...selectedData, template: e})}
                        >
                            {_.map(templateData, s => {
                                return(
                                    s.name?.en ? 
                                        <Option key={s._id} value={s._id}>{s?.name?.en}</Option>
                                    : null
                                )}
                            )}        
                        </Select>
                    </Form.Item>
                : null}
                <Form.Item wrapperCol={ {offset: 7}}>
                    <Button type="primary" loading={course.addCourseSubjectStatus == STATUS.FETCHING || course.updateCourseSubjectStatus == STATUS.FETCHING} onClick={() => dispatch(addCourseSubjectAction({...selectedData, id: currentCourse._id}))}>
                        Add
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    )
}