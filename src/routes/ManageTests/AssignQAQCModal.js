import { Card, Checkbox, Input, Modal, Radio, Select, Space, Tabs} from 'antd'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import { useEffect } from 'react'
import { getSingleInstituteAction } from '../../redux/reducers/instituteStaff'
import { ROLES, STATUS } from '../../Constants'
import { getAssignedQaqcUsersAction, resetAssignTestQaqc, assignTestQaqcAction } from '../../redux/reducers/qaqc'

export const AssignQAQCModal = ({visible, closeModal, currentTest}) => {
    const dispatch = useDispatch()
    const {staff, user, getStatus, getAssignedQaqcUsersStatus, assignTestQaqcStatus, assignedTestQaqcUsers} = useSelector(state => ({
        staff:state.instituteStaff.singleInstitute ? state.instituteStaff.singleInstitute[0].staffs : null,
        user: state.user,
        getStatus:state.instituteStaff.getStatus,
        assignTestQaqcStatus:state.qaqc.assignTestQaqcStatus,
        getAssignedQaqcUsersStatus:state.qaqc.getAssignedQaqcUsersStatus,
        assignedTestQaqcUsers:state.qaqc.assignedTestQaqcUsers
    }))

    const [selectedSubject, changeSubject] = useState()
    const [selectedUsers, changeUsers] = useState([])
    
    useEffect(() => {
        dispatch(getSingleInstituteAction({id: user.user.staff?.institute._id}))
        dispatch(getAssignedQaqcUsersAction({testId:currentTest._id}))

        return dispatch(resetAssignTestQaqc())
    },[])

    useEffect(() => {
        if(currentTest){
            changeSubject(currentTest.sections[0].subjectRefId._id)
        }
    },[currentTest])

    useEffect(() => {
        if(assignTestQaqcStatus == STATUS.SUCCESS)
            closeModal()
    }, [assignTestQaqcStatus])

    useEffect(() => {
        if(getAssignedQaqcUsersStatus == STATUS.SUCCESS){
            changeUsers(assignedTestQaqcUsers.assigned ? assignedTestQaqcUsers.assigned : [])

        }
    }, [getAssignedQaqcUsersStatus])
    
    const _changeSubject = (e) => {
        changeSubject(e)
    }

    const _selectUser = (e, role) => {
        let selectedData = [...selectedUsers]
        
        if(selectedData.length && _.findIndex(selectedData,d => d.userRole == role && d.userId == e) != -1){
            _.remove(selectedData,d => d.userRole == role && d.userId == e)
        }else{
            selectedData.push({sectionId:selectedSubject, userRole:role, userId:e})
        }

        changeUsers(selectedData)
    }

    const assignQuestions = () => {
        let data = {testId:currentTest._id, assigned: selectedUsers}
        dispatch(assignTestQaqcAction(data))
    }

    const getStaffWithRole = (role) => {
        return _.uniqBy(_.concat(_.filter(staff,s => s.staffRole === role), _.filter(staff,s => _.find(s.otherRoles , r => r === role))), '_id')
    }

    return(
        <Modal title='Assign QA/QC' width={1000} visible={visible} confirmLoading={assignTestQaqcStatus == STATUS.FETCHING} onCancel={closeModal} onOk={assignQuestions} okText='Assign'>
            {/*<Radio.Group style={{width:'100%'}} value={selectedSubject} onChange={_changeSubject} buttonStyle="solid">
                {currentTest.sections.map(sec => 
                    <Radio.Button value={sec.subjectRefId._id} key={sec._id} style={{textAlign:'center', width:100/currentTest.sections.length+'%'}}>
                        <b>{sec.subjectRefId.name.en}</b>
                    </Radio.Button>
                )}
            </Radio.Group>*/}
            <Tabs activeKey={selectedSubject} centered onChange={(e) => changeSubject(e)}>
                {currentTest.sections.length ?
                    currentTest.sections.map((subj, i) => {
                        return(
                            <Tabs.TabPane tab={subj.subjectRefId?.name.en} key={subj.subjectRefId._id} value={subj.subjectRefId._id}></Tabs.TabPane>
                        )} 
                    )
                    : null
                }
            </Tabs>
            <br/>
            <br/>
            <Card style={{border:0}} bodyStyle={{padding:0}} loading={getStatus === STATUS.FETCHING && getAssignedQaqcUsersStatus === STATUS.FETCHING }>
                {getStatus === STATUS.SUCCESS && getAssignedQaqcUsersStatus === STATUS.SUCCESS ? 
                    <Tabs type='card'>
                        <Tabs.TabPane tab='Operator' key={1}>
                            <StaffTabPanel staff={getStaffWithRole(ROLES.CONTENT_OPERATOR)} type='Operator' role={ROLES.CONTENT_OPERATOR} staffKey={'operator'} selectedUsers={selectedUsers} _selectUser={_selectUser} selectedSubject={selectedSubject} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab='Teacher' key={2}>
                            <StaffTabPanel staff={getStaffWithRole(ROLES.TEACHER)} type='Teacher' role={ROLES.STAFF} staffKey={'teacher'} selectedUsers={selectedUsers} _selectUser={_selectUser} selectedSubject={selectedSubject} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab='Head Teacher' key={3}>
                            <StaffTabPanel staff={getStaffWithRole(ROLES.HEAD_TEACHER)} type='Head Teacher' role={ROLES.HEAD_STAFF} staffKey={'head-teacher'} selectedUsers={selectedUsers} _selectUser={_selectUser} selectedSubject={selectedSubject} />
                        </Tabs.TabPane>

                        <Tabs.TabPane tab='QA/QC' key={4}>
                            <StaffTabPanel staff={getStaffWithRole(ROLES.QA_QC)} type='QA/QC Staff' role={ROLES.QA_QC} staffKey={'qa_qc'} selectedUsers={selectedUsers} _selectUser={_selectUser} selectedSubject={selectedSubject} />
                        </Tabs.TabPane>
                    </Tabs>
                    :
                    null
                }
            </Card>
        </Modal>
    )
}

const StaffTabPanel = ({staff, type ,staffKey, selectedUsers, selectedSubject, _selectUser }) => {
    const [searchKey, setSearchKey ] = useState('') 
    return (
        <div style={{padding:'0 10px'}}>
            {staff?.length ?
                <>
                    <Input onChange={(e) => setSearchKey(e.target.value) } placeholder={'search '+type}/><br/><br/>
                    
                    {_.filter(staff,s => _.includes(_.lowerCase(s.user?.name), searchKey)).length ? 
                        <Space> 
                            {_.filter(staff,s => _.includes(_.lowerCase(s.user?.name), searchKey)).map(s => 
                                {
                                    let checked = _.findIndex(selectedUsers,o => o.sectionId == selectedSubject && o.userId == s.user._id && o.userRole == staffKey) != -1
                                    return(
                                        <Checkbox checked={checked} onChange={(e) => _selectUser(e.target.value, staffKey)} key={s._id} value={s.user._id}>{s.user.name}</Checkbox>
                                    )
                                }   
                            )}
                        </Space>
                        :
                        null
                    }
                </> 
                :
                <div style={{color:'#5D6D7E'}}>No {type} Available</div>
            }
        </div>
    )
}