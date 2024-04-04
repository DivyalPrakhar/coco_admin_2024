import React, { useCallback, useEffect } from 'react'
// import { Box, Text, Flex, Input, InputGroup, InputRightElement, Button, InputLeftElement, Menu,
//     MenuButton,
//     MenuList,Tag,
//     MenuItem,Avatar,Table, Thead, Th, Td, Tbody, Tr } from '@chakra-ui/react'
// import { Search2Icon, ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons'
import { Row, Col, Divider, Input, Button, Table, Dropdown, Spin } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, SearchOutlined } from '@ant-design/icons'
import { Menu, Avatar, Typography, Tooltip, Tag, Drawer, Pagination } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined, LinkOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useState } from 'react';
import {
    getAllTeachers, getDoubtsAction, getSingleDoubtAction, postDoubtCommentAction, updateDoubtDetailAction
} from '../../redux/reducers/doubts'

import { DownOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { STATUS } from '../../Constants';
import TextArea from 'antd/lib/input/TextArea';
const { Paragraph } = Typography;


export default function DoubtsAdminpanel(props) {
    const [curDoubt, setCurDoubt] = useState(false);
    const [curTeacher, setCurTeacher] = useState(null);
    const [globalSearch, setGlobalSearch] = useState('');
    const [allTeacherLists, setAllTeacherLists] = useState([]);
    const [doubtsData, setDoubtsData] = useState(null);
    const [searchInTeacher, setSearchInTeacher] = useState('');
    const [curPage, setCurPage] = useState(1);
    const [ makeGloabalSearch, setMakeGloabalSearch ] = useState(false);
    const [sortByTeacher, setSortByTeacher] = useState(null);
    const dispatch = useDispatch();
    const { doubtReducer, user } = useSelector(state => ({ doubtReducer: state.doubts, user: state.user?.user }));
    const { allTeachers, doubts, getAllTeachersStatus, getDoubtStatus } = doubtReducer;
    const role = user?.staff?.staffRole;
    let searchInTeacherTime = null;

    const getDoubts = (data) => {
        dispatch(getDoubtsAction(data));
    }

    const filterTeachers = useCallback((value) => {
        setAllTeacherLists(_.sortBy(_.filter(allTeachers, t => t.user?.name.toLocaleLowerCase().indexOf(value) > -1), [sortByTeacher]))
    }, [allTeachers,sortByTeacher])

    useEffect(() => {
        filterTeachers(searchInTeacher);
    }, [sortByTeacher])

    useEffect(() => {
        if( role === 'ADMIN' )
            dispatch(getAllTeachers());
        else if (role === 'TEACHER' || role === 'HEAD_TEACHER')
            setCurTeacher(user?._id);
    }, [role])

    useEffect(() => {
        if (getAllTeachersStatus === STATUS.SUCCESS)
            filterTeachers('');
    }, [getAllTeachersStatus])

    useEffect(() => {
        if ( curTeacher || globalSearch !=='' ){
            let data = { page: curPage };
            if(curTeacher)
                data['staff'] = curTeacher;
            if(globalSearch !== '' )
                data['doubt_text_regex'] = globalSearch; 
            getDoubts(data)
        }
    }, [ curTeacher, curPage, makeGloabalSearch ])

    useEffect(() => {
        if (!doubts.docs) return;
        //let newDoubtData = _.filter(doubts.docs, d => !curTeacher || d.staff === curTeacher || role === 'TEACHER');
        let newDoubtData = doubts.docs;
        newDoubtData = _.map(newDoubtData, (d, i) =>
        ({
            index: ((doubts.page - 1) * doubts.limit) + i + 1,
            name: d.userId.name,
            doubt: d.doubt,
            teacher: d.staff,
            created_at: d.createdAt,
            status: d.status === 'Open' ? "Active" : "Closed",
            public: d.public,
            _id: d._id
        }))
        setDoubtsData(newDoubtData)
        setCurPage(doubts.page)
    }, [doubts])

    
    const handleGlobalSearch = () => {
        setMakeGloabalSearch(pre => !pre);
        setCurPage(1);
        if(role === 'ADMIN')
            setCurTeacher(null);
    }

    const setNewSearchInTeacher = (value) => {
        setSearchInTeacher(value);
        if (searchInTeacherTime)
            window.clearTimeout(searchInTeacherTime)
        searchInTeacherTime = window.setTimeout(() => {
            filterTeachers(value);
        }, 200)
    }

    const handleClear = () => {
        setGlobalSearch('');
        handleGlobalSearch();
    }

    const filterMenu = (
        <Menu>
            <Menu.Item>
                Not Replied
            </Menu.Item>
            <Menu.Item >
                Latest
            </Menu.Item>
            <Menu.Item>
                Oldest
            </Menu.Item>
        </Menu>
    );

    return (
        <div style={{ background: "white", borderRadius: '5px', padding: '2rem 0rem', minHeight: '100vh' }}>
            <ViewDoubtDetails role={role} hideViewDoubtDetails={() => setCurDoubt(null)} doubt={curDoubt || {}} />

            <Row style={{ borderRadius: '5px', padding: role === 'ADMIN' ? "0px 12px" : "24px" }}>
                {
                    role === 'ADMIN' &&
                    <Col span={8} style={{ padding: '0px 12px', minW: "330px", position: "sticky", top: "0px", height: 'fit-content' }}>
                        <Row style={{ color: "white", background: '#348A7A', borderRadius: '5px', padding: '.75rem', justifyContent: 'space-between' }}>
                            <div>
                                Total teachers : {allTeacherLists?.length}
                            </div>
                            {/*<div>
                                Manage Teacher
                            </div>*/}
                        </Row>
                        <div style={{ margin: '12px 0px' }}>
                            <div style={{ margin: '0px .5rem' }} >
                                <Input addonBefore={<SearchOutlined />} value={searchInTeacher} onChange={(e) => setNewSearchInTeacher(e.target.value.toLocaleLowerCase())} />
                                <SortByMenu sortBy={setSortByTeacher} />
                            </div>
                            <div style={{ margin: '12px 0px', maxHeight: '80vh', overflowY: 'scroll' }}>
                                {
                                    allTeacherLists.length > 0 ? _.map(allTeacherLists, t => <OneSearchTeacherProfile isSelected={curTeacher === t?.user?._id} onClick={() => { setCurPage(1); setCurTeacher(t?.user?._id); setGlobalSearch(''); }} teacher={t} />)
                                        :
                                        <div style={{ textAlign: 'center' }}>Nothing Found!</div>
                                }
                            </div>
                        </div>
                    </Col>
                }

                <Col span={role === 'ADMIN' ? 16 : 24}>

                    <div style={{ paddingX: '0.5rem' }}>
                        <Row style={{ flexGrow: '1', flexWrap: "wrap", textAlign: 'center', justifyContent: 'space-around', padding: '2rem' }} >
                            <Col span={6} style={{ m: '0.5rem', p: '1rem', paddingX: '2rem', borderRadius: '5px' }} > 
                                <div style={{ color: "#348A7A", fontSize: '2rem' }}>{role === 'ADMIN' ? _.sumBy(allTeachers, 'doubtCount') : doubts.total}</div>
                                <div style={{ fontSize: '15px', fontWeight: 'bold' }} >Total Doubts</div>
                            </Col>
                            {/*<Col span={6} style={{ m: '0.5rem', p: '1rem', paddingX: '2rem', borderRadius: '5px' }} > <div style={{ color: "#348A7A", fontSize: '2rem' }}>25</div><div style={{ fontSize: '15px', fontWeight: 'bold'  }} >Replied</div></Col>
                            <Col span={6} style={{ m: '0.5rem', p: '1rem', paddingX: '2rem', borderRadius: '5px' }} > <div style={{ color: "#348A7A", fontSize: '2rem' }}>100</div><div style={{ fontSize: '15px', fontWeight: 'bold'  }} >Closed</div></Col>
                            */}{
                                role === 'ADMIN' &&
                                <Col span={6} style={{ m: '0.5rem', p: '1rem', paddingX: '2rem', borderRadius: '5px' }} > <div style={{ color: "#348A7A", fontSize: '2rem' }}>{allTeachers?.length}</div><div style={{ fontSize: '15px', fontWeight: 'bold' }} >Teachers</div></Col>

                            }
                        </Row>
                    </div>
                    {
                    <Row style={{ justifyContent: 'center', margin: '12px 0px', alignItems: 'center' }}>
                        <Col span={18}>
                            <form onSubmit={(e) => { e.preventDefault(); handleGlobalSearch() }}>
                                <Input onChange={(e) => setGlobalSearch(e.target.value)} value={globalSearch} addonAfter={<SearchOutlined onClick={handleGlobalSearch} />} />
                            </form>
                        </Col>
                        <Col span={2} style={{ marginLeft: 4 }} onClick = { handleClear }>
                            {
                                globalSearch && <Button>Clear</Button>
                            }
                        </Col>
                        {/*<Col span={5} style={{ padding: '0px 12px' }}>
                            <Dropdown overlay={filterMenu}>
                                <div>Filter By <DownOutlined /></div>
                            </Dropdown>
                    </Col>*/}
                    </Row>}
                    {
                        getDoubtStatus === STATUS.SUCCESS ?
                            doubtsData?.length !== 0 ?
                                <TeacherDoubtTable role={role} doubtsData={doubtsData} curPage={curPage} setCurPage={setCurPage} total={doubts.total} pageSize={doubts.limit} showDoubtDetails={(doubt) => setCurDoubt(doubt)} />
                                :
                                <div style={{ textAlign: 'center', padding: 10, fontWeight: 'bold' }}>No Doubts Found!</div>
                            :
                            getDoubtStatus === STATUS.NOT_STARTED ?
                                <div style={{ textAlign: 'center', padding: 10, fontWeight: 'bold' }}>
                                    Select a teacher
                                </div>
                                :
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Spin tip="loading.." />
                                </div>
                    }
                </Col>
            </Row>
        </div>
    )
}

const SortByMenu = (props) => {
    const { sortBy } = props;
    return (
        <Menu style={{ width: '100%' }} mode="vertical">
            <Menu.SubMenu key="sub1" icon={<><ArrowUpOutlined /><ArrowDownOutlined /></>} title="Sort By">
                {/*<Menu.Item key="1" onClick={ () => sortBy('replied') }>Replied</Menu.Item>*/}
                <Menu.Item key="2" onClick={() => sortBy('doubtCount')}>Doubts</Menu.Item>
            </Menu.SubMenu>
        </Menu>
    )
}

const OneSearchTeacherProfile = (props) => {
    const { teacher, onClick, isSelected } = props;
    return (
        <Row onClick={onClick} style={{ cursor: 'pointer', padding: 5, marginY: 5, justifyContent: 'space-between', alignItems: 'center', padding: '0px 10px' }} >
            <Col span={16} >
                <TeacherProfile name={teacher.user?.name} desc={teacher.staffDesc} role={teacher.staffRole} isSelected={isSelected} />
            </Col>
            <Col span={8} style={{ fontSize: "12px" }}>
                <Row style={{ alignItems: 'center', justifyContent: 'center' }} >
                    {/*<div style={{ borderRight: '1px solid',paddingRight: 4, width: '50%' }}>
                        Replied
                    </div>*/}
                    <div style={{ paddingLeft: 4, width: '50%' }}>
                        Doubts
                    </div>
                </Row>
                <Row style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }} >
                    {/*<div style={{ color: "#38A169", borderRight: '1px solid transparent',paddingRight: 4, width: '50%'}} >
                        120
                </div>*/}
                    <div style={{ color: "#3182ce", paddingLeft: 4, width: '50%' }}>
                        {teacher.doubtCount || 0}
                    </div>
                </Row>
            </Col>
        </Row>
    )
}

const TeacherProfile = (props) => {
    const { name, role, doubtCount, src, isSelected } = props;
    const [currBgColor, setCurrBgColor] = useState('');
    useEffect(() => {
        setCurrBgColor(random_bg_color(name));
    }, [name])
    return (
        <Row style={{ alignItems: 'center', margin:10 }}>
            <Col span={8} style={{ maxWidth: '40px' }}>
                <Avatar size="large" src={src} alt={name} style={{ backgroundColor: currBgColor, boxShadow: isSelected && "1px 1px 7px -3px black" }} >
                    {name?.substr(0, 1)}
                </Avatar>
            </Col>
            <Col span={16} style={{ padding: "0px 8px" }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip placement="top" title={name}>
                        <Paragraph ellipsis={{ rows: 1 }} style={{ margin: '0px', fontWeight: 'bold', color: isSelected && '#1f74f4' }}>{name || "nn "}</Paragraph>
                    </Tooltip>
                    {
                        props.date &&
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ height: '4px', width: '4px', borderRadius: '50%', background: 'gray', margin: '0px 5px' }}></div>
                            <div style={{ fontSize: '12px' }}>{props.date}</div>
                        </div>
                    }
                </div>
                <Tooltip placement="top" title={role}>
                    <Paragraph ellipsis={{ rows: 1 }} style={{ fontSize: "10px" }}>{props.desc || ''}</Paragraph>
                </Tooltip>
            </Col>
        </Row>
    )
}

const TeacherDoubtTable = (props) => {
    const { doubtsData, total, pageSize, setCurPage, curPage, role } = props;

    return (
        <div>
            <Row style={{ alignItems: 'stretch' }}>
                {_.map(doubtsData, d => 
                    <Col span={role === 'ADMIN' ? "24" : "24"} style={{ padding: 2 }}>
                        <SingleDoubt onClick={() => props.showDoubtDetails(d)} doubt={d} />
                    </Col>
                )}
            </Row>
            <div style={{ display: 'flex', justifyContent: "flex-end", padding: 10 }}>
                <Pagination total={total} current={curPage} pageSize={pageSize} onChange={(page, pageSize) => { setCurPage(page); }} />
            </div>
        </div>
    )
}

const SingleDoubt = (props) => {
    const { doubt, onClick } = props;
    const [background, setBackground] = useState('');
    return (
        <Row style={{ padding: 10, marginY: 10, alignItems: 'flex-start', height: '100%', cursor: 'pointer', borderRadius: 5, background: background }} onClick={onClick}
            onMouseEnter={() => setBackground('#8080801a')}
            onMouseLeave={() => setBackground('')} >
            <Col span={ doubt.index > 99 ? "2": "1" } style={{ lineHeight: 1,fontSize: '1.5rem', fontWeight: 'bold' }}>{ doubt.index }</Col>
            <Col span="20">
                <div style={{ display: 'flex' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Tooltip placement="top" title={doubt.name}>
                            <Paragraph ellipsis={{ rows: 1 }} style={{ margin: '0px', fontWeight: 'bold', color: 'black', fontWeight: 'bold' }}>{doubt.name}</Paragraph>
                        </Tooltip>{console.log('props', props)}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ height: '4px', width: '4px', borderRadius: '50%', background: 'gray', margin: '0px 5px' }}></div>
                            <div style={{ fontSize: '12px' }}>{moment(props.doubt.created_at).format("DD MMM-YY, hh:mm a")}</div>
                        </div>
                    </div>
                </div>
                <div style={{ fontSize: 13 }}>
                    {doubt.doubt}
                </div>
                <div style={{ display: 'flex', marginTop: 5, }}>
                    <Tag style={{ background: doubt.status === 'Active' ? "#87d068" : "#f50", color: 'white' }} > {doubt.status}</Tag>
                    <Tag style={{ background: '#2db7f5', color: 'white' }} > <EyeOutlined style={{ marginRight: 2 }} /> view </Tag>
                    {
                        doubt?.public ? 
                            <Button size="small" type="link" style={{ color: '#2db7f5' }} >
                                Public
                            </Button>
                        :
                            null
                    }
                </div>
            </Col>
        </Row>
    )
}

const ViewDoubtDetails = (props) => {
    const { doubt, role } = props;
    const dispatch = useDispatch();
    const [selectedFiles, setFiles] = useState([]);
    const [comment, setComment] = useState('');
    const [drawerFooter, setDrawerFooter] = useState('')
    const doubtReducer = useSelector(state => state.doubts )
    const { currentDoubt, getSingleDoubtStatus, updateDoubtDetailStatus, postDoubtCommentStatus } = doubtReducer;
    const handleComment = () => {
        const formData = new FormData();
        formData.append('comment', comment);
        formData.append('itemModel', 'Topic');
        formData.append('itemId', doubt._id);
        if (selectedFiles)
            formData.append('upload', selectedFiles[0]);
        dispatch(postDoubtCommentAction(formData))
        setComment('');
        setFiles([]);
    }

    useEffect(() => {
        setFiles([]);
        setComment('')
        if (doubt._id) {
            dispatch(getSingleDoubtAction({ doubtId: doubt._id }))
        }
    }, [doubt._id])

    const hiddenFileInput = React.useRef(null);

    const handleClick = (event) => {
        hiddenFileInput.current.click();
    };

    const handleSelectFile = (d) => {
        setFiles(files => [...files, ...d])
    }

    const handleRemoveFile = (indx) => {
        let data = [...selectedFiles]
        _.remove(data, (d, i) => i === indx)
        setFiles(data)
    }

    const updateDoubt = (data) => {
        dispatch(updateDoubtDetailAction(data));
    }

    const drawerTitle = (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 24px' }}>
            <div style={{ flexGrow: '1' }}>
                <TeacherProfile name={doubt.name} />
            </div>
            {role === 'TEACHER' && currentDoubt &&
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Button disabled={currentDoubt?.status === 'Closed'} style={{ marginBottom: 5 }} type="primary" size="small" danger onClick={() => updateDoubt({ "status": "Closed", doubtId: currentDoubt._id, closedDate: moment().format('YYYY-MM-DD HH:mm') })} loading={updateDoubtDetailStatus === STATUS.FETCHING}>{currentDoubt?.status === 'Closed' ? "Closed" : "Close Doubt"}</Button>
                    <Button disabled={currentDoubt?.status !== 'Closed'} size="small"  loading={updateDoubtDetailStatus === STATUS.FETCHING}
                        onClick={() => updateDoubt({ doubtId: currentDoubt._id, public:currentDoubt.public ? false : true })} 
                    >
                        {  currentDoubt.public ? 'Make it Private' : 'Make it Public' }
                    </Button>
                </div>
            }

        </div>);

    useEffect(() => {
        if (role === 'TEACHER') {
            setDrawerFooter((<div> <TextArea onChange={(e) => setComment(e.target.value)} placeholder='Type message...' value={comment} rows={4} />
                {selectedFiles?.length ?
                    <div style={{ margin: 10 }}>
                        {selectedFiles.map((file, i) =>
                            <div key={i} style={{ marginY: 1, borderBottom: '1px dashed', justifyContent: 'space-between', display: 'flex' }}>
                                <div style={{ color: 'teal' }}>{file?.name}</div>
                                <div>
                                    <Tooltip title='Remove'>
                                        <DeleteOutlined onClick={() => handleRemoveFile(i)} />
                                    </Tooltip>
                                </div>
                            </div>
                        )}
                    </div>
                    : null
                }
                <Row style={{ marginTop: 5 }}><Col span="6" onClick={handleClick}>{/* <Button style={{ width: "100%" }} > <LinkOutlined /> </Button>*/} </Col><Col span="2"></Col><Col span="24"><Button style={{ width: "100%", borderRadius: 30 }} type="primary" loading={ postDoubtCommentStatus === STATUS.FETCHING } onClick={() => handleComment()} >Send</Button></Col></Row></div>))
        }
    }, [selectedFiles, comment, postDoubtCommentStatus])
    return (
        <Drawer width='600px' footer={ doubt.status === "Active" ? drawerFooter : null } title={drawerTitle} placement="right" onClose={props.hideViewDoubtDetails} visible={doubt._id}>
            <div>
                <input
                    {...{ accept: "*/*" }}
                    type="file"
                    ref={hiddenFileInput}
                    onChange={(e) => handleSelectFile(e.target.files)}
                    style={{ display: "none" }}
                />
                <div style={{ fontWeight: 'bold' }} >
                    { doubt.doubt }
                </div>
                <div style={{ marginTop: 20 }}>
                    {
                        getSingleDoubtStatus === STATUS.SUCCESS ?
                            currentDoubt?.comments?.docs && currentDoubt?.comments?.docs?.length > 0 ?
                                _.map(currentDoubt?.comments?.docs, d => <OneComment comment={d.comment} img={d.user?.avatar} name={d.user?.name} createdAt={d.createdAt} role={d.user?.role} files={d.files} />)
                                :
                                <div style={{ justifyContent: 'center', display: 'flex', alignItems: 'center' ,fontSize: 20, fontWeight: 'bold', color: 'teal', fontSize: 15, height: 400 }}>
                                    <div >No Comments!</div>
                                </div>
                            :
                            getSingleDoubtStatus === STATUS.FETCHING &&
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Spin tip="loading.." />
                            </div>
                    }
                </div>
            </div>
        </Drawer>
    )
}

const OneComment = (props) => {
    const { comment, img, name, createdAt, role, files, d } = props;
    return (
        <div style={{ margin: '0.5rem 0rem', borderBottom: '1px solid rgb(0 0 0 / 5%)', padding: '0.5rem' }}>
            <TeacherProfile date={moment(createdAt).format("DD MMM-YY, hh:mm a")} name={name} role={role} src={img} />
            <div style={{ paddingTop: '5px', paddingBottom: '10px' }}>
                {comment}
            </div>
            <div>
                {files && _.map(files, f => <FileView f={f} />)}
            </div>
        </div>
    )
}


const FileView = ({ f, setLightBoxUri }) => {
    const isFileImage = isImage(f.url, f.type);
    const isFilePdf = isPDF(f.url, f.type);

    return isFileImage ? (
        <div
            style={{ cursor: "pointer" }}
            onClick={() => window.open(f.url, "_")}
            _hover={{ bg: "gray.200" }}
        >
            <img src={f.url} style={{ minHeight: "200px", maxHeight: "400px" }} />
        </div>
    ) : (
        <div
            style={{ cursor: "pointer" }}
            onClick={() => window.open(f.url, "_")}
        >
            <LinkOutlined />
        </div>
    );
};



export const isImage = (fileName, type) => {
    if (type) {
        if (type.startsWith('image')) {
            return true;
        }
    }
    if (
        fileName.toUpperCase().endsWith("JPG") ||
        fileName.toUpperCase().endsWith("PNG") ||
        fileName.toUpperCase().endsWith("JPEG") ||
        fileName.toUpperCase().endsWith("WEBP")
    ) {
        return true;
    } else {
        return false;
    }
};

export const isPDF = (fileName, type) => {
    if (type && type === 'application/pdf') {
        return true;
    }
    if (fileName.toUpperCase().endsWith("PDF")) {
        return true;
    } else {
        return false;
    }
};

const random_bg_color = (name) => {
    if (!name) return "";
    var hash = 0;
    if (name.length === 0) return hash;
    for (var i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    var rgb = [0, 0, 0];
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 255;
        rgb[i] = value;
    }
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}