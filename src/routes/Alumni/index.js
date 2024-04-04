import { Card, Table } from 'antd'
import React from 'react'
import { CommonPageHeader } from '../../components/CommonPageHeader'

export const ManageAlumni = () => {
    return(
        <>
            <CommonPageHeader title='Alumnis'/>
            <br/>
            <Card>
                <AlumniTable/>
            </Card>
        </>
    )
}

const AlumniTable = ({}) => {
    
    const columns = [
        {title:'Name', dataIndex:'name'},
        {title:'Gender', dataIndex:'gender'},
        {title:'Date of Birth', dataIndex:'dob'},
        {title:'Contact', dataIndex:'contact'},
        {title:'Email', dataIndex:'email'},
        {title:'Address', dataIndex:'address'},
        {title:'State', dataIndex:'state'},
        {title:'City', dataIndex:'city'},
        {title:'Pin', dataIndex:'pin'},
    ]
    
    return(
        <>
            <Table 
                columns={columns}
                rowSelection={{type: 'checkbox'}}    
            />
        </>
    )
}