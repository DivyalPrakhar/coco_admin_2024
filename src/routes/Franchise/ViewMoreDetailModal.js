import { useSelector } from "react-redux"
import { Card, Modal } from "antd"
import Text from 'antd/lib/typography/Text'
import { find } from "lodash"

export const ViewMoreDetailModal = ({ visible, closeModal, franchiseEnquiryId }) => {

    const { franchiseEnquiryList } = useSelector(state => ({
        franchiseEnquiryList: state.franchiseEnquiry.franchiseEnquiryList

    }))

    const franchiseData = find(franchiseEnquiryList?.docs, f => f._id === franchiseEnquiryId)
    return (
        <Modal title="Details" visible={visible} onCancel={closeModal} footer={[null]}>
            <Card style={{ border: 0 }} bodyStyle={{  padding:0}}>
                <div >
                    <Text style={{ fontSize:16, fontWeight: 'bold',margin:0 }} type='secondary'>{franchiseData?.name} </Text>
                    <Text style={{ fontSize: 14, margin:0 }} type='secondary'>{franchiseData?.contact} </Text>
                    <Text style={{ fontSize: 14, margin:0 }} type='secondary'>{franchiseData?.email}</Text>
                </div>
                <br />
                {franchiseData?.workExperience &&
                    <div>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', margin:0 }} type='secondary'>Work Experience </Text>
                        <Text style={{ fontSize: 14 }} type='secondary'>{franchiseData?.workExperience}</Text>
                    </div>
                }
                {franchiseData?.businessExperience &&
                    <div>
                        <Text style={{ fontSize: 16, fontWeight: 'bold',margin:0 }} type='secondary'>Business Experience </Text>
                        <Text style={{ fontSize: 14}} type='secondary'>{franchiseData?.businessExperience}</Text>
                    </div>
                }
                {franchiseData?.remark &&
                    <div>
                        <Text style={{ fontSize: 16, fontWeight: 'bold',margin:0 }} type='secondary'>Remark </Text>
                        <Text style={{ fontSize: 14}} type='secondary'>{franchiseData?.remark}</Text>
                    </div>
                }

            </Card>
        </Modal>
    )
}
