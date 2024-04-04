import { Button, Card, Form } from 'antd'
import useSelection from 'antd/lib/table/hooks/useSelection'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CkeditorComponent } from '../../components/CkeditorComponent'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { STATUS } from '../../Constants'
import { addParagraphAction } from '../../redux/reducers/questions'

export const AddParagraph = () => {
    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const [englishPara, setEngPara] = useState()
    const [hindiPara, setHinPara] = useState()

    const {addParaStatus} = useSelector((state) => ({
        addParaStatus:state.questions.addParaStatus
    }))
    
    useEffect(() => {
        if(addParaStatus == STATUS.SUCCESS)
            form.resetFields()
            setEngPara('') 
            setHinPara('') 
    }, [addParaStatus])

    const changeEngPara = (e) => {
        setEngPara(e.data)
    }

    const changeHinPara = (e) => {
        setHinPara(e.data)
    }

    const addParagraph = () => {
        const data = {body:{en:englishPara, hn:hindiPara}, description:{en:'', hn:''}, name:{en:'', hn:''}}
        dispatch(addParagraphAction(data))
    }
    return(
        <div>
            <CommonPageHeader title='Add Paragraph'/>
            <br/>
            <Card>
                <EditPara form={form} changeEngPara={changeEngPara} changeHinPara={changeHinPara} englishPara={englishPara} hindiPara={hindiPara}/>
                <br/>
                <div style={{textAlign:'center'}}>
                    <Button loading={addParaStatus == STATUS.FETCHING} disabled={!englishPara && !hindiPara} size='large' type='primary' shape='round' onClick={addParagraph}>Add Paragraph</Button>
                </div>
            </Card>
        </div>
    )
}

export const EditPara = ({form, changeEngPara, changeHinPara, data, englishPara, hindiPara}) => {
    return(
        <Form layout='vertical' form={form}>
            <Form.Item label='Paragraph (English)' name='english'>
                <CkeditorComponent id='paraEnglish' language={'pramukhime:english'} name={'englishPara'} defaultData={englishPara ? englishPara : data?.body?.en} onChangeData={(data) => changeEngPara(data)}/>
            </Form.Item>
            <Form.Item label='Paragraph (Hindi)' name='hindi'>
                <CkeditorComponent id='paraHindi' language={'pramukhindic:hindi'} name={'hindiPara'} defaultData={hindiPara ? hindiPara : data?.body?.hn} onChangeData={(data) => changeHinPara(data)}/>
            </Form.Item>
        </Form>
    )
}