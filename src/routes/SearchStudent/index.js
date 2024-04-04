import { Avatar, Card, Col, Descriptions, Input, List, Row, Select, Tag } from 'antd'
import Search from 'antd/lib/input/Search'
import { Option } from 'antd/lib/mentions'
import React, { useEffect, useState } from 'react'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import _ from 'lodash'
import { useHistory } from 'react-router-dom'
import { searchStudentsAction } from '../../redux/reducers/student'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import Title from 'antd/lib/typography/Title'

export const SearchStudent = () => {
    const dispatch = useDispatch()
    const [searchKey, setSearchKey] = useState('name')
   
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
    
    return(
        <div>
            <CommonPageHeader title='Search Student'/>
            <br/>
            <Card>
                <Input.Group compact>
                    <Select style={{ width: '20%' }} onChange={e => setSearchKey(e)} size='large' defaultValue="name">
                        {searchTypes.map(type => 
                            <Option value={type.key} key={type.id}>{type.label}</Option>
                        )}
                    </Select>
                    <Search style={{ width: '80%' }} autoFocus size='large' loading={student.searchStudentStatus == STATUS.FETCHING} 
                        placeholder={`Enter ${_.find(searchTypes,d => d.key == searchKey).label}`} allowClear 
                        enterButton="Search"
                        type={_.find(searchTypes,d => d.key == searchKey).label === "Contact" ? "number" : "text"}
                        onSearch={e => e && searchStudent(e)}
                    />
                </Input.Group>
                <br/><br/>
                <div style={{overflow:'auto', maxHeight:'600px', border:'1px solid #E5E7E9'}}>
                    <StudentList studentsList={student.studentsList}/>
                </div>
                <br/><br/>
            </Card>
        </div>
    )
}

export const StudentList = ({studentsList, height, select, getStudents, defaultSelectedStuds}) => {
    const history = useHistory()

    const [selectedStudents, selectStudent] = useState([])

    useEffect(() => {
        if(defaultSelectedStuds?.length){
            selectStudent(defaultSelectedStuds)
        }
    }, [defaultSelectedStuds])

    const _selectStudent = (stud) => {
        let data = selectedStudents
        data = _.xorBy(data, [stud], '_id')
        selectStudent(data)
        getStudents(data)
    }

    var colors = ['#EF9A9A','#90CAF9','#FFF59D','#A5D6A7','#CE93D8','#FFCCBC']
    return(
        <List style={{height:height, overflow:'auto'}}
            itemLayout="horizontal"
            dataSource={studentsList}
            renderItem={item => {
                let selected = select && selectedStudents?.length && _.findIndex(selectedStudents,s => s._id == item._id) != -1
                return(
                    <List.Item className='student-tab' style={{padding:'8px', margin:4, background:selected ? '#D6EAF8' : ''}}>
                        <List.Item.Meta
                            onClick={() => select ? _selectStudent(item) : history.push('/student/profile/'+item._id)}
                            style={{cursor:'pointer', padding:"10px"}}
                            avatar={item.avatar ? 
                                <Avatar size={60} src={item.avatar} /> 
                                : 
                                <Avatar size={60} style={{fontSize:'25px', background:colors[Math.floor(Math.random()*colors.length)]}}>
                                    {_.upperCase(item.name?.substring(0, 2))}
                                </Avatar>
                            }
                            title={
                                <Row justify="flex-start" style={{marginBottom:-10}}>
                                <Col >
                                <Title level={5} style={{color:'#2E86C1', fontSize:'18px'}}>{item.name}</Title>
                                </Col>
                                <Col style={{marginLeft:"10px"}} >
                                <Tag color={item.role === "LEAD" ? "warning" : "success"}>{item.role}</Tag>

                                </Col>
                              </Row>
                              }
                            description={
                                item &&
                                <Descriptions>
                                    <Descriptions.Item label="">
                                        {item.username}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Contact">
                                        <b>{item.contact}</b>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Email">
                                        <b>{item.email}</b>
                                    </Descriptions.Item>
                                </Descriptions>
                            }
                        />
                    </List.Item>
            )}}
        />
    )
}