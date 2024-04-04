import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Space, Table } from "antd";
import { filter, orderBy } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonPageHeader } from "../../components/CommonPageHeader";
import { TotalCountBox } from "../../components/TotalCountBox";
import { STATUS } from "../../Constants";
import { getAllCenterAction } from "../../redux/reducers/center";
import { AddExamCenter } from "./AddExamCenter";

export default function ManageCenter() {
	const dispatch = useDispatch();
	const [openModal, setOpenModal] = useState(null);
	const [filteredData, setFilterdData] = useState();
	const [input, setInput] = useState();

	const { allCenterList, getAllCenterStatus } = useSelector((s) => ({
		allCenterList: s.center.allCenterList,
		getAllCenterStatus: s.center.getAllCenterStatus,
	}));
	useEffect(() => {
		dispatch(getAllCenterAction());
	}, [dispatch]);

	useEffect(() => {
		setFilterdData(
			filter(
				allCenterList,
				(f) =>
					(!input?.name || f.name?.toLowerCase().includes(input?.name?.toLowerCase())) &&
					(!input?.code || f.code?.toLowerCase().includes(parseInt(input?.code)))
			)
		);
	}, [allCenterList, input]);

	const inputHandler = (val) => {
		setInput((d) => ({ ...d, ...val }));
	};

	const columns = [
		{
			title: <b>Center Name</b>,
			width: 80,
			fixed: "left",
			dataIndex: "name",
			key: 1,
		},
		{ title: <b>Code</b>, width: 80, fixed: "left", dataIndex: "code", key: 2 },
		{
			title: <b>Address</b>,
			width: 420,
			dataIndex: "address",
			key: 3,

			render: (d) => (
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						flexWrap: "wrap",
					}}>
					<div style={{ minWidth: 200 }}>{d}</div>
					<div style={{ marginRight: 60 }}>
						<Button>Edit</Button>
						<Button>Delete</Button>
					</div>
				</div>
			),
		},
	];
	const _openModal = (val) => {
		setOpenModal(val);
	};

	const _closeModal = () => {
		setOpenModal(null);
	};

	return (
		<div>
			<CommonPageHeader
				title="Manage Exam Centers"
				extra={
					<Button icon={<PlusOutlined />} size="large" onClick={() => _openModal([])}>
						Add Exam Center
					</Button>
				}
			/>
			<br />
			<Card loading={getAllCenterStatus === STATUS.FETCHING}>
				<TotalCountBox count={allCenterList?.length} />
				<br />
				<Space align="center">
					<Form.Item label="Center Name">
						<Input
							type="text"
							name="name"
							placeholder="search by name"
							onChange={(e) => inputHandler({ name: e.target.value })}
						/>
					</Form.Item>
					<Form.Item label="Code">
						<Input
							type="code"
							name="code"
							placeholder="search by code"
							maxLength={6}
							onChange={(e) => inputHandler({ code: e.target.value })}
						/>
					</Form.Item>
				</Space>
				<br />
				<Table
					size="middle"
					bordered
					loading={getAllCenterStatus === STATUS.FETCHING}
					dataSource={orderBy(filteredData, "createdAt", "desc")}
					columns={columns}
					key={filteredData?.length}
				/>
			</Card>
			{openModal && <AddExamCenter closeModal={_closeModal} />}
		</div>
	);
}
