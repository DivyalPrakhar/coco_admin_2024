import { CheckCircleOutlined, SearchOutlined, StopOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Col, Drawer, Form, Input, Row, Space, Switch, Table, Tag, Tooltip } from 'antd'
import { map } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AiTwotoneStar } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { CommonPageHeader } from '../../components/CommonPageHeader'
import { STATUS } from '../../Constants'
import { getSingleInstituteAction } from '../../redux/reducers/instituteStaff'
import { getMoreStaffReviews, getStaffReviews, updateStaffReview } from '../../redux/reducers/LiveClasses'

export default function StaffReviews(props) {
    
    const dispatch = useDispatch()
    const [ currentUserReview, setCurrentUserReview ] = useState(null);
    const {data, user} = useSelector(s => ({
        data: s.instituteStaff,
        user: s.user
    }))
    
  useEffect(() => {
      dispatch(getSingleInstituteAction({id: user.user.staff?.institute._id}))
  },[dispatch, user]);

  const _closeDrawer = useCallback( (id) => {
    setCurrentUserReview(id)
  },[setCurrentUserReview])

    return (
        <>
            <CommonPageHeader title='Staff Reviews'/>
            <StaffList handleSeeReivews={ (id) => setCurrentUserReview(id) } user={user.user} data={{data: data.singleInstitute?.[0], status: data.getStatus}}/>
            <ReviewDrawer staffId={currentUserReview} visible={currentUserReview !== null} _closeDrawer={ () => _closeDrawer(null) } />
        </>
    )
}

const ReviewDrawer = ({ visible, _closeDrawer, staffId }) => {
    const [ page, setPage ] = useState(1);
    const dispatch = useDispatch();
    const { getStaffReviewsStatus, staffReviews, allStafffReviews, getMoreStaffReviewsStatus } = useSelector( s => ({
        getStaffReviewsStatus: s.liveClasses.getStaffReviewsStatus,
        staffReviews: s.liveClasses.staffReviews,
        allStafffReviews: s.liveClasses.allStafffReviews,
        getMoreStaffReviewsStatus: s.liveClasses.getMoreStaffReviewsStatus
    }) )

    useEffect( () => {
        if(staffId){
          if(page === 1){
            dispatch(getStaffReviews({ staff: staffId, page: page, limit: 10, isHidden: 'all' }))
          }else{
            dispatch(getMoreStaffReviews({ staff: staffId, page: page, limit: 10, isHidden: 'all' }));
          }
        }
    },[dispatch, page, staffId])

    const handleLoadMore = useCallback( () => {
      setPage( p => p + 1 );
    },[setPage])

    const handleCloseDrawer = useCallback( () => {
      setPage(1);
      _closeDrawer();
    },[_closeDrawer, setPage])
    return (
        
        <Drawer title={'Staff reviews'} visible={visible} width='40%' onClose={handleCloseDrawer}>
            <Card style={{ border: 'none' }} loading={getStaffReviewsStatus === STATUS.FETCHING}>
                <Space size='large' direction="vertical" style={{ display: 'flex' }}>
                    {
                        map(allStafffReviews, review => review?._id && <StaffReview review={review}/> )
                    }
                </Space>
            </Card>
            {
              staffReviews?.page < staffReviews?.pages && 
              <Row justify='center'>
                <Col span={6}><Button loading={ getMoreStaffReviewsStatus === STATUS.FETCHING } onClick={handleLoadMore}>Load more</Button></Col>
              </Row>
            }
        </Drawer>
    )
}

const StaffReview = ({ review }) => {
    const dispatch = useDispatch();
    const onChange = (e) => {
        dispatch(updateStaffReview({ id: review._id, isHidden: review?.isHidden ? false : true }));
    }
    const { updateStaffReviewStatus } = useSelector( s => ({
      updateStaffReviewStatus: s.liveClasses.updateStaffReviewStatus
  }) )
    return (
        <div>
            <Row>
                <Col span={2}>
                    <Avatar src={review.staff.user.avatar} icon={<UserOutlined />} />
                </Col>
                <Col span={20}>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>
                            {review.staff.user.name}
                        </div>
                        <div>
                            { review.review }
                        </div>
                        <Row>
                            {
                                map(new Array(review.rating), (r, i) => {
                                    return (
                                        <Col span={1} key={i}>
                                            <AiTwotoneStar style={{ color: '#ffb709' }} />
                                        </Col>
                                    )  
                                })
                            }
                        </Row>
                    </div>
                </Col>
                <Col span={2}>
                    <Tooltip title='Show review'>
                      <Switch size="small" checked={ review.isHidden ? false: true } onChange={onChange} />
                    </Tooltip>
                </Col>
            </Row>
        </div>
    )
}

const StaffList = (props) => {
    const dispatch = useDispatch()
    let searchInput = useRef();

    let filter = (type) => ({
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.select(), 100);
        }
      },
  
      onFilter: (value, record) =>
        record.user?.[type]
          ? record.user[type]
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
              confirm({ closeDropdown: false });
            }}
          >
            <Input
              ref={(node) => {
                searchInput = node;
              }}
              placeholder={`Search ${type}`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
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
                onClick={() => {
                  clearFilters();
                }}
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
      )
    })

    const columns = [
      {
        title: 'Status',
        key: 'status',
        render: d => <div>
          <Tag color={d.user?.isActive ? 'green' : 'red'}>
            {d.user?.isActive ? 'ACTIVE' : 'INACTIVE'}
          </Tag>
        </div>
      },
      {
        title: 'Name',
        key: 'name',
        render: d => d.user.name,
        ...filter('name')
      },
      {
        title: 'Contact',
        key: 'contact',
        render: d => d.user.contact,
        ...filter('contact')
      },
      {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => searchInput.select(), 100);
          }
        },
    
        onFilter: (value, record) =>
          record['code']
            ? record['code']
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
                confirm({ closeDropdown: false });
              }}
            >
              <Input
                ref={(node) => {
                  searchInput = node;
                }}
                placeholder={`Search ${'code'}`}
                value={selectedKeys[0]}
                onChange={(e) =>
                  setSelectedKeys(e.target.value ? [e.target.value] : [])
                }
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
                  onClick={() => {
                    clearFilters();
                  }}
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
        )
      },
      {
        title: 'Subject',
        key: 'staff Desc',
        dataIndex:"staffDesc",
      },
      {
        title: 'Action',
        key: 'action',
        render: d => <div>
              <Space>
                <Button size='sm' onClick={() => props.handleSeeReivews(d._id) }>See Reviews</Button>
              </Space>
              </div>
      },
    ];
    
    return (
        
        <Card
          loading={props.data.status === STATUS.FETCHING}
          bordered={false} 
          style={{ width: '100%' }}
        >
          {props.data.status == STATUS.SUCCESS ?
            <div style={{overflowY: 'auto'}}>
              <Table bordered
              scroll={{
                x:1000
              }}
                pagination={false}
                columns={columns} 
                dataSource={map(props.data.data.staffs, s => {
                  return Object.assign({}, s, {key: s.id})
                })} 
              />
            </div>
          : null}
        </Card>
    )
}