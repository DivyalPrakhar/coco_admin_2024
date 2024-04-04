import { Button, Form, Input } from 'antd'
import Text from 'antd/lib/typography/Text'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addWebsiteDataAction } from '../../redux/reducers/website'

export const AppVersion = () => {
    const dispatch = useDispatch()

    const {instituteId, websiteData} = useSelector(state => ({
        instituteId: state.user.user?.staff.institute._id,
        websiteData:state.website.websiteData,
    }))

    const handleAddVersion = (e) => {
        dispatch(addWebsiteDataAction({instituteId, version:e.version}))
    }

    return(
        <div style={{padding:20}}>
            <Text style={{fontSize: "16px", marginBottom: "20px", fontWeight: "bold", width: "100%"}}>Mobile App Version</Text>
            <br/><br/>
            <Form layout='vertical' style={{width:'30%'}} onFinish={handleAddVersion}>
                <Form.Item name='version' rules={[{required:true, message:'Please fill in the field.'}]} label='Current App Verison'>
                    <Input step='any' defaultValue={websiteData?.version} type='number' min={0} placeholder='current app version'/>
                </Form.Item>
                <Form.Item>
                    <Button htmlType='submit'>Update</Button>
                </Form.Item>
            </Form>
        </div>
    )
}