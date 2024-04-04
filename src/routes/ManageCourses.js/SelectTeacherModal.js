import { CloseCircleOutlined, SelectOutlined } from '@ant-design/icons'
import { Button, Card, List, Modal, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import _ from 'lodash'
import { getAllTeachers } from '../../redux/reducers/doubts'

export const SelectTeacherModal = ({visible, closeModal, onSubmit, status, subject, teachers, disabled}) => {
    const dispatch = useDispatch()

    const {getAllTeachersStatus, allTeachers} = useSelector(state => ({
        getAllTeachersStatus:state.doubts.getAllTeachersStatus,
        allTeachers:state.doubts.allTeachers
    }))

    const [selectedTeachers, setTeachers] = useState([])

    useEffect(() => {
        if(teachers?.length){
            let data = _.intersectionBy(allTeachers, teachers.map(d => ({user:d})), d => d.user?._id )

            if(disabled)
                data = data.map(d => ({...d, added:true}))

            setTeachers(data)
        }
    }, [allTeachers, teachers, disabled])

    useEffect(() => {
        dispatch(getAllTeachers())
    }, [dispatch])

    const handleSelect = (teacher) => {
        let data = _.xorBy(selectedTeachers, [teacher], '_id')
        setTeachers(data)
    }

    const handleSubmit = () => {
        let data = selectedTeachers
        if(disabled) data = _.filter(selectedTeachers,t => !t.added) 
        onSubmit(data)
        
        if(!status) closeModal()
    }
    
    console.log('modal', allTeachers, selectedTeachers)
    return(
        <Modal width={'50%'} title='Select Teacher' visible={visible}  onCancel={closeModal} 
            onOk={handleSubmit} okButtonProps={{loading:status === STATUS.FETCHING}}
        >
            <Card bodyStyle={{padding:0}} style={{border:0}} loading={getAllTeachersStatus === STATUS.FETCHING}>
                <List
                    size='small'
                    dataSource={allTeachers || []}
                    renderItem={item => {
                        let selected = _.findIndex(selectedTeachers,t => t.user._id === item.user?._id) !== -1
                        const disabled = selected && _.find(selectedTeachers,t => t.user._id === item.user?._id)?.added
                        return(
                            <List.Item style={{background:selected && '#F4F6F7'}} key={item.id}>
                                <List.Item.Meta
                                    title={item.user?.name}
                                    description={item.staffDesc}
                                />

                                {selected ? 
                                    <Button onClick={() => handleSelect(item)} 
                                        icon={<CloseCircleOutlined />} size='small'
                                        type={'primary'}
                                        disabled={disabled}
                                        style={{cursor:disabled && 'not-allowed'}}
                                    >
                                        {'Selected'}
                                    </Button>
                                    :
                                    <Button onClick={() => handleSelect(item)} 
                                        icon={<SelectOutlined />} size='small'
                                    >
                                        { 'Select'}
                                    </Button>
                                }
                            </List.Item>
                        )
                    }}
                />
                <br/>
                {/* <Table>
                    <Table.Column title='Name' />
                    <Table.Column title='Description' />
                </Table> */}
            </Card>
        </Modal>
    )
}