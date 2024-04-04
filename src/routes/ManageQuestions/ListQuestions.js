import { Button, Card, Checkbox, Col, Input, List, Popover, Row, Space, Table, Tag, Typography } from 'antd'
import Text from 'antd/lib/typography/Text'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { QuestionFilters, useFilterDataReducer } from '../../components/QuestionFilters'
import { STATUS } from '../../Constants'
import { deleteMultQuestionsAction, deleteQuestionAction, getAllQuestionsAction } from '../../redux/reducers/questions'
import _ from 'lodash'
import { CheckCircleOutlined, CheckCircleTwoTone, DeleteOutlined, EditOutlined, FileDoneOutlined, SearchOutlined } from '@ant-design/icons'
import { findAnswerType, QuestionTypes } from '../../utils/QuestionTypeHelper'
import { ConfirmAlert } from '../../Constants/CommonAlerts'
import { UpdateQuestionModal } from '../../components/UpdateQuestionModal'
import Paragraph from 'antd/lib/typography/Paragraph'
import { AssignChaptersModal } from './AssignChaptersModal'
import Search from 'antd/lib/input/Search'
import { useHistory, useParams } from 'react-router'
import { QuestionUsageModal } from './QuestionUsageModal'
import { renderMathTex } from '../../utils/FileHelper'

export const ListQuestions = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const params = useParams()
    const {updateQue, questionsList, getQueListStatus, deleteQueStatus, deleteMultQuestionsStatus} = useSelector((state) => ({
        questionsList: state.questions.questionsList,
        getQueListStatus:state.questions.getQueListStatus,
        deleteQueStatus: state.questions.deleteQueStatus,
        deleteMultQuestionsStatus:state.questions.deleteMultQuestionsStatus,
        updateQue:state.questions.updateQueStatus
    }))

    const [updateQueModal, changeUpdateQueModal] = useState(false)
    const [openedAction, setOpenedAction] = useState()
    const [chapterModal, changeChapterModal] = useState()
    const [queText, changeQueText] = useState() 
    const [selectedQuestions, selectQuestions] = useState([])
    const [filteredData, setFilteredData] = useFilterDataReducer()
    const [showUsage, setShowUsage] = useState()

    let pureFilteredData = {..._.omitBy(filteredData, _.isEmpty), questionUsage:filteredData?.questionUsage}

    useEffect(() => {
        let page = !params.pageNumber || params.pageNumber === ':pageNumber' ? 1 : params.pageNumber
        dispatch(getAllQuestionsAction({limit:20, page, filters:pureFilteredData}))
    }, [dispatch, params])

    useEffect(() => {
        let page = !params.pageNumber || params.pageNumber === ':pageNumber' ? 1 : params.pageNumber
        if(deleteMultQuestionsStatus === STATUS.SUCCESS || deleteQueStatus === STATUS.SUCCESS){
            dispatch(getAllQuestionsAction({limit:20, page}))
        }
    }, [deleteMultQuestionsStatus, deleteQueStatus])

    // useEffect(() => {
    //     if(getQueListStatus === STATUS.SUCCESS)
    //         selectQuestions([])
    // }, [getQueListStatus])

    const _openActions = (id) => {
        setOpenedAction(id == openedAction ? null : id)
    }

    const deleteQuestion = (data) => {
        ConfirmAlert(() => dispatch(deleteQuestionAction({id:data._id})), 'Are you sure?', null, deleteQueStatus === STATUS.FETCHING, 'Yes')
        setOpenedAction(false)
    }

    const deleteMultQuestions = () => {
        ConfirmAlert(() => dispatch(deleteMultQuestionsAction({questionIds:selectedQuestions})), 'Are you sure?', null, deleteMultQuestionsStatus === STATUS.FETCHING, 'Yes')
    }

    const _updateQueModal = (data) => {
        changeUpdateQueModal(data)
        setOpenedAction(false)
    }

    const closeUpdateQueModal = () => {
        changeUpdateQueModal(false)
    }

    const assignChapters = (data) => {
        changeChapterModal(data?.question ? data : null)
        setOpenedAction(false)

    }

    const actionsList = [
        {title:'Edit', callback:_updateQueModal, icon:<EditOutlined/>},
        {title:'Assign Chapters', callback:assignChapters, icon:<FileDoneOutlined />},
        {title:'Delete', callback:deleteQuestion, icon:<DeleteOutlined/>}
    ]

    const callTheChange = () => {
        // renderMathTex('math-tex-id-que-data')
    }
 
    const columns = [
        {title:<b>Id</b>,  render:(d) =>{            
            return (
                <div style={{textAlign:'center'}}>
                     <span style={{ fontSize:"12px", padding:"4px 8px", border:"0.6px solid #aaaaaa"}}>{d.index}</span>
                     <br/>
                     <br/>
                     <b>{d.id}</b>
                </div>
            )
        }},

        {title:<b>Questions</b>, dataIndex:'question', width:'90%',
            render:que => {
                return <QuestionComponent que={que} showUsage={filteredData?.questionUsage} questionsList={questionsList} callTheChange={() => callTheChange()}/> 
            }
        },
        {title:<b>Actions</b>, dataIndex:'action',
            render:d => {
                return(<Actions data={d} actionsList={actionsList} openAction={_openActions} visible={openedAction}/>)}
        },
    ]
    
    const dataSource = questionsList?.docs?.length ?
        questionsList.docs.map((que,i) => (
            {id:que.display_id, question:que, action:que, key:que._id, index:i + 1 +  (questionsList.limit * questionsList.page) -20}
        )) 
        : []
    
    // useEffect(() => {
    //     if(getQueListStatus === STATUS.SUCCESS){
    //         renderFun()
    //     }
    // }, [getQueListStatus])
    
    useEffect(() => {
        renderMathTex('math-tex-id-que-data')
    })

    const changePage = (e,r) => {
        history.push('/list-questions/'+e)
    }

    const questionText = useCallback((e) => {
        let text = e.target.value
        setFilteredData({type:'searchTextEn', value:text})
    }, [setFilteredData])

    const searchQuestion = ( ) => {
        dispatch(getAllQuestionsAction({limit:20, filters:pureFilteredData}))
    }

    const resetSearch = () => {
        setFilteredData({type:'searchTextEn', value:''})
        let data = pureFilteredData
        data = _.omit(data, ['searchTextEn'])
        dispatch(getAllQuestionsAction({limit:20, filters:data}))
    }

    const selectRow = (e) => {
        selectQuestions(e)
    }

    const handleShowUsage = useCallback(() => {
        let data = {...filteredData}
        data = pureFilteredData
        data =  {...data, questionUsage:!filteredData?.questionUsage}

        setFilteredData({type:'questionUsage', value:!filteredData?.questionUsage})
        dispatch(getAllQuestionsAction({limit:20, filters:data}))
    }, [filteredData, pureFilteredData, setFilteredData, dispatch])

    return(
        <div>
            <CommonPageHeader title='Manage Questions'/>
            <br/>
            <Card>
                <Row>
                    <Col span={4}>
                        <QuestionFilters
                            filteredData={filteredData}
                            setFilteredData={setFilteredData}   
                        />
                    </Col>
                    <Col span={20} style={{padding:'0 20px'}}>
                        <Space style={{marginBottom:20}} size='large'>
                            <Space>
                                <CheckCircleOutlined style={{color:'#27AE60', fontSize:'24px'}}/>
                                <Text>Verified Questions</Text>
                            </Space>
                            <Checkbox checked={filteredData?.questionUsage} onClick={handleShowUsage}>Show Question Usage</Checkbox>
                        </Space>
                        <div style={{display:'flex', width:'100%', marginBottom:20}}>
                            <div style={{flexGrow:1}}>
                                <Search placeholder='Search Question' size='large' value={filteredData?.searchTextEn} onChange={questionText} onSearch={searchQuestion} enterButton="Search"/>
                            </div>
                            <div style={{padding:'0 5px'}}>
                                <Button onClick={resetSearch} size='large'>clear</Button>
                            </div>
                        </div>
                        {selectedQuestions.length ?
                            <div style={{marginBottom:10}}>
                                <Button onClick={deleteMultQuestions} icon={<DeleteOutlined />} danger>
                                    Delete Questions ({selectedQuestions.length})
                                </Button>
                            </div>
                            : null
                        }
                        <Table 
                            rowSelection={{onChange:selectRow, selectedQuestions}}
                            id='math-tex-id-que-data'
                            bordered
                            loading={getQueListStatus === STATUS.FETCHING}
                            columns={columns}
                            dataSource={dataSource}
                            pagination={{
                                position:['bottomCenter', 'topCenter'],
                                showSizeChanger:false,
                                total:questionsList?.total, 
                                current:questionsList?.page, 
                                pageSize:questionsList?.limit, 
                                onChange: (e,r) => changePage(e,r) 
                            }}
                        />
                    </Col>
                </Row>
            </Card>
            {chapterModal ? <AssignChaptersModal visible={chapterModal} defaultData={chapterModal} closeModal={assignChapters}/> : null}
            {updateQueModal ? <UpdateQuestionModal data={updateQueModal} closeModal={closeUpdateQueModal} visible={updateQueModal}/> : null}
        </div>
    )
}

const Actions = ({data, actionsList, openAction, visible}) => {
    return(
        <Popover placement='bottom' trigger="click" visible={data._id == visible}
            onVisibleChange={() => openAction(data._id)}
            content={
                <div>
                    <List size='small' dataSource={actionsList}
                        renderItem={item => (
                            <List.Item className='hover-list-item' style={{cursor:'pointer'}} onClick={() => item.callback(data)}>
                                <span style={{marginRight:'10px'}}>{item.icon}</span>{item.title}
                            </List.Item>   
                        )}
                    />
                </div>
            }
        >
            <Button shape='round' >Actions</Button>
        </Popover>
    )
}

export const QuestionComponent = ({que, callTheChange, questionsList, showUsage}) => {
    const [showAnswers, changeShowAnswers] = useState([])
    const [showSolution, changeShowSolution] = useState([])
    const [showHindi, changeShowHindi] = useState([])
    const [ellipsisState, changeEllipsis] = useState(false)
    const [showChapter, changeShowChapter] = useState([])
    const [usageModal, openUsageModal] = useState()
    
    useEffect(() => {
        callTheChange() 
    }, [showAnswers, showSolution, showHindi, ellipsisState])

    const showOptions = (id) => {
        const data = showAnswers
        changeShowAnswers(_.xor(data, [id]))
    }

    const _showSolution = (id) => {
        const data = showSolution
        changeShowSolution(_.xor(data, [id]))
    }

    const _showHindi = (id) => {
        const data = showHindi
        changeShowHindi(_.xor(data, [id]))
    }

    const showChapters = (id) => {
        let data = _.xor(showChapter, [id])
        changeShowChapter(data)
    }

    const handleShowUsage = (que) => {
        openUsageModal(que)   
    }
    
    const showAnswer = _.findIndex(showAnswers,a => a == que._id) != -1
    const showSolun = _.findIndex(showSolution,a => a == que._id) != -1
    const showHin = _.findIndex(showHindi,a => a == que._id) != -1
    const showChp = _.findIndex(showChapter,a => a == que._id) != -1
    const verified = que.operatorVerified || que.teacherVerified
    const tests = questionsList?.usage?.length ? _.filter(questionsList.usage, (d) => d.questionRefId === que._id) : []

    return (
        <div key={que._id} style={{border:'1px solid #D6DBDF'}} id='math-tex-id-que'>
            
            <div style={{marginBottom:'10px', background:'#F0F3F4', padding:'10px'}}>
                {verified ? <CheckCircleOutlined style={{color:'#27AE60', fontSize:'24px'}} /> : null}

                <Tag color='blue' style={{fontSize:'16px', border:0, marginRight:'20px', fontWeight:'bold'}}>
                    {que.type  && QuestionTypes[que.type]?.shortName}
                </Tag>
                
                <Space style={{float:'right'}}>
                    {showUsage && tests.length ? <Button shape='round' size='small' onClick={() => handleShowUsage({...que, tests})}>
                        <Text style={{color:'#2ECC71', fontWeight:'bold', margin:'0 4px'}}>{tests.length} {tests.length === 1 ? 'test' : 'tests'}</Text>
                    </Button> : null}
                    
                    <Button shape='round' size='small' onClick={() => showChapters(que._id)}>{showChp ? 'Hide Basechapter' : 'Basechapter'}</Button>
                    {findAnswerType(que.type) == 'multiple' ? 
                        <Button shape='round' size='small' onClick={() => showOptions(que._id)}>{showAnswer ? 'Hide Options' : 'Options'}</Button>
                        :
                        <Button shape='round' size='small' onClick={() => showOptions(que._id)}>{showAnswer ? 'Hide Answers' : 'Answers'}</Button>
                    }
                    {que.solution?.en ? 
                        <Button shape='round' size='small' onClick={() => _showSolution(que._id)}>{showSolun ? 'Hide Solution' : 'Solution'}</Button>
                        : null
                    }
                    {que.question?.hn ? 
                        <Button shape='round' size='small' onClick={() => _showHindi(que._id)}>{showHin ? 'English' : 'Hindi'}</Button>
                        : null
                    }
                </Space>
                <br/>
            </div>
            {_.findIndex(showChapter,c => c == que._id) != -1 ?
                <Card bodyStyle={{padding:'10px'}} style={{border:0, marginBottom:'10px'}}>
                    {que.basechapters?.length ?
                        <Space wrap>
                            <span style={{fontWeight:'bold', marginRight:'20px'}}>Basechapters.</span>
                            {_.join(que.basechapters.map(ch=> ch.name.en), ', ')}
                            {/* {que.basechapters.map(ch => 
                                <Tag key={ch._id}>{ch.name.en}</Tag>
                            )} */}
                        </Space>
                        : 
                        <div>
                            <span style={{fontWeight:'bold', marginRight:'20px'}}>Basechapters.</span>
                            <span style={{color:'#AEB6BF'}}>no basechapter assigned</span>
                        </div>
                    }
                </Card>
                : null
            }
            {que.paragraph ? 
                <Card style={{marginBottom:'10px'}} bodyStyle={{padding:'10px'}}>
                    <div style={{display:'flex'}}>
                        <div style={{paddingRight:'10px'}}> <Text style={{fontWeight:'bold', color:''}}>Para.</Text></div>
                        <div>
                            <Paragraph
                                ellipsis={true ?  {rows: 2, expandable: true, onExpand: () => changeEllipsis(!ellipsisState), symbol: 'show'} : false }
                            >
                                <Typography dangerouslySetInnerHTML={{__html:showHin ? que?.paragraph?.body?.hn : que?.paragraph?.body?.en}}/>
                            </Paragraph>
                        </div>
                    </div>
                </Card>
                : null
            }

            <Card style={{border:0, marginBottom:'10px'}} bodyStyle={{padding:'10px'}}>
                <div style={{display:'flex'}}>
                    <div style={{fontWeight:'bold', paddingRight:'10px'}}><Text>Que. </Text></div>
                    <div dangerouslySetInnerHTML={{__html: showHin ? que?.question?.hn : que?.question?.en}}/>
                </div>
            </Card>

            {showAnswer ? 
                que.options.length ?
                    <div style={{display:'flex'}}>
                        <div style={{paddingRight:'10px', visibility:'hidden'}}>Optns.</div>
                        <div style={{width:'100%'}}>
                            <List size='small' bordered style={{padding:0, marginBottom:'10px'}}
                                header={<b style={{color:''}}>Options.</b>}
                                dataSource={que.options}
                                renderItem={(item, i) =>
                                    <List.Item key={item._id}
                                        style={{background:_.findIndex(que.answer,a => a == item._id) != -1 ? '#F1F8E9' : null}}
                                    >
                                        <List.Item.Meta
                                            avatar={ 
                                                <span>
                                                    {_.findIndex(que.answer,a => a == item._id) != -1 ? 
                                                        <span><CheckCircleTwoTone style={{fontSize:'18px'}} twoToneColor="#52c41a"/>&nbsp;&nbsp;</span> : null
                                                    }
                                                    <b>{showHin? String.fromCharCode('क'.charCodeAt() + i) : String.fromCharCode(i + 65)}</b>
                                                </span>
                                            }
                                            description={<div style={{color:'black'}} dangerouslySetInnerHTML={{__html:showHin ? item?.body?.hn : item?.body?.en}}/>}
                                        />
                                    </List.Item>
                                }
                            />
                        </div>
                    </div> 
                    :
                    <Card style={{marginBottom:'10px'}} bodyStyle={{padding:'10px'}}>
                        <div style={{display:'flex'}}>
                            <div style={{paddingRight:'10px'}}><b>Ans.</b></div>
                            <div><div dangerouslySetInnerHTML={{__html:que.answer[1] ? `${que.answer[0]} - ${que.answer[1]}` : que.answer[0]}}/></div>
                        </div>
                    </Card>
                : null
            }
            {showSolun ? 
                <Card bodyStyle={{padding:'10px'}}>
                    <div style={{display:'flex'}}>
                        <div style={{paddingRight:'10px'}}><Text style={{fontWeight:'bold'}}>Solu.</Text><br/></div>
                        <div><div dangerouslySetInnerHTML={{__html:showHin ? que?.solution?.hn : que?.solution?.en}}/></div>
                    </div>
                </Card>
                :
                null
            }
            {usageModal ? <QuestionUsageModal visible={usageModal} question={usageModal} closeModal={() => handleShowUsage(false)}  /> : null}
        </div>
)
}