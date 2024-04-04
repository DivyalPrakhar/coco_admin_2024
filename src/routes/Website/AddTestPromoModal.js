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

export const AddTestPromoModal = ({visible, closeModal, currentPromo, app, web, update}) => {
    const dispatch = useDispatch()

    const {instituteId, addWebsiteDataStatus, websiteData} = useSelector(state => ({
        instituteId: state.user.user?.staff.institute._id,
        addWebsiteDataStatus:state.website.addWebsiteDataStatus,
        websiteData:state.website.websiteData,
    }))

    const [websitePromos, changeWebsitePromo] = useState()
    const [appPromo, changeAppPromo] = useReducer(FormReducer, {active:false})

    useEffect(() => {
        if(currentPromo && !web){
            const {title, description, link, imageUrl, active} = currentPromo
            let value = {title, description, link, imageUrl, active}
            changeAppPromo({type:'reset', value})
        }else if(currentPromo && web && update){
            changeWebsitePromo(currentPromo.html)
            changeAppPromo({type:'active', value:currentPromo.active})
        }
    }, [currentPromo, update, web])

    const handlePromoChange = (e) => {
        changeWebsitePromo(e)
    }

    const handleAppPromo = (value, type) => {
        changeAppPromo({type, value})
    }

    const handleAddPromo = () => {
        let order = websiteData.testOffers?.length && _.maxBy(websiteData.testOffers, 'order')?.order ? _.maxBy(websiteData.testOffers, 'order')?.order + 1  : 1 
        let data = []
        let testOffer = {...appPromo, html:websitePromos, order:currentPromo ? currentPromo.order : order}
        let websiteOffers = websiteData.testOffers || []

        if(currentPromo){
            let testOffers = [...websiteOffers]
            let indx = _.findIndex(testOffers,o => o._id === currentPromo._id)
            testOffers[indx] = testOffer
            data = {testOffers, instituteId}
        }
        else{
            data = {testOffers:[...websiteOffers, {...appPromo, html:websitePromos, order}], instituteId}
        }

        dispatch(addWebsiteDataAction(data))
    }

    const disabled = app && !appPromo.title
    return (
        <Modal width={'70%'} title={currentPromo ? 'Update Promo' : 'Add Promo'} onOk={handleAddPromo} okText={currentPromo ? 'Update' : 'Add'} visible={visible} onCancel={closeModal}
            okButtonProps={{disabled:disabled, loading:addWebsiteDataStatus === STATUS.FETCHING}}
        >
            {web ?
                <div style={{border:'1px solid #E5E7E9', padding:20}}>
                    <div style={{padding:10}}>
                        <Text style={{fontSize:18, fontWeight:'bold'}} type='secondary'>Website</Text>
                    </div>
                    <div style={{marginTop:10}}>
                        <Form layout="vertical" >
                            <Form.Item label='Description' required>
                                <BlogEditor
                                    onChange={handlePromoChange}
                                    value={websitePromos || null}
                                />
                                {/* <CkeditorComponent id='ckeditorQuestionEnglish'
                                    name={'ckeditorQuestionEnglish'}
                                    language={'pramukhime:english'} 
                                    defaultData={websitePromos || null} 
                                    onChangeData={(e) => handlePromoChange(e, 'english')}
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
                                <Input placeholder='Title' value={appPromo.title} onChange={(e) => handleAppPromo(e.target.value, 'title')} />
                            </Form.Item>
                            <Form.Item label='Image'>
                                <UploadImageBox disableAlert
                                    key={appPromo?.imageUrl}
                                    defaultImg={appPromo?.imageUrl}
                                    getImage={img => handleAppPromo(img.file?.response?.url, 'imageUrl')}
                                    onRemove={() => handleAppPromo('', 'imageUrl')}
                                />
                            </Form.Item>
                            <Form.Item label='Description'>
                                <Input.TextArea placeholder='Description' value={appPromo.description} rows={6} onChange={(e) => handleAppPromo(e.target.value, 'description')} />
                            </Form.Item>
                            <Form.Item label='Link'>
                                <Input value={appPromo.link} placeholder='link' rows={6} onChange={(e) => handleAppPromo(e.target.value, 'link')} />
                            </Form.Item>
                        </Form>
                    </div>
                </div>
                :
                null
            }
            <br/>
            <Form.Item label='Active Status'>
                <Radio.Group value={appPromo.active} onChange={e => handleAppPromo(e.target.value, 'active')}>
                    <Radio value={true}>Active</Radio>
                    <Radio value={false}>Not Active</Radio>
                </Radio.Group>
            </Form.Item>
        </Modal>
    )
}