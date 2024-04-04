import { UploadOutlined } from '@ant-design/icons'
import { Button, Image, message, Modal, Upload } from 'antd'
import useSelection from 'antd/lib/table/hooks/useSelection'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BaseURL } from '../../BaseUrl'
import { UploadImageBox } from '../../components/UploadImageBox'
import { STATUS } from '../../Constants'
import { resetUpdateStudent, updateStudentAction } from '../../redux/reducers/student'

export const ProfilePicModal = ({visible, closeModal, student}) => {
    const dispatch = useDispatch()
    const [image, setImage] = useState()

    const updateStudentStatus = useSelector((state) => state.student.updateStudentStatus)

    useEffect(() => {
        if(updateStudentStatus == STATUS.SUCCESS){
            dispatch(resetUpdateStudent())
            closeModal()
        }
    }, [updateStudentStatus])

    const getImage = (info) => {
            setImage(info.file)
    }

    const submitImage = () => {
        dispatch(updateStudentAction({id:student._id, avatar:image?.response?.url || ''}))
    }

    return(
        <Modal title={'Profile Picture'} visible={visible} onOk={submitImage} confirmLoading={updateStudentStatus == STATUS.FETCHING} onCancel={closeModal}>
            <div style={{display:'flex', justifyContent:'center'}}>
                <div style={{textAlign:'center'}}> 
                    {/* <div>
                        <Image loading={image == 'loading'} src={image?.response?.url || student?.avatar} width='300px'/>
                        <br/><br/>
                    </div>  */}
                    <UploadImageBox ratio='1:1' width='300px' size='large' getImage={getImage} defaultImg={student?.avatar}/>
                    {/* <Upload action={BaseURL+"app/image"} showUploadList={false} onChange={getImage} onRemove={() => setImage(null)}>
                        <Button icon={<UploadOutlined />} disabled={image}>{student?.avatar ? 'Change Image' : 'Upload Image'}</Button>
                    </Upload> */}
                </div>
            </div>
        </Modal>
    )
}