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
import React, { createContext, useEffect, useMemo, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuthUser } from "../../App/Context";
import { STATUS } from "../../Constants";
import {
	deletePackageAction,
	getPackagesAction,
} from "../../redux/reducers/packages";
import _, { filter } from "lodash";
import { useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
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
} from "@ant-design/icons";
import Avatar from "antd/lib/avatar/avatar";
import { ConfirmAlert, SuccessMessage } from "../../Constants/CommonAlerts";
import { getAllTestsAction } from "../../redux/reducers/test";
import moment from "moment";
import { bilingualText, useQueryParams } from "../../utils/FileHelper";
import { NotificationModal } from "../Notifications/NotificationModal";
import { TotalCountBox } from "../../components/TotalCountBox";

export const SpecificPackages = ({ getData }, props) => {
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
	console.log("packages", packages);

	const [defaultSyllabus, setDefaultSyllabus] = useState({ exams: [] });
	const [showAction, changeShowAction] = useState();
	const [finalFilters, setFinalFilters] = useState(() => {
		if (queries.get("name") || queries.get("published")) {
			return {
				name: queries.get("name"),
				published: queries.get("published"),
			};
		}

		return {};
	});

	const [filters, changeFilters] = useState(() => {
		if (queries.get("name") || queries.get("published")) {
			return {
				name: queries.get("name"),
				published: queries.get("published"),
			};
		}

		return {};
	});

	// useEffect(() => {
	//     dispatch(getAllProductsAction())
	//     dispatch(getCoursesAction({ instituteId: auth.staff.institute._id }))
	//     dispatch(getAllTestsAction())
	// }, [auth.staff.institute._id, dispatch])

	useEffect(() => {
		if (configData.defaultDataStatus == STATUS.SUCCESS) {
			let defaultData = configData.defaultData;
			if (defaultData)
				setDefaultSyllabus({
					exams: defaultData.exams,
				});
		}
	}, [configData.defaultData, configData.defaultDataStatus]);

	const [notifyModal, openNotifyModal] = useState();

	const sendMessage = (id) => {
		let pkg = packages.packagesList?.length
			? _.find(packages.packagesList, (p) => p._id == id)
			: null;

		openNotifyModal(pkg);
		changeShowAction(false);
	};

	const columns = [
		{ title: <b>Code</b>, width: 10, dataIndex: "serial", key: 8 },
		{
			title: <b>Package</b>,
			dataIndex: "package",
			key: 2,
			width: 280,
			render: (d) => <Text>{bilingualText(d)}</Text>,
		},
		{
			title: <b>Published</b>,
			width: 10,
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
			title: <b>Created At</b>,
			dataIndex: "createdAt",
			key: "createdAt",
			width: 10,
		},
		{
			title: <b>Students</b>,
			dataIndex: "studentCount",
			render: (d) => d || 0,
			key: "studentCount",
			width: 20,
		},
	];

	let dataSource = useMemo(() => {
		return packages.packagesList?.length
			? _.orderBy(
					packages.packagesList,
					["createdAt"],
					["desc"]
			  ).map((pkg) => ({
					key: pkg._id,
					package: pkg.name,
					published: pkg.published,
					serial: pkg.serial,
					createdAt: moment(pkg.createdAt).format(
						"DD-MM-YYYY"
					),
					studentCount: pkg.studentCount,
			  }))
			: [];
	}, [packages.packagesList]);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const onSelectChange = (newSelectedRowKeys, a, b) => {
		setSelectedRowKeys(newSelectedRowKeys);
	};
	const [loading, setLoading] = useState(false);

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};
	const hasSelected = selectedRowKeys.length > 0;

	const selectPublish = (e) => {
		changeFilters((a) => ({ ...a, published: e }));
	};
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
		let { published, name } = filters;
		let string = "";

		function setQuery(key, value) {
			if (string) string = string + `&${key}=${value}`;
			else string = `?${key}=${value}`;
		}

		if (published || published === 0)
			setQuery("published", published);

		if (name) setQuery("name", name);

		history.push({
			pathname: "/survey-feedback/*/",
			search: string,
		});

		let data = { published, name: name };
		setFinalFilters(data);
	};

	const searchPackage = (e) => {
		changeFilters((a) => ({ ...a, name: e.target.value }));
	};

	const clearData = () => {
		changeFilters({});
		setFinalFilters({});
		history.push({
			pathname: "/survey-feedback/*",
			search: null,
		});
	};
	const submitData = () => {
		const data = selectedRowKeys.map((i) =>
			dataSource.filter((d) => d.key === i)
		);
		getData(data);
		SuccessMessage("Selected");
	};

	return (
		<div>
			<Card
				loading={
					configData.defaultDataStatus ==
						STATUS.FETCHING ||
					products.allProductStatus ==
						STATUS.FETCHING ||
					course.getCoursesStatus ==
						STATUS.FETCHING
				}
				id="specificpackages"
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
						<div
							style={{
								marginBottom: 16,
							}}
						>
							<Button
								type="primary"
								disabled={
									!hasSelected
								}
								loading={
									loading
								}
								onClick={
									submitData
								}
							>
								Set
							</Button>
							<span
								style={{
									marginLeft: 8,
								}}
							>
								{hasSelected
									? `Selected ${selectedRowKeys.length} items`
									: ""}
							</span>
						</div>

						<Table
							bordered
							loading={
								packages.getPackagesStatus ===
								STATUS.FETCHING
							}
							dataSource={dataSource}
							columns={columns}
							key={dataSource?.length}
							rowSelection={
								rowSelection
							}
						/>
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
