import { Button, Card, Descriptions, Drawer, Form } from 'antd'
import React, { useState } from 'react'
import _ from 'lodash'
import { useDispatch } from 'react-redux'
import Checkbox from 'antd/lib/checkbox/Checkbox'
import { FetchingMessage } from '../../Constants/CommonAlerts'
import { updateStudentPackageDetails, updateStudentSubPackageDetails, updateStudentTrialPackageDetails } from '../../redux/reducers/packages'

export const UpdateStudentPackageModal = (props) => {
    return (
        <Drawer visible={props.visible} title='Edit' width={'50%'} onClose={props.closeModal} >
            {
                props.studentPackageRoll ?
                    <DataModel {...props} /> : null
            }
        </Drawer>
    )
}

const DataModel = ({ visible, studentPackageRoll, currentPkg, assignedPkg }) => {
    let stpkg = studentPackageRoll?.packages
    const [mode, setMode] = useState(stpkg?.mode || "online")
    const [center, setCenter] = useState(stpkg?.center)

    const dispatch = useDispatch()

    const _save = async () => {
        const params = {}
        params.mode = mode
        if (mode === "offline") {
            params.center = center
        } else {
            params.center = null
        }
        params.userId = studentPackageRoll?.user?._id
        params.packageId = stpkg?.package

        FetchingMessage()

        if (visible === 'trial')
            dispatch(updateStudentTrialPackageDetails(params))
        else if (assignedPkg.subscription)
            dispatch(updateStudentSubPackageDetails(params))
        else
            dispatch(updateStudentPackageDetails(params))
    }

    return (
        <Card style={{ border: 0 }} bodyStyle={{ padding: 0 }} >
            <div style={{ padding: "10px" }}>
                <Descriptions bordered column={1} style={{ marginBottom: "20px" }}>
                    <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label="Package">{currentPkg?.name?.en}</Descriptions.Item>
                    <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label="Roll No.">{studentPackageRoll?.rollNumber?.finalRoll}</Descriptions.Item>

                </Descriptions>

                <Form.Item label="Mode" name="mode">
                    <Checkbox
                        checked={mode === "offline"}
                        onChange={() => setMode("offline")}
                    >
                        Offline
                    </Checkbox>
                    <Checkbox
                        checked={mode === "online"}
                        onChange={() => setMode("online")}

                    >
                        Online
                    </Checkbox>
                </Form.Item>
                {
                    mode === "offline" ?
                        <Form.Item label="Center">
                            {
                                _.map(currentPkg?.centers, c => {
                                    return (
                                        <div key={c.code}
                                        >
                                            <Checkbox
                                                checked={c.code === center?.code}
                                                onChange={() => setCenter(c)}
                                            >
                                                <div>
                                                    {c.name}
                                                </div>
                                                <div>
                                                    {
                                                        c.code
                                                    }
                                                </div>
                                            </Checkbox>
                                        </div>
                                    )
                                })
                            }

                        </Form.Item>
                        : null}

                <Button onClick={_save}>Save</Button>
            </div>
        </Card>
    )
}