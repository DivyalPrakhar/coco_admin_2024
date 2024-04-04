import { Button, Card, Col, Descriptions, Form, Input, List, Row, Table, Tabs, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { AiOutlineAudit } from "react-icons/ai";
import Title from 'antd/lib/typography/Title'
import { useDispatch, useSelector } from 'react-redux'
import { getBatchesRequest } from '../../redux/reducers/batches'
import { STATUS } from '../../Constants'
import { sheetToJSON } from '../../utils/FileHelper';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ExportExcel } from '../../components/ExportExcel';
import _ from 'lodash'
import { AddBatchDrawer } from '../../components/AddBatch';
import { useHistory, useParams } from 'react-router-dom';
import { addStudentExcelAction } from '../../redux/reducers/student';

export const ManageBatchRoute = () => {
    const dispatch = useDispatch()
    const params = useParams()
    const [addBatch, setAddBatch] = useState(0)
    const [selectedBatch, selectBatch] = useState()

    const {user, getBatchesStatus, batches, addBatchStatus, updateBatchStatus} = useSelector((state) => ({
        user:state.user.user,
        getBatchesStatus:state.batches.getBatchesStatus,
        batches:state.batches.batches,
        addBatchStatus:state.batches.addBatchStatus,
        updateBatchStatus:state.batches.updateBatchStatus,
    }))

    useEffect(() => {
        dispatch(getBatchesRequest({id:user.staff.institute._id}))
    }, [])

    useEffect(() => {
        if(params.id) 
            selectBatch(_.find(batches,b => b.id == params.id))
    }, [params.id, updateBatchStatus, getBatchesStatus])

    return(
        <div className="site-page-header-ghost-wrapper">
            <CommonPageHeader
                title="Batches"
                subTitle=""
                extra={[
                    <Button onClick={() => setAddBatch(true)} size='large' icon={<PlusOutlined />}> Add Batch</Button>,
                ]}
            />

            <AddBatchDrawer selectedBatch={null} closeDrawer={() => setAddBatch(false)} visible={addBatch}/>

            <br/>
            <Card loading={getBatchesStatus == STATUS.FETCHING}>
                {getBatchesStatus == STATUS.SUCCESS ? 
                    <Row gutter={20}>
                        <Col span={6}>
                            <ListBatches batches={batches} selectedBatch={selectedBatch}/>
                            <br/><br/>
                        </Col>
                        <Col span={18} style={{padding:'0 30px'}}>
                            {selectedBatch &&
                                <Tabs defaultActiveKey='1' type='card'>
                                    <Tabs.TabPane tab='Information' key='1' style={{padding:'0 10px'}}>
                                        <br/>
                                        <BatchDetails updateBatch={() => setAddBatch(true)} batch={selectedBatch}/>
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab='Members' key='2' style={{padding:'0 10px'}}>

                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab='Add Members' key='3' style={{padding:'0 10px'}}>
                                        <br/>
                                        <AddMembers batch={selectedBatch} institute={user.staff.institute}/>
                                    </Tabs.TabPane>
                                </Tabs>
                            }
                        </Col>
                    </Row>
                    :
                    null
                }
            </Card>
        </div>
    )
}

const AddMembers = ({batch, institute}) => {
    const [excelData, onSave] = useState([])
    const dispatch = useDispatch()

    const {alumniExcelStatus} = useSelector((state) => ({
        alumniExcelStatus:state.alumni.alumniExcelStatus
    }))

    const convertFile = (e) => {sheetToJSON(e, onSave)} 

    const data = [{name:'', gender:'', dob:'', contact:'', email:'', address:'', state:'', city:'', pincode:''}]
    
    let dataColumns = excelData && excelData.length ? _.keys(excelData[0]).map(d => ({title:d, dataIndex:d, key:d})) : []

    dataColumns = dataColumns.map(d => d.title == 'Name' || d.title == 'Gender' || d.title == 'Contact' || d.title == 'Address' || d.title == 'State' || d.title == 'City' || d.title == 'Pincode' ? 
            Object.assign(d, {render:tags => tags || <Tag color='red'>Required</Tag>}) : d
        )
    const dataSource = excelData && excelData.length ? excelData.map((d, i) => ({...d, key:++i})) : []

    const addExcel = () => {
        let data = {batchId:batch.id, instituteId:institute._id, data:excelData.map(d => ({user:d}))}
        dispatch(addStudentExcelAction(data))
    }
    
    return(
        <>
            <Form>
                <Form.Item label='Download Template'>
                    <ExportExcel data={data}/>
                </Form.Item>
                <Form.Item label='Upload Excel'>
                    <Input type='file' onChange={convertFile} accept=".xlsx, .xls, .csv"/>
                </Form.Item>
            </Form>
            <br/>

            {dataSource.length ? 
                <Table
                    bordered
                    dataSource={dataSource}
                    columns={dataColumns}
                />
                : null
            }

            <Button disabled={!excelData.length} loading={alumniExcelStatus == STATUS.FETCHING} onClick={addExcel}>
                Add Students
            </Button>
            <br/><br/><br/>
        </>
    )
}

const BatchDetails = ({batch}) => {
    const [updateBatch, setUpdateBatch] = useState()

    return batch ? (
        <div>
            <Descriptions title={<Title level={4}>Batch Information</Title>} bordered 
                column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                extra={
                    <Button 
                        icon={<EditOutlined />}
                        onClick={() => setUpdateBatch(true)}
                    >
                        Update
                    </Button>
                }
            >
                <Descriptions.Item label="Name" span={2}>{batch.name}</Descriptions.Item>
                <Descriptions.Item label="Start Year" onClick={updateBatch}>{batch.startyear || '-'}</Descriptions.Item>
                <Descriptions.Item label="End Year">{batch.endyear || '-'}</Descriptions.Item>
            </Descriptions>

            <AddBatchDrawer selectedBatch={batch} closeDrawer={() => setUpdateBatch(false)} visible={updateBatch}/>
        
        </div>
    ) : <div></div>
}

const ListBatches = ({batches, selectedBatch}) => {
    const data = batches
    const history = useHistory()

    return(
        <div style={{maxHeight:'500px', overflow:'auto'}}>
            <List
                bordered
                header={<Title level={4}>Batches</Title>}
                itemLayout="horizontal"
                dataSource={data}
                renderItem={item => {
                    let selected = selectedBatch && selectedBatch.id == item.id  
                    return(
                        <List.Item style={{cursor:'pointer'}} className={selected ? 'listItemBg' : ''} onClick={() => history.push('/manage-batches/'+item.id)}>
                            <List.Item.Meta
                                avatar={<AiOutlineAudit fontSize='35'/>}
                                title={<div className={selected ? 'listItemBg' : ''} style={{fontSize:'15px'}}>{item.name}</div>}
                                description={<div className={selected ? 'listItemBg' : ''}>{`${item.startyear || '-'} - ${item.endyear || '-'}`}</div>}
                            />
                        </List.Item>
                    )}
                }
            />
        </div>
    )
}