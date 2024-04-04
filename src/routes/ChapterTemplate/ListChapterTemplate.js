import { Button, Card, Row, Col, Table, Form, Input, Space,  } from 'antd';
import {useDispatch, useSelector} from 'react-redux' 
import { useState, useEffect, useRef } from 'react';
import { EditOutlined, ProfileOutlined, SearchOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { useHistory, useParams } from "react-router-dom";
import { CommonPageHeader } from '../../components/CommonPageHeader'

import {getDefaultDataAction} from '../../redux/reducers/LmsConfig'
import {getChapterTemplateAction, resetAddChapterStatus} from '../../redux/reducers/Syllabus'
import { STATUS } from "../../Constants";
import {ViewSyallbusChaptersModal} from '../../components/ViewSyallbusChaptersModal'
import { useAuthUser } from "../../App/Context";

export const ListChapterTemplate = () => {
  const auth = useAuthUser()
  const dispatch = useDispatch()  
  const {configData, syllabus} = useSelector(s => ({
      user: s.user,
      configData: s.lmsConfig,
      syllabus: s.syllabus
  }))

  useEffect(() => {
    dispatch(getDefaultDataAction({instituteId: auth.staff.institute._id}))
    dispatch(getChapterTemplateAction({instituteId: auth.staff.institute._id}))
  }, [])

  return(
    <div>
    	<CommonPageHeader
      	title='List Chapter Template'
    	/>
    	<br/>
    	<Card loading={syllabus.getChapterTemplateStatus === STATUS.FETCHING && configData.defaultDataStatus === STATUS.FETCHING}>
        {syllabus.getChapterTemplateStatus == STATUS.SUCCESS && configData.defaultDataStatus == STATUS.SUCCESS ? 
          <Row>
            <Col sm={24}>
              <ChapterTemplateList chapterTemplateData={syllabus.chapterTemplateData} syllabus={configData.defaultData} />
            </Col>
          </Row>
        : null}
      </Card>
    </div>
  )
} 

export const ChapterTemplateList = (props) => {
  const params = useParams()
  let history = useHistory();
  const dispatch = useDispatch()

  // useEffect(() => {
  //   if(!params.pageNumber)
  //       history.push('/list-chapter-template/1')
  // }, [params.pageNumber])

  const editData = (data) => {
    dispatch(resetAddChapterStatus());
    history.push('/update-chapter-template/'+data._id)
  }

  const pageChange = (e) => {
    history.push('/list-chapter-template/'+ e.current)
  }

  const [viewSyallbusChaptersState, setViewSyllabusChaptersState] = useState({viewSyallbusChapters: false, viewChapterId: ''})
  
  let searchInput = useRef();
  const columns = [
    {
      title: 'Template Name',
      key: 'name',
      dataIndex: 'name',
      render: d => d && d.en ? d.en : '',
      
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.select(), 100);
        }
      },

      onFilter: (value, record) =>
        record?.name?.en
          ? record.name.en
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
              placeholder={`Search ${"name"}`}
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
      ),
    },
    {
      title: 'Subject',
      key: 'subject',
      render: d => (
        <div> {_.get(_.find(props.syllabus.subjects, dd => dd._id == d.subjectId), 'name.en', '')} </div>
      )
    },
    /*{
      title: 'Standard',
      key: 'standard',
      render: d => (
        <div> {_.get(_.find(props.syllabus.standards, dd => dd._id == d.standardId), 'name.en', '')} </div>
      )
    },*/
    {
      title: 'Competition',
      key: 'competition',
      render: d => (
        <div> {_.get(_.find(props.syllabus.competitions, dd => dd._id == d.competitionId), 'name.en', '')} </div>
      )
    },
    {
      title: 'Exam',
      key: 'exam',
      render: d => (
        <div>
          {_.get(_.find(props.syllabus.exams, dd => dd._id == d.examId), 'name.en', '')}
        </div>
      )
    },
    {
      title: 'Chapters',
      key: 'chapters',
      render: d => (
        <div>
          <span style={{border: '1px solid #b8b8b8', borderRadius: '5px', padding: '5px', paddingTop: '2px', paddingBottom: '2px', cursor: 'pointer'}} onClick={() => setViewSyllabusChaptersState({viewSyallbusChapters: true, viewChapterId: d._id})}>
            <span style={{fontSize: '14px'}}>{d.chapterCount}</span>&nbsp;&nbsp;
            <ProfileOutlined />&nbsp;
          </span>
        </div>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: d => (
        <div>
          <Button shape='circle' icon={<EditOutlined/>} onClick={() => editData(d)} bsStyle='warning'/>
        </div>
      )
    }
  ];
  return(
    <div>
      <Table bordered dataSource={props.chapterTemplateData} onChange={pageChange} columns={columns} 
        pagination={{current:parseInt(params.pageNumber) || 1}}
      />
      {viewSyallbusChaptersState.viewSyallbusChapters ? 
        <ViewSyallbusChaptersModal viewSyallbusChapters={viewSyallbusChaptersState.viewSyallbusChapters} id={viewSyallbusChaptersState.viewChapterId} closeModal={() => setViewSyllabusChaptersState({viewSyallbusChapters: false, viewChapterId: ''})}/>
      : null}
    </div>
  )
}

