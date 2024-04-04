import { DeleteTwoTone } from '@ant-design/icons'
import { Button, Card, Empty, Form, Space, Tag, Tooltip } from 'antd'
import Text from 'antd/lib/typography/Text'
import React, { useState } from 'react'
import { SelectCourseModal } from '../../components/SelectCourseModal'
import { SelectPackageModal } from '../../components/SelectPackageModal'
import _ from 'lodash'

export const ScheduleTest = () => {
    let [showCourseModal, changeShowCourseModal] = useState()
    let [showPackageModal, changeShowPackageModal] = useState()
    const [selectedCourses, setSelectedCourses] = useState([])
    const [selectedPackages, setSelectedPackages] = useState([])

    const _changeShowCourseModal = () => {
        changeShowCourseModal(!showCourseModal)
    }

    const _changeShowPackageModal = () => {
        changeShowPackageModal(!showPackageModal)
    }

    
    const submitCourses = (data) => {
        setSelectedCourses(data)
    }

    const submitPackages = (data) => {
        setSelectedPackages(data)
    }

    const removeCourse = (id) => {
        let data = [...selectedCourses]
        _.remove(data,d => d._id == id)
        setSelectedCourses(data)
    }

    const removePackage = (id) => {
        let data = selectedPackages
        _.remove(data,d => d._id == id)
        setSelectedPackages(data)
    }

    return(
        <div style={{padding:'20px'}}>
            <br/>
            <Space size={40}>
                <Form.Item label={<b>Select Course</b>}>
                    <Button onClick={_changeShowCourseModal}>Select</Button>
                </Form.Item>
                <Form.Item onClick={_changeShowPackageModal} label={<b>Select Package</b>}>
                    <Button>Select</Button>
                </Form.Item>
            </Space>
            <br/>
            <Card title={<Text style={{color:'#3498DB', fontSize:'20px'}}>Courses</Text>} bodyStyle={{padding:'10px'}}>
                <div style={{display:'flex', flexWrap:'wrap'}}>
                    {selectedCourses.length ? 
                        selectedCourses.map(course => 
                            <Card style={{width:'400px', margin:'10px'}} key={course._id} title={<b>{course.name}</b>} bodyStyle={{padding:'10px'}}
                                extra={<Tooltip title='Remove'>
                                        <Button onClick={() => removeCourse(course._id)} icon={<DeleteTwoTone twoToneColor='#eb2f96'/>}></Button>
                                    </Tooltip>
                                }
                            >
                                {course.description}
                            </Card>
                        )
                        :
                        <Text style={{color:'#85929E'}}>Not assigned to any course</Text>
                    }
                </div>
            </Card>
            <Card style={{marginTop:'10px'}} title={<Text style={{color:'#3498DB', fontSize:'20px'}}>Packages</Text>} bodyStyle={{padding:'10px'}}>
                <div style={{display:'flex', flexWrap:'wrap'}}>
                    {selectedPackages.length ?
                        selectedPackages.map(pkg =>
                            <Card style={{width:'400px', margin:'10px'}} key={pkg._id} title={<b>{pkg.name.en}</b>} bodyStyle={{padding:'10px'}}
                                extra={<Tooltip title='Remove'>
                                        <Button onClick={() => removePackage(pkg._id)} icon={<DeleteTwoTone twoToneColor='#eb2f96'/>}></Button>
                                    </Tooltip>
                                }
                            >
                                {pkg.description.en}
                            </Card>
                        )
                        :
                        <Text style={{color:'#85929E'}}>Not assigned to any package</Text>
                    }
                </div>
            </Card>
            {showCourseModal ? <SelectCourseModal visible={showCourseModal} submitCourses={submitCourses} closeDrawer={_changeShowCourseModal}/> : null}
            {showPackageModal ? <SelectPackageModal visible={showPackageModal} submitPackages={submitPackages} closeDrawer={_changeShowPackageModal}/> : null}
        </div>
    )
}