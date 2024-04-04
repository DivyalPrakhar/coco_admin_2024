import { Button, Card, Drawer, Form, Input, Radio, Select } from "antd";
import { find, map } from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { STATUS } from "../../Constants";
import { addOfflineCourseAction, updateOfflineCourseAction } from "../../redux/reducers/offlineEnquiry/OfflineCourse";
import { useCheckStatus } from "../../utils/useCheckStatus";

export default function AddOfflineCourse({ batches, assignBatches, editCourse, user, closeDrawer }) {
    const dispatch = useDispatch()
    const [form] = Form.useForm();
    const { defaultData } = useSelector(s => s.lmsConfig)

    const submitDetails = (e) => {
        if (editCourse?._id) {
            dispatch(updateOfflineCourseAction({ id: editCourse._id, ...e }))
        }
        else {
            dispatch(addOfflineCourseAction(e))
        }
    }

    const { addOfflineCourseStatus, updateOfflineCourseStatus } = useSelector(s => s.offlineCourse)

    const unassignedBatches = batches.filter(function (val) {
        return assignBatches.indexOf(val._id) == -1;
    });

    useCheckStatus({
        status: addOfflineCourseStatus,
        onSuccess: () => {
            closeDrawer()
        },
    }, [addOfflineCourseStatus]);

    useCheckStatus({
        status: updateOfflineCourseStatus,
        onSuccess: () => {
            closeDrawer()
        },
    }, [updateOfflineCourseStatus]);
    return (
        <div>
            <Drawer placement='right' onClose={closeDrawer} visible={true} width='50%' title={editCourse?._id ? 'Update Offline Course' : 'Add Offline Course'}>
                <Card >
                    <Form
                        form={form}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        layout="horizontal"
                        size='large'
                        onFinish={submitDetails}
                    >
                        <Card style={{ padding: 0, border: 0 }}>
                            <CustomInput label="Course Name" value={editCourse.name} rules={[{ required: true, message: 'Please fill in the field.' }]} name='name' placeholder='Course Name' />
                            <CustomInput label="Description" value={editCourse.desc} name='desc' placeholder='Course Description' />
                            <CustomInput label="Code" value={editCourse.code?.toString()} type="number" rules={[{ pattern: '^[1-9][0-9]{5}$', message: 'Code should have 6 digits.' }]} name='code' placeholder='6-Digit Code' />
                            <Form.Item label="Select Batch" initialValue={editCourse.batches} name='batches' rules={[{ required: true, message: 'Please select Batch.' }]}>
                                <Select mode="multiple" autoComplete='invalid' allowClear placeholder='Select Batch'>
                                    {editCourse?._id ?
                                        map(([...unassignedBatches, ...map(editCourse.batches, c => find(batches, batch => batch._id === c))]), batch => (
                                            <Select.Option value={batch?._id} key={batch?._id}>{batch?.name}</Select.Option>
                                        ))
                                        :
                                        unassignedBatches?.length ?
                                            map(unassignedBatches, batch => (
                                                <Select.Option value={batch._id} key={batch._id}>{batch?.name}</Select.Option>
                                            ))
                                            : null
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label="Exam" initialValue={editCourse.exam} name='exam' rules={[{ required: true, message: 'Please select Exam.' }]}>
                                <Select autoComplete='invalid' allowClear placeholder='Select Exam'>
                                    {defaultData?.exams?.length ?
                                        map(defaultData.exams, exam => (
                                            <Select.Option value={exam._id} key={exam._id}>{exam.name.en}</Select.Option>
                                        ))
                                        : null
                                    }
                                </Select>
                            </Form.Item>
                            <CustomInput label="Admission Fees" value={editCourse.admissionFees || 0} min={0} type="number" rules={[{ required: true, message: 'Please fill in the field.' }]} name='admissionFees' placeholder='Admission Fees' />
                            {/* <CustomInput label="Slip Prefix" value={editCourse.slipPrefix} name='slipPrefix' placeholder='Slip Prefix' /> */}
                            <Form.Item label="Status" initialValue={editCourse.isActive} rules={[{ required: true, message: 'Please a status.' }]} name='isActive'>
                                <Radio.Group required>
                                    <Radio.Button required value={true} >Active</Radio.Button>
                                    <Radio.Button required value={false}>InActive</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </Card>
                        <Form.Item wrapperCol={{ offset: 4 }}>
                            <Button type="primary" shape='round'
                                htmlType="submit" loading={addOfflineCourseStatus === STATUS.FETCHING || updateOfflineCourseStatus === STATUS.FETCHING}
                            >
                                {editCourse ? 'Update' : 'Add'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Drawer>
        </div>
    )
}

const CustomInput = ({ label, required, name, placeholder, type, rules, hidden, value }) => {
    return (
        <Form.Item label={label} hidden={hidden} rules={rules} initialValue={value} name={name}>
            <Input placeholder={placeholder} type={type || 'text'} />
        </Form.Item>
    )
}