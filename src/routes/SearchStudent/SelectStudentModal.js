import { Form, Input, Select } from 'antd'
import Search from 'antd/lib/input/Search'
import { Option } from 'antd/lib/mentions'
import Modal from 'antd/lib/modal/Modal'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StudentList } from '.'
import { searchStudentsAction } from '../../redux/reducers/student'
import _ from 'lodash'
import { STATUS } from '../../Constants'
import Text from 'antd/lib/typography/Text'

export const SelectStudentModal = ({visible, closeModal, getSelectedStudents, selectedStudents}) => {
    const dispatch = useDispatch()

    const [searchKey, setSearchKey] = useState('name')
    const [studentsList, setStudents] = useState([])

    useEffect(() => {
        if(selectedStudents?.length){
            setStudents(selectedStudents)
        }
    }, [selectedStudents])
   
    const {student} = useSelector((state) => ({
        student:state.student
    }))

    const searchTypes = [
        {id:1, key:'name', label:'Name'},
        {id:2, key:'contact', label:'Contact'},
        {id:3, key:'email', label:'Email'}
    ]

    const searchStudent = (query) => {
        let data = {searchKey, searchQuery:query, limit:30, page:1}
        dispatch(searchStudentsAction(data))
    }

    const getStudents = (studs) => {
        setStudents(studs)
    }

    const submit = () => {
        getSelectedStudents(studentsList)
        closeModal()
    }

    return(
        <Modal title='Select Student' visible={visible} width='1400px' onOk={submit} onCancel={closeModal}>
            <Input.Group compact>
                <Select style={{ width: '20%' }} onChange={e => setSearchKey(e)} size='large' defaultValue="name">
                    {searchTypes.map(type => 
                        <Option value={type.key} key={type.id}>{type.label}</Option>
                    )}
                </Select>
                <Search style={{ width: '80%' }} autoFocus size='large' loading={student.searchStudentStatus === STATUS.FETCHING} 
                    placeholder={`Enter ${_.find(searchTypes,d => d.key == searchKey).label}`} allowClear 
                    enterButton="Search"
                    type={_.find(searchTypes,d => d.key == searchKey).label === "Contact" ? "number" : "text"}
                    onSearch={e => e && searchStudent(e)}
                />
            </Input.Group>
            <br/><br/>
            {studentsList.length ?
                <Form.Item label='Selected Students'>
                    <Text style={{color:'#3498DB', fontWeight:'bold'}}>{studentsList.length}</Text>
                </Form.Item> : null
            }
            <div style={{border:'1px solid #EBEDEF'}}>
                <StudentList defaultSelectedStuds={studentsList} getStudents={getStudents} select height='400px' studentsList={student.studentsList}/>
            </div>
        </Modal>
    )
}