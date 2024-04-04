import { PlusOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Divider, Form, Image, Modal, Popconfirm, Space, Table, Tabs } from 'antd'
import Text from 'antd/lib/typography/Text'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createDndContext, DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { STATUS } from '../../Constants'
import { deleteContentAction, updatePkgDemoAction, updatePkgDemoOrderAction } from '../../redux/reducers/packages'
import { ViewAttachmentModal } from '../ManageCourses.js/CourseContent'
import { AddContentModal } from './AddContentModal'
import update from 'immutability-helper';
import _, { concat } from 'lodash'
import TextArea from 'antd/lib/input/TextArea'

export const AssignDemoContent = ({currentPackage}) => {
    const demoContent = currentPackage.demoContent
    const contentCount = demoContent ? concat(currentPackage.texts, currentPackage.videos, currentPackage.audios, currentPackage.documents).length : 0
    const RNDContext = createDndContext(HTML5Backend);
    const manager = useRef(RNDContext);

    return(
        <Card bodyStyle={{padding:'10px'}} style={{border:'1px solid #AEB6BF'}}>
            <div style={{background:'#E8F6F3', padding:'5px 20px'}}>
                <Text style={{fontWeight:'bold', color:'#3498DB', fontSize:'18px'}}>Demo Content</Text>
            </div>
            <Divider style={{margin:'10px'}}/>
            {demoContent ? 
                <ContentDescription demoContent={demoContent} />
                :
                null
            }
            <DndProvider manager={manager.current.dragDropManager}>
            <Tabs type='card'>
                <Tabs.TabPane key={'audio'} tab={'Audio ('+(demoContent?.audios?.length || 0)+')'}>
                    <ManageAudio currentPackage={currentPackage} content={demoContent?.audios || []}/>
                </Tabs.TabPane>
                <Tabs.TabPane key={'video'} tab={'Video ('+(demoContent?.videos?.length || 0)+')'}>
                    <ManageVideo currentPackage={currentPackage} content={demoContent?.videos || []} />
                </Tabs.TabPane>
                <Tabs.TabPane key={'document'} tab={'Document ('+(demoContent?.documents?.length || 0)+')'}>
                    <ManageDocument currentPackage={currentPackage} content={demoContent?.documents || []} />
                </Tabs.TabPane>
                <Tabs.TabPane key={'text'} tab={'Text ('+(demoContent?.texts?.length || 0)+')'}>
                    <ManageText currentPackage={currentPackage} content={demoContent?.texts || []} />
                </Tabs.TabPane>
            </Tabs>
            </DndProvider>
            <br/>
        </Card>
    )
}

const ContentDescription = ( {demoContent} ) => {
    const dispatch = useDispatch()
    const [description, changeValue] = useState()

    useEffect(() => {
        changeValue(demoContent.description)
    }, [demoContent])

    const handleChange = (e) => {
        changeValue(e.target.value)
    }

    const handleSubmit = () => {
        let data = {description:description, contentId:demoContent._id}
        dispatch(updatePkgDemoAction(data))
    }

    return(
        <div>
            <Form onFinish={handleSubmit} layout="vertical" >
                <Form.Item label='Description'>
                    <TextArea style={{width:'100%'}} 
                        value={description}
                        rows={6}
                        onChange={handleChange}
                        placeholder='Write content description here'
                    />
                </Form.Item>
                <Form.Item>
                    <Button htmlType='submit'>Add</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

const ManageAudio = ({content, currentPackage}) => {
    const params = useParams()
    const dispatch = useDispatch()

    const [audioModal, openAudioModal] = useState()
    const [showAudioPlayer, changeShowAudioPlayer] = useState()
    const [editModal, showEditModal] = useState() 

    const {addPkgDemoStatus, updateDemoStatus} = useSelector(state => ({
        addPkgDemoStatus:state.packages.addPkgDemoStatus,
        updateDemoStatus:state.packages.updateDemoStatus
    }))

    useEffect(() => {
        if(addPkgDemoStatus === STATUS.SUCCESS || updateDemoStatus === STATUS.SUCCESS){
            showEditModal(false)
            openAudioModal(false)
        }
    }, [addPkgDemoStatus, updateDemoStatus])

    const handleAudioModal = () => {
        openAudioModal(d => !d)
    }

    const handleDelete = (id) => {
        dispatch(deleteContentAction({type:'audio', contentId:currentPackage.demoContent._id, id}))
    }

    const handleShowAudio = (obj) => {
        changeShowAudioPlayer(d => d ? null : obj)
    }

    const handleEdit = (obj) => {
        showEditModal(d => d ? null : obj)
    }

    return(
        <div>
            <Button icon={<PlusOutlined />} onClick={handleAudioModal}>Add Audio</Button>
            <br/><br/>
            <TableCommon contentType='audio' handleShow={handleShowAudio} handleEdit={handleEdit} handleDelete={handleDelete} content={content} />
            <br/>
            {/* {orderChanged && <Button type='primary' onClick={handleSaveOrder}>Save Order</Button>} */}
            {showAudioPlayer ? <ViewAttachmentModal modal={showAudioPlayer} closeModal={handleShowAudio} tabType='audio' data={showAudioPlayer} /> : null}
            {audioModal ? <AddContentModal parentId={params.id} visible={audioModal} closeModal={handleAudioModal} type='audio' /> : null}
            {editModal ? <AddContentModal parentId={params.id} visible={editModal} closeModal={handleEdit} defaultContent={editModal} type='audio' contentId={currentPackage.demoContent._id} /> : null}
        </div>
    )
}

const ManageVideo = ({content, currentPackage}) => {
    const params = useParams()
    const dispatch = useDispatch()

    const [videoModal, openVideoModal] = useState()
    const [editModal, showEditModal] = useState()
    const [showVideoPlayer, changeShowVideoPlayer] = useState()

    const {addPkgDemoStatus, updateDemoStatus} = useSelector(state => ({
        addPkgDemoStatus:state.packages.addPkgDemoStatus,
        updateDemoStatus:state.packages.updateDemoStatus
    }))

    useEffect(() => {
        if(addPkgDemoStatus === STATUS.SUCCESS || updateDemoStatus === STATUS.SUCCESS){
            openVideoModal(false)
            showEditModal()
        }
    }, [addPkgDemoStatus, updateDemoStatus])

    const handleVideoModal = () => {
        openVideoModal(d => !d)
    }

    const handleDelete = (id) => {
        dispatch(deleteContentAction({type:'video', contentId:currentPackage.demoContent._id, id}))
    }

    const handleEdit = (obj) => {
        showEditModal(d => d ? null : obj)
    }

    const handleShowVideo = (obj) => {

        if(obj.data.source === 'jw')
            window.open(`https://cdn.jwplayer.com/players/${obj.data.value}-7RHAqkfq.html`, '_blank')
        else
            changeShowVideoPlayer(obj)
    }

    return(
        <div>
            <Button icon={<PlusOutlined />} onClick={handleVideoModal}>Add Video</Button>
            <br/><br/>
            <TableCommon contentType='video' handleShow={handleShowVideo} handleEdit={handleEdit} handleDelete={handleDelete} content={content} />
            {showVideoPlayer ? <ViewAttachmentModal modal={showVideoPlayer} closeModal={() => changeShowVideoPlayer()} tabType='video' data={showVideoPlayer} /> : null}
            {editModal ? <AddContentModal parentId={params.id} visible={editModal} closeModal={handleEdit} defaultContent={editModal} type='video' contentId={currentPackage.demoContent._id} /> : null}
            {videoModal ? <AddContentModal parentId={params.id} visible={videoModal} closeModal={handleVideoModal} type='video' /> : null}
        </div>
    )
}

const ManageDocument = ({content, currentPackage}) => {
    const dispatch = useDispatch()
    const params = useParams()
    const [documentModal, openDocumentModal] = useState()
    const [editModal, showEditModal] = useState()

    const {addPkgDemoStatus, updateDemoStatus} = useSelector(state => ({
        addPkgDemoStatus:state.packages.addPkgDemoStatus,
        updateDemoStatus:state.packages.updateDemoStatus
    }))

    useEffect(() => {
        if(addPkgDemoStatus === STATUS.SUCCESS || updateDemoStatus === STATUS.SUCCESS){
            showEditModal(false)
            openDocumentModal(false)
        }
    }, [addPkgDemoStatus, updateDemoStatus])

    const handleDocumentModal = () => {
        openDocumentModal(d => !d)
    }

    const handleDelete = (id) => {
        dispatch(deleteContentAction({type:'document', contentId:currentPackage.demoContent._id, id}))
    }

    const handleShowDoc = (obj) => {
        window.open(obj.data.url, '_blank')
    }

    const handleEdit = (obj) => {
        showEditModal(d => d ? null : obj)
    }

    return(
        <div>
            <Button icon={<PlusOutlined />} onClick={handleDocumentModal}>Add Document</Button>
            <br/><br/>
            <TableCommon contentType='document' handleShow={handleShowDoc} handleEdit={handleEdit} handleDelete={handleDelete} content={content} />
            {editModal ? <AddContentModal parentId={params.id} visible={editModal} closeModal={handleEdit} defaultContent={editModal} type='document' contentId={currentPackage.demoContent._id} /> : null}
            {documentModal ? <AddContentModal parentId={params.id} visible={documentModal} closeModal={handleDocumentModal} type='document' /> : null}
        </div>
    )
}

const ManageText = ({content, currentPackage}) => {
    const params = useParams()
    const dispatch = useDispatch()

    const [textModal, openTextModal] = useState()
    const [showText, changeShowText] = useState()
    const [editModal, showEditModal] = useState()

    const {addPkgDemoStatus, updateDemoStatus} = useSelector(state => ({
        addPkgDemoStatus:state.packages.addPkgDemoStatus,
        updateDemoStatus:state.packages.updateDemoStatus
    }))

    useEffect(() => {
        if(addPkgDemoStatus === STATUS.SUCCESS || updateDemoStatus === STATUS.SUCCESS ){
            showEditModal()
            openTextModal()
        }
    }, [addPkgDemoStatus, updateDemoStatus])

    const handleTextModal = () => {
        openTextModal(d => !d)
    }

    const handleShow = (obj) => {
        changeShowText(d => d ? null : obj)
    }

    const handleDelete = (id) => {
        dispatch(deleteContentAction({type:'text', contentId:currentPackage.demoContent._id, id}))
    }

    const handleEdit = (obj) => {
        showEditModal(d => d ? null : obj)
    }

    return(
        <div>
            <Button icon={<PlusOutlined />} onClick={handleTextModal}>Add Text</Button>
            <br/><br/>
            <TableCommon contentType='text' handleShow={handleShow} handleEdit={handleEdit} handleDelete={handleDelete} content={content} />
            {showText ? <TextModal visible={showText} content={showText} closeModal={handleShow} /> : null}
            {textModal ? <AddContentModal parentId={params.id} visible={textModal} closeModal={handleTextModal} type='text' /> : null}
            {editModal ? <AddContentModal parentId={params.id} visible={editModal} closeModal={handleEdit} defaultContent={editModal} type='text' contentId={currentPackage.demoContent._id} /> : null}
        </div>
    )
}

const TableCommon = ({handleShow, handleEdit, handleDelete, content, contentType}) => {
    const currentPackage = useSelector(state => state.packages.currentPackage)
    const dispatch = useDispatch()

    const [orderChanged, setOrderchanged] = useState()
    const [dataList, setDataList] = useState([]) 


    useEffect(() => {
        if(content){
            setDataList(_.orderBy(content, ['order'], ['asc']))
            setOrderchanged(false)
        }
    }, [content])

    // useEffect(() => {
    //     if(updatePkgDemoOrderStatus === STATUS.SUCCESS)
    //         setOrderchanged(false)
    // }, [updatePkgDemoOrderStatus])
    const RNDContext = createDndContext(HTML5Backend);

    const type = 'DragableBodyRow';

    const DragableBodyRow = ({ index, moveRow, className, style, ...restProps }) => {
      const ref = useRef();
      const [{ isOver, dropClassName }, drop] = useDrop({
        accept: type,
        collect: monitor => {
          const { index: dragIndex } = monitor.getItem() || {};
          if (dragIndex === index) {
            return {};
          }
          return {
            isOver: monitor.isOver(),
            dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
          };
        },
        drop: item => {
          moveRow(item.index, index);
        },
      });
      const [, drag] = useDrag({
        item: { type, index },
        collect: monitor => ({
          isDragging: monitor.isDragging(),
        }),
      });
      drop(drag(ref));
      return (
        <tr
          ref={ref}
          className={`${className}${isOver ? dropClassName : ''}`}
          style={{ cursor: 'move', ...style }}
          {...restProps}
        />
      );
    };

    const moveRow = useCallback(
        (dragIndex, hoverIndex) => {
          const dragRow = dataList[dragIndex];
          setDataList(
            update(dataList, {
              $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragRow],
              ],
            }),
          );
          setOrderchanged(true)
        },
        [dataList],
    );

    const components = {
        body: {
          row: DragableBodyRow,
        },
    };

    const handleSaveOrder = () => {
        const data = {
            contentId: currentPackage.demoContent._id,
            type:contentType,
            orders:_.map(dataList, (d, i)=> {
                return({
                    id: d._id,
                    order: parseInt(i) + 1
                })
            })
        }

        dispatch(updatePkgDemoOrderAction(data))
    }

    return(
        <>
            <Alert showIcon type='warning' style={{fontSize:'12px'}} message='drag and drop columns to change content order'/><br/>

            <Table size='small' dataSource={dataList.map((c, i) => ({...c, srno:++i}))} pagination={false}
                onRow={(record, index) => ({index, moveRow})}
                components={components}
            >
                <Table.Column title='Sr No.' dataIndex={'srno'}></Table.Column>
                {(contentType === 'text' || contentType === 'document') && 
                    <Table.Column title='Thumbnail' dataIndex={'thumbnail'}
                        render={d => 
                            <Image width={70} src={d} />
                        }
                    ></Table.Column>
                }
                <Table.Column title='Name' dataIndex={'name'}></Table.Column>
                <Table.Column title='Actions' render={d => 
                    {
                        return(
                            <Space>
                                <Button size='small' onClick={() => handleShow(d)}>View</Button>
                                <Button size='small' onClick={() => handleEdit(d)}>Edit</Button>
                                <Popconfirm placement="topLeft" title={'Are you sure?'} 
                                    onConfirm={() => handleDelete(d._id)} okText="Yes" cancelText="No"
                                >
                                    <Button size='small' danger>Delete</Button>
                                </Popconfirm>
                            </Space>
                        )
                    }
                }>
                </Table.Column>
            </Table>
            <br/>
            {orderChanged && <Button type='primary' onClick={handleSaveOrder}>Save Order</Button>}
        </>
    )
}

const TextModal = ({visible, closeModal, content}) => {
    return(
        <Modal width={'60%'} title={content.name} footer={false} visible={visible} onCancel={closeModal}>
            <div dangerouslySetInnerHTML={{__html:content.data.value}} />
        </Modal>
    )
}