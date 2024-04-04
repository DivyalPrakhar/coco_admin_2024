import { CloseCircleOutlined, DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Drawer, Dropdown, Image, Input, List, Menu, Modal, Space, Table, Tooltip, Divider } from 'antd'
import Text from 'antd/lib/typography/Text'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../Constants'
import { getCommentsAction, getRepliesAction } from '../../redux/reducers/discussionTopicReducer'
import { FiMoreVertical } from "react-icons/fi";
import { deleteCommentAction } from '../../redux/reducers/discussionTopicReducer'
import { ConfirmAlert, SuccessMessage } from '../../Constants/CommonAlerts'
import moment from 'moment'
import _, { forEach, map, reduce, size } from 'lodash'
import { GrAttachment } from "react-icons/gr";
import { URIS } from '../../services/api'
import { addLikeAction } from '../../redux/reducers/comments'
import { useApiRequest } from '../../services/api/useApiRequest'
import Title from 'antd/lib/skeleton/Title'
import { AddReplyModal } from './AddReplyModal'

export const CommentsModal = ({visible, closeModal, topic}) => {
    const dispatch = useDispatch()

    const {getCommentsStatus, commentsList, deleteCommentStatus} = useSelector(state => ({
        getCommentsStatus:state.discussionTopicReducer.getCommentsStatus,
        commentsList:state.discussionTopicReducer.commentsList,
        deleteCommentStatus:state.discussionTopicReducer.deleteCommentStatus
    }))

    useEffect(() => {
        dispatch(getCommentsAction({itemId:topic._id, limit:10}))
    }, [])

    const changePage = (d) => {
        dispatch(getCommentsAction({itemId:topic._id, limit:10, page:d.current}))
    }

    const deleteComment = (id) => {
        ConfirmAlert(() => dispatch(deleteCommentAction({commentId:id})), 'Sure?', null, deleteCommentStatus === STATUS.FETCHING)
    }

    const viewReplies = (d) => {
        dispatch(getRepliesAction({commentId:d._id}))
    }

    const commentBox = (d) => {
        return(
            <div>
                <Space style={{display:'flex', marginBottom:6}} >
                    {/* <Avatar style={{backgroundColor:'#17A589'}}>{d.user?.name?.[0]}</Avatar> */}
                    <Text style={{fontWeight:'bold', fontSize:'16px'}}>{d.user?.name}</Text><br/>
                    <Text style={{fontSize:'12px'}} type='secondary'>{moment(d.createdAt).format("DD MMM, HH:mm")}</Text>
                </Space>
                <div>
                    <Text style={{color:'#515A5A'}}>{d.comment} </Text>
                </div>
                {d?.files.length ? (
                    <>
                        <Space wrap>
                            {d.files.map((f) => {
                            return (
                                <div
                                    key={f._id}
                                    // onClick={() => setLightBoxUri(f.url)}
                                >
                                <Image src={f.url} style={{cursor:'pointer', maxWidth:'200px'}} />
                                </div>
                            );
                            })}
                        </Space>
                    </>
                ) : null}
                {d.replies && !d.childComments?.length ? (
                        <>
                            <br/>
                            <Text style={{cursor:'pointer'}} type='secondary' underline
                                onClick={() => viewReplies(d)}
                            >
                                View {d.replies} Replies
                            </Text>

                        </>
                    ) : null
                }
                {d.childComments?.length ? 
                    replies(d.childComments)
                    : null
                }
            </div>
        )
    }

    let replyColumns = [
        {key:'comment', render:d => {return commentBox(d)}},
        {key:'actions', width:'100px', render:d => {
            return <Tooltip title='delete'>
                    <Button type='link' onClick={() => deleteComment(d._id)} icon={<DeleteOutlined />}></Button>
                </Tooltip>
            }
        }
    ]

    const replies = (list) => {
        return(
            <div style={{margin:5}}>
                <Table pagination={false} size='small' dataSource={list} columns={replyColumns} 
                    loading={getCommentsStatus === STATUS.FETCHING || deleteCommentStatus === STATUS.FETCHING}
                />
            </div>
        )
    }

    return(
        <Drawer title='Comments' width='70%' footer={false} bodyStyle={{padding:0}} visible={visible} onClose={closeModal}>
            <CommentElement itemId={topic._id}/>
            {/* <Table size='small' dataSource={commentsList?.docs} onChange={changePage}
                pagination={{position:['bottomCenter'], current:parseInt(commentsList?.page), pageSize:10, total:commentsList?.total}}
                loading={getCommentsStatus === STATUS.FETCHING}
            >
                <Table.Column key='name' 
                    render={d => 
                        commentBox(d)  
                    }
                ></Table.Column>
                <Table.Column key='actions' width='100px'
                    render={d => 
                        <div >
                            <Tooltip title='delete'>
                                <Button type='link' onClick={() => deleteComment(d._id)} icon={<DeleteOutlined />}></Button>
                            </Tooltip> */}

                            {/* <Dropdown placement="bottomRight" arrow
                                overlay={
                                    <Menu>
                                        <Menu.Item icon={<DeleteOutlined />}>
                                            Delete
                                        </Menu.Item>
                                    </Menu>
                                }
                            >
                                <Button type='link' icon={<FiMoreVertical style={{fontSize:'20px'}} />}></Button>
                            </Dropdown> */}
                        {/* </div>
                    }
                ></Table.Column>
            </Table> */}
            {/* <List style={{maxHeight:'400px', overflow:'auto'}}
                loading={getCommentsStatus === STATUS.FETCHING} dataSource={commentsList?.docs}
                renderItem={cmnt =>
                    <List.Item>
                        <div style={{width:'100%'}}>
                            
                            <div>
                                <div>   
                                    <Text style={{color:'#5D6D7E'}}>{cmnt.comment}</Text>
                                </div>
                                <div>

                                </div>
                            </div>
                        </div>
                    </List.Item>
                }
            /> */}
        </Drawer>
    )
}

export const CommentElement = ({itemId, sortType, type = "discussion", itemModel ="Topic", selectedAnswer, showAttachment = true, inputStyle = "filled",
    placeholder = 'Add a public comment...',
    disableReply
}) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState();
  const [activeReplyComment, setActiveReplyComment] = useState();
  const [pagedata, setPageData] = useState();

  // useEffect(() => {
  //   if(sortType)
  //     request({ method: "GET", params: {sortBy:sortType === 'top' ? 'likes' : '', itemId, limit: 10, page:pagedata.page } });
  // }, [sortType])

  const onCompleted = useCallback((data) => {
    setComments((c) =>
      data && data.page === 1 ? data.docs : [...c, ...data?.docs]
    );
    setPageData(
      data && {
        limit: data.limit,
        page: data.page,
        pages: data.pages,
        total: data.total,
      }
    );
  }, []);

  const mappedComments = useMemo(() => {
    return reduce(
      comments,
      (last, c, i) => {
        if (c.replies && c.childComments && size(c.childComments)) {
          last.push(
            Object.assign({}, c, {
              sizecc: size(c.childComments),
            })
          );

          forEach(c.childComments, (cc) => {
            last.push(
              Object.assign({}, cc, {
                type: "child",
              })
            );
          });
        } else {
          last.push(c);
        }

        return last;
      },
      []
    );
  }, [comments]);

  const onError = useCallback((res) => {}, []);

  const { request, fetched, loading, data } = useApiRequest(URIS.GET_COMMENTS, {
    onCompleted,
    onError,
  });

  // const [files, setFiles] = useState();
  // const _clearFiles = () => {
  //   setFiles();
  // };

  const onCompletedAdd = useCallback((data) => {
    setComments((c) => {
      if (data.parentComment) {
        let final = map(c, (it) => {
          if (it._id === data.parentComment._id) {
            return Object.assign({}, it, {
              replies: data.parentComment.replies,
              childComments:
                it.childComments && Array.isArray(it.childComments)
                  ? [data, ...it.childComments]
                  : [data],
            });
          }
          return it;
        });
        return final;
      } else {
        return [data, ...c];
      }
    });
    setComment("");
    setActiveReplyComment();
    SuccessMessage('Comment Added')
  }, []);

  const onErrorAdd = useCallback((res) => {}, []);
  const {
    request: postCommentRequest,
    loading: commentLoading,
  } = useApiRequest(URIS.COMMENT, {
    onCompleted: onCompletedAdd,
    onError: onErrorAdd,
  });

  const _getTopicComments = useCallback(
    (tid, page = 1) => {
      request({ method: "GET", params: { itemId: tid, limit: 10, page } });
    },
    [request]
  );

  const loadMore = useCallback(() => {
    _getTopicComments(itemId, (pagedata?.page || 0) + 1);
  }, [_getTopicComments, itemId, pagedata?.page]);

  useEffect(() => {
    _getTopicComments(itemId);
  }, [_getTopicComments, itemId]);

  const addComment = (data, attachment) => {
    const formData = new FormData();
    
    // if (files) {
    //   formData.append('upload', files);
    // }
    
    formData.append("comment", data);
    formData.append("itemModel", itemModel);
    formData.append("itemId", itemId);
   
    if (attachment) {
      formData.append("upload", attachment);
    }
   
    if (activeReplyComment) {
      formData.append("parentComment", activeReplyComment._id);
    }

    postCommentRequest({
      method: "POST",
      headers:
        1 == 2 //files
          ? {
              contentType: "multipart",
            }
          : {},
      data: formData,
    });
  };

  const [lightboxUri, setLightBoxUri] = useState();

  const closeLightBox = () => {
    setLightBoxUri();
  };

    return (
        <div>
          <div style={{position:'sticky', top:0, zIndex:99, padding:'20px 30px 0 30px', background:'white'}}>
            <Text fontSize='sm'>{comments?.length || 0} COMMENTS</Text>
            <CommentBox addComment={addComment} setComment={setComment} comment={comment} inputStyle={inputStyle} showAttachment={showAttachment}
              loading={commentLoading} placeholder={placeholder}
            />
          </div>
          <br/>
          <div style={{padding:'0 20px'}}>
            <Space style={{width:'100%', border:'1px solid #E5E8E8', padding:10}} direction='vertical'>
              {map(mappedComments, (comment, i) => {
                return (
                  <CommentItem itemId={itemId} comments={comments}
                    disableReply={disableReply}
                    setLightBoxUri={setLightBoxUri}
                    key={comment._id + i}
                    setComments={setComments}
                    item={comment}
                    index={i}
                    setActiveReplyComment={setActiveReplyComment}
                  />
                );
              })}
            </Space>
          </div>
          {activeReplyComment ? (
            <AddReplyModal
              addComment={addComment}
              setComment={setComment}
              comment={comment}
              inputStyle={inputStyle}
              showAttachment={showAttachment}
              loading={commentLoading}
              visible={activeReplyComment}
              closeModal={() => setActiveReplyComment(false)}
              placeholder={placeholder}
            />
          ) : null}
{/*     
          <div p={2}>
            {loading ? (
              <Spinner ml={10} size="lg" />
            ) : pagedata && pagedata.page && pagedata.pages > pagedata.page ? (
              <Button variant="gray" onClick={loadMore}>
                Load More
              </Button>
            ) : comments && comments.length ? (
              <Text>No more comments. </Text>
            ) : null}
          </div> */}
    
          {/* {
              pagedata && pagedata.page && pagedata.pages > 1 ? 
              <Pagination
                            current={pagedata.page}
                            total={pagedata.pages}
                            pageSize={pagedata.limit}
                            //onChange={(page) => changePage(page)}
                            paginationProps={{
                              display: "flex",
                              pos: "absolute",
                              left: "50%",
                              transform: "translateX(-50%)"
                            }}
                            colorScheme="blue"
                        />: null
          } */}
    
          {/* <ImageViewLightBox uri={lightboxUri} onClose={closeLightBox} /> */}
        </div>
      );
} 

export const CommentBox = ({ addComment, inputStyle, showAttachment, comment, loading, setComment, placeholder}) => {
    const [attachment, changeAttachment] = useState({ file: "", fileType: "" });
  
    const hiddenFileInput = React.useRef(null);
  
    const handleClick = (event) => {
      hiddenFileInput.current.click();
    };
  
    const handleChange = (event) => {
      _addAttachment(event);
    };
  
    const _addAttachment = (e) => {
      let file = e.target.files[0];
      let fileType;
  
      if (!file) {
        return;
      }
  
      if (file.type.split("/")[0] == "image") {
        fileType = "images";
      } else if (file.type.split("/")[0] == "video") {
        fileType = "videos";
      } else if (file.type.split("/")[0] == "audio") {
        fileType = "audios";
      } else {
        fileType = "documents";
      }
  
      changeAttachment({ file: e.target.files[0], fileType: fileType });
    };
  
    const _changeComment = (e) => {
      setComment(e.target.value);
    };
    const clearComment = () => {
      setComment("");
      changeAttachment({ file: "", fileType: "" });
    };
  
    const submitComment = () => {
      let att = attachment?.file
     changeAttachment({file:"", fileType:""})
      addComment(comment, att);
    };
  
    return (
      <div >
        {showAttachment && attachment.file ? (
          <Space align='' style={{padding:4}}>
            <Text>{attachment.file.name}</Text>
            <Text fontSize="xs" color="gray.400">
              {(((attachment.file.size / 1024 / 1024) * 100) / 100).toFixed(2)} MB
            </Text>
          </Space>
        ) : null}
        <div style={{display:'flex'}}>
          {showAttachment ? (
            <>
              <Tooltip label='attach file'>
                <div onClick={handleClick}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #707070A7",
                    borderStyle: "dashed",
                    padding: "10px",
                  }}
                >
                  <Space justifyContent='center' align='center' style={{ textAlign: "center" }} boxSize={8}>
                      <GrAttachment fontSize='18px'/>
                  </Space>
                  <input {...{ accept: "image/*" }} type="file" ref={hiddenFileInput} onChange={handleChange} style={{ display: "none" }}/>
                </div>
              </Tooltip>
            </>
          ) : null}
          <Input
            ml={3}
            noOfLines={2}
            alignSelf="stretch"
            value={comment}
            onChange={_changeComment}
            placeholder={placeholder}
          />
        </div>
        <div style={{width:'100%', display:'flex', justifyContent:'end', paddingTop:'15px'}} justifyContent='end' width="100%">
          <div style={{paddingRight:'10px'}}>
            <Button
              border='1px solid #4285F4'
              borderRadius={0}
              variant="outline"
              size="sm"
              onClick={clearComment}
              colorScheme="blue"
            >
              CLEAR
            </Button>
          </div>
          <Button
            border='1px solid #4285F4'
            borderRadius={0}
            variant="solid"
            size="sm"
            isLoading={loading}
            onClick={submitComment}
            colorScheme="blue"
          >
            COMMENT
          </Button>
        </div>
      </div>
    );
  };

const CommentItem = ({item, setLightBoxUri, setComments, index, setActiveReplyComment, disableReply, itemId, comments}) => {
      const dispatch = useDispatch()

      const {deleteCommentStatus} = useSelector(state => ({
        deleteCommentStatus:state.discussionTopicReducer.deleteCommentStatus
    }))

    const [activeReply, setActiveReply] = useState()
    
    const _setActiveReplyComment = () => {
      setActiveReplyComment(item);
    };

    const onCompletedLike = useCallback(
      (data) => {
        setComments((c) =>
          map(c, (ci) => {
            const pid =
              typeof data.parentComment === "object"
                ? data.parentComment._id
                : data.parentComment;
            if (data.parentComment && ci._id === pid) {
              const childComments = map(ci.childComments, (cci) => {
                if (cci._id === data._id) {
                  return data;
                }
                return cci;
              });
  
              return Object.assign({}, ci, {
                childComments,
              });
            }
  
            if (ci._id === data._id) {
              return Object.assign({}, data, {
                childComments: ci.childComments,
              });
            }
            return ci;
          })
        );
      },
      [setComments]
    );
  
    const onErrorLike = useCallback((res) => {}, []);
  
    const { request: likeComment, loadingComment } = useApiRequest(
      URIS.ADD_LIKE,
      {
        onCompleted: onCompletedLike,
        onError: onErrorLike,
      }
    );
  
    const _like = () => {
      likeComment({
        method: "PATCH",
        data: {
          path: item.self && item.self === "dislikes" ? "dislikes" : "likes",
          commentId: item._id,
        },
      });
    }
  
    const onCompletedReplies = useCallback(
      (data, resp, extraData) => {
        setComments((c) =>
          map(c, (cr) => {
            if (cr._id === extraData.commentId) {
              return Object.assign({}, cr, {
                childComments: data.docs,
              });
            }
            return cr;
          })
        );
      },
      [setComments]
    );
  
    const onErrorReplies = useCallback((res) => {}, []);
  
    const { request: commentRepliesRequest, loadingReplies } = useApiRequest(
      URIS.GET_COMMENT_REPLIES,
      {
        onCompleted: onCompletedReplies,
        onError: onErrorReplies,
      }
    );
  
    const _viewReplies = () => {
      commentRepliesRequest(
        {
          method: "GET",
          params: {
            commentId: item._id,
          },
        },
        {
          commentId: item._id,
        }
      );
    };

    const onDeleteError = useCallback((res) => {}, []);
    
    const onDeleteCompleted = useCallback(resp => {
      let allComments = [...comments]
      let deleteId = resp._id

      if(resp.parentComment){
        let parentIndx = _.findIndex(allComments,c => c._id === resp.parentComment)
        _.remove(allComments[parentIndx].childComments,c => c._id === deleteId)
      }
      else{
        _.remove(allComments,c => c._id === deleteId)
      }

      setComments(allComments)
      SuccessMessage('comment removed')
    }, [])

    const { request: deleteComment, fetched, loading, data } = useApiRequest(URIS.DELETE_COMMENT, {
      onCompleted: onDeleteCompleted,
      onError: onDeleteError,
    });

    const handleDeleteComment = (id) => {
      ConfirmAlert(() => deleteComment({ method: "DELETE", params: { commentId:id } }), 'Sure?', null, loading)
  }
  
    return (
        <div style={{ display:'flex', justifyContent:'space-between',
            padding:item.parentComment ? '4px 20px' : '5px 1px 5px 0',
            background:item.parentComment ? '#F7F9F9' : 'white',
            borderRadius:6
          }}
        >
          <div>
            <Space>
              {/* <Avatar name={item.user?.name} size="sm" color="white" /> */}
              <Text strong style={{fontSize:'16px'}}>{item.user?.name}</Text>
              <Text style={{fontSize:12}} type='secondary'>
                {moment(item.createdAt).format("DD MMM, HH:mm")}
              </Text>
            </Space>
            <br/>
            <Text>{item.comment == 'undefined' ? '' : item.comment}</Text>
            {item.files && item.files.length ? (
              <Space style={{display:'block'}}>
                {item.files.map((f) => {
                  return (
                    <div key={f._id} onClick={() => setLightBoxUri(f.url)}>
                      <Image src={f.url} style={{maxHeight:100, cursor:'pointer'}} />
                    </div>
                  );
                })}
              </Space>
            ) : null}
            
            <Space style={{fontSize:13, width:'100%'}}>
              <Card style={{border:0}} bodyStyle={{padding:0}} loading={loadingComment}>
                {!loadingComment ? 
                  <Button type='text' onClick={_like} style={{padding:0, color:'#85929E', fontSize:13}}>
                      {item.self === "likes" ? "Liked" : "Like"}{" "}
                  </Button>
                  :
                  null
                }
              </Card>
              {item.totalLikes ? (
                <Text style={{color:'#85929E', fontSize:13}}>
                  Likes {item.totalLikes}
                </Text>
              ) : null}&nbsp;&nbsp;
              {item.parentComment || disableReply ? null : (
                <Text style={{color:'#85929E', cursor:'pointer', fontSize:13}} onClick={_setActiveReplyComment}>
                  Reply
                </Text>
              )}
    
              {item.replies && item.replies !== size(item.childComments) ? (
                <Button style={{padding:0, color:'#85929E', fontSize:13}} size="xs" type='text' onClick={_viewReplies}>
                    View {item.replies - size(item.childComments)} Replies
                </Button>
              ) : null}
            </Space>
          </div>
          <div style={{padding:'0 15px'}}>
            <Tooltip title='delete'>
                <Button type='outline' danger onClick={() => handleDeleteComment(item._id)} icon={<DeleteOutlined />}></Button>
            </Tooltip>
          </div>
        </div>
    );
  };