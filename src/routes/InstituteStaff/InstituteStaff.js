import { Button, Card, Input, Form, Select, Modal, Table, Tooltip, Tag, Space, Checkbox, Row } from 'antd';
import {RoleType} from '../../Constants'
import {useDispatch, useSelector} from 'react-redux' 
import { useState, useEffect, useCallback, useRef } from 'react';
import { STATUS } from '../../Constants'

import { addInstituteStaffAction, getSingleInstituteAction, editInstituteStaffAction, resetEditStatusAction, getCategoriesAction, editStaffRoleAction } from '../../redux/reducers/instituteStaff'
import { EditOutlined, StopOutlined, CheckCircleOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';

import _ from 'lodash';
import Text from 'antd/lib/typography/Text';
import { CategoriesModal } from './CategoriesModal';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

export const InstituteStaffModal = (props) => {
  const dispatch = useDispatch()
  const [currentView, changeCurrentView] = useState({type: 'list', data: ''})
  const {data, user, updateStaffStatus} = useSelector(s => ({
      data: s.instituteStaff,
      user: s.user,
      updateStaffStatus:s.instituteStaff.updateStaffStatus
  }))

  useEffect(() => {
    if(currentView.type === 'list'){
      dispatch(getSingleInstituteAction({id: props.selectedData._id}))
    }
  },[currentView, dispatch, props.selectedData?._id])

  useEffect( () => {
    if(!data.singleInstitute?.length) return;
    if(currentView.type === 'edit' && data.editStaffRoleStatus === STATUS.SUCCESS){
      let newCurrentData = _.find(data.singleInstitute[0]?.staffs, s => s._id === currentView.data._id )
      changeCurrentView({...currentView, data: newCurrentData});
    }
  },[data.editStaffRoleStatus, data.singleInstitute])
  return(
    <Modal visible={props.instituteModal} footer={null} width='1000px' onOk={() => console.log('')} onCancel={() => props.closeModal()}>
      {currentView.type == 'list' ? 
        <ListInstituteStaff updateStatus={updateStaffStatus} user={user.user} changeView={(d) => (dispatch(resetEditStatusAction()), changeCurrentView({type: d.type, data: d.data}))} data={{data: data.singleInstitute?.[0], status: data.getStatus}}/>
        : 
        <AddInstituteStaff preSelected={currentView.data} changeView={(d) => (dispatch(resetEditStatusAction()), changeCurrentView({type: d.type, data: d.data}))} data={{data: data.singleInstitute, status: data.getStatus}}/>
      }
    </Modal>
  )
}

export function ListInstituteStaff(props){
  const dispatch = useDispatch()
  let searchInput = useRef();

  const {updateStaffStatus} = useSelector(state => ({
    updateStaffStatus: state.instituteStaff.updateStaffStatus
  }))
  const [categoriesModal, openCategoriesModal] = useState()

  useEffect(() => {
    if(updateStaffStatus === STATUS.SUCCESS)
      openCategoriesModal(false)
  }, [updateStaffStatus])

  let filter = (type) => ({
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },

    onFilter: (value, record) =>
      record.user?.[type]
        ? record.user[type]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",

    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Form
          onFinish={() => {
            confirm({ closeDropdown: false });
          }}
        >
          <Input
            ref={(node) => {
              searchInput = node;
            }}
            placeholder={`Search ${type}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              htmlType="submit"
              type="primary"
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => {
                clearFilters();
              }}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </Form>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{ fontSize: "18px", color: filtered ? "#1890ff" : undefined }}
      />
    )
  })

  const handleAssignCategories = (d) => {
    openCategoriesModal(d || false)
  }
  const columns = [
    {
      title: 'Status',
      key: 'status',
      render: d => <div>
        <Tag color={d.user?.isActive ? 'green' : 'red'}>
          {d.user?.isActive ? 'ACTIVE' : 'INACTIVE'}
        </Tag>
      </div>
    },
    {
      title: 'Name',
      key: 'name',
      render: d => d.user.name,
      ...filter('name')
    },
    {
      title: 'Contact',
      key: 'contact',
      render: d => d.user.contact,
      ...filter('contact')
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.select(), 100);
        }
      },
  
      onFilter: (value, record) =>
        record['code']
          ? record['code']
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : "",
  
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Form
            onFinish={() => {
              confirm({ closeDropdown: false });
            }}
          >
            <Input
              ref={(node) => {
                searchInput = node;
              }}
              placeholder={`Search ${'code'}`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              style={{ marginBottom: 8, display: "block" }}
            />
            <Space>
              <Button
                htmlType="submit"
                type="primary"
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button
                onClick={() => {
                  clearFilters();
                }}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
            </Space>
          </Form>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{ fontSize: "18px", color: filtered ? "#1890ff" : undefined }}
        />
      )
    },
    {
      title: 'Staff Role',
      key: 'staffRole',
      render: d => <div>
        <Tag>{d.staffRole}</Tag>
        {
          d.otherRoles?.length > 0 &&
          <>
            {
                _.map(d.otherRoles, role =>
                      <Tag
                        key={role}
                      >
                        {role}
                      </Tag>
                )
              }
          </>
        }
      </div>
    },
    {
      title: 'Categories',
      key: 'categories',
      dataIndex: 'categories',
      render: arr => arr?.length ? _.join(arr.map(d => d.name), ', ') : null
    },
    {
      title: 'Subject',
      key: 'staff Desc',
      dataIndex:"staffDesc",
    },
    // {
    //   title: 'User Role',
    //   key: 'role',
    //   render: d => <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
    //     <div style={{padding:10, backgroundColor:"#fafafa", borderRadius:"10px", fontSize:10}}>
    //     {d.user.role}
    //   </div>
    //   </div>
    // },
    {
      title: 'Username',
      key: 'username',
      render: d => d.user.username,
      ...filter('username')
    },
    {
      title: 'Action',
      key: 'action',
      render: d => <div>
            <Space>
              <Button size='sm' onClick={() => handleAssignCategories(d)}>Update Categories</Button>
              <Tooltip title='Update'>
                <Button shape='circle' onClick={() => props.changeView({type: 'edit', data: d})}><EditOutlined /></Button>
              </Tooltip>
              <Tooltip placement="top" title={props.user.staff && props.user.staff._id === d._id ? 'Can Not Disable Yourself' : d.user.isActive ? 'Inactivate' : 'Activate'}>
                <Button shape='circle' loading={props.updateStatus === STATUS.FETCHING} disabled={props.user.staff && props.user.staff._id === d._id} onClick={() => dispatch(editInstituteStaffAction({"staffId": d._id, user: {id: d.user._id, isActive: !d.user.isActive}}))}>
                  {d.user.isActive ? 
                    <StopOutlined />
                    : 
                    <CheckCircleOutlined />
                  }
                </Button>
              </Tooltip>
            </Space>
            </div>
    },
  ];

  const handleSubmit = (arry) => {
    let data = arry?.length ? arry.map(d => d._id) : []
    dispatch(editInstituteStaffAction({staffId:categoriesModal._id, categories:data}))
  }
  
  return (
    <div>
        <Card 
          // title={
          //   <div>
          //     <span>
          //       LIST INSTITUTE STAFF
          //     </span>
          //     {props.hideViewButton ? null : 
          //       <span>
          //         <Button shape='round' style={{float: 'right'}} onClick={() => props.changeView({type: 'add', data: ''})}>Add Staff</Button>
          //       </span>
          //     }
          //   </div>
          // } 
          loading={props.data.status === STATUS.FETCHING}
          bordered={false} 
          style={{ width: '100%' }}
        >
          {props.data.status == STATUS.SUCCESS ?
            <div style={{overflowY: 'auto'}}>
              <Table bordered
              scroll={{
                x:1000
              }}
                pagination={false}
                columns={columns} 
                dataSource={_.map(props.data.data.staffs, s => {
                  return Object.assign({}, s, {key: s.id})
                })} 
              />
            </div>
          : null}
        </Card>
        {categoriesModal ? 
          <CategoriesModal 
            onSubmit={handleSubmit} 
            visible={categoriesModal} 
            defaultData={categoriesModal.categories?.length ? categoriesModal.categories  : null} 
            closeModal={() => handleAssignCategories()} 
            loading={updateStaffStatus === STATUS.FETCHING}
          /> 
          : null
        }
    </div> 
  );
}

export function AddInstituteStaff(props) {
  const dispatch = useDispatch()
  const [ otherRoles, setOtherRoles ] = useState([]);
  const [stateData, stateChange] = useState(
    {contact: '', name: '', deacription:'', code: '', instituteId: props.data.data[0]._id, role:"", username:"", resetPassword: ''}
  )


  const { data, subjects } = useSelector(s => ({
      data: s.instituteStaff,
      subjects: s?.lmsConfig?.defaultData?.subjects
  }))

  const curretStateData = useCallback(() => {
    stateChange({
      contact: props.preSelected.user.contact ? props.preSelected.user.contact : '', 
      name: props.preSelected.user.name ? props.preSelected.user.name : '', 
      code: props.preSelected.code ? props.preSelected.code : '', 
      instituteId: props.data.data[0]._id, 
      role: props.preSelected.staffRole ? props.preSelected.staffRole : '',
      // staffRole: props.preSelected.user.role ? props.preSelected.user.role : '',
      username: props.preSelected.user.username ? props.preSelected.user.username : '',
      resetPassword: '',
      staffDesc:props.preSelected.staffDesc || ""
    })
    setOtherRoles(props.preSelected.otherRoles || [])
  },[props])

  useEffect(() => {
    if(props.preSelected){
      curretStateData()
    }
  }, [props.preSelected, curretStateData])

  useEffect(() => {
    if(data.addStatus == STATUS.SUCCESS || data.updateStaffStatus == STATUS.SUCCESS){
      dispatch(resetEditStatusAction())
      props.changeView({type: 'list', data: ''})
      stateChange({contact: '', name: '', code: '', instituteId: props.data.data[0]._id, role:"", username:""})
    }  
  }, [data.addStatus, data.updateStaffStatus, dispatch, props])

  const onFinish = () => {
    if(props.preSelected){
      let changedData = {
        "staffId": props.preSelected._id,
        "code": stateData.code,
        "staffRole": stateData.role,
        "staffDesc": isTeacher() ? stateData.staffDesc : undefined,
        "user": {
          "id": props.preSelected.user._id,
          "name": stateData.name,
          "contact": stateData.contact,
          "username": stateData.username,
          // "role": stateData.role,
          "staffDesc": isTeacher() ? stateData.staffDesc : undefined,
          resetPassword: ''
        }
      }
      dispatch(editInstituteStaffAction(changedData))
    }else{
      dispatch(addInstituteStaffAction({
          contact: stateData.contact,
          name: stateData.name,
          code: stateData.code,
          instituteId: stateData.instituteId, 
          // role: stateData.role,
          "staffRole": stateData.role,
          username: stateData.username,
          staffDesc: isTeacher() ? stateData.staffDesc : undefined ,

          resetPassword: '',
          description:stateData.description
        })
      )
    }
  };

  let selectFormData = (value, type) => {
    stateChange({...stateData, [type]: value})
  }

  let isTeacher = (role) => {
   return stateData['role'] && stateData['role'] === 'TEACHER' || stateData['role'] === 'HEAD_TEACHER'; 
  }

  let handleRemoveOtherRole = (role) => {
    let changedData = { "staffId": props.preSelected._id, otherRoles: _.filter(otherRoles, r => r!== role ) };
    dispatch(editStaffRoleAction(changedData))
  }

  let handleAddOtherRole = (role) => {
    if(!role) return;
    let changedData = { "staffId": props.preSelected._id, otherRoles: [...otherRoles, role] };
    dispatch(editStaffRoleAction(changedData))
  }

  return (
    <div>
      <Card 
        // title={
        //   <div>
        //     <span>
        //       {props.preSelected ? "EDIT INSTITUTE STAFF" : "ADD INSTITUTE STAFF"}
        //     </span>
        //     {props.hideViewButton ? null : 
        //       <span>
        //         <Button style={{float: 'right'}} onClick={() => props.changeView({type: 'list', data: ''})}>List Staff</Button>
        //       </span>
        //     }
        //   </div>
        // } 
        bordered={false} 
        style={{ width: '100%' }}
      >
        <Form {...formItemLayout} layout="horizontal">
          {props.preSelected ? 
            <Form.Item label="Username">
              <Text>{props.preSelected?.user?.username}</Text>
            </Form.Item>
            : null
          }
          <Form.Item label="Name">
            <Input placeholder="Input Name" onChange={(e) => selectFormData(e.target.value, 'name')} defaultValue={stateData.name} value={stateData.name}/>
          </Form.Item>
          <Form.Item label="Role">
            <Select onChange={(e) => selectFormData(e, 'role')} defaultValue={stateData.role} value={stateData.role}>
              <Select.Option value=''>Select Role</Select.Option>
              {_.map(RoleType, (s,i) => (
                <Select.Option key={i} value={s}>{s}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          {
            stateData['role'] && isTeacher() ? 
            <Form.Item label="Subject">
                         <Input placeholder="Teacher Subject" onChange={(e) => selectFormData(e.target.value, 'staffDesc')} defaultValue={stateData.staffDesc} value={stateData.staffDesc}/>

              {/* <Select onChange={(e) => selectFormData(e, 'subject')} value={stateData.subject}>
                <Select.Option value=''>Select subject</Select.Option>
                {_.map(subjects, (sub,i) => (
                  <Select.Option key={i} value={sub?._id}>{sub?.name?.en}</Select.Option>
                ))}
              </Select> */}
            </Form.Item>
            : null
          }
          <Form.Item label="Contact">
            <Input placeholder="Input Contact" onChange={(e) => selectFormData(e.target.value, 'contact')} defaultValue={stateData.contact} value={stateData.contact}/>
          </Form.Item>
          <Form.Item label="Code">
            <Input placeholder="Input Code" onChange={(e) => selectFormData(e.target.value, 'code')} defaultValue={stateData.code} value={stateData.code}/>
          </Form.Item>
          <Form.Item label="Description">
            <Input placeholder="Input Discruption" onChange={(e) => selectFormData(e.target.value, 'description')} defaultValue={stateData.description} value={stateData.description}/>
          </Form.Item>
          {!props.preSelected ? 
            <Form.Item label="Username">
              <Input placeholder="Input Username" onChange={(e) => selectFormData(e.target.value, 'username')} defaultValue={stateData.username} value={stateData.username}/>
            </Form.Item>
          : null}
          <Form.Item label="Action">
            <Checkbox onChange={(e) => selectFormData(e.target.checked, 'resetPassword')} checked={stateData.resetPassword}>Force Password Change</Checkbox>
          </Form.Item>
          <div style={{textAlign: 'center', paddingBottom: '20px'}}>
            <Button type="primary" loading={data.addStatus == STATUS.FETCHING || data.updateStaffStatus == STATUS.FETCHING} onClick={() => onFinish()}>
              Register
            </Button>
          </div>
        </Form>
      </Card>
      {
        props.preSelected &&
        
      <Card >
        <Row>
          {
            _.map(otherRoles, role =>
              <div style={{ margin: '5px' }}>
                  <Tag
                     style={{ height: '100%', display:'flex', justifyContent:'center', alignItems:'center' }}
                    key={role}
                    closable
                    onClose={ () => handleRemoveOtherRole(role)}
                  >
                    {role}
                  </Tag>
              </div>
            )
          }
          <div style={{ margin: '5px', minWidth: '200px' }}>
            <Select onChange={handleAddOtherRole} value=''>
              <Select.Option value=''><PlusOutlined /> New Role</Select.Option>
              {_.map(_.filter(RoleType, r => !_.find(otherRoles, role => role === r) ), (s,i) => (
                <Select.Option key={i} value={s}>{s}</Select.Option>
              ))}
            </Select>
          </div>
        </Row>
      </Card>
      }
    </div> 
  );
}


