import { Button, DatePicker, Drawer, Form, Input, Space } from 'antd';
import React, { useEffect, useReducer } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '../Constants';
import { addBatchAction, updateBatchAction } from '../redux/reducers/batches';
import { FormReducer } from '../utils/FormReducer';
import moment from 'moment'

export const AddBatchDrawer = ({closeDrawer, visible, selectedBatch}) => {
    const dispatch = useDispatch()
    const [batchData, dispatchPropertyChange] = useReducer(FormReducer,{}) 
    const [form] = Form.useForm();

    const {addBatchStatus, updateBatchStatus, user} = useSelector((state) => ({
        addBatchStatus:state.batches.addBatchStatus,
        updateBatchStatus:state.batches.updateBatchStatus,
        user:state.user.user
    }))

    useEffect(() => {
        if(addBatchStatus == STATUS.SUCCESS || updateBatchStatus == STATUS.SUCCESS){
            closeDrawer()
        }
    }, [addBatchStatus, updateBatchStatus])

    const _setYear = (dates) => {
        if(dates && dates.length){
            dispatchPropertyChange({type:'startyear', value:dates[0].year()})
            dispatchPropertyChange({type:'endyear', value:dates[1].year()})
        }
        else
        {
            dispatchPropertyChange({type:'startyear', value:null})
            dispatchPropertyChange({type:'endyear', value:null})
        }
    }

    // const _setStartYear = (date) => {
    //     dispatchPropertyChange({type:'startyear', value:date && date.year()})
    // }

    // const _setEndYear = (date) => {
    //     dispatchPropertyChange({type:'endyear', value:date && date.year()})
    // }

    const _setName = (e) => {
        dispatchPropertyChange({type:'name', value:e.target.value})
    }

    const _closeDrawer = () => {
        closeDrawer()
    }

    const submitForm = () => {
        if(selectedBatch)
            dispatch(updateBatchAction({...batchData, id:selectedBatch.id}))
        else
            dispatch(addBatchAction({...batchData, instituteId:user.staff.institute._id}))
    }
    
    return(
        <Drawer title='Add Batch' visible={visible}  width='50%' onClose={_closeDrawer}>
            <Form
                form={form}
                layout='vertical'
                size='large'
                onSubmitCapture={submitForm}
                key={selectedBatch?.id}
            >
                <Form.Item label="Batch Name" required name='name'>
                    <Input placeholder="name" autoFocus defaultValue={selectedBatch ? selectedBatch.name : ''} onChange={_setName} required name='batch_name' />
                </Form.Item>
                <Space size='large' wrap={true}>
                    {/* <Form.Item label="Start Year">
                        <DatePicker onChange={_setStartYear} defaultValue={selectedBatch && selectedBatch.startyear ? moment(String(selectedBatch.startyear)) : ''} name='start_year' picker="year" />
                    </Form.Item>
                    <Form.Item label="End Year">
                        <DatePicker onChange={_setEndYear} disabled={selectedBatch? !selectedBatch.startyear :  !batchData.startyear} defaultValue={selectedBatch && selectedBatch.endyear ? moment(String(selectedBatch.endyear)) : ''} name='end_year' picker="year" />
                    </Form.Item> */}
                    <Form.Item label='Select Start & End Year' name='date'>
                        <DatePicker.RangePicker
                            onChange={dates => _setYear(dates)} 
                            defaultValue={selectedBatch && selectedBatch.startyear ? [moment(String(selectedBatch.startyear)), selectedBatch.endyear ? moment(String(selectedBatch.endyear)) : ''] : ['', '']}
                            placeholder={['start year', 'end year']}
                            picker='year'    
                        />
                    </Form.Item>
                </Space>
                <br/><br/>
                <Form.Item >
                    <Button htmlType="submit">{selectedBatch ? 'Update' : 'Add'}</Button>
                </Form.Item>
            </Form>
        </Drawer>
    )
}