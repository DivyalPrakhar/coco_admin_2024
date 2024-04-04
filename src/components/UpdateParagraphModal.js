import { DeleteOutlined, DeleteRowOutlined, DeleteTwoTone } from '@ant-design/icons'
import { Button, Table } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import Text from 'antd/lib/typography/Text'
import Title from 'antd/lib/typography/Title'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../Constants'
import { ConfirmAlert } from '../Constants/CommonAlerts'
import { getParaQsnsAction, removeParaQueAction, resetUpdatePara, updateParaAction } from '../redux/reducers/questions'
import { EditPara } from '../routes/Paragraph/AddParagraph'

export const UpdateParagraphModal = ({closeModal, visible, data}) => {
    const dispatch = useDispatch()
    const [engPara, _changeEngPara] = useState()
    const [hinPara, _changeHinPara] = useState()

    const {updateParaStatus, questions} = useSelector((state) => ({
        updateParaStatus:state.questions.updateParaStatus,
        questions:state.questions
    }))
    
    useEffect(() => {
        dispatch(getParaQsnsAction({id:data._id}))

        return () => {
            dispatch(resetUpdatePara())
        }
    }, [])

    useEffect(() => {
        if(updateParaStatus == STATUS.SUCCESS)
            closeModal() 
    }, [updateParaStatus])

    useEffect(() => {
        _changeEngPara(data.body.en)
        _changeHinPara(data.body.hn)
    }, [data])
    
    const changeHinPara =(e)=>{
        _changeHinPara(e.data) 
       }

    const changeEngPara=(e)=>{
        _changeEngPara(e.data) 

    }

    const updateParagraph = () => {
        dispatch(updateParaAction({body:{en:engPara, hn:hinPara}, id:data._id}))
    }

    const removeQues = (que) => {
        dispatch(removeParaQueAction({paragraphId:que.paragraph, questionId:que._id}))
    }

    const columns = [
        {title:'Question', dataIndex:'question', key:1, render:que => (
            <div dangerouslySetInnerHTML={{__html:que?.en}}/>
        )},
        {title:'actions', dataIndex:'actions', render:que => (
            <Button
                loading={questions.removeParaQueStatus == STATUS.FETCHING}
                onClick={() => ConfirmAlert(() => removeQues(que), 'Are you sure?')} 
                icon={<DeleteTwoTone twoToneColor="#eb2f96"/>}
            ></Button>
        )}
    ]

    const dataSource = questions.paraQuestions?.length ? questions.paraQuestions.map(que => 
            ({question:que.question, actions:que})
        ) : []

    return(
        <Modal title='Edit Paragraph' width={1200} visible={visible} onCancel={closeModal}
            footer={[
                <Button key="back" onClick={closeModal}>
                    cancel
                </Button>,
                <Button key="submit" type="primary" loading={updateParaStatus == STATUS.FETCHING} onClick={updateParagraph}>
                    Update
                </Button>,
            ]}
        >
            <EditPara data={data} changeEngPara={changeEngPara} changeHinPara={changeHinPara} />
            <br/>
            <div style={{marginBottom:'20px', fontSize:'18px'}}><Text>Questions</Text></div>
            <Table dataSource={dataSource} loading={questions.getParaQsnsStatus == STATUS.FETCHING} columns={columns} bordered
                pagination={{position:['bottomCenter']}}
            />
        </Modal>
    )
}