import { CheckCircleFilled, CloseCircleFilled, FileExcelOutlined, RedoOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Tabs, Tag, Table, Tooltip, Form, Space, Image, Typography, Select, Switch as AntSwitch, DatePicker, Timeline, Badge, Input } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { STATUS } from '../../Constants'
import _ from 'lodash'
  
  import Modal from 'antd/lib/modal/Modal'
  import { getAllLeadsAction, getUserLeadsAction } from '../../redux/reducers/leads'
import moment from 'moment'
import { BaseURL } from '../../BaseUrl'
import { URIS } from '../../services/api'

const { RangePicker } = DatePicker;

export const AllLeads = () => {
    const columnNames = ['srno', 'name', 'email', 'contact', 'recent', 'lastActivity', 'action']
    const leadTypes = [ 
        { name : 'All', value : '', }, 
        { name : 'Contact', value : 'Contact', }, 
        { name : 'Profile', value : 'Profile', }, 
        // { name : 'Preferences', value : 'Preferences', }, 
        { name : 'Package Visited', value : 'PackageVisited', }, 
        // { name : 'Sample Content', value : 'Sample Content', }, 
        { name : 'Cart Added', value : 'CartAdded', }, 
        // { name : 'Purchased', value : 'Purchased', }, 
    ]

    const [leadsData,setLeadsData] = useState(null)
    const [rangeDate,setStartdate] = useState(false)
    const [startDate,setStartDate] = useState(null)
    const [endDate,setEndDate] = useState(null)
    const [activityType,setActivityType] = useState(null)
    const [filterData, changeFilterData] = useState({})

    var query = useRef({})
    const dispatch = useDispatch()
    // useEffect(() => {
    //     query.current = {
    //         type : activityType,
    //     }
        
    // }, [activityType, dispatch, endDate, rangeDate, startDate])
    
    const {allLeads, getLeadsStatus} = useSelector((state) => ({
        allLeads: state.leads.allLeads,
        getLeadsStatus:state.leads.getLeadsStatus
    }))
    // useEffect(() => {
    //     if(leads.getLeadsStatus === STATUS.SUCCESS){
    //         setLeadsData(allLeads)
    //     }
    // }, [leads])


    const changeActivityType = (data) => {setActivityType(data)}
    const changeDate = (data) => {
        if(Array.isArray(data)){
            setStartDate(data[0]?.format('YYYY-MM-DD'))
            setEndDate(data[1]?.format('YYYY-MM-DD'))
        }else{
            setStartDate(data?.format('YYYY-MM-DD'))
        }
  
    }
    const filterLeadList = (page) => {
        console.log('page', page)
        let data = {type : activityType, ...filterData}

        if(rangeDate && startDate && endDate){
            data = { ...data, startDate, endDate,}
        }else{
            data = { ...data, createdAt : startDate}
        }
        dispatch(getAllLeadsAction({...data, page:page || 1})) // API Call
    }

    const handleDownload = async () => {
        let data = {excel:1, type : activityType, ...filterData}

        if(rangeDate && startDate && endDate){
            data = { ...data, startDate, endDate,}
        }else{
            data = { ...data, createdAt : startDate}
        }

        data = _.omitBy(data,d => !d) 

        window.open(_.trimEnd(BaseURL, '/')+URIS.GET_LEADS + '?' + _.join(_.map(data, (d, i) => `${i}=${d}`), '&'), '_blank')
    }

    const changeFilter = (e, key) => {
        if(e.target)
            changeFilterData(d => ({...d, [e.target.id]:e.target.value}))
        else
            changeFilterData(d => ({...d, [key]:e}))

    }

    const resetForm = () => {
        changeFilterData({})
        setActivityType()
        setStartDate()
        setEndDate()
        dispatch(getAllLeadsAction()) // API Call
    }

    const handleRange = () => {
        setStartdate(!rangeDate)
        setStartDate()
        setEndDate()
    }

    console.log('data', allLeads)
    return(
        <div>
            <CommonPageHeader
                title='Leads'
            />
            <br/>
            <Card >
                <Form onFinish={() => filterLeadList()} layout='vertical'>
                    <Row gutter={16} >
                        <Col> 
                            <Form.Item label="Name">
                                <Input value={filterData.name} placeholder='Name' id='name' onChange={changeFilter}/>
                            </Form.Item>
                        </Col>
                        <Col> 
                            <Form.Item label="Contact">
                                <Input value={filterData.contact} id='contact' placeholder='Contact' type={'number'} onChange={changeFilter}/>
                            </Form.Item>
                        </Col>
                        <Col span="4" >
                            <Form.Item  label="Activity Type">
                                <Select placeholder="Select Activity Type" value={activityType} onChange={changeActivityType}>
                                    {
                                        leadTypes.map((type,i)=><Select.Option value={type.value} key={i}>{type.name}</Select.Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col> 
                            <Form.Item label="Range">
                                <AntSwitch size='small' onChange={handleRange}/>
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item label={rangeDate?'Created Between':'Created At'}>
                                {rangeDate ? 
                                    <RangePicker value={startDate &&  [moment(startDate), moment(endDate)]} onChange={changeDate} />
                                    :
                                    <DatePicker value={startDate &&  moment(startDate)} placeholder="Select Date"  onChange={changeDate}/>
                                }
                            </Form.Item>
                        </Col>
                        <Col> 
                            <Form.Item label="Sort by Last Activity">
                                <Select placeholder='select last activity order' id='sortCreatedAt' defaultValue={'DESC'} 
                                    onChange={e => changeFilter(e, 'sortCreatedAt')}
                                >
                                    <Select.Option value={'ASC'}>Ascending</Select.Option>
                                    <Select.Option value={'DESC'}>Descending</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item label=" ">
                                <Space>
                                    <Button htmlType='submit' loading={getLeadsStatus === STATUS.FETCHING} >Apply</Button>
                                    <Button type='default' icon={<RedoOutlined />} onClick={resetForm}>Reset</Button>
                                    <Button type='primary' onClick={handleDownload} icon={<FileExcelOutlined />}>Download Excel</Button>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Card>
                    <DataTable getLeadsAction={filterLeadList} columns={columnNames} data={allLeads} />
                </Card>
                
            </Card>
        </div>
    )
}
const DataTable = ({columns, data, getLeadsAction}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState(false);
    const [userData, setUserData] = useState(false);
    const leadsTableColumns = columns.map((col,i)=>({
        title : col === 'srno' ? 'Sr No.' :col === 'lastActivity' ? 'Last Activity Date' : col.charAt(0).toUpperCase() + col.slice(1),
        dataIndex:col,
        key:col.toLowerCase(),
    }))
    leadsTableColumns[columns.indexOf('action')].render = (d)=>{
        return <Button shape="round" onClick={()=>showModal(d)} >All Activities</Button>
    }

    const {getUserLeadsStatus, userLeads, getLeadsStatus} = useSelector(state => ({
        getUserLeadsStatus:state.leads.getUserLeadsStatus,
        userLeads:state.leads.userLeads,
        getLeadsStatus:state.leads.getLeadsStatus
    }))


    // leadsTableColumns[columns.indexOf('amount')].render = (data)=>{
    //     return '₹'+data+'/-'
    // }
    // leadsTableColumns[columns.indexOf('used')].render = (data)=>{
    //     return <Tag color={data?'green':'red'}>{data?'USED':'NOT USED'}</Tag>
    // }
    // leadsTableColumns[columns.indexOf('packages')].render = (data)=>{
    //     let packNames = data.map((p,i)=>(packageId2name(p)))
    //     return packNames.map((packName,i)=>(
    //         <Tag>{packName}</Tag>
    //     ))
    // }
    // const columnNames = ['name', 'email', 'contact', 'username', 'recent', 'action']

    const leadsTableDataSource = data?.data.map((v,i)=>{
        let obj = v._id ? {
            key : i,
            srno:i + 1 +  (10 * data.metadata[0].page) - 10,
            name : v.user.name||'-',
            email : v.user.email,
            contact : v.user.contact,
            // username : v.user.username,
            recent : v.activities[0].title,
            lastActivity:moment(v.activities[0].createdAt).format('DD-MM-YYYY LT'),
            action : v
        } : {}
        return obj
    })
    const showModal = (data) => {
        setIsModalVisible(true);
        setModalData(data)
        setUserData([
            {
                key:0,
                label : 'User Name',
                info : data.user.username 
            },
            {
                key:1,
                label : 'Contact',
                info : data.user.contact 
            },
            {
                key:2,
                label : 'Email',
                info : data.user.email 
            },
            {
                key:3,
                label : 'Date/Time Created',
                info : data.user.createdAt.split('T')[0] + ' / ' + data.user.createdAt.split('T')[1].slice(0,8)
            },
            {
                key:5,
                label : 'Date/Time Updated',
                info : data.user.updatedAt.split('T')[0] + ' / ' + data.user.updatedAt.split('T')[1].slice(0,8) 
            },
    ])
      };
      const handleOk = () => {
        setIsModalVisible(false);
      };
      const handleCancel = () => {
        setIsModalVisible(false);
      };

    const dispatch = useDispatch()

    useEffect(() => {
        if(modalData.user)
            dispatch(getUserLeadsAction({userId:modalData.user._id}))
    }, [modalData, dispatch])

    const handlePageChange = (e) => {
        getLeadsAction(e.current)
    }

    console.log('leadsTableDataSource', leadsTableDataSource?.map(d => d.lastActivity))
    return(
        <>
        <Table loading={getLeadsStatus === STATUS.FETCHING} 
            pagination={{showSizeChanger:false, current:data?.metadata[0]?.page, pageSize:10, total:data?.metadata[0]?.total, position:['bottomCenter', 'topCenter']}}
            dataSource={leadsTableDataSource} 
            columns={leadsTableColumns} 
            bordered
            onChange={handlePageChange}
            // style={{cursor:'pointer'}}
        />
        {modalData?
        <Modal title={modalData.user.name.toUpperCase()|| '[No User Name]'} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={850}>
             <Card title={
                  <div style={{width:"100%"}} >
                    <Space>
                        <Tooltip title={modalData.user.confirmed ? 'User Has Completed his/her Profile' : 'Profile Not Completed yet'}>
                            <Badge offset={[-5,45]} count={modalData.user.confirmed?<CheckCircleFilled style={{color:'#52c41a'}} />:<CloseCircleFilled style={{color:'red'}}/>}>
                                <Image
                                    style={{borderRadius:'50%', objectFit:'cover'}}
                                    height={50}
                                    width={50}
                                    src={modalData.user.avatar || 'error'}
                                    fallback="data:image/png;base64,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"
                                />
                            </Badge> 
                        </Tooltip>
                        <div>
                            {modalData.user?.name}
                        </div>
                    </Space> 
                    <br/><br/>
                    <div style={{display:'flex', width:"100px"}}>
                        <div>
                        <b>Recent Activity : &nbsp;</b> 
   
                        </div>
                       <div style={{flex:1, overscrollX:"auto"}}>
                       <p>{userLeads?.length ? userLeads[Object.keys(userLeads)[0]].title : null}</p>
                        {userLeads?.length ? 
                            <Tag style={{fontSize:12}}>{moment(userLeads[Object.keys(userLeads)[0]].createdAt).format('lll')}</Tag> 
                            : null
                        }
                       </div>
                        {/* <span style={{color:'rgba(0,0,0,0.3)', marginRight:'6px'}}>Recent Activity : </span>
                        <span style={{fontSize:'1.1em',backgroundColor:'#f3fff3', padding:'5px 10px', border:'1px solid rgba(0,0,0,0.1)', borderRadius:'7px'}}>
                            
                        </span> */}
                    </div>       
                  </div>   
            
             } >
               

                {
                    userData.map((item, i)=>(
                        <div key={i} style={{display:'flex', justifyContent:'space-between', margin:'10px', borderBottom:'1px solid #eee', padding:'5px', boxShadow:'2px 2px 3px 0px rgba(0,0,0,0.1)'}} >
                                <span span={10} style={{width:'25%',  borderRight:'1px solid #ddd', textAlign:'left', fontWeight:'bold', color:'rgba(0,0,0,0.5)'}} >{item.label}</span>
                                <span span={14} style={{width:'70%', fontWeight:'bold'}} >{item.info}</span>
                        </div>
                    ))
                }
            </Card>
            <br/>

            <Card style={{border:0}} bodyStyle={{padding:0}} loading={getUserLeadsStatus === STATUS.FETCHING}>
                {/* <Col span={12} style={{height:'250px'}}>
                    <Card title={modalData.userId.name || '-'} type='inner' bordered={true} style={{height:'200px'}}>
                                        
                    </Card>
                </Col> */}
                    {console.log('activity', modalData.activities)}
                <Col span={24} >
                    <Card title="Activities" bordered={true} type='inner' style={{height:'200px', overflowY:'scroll'}}>
                    <Timeline mode='left'>
                        {userLeads?.length ? userLeads.map((activity,i)=>(
                                <Timeline.Item label={activity?.createdAt ? <Tag>{moment(activity.createdAt).format('lll')}</Tag> : '-'} key={i}>{activity.title}</Timeline.Item>
                            )) : null
                        }
                    </Timeline>
                    </Card>
                </Col>
            </Card>
        </Modal>:null}
        </>
    )
}
