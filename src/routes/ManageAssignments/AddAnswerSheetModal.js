import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, Upload } from 'antd'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BaseURL } from '../../BaseUrl'
import { STATUS } from '../../Constants'
import { addAnswerSheetAction, resetAddSheetStatus } from '../../redux/reducers/assignments'

export const AddAnswerSheetModal = ({visible, closeModal}) => {
    const dispatch = useDispatch()

    const {addAnswerSheetStatus} = useSelector((state) => ({
        addAnswerSheetStatus:state.assignments.addAnswerSheetStatus
    }))

    const [title, changeTitle] = useState()
    const [file, changeFile] = useState()

    useEffect(() => {
        return () => dispatch(resetAddSheetStatus())
    }, [])

    useEffect(() => {
        if(addAnswerSheetStatus === STATUS.SUCCESS)
            closeModal()
    }, [addAnswerSheetStatus])

    const _changeTitle = (e) => {
        changeTitle(e.target.value)
    }

    const _changeFile = (e) => {
        changeFile(e.file?.response?.url)
    }

    const removeFile = () => {
        changeFile(null)
    }

    const saveAnswerSheet = () => {
        let data = {title, file}
        dispatch(addAnswerSheetAction(data))
    }

    return(
        <Modal title='Add Answer Sheet' okText='Add' width={700} confirmLoading={addAnswerSheetStatus === STATUS.FETCHING} okButtonProps={{disabled:!title || !file}} onOk={saveAnswerSheet} visible={visible} onCancel={closeModal}>
            <Form labelCol= {{span: 6}} wrapperCol= {{span: 16}}>
                <Form.Item label='Title' required>
                    <Input placeholder='title' onChange={_changeTitle}/>
                </Form.Item>
                <Form.Item label='Select File' required>
                    <Upload maxCount={1} action={BaseURL+"app/image"} onChange={_changeFile} onRemove={removeFile}>
                        <Button icon={<UploadOutlined/>}>Upload</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    )
}

