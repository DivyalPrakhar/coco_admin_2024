import { Button, Card, DatePicker, Divider, Empty, Form, Input, Select, Space, Table, Tabs, Tooltip } from 'antd'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuthUser } from '../../App/Context'
import { STATUS } from '../../Constants'
import { getAssignmentsAction, resetGetAssignments } from '../../redux/reducers/assignments'
import { getCoursesAction } from '../../redux/reducers/courses'
import { getAllProductsAction } from '../../redux/reducers/products'
import _ from 'lodash'
import Text from 'antd/lib/typography/Text'
import { addAssignmentToPkgAction, removePkgAssignmentAction, schedulePackageTestAction, updatePackageContentAction, updatePkgAssignmentAction } from '../../redux/reducers/packages'
import { ConfirmAlert } from '../../Constants/CommonAlerts'
import { CloseCircleOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons'
import moment from 'moment'
import { SelectTestForPackageModal } from './SelectTestForPackageModal'
import { SelectAssignmentModal } from './SelectAssignmentModal'
import { AssignDemoContent } from './AssignDemoContent'

export const PackageContent = ({currentPackage, contentTypes}) => {
    const dispatch = useDispatch()
    const auth = useAuthUser()

    const {course, product, packageReducer, assignments} = useSelector((state) => ({
        course:state.course,
        product:state.product,
        packageReducer:state.packages,
        assignments:state.assignments
    }))

    const [requiredContents, setRequiredContents] = useState([currentPackage.type])
    const [currentTab, changeTab] = useState('1')

    useEffect(() => {
        dispatch(getCoursesAction({instituteId:auth.staff.institute._id}))    
        dispatch(getAllProductsAction())
        dispatch(getAssignmentsAction())
        _setRequiredContents()

        return () => {
            dispatch(resetGetAssignments())
        }
    }, [])

    useEffect(() => {
        if(packageReducer.updatePkgContentStatus === STATUS.SUCCESS)
            _setRequiredContents()
    }, [packageReducer.updatePkgContentStatus])

    const _setRequiredContents = () => {
        const data = requiredContents
        if(currentPackage.courses.length){
            data.push('COURSE')
        }
        
        if(currentPackage.books.length){
            data.push('BOOK')
        }

        if(currentPackage.magazines.length){
            data.push('MAGAZINE')
        }

        if(currentPackage.drives.length){
            data.push('DRIVE')
        }

         if(currentPackage.tests.length){
            data.push('TEST')
        }

        setRequiredContents(_.uniq(data))
    }

    const assignData = (d) => {
        const data = {...d, packageId:currentPackage._id}
        dispatch(updatePackageContentAction(data))
    }

    const scheduleTest = (d) => {
        const data = {...d, packageId:currentPackage._id}
        dispatch(schedulePackageTestAction(data))
    }

    const checkContentType = (type) => {
        return _.findIndex(requiredContents, d => d == type) != -1 || currentPackage[_.lowerCase(type)+'s']?.length
    }

    const _setResuiredContent = (type) => {
        const data = [...requiredContents, type]
        setRequiredContents(data)
    }

    const _changeTab = (tab) => {
        changeTab(tab)
    }

    const loading = packageReducer.updatePkgContentStatus == STATUS.FETCHING
    return(
        <Card loading={course.getCoursesStatus == STATUS.FETCHING || product.allProductStatus == STATUS.FETCHING || assignments.getAssignmentsStatus == STATUS.FETCHING} 
            style={{border:0, minHeight:'500px'}} 
            bodyStyle={{padding:0}}
        >
            {course.getCoursesStatus == STATUS.SUCCESS && product.allProductStatus == STATUS.SUCCESS  && assignments.getAssignmentsStatus == STATUS.SUCCESS ? 
                <div>
                    <Text style={{fontWeight:'bold', fontSize:'18px'}}>Assign Content</Text>
                    <br/><br/>
                    <Tabs onChange={_changeTab} activeKey={currentTab}>
                        <Tabs.TabPane key='1' tab='Course'>
                            <CourseCard course={course} loading={loading} assignData={assignData} currentPackage={currentPackage}/>
                        </Tabs.TabPane>
                        <Tabs.TabPane key='2' tab='Book'>
                            <BookCard product={product} loading={loading} assignData={assignData} currentPackage={currentPackage}/>
                        </Tabs.TabPane>
                        <Tabs.TabPane key='3' tab='Drive'>
                            <DriveCard product={product} loading={loading} assignData={assignData} currentPackage={currentPackage}/>
                        </Tabs.TabPane>
                        <Tabs.TabPane key='4' tab='Magazine'>
                            <MagazineCard product={product} loading={loading} assignData={assignData} currentPackage={currentPackage}/>
                        </Tabs.TabPane>
                        <Tabs.TabPane key='5' tab='Assignment'>
                            <AssignmentCard assignments={assignments.assignmentsList} loading={loading} assignData={assignData} scheduleTest={scheduleTest} currentPackage={currentPackage}/>
                        </Tabs.TabPane>
                        <Tabs.TabPane key='6' tab='Test'>
                            <TestCard product={product} loading={loading} assignData={assignData} scheduleTest={scheduleTest} currentPackage={currentPackage}/>
                        </Tabs.TabPane>
                        <Tabs.TabPane key='7' tab='Demo Content'>
                            <AssignDemoContent currentPackage={currentPackage}/>
                        </Tabs.TabPane>
                    </Tabs>
                </div>
                :
                <Empty/>
            }
        </Card>
    )
}

const MagazineCard = ({product, assignData, currentPackage, loading}) => {
    const [selectedMagazines, setMagazines]  = useState([])
    
    const selectMagazines = data => {
        setMagazines(data)
    }

    useEffect(() => {
        setMagazines([])
    }, [loading])

    const _assignData = () => {
        let currentMagazineIds = _.map(currentPackage.magazines, s => s._id)
        assignData({value:_.compact([...currentMagazineIds , ...selectedMagazines]), path: 'magazines'})
    }

    const removeMagazine = (id) => {
        ConfirmAlert(() => assignData({value:id, path: 'magazines', remove: true}), 'Are you Sure?')
    }
    const magazines = product.productsData?.MAGAZINE || []
    const magazinesList = magazines.length ? (currentPackage.magazines ? _.differenceBy(magazines, currentPackage.magazines, '_id') : magazines) : []
    const assignedMagazines = currentPackage?.magazines || []
    return(
        <Card bodyStyle={{padding:'10px'}} loading={loading}>
            <div style={{background:'#E8F6F3', padding:'5px 20px'}}>
                <Text style={{fontWeight:'bold', color:'#3498DB', fontSize:'18px'}}>Magazines</Text>
            </div>
            <Divider style={{margin:'10px'}}/>
            <Form.Item label='Select Magazine'>
                <Select style={{width:'300px'}} onChange={selectMagazines} placeholder='select magazine' mode='multiple'>
                    {magazinesList.length ? magazinesList.map(prod => 
                            <Select.Option key={prod._id}>{prod.name?.en}</Select.Option>
                        ) : null
                    }
                </Select>
                <Button type='primary' disabled={selectedMagazines.length == 0} onClick={_assignData} style={{marginLeft:'10px'}}>Assign</Button>
            </Form.Item>
            <Table
                bordered 
                dataSource={assignedMagazines} 
                pagination={false} 
            >
                <Table.Column title='Name' dataIndex='name' key='name' render={d => <Text>{d?.en}</Text>}></Table.Column>
                <Table.Column title='Description' dataIndex='description' key='description' render={d => <Text>{d?.en}</Text>}></Table.Column>
                <Table.Column title='Action' key='action' align='center' render={data => <Button danger onClick={() => removeMagazine(data._id, 'magazines')}><DeleteOutlined style={{fontSize: '14px'}} /></Button>}></Table.Column>
            </Table>
        </Card>
    )
}

const DriveCard = ({product, assignData, currentPackage, loading}) => {
    const [selectedDrives, setDrives]  = useState([])
    
    const selectDrives = data => {
        setDrives(data)
    }

    useEffect(() => {
        setDrives([])
    }, [loading])

    const _assignData = () => {
        let currentDriveIds = _.map(currentPackage.drives, s => s._id)
        assignData({value:_.compact([...currentDriveIds , ...selectedDrives]), path: 'drives'})
    }

    const removeDrive = (id) => {
        ConfirmAlert(() => assignData({value:id, path: 'drives', remove: true}), 'Are you Sure?')
    }

    const drives = product?.productsData?.DRIVE || []
    const drivesList = drives.length ? (currentPackage.drives ? _.differenceBy(drives, currentPackage.drives, '_id') : drives) : []
    const assignedDrives = currentPackage?.drives || []
    return(
        <Card bodyStyle={{padding:'10px'}} style={{border:'1px solid #AEB6BF'}} loading={loading}>
            <div style={{background:'#E8F6F3', padding:'5px 20px'}}>
                <Text style={{fontWeight:'bold', color:'#3498DB', fontSize:'18px'}}>Drives</Text>
            </div>
            <Divider style={{margin:'10px'}}/>
            <Form.Item label='Select Drive'>
                <Select style={{width:'300px'}} onChange={selectDrives} placeholder='select drive' mode='multiple'>
                    {drivesList.length ? drivesList.map(prod => 
                            <Select.Option key={prod._id}>{prod.name?.en}</Select.Option>
                        ) : null
                    }
                </Select>
                <Button type='primary' disabled={selectedDrives.length == 0} onClick={_assignData} style={{marginLeft:'10px'}}>Assign</Button>
            </Form.Item>
            <Table  
                bordered 
                dataSource={assignedDrives} 
                pagination={false} 
            >
                <Table.Column title='Name' dataIndex='name' key='name' render={d => <Text>{d?.en}</Text>}></Table.Column>
                <Table.Column title='Description' dataIndex='description' key='description' render={d => <Text>{d?.en}</Text>}></Table.Column>
                <Table.Column title='Action' key='action' align='center' render={data => <Button danger onClick={() => removeDrive(data._id, 'drives')}><DeleteOutlined style={{fontSize: '14px'}} /></Button>}></Table.Column>
            </Table>
        </Card>
    )
}

const BookCard = ({product, assignData, currentPackage, loading}) => {
    const [selectedBooks, setBooks]  = useState([])
    
    const selectBook = data => {
        setBooks(data)
    }

    useEffect(() => {
        setBooks([])
    }, [loading])

    const _assignData = () => {
        let currentBookIds = _.map(currentPackage.books, s => s._id)
        assignData({value:_.compact([...currentBookIds , ...selectedBooks]), path: 'books'})
    }

    const removeBook = (id) => {
        ConfirmAlert(() => assignData({value:id, path: 'books', remove: true}), 'Are you Sure?')
    }

    const books = product?.productsData?.BOOK || []
    const booksList = books.length ? (currentPackage.books ? _.differenceBy(books, currentPackage.books, '_id') : books) : []
    const assignedBooks = currentPackage?.books || []
    return(
        <Card bodyStyle={{padding:'10px'}} style={{border:'1px solid #AEB6BF'}} loading={loading}>
            <div style={{background:'#E8F6F3', padding:'5px 20px'}}>
                <Text style={{fontWeight:'bold', color:'#3498DB', fontSize:'18px'}}>Books</Text>
                {/* {!assignedBooks.length && 
                    <Tooltip title='close'>
                        <Button danger ghost style={{float:'right', border:0}} icon={<CloseCircleOutlined style={{fontSize:'20px'}}/>}></Button>
                    </Tooltip>
                } */}
            </div>
            <Divider style={{margin:'10px'}}/>
            <Form.Item label='Select Book'>
                <Select style={{width:'300px'}} onChange={selectBook} placeholder='select book' mode='multiple'>
                    {booksList?.length ? booksList.map(prod => 
                            <Select.Option key={prod._id}>{prod.name?.en}</Select.Option>
                        ) : null
                    }
                </Select>
                <Button type='primary' disabled={selectedBooks.length == 0} style={{marginLeft:'10px'}} onClick={_assignData}>Assign</Button>
            </Form.Item>
            <Table  
                bordered 
                dataSource={assignedBooks} 
                pagination={false} 
            >
                <Table.Column title='Name' dataIndex='name' key='name' render={d => <Text>{d?.en}</Text>}></Table.Column>
                <Table.Column title='Description' dataIndex='description' key='description' render={d => <Text>{d?.en}</Text>}></Table.Column>
                <Table.Column title='Action' key='action' align='center' render={data => <Button danger onClick={() => removeBook(data._id, 'books')}><DeleteOutlined style={{fontSize: '14px'}} /></Button>}></Table.Column>
            </Table>
        </Card>
    )
}

const CourseCard = ({course, assignData, currentPackage, loading}) => {
    const [selectedCourses, setCourses]  = useState([])
    
    const selectCourse = data => {
        setCourses(data)
    }

    useEffect(() => {
        setCourses([])
    }, [loading])

    const _assignData = () => {
        let currentCourseIds = _.map(currentPackage.courses, s => s._id)
        assignData({value:_.compact([...currentCourseIds , ...selectedCourses]), path: 'courses'})
    }

    const removeCourse = (id, type) => {
        ConfirmAlert(() => assignData({value: id, path: type, remove: true}), 'Are you Sure?')
    }

    const courseList = _.differenceBy(course.courseList, currentPackage.courses, '_id')
    const assignedCourses = currentPackage.courses
    return(
        <Card bodyStyle={{padding:'10px'}} style={{border:'1px solid #AEB6BF'}} loading={loading}>
            <div style={{background:'#E8F6F3', padding:'5px 20px'}}>
                <Text style={{fontWeight:'bold', color:'#3498DB', fontSize:'18px'}}>Courses</Text>
            </div>
            <Divider style={{margin:'10px'}}/>
            <Form.Item label='Select Course'>
                <Select style={{width:'300px'}} onChange={selectCourse} placeholder='select course' mode='multiple'>
                    {courseList.length ? _.map(_.filter(courseList, s => s.isActive), crs => 
                            <Select.Option key={crs._id}>{crs.name}</Select.Option>
                        ) : null
                    }
                </Select>
                <Button type='primary' disabled={selectedCourses.length == 0} style={{marginLeft:'10px'}} onClick={_assignData}>Assign</Button>
            </Form.Item>
            <Table  
                bordered 
                dataSource={assignedCourses} 
                pagination={false} 
            >
                <Table.Column title='Name' dataIndex='name' key='name' render={d => <Text>{d}</Text>}></Table.Column>
                <Table.Column title='Description' dataIndex='description' key='description' render={d => <Text>{d}</Text>}></Table.Column>
                <Table.Column title='Action' key='action' align='center' render={data => <Button danger onClick={() => removeCourse(data._id, 'courses')}><DeleteOutlined style={{fontSize: '14px'}} /></Button>}></Table.Column>
            </Table>
        </Card>
    )
}

const AssignmentCard = ({assignments, currentPackage, loading}) => {
    const dispatch = useDispatch()

    const {addAssignmentStatus, updateAssignmentStatus, removeAssignmentStatus} = useSelector((state) => ({
        addAssignmentStatus:state.packages.addAssignmentStatus,
        updateAssignmentStatus:state.packages.updateAssignmentStatus,
        removeAssignmentStatus:state.packages.removeAssignmentStatus,
    }))

    const [selectAssignmentModal, changeSelectAssignmentModal]  = useState()
    const [assignedAssignments, changeAssignedAssignments]  = useState([])

    const _updateAssignedAssignments = () => {
        let data = currentPackage.assignments?.length ? _.intersectionBy(assignments.map(d => ({...d, assignmentId:d._id})), currentPackage.assignments, 'assignmentId') : []
        data = data.map(d => {
            let assnmnt = _.find(currentPackage.assignments,a =>  a.assignmentId == d._id)
            return  ({...d, maximumMarks:assnmnt?.maximumMarks, startDate:assnmnt?.startDate, endDate:assnmnt?.endDate})
        })
        changeAssignedAssignments(data)
    }

    useEffect(() => {
        _updateAssignedAssignments()
    }, [])

    useEffect(() => {
        if(addAssignmentStatus == STATUS.SUCCESS){
            changeSelectAssignmentModal(false)
        }

        if(addAssignmentStatus == STATUS.SUCCESS || removeAssignmentStatus == STATUS.SUCCESS){
            _updateAssignedAssignments()
        }

    }, [updateAssignmentStatus, addAssignmentStatus, removeAssignmentStatus])

    const _assignData = (assgnmnts) => {
        let data = _.differenceBy(assgnmnts, assignedAssignments, '_id')
        data = {packageId:currentPackage._id, assignments:data.map(a => ({assignmentId:a._id}))}
        dispatch(addAssignmentToPkgAction(data))
    }

    const removeAssignment = (id) => {
        const data = {packageId:currentPackage._id, assignmentId:id}
        ConfirmAlert(() => dispatch(removePkgAssignmentAction(data)), 'Are you Sure?')
    }

    const openSelectAssignmentModal = () => {
        changeSelectAssignmentModal(!selectAssignmentModal)
    }

    const changeMaxMarks = (e, id) => {
        const data = [...assignedAssignments]
        let indx = _.findIndex(data,d => d._id == id)
        data[indx].maximumMarks = e.target.value
        data[indx].edited = true
        changeAssignedAssignments(data)
    }


    const changeDate = (e, id) => {
        const data = [...assignedAssignments]
        let indx = _.findIndex(data,d => d._id == id)
        data[indx].startDate = e[0].format()
        data[indx].endDate = e[1].format()
        data[indx].edited = true
        changeAssignedAssignments(data)
    }

    const updateAssignments = (id) => {
        let data = _.find(assignedAssignments,d => d._id == id)
        data = {packageId:currentPackage._id, assignments:assignedAssignments.map(d => ({assignmentId:d._id, maximumMarks:parseInt(d.maximumMarks), startDate:d.startDate, endDate:d.endDate}))}
        dispatch(updatePkgAssignmentAction(data))
    }

    return(
        <Card bodyStyle={{padding:'10px'}} style={{border:'1px solid #AEB6BF'}} loading={loading}>
            <div style={{background:'#E8F6F3', padding:'5px 20px'}}>
                <Text style={{fontWeight:'bold', color:'#3498DB', fontSize:'18px'}}>Assignments</Text>
            </div>
            <Divider style={{margin:'10px'}}/>
            <Button type='primary' ghost onClick={openSelectAssignmentModal}>Select Assignment</Button>
            <br/><br/>
            <Table  
                bordered 
                dataSource={assignedAssignments} 
                pagination={false} 
            >
                <Table.Column title='Title' dataIndex='title' key='title' render={d => <Text>{d}</Text>}></Table.Column>
                <Table.Column title='Description' dataIndex='description' key='description' render={d => <Text>{d}</Text>}></Table.Column>
                <Table.Column title='Question Paper' dataIndex='questionPaper' key='questionPaper'
                    render={(d) => 
                        d && <a href={d} target='_black'><LinkOutlined/>attachment</a>
                    }
                ></Table.Column>
                <Table.Column title={<b>Maximum Marks</b>} dataIndex='maximumMarks' key='maximumMarks'
                    render={(d, row) => 
                        <Input type='number' min='0' value={d} onChange={(e) => changeMaxMarks(e, row._id)} placeholder='Maximum Marks'/>
                    }
                ></Table.Column>
                {/* <Table.Column title={<b>Grace Marks</b>} dataIndex='graceMarks' key='graceMarks'
                    render={(d, row) => 
                        <Input type='number' value={d} onChange={(e) => changeGraceMarks(e, row._id)} placeholder='Grace Marks'/>
                    }
                ></Table.Column> */}
                <Table.Column title={<b>Start & End Date</b>} dataIndex='startDate' key='startDate'
                    render={(d, row) => 
                        <DatePicker.RangePicker showTime clearIcon={false} value={[row.startDate ? moment(row.startDate) : null, row.endDate ? moment(row.endDate) : null]} 
                            onChange={e => changeDate(e, row._id)}
                        />
                    }
                ></Table.Column>
                <Table.Column title='Action' key='action' align='center' 
                    render={(d, row) => 
                        <Space>
                            <Tooltip title='remove' placement='right'><Button danger icon={<DeleteOutlined />} onClick={() => removeAssignment(row._id)}></Button></Tooltip>
                        </Space>
                    }
                ></Table.Column>
            </Table><br/><br/>
            <Button type='primary' size='large' style={{float:'right'}} loading={updateAssignmentStatus == STATUS.FETCHING} 
                disabled={!_.filter(assignedAssignments,d => d.edited).length} 
                onClick={() => updateAssignments()}
            >
                Update
            </Button>
            
            {selectAssignmentModal ? <SelectAssignmentModal alreadySelected={assignedAssignments} loading={addAssignmentStatus == STATUS.FETCHING} visible={selectAssignmentModal} onfinish={_assignData} closeModal={openSelectAssignmentModal}/> : null}
        </Card>
    )
}

const TestCard = ({assignData, currentPackage, loading, scheduleTest}) => {
    const []  = useState([])
    const [selectTestModal, selectTestModalChange] = useState(false)
    

    const _assignData = (data, type) => {
        let newData = _.map(data, d => {
            let findTest = _.findIndex(currentPackage?.tests, s => s.test._id === d.test)

            if(findTest != -1){
                let test = currentPackage.tests[findTest]
                d = Object.assign({}, d, {startDate: test?.startDate, endDate: test?.endDate})
            }
            return d
        })
        assignData({value:newData, path: type})
    }

    const removeTest = (data, type) => {
        ConfirmAlert(() => assignData({value:data, path: type, remove: true}), 'Are you Sure?')
    }

    useEffect(() => {
        selectTestModalChange(false)
    }, [loading])

    const changeDateRange = (e, id) => {
        let startDate = e[0]
        let endDate = e[1]

        scheduleTest({id: id, startDate: startDate, endDate: endDate})
    }

    const assignedTests = _.map(currentPackage?.tests, s => {
                                let {test, ...otherData} = s
                                return(
                                    Object.assign({}, test, {testPackageDetails: otherData})
                                )
                            })

    return(
        <Card bodyStyle={{padding:'10px'}} style={{border:'1px solid #AEB6BF'}} loading={loading}>
            <div style={{background:'#E8F6F3', padding:'5px 20px'}}>
                <Text style={{fontWeight:'bold', color:'#3498DB', fontSize:'18px'}}>Tests</Text>
            </div>
            <Divider style={{margin:'10px'}}/>
            <Button type='primary' ghost onClick={() => selectTestModalChange(true)}>Select Test</Button>
            <br/><br/>
            <Table  
                bordered 
                dataSource={assignedTests} 
            >
                <Table.Column title='Ref Id' dataIndex='referenceId' key='referenceId' render={id => <Text>{id}</Text>}/>
                <Table.Column title='Name' dataIndex='name' key='name' render={d => <Text>{d?.en}</Text>}/>
                <Table.Column title='Platform' dataIndex='testType' key='testType'/>
                <Table.Column title='Time Duration (min)' dataIndex='totalTime' key='time'/>
                <Table.Column title='Questions' key='queCont' render={d => _.size(_.flatMap(d.sections, 'questions'))}/>
                <Table.Column title='Status' dataIndex='status' key='status'/>
                <Table.Column 
                    title='Date' 
                    key='date' 
                    render={ data => {
                        let startDate = data?.testPackageDetails?.startDate ? moment(data?.testPackageDetails?.startDate) : null
                        let endDate = data?.testPackageDetails?.endDate ? moment(data?.testPackageDetails?.endDate) : null
                        return(
                            <DatePicker.RangePicker key={startDate} showTime allowClear={false} onChange={(e) => changeDateRange(e, data?.testPackageDetails?._id)} defaultValue={[startDate, endDate]}/>
                        )
                    }}
                />
                <Table.Column title='Action' key='action' align='center' 
                    render={data => <Button danger onClick={() => removeTest(data.testPackageDetails._id, 'tests')}>
                            <DeleteOutlined style={{fontSize: '14px'}} />
                        </Button>
                    }
                />
            </Table>

            {selectTestModal ? 
                <SelectTestForPackageModal preSelectedTests={_.map(currentPackage?.tests, s => s.test)} visibility={selectTestModal} closeModal={() => selectTestModalChange()} submitTestData={(data) => _assignData(data, 'tests')}/>
            : null}
        </Card>
    )
}