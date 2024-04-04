import React, {useEffect, useState} from 'react';
import {DiscussionTopic} from '../DiscussionTopic'
import { useDispatch, useSelector } from 'react-redux'
import { 
    addDiscussionTopicAction, getDiscussionTopicAction, approveTopicQuestionAction
} from '../../redux/reducers/discussionTopicReducer'

export const DiscussionSubTopic = (props) => {
	const [keyData,changeKeyData] = useState(new Date())
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getDiscussionTopicAction({topicId: props.match.params.id, community: props.match.params.community}))
	}, [props.match.params.id])

	return(
		<>
			<DiscussionTopic {...props} keyData={keyData}/>
		</>
	)
}