import { Button, Form, Input, Modal, Space, Table } from 'antd'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ExportExcel } from '../../components/ExportExcel'
import { STATUS } from '../../Constants'
import { addSubjectExcelAction, resetSubjectExcelUpload } from '../../redux/reducers/LmsConfig'
import { sheetToJSON } from '../../utils/FileHelper'

export const AddSubjectsModal =({visible, closeModal} ) => {
    const dispatch = useDispatch()

    const {addSubjectExcelStatus} = useSelector(state => ({
        addSubjectExcelStatus:state.lmsConfig.addSubjectExcelStatus
    }))

    const [subjectExcel, setSubjectExcel] = useState()
    const [excelData, onSave] = useState([])

    useEffect(() => {
        return () => dispatch(resetSubjectExcelUpload())
    },[])

    useEffect(() => {
        if(addSubjectExcelStatus == STATUS.SUCCESS)
            closeModal()
    }, [addSubjectExcelStatus])
	const _changeSubjectExcel = (e) => {
        sheetToJSON(e.target.files, onSave)
		setSubjectExcel(e.target.files[0])
	}

	const uploadSubjectExcel = () => {
        let data = excelData
        if(data.length)
            data = _.filter(data,d => d.englishName || d.hindiName)

        data = data?.length ? data.map(d => ({name:{en:d.englishName, hn:d.hindiName}, shortName:d.shortName})) : []
		
        dispatch(addSubjectExcelAction(data))
	}

    const data = [{
        englishName:'',
        hindiName:'',
        shortName:''
      }]

    return(
        <Modal title='Upload Subjects Excel' confirmLoading={addSubjectExcelStatus == STATUS.FETCHING} width={900} okText='Add' 
            onOk={uploadSubjectExcel} visible={visible} onCancel={closeModal}
            // okButtonProps={{disabled:!excelData?.englishName && !excelData?.hindiName}}
        >
            <Form.Item label={<b>Download Excel</b>}>
                <ExportExcel data={data} title='Subjects Excel' filename='SubjectsList'/>
            </Form.Item>
            <Form.Item label={<b>Select File</b>}>
                <Input type='file' value={excelData && null} accept=".xlsx, .xls, .csv" onChange={_changeSubjectExcel}/>
            </Form.Item>
            <br/>
            {excelData?.length ? 
                <Table bordered dataSource={excelData}>
                    <Table.Column title='Name (English)' dataIndex='englishName'/>
                    <Table.Column title='Name (Hindi)' dataIndex='hindiName'/>
                    <Table.Column title='Short Name' dataIndex='shortName'/>
                </Table>
                :
                null
            }
        </Modal>
    )
}