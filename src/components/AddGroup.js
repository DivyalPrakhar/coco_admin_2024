import { Button, Drawer, Form, Input } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../Constants'
import { addGroupAction, updateGroupAction } from '../redux/reducers/instituteStaff'
import _ from 'lodash'

export const AddGroup = ({visible, closeDrawer, group}) => {
    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const { instituteId, institute } = useSelector((state) => ({
        instituteId:state.user.user.staff.institute._id,
        institute:state.instituteStaff
    }))

    useEffect(() => {
        if(institute.addGroupStatus == STATUS.SUCCESS){
            form.resetFields()
        }
    }, [institute.addGroupStatus])

    const submitForm = (data) => {
        if(group){
            data = {...data, id:group.id}
            dispatch(updateGroupAction(_.omit(data, ['instituteId'])))
        }
        else
            dispatch(addGroupAction(data))
    }

    return(
        <Drawer title='Add Group' width='50%' visible={visible} onClose={closeDrawer}>
            <Form form={form} layout='vertical' onFinish={submitForm} key={group?.id}>
                <Form.Item name='name' required label='Group Name'>
                    <Input type='text' defaultValue={group?.name} autoFocus required/>
                </Form.Item>
                <Form.Item name='instituteId' initialValue={instituteId} hidden>
                    <Input type='text'/>
                </Form.Item>
                <Form.Item name='description' label='Description'>
                    <Input.TextArea type='text' defaultValue={group?.description}/>
                </Form.Item>
                <Form.Item>
                    <Button htmlType='submit' 
                        loading={institute.addGroupStatus == STATUS.FETCHING || institute.updateGroupStatus == STATUS.FETCHING}
                    >
                        {group ? 'Update' : 'Add'}
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    )
}