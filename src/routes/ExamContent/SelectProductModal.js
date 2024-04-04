import { FileTextOutlined, SearchOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Form, Input, Modal, Space, Table, Tag } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import { getAllProductsAction } from '../../redux/reducers/products'
import { bilingualText } from '../../utils/FileHelper'
import _ from 'lodash'

export const SelectProductModal = ({visible, closeModal, type, onSubmit, loading, defaultData}) => {
    const dispatch = useDispatch()
    let searchInput = useRef();

    const {getProductsStatus, allProducts} = useSelector(state => ({
        getProductsStatus:state.product.allProductStatus,
        allProducts:state.product.productsData?.[type]
    }))

    const [selectedData, setSelectedData] = useState([])
    const [selectedRowKeys, setRowKeys] = useState([])

    useEffect(() => {
        dispatch(getAllProductsAction({type:type}))
    }, [dispatch, type])

    useEffect(() => {
        if(allProducts?.length){
            const data = _.intersectionBy(allProducts?.map((d, i) => ({...d, key:++   i})), defaultData, '_id')
            setRowKeys(data.map(d => d.key))
            setSelectedData(data)
            // console.log('data', data, defaultData)
        }
    }, [defaultData, allProducts])

    const handleSelect = (rows) => {
        setSelectedData(rows)
        setRowKeys(rows.map(d => d.key))
    }

    const handleSubmit = () => {
        onSubmit(selectedData)
    }
    
    console.log('allProducts', allProducts)
    return(
        <Modal title='Select Product' width={'70%'} okText='Done' visible={visible} onCancel={closeModal}
            onOk={handleSubmit} okButtonProps={{loading}}
        >
            <Card style={{border:0}} bodyStyle={{padding:0}} loading={getProductsStatus === STATUS.FETCHING}>
                <Table bordered dataSource={allProducts?.map((d, i) => ({...d, key:++i}))}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            handleSelect(selectedRows)
                        },
                        type:'checkbox'
                    }}
                >
                    <Table.Column title='Cover' dataIndex={'media'}
                        render={d => 
                        
                            <Avatar src={d?.[0]?.url} size={40} />
                        }
                    />
                    <Table.Column title='Name' dataIndex={'name'}  
                        render={d => bilingualText(d)}
                        onFilterDropdownVisibleChange={ (visible) => {
                            if (visible) {
                            setTimeout(() => searchInput.select(), 100);
                            }
                        }}

                        onFilter={ (value, record) =>
                            record?.name?.en
                            ? record.name.en
                                .toString()
                                .toLowerCase()
                                .includes(value.toLowerCase())
                            : ""}

                        filterDropdown={ ({
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
                                placeholder={`Search ${"name"}`}
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
                        )}
                        filterIcon={ (filtered) => (
                            <SearchOutlined
                            style={{ fontSize: "18px", color: filtered ? "#1890ff" : undefined }}
                            />
                        )}
                    />
                    {/* <Table.Column title='Description' dataIndex={'description'}
                        render={d => d.en}
                    /> */}
                    <Table.Column title='Attachment' dataIndex={'content'} 
                        render={d => d?.length ? 
                            <Button
                                icon={<FileTextOutlined />}
                                type="link"
                                onClick={() => window.open(d[0].url)}
                                style={{ marginTop: "4px", cursor: "pointer" }}
                            >
                                File
                            </Button>
                            : null
                        }
                    />
                    <Table.Column title='Type' dataIndex={'type'} 
                        render={d => <Tag>{d}</Tag>}
                    />
                    <Table.Column title='Mode' dataIndex={'mode'}/>
                </Table>
            </Card>
        </Modal>
    )
}