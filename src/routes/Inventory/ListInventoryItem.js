import { EditFilled, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonPageHeader } from "../../components/CommonPageHeader";
import { STATUS } from "../../Constants";
import { getInventoryItemAction } from "../../redux/reducers/inventory";
import AddInventoryItem from "./AddInventoryItem";

export default function InventoryItemList() {
    const dispatch = useDispatch()
    const [toggleAddItem, setToggleAddItem] = useState(null)

    useEffect(() => {
        dispatch(getInventoryItemAction())
    }, [dispatch])

    const { allInventoryItem, getInventoryItemStatus } = useSelector(s => s.inventory)

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
            title: 'Action',
            dataIndex: '',
            width: '100px',
            key: '_id',
            render: d =>
                <Row>
                    <Col onClick={() => setToggleAddItem(d)}><EditFilled /></Col>
                </Row>
        },
    ]
    return (
        <div>
            <CommonPageHeader
                title='Inventory Item List'
                extra={
                    <Button shape='round' icon={<PlusOutlined />} onClick={() => setToggleAddItem([])} size='large'>Add New Item</Button>
                }
            />
            <br />
            <Card >
                <Table size='small'
                    dataSource={allInventoryItem}
                    columns={columns}
                    loading={getInventoryItemStatus === STATUS.FETCHING}
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

            {toggleAddItem && <AddInventoryItem closeModal={() => setToggleAddItem(null)} visible={toggleAddItem} />}
        </div>

    )
}


