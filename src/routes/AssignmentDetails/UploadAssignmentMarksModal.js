import { Button, Form, Input, Modal, Table } from 'antd'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ExportExcel } from '../../components/ExportExcel'
import { STATUS } from '../../Constants'
import { assingmentMarksAction } from '../../redux/reducers/assignments'
import { sheetToJSON } from '../../utils/FileHelper'

export const UploadAssignmentMarksModal = ({visible, closeModal, assignment}) => {
    const dispatch = useDispatch()
    const {assingmentMarksStatus} = useSelector(state => ({
        assingmentMarksStatus:state.assignments.assingmentMarksStatus
    }))

    const [marksData, saveData] = useState([])

    const data = [{rollNumber:'', marks:''}]

    const handleChangeFile = (e) => {
        sheetToJSON(e.target.files, handleExcelData)
    }

    const handleExcelData = (excelData) => {
        let data =  excelData?.length ? excelData.map(d => ({finalRoll:d.rollNumber, result:parseFloat(d.marks)})).filter(d => d.finalRoll && (d.result || d.result === 0)) : []
        saveData(data)
    }

    const handleUpload = () => {
        let data = {assignmentId:assignment._id, data:marksData}
        dispatch(assingmentMarksAction(data))
    }

    return(
        <Modal width={600} okText='Upload' title='Upload Marks' visible={visible} onOk={handleUpload} onCancel={closeModal}
            okButtonProps={{loading:assingmentMarksStatus === STATUS.FETCHING, disabled:!marksData?.length}}
        >
            <Form.Item label='Download Excel'>
                <ExportExcel filename={assignment?.title+'-marks'} title='Download' data={data} />
            </Form.Item>
            <Form.Item label='Select File'>
                <Input type={'file'} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                    onChange={handleChangeFile} 
                />
            </Form.Item>
            {marksData?.length ?
                <Table dataSource={marksData} pagination={{position:['topCenter', 'bottomCenter']}} size='small'>
                    <Table.Column dataIndex={'finalRoll'} title='Roll Number' />
                    <Table.Column dataIndex={'result'} title='Marks' />
                </Table>
                :
                null
            }
        </Modal>
    )
}