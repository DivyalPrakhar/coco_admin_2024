import { SelectOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Radio, Tag, Tooltip } from "antd";
import TextArea from "antd/lib/input/TextArea";
import Text from "antd/lib/typography/Text";
import React, { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonPageHeader } from "../../components/CommonPageHeader";
import { STATUS } from "../../Constants";
import { sendNotificaitonAction } from "../../redux/reducers/notificaitons";
import { FormReducer } from "../../utils/FormReducer";
import { SelectStudentModal } from "../SearchStudent/SelectStudentModal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { SpecificPackages } from "./packagesModal";
import Modal from "antd/lib/modal/Modal";
import {
	getPkgStudentsAction,
	getSubStudentsAction,
} from "../../redux/reducers/packages";

export const Notifications = () => {
	const dispatch = useDispatch();
	const [notifiableType, changeType] = useState("All");
	const [studentModal, openStudentModal] = useState();
	const [packageModal, openPackageModal] = useState(false);
	const [studentsList, setStudents] = useState([]);
	const [selectedPackages, setPackages] = useState([]);

	const { sendNotificationStatus, subStudentsList, pkgStudentsList } =
		useSelector((state) => ({
			sendNotificationStatus:
				state.notifications.sendNotificationStatus,
			subStudentsList: state.packages.subStudents,
			pkgStudentsList: state.packages.pkgStudents,
		}));

	useEffect(() => {
		if (sendNotificationStatus === STATUS.SUCCESS) {
			setStudents([]);
		}
	}, [sendNotificationStatus]);

	// populate pkg students list and sub students list when packages are selected.

	useEffect(() => {
		if (selectedPackages.length) {
			dispatch(
				getPkgStudentsAction({
					packageId: selectedPackages[0][0].key,
				})
			);
			dispatch(
				getSubStudentsAction({
					packageId: selectedPackages[0][0].key,
				})
			);
		}
	}, [selectedPackages, dispatch]);

	const sendTo = (e) => {
		changeType(e.target.value);
	};

	const selectPackages = () => {
		openPackageModal((s) => !s);
	};

	const selectStudents = () => {
		openStudentModal(!studentModal);
	};

	const getStudents = (studs) => {
		setStudents(studs);
	};

	const removeStudents = () => {
		setStudents([]);
	};

	const handleGetData = (data) => {
		setPackages(data);
	};

	const handleCancel = () => {
		openPackageModal((s) => !s);
	};

	// remove tags from specific packages modal

	const handleTags = (removedTag) => {
		const newTags = selectedPackages.filter(
			(tag) => tag[0].key !== removedTag
		);
		setPackages(newTags);
	};

	// Set students list for students in packages and handle edge cases.

	useEffect(() => {
		if (pkgStudentsList || subStudentsList) {
			const pkg =
				pkgStudentsList?.docs?.map((d) => d.user) || [];
			const sub =
				subStudentsList?.docs?.map((d) => d.user) || [];

			setStudents([...pkg, ...sub]);
		}
	}, [pkgStudentsList, subStudentsList]);

	return (
		<div>
			<CommonPageHeader title="Notifications" />
			<br />
			<Card>
				<Form layout="vertical">
					<Form.Item label={<b>Send to</b>}>
						<Radio.Group
							defaultValue="All"
							onChange={sendTo}
						>
							<Radio value="All">
								All
							</Radio>
							<Radio value="Student">
								Student
							</Radio>
							<Radio value="Lead">
								Lead
							</Radio>
							<Radio value="Package">
								Package
							</Radio>
						</Radio.Group>
					</Form.Item>
					{notifiableType === "Student" ? (
						<div>
							<Form.Item>
								<Button
									onClick={
										selectStudents
									}
									icon={
										<SelectOutlined />
									}
								>
									Select
									Students
								</Button>
							</Form.Item>
							{studentsList?.length ? (
								<>
									<Text>
										<b>
											Selected
											students
											Count
										</b>

										:
										<Tooltip title="Remove">
											<Tag
												onClose={
													removeStudents
												}
												closable
											>
												{
													studentsList.length
												}
											</Tag>
										</Tooltip>
									</Text>
									<br />
									<br />
								</>
							) : null}
						</div>
					) : null}
					{notifiableType === "Package" && (
						<Form.Item>
							<Button
								onClick={
									selectPackages
								}
								icon={
									<SelectOutlined />
								}
							>
								Select Packages
							</Button>
						</Form.Item>
					)}
				</Form>
				<Card>
					<MessageBox
						users={studentsList.map(
							(d) => d._id
						)}
						notifiableType={notifiableType}
					/>
				</Card>

				{studentModal ? (
					<SelectStudentModal
						selectedStudents={studentsList}
						getSelectedStudents={
							getStudents
						}
						visible={studentModal}
						closeModal={selectStudents}
					/>
				) : null}
				{packageModal && (
					<Modal
						width={1000}
						footer={null}
						title={
							<b>
								Select Specific
								Packages
							</b>
						}
						open={packageModal}
						onCancel={handleCancel}
					>
						<p>
							<SpecificPackages
								getData={
									handleGetData
								}
								handleCancel={
									handleCancel
								}
							/>
						</p>
						<Card
							style={{
								width: "100%",
							}}
						>
							{_.map(
								selectedPackages,
								(i) =>
									_.map(
										i,
										(
											d
										) => (
											<Tag
												key={
													d.key
												}
												closable
												onClose={() => {
													handleTags(
														d?.key
													);
												}}
											>
												{
													d
														?.package
														?.en
												}
											</Tag>
										)
									)
							)}
						</Card>
					</Modal>
				)}
			</Card>
		</div>
	);
};

export const MessageBox = ({ notifiableType, notifiableIds, users }) => {
	const dispatch = useDispatch();
	const [form] = Form.useForm();
	console.log("users --->", users);

	const { sendNotificationStatus } = useSelector((state) => ({
		sendNotificationStatus:
			state.notifications.sendNotificationStatus,
	}));

	let initialData = { email: false, sms: false, push: true };
	const [formData, changeFormData] = useReducer(FormReducer, initialData);

	const [editorMessage, changeEditorMessage] = useState();
	const [showEditor, toggleEditor] = useState(false);

	useEffect(() => {
		if (notifiableType || notifiableIds || users) {
			changeFormData({
				type: "notifiableType",
				value: notifiableType,
			});
			changeFormData({
				type: "notifiableIds",
				value: notifiableIds,
			});
			changeFormData({ type: "users", value: users });
		}
	}, [notifiableType, notifiableIds, users]);

	useEffect(() => {
		if (sendNotificationStatus === STATUS.SUCCESS) {
			form.resetFields();
			changeFormData(initialData);
			changeEditorMessage("");
		}
	}, [sendNotificationStatus]);

	const messageType = (e) => {
		let type = e.target.value;
		let obj = { sms: false, email: false, push: false };
		if (type === "sms") {
			obj = { ...obj, sms: true };
		} else if (type === "email") {
			obj = { ...obj, email: true };
		} else if (type === "notification") {
			obj = { ...obj, push: true };
		} else if (type === "sms-notify") {
			obj = { ...obj, sms: true, push: true };
		}

		changeFormData({ type: "merge", value: obj });
	};

	const changeTitle = (e) => {
		changeFormData({ type: "title", value: e.target.value });
	};

	const changeMessage = (e) => {
		changeFormData({ type: "body", value: e.target.value });
	};

	const sendMessage = () => {
		let data = {
			...formData,
			body: showEditor ? editorMessage : formData.body,
		};
		dispatch(sendNotificaitonAction(data));
	};

	const handleEditorToggle = () => {
		toggleEditor(!showEditor);
	};

	const handleEditorMessage = (e) => {
		let msg = e === "<p><br></p>" ? "" : e;
		changeEditorMessage(msg);
	};

	return (
		<Form form={form} layout="vertical" onFinish={sendMessage}>
			<Form.Item
				label={<b>Message type</b>}
				name="messageType"
			>
				<Radio.Group
					defaultValue="notification"
					onChange={messageType}
				>
					<Radio value="notification">
						Notification
					</Radio>
					<Radio value="sms">SMS</Radio>
					<Radio value="sms-notify">
						Notification + SMS
					</Radio>
					<Radio value="email">Email</Radio>
				</Radio.Group>
			</Form.Item>
			<Form.Item label={<b>Title</b>} name="title">
				<Input
					placeholder="Title"
					rows={4}
					onChange={changeTitle}
				/>
			</Form.Item>
			{formData.email ? (
				<Form.Item
					required
					label={
						<b>
							Message{" "}
							<Button
								onClick={
									handleEditorToggle
								}
								size="small"
							>
								{showEditor
									? "Text"
									: "Editor"}
							</Button>
						</b>
					}
				>
					{showEditor ? (
						<ReactQuill
							placeholder="Type message..."
							onChange={
								handleEditorMessage
							}
							value={editorMessage}
						/>
					) : (
						<TextArea
							onChange={changeMessage}
							placeholder="Type message..."
							value={formData?.body}
							rows={4}
						/>
					)}
				</Form.Item>
			) : (
				<Form.Item required label={<b>Message</b>}>
					<TextArea
						onChange={changeMessage}
						placeholder="Type message..."
						value={formData?.body}
						rows={4}
					/>
				</Form.Item>
			)}
			<Form.Item>
				<Button
					loading={
						sendNotificationStatus ===
						STATUS.FETCHING
					}
					disabled={
						!formData.notifiableType ||
						(!formData.body &&
							!editorMessage)
					}
					htmlType="submit"
					type="primary"
					size="large"
					style={{ width: "100px" }}
				>
					Send
				</Button>
			</Form.Item>
		</Form>
	);
};
