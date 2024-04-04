import {
	Button,
	Card,
	Col,
	Empty,
	Form,
	Image,
	Input,
	List,
	Popover,
	Row,
	Select,
	Table,
	Tag,
} from "antd";
import Text from "antd/lib/typography/Text";
import React, { useEffect, useMemo, useReducer, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuthUser } from "../../App/Context";
import { CommonPageHeader } from "../../components/CommonPageHeader";
import { STATUS } from "../../Constants";
import {
	deletePackageAction,
	getPackagesAction,
} from "../../redux/reducers/packages";
import _, { filter } from "lodash";
import { useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { getAllProductsAction } from "../../redux/reducers/products";
import { getCoursesAction } from "../../redux/reducers/courses";
import {
	ControlOutlined,
	DeleteOutlined,
	EditOutlined,
	PictureOutlined,
	InsertRowBelowOutlined,
	CloseCircleOutlined,
	MessageOutlined,
	UserOutlined,
	RedoOutlined,
	SearchOutlined,
} from "@ant-design/icons";
import Avatar from "antd/lib/avatar/avatar";
import { ConfirmAlert } from "../../Constants/CommonAlerts";
import { getAllTestsAction } from "../../redux/reducers/test";
import moment from "moment";
import { bilingualText, useQueryParams } from "../../utils/FileHelper";
import { NotificationModal } from "../Notifications/NotificationModal";
import { ROUTES } from "../../Constants/Routes";
import { TotalCountBox } from "../../components/TotalCountBox";
import { FormReducer } from "../../utils/FormReducer";
import Highlighter from "react-highlight-words";
import { CSVLink } from "react-csv";
import { render } from "less";
import { debounce } from "../../utils/debounce";
import {
	Search,
	customFilter,
	customSorterString,
	renderGlobalSearch,
} from "../../utils/universalHelpers";

export const ManagePackages = () => {
	const dispatch = useDispatch();
	const auth = useAuthUser();
	const history = useHistory();
	const params = useParams();
	let location = useLocation();
	const queries = useQueryParams();

	const publishStatuses = ["No", "Yes", "Coming Soon"];
	const { packages, configData, products, course, testsList } =
		useSelector((state) => ({
			packages: state.packages,
			configData: state.lmsConfig,
			products: state.product,
			course: state.course,
			testsList: state.test?.testsList,
		}));

	const [defaultSyllabus, setDefaultSyllabus] = useState({ exams: [] });
	const [showAction, changeShowAction] = useState();
	const [finalFilters, setFinalFilters] = useState(() => {
		if (
			queries.get("name") ||
			queries.get("exams") ||
			queries.get("type") ||
			queries.get("published")
		) {
			return {
				name: queries.get("name"),
				exams: queries.get("exams"),
				type: queries.get("type"),
				published: queries.get("published"),
			};
		}

		return {};
	});

	const [filters, changeFilters] = useState(() => {
		if (
			queries.get("name") ||
			queries.get("exams") ||
			queries.get("type") ||
			queries.get("published")
		) {
			return {
				name: queries.get("name"),
				exams: queries.get("exams"),
				type: queries.get("type"),
				published: queries.get("published"),
			};
		}

		return {};
	});

	// const [published, setPublished] = useState()
	// const [contentType, setContentType] = useState()
	// const [exam, setExam] = useState()
	// const [searchName, changeSearchName] = useState()

	// const [filtersData, changeFiltersData] = useReducer(FormReducer, {})

	useEffect(() => {
		// dispatch(getPackagesAction())
		dispatch(getAllProductsAction());
		dispatch(
			getCoursesAction({
				instituteId: auth?.staff.institute._id,
			})
		);
		dispatch(getAllTestsAction());
	}, [auth, dispatch]);

	// useEffect(() => {
	//     if(!params.pageNumber)
	//         history.push('/list-packages/1')
	// }, [params.pageNumber])

	useEffect(() => {
		if (configData.defaultDataStatus == STATUS.SUCCESS) {
			let defaultData = configData.defaultData;
			if (defaultData)
				setDefaultSyllabus({
					exams: defaultData.exams,
				});
		}
	}, [configData.defaultData, configData.defaultDataStatus]);

	const updatePackage = (id) => {
		history.push("/update-package/1/" + id);
	};

	const previewPackage = (id) => {
		history.push(`/preview-package/${id}/true`);
	};

	const toggleAction = (id) => {
		changeShowAction(id == showAction ? null : id);
	};

	const deletePackage = (id) => {
		changeShowAction(false);
		ConfirmAlert(
			() => dispatch(deletePackageAction({ id })),
			"Sure?"
		);
	};

	const [notifyModal, openNotifyModal] = useState();

	const sendMessage = (id) => {
		let pkg = packages.packagesList?.length
			? _.find(packages.packagesList, (p) => p._id == id)
			: null;

		openNotifyModal(pkg);
		changeShowAction(false);
	};

	const pkgStudents = (id) => {
		history.push("/package-students/" + id);
	};

	const actionsList = [
		{
			title: "Edit Package",
			id: 3,
			callback: updatePackage,
			icon: <EditOutlined />,
		},
		{
			title: "Preview Package",
			id: 3,
			callback: previewPackage,
			icon: <InsertRowBelowOutlined />,
		},
		{
			title: "Notify Users",
			id: 4,
			callback: sendMessage,
			icon: <MessageOutlined />,
		},
		{
			title: "Students",
			id: 5,
			callback: pkgStudents,
			icon: <UserOutlined />,
		},
		{
			title: "Delete Package",
			id: 6,
			icon: <DeleteOutlined />,
			callback: (e) => deletePackage(e),
		},
	];

	// const [searchText, setSearchText] = useState("");
	// const [searchedColumn, setSearchedColumn] = useState("");
	// const searchInput = useRef(null);

	// function handleSearch(selectedKeys, confirm, dataIndex) {
	// 	console.log("data index from handle serch >", dataIndex);
	// 	setSearchText(selectedKeys[0]);
	// 	setSearchedColumn(dataIndex);
	// 	confirm();
	// }

	// const handleReset = (clearFilters) => {
	// 	clearFilters();
	// 	setSearchText("");
	// };

	// global search functionality
	const [searchedText, setSearchedText] = useState("");

	const debouncedSearch = debounce(setSearchedText, 500);

	// const renderGlobalSearch = () => {
	// 	return (
	// 		<Input.Search
	// 			placeholder="Search"
	// 			onSearch={(value) => {
	// 				setSearchedText(value);
	// 			}}
	// 			onChange={(e) => {
	// 				debouncedSearch(e.target.value);
	// 			}}
	// 		/>
	// 	);
	// };

	// const getColumnSearchProps = (dataIndex) => ({
	// 	filterDropdown: ({
	// 		setSelectedKeys,
	// 		selectedKeys,
	// 		confirm,
	// 		clearFilters,
	// 		close,
	// 	}) => (
	// 		<div
	// 			style={{
	// 				padding: 8,
	// 			}}
	// 			onKeyDown={(e) => e.stopPropagation()}
	// 		>
	// 			<Input
	// 				ref={searchInput}
	// 				placeholder={`Search ${dataIndex}`}
	// 				value={selectedKeys[0]}
	// 				onChange={(e) =>
	// 					setSelectedKeys(
	// 						e.target.value
	// 							? [
	// 									e
	// 										.target
	// 										.value,
	// 							  ]
	// 							: []
	// 					)
	// 				}
	// 				onPressEnter={() =>
	// 					handleSearch(
	// 						selectedKeys,
	// 						confirm,
	// 						dataIndex
	// 					)
	// 				}
	// 				style={{
	// 					marginBottom: 8,
	// 					display: "block",
	// 				}}
	// 			/>

	// 			<Button
	// 				type="primary"
	// 				onClick={() =>
	// 					handleSearch(
	// 						selectedKeys,
	// 						confirm,
	// 						dataIndex
	// 					)
	// 				}
	// 				icon={<SearchOutlined />}
	// 				size="small"
	// 				style={{
	// 					width: 90,
	// 				}}
	// 			>
	// 				Search
	// 			</Button>
	// 			<Button
	// 				onClick={() =>
	// 					clearFilters &&
	// 					handleReset(clearFilters)
	// 				}
	// 				size="small"
	// 				style={{
	// 					width: 90,
	// 				}}
	// 			>
	// 				Reset
	// 			</Button>
	// 			<Button
	// 				type="link"
	// 				size="small"
	// 				onClick={() => {
	// 					close();
	// 				}}
	// 			>
	// 				close
	// 			</Button>
	// 		</div>
	// 	),
	// 	filterIcon: (filtered) => (
	// 		<SearchOutlined
	// 			style={{
	// 				color: filtered ? "#1677ff" : undefined,
	// 			}}
	// 		/>
	// 	),
	// 	onFilter: (value, record) => {
	// 		console.log("record -->", record);
	// 		return (
	// 			record.serial
	// 				.toString()
	// 				.toLowerCase()
	// 				.includes(value.toLowerCase()) ||
	// 			record.studentCount
	// 				.toString()
	// 				.toLowerCase()
	// 				.includes(value.toLowerCase())
	// 		);
	// 	},
	// 	// onFilterDropdownOpenChange: (visible) => {
	// 	// 	if (visible) {
	// 	// 		setTimeout(
	// 	// 			() => searchInput.current?.select(),
	// 	// 			100
	// 	// 		);
	// 	// 	}
	// 	// },
	// 	render: (text) =>
	// 		searchedColumn === dataIndex ? (
	// 			<Highlighter
	// 				highlightStyle={{
	// 					backgroundColor: "#ffc069",
	// 					padding: 0,
	// 				}}
	// 				searchWords={[searchText]}
	// 				autoEscape
	// 				textToHighlight={
	// 					text ? text.toString() : ""
	// 				}
	// 			/>
	// 		) : (
	// 			text
	// 		),
	// });

	const columns = [
		{
			title: <b>Code</b>,
			width: 100,
			fixed: "left",
			dataIndex: "serial",
			sorter: (a, b) => customSorterString(a, b),
			filteredValue: [searchedText],
			onFilter: (value, record) =>
				customFilter(value, record),
			key: 8,
		},
		{
			title: <b>Package</b>,
			fixed: "left",
			dataIndex: "package",
			key: 2,
			render: (d) => <Text>{bilingualText(d)}</Text>,
		},
		{
			title: <b>Published</b>,
			width: 120,
			dataIndex: "published",
			key: 5,
			render: (d) => (
				<Tag
					color={
						d == 1
							? "green"
							: d == 0
							? "red"
							: d == 2
							? "orange"
							: "red"
					}
				>
					{publishStatuses[d || 0]}
				</Tag>
			),
		},
		{
			title: <b>Price</b>,
			dataIndex: "price",
			key: 6,
			width: 120,
			render: (d) => {
				return (
					<div>
						{d.isSubscription ? (
							<span>
								subscription
							</span>
						) : (
							<>
								<span
									style={{
										color: "green",
									}}
								>
									₹{" "}
									{
										d.price
									}
								</span>
								<br />
								{d.fakePrice ? (
									<span
										style={{
											color: "red",
											textDecoration:
												"line-through",
										}}
									>
										₹{" "}
										{
											d.fakePrice
										}
									</span>
								) : null}
							</>
						)}
					</div>
				);
			},
		},
		{
			title: <b>Created At</b>,
			dataIndex: "createdAt",
			key: "createdAt",
			width: 110,
			// sorter: (a, b) => {
			// 	const serialA = String(a.serial);
			// 	const serialB = String(b.serial);

			// 	return serialA.localeCompare(serialB);
			// },
		},
		{
			title: <b>Students</b>,
			dataIndex: "studentCount",
			render: (d) => d || 0,
			key: "studentCount",
			width: 110,
		},
		{
			title: <b>Cover</b>,
			width: 100,
			dataIndex: "cover",
			key: 0,
			render: (data) => {
				let props = { src: data };
				return data ? (
					<Image
						style={{
							borderRadius: "50%",
							width: "60px",
							cursor: "pointer",
							height: "60px",
							border: "1px solid #444",
						}}
						size={50}
						{...props}
					/>
				) : (
					<PictureOutlined
						style={{
							fontSize: "30px",
							background: "#444",
							color: "white",
							borderRadius: "50%",
							padding: "10px",
						}}
					/>
				);
			},
		},
		{
			title: <b>Lead Capture</b>,
			width: 100,
			key: "leadCapture",
			render: (data) => {
				return data.content.leadCaptureEnabled ? (
					<Tag color={"green"}>Enabled</Tag>
				) : (
					<Tag color={"red"}>Disabled</Tag>
				);
			},
		},
		{
			title: <b>Priority</b>,
			width: 100,
			dataIndex: "priority",
			key: 1,
		},
		{
			title: <b>Exams</b>,
			dataIndex: "exams",
			key: 3,
			render: (ids) => {
				const exams = _.intersectionBy(
					defaultSyllabus.exams,
					ids.map((d) => ({ _id: d })),
					"_id"
				);
				return (
					<div>
						{exams.length
							? exams.map((exam) => (
									<Tag>
										{
											exam
												.name
												.en
										}
									</Tag>
							  ))
							: null}
					</div>
				);
			},
		},
		{
			title: <b>Content type</b>,
			dataIndex: "content",
			key: 4,
			render: (d) => {
				const tests = _.intersectionBy(
					testsList,
					d.tests.map((c) => ({ _id: c.test })),
					"_id"
				);
				const courses = _.intersectionBy(
					course.courseList,
					d.courses.map((c) => ({ _id: c })),
					"_id"
				);
				const books = _.intersectionBy(
					products.productsData?.BOOK,
					d.books.map((c) => ({ _id: c })),
					"_id"
				);
				const drives = _.intersectionBy(
					products.productsData?.DRIVE,
					d.drives.map((c) => ({ _id: c })),
					"_id"
				);
				const magazines = _.intersectionBy(
					products.productsData?.MAGAZINE,
					d.magazines.map((c) => ({ _id: c })),
					"_id"
				);
				return (
					<>
						{/*{tests.length ? <div><b>Tests:</b> {_.join(tests.map(d => d?.name?.en, ', '))}</div> : null}
                        {courses.length ? <div><b>Courses:</b> {_.join(courses.map(d => d.name, ', '))}</div> : null}
                        {books.length ? <div><b>Books:</b> {_.join(books.map(d => d.name.en, ', '))}</div> : null}
                        {drives.length ? <div><b>Drives:</b> {_.join(drives.map(d => d.name.en, ', '))}</div> : null}
                        {magazines.length ? <div><b>Magazines:</b> {_.join(magazines.map(d => d.name.en, ', '))}</div> : null}*/}
						{tests.length ? (
							<div>
								<b>Tests:</b>{" "}
								{tests.length}
							</div>
						) : null}
						{courses.length ? (
							<div>
								<b>Courses:</b>{" "}
								{courses.length}
							</div>
						) : null}
						{books.length ? (
							<div>
								<b>Books:</b>{" "}
								{books.length}
							</div>
						) : null}
						{drives.length ? (
							<div>
								<b>Drives:</b>{" "}
								{drives.length}
							</div>
						) : null}
						{magazines.length ? (
							<div>
								<b>
									Magazines:
								</b>
								{
									magazines.length
								}
							</div>
						) : null}
					</>
				);
			},
		},
		{
			title: <b>Actions</b>,
			width: 110,
			fixed: "right",
			dataIndex: "actions",
			key: 7,
			render: (d) => {
				return (
					<Popover
						trigger="click"
						placement="bottom"
						visible={showAction == d._id}
						onVisibleChange={() =>
							toggleAction(d._id)
						}
						content={
							<List
								dataSource={
									actionsList
								}
								renderItem={(
									item
								) => (
									<List.Item
										onClick={() =>
											item.callback(
												d._id
											)
										}
										className="hover-list-item"
										style={{
											cursor: "pointer",
										}}
									>
										<span
											style={{
												marginRight:
													"10px",
											}}
										>
											{
												item.icon
											}
										</span>
										{
											item.title
										}
									</List.Item>
								)}
							/>
						}
					>
						<Button shape="round">
							Actions
						</Button>
					</Popover>
				);
			},
		},
	];

	let dataSource = useMemo(() => {
		return packages.packagesList?.length
			? _.orderBy(
					packages.packagesList,
					["createdAt"],
					["desc"]
			  ).map((pkg) => ({
					priority: pkg.priority,
					package: pkg.name,
					exams: pkg.exams,
					content: pkg,
					published: pkg.published,
					price: {
						price: pkg.price,
						fakePrice: pkg.fakePrice,
						isSubscription:
							pkg.priceMode === "sub",
					},
					actions: pkg,
					serial: pkg.serial,
					createdAt: moment(pkg.createdAt).format(
						"DD-MM-YYYY"
					),
					cover: pkg.carousel.length
						? pkg.carousel[0]
						: null,
					studentCount: pkg.studentCount,
			  }))
			: [];
	}, [packages.packagesList]);

	const contentTypes = ["TEST", "COURSE", "BOOK", "MAGAZINE", "DRIVE"];

	const selectPublish = (e) => {
		changeFilters((a) => ({ ...a, published: e }));
	};

	const selectContentType = (e) => {
		changeFilters((a) => ({ ...a, type: e }));
	};

	const selectExam = (e) => {
		changeFilters((a) => ({ ...a, exams: e }));
	};

	// useEffect(() => {
	//     let data = {}
	//     if(queries.get('name') || queries.get('exams') || queries.get('type') || queries.get('published')){
	//         data ={name:queries.get('name'), exams:queries.get('exams'), type:queries.get('type'), published:queries.get('published')}

	//         setFinalFilters(data)
	//         changeFilters(data)
	//     }
	// }, [])

	useEffect(() => {
		let data = {};
		if (finalFilters)
			data = {
				...finalFilters,
				exams: finalFilters.exams
					? [finalFilters.exams]
					: [],
			};

		dispatch(getPackagesAction(data));
	}, [finalFilters, dispatch]);

	const filterPackages = () => {
		let { exams, type, published, name } = filters;
		let string = "";

		function setQuery(key, value) {
			if (string) string = string + `&${key}=${value}`;
			else string = `?${key}=${value}`;
		}

		if (exams?.length) setQuery("exams", exams);

		if (type) setQuery("type", type);

		if (published || published === 0)
			setQuery("published", published);

		if (name) setQuery("name", name);

		history.push({ pathname: "/list-packages/1", search: string });

		let data = { exams: exams, type: type, published, name: name };
		setFinalFilters(data);
	};

	const searchPackage = (e) => {
		changeFilters((a) => ({ ...a, name: e.target.value }));
	};

	const clearData = () => {
		changeFilters({});
		setFinalFilters({});
		history.push({ pathname: "/list-packages/1", search: null });
	};

	const changePage = (e) => {
		console.log(e, "<--- event");
		history.push({
			pathname: "/list-packages/" + e.current,
			search: location.search,
		});
	};

	const csvData = dataSource.map((row) => ({
		Code: row.serial,
		Package: row.package?.en,
		Published: row.published,
		Students: row.studentCount,
		Priority: row.priority,
		Exams: row.exams[0],
	}));

	return (
		<div>
			<CommonPageHeader title="Manage Packages" />
			<br />
			<Card
				loading={
					configData.defaultDataStatus ==
						STATUS.FETCHING ||
					products.allProductStatus ==
						STATUS.FETCHING ||
					course.getCoursesStatus ==
						STATUS.FETCHING
				}
			>
				{configData.defaultDataStatus ==
					STATUS.SUCCESS ||
				products.allProductStatus == STATUS.SUCCESS ||
				course.getCoursesStatus == STATUS.SUCCESS ? (
					<div>
						<Form layout="vertical">
							<Card
								bodyStyle={{
									padding: "10px",
								}}
							>
								{/* <div style={{fontWeight:'bold', fontSize:'18px', marginBottom:'10px'}}><Text>Filters</Text></div> */}
								<Row>
									<Col
										span={
											3
										}
									>
										<Form.Item label="Search Name">
											<Input
												placeholder="Enter Package Name"
												value={
													filters.name
												}
												onChange={
													searchPackage
												}
											/>
										</Form.Item>
									</Col>
									<Col
										span={
											3
										}
										offset={
											1
										}
									>
										<Form.Item label="Content Type">
											<Select
												placeholder="Select Content Type"
												value={
													filters.type
												}
												allowClear
												onChange={
													selectContentType
												}
											>
												{contentTypes.map(
													(
														type,
														i
													) => (
														<Select.Option
															value={
																type
															}
															key={
																i
															}
														>
															{
																type
															}
														</Select.Option>
													)
												)}
											</Select>
										</Form.Item>
									</Col>
									<Col
										span={
											3
										}
										offset={
											1
										}
									>
										<Form.Item label="Published Status">
											<Select
												onChange={
													selectPublish
												}
												allowClear
												value={
													filters.published
												}
												placeholder="Select Published Status"
											>
												<Select.Option
													value={
														0
													}
												>
													No
												</Select.Option>
												<Select.Option
													value={
														1
													}
												>
													Yes
												</Select.Option>
												<Select.Option
													value={
														2
													}
												>
													Coming
													Soon
												</Select.Option>
											</Select>
										</Form.Item>
									</Col>
									<Col
										span={
											3
										}
										offset={
											1
										}
									>
										<Form.Item label="Exams">
											<Select
												onChange={
													selectExam
												}
												allowClear
												value={
													filters.exams
												}
												placeholder="Select Exam"
											>
												{configData
													.defaultData
													?.exams
													.length
													? configData.defaultData.exams.map(
															(
																exam
															) => (
																<Select.Option
																	key={
																		exam._id
																	}
																>
																	{
																		exam
																			.name
																			.en
																	}
																</Select.Option>
															)
													  )
													: null}
											</Select>
										</Form.Item>
									</Col>
									<Col
										span={
											5
										}
										offset={
											1
										}
										style={{
											paddingTop: "28px",
										}}
									>
										<Button
											onClick={
												filterPackages
											}
										>
											Apply
										</Button>
										<Button
											style={{
												marginLeft: "10px",
											}}
											icon={
												<RedoOutlined />
											}
											onClick={
												clearData
											}
										>
											Reset
										</Button>
									</Col>
								</Row>
							</Card>
						</Form>
						<br />
						<TotalCountBox
							count={
								dataSource?.length
							}
						/>
						<br />

						{renderGlobalSearch(
							setSearchedText,
							debouncedSearch
						)}
						<Table
							bordered
							scroll={{ x: 1800 }}
							loading={
								packages.getPackagesStatus ===
								STATUS.FETCHING
							}
							dataSource={dataSource}
							columns={columns}
							key={dataSource?.length}
							pagination={{
								position: [
									"bottomCenter",
								],
								current:
									parseInt(
										params?.pageNumber
									) || 1,
							}}
							onChange={changePage}
						/>
						<CSVLink
							filename="export.csv"
							data={csvData}
						>
							Export to CSV
						</CSVLink>
					</div>
				) : (
					<Empty />
				)}
			</Card>
			{notifyModal ? (
				<NotificationModal
					visible={notifyModal}
					closeModal={() => sendMessage()}
					notifiableType="Package"
					notifiableIds={[notifyModal]}
				/>
			) : null}
		</div>
	);
};
