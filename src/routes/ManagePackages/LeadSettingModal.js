import { Button, Drawer, Form, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import { updatePackageAction } from '../../redux/reducers/packages'

export const LeadSettingModal = ({visible, closeModal, currentPackage}) => {
    const dispatch = useDispatch()

    const {updatePackageStatus} = useSelector(state => ({
        updatePackageStatus:state.packages.updatePackageStatus
    }))

    const [leadData, changeData] = useState({})

    useEffect(() => {
        if(currentPackage){
            const {leadDisabledDays, smsLink, smsLink2, smsLink3, smsExamName} = currentPackage
            changeData({leadDisabledDays, smsLink, smsLink2, smsLink3, smsExamName})
        }
    }, [currentPackage])

    const handleLead = (e) => {
        changeData(d => ({...d, [e.target.id]:e.target.value}))
    }

    const handleSubmit = () => {
        dispatch(updatePackageAction({ ...leadData, packageId: currentPackage._id }))
    }

    return(
        <Drawer
            width={'50%'} 
            visible={visible} 
            onClose={closeModal} 
            title={'Lead Settings'}
        >
            <Form
                onFinish={handleSubmit}
                labelCol={{span:6}}
                wrapperCol={{span:16}}
            >
                <Form.Item label="Lead Disabled Days">
                    <Input autoFocus={true} id='leadDisabledDays' placeholder='Days' type={'number'} onChange={handleLead}
                        value={leadData.leadDisabledDays}
                    />
                </Form.Item>
                <Form.Item label="SMS Exam Name" >
                    <Input
                        value={leadData.smsExamName}
                        type="text"
                        id='smsExamName'
                        placeholder="SMS Exam Name"
                        onChange={handleLead}
                    />
                </Form.Item>
                <Form.Item label="SMS Link 1">
                    <Input
                        value={leadData.smsLink}
                        type="text"
                        placeholder="SMS Link 1"
                        id='smsLink'
                        onChange={handleLead}
                    />
                </Form.Item>
                <Form.Item label="SMS Link 2">
                    <Input
                        value={leadData.smsLink2}
                        type="text"
                        placeholder="SMS Link 2"
                        id='smsLink2'
                        onChange={handleLead}
                    />
                </Form.Item>
                <Form.Item label="SMS Link 3">
                    <Input
                        value={leadData.smsLink3}
                        type="text"
                        placeholder="SMS Link 3"
                        id='smsLink3'
                        onChange={handleLead}
                    />
                </Form.Item>
                <Form.Item wrapperCol={{offset:6, span:16}}>
                    <Button loading={updatePackageStatus === STATUS.FETCHING} htmlType='submit' load>Update</Button>
                </Form.Item>
            </Form>
        </Drawer>
    )
}