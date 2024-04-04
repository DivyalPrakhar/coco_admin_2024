import { InfoCircleTwoTone } from '@ant-design/icons'
import { Button, Card, Checkbox, Input, Popover, Radio } from 'antd'
import Text from 'antd/lib/typography/Text'
import React, { useContext, useState } from 'react'
import { useEffect } from 'react'
import { useReducer } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import { addTestSettingsAction } from '../../redux/reducers/test'
import { FormReducer } from '../../utils/FormReducer'
import { CurrentTestContext } from './AddTest'
import { useHistory, useParams } from 'react-router-dom'
import { RadioGroup } from '@chakra-ui/react'

export const TestSettings = () => {
    const currentTest = useContext(CurrentTestContext)
    const dispatch = useDispatch()
    const history = useHistory()

    const [testData, dispatchPropertyChange] = useReducer(FormReducer, {})

    const {getTestStatus, addTestSettingsStatus} = useSelector((state) => ({
        getTestStatus:state.test.getTestStatus,
        addTestSettingsStatus:state.test.addTestSettingsStatus
    }))

    const [maxAttempts, changeAttmptCount] = useState(0)


    useEffect(() => {
        if(getTestStatus === STATUS.SUCCESS && currentTest ){
            let {questionGrouping, testOption, timeSetting} = currentTest 
            dispatchPropertyChange({type:'reset', value:{...questionGrouping, ...testOption, ...timeSetting}})
        }
    }, [currentTest, getTestStatus])

    const _shuffleWithinSubject = (e) => {
        dispatchPropertyChange({type:'shuffleWithinSubject', value:e.target.value})
    }

    const _groupSubjectwise = (e) => {
        dispatchPropertyChange({type:'groupSubjectwise', value:e.target.value})
    }

    const _showMarks = (e) => {
        dispatchPropertyChange({type:'showMarks', value:e.target.checked})
    }

    const _discussion =  (e) => {
        dispatchPropertyChange({type:'discussion', value:e.target.checked})

    }

    const _discussionComments = (e) => {
        dispatchPropertyChange({type:'discussionComments', value:e.target.checked})
    }


    const _bilingualChange = (e) => {
        dispatchPropertyChange({type:'bilingual', value:e.target.checked})
    }

    const _showAnalysis = (e) => {
        dispatchPropertyChange({type:'showAnalysis', value:e.target.checked})
    }

    const _rankSetting = (e) => {
        dispatchPropertyChange({type:'rankSetting', value:e.target.value})
    }

    const _numQuestionsPerPage = (e) => {
        dispatchPropertyChange({type:'numQuestionsPerPage', value:e.target.value})
        if(e.target.value > 1){
            dispatchPropertyChange({type:'getTimeAnalysis', value:false})
        }
    }

    const _getTimeAnalysis = (e) => {
        dispatchPropertyChange({type:'getTimeAnalysis', value:e.target.value})
    }

    const _finishInTime = (e) => {
        dispatchPropertyChange({type:'finishInTime', value:e.target.value})
    }

    const _clockFormat = (e) => {
        dispatchPropertyChange({type:'clockFormat', value:e.target.value})
    }

    const addSettings = () => {
        let {shuffleWithinSubject, groupSubjectwise, showMarks, discussion, discussionComments, showAnalysis, 
            rankSetting, finishInTime, clockFormat, getTimeAnalysis, numQuestionsPerPage, bilingual, allowBilingual, questionNumbersView
        } = testData
        let questionGrouping = {shuffleWithinSubject}
        let testOption = {allowBilingual, questionNumbersView, showMarks, showAnalysis, rankSetting, discussion, discussionComments, numQuestionsPerPage, getTimeAnalysis, bilingual}
        let timeSetting = {finishInTime}
        let data = {questionGrouping, testOption, timeSetting, testId:currentTest._id}
        
        dispatch(addTestSettingsAction(data))
    }

    const _changeSetting = (type, value) => {
        console.log('type', type, value)
        dispatchPropertyChange({type, value})
    }

    return(
        <div style={{padding:'0 30px'}}>
            <br/>
            <div>
                {/* <Card style={{border:0, lineHeight:2}} bodyStyle={{padding:'20px'}} title={
                    <Text style={{fontWeight:'bold', fontSize:'18px'}}>Arrangement and Grouping</Text>
                }>
                    <div style={{display:'flex'}}>
                        <div style={{width:'400px'}}>Shuffle questions within subjects?</div>
                        <div>
                            <Radio.Group onChange={_shuffleWithinSubject} value={testData.shuffleWithinSubject}>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                    <div style={{display:'flex'}}>
                        <div style={{width:'400px'}}>Group questions subjectwise?</div>
                        <div>
                            <Radio.Group onChange={_groupSubjectwise} value={testData.groupSubjectwise}>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                </Card>
                <br/> */}
                <Card style={{border:0, lineHeight:2}} bodyStyle={{padding:'20px'}} title={
                    <Text style={{fontWeight:'bold', fontSize:'18px'}}>Test Options</Text>
                }>
                    <div style={{display:'flex'}}>
                        <div style={{width:'400px'}}>Bilingual Test</div>
                        <div><Checkbox onChange={_bilingualChange} checked={testData.bilingual}/></div>
                    </div>
                    <div style={{display:'flex'}}>
                        <div style={{width:'400px'}}>Show marks/points for test?</div>
                        <div><Checkbox onChange={_showMarks} checked={testData.showMarks}/></div>
                    </div>
                    <div style={{display:'flex'}}>
                        <div style={{width:'400px'}}>Show analysis before result is published?</div>
                        <div><Checkbox onChange={_showAnalysis} checked={testData.showAnalysis}/></div>
                    </div>
                    <div style={{display:'flex'}}>
                        <div style={{width:'400px'}}>Default question number view</div>
                        <div>
                            <Radio.Group value={testData.questionNumbersView} onChange={e => _changeSetting('questionNumbersView', e.target.value)}>
                                <Radio value={'normal'}>Normal</Radio>
                                <Radio value={'category'}>Category</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                    <div style={{display:'flex'}}>
                        <div style={{width:'400px'}}>Allow student to choose bilingual?</div>
                        <div><Checkbox onChange={(e) => _changeSetting('allowBilingual', e.target.checked)} checked={testData.allowBilingual}/></div>
                    </div>
                    
                    <div style={{backgroundColor:"#dadada", marginTop:10, marginBottom:10, height:1}}></div>


                    <div style={{display:'flex'}}>
                        <div style={{width:'400px'}}>Show Test Discussions?</div>
                        <div><Checkbox onChange={_discussion} checked={testData.discussion}/></div>
                    </div>

                    {/* <div style={{display:'flex'}}>
                        <div style={{width:'400px'}}>Discussion Comments allowed </div>
                        <div><Checkbox onChange={_discussionComments} checked={testData.discussionComments}/></div>
                    </div> */}

                    <div style={{backgroundColor:"#dadada", marginTop:10, marginBottom:10, height:1}}></div>


                    {/* <div style={{display:'flex'}}>
                        <div style={{width:'400px'}}>
                            Students ranking in final result &nbsp;
                            <Popover content={
                                <>
                                    <p>
										<b>Standard ranking ("1224" ranking):</b> <br/>
										Thus if A ranks ahead of B and C (which compare equal) which are both ranked ahead of D, then A gets ranking number 1 ("first"), <br/>
										B gets ranking number 2 ("joint second"), C also gets ranking number 2 ("joint second") and D gets ranking number 4 ("fourth").
									</p>
									<p>
										<b>Dense ranking ("1223" ranking): </b> <br/>
										Thus if A ranks ahead of B and C (which compare equal) which are both ranked ahead of D, then A gets ranking number 1 ("first"), <br/>
										B gets ranking number 2 ("joint second"), C also gets ranking number 2 ("joint second") and D gets ranking number 3 ("Third").
									</p>
                                </>
                            }>
                                <InfoCircleTwoTone style={{fontSize:'18px'}} color='blue'/> 
                            </Popover>
                        </div>
                        <div>
                            <Radio.Group onChange={_rankSetting} value={testData.rankSetting}>
                                <Radio value={true}>Stnadard Ranking</Radio>
                                <Radio value={false}>Dense Ranking</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                    <br/> */}
                    <div style={{display:'flex'}}>
                        <div style={{width:'400px'}}>Number Of Questions Per Page</div>
                        <div>
                            <Input type='number' placeholder='No. Of Questions Per Page' onChange={_numQuestionsPerPage} value={testData.numQuestionsPerPage}/>
                        </div>
                    </div>
                    {/* <div style={{display:'flex'}}>
                        <div style={{width:'400px'}}>Get Time Analysis</div>
                        <div>
                            <Radio.Group disabled={testData.numQuestionsPerPage > 1} onChange={_getTimeAnalysis} value={testData.getTimeAnalysis}>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        </div>
                    </div> */}
                </Card>
                {/* <br/>
                <Card style={{border:0, lineHeight:2}} bodyStyle={{padding:'20px'}} title={
                    <Text style={{fontWeight:'bold', fontSize:'18px'}}>Time Setting</Text>
                }>
                    <div style={{display:'flex'}}>
                        <div style={{width:'400px'}}>The candidate can submit the test before time is over?</div>
                        <div>
                            <Radio.Group onChange={_finishInTime} value={testData.finishInTime}>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                    <div style={{display:'flex'}}>
                        <div style={{width:'400px'}}>Clock format?</div>
                        <div>
                            <Radio.Group onChange={_clockFormat} value={testData.clockFormat}>
                                <Radio value='HH:mm'>HH:mm</Radio>
                                <Radio value='mm:ss'>mm:ss</Radio>
                                <Radio value='HH:mm:ss'>HH:mm:ss</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                </Card> */}
            </div>
            <br/>
            <div style={{textAlign:'center'}}>
                <Button shape='round' style={{width:'150px'}} type='primary' onClick={addSettings} loading={addTestSettingsStatus == STATUS.FETCHING} size='large'>Save</Button>
                &nbsp;&nbsp;<Button shape='round' style={{width:'150px'}} onClick={() => history.push('/manage-tests')} size='large'>Go To Test List</Button>
            </div>
        </div>
    )
} 