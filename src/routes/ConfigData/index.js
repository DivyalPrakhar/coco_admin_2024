import { Card, Tabs, List, Row, Col, Typography, Descriptions, Form, Input, Button, Avatar } from 'antd';
import {useDispatch, useSelector} from 'react-redux' 
import { useState, useEffect, useCallback } from 'react';
import { PlusOutlined, SearchOutlined, EditOutlined } from '@ant-design/icons';
import _, { find, map } from 'lodash';
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { AddConfigDrawer } from '../../components/AddConfigDrawer'
import {getDefaultDataAction} from '../../redux/reducers/LmsConfig'
import { STATUS } from "../../Constants";
import { AddSubjectsModal } from './AddSubjectsModal';


export const ConfigData = () => {
  const dispatch = useDispatch()

  const {configData} = useSelector(s => ({
      user: s.user,
      configData: s.lmsConfig
  }))

  const [currentTab, changeTab] = useState('1')

  useEffect(() => {
  	dispatch(getDefaultDataAction())
  }, [dispatch])

  const { TabPane } = Tabs;

  const _changeTab = (e) => {
	changeTab(e)
  }

  return(
    <div>
      <CommonPageHeader
        title='Config Data'
      />
      <br/>
      <Card loading={configData.defaultDataStatus !== STATUS.SUCCESS}>
      	{configData.defaultDataStatus === STATUS.SUCCESS ?
         <Tabs defaultActiveKey="1" type='card' onChange={_changeTab}>
		    <TabPane tab="SUBJECTS" key="1">
		      <ManageDataRoute currentTab={currentTab} tabType='Subject' defaultData={configData.defaultData.subjects} configData={configData}/>
		    </TabPane>
		    {/*<TabPane tab="STANDARDS" key="2">
		      <ManageDataRoute tabType='Standard' defaultData={configData.defaultData.standards} configData={configData}/>
		    </TabPane>
		    <TabPane tab="BOARD" key="3">
		      <ManageDataRoute tabType='Board' defaultData={configData.defaultData.boards} configData={configData}/>
		    </TabPane>*/}
		    <TabPane tab="COMPETITONS | EXAMS" key="4">
		      <ManageDataRoute currentTab={currentTab} tabType='Competition' defaultData={configData.defaultData.competitions} configData={configData}/>
		    </TabPane>
		  </Tabs>
      	: null}
      </Card>
    </div>
  )
}

export const ManageDataRoute = (props) => {
	const dispatch = useDispatch()
	const [configDrawer, setConfigDrawer] = useState({drawerStatus: false, type: '', drawerType: ''})
	const [listSelectedData, changeListSelected] = useState('')
	const [examSelectedData, changeExamSelected] = useState('')
	const [subjects, changeSubject] = useState(props.defaultData)
	const [searchText, changeSearchText] = useState('')

	useEffect(() => {
		changeSearchText(null)
		changeSubject(props.defaultData)
	}, [props.currentTab, props.defaultData])

	useEffect(() => {
		if(props.configData.addConfigStatus === STATUS.SUCCESS || props.configData.updateConfigStatus === STATUS.SUCCESS){
			changeSubject(props.defaultData)
			
			if(listSelectedData){
				changeListSelectedData(_.find(props.configData.defaultData[_.lowerCase(props.tabType)+'s'], d => d._id === listSelectedData._id))
			}
		}
	}, [props.configData.addConfigStatus, props.configData.updateConfigStatus])

	const changeListSelectedData = useCallback((item) => {
		let newItem = item
		if(props.tabType === 'Competition') {
			let newExams =  newItem && _.map(newItem.exams, s => _.find(props.configData.defaultData.exams, ex => ex._id === s))
			newItem = Object.assign({}, newItem, {exams: newExams})
			changeExamSelected('')
		}
		changeListSelected(newItem)
	},[props.configData.defaultData.exams, props.tabType])

	useEffect(() => {
		
		if(props.tabType === 'Competition' && props.configData.addConfigStatus === STATUS.SUCCESS){
			changeListSelectedData(_.find(props.configData.defaultData.competitions, s => s._id === listSelectedData._id))
		}
	}, [changeListSelectedData, listSelectedData._id, props.configData.addConfigStatus, props.configData.defaultData.competitions, props.configData.defaultData.exams, props.tabType])

	const searchSubject = (e) => {
		changeSearchText(e.target.value)
		let data = props.defaultData.filter(val => _.includes(_.lowerCase(val.name.en), _.lowerCase(e.target.value)))
		changeSubject(data)
	}

	const [addSubjectsModal, openAddSubjectsModal] = useState()

	const _openAddSubjectsModal = (d) => {
		openAddSubjectsModal(!addSubjectsModal)
	}

    const { Title } = Typography;
    return(
        <div>
            <Card>
				<div style={{display:'flex', justifyContent:'space-between'}}>
					<Form.Item>
						<Input style={{width:'300px'}} prefix={<SearchOutlined/>} size='large' value={searchText} placeholder={'Search ' +_.capitalize(props.tabType)} allowClear onChange={searchSubject}/>
					</Form.Item>
					{props.tabType == 'Subject' ? <Button size='large' onClick={_openAddSubjectsModal}>Add Subjects Excel</Button> : null }
				</div>
				
	            <Row gutter={20}>
	                <Col span={6}>
	                    <div style={{maxHeight:'500px', overflow:'auto'}}>
				            <div style={{border:'1px solid #D6DBDF', padding:'10px', position:'sticky', top:0, background:'white', zIndex:9}}>
								<Title level={4}>{props.tabType+'s'} <PlusOutlined style={{float: 'right', paddingTop: '3px'}} onClick={() => setConfigDrawer({drawerStatus: true, type: props.tabType, drawerType: 'add'})}/></Title>
							</div>
							<List
				                bordered
				                itemLayout="horizontal"
				                dataSource={subjects}
				                renderItem={item => {
				                    let selected = listSelectedData._id === item._id 
				                    return(
				                        <List.Item style={{cursor:'pointer'}} className={selected ? 'listItemBg' : ''} onClick={() => changeListSelectedData(item)}>
				                            <List.Item.Meta
				                                title={<div className={selected ? 'listItemBg' : ''} style={{fontSize:'15px'}}>{item.name? `${item.name.en}${item.name.en && item.name.hn ? ' / ' : '' }${item.name.hn}` : null }</div>}
				                            />
				                        </List.Item>
				                    )}
				                }
				            />
				        </div>
	                    <br/><br/>
	                </Col>
	                {listSelectedData ? 
		                <Col span={18}>
		                    {props.tabType == 'Competition' ? 
		                    	<DataComponentForExam  
		                    		tabType={props.tabType} 
		                    		preSelected={examSelectedData}
		                    		competitionData={listSelectedData}
		                    		configAction={(drawerStatus, type, drawerType) => setConfigDrawer({drawerStatus, type, drawerType})}
		                    		changeExamSelected={(data) => changeExamSelected(data)}
		                    		examSelectedData={examSelectedData}
									subjects={props.configData.defaultData.subjects}
		                    	/>
		                    : 
		                    	<DataComponent 
		                    		configAction={(drawerStatus, type, drawerType) => setConfigDrawer({drawerStatus, type, drawerType})}
		                    		tabType={props.tabType} 
		                    		preSelected={listSelectedData}
		                    	/>
		                    }
		                </Col>
	                :
		                <Col sm={18}>
		                	Select Something To Show
		                </Col>
	            	}
	            </Row>
	            <AddConfigDrawer 
					subjects={props.defaultData}
	            	selectedData={configDrawer.drawerType === 'add' ? '' : configDrawer.type === 'Exam' ? examSelectedData : listSelectedData} 
	            	competitionData={configDrawer.type === 'Exam' ? listSelectedData : ''} 
	            	closeDrawer={() => setConfigDrawer({drawerStatus: false, type: '', drawerType: ''})} 
	            	visible={configDrawer.drawerStatus}
	            	type={configDrawer.type}
	            />
            </Card>
			{addSubjectsModal ? <AddSubjectsModal closeModal={_openAddSubjectsModal} visible={addSubjectsModal}/> : null}
        </div>
    )
}

const DataComponent = (props) => {
	const { Title } = Typography;
	return (
		<div style={{padding: '0 20px'}}>
			<Descriptions title={<Title level={4}>{props.tabType + ' Details'}</Title>} layout='vertical' bordered
	    		style={{paddingLeft: '10px'}}
	            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
	            extra={
	                <Button 
	                    icon={<EditOutlined />}
	                    onClick={() => props.configAction(true, props.tabType, 'update')}
	                >
	                    Update
	                </Button>
	            }
	        >
	            <Descriptions.Item label="Name" layout='vertical' span={2}>{props.preSelected.name? `${props.preSelected.name.en}${props.preSelected.name.en && props.preSelected.name.hn ? ' / ' : '' }${props.preSelected.name.hn}` : null}</Descriptions.Item>
				{props.tabType == 'Subject' ? 
	            	<Descriptions.Item label="Short Name" span={2}>{props.preSelected.shortName}</Descriptions.Item>
	            : null}
	        </Descriptions>
		</div>

	)
}

const DataComponentForExam = (props) => {
	const data = props.competitionData.exams
	const { Title } = Typography;
	return (
		<div>
			<Row>
				<Col sm={7}>
					<div style={{maxHeight:'500px', overflow:'auto'}}>
			            <List
			                bordered
			                header={<Title level={4}>Exams <PlusOutlined style={{float: 'right', paddingTop: '3px'}} onClick={() => props.configAction(true, 'Exam', 'add')}/></Title>}
			                itemLayout="horizontal"
			                dataSource={data}
			                renderItem={item => {
			                    let selected = props.preSelected._id == item._id
			                    return(
			                        <List.Item style={{cursor:'pointer'}} className={selected ? 'listItemBg' : ''}  onClick={() => props.changeExamSelected(item)}>
			                            <List.Item.Meta
			                                title={<div className={selected ? 'listItemBg' : ''} style={{fontSize:'15px'}}>
												{item?.image ? 
													<span>
														<Avatar src={item.image} />&nbsp;&nbsp;
													</span>
												: null}
												{item.name? `${item.name.en}${item.name.en && item.name.hn ? ' / ' : '' }${item.name.hn}` : null }
											</div>}
			                            />
			                        </List.Item>
			                    )}
			                }
			            />
			        </div>
			    </Col>
			    <Col sm={17}>
			    	{/* <Descriptions title={<Title level={4}>Competition</Title>} layout='vertical' bordered
			    		style={{paddingLeft: '10px'}}
		                column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
		                extra={
		                    <Button 
		                        icon={<EditOutlined />}
		                        onClick={() => props.configAction(true, 'Competition', 'update')}
		                    >
		                        Update
		                    </Button>
		                }
		            >
		                <Descriptions.Item label="Name" span={2}>{props.competitionData.name? `${props.competitionData.name.en}${props.competitionData.name.en && props.competitionData.name.hn ? ' / ' : '' }${props.competitionData.name.hn}` : null}</Descriptions.Item>
		            </Descriptions> */}
		            {props.examSelectedData ? 
			            <Descriptions title={<Title level={4}>Exam</Title>} bordered layout='vertical'
				    		style={{paddingLeft: '10px', paddingTop: '10px'}}
			                column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
			                extra={
			                    <Button 
			                        icon={<EditOutlined />}
			                        onClick={() => props.configAction(true, 'Exam', 'update')}
			                    >
			                        Update
			                    </Button>
			                }
			            >
			                <Descriptions.Item label="Name" span={2}>
								{props.preSelected?.image ? 
									<span>
										<Avatar src={props.preSelected.image} />&nbsp;&nbsp;
									</span>
								: null}
								{props.preSelected.name? `${props.preSelected.name.en}${props.preSelected.name.en && props.preSelected.name.hn ? ' / ' : '' }${props.preSelected.name.hn}` : null}
							</Descriptions.Item>
							<Descriptions.Item label="Subjects" span={2}>
								{props.preSelected?.subjects.length ? 
									<Col>
										{map(props.preSelected.subjects, sub=>(
											<Row>{find(props.subjects, s=> s._id === sub)?.name?.en}</Row>
										))}
									</Col>
									: 
									null
								}
							</Descriptions.Item>
			            </Descriptions>
			        : null}
			    </Col>
			</Row>
		</div>
	)
}

