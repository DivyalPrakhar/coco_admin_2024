import { InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Form, Input, List, Row, Space, Steps, Table, Tag, Tooltip } from 'antd'
import _, { map } from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react'
import { ExportExcel } from '../../components/ExportExcel';
import { sheetToJSON } from '../../utils/FileHelper';
import Text from 'antd/lib/typography/Text';
import { STATUS } from '../../Constants';
import { useDispatch, useSelector } from 'react-redux';
import { getStdentBulkPendingAction, studentBulkAssignAction, resetBulkUploadData, studentBulkUpdateAction, studentBulkValidateAction, deleteBulkUploadAction } from '../../redux/reducers/student';

const { Step } = Steps;


export function UploadStudentExcelNew(props) {
    const [ curStep, setCurStep ] = useState(0);
    const [ studentData, setStudentData ] = useState([]);
    const [ isUpdate, setIsUpdate ] = useState(false);
    const [ rKey, changeKey ] = useState(1);
    const [ assignPackages, setAssignPackages ] = useState(false);
    
    const dispatch = useDispatch();

    const bulkValidateHandler = (data) => {
        dispatch(studentBulkValidateAction(data))
    }

    const bulkUpdateHandler = (data) => {
        dispatch(studentBulkUpdateAction(data))
    }

    const bulkAssignHandler = (data) => {
        dispatch(studentBulkAssignAction(data))
    }

    const bulkCancelHandler = (data) => {
        dispatch(deleteBulkUploadAction(data));
    }
    
    useEffect( () => {
        dispatch(getStdentBulkPendingAction());
    },[])

    const {uploadBulkStatus, getBulkUploadStatus, bulkStudentUpload, deleteBulkUploadStatus} = useSelector((state) => ({
        uploadBulkStatus:state.student.uploadBulkStatus,
        bulkStudentUpload: state.student.bulkStudentUpload,
        getBulkUploadStatus:  state.student.getBulkUploadStatus,
        deleteBulkUploadStatus: state.student.deleteBulkUploadStatus
    }))

    useEffect( () => {
        if(!bulkStudentUpload){
            setCurStep(0);
            setStudentData([])
            return;
        }
        if(bulkStudentUpload?.status === "validated")
            setCurStep(1)
        else if(bulkStudentUpload?.status === "added")
            setCurStep(2)
        else if(bulkStudentUpload?.status === "success")
            setCurStep(3)
        setStudentData(bulkStudentUpload.uploadedJsonData)
    },[bulkStudentUpload])

    const steps = [
        {
            title: "Upload excel",
            description: "upload data of student in excel format"
        },
        // {
        //     title: "Validate data",
        //     description: "check if data is correct"
        // },
        {
            title: "Add & update students",
            description: "add new students"
        },
        {
            title: "Assign packages",
            description: "assign package to students"
        },
        {
            title: "Final check"
        },
    ]

    const handelDoneBulkUpload = () => {
        dispatch(resetBulkUploadData())
    }

    const toNext = () => {
        if(curStep === 0){
            bulkValidateHandler({jsonData: studentData, isUpdate, assignPackages });
        }else if(curStep === 1){
            bulkUpdateHandler({ _id: bulkStudentUpload._id })
        }else if(curStep === 2){
            bulkAssignHandler({ _id: bulkStudentUpload._id })
        }
    }
    const cancelUpload = () => {
        bulkCancelHandler({ _id: bulkStudentUpload._id })
    }

    return (
        <div>
            <Card
                loading={getBulkUploadStatus === STATUS.FETCHING}
                bordered={false} 
                style={{ width: '100%' }}
            >
                <Row>
                    <Col style={{ marginBottom: '40px', position: 'sticky', top:'30vh' }} span={6}>
                        <Steps direction="vertical" current={curStep}>
                            {
                                map(steps, s => <Step key={s.title} title={s.title}/> )
                            }
                        </Steps>
                    </Col>
                    <Col span={18}>
                        <div style={{ marginBottom: '15px' }}>
                            <Row style={{ justifyContent: 'space-between' }}>
                                <Col>
                                    <div>{steps[curStep]?.title}</div>
                                </Col>
                                <Col>
                                {
                                    curStep !== 3 ?
                                    <>
                                        { curStep !== 0 && <Button onClick={cancelUpload} loading={ STATUS.FETCHING === deleteBulkUploadStatus } style={{ marginRight: '15px' }}>Cancel</Button> }
                                        <Button type='primary' onClick={toNext} loading={uploadBulkStatus === STATUS.FETCHING}>Update</Button>
                                    </>
                                    :
                                        <Button type='primary' onClick={ handelDoneBulkUpload }>Done</Button>      
                                }
                                </Col>
                            </Row>
                        </div>
                        {
                            curStep === 0 ?
                                <>
                                    <UploadStudentExcel changeKey={changeKey} key={rKey} setStudentData={setStudentData} toNext={ toNext }/>
                                    <Row style={{ marginBottom: '10px' }}>
                                        <div style={{ marginRight: '10px' }}>
                                            <Checkbox checked={isUpdate} onChange={ (e) => setIsUpdate(e.target.checked) }>Update</Checkbox>
                                        </div>
                                        <div>
                                            <Checkbox checked={assignPackages} onChange={ (e) => setAssignPackages(e.target.checked) }>Assign packages</Checkbox>
                                        </div>
                                    </Row>
                                </>
                            :
                            null
                        }
                        {
                            studentData?.length > 0 &&
                            <ValidateData data={studentData}/>
                        }
                    </Col>
                </Row>
            </Card>
        </div>
    )
}

const UploadStudentExcel = ({ toNext, setStudentData, changeKey }) => {
   const excelColumnsData = [{name:'', gender:'', dob:'', contact:'', altContact: '', email:'', address:'', state:'', city:'', pincode:'', packageSerial:'', packageId:'', packageStartDate:'',"amount":"", "utr":"", "remark":"", installment: '', pending: '', mode: '', lang:'', receiptNo: '', deliverable: '' }]
   const [ fileSelected, setIsFileSelected ] = useState(false);
   const instructions = [
        'Date of birth sould be in format DD-MM-YYYY or DD/MM/YYYY eg. 02-12-2020 or 02/12/2020.',
        'Email and contact should be unique, should not be added earlier.',
        "If updating the students i.e. assigning a package to students, only contact is compulsary",
        "Amount, utr, remark are only considered when assigning a package to student"        
    ]
    const convertFile = (e) => { if(e?.target?.files){ setIsFileSelected(true); sheetToJSON(e.target.files, handleNewExcelData)}} 

    const handleNewExcelData = (excelData) => {
        let checkEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let data = _.map(_.groupBy(excelData, 'contact'), (packages, contact) => {
            let d = packages[0];
            let dob
            const dobm = d.dob && d.dob !== "" &&  moment(d.dob, "DD/MM/YYYY")
            if(dobm?.isValid?.()){
                dob = dobm.format("YYYY-MM-DD")
            }

            return {    
                name:d.name, 
                contact:d.contact?.length === 10 ? d.contact : null ,
                altContact: d.altContact?.length === 10 ? d.altContact : null,
                email:checkEmail.test(String(d.email)) ? d.email : null, 
                gender:_.upperCase(d.gender) === 'MALE' || _.upperCase(d.gender) === 'FEMALE' ? _.upperCase(d.gender) : null, 
                dob,
                address:{
                    address: d.address,
                    city:d.city,
                    state:d.state,
                    pincode: d.pincode,
                },
                packageData : _.map(_.filter(packages, pck => pck.packageId || pck.packageSerial ), p => {
                    let packageStartDate 
                    const packageStartDatem = p.packageStartDate && p.packageStartDate !== "" && moment(p.packageStartDate, "DD/MM/YYYY")
                    if(packageStartDatem?.isValid?.()){
                        packageStartDate = packageStartDatem.format("YYYY-MM-DD")
                    }
                    return ({
                        packageStartDate,
                        amount:p.amount,
                        utr: p.utr,
                        remark: p.remark,
                        packageSerial: p.packageSerial,
                        packageId: p.packageId,
                        installment: p.installment,
                        pending: p.pending,
                        mode: p.mode, lang: p.lang, receiptNo: p.receiptNo, deliverable: p.deliverable
                    })
                })
                // deliverable_address: d.deliverable_address
            }    
        })
        setStudentData(data);
        // toNext();
    }

    const handleClear = () => {
        setIsFileSelected(false);
        setStudentData([]);
        changeKey( k => k + 1 )
    }

    return (
        <div>
            <List
                style={{background:'#E3F2FD'}}
                header={<div style={{fontSize:'16px', fontWeight:'bold', padding:'0 10px'}}>Instructions</div>}
                dataSource={instructions}
                renderItem={item => <List.Item style={{padding:'0px 10px 4px'}}>- {item}</List.Item>}
            />
            <div style={{ marginTop: '20px' }}>
                <Form.Item label='Download Template Excel'>
                    <ExportExcel data={excelColumnsData} filename='StudentExcel'/>
                </Form.Item>
                <Form.Item label='Upload Excel' name='excelFile'>
                    <Row>
                        <Input type='file' style={{maxWidth:'50%'}} onChange={convertFile} accept=".xlsx, .xls, .csv"/>
                        {
                            fileSelected && <div style={{ marginLeft: '10px' }}>
                                <Button onClick={ handleClear }>Clear</Button>
                            </div>
                        }
                    </Row>
                </Form.Item>
            </div>
        </div>
    )
}

const ValidateData = ({data}) => {

    
    const [dataSource, setDataSource] = useState([])
    const [dataColumns, setDataColumns] = useState([])
    const [sameEntries, setSameEntries] = useState([])
    const [requiredFields, setRequired] = useState(0)

    const { duplicateEntries} = useSelector((state) => ({
        duplicateEntries:state.student.duplicateEntries
    }))
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

    useEffect( () => {
        
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
        let columns = ['name', 'gender', 'dob', 'contact', 'altContact', 'email', 'address', 'state', 'city', 'pincode']
        dataColumns = _.filter(dataColumns.map(d => _.findIndex(columns,c => _.lowerCase(c) === _.lowerCase(d.title)) !== -1 ? 
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
        ))
        // dataColumns = _.compact(_.sortBy(dataColumns,d => _.lowerCase(d.name)))
        
        dataColumns = _.map(dataColumns, d => 
            {
               return d.title==='name' ? {...d, ...search(d.title), sortDirections: ['descend'],  defaultSortOrder:'descend'} :
                d.title==='contact' ? {...d, ...search(d.title)}
                : d
            }
        )
        
        let dataSource = data && data.length ? data.map((d, i) => ({..._.omitBy(d,stud =>  !stud), key:++i})) : [];
        dataSource = _.map(dataSource, d => ({...d, address: d.address.address + " " }))
        if(dataSource && dataSource.length){
            let sameData = dataSource.map(d => ({...d, duplicate:_.filter(dataSource,s =>  ((d.contact && d.contact === s.contact) || (d.email && d.email === s.email)) && s.key !== d.key  )}))
            sameData = _.unionBy(_.flattenDeep(sameData.map(d => d.duplicate)), 'key')
            setSameEntries(sameData)
        }
        setDataColumns(dataColumns)
        setDataSource(dataSource)
    },[data]);

    const TooltipLabel = ({d}) => (<div>
        <div>
            Pending: {d.pending}
        </div>
        <div>
            Mode : {d.mode}
        </div>
        <div>
            Lang : {d.lang}
        </div>
        <div>
            Receipt No : {d.receiptNo}
        </div>
        <div>
            Deliverable : {d.deliverable}
        </div> 
        <div>
            Remark : {d.remark}
        </div>
    </div>);

    const expandedRowRender = (record) => {
        if(!(record.packageData?.length > 0)) return;
        
        return (
            <div>
                <div style={{ fontWeight: 'bold', marginBottom: '15px' }}>Packages
               
                </div>
                <Row style={{ wrap: 'wrap' }}>
                    {
                        _.map(record.packageData, d => {
                            return (
                                    <Col span={3} style={{ marginRight: '15px' }}>
                                        <div>
                                            <div>
                                               { d.packageSerial && 'Serial' }{ d.packageSerial && d.packageId && '/' }{d.packageId && 'Id' } : {d.packageSerial && d.packageSerial }{ d.packageSerial && d.packageId && '/' }{d.packageId && d.packageId}
                                            </div>
                                            <div>
                                                Start Date : {d.packageStartDate}
                                            </div>
                                            <div>
                                                UTR : {d.utr}
                                            </div>
                                            <div>
                                                Installment: {d.installment}
                                            </div>
                                            <div style={{ cursor: 'pointer', marginTop: '10px' }}>
                                                    <Tooltip placement='bottom' title={ <TooltipLabel d={d} /> }>
                                                        <Button type='dashed'>
                                                            <InfoCircleOutlined style={{ marginRight: '4px', color: '#2566e8' }}/>
                                                            more info 
                                                        </Button>
                                                    </Tooltip>
                                            </div>
                                        </div>
                                    </Col>
                            )
                        })
                    }
                </Row>
            </div>
        )
    }

    return (
    <div>
        {dataSource.length ? 
            <Table
            scroll={{x:2000}}
            bordered
                dataSource={dataSource}
                columns={dataColumns}
                pagination={{position:['bottomLeft'], pageSize:10}}
                expandable={{
                    defaultExpandAllRows: true,
                    expandedRowRender: expandedRowRender,
                    rowExpandable: record => record.packageData?.length > 0
                }}
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
        {data && requiredFields ? 
            <div><Text type='danger'>*Fill required fields</Text></div> 
            : null
        }
    </div>
    )
} 