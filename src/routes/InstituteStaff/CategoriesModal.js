import { Card, Input, Modal, Space, Tag } from 'antd'
import Text from 'antd/lib/typography/Text'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import { getCategoriesAction } from '../../redux/reducers/instituteStaff'
import _ from 'lodash'
import { SearchIcon } from '@chakra-ui/icons'

export const CategoriesModal = ({visible, closeModal, onSubmit, defaultData, loading}) => {
    const dispatch = useDispatch()
  
    const {getCategoriesStatus, allCategories} = useSelector(state => ({
      getCategoriesAction:state.instituteStaff.allCategories,
      allCategories:state.instituteStaff.allCategories,
    }))
  
    const [selectedData, setData] = useState([])
    const [categoriesList, setCategories] = useState([])

    useEffect(() => {
      if(allCategories?.length)
        setCategories(allCategories)
    }, [allCategories])

    useEffect(() => {
      if(defaultData){
        setData(defaultData)
      }
    }, [defaultData])

    useEffect(() => {
      dispatch(getCategoriesAction())
    }, [dispatch])
    
    const handleSelect = (obj) => {
      let data = _.xorBy(selectedData, [obj], '_id')
      setData(data)
    }
  
    const handleSubmit = () => {
      onSubmit(selectedData)
    }

    const handleSearch = (e) => {
      const data = _.filter(allCategories, c => _.includes(_.lowerCase(c.name), _.lowerCase(e.target.value)))
      setCategories(data)
    }
  
    return(
      <Modal width={'50%'} title={'Select Category'} visible={visible} onCancel={closeModal}
        okText='Done' onOk={handleSubmit} okButtonProps={{loading}}
      >
        <Card loading={getCategoriesStatus === STATUS.FETCHING} style={{border:0}} bodyStyle={{padding:0}}>
          <Input style={{width:300}} allowClear onChange={handleSearch} placeholder='Search Category' prefix={<SearchIcon/>} />
          <br/><br/>
          {categoriesList?.length ? 
            <div>
              <Space wrap='wrap' size={'small'}>
                {categoriesList.map(cat => 
                  {
                    const selected = _.findIndex(selectedData,d => d._id === cat._id) !== -1
                    return(
                      <div key={cat._id} style={{border:'1px solid #D6DBDF', padding:0}}>
                        <Tag.CheckableTag style={{fontSize:15, padding:'4px 7px', margin:0}} 
                          onChange={() => handleSelect(cat)} 
                          checked={selected}
                          key={cat._id}
                        >
                          {cat.name}
                        </Tag.CheckableTag>
                      </div>
                    )
                  }
                )}
              </Space>
            </div>
            :
            <Text>No Categories Available</Text>
          }
        </Card>
      </Modal>
    )
  }