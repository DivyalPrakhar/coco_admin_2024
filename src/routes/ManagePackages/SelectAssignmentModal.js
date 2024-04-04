import { Card, Table, Modal, Tag, Form, Input, Space, Select, Button } from 'antd'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import { getAssignmentsAction, getFilteredAssignmentsAction } from '../../redux/reducers/assignments'
import _ from 'lodash'
import { CheckCircleOutlined, LinkOutlined, SelectOutlined } from '@ant-design/icons'
import { TagsSearch } from './AddPackage'
import Text from 'antd/lib/typography/Text'
import { SelectTagsModal } from './SelectTagsModal'

export const SelectAssignmentModal = ({visible, closeModal, onfinish, loading, alreadySelected}) => {
    const dispatch = useDispatch()

    const {getFilteredAssignmentsStatus, filteredAssignmentsList, configData} = useSelector((state) => ({
        getFilteredAssignmentsStatus:state.assignments.getFilteredAssignmentsStatus,
        filteredAssignmentsList:state.assignments.filteredAssignmentsList,
        configData: state.lmsConfig,

    }))

    let [selectedAssingments, changeAssignment] = useState([])
    let [tagsModal, changeTagsModal] = useState()
    let [selectedTags, changeSelectedTags] = useState([])
    let [selectedExams, changeSelectedExams] = useState([])
    let [title, changeTitle] = useState([])

    useEffect(() => {
        if(alreadySelected?.length){
            changeAssignment(alreadySelected.map(d => ({...d, added:true})))
        }

        // if(getFilteredAssignmentsStatus != STATUS.SUCCESS)
        //     dispatch(getAssignmentsAction())
    }, [])

    const selectAssignment =(d) => {
        let data = [...selectedAssingments]
        data = _.xor(data, [d])
        changeAssignment(data)
    }

    const selected = () => {
        onfinish(selectedAssingments)
    }

    const _tagsModal = () => {
        changeTagsModal(!tagsModal)
    }

    const _selectTags = (data) => {
        changeSelectedTags(data)
    }

    const removeTag = (id) => {
        let data = [...selectedTags]
        _.remove(data,d => d._id == id)
        changeSelectedTags(data)
    }

    const selectExams = (exams) => {
        changeSelectedExams(exams)
    }

    const _changeTitle= (e) => {
        changeTitle(e.target.value)
    }

    const fetchAssinments = () => {
        let data = {exams:selectedExams, tags:selectedTags?.length ? selectedTags.map(t => t._id) : [] , title}
        data = _.omit(data,  _.isEmpty)
        dispatch(getFilteredAssignmentsAction(data))
    }

    return(
        <Modal visible={visible} title='Select Assignment' confirmLoading={loading} onCancel={closeModal} width={1300} onOk={selected}>
            {configData.defaultDataStatus === STATUS.SUCCESS ?
                <Card style={{border:0}} bodyStyle={{padding:0}} loading={configData.defaultDataStatus === STATUS.FETCHING}>
                    <Form layout='vertical'>
                        <div style={{marginBottom:'10px'}}>
                            <Text style={{fontSize:'16px', fontWeight:'bold', color:'#3498DB'}}>Filters</Text>
                        </div>
                        <Space size='large' wrap>
                            <Form.Item label='Title' style={{minWidth:'150px'}}>
                                <Input onChange={_changeTitle} placeholder='title'/>
                            </Form.Item>
                            <Form.Item label='Select Exams'>
                                <Select placeholder='select' mode='multiple' onChange={selectExams} style={{minWidth:'150px'}}>
                                    {configData.defaultData.exams?.length ?
                                        configData.defaultData.exams.map(e =>
                                            <Select.Option key={e._id} value={e._id}>{e.name?.en}</Select.Option>
                                        )
                                        :
                                        null
                                    }         
                                </Select>
                            </Form.Item>
                            <Form.Item label='Select Tags'>
                                <Space wrap style={{maxWidth:'300px'}} size='small'>
                                    {selectedTags?.length ? selectedTags.map(tag => <Tag key={tag._id} closable onClose={() => removeTag(tag._id)}>{tag.name}</Tag>) : null}
                                    <Button onClick={_tagsModal} type='primary' ghost icon={<SelectOutlined />}>Select Tags</Button>
                                </Space>
                            </Form.Item>
                            <Form.Item>
                                <br/>
                                <Button onClick={fetchAssinments} type='primary'>Fetch Assignments</Button>
                            </Form.Item>
                        </Space>
                    </Form> 
                    <Table bordered dataSource={_.orderBy(filteredAssignmentsList, ['createdAt'], ['desc'])} loading={getFilteredAssignmentsStatus == STATUS.FETCHING} pagination={{position:['bottomCenter', 'topCenter']}}
                        onRow={(record) => {
                            const added = alreadySelected?.length ? _.findIndex(_.filter(selectedAssingments,d => d.added), d => d._id == record._id) != -1 : 0 
                            return {onClick: () => added ? null : selectAssignment(record),};
                        }}
                        
                        rowClassName={(record) => {
                                const added = alreadySelected?.length ? _.findIndex(_.filter(selectedAssingments,d => d.added), d => d._id == record._id) != -1 : 0 
                                return(added ? 'selectedTableRow' : 'normalTableRow')
                            }}
                    >
                        <Table.Column title={<b>Select Status</b>} key='selectStatus' align='center'
                            render={(d, row) => _.findIndex(selectedAssingments, s => s?._id == row._id) != -1 ? 
                                <Tag color="green">Selected <CheckCircleOutlined/></Tag> : ''
                            }
                        ></Table.Column>
                        <Table.Column title={<b>Title</b>} dataIndex='title' key='title'></Table.Column>
                        <Table.Column title={<b>Description</b>} dataIndex='description' key='description'></Table.Column>
                        <Table.Column title={<b>Question Paper</b>} dataIndex='questionPaper' key='questionPaper'
                            render={(d) => d &&
                                <a href={d} target='_black'><LinkOutlined/> Paper</a>
                            }
                        ></Table.Column>
                        <Table.Column title={<b>Exams</b>} dataIndex='exams' key='exams'
                                render={(exams) =>
                                    exams?.length && 
                                    <Space wrap>
                                        {exams.map(exam => <Tag key={exam._id}>{exam.name?.en}</Tag>)}
                                    </Space> 
                                }
                            ></Table.Column>
                            <Table.Column title={<b>Tags</b>} dataIndex='tags' key='tags'
                                render={(tags) =>
                                    tags?.length && 
                                    <Space wrap>
                                        {tags.map(tag => <Tag key={tag._id}>{tag.name}</Tag>)}
                                    </Space>
                                }
                            ></Table.Column>
                    </Table>
                </Card>
                :
                <div style={{fontSize:'18px', color:'#AEB6BF'}}></div>
            }
            {tagsModal && <SelectTagsModal visible={tagsModal} selectedData={selectedTags} closeModal={_tagsModal} submitTags={_selectTags}/>}
        </Modal>
    )
}