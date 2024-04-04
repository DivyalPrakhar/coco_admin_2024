import { CheckCircleOutlined, CheckCircleTwoTone, DeleteTwoTone, FontSizeOutlined, FormOutlined, PlusOutlined, RedoOutlined, SelectOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Form, Input, Radio, Select, Tooltip, Switch, Tag, Space, Empty,} from 'antd'
import Text from 'antd/lib/typography/Text'
import React, { useEffect, useState, useRef } from 'react'
import { CkeditorModal } from '../../components/CkeditorModal'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import questionTypeName, { answerTypes, findAnswerType, QuestionTypeNames } from '../../utils/QuestionTypeHelper'
import {checkOptionsData} from '../../utils/FileHelper'
import _, { update } from 'lodash';
import { useDispatch, useSelector } from 'react-redux'
import { addQuestionAction, resetUpdateQuestion, updateQuestionAction, resetAddQuestion } from '../../redux/reducers/questions'
import { SelectParagraph } from '../../components/SelectParagraphDrawer'
import { ConfirmAlert } from '../../Constants/CommonAlerts'
import { STATUS } from '../../Constants'
import { addNewTestQuestionAction, updateTestQuestionDataAction } from '../../redux/reducers/test'
import { CkeditorComponent } from '../../components/CkeditorComponent'
import { useReducer } from 'react'
import { FormReducer } from '../../utils/FormReducer'
import { HindiInput } from '../../components/HindiInput'

export const AddQuestions = ({updateData, bulkQuestions, dataToBulk}) => {
    let defaultTags = {exams:[], boards:[], subjects:[], standards:[]}
    const [selectedTags, changeTags] = useReducer(FormReducer, defaultTags)
    const [selectedTab, selectTab] = useState('english')

    const {defaultDataStatus, defaultSyllabus} = useSelector(state => ({
        defaultDataStatus: state.lmsConfig.defaultDataStatus,
        defaultSyllabus : state.lmsConfig.defaultData
    }))

    useEffect(() => {
        if(updateData){
            changeTags({type:'merge', value:{exams:updateData.exams, subjects:updateData.subjects}})
        }
    }, [updateData])

    const _selectTab = (e) => {
        selectTab(e.target ? e.target.value : e)
    }

    const selectStandards = (id) => {
        changeTags({type:'standards', value:_.xor(selectedTags.standards, [id])})
    }

    const selectExams = (id) => {
        changeTags({type:'exams', value:_.xor(selectedTags.exams, [id])})
    }

    const selectSubjects = (id) => {
        changeTags({type:'subjects', value:_.xor(selectedTags.subjects, [id])})
    }

    const selectBoards = (id) => {
        changeTags({type:'boards', value:_.xor(selectedTags.boards, [id])})
    }

    return(
        <>
            {updateData ? null : 
                <>
                    <CommonPageHeader title='Add Question'/>
                    <br/>
                </>
            }
            <Card loading={defaultDataStatus == STATUS.FETCHING}>
                {defaultDataStatus == STATUS.SUCCESS ?
                    <>
                        <div style={{padding:'0 20px'}}>
                            <div style={{padding:'5px 10px', borderRadius:'2px', background:'#F4F6F7'}}>
                                <Text style={{fontSize:'18px', fontWeight:'bold', color:'#3498DB'}}>Tags</Text>
                            </div>
                            <br/>
                            <Form>
                                <Form.Item label={<b>Exams</b>} required>
                                    {defaultSyllabus.exams.length ?  
                                        defaultSyllabus.exams.map(exam =>
                                            {
                                                let selected = _.findIndex(selectedTags.exams,s => s == exam._id) != -1
                                                return(
                                                    <Tag.CheckableTag style={{border:'1px solid #AEB6BF', margin:'5px', fontSize:'14px'}} key={exam._id}
                                                        onChange={() => selectExams(exam._id)}
                                                        checked={selected}
                                                    >
                                                        {exam.name.en}
                                                    </Tag.CheckableTag>
                                                )
                                            }
                                        )
                                        : <Text style={{color:'#AEB6BF'}}>No exams available</Text>
                                    }
                                </Form.Item>

                                <Form.Item label={<b>Subjects</b>} required>
                                    {defaultSyllabus.subjects.length ? 
                                            defaultSyllabus.subjects.map(subj =>
                                            {
                                                let selected = _.findIndex(selectedTags.subjects,s => s == subj._id) != -1
                                                return(
                                                    <Tag.CheckableTag style={{border:'1px solid #AEB6BF', margin:'5px', fontSize:'14px'}} key={subj._id}
                                                        onChange={() => selectSubjects(subj._id)}
                                                        checked={selected}
                                                    >
                                                        {subj.name.en}
                                                    </Tag.CheckableTag>
                                                )
                                            }
                                        )
                                        : <Text style={{color:'#AEB6BF'}}>No subjects available</Text>
                                    }
                                </Form.Item>

                                {/*<Form.Item label={<b>Standards</b>}>
                                    {defaultSyllabus.standards.length ? 
                                            defaultSyllabus.standards.map(stn =>
                                            {
                                                let selected = _.findIndex(selectedTags.standards,s => s == stn._id) != -1
                                                return(
                                                    <Tag.CheckableTag style={{border:'1px solid #AEB6BF', margin:'5px', fontSize:'14px'}} key={stn._id}
                                                        onChange={() => selectStandards(stn._id)}
                                                        checked={selected}
                                                    >
                                                        {stn.name.en}
                                                    </Tag.CheckableTag>
                                                )
                                            }
                                        )
                                        : <Text style={{color:'#AEB6BF'}}>No standards available</Text>
                                    }
                                </Form.Item>*/}

                                {/*<Form.Item label={<b>Boards</b>}>
                                    {defaultSyllabus.boards.length ?  
                                        defaultSyllabus.boards.map(board =>
                                            {
                                                let selected = _.findIndex(selectedTags.boards,s => s == board._id) != -1
                                                return(
                                                    <Tag.CheckableTag style={{border:'1px solid #AEB6BF', margin:'5px', fontSize:'14px'}} key={board._id}
                                                        onChange={() => selectBoards(board._id)}
                                                        checked={selected}
                                                    >
                                                        {board.name.en}
                                                    </Tag.CheckableTag>
                                                )
                                            }
                                        )
                                        : <Text style={{color:'#AEB6BF'}}>No boards available</Text>
                                    }    
                                </Form.Item>*/}
                            </Form>
                        </div>
                        <br/>
                            <div style={{padding:'5px 10px', borderRadius:'2px', background:'#F4F6F7'}}>
                                <Text style={{fontSize:'18px', fontWeight:'bold', color:'#3498DB'}}>Question</Text>
                            </div>
                            <EditQuestion tags={selectedTags} updateData={updateData} language={selectedTab} selectTab={_selectTab} selectedTab={selectedTab} bulkQuestions={bulkQuestions} dataToBulk={(data) => dataToBulk(data)}/>
                        <br/>
                    </>
                    : null 
                }
            </Card>
        </>
    )
}

const EditQuestion = ({ selectTab, language, updateData, selectedTab, tags, bulkQuestions, dataToBulk}) => {
    const dispatch = useDispatch()
    const ref = useRef(null)
    const defaultOptions = [
            {id:Math.random(), en:'', hn:'', type:'text'}, 
            {id:Math.random(), en:'', hn:'', type:'text'}, 
            {id:Math.random(), en:'', hn:'', type:'text'}, 
            {id:Math.random(), en:'', hn:'', type:'text'}
        ]

    const assAndReasonOptions =[
        {en:'If both assertion and reason are true and reason is the correct explanation of assertion', hn:'If both assertion and reason are true and reason is the correct explanation of assertion'},
        {en:'If both assertion and reason are true but reason is not the correct explanation of assertion', hn:'If both assertion and reason are true but reason is not the correct explanation of assertion'},
        {en:'If assertion is true but reason is false', hn:'If assertion is true but reason is false'},
        {en:'If both assertion and reason are false', hn:'If both assertion and reason are false'},
        
    ]

    const defaultAnswer = {type:'text', en:[], hn:[]}

    const defaultInput = {type:'text', en:'', hn:''}

    const defaultSolution = {type: 'text', en: '', hn: ''}

    const {addQuestionStatus, updateQueStatus, addNewTestQuestionStatus, defaultSyllabus} = useSelector((state) => ({
        addQuestionStatus:state.questions.addQuestionStatus,
        updateQueStatus:state.questions.updateQueStatus,
        addNewTestQuestionStatus:state.test.addNewTestQuestionStatus,
        defaultSyllabus : state.lmsConfig.defaultData
    }))

    let [openEditor, setOpenEditor] = useState(['option'])
    // let [modalType, setModalType] = useState(null)
    let [question, setQuestion] = useState(defaultInput)
    let [solution, setSolution] = useState(defaultSolution)
    let [options, setOptions] = useState(defaultOptions)
    let [answer, setAnswer] = useState(defaultAnswer)
    let [range, setRange] = useState(false)
    let [currentOption, setCurrentOption] = useState()
    let [selectedQueType, selectQueType] = useState()
    let [answerType, setAnswerType] = useState()
    let [selectParaModal, setSelectParaModal] = useState(false)
    let [paragraph, setParagraph] = useState(null)
    let [defaultEditorValue, setDefaultEditorValue] = useState()
    let [currentLanguage, setLanguage] = useState('pramukhime:english')

    useEffect(() => {
        if(updateData && updateData.question){
            selectQueType(updateData.type)
            setQuestion({type:updateData?.html ? 'editor' : 'text', en:updateData.question.en, hn:updateData.question.hn})
            setSolution({type:updateData?.solution?.html ? 'editor' : 'text', en:updateData.solution?.en, hn:updateData.solution?.hn})
            setAnswer({...defaultAnswer, en:findAnswerType(updateData.type) == 'descriptive' || findAnswerType(updateData.type) == 'number' ?
                updateData.answer
                :
                _.compact(updateData.options.map(d => _.findIndex(updateData.answer, a => _.isMatch(d, {_id:a})) != -1 ? d.temp_id : null))
            })
            
            setAnswerType(findAnswerType(updateData.type))
            setParagraph(updateData.paragraph)

            if(updateData.answer.length == 2){
                const ans = updateData.answer
                setRange({start:ans[0], end:ans[1]})
            }

            if(updateData.options.length){
                setOptions(updateData.options.map(opt => ({id:opt.temp_id, type:opt?.html ? 'editor' : 'text', en:opt.body.en, hn:opt.body.hn})))
            }
        }else if(updateData){
            selectQueType(updateData.type)
            setParagraph(updateData.paragraph)
            setAnswerType(findAnswerType(updateData.type))
            _setOptions(updateData.type)
        }

        return () => {
            dispatch(resetUpdateQuestion())
            dispatch(resetAddQuestion())
            window.pramukhIME.disable()
        }
    }, [])

    useEffect(() => {
        const currentData = ref.current
        window.renderMathInElement(currentData)
    }, [openEditor, question, selectedTab, selectParaModal, paragraph])

    useEffect(() => {
        setLanguage(selectedTab === 'hindi' ? 'pramukhindic:hindi' : 'pramukhime:english')
    }, [selectedTab])

    useEffect(() => {
        let lang = currentLanguage.split(':')
	    window.pramukhIME.setLanguage(lang[1], lang[0]);
	    window.pramukhIME.addKeyboard("PramukhIndic");
	    window.pramukhIME.enable();
    }, [currentLanguage])

    let finalData = {
        question:{en:question.en, hn:question.hn, html:question.type == 'editor' ? true : false},
        options: options.map((opt, i) => (
            {temp_id:opt.id, 
                key:{en:String.fromCharCode(65 + i), hn: String.fromCharCode('क'.charCodeAt() + i)}, 
                body:{en:opt.en, hn:opt.hn},
                html:opt.type == 'editor' ? true : false
            })
        ),
        answer:range ? [range.start, range.end] : answer.en,
        solution:solution && {en:solution.en, hn:solution.hn, html:solution.type == 'editor' ? true : false},
        type:selectedQueType,
        paragraph:paragraph ? paragraph._id : null, ...tags
    }

    useEffect(() => {
        if(addQuestionStatus == STATUS.SUCCESS){
            selectQueType(null)
            resetStates()
        }
    }, [addQuestionStatus])

    const _addMoreOptions = () => {
        let data = [...options, {id:Math.random(), en:'', hn:'', type:'text'}]
        setOptions(data)
    }

    const _removeOption = (indx) => {
        let data = [...options]
        data.splice(indx, 1)
        setOptions(data)
    }
    
    const _optionChange = (event, indx, lang) => {
        // let data = [...options]
        let value = event.target?.value || event.data
        
        if(lang === 'english'){
            setOptions(optns => optns.map((o, i ) => i == indx ? Object.assign(o, {en:value}) : o))
        }
        else if(lang === 'hindi')
            setOptions(optns => optns.map((o, i ) => i == indx ? Object.assign(o, {hn:value}) : o))
    }

    const openOptionEditor = () => {
        _openEditor('option')
        // setOptions(defaultOptions)
    }

    const openSolutionEditor = () => {
        _openEditor('solution')
        setSolution(defaultSolution)
    }

    const openAnswerEditor = () => {
        _openEditor('answer')
        setAnswer(defaultAnswer)
    }

    const _openEditor = (type) => {
        let data = [...openEditor]
        data = _.xor(data, [type])

        // setModalType({title, type})
        setOpenEditor(data)
    }

    const resetStates = (type) => {
        setRange(null)
        setSolution(defaultSolution)
        setAnswer({type:'text', en:[], hn:[]})
        setQuestion(defaultInput)

        if(type != 'paragraph_scq' && type != 'paragraph_mcq' ){
            setParagraph(null)
        }
    }

    const _selectQuestionType = (type) => {
        _setOptions(type)

        selectQueType(type)
        setAnswerType(findAnswerType(type))
        resetStates(type)
    }

    const _setOptions = (type) => {
        if(findAnswerType(type) == 'multiple' || findAnswerType(type) == 'paragraph'){
            setOptions(defaultOptions)
            setAnswer(defaultAnswer)
        }else{
            setOptions([])
        }

        if(type == 'assertion_and_reason'){

            let data = assAndReasonOptions
            data = defaultOptions.map((d, i) => Object.assign(d, {en:data[i].en, hn:data[i].hn}))
            setOptions(data)
        }
        
        if(type == 'true_false'){
            let data = [{en:'True', hn:'सही'}, {en:'False', hn:'गलत'}]
            data = _.compact(options.map((d, i) => data[i] ? Object.assign(d, {en:data[i].en, hn:data[i].hn}) : null))
            setOptions(opts =>  _.compact(opts.map((d, i) => data[i] ? Object.assign(d, {en:data[i].en, hn:data[i].hn}) : null)))
        }
    }

    const changeQuestionText = (e, lang) => {

        let data = e.data
        let final= {}
        if(lang == 'english')
            final.en = data
        else if(lang == 'hindi')
            final.hn = data

        setQuestion( dd =>  ({...dd, ...final}))
    }

    const openOptionText = (indx) => {
        let data = [...options]
        data[indx].type = 'text'
        data[indx].en = ''
        data[indx].hn = ''
        setOptions(data)
    }

    const changeSolution = (e, lang) => {
        let value = e.target?.value || e.data || null
        let type = checkEditor('solution') ? 'editor' : 'text'
        
        if(lang == 'english')
            setSolution(s => ({...s, type, en:value}))
        else if(lang == 'hindi')
            setSolution(s => ({...s, type, hn:value}))
    }

    const changeAnswer = (e, lang) => {
        let value = e.target?.value || e.data || null

        if(lang == 'english')
            setAnswer(a => ({...a, type:'text', en:[value]}))
        else if(lang == 'hindi')
            setAnswer(a => ({...a, type:'text', hn:[value]}))
    }

    const selectCorrrectOption = (id) => {
        const singles = ['MCQ', 'paragraph_mcq', 'mtc_mcq']
        let dataEn = []
        let dataHn = []

        if(language == 'english'){
            if(_.findIndex(singles,d => d == selectedQueType) != -1){
                if(answer.en.length){
                    dataEn = _.xor(answer.en, [id])
                } else{
                    dataEn = [id]
                }
            }else{
                dataEn = [id]
            }
        }
        else if(language == 'hindi'){
            if(_.findIndex(singles,d => d == selectedQueType) != -1){
                if(answer.hn.length){
                    dataEn = _.xor(answer.hn, [id])
                } else{
                    dataEn = [id]
                }
            }else{
                dataEn = [id]
            }
        }

        setAnswer({type:'text', en:dataEn, hn:dataHn})
    } 

    const _selectRange = () => {
        const data = range ? false : {start:'', end:''}
        setAnswer(defaultAnswer)
        setRange(data)
    }

    const rangeStart = (e) => {
        const data = {...range}
        data.start = e.target.value
        setRange(data)
    }

    const rangeEnd = (e) => {
        const data = {...range}
        data.end = e.target.value
        setRange(data)
    }

    const _closeDrawer = () => {
        setSelectParaModal(false)
    }

    const openSelectParaModal = () => {
        setSelectParaModal(true)
    }

    const errorStringFun = (answer) => {
        let errorString = ''
        if(answer){
            errorString += 'Answer, '
        }
        if(!tags.subjects?.length){
            errorString += 'Subjects, '
        } 
        if(!tags.exams?.length){
            errorString += 'Exams '
        }

        return errorString += 'Not Added.'
    }

    const addQuestion = () => {
        if(!finalData.answer.length || !tags.subjects?.length || !tags.exams?.length){ 
            return ConfirmAlert(() => dispatch(addQuestionAction(finalData)), errorStringFun(!finalData.answer.length), 'still want to continue?', addQuestionStatus == STATUS.FETCHING)   
        }
        dispatch(addQuestionAction(finalData))
    }

    const updateQuestion = () => {
        if(updateData.updateType == 'testQuestion'){
            const data = {...finalData, id:updateData._id, sectionId: updateData.sectionId}
            if(!finalData.answer.length || !tags.subjects?.length || !tags.exams?.length){ 
                return ConfirmAlert(() => dispatch(updateTestQuestionDataAction(data)), errorStringFun(!finalData.answer.length), 'still want to continue?', updateQueStatus == STATUS.FETCHING)   
            }
            dispatch(updateTestQuestionDataAction(data))
        }else{
            const data = {...finalData, id:updateData._id}
            if(!finalData.answer.length || !tags.subjects?.length || !tags.exams?.length){ 
                return ConfirmAlert(() => dispatch(updateQuestionAction(data)), errorStringFun(!finalData.answer.length), 'still want to continue?', updateQueStatus == STATUS.FETCHING)   
            }
            dispatch(updateQuestionAction(data))
        }
    }

    const dataToBulkUpload = () => {
        const data = {...finalData}
        dataToBulk(data)
    }

    const addTestQuestion = () => {
        let data = finalData
        data = {questionBank:data, testQuestion:updateData}
        
        if(!data.questionBank.answer.length || !tags.subjects?.length || !tags.exams?.length){ 
            return ConfirmAlert(() => dispatch(addNewTestQuestionAction(data)), errorStringFun(!data.questionBank.answer.length), 'still want to continue?', addNewTestQuestionStatus == STATUS.FETCHING)   
        }
        dispatch(addNewTestQuestionAction(data))
    }

    const checkEditor = (type) => {
        return _.findIndex(openEditor,d => d == type) != -1
    }

    const english = language === 'english'

    const queData = {question:{en:question.en, hn:question.hn}, answer:{en:answer.en, hn:answer.hn}, solution:{en:solution.en, hn:solution.hn}}

    //const disablAddQuestion = (!question.en && !question.hn) || (!tags.subjects?.length || !tags.exams?.length) || ((selectedQueType =='paragraph_mcq' || selectedQueType =='paragraph_scq') && !paragraph)
    const disablAddQuestion = (!question.en && !question.hn) || ((selectedQueType =='paragraph_mcq' || selectedQueType =='paragraph_scq') && !paragraph)
    return(
        <div key={language} style={{padding:'0 20px'}} ref={ref}>
            {/* <Button>Copy From Hindi</Button> */}
            <br/>
                <Form layout='vertical'>
                    <Form.Item label={<b>Select Question Type</b>} required>
                        <Select placeholder='Select Question Type' value={selectedQueType} onChange={_selectQuestionType}>
                            {_.filter(QuestionTypeNames,t => updateData?.testId ?  t.type == updateData.type : t ).map(type => 
                                <Select.Option value={type.type} key={type.id}>{type.longName}</Select.Option>
                            )}
                        </Select>    
                    </Form.Item>

                    {selectedQueType ? 
                        <>
                            <br/>
                            {selectedQueType == 'paragraph_mcq' || selectedQueType == 'paragraph_scq' ? 
                                <>
                                    <Form.Item label={<Text level={5} style={{color:'#3498DB', fontSize:'18px', marginRight:'30px'}}><span style={{color:'#FF9596'}}>*</span>   Paragraph</Text>}>
                                        <Button onClick={openSelectParaModal} type='primary' style={{marginBottom:'20px'}}><SelectOutlined/> Select Paragraph</Button><br/>
                                        {paragraph ?
                                            <>
                                                <div style={{display:'flex', alignItems:'stretch', width:'100%'}}>
                                                    <div style={{flexGrow:1, paddingRight:20}}>
                                                        <Card bodyStyle={{padding:'10px'}}>
                                                            <div style={{marginBottom:'10px', fontWeight:'bold'}}> Paragraph (Hindi)</div>
                                                            {paragraph.body.hn ? 
                                                                <div dangerouslySetInnerHTML={{__html:paragraph.body.hn}}/> 
                                                                :
                                                                <Empty description='No Paragraph'/>
                                                            }
                                                        </Card>
                                                    </div>
                                                    <Card bodyStyle={{padding:'10px'}} style={{flexGrow:1,}}>
                                                        <div style={{marginBottom:'10px', fontWeight:'bold'}}> Paragraph (English)</div>
                                                        {paragraph.body.en ? 
                                                            <div dangerouslySetInnerHTML={{__html:paragraph.body.en}}/> 
                                                            :
                                                            <Empty description='No Paragraph'/>
                                                        }
                                                    </Card>
                                                </div>
                                                <br/>
                                            </>
                                            : null
                                        }
                                    </Form.Item>
                                </>
                                : null
                            }

                            <Space size='large'>
                                <Form.Item label={<b>Question (Hindi)</b>} required>
                                    <div style={{marginBottom:'10px'}}>
                                        {checkEditor('question') ? 
                                            <Input.TextArea rows='3' value={queData.question} onChange={(e) => changeQuestionText(e, 'hindi')} placeholder='Question'/>    
                                            :
                                            <CkeditorComponent id='ckeditorQuestionHindi' language={'pramukhindic:hindi'} name={'ckeditorQuestionHindi'} defaultData={queData.question?.hn || null} onChangeData={(e) => changeQuestionText(e, 'hindi')}/>
                                        }
                                    </div>
                                    
                                    {/* <Tooltip title='Open Editor' placement='right'>
                                        <Button size='small' icon={<FontSizeOutlined/>} key='1'  onClick={openQuestionEditor }>Editor</Button>
                                    </Tooltip>
                                    {checkEditor('question') ? 
                                        <Button size='small' key='2' onClick={openQuestionText} icon={<FormOutlined />}>Text</Button>
                                        : null
                                    } */}
                                </Form.Item>
                                <Form.Item label={<b>Question (English)</b>} required>
                                    <div style={{marginBottom:'10px'}}>
                                        {checkEditor('question') ? 
                                            <Input.TextArea rows='3' value={queData.question} onChange={(e) => changeQuestionText(e, 'english')} placeholder='Question'/>    
                                            :
                                            <CkeditorComponent id='ckeditorQuestionEnglish' language={'pramukhime:english'} name={'ckeditorQuestionEnglish'} defaultData={queData.question?.en || null} onChangeData={(e) => changeQuestionText(e, 'english')}/>
                                        }
                                    </div>
                                </Form.Item>
                            </Space>

                            {answerType == 'multiple' || answerType == 'paragraph' ? 
                                <QuestionOptions options={options} english={english}
                                    correctOptions={answer.en} 
                                    currentLanguage={currentLanguage}
                                    openEditor={openOptionEditor}  
                                    openText={openOptionText}
                                    editor={checkEditor('option')}
                                    addMoreOptions={_addMoreOptions} 
                                    optionChange={_optionChange}
                                    removeOption={_removeOption}
                                    selectCorrrectOption={selectCorrrectOption}
                                />
                                :answerType == 'descriptive' ?
                                    <div style={{display:'flex'}}>
                                        <div style={{flexGrow:1, paddingRight:'20px'}}>
                                            <Form.Item label={<b>Type Answer (Hindi)</b>}>
                                                <div style={{marginBottom:'10px'}}>
                                                    {checkEditor('answer') ?
                                                        <Input.TextArea rows='3' onChange={e => changeAnswer(e, 'hindi')} value={queData.answer?.hn?.[0]} placeholder='Answer'/>
                                                        :
                                                        <CkeditorComponent id='ckeditorAnsHindi' language={'pramukhindic:hindi'} name={'ckeditorAnsHindi'} defaultData={queData.answer?.hn[0] || null} onChangeData={(e) => changeAnswer(e, 'hindi')}/>
                                                    }
                                                </div>
                                            </Form.Item>
                                        </div>
                                        <div style={{flexGrow:1}}>
                                            <Form.Item label={<b>Type Answer (English)</b>}>
                                                <div style={{marginBottom:'10px'}}>
                                                    {checkEditor('answer') ?
                                                        <Input.TextArea rows='3' onChange={e => changeAnswer(e, 'english')} value={queData.answer?.en?.[0]} placeholder='Answer'/>
                                                        :
                                                        <CkeditorComponent id='ckeditorAnsEnglish' language={'pramukhime:english'} name={'ckeditorAnsEnglish'} defaultData={queData.answer?.en[0] || null} onChangeData={(e) => changeAnswer(e, 'english')}/>

                                                    }
                                                </div>
                                                <Button size='small' key='1'  onClick={openAnswerEditor} icon={<FontSizeOutlined/>}>Editor</Button>&nbsp;
                                            </Form.Item>
                                        </div>
                                    </div>
                                    :answerType == 'number' ?
                                        <div>
                                            {range ? 
                                                <>
                                                    <b>Type Answer</b>
                                                    <div style={{display:'flex', width:'100%'}}>
                                                        <div style={{flexGrow:1, paddingRight:'10px'}}>
                                                            <Input type='number' value={range.start} onChange={rangeStart} placeholder='Range Start'/>
                                                        </div>
                                                        <div style={{flexGrow:1}}>
                                                            <Input type='number' value={range.end} onChange={rangeEnd} placeholder='Range End'/>
                                                        </div>
                                                    </div>
                                                    <div style={{marginTop:'10px'}}>Range <Switch checked={range} onChange={_selectRange}/></div>
                                                    <br/>
                                                    
                                                </>
                                                :
                                                <Form.Item label={<b>Type Answer</b>}>
                                                    <Input type='number' onChange={e => changeAnswer(e, 'english')} style={{marginBottom:'10px'}} value={queData.answer?.en?.[0]} placeholder='Answer'/>
                                                    Range <Switch checked={range} onChange={_selectRange}/>
                                                </Form.Item>    
                                            }
                                        </div>
                                        : null
                            }

                            {answerType == 'multiple' || answerType == 'paragraph' ? 
                                <Form.Item label={<b>Select Correct Option</b>}>
                                    <Space>
                                        {options.map((opt, i) => 
                                            <Checkbox checked={_.findIndex(answer.en,o => o == opt.id) != -1} onChange={() => selectCorrrectOption(opt.id)} key={opt.id}>{`Option (${String.fromCharCode(i + 65)})`}</Checkbox>
                                        )}
                                    </Space>
                                </Form.Item>
                                : null
                            }

                            <div style={{display:'flex'}}>
                                <div style={{flexGrow:1, paddingRight:'20px'}}>
                                    <Form.Item label={<b>Solution (Hindi)</b>}>
                                        <div style={{marginBottom:'10px'}}>
                                            {/* {checkEditor('solution') ?
                                                <CkeditorComponent id='ckeditorSolutionHindi' language={'pramukhindic:hindi'} 
                                                    name={'ckeditorSolutionHindi'} 
                                                    defaultData={queData.solution?.hn || null} 
                                                    onChangeData={e => changeSolution(e, 'hindi')}
                                                />

                                                :
                                                <HindiInput componentType='textarea' rows='3' value={queData.solution?.hn || null} onChange={e => changeSolution(e, 'hindi')} placeholder='solution'/>
                                            }     */}
                                            <CkeditorComponent id='ckeditorSolutionHindi' language={'pramukhindic:hindi'} 
                                                name={'ckeditorSolutionHindi'} 
                                                defaultData={queData.solution?.hn || null} 
                                                onChangeData={e => changeSolution(e, 'hindi')}
                                            />
                                        </div>
                                    </Form.Item>
                                </div>
                                <div style={{flexGrow:1}}>
                                    <Form.Item label={<b>Solution (English)</b>}>
                                        <div style={{marginBottom:'10px'}}>
                                            {/* {checkEditor('solution') ?
                                                <CkeditorComponent id='ckeditorSolutionEnglish' 
                                                    language={'pramukhime:english'} name={'ckeditorSolutionEnglish'} 
                                                    defaultData={queData.solution?.en || null} onChangeData={e => changeSolution(e, 'english')}
                                                />
                                                :
                                                <Input.TextArea rows='3' value={queData.solution?.en || null} onChange={e => changeSolution(e, 'english')} placeholder='solution'/>
                                            }     */}
                                            <CkeditorComponent id='ckeditorSolutionEnglish' 
                                                language={'pramukhime:english'} name={'ckeditorSolutionEnglish'} 
                                                defaultData={queData.solution?.en || null} onChangeData={e => changeSolution(e, 'english')}
                                            />
                                        </div>
                                        {/* <Tooltip title={`Open ${checkEditor('solution') ? 'Text' : 'Editor'}`} placement='right'>
                                            <Button size='small' onClick={openSolutionEditor} icon={<FontSizeOutlined/>}>{checkEditor('solution') ? 'Text' : 'Editor'}</Button>
                                        </Tooltip>&nbsp; */}
                                    </Form.Item>
                                </div>
                            </div>
                            {/* <div style={{textAlign:'center'}}>
                                <span>
                                    {language == 'english' ? 
                                        <Button onClick={() => selectTab('hindi')} size='large'>Edit Hindi</Button>
                                        :language == 'hindi' ?
                                            <Button onClick={() => selectTab('english')} size='large'>Edit English</Button>
                                            : null
                                    }
                                    &nbsp;&nbsp;
                                    <Button onClick={() => selectTab('tags')} size='large'>Edit Tags</Button>
                                </span>
                            </div> */}
                        </>
                        : null
                    }
                    <div style={{textAlign:'center'}}>
                        <Button type='primary' size='large' 
                            disabled={disablAddQuestion}
                            loading={addQuestionStatus == STATUS.FETCHING || updateQueStatus == STATUS.FETCHING || addNewTestQuestionStatus == STATUS.FETCHING} 
                            onClick={updateData && updateData.question ? (bulkQuestions ? dataToBulkUpload : updateQuestion) : updateData && updateData.testId ? addTestQuestion : addQuestion}
                            icon={<PlusOutlined/>}
                        >
                            {updateData && updateData.question ? 'Update Question' : 'Add Question'}
                        </Button>
                    </div>
                    
                </Form>
            <br/><br/>
            {/* {openEditor ? <CkeditorModal defaultValue={defaultEditorValue} onSubmit={getEditorData} title={modalType.title} visible={openEditor} currentLanguage={currentLanguage.split(':')[1]} closeModal={_closeModal}/> : null } */}
            {selectParaModal ? <SelectParagraph getParagrpah={setParagraph} visible={selectParaModal} closeDrawer={_closeDrawer}/> : null}
        </div>
    )
}

const QuestionOptions = ({addMoreOptions, options, editor, currentLanguage, removeOption, optionChange, openEditor, openText, selectCorrrectOption, correctOptions, english}) => {

    return(
        <>
            <br/>
            <Form.Item>
                <Text level={5} style={{color:'#3498DB', marginRight:'30px', fontSize:'18px', fontWeight:'bold'}}>Options</Text>
                <span style={{float:''}}>
                    <Switch checked={editor} onChange={openEditor}/> &nbsp;&nbsp;
                    <b>Show Editor</b>
                </span>
            </Form.Item>
            <div style={{display:'flex', flexDirection:'column'}}>
                {options.map((optn, i) =>
                    {
                        let selected = _.findIndex(correctOptions,o => o == optn.id) != -1
                        return(
                            <div style={{display:'flex'}} key={i}>
                                <div style={{flexGrow:1, paddingRight:'20px'}}>
                                    <Form.Item label={
                                            <div>
                                                {/* <Tooltip title='Correct Option'>
                                                    <Checkbox checked={_.findIndex(correctOptions,o => o == optn.id) != -1} onChange={() => selectCorrrectOption(optn.id)}></Checkbox>
                                                </Tooltip>&nbsp;&nbsp; */}
                                                <span>
                                                    <b style={{marginRight:'5px', color:selected && '#66BB6A'}}> 
                                                        {`Option (${String.fromCharCode('क'.charCodeAt() + i)})`}
                                                    </b>
                                                </span>

                                                <span>
                                                    {selected ? <CheckCircleTwoTone twoToneColor='#52c41a' style={{fontSize:'18px', color:'#66BB6A'}}/> : null }
                                                </span>
                                            </div>
                                    }>
                                        <div style={{marginBottom:'10px'}}>
                                            {editor ? 
                                                
                                                <div>
                                                    <CkeditorComponent id={'optionHindi'+i} language={'pramukhindic:hindi'} 
                                                        name={'optionHindi'+i} 
                                                        defaultData={optn.hn} 
                                                        onChangeData={(e) => optionChange(e, i, 'hindi')}
                                                    />
                                                </div>
                                                :   
                                                <HindiInput type='text' 
                                                    value={optn.hn} 
                                                    placeholder={`option ${String.fromCharCode('क'.charCodeAt() + i)}`} 
                                                    onChange={(e) => optionChange(e, i, 'hindi')} 
                                                />
                                            }
                                        </div>
                                        {/* <Tooltip title='Open Editor' placement='left'>
                                            <Button onClick={() => openEditor(i)} size='small' icon={<FontSizeOutlined/>}>Editor</Button>
                                        </Tooltip>&nbsp;
                                        {optn.type == 'editor' ? <span><Button onClick={() => openText(i)} size='small' icon={<FormOutlined />}>Text</Button>&nbsp;&nbsp;</span> : null} */}
                                        <Tooltip title='Remove'>
                                            <Button onClick={() => removeOption(i)} icon={<DeleteTwoTone twoToneColor="#eb2f96" />} size='small'>Remove</Button>
                                        </Tooltip>
                                    </Form.Item>
                                </div>
                                <div style={{flexGrow:1}}>
                                    <Form.Item
                                        label={
                                            <div>
                                                <Tooltip title='Correct Option'>
                                                    <Checkbox checked={_.findIndex(correctOptions,o => o == optn.id) != -1} onChange={() => selectCorrrectOption(optn.id)}></Checkbox>
                                                </Tooltip>&nbsp;&nbsp;
                                                <b style={{marginRight:'#52c41a', color:selected && '#66BB6A'}}>{`Option (${String.fromCharCode(i + 65)})`}</b>
                                                { selected ? <CheckCircleTwoTone twoToneColor='#52c41a' style={{fontSize:'18px', color:'#66BB6A', marginLeft:'5px'}}/> : null }
                                            </div>
                                    }>
                                        <div style={{marginBottom:'10px'}}>
                                            {editor ? 
                                                
                                                <div>
                                                    <CkeditorComponent id={'optionEnglish'+i} language={'pramukhime:english'} 
                                                        name={'optionEnglish'+i} 
                                                        defaultData={optn.en} 
                                                        onChangeData={(e) => optionChange(e, i, 'english')}
                                                    />
                                                </div>
                                                :
                                                <Input type='text'
                                                    value={optn.en} 
                                                    placeholder={`option ${String.fromCharCode(i + 65)}`} 
                                                    onChange={(e) => optionChange(e, i, 'english')} 
                                                />
                                            }
                                        </div>
                                        {/* <Tooltip title='Open Editor' placement='left'>
                                            <Button onClick={() => openEditor(i)} size='small' icon={<FontSizeOutlined/>}>Editor</Button>
                                        </Tooltip>&nbsp;
                                        {optn.type == 'editor' ? <span><Button onClick={() => openText(i)} size='small' icon={<FormOutlined />}>Text</Button>&nbsp;&nbsp;</span> : null} */}
                                        {/* <Tooltip title='Remove'>
                                            <Button onClick={() => removeOption(i)} icon={<DeleteTwoTone twoToneColor="#eb2f96" />} size='small'>Remove</Button>
                                        </Tooltip> */}
                                    </Form.Item>
                                </div>
                            </div>
                        )
                    }
                )}
            </div>
            <Form.Item>
                <Button type='primary' disabled={options.length > 7 } onClick={addMoreOptions}><PlusOutlined/> Add More Option</Button>
            </Form.Item>
            <br/>
        </>
    )
}