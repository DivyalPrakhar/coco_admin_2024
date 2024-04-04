import { Card } from 'antd'
import Text from 'antd/lib/typography/Text'
import React from 'react'

export const TotalCountBox = ({count, title}) => {
    return(
        <Card bodyStyle={{padding:10}}>
            <Text style={{fontSize:16}}>Total {title}: <span style={{color:'#3498DB', fontWeight:'bold'}}>{count || 0}</span></Text>
        </Card>
    )
} 