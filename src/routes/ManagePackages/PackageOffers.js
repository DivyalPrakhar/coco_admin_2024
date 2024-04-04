import { PlusOutlined} from '@ant-design/icons'
import { Button, Card, Descriptions, Badge, Modal, Row, Col, Alert, Typography, Input, Form, Radio, DatePicker, Upload, Image} from 'antd'
import Text from 'antd/lib/typography/Text'
import React, { useEffect, useState, useReducer } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormReducer } from '../../utils/FormReducer'
import _ from "lodash";
import { STATUS } from '../../Constants'
import { updatePackageOfferAction, createPackageOfferAction, resetOfferStatusAction} from '../../redux/reducers/packages'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import {CarouselModal} from '../../components/CarouselModal'
import { BaseURL } from '../../BaseUrl'
import { ImagePreview } from '../../components/ImagePreview'
import { CkeditorComponent } from '../../components/CkeditorComponent'
const {RangePicker} = DatePicker

export const PackageOffers = ({currentPackage}) => {
    const [packageOfferModal, setPackageOfferModal] = useState({modal: false, data: ''})
    const [carouselModal, openCarouselModal] = useState({modal: false, data: ''})

    const {createPackageOfferStatus, updatePackageOfferStatus} = useSelector((state) => ({
        createPackageOfferStatus:state.packages.createPackageOfferStatus,
        updatePackageOfferStatus:state.packages.updatePackageOfferStatus,        
    }))

    useEffect(() => {
        if(createPackageOfferStatus === STATUS.SUCCESS || updatePackageOfferStatus === STATUS.SUCCESS){
            setPackageOfferModal({modal: false, data: ''})
            resetOfferStatusAction()
        }
    }, [createPackageOfferStatus, updatePackageOfferStatus])

    const descriptionComponent = (pack) => {
        return(
            <Descriptions bordered size="small" style={{border: pack.active ? '2px solid #8c8c8c' : ''}}>
                <Descriptions.Item span={3} labelStyle={{backgroundColor: '#ffffff', borderRight: '0px'}}>
                    <Button size='small' type="primary" style={{float: 'right'}} onClick={() => setPackageOfferModal({modal: true, data: pack})}>Edit Offer</Button>
                </Descriptions.Item>
                <Descriptions.Item label="Title">{pack?.title || '--'}</Descriptions.Item>
                <Descriptions.Item label="Descriptions" span={2} contentStyle={{maxWidth: '100px'}}><Typography dangerouslySetInnerHTML={{__html: pack?.description || '--'}}/></Descriptions.Item>
                <Descriptions.Item label="Price">{pack?.price || '--'}</Descriptions.Item>
                <Descriptions.Item label="Fake Price">{pack?.fakePrice || '--'}</Descriptions.Item>
                <Descriptions.Item label="Start Date - End Date">{moment(pack?.startDate).format('DD-MM-YYYY')+' - '+moment(pack?.endDate).format('DD-MM-YYYY')}</Descriptions.Item>
                {_.isEmpty(_.compact(pack?.carousel)) ? null :
                    <Descriptions.Item label="Images">
                        <div style={{display:'flex', alignItems:'stretch'}}>
                            {_.compact(pack.carousel).length ? _.compact(pack.carousel).map(img => 
                                <div style={{display:'flex', alignItems:'center', cursor:'pointer', margin:'4px', padding:'6px', border:'1px solid #AEB6BF'}}>
                                    <div style={{width:'100px'}}>
                                        <Image src={img}/>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        {/* <Button size='small' onClick={() => openCarouselModal({modal: true, data: _.compact(pack.carousel)})}>Click To View Images</Button> */}
                    </Descriptions.Item>
                }
            </Descriptions>
        )
    }

    return(
        <Card style={{border:0, minHeight:'500px'}} bodyStyle={{padding:0}}>
            <div>
                <Text style={{fontWeight:'bold', fontSize:'18px'}}>Package Offers List</Text>
                <Button type="primary" style={{float: 'right'}} icon={<PlusOutlined/>} onClick={() => setPackageOfferModal({modal: true, data: ''})}>Add Offer</Button>
            </div>
            <br/>
            {_.compact(currentPackage.offers).length ? 
                <Card >
                    {_.map(_.orderBy(_.compact(currentPackage.offers), ['active'], ['desc']), pack => {
                        
                        return(
                            <div key={pack._id}>
                                {pack?.active ? 
                                    <Badge.Ribbon placement='start' text='ACTIVE OFFER' style={{color: 'green', fontSize: '16px', backgroundColor: 'green'}}>
                                        {descriptionComponent(pack)}
                                    </Badge.Ribbon>
                                :
                                    descriptionComponent(pack)
                                }
                                <br/>
                            </div>
                        )
                    })}
                </Card>
            : 
                <h3 style={{textAlign: 'center', color: 'red'}}>No Offer Added.</h3>
            }
            {carouselModal.modal ? 
                <CarouselModal visible={carouselModal.modal} closeModal={() => openCarouselModal({modal: false, data: ''})} data={carouselModal.data}/>
            : null}
            {packageOfferModal.modal ? 
                <PackageOfferModal currentPackage={currentPackage} createPackageOfferStatus={createPackageOfferStatus} updatePackageOfferStatus={updatePackageOfferStatus} visible={packageOfferModal.modal} closeModal={() => setPackageOfferModal({modal: false, data: ''})} updateData={packageOfferModal.data}/>
            : null}
        </Card>
    )
}

export const PackageOfferModal = ({currentPackage, visible, closeModal, updateData, createPackageOfferStatus, updatePackageOfferStatus}) => {
    const params = useParams()
    const dispatch = useDispatch()
    const [] = Form.useForm()
    let [formKey, setFormKey] = useState(1)
    let [thumbnail, changeThumbnail] = useState()
    const defaultInput = ''

    const defaultOfferData = {title:defaultInput, description:defaultInput, fakePrice: updateData ? '' : currentPackage.fakePrice,  carousel:[], initialValue:false}
    const [offerData, dispatchPropertyChange] = useReducer(FormReducer, defaultOfferData)

    const changeOfferTitle = (e) => {
        dispatchPropertyChange({type:'title', value:e.target.value})
    }

    const changeDescription = (e) => {
        dispatchPropertyChange({type:'description', value:e.data})
    }

    const changePrice = e => {
        dispatchPropertyChange({type:'price', value:e.target.value})
    }

    const changeFakePrice = e => {
        dispatchPropertyChange({type:'fakePrice', value:e.target.value})
    }

    const changeDateRange = e => {
        let startDate = e[0].format('YYYY-MM-DD')
        let endDate = e[1].format('YYYY-MM-DD')
        dispatchPropertyChange({type:'startDate', value:startDate})
        dispatchPropertyChange({type:'endDate', value:endDate})
    }

    const changeActiveStatus = e => {
        dispatchPropertyChange({type:'active', value:e.target.value})
    }

    const changeMedia = e => {
        if(e.fileList.length > 0){
            let carousel = _.filter(e.fileList,d => d.response).length ? _.filter(e.fileList,d => d.response).map(d => d.response.url) : [] 
            let imageData = _.compact(_.concat(carousel, offerData.carousel))
            dispatchPropertyChange({type:'carousel', value:imageData})
        }else{
            dispatchPropertyChange({type:'carousel', value:[]})
        }
    }

    const removeImage = () => {
        dispatchPropertyChange({type:'carousel', value:[]})
    }

    useEffect(() => {
        if(updateData){
            setFormKey(formKey+1)
            dispatchPropertyChange({type:'merge', value:updateData})
        }else{
            dispatchPropertyChange({type:'reset', value:defaultOfferData})
            setFormKey(formKey+1)
        }
    }, [updateData])

    const addOffer = () => {
        if(updateData){
            delete offerData._id;
            dispatch(updatePackageOfferAction({offer: {offerId: updateData._id, ...offerData}, packageId: params.id}))
        }else{
            dispatch(createPackageOfferAction({offer: {...offerData}, packageId: params.id}))
        }
    }

    const _previewThumbnail = (e) => {
        let value = e?.response?.url || e?.url
        changeThumbnail(value)
    }


    return(
        <Modal title='Offer Details' visible={visible} width={1000} onCancel={() => closeModal()} footer={null}>
            <Form onFinish={addOffer} key={formKey} layout="vertical">
                <Row>
                    <Col span={24}>
                        <Form.Item label='Title' required name='title' initialValue={offerData?.title}>
                            <Input required autoFocus={true} placeholder='Title' onChange={changeOfferTitle}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item name='description' label='Description'>
                            {/*<Input.TextArea placeholder='description' onChange={changeDescription}/>*/}
                            <CkeditorComponent id='ckeditorQuestionEnglish' language={'pramukhime:english'} name={'ckeditorQuestionEnglish'} defaultData={offerData?.description || null} onChangeData={(e) => changeDescription(e)}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <Form.Item label='Discounted Price (which user will pay)' name='price' initialValue={offerData?.price} name='price' required>
                            <Input type='number' onChange={changePrice} min={0} placeholder='descount price' required prefix='₹'/>
                        </Form.Item>
                    </Col>
                    <Col span={10} offset={2}>
                        <Form.Item label='Original Price' name='fakePrice' initialValue={offerData?.fakePrice}>
                            <Input type='number' onChange={changeFakePrice} min={0} placeholder='original price' prefix='₹'/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <Form.Item name="startAndEndDate" label="Start Date - End Date" initialValue={offerData?.startDate && offerData?.endDate ? [moment(offerData?.startDate),moment(offerData?.endDate)] : [null, null]}>
                            <RangePicker onChange={changeDateRange}/>
                        </Form.Item>
                    </Col>
                    <Col span={10} offset={2}>
                        <Form.Item label='Active' initialValue={false} initialValue={offerData?.active} name='active'>
                            <Radio.Group onChange={changeActiveStatus}>
                                <Radio.Button value={true}>Yes</Radio.Button>
                                <Radio.Button value={false}>No</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col sm={10}>
                        <Form.Item label='Thumbnail'>
                            <Upload 
                                multiple={true}
                                action= {BaseURL+"app/image"}
                                onChange={changeMedia}
                                onRemove={removeImage}
                                accept={"image/png, image/jpeg, image/webp"}
                                listType="picture-card"
                                onPreview={_previewThumbnail}
                                {...(offerData.carousel?.length && {
                                defaultFileList : _.map(_.compact(offerData.carousel), (cr, ind) => ({ 
                                        uid: {ind}, name: ind+'.png', status: 'done', url: cr
                                    }))
                                })}
                            >
                                Upload
                            </Upload>
                            <br/>
                            <Alert message="Recommended Image Ratio: 16:9" showIcon style={{background: '#e6f7fe', border: '1px solid #92d4fb'}}/>
                        </Form.Item>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col span={24} style={{textAlign: 'center'}}>
                        {updateData ? 
                            <Button loading={updatePackageOfferStatus == STATUS.FETCHING} htmlType='submit' type='primary' style={{width:'100px'}} icon={<PlusOutlined/>}> Update</Button> 
                        : 
                            <Button loading={createPackageOfferStatus == STATUS.FETCHING} htmlType='submit' type='primary' style={{width:'100px'}} icon={<PlusOutlined/>}> Save</Button>
                        }
                    </Col>
                </Row>
            </Form>
            {thumbnail ? <ImagePreview visible={thumbnail} imageUrl={thumbnail} closeModal={_previewThumbnail}/> : null}
        </Modal>
    )
}