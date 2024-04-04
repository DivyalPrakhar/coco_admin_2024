import { Button, Input, Select, Card } from 'antd';
import {useDispatch, useSelector} from 'react-redux' 
import { useState, useEffect } from 'react';
import { STATUS } from '../../Constants'

import { getSingleInstituteAction, searchStaffAction } from '../../redux/reducers/instituteStaff'
import { PlusOutlined } from '@ant-design/icons';
import {AddInstituteStaff, ListInstituteStaff} from '../InstituteStaff/InstituteStaff'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import Search from 'antd/lib/input/Search'
import _ from 'lodash';
import PetDataContext from '../../Constants';


export const ManageStaff = () => {
  const dispatch = useDispatch()
  const [currentView, changeCurrentView] = useState({type: 'list', data: ''})
  const [searchKey, setSearchKey] = useState('name')

  const {data, user} = useSelector(s => ({
      data: s.instituteStaff,
      user: s.user
  }))
  // const { data } = useContext(PetDataContext);

  useEffect(() => {
    if(currentView.type === 'list'){
      dispatch(getSingleInstituteAction({id: user.user.staff?.institute._id}))
    }
  },[currentView, dispatch, user])

  const searchTypes = [
    {id:1, key:'name', label:'Name'},
    {id:2, key:'contact', label:'Contact'}
  ]

  const searchStaff = (query) => {
    let data = {searchKey, searchQuery:query}
    dispatch(searchStaffAction(data))
  }

  useEffect( () => {
    if(!data.singleInstitute?.length) return;
    if(currentView.type === 'edit' && data.editStaffRoleStatus === STATUS.SUCCESS){
      let newCurrentData = _.find(data.singleInstitute[0]?.staffs, s => s._id === currentView.data._id )
      changeCurrentView({...currentView, data: newCurrentData});
    }
  },[data.editStaffRoleStatus, data.singleInstitute])
  const {Option} = Select;
  return(
    <div>
      <CommonPageHeader
        title='Manage Staff'
        extra={
          <Button shape='round' icon={<PlusOutlined />} onClick={() => changeCurrentView({type: currentView.type == 'list' ? 'add' : 'list'})} size='large'>
            {currentView.type === 'list' ? 'Add' : 'List'} Staff
          </Button>
        }
      />
      <br/>
      {currentView.type === 'list' ? 
        <Card>
          {/* <div style={{padding: '10px'}}>
            <Input.Group compact>
                <Select style={{ width: '20%' }} onChange={e => setSearchKey(e)} size='large' defaultValue="name">
                    {searchTypes.map(type => 
                        <Option value={type.key} key={type.id}>{type.label}</Option>
                    )}
                </Select>
                <Search style={{ width: '80%' }} autoFocus size='large' loading={data.getStatus == STATUS.FETCHING} 
                    placeholder={`Enter ${_.find(searchTypes,d => d.key == searchKey).label}`} allowClear 
                    enterButton="Search"
                    type={_.find(searchTypes,d => d.key == searchKey).label === "Contact" ? "number" : "text"}
                    onSearch={e => e && searchStaff(e)}
                />
            </Input.Group>
          </div> */}
          <ListInstituteStaff hideViewButton={true} user={user.user} changeView={(d) => changeCurrentView({type: d.type, data: d.data})} data={{data: data.singleInstitute?.[0], status: data.getStatus}}/>
        </Card>
      : 
        <AddInstituteStaff hideViewButton={true} preSelected={currentView.data} changeView={(d) => changeCurrentView({type: d.type, data: d.data})} data={{data: data.singleInstitute, status: data.getStatus}}/>
      }
    </div>
  )
}
