import { Button, Card, Empty, Form, Table, Tag } from "antd";
import Text from "antd/lib/typography/Text";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { STATUS } from "../../Constants";
import { getPackagesAction } from "../../redux/reducers/packages";
import _, { filter } from "lodash";
import { useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { ConfirmAlert, SuccessMessage } from "../../Constants/CommonAlerts";

import moment from "moment";
import { bilingualText, useQueryParams } from "../../utils/FileHelper";
import { customFilter, renderGlobalSearch } from "../../utils/universalHelpers";
import { debounce } from "../../utils/debounce";

export const SpecificPackages = ({ getData, getPackageStudents }) => {
	const dispatch = useDispatch();
	const queries = useQueryParams();

	// To search the table -> need to make it more reusable
	const [searchedText, setSearchedText] = useState("");
	const debouncedSearch = debounce(setSearchedText, 500);

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
		if (queries.get("name") || queries.get("published")) {
			return {
				name: queries.get("name"),
				published: queries.get("published"),
			};
		}

		return {};
	});

	// const [filters, changeFilters] = useState(() => {
	// 	if (queries.get("name") || queries.get("published")) {
	// 		return {
	// 			name: queries.get("name"),
	// 			published: queries.get("published"),
	// 		};
	// 	}

	// 	return {};
	// });

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
		{
			title: <b>Code</b>,
			width: 10,
			dataIndex: "serial",
			key: 8,
			onFilter: (value, record) =>
				customFilter(value, record),
			filteredValue: [searchedText],
		},
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
						<Form layout="vertical"></Form>
						{/* <br />
						<br /> */}
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
						{renderGlobalSearch(
							setSearchedText,
							debouncedSearch
						)}
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
		</div>
	);
};
