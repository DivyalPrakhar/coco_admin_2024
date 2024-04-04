import { ReloadOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Modal, Radio, Skeleton, Space, Table, Tag, Typography } from 'antd'
import { intersectionBy, differenceBy, orderBy } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuthUser } from '../../App/Context'
import { STATUS } from '../../Constants'
import { getCoursesAction } from '../../redux/reducers/courses'
import { getPackagesAction } from '../../redux/reducers/packages'
import { getAllTestsAction } from '../../redux/reducers/test'
import { bilingualText } from '../../utils/FileHelper'

export const SelectPackageModal = ({ visible, closeModal, onSubmit, singleSelect, defaultPackages }) => {
    const dispatch = useDispatch()
    const auth = useAuthUser()
    const [form] = Form.useForm()

    const { packagesList, getPackagesStatus, configData, course, testsList, products, getAllTestsStatus } = useSelector(state => ({
        getPackagesStatus: state.packages.getPackagesStatus,
        packagesList: state.packages.packagesList,
        configData: state.lmsConfig,
        course: state.course,
        testsList: state.test.testsList,
        getAllTestsStatus: state.test.getAllTestsStatus,
        products: state.product,
    }))

    const [defaultSyllabus, setDefaultSyllabus] = useState({ exams: [] })
    const [selectedPackages, setPackages] = useState([])

    useEffect(() => {
        dispatch(getPackagesAction({ published: 1 }))
        dispatch(getAllTestsAction())
        if (course.getCoursesStatus !== STATUS.SUCCESS)
            dispatch(getCoursesAction({ instituteId: auth.staff.institute._id }))
    }, [auth.staff, dispatch, course])

    useEffect(() => {
        if (configData.defaultDataStatus === STATUS.SUCCESS) {
            let defaultData = configData.defaultData
            if (defaultData)
                setDefaultSyllabus({ exams: defaultData.exams })
        }
    }, [configData.defaultData, configData.defaultDataStatus])

    const _selectPackage = (rows) => {
        setPackages(rows)
    }

    const _submit = () => {
        onSubmit(selectedPackages)
        closeModal()
    }

    const _search = (data) => {
        dispatch(getPackagesAction(data))
    }

    const _reset = () => {
        dispatch(getPackagesAction())
        form.resetFields()
    }

    useEffect(() => {
        form.setFieldsValue({ published: 1 })
    }, [form])

    const allPackages = useMemo(() => {
        
        if (packagesList?.length) {
            return singleSelect ? differenceBy(packagesList, defaultPackages || [], '_id') : packagesList 
        }
    }, [defaultPackages, packagesList, singleSelect])

    const publishStatuses = ['No', 'Yes', 'Coming Soon']
    return (
        <Modal onOk={_submit} width={1200} title='Select Package' visible={visible} onCancel={closeModal}>
            <Skeleton loading={getAllTestsStatus === STATUS.FETCHING || course.getCoursesStatus === STATUS.FETCHING}>
                <Form size='small' form={form} onFinish={_search}>
                    <Space size={'large'}>
                        <Form.Item name='name' label='Search Package'>
                            <Input placeholder='package name' />
                        </Form.Item>
                        <Form.Item name='published' label='Published Status'>
                            <Radio.Group >
                                <Radio value={1}>Published</Radio>
                                <Radio value={0}>Not Published</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <Button htmlType='submit'>Filter</Button>
                                <Button icon={<ReloadOutlined />} onClick={_reset} >Reset</Button>
                            </Space>
                        </Form.Item>
                    </Space>
                </Form>
                <br />
                <Table pagination={{ showSizeChanger: false }} size='small' dataSource={allPackages?.length ? orderBy(allPackages, 'createdAt','desc').map(d => ({ ...d, key: d._id })) : []}
                    rowSelection={{
                        type: singleSelect ? 'radio' : 'checkbox',
                        onChange: (d, obj) => _selectPackage(obj),
                    }}
                    loading={getPackagesStatus === STATUS.FETCHING}
                >
                    <Table.Column title='Code' dataIndex={'serial'} />
                    <Table.Column title='Package Name' dataIndex={'name'} width={300}
                        render={d => <Typography.Text style={{ fontSize: 13 }}>{bilingualText(d)}</Typography.Text>}
                    />
                    <Table.Column title='Exams' dataIndex={'exams'}
                        render={ids => {
                            const exams = intersectionBy(defaultSyllabus.exams, ids.map(d => ({ _id: d })), '_id')
                            return (
                                <div>
                                    {exams.length ?
                                        exams.map(exam =>
                                            <Tag>{bilingualText(exam.name)}</Tag>
                                        )
                                        : null
                                    }
                                </div>
                            )
                        }}
                    />
                    <Table.Column title='Price'
                        render={d => {
                            return (
                                <div>
                                    {
                                        d.isSubscription ?
                                            <span>subscription</span>
                                            :
                                            <>
                                                <span style={{ color: 'green' }}>₹ {d.price}</span><br />
                                                {d.fakePrice ? <span style={{ color: 'red', textDecoration: 'line-through' }}>₹ {d.fakePrice}</span> : null}
                                            </>
                                    }
                                </div>
                            )
                        }}
                    />
                    <Table.Column title='Content Type'
                        render={d => {
                            const tests = intersectionBy(testsList, d.tests.map(c => ({ _id: c.test })), '_id')
                            const courses = intersectionBy(course.courseList, d.courses.map(c => ({ _id: c })), '_id')
                            const books = intersectionBy(products.productsData?.BOOK, d.books.map(c => ({ _id: c })), '_id')
                            const drives = intersectionBy(products.productsData?.DRIVE, d.drives.map(c => ({ _id: c })), '_id')
                            const magazines = intersectionBy(products.productsData?.MAGAZINE, d.magazines.map(c => ({ _id: c })), '_id')
                            return (
                                <>
                                    {/*{tests.length ? <div><b>Tests:</b> {_.join(tests.map(d => d?.name?.en, ', '))}</div> : null}
                        {courses.length ? <div><b>Courses:</b> {_.join(courses.map(d => d.name, ', '))}</div> : null}
                        {books.length ? <div><b>Books:</b> {_.join(books.map(d => d.name.en, ', '))}</div> : null}
                        {drives.length ? <div><b>Drives:</b> {_.join(drives.map(d => d.name.en, ', '))}</div> : null}
                        {magazines.length ? <div><b>Magazines:</b> {_.join(magazines.map(d => d.name.en, ', '))}</div> : null}*/}
                                    {tests.length ? <div><b>Tests:</b> {tests.length}</div> : null}
                                    {courses.length ? <div><b>Courses:</b> {courses.length}</div> : null}
                                    {books.length ? <div><b>Books:</b> {books.length}</div> : null}
                                    {drives.length ? <div><b>Drives:</b> {drives.length}</div> : null}
                                    {magazines.length ? <div><b>Magazines:</b>{magazines.length}</div> : null}
                                </>
                            )
                        }}
                    />
                    <Table.Column title='Published' dataIndex={'published'}
                        render={d => (<Tag color={d === 1 ? 'green' : d === 0 ? 'red' : d === 2 ? 'orange' : 'red'}>{publishStatuses[d || 0]}</Tag>)}
                    />
                </Table>
            </Skeleton>
        </Modal>
    )
}