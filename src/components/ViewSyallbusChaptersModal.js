import { Row, Col, Table, Modal, Skeleton } from 'antd';
import {useDispatch, useSelector} from 'react-redux' 
import { useEffect } from 'react';
import { STATUS } from "../Constants";
import _ from 'lodash';

import { getSyllabusChaptersDataAction } from '../redux/reducers/Syllabus'
export const ViewSyallbusChaptersModal = (props) => {

	const dispatch = useDispatch()
	const {syllabus} = useSelector(s => ({
      user: s.user,
      configData: s.lmsConfig,
      syllabus: s.syllabus
  	}))

	useEffect(() => {
        dispatch(getSyllabusChaptersDataAction({id: props.id, withBaseChapters: '1'}))
	}, [])

	return(
		<Modal visible={props.viewSyallbusChapters} footer={null} width='800px' onOk={() => console.log('')} onCancel={() => props.closeModal()}>
			<Skeleton loading={syllabus.getSyllabusChaptersDataStatus == STATUS.FETCHING}>
				{syllabus.getSyllabusChaptersDataStatus == STATUS.SUCCESS ? 
					<div>
						<ListSyllabusChapters syllabusChaptersData={syllabus.syllabusChapterData.chapters} />
					</div>
				: null}
			</Skeleton>
		</Modal>
	)
}

export const ListSyllabusChapters = (props) => {
	const columns = [
		{
		  title: 'Name',
		  key: 'name',
		  render: s => ( 
		  	<div>{s.chapterId.name.en}</div>
		  )
		},
		{
		  title: 'Order',
		  key: 'order',
		  dataIndex: 'order'
		},
		{
		  title: 'mainBaseChapter',
		  key: 'mainBaseChapter',
		  render: s => ( 
		  	<div>{s.chapterId.mainBaseChapter && s.chapterId.mainBaseChapter.name ? s.chapterId.mainBaseChapter.name?.en : ''}</div>
		  )
		},
		{
		  title: 'Basechapters',
		  key: 'basechapters',
		  render: s => ( 
		  	<div>{_.map(s.chapterId.basechapters, s => s.name?.en).join(', ')}</div>
		  )
		},
	];
	return(
		<div>
			<div>
				<h3>Chapter Data</h3>
				<hr/>
			</div>
    		<Table pagination={false} bordered dataSource={_.orderBy(props.syllabusChaptersData, ['order'], ['asc'])} columns={columns} />
		</div>
    )
}