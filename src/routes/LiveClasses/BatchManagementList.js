import { ExclamationCircleOutlined, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, Modal, Row, Space, Table, Tooltip } from "antd";

import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { find, intersectionWith, map, orderBy } from "lodash";
import moment from "moment";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { BaseURL } from "../../BaseUrl";
import { STATUS } from "../../Constants";
import { URIS } from "../../services/api";
import { deleteLiveClassBatchAction, getAllLiveClassBatchAction } from "../../redux/reducers/LiveClasses";
import { getAllCenterAction } from "../../redux/reducers/center";
import { getInventoryGroupAction } from "../../redux/reducers/inventory";

const days = ["M", "Tu", "W", "Th", "F", "Sa", "S"]
export default function BatchManagementList() {
    const history = useHistory()
    const dispatch = useDispatch()

    const { allCenterList, getAllCenterStatus } = useSelector(s => s.center)
    const { allInventoryGroups, getInventoryGroupStatus } = useSelector(s => s.inventory)

    useEffect(() => {
        dispatch(getAllLiveClassBatchAction())
        if (getAllCenterStatus !== STATUS.SUCCESS) {
            dispatch(getAllCenterAction())
        }
        if (getInventoryGroupStatus !== STATUS.SUCCESS) {
            dispatch(getInventoryGroupAction())
        }
    }, [dispatch, getAllCenterStatus, getInventoryGroupStatus])

    const { allLiveClassBatch, getAllLiveClassBatchStatus } = useSelector(s => s.liveClasses)
    const { confirm } = Modal;

    const deleteConfirmation = (id) => {
        confirm({
            title: 'Do you Want to delete Batch?',
            icon: <ExclamationCircleOutlined />,

            onOk() {
                dispatch(deleteLiveClassBatchAction({ id }))
            },
            onCancel() { },
        });
    }

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{ width: 90 }} >
                        Search
                    </Button>
                    <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            // searchedColumn === dataIndex ? (
            //     <Highlighter
            //         highlightStyle={{
            //             backgroundColor: '#ffc069',
            //             padding: 0,
            //         }}
            //         searchWords={[searchText]}
            //         autoEscape
            //         textToHighlight={text ? text.toString() : ''}
            //     />
            // ) : (
            text
        // ),
    })

    const sortBatch = (a, b) => {
        if (a.name > b.name) {
            return -1;
        }
        if (a.name < b.name) {
            return 1;
        }
        return 0
    }

    const columns = [
        {
            title: 'Batch Name',
            dataIndex: 'name',
            sorter: (a, b) => sortBatch(a, b),
            ...getColumnSearchProps('name')
        },
        {
            title: 'Center Name',
            dataIndex: 'center',
            render: (d) => <Col>{d ? find(allCenterList, center => center._id === d)?.name : '-'}</Col>
        },
        {
            title: 'Inventory Group',
            dataIndex: 'inventoryGroup',
            render: (d) => <Col>{d ? find(allInventoryGroups, group => group._id === d)?.name : '-'}</Col>
        },
        {
            title: 'Start Date',
            dataIndex: 'startDateTime',
            width: '170px',
            sorter: (a, b) => new Date(b.startDateTime) - new Date(a.startDateTime),
            render: (d) => <Col>{d ? moment(d).format("DD-MM-YYYY hh:mm A") : "-"}</Col>
        },
        {
            title: 'Offline Validity',
            dataIndex: 'offlineValidity',
            width: '100px',
            // sorter: (a, b) => new Date(b.startDateTime) - new Date(a.startDateTime),
            render: (d) => <Col>{d ? moment(d).format("MMM-YYYY") : "-"}</Col>
        },
        {
            title: 'Days',
            dataIndex: 'days',
            render: (d) => <Row>{d?.length ? map(intersectionWith(days, d), day => <Col style={{ marginRight: "6px" }}>{day}</Col>) : "-"}</Row>
        },
        {
            title: 'No of lecture',
            dataIndex: 'noOfLectures',
        },
        {
            title: 'Completed Lecture',
            dataIndex: 'chaptersCompletedCount',
            render: (d) => <Col>{d || 0}</Col>
        },
        {
            title: 'Dur, (in min)',
            dataIndex: 'duration',
            render: (d) => <Col>{d || "-"}</Col>
        },
        {
            title: 'Hrs',
            dataIndex: 'completedHrs',
            render: (d) => <Col>{parseFloat(parseFloat(d).toFixed(2)) || 0}</Col>
        },
        {
            title: 'Action',
            dataIndex: '',
            width: "110px",
            render: (d) =>
                <Row justify="space-around" align="middle" >
                    <Tooltip placement="top" title="Edit Subject">
                        <Col onClick={() => history.push("/batch-management?id=" + d._id + "&type=subject")}><PlusCircleOutlined style={{ paddingTop: "10px" }} /></Col>
                    </Tooltip>
                    <Tooltip placement="top" title="Edit Batch">
                        <Col onClick={() => history.push("/batch-management?id=" + d._id + "&type=batch")}><EditIcon /></Col>
                    </Tooltip>
                    <Tooltip placement="top" title="Delete Batch">
                        <Col><DeleteIcon onClick={() => deleteConfirmation(d._id)} /></Col>
                    </Tooltip>
                </Row>
        },
    ]
    return (
        getAllLiveClassBatchStatus === STATUS.FETCHING ?
            "loading..."
            :
            <Card>
                <Row justify="space-between">
                    <Col style={{ fontSize: "16px", fontWeight: "semibold" }}>Batch Management List</Col>
                    <Col>
                        <Button onClick={() => window.open(BaseURL + '/' + URIS.LIVE_CLASS_BATCH + "/?excel=true")}>Download CSV</Button>
                    </Col>
                </Row>
                <Table style={{ marginTop: 10 }} loading={getAllLiveClassBatchStatus === STATUS.FETCHING} bordered dataSource={orderBy(allLiveClassBatch, 'createdAt', 'desc') || []}
                    columns={columns} pagination={false}
                // onChange={handleCurrentPage}>
                />
            </Card>
    )
}