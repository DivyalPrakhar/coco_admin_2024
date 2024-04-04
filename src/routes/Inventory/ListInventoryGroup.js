import { EditFilled, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Table } from "antd";
import { find, map } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonPageHeader } from "../../components/CommonPageHeader";
import { STATUS } from "../../Constants";
import { getInventoryGroupAction, getInventoryItemAction } from "../../redux/reducers/inventory";
import AddInventoryGroup from "./AddInventoryGroup";

export default function InventoryGroupList() {
    const dispatch = useDispatch()
    const [toggleAddGroup, setToggleAddGroup] = useState(null)

    const { allInventoryGroups, allInventoryItem, getInventoryGroupStatus, getInventoryItemStatus } = useSelector(s => s.inventory)

    useEffect(() => {
        dispatch(getInventoryGroupAction())
        if (getInventoryItemStatus !== STATUS.SUCCESS) {
            dispatch(getInventoryItemAction())
        }
    }, [dispatch, getInventoryItemStatus])

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: '_id',
        },
        {
            title: 'Description',
            dataIndex: 'desc',
            key: '_id',
        },
        {
            title: 'Items',
            dataIndex: 'items',
            key: '_id',
            render: d => <Space> {map(d, (val, key) => <Row key={key}>{find(allInventoryItem, item => item._id === val)?.name}{d.length === key + 1 ? '' : ', '} </Row>)}</Space>
        },
        {
            title: 'Action',
            dataIndex: '',
            width: '100px',
            key: '_id',
            render: d =>
                <Row>
                    <Col onClick={() => setToggleAddGroup(d)}><EditFilled /></Col>
                </Row>
        },
    ]

    return (
        <div>
            <CommonPageHeader
                title='Inventory Group List'
                extra={
                    <Button shape='round' icon={<PlusOutlined />} onClick={() => setToggleAddGroup([])} size='large'>Add New Group</Button>
                }
            />
            <br />
            <Card >
                <Table size='small'
                    dataSource={allInventoryGroups}
                    columns={columns}
                    loading={getInventoryGroupStatus === STATUS.FETCHING}
                    pagination={false}
                // pagination={{
                //     total: allEnquirys?.total,
                //     pageSize: 10,
                //     showSizeChanger: false,
                //     current: parseInt(allEnquirys?.page),
                //     position: ['bottomCenter']
                // }}
                // onChange={handleFilter}
                />
            </Card>

            {toggleAddGroup && <AddInventoryGroup closeModal={() => setToggleAddGroup(null)} visible={toggleAddGroup} allInventoryItem={allInventoryItem} />}
        </div>

    )
}


