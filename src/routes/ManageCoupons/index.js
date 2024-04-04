import { BookOutlined, DeleteOutlined, EditOutlined, PlusOutlined, HddOutlined, RobotOutlined, EyeOutlined, ColumnHeightOutlined, PictureOutlined, SearchOutlined } from '@ant-design/icons'
//import {} from '@ant-design/icons' 
import { Button, Card, Col, Descriptions, Empty, List, Row, Tabs, Tag, Table, Tooltip, Form, Space, Image, Typography, Select, Input, Switch as AntSwitch, DatePicker } from 'antd'
import Title from 'antd/lib/typography/Title'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { AddCouponsDrawer } from '../../components/AddCouponsDrawer'
import { AddCourseSubjectDrawer } from '../../components/AddCourseSubjectDrawer'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { STATUS } from '../../Constants'
import {getCouponsAction, resetAddCoupon, updateCouponAction, deleteCouponAction} from '../../redux/reducers/coupons'
import {getAllProductsAction} from '../../redux/reducers/products'
import { deleteCourseAction, getCoursesAction } from '../../redux/reducers/courses'
import _ from 'lodash'
import { ConfirmAlert } from '../../Constants/CommonAlerts'
import { useAuthUser } from "../../App/Context";

import moment from 'moment'

import {
    Switch,
    Route,
  } from "react-router-dom";
import { ROUTES } from '../../Constants/Routes'
import Modal from 'antd/lib/modal/Modal'
import DescriptionsItem from 'antd/lib/descriptions/Item'
import Avatar from 'antd/lib/avatar/avatar'
import { getPackagesAction } from '../../redux/reducers/packages'
import Checkbox from 'antd/lib/checkbox/Checkbox'
import { ExportExcel } from '../../components/ExportExcel'
import { bilingualText } from '../../utils/FileHelper'
const { TabPane } = Tabs;
const {Text, Paragraph} = Typography;

export const ManageCoupons = () =>{
    const [couponData, setCouponData] = useState(null)
    return (
        <Switch>
            <Route path={ROUTES.MANAGE_COUPONS} exact component={Coupons} />        
        </Switch>
    )
}
export const Coupons = () => {
    const [form] = Form.useForm()

    const [addCouponsDrawer, setAddCouponsDrawer] = useState(false)
    // const dispatch = useDispatch()
    const columnNames = ['ID', 'Date', 'active', 'used', 'packages', 'amount']
    const [selectedProduct, setSelectedProduct] = useState({})
    const [packagesList,setPackagesList] = useState([])
    const [couponData, setCouponData] = useState(null)
    const [packageId, setPackageId] = useState([])
    const [activeState, setActiveState] = useState(null)
    const [usedState, setUsedState] = useState(null)
    const [dateState, setDateState] = useState('')
    const [couponDates, setCouponDates] = useState([])
    const dispatch = useDispatch()
    
    useEffect(() => {
        let query = {
            packageId: packageId.join(','),
            active : activeState,
            used : usedState,
            createdAt: dateState,
        }
        query = Object.fromEntries(Object.entries(query).filter(([_, v]) => v != null));    
        dispatch(getCouponsAction(query))
    }, [activeState, dispatch, packageId, usedState, dateState])

    const {couponsData} = useSelector((state) => ({
        couponsData: state.coupon
    }))

    const {packages} = useSelector((state) => ({
        packages:state.packages,
    }))

    useEffect(()=>{
        if(packages.getPackagesStatus === STATUS.SUCCESS){
            setPackagesList(packages.packagesList)
        }
    },[packages.getPackagesStatus, packages.packagesList])
    
    useEffect(() => {
        if(couponsData.getCouponsStatus === STATUS.SUCCESS){
            setCouponData(couponsData.CouponsList)
            let d = couponsData.CouponsList.map(v=>v.createdAt.slice(0,10))
            setCouponDates(d)
        }
    }, [couponsData.getCouponsStatus, couponsData])

    function closeDrawer() {
        setAddCouponsDrawer(false)
    }

    const openDrawer = (data) => {
        dispatch(resetAddCoupon())
        setSelectedProduct(data)
        setAddCouponsDrawer(true)
    }

    const tableActions = {
        openDrawer : openDrawer,
    }

    const changePackageId = (e) => {
        setPackageId(e)
    }

    const changeActiveState = (e) => {
        setActiveState(e.target.checked)
    }

    const changeUsedState = (e) => {
        setUsedState(e)
    }

    const changeDateState = (e, dateString) => {
        setDateState(dateString)   
    }

    const formInputStyle = {
        display : 'flex',
        justifyContent : 'center'
    }
    
    const isCouponDate = (date) => {
        return couponDates.includes(date)
    }

    const changeStatus = (value) => {
        setActiveState(value)
    }

    const excelData =  useMemo(()=>{

        if(couponsData.CouponsList && packagesList?.length){
            let newCouponData = couponsData.CouponsList

            let data = newCouponData.map(coupon => {
                let packages = _.intersectionBy(packagesList, coupon.packages.map(d => ({_id:d})), '_id')
                packages = packages.map(n => bilingualText(n.name))
                packages = _.join(packages, ', ')
                return {...coupon, packages}
            })

            data = data.map(d => (
                {
                    active:d.active ? 'Active' : 'Not active',
                    used: d.used ? 'Used' : "Not used",
                    code: d.code,
                    id: d.couponId,
                    date: moment(d.createdAt).format('DD-MM-YYYY'),
                    packages: d.packages,
                    amount: d.amount
                }))
            return data
        }

        return []
            
    },[couponData, packagesList] ) 
    
    return(
        <div>
            <CommonPageHeader
                title='Coupons'
                extra={
                    <Button icon={<PlusOutlined />} onClick={()=>{openDrawer({})}} size='large' shape='round'>
                        Create Coupons
                    </Button>
                }
            />
            <br/>
            <Card title='Filters' >
                <Space wrap size='large'>
                    {packagesList.length? 
                        <Form.Item name='packageId'  style={{formInputStyle}} >
                            <Select style={{width:'300px'}} mode='multiple'  onChange={changePackageId} placeholder='Select Packages' showSearch
                                filterOption={(input, option) =>
                                    option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {packagesList.map((pack,i)=>(
                                    <Select.Option key={pack._id} value={pack._id}>{pack?.name?.en}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>:null
                    }
                    <Form.Item>
                        <DatePicker
                            placeholder="Select Date"
                            onChange={changeDateState}
                            dateRender={current => {
                                const style = {};
                                if (isCouponDate(current.format('YYYY-MM-DD'))) {
                                style.border = '1px solid #1890ff';
                                // style.borderRadius = '50%';
                                // console.log('Now : ', current)
                                }
                                return (
                                <div className="ant-picker-cell-inner" style={style}>
                                    {current.date()}
                                </div>
                                );
                            }}
                        />
                    </Form.Item>
                    <Form.Item  label='Active Status' name='active' style={formInputStyle} >
                        <Select placeholder='Active Status' defaultValue={null} style={{minWidth:'150px'}} onChange={changeStatus}>
                            <Select.Option value={null}>All</Select.Option>
                            <Select.Option value={true}>Active</Select.Option>
                            <Select.Option value={false}>Inactive</Select.Option>   
                        </Select>
                    </Form.Item>
                    <Form.Item label='Used Status' name='used' style={formInputStyle} >
                        <Select placeholder='Used Status' defaultValue={null} style={{minWidth:'150px'}} onChange={changeUsedState}>
                            <Select.Option value={null}>All</Select.Option>
                            <Select.Option value={true}>Used</Select.Option>
                            <Select.Option value={false}>Not Used</Select.Option>   
                        </Select>
                    </Form.Item>
                <Form.Item label='Download Excel'>
                    <ExportExcel data={excelData} filename='Coupon Details'/>
                </Form.Item>
                </Space>
                <Tabs defaultActiveKey="1" >
                    <TabPane tab='Coupons' key="1">
                        <DataTable 
                            columns={columnNames} 
                            getCouponsStatus={couponsData.getCouponsStatus} 
                            updateCouponStatus={couponsData.updateCouponStatus}
                            loading={couponsData.getCouponsStatus == STATUS.FETCHING || couponsData.updateCouponStatus == STATUS.FETCHING}
                            data={couponData} 
                            actions={tableActions}
                        />
                    </TabPane> 
                </Tabs>
            </Card>
            {addCouponsDrawer ? <AddCouponsDrawer visible={addCouponsDrawer} closeDrawer={closeDrawer} defaultSelected={selectedProduct?.type} selectedProduct={selectedProduct} /> : null}
        </div>
    )
}


const DataTable = ({columns, data, loading, getCouponsStatus, updateCouponStatus}) => {
    const [packagesList,setPackagesList] = useState([])
    const dispatch = useDispatch()
    const {packages} = useSelector((state) => ({
        packages:state.packages,
    }))

    const [selectedRowsKeysData, changeSelectedRowsKeys] = useState([])
    const [selectedRowsData, changeSelectedRows] = useState([])
    
    useEffect(() => {
        dispatch(getPackagesAction())
    }, [dispatch])
    useEffect(()=>{
        if(packages.getPackagesStatus === STATUS.SUCCESS){
            setPackagesList(packages.packagesList)
        }
    },[packages.getPackagesStatus, packages.packagesList])

    useEffect(() => {
        if(getCouponsStatus === STATUS.SUCCESS || updateCouponStatus === STATUS.SUCCESS){          
            changeSelectedRowsKeys([])
            changeSelectedRows([])
        }
    }, [getCouponsStatus, updateCouponStatus])

    // const couponTableColumns = columns.map((col,i)=>({
    //     title : col.charAt(0).toUpperCase() + col.slice(1),
    //     dataIndex:col.toLowerCase(),
    //     key:col.toLowerCase(),
    // }))
    // const packageId2name=(id)=>{
    //     if(packagesList.length){
    //         let pack = packagesList.filter((p,i)=>{
    //             return p._id === id
    //         })
    //         return pack[0]?.name?.en
    //     }
    // }
    
    // couponTableColumns[columns.indexOf('active')].render = (data)=>{
    //     return <Tag color={data?'green':'red'}>{data?'ACTIVE':'NOT ACTIVE'}</Tag>
    // }
    // couponTableColumns[columns.indexOf('amount')].render = (data)=>{
    //     return '₹'+data+'/-'
    // }
    // couponTableColumns[columns.indexOf('used')].render = (data)=>{
    //     return <Tag color={data?'green':'red'}>{data?'USED':'NOT USED'}</Tag>
    // }
    // couponTableColumns[columns.indexOf('packages')].render = (data)=>{
    //     let packNames = data.map((p,i)=> _.get(_.find(packagesList, pk => pk._id == p), 'name.en', ''))
        
    //     return packNames.map((packName,i)=>(
    //         <Tag>{packName}</Tag>
    //     ))
    // }

    let searchInput = useRef();

    let columnsData = [
        {
            title : 'ID',
            dataIndex:'id',
            key:'id',
        },
        {
            title : 'Code',
            dataIndex:'code',
            key:'code',
        },
        {
            title : 'Date',
            dataIndex:'date',
            key:'date',
            width:'120px'
            // fixed:'left',
        },
        {        
            title : <div>
                    Active {selectedRowsData.length ? 
                        <span>
                            <Tag color="green" onClick={() => dispatch(updateCouponAction({couponIds: _.map(selectedRowsData, s => s.id), active: true}))}>ACTIVE</Tag>
                            <Tag color="red" onClick={() => dispatch(updateCouponAction({couponIds: _.map(selectedRowsData, s => s.id), active: false}))}>INACTIVE</Tag>
                        </span> 
                    : null}
                </div>,
            dataIndex:'active',
            key:'active',    
            render: (data, record)=>{
                return <Tag color={data?'green':'red'} onClick={() => dispatch(updateCouponAction({couponIds: [record.id], active: !data}))}>{data ? 'ACTIVE' : 'NOT ACTIVE'}</Tag>
            }
        },
        {
            title : 'Used',
            dataIndex:'used',
            key:'used',
            render: (data)=>{
                return <Tag color={data?'green':'red'}>{data?'USED':'NOT USED'}</Tag>
            }
        },
        {
            title: 'Packages',
            dataIndex:'packages',
            key:'packages',
            render: (data)=>{
                let packNames = data.map((p,i)=> _.get(_.find(packagesList, pk => pk._id == p), 'name.en', ''))
                
                return <Text style={{fontSize:'13px'}}>{_.join(packNames, ', ')}</Text>
            }
        },
        {
            title: 'Amount',
            dataIndex:'amount',
            key:'amount',
            render: (data)=>{
                return '₹'+data+'/-'
            }
        },
        {
            title: <div>Action {selectedRowsData.length ? 
                        <Tag color="volcano" onClick={() => dispatch(deleteCouponAction({couponIds: _.map(selectedRowsData, s => s.id)}))}>DELETE</Tag>
                    : null}
                </div>,
            key:'action',
            render: (data)=>{
                return (
                    <div>
                        <Tooltip placement="top" title='Delete Coupon'>
                            <Button type='default' shape='circle' danger icon={<DeleteOutlined />}  onClick={() => dispatch(deleteCouponAction({couponIds: [data.id]}))} />
                        </Tooltip>
                    </div>
                )
            }
        },
    ]

    const couponTableDataSource = data ? _.orderBy(data.map((v,i)=>{
        let tableData = {
            key : i,
            id : v.couponId,
            date : moment(v.createdAt).format('DD-MM-YYYY'),
            active : v.active,
            used : v.used,
            packages : v.packages,
            amount : v.amount,
            code: v.code
        }
        return tableData
    }), 'date', 'desc') : []

    const rowSelection = {
        selectedRowKeys: selectedRowsKeysData,
        onChange: (selectedRowKeys, selectedRows) => {
            changeSelectedRowsKeys(selectedRowKeys)
            changeSelectedRows(selectedRows)
        }
    }
    const history = useHistory()
    const params = useParams()

    const changePage = (e) => {
        history.push(`/coupons/${e.current}`)
    }

    return(
        <>
        <Table 
            key={new Date()} 
            loading={loading}
            dataSource={couponTableDataSource} 
            columns={columnsData}
            onChange={changePage}
            pagination={{ current:parseInt(params.page) || 1,
                position:['bottomCenter', 'topCenter'],
                total: couponTableDataSource.length,
                showSizeChanger:false,
            }} 
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            bordered
            
            style={{cursor:'pointer'}}
        />
        </>
    )
}
