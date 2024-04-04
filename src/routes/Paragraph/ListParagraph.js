import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { current } from '@reduxjs/toolkit'
import { Button, Card, Form, List, Popover, Select, Table } from 'antd'
import { update } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { UpdateParagraphModal } from '../../components/UpdateParagraphModal'
import { UpdateQuestionModal } from '../../components/UpdateQuestionModal'
import { STATUS } from '../../Constants'
import { getParaListAction, resetParaList } from '../../redux/reducers/questions'
import { renderMathTex } from '../../utils/FileHelper'
//import renderMathInElement from "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/contrib/auto-render.mjs";

export const ListParagraph = () => {
    const dispatch = useDispatch()
    const [currentLanguage, setLanguage] = useState('en')
    const [actionId, setActionId] = useState(false)
    const [editParaModal, setEditParaModal] = useState(false)
    const [currentPara, setCurrentPara] = useState()
    const [addQueModal, changeAddQueModal] = useState()


    const {paragraph} = useSelector((state) => ({
        paragraph:state.questions
    }))

    useEffect(() => {
        dispatch(getParaListAction())

        return () => {
            dispatch(resetParaList())
        }
    }, [])

    useEffect(() => {
        renderMathTex()
    })

    const _openActions = id => {
        setActionId(id == actionId ? false : id)
    }

    const editParagrpah = (d) => {
        setEditParaModal(true) 
        _openActions(d._id)
        setCurrentPara(d)
    }

    const addQuestionModal = (para) => {
        changeAddQueModal(!addQueModal)
        setCurrentPara(para)
        setActionId(null)
    }

    const actionsList = [
        {title:'Add Questions', id:3, callback:addQuestionModal, icon:<PlusOutlined/>},
        {title:'Edit', id:3, callback:editParagrpah, icon:<EditOutlined/>},
        {title:'Delete', id:4, icon:<DeleteOutlined/>},
    ]

    const columns = [
        {title:<b>Paragraph</b>, dataIndex:'paragraph', key:'para', width:'70%',
            render:d => (
                <div dangerouslySetInnerHTML={{__html:d}}/>
            )
        },
        {title:<b>Number of Questions</b>, dataIndex:'queCount', key:'count', render:d => d || '0'},
        {title:<b>Actions</b>, dataIndex:'action', key:'action',
            render:d => (
                <div>
                    <Popover placement='bottom' trigger="click" visible={d._id == actionId}
                        onVisibleChange={() => _openActions(d._id)}
                        content={
                            <div>
                                <List size='small' dataSource={actionsList}
                                    renderItem={item => (
                                        <List.Item className='hover-list-item' style={{cursor:'pointer'}} onClick={() => item.callback ? item.callback(d) : null}>
                                            {item.title}
                                        </List.Item>
                                    )}
                                />
                            </div>
                        }
                    >
                        <Button type='link'>Actions</Button>
                    </Popover>
                </div>
            )
        },
    ]

    const dataSource = paragraph.paragraphList?.docs?.length ? 
        paragraph.paragraphList.docs.map(para => 
            ({
                key:para._id,
                paragraph:para.body[currentLanguage],
                queCount:para.questions.length || '0',
                action:para,

            })
        )
        : []

    const changeLanguage = (e) => {
        setLanguage(e)
    }

    const pageChange = (e) => {
        dispatch(getParaListAction({page:e.current}))
    }

    const _setEditParaModal = () => {
        setEditParaModal(false)
        setCurrentPara(null)
    }
    
    // useEffect(() => {
    //     if(paragraph.getParaListStatus == STATUS.SUCCESS){
    //         window.renderMathInElement(document.getElementById("math-tex-id", {
    //             delimiters: [
    //                 { left: "$", right: "$", display: true }
    //             ]
    //         })); 
    //     }
    // }, [paragraph.getParaListStatus, currentLanguage])

    
    return(
        <div>
            <CommonPageHeader title='Manage Paragraph'/>
            <br/>
            <Card>
                <Form layout='vertical'>
                    <Form.Item label='Select Language'>
                        <Select style={{width:'300px'}} defaultValue='en' onChange={changeLanguage}>
                            <Select.Option value='en'>English</Select.Option>
                            <Select.Option value='hn'>Hindi</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
                <br/>
                    <Table
                        id="math-tex-id"
                        loading={paragraph.getParaListStatus == STATUS.FETCHING}
                        bordered
                        columns={columns}
                        dataSource={dataSource}
                        onChange={pageChange}
                        pagination={{position:['bottomCenter'], total:paragraph.paragraphList?.pages, current:paragraph.paragraphList?.page}}
                    />
                <br/><br/>
            </Card>
            {editParaModal ? <UpdateParagraphModal data={currentPara} closeModal={_setEditParaModal} visible={editParaModal}/> : null }
            {addQueModal ? <UpdateQuestionModal visible={addQueModal} data={{type:'paragraph_scq', paragraph:currentPara}} closeModal={() => addQuestionModal(null)} /> : null }
        </div>
    )
}