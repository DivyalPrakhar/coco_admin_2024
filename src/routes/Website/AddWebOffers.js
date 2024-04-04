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

export const AddWebOffers = ({visible, closeModal, currentOffer}) => {
    const dispatch = useDispatch()

    const {instituteId, addWebsiteDataStatus, websiteData} = useSelector(state => ({
        instituteId: state.user.user?.staff.institute._id,
        addWebsiteDataStatus:state.website.addWebsiteDataStatus,
        websiteData:state.website.websiteData,
    }))

    const [websiteOffer, changeWebsiteOffer] = useState()
    const [appOffer, changeAppOffer] = useReducer(FormReducer, {active:false})

    useEffect(() => {
        if(currentOffer){
            const {html, title, description, link, imageUrl, active} = currentOffer
            let value = {title, description, link, imageUrl, active}
            changeAppOffer({type:'reset', value})
            changeWebsiteOffer(html)
        }
    }, [currentOffer])

    const handleOfferChange = (e) => {
        changeWebsiteOffer(e.data)
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
            // console.log('dddd', data, indx, offer, offers, currentOffer)
        }
        else{
            data = {offers:[...websiteData.offers, {...appOffer, html:websiteOffer, order}], instituteId}
        }

        dispatch(addWebsiteDataAction(data))
    }

    console.log({websiteData, appOffer})
    return (
        <Modal width={'70%'} title='Add Offer' onOk={handleAddOffer} okText={currentOffer ? 'Update' : 'Add'} visible={visible} onCancel={closeModal}
            okButtonProps={{disabled:!appOffer.title || !websiteOffer, loading:addWebsiteDataStatus === STATUS.FETCHING}}
        >
            <div style={{border:'1px solid #E5E7E9', padding:20}}>
                <div style={{padding:10}}>
                    <Text style={{fontSize:18, fontWeight:'bold'}} type='secondary'>Website</Text>
                </div>
                <div style={{marginTop:10}}>
                    <Form
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                    >
                        <Form.Item label='Description' required>
                            <CkeditorComponent id='ckeditorQuestionEnglish'
                                name={'ckeditorQuestionEnglish'}
                                language={'pramukhime:english'} 
                                defaultData={websiteOffer || null} 
                                onChangeData={(e) => handleOfferChange(e, 'english')}
                            />
                        </Form.Item>
                    </Form>
                </div>
            </div>
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