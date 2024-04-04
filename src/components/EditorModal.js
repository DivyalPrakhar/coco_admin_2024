import { Button, Form, Modal } from 'antd'
import React, { useState } from 'react'
import { CkeditorComponent } from './CkeditorComponent'
import { BlogEditor } from './TinymceEditor'

export const EditorModal = ({title, visible, closeModal, onSubmit, defaultValue, currentLanguage}) => {
    const [content, setContent] = useState(defaultValue)

    const _changeContent = (e) => {
        setContent(e.data)
    }

    const submitForm = () => {
        onSubmit(content)
        closeModal()
    }

    const handleChange = (e) => {
        setContent(e)
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
            <BlogEditor
                onChange={handleChange}
                value={content || null}
            />
            {/*<CkeditorComponent onChange={_changeContent} defaultValue={defaultValue}/>*/}
        </Modal>
    )
}