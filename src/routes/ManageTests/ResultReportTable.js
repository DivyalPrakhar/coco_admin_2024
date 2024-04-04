import { SearchOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Col, Row, Descriptions, Tabs, Table, Progress, Tag, Form, Input, Space } from 'antd'
import _ from 'lodash'
import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { STATUS } from '../../Constants'

export const ResultDataTable = ({data}) => {

    const {resultCalculateStatus} = useSelector(state => ({
        resultCalculateStatus:state.test.resultCalculateStatus,
    }))
    
    let searchInput = useRef()
    
    const filter = (name) => ({
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.select(), 100);
            }
        },

        onFilter: (value, record) =>
            record?.userId?.[name]
            ? record?.userId?.[name]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase())
            : "",

        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Form
                    onFinish={() => {
                    confirm({ closeDropdown: false });}}
                >
                    <Input ref={(node) => {searchInput = node;}}
                        placeholder={`Search ${name}`}
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        style={{ marginBottom: 8, display: "block" }}
                    />
                    <Space>
                        <Button
                            htmlType="submit"
                            type="primary"
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Search
                        </Button>
                        <Button
                            onClick={() => {clearFilters()}}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Reset
                        </Button>
                    </Space>
                </Form>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{ fontSize: "18px", color: filtered ? "#1890ff" : undefined }}
            />
        ),
    })

    const [page, changePage] = useState(1)
    let pageSize = 20

    const columns = [
        {
            title: '#',
            key: 'index',
            render: (text, pData, id) => (page - 1) * pageSize + id + 1,
            fixed: 'left',
            width:'70px',
        },
        {
            title: 'Name',
            key: 'name',
            render: d => d.userId?.name,
            fixed: 'left',
            ...filter('name'),
            width:'200px',
        },
        {
            title: 'Mode',
            key: 'offline',
            render: d => { const isOnline = d.offline === 0; console.log("iss", d, isOnline); return <>{ isOnline ? 'online' : 'offline' }</>}
        },
        ..._.map(_.orderBy(data.sections, ['order', ['asc']]), (s, index) =>  {
            return({
                title: s?.subjectRefId?.name?.en,
                children: [
                    {
                        title: 'Pos.',
                        key: 'pos',
                        render: d => {
                            let sectionData = _.find(d.studentResult.sectionwiseStats, sec => sec.sectionId === s._id)
                            return(
                                !sectionData ? <div></div> : 
                                <div className='text-center' style={{color: 'green'}}>
                                    <div>M:{sectionData.correctMarks ? _.round(sectionData.correctMarks, 2) : 0}</div>
                                    <div>Q:{sectionData.correctNo ? _.round(sectionData.correctNo, 2) : 0}</div>
                                </div>
                            )
                        }
                    },
                    {
                        title: 'Neg.',
                        key: 'pos',
                        render: d => {
                            let sectionData = _.find(d.studentResult.sectionwiseStats, sec => sec.sectionId === s._id)
                            return(
                                !sectionData ? <div></div> : 
                                <div className='text-center' style={{color: 'green'}}>
                                    <div>M:{sectionData.incorrectMarks ? _.round(sectionData.incorrectMarks, 2) : 0}</div>
                                    <div>Q:{sectionData.incorrectNo ? _.round(sectionData.incorrectNo, 2) : 0}</div>
                                </div>
                            )
                        }
                    },
                    {
                        title: 'Total',
                        key: 'total',
                        render: d => {
                            let sectionData = _.find(d.studentResult.sectionwiseStats, sec => sec.sectionId == s._id)
                            return(
                                !sectionData ? <div></div> : <div className='text-center'>{sectionData.sectionScore ? _.round(sectionData.sectionScore, 2) : 0}</div>
                            )
                        }
                    }
                ]
            })
        }),
        {
            title: 'Total', 
            key: 'all-total',
            render: d => d.studentResult?.totalScore ? _.round(d.studentResult?.totalScore, 2 ) : 0
        },
        {
            title:'Rank',
            render: a =>  a.studentResult?.skippedRank ,
            key: 'rank',
            // sorter: (a, b) => data.testOption?.rankSetting ? a.result?.continuousRank - b?.result?.continuousRank : a.studentResult?.skippedRank - b?.studentResult?.skippedRank,
            sorter: (a, b) => (a.studentResult?.skippedRank || studentAttempts?.length) - (b?.studentResult?.skippedRank || studentAttempts?.length),
            defaultSortOrder: 'ascend',
        },
        {
            title: <div>Percentile</div>,
            render: a => a.studentResult?.percentile ? _.round(a.studentResult?.percentile, 2) : '-',
            key: 'percentile'
        },
        // {
        //     title:<div>Custom <br/>Rank</div>,
        //     render: a => data?.testOption?.fakeRanks ?  a.studentResult.fakeRank : null,
        //     key: 'fake-rank',
        // },
        // {
        //     title: <div>Custom <br/>Percentile</div>,
        //     render: a => a?.studentResult?.fakePercentile ? _.round(a?.studentResult?.fakePercentile, 2) : '-',
        //     key: 'fake-percentile',
        // },
    ]

    let studentAttempts = _.filter(data.attempts, stud => stud.progressStatus === 'completed')
    return(
        <div>
            {!studentAttempts.length || !data?.resultPublished ?
                <div>
                    <h4 style={{textAlign: 'center'}}>{!data?.resultPublished ? 'Result Not Published' : 'No data Available'}</h4>
                </div> 
            :
                <Table loading={resultCalculateStatus === STATUS.FETCHING} columns={columns} scroll={{ x: 1300 }} sticky dataSource={studentAttempts} bordered 
                    pagination={{pageSize, page, position:['topCenter', 'bottomCenter'], showSizeChanger:false}} onChange={e => changePage(e.current)}
                />   
            }
        </div>
    )
}