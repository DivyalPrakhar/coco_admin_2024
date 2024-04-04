import { Button, Form, Input, Modal, Tabs } from 'antd'
import Text from 'antd/lib/typography/Text'
import { keys, omit } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { vimeoRegex, youtubeRegex } from '../../components/AddContentModal'
import { BlogEditor } from '../../components/TinymceEditor'
import { UploadImageBox } from '../../components/UploadImageBox'
import { STATUS } from '../../Constants'
import { addPkgDemoAction, updatePkgDemoAction } from '../../redux/reducers/packages'

export const AddContentModal = ({visible, closeModal, type, parentId, defaultContent, contentId, onAdd, loading}) => {
    const dispatch = useDispatch()
    const {addPkgDemoStatus, updateDemoStatus} = useSelector(state => ({
        addPkgDemoStatus:state.packages.addPkgDemoStatus,
        updateDemoStatus:state.packages.updateDemoStatus
    }))

    const getFormData =  object => {
        keys(object).reduce((formData, key) => {
            formData.append(key, object[key]);
            return formData;
        }, new FormData())
    }

    const handleSubmit = (data) => {

        if(parentId){
            let finalData = {...data, packageId:parentId}
            const formData = new FormData()

            Object.entries(finalData).forEach(([key, value]) => {
                formData.append(key,value)
            })
            
            dispatch(addPkgDemoAction(formData))
        }else{
            onAdd(data)
        }
    }

    const handleUpdate = (data) => {
        if(contentId){
            let finalData = {...data, contentId, id:defaultContent._id}
            dispatch(updatePkgDemoAction(finalData))
        }
        else{
            onAdd(data)
        }

    }
    
    return(
        <Modal title={defaultContent ? 'Edit' : 'Add'} width={'50%'} visible={visible} footer={null} onCancel={closeModal}>
            <div>
                {type === 'audio' ? 
                    <AudioFile 
                        defaultContent={defaultContent} 
                        addDemoStatus={addPkgDemoStatus} 
                        updateDemoStatus={updateDemoStatus} 
                        submitForm={handleSubmit} 
                        updateForm={handleUpdate} 
                        loading={loading}   
                    />
                    :
                    type === 'video' ? 
                        <VideoFile 
                            defaultContent={defaultContent} 
                            addDemoStatus={addPkgDemoStatus} 
                            updateDemoStatus={updateDemoStatus} 
                            submitForm={handleSubmit}
                            updateForm={handleUpdate}
                            loading={loading}   
                        />
                        :
                        type === 'document' ? 
                            <DocumentFile defaultContent={defaultContent} addDemoStatus={addPkgDemoStatus} 
                                updateDemoStatus={updateDemoStatus} submitForm={handleSubmit}
                                updateForm={handleUpdate}
                            />
                            :
                            type === 'text' ? 
                                <TextFile defaultContent={defaultContent} addDemoStatus={addPkgDemoStatus} 
                                    updateDemoStatus={updateDemoStatus} submitForm={handleSubmit} 
                                    updateForm={handleUpdate}
                                />
                                :
                                null
                }
            </div>
        </Modal>
    )
}

const VideoFile = ({submitForm, addDemoStatus, defaultContent, updateDemoStatus, updateForm, loading}) => {
    const [videoData, changeVideoData] = useState({})
    const [currentTab, changeCurrentTab] = useState('jw')

    useEffect(() => {
        if(defaultContent){
            let data = {label:defaultContent.name}
            changeVideoData(data)
            changeCurrentTab(defaultContent.data.source)
        }
    }, [defaultContent])

    const validateURL = (e) => {
        let videoURL = e.target.value
        let videoId = videoURL.match(youtubeRegex)
        if (!videoId){
            changeVideoData(d => ({...d, match: 'error', videoId: '', videoURL }))
        }else{
            changeVideoData(d => ({...d, videoId: videoId[1].replace("embed/", ""), match: 'success', videoURL }))
        }
    }

    const validateURLVimeo = (e) => {
        let videoURL = e.target.value
        if (!vimeoRegex.test(videoURL)){
            return changeVideoData(d => ({...d, match: 'error', videoId: '', videoURL }))
        }else{
            return changeVideoData(d => ({...d, videoId: vimeoRegex.exec(videoURL)[4], match: 'success', videoURL}))
        }
    }

    const changeLabel = (e) => {
        changeVideoData(d => ({...d, label:e.target.value}))
    }

    const handleTabChange = (e) => {
        changeCurrentTab(e)
        changeVideoData({})
    }

    const handleChangeVideoId = (e) => {
        changeVideoData(d => ({...d, videoId:e.target.value}))
    }

    const handleSubmit = () => {
        if(defaultContent){
            let data = {...videoData, type:'video'}
            updateForm(data)
        }else{
            let data = {value:videoData.videoId, type:'video', source:currentTab, ...omit(videoData, ['match', 'videoId'])}
            submitForm(data)
        }
    }

    return(
      <div>
        <Tabs activeKey={currentTab} onChange={handleTabChange}>
            <Tabs.TabPane key={'jw'} tab='JW' disabled={defaultContent && currentTab !== 'jw'}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={handleSubmit}
                >
                    <Form.Item label='Type'>
                        <Text style={{fontWeight:'bold'}}>JW Video</Text>
                    </Form.Item>
                    <Form.Item required label='Title'>
                        <Input value={videoData.label} onChange={changeLabel} placeholder='Title'/>
                    </Form.Item>
                    {!defaultContent && 
                        <>
                            <Form.Item required label='Video Id'>
                                <Input onChange={handleChangeVideoId} placeholder='Video Id'/>
                            </Form.Item>
                        </>
                    }
                    <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                        {defaultContent ?
                            <Button loading={updateDemoStatus === STATUS.FETCHING || loading} htmlType='submit' type='primary'
                                disabled={!videoData.label}
                            >
                                Update
                            </Button>
                            :
                            <Button loading={addDemoStatus === STATUS.FETCHING || loading} htmlType='submit' type='primary'
                                disabled={!videoData.label || !videoData.videoId}
                            >
                                Add
                            </Button>
                        }
                    </Form.Item>
                </Form>
            </Tabs.TabPane>
            <Tabs.TabPane key={'youtube'} tab='Youtube' disabled={defaultContent && currentTab !== 'youtube'}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={handleSubmit}
                >
                    <Form.Item label='Type'>
                        <Text style={{fontWeight:'bold'}}>Youtube Video</Text>
                    </Form.Item>
                    <Form.Item required label='Title'>
                        <Input value={videoData.label} onChange={changeLabel} placeholder='Title'/>
                    </Form.Item>
                    {!defaultContent && 
                        <>
                            <Form.Item required label='Video URL'>
                                <Input value={videoData.videoURL} onChange={validateURL}  placeholder='Eg. https://www.youtube.com/watch?v=video_id'/>
                            </Form.Item>
                            <Form.Item required label='Video Id'>
                                <Input required value={videoData.videoId} placeholder='Video Id' readOnly/>
                            </Form.Item>
                        </>
                    }
                    <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                        {defaultContent ?
                            <Button loading={updateDemoStatus === STATUS.FETCHING || loading} htmlType='submit' type='primary'
                                disabled={!videoData.label}
                            >
                                Update
                            </Button>
                            :
                            <Button loading={addDemoStatus === STATUS.FETCHING || loading} htmlType='submit' type='primary'
                                disabled={!videoData.label || !videoData.videoId}
                            >
                                Add
                            </Button>
                        }
                    </Form.Item>
                </Form>
            </Tabs.TabPane>
            <Tabs.TabPane key={'vimeo'} tab='Vimeo' disabled={defaultContent && currentTab !== 'vimeo'}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={handleSubmit}
                >
                    <Form.Item label='Type'>
                        <Text style={{fontWeight:'bold'}}>Vimeo Video</Text>
                    </Form.Item>
                    <Form.Item required label='Title'>
                        <Input value={videoData.label} onChange={changeLabel} required placeholder='Title'/>
                    </Form.Item>
                    {!defaultContent && 
                        <>
                            <Form.Item required label='Video URL'>
                                <Input  value={videoData.videoURL} onChange={validateURLVimeo} placeholder='Eg. https://www.vimeo.com/video_id'/>
                            </Form.Item>
                            <Form.Item required label='Video Id'>
                                <Input value={videoData.videoId} placeholder='Video Id' readOnly/>
                            </Form.Item>
                        </>
                    }
                    <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                        {defaultContent ?
                            <Button loading={updateDemoStatus === STATUS.FETCHING || loading} htmlType='submit' type='primary'
                                disabled={!videoData.label}
                            >
                                Update
                            </Button>
                            :
                            <Button loading={addDemoStatus === STATUS.FETCHING || loading} htmlType='submit' type='primary'
                                disabled={!videoData.label || !videoData.videoId}
                            >
                                Add
                            </Button>
                        }
                    </Form.Item>
                </Form>
            </Tabs.TabPane>
        </Tabs>
      </div>  
    )
}

const DocumentFile = ({submitForm, addDemoStatus, updateForm, defaultContent, updateDemoStatus}) => {
    const [docData, changeData] = useState({})

    useEffect(() => {
        if(defaultContent)
            changeData({label:defaultContent.name, thumbnail:defaultContent.thumbnail})
    }, [defaultContent])

    const handleSubmit = () => {
        if(defaultContent){
            let data = {...docData, type:'document'}
            updateForm(data)
        }   
        else{
            let data = {type:'document', ...docData}
            submitForm(data)
        }
    }

    const handleChange = (e) => {
        let data = {}
        if(e.target.id === 'upload')
            data[e.target.id] = e.target.files[0]
        else
            data[e.target.id] = e.target.value

        changeData(d => ({...d, ...data}))
    }

    const handleImage = (e) => {
        changeData(d => ({...d, thumbnail:e.file?.response?.url}))   
    }

    const handleRemove = () => {
        changeData(d => ({...d, thumbnail:''}))   
    }

    return(
      <div>
            <Form
                onFinish={handleSubmit}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
            >
                <Form.Item label='Type'>
                    <Text style={{fontWeight:'bold'}}>Document</Text>
                </Form.Item>
                <Form.Item required label='Title'>
                    <Input id='label' value={docData.label} onChange={handleChange} placeholder='Title'/>
                </Form.Item>
                <Form.Item label='Thumbnail' key={docData.thumbnail}>
                    <UploadImageBox disableAlert onRemove={handleRemove} getImage={handleImage} defaultImg={docData.thumbnail}/>
                </Form.Item>
                {!defaultContent &&
                    <Form.Item required label='File'>
                        <Input id='upload' accept={'.doc, .docx, .pdf'} onChange={handleChange} type={'file'}/>
                    </Form.Item>
                }
                <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                    {defaultContent ?
                        <Button loading={updateDemoStatus === STATUS.FETCHING} htmlType='submit' type='primary'
                            disabled={!docData.label}
                        >
                            Update
                        </Button>
                        :
                        <Button loading={addDemoStatus === STATUS.FETCHING} htmlType='submit' type='primary'
                            disabled={!docData.label || !docData.upload}
                        >
                            Add
                        </Button>
                    }
                </Form.Item>
            </Form>
        </div>  
    )
}

const TextFile = ({submitForm, addDemoStatus, defaultContent, updateDemoStatus, updateForm}) => {
    const [textData, changeData] = useState({})

    useEffect(() => {
        if(defaultContent)
            changeData({label:defaultContent.name, value:defaultContent.data.value, thumbnail:defaultContent.thumbnail})
    }, [defaultContent])

    const handleSubmit = () => {
        if(defaultContent){
            let data = {...textData, type:'text', documentId:defaultContent.data._id}
            updateForm(data)
        }else{
            let data = {type:'text', ...textData}
            submitForm(data)
        }
    }

    const handleChange = (e) => {
        changeData(d => ({...d, label:e.target.value}))
    }

    const handleTextChange = (e) => {
        changeData(d => ({...d, value:e}))
    }

    const handleImage = (e) => {
        changeData(d => ({...d, thumbnail:e.file?.response?.url}))   
    }

    const handleRemove = () => {
        changeData(d => ({...d, thumbnail:''}))   
    }
    
    return(
      <div>
            <Form
                onFinish={handleSubmit}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
            >
                <Form.Item label='Type'>
                    <Text style={{fontWeight:'bold'}}>Text</Text>
                </Form.Item>
                <Form.Item required label='Title'>
                    <Input onChange={handleChange} value={textData.label} placeholder='Title'/>
                </Form.Item>
                <Form.Item label='Thumbnail' key={textData.thumbnail}>
                    <UploadImageBox onRemove={handleRemove} disableAlert getImage={handleImage} defaultImg={textData.thumbnail}/>
                </Form.Item>
                <Form.Item required label='Text'>
                    <BlogEditor
                        value={textData.value}
                        onChange={handleTextChange}
                    />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
                    {defaultContent ?
                        <Button loading={updateDemoStatus === STATUS.FETCHING} htmlType='submit' type='primary'
                            disabled={!textData.label}
                        >
                            Update
                        </Button>
                        :
                        <Button loading={addDemoStatus === STATUS.FETCHING} htmlType='submit' type='primary'
                            disabled={!textData.label || !textData.value}
                        >
                            Add
                        </Button>
                    }
                </Form.Item>
            </Form>
        </div>  
    )
}

const AudioFile = ({submitForm, updateForm, addDemoStatus, defaultContent, updateDemoStatus, loading}) => {
    const [audioData, changeData] = useState({})

    useEffect(() => {
        if(defaultContent)
            changeData({label:defaultContent.name})
    }, [defaultContent])

    const handleSubmit = () => {
        if(defaultContent){
            let data = {...audioData, type:'audio'}
            updateForm(data)
        }   
        else{
            let data = {type:'audio', ...audioData}
            submitForm(data)
        }
    }

    const handleChange = (e) => {
        let data = {}
        if(e.target.id === 'upload')
            data[e.target.id] = e.target.files[0]
        else
            data[e.target.id] = e.target.value

        changeData(d => ({...d, ...data}))
    }   

    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                onFinish={handleSubmit}
            >
                <Form.Item label='Type'>
                    <Text style={{fontWeight:'bold'}}>Audio</Text>
                </Form.Item>
                <Form.Item required label='Title'>
                    <Input id='label' value={audioData.label} onChange={handleChange} placeholder='Title'/>
                </Form.Item>
                {!defaultContent && 
                    <Form.Item required label='File'>
                        <Input id='upload' onChange={handleChange} accept='audio/*,.aac'  type={'file'}/>
                    </Form.Item>
                }
                <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                    {defaultContent ?
                        <Button loading={updateDemoStatus === STATUS.FETCHING || loading} htmlType='submit' type='primary'
                            disabled={!audioData.label}
                        >
                            Update
                        </Button>
                        :
                        <Button loading={addDemoStatus === STATUS.FETCHING || loading} htmlType='submit' type='primary'
                            disabled={!audioData.label || !audioData.upload}
                        >
                            Add
                        </Button>
                    }
                </Form.Item>
            </Form>
        </div>
    )
}