import { DeleteOutlined, EditOutlined, OrderedListOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Input, Table, Form, Radio, Space, Alert, Tag, Image, Popconfirm } from 'antd'
import Text from 'antd/lib/typography/Text'
import _ from 'lodash'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Truncate } from '../../components/Truncate'
import { UploadImageBox } from '../../components/UploadImageBox'
import { STATUS } from '../../Constants'
import { addWebsiteDataAction } from '../../redux/reducers/website'
import { AddOfferModal } from './AddOfferModal'
import { OrderOffersModal } from './OrderOffersModal'

export const Offers = () => {
    const dispatch = useDispatch()

    const {instituteId, websiteData, addWebsiteDataStatus} = useSelector(state => ({
        instituteId: state.user.user?.staff.institute._id,
        websiteData:state.website.websiteData,
        addWebsiteDataStatus:state.website.addWebsiteDataStatus
    }))

    let initialData = useMemo(() => ([{title:'', description:'', link:'', imageUrl:'', active:true, order:1}]), []) 
    const [offers, changeOffers] = useState(initialData)
    const [orderModal, openOrderModal] = useState()
    const [addOfferModal, openAddOfferModal] = useState()
    const [updateOfferModal, openUpdateOfferModal] = useState()
    const [showHtml, setShowHtml] = useState()
    const [appOfferModalStatus, addAppOffer] = useState()
    const [webOfferModalStatus, addWebOffer] = useState()

    const deleteId = useRef(null)

    useEffect(() => {
        if(addWebsiteDataStatus === STATUS.SUCCESS){
            addAppOffer(false)
            addWebOffer(false)
            openUpdateOfferModal(false)
            deleteId.current = null
        }
    }, [addWebsiteDataStatus])

    useEffect(() => {
        let data = websiteData.offers?.length ? 
            websiteData.offers.map(off => _.omit(off, ['_id'])) 
            : initialData
        
        changeOffers(data)
    }, [initialData, websiteData])

    useEffect(() => {
        if(addWebsiteDataStatus === STATUS.SUCCESS)
            openOrderModal(false)

    }, [addWebsiteDataStatus])

    const handleAppOffer = () => {
        // changeOffers(d => [...d, {title:'', description:'', link:'', imageUrl:'', active:true, 
        //     order:_.maxBy(offers, 'order') ? _.maxBy(offers, 'order').order + 1 : 1
        // }])
        addAppOffer(!appOfferModalStatus)
    }

    const handleWebOffer = (offer, type) => {
        addWebOffer(webOfferModalStatus ? null : {offer, type})
    }

    const handleChangeValue = (value, type, indx) => {
        let data = [...offers]
        data[indx][type] = value
        changeOffers(data)
    }

    const handleRemoveOffer =(id) => {
        // let data = [...offers]
        // _.remove(data,(d, i) => i === indx)
        // changeOffers(data)
        let data = _.filter(websiteData.offers,o => o._id !== id)
        dispatch(addWebsiteDataAction({offers:data, instituteId}))
        deleteId.current = id
    }

    const saveOffers = () => {
        let data = _.filter(offers,off => off.title)
        data = data.map((d, i) => ({...d, order:++i}))
        if(data.length)
            dispatch(addWebsiteDataAction({instituteId, offers:data}))
    }

    const handleOrderModal = () => {
        openOrderModal(!orderModal)
    }

    const handleChangeOrder = (data) => {
        dispatch(addWebsiteDataAction({instituteId, offers:data}))
    }

    const handleUpdateOffer = (data) => {
        openUpdateOfferModal(data)
    }

    const handleshowHtml =() => {
        setShowHtml(!showHtml)
    }

    let websiteOffers = websiteData.offers?.length && _.findIndex(websiteData.offers,o => o.html) !== -1 ? 
        _.find(websiteData.offers,o => o.html) : null
    
    let appOffers = websiteData.offers?.length ? _.filter(websiteData.offers,o => !o.html) : []
    console.log({websiteOffers})
    return(
        <div style={{padding:'20px'}}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <Text
                    style={{
                      fontSize: "16px",
                      marginBottom: "20px",
                      fontWeight: "bold",
                      width: "100%",
                    }}
                >
                    Offers
                </Text>
                {/* <Space>
                    <Button onClick={handleOrderModal} icon={<OrderedListOutlined />}> Change Order </Button>
                    <Button type='primary' icon={<PlusOutlined/>} onClick={handleAppOffer}>Add Offer</Button>
                </Space> */}
            </div>
            <br/>
            <div style={{padding:10, border:'1px solid #E5E7E9', overflow:'auto'}}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <Text style={{fontSize:20, fontWeight:'bold'}} type='secondary'>Website Offers</Text>
                    {websiteOffers ? 
                        <Button type='primary' icon={<EditOutlined/>} onClick={() => handleWebOffer(websiteOffers, 'update')}>Edit Offer</Button>    
                        :
                        <Button type='primary' icon={<PlusOutlined/>} onClick={() => handleWebOffer(true, 'add')}>Add Offer</Button>
                    }
                </div>
                <br/>
                {websiteOffers ? 
                    <div>
                        <div style={{margin:'10px 0'}}>
                            <Text><b>Active Status:</b> {websiteOffers.active ? <Tag color='green'>Active</Tag> : <Tag color='red'>Not Active</Tag>} </Text>
                        </div>
                        <br/>
                        <div dangerouslySetInnerHTML={{__html:websiteOffers ? websiteOffers.html.replaceAll('text-align:center', 'text-align:-webkit-center') : ''}}/>
                    </div>
                    :
                    <Text>No added</Text>
                }
            </div>
            <br/><br/>
            <div style={{padding:10, border:'1px solid #E5E7E9', overflow:'auto'}}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <Text style={{fontSize:20, fontWeight:'bold'}} type='secondary'>App Offers</Text>
                    <Space>
                        <Button onClick={handleOrderModal} icon={<OrderedListOutlined />}> Change Order </Button>
                        <Button type='primary' icon={<PlusOutlined/>} onClick={handleAppOffer}>Add Offer</Button>
                    </Space>
                </div>
                <br/><br/>
                <Alert message={"Recommended Image Ratio: 4:3"} showIcon style={{background: '#e6f7fe', border: '1px solid #92d4fb', marginBottom:10}}/>
                <Table dataSource={_.sortBy(_.compact(appOffers), ['order'])} bordered pagination={false}>
                    <Table.Column title='Title' width={150} dataIndex='title' render={(d, obj, indx) =>
                        <> 
                            {/* <Text style={{fontSize:16}} type='danger'>*</Text>
                            <Input placeholder='Title' value={d} onChange={(e) => handleChangeValue(e.target.value, 'title', indx)} /> */}
                            {d}
                        </>
                    }></Table.Column>
                    <Table.Column title='Description' dataIndex='description' render={(d, obj, indx) => 
                        // <Input.TextArea placeholder='Description' value={d} onChange={(e) => handleChangeValue(e.target.value, 'description', indx)} rows={4} />
                        <Truncate>{d}</Truncate>
                    }></Table.Column>
                    <Table.Column title='Link' dataIndex='link' render={(d, obj, indx) => 
                        // <Input placeholder='Link' value={d} onChange={(e) => handleChangeValue(e.target.value, 'link', indx)}/>
                        <div style={{width:150, overflow:'hidden'}}>
                            <a href={d} target='_blank' rel='noreferrer'>{d}</a>
                        </div>
                    }></Table.Column>
                    <Table.Column title='Active Status' width={100} dataIndex='active' render={(d, obj, indx) => 
                        // <Form.Item title='Active'>
                        //     <Radio.Group value={d} onChange={e => handleChangeValue(e.target.value, 'active', indx)}>
                        //         <Radio value={true}>Active</Radio>
                        //         <Radio value={false}>Not-active</Radio>
                        //     </Radio.Group>
                        // </Form.Item>
                        <div>
                            {d ? <Tag color='green'>Active</Tag> : <Tag color='red'>Not Active</Tag>}
                        </div>
                    }></Table.Column>
                    <Table.Column title='Image' dataIndex='imageUrl' render={(d, obj, indx) => 
                        // <UploadImageBox key={dimageUrl} disableAlert
                        //     defaultImg={d}
                        //     getImage={img => handleChangeValue(img.file?.response?.url, 'imageUrl', indx)}
                        //     onRemove={() => handleChangeValue('', 'imageUrl', indx)}
                        // />
                        d ? <Image src={d} style={{width:200, height:100, objectFit:'cover', cursor:'pointer'}} /> : null
                    }></Table.Column>
                    {/* <Table.Column title='Website View' dataIndex='html' render={(d, obj, indx) => 
                        d ? <Button size='small' onClick={handleshowHtml}>Show</Button> : null
                    }></Table.Column> */}
                    <Table.Column title='Delete' render={(d, obj, indx) =>
                        <>
                            <Button style={{marginRight:5, margin:5}} size='small' onClick={() => handleUpdateOffer(d)} icon={<EditOutlined/>}>Edit</Button>
                            <Popconfirm placement="topLeft" title={'Are you sure to delete this offer?'} 
                                onConfirm={() => handleRemoveOffer(d._id)} okText="Yes" cancelText="No"
                            >
                                <Button danger size='small' style={{margin:5}}
                                    loading={d._id === deleteId?.current && addWebsiteDataStatus === STATUS.FETCHING} 
                                    icon={<DeleteOutlined/>}
                                >
                                    Delete
                                </Button>
                            </Popconfirm>
                        </>
                    }></Table.Column>
                </Table>
            </div>
            {/* <br/>
            <Button onClick={saveOffers} style={{width:'100%'}} type='primary'>Save</Button> */}

            {updateOfferModal ? <AddOfferModal app visible={updateOfferModal} currentOffer={updateOfferModal} closeModal={() => handleUpdateOffer(false)} /> : null}
            {appOfferModalStatus ? <AddOfferModal app visible={appOfferModalStatus} closeModal={handleAppOffer} /> : null}
            {webOfferModalStatus ? 
                <AddOfferModal web update={webOfferModalStatus.type === 'update'} 
                    visible={webOfferModalStatus} 
                    currentOffer={webOfferModalStatus.offer?._id ? webOfferModalStatus.offer : null } 
                    closeModal={handleWebOffer} 
                /> : 
                null
            }
            
            {orderModal ? <OrderOffersModal visible={orderModal} submit={handleChangeOrder} closeModal={handleOrderModal} /> : null}
        </div>
    )
}