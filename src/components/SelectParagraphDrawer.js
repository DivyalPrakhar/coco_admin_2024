import { Button, Col, Drawer, Empty, Form, Input, Row, Select, Skeleton, Table, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../Constants'
import { getParaListAction } from '../redux/reducers/questions'
import _ from 'lodash'
import { renderMathTex } from '../utils/FileHelper'

export const SelectParagraph = ({getParagrpah, visible, closeDrawer}) => {
    const dispatch = useDispatch()
    const {paragraph} = useSelector((state) => ({
        paragraph:state.questions
    }))

    const [paragraphList, setParagraphList] = useState([])
    const [language, changeLanguage] = useState('en')

    useEffect(() => {
        if(document.getElementById('math-tex-id-para'))
            renderMathTex('math-tex-id-para')
    })

    // useEffect(() => {
    //     if(paragraph.getParaListStatus === STATUS.SUCCESS){
    //         setTimeout(() => (
    //             window.renderMathInElement(document.getElementById("math-tex-id-para", {
    //                 delimiters: [
    //                     { left: "$", right: "$", display: true }
    //                 ]
    //             }))
    //         ), 1000)
    //     }
    // }, [paragraph.getParaListStatus])

    useEffect(() => {
        dispatch(getParaListAction())
    }, [dispatch])

    useEffect(() => {
        if(paragraph.getParaListStatus == STATUS.SUCCESS)
            setParagraphList(paragraph.paragraphList)

    }, [paragraph.getParaListStatus])

    const searchPara = (e) => {
        const value = e.target.value
        let data = paragraphList

        if(value)
            data = data.map(val => _.includes(_.lowerCase(val.body.en), _.lowerCase(value)) ? val : null)
        else
            data = paragraph.paragraphList
            
        setParagraphList(_.compact(data))
 
    }

    const _selectParagraph = (para) => {
        getParagrpah(para)
        closeDrawer()
    }

    const columns = [
            {title:<b>Paragraph</b>, dataIndex:'para', key:'para', width:'80%',
                render:d => (<div dangerouslySetInnerHTML={{__html:d || '-'}}/>)
            },
            {title:<b>Select</b>, dataIndex:'select', key:'select', render:d => <Button type='link' onClick={() => _selectParagraph(d)}>Select</Button>}
        ]

    const dataSource = paragraphList?.docs?.length ?
        paragraphList?.docs?.map(para => ({key:para._id, para:para.body[language], select:para}))
        : []

    const _changeLanguage = (e) => {
        changeLanguage(e)
    }

    return(
        <Modal title='Select Paragraph' placement='right' width={1000} visible={visible} onCancel={closeDrawer}>
            {paragraph.getParaListStatus == STATUS.SUCCESS ?
                <div id='math-tex-id-para'>
                    <Form layout='vertical'>
                        <Row>
                            <Col span={12}>
                                <Form.Item label='Search Paragraph'>
                                    <Input onChange={searchPara} placeholder='search'/>
                                </Form.Item>
                            </Col>
                            <Col span={8} offset={4}>
                                <Form.Item label='Select Language'>
                                    <Select value={language} onChange={_changeLanguage}>
                                        <Select.Option value='en'>English</Select.Option>
                                        <Select.Option value='hn'>Hindi</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <br/>
                    <Table  
                        pagination={{defaultPageSize:20}}
                        bordered
                        columns={columns}
                        dataSource={dataSource}
                    />
                </div>
                :paragraph.getParaListStatus == STATUS.FETCHING?
                    <Skeleton/>
                    :null
            }
        </Modal>
    )
}