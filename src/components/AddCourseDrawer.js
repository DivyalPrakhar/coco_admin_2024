import { Button, Drawer, Form, Input, DatePicker, Upload, Alert, Select} from 'antd'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../Constants'
import moment from 'moment'
import _ from 'lodash'
import { addCourseAction, resetCourseStatus, updateCourseAction } from '../redux/reducers/courses'
import {  PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { BaseURL } from '../BaseUrl'
import { useState } from 'react'
import { ImagePreview } from './ImagePreview'

export const AddCourseDrawer = ({ visible, closeDrawer, currentCourse }) => {
    const [form] = Form.useForm()
    const dispatch = useDispatch()

    const { user, course } = useSelector((state) => ({
        user: state.user.user,
        course: state.course
    }))

    const [coverImage, changeCoverImage] = useState()

    useEffect(() => {
        if (course.addCourseStatus === STATUS.SUCCESS || course.updateCourseStatus === STATUS.SUCCESS) {
            closeDrawer()
            dispatch(resetCourseStatus())
        }

        // return () => {
            
        // }
    }, [closeDrawer, course.addCourseStatus, course.updateCourseStatus, dispatch])

    const _addCourse = (data) => {
        const rangeValue = data['date-range'];
        const carouselValue = data['carousel']
        let dataValue = _.omit({
            ...data,
            startDate: rangeValue?.length > 1 ? rangeValue[0].format('YYYY-MM-DD') : currentCourse?.startDate,
            endDate: rangeValue?.length > 1 ? rangeValue[1].format('YYYY-MM-DD') : currentCourse?.endDate,
            carousel: carouselValue && carouselValue.length > 0 ? _.compact(_.concat(currentCourse?.carousel, _.map(carouselValue, s => s.response?.url))) : null
        }, 'date-range')

        if (currentCourse)
            dispatch(updateCourseAction(dataValue))
        else
            dispatch(addCourseAction(dataValue))
    }

    const _closeDrawer = () => {
        closeDrawer()
        form.resetFields()
    }

    const normFile = (e) => {      
        if (Array.isArray(e)) {
          return e.file.response;
        }
        return e.file.response && e.fileList;
    };

    const { RangePicker } = DatePicker;

    const uploadButton = (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const _previewCover = (file) => {
        if(file?.url || file?.response?.url)
            changeCoverImage(file)
        else
            changeCoverImage(null)
    }

    return (
        <Drawer placement='right' onClose={_closeDrawer} visible={visible} width='50%' title={currentCourse ? 'Update Course' : 'Add Course'}>
            <Form
                onFinish={_addCourse}
                form={form}
                wrapperCol={{ span: 14 }}
                labelCol={{ span: 4 }}
                layout="horizontal"
            >
                <Form.Item name='name' label='Course Name' required initialValue={currentCourse?.name}>
                    <Input placeholder='Name' required />
                </Form.Item>
                {currentCourse ?
                    <Form.Item hidden name='id' initialValue={currentCourse._id}>
                        <Input />
                    </Form.Item>
                    :
                    <Form.Item hidden name='instituteId' initialValue={user.staff.institute._id}>
                        <Input />
                    </Form.Item>
                }
                <Form.Item name='description' label='Description' initialValue={currentCourse?.description}>
                    <Input.TextArea placeholder='Description' type='textarea' rows={4} />
                </Form.Item>
                <Form.Item name='code' label='Reference Id' initialValue={currentCourse?.code}>
                    <Input placeholder='Code' type='number' min={0} />
                </Form.Item>
                <Form.Item name='duration' label='Validity' initialValue={currentCourse?.duration}>
                    <Input placeholder='Validity (in number of days)' type='number' min={0} />
                </Form.Item>
                <Form.Item name='date-range' label='Date'>
                    <RangePicker 
                        defaultValue={[currentCourse?.startDate ? moment(currentCourse?.startDate, 'YYYY/MM/DD') : null, currentCourse?.endDate ? moment(currentCourse?.endDate, 'YYYY/MM/DD') : null]}
                    />
                </Form.Item>
                <Form.Item required  name='lang' label='Language' initialValue={currentCourse?.lang || 'en'}>
                    <Select placeholder='Select Language' >
                        <option value={'en'}>English</option>
                        <option value={'hn'}>Hindi</option>
                        <option value={'bi'}>Bilingual</option>
                    </Select>
                </Form.Item>
                <Form.Item label="Cover Image">
                    <Form.Item name="carousel" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                        <Upload
                            name="file"
                            action= {BaseURL+"app/image"}
                            listType="picture-card"
                            onPreview={_previewCover}
                            
                            {...(currentCourse?.carousel?.length && {
                                defaultFileList : _.map(_.compact(currentCourse.carousel), (cr, ind) => ({ 
                                    uid: {ind}, name: ind+'.png', status: 'done', url: cr
                                }))
                            })}
                            accept="image/png, image/jpeg, image/webp"

                        >
                            {uploadButton}
                        </Upload>
                    </Form.Item>
                    <br/>
                    <Alert message="Recommended Image Ratio: 16:9" showIcon style={{background: '#e6f7fe', border: '1px solid #92d4fb'}}/>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 4 }}>
                    <Button type="primary" loading={course.addCourseStatus === STATUS.FETCHING || course.updateCourseStatus === STATUS.FETCHING} htmlType="submit">
                        Add
                    </Button>
                </Form.Item>
            </Form>
            {coverImage ? <ImagePreview visible={coverImage} imageUrl={coverImage?.url || coverImage?.response?.url} closeModal={_previewCover}/> : null}
        </Drawer>
    )
}