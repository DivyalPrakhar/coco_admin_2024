import { Button, Drawer, Form, Input, Alert, Upload, Select } from 'antd';
import React, { useEffect, useReducer, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '../Constants';
import { addConfigAction, updateConfigAction } from '../redux/reducers/LmsConfig';
import { FormReducer } from '../utils/FormReducer';
import _ from 'lodash'
import { ErrorMessage } from '../Constants/CommonAlerts';
import { HindiInput } from './HindiInput';
import { BaseURL } from '../BaseUrl'
import {  PlusOutlined } from '@ant-design/icons'
import { ImagePreview } from './ImagePreview'
import { Option } from 'antd/lib/mentions';

export const AddConfigDrawer = ({closeDrawer, visible, selectedData, type, competitionData, subjects}) => {
    const dispatch = useDispatch()
    const [configFormData, dispatchPropertyChange] = useReducer(FormReducer,{name:{en:'', hn:''}}) 
    const [form] = Form.useForm();

    const [coverImage, changeCoverImage] = useState()

    const {lmsConfig, addConfigStatus, updateConfigStatus} = useSelector((state) => ({
        lmsConfig: state.lmsConfig,
        addConfigStatus:state.lmsConfig.addConfigStatus,
        updateConfigStatus:state.lmsConfig.updateConfigStatus
    }))
    const { configData } = useSelector(state => ({
        configData: state.lmsConfig,
    }))

    useEffect(() => {
        if(lmsConfig.addConfigStatus === STATUS.SUCCESS || lmsConfig.updateConfigStatus === STATUS.SUCCESS){
            form.resetFields()
            closeDrawer()
        }
    }, [lmsConfig.addConfigStatus, lmsConfig.updateConfigStatus])

    const _setName = (e, lang) => {
        let data = configFormData.name
        if(lang === 'english')
            data.en = e.target.value
        else
            data.hn = e.target.value
        
        dispatchPropertyChange({type:'name', value:data})
    }

    const _setShortName = (e) => {
        dispatchPropertyChange({type:'shortName', value:e.target.value})
    }

    const _closeDrawer = () => {
        form.resetFields()
        closeDrawer()
    }

    const _previewCover = (file) => {
        if(file?.url || file?.response?.url)
            changeCoverImage(file)
        else
            changeCoverImage(null)
    }

    const normFile = (e) => {      
        if (Array.isArray(e)) {
          return e.file.response;
        }
        return e.file.response && e.fileList;
    };

    const submitForm = (newData) => {
        const carouselValue = newData['carousel']
        if(_.findIndex(subjects,s => _.lowerCase(s.name?.en) === _.lowerCase(configFormData.name)) !== -1){
            ErrorMessage('Subject already exist')
        } else{
            if(selectedData){
                console.log(newData);
                let data = {
                    id: selectedData._id,
                    type: _.toUpper(type),
                    subjects: selectedData.subjects,
                    name: {en:configFormData.name.en || selectedData.name.en, hn:configFormData.name.hn || selectedData.name.hn},
                    extra: {
                        shortName:configFormData.shortName || selectedData.shortName
                    }
                }
                if(type === 'Exam' )
                    data.subjects = newData.subjects

                if(type === 'Exam' && carouselValue && carouselValue.length > 0)
                    data.image = carouselValue[0].response?.url
                
                if(type === 'Subject')
                    data.extra.shortName = configFormData.shortName
                
                if(type === 'Exam') 
                    data.extra.competitionId = competitionData._id
    
                dispatch(updateConfigAction({...data}))
            }
            else{
                let data = {
                    type: _.toUpper(type),
                    name: configFormData.name,
                    extra: {
                       
                    }
                }
                if(type === 'Exam' && carouselValue && carouselValue.length > 0)
                    data.image = carouselValue[0].response?.url

                if(type === 'Subject')
                    data.extra.shortName = configFormData.shortName
                
                if(type === 'Exam') 
                    data.extra.competitionId = competitionData._id
                
                dispatch(addConfigAction({...data}))
            }
        }
    }
    
    const uploadButton = (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return(
        <Drawer title={selectedData ? ('Update '+ type) : ('Add '+ type)} visible={visible} width='40%' onClose={_closeDrawer}>
            <Form
                form={form}
                layout='vertical'
                size='large'
                onFinish={submitForm}
                key={type}
            >
                <div style={{display:'flex', width:'100%'}}>
                    <Form.Item style={{flexGrow:1, paddingRight:'10px'}} label="Name (English)" required name='name'>
                        <Input placeholder="name" autoFocus defaultValue={selectedData ? selectedData.name?.en : ''} value={configFormData.name} onChange={(e) => _setName(e, 'english')} required name='name' />
                    </Form.Item>
                    <Form.Item style={{flexGrow:1}} label='Name (Hindi)' key={selectedData?.name?.hn}>
                        <HindiInput defaultValue={selectedData ? selectedData.name?.hn : ''} onChange={e => _setName(e, 'hindi')} placeholder='name'/>
                    </Form.Item>
                </div>
                {type === 'Subject' ? 
                    <div style={{display:'flex', width:'100%'}}>
                        <Form.Item style={{flexGrow:1, paddingRight:'10px'}} label="Short Name" required name='shortName'>
                            <Input placeholder="short name" autoFocus defaultValue={selectedData ? selectedData.shortName : ''} value={configFormData.shortName} onChange={_setShortName} required name='shortName' />
                        </Form.Item>
                    </div>
                : null}
                {type === 'Exam' ? 
                    configData?.defaultData?.subjects ?
                        <Form.Item name='subjects' label='Subjects'>
                            <Select mode="tags"  placeholder="Choose Subjects" defaultValue={selectedData?.subjects}>
                                {
                                    configData?.defaultData?.subjects.map((sub,i)=>{
                                        return(<Option value={sub._id} key={i}>{sub.name.en}</Option>)
                                    })
                                }
                            </Select>
                        </Form.Item>
                    :<div>loading</div>
                    :
                    null
                }
                {type === 'Exam' ? 
                    <Form.Item label="Cover Image">
                        <Form.Item name="carousel" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                            <Upload
                                name="file"
                                action= {BaseURL+"app/image"}
                                listType="picture-card"
                                onPreview={_previewCover}
                                
                                {...(selectedData?.image && {
                                    defaultFileList : _.map(_.compact([selectedData.image]), (cr, ind) => ({ 
                                        uid: {ind}, name: ind+'.png', status: 'done', url: cr
                                    }))
                                })}
                                accept="image/png, image/jpeg, image/webp"

                            >
                                {uploadButton}
                            </Upload>
                        </Form.Item>
                        <Alert message="Recommended Image Ratio: 16:9" showIcon style={{background: '#e6f7fe', border: '1px solid #92d4fb', width: '50%'}}/>
                    </Form.Item>
                : null}
                <Form.Item >
                    <Button htmlType="submit" loading={addConfigStatus === STATUS.FETCHING || updateConfigStatus === STATUS.FETCHING}>{selectedData ? 'Update' : 'Add'}</Button>
                </Form.Item>
            </Form>
            {coverImage ? <ImagePreview visible={coverImage} imageUrl={coverImage?.url || coverImage?.response?.url} closeModal={_previewCover}/> : null}
        </Drawer>
    )
}
