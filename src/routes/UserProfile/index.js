import { Button, Card, Form, Input, Modal, Select } from 'antd'
import React, { useEffect, useReducer, useState } from 'react'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { useDispatch, useSelector } from 'react-redux';
import { RoleType, STATUS } from '../../Constants';
import _ from 'lodash'
import { UploadImageBox } from '../../components/UploadImageBox';
import { FormReducer } from '../../utils/FormReducer';
import {editInstituteStaffAction} from '../../redux/reducers/instituteStaff'
import { updateCurrentUser, updatePassAction } from '../../redux/reducers/user';
import { useAuthUser } from '../../App/Context';

export const UserProfile = () => {
    const dispatch = useDispatch()

    const {user, updateUserStatus, updatePassStatus} = useSelector((state) => ({
        user:state.user.user,
        updateUserStatus:state.user.updateUserStatus,
        updatePassStatus:state.user.updatePassStatus
    }))

    const initialData = {}
    const [userDetails, changeDetails] = useReducer(FormReducer, initialData)
    const [updated, setUpdate] = useState(0)
    const [changePassStatus, changePass] = useState()

    useEffect(() => {
        if(updatePassStatus === STATUS.SUCCESS)
            changePass(false)
    }, [updatePassStatus])

    useEffect(() => {
        if(user){
            let {name, email, avatar, contact, username, password} = user
            changeDetails({type:'reset', value:{name, email, avatar, username, password, contact, code:user.staff.code}})
            setUpdate(updated+1)
        }
    }, [user])

    let selectFormData = (value, type) => {
        changeDetails({type, value})
    }

    const changeProfile = (e) => {
        changeDetails({type:'avatar', value:e?.file?.response?.url || null})
    }

    const updateUser = () => {
        let data = {id:user._id, ...userDetails}
        dispatch(updateCurrentUser(data))
    }

    const hanldeChangePass = () => {
        changePass(d => !d)
    }

    return(
        <div>
            <CommonPageHeader
                title='User Profile'
            />
            <br/>
            <Card>
                <Form key={updated}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    size='large'
                    onFinish={updateUser}
                >
                    <Form.Item label="Student Image">
                        <UploadImageBox ratio={'1:1'} onRemove={changeProfile} getImage={changeProfile} defaultImg={userDetails.avatar}/>
                    </Form.Item>
                    <CustomInput label="Name" rules={[{ required: true, message: 'Please fill in the field.' }]} name='name' 
                        placeholder='Name' value={userDetails.name} onChange={e => selectFormData(e.target.value, 'name')}
                    />
                    <CustomInput label="Contact" rules={[{required:true, message:'Please fill in the field'}, { pattern:'^[5-9][0-9]{9}$', message:'Enter valid contact number'}]} name='contact' type='number' 
                        placeholder='Contact' value={userDetails.contact} onChange={e => selectFormData(e.target.value, 'contact')}
                    />
                    <CustomInput label="Email" onChange={e => selectFormData(e.target.value, 'email')} name='email' type='email' value={userDetails.email} placeholder='Email'/>
                    <CustomInput label="Username" onChange={e => selectFormData(e.target.value, 'username')} name='username' type='text' value={userDetails.username} placeholder='Username'/>
                    <Form.Item label="Password">
                        <Button onClick={hanldeChangePass}>Change Password</Button>
                    </Form.Item>

                    {/* <CustomInput label="Code" onChange={e => selectFormData(e.target.value, 'code')} name='code' value={userDetails.code} placeholder='Code'/> */}
                    <Form.Item wrapperCol={ {offset: 4}}>
                        <Button type="primary" loading={updateUserStatus === STATUS.FETCHING} shape='round' htmlType="submit">
                            Update
                        </Button>
                    </Form.Item>
                </Form>
                <br/>
            </Card>
            {changePassStatus ? <ChangePassModal visible={changePassStatus} closeModal={hanldeChangePass} /> : null}
        </div>
    )
}

const ChangePassModal = ({visible, closeModal}) => {
    const user = useAuthUser()
    const [passData, changePassData] = useState({})
    const dispatch = useDispatch()
    const [passConfirmed ,setPassConfirmed] = useState(false)

    const {updatePassStatus} = useSelector(state => ({
        updatePassStatus:state.user.updatePassStatus
    }))

    // useEffect(() => {
    //     if(passData.newPass && passData.confirmPass === passData.newPass)
    //         setPassConfirmed(true)
    //     else if(passConfirmed)
    //         setPassConfirmed(false)

    // }, [passData.confirmPass, passData.newPass])

    const handleUpdate = () => {
        let data = {newPassword: passData.newPass, currentPassword:passData.currentPass}

        if(passData.newPass === passData.confirmPass){
            dispatch(updatePassAction(data))   
            // setPassConfirmed(true)
        }
        // else
        //     setPassConfirmed(false)
    }

    useEffect(() => {
        if(passData.confirmPass && passData.confirmPass === passData.newPass)
            setPassConfirmed(true)
        else if(passData.confirmPass && passData.confirmPass !== passData.newPass)
            setPassConfirmed(false)
    }, [passData])
    
    const handleChange = (e) => {
        changePassData(d => ({...d, [e.target.id]:e.target.value}))
    }

    return <Modal title='Reset Password' onCancel={closeModal} visible={visible} footer={false}>
                <Form
                    onFinish={handleUpdate}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                >
                    {/* <Form.Item label='Current Password' required rules={[{required:true, message:'Please fill in the field.'}]} name='current'>
                        <Input placeholder='Current Password' onChange={handleChange} id='currentPass' value={passData.currentPass} />
                    </Form.Item> */}
                    <Form.Item label='New Password' required rules={[{required:true, message:'Please fill in the field.'}]} name='new'>
                        <Input placeholder='New Password' onChange={handleChange} id='newPass' value={passData.newPass}/>
                    </Form.Item>
                    <Form.Item required label='Confirm Password' name='confirm' value={passData.confirmPass}
                        rules={[{required:true, message:'Please fill in the field.'}]}
                        validateStatus={passConfirmed ? 'success' : 'error'}
                    >
                        <Input hasFeedback placeholder='Confirm Password' onChange={handleChange} id='confirmPass'/>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button loading={updatePassStatus === STATUS.FETCHING} type='primary' htmlType='submit' >Reset</Button>
                    </Form.Item>
                </Form>
            </Modal>
} 

const CustomInput = ({label, required, name, placeholder, type, rules, hidden, value, onChange}) => {
    return(
        <Form.Item label={label} hidden={hidden} rules={rules} initialValue={value} name={name}>
            <Input placeholder={placeholder} onChange={onChange} type={type || 'text'}/>
        </Form.Item>
    )
}