import { Button, Card, DatePicker, Form, Input, List, Radio, Select, Space, Steps, Table, Tabs, Tag } from 'antd'
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { useDispatch, useSelector } from 'react-redux';
import { getStatesAction } from '../../redux/reducers/states';
import { STATUS } from '../../Constants';
import _ from 'lodash'
import { addStudentExcelAction, addStudentAction, resetDuplicateEntries, resetAddStudent, addAddressAction } from '../../redux/reducers/student';
import { sheetToJSON } from '../../utils/FileHelper';
import { ExportExcel } from '../../components/ExportExcel';
import Text from 'antd/lib/typography/Text';
import { UploadImageBox } from '../../components/UploadImageBox';
import { getPackagesAction } from '../../redux/reducers/packages';
import FormItem from 'antd/lib/form/FormItem';
import moment from 'moment';
import { SearchOutlined } from '@ant-design/icons';
import { UploadStudentExcelNew } from './UploadStudentExcelNew';

export const AddStudent = () => {
    const dispatch = useDispatch()
    const [form] = Form.useForm();
    const {states, user, addedStudent, addStudentStatus, addAddressStatus} = useSelector((state) => ({
        states:state.states,
        user:state.user.user,
        addStudentStatus:state.student.addStudentStatus,
        addedStudent:state.student.addedStudent,
        addAddressStatus:state.student.addAddressStatus
    }))

    const [selectedState, setState] = useState('')
    const [profilePic, changeProfilePic] = useState()

    useEffect(() => {
        return () => {
            dispatch(resetAddStudent())
        }
    }, [dispatch])
    useEffect(() => {
        dispatch(getStatesAction())
    }, [dispatch])

    useEffect(() => {
        if(addStudentStatus == STATUS.SUCCESS)
            form.resetFields()
    }, [addStudentStatus])

    useEffect(() => {
        if(addAddressStatus == STATUS.SUCCESS)
            dispatch(resetAddStudent())
    }, [addAddressStatus, dispatch])

    const selectState = (name) => {
        if(_.findIndex(states.statesList,s => s.name == name) != -1)
            setState(_.find(states.statesList,s => s.name == name))
        else
            setState([])
    }

    const addStudent = (e) => {
        let data = {...e, dob:e.dob?.format('YYYY-MM-DD'), pincode:parseInt(e.pincode)}
        dispatch(addStudentAction(data))
    }

    const addAddress = (e) => {
        dispatch(addAddressAction({...e, userId:addedStudent?.user?._id, default:true}))
    }

    const skipAddress = () => {
        dispatch(resetAddStudent())
    }

    const changeImage = (img) => {
        changeProfilePic(img)
    }

    let studentAdded = addStudentStatus == STATUS.SUCCESS
    return(
        <div>
            <CommonPageHeader
                title='Add Student'
            />
            <br/>
            <Card>
                 <Tabs type='card' defaultActiveKey="1">
                    <Tabs.TabPane tab="Add Single Student" key="1">
                        <br/>
                                <div style={{display:'flex', justifyContent:'center'}}>
                                    <Steps style={{width:'70%'}} current={studentAdded ? 1 : 0}>
                                        <Steps.Step title="Student Details" />
                                        <Steps.Step title="Address" />
                                    </Steps>
                                </div>
                                <br/>
                                <Form
                                    form={form}
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 14 }}
                                    layout="horizontal"
                                    size='large'
                                    onFinish={studentAdded ? addAddress : addStudent}
                                >
                                {studentAdded ?
                                    <Card style={{padding:0, border:0}} loading={addStudentStatus == STATUS.FETCHING}>
                                        <Form.Item label='Name'>
                                            <Input value={addedStudent.user.name} disabled/>
                                        </Form.Item>
                                        <Form.Item label="Address" rules={[{ required: true, message: 'Please fill in the field.' }]} name='address'>
                                            <Input.TextArea placeholder='Address'/>
                                        </Form.Item>
                                        <Form.Item label="Landmark" name='landmark'>
                                            <Input placeholder='Landmark'/>
                                        </Form.Item>
                                        <Form.Item label="State" rules={[{ required: true, message: 'Please select state.' }]} name='state'>
                                            <Select showSearch autoComplete='invalid' allowClear placeholder='Select State'
                                                onChange={selectState}
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {states?.statesList ? _.sortBy(states.statesList, ['name']).map(state => 
                                                    <Select.Option value={state.name} key={state.id}>{state.name}</Select.Option>
                                                ) : null}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="City" name='city' rules={[{ required: true, message: 'Please select city.' }]}>
                                            <Select showSearch autoComplete='invalid' allowClear placeholder='Select City'
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {selectedState?.cities?.length ? selectedState.cities.map(city => 
                                                    <Select.Option value={city.name} key={city.id}>{city.name}</Select.Option>
                                                ) : null}
                                            </Select>
                                        </Form.Item>
                                        <CustomInput 
                                            rules={[
                                                { pattern:'^[1-9][0-9]{5}$', message:'Pincode should have 6 digits'}
                                            ]} 
                                            label="Pin Code" required name='pincode' type='number' placeholder='Pincode'
                                        />
                                    </Card>
                                    :
                                    <Card style={{padding:0, border:0}} loading={addStudentStatus == STATUS.FETCHING}>
                                        <Form.Item label="Student Image">
                                            <UploadImageBox ratio={'1:1'} getImage={changeImage}/>
                                        </Form.Item>
                                        <CustomInput label="Name" rules={[{ required: true, message: 'Please fill in the field.' }]} name='name' placeholder='Name'/>
                                        <CustomInput hidden name='instituteId' value={user?.staff.institute._id}/>
                                        <CustomInput hidden name='avatar' value={profilePic?.file?.response?.url}/>
                                        {/* <Form.Item label="Student Image" required>
                                            <ImgUnpload/>
                                        </Form.Item> */}
                                        <Form.Item label="Gender" rules={[{ required: true, message: 'Please pick a gender.' }]} name='gender'>
                                            <Radio.Group required>
                                                <Radio.Button required value="male" >Male</Radio.Button>
                                                <Radio.Button required value="female">Female</Radio.Button>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item label="Date of Birth" rules={[{ required: true, message: 'Please select date of birth.' }]} name='dob'>
                                            <DatePicker name placeholder='Date Of Birth'/>
                                        </Form.Item>
                                        <CustomInput label="E-mail" type='email' name='email' placeholder='Email'/>
                                        <Form.Item label='Contact Number' 
                                            rules={[{ required: true, message: 'Please fill in the field.' }, {pattern:'^[6-9][0-9]{9}$', message:'Enter valid contact number'}]} name='contact'
                                        >
                                            <Input placeholder='Contact Number' type='number'/>
                                        </Form.Item>
                                        <CustomInput label="Father Name" name='fatherName' placeholder='Father Name'/>
                                        <CustomInput label="Father Contact" rules={[{pattern:'^[6-9][0-9]{9}$', message:'Enter valid contact number'}]} name='fatherContact' placeholder='Father Contact'/>
                                        <CustomInput label="Mother Name" name='motherName' placeholder='Mother Name'/>
                                    </Card>
                                }
                                <Form.Item wrapperCol={ {offset: 4}}>
                                    <Button type="primary" loading={addStudentStatus == STATUS.FETCHING || addAddressStatus == STATUS.FETCHING} shape='round' 
                                        htmlType="submit"
                                    >
                                        Add
                                    </Button>&nbsp;&nbsp;&nbsp;
                                    {studentAdded ? 
                                        <Button shape='round' onClick={skipAddress}>Skip address and add new student</Button>
                                        : null
                                    }
                                </Form.Item>
                            </Form>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Upload Excel" key="2">
                        <br/>
                        <UploadStudentExcelNew institute={user.staff.institute}/>
                    </Tabs.TabPane>
                </Tabs>
                <br/>
            </Card>
        </div>
    )
}

const UploadStudentExcel = ({institute}) => {
    
    const { Option } = Select;
    const [excelData, onSave] = useState([])
    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const data = [{name:'', gender:'', dob:'', contact:'', email:'', address:'', state:'', city:'', pincode:'', packageStartDate:'',"amount":"", "utr":"", "remark":""}]

    const {studentExcelStatus, duplicateEntries} = useSelector((state) => ({
        studentExcelStatus:state.student.studentExcelStatus,
        duplicateEntries:state.student.duplicateEntries
    }))

    const [dataSource, setDataSource] = useState([])
    const [dataColumns, setDataColumns] = useState([])
    const [sameEntries, setSameEntries] = useState([])
    const [requiredFields, setRequired] = useState(0)
    const [selectedPackage, setPackage] = useState() 
    const [actionType, changeAction] = useState(false)

    const {packagesList} = useSelector(state => ({
        packagesList:state.packages.packagesList,
    }))

    const packages = [];
    for (let i = 0; i < packagesList.length; i++) {
        packages.push(<Option key={packagesList[i]._id} value = {packagesList[i]._id}>{packagesList[i].name.en}</Option>);
    }


    useEffect(() => {
        if(studentExcelStatus === STATUS.SUCCESS){
            form.resetFields()
            setDataSource([])
        }
    }, [studentExcelStatus])

    useEffect(() => {
        dispatch(getPackagesAction())
    }, [dispatch])

    let searchInput = useRef()

    const search = (title) => ({
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.select(), 100);
            }
        },

        onFilter: (value, record) =>
            record[title]
                ? record[title]
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
                    onFinish={() => {confirm({ closeDropdown: false });}}
                >
                    <Input
                        ref={(node) => {searchInput = node;}}
                        placeholder={`Search ${title}`}
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

    useEffect(() => {
        let checkEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        let data = excelData.map(d => {
            let dob
            const dobm = d.dob && d.dob !== "" &&  moment(d.dob, "DD/MM/YYYY")

            if(dobm?.isValid?.()){
                dob = dobm.format("YYYY-MM-DD")
            }

            let packageStartDate 
            const packageStartDatem = d.packageStartDate && d.packageStartDate !== "" && moment(d.packageStartDate, "DD/MM/YYYY")
            if(packageStartDatem?.isValid?.()){
                packageStartDate = packageStartDatem.format("YYYY-MM-DD")
            }

            return {    
                name:d.name, 
                contact:d.contact?.length === 10 ? d.contact : null , 
                email:checkEmail.test(String(d.email)) ? d.email : null, address:d.address, 
                gender:_.upperCase(d.gender) === 'MALE' || _.upperCase(d.gender) === 'FEMALE' ? _.upperCase(d.gender) : null, 
                dob,
                city:d.city, state:d.state, pincode:d.pincode, 
                packageStartDate,
                amount:d.amount,
                utr: d.utr,
                remark: d.remark,
                // deliverable_address: d.deliverable_address
}    
        })
        
        let x = 0
        _.forEach(data,obj => {
            _.forEach(obj, (val, key) =>{ 
                if(!val && (key === 'contact' || key === 'name')){
                    x += 1
                }
            })
        })
        setRequired(x)

        let dataColumns = data && data.length ? _.keys(data[0]).map(d => ({title:d, dataIndex:d, key:d})) : []
        let columns = ['name', 'gender', 'dob', 'contact', 'email', 'address', 'state', 'city', 'pincode', 'packageStartDate', 'amount',"utr","remark"]
        dataColumns = dataColumns.map(d => _.findIndex(columns,c => _.lowerCase(c) === _.lowerCase(d.title)) !== -1 ? 
            Object.assign(d, {render:tags => 
                {
                    // !tags && (d.title === 'contact' || d.title === 'name' || d.title === 'gender' || d.title === 'dob') && setRequired(requiredFields+1)
                    return tags ? tags :d.title === 'contact' || d.title === 'name' ? 
                        <Tag color='red'>Required</Tag>
                        : '-'
                }}
            )
            : 
            null
        )
        dataColumns = _.compact(_.sortBy(dataColumns,d => _.lowerCase(d.name)))
        
        dataColumns = dataColumns.map(d => 
            d.title==='name' ? {...d, ...search(d.title), sortDirections: ['descend'],  defaultSortOrder:'descend',fixed: "left"} :
            d.title==='contact' ? {...d, ...search(d.title), fixed:"left"}
            : d
        )
        
        let dataSource = data && data.length ? data.map((d, i) => ({..._.omitBy(d,stud =>  !stud), key:++i})) : []
        if(dataSource && dataSource.length){
            let sameData = dataSource.map(d => ({...d, duplicate:_.filter(dataSource,s =>  ((d.contact && d.contact === s.contact) || (d.email && d.email === s.email)) && s.key !== d.key  )}))
            sameData = _.unionBy(_.flattenDeep(sameData.map(d => d.duplicate)), 'key')
           
            setSameEntries(sameData)
        }

        setDataColumns(dataColumns)
        setDataSource(dataSource)
        dispatch(resetDuplicateEntries())
    }, [dispatch, excelData])

    // useEffect(() => {
    //     if(dataSource && dataSource.length){
    //         let data = dataSource.map(d => ({...d, duplicate:_.filter(dataSource,s => s.contact == d.contact)}))
    //     }

    // }, [dataSource])

    const convertFile = (e) => {sheetToJSON(e.target.files, onSave)} 

    const addExcel = () => {
        const pkg = selectedPackage && _.find(packagesList,p => p._id === selectedPackage)
        
        let data = {instituteId:institute._id, update:actionType, 
            data:dataSource.map(d => ({address:{address:d.address, city:d.city, state:d.state, pincode:parseInt(d.pincode), default:true}, ..._.omit(d, ['address', 'state', 'city', 'pincode'])})),
            deliverable:pkg && checkOffline(pkg)
        }
        
        data['packages'] = selectedPackage && [selectedPackage]
        console.log('data', data)
        dispatch(addStudentExcelAction(data))
    }

    const instructions = [
        'Date of birth sould be in format DD-MM-YYYY or DD/MM/YYYY eg. 02-12-2020 or 02/12/2020.',
        'Email and contact should be unique, should not be added earlier.',
        "If updating the students i.e. assigning a package to students, only contact is compulsary",
        "Amount, utr, remark are only considered when assigning a package to student"        
    ]

    function handleChange(value) {
        setPackage(value)
    }

    const _changeAction = (e) => {
        changeAction(e.target.value)
    }

    const checkOffline = (pkg) => {
        return pkg.mode === 'offline' || pkg.type === 'BOOK' || pkg.type === 'DRIVE'
    }

    console.log('selectedPackage', selectedPackage)
    return(
        <>
            <div>
                <List
                    style={{background:'#E3F2FD'}}
                    header={<div style={{fontSize:'16px', fontWeight:'bold', padding:'0 10px'}}>Instructions</div>}
                    dataSource={instructions}
                    renderItem={item => <List.Item style={{padding:'0px 10px 4px'}}>- {item}</List.Item>}
                />
            </div>
            <br/><br/>
            <Form  form={form}  layout="horizontal">
                <Form.Item label='Download Template Excel'>
                    <ExportExcel data={data} filename='StudentExcel'/>
                </Form.Item>
                <Form.Item label='Upload Excel' name='excelFile'>
                    <Input type='file' style={{maxWidth:'50%'}} onChange={convertFile} accept=".xlsx, .xls, .csv"/>
                </Form.Item>
                <Form.Item label='Action'>
                    <Radio.Group onChange={_changeAction} value={actionType}>
                        <Radio value={false}>Add Students</Radio>
                        <Radio value={true}>Update Students</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>

            <br/><br/>
            {dataSource.length ? 
                <Table
                scroll={{x:2000}}
                bordered
                    dataSource={dataSource}
                    columns={dataColumns}
                    pagination={{position:['bottomLeft'], pageSize:10}}
                />
                : null
            }

            <br/>

            {sameEntries?.length ? 
                <div>
                    <Table
                        title={() => <Text type='danger' style={{fontWeight:'bold'}}>Duplicate Entries</Text>}
                        bordered
                        columns={1}
                        dataSource={sameEntries}
                        pagination={{position:['bottomLeft'], pageSize:10}}
                    />
                    <br/>
                    <Text type='danger'>*Duplicate emails & contacts found</Text>
                </div> : null
            }

            {duplicateEntries ? 
                <div>
                    <Text type='danger'><b>*Duplicate Entries</b></Text>
                    {duplicateEntries.contacts?.length ? 
                        <div><Text type='danger'><b>Contacts:</b> {_.join(duplicateEntries.contacts, ', ')}</Text></div>
                        : null
                    }
                    {duplicateEntries.emails?.length ? 
                        <div><Text type='danger'><b>Emails:</b> {_.join(duplicateEntries.emails, ', ')}</Text></div>
                        : null
                    }
                    <br/>
                </div>
                : null
            }
            {excelData && requiredFields ? 
                <div><Text type='danger'>*Fill required fields</Text></div> 
                : null
            }
            <br/>
            {dataSource.length ?
                <>
                    <Text>Select Packages : </Text>
                    <Select showSearch
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        // mode="multiple"
                        allowClear
                        style={{ width: '75%' }}
                        placeholder="Please Select the Packages you want to Assign to These Students"
                        onChange={handleChange}
                    >
                        {packages}
                    </Select>
                </>
                : null
            }
            <br/><br/>
            {dataSource.length ? 
                <Button size='large' disabled={sameEntries.length || requiredFields} loading={studentExcelStatus === STATUS.FETCHING} onClick={addExcel}>
                    Add Students
                </Button>
                : null
            }
            <br/><br/><br/>
        </>
    )
}

const CustomInput = ({label, required, name, placeholder, type, rules, hidden, value}) => {
    return(
        <Form.Item label={label} hidden={hidden} rules={rules} initialValue={value} name={name}>
            <Input placeholder={placeholder} type={type || 'text'}/>
        </Form.Item>
    )
}

