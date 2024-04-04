import { PageHeader } from 'antd'
import React from 'react'

export const CommonPageHeader = ({extra, title, subTitle, routes}) => {
    return(
        <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title={title}
            subTitle={subTitle}
            extra={extra}
            breadcrumb={{ routes }}
        >
        
        </PageHeader>
    )
}