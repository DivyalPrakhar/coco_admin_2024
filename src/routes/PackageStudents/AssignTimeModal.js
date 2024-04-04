import { Form, Input, Modal } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ExportExcel } from '../../components/ExportExcel'
import { STATUS } from '../../Constants'
import { uploadStudentRollNoAction } from '../../redux/reducers/packages'
import { sheetToJSON } from '../../utils/FileHelper'

export const AssignTimeModal = ({ visible, closeModal, studentsData, packageId }) => {
    const dispatch = useDispatch()

    const { uploadStudentTimingStatus, uploadStudentRollNoStatus } = useSelector(state => ({
        uploadStudentTimingStatus: state.packages.uploadStudentTimingStatus,
        uploadStudentRollNoStatus: state.packages.uploadStudentRollNoStatus
    }))
    const [excelData, onSave] = useState([])


    const _upload = () => {
        let data = { packageId: packageId, data: excelData.map(d => ({id:d.id, centerCode:d.centerCode, timing:d.timing, "finalRoll": d.rollNumber, userId:d.userId})) }
        // dispatch(uploadStudentTimingAction(data))
        dispatch(uploadStudentRollNoAction(data))
        
    }

    const selectFile = (e) => {
        sheetToJSON(e.target.files, onSave)
    }

    console.log({studentsData})
    const excelFields = studentsData.map(d => ({ id: d._id, userId:d.user._id, name: d.user.name, assignedOn:moment(d.packages?.assignedOn).format('DD-MM-YYYY'), centerName: d.packages?.center?.name, centerCode: d.packages?.center?.code, timing: '', rollNumber: d.rollNumber?.finalRoll }))

    console.log('excelData', excelData)
    return (
        <Modal width={600} title='Assign Roll Number / Time Slot' okText='Upload' visible={visible} onCancel={closeModal}
            onOk={_upload} okButtonProps={{ loading: uploadStudentRollNoStatus === STATUS.FETCHING, disabled: !excelData.length }}
        >
                <Form.Item label='Download Sample'>
                    <ExportExcel title={'Download'} data={excelFields} />
                </Form.Item>
                <Form.Item required label='Select Excel' >
                    <Input accept='.xlsx, .xls, .csv' onChange={selectFile} type='file' />
                </Form.Item>
        </Modal>
    )
}