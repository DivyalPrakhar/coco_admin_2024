import { Modal } from 'antd'
import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../Constants'
import { resetUpdateTestAction } from '../redux/reducers/test'
import { AddQuestions } from '../routes/ManageQuestions/AddQuestion'

export const UpdateQuestionModal = ({ visible, closeModal, data, wordUpload, newUpdatedQuestion, bulkQuestions, dataToBulk }) => {
    const dispatch = useDispatch()
    const { queReducer, updateTestQueDataStatus } = useSelector(state => ({
        queReducer: state.questions,
        updateTestQueDataStatus: state.test.updateTestQuestionDataStatus
    }))

    useEffect(() => {
        return () => {
            dispatch(resetUpdateTestAction())
        }
    }, [])

    useEffect(() => {
        if (queReducer.updateQueStatus === STATUS.SUCCESS || queReducer.addQuestionStatus === STATUS.SUCCESS || updateTestQueDataStatus === STATUS.SUCCESS) {
            if (wordUpload) {
                newUpdatedQuestion(queReducer.newUpdatedQuestion)
            }
            closeModal()
        }
    }, [queReducer.updateQueStatus, queReducer.addQuestionStatus, updateTestQueDataStatus, queReducer.newUpdatedQuestion, wordUpload, closeModal, newUpdatedQuestion])

    return (
        <Modal visible={visible} width={1400} onCancel={closeModal}
            title={<b>Edit Question</b>} footer={null}
        >
            <AddQuestions updateData={data} bulkQuestions={bulkQuestions} dataToBulk={(data) => dataToBulk(data)} closeUpdateModal={closeModal} />
        </Modal>
    )
}