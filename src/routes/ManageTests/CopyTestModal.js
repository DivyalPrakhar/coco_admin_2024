import { Checkbox, Form, Input } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import { copyTestAction, resetCopyTest } from '../../redux/reducers/test'

export const CopyTestModal = ({visible, closeModal, test}) => {
    const dispatch = useDispatch()

    const {copyTestStatus} = useSelector(state => ({
        copyTestStatus:state.test.copyTestStatus
    }))

    const [addFakeAttempts, changeAttempts] = useState(false)
    const [testName, changeTestName] = useState()

    useEffect(() => {
        return () => dispatch(resetCopyTest())
    }, [])

    useEffect(() => {
        if(copyTestStatus == STATUS.SUCCESS)
            closeModal()
    }, [ copyTestStatus ])

    const addTest = () => {
        dispatch(copyTestAction({from_test_id:test._id, name:{en:testName}, addFakeAttempts}))
    }

    const _changeTestName = (e) => {
        changeTestName(e.target.value)
    } 

    return(
        <Modal title='Copy Test' okText='Add' visible={visible} onOk={addTest} confirmLoading={copyTestStatus == STATUS.FETCHING} onCancel={closeModal}>
            <Form layout='vertical'>
                <Form.Item label='Test Name (English)'>
                    <Input placeholder='test name' value={testName} onChange={_changeTestName}/>
                </Form.Item>
                <Form.Item>
                    <Checkbox onChange={e => changeAttempts(e.target.checked)}>Copy Attempts</Checkbox>
                </Form.Item>
            </Form>
        </Modal>
    )
}