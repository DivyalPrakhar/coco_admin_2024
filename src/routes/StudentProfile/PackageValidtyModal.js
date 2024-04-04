import { Button, DatePicker, Drawer, Form, Input, Modal } from 'antd'
import { isEmpty } from 'lodash'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import { updateStudentPackageAction } from '../../redux/reducers/student'

export const PackageValidtyModal = ({visible, closeModal, packageDetails, student}) =>{
    const dispatch = useDispatch()

    const {updateStatus} = useSelector(state => ({
        updateStatus:state.student.updateStudentPackageStatus
    }))

    const [validityData, changeData] = useState({})

    useEffect(() => {
        if(packageDetails?.validity && !isEmpty(packageDetails.validity)){
            changeData(packageDetails.validity)
        }
    }, [packageDetails])

    const changeValue = (key, value) => {
        changeData(d => ({...d, [key]:value}))
    }

    const handleSave = () => {
        const data = {packageId:packageDetails?._id, studentId:student._id, validity:validityData}
        dispatch(updateStudentPackageAction(data))
    }

    return(
        <Drawer width={'40%'} title='Package Validity' visible={visible}  onClose={closeModal}>
            <Form labelCol={{ span: 6 }} onFinish={handleSave} wrapperCol={{ span: 16 }}>
                <Form.Item label='Expiry Date'
                    rules={[{ message: 'Please select date.', required: true }]}
                    name={'expiryDate'}
                >
                    <DatePicker format={'DD-MM-YYYY'} value={validityData.date ? moment(validityData.date) : null} onChange={e => changeValue('date', e)}/>
                </Form.Item>
                <Form.Item label='Remark'>
                    <Input.TextArea rows={4} placeholder='remark' value={validityData.remark} onChange={e => changeValue('remark', e.target.value)} />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 6 }}>
                    <Button htmlType='submit' loading={updateStatus === STATUS.FETCHING}>Save</Button>
                </Form.Item>
            </Form>
        </Drawer>
    )
}