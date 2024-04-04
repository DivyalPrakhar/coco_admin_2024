import { EditFilled, PlusOutlined } from "@ant-design/icons";
import {
	Button,
	Card,
	Col,
	DatePicker,
	Form,
	Input,
	Modal,
	Radio,
	Row,
	Select,
	Space,
	Table,
	Tag,
	Tooltip,
} from "antd";
import { find, map } from "lodash";
import moment from "moment";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { CommonPageHeader } from "../../components/CommonPageHeader";
import { STATUS } from "../../Constants";
import {
	getEnquiryAction,
	updateEnquiryAction,
} from "../../redux/reducers/offlineEnquiry/Enquiry";
import { getOfflineCourseAction } from "../../redux/reducers/offlineEnquiry/OfflineCourse";
import { useCheckStatus } from "../../utils/useCheckStatus";
import EnquiryRemarkList from "./EnquiryRemarkList";

export default function ListEnquiry() {
	const dispatch = useDispatch();
	const [form] = Form.useForm();
	const history = useHistory();
	const [toggleEditEnquiryModal, setToggleEditEnquiryModal] =
		useState(null);
	const [toggleRemarksDrawer, setToggleRemarkDrawer] = useState(null);
	const [filterInput, setFilterInput] = useState();

	useEffect(() => {
		dispatch(getEnquiryAction());
		dispatch(getOfflineCourseAction());
	}, [dispatch]);

	const handleFilter = (d) => {
		let data = d.current
			? { page: d.current }
			: {
					...d,
					page: 1,
					startDate: d?.startDate
						? moment(d.startDate).format(
								"YYYY-MM-DD"
						  )
						: "",
					endDate: d?.endDate
						? moment(d.endDate).format(
								"YYYY-MM-DD"
						  )
						: "",
			  };
		setFilterInput((pre) => ({ ...pre, ...data }));
	};

	useEffect(() => {
		dispatch(getEnquiryAction(filterInput));
	}, [dispatch, filterInput]);

	const resetFields = () => {
		form.resetFields();
		setFilterInput();
		dispatch(getEnquiryAction());
	};

	const { allEnquirys, getEnquiryStatus } = useSelector((s) => s.enquiry);
	const { allOfflineCourses, getOfflineCourseStatus } = useSelector(
		(s) => s.offlineCourse
	);

	const _studentProfile = (id) => {
		history.push("student/profile/" + id);
	};

	const columns = [
		{
			title: "Name",
			dataIndex: "user",
			key: "_id",
			render: (d) => (
				<Row
					style={{
						cursor: "pointer",
						color: "blue",
					}}
					onClick={() => _studentProfile(d._id)}
				>
					{d.name}
				</Row>
			),
		},
		{
			title: "Email",
			dataIndex: "user",
			key: "_id",
			render: (d) => d?.email,
		},
		{
			title: "Contact",
			dataIndex: "user",
			key: "_id",
			render: (d) => d?.contact,
		},
		{
			title: "Course",
			dataIndex: "course",
			key: "_id",
			render: (d) =>
				find(
					allOfflineCourses,
					(course) => course._id === d
				)?.name || "-",
		},
		// {
		//     title: 'Remark',
		//     dataIndex: 'remark',
		//     width: '500',
		//     key: '_id',
		// },
		{
			title: "Created At",
			dataIndex: "createdAt",
			key: "_id",
			render: (d) =>
				d ? moment(d).format("DD-MM-YYYY") : "-",
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "_id",
			render: (d) => (
				<div>
					{d === "OPEN" ? (
						<Tag color="#87d068">OPEN</Tag>
					) : d === "CHEQUE_PAYMENT" ? (
						<Tag color="#87d068">
							CHEQUE PAYMENT
						</Tag>
					) : d === "CLOSED" ? (
						<Tag color="#f50">CLOSED</Tag>
					) : d === "ADMITTED" ? (
						<Tag color="#1677ff">
							ADMITTED
						</Tag>
					) : null}
				</div>
			),
		},
		{
			title: "Action",
			dataIndex: "",
			width: 180,
			key: "_id",
			render: (d) => {
				return (
					<div>
						<Space>
							<Tooltip title="Edit">
								<Button
									icon={
										<EditFilled
											style={{
												color: "#1890ff",
											}}
										/>
									}
									onClick={() =>
										setToggleEditEnquiryModal(
											d
										)
									}
								></Button>
							</Tooltip>
							{/* <Tooltip title='Delete'>
                                <Button icon={<DeleteTwoTone twoToneColor='#eb2f96' />}></Button>
                            </Tooltip> */}
							<Tooltip title="View Remarks">
								<Button
									onClick={() =>
										setToggleRemarkDrawer(
											d
										)
									}
								>
									Remarks
								</Button>
							</Tooltip>
						</Space>
					</div>
				);
			},
		},
	];

	const closeModal = () => {
		setToggleEditEnquiryModal(null);
	};

	const closeDrawer = () => {
		setToggleRemarkDrawer(null);
	};
	return (
		<div>
			<CommonPageHeader
				title="List Enquiry"
				extra={
					<Button
						shape="round"
						icon={<PlusOutlined />}
						onClick={() =>
							history.push(
								"/enquiry-form"
							)
						}
						size="large"
					>
						Add New Enquiry
					</Button>
				}
			/>
			<br />
			<Card>
				<Row>
					<Form
						form={form}
						// labelCol={{ span: 8 }}
						// wrapperCol={{ span: 16 }}
						layout="horizontal"
						size="medium"
						onFinish={handleFilter}
					>
						<Row align="bottom">
							<Col
								style={{
									width: "70%",
								}}
							>
								<Space>
									<CustomInput
										label="Name"
										name="name"
										width="200px"
										placeholder="Name"
									/>
									<CustomInput
										label="Contact"
										name="contact"
										width="200px"
										placeholder="Contact"
										labelCol={{
											span: 6,
										}}
									/>
									<Form.Item
										label="Course"
										name="course"
										labelCol={{
											offset: 1,
											span: 7,
										}}
									>
										<Select
											style={{
												width: 200,
											}}
											showSearch
											allowClear
											placeholder="Select Course"
										>
											{map(
												allOfflineCourses,
												(
													course
												) => (
													<Select.Option
														value={
															course._id
														}
													>
														{
															course.name
														}
													</Select.Option>
												)
											)}
										</Select>
									</Form.Item>
								</Space>
								<Space>
									<Form.Item
										label="Status"
										name="status"
									>
										<Select
											style={{
												width: 200,
											}}
											showSearch
											allowClear
											placeholder="Select Status"
										>
											<Select.Option
												value={
													"OPEN"
												}
											>
												OPEN
											</Select.Option>
											<Select.Option
												value={
													"CLOSED"
												}
											>
												CLOSED
											</Select.Option>
											<Select.Option
												value={
													"ADMITTED"
												}
											>
												ADMITTED
											</Select.Option>
										</Select>
									</Form.Item>
									<Form.Item
										label="Start Date"
										name="startDate"
										labelCol={{
											offset: 0,
											span: 6,
										}}
									>
										<DatePicker
											style={{
												width: 200,
											}}
											name
											placeholder="Start Date"
										/>
									</Form.Item>
									<Form.Item
										label="End Date"
										name="endDate"
										labelCol={{
											offset: 0,
											span: 6,
										}}
									>
										<DatePicker
											style={{
												width: 200,
											}}
											name
											placeholder="End Date"
										/>
									</Form.Item>
								</Space>
							</Col>
							<Col
								style={{
									width: "30%",
								}}
							>
								<Row>
									<Form.Item>
										<Button
											type="primary"
											span={
												4
											}
											htmlType="submit"
										>
											Apply
										</Button>
									</Form.Item>
									<Form.Item
										wrapperCol={{
											offset: 3,
										}}
									>
										<Button
											span={
												4
											}
											onClick={
												resetFields
											}
										>
											Reset
										</Button>
									</Form.Item>
								</Row>
							</Col>
						</Row>
					</Form>
				</Row>
				{/* <Table
					size="small"
					dataSource={allEnquirys?.docs}
					sortDirections={"descend"}
					columns={columns}
					loading={
						getEnquiryStatus ===
							STATUS.FETCHING ||
						getOfflineCourseStatus ===
							STATUS.FETCHING
					}
					pagination={{
						total: allEnquirys?.total,
						pageSize: 10,
						showSizeChanger: false,
						current: parseInt(
							allEnquirys?.page
						),
						position: ["bottomCenter"],
					}}
					onChange={handleFilter}
				/> */}
			</Card>
			{toggleEditEnquiryModal && (
				<EditEnquiry
					data={toggleEditEnquiryModal}
					closeModal={closeModal}
				/>
			)}
			{toggleRemarksDrawer && (
				<EnquiryRemarkList
					data={toggleRemarksDrawer}
					closeDrawer={closeDrawer}
				/>
			)}
		</div>
	);
}

const EditEnquiry = ({ data, closeModal }) => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();

	const updateEnquiry = (d) => {
		const enquiry = {
			id: data._id,
			status: d.status,
			remark: d.remark,
		};
		dispatch(updateEnquiryAction(enquiry));
	};

	const { updateEnquiryStatus } = useSelector((s) => s.enquiry);

	useCheckStatus({
		status: updateEnquiryStatus,
		onSuccess: () => {
			closeModal();
		},
	});
	return (
		<Modal
			width={700}
			title="Update Enquiry"
			okText="Upload"
			visible={data ? true : false}
			footer={false}
			onCancel={closeModal}
		>
			<Card>
				<Form
					form={form}
					labelCol={{ span: 4 }}
					wrapperCol={{ span: 14 }}
					layout="horizontal"
					size="large"
					onFinish={updateEnquiry}
				>
					<Card style={{ padding: 0, border: 0 }}>
						<Form.Item
							label="Status"
							initialValue={
								data?.status
							}
							rules={[
								{
									required: true,
									message: "Please pick a status.",
								},
							]}
							name="status"
						>
							<Radio.Group required>
								<Radio.Button
									required
									value="OPEN"
								>
									OPEN
								</Radio.Button>
								<Radio.Button
									required
									value="CLOSED"
								>
									CLOSED
								</Radio.Button>
								{/* <Radio.Button required value="ADMITTED">ADMITTED</Radio.Button> */}
							</Radio.Group>
						</Form.Item>
						<Form.Item
							label="Remark"
							rules={[
								{
									required: true,
									message: "Please fill in the field.",
								},
							]}
							name="remark"
						>
							<Input.TextArea placeholder="Write remark here..." />
						</Form.Item>
					</Card>
					<Form.Item wrapperCol={{ offset: 15 }}>
						<Space>
							<Button
								type=""
								span={4}
								onClick={
									closeModal
								}
							>
								Cancel
							</Button>
							<Button
								span={4}
								type="primary"
								htmlType="submit"
							>
								Update
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</Card>
		</Modal>
	);
};

const CustomInput = ({
	label,
	required,
	name,
	width,
	placeholder,
	type,
	rules,
	hidden,
	value,
	labelCol,
}) => {
	return (
		<Form.Item
			label={label}
			hidden={hidden}
			rules={rules}
			initialValue={value}
			name={name}
			labelCol={labelCol}
		>
			<Input
				placeholder={placeholder}
				style={{ width: width }}
				type={type || "text"}
			/>
		</Form.Item>
	);
};
