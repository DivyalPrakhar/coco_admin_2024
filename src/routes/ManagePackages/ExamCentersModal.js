import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { Modal, Form, Input, Space, Button, Tooltip, Table } from 'antd'
import { chain, filter } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCenterAction } from '../../redux/reducers/center'

export const ExamCentersModal = ({ visible, closeModal, onSubmit, defaultCenters }) => {
    const dispatch = useDispatch()
    const [input, setInput] = useState()
    const [selectedRowKeys, setSelectedRowKeys] = useState([])

    const { allCenterList } = useSelector(s => ({ allCenterList: s.center.allCenterList }))

    useEffect(() => {
        dispatch(getAllCenterAction())
    }, [dispatch])

    useEffect(() => {
        if (defaultCenters?.length) {
            setSelectedRowKeys(defaultCenters.map(d => ({ ...d, key: d.code })))
        }
    }, [defaultCenters])

    const filteredData = useMemo(() => {
        return chain(allCenterList).filter(f =>
            (!input?.name || (f.name?.toLowerCase().includes(input?.name?.toLowerCase())))
            && (!input?.code || (f.code?.toLowerCase().includes(parseInt(input?.code))))
        ).orderBy('name', 'asc').value()
    }, [allCenterList, input])

    const inputHandler = (val) => {
        setInput(d => ({ ...d, ...val }))
    }

    const columns = [
        { title: <b>Name</b>, width: 80, fixed: 'left', dataIndex: 'name', key: 1 },
        { title: <b>Code</b>, width: 80, fixed: 'left', dataIndex: 'code', key: 2 },
        { title: <b>Address</b>, width: 100, dataIndex: 'address', key: 3 },
    ]

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys: selectedRowKeys?.length ? selectedRowKeys.map(d => d.key) : [],
        onChange: (key, obj) => onSelectChange(obj),
    };

    const handleSubmit = () => {
        const data = selectedRowKeys?.length ? selectedRowKeys.map(d => ({ address: d.address, name: d.name, code: d.code })) : []
        onSubmit(data)
        closeModal()
    }

    return (
        <Modal title='Select Exam Centers' visible={visible} okText='Done' width={'80%'} onCancel={closeModal}
            onOk={handleSubmit}
        >
            <Space align="center">
                <Form.Item label="Name">
                    <Input type="text" placeholder='search by name' name="name" onChange={(e) => inputHandler({ name: e.target.value })} />
                </Form.Item>
                <Form.Item label="Code">
                    <Input type="code" placeholder='search by code' name="code" maxLength={6} onChange={(e) => inputHandler({ code: e.target.value })} />
                </Form.Item>
            </Space>
            <Table size="small" rowSelection={rowSelection} columns={columns} dataSource={filteredData?.map(d => ({ ...d, key: d.code })) || []} />
        </Modal>
    )
}