import { useSelector } from "react-redux"
import { Card, Modal } from "antd"
import { find } from "lodash"
import { Typography } from "antd";
const { Text } = Typography;

export const ViewMoreCareerDetailModal = ({ visible, closeModal, careerId }) => {

    const { careerJobApplicationList } = useSelector(state => ({
        careerJobApplicationList: state.career.careerJobApplicationList

    }))

    const careerData = find(careerJobApplicationList?.docs, f => f._id === careerId)
    return (
        <Modal title="Details" visible={visible} onCancel={closeModal} footer={[null]}>
            <Card style={{ border: 0 }} bodyStyle={{  padding:0}}>
                <div >
                    <Text style={{ fontSize:16, fontWeight: 'bold',margin:0 }} type='secondary'>{careerData?.name} </Text>
                    <Text style={{ fontSize: 14, margin:0 }} type='secondary'>{careerData?.contact} </Text>
                    <Text style={{ fontSize: 14, margin:0 }} type='secondary'>{careerData?.email}</Text>
                </div>
                <br />
                {careerData?.referenceMedium &&
                    <div>
                        <Text style={{ fontSize: 16, fontWeight: 'bold',margin:0 }} type='secondary'>Reference Medium </Text>
                        <Text style={{ fontSize: 14}} type='secondary'>{careerData?.referenceMedium}</Text>
                    </div>
                }
                {careerData?.remark &&
                    <div>
                        <Text style={{ fontSize: 16, fontWeight: 'bold',margin:0 }} type='secondary'>Remark </Text>
                        <Text style={{ fontSize: 14}} type='secondary'>{careerData?.remark}</Text>
                    </div>
                }

            </Card>
        </Modal>
    )
}
