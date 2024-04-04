import { EditOutlined, PlusOutlined, TeamOutlined, UsergroupDeleteOutlined } from '@ant-design/icons'
import { Button, Card, Col, Descriptions, Empty, List, Modal, Row } from 'antd'
import Text from 'antd/lib/typography/Text'
import Title from 'antd/lib/typography/Title'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { AddGroup } from '../../components/AddGroup'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { STATUS } from '../../Constants'
import { deleteGroupAction, getSingleInstituteAction } from '../../redux/reducers/instituteStaff'
import _ from 'lodash'

export const ManageGroups = () => {
    const dispatch = useDispatch()
    const params = useParams()
    const history = useHistory()
    const { instituteId, institute } = useSelector((state) => ({
        instituteId:state.user.user.staff.institute._id,
        institute:state.instituteStaff
    }))

    const [addGroupDrawerVisible, setAddGroupDrawerVisible] = useState(false)
    const [selectedGroup, selectGroup] = useState('')

    useEffect(() => {
        if(institute.deleteGroupStatus == STATUS.SUCCESS)
            history.push('/manage-groups')    
    }, [institute.deleteGroupStatus])

    useEffect(() => {
        if(params.id)
            selectGroup(_.find(institute.singleInstitute?.groups,grp => grp.id == params.id))
        else
            selectGroup(null)
    },[params.id, institute.getStatus, institute.updateGroupStatus])

    useEffect(() => {
        dispatch(getSingleInstituteAction({id:instituteId}))
    }, [])

    return(
        <>
            <CommonPageHeader
                title='Manage Groups'
                extra={[<Button onClick={() => setAddGroupDrawerVisible(true)} size='large' icon={<PlusOutlined />}> Add Group</Button>]}
            />
            
            <AddGroup visible={addGroupDrawerVisible} closeDrawer={() => setAddGroupDrawerVisible(false)}/>
            <br/>
            <Card loading={institute.getStatus == STATUS.FETCHING}>
                {institute.getStatus == STATUS.SUCCESS && institute.singleInstitute.groups.length ?
                    <Row>
                        <Col span={6}> 
                            <ListGroups selectedGroup={selectedGroup} groups={institute.singleInstitute.groups}/>
                        </Col>
                        <Col span={18} style={{padding:'0 20px'}}>
                            {selectedGroup ? 
                                <GroupInfo institute={institute} group={selectedGroup}/>
                                : null
                            }
                        </Col>
                    </Row>
                    :
                    <Empty description='No Groups' />
                }
            </Card>
        </>
    )
}

const GroupInfo = ({group, institute}) => {
    const dispatch = useDispatch()

    const [modal, contextHolder] = Modal.useModal()
    const [visible, setVisible] = useState(false)

    const config = {
        title:'Are you Sure ?',
        onOk:() => deleteGroup()
    }

    const deleteGroup = () => {
        dispatch(deleteGroupAction({id:group.id}))
    }

    const _updateGroup = () => {
        setVisible(true)
    }

    return(
        <>
            <Descriptions title='Group Info' bordered 
                extra={[
                    <Button onClick={_updateGroup} style={{marginRight:'10px'}} icon={<EditOutlined />}>
                        Update
                    </Button>,
                    <Button onClick={() => modal.confirm(config)} loading={institute.deleteGroupStatus == STATUS.FETCHING} danger icon={<UsergroupDeleteOutlined />}>
                        Delete
                    </Button>
                ]}
            >
                <Descriptions.Item label='Name'>{group.name}</Descriptions.Item>
                <Descriptions.Item label='Description'>{group.description || '-'}</Descriptions.Item>
            </Descriptions>
            
            {contextHolder}

            <AddGroup visible={visible} group={group} closeDrawer={() => setVisible(false)}/>
        </>
    )
}

const ListGroups = ({groups, selectedGroup}) => {
    const history = useHistory()

    return(
        <>
            <div style={{maxHeight:'500px', overflow:'auto'}}>
                <List
                    header={<Title level={4}>Groups</Title>}
                    bordered
                    itemLayout="horizontal"
                    dataSource={groups}
                    renderItem={item => {
                        const selected = selectedGroup &&  item.id == selectedGroup.id
                        return(
                            <List.Item style={{cursor:'pointer'}} onClick={() => history.push('/manage-groups/'+item.id)} className={selected && 'listItemBg'}>
                                <List.Item.Meta
                                    avatar={<TeamOutlined  style={{fontSize:'25px'}}/>}
                                    title={<Text className={selected && 'listItemBg'}>{item.name}</Text>}
                                    // description={item.description}
                                />
                            </List.Item>
                            
                        )
                    }}
                />
            </div>
            <br/><br/>
        </>
    )
}