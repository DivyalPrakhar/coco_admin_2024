import { Modal } from 'antd'
import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import { resetAddNewTestQuestion } from '../../redux/reducers/test'
import { AddQuestions } from '../ManageQuestions/AddQuestion'

export const AddTestQuestionModal = ({ visible, closeModal, testData }) => {
    const dispatch = useDispatch()
    const { addNewTestQuestionStatus } = useSelector(state => ({
        addNewTestQuestionStatus: state.test.addNewTestQuestionStatus
    }))

    useEffect(() => {
        if (addNewTestQuestionStatus == STATUS.SUCCESS) {
            closeModal()
        }

        return () => {
            dispatch(resetAddNewTestQuestion())
        }
    }, [addNewTestQuestionStatus])

    return (
        <Modal visible={testData.status} width={1400} onCancel={closeModal}
            title={<b>Add Question</b>} footer={null}
        >
            <AddQuestions updateData={testData.data} />
        </Modal>
    )
}