import { Image, Modal } from 'antd'
import React from 'react'

export const ImagePreview = ({visible, closeModal, imageUrl}) => {
    return(
        <Modal visible={visible} bodyStyle={{textAlign:'center'}} width={700} footer={null} onCancel={closeModal}>
            <Image src={imageUrl} style={{maxWidth:'1600px'}}/>
        </Modal>
    )
}