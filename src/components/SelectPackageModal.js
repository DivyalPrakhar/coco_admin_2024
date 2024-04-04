import { Card, Modal, Table, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuthUser } from '../App/Context'
import { STATUS } from '../Constants'
import _ from 'lodash'
import { getPackagesAction } from '../redux/reducers/packages'
import Text from 'antd/lib/typography/Text'

export const SelectPackageModal = ({closeDrawer, visible, submitPackages}) => {
    const dispatch = useDispatch()

    const {packages, configData} = useSelector((state) => ({
        packages:state.packages,
        configData: state.lmsConfig,
    }))

    const [selectedPackages, selectPackages] = useState([])
    const [defaultSyllabus, setDefaultSyllabus] = useState()

    useEffect(() => {
        dispatch(getPackagesAction())
    }, [])

    useEffect(() => {
        if(configData.defaultDataStatus === STATUS.SUCCESS){
            let defaultData = configData.defaultData
            if(defaultData)
                setDefaultSyllabus({exams: defaultData.exams})//_.intersectionBy(defaultData.exams, data.exams.map(d => ({_id:d})), '_id')})
        }
    }, [configData.defaultData, configData.defaultDataStatus])

    const _selectPackage = (data) => {
        selectPackages(data)
    }

    const columns = [
        {title: 'Name', dataIndex: 'name', width:'150px', 
            render:d => (<Text>{d.en}</Text>)
        },
        {title: 'Exams', dataIndex: 'exams', 
            render:exams => {
                let data = defaultSyllabus?.exams?.length && _.intersectionBy(defaultSyllabus.exams, exams.map(d => ({_id:d})), '_id') 
                return(
                    <div>
                        { data?.length ? 
                            _.map(data, d => 
                                <Tag key={d._id}>{d.name.en}</Tag>
                            ) : null
                        }
                    </div>
            )}
        },
        {title: 'Content Type', dataIndex: 'contentType'},
        {title: 'Published', dataIndex: 'published', 
            render:type => {
                return(
                    <Text>
                        {type == 0 ? 'No' :type == 1 ? 'Yes' : 'Comming Soon' }
                    </Text>
            )}
        },
        {title: 'Price', dataIndex: 'price', 
            render:price => {
                return(
                    <div>
                        <Text>
                            Discounted Price: {price.price}<br/>
                            Real Price: {price.fakePrice}
                        </Text>
                    </div>
            )}
        },
        
    ]

    const pageChange = (d) => {
        dispatch(getPackagesAction({page:d.current}))
    }

    const _submitPackages = () => {
        const data = selectedPackages?.length ? _.intersectionBy(packages.packagesList, selectedPackages.map(d => ({_id:d})), '_id') : []
        submitPackages(data)
        closeDrawer()
    }

    const dataSourse = packages.packagesList?.length ? packages.packagesList.map(d => 
            ({key:d._id, name:d.name, exams:d.exams, contentType:d.type, published:d.published, price:{fakePrice:d.fakePrice, price:d.price}})
        ) : []
    
    return(
        <Modal title='Select Package' visible={visible} width={'70%'} onCancel={closeDrawer} onOk={_submitPackages}>
            <Card style={{border:0}} bodyStyle={{padding:0}} loading={packages.getPackagesStatus === STATUS.FETCHING && configData.defaultDataStatus == STATUS.FETCHING}>
                {packages.getPackagesStatus === STATUS.SUCCESS && configData.defaultDataStatus == STATUS.SUCCESS ?
                    <Table bordered dataSource={dataSourse} columns={columns} rowSelection={{selectedRowKeys:selectedPackages, onChange:_selectPackage}}
                        onChange={pageChange} pagination={{position:''}} scroll={{ y: 340 }}
                    />
                    :
                    null
                }
            </Card>
        </Modal>
    )
}  