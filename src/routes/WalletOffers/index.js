import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Card, Space, Table, Tag, Tooltip, Form, Input } from 'antd'
import ButtonGroup from 'antd/lib/button/button-group'
import Text from 'antd/lib/typography/Text'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { STATUS } from '../../Constants'
import { deleteOfferAction, getWalletOffersAction, updateWalletOfferAction } from '../../redux/reducers/wallet'
import { AddWalletOffer } from './AddWalletOffer'
import _ from 'lodash'
import { ConfirmAlert } from '../../Constants/CommonAlerts'

export const WalletOffers = () => {
    const dispatch = useDispatch()
    const {getOffersStatus, walletOffers, addOfferStatus, updateOfferStatus, deleteOfferStatus} = useSelector(state => ({
        getOffersStatus:state.wallet.getOffersStatus,
        walletOffers:state.wallet.walletOffers,
        addOfferStatus:state.wallet.addOfferStatus,
        updateOfferStatus:state.wallet.updateOfferStatus,
        deleteOfferStatus:state.wallet.deleteOfferStatus
    }))

    const [addOfferDrawer, openAddOffer] = useState()

    useEffect(() => {
        dispatch(getWalletOffersAction())
    }, [dispatch])

    useEffect(() => {
        if(addOfferStatus === STATUS.SUCCESS || updateOfferStatus === STATUS.SUCCESS)
            openAddOffer(false)
    }, [addOfferStatus, updateOfferStatus])

    const handleAddOffer = (data) => {
        openAddOffer(data)
    }

    const handleActiveStatus = (active, id) => {
        dispatch(updateWalletOfferAction({active, _id:id}))
    }

    const handleDeleteOffer = (id) => {
        ConfirmAlert(() => dispatch(deleteOfferAction({walletOfferId:id})), 'Are you sure?', null, deleteOfferStatus === STATUS.FETCHING)
    }

    let searchInput = useRef();

    const filter = (name) => ({
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => searchInput.select(), 100);
            }
          },
    
          onFilter: (value, record) =>
            record[name]
              ? record[name]
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
                onFinish={() => {
                  confirm({ closeDropdown: false });
                }}
              >
                <Input
                  ref={(node) => {
                    searchInput = node;
                  }}
                  placeholder={`Search ${name}`}
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
          ),
    })
    return(
        <div>
            <CommonPageHeader title='Wallet Offers' 
                extra={[<Button onClick={() =>handleAddOffer(true)} icon={<PlusOutlined />} size='large'>Add Offer</Button>]}
            />
            <br/>
            <Card>
                <Table loading={getOffersStatus === STATUS.FETCHING} pagination={{showSizeChanger:false, position:['topCenter', 'bottomCenter']}} bordered 
                    dataSource={_.orderBy(walletOffers, ['createdAt'], ['desc'])}
                >
                    <Table.Column width={150} title='Title' dataIndex='title' {...filter('title')}></Table.Column>
                    <Table.Column title='Description' dataIndex='description'></Table.Column>
                    <Table.Column title='Type' dataIndex='type'
                        filters= {[{text: "percent",value: 'percent'}, {text: "flat", value: 'flat'}]}
                        onFilter={(value, record) => {
                            record = Object.assign({}, record, {isActive: record.type || false,})
                            return record.type === value;
                        }}
                    ></Table.Column>
                    <Table.Column title='Cashback (₹)' width={120}
                        render={d => d.type === 'percent' ? 
                            <>
                                {d.percent+'%'}<br/>
                                {d.maxCashback ? <Text>Max: {d.maxCashback}</Text> : null}
                            </> 
                            : 
                            d.flat
                        }
                    ></Table.Column>
                    <Table.Column title='Min. amount (₹)' width={120} dataIndex='minAmount'></Table.Column>
                    <Table.Column title='Date' width={200}
                        render={d => d.startDate ? moment(d.startDate).format('DD-MM-YYYY') +' - '+ moment(d.endDate).format('DD-MM-YYYY') : null}
                    ></Table.Column>
                    <Table.Column title='Active Status' 
                        filters= {[{text: "Active",value: true}, {text: "Not Active", value: false}]}
                        onFilter={(value, record) => {
                            record = Object.assign({}, record, {isActive: record.active || false,})
                            return record.active === value;
                        }}
                        render={d => 
                            <Tooltip title='Change status '>
                                {d.active ? 
                                    <Tag onClick={() => handleActiveStatus(false, d._id)} style={{cursor:'pointer'}} color='green'>Active</Tag> 
                                    : 
                                    <Tag onClick={() => handleActiveStatus(true, d._id)} style={{cursor:'pointer'}} color='red'>Not Active</Tag>
                                }
                            </Tooltip>
                        }
                    ></Table.Column>
                    <Table.Column title='Actions'
                        render={d => 
                            <Space>
                                <Tooltip title='Edit'>
                                    <Button size='sm' icon={<EditOutlined />} onClick={() => handleAddOffer(d)}></Button>
                                </Tooltip>
                                <Tooltip title='Delete'>
                                    <Button size='sm' onClick={() => handleDeleteOffer(d._id)} danger icon={<DeleteOutlined />}></Button>
                                </Tooltip>
                            </Space>
                        }
                    ></Table.Column>
                </Table>
            </Card>
            {addOfferDrawer ? <AddWalletOffer visible={addOfferDrawer} defaultOffer={addOfferDrawer?.title ? addOfferDrawer : null} closeModal={() => handleAddOffer(false)} /> : null }
        </div>
    )
}