import { Button, Form, Modal } from 'antd'
import React, { useState } from 'react'
import { CkeditorComponent } from './CkeditorComponent'

export const CkeditorModal = ({title, visible, closeModal, onSubmit, defaultValue, currentLanguage}) => {
    const [content, setContent] = useState(defaultValue)

    const _changeContent = (e) => {
        setContent(e.data)
    }

    const submitForm = () => {
        onSubmit(content)
        closeModal()
    }

    return(
        <Modal visible={visible} close width={1300} onCancel={closeModal} title={title || 'Editor'}
            footer={[
                <Button key="cancel" onClick={closeModal}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={submitForm}>
                    Submit
                </Button>,
            ]}
        >   
            <CkeditorComponent id='ckeditorModal' language={currentLanguage === 'english' ? 'pramukhime:english' : 'pramukhindic:hindi'} name={'ckeditorModalData'} defaultData={content || defaultValue} onChangeData={(data) => _changeContent(data)}/>
            {/*<CkeditorComponent onChange={_changeContent} defaultValue={defaultValue}/>*/}
        </Modal>
    )
}