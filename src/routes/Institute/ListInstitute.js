import { Button, Card, Space, Table } from 'antd';

import { useState, useEffect } from 'react';
import moment from 'moment';
// import "./.css"
import { useAppContext } from '../../App/Context';
import {useDispatch, useSelector} from 'react-redux' 

import { getAllInstituteAction, deleteInstituteAction } from '../../redux/reducers/institute'

import Text from 'antd/lib/typography/Text';
import { EditOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons';

import { EditInstituteModal } from './AddInstitute'
import { InstituteStaffModal } from '../InstituteStaff/InstituteStaff'
import { getStatesAction } from '../../redux/reducers/states'
import _ from 'lodash';

export function ListInstitute() {
  const [collapsed, setCollapsed] = useState(false)
  const [modalData, editModalChange] = useState({modal: false, data: ''})
  const [modalStaffData, staffModalChange] = useState({staffModal: false, data: ''})
  const {logout} = useAppContext()
  const dispatch = useDispatch()

  // const findCity = (data) => {
  // 	if(data.state && data.city){
	 //  	let state = _.find(states.statesList, ss => ss.id == data.state)
	 //  	let city = state ? _.find(state.cities, ss => ss.id == data.city).name : ''
  // 		return city
  // 	}else{
  // 		return ''
  // 	}
  // }

  const columns = [
	  {
	    title: 'Name',
	    dataIndex: 'name',
	    key: 'name',
	  },
	  {
	    title: 'Contact',
	    dataIndex: 'contact',
	    key: 'contact',
	  },
	  {
	    title: 'Email',
	    dataIndex: 'email',
	    key: 'email',
	  },
	  {
	    title: 'Activation Date',
	    dataIndex: 'activationDate',
	    key: 'activationDate',
	    render: d => moment(d).format('DD-MM-YYYY')
	  },
	  {
	    title: 'State',
	    key: 'state',
	    //render: d => states.getStatesStatus == "SUCCESS" ? (states.statesList.find(ss => ss.id == d.state) || {}).name : ''
	    render: d => d.state
	  },
	  {
	    title: 'City',
	    key: 'city',
	    //render: d => states.getStatesStatus == "SUCCESS" ? findCity(d) : ''
	    render: d => d.city
	  },
	  {
	    title: 'Address',
	    dataIndex: 'address',
	    key: 'address',
	  },
	  {
	    title: 'Code',
	    dataIndex: 'code',
	    key: 'code',
	  },
	  {
	    title: 'Action',
	    key: 'action',
	    render: d => <div>
			<Space>
				<Button onClick={() => editModalChange({modal: true, data: d})} shape='circle' icon={<EditOutlined />} />
				<Button onClick={() => staffModalChange({staffModal: true, data: d})} shape='circle' icon={<UserOutlined />} />
				<Button onClick={() => dispatch(deleteInstituteAction({id: d.id}))} shape='circle' icon={<DeleteOutlined />} danger/>
			</Space>
	    			</div>
	  },
	];

  const {data, states} = useSelector(s => ({
        data: s.institute,
        states: s.states
    }))

  useEffect(() => {
  	dispatch(getStatesAction())
    dispatch(getAllInstituteAction())
  }, [])
  return (
    <div style={{padding: '20px'}}>
      	<Card title="INSTITUTE LIST" bordered={false} style={{ width: '100%' }}>
	      	{data.getStatus == "SUCCESS" ? 
		    	<Table 
		      		columns={columns} 
		      		dataSource={_.map(data.instituteList, s => {
		      			return Object.assign({}, s, {key: s.id})
		      		})} 
		    	/>
	  		: null}
      	</Card>
      	{modalData.modal ? 
      		<EditInstituteModal editInstituteModal={modalData.modal} preSelected={modalData.data} closeModal={() =>  editModalChange({modal: false, data: ''})}/>
    	: null}
    	{modalStaffData.staffModal ? 
      		<InstituteStaffModal instituteModal={modalStaffData.staffModal} selectedData={modalStaffData.data} closeModal={() => staffModalChange({staffModal: false, data: ''})}/>
    	: null}
    </div> 
  );
}

