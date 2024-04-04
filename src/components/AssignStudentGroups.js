import { Button, Drawer, Form, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { assignGroupsAction } from '../redux/reducers/student'
import _ from 'lodash'

export const AssignStudentGroups = ({visible, groups, currentStudent, closeDrawer, assignedGroups}) => {
    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const [selectedGroups, selectGroups] = useState([])

    const {student} = useSelector((state) => ({
        student:state.student
    }))

    useEffect(() => {
        if(student.assignGroupsStatus)
            closeDrawer()
    }, [student.assignGroupsStatus])

    const assignGroups = () => {
        dispatch(assignGroupsAction({groupIds:selectedGroups, memberIds:[currentStudent.id]}))
    }

    const _selectGroups = (groups) => {
        selectGroups(groups)
    }
    
    return(
        <Drawer title='Add Group' width='40%' visible={visible} onClose={closeDrawer}>
            <Form layout='vertical' onFinish={assignGroups} size='large' form={form}>
                <Form.Item label='Select Groups' required>
                <Select mode="multiple" allowClear onChange={_selectGroups} placeholder="select groups"
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {_.differenceBy(groups, assignedGroups, 'id').map(grp => 
                        <Select.Option key={grp.id} value={grp.id}>{grp.name}</Select.Option>
                    )}
                </Select>
                </Form.Item>
                <Form.Item>
                    <Button htmlType='submit'>Assign</Button>
                </Form.Item>
            </Form>
        </Drawer>
    )
}