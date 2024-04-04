import React, { useEffect, useState } from 'react'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { addCategory, addCategoryAction, getCategory, getCategoryAction, updateCategoryAction } from '../../redux/reducers/instituteStaff'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, Form, Input, Modal, Space, Tag, Typography } from 'antd'
import { STATUS } from '../../Constants'
import Text from 'antd/lib/typography/Text'
import { EditOutlined, HighlightOutlined, PlusOutlined } from '@ant-design/icons'

export const Category = () => {
    const dispatch = useDispatch()

    const {allCategory, getCategoryStatus, updateCategoryStatus, addCategoryStatus} = useSelector(state => ({
        allCategory:state.instituteStaff.allCategory,
        getCategoryStatus:state.instituteStaff.getCategoryStatus,
        updateCategoryStatus:state.instituteStaff.updateCategoryStatus,
        addCategoryStatus:state.instituteStaff.addCategoryStatus
    }))

    const [category, setName] = useState()
    const [updateModal, openUpdateModal] = useState()

    useEffect(() => {
        if(addCategoryStatus === STATUS.SUCCESS)
            setName('')
    }, [addCategoryStatus])

    useEffect(()=>{
        dispatch(getCategoryAction())
    }, [dispatch])

    useEffect(() => {
        if(updateCategoryStatus === STATUS.SUCCESS)
            openUpdateModal(false)
    }, [updateCategoryStatus])
    
    const inputHandler = (e) => {
        setName(e.target.value)
    }
    
    const handleSubmit = () => {
        dispatch(addCategoryAction({name:category}))
    }

    const handleUpdate = (obj) => {
        openUpdateModal(obj)
    }

    console.log('getCategoryStatus', allCategory)
    return (
        <>
            <CommonPageHeader title='Manage Category' />
            <br/>
            <Card styupdateCategoryStatusle={{minHeight:600}} loading={getCategoryStatus === STATUS.FETCHING}>
                <Form onFinish={handleSubmit}>
                    <Form.Item>
                        <Space>
                            <Input id="category" type="text" placeholder="Add Category" value={category} onChange={inputHandler} />
                            <Button disabled={!category} htmlType="submit" icon={<PlusOutlined />}>Add</Button>
                        </Space>
                    </Form.Item>
                </Form>
                <br/>
                {allCategory?.length ? 
                    <div>
                        <Space wrap='wrap'>
                            {allCategory.map(cat => 
                                <>
                                    <Tag style={{padding:'4px 9px', fontSize:15, cursor:'pointer'}} key={cat._id} icon={<EditOutlined />} onClick={() => handleUpdate(cat)}>
                                        {cat.name}
                                    </Tag>
                                    {/* <div key={cat._id} style={{padding:'0 10px', borderRight:'1px solid #CCD1D1'}}>
                                        <Typography.Paragraph 
                                            style={{fontSize:15}}
                                            editable={{ 
                                                onChange: (e) => inputHandler(e, cat._id),
                                                tooltip: 'click to update category', 
                                                onEnd:handleUpdate,
                                            }}
                                        >
                                            {cat.name}
                                        </Typography.Paragraph>
                                    </div> */}
                                </>
                            )}
                        </Space>
                    </div>
                    :
                    <Text>No Categories Available</Text>
                }
                {updateModal ? <UpdateModal visible={updateModal} defaultData={updateModal} closeModal={() => openUpdateModal(false)}/> : null}
            </Card>
        </>
    )
}

const UpdateModal = ({visible, closeModal, defaultData}) => {
    const dispatch = useDispatch()

    const updateCategoryStatus = useSelector(state => state.instituteStaff.updateCategoryStatus)

    const [categoryName, changeName] = useState()

    useEffect(() => {
        changeName(defaultData.name)
    }, [defaultData])

    const handleUpdate = () => {
        if(categoryName)
            dispatch(updateCategoryAction({name:categoryName, id:defaultData._id}))
    }

    const handleChange = (e) => {
        changeName(e.target.value)
    }

    return(
        <Modal visible={visible} title='Update' onCancel={closeModal}
            okText='Update' okButtonProps={{htmlType:'submit', disabled:!categoryName, loading:updateCategoryStatus === STATUS.FETCHING}}
            onOk={handleUpdate}
        >
            <Form onFinish={handleUpdate}>
                <Form.Item label='Name'>
                    <Input onChange={handleChange} value={categoryName} placeholder='Category Name'/>
                </Form.Item>
            </Form>
        </Modal>
    )
}