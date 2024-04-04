import { Button, Card, DatePicker, Drawer, Form, Input, Space } from 'antd'
import React, { useState } from 'react'
import _ from 'lodash'
import Text from 'antd/lib/typography/Text'
import moment from 'moment'
import { bilingualText } from '../../utils/FileHelper'
import { useDispatch, useSelector } from 'react-redux'
import { assignStudCoursesAction } from '../../redux/reducers/student'
import { STATUS } from '../../Constants'

export const EditStudentPackageModal = ({visible, closeModal, currentPkg, student}) => {
    const dispatch = useDispatch()

    const {assignCourseStatus, course} = useSelector(state => ({
        assignCourseStatus:state.course.assignCourseStatus,
        course: state.course
    }))

    const [dates, changeDates] = useState([])

    const updateCourse = (courseId, studentCourseId) => {
        let obj = _.findIndex(dates,d => d._id === courseId) !== -1 ? _.find(dates,d => d._id === courseId) : null
        if(obj){
            obj = _.omit(obj, '_id')
            let data = {id:student._id, courseId:courseId, _id:studentCourseId, ...obj}
            dispatch(assignStudCoursesAction(data))
        } 
    }

    const changeDate = (course, date, type) => {
        let indx = dates?.length ? _.findIndex(dates,d => d._id === course.course._id) : -1
        let data = {}
        let allDates = [...dates]
        if(indx !== -1){
            let obj = _.find(dates,d => d._id === course.course._id)
            data = {...obj, [type]:moment(date).format('YYYY-MM-DD')}
            allDates[indx] = data
        }else{
            data = {[type]:moment(date).format('YYYY-MM-DD'), _id:course.course._id}
            console.log('data', data)
            allDates.push(data)
        }

        changeDates(allDates)
    }

    let courses = currentPkg.package.courses?.length && student.courses?.length ? 
    _.intersectionBy(student.courses.map(d => {
        return {
            ...d,
            courseId: d.course?._id
        }
    }), currentPkg.package.courses.map(d => ({courseId:d})), 'courseId')
    : []

    return(
        <Drawer visible={visible} title='Edit' width={'50%'} onClose={closeModal} >
            <Card style={{border:0}} bodyStyle={{padding:0}} >
                <div>
                    <Form.Item label='Package Name'>
                        <Text style={{fontWeight:'bold'}}>{bilingualText(currentPkg.package.name)}</Text>
                    </Form.Item>
                    {/* <Form.Item label='Assign On'>
                        <DatePicker  value={currentPkg.assignedOn ? moment(currentPkg.assignedOn) : null}/>
                    </Form.Item> */}
                </div>
                {courses.length ? 
                    <div style={{marginBottom:10}}>
                        <Text style={{fontSize:16, fontWeight:'bold'}}>Courses</Text>
                        {courses.map(crc => {
                            let obj = dates?.length && _.findIndex(dates,d => d._id === crc.course._id) != -1 ? 
                                _.find(dates,d => d._id === crc.course._id)
                                :
                                null
                            return(
                                <div key={crc._id} style={{padding:'5px 10px', border:'1px solid #E5E7E9', marginBottom:10}}>
                                    <Form.Item label='Name'>
                                        {console.log({crc})}
                                        <Text type='secondary' style={{fontWeight:'bold'}}>{crc.course.name}</Text>
                                    </Form.Item>
                                    <Space size='large'>
                                        <Form.Item label='Start On'>
                                            <DatePicker onChange={(e) => changeDate(crc, e, 'assignedOn')}  
                                                value={obj?.assignedOn ? moment(obj.assignedOn)  : crc.assignedOn ? moment(crc.assignedOn) : null}
                                            />
                                        </Form.Item>
                                        <Form.Item label='Expire On'>
                                            <DatePicker onChange={(e) => changeDate(crc, e, 'expireOn')} 
                                                value={obj?.expireOn ? moment(obj.expireOn)  : crc.expireOn ? moment(crc.expireOn) : null}
                                            />
                                        </Form.Item>
                                        <Form.Item >
                                            <Button loading={assignCourseStatus === STATUS.FETCHING} onClick={() => updateCourse(crc.course._id, crc._id)}>Save</Button>
                                        </Form.Item>
                                    </Space><br/>
                                </div>
                            )
                        }
                        )}
                    </div>
                    :
                    null
                }
            </Card>
        </Drawer>
    )
}