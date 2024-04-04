import {
	EyeOutlinedm,
	BookOutlined,
	MenuOutlined,
	FolderViewOutlined,
	ReloadOutlined,
	EditOutlined,
	DeleteOutlined,
	SyncOutlined,
	EyeOutlined,
	LockOutlined,
	UnlockOutlined,
	WarningOutlined,
} from "@ant-design/icons";
import {
	Button,
	Card,
	Col,
	Descriptions,
	Empty,
	List,
	Row,
	Tabs,
	Table,
	Form,
	Modal,
	Spin,
	Tooltip,
	Tag,
	Drawer,
	Divider,
	Space,
	Alert,
	Select,
	Image,
} from "antd";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { CommonPageHeader } from "../../components/CommonPageHeader";
import "./index.css";
import { STATUS } from "../../Constants";
import {
	deleteCourseAction,
	getCoursesAction,
	getCoursesContentAction,
	deleteCourseContentAction,
	updateCourseContentOrderAction,
	updateCourseContentAction,
} from "../../redux/reducers/courses";
import _, { find } from "lodash";
import { AddContentModal } from "../../components/AddContentModal";

import { DndProvider, useDrag, useDrop, createDndContext } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import { ConfirmAlert } from "../../Constants/CommonAlerts";
import Text from "antd/lib/typography/Text";
import { bilingualText } from "../../utils/FileHelper";
import { FaVimeoSquar, FaVimeoSquare, FaYoutube } from "react-icons/fa";
import { getSingleInstituteAction } from "../../redux/reducers/instituteStaff";
import { getLiveBatchAction } from "../../redux/reducers/batches";
import moment from "moment";

export const CourseContent = () => {
	const params = useParams();
	const dispatch = useDispatch();
	const [selectedSubject, setSelectedSubject] = useState();
	const [selectedChapter, setSelectedChapter] = useState();

	const { user, course, configData } = useSelector((state) => ({
		user: state.user,
		course: state.course,
		configData: state.lmsConfig,
	}));

	useEffect(() => {
		dispatch(getCoursesContentAction({ id: params.syllabusId }));
	}, [dispatch, params.syllabusId]);

	useEffect(() => {
		if (params.id && params.syllabusId) {
			setSelectedSubject(
				_.find(
					_.get(
						_.find(course.courseList, (b) => b._id === params.id),
						"subjects",
						[]
					),
					(sub) => sub.content == params.syllabusId
				)
			);
		} else setSelectedSubject(null);
	}, [course.courseList, course.getCoursesStatus, params.id, params.syllabusId]);

	return (
		<div>
			<CommonPageHeader title="Course Content" />
			<br />
			<Card
				loading={
					course.getCoursesContentStatus == STATUS.FETCHING ||
					course.getCoursesStatus == STATUS.FETCHING
				}>
				{course.getCoursesContentStatus == STATUS.SUCCESS &&
				course.getCoursesStatus == STATUS.SUCCESS &&
				selectedSubject ? (
					<div>
						<div style={{ textAlign: "center" }}>
							<Text style={{ color: "#5D6D7E", fontWeight: "bold", fontSize: "25px" }}>
								{selectedSubject.displayName}
							</Text>
						</div>
						<Divider style={{ margin: "10px 0 " }} />
						<Row>
							<Col span={6}>
								<ChapterList
									subjectData={selectedSubject}
									course={course}
									selectedChapter={selectedChapter}
									setSelectedChapter={(d) => setSelectedChapter(d)}
								/>
							</Col>
							<Col span={18}>
								{!selectedChapter ? null : (
									<ContentDataView
										subjectData={selectedSubject}
										course={course}
										selectedChapter={selectedChapter}
									/>
								)}
							</Col>
						</Row>
					</div>
				) : null}
			</Card>
		</div>
	);
};

const ChapterList = ({ subjectData, course, selectedChapter, setSelectedChapter }) => {
	const [publicContentDrawer, changePublicContentDrawer] = useState(false);

	return (
		<div>
			<List
				style={{ height: "60vh", overflow: "auto", cursor: "pointer" }}
				bordered
				header={
					<div s>
						<b style={{ fontSize: "20px" }}>Chapter List</b>
						<br />
						<span
							style={{ color: "blue" }}
							onClick={() => (changePublicContentDrawer(true), setSelectedChapter(null))}>
							View All Content
						</span>
					</div>
				}
				dataSource={_.orderBy(subjectData.template?.chapters, ["order"], ["asc"])}
				renderItem={(item) => {
					const selected =
						selectedChapter && selectedChapter.chapterId._id == item.chapterId._id;
					return (
						<List.Item
							key={item.chapterId._id}
							className={selected ? "listItemBg" : ""}
							onClick={() => setSelectedChapter(item)}>
							<List.Item.Meta
								avatar={<BookOutlined style={{ color: selected ? "white" : "" }} />}
								title={
									<span className={selected ? "listItemBg" : ""}>
										{item.chapterId.name?.en}
									</span>
								}
							/>
						</List.Item>
					);
				}}
			/>
			{publicContentDrawer ? (
				<Drawer
					title="All Content"
					visible={publicContentDrawer}
					width="90%"
					onClose={() => changePublicContentDrawer(false)}>
					<ContentDataView
						subjectData={subjectData}
						course={course}
						selectedChapter={null}
						drawerStatus={true}
					/>
				</Drawer>
			) : null}
		</div>
	);
};

const ContentDataView = ({ subjectData, course, selectedChapter, drawerStatus }) => {
	const [contentModal, addContentModal] = useState({
		status: false,
		type: "",
		editData: "",
	});
	const [tabSelected, tabChange] = useState("audio");
	const [publicStatus, changePublicStatus] = useState(true);
	const { TabPane } = Tabs;

	const handlePublic = (value) => {
		changePublicStatus(value);
	};

	return (
		<div style={{ padding: "0px 10px 10px 20px" }}>
			{drawerStatus ? (
				<Form.Item label="Select Status">
					<Select onChange={handlePublic} value={publicStatus}>
						<Select.Option value={true}>Public</Select.Option>
						<Select.Option value={false}>Private</Select.Option>
					</Select>
				</Form.Item>
			) : null}
			<Tabs
				onChange={(k) => tabChange(k)}
				tabBarExtraContent={
					drawerStatus ? null : (
						<Button
							onClick={() =>
								addContentModal({ status: true, type: tabSelected, editData: "" })
							}>
							{"Add " + _.capitalize(tabSelected)}
						</Button>
					)
				}>
				<TabPane tab="Audio" key="audio">
					{tabSelected == "audio" ? (
						<div>
							<ViewContent
								drawerStatus={drawerStatus}
								chapters={subjectData.template.chapters}
								editContent={(d) =>
									addContentModal({ status: true, type: tabSelected, editData: d })
								}
								type={tabSelected}
								data={course}
								tabData={_.filter(course.courseContentData[tabSelected + "s"], (f) =>
									drawerStatus
										? publicStatus
											? f.public
											: !f.public
										: f.chapterId === selectedChapter.chapterId._id
								)}
							/>
						</div>
					) : null}
				</TabPane>
				<TabPane tab="Video" key="video">
					{tabSelected == "video" ? (
						<div>
							<ViewContent
								tabSelected={tabSelected}
								drawerStatus={drawerStatus}
								chapters={subjectData.template.chapters}
								editContent={(d) =>
									addContentModal({ status: true, type: tabSelected, editData: d })
								}
								type={tabSelected}
								data={course}
								tabData={_.filter(course.courseContentData[tabSelected + "s"], (f) =>
									drawerStatus
										? publicStatus
											? f.public
											: !f.public
										: f.chapterId == selectedChapter.chapterId._id
								)}
							/>
						</div>
					) : null}
				</TabPane>
				<TabPane tab="Document" key="document">
					{tabSelected == "document" ? (
						<div>
							<ViewContent
								drawerStatus={drawerStatus}
								editContent={(d) =>
									addContentModal({ status: true, type: tabSelected, editData: d })
								}
								type={tabSelected}
								data={course}
								tabData={_.filter(course.courseContentData[tabSelected + "s"], (f) =>
									drawerStatus
										? publicStatus
											? f.public
											: !f.public
										: f.chapterId == selectedChapter.chapterId._id
								)}
								chapters={subjectData.template.chapters}
							/>
						</div>
					) : null}
				</TabPane>
				<TabPane tab="Text" key="text">
					{tabSelected == "text" ? (
						<div>
							<ViewContent
								drawerStatus={drawerStatus}
								editContent={(d) =>
									addContentModal({ status: true, type: tabSelected, editData: d })
								}
								type={tabSelected}
								data={course}
								tabData={_.filter(course.courseContentData[tabSelected + "s"], (f) =>
									drawerStatus
										? publicStatus
											? f.public
											: !f.public
										: f.chapterId == selectedChapter.chapterId._id
								)}
								chapters={subjectData.template.chapters}
							/>
						</div>
					) : null}
				</TabPane>
				<TabPane tab="Ebook" key="ebook">
					{tabSelected == "ebook" ? (
						<div>
							<ViewContent
								drawerStatus={drawerStatus}
								editContent={(d) =>
									addContentModal({ status: true, type: tabSelected, editData: d })
								}
								type={tabSelected}
								data={course}
								tabData={_.filter(course.courseContentData[tabSelected + "s"], (f) =>
									drawerStatus
										? publicStatus
											? f.public
											: !f.public
										: f.chapterId == selectedChapter.chapterId._id
								)}
								chapters={subjectData.template.chapters}
								tabSelected="ebook"
							/>
						</div>
					) : null}
				</TabPane>
			</Tabs>
			{contentModal.status == true ? (
				<AddContentModal
					showModal={contentModal.status}
					chapterId={
						contentModal.editData
							? contentModal.editData.chapterId
							: selectedChapter.chapterId._id
					}
					subject={subjectData}
					editData={contentModal.editData}
					closeModal={() => addContentModal({ status: false, data: "", editData: "" })}
					type={contentModal.type}
				/>
			) : null}
		</div>
	);
};

const ViewContent = (props) => {
	const params = useParams();
	const dispatch = useDispatch();
	const [attachmentModal, viewAttachment] = useState({ data: "", modal: false });
	const [orderChangeStatus, orderChange] = useState(false);

	const { courseContentStatus } = useSelector((state) => ({
		courseContentStatus: state.course.addCourseContentStatus,
	}));

	const { user, batches, instituteStaff } = useSelector((s) => ({
		user: s.user,
		batches: s.batches,
		instituteStaff: s.instituteStaff,
	}));

	useEffect(() => {
		if (props.type === "video") {
			if (instituteStaff.getStatus === STATUS.NOT_STARTED)
				dispatch(getSingleInstituteAction({ id: user.user.staff?.institute?._id }));
			if (batches.getLiveBatchStatus === STATUS.NOT_STARTED)
				dispatch(getLiveBatchAction({}));
		}
	}, [
		props.type,
		batches.getLiveBatchStatus,
		dispatch,
		instituteStaff.getStatus,
		user.user.staff?.institute?._id,
	]);

	const RNDContext = createDndContext(HTML5Backend);

	const type = "DragableBodyRow";

	const DragableBodyRow = ({ index, moveRow, className, style, ...restProps }) => {
		const ref = useRef();
		const [{ isOver, dropClassName }, drop] = useDrop({
			accept: type,
			collect: (monitor) => {
				const { index: dragIndex } = monitor.getItem() || {};
				if (dragIndex === index) {
					return {};
				}
				return {
					isOver: monitor.isOver(),
					dropClassName: dragIndex < index ? " drop-over-downward" : " drop-over-upward",
				};
			},
			drop: (item) => {
				moveRow(item.index, index);
			},
		});
		const [, drag] = useDrag({
			item: { type, index },
			collect: (monitor) => ({
				isDragging: monitor.isDragging(),
			}),
		});
		drop(drag(ref));
		return (
			<tr
				ref={ref}
				className={`${className}${isOver ? dropClassName : ""}`}
				style={{ cursor: "move", ...style }}
				{...restProps}
			/>
		);
	};

	const updatePublicStatus = (d, status) => {
		let data = {
			contentId: params.syllabusId,
			id: d._id,
			chapterId: d.chapterId,
			type: props.type,
			public: status,
			documentId: d.data._id,
		};

		dispatch(updateCourseContentAction(data));
	};

	const columns = [
		{
			title: "Sr No.",
			width: 90,
			key: "index",
			render: (d, i, m) => m + 1,
		},
		{
			title: "Name",
			width: 300,
			key: "name",
			dataIndex: "name",
		},
		props.tabSelected == "video"
			? {
					title: "Documents",
					key: "documents",
					dataIndex: "docs",
					render: (docs, obj, indx) => (
						<div
							style={{ display: "flex", flexDirection: "column" }}
							direction="vertical"
							size="small">
							{docs?.length
								? docs.map((d) => (
										<Button
											style={{ padding: 0 }}
											size="sm"
											onClick={() => window.open(d.url)}
											type="link">
											File {indx}
										</Button>
								  ))
								: null}
						</div>
					),
			  }
			: undefined,
		{
			title: "Public Status",
			width: 100,
			key: "publi_status",
			render: (d) => (
				<div>
					{d.public ? (
						<Tag color="green">
							<UnlockOutlined /> Public
						</Tag>
					) : (
						<Tag color="orange">
							<LockOutlined /> Private
						</Tag>
					)}
				</div>
			),
		},
		props.tabSelected == "ebook"
			? {
					title: "Thumbnail",
					key: "thumbnail",
					render: (d, i, m) => <Image src={d.thumbnail} width={60} />,
			  }
			: undefined,
		{
			title: "Chapter",
			key: "chapter",
			width: 300,
			render: (d, i, m) =>
				_.findIndex(props.chapters, (ch) => ch.chapterId._id === d.chapterId) !== -1 ? (
					bilingualText(
						_.find(props.chapters, (ch) => ch.chapterId._id === d.chapterId).chapterId
							?.name
					)
				) : (
					<Tag color="red">
						<WarningOutlined /> Chapter not found
					</Tag>
				),
		},
		props.tabSelected === "video"
			? {
					title: "Player",
					key: "player",
					width: 180,
					render: (d, i, m) =>
						d.data.source === "vimeo" ? (
							<FaVimeoSquare fontSize={28} color="#00ADEF" />
						) : d.data.source === "youtube" ? (
							<FaYoutube fontSize={28} color="#FF0000" />
						) : (
							<Image style={{ width: 25 }} preview={false} src="/images/jw-icon.png" />
						),
			  }
			: undefined,
		props.tabSelected === "video"
			? {
					title: "Batch",
					key: "batch",
					width: 180,
					render: (d, i, m) => {
						const batchDetails = find(
							batches.liveBatches,
							(b) => b._id === d.liveClassData?.batch
						);
						return batchDetails?.name || "";
					},
			  }
			: undefined,
		props.tabSelected === "video"
			? {
					title: "Staff",
					width: 180,
					key: "staff",
					render: (d, i, m) => {
						const teacherDetail = find(
							instituteStaff?.singleInstitute?.[0]?.staffs,
							(s) => s._id === d.liveClassData?.staff
						);
						return teacherDetail?.user?.name || "";
					},
			  }
			: undefined,
		props.tabSelected === "video"
			? {
					title: "Added at",
					width: 180,
					key: "addedAt",
					render: (d, i, m) => {
						return d.liveClassData?.addedDate
							? moment(d.liveClassData?.addedDate).format("DD-MM-YYYY")
							: "";
					},
			  }
			: undefined,
		{
			title: <div>&nbsp;&nbsp;&nbsp;&nbsp;Action</div>,
			fixed: "right",
			key: "actions",
			width: 180,
			render: (d) => (
				<Space>
					<Tooltip
						placement="top"
						title={!d.public ? "Change Status To Public" : "Change Status To Private"}>
						<Button
							size="small"
							onClick={() =>
								ConfirmAlert(
									() => updatePublicStatus(d, !d.public),
									d.public
										? "This Content Will Be Private?"
										: "This Content Will Be Public?"
								)
							}>
							{d.public ? "Private" : "Public"}
						</Button>
						{/* <EyeOutlined
                            style={{cursor: 'pointer'}} 
                            onClick={() => ConfirmAlert(() => updatePublicStatus(d, !d.public), d.public ? 'This Content Will Be Private?' : 'This Content Will Be Public?')}
                            color={d.public ? 'green' : 'red'}
                        /> */}
					</Tooltip>
					{console.log("d inside actions -->", d)}
					<Tooltip placement="top" title="View">
						<Button
							size="small"
							icon={<EyeOutlined />}
							onClick={
								() => viewAttachment({ data: d, modal: true })
								// props.type === "document" || props.type === "ebook"
								// 	? window.open(d.data.url, "_blank")
								// 	: d.data?.source === "jw"
								// 	? window.open(
								// 			`https://cdn.jwplayer.com/players/${d.data.value}-7RHAqkfq.html`,
								// 			"_blank"
								// 	  )
								// 	: viewAttachment({ data: d, modal: true })
								// window.open(`https://coco.b-cdn.net/videoplayback.mp4`)
							}></Button>
					</Tooltip>
					<Tooltip placement="top" title="Edit">
						<Button
							size="small"
							icon={<EditOutlined />}
							onClick={() => props.editContent(d)}></Button>
						{/* <EditOutlined style={{fontSize: '16px', padding: '5px'}} onClick={() => props.editContent(d)}/> */}
					</Tooltip>
					<Tooltip placement="top" title="Delete">
						<Button
							danger
							size="small"
							icon={<DeleteOutlined />}
							onClick={() =>
								ConfirmAlert(() =>
									dispatch(
										deleteCourseContentAction({
											id: d._id,
											contentId: params.syllabusId,
											type: props.type,
										}),
										"Are You Sure!"
									)
								)
							}></Button>
						{/* <DeleteOutlined style={{fontSize: '16px', padding: '5px'}} onClick={() => ConfirmAlert(() => dispatch(deleteCourseContentAction({id: d._id, contentId: params.syllabusId, type: props.type}), 'Are You Sure!'))}/> */}
					</Tooltip>
				</Space>
			),
		},
	];

	const [data, setData] = useState(_.orderBy(props.tabData, ["order"], ["asc"]));

	useEffect(() => {
		if (courseContentStatus != STATUS.FETCHING) {
			setData(_.orderBy(props.tabData, ["order"], ["asc"]));
			orderChange(false);
		}
	}, [props.tabData]);

	const components = {
		body: {
			row: DragableBodyRow,
		},
	};

	const moveRow = useCallback(
		(dragIndex, hoverIndex) => {
			const dragRow = data[dragIndex];
			setData(
				update(data, {
					$splice: [
						[dragIndex, 1],
						[hoverIndex, 0, dragRow],
					],
				})
			);
			orderChange(true);
		},
		[data]
	);

	const manager = useRef(RNDContext);

	// useEffect(() => {
	//     if(courseContentStatus == STATUS.SUCCESS && orderChangeStatus){
	//         orderChange(false)
	//     }
	// },[courseContentStatus])

	const submitOrder = () => {
		let orderData = { ...data };
		let submitData = {
			contentId: params.syllabusId,
			type: props.type,
			chapterId: orderData[0].chapterId,
			orders: _.map(orderData, (d, i) => {
				return {
					id: d._id,
					order: parseInt(i) + 1,
				};
			}),
		};

		dispatch(updateCourseContentOrderAction(submitData));
	};

	return (
		<div>
			<Alert
				showIcon
				type="warning"
				style={{ fontSize: "12px" }}
				message="drag and drop columns to change content order"
			/>
			<br />
			{props.drawerStatus ? (
				<Table
					bordered
					scroll={{ x: 1000 }}
					pagination={false}
					dataSource={data}
					loading={courseContentStatus == STATUS.FETCHING}
					columns={_.compact(columns)}
					align="left"
				/>
			) : (
				<DndProvider manager={manager.current.dragDropManager}>
					<Table
						bordered
						scroll={{ x: 1100 }}
						pagination={false}
						dataSource={data}
						loading={courseContentStatus == STATUS.FETCHING}
						columns={_.compact(columns)}
						components={components}
						align="left"
						onRow={(record, index) => ({
							index,
							moveRow,
						})}
					/>
				</DndProvider>
			)}
			<br />
			{orderChangeStatus && data?.length > 1 ? (
				<Button block type="primary" onClick={() => submitOrder()}>
					Save Order
				</Button>
			) : null}
			{attachmentModal.modal == true ? (
				<ViewAttachmentModal
					modal={attachmentModal.modal}
					data={attachmentModal.data}
					tabType={props.type}
					closeModal={() => viewAttachment({ data: "", modal: false })}
				/>
			) : null}
		</div>
	);
};

export const ViewAttachmentModal = (props) => {
	const BUNNY_URL =
		`https://iframe.mediadelivery.net/embed/212006/` + `${props.data.data.value}`;

	return (
		<Modal
			visible={props.modal}
			footer={null}
			width="900px"
			onCancel={() => props.closeModal()}>
			<h3>
				<b>{props.data.name}</b>
			</h3>
			<hr />
			<div>
				{props.tabType == "video" ? (
					<iframe
						title="video"
						src={
							props.data.data.source == "vimeo"
								? `https://player.vimeo.com/video/${props.data.data.value}?quality=360p`
								: props.data.data.source === "bunny"
								? BUNNY_URL
								: `https://www.youtube.com/embed/${props.data.data.value}`
						}
						width="100%"
						height="400px"
						frameborder="0"
						allow="autoplay; fullscreen"
						allowfullscreen></iframe>
				) : props.tabType == "text" ? (
					<div dangerouslySetInnerHTML={{ __html: props.data.data.value }} />
				) : props.tabType == "audio" ? (
					<AudioPlayer audio={props.data} />
				) : null}
			</div>
		</Modal>
	);
};

const AudioPlayer = (props) => {
	const [state, setState] = useState({
		firstFrameLoaded: false,
		waiting: true,
		error: false,
	});

	//onLoadedMetadata - metadata loaded
	const firstFrameLoaded = () => {
		setState({ ...state, firstFrameLoaded: true });
	};

	//onWaiting - waiting for audio to load next frames
	const waiting = () => {
		setState({ ...state, waiting: true });
	};

	//onCanPlay - Next Frames loaded
	const loaded = () => {
		setState({ ...state, waiting: false });
	};

	//disable right click on audio
	const handleRightClick = (e) => {
		e.preventDefault();
	};

	//onError - error in loading audio
	const handleError = (e) => {
		setState({ ...state, error: true });
	};

	let { audio } = props;
	return (
		<div>
			<div style={{ textAlign: "center" }}>
				{!state.error ? (
					<audio
						style={
							state.firstFrameLoaded
								? { width: "100%" }
								: { display: "none", width: "100%" }
						}
						onLoadedMetadata={firstFrameLoaded}
						onCanPlay={loaded}
						onWaiting={waiting}
						onError={handleError}
						controls
						autoPlay
						controlsList="nodownload"
						onContextMenu={handleRightClick}
						src={audio.data.url}>
						Your browser does not support the
						<code>audio</code> element.
					</audio>
				) : null}
			</div>
			<div style={{ textAlign: "center" }}>
				{!state.firstFrameLoaded && !state.error ? (
					<Spin size="small" tip="Loading Audio..." />
				) : null}
				{state.error ? (
					<div style={{ textAlign: "center" }}>
						<br />
						<div style={{ textAlign: "center", color: "#ff4d4f" }}>
							Unable to load audio
						</div>
						<br />
						<Button
							ghost={true}
							type="primary"
							icon={<ReloadOutlined />}
							onClick={() => setState({ ...state, error: false })}>
							Try Again
						</Button>
					</div>
				) : null}
			</div>
		</div>
	);
};
