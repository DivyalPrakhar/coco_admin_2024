import { Button, Form, Image, Input, message } from "antd";
import React, { useReducer } from "react";
import { LoadingRef } from "../../App/AppProvider";
import { useAppContext } from "../../App/Context";
import { URIS } from "../../services/api";
import { useApiRequest } from "../../services/api/useApiRequest";
import { FormReducer } from "../../utils/FormReducer";
import "./Login.css";

export const LoginRoute = (props) => {
  const { loginSuccess } = useAppContext();

  const [loginData, dispatchPropertyChange] = useReducer(FormReducer, {});

  const _changeUsername = (value) => {
    dispatchPropertyChange({ type: "username", value: value.target.value });
  };

  const _changePassword = (value) => {
    dispatchPropertyChange({ type: "password", value: value.target.value });
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };


  const { request: loginRequest, loading, reset } = useApiRequest(URIS.LOGIN, {
    onCompleted: (data) => {
      loginSuccess(data);
      LoadingRef.current.hide()
    },
    onError: (data, response) => {
      console.log("error",data, response);
      message.error(response?.message || data);
      LoadingRef.current.hide()

    },
  });

  const login = () => {
    // console.log("dd", loginData , loginData.username,  loginData.password);
    loginData &&
      loginData.username &&
      loginData.password &&
      loginRequest({ data: loginData });
      LoadingRef.current.show("Logging in...")
  };

  return (
    <div className="Container">

      <div className="content" style={{ flex: 2 }}>
      <div>
      {/* <div style={{textAlign:'center', marginBottom:"30px"}}>
      <Text style={{fontWeight:"bold", fontSize:24, marginBottom:40, textAlign:'center'}}>Login to Continue</Text>
      </div> */}

      <Form
          {...layout}
          name="basic"
          size="large"
          initialValues={{ remember: true }}
          onFinish={login}
          // onFinishFailed={onFinishFailed}
        >

          <Form.Item
            label="Username"
            name="username"
            onChange={_changeUsername}
            value={loginData.username}
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            value={loginData.Password}
            onChange={_changePassword}
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button
              loading={loading}
              type="primary"
              size="large"
              htmlType="submit"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
        <br />
        <AbsoluteLogo />
      </div>
    </div>
  );
};

const AbsoluteLogo = (props) => {
  return (
    <div style={{ position: "fixed", top: 50, left: 50 }}>
      <img alt="logo" src="/images/logo-coco.png" />
    </div>
  );
};
