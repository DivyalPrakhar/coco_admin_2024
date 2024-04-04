import { Button, Drawer, Form, Input, DatePicker, Upload, Space, Tooltip, Card, Row, Col, Table, Empty, Tag } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import moment from 'moment'
import _, { join } from 'lodash'
import {
    addPromoCodeAction,
    updatePromoCodeAction,
    deletePromoCodeAction,
    getPromoCodeAction
} from '../../redux/reducers/promoCodeReducer'
import { PlusOutlined, EditOutlined, DeleteOutlined, SyncOutlined, SearchOutlined } from '@ant-design/icons'
import { useState, useEffect, useRef } from 'react'
import { PromoCodeDrawer } from './PromoCodeDrawer'
import { CommonPageHeader } from "../../components/CommonPageHeader";
import { ConfirmAlert } from '../../Constants/CommonAlerts'
import { bilingualText, expiryCheck } from '../../utils/FileHelper'
import Text from 'antd/lib/typography/Text'
import { TotalCountBox } from '../../components/TotalCountBox'

export const PromoCode = () => {
    const dispatch = useDispatch()

    const { user, promoCode } = useSelector((state) => ({
        user: state.user.user,
        promoCode: state.promoCodeReducer
    }))

    const [addPromoCodeDrawer, setAddPromoCodeDrawer] = useState(false)
    const [sortInfo, changeSortInfo] = useState();
    const [currentPromoCode, setCurrentPromoCode] = useState(null)
    const [updateStatusState, setUpdateStatus] = useState({ id: '', type: '' })

    useEffect(() => {
        dispatch(getPromoCodeAction())
    }, [])

    const updatePromoCode = (d) => {
        setAddPromoCodeDrawer(true)
        setCurrentPromoCode(d)
    }

    const closeDrawer = () => {
        setAddPromoCodeDrawer(false)
        setCurrentPromoCode(null)
    }

    const updatePromoCodeStatusChange = (data, type, id) => {
        setUpdateStatus({ id: id, type: type })
        dispatch(updatePromoCodeAction({ [type]: data, promoId: id }))
    }

    const deletePromoCode = (id) => {
        const ds = () => dispatch(deletePromoCodeAction({ id: id }))
        ConfirmAlert(ds)
    }
    const search = (title) => ({
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.select(), 100);
            }
        },

        onFilter: (value, record) =>
            record[title]
                ? record[title]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
                : "",

        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Form
                    onFinish={() => { confirm({ closeDropdown: false }); }}
                >
                    <Input
                        ref={(node) => { searchInput = node; }}
                        placeholder={`Search ${title}`}
                        value={selectedKeys[0]}
                        onChange={(e) =>
                            setSelectedKeys(e.target.value ? [e.target.value] : [])
                        }
                        style={{ marginBottom: 8, display: "block" }}
                    />
                    <Space>
                        <Button
                            htmlType="submit"
                            type="primary"
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Search
                        </Button>
                        <Button
                            onClick={() => {
                                clearFilters();
                            }}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Reset
                        </Button>
                    </Space>
                </Form>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{ fontSize: "18px", color: filtered ? "#1890ff" : undefined }}
            />
        )
    })

    let searchInput = useRef();
    const [searchedName, changeSearchedName] = useState();

    const columns = [
        {
            title: 'Title',
            key: 'title',
            dataIndex: 'title',
            ...search('title')
        },
        {
            title: 'Type',
            key: 'type',
            render: d => _.toUpper(d?.type),
            filters: [
                {
                    text: 'Flat',
                    value: 'flat',
                },
                {
                    text: 'Percent',
                    value: 'percent',
                },
            ],
            onFilter: (value, record) => record.type.indexOf(value) === 0
        },
        {
            title: 'Discount',
            key: 'discount',
            render: d => (
                <div>
                    {d.type == 'percent' ?
                        <div>
                            Percent: {d?.percent} <br />
                            Max Discount: {d?.maxDiscount}
                        </div>
                        :
                        <div>Flat: {d?.flat}</div>
                    }
                </div>
            ),
        },
        {
            title: 'Code',
            key: 'code',
            dataIndex: 'code',
            ...search('code')
        },
        {
            title: 'Packages',
            key: 'packages',
            dataIndex: 'packages',
            width: 300,
            render: packages => (
                <div>
                    {packages?.length ?
                        <Space wrap>
                            {packages.map(pkg =>
                                <div style={{padding:3, fontSize:12, border:'1px solid #EAEDED'}} ><Text>{bilingualText(pkg.name)}</Text></div>
                            )}
                        </Space>
                        :
                        ''
                    }
                </div>
            )
        },
        {
            title: 'Date',
            key: 'date',
            render: d => (
                <div>
                    {/* {expiryCheck(d?.startDate, d?.endDate)} */}
                    {moment(d?.startDate).format('DD-MM-YYYY') + ' to ' + moment(d?.endDate).format('DD-MM-YYYY')}
                </div>
            )
        },
        {
            title: 'Status',
            'key': 'status',
            render: (d, obj) => (
                <div>
                    <Tooltip placement="top" title='Click To Change Status'>
                        <Tag style={{ cursor: 'pointer' }} icon={promoCode.updatePromoCodeStatus === STATUS.FETCHING && updateStatusState.id === d._id ? <SyncOutlined spin /> : ''} onClick={() => ConfirmAlert(() => updatePromoCodeStatusChange(!d.active, 'active', d._id), 'Are You Sure You Want To Change Active Status?')} color={d.active ? 'green' : 'red'}>{d.active ? 'Active' : 'Not Active'}</Tag><br />
                        <Text type='secondary'>{expiryCheck(obj?.startDate, obj?.endDate)}</Text>
                    </Tooltip>
                </div>
            ),
            filters: [
                {
                    text: "Active",
                    value: true,
                },
                {
                    text: "InActive",
                    value: false,
                },
            ],
            onFilter: (value, record) => {
                record = Object.assign({}, record, {
                    active: record.active || false,
                });
                return record.active === value;
            },
        },
        {
            title: 'Action',
            key: 'action',
            width: 130,
            render: d => (
                <div>
                    <Space>
                        <Tooltip placement="top" title='Edit Promo Code Details'>
                            <Button type='default' shape='circle' icon={<EditOutlined />} onClick={() => updatePromoCode(d)} />
                        </Tooltip>
                        <Tooltip placement="top" title='Delete Promo Code Details'>
                            <Button type='default' shape='circle' danger icon={<DeleteOutlined />} onClick={() => deletePromoCode(d._id)} />
                        </Tooltip>
                    </Space>
                </div>
            )
        }
    ];

    const [totalCount, changeTotalCount] = useState(0)

    const handleChange = (pagination, filters, sorter, extra) => {
        changeTotalCount(extra.currentDataSource?.length)
        changeSortInfo({
            filteredInfo: filters,
        });
    };

    useEffect(() => {
        if (promoCode.promoCodeStatus === STATUS.SUCCESS)
            changeTotalCount(promoCode?.promoCodeData?.length)
    }, [promoCode])


    return (
        <div>
            <div>
                <CommonPageHeader
                    title='Promo Code'
                    extra={
                        <Button shape='round' icon={<PlusOutlined />} onClick={() => setAddPromoCodeDrawer(true)} size='large'>
                            Add Promo Code
                        </Button>
                    }
                />
                <br />
                <Card loading={promoCode.promoCodeStatus === STATUS.FETCHING}>
                    {promoCode.promoCodeStatus === STATUS.SUCCESS && promoCode.promoCodeData?.length ?
                        <Row>
                            <Col span={24}>
                                <TotalCountBox count={totalCount} title='Promo Codes' />
                                <br />
                                <Table onChange={handleChange} align='center' bordered dataSource={_.orderBy(promoCode?.promoCodeData, ['createdAt'], ['desc'])} columns={columns} />
                            </Col>
                        </Row>
                        :
                        <Empty description='No Promo Code added' />
                    }
                </Card>
            </div>
            {addPromoCodeDrawer ?
                <PromoCodeDrawer
                    currentPromoCode={currentPromoCode}
                    visible={addPromoCodeDrawer}
                    closeDrawer={closeDrawer}
                />
                : null}
        </div>
    )
}

