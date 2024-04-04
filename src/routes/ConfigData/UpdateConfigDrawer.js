import { Button, Drawer, Form, Input } from 'antd';
import React, { useEffect, useReducer } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash'
import { STATUS } from '../../Constants';
import { updateConfigAction } from '../../redux/reducers/LmsConfig';
import { FormReducer } from '../../utils/FormReducer';
import { HindiInput } from '../../components/HindiInput';

export const UpdateConfigDrawer = ({closeDrawer, visible, selectedData, type, competitionData, subjects}) => {
    const dispatch = useDispatch()
    const [configFormData, dispatchPropertyChange] = useReducer(FormReducer, {name:{en:'', hn:''}})

    const {updateConfigStatus} = useSelector((state) => ({
        updateConfigStatus:state.lmsConfig.updateConfigStatus
    }))

    useEffect(() => {
        if(updateConfigStatus == STATUS.SUCCESS){
            closeDrawer()
        }
    }, [updateConfigStatus])

    const _setName = (e, lang) => {
        let data = configFormData.name
        if(lang == 'english')
            data.en = e.target.value
        else
            data.hn = e.target.value
        
        dispatchPropertyChange({type:'name', value:data})
    }

    const _setShortName = (e) => {
        dispatchPropertyChange({type:'shortName', value:e.target.value})
    }

    const _closeDrawer = () => {
        closeDrawer()
    }

    const submitForm = () => {
        let data = {
            id: selectedData._id,
            type: _.toUpper(type),
            name: {en:configFormData.name.en || selectedData.name.en, hn:configFormData.name.hn || selectedData.name.hn},
            extra: {
                shortName:configFormData.shortName || selectedData.shortName
            }
        }
            
        if(type == 'Subject')
            data.extra.shortName = configFormData.shortName
        if(type == 'Exam') 
            data.extra.competitionId = competitionData._id

        dispatch(updateConfigAction({...data}))
    }

    return(
        <Drawer title={'Update '+ type} visible={visible} width='50%' onClose={_closeDrawer}>
            <Form.Item label="Name (English)">
                <Input placeholder="name" onChange={(e) => _setName(e, 'english')} />
            </Form.Item>
            <Form.Item label='Name (Hindi)'>
                <HindiInput onChange={e => _setName(e, 'hindi')} placeholder='name'/>
            </Form.Item>
            {type == 'Subject' ? 
                <div style={{display:'flex', width:'100%'}}>
                    <Form.Item label="Short Name">
                        <Input placeholder="short name" onChange={_setShortName} />
                    </Form.Item>
                </div>
            : null}
            <br/>
            <Button onClick={submitForm} htmlType="submit" loading={updateConfigStatus == STATUS.FETCHING}>{'Update'}</Button>
        </Drawer>
    )
}
