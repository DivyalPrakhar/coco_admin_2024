import { ArrowDownOutlined, EditOutlined, PlusOutlined, SearchOutlined, TagOutlined, TagTwoTone } from '@ant-design/icons'
import { Button, Card, Empty, Form, Input, Popover, Space, Tag } from 'antd'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { STATUS } from '../../Constants'
import { getTagsAction } from '../../redux/reducers/packages'
import { AddTagModal } from './AddTagModal'
import _ from 'lodash'

export const ManageTags = () => {
    const dispatch = useDispatch()

    const {getTagsStatus, receivedTags, addTagStatus, updateTagStatus} = useSelector((state) => ({
        getTagsStatus:state.packages.getTagsStatus,
        receivedTags:state.packages.tagsList,
        addTagStatus:state.packages.addTagStatus,
        updateTagStatus: state.packages.updateTagStatus
    }))

    const [addTagModal, changeAddTagModal] = useState()
    const [currentTag, changeCurrentTag] = useState()
    const [tagsList, setTagsList] = useState()

    useEffect(() => {
        dispatch(getTagsAction())
    }, [])

    useEffect(() => {
        if(getTagsStatus == STATUS.SUCCESS || addTagStatus == STATUS.SUCCESS || updateTagStatus == STATUS.SUCCESS){
            setTagsList(receivedTags)
        }
    }, [getTagsStatus, addTagStatus, updateTagStatus])

    function toTree(d, pid = null) {
        return d.reduce((r, e) => {
          if (e.parentId?._id == pid) {
            const obj = { ...e };
            const children = toTree(d, e._id);
            if (children.length) obj.childrens = children;
            r.push(obj);
          }
          return r;
        }, [])
      }

    const showAddTagModal = () => {
        changeAddTagModal(!addTagModal)
        changeCurrentTag(null)
    }

    const editTag = (data) => {
        changeCurrentTag(data)
        changeAddTagModal(!addTagModal)
    }

    const searchTag = (e) => {
        let data = tagsList
        data = _.filter(receivedTags,d => _.includes(_.lowerCase(d.name), _.lowerCase(e.search)))
        setTagsList(data)
    }

    return(
        <div>
            <CommonPageHeader title='Manage Tags'
                extra={<Button size='large' icon={<PlusOutlined/>} onClick={showAddTagModal}>Add Tag</Button>}
            />
            <br/>
            <Card loading={getTagsStatus == STATUS.FETCHING}>
                <Form onFinish={searchTag}>
                    <div style={{display:'flex'}}>
                        <Form.Item name='search'>
                            <Input allowClear placeholder='Search Tag'/>
                        </Form.Item>
                        <Button htmlType='submit' icon={<SearchOutlined/>}>Fetch</Button>
                    </div>
                </Form>
                {getTagsStatus == STATUS.SUCCESS && tagsList?.length ? 
                    <div>
                        <br/>
                        <Space wrap>
                            {tagsList.map(tg =>
                                <Popover key={tg._id} style={{zIndex:'9999', minWidth:'300px'}} placement='bottom'
                                    content={
                                        <div style={{maxWidth:'200px'}}>
                                            {tg.description ? 
                                                <div style={{textAlign:'justify'}}><b>Description:</b> {tg.description}<br/><br/></div> 
                                                : null
                                            }
                                            <div style={{textAlign:'center'}}>
                                                {tg.parentId && <div>{tg.parentId.name}<br/><ArrowDownOutlined />  </div>}
                                                <div style={{color:'#3498DB', fontWeight:'bold'}}>{tg.name}</div> 
                                                {tg.childIds?.length ? <div><ArrowDownOutlined /> <br/>{_.join(tg.childIds.map(d => d.name), ', ')}</div> : null}
                                            </div>
                                            <br/>
                                            <div style={{padding:0, textAlign:'center'}}>
                                                <Button icon={<EditOutlined/>} size='small' shape='round' type='primary' onClick={() => editTag(tg)}>Edit</Button>
                                            </div>
                                        </div>
                                    }
                                    
                                >
                                    <Tag style={{fontSize:'14px', cursor:'pointer', padding:'5px 10px'}} icon={<TagTwoTone/>}>
                                        {tg.name}
                                    </Tag>
                                </Popover>
                            )}
                        </Space>
                    </div>
                    :
                    <Empty description='no tags added'/>
                }
            </Card>
            {addTagModal && <AddTagModal visible={addTagModal} currentTag={currentTag}  closeModal={showAddTagModal}/>}
        </div>
    )
}