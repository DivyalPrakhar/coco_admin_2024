import { useEffect, useReducer } from "react"
import { Card, Form, Modal } from "antd"
import TextArea from "antd/lib/input/TextArea"
import { useDispatch, useSelector } from "react-redux"

import { find } from "lodash"
import { STATUS } from "../../Constants"
import { FormReducer } from "../../utils/FormReducer"
import { updateCareerJobApplicationAction } from "../../redux/reducers/career"

export const CareerRemarkModal = ({ visible, closeModal, showRemarkModal }) => {
    const dispatch = useDispatch()
    const [remarkData, dispatchRemarkChange] = useReducer(FormReducer, {})

    const { careerJobApplicationList, updateCareerJobApplicationStatus } = useSelector(state => ({
        updateCareerJobApplicationStatus: state.career.updateCareerJobApplicationStatus,
        careerJobApplicationList: state.career.careerJobApplicationList
    }))

    const singleRemark = find(careerJobApplicationList?.docs, f => f._id === showRemarkModal)

    const handleSubmit = () => {
        dispatch(updateCareerJobApplicationAction({ id: showRemarkModal, ...remarkData }))
    }

    const changeRemarkData = (e) => {
        dispatchRemarkChange({ type: 'remark', value: e.target.value })
    }

    useEffect(() => {
        if (showRemarkModal) {
            dispatchRemarkChange({ type: 'remark', value: singleRemark?.remark })
        }
    }, [showRemarkModal, singleRemark?.remark])

    useEffect(() => {
        if (updateCareerJobApplicationStatus === STATUS.SUCCESS) {
            closeModal()
        }
    }, [updateCareerJobApplicationStatus])

    return (

        <Modal title="Remark" visible={visible} onCancel={closeModal} onOk={handleSubmit}>
            <Card style={{ border: 0 }} bodyStyle={{ padding: 0 }}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                >
                    <Form.Item required label='Remark'>
                        <TextArea placeholder='Remark' size="large" onChange={changeRemarkData} value={remarkData?.remark || null} />
                    </Form.Item>
                </Form>
            </Card>
        </Modal>

    )
}