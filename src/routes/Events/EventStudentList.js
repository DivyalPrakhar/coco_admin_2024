import { Text } from "@chakra-ui/react";
import { Button, Card, Checkbox, Form, Input, Row, Select, Space, Table, Typography } from "antd";
import { findIndex, map, xor } from "lodash";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { CommonPageHeader } from "../../components/CommonPageHeader";
import { STATUS } from "../../Constants";
import { getEventAction, getAllEventUser, updateUserEventAction } from "../../redux/reducers/events";

export default function EventStudentList() {
    const limit = 20
    const { id } = useParams()
    const dispatch = useDispatch()
    const { Paragraph } = Typography
    const [text, openText] = useState([])

    const { eventDetails, eventUserList, getAllEventUserStatus } = useSelector(s => ({ eventDetails: s.event.eventDetails, eventUserList: s.event.eventUserList, getAllEventUserStatus: s.event.getAllEventUserStatus }))

    useEffect(() => {
        dispatch(getEventAction({ eventId: id }))
        dispatch(getAllEventUser({ event: id, limit: limit, page: 1 }))
    }, [dispatch, id])

    const _openText = (obj) => {
        openText(d => xor(d, [obj._id]))
    }

    const _previewFile = (url) => {
        window.open(url, "_blank")
    }

    const _updateUser = (data) => {
        dispatch(updateUserEventAction(data))
    }

    const handleCurrentPage = (d) => {
        dispatch(getAllEventUser({ event: id, limit: limit, page: d.current, sort: filter?.sort, name: filter?.name }))
    }

    const [filter, setFilter] = useState({})

    const applyFilter = useCallback(() => {
        dispatch(getAllEventUser({ event: id, limit: limit, sort: filter?.sort, name: filter?.name }))
    }, [dispatch, filter?.name, filter?.sort, id])

    useEffect(() => {
        applyFilter()
    }, [applyFilter, filter])

    return (
        <div>
            <CommonPageHeader title='Manage Event Student List' />
            <br />
            {eventDetails ?
                <Card>
                    <Text fontSize={26} fontWeight={"bold"}>{eventDetails.title}</Text>
                    <Row>
                        <Text fontWeight={"bold"}>Start Date & Time: </Text>
                        <Text ml={5}>{moment(eventDetails.startDate).format("DD-MM-YYYY")}  {moment(eventDetails.startTime).format("hh:mm A")}</Text>
                    </Row>
                    <Row>
                        <Text fontWeight={"bold"}>End Date & Time: </Text>
                        <Text ml={5}>{moment(eventDetails.endDate).format("DD-MM-YYYY")}  {eventDetails.endTime ? moment(eventDetails.endTime).format("hh:mm A") : ''}</Text>
                    </Row>
                    <Row>
                        <Text fontWeight={"bold"}>Result Date: </Text>
                        <Text ml={5}>{moment(eventDetails.resultDate).format("DD-MM-YYYY")}</Text>
                    </Row>
                    {eventDetails.userInputFile?.fileTypes?.length ?
                        <Row>
                            <Text fontWeight={"bold"}>Acceptable File Type: </Text>
                            <Text ml={5}>{map(eventDetails.userInputFile.fileTypes, type => type)}</Text>
                        </Row>
                        :
                        null
                    }
                    {eventDetails.userInput && eventDetails.userInputText ?
                        <Row>
                            <Text fontWeight={"bold"}>Acceptable Input Length: </Text>
                            <Text ml={5}>Min : {eventDetails.userInputText.minTextLength}, Max: {eventDetails.userInputText.maxTextLength}</Text>
                        </Row>
                        :
                        null
                    }
                    {eventDetails?.eventFiles?.length ?
                        <Row>
                            <Text fontWeight={"bold"}>Uploaded Files: </Text>&nbsp;&nbsp;
                            <Row ml={5}>{map(eventDetails.eventFiles, (files, i) => (<Text mr={3} style={{ color: "blue", cursor: "pointer" }} onClick={() => _previewFile(files.url)}><u>{files.name}</u>{i !== eventDetails.eventFiles.length - 1 ? ",  " : ''}</Text>))}</Row>
                        </Row>
                        :
                        null
                    }
                </Card>
                :
                null
            }
            <Card>
                <Space>
                    <Form.Item label='Name'>
                        <Input id="name" placeholder="Filter By Name" onPressEnter={(e) => setFilter(pre => ({ ...pre, name: e.target.value }))} />
                    </Form.Item>
                    <Form.Item label='Order by Marks'>
                        <Select id="marks" name="marks" placeholder={"Order By Marks"} onChange={(val) => setFilter(pre => ({ ...pre, sort: val }))}
                            options={[
                                {
                                    value: '1',
                                    label: 'Ascending',
                                },
                                {
                                    value: '-1',
                                    label: 'Descending',
                                },
                            ]}
                        >
                        </Select>
                    </Form.Item>
                </Space>
                <Table style={{ marginTop: 10 }} loading={getAllEventUserStatus === STATUS.FETCHING ? true : false} bordered dataSource={eventUserList?.docs}
                    pagination={{
                        total: eventUserList?.total,
                        pageSize: limit,
                        showSizeChanger: false,
                        current: eventUserList ? parseInt(eventUserList.page) : 1,
                    }}
                    onChange={handleCurrentPage}>
                    <Table.Column title='Name'
                        render={d => <Text>{d.user.name}</Text>}
                    ></Table.Column>
                    <Table.Column title='Files'
                        render={d => map(d.files, (url, index) => <Text style={{ color: "blue", cursor: "pointer" }} onClick={() => _previewFile(url)}><u>File{index + 1}</u></Text>)}
                    ></Table.Column>
                    <Table.Column width='40%' title='Text' dataIndex='text'
                        render={(d, obj) => {
                            let readMore = findIndex(text, des => des === obj._id) !== -1
                            return d?.length > 120 ?
                                <div>
                                    {readMore ? d : d.substring(0, 120) + '...'}
                                    {readMore ?
                                        <Button type='link' color='blue' style={{ padding: 0 }} size='xs' onClick={() => _openText(obj)}>read less</Button>
                                        :
                                        <Button type='link' color='blue' style={{ padding: 0 }} size='xs' onClick={() => _openText(obj)}>read more</Button>
                                    }
                                </div> : d
                        }}
                    ></Table.Column>
                    <Table.Column title='Marks'
                        render={d => <Paragraph type="number" editable={{ onChange: (e) => _updateUser({ eventUserId: d._id, marks: e }) }}>{d.marks}</Paragraph>}
                    ></Table.Column>
                    <Table.Column title='Rank'
                        render={d => <Paragraph type="number" editable={{ onChange: (e) => _updateUser({ eventUserId: d._id, rank: e }) }}>{d.rank}</Paragraph>}
                    ></Table.Column>
                    <Table.Column title='HighlightResult'
                        // render={d => d.highlightResult === true ? "Yes" : d.highlightResult === false ? "No" : null}
                        render={d => <Checkbox defaultChecked={d.highlightResult} onClick={(e) => _updateUser({ eventUserId: d._id, highlightResult: e.target.checked })} />}
                    ></Table.Column>
                </Table>
                {/* <Pagination total={eventUserList.total} current={currPage} pageSize={eventUserList.limit} onChange={(page, pageSize) => { setCurrPage(page); }} /> */}
            </Card>
        </div >
    )
}