import { Button, Card, Col, List, Row, Table, Tag, Typography, Modal, Collapse, Badge, Space, Alert, Checkbox, Drawer} from 'antd'
import Text from 'antd/lib/typography/Text'
import { useEffect, useState, useContext, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SelectQuestionFilter, useFilterDataReducer } from './SelectQuestionFilter'
import { STATUS } from '../../Constants'
import { getAllQuestionsAction } from '../../redux/reducers/questions'
import { addQuestionsToTestAction, resetAddQuestionToTestStatus } from '../../redux/reducers/test'
import _ from 'lodash'
import { CheckCircleTwoTone, CheckCircleOutlined } from '@ant-design/icons'
import { QuestionTypes } from '../../utils/QuestionTypeHelper'
import Paragraph from 'antd/lib/typography/Paragraph'
import {CurrentTestContext} from './AddTest'
import { QuestionUsageModal } from '../ManageQuestions/QuestionUsageModal'
import { renderMathTex } from '../../utils/FileHelper'
import Search from 'antd/lib/input/Search'


export const SelectQuestionModal = ({visible, closeModal, queTypeGroup, subject}) => {
    const currentData = useContext(CurrentTestContext)
    const dispatch = useDispatch()

    const {questionsList, getQueListStatus, addQuestionToTestStatus} = useSelector((state) => ({
        questionsList: state.questions.questionsList,
        getQueListStatus:state.questions.getQueListStatus,
        addQuestionToTestStatus: state.test.addQuestionToTestStatus
    }))
    const { Panel } = Collapse;
    const [showAnswers, changeShowAnswers] = useState([])
    const [showSolution, changeShowSolution] = useState([])
    const [language, changeLanguage] = useState('en')
    const [tableView, setTableView] = useState({simpleTable: true})
    const [selectedQuestions, changeSelectedQuestions] = useState([])
    const [paraDataSource, changeParaDataSource] = useState([])
    const [filteredData, setFilteredData] = useFilterDataReducer()
    const [collaspeStatus, collaspeChange] = useState(false) 
    const [currentExpandedRow, changeExpandedRow] = useState([])
    
    useEffect(() => {
        let filteresData = {"type":queTypeGroup.type, "subjects": subject?.subjectRefId._id} 
        dispatch(getAllQuestionsAction({limit:20, filters: filteresData}))

        setFilteredData({type:'reset', value:filteresData})

        setTimeout(() =>  renderMathTex('math-tex-id-que'), 3000)

    }, [dispatch])

    useEffect(() => {
        if(addQuestionToTestStatus == STATUS.SUCCESS){
            dispatch(resetAddQuestionToTestStatus())
            closeModal()
        }
    }, [addQuestionToTestStatus])

    const showOptions = (e, id) => {
        e.stopPropagation();
        const data = showAnswers
        changeShowAnswers(_.xor(data, [id]))
    }

    const _showSolution = (e, id) => {
        e.stopPropagation();
        const data = showSolution
        changeShowSolution(_.xor(data, [id]))
    }

    const questionsChange = (que) => {
        changeSelectedQuestions(_.xor(selectedQuestions, [que]))
    }
    
    const selectedColumns = [
        {
            title:'ID | TYPE',  
            key:1,
            render: que => (
                <div key={que.id}>
                    <div>{que.id}</div>
                    <div>
                        <Tag color='blue' style={{fontSize:'10px', border:0, marginRight:'20px', fontWeight:'bold'}}>
                            {que.question.type  && QuestionTypes[que.question.type].shortName}
                        </Tag>
                    </div>
                </div>
            )
        },
        {
            title:'QUESTIONS',
            dataIndex:'question',
            key:3,
            width:'85%',
            render:que => {
                return (
                    <div key={que._id}>    
                        {que.paragraph ? 
                            <Card style={{marginBottom:'10px'}} bodyStyle={{padding:'10px'}}>
                                <div style={{display:'flex'}}>
                                    <div style={{paddingRight:'10px'}}> <Text style={{fontWeight:'bold', color:''}}>Para.</Text></div>
                                    <div>
                                        <Paragraph
                                            ellipsis={true ?  {rows: 2, expandable: true, symbol: 'show'} : false }
                                        >
                                            <Typography dangerouslySetInnerHTML={{__html:que.paragraph.body[language]}}/>
                                        </Paragraph>
                                    </div>
                                </div>
                            </Card>
                            : null
                        }
                        <div style={{display:'flex'}}>
                            <div style={{fontWeight:'bold', paddingRight:'10px'}}><Text>Que. </Text></div>
                            <div dangerouslySetInnerHTML={{__html: que.question[language]}}/>
                        </div>
                    </div>
                )
            }
        },
    ]

    useEffect(() => {
        if(getQueListStatus === STATUS.SUCCESS && (queTypeGroup.type === 'paragraph_scq' || queTypeGroup.type === 'paragraph_mcq')){
            let data = _.map(_.groupBy(questionsList?.docs, 'paragraph._id'), (s,k) => ({id: k, title: s[0].paragraph?.body[language], questions: s}))
            changeParaDataSource(data)            
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getQueListStatus])

    const paraColumns = [
        {
            title:<b>Paragraph</b>,  
            key:1,
            render: para => (
                <Typography dangerouslySetInnerHTML={{__html:para.title}}/>
            )
        }
    ]

    const changePage = (e) => {
        dispatch(getAllQuestionsAction({limit:20, page:e.current, filters: filteredData}))
    }

    const expandedRowRender = (record) => {
        return (
            <QuestionCardTable
                questionUsage={filteredData.questionUsage}
                changePage={changePage}
                allQuestions={_.reduce(currentData.sections, (o, m) => _.concat(m.questions, o), [])}
                key={record._id}
                queTypeGroup={queTypeGroup} 
                showAnswers={showAnswers} 
                showSolution={showSolution}
                tableView={tableView}
                showOptions={(e, id) => showOptions(e, id)}
                _showSolution={(e, id) => _showSolution(e, id)}
                language={language}
                selectedQuestions={selectedQuestions}
                questionsChange={(que) => questionsChange(que)}
                getQueListStatus={getQueListStatus}
                questionsList={{docs: record?.questions}}
                noPagination
            />
        )
    }

    useEffect(() => {
        if(document.getElementById('math-tex-id-que'))
            renderMathTex('math-tex-id-que')
    })

    // useEffect(() => {
    //     if(getQueListStatus === STATUS.SUCCESS){
    //         window.renderMathInElement(document.getElementById("math-tex-id-que", {
    //             delimiters: [
    //                 { left: "$", right: "$", display: true }
    //             ]
    //         })); 
    //     }
    // }, [visible, getQueListStatus, showAnswers, showSolution, language, collaspeStatus, selectedQuestions, tableView.simpleTable])

    const handleAddQuestions = () => {
        dispatch(addQuestionsToTestAction({
            questions: _.map(selectedQuestions, (s,i) => ({
                order: (_.maxBy(queTypeGroup.questions, 'order')?.order || 0) + i + 1,
                questionRefId: s._id,
                type: {
                    questionGroupId: queTypeGroup._id,
                    questionType: queTypeGroup.type
                }
            })),
            sectionId: subject._id,
            testId: currentData._id,
            type: queTypeGroup.type
        })
    )
    }

    const handleShowUsage = useCallback(() => {
        let data = {...filteredData}
        data =  {...data, questionUsage:!filteredData?.questionUsage}

        setFilteredData({type:'questionUsage', value:!filteredData?.questionUsage})
        dispatch(getAllQuestionsAction({limit:20, filters:data}))
    }, [filteredData, setFilteredData, dispatch])

    let pureFilteredData = {..._.omitBy(filteredData, _.isEmpty), questionUsage:filteredData?.questionUsage}

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

    let requiredQuestions = queTypeGroup.noOfQuestions - queTypeGroup.questions.length
    let disable = selectedQuestions.length > requiredQuestions
    
    return(
            <Drawer title='Select Questions' width={'90%'} visible={visible} footer={null} onClose={closeModal}>
                <Card bodyStyle={{padding:0}} style={{border:0}} id='math-tex-id-que'>
                    <Row style={{position:'relative'}}>
                        <Col span={4}>
                            <div style={{position:'sticky', top:0}}>
                                <SelectQuestionFilter
                                    filteredData={filteredData}
                                    setFilteredData={setFilteredData}
                                    singleSelect 
                                    resetData={{subjects:subject?.subjectRefId._id, type:queTypeGroup.type}}  
                                />
                            </div>  
                        </Col>
                        <Col span={20} style={{padding:'0 20px'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <span> 
                                    Question Type: <Tag style={{fontSize: '14px'}} color={'blue'}>{queTypeGroup?.type}</Tag>
                                    Added Questions: <Tag style={{fontSize: '14px'}} color={queTypeGroup.questions.length < queTypeGroup.noOfQuestions ? 'gold' : queTypeGroup.questions.length < queTypeGroup.noOfQuestions ? 'green' : 'red'}>{queTypeGroup.questions.length}/{queTypeGroup.noOfQuestions}</Tag>
                                </span> 
                                <span>
                                    <Space>
                                        <Button onClick={() => setTableView({simpleTable: !tableView.simpleTable})}>Change Table View</Button>
                                        <Button onClick={() => changeLanguage(language === 'en' ? 'hn' : 'en')}>View In {language === 'en' ? 'Hindi' : 'English'}</Button>
                                        <Checkbox checked={filteredData?.questionUsage} onClick={handleShowUsage}>Show Question Usage</Checkbox>
                                    </Space>
                                </span>
                            </div>
                            <br/>
                            <Collapse onChange={() => collaspeChange(!collaspeStatus)}>
                                <Panel 
                                    header={
                                        <div>
                                            SELECTED QUESTION &nbsp;&nbsp;
                                            <Badge count={selectedQuestions.length} style={{ backgroundColor: '#108ee9', borderRadius: '2px' }}/>
                                        </div>} key="1">
                                    <Table 
                                        bordered
                                        scroll={{ y: 550 }}
                                        columns={selectedColumns}
                                        dataSource={selectedQuestions.map(que => ({id:que.display_id, question:que, action:que}))}
                                    />
                                </Panel>
                            </Collapse>
                            <br/>
                            <div style={{display:'flex', width:'100%', marginBottom:20}}>
                                <div style={{flexGrow:1}}>
                                    <Search placeholder='Search Question' size='large' value={filteredData?.searchTextEn} 
                                        onChange={questionText} 
                                        onSearch={searchQuestion} 
                                        enterButton="Search"
                                    />
                                </div>
                                <div style={{padding:'0 5px'}}>
                                    <Button onClick={resetSearch} size='large'>Clear</Button>
                                </div>
                            </div>
                            <br/>
                            {queTypeGroup.type === 'paragraph_scq' || queTypeGroup.type === 'paragraph_mcq' ? 
                                <Table 
                                    bordered
                                    loading={getQueListStatus === STATUS.FETCHING}
                                    columns={paraColumns}
                                    dataSource={paraDataSource}
                                    onExpand={(expanded, record) => changeExpandedRow(_.xor(currentExpandedRow, [record.id]))}
                                    expandedRowKeys={currentExpandedRow}
                                    expandable={{ expandedRowRender }}
                                    rowKey={record => record.id}
                                    pagination={{position:['bottomCenter', 'topCenter'], total:questionsList?.total, current:questionsList?.page, 
                                        pageSize:questionsList?.limit, 
                                    }}
                                />
                            : 
                                <QuestionCardTable
                                    questionUsage={filteredData.questionUsage}
                                    changePage={changePage}
                                    allQuestions={_.reduce(currentData.sections, (o, m) => _.concat(m.questions, o), [])}
                                    queTypeGroup={queTypeGroup}
                                    showAnswers={showAnswers} 
                                    showSolution={showSolution}
                                    tableView={tableView}
                                    showOptions={(e, id) => showOptions(e, id)}
                                    _showSolution={(e, id) => _showSolution(e, id)}
                                    language={language}
                                    selectedQuestions={selectedQuestions}
                                    questionsChange={(que) => questionsChange(que)}
                                    getQueListStatus={getQueListStatus}
                                    questionsList={questionsList}
                                />
                            }
                            <div style={{textAlign: 'center'}}>
                                {disable ? 
                                    <Alert type='warning' description={
                                        <Space>
                                            Selected more then required questions.<br/>
                                            <Space size='large'>
                                                <div style={{color:'green'}}>
                                                    Required Questions:
                                                    <Text style={{fontWeight:'bold', color:'green'}}> {requiredQuestions}</Text>
                                                </div>
                                                <div style={{ color:'red'}}>
                                                    Selected Questions:
                                                    <Text style={{fontWeight:'bold', color:'red'}}> {selectedQuestions.length}</Text>
                                                </div>
                                            </Space>
                                        </Space>
                                    }/> 
                                    : null
                                }<br/>
                                <Button 
                                    type="primary" 
                                    size='large'
                                    shape='round'
                                    block
                                    disabled={selectedQuestions.length === 0 || disable} 
                                    onClick={handleAddQuestions}
                                >
                                    {'Add '+selectedQuestions.length+' Question To Test'}  
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={24} style={{textAlign: 'center'}}>
                        </Col>
                    </Row>
                </Card>
            </Drawer>
    )
}

const QuestionCardTable = ({allQuestions, queTypeGroup, showAnswers, showSolution, tableView, showOptions, _showSolution, 
    language, selectedQuestions, questionsChange, getQueListStatus, questionsList, noPagination, changePage, questionUsage
}) => {

    const [queTestsModal, showQueTests] = useState()

    const dataSource = questionsList?.docs?.length ? questionsList.docs.map(que => ({id:que.display_id, question:que, action:que})) : []

    const handleShowQueTests =(data, e) => {
        e?.stopPropagation()
        showQueTests(data)
    }

    let columns = [
        {
            title:tableView.simpleTable === false ? 'ID' : 'ID | TYPE',  
            key:1,
            width:100,
            render: que => {
                let newSelected = _.findIndex(selectedQuestions, s => s._id === que.question._id) !== -1
                return(
                    <div key={que.id}>
                        <Tag color='orange' style={{ marginTop: '3px', fontSize:'10px', border:0, marginRight:'20px', fontWeight:'bold'}}>{que.id}</Tag>
                        {tableView.simpleTable === true ?
                            <div>
                                <Tag color='blue' style={{ marginTop: '3px', fontSize:'10px', border:0, marginRight:'20px', fontWeight:'bold'}}>
                                    {que.question.type  && QuestionTypes[que.question.type].shortName}
                                </Tag>
                            </div>
                        : null}
                        {newSelected ? 
                            <Tag color='green' style={{ marginTop: '3px', fontSize:'10px', border:0, marginRight:'20px', fontWeight:'bold'}}>
                                <CheckCircleOutlined style={{color: 'green'}}/> Selelcted
                            </Tag> 
                        : null}
                    </div>
                )
            }
        },
        {
            title:'QUESTIONS',
            dataIndex:'question',
            key:3,
            render:que => {
                const showAnswer = _.findIndex(showAnswers,a => a === que._id) !== -1
                const showSolun = _.findIndex(showSolution,a => a === que._id) !== -1
                return(
                    <div key={que._id}>
                    {tableView.simpleTable === false ? 
                        <div>  
                            <div style={{marginBottom:'10px'}}>
                                <Tag color='blue' style={{fontSize:'16px', border:0, marginRight:'20px', fontWeight:'bold'}}>
                                    {que.type  && QuestionTypes[que.type].shortName}
                                </Tag>
                                
                                <span style={{float:''}}>
                                    {que.options.length ? 
                                        <Button size='small' onClick={(e) => showOptions(e, que._id)}>{showAnswer ? 'Hide Options' : 'Options'}</Button>
                                        :
                                        <Button size='small' onClick={(e) => showOptions(e, que._id)}>{showAnswer ? 'Hide Answers' : 'Answers'}</Button>
                                    }&nbsp;
                                    {que.solution && que.solution[language] ? 
                                        <Button size='small' onClick={(e) => _showSolution(e, que._id)}>{showSolun ? 'Hide Solution' : 'Solution'}</Button>
                                        : null
                                    }&nbsp;
                                </span>
                                <br/>
                            </div>
                            {/*que.paragraph ? 
                                <Card style={{marginBottom:'10px'}} bodyStyle={{padding:'10px'}}>
                                    <div style={{display:'flex'}}>
                                        <div style={{paddingRight:'10px'}}> <Text style={{fontWeight:'bold', color:''}}>Para.</Text></div>
                                        <div>
                                            <Paragraph
                                                ellipsis={true ?  {rows: 2, expandable: true, symbol: 'show'} : false }
                                            >
                                                <Typography dangerouslySetInnerHTML={{__html:que.paragraph.body[language]}}/>
                                            </Paragraph>
                                        </div>
                                    </div>
                                </Card>
                                : null
                            */}
                            <Card style={{border:0, marginBottom:'10px'}} bodyStyle={{padding:'10px'}}>
                                <div style={{display:'flex'}}>
                                    <div style={{fontWeight:'bold', paddingRight:'10px'}}><Text>Que. </Text></div>
                                    <div dangerouslySetInnerHTML={{__html: que.question[language]}}/>
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
                                                                    <b>{language == 'hn' ? String.fromCharCode('क'.charCodeAt() + i) : String.fromCharCode(i + 65)}</b>
                                                                </span>
                                                            }
                                                            description={<div style={{color:'black'}} dangerouslySetInnerHTML={{__html: item.body[language]}}/>}
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
                                            <div>{que.answer[0]}</div>
                                        </div>
                                    </Card>
                                : null
                            }
                            {showSolun ? 
                                <Card bodyStyle={{padding:'10px'}}>
                                    <div style={{display:'flex'}}>
                                        <div style={{paddingRight:'10px'}}><Text style={{fontWeight:'bold'}}>Solu.</Text><br/></div>
                                        <div><div dangerouslySetInnerHTML={{__html:que.solution && que.solution[language]}}/></div>
                                    </div>
                                </Card>
                                :
                                null
                            }
                        </div>
                    : 
                        <div>   
                            {/*que.paragraph ? 
                                <Card style={{marginBottom:'10px'}} bodyStyle={{padding:'10px'}}>
                                    <div style={{display:'flex'}}>
                                        <div style={{paddingRight:'10px'}}> <Text style={{fontWeight:'bold', color:''}}>Para.</Text></div>
                                        <div>
                                            <Paragraph
                                                ellipsis={true ?  {rows: 2, expandable: true, symbol: 'show'} : false }
                                            >
                                                <Typography dangerouslySetInnerHTML={{__html:que.paragraph.body[language]}}/>
                                            </Paragraph>
                                        </div>
                                    </div>
                                </Card>
                                : null
                            */}
                            <div style={{display:'flex'}}>
                                <div style={{fontWeight:'bold', paddingRight:'10px'}}><Text>Que. </Text></div>
                                <div dangerouslySetInnerHTML={{__html: que.question[language]}}/>
                            </div>
                        </div>
                    }
                    </div>
                )
            }
        },
    ]

    if(questionUsage){
        columns = [...columns, {
            title:'Tests',
            dataIndex:'question',
            render:d => {
                const tests = questionsList.usage?.length ? _.filter(questionsList.usage, (q) => q.questionRefId === d._id) : []
                return <Button key={d._id} onClick={(e) => handleShowQueTests({...d, tests}, e)}>{tests?.length}</Button>

            }
            
        }]
    }

    return (
        <>
            <Table 
                onRow={(record) => {
                    return {
                    onClick: () => questionsChange(record.question),
                    };
                }
                }
                rowClassName={(record) => {
                    return(
                        _.findIndex(allQuestions, s => s.questionRefId._id === record.question._id) !== -1 ? 'preSelectedTableRow' : _.findIndex(selectedQuestions, s => s._id === record.question._id) !== -1 ? 'selectedTableRow' : 'normalTableRow'
                    )}
                }
                key={questionUsage}
                bordered
                scroll={{ y: 600 }}
                loading={getQueListStatus === STATUS.FETCHING}
                columns={columns}
                onChange={changePage}
                dataSource={dataSource}
                pagination={noPagination ? false : {position:['bottomCenter', 'topCenter'], showSizeChanger:false,
                    total:questionsList?.total, current:questionsList?.page, pageSize:questionsList?.limit,
                }}
            />
            {queTestsModal ? <QuestionUsageModal visible={queTestsModal} question={queTestsModal} closeModal={() => handleShowQueTests(false)}  /> : null}
        </>
    )
}