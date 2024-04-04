import { DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Form, Input, Space, Table, Tooltip, Upload } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { BaseURL } from '../../BaseUrl'

export const UploadFilesModal = ({ visible, closeModal, getFiles, defaultFiles, url }) => {
    let [files, changeFiles] = useState([])
    let [loading, changeLoading] = useState()

    useEffect(() => {
        if (defaultFiles?.length)
            changeFiles(defaultFiles.map((d, i) => ({ ...d, key: ++i })))
    }, [defaultFiles])

    const _getFiles = () => {
        getFiles(files)
        closeModal()
    }

    const _changeFiles = (resp) => {
        changeLoading(resp.file.status)

        let data = {}
        if (resp.file.status === "done" && resp.file?.response) {
            data = { name: resp.file.name, url: resp.file.response?.url, type: resp.file.type }
            // if(resp.file.status === "done" && resp.fileList[0]?.response){
            //     let data = resp?.fileList?.length ? 
            //         resp.fileList.map((f) => ({
            //                 name: f.name,
            //                 url: f.response?.url,
            //                 type: f.response?.type,
            //             })
            //         ) 
            //         : [];

            data = [...files, data]
            data = data.map((d, i) => ({ ...d, key: ++i }))
            changeFiles(data)
        }
    }

    const changeName = (text, d) => {
        let data = [...files]
        let indx = _.findIndex(files, f => f.key == d.key)
        data[indx].name = text
        changeFiles(data)
    }

    const removeFile = (obj) => {
        changeFiles(data => _.filter(data, d => d.key != obj.key))
    }

    return (
        <Modal onCancel={closeModal} width={800} okText='Finish' onOk={_getFiles} visible={visible}>
            <Form.Item label='Select Files'>
                <Upload
                    showUploadList={false}
                    onChange={_changeFiles}
                    action={BaseURL + (url || "app/image")}
                    accept={
                        ".pdf, .doc, .docx, application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    }
                >
                    <Button loading={loading === 'uploading'} icon={<UploadOutlined />}>{loading === 'uploading' ? 'loading...' : 'Select'}</Button>
                </Upload>
            </Form.Item>

            {files?.length ?
                <Table dataSource={files} bordered size='small' pagination={false}>
                    <Table.Column dataIndex='name' title='Name'
                        render={(d, obj) =>
                            <Input defaultValue={d} onChange={(e) => changeName(e.target.value, obj)} />
                        }
                    ></Table.Column>
                    <Table.Column dataIndex='url' title='File'
                        render={(d, obj) =>
                            <Space>
                                <Tooltip title='View File'>
                                    <Button onClick={() => window.open(d)} icon={<EyeOutlined />}></Button>
                                </Tooltip>
                                <Tooltip title='Remove'>
                                    <Button danger onClick={() => removeFile(obj)} icon={<DeleteOutlined />}></Button>
                                </Tooltip>
                            </Space>
                        }
                    ></Table.Column>
                </Table>
                :
                null
            }
        </Modal>
    )
}