import { useEffect, useState } from 'react'
import {CkeditorComponent as CkEditor} from '../../components/CkeditorComponent'
import {DeleteOutlined, EditOutlined} from '@ant-design/icons'
import _ from 'lodash'
import { getAllInstructionAction, addInstructionAction, editInstructionAction, deleteInstructionAction, resetAllInstructionStatus } from '../../redux/reducers/test'
import { useDispatch, useSelector } from 'react-redux'
import { useAuthUser } from "../../App/Context";
import { STATUS } from '../../Constants'
import { ConfirmAlert } from '../../Constants/CommonAlerts'
import { CommonPageHeader } from '../../components/CommonPageHeader'


import { Row,  Col, Button, Modal, Input, Table, Card } from 'antd';

export const AddTestInstructionsModal = ({visible, closeModal}) => {
    return (
        <Modal title='Add Test Instruction Template' width={1300} visible={visible} footer={null} onCancel={closeModal} closable={false}>
            <AddTestInstructionsMain/>
        </Modal>
    )
}

export const AddTestInstructions = () => {
    const auth = useAuthUser()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllInstructionAction({instituteId: auth.staff.institute._id}))
    }, [auth.staff.institute._id, dispatch])

    return(
        <div>
            <CommonPageHeader title='Add Instructions'/>
            <br/>
            <Card>
                <div className="card-container">
                    <AddTestInstructionsMain />
                </div>
            </Card>
        </div>
    )
}

export const AddTestInstructionsMain = ({}) => {
    const auth = useAuthUser()
    const dispatch = useDispatch()

    const {instructionsData, editInstructionStatus, deleteInstructionStatus, addInstructionStatus} = useSelector((state) => ({
        instructionsData: state.test.allInstructionData,
        editInstructionStatus: state.test.editInstructionStatus,
        deleteInstructionStatus: state.test.deleteInstructionStatus,
        addInstructionStatus: state.test.addInstructionStatus
    }))

    const [nameData, changeNameData] = useState({name: {}})
    const [descriptionDataEnglish, changeDescriptionDataEnglish] = useState()
    const [descriptionDataHindi, changeDescriptionDataHindi] = useState()
    const [instructionId, changeInstructionId] = useState('')

	const [state, setState]= useState({language:'pramukhime:english'})

    const resetData = () => {
        changeNameData({name: {}})
        changeDescriptionDataEnglish()
        changeDescriptionDataHindi()
        changeInstructionId('')
    }

	useEffect(() => {
        let lang = state.language.split(':')
	    window.pramukhIME.setLanguage(lang[1], lang[0]);
	    window.pramukhIME.addKeyboard("PramukhIndic");
	    window.pramukhIME.enable();

        return () => {
            window.pramukhIME.disable()
        };
      }, []);

    useEffect(() => {
        if(editInstructionStatus == STATUS.SUCCESS || deleteInstructionStatus == STATUS.SUCCESS || addInstructionStatus == STATUS.SUCCESS){
            resetData()
            dispatch(resetAllInstructionStatus())
        }
    }, [editInstructionStatus, deleteInstructionStatus, addInstructionStatus])

    const handleLanguageChange = (value) => {
        let lang = value.split(':')
        window.pramukhIME.setLanguage(lang[1], lang[0]);
        setState({language: value})
    }

    const addName = (event, type) =>  {
        let name = nameData.name
        let message = (event ? event.target.value : '')
        if(type === 'hindi')
            changeNameData({name:Object.assign(name, {hn:message})})
        else
            changeNameData({name:Object.assign(name, {en:message})})
    }

    const addDescriptionEnglish = (data) => {
        changeDescriptionDataEnglish(data.data)
    }

    const addDescriptionHindi = (data) => {
        changeDescriptionDataHindi(data.data)
    }
   
	const editTemplate = (id) => {
	   let instructionTemplate =_.find(instructionsData, val => val._id === id)
	   changeNameData({name:Object.assign({}, instructionTemplate.name)})
	   changeDescriptionDataEnglish(instructionTemplate.description.en)
       changeDescriptionDataHindi(instructionTemplate.description.hn)
       changeInstructionId(id)
    }
    
    const submitInstruction = () => {
        if(instructionId){
            dispatch(editInstructionAction({
                id: instructionId,
                name: nameData?.name,
                description: {en: descriptionDataEnglish, hn: descriptionDataHindi},
                instituteId: auth.staff.institute._id
            }))
        }else{
            dispatch(addInstructionAction({
                name: nameData?.name,
                description: {en: descriptionDataEnglish, hn: descriptionDataHindi},
                instituteId: auth.staff.institute._id
            }))
        }
    }

    const columns = [
        {
            title:<b>#</b>,
            key:1,
            render: (data, d, i)=> i+1
        },
        {
            title:<b>Name</b>,
            key:2,
            render:data => (
                <div>{data.name ? data.name.en : null}</div>
            )
        },
        {
            title: <b>Action</b>,
            key: 3,
            render: data => (
                <div>
                    <Button onClick={() => editTemplate(data._id)} style={{border: 'none'}}>
                        <EditOutlined style={{fontSize: '14px'}} />
                    </Button>                   
                    <Button style={{border: 'none'}} danger onClick={() => ConfirmAlert(() => dispatch(deleteInstructionAction({id: data._id, instituteId: auth.staff.institute._id})))}>
                        <DeleteOutlined style={{fontSize: '14px'}} />
                    </Button>
                </div>
            )
        }
    ]

    return(
        <Row>
            <Col sm={16} key='test-name'>
                {instructionId ? 
                    <div style={{width:'100%', borderRadius:'3px', color: 'white', background:'#34495E', padding: '15px', marginBottom: '10px'}}>
                        <Row>
                            <Col sm={17}>
                                <b>{'Update '+_.find(instructionsData, val => val._id === instructionId)?.name?.en || 'Update '+_.find(instructionsData, val => val._id === instructionId)?.name?.hn}</b>
                            </Col>
                            <Col sm={7}>
                                <Button onClick={() => resetData()}>
                                    <b>Close And Add New Template</b>
                                </Button>
                            </Col>
                        </Row>
                    </div>
                :
                    null
                }
                <div style={{display:'flex'}}>
                    <div style={{width:'50%', paddingRight: '10px'}}>
                        <h3>Template Name (Hindi)</h3>
                        <Input onFocus={() => handleLanguageChange('pramukhindic:hindi')} defaultValue={nameData?.name?.hn} value={nameData?.name?.hn} type='text' rows={1} onChange={event => addName(event, 'hindi')} onBlur={event => addName(event, 'hindi')} />
                    </div>
                    <div style={{width:'50%'}}>
                        <h3>Template Name (English)</h3>
                        <Input type="text" onFocus={() => handleLanguageChange('pramukhime:english')} defaultValue={nameData?.name?.en} value={nameData?.name?.en} onChange={e=> addName(e, 'english')} />
                    </div>
                </div>
                <br/>
                <div>
                    <h3>Instruction (Hindi)</h3>
                    <CkEditor id='instructionHindi' language='pramukhindic:hindi' name='hindi-instruction' defaultData={descriptionDataHindi || null} onChangeData={(data) => addDescriptionHindi(data)}/>
                    <h3>Instruction (English)</h3>
                    <CkEditor id='instructionEnglish' language='pramukhime:english' name='english-instruction' defaultData={descriptionDataEnglish || null} onChangeData={(data) => addDescriptionEnglish(data)}/>
                </div>
                <Button loading={editInstructionStatus == STATUS.FETCHING || addInstructionStatus == STATUS.FETCHING} block disabled={!nameData?.name?.en && !nameData?.name?.hn} onClick={() => submitInstruction()}>
                    Submit
                </Button>
            </Col>
                <Col sm={8} style={{paddingLeft: '10px'}}>
                    <Table 
                        title={() => 'INSTRUCTION LIST'}
                        bordered
                        columns={columns}
                        dataSource={instructionsData || []}
                        pagination={false}
                    />
                </Col>
        </Row>
    )
}