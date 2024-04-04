import { FileTextOutlined, PlusOutlined, SelectOutlined } from "@ant-design/icons";
import { Search2Icon, SearchIcon } from "@chakra-ui/icons";
import { Avatar, Button, Card, Input, List, Popconfirm, Space, Table, Tabs, Tag } from "antd";
import Search from "antd/lib/input/Search";
import Text from "antd/lib/typography/Text";
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonPageHeader } from "../../components/CommonPageHeader";
import { STATUS } from "../../Constants";
import { addExamContentAction, deleteExamContentAction, getExamContentAction, updateExamContentAction } from "../../redux/reducers/exams";
import { bilingualText } from "../../utils/FileHelper";
import { ViewAttachmentModal } from "../ManageCourses.js/CourseContent";
import { AddContentModal } from "../ManagePackages/AddContentModal";
import { SelectProductModal } from "./SelectProductModal";

export const ExamContent = () => {
  const dispatch = useDispatch()

  const { defaultData, examContent, getExamContentStatus } = useSelector((state) => ({
    defaultData: state.lmsConfig.defaultData,
    examContent:state.exams.examContent,
    getExamContentStatus:state.exams.getExamContentStatus
  }));

  const [selectedExam, setExam] = useState();
  const [allExams, setAllExams] = useState([])

  useEffect(() => {
    if(defaultData?.exams?.length)
      setAllExams(defaultData.exams)
  }, [defaultData])

  const handleSelectExam = (d) => {
    setExam(d);
    dispatch(getExamContentAction({examId:d._id}))

  };

  const handleSearch = (e) => {
    let data = []
    const text = e.target.value
    data = _.filter(defaultData.exams,d => _.includes(_.lowerCase(d.name.en), _.lowerCase(text)))
    setAllExams(data)
  }

  return (
    <div>
      <CommonPageHeader title="Exam Content" />
      <br />
      <Card>
        <div style={{ display: "flex" }}>
          <div style={{ width: "25%" }}>
            <div style={{ padding: 2, fontSize: 18, fontWeight: "bold", marginBottom:5 }}>
              Select Exam
            </div>
            <Input prefix={<Search2Icon/>} onChange={handleSearch} placeholder="Search Exam" />
            <br/><br/>
            <List
              size="small"
              dataSource={allExams}
              style={{ cursor: "pointer", overflow: "auto", height: 600 }}
              renderItem={(d) => {
                const selected = selectedExam?._id === d._id;
                return (
                  <List.Item
                    style={{
                      borderRight: selected && "3px solid #3498DB",
                      color: selected && "#3498DB",
                      fontWeight: selected && "bold",
                      marginRight: 2,
                      paddingLeft: 4,
                      background: selected && "#EBF5FB",
                    }}
                    className="single-exam"
                    onClick={() => handleSelectExam(d)}
                  >
                    {bilingualText(d.name)}
                  </List.Item>
                );
              }}
            />
          </div>
          <div style={{ width: "70%", paddingLeft:20}}>
            {selectedExam ? (
                <Card style={{border:0}} bodyStyle={{padding:0}} loading={getExamContentStatus === STATUS.FETCHING}>
                  <Text style={{fontSize:18}}>Free Content</Text>
                  <div style={{paddingTop:20}}>
                    <Tabs defaultActiveKey="1" type="card">
                      <Tabs.TabPane key={1} tab={"Audio "+ (examContent?.audios.length ? `(${examContent.audios.length})` : '')}>
                        <br />
                        <Audios content={examContent?.audios || []} exam={selectedExam} />
                      </Tabs.TabPane>
                      <Tabs.TabPane key={2} tab={"Video "+ (examContent?.videos.length ? `(${examContent.videos.length})` : '')}>
                        <br />
                        <Videos content={examContent?.videos || []} exam={selectedExam} />
                      </Tabs.TabPane>
                      <Tabs.TabPane key={3} tab={"Magazines "+ (examContent?.magazines.length ? `(${examContent.magazines.length})` : '')}>
                        <br/>
                        <Magazines exam={selectedExam} content={examContent?.magazines || []} />
                      </Tabs.TabPane>
                      <Tabs.TabPane key={4} tab={"PDF "+ (examContent?.pdfs.length ? `(${examContent.pdfs.length})` : '')}>
                        <br />
                        <Pdfs content={examContent?.pdfs || []} exam={selectedExam} />
                      </Tabs.TabPane>
                      <Tabs.TabPane key={5} tab={"Previous Year Exams "+ (examContent?.previousyearpapers.length ? `(${examContent.previousyearpapers.length})` : '')}>
                        <br />
                        <PreviousYearPapers content={examContent?.previousyearpapers || []} exam={selectedExam} />
                      </Tabs.TabPane>
                    </Tabs>
                  </div>
                </Card>
              ) 
              :
              <Card style={{border:0}}>
                <Text type='secondary' style={{fontSize:18}}>Select Exam</Text>
              </Card>
            }
          </div>
        </div>
      </Card>
    </div>
  );
};

const Magazines = ({exam, content}) => {
  const dispatch = useDispatch()

  const {examContent, deleteExamContentStatus, updateExamContentStatus} = useSelector(state => ({
    examContent:state.exams.examContent,
    deleteExamContentStatus:state.exams.deleteExamContentStatus,
    updateExamContentStatus:state.exams.updateExamContentStatus
  }))

  const [magazineModal, openModal] = useState()
  const currentId = useRef()

  useEffect(() => {
    if(updateExamContentStatus === STATUS.SUCCESS)
      openModal(false)
  }, [updateExamContentStatus])
  
  const handleOpenMagazineModal = () => {
    openModal(d => !d)
  }

  const handlesubmit = (data) => {
    const finalData = {magazines:data ? data.map(d => d._id) : [], id:exam._id, contentId:examContent._id, type:'magazine'}
    dispatch(updateExamContentAction(finalData));
  }

  const handleDelete = (data) => {
    const finalData = {magazines:content.map(d => d._id).filter(d => d !== data._id), id:exam._id, contentId:examContent._id, type:'magazine'}
    dispatch(updateExamContentAction(finalData))
    currentId.current = data._id
  }

  console.log('content', content)
  return(
    <div>
      <Button
        style={{ marginBottom: 10 }}
        icon={<SelectOutlined />}
        onClick={handleOpenMagazineModal}
      >
        Select Magazines
      </Button>

      <Table dataSource={content || []} pagination={false}>
      <Table.Column title='Cover' dataIndex={'media'}
          render={d => 
          
              <Avatar src={d?.[0]?.url} size={40} />
          }
      />
      <Table.Column title='Name' dataIndex={'name'}  
          render={d => d && bilingualText(d)}
      />
      {/* <Table.Column title='Description' dataIndex={'description'}
          render={d => d.en}
      /> */}
      <Table.Column title='Attachment' dataIndex={'content'} 
          render={d => d?.length ? 
              <Button
                  icon={<FileTextOutlined />}
                  type="link"
                  onClick={() => window.open(d[0].url)}
                  style={{ marginTop: "4px", cursor: "pointer" }}
              >
                  File
              </Button>
              : null
          }
      />
      <Table.Column title='Mode' dataIndex={'mode'}/>
        <Table.Column
          title="Delete"
          width={100}
          render={(d) => (
            <Space>
              <Popconfirm placement="topLeft" title={'Are you sure?'} 
                  onConfirm={() => handleDelete(d)} okText="Yes" cancelText="No"
              >
                <Button 
                  loading={currentId.current === d._id && deleteExamContentStatus === STATUS.FETCHING} 
                  size="small" 
                  danger
                >
                  Delete
                </Button>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>

      {magazineModal && 
        <SelectProductModal 
          loading={updateExamContentStatus === STATUS.FETCHING} 
          onSubmit={handlesubmit} 
          type={'MAGAZINE'} 
          visible={magazineModal} 
          closeModal={handleOpenMagazineModal} 
          defaultData={content}
        />
      }
    </div>
  )
}

const PreviousYearPapers = ({ exam, content }) => {
  const dispatch = useDispatch();

  const {addExamContentStatus} = useSelector(state => ({
    addExamContentStatus:state.exams.addExamContentStatus
  }))

  const [contentModal, openContentModal] = useState();

  useEffect(() => {
    if(addExamContentStatus === STATUS.SUCCESS)
      openContentModal(false)
  }, [addExamContentStatus])

  const handleAddContent = () => {
    openContentModal((d) => !d);
  };

  const handleAdd = (data) => {
    let finalData = { ...data, examId: exam._id, type:'previousyearpaper' };
    let formData = new FormData();

    Object.entries(finalData).forEach(([key, value]) =>
      formData.append(key, value)
    );

    dispatch(addExamContentAction(formData));
  };

  const handleShowDoc = (obj) => {
    console.log('onj', obj)
    window.open(obj.data.url, '_blank')
  }

  return (
    <div>
      <Button
        style={{ marginBottom: 10 }}
        icon={<PlusOutlined />}
        onClick={handleAddContent}
      >
        Add Previous Year Paper
      </Button>
      
      <CommonTable handleShow={handleShowDoc} type='previousyearpaper' content={content} />

      {contentModal && (
        <AddContentModal
          loading={addExamContentStatus === STATUS.FETCHING}
          onAdd={handleAdd}
          visible={contentModal}
          type="document"
          closeModal={handleAddContent}
        />
      )}
    </div>
  );
};

const Pdfs = ({ exam, content }) => {
  const dispatch = useDispatch();

  const {addExamContentStatus} = useSelector(state => ({
    addExamContentStatus:state.exams.addExamContentStatus
  }))

  const [contentModal, openContentModal] = useState();

  useEffect(() => {
    if(addExamContentStatus === STATUS.SUCCESS)
      openContentModal(false)
  }, [addExamContentStatus])

  const handleAddContent = () => {
    openContentModal((d) => !d);
  };

  const handleAdd = (data) => {
    let finalData = { ...data, examId: exam._id, type:'pdf' };
    let formData = new FormData();

    Object.entries(finalData).forEach(([key, value]) =>
      formData.append(key, value)
    );

    dispatch(addExamContentAction(formData));
  };

  const handleShowDoc = (obj) => {
    window.open(obj.data.url, '_blank')
  }

  return (
    <div>
      <Button
        style={{ marginBottom: 10 }}
        icon={<PlusOutlined />}
        onClick={handleAddContent}
      >
        Add PDF
      </Button>
      
      <CommonTable handleShow={handleShowDoc} type='pdf' content={content} />

      {contentModal && (
        <AddContentModal
          loading={addExamContentStatus === STATUS.FETCHING}
          onAdd={handleAdd}
          visible={contentModal}
          type="document"
          closeModal={handleAddContent}
        />
      )}
    </div>
  );
};

const Videos = ({ exam, content }) => {
  const dispatch = useDispatch();

  const {addExamContentStatus} = useSelector(state => ({
    addExamContentStatus:state.exams.addExamContentStatus
  }))

  const [contentModal, openContentModal] = useState();
  const [showVideoPlayer, changeShowVideoPlayer] = useState()

  useEffect(() => {
    if(addExamContentStatus === STATUS.SUCCESS)
      openContentModal(false)
  }, [addExamContentStatus])

  const handleAddContent = () => {
    openContentModal((d) => !d);
  };

  const handleAdd = (data) => {
    let finalData = { ...data, examId: exam._id };
    let formData = new FormData();

    Object.entries(finalData).forEach(([key, value]) =>
      formData.append(key, value)
    );

    dispatch(addExamContentAction(formData));
  };

  const handleShowVideo = (obj) => {
    if(obj.data.source === 'jw')
        window.open(`https://cdn.jwplayer.com/players/${obj.data.value}-7RHAqkfq.html`, '_blank')
    else
        changeShowVideoPlayer(obj)
}

  return (
    <div>
      <Button
        style={{ marginBottom: 10 }}
        icon={<PlusOutlined />}
        onClick={handleAddContent}
      >
        Add Video
      </Button>
      
      <CommonTable handleShow={handleShowVideo} type='video' content={content} />

      {contentModal && (
        <AddContentModal
          loading={addExamContentStatus === STATUS.FETCHING}
          onAdd={handleAdd}
          visible={contentModal}
          type="video"
          closeModal={handleAddContent}
        />
      )}
      {showVideoPlayer ? <ViewAttachmentModal modal={showVideoPlayer} closeModal={() => changeShowVideoPlayer()} tabType='video' data={showVideoPlayer} /> : null}
    </div>
  );
};

const Audios = ({ exam, content }) => {
  const dispatch = useDispatch();

  const {addExamContentStatus, examContent, deleteExamContentStatus, updateExamContentStatus} = useSelector(state => ({
    addExamContentStatus:state.exams.addExamContentStatus,
    examContent:state.exams.examContent,
    deleteExamContentStatus:state.exams.deleteExamContentStatus,
    updateExamContentStatus:state.exams.updateExamContentStatus
  }))

  const [contentModal, openContentModal] = useState();
  const [showAudioPlayer, changeShowAudioPlayer] = useState()

  useEffect(() => {
    if(addExamContentStatus === STATUS.SUCCESS)
      openContentModal(false)
  }, [addExamContentStatus])

  const handleAddContent = () => {
    openContentModal((d) => !d);
  };

  const handleAdd = (data) => {
    let finalData = { ...data, examId: exam._id };
    let formData = new FormData();

    Object.entries(finalData).forEach(([key, value]) =>
      formData.append(key, value)
    );

    dispatch(addExamContentAction(formData));
  };

  const handleShowAudio = (obj) => {
    changeShowAudioPlayer(d => d ? null : obj)
}

  return (
    <div>
      <Button
        style={{ marginBottom: 10 }}
        icon={<PlusOutlined />}
        onClick={handleAddContent}
      >
        Add Audio
      </Button>

      <CommonTable handleShow={handleShowAudio} type='audio' content={content} />
      
      {contentModal && (
        <AddContentModal
          loading={addExamContentStatus === STATUS.FETCHING}
          onAdd={handleAdd}
          visible={contentModal}
          type="audio"
          closeModal={handleAddContent}
        />
      )}
      {showAudioPlayer ? <ViewAttachmentModal modal={showAudioPlayer} closeModal={handleShowAudio} tabType='audio' data={showAudioPlayer} /> : null}
    </div>
  );
};


const CommonTable = ({type, content, handleShow}) => {
  const dispatch = useDispatch()

  const {examContent, deleteExamContentStatus, updateExamContentStatus} = useSelector(state => ({
    examContent:state.exams.examContent,
    deleteExamContentStatus:state.exams.deleteExamContentStatus,
    updateExamContentStatus:state.exams.updateExamContentStatus
  }))

  const [contentUpdateModal, openContentUpdateModal] = useState();
  const currentId = useRef()

  useEffect(() => {
    if(updateExamContentStatus === STATUS.SUCCESS)
      openContentUpdateModal(false)
  }, [updateExamContentStatus])

  const handleUpdate = (data) => {
    const finalData = {...data, id:contentUpdateModal._id, contentId:examContent._id, type}
    dispatch(updateExamContentAction(finalData));
  }

  const handleEdit = (data) => {
    openContentUpdateModal(data);
  }

  const handleDelete = (data) => {
    dispatch(deleteExamContentAction({id:data._id, type:type, contentId:examContent._id}))
    currentId.current = data._id
  }

  return(
    <>
      <Table dataSource={content || []} pagination={false}>
        {type === 'pdf' || type === 'previousyearpaper' ? 
          <Table.Column width={120} title="Thumbnail" 
            render={d => 
              <Avatar src={d.thumbnail} size={60} />
            }
          /> 
          : null 
        }
        <Table.Column title="Name" dataIndex={'name'} />
        <Table.Column
          title="Actions"
          width={100}
          render={(d) => (
            <Space>
              <Button onClick={() => handleShow(d)} size="small">View</Button>
              <Button onClick={() => handleEdit(d)} size="small">Edit</Button>
              <Popconfirm placement="topLeft" title={'Are you sure?'} 
                  onConfirm={() => handleDelete(d)} okText="Yes" cancelText="No"
              >
                <Button 
                  loading={currentId === d._id && deleteExamContentStatus === STATUS.FETCHING} 
                  size="small" 
                  danger
                >
                  Delete
                </Button>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>
      {contentUpdateModal && (
        <AddContentModal
          loading={updateExamContentStatus === STATUS.FETCHING}
          onAdd={handleUpdate}
          visible={contentUpdateModal}
          defaultContent={contentUpdateModal}
          type={type === 'pdf' || type === 'previousyearpaper' ? 'document' : type}
          closeModal={() => handleEdit(false)}
        />
      )}
    </>
  )
}