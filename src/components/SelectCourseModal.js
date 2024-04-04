import { Card, Modal, Table, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuthUser } from '../App/Context'
import { STATUS } from '../Constants'
import { getCoursesAction } from '../redux/reducers/courses'
import _ from 'lodash'

export const SelectCourseModal = ({closeDrawer, visible, submitCourses}) => {
    const dispatch = useDispatch()
    const auth = useAuthUser()

    const {getCoursesStatus, courseList} = useSelector((state) => ({
        getCoursesStatus:state.course.getCoursesStatus,
        courseList:state.course.courseList
    }))

    const [selectedCourse, selectCourse] = useState([])

    useEffect(() => {
        dispatch(getCoursesAction({instituteId:auth.staff.institute._id}))
    }, [])

    const _selectCourse = (data) => {
        selectCourse(data)
    }

    const columns = [
        {title: 'Name', dataIndex: 'name', width:'150px'},
        {title: 'Description', dataIndex: 'description'},
        {title: 'Code', dataIndex: 'code'},
        {title: 'Status', dataIndex: 'status',
            render: d => (
                <div>
                    <Tag style={{cursor: 'pointer', margin:'4px'}} color={d.isReady ? 'green' : 'red'}>{d.isReady ? 'Ready' : 'Not Ready'}</Tag>
                    <Tag style={{cursor: 'pointer'}} color={d.isActive ? 'green' : 'red'}>{d.isActive ? 'Active' : 'Not Active'}</Tag>
                </div>
            )
        },
    ]

    const pageChange = (d) => {
        dispatch(getCoursesAction({instituteId:auth.staff.institute._id, page:d.current}))
    }

    const _submitCourses = () => {
        const data = selectedCourse?.length ? _.intersectionBy(courseList, selectedCourse.map(d => ({_id:d})), '_id') : []
        submitCourses(data)
        closeDrawer()
    }

    const dataSourse = courseList?.length ? courseList.map(d => Object.assign({}, d, {key:d._id, status:{isReady:d.isReady, isActive:d.isactive}})) : []
    return(
        <Modal title='Select Course' visible={visible} width={'70%'} onCancel={closeDrawer} onOk={_submitCourses}>
            <Card style={{border:0}} bodyStyle={{padding:0}} loading={getCoursesStatus == STATUS.FETCHING}>
                {getCoursesStatus == STATUS.SUCCESS ? 
                    <Table bordered dataSource={dataSourse} columns={columns} rowSelection={{selectedRowKeys:selectedCourse, onChange:_selectCourse}}
                        onChange={pageChange} pagination={false} scroll={{ y: 340 }}
                    />
                    :
                    null
                }
            </Card>
        </Modal>
    )
}  