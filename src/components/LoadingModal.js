import { LoadingOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import Text from 'antd/lib/typography/Text'
import React from 'react'

export const LoadingModal = ({visible, text = 'Loading...'}) => {
    return(
        <Modal footer={null} width={400} close visible={visible} closable={false}>
            <div style={{display:'flex', width:'100%', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                <LoadingOutlined style={{fontSize:60}} />
                <br/>
                <Text style={{fontSize:16}}>{text}</Text>
            </div>
        </Modal>
    )
}