import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
//import {} from '@ant-design/icons'
import {
  Button,
  Card,
  Tabs,
  Tag,
  Table,
  Tooltip,
  Form,
  Space,
  Typography,
  Select,
  DatePicker,
  Input,
} from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { AddCouponsDrawer } from "../../components/AddCouponsDrawer";
import { CommonPageHeader } from "../../components/CommonPageHeader";
import { STATUS } from "../../Constants";

import moment from "moment";
import { getPackagesAction } from "../../redux/reducers/packages";
import { bilingualText } from "../../utils/FileHelper";
import {
  deletePromoCoupon,
  getAllPromoCoupon,
  resetPromoCoupon,
  updatePromoCoupon,
} from "../../redux/reducers/promoCoupon";
import { find, get, intersectionBy, join, map, orderBy, toUpper } from "lodash";
import { PromoCouponDrawer } from "./PromoCouponDrawer";
import { ExportExcel } from "../../components/ExportExcel";
const { TabPane } = Tabs;
const { Text } = Typography;

export const PromoCoupon = () => {
  const [form] = Form.useForm();

  const [addPromoCouponsDrawer, setAddPromoCouponsDrawer] = useState(false);
  // const dispatch = useDispatch()
  const columnNames = ["ID", "Date", "active", "used", "packages", "amount"];
  const [selectedProduct, setSelectedProduct] = useState({});
  const [packagesList, setPackagesList] = useState([]);
  const [promoCouponData, setPromoCouponData] = useState(null);
  const [packageId, setPackageId] = useState([]);
  const [promoCouponCode, setPromoCouponCode] = useState()
  const [activeState, setActiveState] = useState(null);
  const [usedState, setUsedState] = useState(null);
  const [dateState, setDateState] = useState("");
  const [promoCouponDates, setPromoCouponDates] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    let query = {
      packageId: packageId.join(","),
      active: activeState,
      code: promoCouponCode,
      createdAt: dateState,
    };
    query = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v != null)
    );
    dispatch(getAllPromoCoupon(query));
  }, [activeState, dispatch, packageId, usedState, dateState, promoCouponCode]);

  const { promoCoupons, getAllPromoCouponStatus } = useSelector((state) => ({
    promoCoupons: state.promoCoupon.promoCoupons,
    getAllPromoCouponStatus: state.promoCoupon.getAllPromoCouponStatus,
  }));

  const { packages } = useSelector((state) => ({
    packages: state.packages,
  }));

  useEffect(() => {
    if (packages.getPackagesStatus === STATUS.SUCCESS) {
      setPackagesList(packages.packagesList);
    }
  }, [packages.getPackagesStatus, packages.packagesList]);

  useEffect(() => {
    if (getAllPromoCouponStatus === STATUS.SUCCESS) {
      setPromoCouponData(promoCoupons);
      let d = promoCoupons.map((v) => v.createdAt.slice(0, 10));
      setPromoCouponDates(d);
    }
  }, [getAllPromoCouponStatus, promoCoupons]);

  function closeDrawer() {
    setAddPromoCouponsDrawer(false);
  }

  const openDrawer = (data) => {
    dispatch(resetPromoCoupon());
    setSelectedProduct(data);
    setAddPromoCouponsDrawer(true);
  };

  const tableActions = {
    openDrawer: openDrawer,
  };

  const changePackageId = (e) => {
    setPackageId(e);
  };
  const changePromoCouponCode = (e) =>{
    if(e.length===12){
        setPromoCouponCode(e)
    }
    else{
        setPromoCouponCode()
    }
  }

  const changeActiveState = (e) => {
    setActiveState(e.target.checked);
  };

  const changeUsedState = (e) => {
    setUsedState(e);
  };

  const changeDateState = (e, dateString) => {
    setDateState(dateString);
  };

  const formInputStyle = {
    display: "flex",
    justifyContent: "center",
  };

  const isCouponDate = (date) => {
    return promoCouponDates.includes(date);
  };

  const changeStatus = (value) => {
    setActiveState(value);
  };

  const excelData = useMemo(() => {

      if (promoCoupons && packagesList?.length) {
          let newCouponData = promoCoupons

          let data = newCouponData?.map(coupon => {
              let packages = intersectionBy(packagesList, coupon.packages.map(d => ({ _id: d })), '_id')
              packages = packages.map(n => bilingualText(n.name))
              packages = join(packages, ', ')
              return { ...coupon, packages }
          })

          data = data.map(d => (
              {
                Id: d.couponId,
                Code: d.code,
                DiscountType: d.discountType === "percent" ? "Percent" : d.discountType === "flat" ? "Flat" : null,
                Discount: d.discountType === "percent" ? d.discount + " %" : d.discountType === "flat" ? d.discount : null,
                MaxDiscount: d.maxDiscount? d.maxDiscount : null,
                Active: d.active ? 'Active' : 'Not active',
                Used: d.used ? 'Used' : "Not used",
                Date: moment(d.createdAt).format('DD-MM-YYYY'),
                Packages: d.packages,
                CouponAmount: d.amount
              }))
          return data
      }

      return []

  }, [packagesList, promoCoupons])

  return (
    <div>
      <CommonPageHeader
        title="Promo Coupons"
        extra={
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              openDrawer({});
            }}
            size="large"
            shape="round"
          >
            Add Promo Coupons
          </Button>
        }
      />
      <br />
      <Card title="Filters">
        <Space wrap size="large">
          {packagesList.length ? (
            <Form.Item name="packageId" style={{ formInputStyle }}>
              <Select
                style={{ width: "300px" }}
                mode="multiple"
                onChange={changePackageId}
                placeholder="Select Packages"
                showSearch
                filterOption={(input, option) =>
                  option.children?.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {packagesList.map((pack, i) => (
                  <Select.Option key={pack._id} value={pack._id}>
                    {pack?.name?.en}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          ) : null}
          <Form.Item>
            <Input 
            style={{ width: "200px" }}
            onChange={(e)=>changePromoCouponCode(e.target.value)}
            placeholder="Promo Coupon Code"
            />
          </Form.Item>
          <Form.Item>
            <DatePicker
              placeholder="Select Date"
              onChange={changeDateState}
              dateRender={(current) => {
                const style = {};
                if (isCouponDate(current.format("YYYY-MM-DD"))) {
                  style.border = "1px solid #1890ff";
                  // style.borderRadius = '50%';
                }
                return (
                  <div className="ant-picker-cell-inner" style={style}>
                    {current.date()}
                  </div>
                );
              }}
            />
          </Form.Item>
          <Form.Item label="Active Status" name="active" style={formInputStyle}>
            <Select
              placeholder="Active Status"
              defaultValue={null}
              style={{ minWidth: "150px" }}
              onChange={changeStatus}
            >
              <Select.Option value={null}>All</Select.Option>
              <Select.Option value={true}>Active</Select.Option>
              <Select.Option value={false}>Inactive</Select.Option>
            </Select>
          </Form.Item>
          {/* <Form.Item label='Used Status' name='used' style={formInputStyle} >
                        <Select placeholder='Used Status' defaultValue={null} style={{ minWidth: '150px' }} onChange={changeUsedState}>
                            <Select.Option value={null}>All</Select.Option>
                            <Select.Option value={true}>Used</Select.Option>
                            <Select.Option value={false}>Not Used</Select.Option>
                        </Select>
                    </Form.Item> */}
          <Form.Item label='Download Excel'>
            <ExportExcel data={excelData} filename='Coupon Details' />
          </Form.Item>
        </Space>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Promo Coupons" key="1">
            <DataTable
              columns={columnNames}
              getCouponsStatus={getAllPromoCouponStatus}
              loading={getAllPromoCouponStatus === STATUS.FETCHING}
              data={promoCouponData}
              actions={tableActions}
            />
          </TabPane>
        </Tabs>
      </Card>
      {addPromoCouponsDrawer ? (
        <PromoCouponDrawer
          visible={addPromoCouponsDrawer}
          closeDrawer={closeDrawer}
          defaultSelected={selectedProduct?.type}
          selectedProduct={selectedProduct}
        />
      ) : null}
    </div>
  );
};

const DataTable = ({ columns, data, loading }) => {
  const [packagesList, setPackagesList] = useState([]);
  const dispatch = useDispatch();
  const { packages } = useSelector((state) => ({
    packages: state.packages,
  }));

  const {
    addPromoCouponStatus,
    updatePromoCouponStatus,
    deletePromoCouponStatus,
  } = useSelector((state) => ({
    promoCoupons: state.promoCoupon.promoCoupons,
    addPromoCouponStatus: state.promoCoupon.addPromoCouponStatus,
    updatePromoCouponStatus: state.promoCoupon.updatePromoCouponStatus,
    deletePromoCouponStatus: state.promoCoupon.deletePromoCouponStatus,
  }));

  const [selectedRowsKeysData, changeSelectedRowsKeys] = useState([]);
  const [selectedRowsData, changeSelectedRows] = useState([]);

  useEffect(() => {
    dispatch(getPackagesAction());
  }, [dispatch]);
  useEffect(() => {
    if (packages.getPackagesStatus === STATUS.SUCCESS) {
      setPackagesList(packages.packagesList);
    }
  }, [packages.getPackagesStatus, packages.packagesList]);

  useEffect(() => {
    if (
      addPromoCouponStatus === STATUS.SUCCESS ||
      updatePromoCouponStatus === STATUS.SUCCESS ||
      deletePromoCouponStatus === STATUS.SUCCESS
    ) {
      changeSelectedRowsKeys([]);
      changeSelectedRows([]);
    }
  }, [addPromoCouponStatus, deletePromoCouponStatus, updatePromoCouponStatus]);

  let searchInput = useRef();

  let columnsData = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Type",
      key: "type",
      render: (d) => toUpper(d?.discountType),
      filters: [
        {
          text: "Flat",
          value: "flat",
        },
        {
          text: "Percent",
          value: "percent",
        },
      ],
      onFilter: (value, record) => record.discountType === value
    },
    {
      title: "Discount",
      key: "discount",
      render: (d) => (
        <div>
          {d.discountType === "percent" ? (
            <div>
                {d?.discount}% <br />
                {d?.maxDiscount? d.maxDiscount+ " Max Dis." : null}
            </div>
          ) 
          : 
            d.discountType=== "flat"?(
                <div>{d?.discount}</div>
            )
          :
            null
        }
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: "120px",
      // fixed:'left',
    },
    {
      title: (
        <div>
          Active{" "}
          {selectedRowsData.length ? (
            <span>
              <Tag
                color="green"
                onClick={() =>
                  dispatch(
                    updatePromoCoupon({
                      couponIds: map(selectedRowsData, (s) => s.id),
                      active: true,
                    })
                  )
                }
              >
                ACTIVE
              </Tag>
              <Tag
                color="red"
                onClick={() =>
                  dispatch(
                    updatePromoCoupon({
                      couponIds: map(selectedRowsData, (s) => s.id),
                      active: false,
                    })
                  )
                }
              >
                INACTIVE
              </Tag>
            </span>
          ) : null}
        </div>
      ),
      dataIndex: "active",
      key: "active",
      render: (data, record) => {
        return (
          <Tag
            color={data ? "green" : "red"}
            onClick={() =>
              dispatch(
                updatePromoCoupon({ couponIds: [record.id], active: !data })
              )
            }
          >
            {data ? "ACTIVE" : "NOT ACTIVE"}
          </Tag>
        );
      },
    },
    {
      title: "Used",
      dataIndex: "used",
      key: "used",
      render: (data) => {
        return (
          <Tag color={data ? "green" : "red"}>{data ? "USED" : "NOT USED"}</Tag>
        );
      },
    },
    {
      title: "Packages",
      dataIndex: "packages",
      key: "packages",
      render: (data) => {
        let packNames = data.map((p, i) =>
          get(
            find(packagesList, (pk) => pk._id == p),
            "name.en",
            ""
          )
        );

        return (
          <Text style={{ fontSize: "13px" }}>{join(packNames, ", ")}</Text>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (data) => {
        return "₹" + data + "/-";
      },
    },
    {
      title: (
        <div>
          Action{" "}
          {selectedRowsData.length ? (
            <Tag
              color="volcano"
              onClick={() =>
                dispatch(
                  deletePromoCoupon({
                    couponIds: map(selectedRowsData, (s) => s.id),
                  })
                )
              }
            >
              DELETE
            </Tag>
          ) : null}
        </div>
      ),
      key: "action",
      render: (data) => {
        return (
          <div>
            <Tooltip placement="top" title="Delete Coupon">
              <Button
                type="default"
                shape="circle"
                danger
                icon={<DeleteOutlined />}
                onClick={() =>
                  dispatch(deletePromoCoupon({ couponIds: [data.id] }))
                }
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const couponTableDataSource = data
    ? orderBy(
        data.map((v, i) => {
          let tableData = {
            key: v.couponId,
            id: v.couponId,
            date: moment(v.createdAt).format("DD-MM-YYYY"),
            active: v.active,
            used: v.used,
            packages: v.packages,
            amount: v.amount,
            code: v.code,
            discountType: v.discountType,
            discount: v.discount,
            maxDiscount: v.maxDiscount,
          };
          return tableData;
        }),
        "date",
        "desc"
      )
    : [];

  const rowSelection = {
    selectedRowKeys: selectedRowsKeysData,
    onChange: (selectedRowKeys, selectedRows) => {
      changeSelectedRowsKeys(selectedRowKeys);
      changeSelectedRows(selectedRows);
    },
  };
  const history = useHistory();
  const params = useParams();

  const changePage = (e) => {
    history.push(`/promo-coupon/${e.current}`);
  };

  return (
    <>
      <Table
        loading={loading || deletePromoCouponStatus === STATUS.FETCHING}
        dataSource={couponTableDataSource}
        columns={columnsData}
        onChange={changePage}
        pagination={{
          current: parseInt(params.page) || 1,
          position: ["bottomCenter", "topRight"],
          total: couponTableDataSource.length,
          showSizeChanger: false,
        }}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        bordered
        style={{ cursor: "pointer" }}
      />
    </>
  );
};
