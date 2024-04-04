import { Button, Col, Input, Modal, Row, Spin, Tag, Divider } from 'antd'
import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import { getModalTagsAction, getTagsAction, resetTagsListdata } from '../../redux/reducers/packages'
import _ from 'lodash' 
import { useEffect } from 'react'
import { TagTwoTone } from '@ant-design/icons'
import { AddTagModal } from '../ManageTags/AddTagModal'
import { setRecentlyUsedTags, getRecentlyUsedTags } from '../../utils/FileHelper'

export const SelectTagsModal = ({selectedData, visible, closeModal, submitTags, single}) => {
    const dispatch = useDispatch()
    const [selectedDataNew, changeSelectedData] = useState(_.compact(selectedData))
    const [searchKey, changeSearchKey] = useState('')
    const [addTagModal, changeAddTagModal] = useState({modal: false, directName: ''})

    const {tagsList, getTagsStatus, addTagStatus} = useSelector(state => ({
        tagsList: state?.packages?.modalTagsList,
        getTagsStatus: state.packages.getModalTagsStatus,
        addTagStatus:state.packages.addTagStatus,
    }))

    useEffect(() => {
        changeSelectedData(_.compact(selectedData))
        dispatch(getModalTagsAction())

        return () => dispatch(resetTagsListdata())
    }, [])

    useEffect(() => {
        if(searchKey){
            changeSelectedData(_.xorBy(selectedDataNew, _.filter(tagsList, s => _.includes(_.toUpper(s.name), _.toUpper(searchKey))), '_id'))
        }
    }, [tagsList])

    const _submitTags = () => {
        setRecentlyUsedTags([...selectedDataNew])
        submitTags(selectedDataNew)
        closeModal()
    }

    const _changeSelectedData = (data) => {
        if(single)
            changeSelectedData([data])
        else
            changeSelectedData(_.xorBy(selectedDataNew, [data], '_id'))
    }

    const showAddTagModal = () => {
        changeAddTagModal({modal: true, directName: searchKey})
    }

    let filteredTagList = _.filter(tagsList, s => _.includes(_.toUpper(s.name), _.toUpper(searchKey)))
    let recentlyUsed = _.filter(getRecentlyUsedTags(), s => _.includes(_.toUpper(s.name), _.toUpper(searchKey)))
    return (
            <Modal visible={visible} title='Select Tags' footer={null} width='1000px' onCancel={() => closeModal()}>
                <Row>
                    <Col sm={24}>
                        <Input
                            disabled={getTagsStatus != STATUS.SUCCESS}
                            placeholder="Search Tag Here"
                            onChange={(e) => changeSearchKey(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </Col>
                </Row>
                <Row>
                    {getTagsStatus == STATUS.FETCHING ? 
                        <Col sm={24} style={{textAlign: 'center', minHeight: '200px'}}>
                            <Spin />
                        </Col>
                    :
                        <Col sm={24} style={{minHeight: '200px'}}>
                            {filteredTagList.length > 0 ?
                                <div>
                                    {recentlyUsed.length > 0 ? 
                                        <div>
                                            <Divider orientation="left">RECENTLY USED TAGS</Divider>
                                            {_.map(recentlyUsed, tg => {
                                                let findTg = _.findIndex(selectedDataNew, s => s._id == tg._id) != -1
                                                return(
                                                    <Tag color={findTg ? 'blue' : ''} style={{fontSize:'14px', cursor:'pointer', padding:'5px 10px', marginTop: '5px'}} key={tg._id} icon={<TagTwoTone/>} onClick={() => _changeSelectedData(tg)}>
                                                        {tg.name}
                                                    </Tag>
                                                )}
                                            )}
                                            <Divider orientation="left">MORE TAGS</Divider>
                                        </div>
                                    : null}
                                    {_.map(_.xorBy(filteredTagList, recentlyUsed, '_id'), tg => {
                                        let findTg = _.findIndex(selectedDataNew, s => s._id == tg._id) != -1
                                        return(
                                            <Tag color={findTg ? 'blue' : ''} style={{fontSize:'14px', cursor:'pointer', padding:'5px 10px', marginTop: '5px'}} key={tg._id} icon={<TagTwoTone/>} onClick={() => _changeSelectedData(tg)}>
                                                {tg.name}
                                            </Tag>
                                        )}
                                    )}
                                </div>
                            : 
                                <div>
                                    ADD NEW TAG: <Tag color="#108ee9" style={{cursor: 'pointer'}} onClick={() => showAddTagModal()}>{searchKey || 'ADD'}</Tag>
                                </div>
                            }
                        </Col>
                    }
                </Row>
                <br/>
                {addTagModal.modal && <AddTagModal visible={addTagModal.modal} directName={addTagModal.directName} closeModal={() => (changeAddTagModal({modal: false, directName: ''}), dispatch(getModalTagsAction()))}/>}
                <Row>
                    <Col sm={24}>
                        <Button block type='primary' onClick={_submitTags}>Submit Tags</Button>
                    </Col>
                </Row>
            </Modal>
    )
}