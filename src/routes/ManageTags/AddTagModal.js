import { Button, Drawer, Form, Input, Modal, Tag } from 'antd'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import { addTagAction, resetAddTag, updateTagAction } from '../../redux/reducers/packages'
import { SelectTagsModal } from '../ManagePackages/SelectTagsModal'
import _ from 'lodash'
import { TagTwoTone } from '@ant-design/icons'

export const AddTagModal = ({visible, closeModal, currentTag, directName}) => {
    const dispatch = useDispatch() 

    const {addTagStatus, updateTagStatus} = useSelector((state) => ({
        addTagStatus:state.packages.addTagStatus,
        updateTagStatus:state.packages.updateTagStatus,
    }))

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [tagsModal, openTagsModal] = useState('')
    const [tag, changeTag] = useState()

    useEffect(() => {
        if(currentTag){
            setName(currentTag.name)
            setDescription(currentTag.description)
            changeTag(currentTag.parentId)
        }
    }, [currentTag])

    useEffect(() => {
        if(directName){
            setName(directName)
        }
    }, [directName])

    useEffect(() => {
        if(addTagStatus === STATUS.SUCCESS){
            // closeModal()
            setName('')
            setDescription('')
            changeTag('')
            closeModal()
        }

        return () => dispatch(resetAddTag())
    }, [addTagStatus, updateTagStatus])
    
    const changeName = (e) => {
        setName(e.target.value)
    }

    const changeDescription = (e) => {
        setDescription(e.target.value)
    }

    const addTag = () => {
        const data = {name, description, removable:true, parentId:tag?._id}
        
        if(currentTag)
            dispatch(updateTagAction({...data, tagId:currentTag._id}))
        else
            dispatch(addTagAction(data))
    }

    const _tagsModal = () => {
        openTagsModal(!tagsModal)
    }

    const selectTag = (tag) => {
        changeTag(tag?.[0])
    }

    return(
        <Drawer visible={visible} width={'50%'} onClose={closeModal} okText={currentTag ? 'Update' : 'Add'} okButtonProps={{disabled:!name.length, loading:addTagStatus === STATUS.FETCHING || updateTagStatus === STATUS.FETCHING}} 
            okType='submit' onCancel={closeModal} title={currentTag ? 'Update' : 'Add New Tag'}
        >
            <Form labelCol={{span:6}} wrapperCol={{span:16}} >
                <Form.Item label='Select Parent Tag'>
                    {tag && <Tag icon={<TagTwoTone/>} style={{fontSize:'14px', cursor:'pointer', padding:'5px 10px'}} color='blue'>{tag.name}</Tag>}
                    <Button onClick={_tagsModal}>Select</Button>
                </Form.Item>
                <Form.Item label='Tag Name' required>
                    <Input name='name' value={name} placeholder='Tag Name' required onChange={changeName}/>
                </Form.Item>
                <Form.Item label='Description'>
                    <Input.TextArea name='description' placeholder='Description' value={description} onChange={changeDescription} rows={4}/>
                </Form.Item>
                <Form.Item wrapperCol={ { offset: 6, span: 16 }}>
                    <Button loading={addTagStatus === STATUS.FETCHING || updateTagStatus === STATUS.FETCHING} disabled={!name} onClick={addTag}>{currentTag ? 'Update' : 'Add'}</Button>
                </Form.Item>
            </Form>
            {tagsModal ? <SelectTagsModal selectedData={_.compact([tag])} visible={tagsModal} submitTags={selectTag} single closeModal={_tagsModal}/> : null}
        </Drawer>
    )
}