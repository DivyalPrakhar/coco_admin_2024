import { Button, Drawer, Form, Input, DatePicker, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { STATUS } from "../../Constants";
import { PercentageOutlined } from "@ant-design/icons";
import {
  addPromoCoupon,
  resetPromoCoupon,
} from "../../redux/reducers/promoCoupon";
import { omit } from "lodash";
import { useCheckStatus } from "../../utils/useCheckStatus";
import { SuccessMessage } from "../../Constants/CommonAlerts";

export const PromoCouponDrawer = ({ visible, closeDrawer }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [selectedData, setSelectedData] = useState({});

  const { packages, addPromoCouponStatus } = useSelector((state) => ({
    packages: state.packages,
    addPromoCouponStatus: state.promoCoupon.addPromoCouponStatus,
  }));

  console.log({ addPromoCouponStatus });
  useCheckStatus({
    status: addPromoCouponStatus,
    onSuccess: () => {
      closeDrawer();
    },
  });

  //   useEffect(() => {
  //     if (addPromoCouponStatus === STATUS.SUCCESS) {
  //     }
  //   }, [closeDrawer, dispatch, addPromoCouponStatus]);

  const _addPromoCoupon = (data) => {
    let removeArray =
      data["type"] === "percent"
        ? ["flat", "date-range", "percent"]
        : ["date-range", "maxDiscount", "percent", "flat"];
    const rangeValue = data["date-range"];
    let dataValue = omit(
      {
        ...data,
        discount: data["percent"] || data["flat"],
        startDate:
          rangeValue?.length > 1 ? rangeValue[0].format("YYYY-MM-DD") : "",
        endDate:
          rangeValue?.length > 1 ? rangeValue[1].format("YYYY-MM-DD") : "",
        discountType: selectedData.type,
      },
      removeArray
    );
    dispatch(addPromoCoupon({ ...dataValue }));
  };

  const _closeDrawer = () => {
    closeDrawer();
    form.resetFields();
  };

  const { Option } = Select;
  const { RangePicker } = DatePicker;

  return (
    <Drawer
      placement="right"
      onClose={_closeDrawer}
      visible={visible}
      width="50%"
      title="Add Promo Coupon"
    >
      <Form
        onFinish={_addPromoCoupon}
        form={form}
        wrapperCol={{ span: 14 }}
        labelCol={{ span: 4 }}
        layout="horizontal"
      >
        {/* <Form.Item name="title" label="Title" required>
          <Input placeholder="Title" required />
        </Form.Item> */}

        {packages.packagesList.length ? (
          <Form.Item name="packages" label="Select Packages" required>
            <Select placeholder="Select Packages" mode="multiple" required>
              {packages.packagesList.map((pack) => (
                <Option value={pack._id}>{pack.name?.en}</Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          <span>Loading Packages...</span>
        )}
        <Form.Item name="amount" label="Promo Price" required>
          <Input
            placeholder="Promo Price"
            type="number"
            required
            prefix={"₹"}
          />
        </Form.Item>
        <Form.Item name="type" label="Type" required>
          <Select
            style={{ width: 120 }}
            placeholder="Select Type"
            onChange={(e) => setSelectedData({ ...selectedData, type: e })}
          >
            <Option value="percent">Percent</Option>
            <Option value="flat">Flat</Option>
          </Select>
        </Form.Item>
        {selectedData.type === "percent" ? (
          <div>
            <Form.Item name="percent" label="Percent" required>
              <Input
                prefix={<PercentageOutlined />}
                placeholder="Add Percent"
                type="text"
                required
              />
            </Form.Item>
            <Form.Item name="maxDiscount" label="Max Discount">
              <Input prefix={"₹"} placeholder="Max Discount" type="text" />
            </Form.Item>
          </div>
        ) : null}
        {selectedData.type === "flat" ? (
          <Form.Item name="flat" label="Flat" required>
            <Input prefix={"₹"} placeholder="Flat" type="text" required />
          </Form.Item>
        ) : null}
        <Form.Item name="date-range" label="Date">
          <RangePicker />
        </Form.Item>
        <Form.Item name="totalCoupons" label="No. of Coupons" required>
          <Input
            placeholder="Total Numbers of Coupons"
            type="number"
            required
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4 }}>
          <Button
            type="primary"
            loading={addPromoCouponStatus === STATUS.FETCHING}
            htmlType="submit"
          >
            Add
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
