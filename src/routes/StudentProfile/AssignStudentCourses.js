import { DeleteTwoTone, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Drawer, Empty, Form, Popover, Select, Skeleton, Space, Tooltip } from 'antd';
import Title from 'antd/lib/typography/Title';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthUser } from '../../App/Context';
import { STATUS } from '../../Constants';
import { getCoursesAction } from '../../redux/reducers/courses';
import { assignStudCoursesAction, removeStudCourseAction } from '../../redux/reducers/student';
import _ from 'lodash'
import { ConfirmAlert } from '../../Constants/CommonAlerts';

export const AssignCourses = ({ student }) => {
    const dispatch = useDispatch()
    const [showDrawer, changeShowDrawer] = useState()

    const {removeCourseStatus} = useSelector((state) => ({
        removeCourseStatus:state.student.removeStudCourseStatus
    }))
    
    const _changeShowDrawer=()=>{
      changeShowDrawer(!showDrawer)
    }

    const removeCourse = (id) => {
        ConfirmAlert(() => dispatch(removeStudCourseAction({id:student._id, courseId:id})), 'Are you sure?', null, removeCourseStatus == STATUS.FETCHING)
    }
  
    return (
      <Card>
        <Title style={{fontSize:'18px'}}>
          Courses 
          <Button type='link' style={{float:'right'}} onClick={_changeShowDrawer} icon={<PlusOutlined style={{ fontSize:'30px'}}/>}></Button>
        </Title>

        {student.courses?.length ? 
            <Space wrap>
                {student.courses.map(c => 
                    <Card style={{width: 300}} 
                        title={
                            <div>
                                <b>{c.course?.name}</b>
                                <Tooltip title='Remove'>
                                    <Button onClick={() => removeCourse(c.course?._id)} style={{float:'right'}} icon={<DeleteTwoTone twoToneColor='#eb2f96'/>}></Button>
                                </Tooltip>
                            </div>
                        } 
                    >
                        {c.course?.description}
                    </Card>
                )}
            </Space>
            :
            <Empty description='no courses assigned'/>
        }
  
        <AssignCoursesDrawer visible={showDrawer} student={student} closeDrawer={_changeShowDrawer}/>
      </Card>
    );
  };
  
  const AssignCoursesDrawer = ({closeDrawer, visible, student}) => {
    const auth = useAuthUser()
    const dispatch = useDispatch()
    const {course, assignCourseStatus} = useSelector(state => ({
      course:state.course,
      assignCourseStatus:state.student.studCoursesAssignStatus
    }))
  
    const [selectedCourse, setCourses] = useState() 
    
    useEffect(() => {
      if(course.getCoursesStatus != STATUS.SUCCESS)
        dispatch(getCoursesAction({instituteId:auth.staff.institute._id}))
    }, [dispatch, auth.staff.institute._id, course.getCoursesStatus])

    useEffect(() => {
        if(assignCourseStatus == STATUS.SUCCESS)
            _closeDrawer()
    }, [assignCourseStatus])
  
    const _selectCourse = (data) => {
      setCourses(data)
    }
  
    const assignCourses = () => {
        dispatch(assignStudCoursesAction({id:student._id, courseId:selectedCourse}))
    }

    const _closeDrawer = () => {
        setCourses([])
        closeDrawer()
    }
  
    const coursesList = _.differenceBy(course.courseList, student.courses?.map(d => d.course), '_id')
    return(
      <Drawer visible={visible} width={'40%'} onClose={_closeDrawer} title='Assign Courses'>
        {course.getCoursesStatus == STATUS.SUCCESS ? 
          <Form layout='vertical'>
            <Form.Item label='Select Course'>
              <Select placeholder='select course' value={selectedCourse} onChange={_selectCourse} style={{width:'300px'}}>
                {coursesList.length ? 
                    coursesList.map(c => 
                    <Select.Option key={c._id} value={c._id}>{c?.name}</Select.Option>
                  ) : null
                }
              </Select>
            </Form.Item>
            <Button disabled={!selectedCourse} onClick={assignCourses} type='primary' style={{marginLeft:'10px'}}>Assign</Button>
          </Form>
          :course.getCoursesStatus == STATUS.FETCHING ?
              <Skeleton/>
              : <Empty/>
        }
        
      </Drawer>
    )
  }