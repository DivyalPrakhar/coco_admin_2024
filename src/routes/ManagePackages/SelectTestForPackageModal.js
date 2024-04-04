import { Modal, Table, Tag, Form, Input, Space, Select, Button,  } from 'antd'
import React, {useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { STATUS } from '../../Constants'
import _ from 'lodash';
import { getAllTestsAction } from '../../redux/reducers/test'
import Text from 'antd/lib/typography/Text'
import { CheckCircleOutlined, SelectOutlined } from '@ant-design/icons'
import { SelectTagsModal } from './SelectTagsModal'

export const SelectTestForPackageModal = ({visibility, closeModal, preSelectedTests, submitTestData}) => {
    const dispatch = useDispatch()
    const params = useParams()
    const [selectedTests, setSelectedTests] = useState([])
    const [currentPage, changeCureentPage] = useState(1)

    let [tagsModal, changeTagsModal] = useState()
    let [selectedTags, changeSelectedTags] = useState([])
    let [testUsageType, changeTestUsageType] = useState([])
    let [title, changeTitle] = useState([])

    const {getAllTestsStatus, testsList} = useSelector((state) => ({
        updateTagStatus:state.packages.updateTagStatus,
        getAllTestsStatus:state.test.getAllTestsStatus,
        testsList:state.test.testsList,
    }))

    useEffect(() => {
        setSelectedTests(preSelectedTests)
    }, [])

    useEffect(() => {
        dispatch(getAllTestsAction({paginate:true, page:params.page, limit:20}))
    }, [dispatch])

    const _tagsModal = () => {
        changeTagsModal(!tagsModal)
    }

    const _selectTags = (data) => {
        changeSelectedTags(data)
    }

    const changePage = (e) => {
        dispatch(getAllTestsAction({paginate:true, page:e.current, limit:20}))
        changeCureentPage(e.current)
    }

    const changeSelectedTest = (test) => {
        setSelectedTests(_.xorBy(selectedTests, [test], '_id'))
    }

    const removeTag = (id) => {
        let data = [...selectedTags]
        _.remove(data,d => d._id == id)
        changeSelectedTags(data)
    }

    const _changeTitle= (e) => {
        changeTitle(e.target.value)
    }

    const fetchTests = () => {
        let data = {paginate:true, page:testsList.page, limit:20, search_type: 'phrase', search_text:title, testUsageType: testUsageType, tags: _.map(selectedTags, s => s._id)}
        dispatch(getAllTestsAction(data))
    }

    const {Option} = Select

    return(
        <Modal visible={visibility} width={1000} onOk={() => submitTestData(_.map(selectedTests, s => ({test: s._id})))} okType='submit' onCancel={closeModal} title='Assign Tests'>
            
            <Form layout='vertical'>
                <div style={{marginBottom:'10px'}}>
                    <Text style={{fontSize:'16px', fontWeight:'bold', color:'#3498DB'}}>Filters</Text>
                </div>
                <Space size='large' wrap>
                    <Form.Item label='Title' style={{minWidth:'150px'}}>
                        <Input onChange={_changeTitle} placeholder='title'/>
                    </Form.Item>
                    <Form.Item label='Select Test Usage'>
                        <Select allowClear value={testUsageType} placeholder='Select Test Usage' style={{ width: 200 }} onChange={(e) => changeTestUsageType(e)}>
                            <Option value='testSeries'>Test Series</Option>
                            <Option value='mock'>Mock</Option>
                            <Option value='previousYear'>Previous Year</Option>
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
                        <Button onClick={fetchTests} type='primary'>Fetch Tests</Button>
                    </Form.Item>
                </Space>
            </Form> 
            <Table 
                loading={getAllTestsStatus === STATUS.FETCHING} 
                bordered 
                dataSource={getAllTestsStatus === STATUS.SUCCESS ? testsList?.docs : []} 
                pagination={{position:['bottomCenter', 'topCenter'], pageSize:20, current:testsList?.page, total:testsList?.total, showSizeChanger:false}} 
                onChange={changePage}
                onRow={(record) => {
                    return {
                    onClick: () => changeSelectedTest(record),
                    };
                }}
                rowClassName={() => {
                    return(
                        'normalTableRow'
                    )}
                }
            >
                <Table.Column title='Select Status' key='selectStatus' align='center' render={data => _.findIndex(selectedTests, s => s?._id == data._id) != -1 ? <Tag color="green">Selected <CheckCircleOutlined/></Tag> : ''}></Table.Column>
                <Table.Column title='Ref Id' dataIndex='referenceId' key='referenceId' render={id => <Text>{id}</Text>}></Table.Column>
                <Table.Column title='Name' dataIndex='name' key='name' render={d => <Text>{d?.en}</Text>}></Table.Column>
                <Table.Column title='Platform' dataIndex='testType' key='testType'></Table.Column>
                <Table.Column title='Time Duration (min)' dataIndex='totalTime' key='time'></Table.Column>
                <Table.Column title='Number of questions' key='queCont' render={d => _.size(_.flatMap(d.sections, 'questions'))}></Table.Column>
                <Table.Column title='Start Date' dataIndex='startData' key='startData'></Table.Column>
                <Table.Column title='Status' dataIndex='status' key='status'></Table.Column>
            </Table>
            {tagsModal && <SelectTagsModal visible={tagsModal} selectedData={selectedTags} closeModal={_tagsModal} submitTags={_selectTags}/>}
        </Modal>
    )
}