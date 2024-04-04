import { Modal, Form, Input, Radio } from 'antd'
import Text from 'antd/lib/typography/Text'
import {useDispatch, useSelector} from 'react-redux'
import React, { useEffect, useReducer, useState } from 'react'
import { CkeditorComponent } from '../../components/CkeditorComponent'
import { UploadImageBox } from '../../components/UploadImageBox'
import { FormReducer } from '../../utils/FormReducer'
import { addWebsiteDataAction } from '../../redux/reducers/website'
import { STATUS } from '../../Constants'
import _ from 'lodash'
import { BlogEditor } from '../../components/TinymceEditor'

export const AddOfferModal = ({visible, closeModal, currentOffer, app, web, update}) => {
    const dispatch = useDispatch()

    const {instituteId, addWebsiteDataStatus, websiteData} = useSelector(state => ({
        instituteId: state.user.user?.staff.institute._id,
        addWebsiteDataStatus:state.website.addWebsiteDataStatus,
        websiteData:state.website.websiteData,
    }))

    const [websiteOffer, changeWebsiteOffer] = useState()
    const [appOffer, changeAppOffer] = useReducer(FormReducer, {active:false})

    useEffect(() => {
        if(currentOffer && !web){
            const {title, description, link, imageUrl, active} = currentOffer
            let value = {title, description, link, imageUrl, active}
            changeAppOffer({type:'reset', value})
        }else if(currentOffer && web && update){
            changeWebsiteOffer(currentOffer.html)
            changeAppOffer({type:'active', value:currentOffer.active})
        }
    }, [currentOffer, update, web])

    const handleOfferChange = (e) => {
        changeWebsiteOffer(e)
    }

    const handleAppOffer = (value, type) => {
        changeAppOffer({type, value})
    }

    const handleAddOffer = () => {
        let order = websiteData.offers?.length && _.maxBy(websiteData.offers, 'order')?.order ? _.maxBy(websiteData.offers, 'order')?.order + 1  : 1 
        let data = []
        let offer = {...appOffer, html:websiteOffer, order:currentOffer ? currentOffer.order : order}

        if(currentOffer){
            let offers = [...websiteData.offers]
            let indx = _.findIndex(offers,o => o._id === currentOffer._id)
            offers[indx] = offer
            data = {offers:offers, instituteId}
        }
        else{
            data = {offers:[...websiteData.offers, {...appOffer, html:websiteOffer, order}], instituteId}
        }

        dispatch(addWebsiteDataAction(data))
    }

    const disabled = app && !appOffer.title
    return (
        <Modal width={'70%'} title={currentOffer ? 'Edit Offer' : 'Add Offer'} 
            onOk={handleAddOffer} okText={currentOffer ? 'Update' : 'Add'} visible={visible} onCancel={closeModal}
            okButtonProps={{disabled, loading:addWebsiteDataStatus === STATUS.FETCHING}}
        >
            {web ?
                <div style={{border:'1px solid #E5E7E9', padding:20}}>
                    <div style={{padding:10}}>
                        <Text style={{fontSize:18, fontWeight:'bold'}} type='secondary'>Website</Text>
                    </div>
                    <div style={{marginTop:10}}>
                        <Form layout='vertical'>
                            <Form.Item label='Description' required>
                                <BlogEditor
                                    onChange={handleOfferChange}
                                    value={websiteOffer || null}
                                />
                                {/* <CkeditorComponent id='ckeditorQuestionEnglish'
                                    name={'ckeditorQuestionEnglish'}
                                    language={'pramukhime:english'} 
                                    defaultData={websiteOffer || null} 
                                    onChangeData={(e) => handleOfferChange(e, 'english')}
                                /> */}
                            </Form.Item>
                        </Form>
                    </div>
                </div>
                : null
            }
            <br/>
            {app ?
                <div style={{border:'1px solid #E5E7E9', padding:20}}>
                    <Text style={{fontSize:18, fontWeight:'bold'}} type='secondary'>App</Text>
                    <div style={{marginTop:10}}>
                        <Form 
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                        >
                            <Form.Item label='Title' required>
                                <Input placeholder='Title' value={appOffer.title} onChange={(e) => handleAppOffer(e.target.value, 'title')} />
                            </Form.Item>
                            <Form.Item label='Image'>
                                <UploadImageBox disableAlert
                                    key={appOffer?.imageUrl}
                                    defaultImg={appOffer?.imageUrl}
                                    getImage={img => handleAppOffer(img.file?.response?.url, 'imageUrl')}
                                    onRemove={() => handleAppOffer('', 'imageUrl')}
                                />
                            </Form.Item>
                            <Form.Item label='Description'>
                                <Input.TextArea placeholder='Description' value={appOffer.description} rows={6} onChange={(e) => handleAppOffer(e.target.value, 'description')} />
                            </Form.Item>
                            <Form.Item label='Link'>
                                <Input value={appOffer.link} placeholder='link' placeholder='link' rows={6} onChange={(e) => handleAppOffer(e.target.value, 'link')} />
                            </Form.Item>
                        </Form>
                    </div>
                </div>
                :
                null
            }
            <br/>
            <Form.Item label='Active Status'>
                <Radio.Group value={appOffer.active} onChange={e => handleAppOffer(e.target.value, 'active')}>
                    <Radio value={true}>Active</Radio>
                    <Radio value={false}>Not Active</Radio>
                </Radio.Group>
            </Form.Item>
        </Modal>
    )
}