import { DeleteOutlined, RedoOutlined } from '@ant-design/icons'
import { Card, Col, Row, Table, Tag, Form, Input, Select, Divider, DatePicker, Space, Button, Radio } from 'antd'
import Title from 'antd/lib/typography/Title'
import Text from 'antd/lib/typography/Text'
import moment from 'moment'
import React, { useEffect, useReducer, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuthUser } from '../App/Context'
import { CommonPageHeader } from '../components/CommonPageHeader'
import { STATUS } from '../Constants'
import { getCoursesAction } from '../redux/reducers/courses'
import { getPackagesAction } from '../redux/reducers/packages'
import { getAllStudentsAction } from '../redux/reducers/student'
import { bilingualText } from '../utils/FileHelper'
import { FormReducer } from '../utils/FormReducer'
import { sort } from 'semver'
import { TotalCountBox } from '../components/TotalCountBox'
import { useHistory } from 'react-router-dom'

export const Students = () => {
    const dispatch = useDispatch()
    const auth = useAuthUser()
    const history = useHistory()

    const {getAllStudentsStatus, allStudents, getPackagesStatus, getCoursesStatus, packagesList, courseList} = useSelector(state => ({
        getAllStudentsStatus:state.student.getAllStudentsStatus,
        allStudents:state.student.allStudents,
        getPackagesStatus:state.packages.getPackagesStatus,
        getCoursesStatus:state.course.getCoursesStatus,
        packagesList:state.packages.packagesList,
        courseList:state.course.courseList
    }))

    const [filterData, changeFilter] = useReducer(FormReducer, {packageIds:[], courseIds:[]})
    const [sortValue, changeSortValue] = useState({sort:{createdAt:-1}})

    useEffect(() => {
        dispatch(getAllStudentsAction())
        dispatch(getPackagesAction())
        dispatch(getCoursesAction({instituteId:auth.staff.institute._id}))
    }, [dispatch, auth])
    
    const handlePageChange = (d) => {
        dispatch(getAllStudentsAction({ page:d.current, ...filterData, ...sortValue}))
    }

    const handleApply = () => {
        dispatch(getAllStudentsAction({...filterData, ...sortValue}))
    }

    const handleFilters = (value, type) => {
        if(type === 'date'){
            let date = {startDate:value ? moment(value[0]).format('YYYY-MM-DD') : null, endDate:value ? moment(value[1]).format('YYYY-MM-DD') : null}
            changeFilter({type:'merge', value:date})
        }
        else
            changeFilter({type, value})
            
    }

    const handleReset = () => {
        changeFilter({type:'reset', value:{}})
        dispatch(getAllStudentsAction({...sortValue}))
    }

    const handleSort = (value, type) => {
        let data = {sort:{[type]:value}}
        changeSortValue(data)
        dispatch(getAllStudentsAction({...filterData, sort:data.sort}))
    }

    const _studentProfile = (id) =>{
        history.push("student/profile/"+id)
    }
    return(
        <div>
            <CommonPageHeader title='Students List'/>
            <br/>
            <Card loading={getPackagesStatus === STATUS.FETCHING || getCoursesStatus === STATUS.FETCHING}>
                {getPackagesStatus === STATUS.SUCCESS && getCoursesStatus === STATUS.SUCCESS ?
                    <>
                        <div>
                            <Title level={4}>Filters</Title>
                            <div style={{display:'flex', flexWrap:'wrap'}}>
                                <div style={{padding:'0 20px 0 0'}}>
                                    <Form.Item label='Name'>
                                        <Input value={filterData.name} onChange={(e) => handleFilters(e.target.value, 'name')} placeholder='Name' />
                                    </Form.Item>
                                </div>
                                <div style={{padding:'0 20px 0 0', minWidth:300}}>
                                    <Form.Item label='Contact'>
                                        <Input value={filterData.contact} onChange={(e) => handleFilters(e.target.value, 'contact')} placeholder='Contact' type='number' min={0} />
                                    </Form.Item>
                                </div>
                                <div style={{padding:'0 20px 0 0', minWidth:300}}>
                                    <Form.Item label='Email'>
                                        <Input value={filterData.email} onChange={(e) => handleFilters(e.target.value, 'email')} placeholder='Email' />
                                    </Form.Item>
                                </div>
                                <div style={{padding:'0 20px 0 0', minWidth:300}}>
                                    <Form.Item label='Role'>
                                        <Select placeholder='Select role' allowClear value={filterData.role} onChange={(e) => handleFilters(e, 'role')}>
                                            <Select.Option value='STUDENT'>Student</Select.Option>
                                            <Select.Option value='LEAD'>Lead</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div style={{padding:'0 20px 0 0', minWidth:300}}>
                                    <Form.Item label='Gender'>
                                        <Select placeholder='Select gender' allowClear value={filterData.gender} onChange={(e) => handleFilters(e, 'gender')}>
                                            <Select.Option value='male'>Male</Select.Option>
                                            <Select.Option value='female'>Female</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div style={{padding:'0 20px 0 0', minWidth:300}}>
                                    <Form.Item label='User Added'>
                                        <DatePicker.RangePicker value={filterData.startDate ? [moment(filterData.startDate), moment(filterData.endDate)] : null} 
                                            onChange={(e) => handleFilters(e, 'date')}
                                        />
                                    </Form.Item>
                                </div>
                                <div style={{padding:'0 20px 0 0', minWidth:500}}>
                                    <Form.Item label='Package'>
                                        <Select placeholder='Select package' value={filterData.packageIds} mode='multiple' 
                                            onChange={(e) => handleFilters(e, 'packageIds')}
                                        >
                                            {packagesList.length ? 
                                                packagesList.map(pkg => 
                                                    <Select.Option key={pkg._id} value={pkg._id}>{bilingualText(pkg.name)}</Select.Option>
                                                )
                                                :
                                                null
                                            }
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div style={{padding:'0 20px 0 0', minWidth:500}}>
                                    <Form.Item label='Course'>
                                        <Select placeholder='Select course' value={filterData.courseIds} mode='multiple' 
                                            onChange={(e) => handleFilters(e, 'courseIds')}
                                        >
                                            {courseList.length ? 
                                                courseList.map(crc => 
                                                    <Select.Option key={crc._id} value={crc._id}>{crc.name}</Select.Option>
                                                )
                                                :
                                                null
                                            }
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div style={{padding:'0 20px 0 0', minWidth:300}}>
                                    <Space>
                                        <Button onClick={handleApply}>Apply</Button>
                                        <Button onClick={handleReset} icon={<RedoOutlined/>}>Reset</Button>
                                    </Space>
                                </div>
                            </div>
                            <div>
                                <Title level={4}>Sorting</Title>
                                <div style={{display:'flex', flexWrap:'wrap'}}>
                                    <div style={{padding:'0 20px 0 0', minWidth:300}}>
                                        <Form.Item label='Name'>
                                            <Radio.Group value={sortValue.sort.name} onChange={e => handleSort(e.target.value, 'name')}>
                                                <Radio.Button value={-1}>Descending</Radio.Button>
                                                <Radio.Button value={1}>Ascending</Radio.Button>
                                            </Radio.Group>
                                        </Form.Item>
                                    </div>
                                    <div style={{padding:'0 20px 0 0', minWidth:300}}>
                                        <Form.Item label='Added At'>
                                            <Radio.Group value={sortValue.sort.createdAt} onChange={(e) => handleSort(e.target.value, 'createdAt')}>
                                                <Radio.Button value={-1}>Descending</Radio.Button>
                                                <Radio.Button value={1}>Ascending</Radio.Button>
                                            </Radio.Group>
                                        </Form.Item>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <br/>
                        <TotalCountBox count={allStudents?.meta.total} title='Students'/>
                        <Divider/>
                        <Table dataSource={allStudents?.docs || []} bordered loading={getAllStudentsStatus === STATUS.FETCHING}
                            pagination={{
                                total:allStudents?.meta.total, 
                                showSizeChanger:false, 
                                current:allStudents?.meta.page, 
                                position:['topCenter', 'bottomCenter']
                            }}
                            onChange={handlePageChange}
                        >
                            <Table.Column title='SR No' render={(value, item, indx) => (allStudents?.meta.page - 1) * 10 + indx + 1}></Table.Column>
                            <Table.Column title='Name' render={d=>(
                                <Row style={{cursor:"pointer", color:'blue'}} onClick={()=>_studentProfile(d._id)}>{d.name}</Row>
                            )}></Table.Column>
                            <Table.Column title='Contact' dataIndex='contact'></Table.Column>
                            <Table.Column title='Email' dataIndex='email'></Table.Column>
                            <Table.Column title='Gender' dataIndex='gender'></Table.Column>
                            <Table.Column title='Father Name' dataIndex='fatherName'></Table.Column>
                            <Table.Column title='Mother Name' dataIndex='motherName'></Table.Column>
                            <Table.Column title='Role' dataIndex='role' render={d => <Tag color={d === 'STUDENT' ? 'green' : 'orange'}>{d}</Tag>}></Table.Column>
                            <Table.Column title='Added At' dataIndex='createdAt' width={120} render={d => moment(d).format('DD-MM-YYYY LT')}></Table.Column>
                            
                            {/* <Table.Column title='Username' dataIndex='username'></Table.Column>
                            <Table.Column title='Password' dataIndex='password'></Table.Column> */}
                        </Table>
                    </>
                :
                <Text>Something went wrong</Text>
            }
            </Card>
        </div>
    )
}