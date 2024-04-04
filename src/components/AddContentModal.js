import { Button, DatePicker, Drawer, Form, Input, Space, Modal, Row, Col, Radio, Tabs, Checkbox, Upload, Tooltip, Select, Card } from 'antd';
import { useCallback, useEffect, useReducer, useState } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux';
import { STATUS } from '../Constants';
import { addConfigAction, updateConfigAction } from '../redux/reducers/LmsConfig';
import { addCourseContentAction, resetCourseState, updateCourseContentAction } from  '../redux/reducers/courses'
import { FormReducer } from '../utils/FormReducer';
import moment from 'moment'
import _, { map } from 'lodash'
import {CkeditorComponent as CkEditor} from './CkeditorComponent'
import { BaseURL } from '../BaseUrl';
import { DeleteOutlined, FileOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons';
import { UploadImageBox } from './UploadImageBox';
import { getSingleInstituteAction } from '../redux/reducers/instituteStaff';
import { getLiveBatchAction } from '../redux/reducers/batches';

export const youtubeRegex = /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/;
export const vimeoRegex = /(http|https)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)(?:|\/\?)/;

export const AddContentModal = (props) => {
    const {course} = useSelector((state) => ({
        course:state.course
    }))

    const dispatch = useDispatch()
    const {TabPane} = Tabs;
    const [state, changeState] = useState({label: ''})
    const [contentState, changeContentState] = useState({textContent: ''})
    const [videoData, videoDataChange] = useState({type: 'vimeo', url: '', videoID: '', docs:[]})
    const [videoContent, changeVideoContent] = useState()
    
    // function addDescription(data, stateData) {
    //     //let dataObj = {...stateData, textContent: data}
    //     //changeState({...state, textContent: data.data})
    // }
    const { user, batches, instituteStaff } = useSelector(s => ({
        user: s.user,
        batches: s.batches,
        instituteStaff: s.instituteStaff
    }))

    const selectFile = (files) => {
        if (!files)
            changeState({...state, file: '' })
        else {
            changeState({...state, file: files})
        }
    }

    useEffect(() => {
        if(course.addCourseContentStatus == STATUS.SUCCESS){
            dispatch(resetCourseState())
            props.closeModal()
        }
    }, [course.addCourseContentStatus, dispatch, props])

    useEffect(() => {
        if(props.editData){
            changeState({label: props.editData.name, thumbnail:props.editData.thumbnail}) 
            changeContentState({textContent: props.type === 'text' ? props.editData?.data?.value : ''})
            if(props.type === 'video'){
                videoDataChange({type: props.editData.data.source, url: props.editData.data.url, videoID: props.editData.data.value})
            }
        }
        if(props.type === 'video'){
            if(instituteStaff.getStatus === STATUS.NOT_STARTED)
                dispatch(getSingleInstituteAction({id: user.user.staff?.institute?._id}));
            if(batches.getLiveBatchStatus === STATUS.NOT_STARTED)
                dispatch(getLiveBatchAction({}))
        }
    }, [props.editData, props.type, user, instituteStaff.getStatus, batches.getLiveBatchStatus, dispatch])

    const addContent = () => {
        if(props.editData){
            let data = {
                contentId: props.subject.content,
                label: state.label,
                id: props.editData._id,
                chapterId: props.chapterId,
                thumbnail : state.thumbnail,
                source: props.type === 'video' ? videoData.type : null,
                type: props.type,
                value: props.type === 'video' ? videoData.videoID : props.type === 'text' ? contentState.textContent : null,
                url: props.type === 'video' ? videoData.url : null,
                documentId: props.editData.data._id, docs:_.filter(videoData.docs,d => d.name && d.url),
                public: props.editData?.public,
                liveClassData: videoData.liveClassData
            }
            dispatch(updateCourseContentAction(data))
        }else{
            let data = {
                contentId: props.subject.content,
                label: state.label,
                thumbnail : state.thumbnail || null,
                chapterId: props.chapterId,
                source: props.type === 'video' ? videoData.type : null,
                upload: state.file ? state.file : '',
                type: props.type,
                value: props.type === 'video' ? videoData.videoID : props.type === 'text' ? contentState.textContent : null,
                url: props.type === 'video' ? videoData.url : null
            }
            let formData = new FormData()

            Object.entries(data).forEach(([key, value]) => {
                formData.append(key,value)
            })

            if(videoData.liveClassData){
                Object.entries(videoData.liveClassData).forEach(([key, value]) => {
                    formData.append(`liveClassData[${key}]`,value)
                })
            }

            videoData.docs?.length &&  _.forEach(videoData.docs, (d, i) => {formData.append('docs['+i+'][name]',d.name)})
            videoData.docs?.length && _.forEach(videoData.docs, (d, i) => {formData.append('docs['+i+'][url]',d.url)})
            
            dispatch(addCourseContentAction(formData))
        }
    }

    const changeVideoData = (data) => {
        changeVideoContent(data)
    }

    const addVideo = () => {
        
        let formData = new FormData()
        let data = {contentId: props.subject.content, documentId: props.editData?.data?._id, chapterId: props.chapterId, type:props.type, ..._.omit(videoContent, ['docs', 'liveClassData'])}

        Object.entries(data).forEach(([key, value]) => {formData.append(key,value)})

        if(videoContent.docs?.length){
            _.forEach(videoContent.docs, (d, i) => {formData.append('docs['+i+'][name]',d.name)})
            _.forEach(videoContent.docs, (d, i) => {formData.append('docs['+i+'][url]',d.url)})
        }

        if(props.editData){
            data = {...data, id:props.editData._id, docs:videoContent.docs?.length ? videoContent.docs : [], liveClassData: videoContent.liveClassData }
            dispatch(updateCourseContentAction(data))
        }
        else {
            if(videoContent.liveClassData){
                Object.entries(videoContent.liveClassData).forEach(([key, value]) => {
                    formData.append(`liveClassData[${key}]`,value)
                })
            }
            dispatch(addCourseContentAction(formData))
        }
    }

    const handleImage = (image) => {
        changeState(d => ({...d, thumbnail:image.file?.response?.url}))
    }
    
    const handleRemoveImage = () => {
        changeState(d => ({...d, thumbnail:null}))
    }

    let type = props.type;
    
    return (
        <Modal visible={props.showModal} footer={null} width='1000px' onCancel={() => props.closeModal()}>
        <div>
            {type == 'video' ?
                <Card loading = { batches.getLiveBatchStatus === STATUS.FETCHING }
                >
                    <Tabs activeKey={videoData.type} onChange={(k) => videoDataChange({type: k, url: '', videoID: ''})}>
                        
                        {!props.editData || (props.editData && videoData.type == 'vimeo') || (props.editData && videoData.type == 'jw') ?
                            <TabPane tab="Vimeo Video" key="vimeo">
                                {videoData.type == 'vimeo' || videoData.type == 'jw' ? <InputVimeoLink label={state.label} editData={props.editData} preSelectedData={videoData} changeInVideoURL={(url, videoID, docs, liveClassData = {} ) => videoDataChange({...videoData, liveClassData, url, videoID, docs})} changeState={(data) => changeState({...state, label: data})}/> : null}
                                <Row>
                                    <Col sm={24} style={{textAlign: 'center'}}>
                                        <Button onClick={addContent} loading={course.addCourseContentStatus == STATUS.FETCHING} bsStyle='success'>{course.addCourseContentStatus == STATUS.FETCHING ? 'Adding...' : 'Add'}</Button>
                                    </Col>
                                </Row>
                            </TabPane>
                        : null}
                        {!props.editData || (props.editData && videoData.type === 'jw') || (props.editData && videoData.type === 'vimeo') ?
                        
                            <TabPane tab='JW Video' key='jw'>
                                <InputJWLink defaultData={props.editData} changeVideoData={changeVideoData}/>
                                
                                <Row>
                                    <Col sm={24} style={{textAlign: 'center'}}>
                                        <Button onClick={addVideo} loading={course.addCourseContentStatus == STATUS.FETCHING} bsStyle='success'>{course.addCourseContentStatus == STATUS.FETCHING ? 'Adding...' : 'Add'}</Button>
                                    </Col>
                                </Row>
                            </TabPane>
                            :
                            null
                        }
                        {!props.editData || (props.editData && videoData.type == 'youtube') ? 
                            <TabPane tab="Youtube Video" key="youtube"> 
                                {videoData.type == 'youtube' ? <InputYoutubeLink label={state.label} editData={props.editData} preSelectedData={videoData} changeInVideoURL={(url, videoID, docs, liveClassData = {} ) => videoDataChange({...videoData, liveClassData, url, videoID, docs})} changeState={(data) => changeState({...state, label: data})}/> : null}
                                <Row>
                                    <Col sm={24} style={{textAlign: 'center'}}>
                                        <Button onClick={addContent} loading={course.addCourseContentStatus == STATUS.FETCHING} bsStyle='success'>{course.addCourseContentStatus == STATUS.FETCHING ? 'Adding...' : 'Add'}</Button>
                                    </Col>
                                </Row>
                            </TabPane>
                        :null}
                    </Tabs>
                </Card>
                :
                <Form 
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    layout="horizontal"
                    onFinish={addContent}
                >
                    <Form.Item name='type' label='Type'>
                        <div>{_.toUpper(props.type)}</div>
                    </Form.Item>
                    <Form.Item name='label' label='Title'>
                        <Col sm={24}>
                            <Input required type="text" value={state.label} onChange={e => changeState({...state, label: e.target.value })} name='label' placeholder="Label" />
                        </Col>
                    </Form.Item>
                    {type === 'ebook' &&
                        <Form.Item label='Thumbnail' key={state.thumbnail}>
                            <UploadImageBox disableAlert onRemove={handleRemoveImage} getImage={handleImage} defaultImg={state.thumbnail}/>
                        </Form.Item>
                    }
                    {type === 'text' ?
                        <Form.Item name='textContent' label='Text Content'>
                            <Col sm={24}>
                                {/*<CkEditor id='textContent' defaultValue={props?.editData?.data?.value || ''} onChange={(data) => addDescription(data, 'english')} />*/}
                                <CkEditor id='textContent_id' language={'pramukhime:english'} name={'textContent'} defaultData={contentState.textContent} onChangeData={(data) => changeContentState({textContent: data.data})}/>
                            </Col>
                        </Form.Item>
                    : null}
                    {!props.editData && type === 'audio' ?
                        <InputFile selectFile={e => selectFile(e)} accept='audio/*,.aac' />
                    :type === 'image' ?
                        <InputFile selectFile={e => selectFile(e)} accept='image/*' />
                        :!props.editData && type === 'document' ?
                        <InputFile selectFile={e => selectFile(e)} accept={'.doc, .docx, .pdf'} invalidFile={state.invalidFile} />
                        :!props.editData && type === 'ebook' ?
                        <InputFile selectFile={e => selectFile(e)} accept={'.epub'} invalidFile={state.invalidFile} />
                    :type === 'link' ?
                        <Form.Item name='link' label='Link'>
                            <Input type='url' name='value' required />
                        </Form.Item>
                    :null}
                    <Form.Item wrapperCol={{ offset: 4, span:20 }}>
                        <Button htmlType='submit' loading={course.addCourseContentStatus === STATUS.FETCHING} bsStyle='success'>
                            {course.addCourseContentStatus === STATUS.FETCHING ? 'Adding...' : 'Add'}
                        </Button>
                    </Form.Item>
                </Form>
            }
        </div>
        </Modal>
    )
}

const SelectBatchAndTeacher = ({ changeBatchOrTeacher, defaultData = {} }) => {
    const { instituteStaff, batches } = useSelector(s => ({
        instituteStaff: s.instituteStaff,
        batches: s.batches,
    }))

    const handleBatchChange = useCallback( (batchId) => {
        changeBatchOrTeacher('batch', batchId)
    },[changeBatchOrTeacher])

    const handleStaffChange = useCallback( (staffId) => {
        changeBatchOrTeacher('staff', staffId)
    },[changeBatchOrTeacher])

    return (
        <>
             <Row>
                <Col sm={4} style={{textAlign: 'right', margin: '10px'}}>
                    Batch : 
                </Col>
                <Col sm={18}>
                    <Select defaultValue={defaultData.batch} onChange={handleBatchChange} style={{ width: '100%' }}>
                        {
                            map(batches.liveBatches, b => <option key={b._id}>{b.name}</option>) 
                        }
                    </Select>
                </Col>
            </Row>
            <Row>
                <Col sm={4} style={{textAlign: 'right', margin: '10px'}}>
                    Staff : 
                </Col>
                <Col sm={18}>
                    <Select defaultValue={defaultData.staff} onChange={handleStaffChange} style={{ width: '100%' }}>
                        {
                            map(instituteStaff?.singleInstitute?.[0]?.staffs, s => <option key={s._id}>{s.user.name}</option>) 
                        }
                    </Select>
                </Col>
            </Row>
        </>
    )
}

const InputFile = (props) => {
    return (
        <Form.Item name='file' label='File'>
            <Input required type='file' onChange={e => props.selectFile(e.target.files[0])} accept={props.accept} name='file' />
            {props.invalidFile ?
                <div className='fg-red'> Please use Video Type attachment for video files.</div>
            :
                null
            }
        </Form.Item>
    )
}

const InputJWLink = (props) => {
    let [uploadingDoc, changeUploadingDoc] = useState()
    let [documents, changeDocuments] = useState([])
    let [videoId, changeVideoId] = useState()
    let [title, changeTitle] = useState()
    let [liveClassData, setLiveClassData] = useState({})

    useEffect(() => {
        if(props.defaultData){
            let data = props.defaultData
            changeTitle(data.name)
            changeDocuments(data.docs)
            changeVideoId(data.data.value)
            setLiveClassData(data?.liveClassData || {});
        }
    }, [props.defaultData])

    useEffect(() => {
        props.changeVideoData({label:title, value:videoId, docs:documents, source:'jw', liveClassData })
    }, [title, videoId, documents, liveClassData])

    const uploadDocument = (files) => {
        changeUploadingDoc(files.file.status)
        if(files.file.status === 'done'){
            let response = files.file.response
            changeDocuments(_.concat(documents, [{name:response.fileName, url:response.url}]))
        }
    }

    const changeDocName = (name, url) => {
        let data = documents
        changeDocuments(_.map(data, d => d.url === url ? {...d, name} : d))
    }

    const removeDoc = (url) => {
        let data = [...documents]
        _.remove(data,d => d.url === url)
        changeDocuments(data)
    }

    
    const changeBatchOrTeacher = useCallback((type, value) => {
        setLiveClassData(p => ({ ...p, [type]: value, ...( !props.defaultData ? { addedDate: moment().format("YYYY-MM-DD") } : {}) }))
    },[setLiveClassData, props.defaultData])

    return(
        <div>
            <Form labelCol={{ span: 4 }} wrapperCol={{span:18}}>
                <Form.Item label='Title'>
                    <Input placeholder='Title' value={title} onChange={e => changeTitle(e.target.value)}/>
                </Form.Item>
                <Form.Item label='VideoID'>
                    <Input placeholder='VideoId' value={videoId} onChange={e => changeVideoId(e.target.value)} />
                </Form.Item>
                
                <SelectBatchAndTeacher defaultData={props.defaultData?.liveClassData} changeBatchOrTeacher={changeBatchOrTeacher}/>
            
                <Form.Item label='Document'>
                    <Upload
                        action={BaseURL + "app/file"}
                        listType="picture"
                        showUploadList={false}
                        onChange={uploadDocument}
                    >
                        <Button loading={uploadingDoc === 'uploading'} icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                    <br/><br/>
                    <Space direction='vertical' style={{width:'100%'}}>
                        {documents?.length ? 
                            documents.map((doc, i) => 
                                <div style={{display:'flex', alignItems:'center', background:'#F4F6F7', border:'1px solid #D6DBDF', padding:6, justifyContent:'space-between', cursor:'pointer'}}  key={i}>
                                    <div style={{display:'flex', alignItems:'center'}}>
                                        <Input placeholder='document name' defaultValue={doc.name} prefix={<FileOutlined />} width='100%' onChange={(e) => changeDocName(e.target.value, doc.url)} style={{marginLeft:4}}/>
                                    </div>
                                    <Space>
                                        <Tooltip title='View'>
                                            <EyeOutlined style={{fontSize:'16px', cursor:'pointer'}} 
                                                onClick={() => window.open(doc.url)}
                                            />
                                        </Tooltip>
                                        <Tooltip title='Remove'>
                                            <DeleteOutlined style={{color:'#E74C3C', fontSize:'16px', cursor:'pointer'}} 
                                                onClick={() => removeDoc(doc.url)}
                                            />
                                        </Tooltip>
                                    </Space>
                                </div>
                            )
                            : null
                        }
                    </Space>
                </Form.Item>
            </Form>
        </div>
    )
}

//Add Youtube Video Attachment
const InputYoutubeLink = (props) => {
    const [form] = Form.useForm();
    const [state, setState] = useState({ match: '', videoURL: props.preSelectedData.url, videoID: props.preSelectedData.videoID, label: props.label, liveClassData: {} })
    let [uploadingDoc, changeUploadingDoc] = useState()
    let [documents, changeDocuments] = useState([])

    useEffect(() => {
        if(props.attachment) {
            validateURL('https://www.youtube.com/watch?v=' + props.attachment.value)
        }
    }, [props.attachment])

    useEffect(() => {
        changeDocuments(props.editData?.docs ? [...props.editData.docs] : [])
    }, [props.editData])

    const validateURL = (videoURL) => {
        let videoID = videoURL.match(youtubeRegex)
        if (!videoID){
            return setState({...state, match: 'error', videoID: '', videoURL, liveClassData: state.liveClassData })
        }else{
            form.setFieldsValue({
                videoID: videoID[1]
            });
            return setState({...state, videoID: videoID[1].replace("embed/", ""), match: 'success', videoURL, liveClassData: state.liveClassData })
        }
    }

    useEffect(() => {
        setState({...state, match: '', videoURL: props.preSelectedData.url, videoID: props.preSelectedData.videoID, label: props.editData?.name, liveClassData: props.editData?.liveClassData || {}})
    }, [])

    useEffect(() => {
        if(state.videoURL !== ''){
            props.changeInVideoURL(state.videoURL, state.videoID, documents, state.liveClassData)
        }
    }, [state.videoURL, state.liveClassData, documents])

    const uploadDocument = (files) => {
        changeUploadingDoc(files.file.status)
        if(files.file.status === 'done'){
            let response = files.file.response
            changeDocuments(_.concat(documents, [{name:response.fileName, url:response.url}]))
        }
    }

    const changeDocName = (name, url) => {
        let data = documents
        //_.find(data, {url}).name = name
        changeDocuments(_.map(data, d => d.url === url ? {...d, name} : d))
    }

    const removeDoc = (url) => {
        let data = documents
        _.remove(data,d => d.url == url)
        changeDocName(data)
    }

    const changeBatchOrTeacher = useCallback((type, value) => {
        setState(p => ({ ...p, liveClassData: { ...p.liveClassData, [type]: value, ...( !props.editData?.liveClassData ? { addedDate: moment().format("YYYY-MM-DD") } : {}) } }))
    },[setState, props.editData?.liveClassData])

    return (
        <div>
            <Row>
                <Col sm={4} style={{textAlign: 'right', margin: '10px'}}>
                    Title : 
                </Col>
                <Col sm={18}>
                    <Input required type="text" defaultValue={state.label} value={state.label} onChange={e => (props.changeState(e.target.value), setState({...state, label: e.target.value}))} name='label' placeholder="Label" />
                </Col>
            </Row>
            {props.editData ? null :
                <>
                    <Row>
                        <Col sm={4} style={{textAlign: 'right', margin: '10px'}}>
                            Video URL : 
                        </Col>
                        <Col sm={18}>
                            <Input type='text' name='options[link]' onChange={(e) => validateURL(e.target.value)} value={state.videoURL} required placeholder="Eg. https://www.youtube.com/watch?v=1234567890" />
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={4} style={{textAlign: 'right', margin: '10px'}}>
                            VideoID : 
                        </Col>
                        <Col sm={18}>
                            <Input placeholder='videoId' value={state.videoID} required name='value' readOnly />
                        </Col>
                    </Row>
                </>
            }
                <SelectBatchAndTeacher defaultData={props.editData?.liveClassData} changeBatchOrTeacher={changeBatchOrTeacher}/>
            
                    <Row>
                        <Col sm={4} style={{textAlign: 'right', margin: '10px'}}>
                            Document : 
                        </Col>
                        <Col sm={18}>
                            <Upload
                                action={BaseURL + "app/file"}
                                listType="picture"
                                showUploadList={false}
                                onChange={uploadDocument}
                            >
                                <Button loading={uploadingDoc === 'uploading'} icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                            <br/><br/>
                            <Space direction='vertical' style={{width:'100%'}}>
                                {documents?.length ? 
                                    documents.map((doc, i) => 
                                        <div style={{display:'flex', alignItems:'center', background:'#F4F6F7', border:'1px solid #D6DBDF', padding:6, justifyContent:'space-between', cursor:'pointer'}}  key={i}>
                                            <div style={{display:'flex', alignItems:'center'}}>
                                                <Input placeholder='document name' defaultValue={doc.name} prefix={<FileOutlined />} width='100%' onChange={(e) => changeDocName(e.target.value, doc.url)} style={{marginLeft:4}}/>
                                            </div>
                                            <Space>
                                                <Tooltip title='View'>
                                                    <EyeOutlined style={{fontSize:'16px', cursor:'pointer'}} 
                                                        onClick={() => window.open(doc.url)}
                                                    />
                                                </Tooltip>
                                                <Tooltip title='Remove'>
                                                    <DeleteOutlined style={{color:'#E74C3C', fontSize:'16px', cursor:'pointer'}} 
                                                        onClick={() => removeDoc(doc.url)}
                                                    />
                                                </Tooltip>
                                            </Space>
                                        </div>
                                    )
                                    : null
                                }
                            </Space>
                            <br/><br/>
                        </Col>
                    </Row>
        </div>
    )
}

//Add Vimeo Video Attachment
const InputVimeoLink = (props) => {
    const [form] = Form.useForm();
    const [state, setState] = useState({ match: '', videoURL: '', videoID: '', liveClassData: props.editData?.liveClassData || {} })
    let [uploadingDoc, changeUploadingDoc] = useState()
    let [documents, changeDocuments] = useState([])

    const validateURL = (videoURL) => {
        if (!vimeoRegex.test(videoURL)){
            return setState({ match: 'error', videoID: '', videoURL, liveClassData: state.liveClassData })
        }else{
            form.setFieldsValue({
                videoID: vimeoRegex.exec(videoURL)[4]
            });
            return setState({ videoID: vimeoRegex.exec(videoURL)[4], match: 'success', videoURL, label: props.label, liveClassData: state.liveClassData })
        }
    }

    useEffect(() => {
        setState({...state, match: '', videoURL: props.preSelectedData.url, videoID: props.preSelectedData.videoID, label: props.label })
    }, [props])

    useEffect(() => {
        changeDocuments(props.editData?.docs ? [...props.editData?.docs] : [])
    }, [props.editData])

    useEffect(() => {
        if(state.videoURL != ''){
            props.changeInVideoURL(state.videoURL, state.videoID, documents, {...state.liveClassData})
        }
    }, [state.videoURL, state.liveClassData, documents])
    
    const uploadDocument = (files) => {
        changeUploadingDoc(files.file.status)
        if(files.file.status === 'done'){
            let response = files.file.response
            changeDocuments(_.concat(documents, [{name:response.fileName, url:response.url}]))
        }
    }

    const changeDocName = (name, url) => {
        let data = documents
        //_.find(data, {url}).name = name
        changeDocuments(_.map(data, d => d.url === url ? {...d, name} : d))
    }

    const removeDoc = (url) => {
        let data = documents
        _.remove(data,d => d.url == url)
        changeDocName(data)
    } 

    const changeBatchOrTeacher = useCallback((type, value) => {
        setState(p => ({ ...p, liveClassData: { ...p.liveClassData, [type]: value, ...( !props.editData?.liveClassData ? { addedDate: moment().format("YYYY-MM-DD") } : {} )} }))
    },[setState, props.editData?.liveClassData])

    return (
        <div>
            <Form 
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                layout="horizontal"
                form={form}
            >
                <Row>
                    <Col sm={4} style={{textAlign: 'right', margin: '10px'}}>
                        Title : 
                    </Col>
                    <Col sm={18}>
                        <Input required type="text" defaultValue={state.label} value={state.label} onChange={e => (props.changeState(e.target.value), setState({...state, label: e.target.value}))} name='label' placeholder="Label" />
                    </Col>
                </Row>
                <>
                    <Row>
                        <Col sm={4} style={{textAlign: 'right', margin: '10px'}}>
                            Video URL : 
                        </Col>
                        <Col sm={18}>
                            <Input type='text' name='options[link]' onChange={(e) => validateURL(e.target.value)} value={state.videoURL} required placeholder="Eg. https://vimeo.com/400934703" />
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={4} style={{textAlign: 'right', margin: '10px'}}>
                            VideoID : 
                        </Col>
                        <Col sm={18}>
                            <Input placeholder='Video id' value={state.videoID} required name='value' readOnly />
                        </Col>
                    </Row>
                    
                    <SelectBatchAndTeacher defaultData={props.editData?.liveClassData} changeBatchOrTeacher={changeBatchOrTeacher}/>
                </>
                <Row>
                    <Col sm={4} style={{textAlign: 'right', margin: '10px'}}>
                        Document : 
                    </Col>
                    <Col sm={18}>
                        <Upload
                            action={BaseURL + "app/file"}
                            listType="picture"
                            showUploadList={false}
                            onChange={uploadDocument}
                        >
                            <Button loading={uploadingDoc === 'uploading'} icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                        <br/><br/>
                        <Space direction='vertical' style={{width:'100%'}}>
                            {documents?.length ? 
                                documents.map((doc, i) => 
                                    <div style={{display:'flex', alignItems:'center', background:'#F4F6F7', border:'1px solid #D6DBDF', padding:6, justifyContent:'space-between', cursor:'pointer'}}  key={i}>
                                        <div style={{display:'flex', alignItems:'center'}}>
                                            <Input placeholder='document name' defaultValue={doc.name} prefix={<FileOutlined />} width='100%' onChange={(e) => changeDocName(e.target.value, doc.url)} style={{marginLeft:4}}/>
                                        </div>
                                        <Space>
                                            <Tooltip title='View'>
                                                <EyeOutlined style={{fontSize:'16px', cursor:'pointer'}} 
                                                    onClick={() => window.open(doc.url)}
                                                />
                                            </Tooltip>
                                            <Tooltip title='Remove'>
                                                <DeleteOutlined style={{color:'#E74C3C', fontSize:'16px', cursor:'pointer'}} 
                                                    onClick={() => removeDoc(doc.url)}
                                                />
                                            </Tooltip>
                                        </Space>
                                    </div>
                                )
                                : null
                            }
                        </Space>
                        <br/><br/>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
