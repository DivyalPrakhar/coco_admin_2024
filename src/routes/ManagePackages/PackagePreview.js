import { LinkOutlined, EditOutlined, QuestionCircleOutlined, ProfileOutlined, CheckSquareOutlined } from '@ant-design/icons'
import { Descriptions, Image, Tag, Badge, Tabs, Table, Divider, Card, Button, List, Popover, Row, Col, Carousel} from 'antd'
import Text from 'antd/lib/typography/Text'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useReducer } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { CkeditorModal } from '../../components/CkeditorModal'
import { STATUS } from '../../Constants'
import { FormReducer } from '../../utils/FormReducer'
import _ from 'lodash'
import { addPackageAction, updatePackageAction } from '../../redux/reducers/packages'
import { checkHtml } from '../../utils/FileHelper'
import moment from 'moment'
import { ImagePreview } from '../../components/ImagePreview'
import { getAssignmentsAction, resetGetAssignments } from '../../redux/reducers/assignments'
import { FaRupeeSign } from 'react-icons/fa'

const statusData = {
        '0': {backgroundColor: '#ffe9de', status: 'error', text: 'NOT PUBLISHED'},
        '1': {backgroundColor: '#dee9ff', status: 'processing', text: 'PUBLISHED'},
        '2': {backgroundColor: '#fff2de', status: 'warning', text: 'COMING SOON'},
    }

export const PackagePreview = ({currentPackage, contentTypes}) => {
    const dispatch = useDispatch()
    const [currentTab, changeTab] = useState('courses')
    
    const {packages, course, product, assignments} = useSelector(state => ({
        packages: state.packages,
        course:state.course,
        product:state.product,
        assignments:state.assignments
    }))

    useEffect(() => {
        dispatch(getAssignmentsAction())
    }, [])

    const _changeTab = (tab) => {
        changeTab(tab)
    }

    const onChange = () => {
       
    }

    let currentOffer = _.find(currentPackage?.offers, s => s.active)
    return(
        currentPackage ?  
            <div>  
                <Card>
                    <Row>
                        <Col span={7}>
                            <Carousel afterChange={onChange} autoplay>
                                {_.map(currentPackage?.carousel, img => 
                                    <div style={{width: '320px'}}>
                                        <img height='190px' src={img}/>
                                    </div>
                                )}
                            </Carousel>
                        </Col>
                        <Col span={17}>
                            <div>
                                <div>
                                    <Row>
                                        <Col span={12}>
                                            <span style={{color: '#2db7f5', fontSize: '24px'}}>{currentPackage?.name?.en +' / '+ currentPackage?.name?.hn}</span>
                                        </Col>
                                        <Col span={12} style={{textAlign: 'right', paddingTop: '5px'}}>
                                            <Badge 
                                                style={{background: statusData[currentPackage?.published]?.backgroundColor, padding: '2px 10px', borderRadius: '4px'}} 
                                                status={statusData[currentPackage?.published]?.status} 
                                                text={<span>{statusData[currentPackage?.published]?.text}</span>} 
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                <div>
                                    <p style={{fontSize: '16px'}}>
                                        <div dangerouslySetInnerHTML={{__html:currentPackage?.description?.en}}/>
                                        <br/>
                                        <div dangerouslySetInnerHTML={{__html:currentPackage?.description?.hn}}/>
                                    </p>
                                </div>
                                <div>
                                    <Row>
                                        <Col span={8}>
                                            <div style={{fontSize:'16px'}}>
                                                <b style={{fontSize:'18px', paddingRight: '10px'}}>Medium:</b><span>{_.toUpper(currentPackage?.medium)}</span>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div style={{fontSize:'16px'}}>
                                                <b style={{fontSize:'18px', paddingRight: '10px'}}>Target Year:</b><span>{currentPackage?.targetYear}</span>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div style={{fontSize:'16px'}}>
                                                <b style={{fontSize:'18px', paddingRight: '10px'}}>Mode:</b><span style={{color: currentPackage?.mode == 'offline' ? '#faae3a' : 'green'}}>{_.toUpper(currentPackage?.mode)}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                                <div>
                                    <Row>
                                        <Col span={8}>
                                            <div style={{fontSize:'16px'}}>
                                                <b style={{fontSize:'18px', paddingRight: '10px'}}>Price:</b><span style={{color: 'green'}}>₹{currentPackage?.price +' (+'+currentPackage.gst+'% GST)'}</span>&nbsp;&nbsp;{currentPackage?.fakePrice ? <span><s>₹{currentPackage?.fakePrice}</s></span> : null}
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div style={{fontSize:'16px'}}>
                                                <b style={{fontSize:'18px', paddingRight: '10px'}}>Date:</b><span>{moment(currentPackage?.startDate).format('DD-MM-YYYY') +' TO '+ moment(currentPackage?.endDate).format('DD-MM-YYYY')}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                                <br/>
                                <div>
                                    {_.map(currentPackage?.tags, s => {
                                        return s && (
                                            <Tag key={s._id} style={{fontSize:'14px', padding:'1px 5px', marginTop: '5px'}} color="#2db7f5">
                                                {s.name}
                                            </Tag>
                                        )}
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <br/>
                    {currentOffer ? <Divider orientation="left">Package Offer</Divider> : null}
                    {currentOffer ? 
                        <Badge.Ribbon placement='end' text='ACTIVE OFFER' style={{color: '#3b9d3b', fontSize: '16px', backgroundColor: '#3b9d3b'}}>
                            <Descriptions bordered size="middle">
                                <Descriptions.Item label="Title">{currentOffer?.title || '--'}</Descriptions.Item>
                                <Descriptions.Item label="Descriptions" span={2} contentStyle={{maxWidth: '100px'}}>{currentOffer?.description || '--'}</Descriptions.Item>
                                <Descriptions.Item label="Price">{currentOffer?.price || '--'}</Descriptions.Item>
                                <Descriptions.Item label="Fake Price">{currentOffer?.fakePrice || '--'}</Descriptions.Item>
                                <Descriptions.Item label="Start Date - End Date">{moment(currentOffer?.startDate).format('DD-MM-YYYY')+' - '+moment(currentOffer?.endDate).format('DD-MM-YYYY')}</Descriptions.Item>
                                {_.isEmpty(_.compact(currentOffer?.carousel)) ? null :
                                    <Descriptions.Item label="Images">
                                        <div style={{display:'flex', alignItems:'stretch'}}>
                                            {_.compact(currentOffer?.carousel).length ? _.compact(currentOffer?.carousel).map(img => 
                                                <div style={{display:'flex', alignItems:'center', cursor:'pointer', margin:'4px', padding:'6px', border:'1px solid #AEB6BF'}}>
                                                    <div style={{width:'100px'}}>
                                                        <Image src={img}/>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </Descriptions.Item>
                                }
                            </Descriptions>
                        </Badge.Ribbon>
                    : null}
                    <br/>
                    <Divider orientation="left">Assigned Content</Divider>
                    <div>
                        <Tabs 
                            onChange={_changeTab} 
                            activeKey={currentTab} 
                            tabBarExtraContent={
                                <Badge 
                                    style={{background: '#dee9ff', padding: '2px 10px', borderRadius: '4px'}} 
                                    status='processing'
                                    key={currentTab} 
                                    text={<span>{'TOTAL '+_.toUpper(currentTab)+': '+ currentPackage[currentTab]?.length}</span>} 
                                />
                            }
                        >
                            <Tabs.TabPane key='courses' tab='Course'>
                                <CommonCard currentPackage={currentPackage} type='courses'/>
                            </Tabs.TabPane>
                            <Tabs.TabPane key='books' tab='Book'>
                                <CommonCard currentPackage={currentPackage} type='books'/>
                            </Tabs.TabPane>
                            <Tabs.TabPane key='drives' tab='Drive'>
                                <CommonCard currentPackage={currentPackage} type='drives'/>
                            </Tabs.TabPane>
                            <Tabs.TabPane key='magazines' tab='Magazine'>
                               <CommonCard currentPackage={currentPackage} type='magazines'/>
                            </Tabs.TabPane>
                            <Tabs.TabPane key='assignments' tab='Assignment'>
                                <CommonCard assignments={assignments.assignmentsList} currentPackage={currentPackage} type='assignments'/>
                            </Tabs.TabPane>
                            <Tabs.TabPane key='tests' tab='Test'>
                                <CommonCard currentPackage={currentPackage} type='tests'/>
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                </Card> 
            </div>
        : null
    )
}

const CommonCard = ({currentPackage, type, assignments}) => {
    const history = useHistory()
    const [assignedAssignments, changeAssignedAssignments]  = useState([])
    const [popupVisible, changePopupVisible] = useState()

    const _updateAssignedAssignments = () => {
        let data = currentPackage.assignments?.length ? _.intersectionBy(assignments.map(d => ({...d, assignmentId:d._id})), currentPackage.assignments, 'assignmentId') : []
        data = data.map(d => {
            let assnmnt = _.find(currentPackage.assignments,a =>  a.assignmentId == d._id)
            return  ({...d, maximumMarks:assnmnt?.maximumMarks, startDate:assnmnt?.startDate, endDate:assnmnt?.endDate})
        })
        changeAssignedAssignments(data)
    }

    useEffect(() => {
        if(type === 'assignments'){
            _updateAssignedAssignments()
        }
    }, [])

    const updateTest = (test) => {
        history.push(`/update-test/${test._id}/1`)
        changePopupVisible(false)
    }

    const StudentsAndResult = (test) => {
        history.push('/students-and-result/'+test._id)
        changePopupVisible(false)
    }

    const openActions = (id) => {
        changePopupVisible(id === popupVisible ? false : id)
    }

    const actionsList = [
        {title:'Edit Test', icon:<EditOutlined />, callback:updateTest},
        {title:'Students and Result', icon:<ProfileOutlined />, callback:StudentsAndResult}
    ]

    const assignedTests = _.map(currentPackage?.tests, s => {
                                let {test, ...otherData} = s
                                return Object.assign({}, test, {testPackageDetails: otherData})
                            })


    return(
        <Card bodyStyle={{padding:'10px'}} style={{border:'1px solid #AEB6BF'}}>
            <div style={{background:'#E8F6F3', padding:'5px 20px'}}>
                <Text style={{fontWeight:'bold', color:'#3498DB', fontSize:'18px'}}>{_.capitalize(type)}</Text>
            </div>
            <Divider style={{margin:'10px'}}/>
            {type == 'assignments' ? 
                <Table bordered dataSource={assignedAssignments} pagination={false}>
                    <Table.Column title='Title' dataIndex='title' key='title' render={d => <Text>{d}</Text>}></Table.Column>
                    <Table.Column title='Description' dataIndex='description' key='description' render={d => <Text>{d}</Text>}></Table.Column>
                    <Table.Column title='Question Paper' dataIndex='questionPaper' key='questionPaper' render={(d) => d && <a href={d} target='_black'><LinkOutlined/>attachment</a>}
                    ></Table.Column>
                    <Table.Column title={<b>Maximum Marks</b>} dataIndex='maximumMarks' key='maximumMarks' render={d => d}></Table.Column>
                    <Table.Column title={<b>Start & End Date</b>} key='startDate' render={(d, row) => <div>{(row.startDate != undefined ? moment(row.startDate) : '' )+' - '+ (row?.endDate != undefined ? moment(row.endDate) : '')}</div>}></Table.Column>
                </Table>
            : type === 'tests' ? 
                <Table ordered dataSource={assignedTests} pagination={false}>
                    <Table.Column title='Ref Id' dataIndex='referenceId' key='referenceId' render={id => <Text>{id}</Text>}/>
                    <Table.Column title='Name' dataIndex='name' key='name' render={d => <Text>{d?.en}</Text>}/>
                    <Table.Column title='Platform' dataIndex='testType' key='testType'/>
                    <Table.Column title='Time Duration (min)' dataIndex='totalTime' key='time'/>
                    <Table.Column title='Questions' key='queCont' render={d => _.size(_.flatMap(d.sections, 'questions'))}/>
                    <Table.Column title='Status' dataIndex='status' key='status'/>
                    <Table.Column title='Date' key='date' render={data => {
                        let startDate = data?.testPackageDetails?.startDate ? moment(data?.testPackageDetails?.startDate).format('DD/MM/YYYY') : ''
                        let endDate = data?.testPackageDetails?.endDate ? moment(data?.testPackageDetails?.endDate).format('DD/MM/YYYY') : ''
                        return startDate +' - '+ endDate
                    }}
                    />
                    <Table.Column title='Actions' key='actions'
                        render={(d) =>(
                            <Popover trigger="click" onVisibleChange={() => openActions(d._id)} placement='bottom' style={{padding:0}} visible={d._id === popupVisible}
                                content={
                                    <List size='small' style={{padding:'0'}} dataSource={actionsList}
                                        renderItem={item =>
                                            <List.Item className='hover-list-item' onClick={() => item.callback(d)} style={{cursor:'pointer', padding:5}}>
                                                {item.icon}&nbsp; {item.title}
                                            </List.Item>
                                        }
                                    />
                                }
                            >
                                <Button>Actions</Button>
                            </Popover>
                        )}
                    ></Table.Column>
                </Table>
            :
                <Table  
                    bordered 
                    dataSource={currentPackage[type]} 
                    pagination={false} 
                >
                    <Table.Column title='Name' dataIndex='name' key='name' render={d => <Text>{d?.en || d}</Text>}></Table.Column>
                    <Table.Column title='Description' dataIndex='description' key='description' render={d => <Text>{d?.en || d}</Text>}></Table.Column>
                </Table>
            }

        </Card>
    )
} 