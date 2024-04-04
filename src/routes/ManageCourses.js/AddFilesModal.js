import { Form, Input, Modal } from 'antd'
import React from 'react'

export const AddFilesModal = ({visible, closeModal}) => {
    return(
        <Modal title='Add File' visible={visible} onCancel={closeModal}>
            <Form.Item label='Select File'>
                <Input type={'file'} />
            </Form.Item>
        </Modal>
    )
}