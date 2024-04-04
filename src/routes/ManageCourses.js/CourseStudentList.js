import { TeamOutlined } from '@ant-design/icons'
import { Button, Card, Tag, Col, Empty, Row, Table, Tooltip, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { STATUS } from '../../Constants'
import { getCourseStudentAction } from '../../redux/reducers/courses'
import _ from 'lodash'
import { useAuthUser, useInstituteId } from "../../App/Context";

export const CourseStudentListModal = (props) => {
    return(
        <Modal visible={props.showModal} footer={null} width='800px' onOk={() => console.log('')} onCancel={() => props.closeModal()}>
            <CourseStudentList {...props}/>
        </Modal>
    )
}

export const CourseStudentList = (props) => {
    const params = useParams()
    const dispatch = useDispatch()

    const {getCourseStudentStatus, courseStudentData} = useSelector((state) => ({
        getCourseStudentStatus:state.course.getCourseStudentStatus,
        courseStudentData:state.course?.courseStudentData
    }))

    useEffect(() => {
        dispatch(getCourseStudentAction({courseId: props.currentCourse._id}))
    }, [])

    const columns = [
        {
            title: 'Name',
            key: 'name',
            render: d => d.user?.name
        },
        {
            title: 'Username',
            key: 'username',
            render: d => d.user?.username
        },
        {
            title: 'Contact',
            key: 'contact',
            render: d => d.user?.contact
        },
        {
            title: 'Email',
            key: 'email',
            render: d => d.user?.email
        }
    ];

    return(
        <Table 
            loading={getCourseStudentStatus == STATUS.FETCHING}
            style={{margin: '15px'}} 
            dataSource={courseStudentData || []} 
            bordered
            title={() =>  <div style={{fontWeight: 'bold', color: '#2db7f5', textTransform: 'uppercase'}}>{props.currentCourse?.name+' Student List'}</div>}
            columns={columns} 
        />  
    )
} 