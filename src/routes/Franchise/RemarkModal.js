import { useEffect, useReducer } from "react"
import { Card, Form, Modal } from "antd"
import TextArea from "antd/lib/input/TextArea"
import { useDispatch, useSelector } from "react-redux"
import { updateFranchiseEnquiryAction } from "../../redux/reducers/franchise"

import { find } from "lodash"
import { STATUS } from "../../Constants"
import { FormReducer } from "../../utils/FormReducer"

export const RemarkModal = ({ visible, closeModal, showRemarkModal }) => {
    const dispatch = useDispatch()
    const [remarkData, dispatchRemarkChange] = useReducer(FormReducer, {})

    const { franchiseEnquiryList, updateFranchiseEnquiryStatus } = useSelector(state => ({
        updateFranchiseEnquiryStatus: state.franchiseEnquiry.updateFranchiseEnquiryStatus,
        franchiseEnquiryList: state.franchiseEnquiry.franchiseEnquiryList
    }))

    const singleRemark = find(franchiseEnquiryList?.docs, f => f._id === showRemarkModal)

    const handleSubmit = () => {
        dispatch(updateFranchiseEnquiryAction({ id: showRemarkModal, ...remarkData }))
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
        if (updateFranchiseEnquiryStatus === STATUS.SUCCESS) {
            closeModal()
        }
    }, [updateFranchiseEnquiryStatus])

    return (

        <Modal title="Remark" visible={visible} onCancel={closeModal} onOk={handleSubmit}>
            <Card style={{ border: 0 }} bodyStyle={{ padding: 0 }}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                >
                    <Form.Item required label='Remark'>
                        <TextArea placeholder='Remark' size='large' onChange={changeRemarkData} value={remarkData?.remark || null} />
                    </Form.Item>
                </Form>
            </Card>
        </Modal>

    )
}
