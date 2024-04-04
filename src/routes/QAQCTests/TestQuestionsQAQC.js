import { Button, Card, Divider, List, Space, Table, Tabs, Tag } from 'antd'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useHistory } from 'react-router'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { STATUS } from '../../Constants'
import { getSingleTestAction, unverifyQueAction, verifyQuestionAction } from '../../redux/reducers/test'
import { getAssignedQaqcUsersAction, getQAQCTestAction } from '../../redux/reducers/qaqc'
import _ from 'lodash'
import { answerTypes } from '../../utils/QuestionTypeHelper'
import { CheckCircleTwoTone, CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons'
import { UpdateQuestionModal } from '../../components/UpdateQuestionModal'
import { FinalTestStep } from '../ManageTests/FinalTestStep'
import Text from 'antd/lib/typography/Text'
import { renderMathTex } from '../../utils/FileHelper'

export const TestQuestionsQAQC = () => {
    const params = useParams()
    const dispatch = useDispatch()
    const history = useHistory()

    const { getPaperStatus, currentTest, getAssignedQaqcUsersStatus, verifyQuestionStatus, unverifyQueStatus, updateTestQuestionDataStatus } = useSelector((state) => ({
        getPaperStatus: state.test.getTestStatus,
        currentTest: state.test.currentTest,
        getAssignedQaqcUsersStatus: state.qaqc.getAssignedQaqcUsersStatus,
        verifyQuestionStatus: state.test.verifyQuestionStatus,
        unverifyQueStatus: state.test.unverifyQueStatus,
        updateTestQuestionDataStatus: state.test.updateTestQuestionDataStatus
    }))




    let [currentQue, setCurrentQue] = useState()
    let [updateQueModal, changeUpdateQueModal] = useState()
    let [key, changeKey] = useState(1)
    let [currentPage, changePage] = useState(1)

    useEffect(() => {
        if (params.id) {
            dispatch(getAssignedQaqcUsersAction({ testId: params.id }))
            dispatch(getSingleTestAction({ testId: params.id, withReview: true }))
        }
    }, [dispatch, params])


    useEffect(() => {
        if (document.getElementById('math-tex-id'))
            renderMathTex()
    })

    useEffect(() => {
        if (updateTestQuestionDataStatus === STATUS.SUCCESS)
            changeKey(key + 1)
    }, [updateTestQuestionDataStatus])

    const verifyQuestion = (que, secId) => {
        dispatch(verifyQuestionAction({ questionId: que.questionRefId._id, secId }))
        setCurrentQue(que)
    }

    const unverifyQue = (que, secId) => {
        dispatch(unverifyQueAction({ questionId: que.questionRefId._id, secId }))
        setCurrentQue(que)
    }

    const updateQuestion = (data) => {
        dispatch
        changeUpdateQueModal(data)
    }

    const handlePageChange = (e) => {
        changePage(e.current)
    }

    const handleTabChange = (e) => {
        changePage(1)
    }
    return (
        <div>
            <CommonPageHeader title='Test Questions' />
            <br />

            <Card loading={getPaperStatus === STATUS.FETCHING || getAssignedQaqcUsersStatus === STATUS.FETCHING}>
                {getPaperStatus === STATUS.SUCCESS && getAssignedQaqcUsersStatus === STATUS.SUCCESS && currentTest.sections.length ?
                    <>
                        <Tabs>
                            <Tabs.TabPane key={1} tab='Verify Questions'>
                                <Tabs type='card' onChange={handleTabChange}>
                                    {_.orderBy(currentTest.sections, ['order'], ['asc']).map((sec, secIndx, allSections) => {
                                        {/* let prevQuestionsCount = _.filter(allSections,(s, i) =>  i < secIndx)
                                            prevQuestionsCount = _.sumBy(prevQuestionsCount.map(p => p.questions?.length || 0)) */}
                                        let secQuestions = _.chain(sec.questionTypeGroup)
                                            .orderBy(['order'], ['asc'])
                                            .map(t => Object.assign({}, t, {
                                                questions: sec.questions.length ?
                                                    _.filter(sec.questions, q => q.type?.questionGroupId == t._id)
                                                    : []
                                            })
                                            )
                                            .flatMap(t => t.questions)
                                            .orderBy(['order'], ['asc'])
                                            .flatMap((q, i) => ({ ...q, order: i + 1 }))
                                            .value()

                                        return (
                                            <Tabs.TabPane tab={<b>{sec.subjectRefId.name.en}</b>} key={sec._id}>

                                                <Table bordered dataSource={secQuestions}
                                                    pagination={{ current: currentPage, position: ['bottomCenter', 'topCenter'] }} id='math-tex-id'
                                                    onChange={handlePageChange} key={key}
                                                >
                                                    {/* <Table.Column title={<b>Que No.</b>} width='100px' render={d => d.order}></Table.Column> */}
                                                    <Table.Column title={<b>Id</b>} width='100px'
                                                        render={d => {
                                                            return (
                                                                <div style={{ textAlign: 'center' }}>
                                                                    <Tag style={{ padding: '7px 10px' }}>
                                                                        <Text style={{ fontSize: 16 }} key={d.order}>{d.order}</Text>
                                                                    </Tag>
                                                                    <br />
                                                                    <br />
                                                                    <Text>{d.questionRefId.display_id}</Text>
                                                                </div>
                                                            )
                                                        }}
                                                    ></Table.Column>
                                                    <Table.Column title={<b>Status</b>} width='100px' render={d => {
                                                        let que = d.questionRefId
                                                        let verified = que.operatorVerified || que.teacherVerified ? true : false

                                                        // let verified = que.review?.length && _.findIndex(que.review,r => r.userId == user._id) != -1 ? 
                                                        //     _.find(que.review,r => r.userId == user._id) : false

                                                        return (
                                                            <div style={{ textAlign: 'center' }}>
                                                                {verified ?
                                                                    <Button loading={unverifyQueStatus == STATUS.FETCHING && currentQue?._id == d._id}
                                                                        onClick={() => unverifyQue(d, sec._id)} danger icon={<CloseOutlined />}
                                                                    >Unverify</Button>
                                                                    :
                                                                    <Button loading={verifyQuestionStatus == STATUS.FETCHING}
                                                                        onClick={() => verifyQuestion(d, sec._id)} icon={<CheckOutlined />}
                                                                    >Verify</Button>
                                                                }
                                                                <br /><br />
                                                                {verified && <Tag style={{ fontWeight: 'bold' }} color='green'><CheckOutlined /> Verified</Tag>}
                                                            </div>
                                                        )
                                                    }
                                                    }></Table.Column>
                                                    <Table.Column title={<b>Question (Hindi)</b>}
                                                        render={d => {
                                                            let que = d.questionRefId
                                                            return que.question.hn ? (
                                                                <div>
                                                                    <QueComponent que={que} language='hn' />
                                                                </div>
                                                            ) : '-'
                                                        }
                                                        }
                                                    ></Table.Column>
                                                    <Table.Column title={<b>Question (English)</b>}
                                                        render={d => {
                                                            let que = d.questionRefId
                                                            return (
                                                                <QueComponent que={que} language='en' />
                                                            )

                                                        }
                                                        }
                                                    ></Table.Column>
                                                    <Table.Column title={<b>Actions</b>}
                                                        render={d => {
                                                            let que = d.questionRefId
                                                            let verified = que.operatorVerified || que.teacherVerified ? true : false
                                                            // let verified = que.review?.length && _.findIndex(que.review,r => r.userId == user._id) != -1 ? 
                                                            //     _.find(que.review,r => r.userId == user._id) : false
                                                            return (
                                                                <Space>
                                                                    <Button icon={<EditOutlined />}
                                                                        onClick={() => updateQuestion({ ...d.questionRefId, updateType: 'testQuestion', sectionId: sec._id })}
                                                                    >
                                                                        Edit
                                                                    </Button>
                                                                </Space>
                                                            )
                                                        }
                                                        }
                                                    ></Table.Column>
                                                </Table>
                                            </Tabs.TabPane>
                                        )
                                    }
                                    )}
                                </Tabs>
                            </Tabs.TabPane>
                            <Tabs.TabPane key={2} tab='Test Demos'>
                                <FinalTestStep testData={currentTest} />
                            </Tabs.TabPane>
                        </Tabs>
                    </>
                    :
                    <div style={{ fontSize: '20px', textAlign: 'center', color: '#5D6D7E' }}>Questions not available</div>
                }
            </Card>
            {updateQueModal ? <UpdateQuestionModal data={updateQueModal} closeModal={() => changeUpdateQueModal(null)} visible={updateQueModal} /> : null}
        </div>
    )
}

let QueComponent = ({ que, language }) => {
    const checkAnswerType = (type) => {
        return _.findKey(answerTypes, types => _.findIndex(types, t => t == type) != -1)
    }
    return (
        <Space direction='vertical' style={{ width: '100%' }} id='math-tex-id'>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <b>Question</b>
                    <b ><Tag color='blue'>{que.type}</Tag></b>
                </div>
                {/* {console.log('currentTest', que.question.en)} */}
                <div key={que.question.en} dangerouslySetInnerHTML={{ __html: que.question[language] }} />
            </div>
            <div>
                {checkAnswerType(que.type) == 'multiple' ?
                    <div>
                        {que.options.length &&
                            <List
                                header={<b>Options</b>}
                                dataSource={que.options}
                                bordered
                                renderItem={item => {
                                    let selected = que.answer[0] == item._id
                                    return (
                                        <List.Item style={{ padding: 10, background: selected && '#EAFAF1' }}>
                                            <div style={{ display: 'flex' }}>
                                                {que.answer.length && selected ?
                                                    <CheckCircleTwoTone twoToneColor='#52c41a' style={{ marginRight: '10px', fontSize: '16px' }} />
                                                    : null
                                                }
                                                <div style={{ paddingRight: '10px' }}>
                                                    ({item.key[language]})
                                                </div>
                                                <div><div dangerouslySetInnerHTML={{ __html: item.body[language] }} /></div>
                                            </div>
                                        </List.Item>
                                    )
                                }
                                }
                            />
                        }
                    </div>
                    : checkAnswerType(que.type) == 'descriptive' ?
                        <div>
                            <b>Answer</b>
                            <div dangerouslySetInnerHTML={{ __html: que.answer[0] }} />
                        </div>
                        : checkAnswerType(que.type) == 'number' ?
                            <div>
                                <b>Answer</b>
                                {que.answer.length == 2 ?
                                    <div>{que.answer[0] + '-' + que.answer[1]}</div>
                                    :
                                    que.answer[0]
                                }
                            </div>
                            :
                            null
                }
            </div>
            {que.solution?.[language] ?
                <div>
                    <b>Solution</b>
                    <div dangerouslySetInnerHTML={{ __html: que.solution[language] }} />
                </div>
                : null
            }
        </Space>
    )
} 