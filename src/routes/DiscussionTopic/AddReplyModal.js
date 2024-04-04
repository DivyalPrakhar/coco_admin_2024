import { Modal } from 'antd'
import React from 'react'
import { CommentBox } from './CommentsModal'

export const AddReplyModal = ({ visible, closeModal, ...rest }) => {
    return(
        <Modal title='Reply' width={1000} visible={visible} footer={false} onCancel={closeModal}>
            <CommentBox {...rest} />
        </Modal>
    )
}