import { DeleteOutlined, EyeOutlined, SelectOutlined } from '@ant-design/icons'
import { Button, Drawer, Form, Input, Space, Table, Tooltip, Upload } from 'antd'
import Text from 'antd/lib/typography/Text'
import _, { concat } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BaseURL } from '../../BaseUrl'
import { STATUS } from '../../Constants'
import { updateCourseAction } from '../../redux/reducers/courses'

export const FilesDrawer = ({visible, closeModal, course}) => {
    const dispatch = useDispatch()

    const { courseUpdateStatus } = useSelector((state) => ({
        courseUpdateStatus: state.course.updateCourseStatus,
    }));

    const [allFiles, setFiles] = useState([])
    const [uploading, setUploading] = useState()
    const required = _.filter(allFiles,f => !f.name).length

    useEffect(() => {
        if(course?.files)
            setFiles(course.files.map((file, i) => ({..._.omit(file, ['_id']), id:++i})))
    }, [course])
    
    const handleSelectFiles = (files) => {
        console.log('files', files)
        if(files.file?.status === 'done'){
            let file = files.file.response
            const newFiles = {id:allFiles.length ? _.maxBy(allFiles,d => d.id).id + 1 : 1 , name:file.fileName, url:file.url, type:file.type}
            setFiles(d => concat(d, [newFiles]))
            setUploading()
        }else if(files.file?.status === 'uploading'){
            setUploading(true)
        }
    }

    const handleRemoveFile = (id) => {
        let files = [...allFiles]
        _.remove(files,f => f.id === id)
        setFiles(files)
    }

    const handleNameChange = (name, obj) => {
        let indx = _.findIndex(allFiles,f => f.id === obj.id)
        let files = [...allFiles]
        files[indx].name = name 
        setFiles(files)
    }

    const handleViewFile = (obj) => {
        window.open(obj.url, '_blank')
    }

    const handleSubmit = () => {
        const data = {id:course._id, files:allFiles}
        dispatch(updateCourseAction(data))
    }

    console.log('drawer', allFiles)
    return(
        <Drawer title={course.name} width='50%' visible={visible} onClose={closeModal} >
            <Form.Item label='Select File'>
                <Upload
                    showUploadList={false}
                    onChange={handleSelectFiles}
                    action={BaseURL + "app/file"}
                >
                    <Button loading={uploading} icon={<SelectOutlined />}>Select File</Button>
                </Upload>
            </Form.Item>

            <Table bordered size='small' dataSource={allFiles} pagination={false}>
                <Table.Column title='Name'
                    render={d => 
                        <Input placeholder='name' onChange={(e) => handleNameChange(e.target.value, d)} value={d.name}/>
                    }
                />
                <Table.Column title='Actions' render={d => 
                    {
                        return(
                            <Space>
                                <Tooltip title='View'>
                                    <Button onClick={() => handleViewFile(d)} icon={<EyeOutlined />} />
                                </Tooltip>
                                <Tooltip title='Remove'>
                                    <Button danger onClick={() => handleRemoveFile(d.id)} icon={<DeleteOutlined />} />
                                </Tooltip>
                            </Space>
                        )
                    }
                }/>
            </Table>
            <br/>
            {required ? <Text type='danger' style={{display:'block'}}>*file name required</Text> : null}
            <Button loading={courseUpdateStatus === STATUS.FETCHING} disabled={required} onClick={handleSubmit} type='primary'>Save</Button>
        </Drawer>
    )
}