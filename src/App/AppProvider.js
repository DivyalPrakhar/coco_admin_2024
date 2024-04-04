import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import AppContext from "./Context";
import {
  setAuthorizationHeader,
  removeAuthorizationHeader,
} from "../services/api";
import { useCallback } from "react";
import { requestUserProfileAction } from "../redux/reducers/user";
import { useCheckStatus } from "../utils/useCheckStatus";
import { Typography, Spin } from "antd";
const { Text } = Typography;

export const AppProvider = ({ children }) => {
  const [appstate, setAppState] = useState(false);

  const [isAuthenticated, setAuthenticated] = useState();
  const dispatch = useDispatch();

  const token = useRef();

  const loginSuccess = useCallback(
    (data) => {
      setAuthorizationHeader(data.token);
      token.current = data.token;
      dispatch(requestUserProfileAction());
    },
    [dispatch]
  );

  useEffect(() => {
    let isvalue = localStorage.getItem("@login/alumni");

    if (isvalue && isvalue !== "undefined") {
      loginSuccess({ token: isvalue });
    } else {
      setAuthenticated(false);
      setAppState(true);
    }
  }, [dispatch, loginSuccess]);

  const { status, user } = useSelector((s) => ({
    status: s.user.status,
    user: s.user.user,
  }));

  const logout = useCallback(() => {
    setAuthenticated(false);
    localStorage.removeItem("@login/alumni");
    removeAuthorizationHeader();
  }, []);

  useCheckStatus({
    status,
    onSuccess: () => {
      localStorage.setItem("@login/alumni", token.current);
      setAuthenticated(true);
      setAppState(true);
    },
    onError: () => {
      // error
      setAuthenticated(false);
      setAppState(true);
    },
  });

  const value = useMemo(
    () => ({
      isAuthenticated,
      logout,
      loginSuccess,
      user,
    }),
    [isAuthenticated, user, loginSuccess, logout]
  );

  return (
    <AppContext.Provider value={value}>
      {appstate ? (
        children
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100vw",
            height: "100vh",
          }}
        >
      <Spin size="large" />

        </div>
      )}

      {<LoadingPage ref={LoadingRef} />}
    </AppContext.Provider>
  );
};

export const LoadingRef = React.createRef();

// export const showLoading = LoadingRef.current?.show
// export const hideLoading = LoadingRef.current?.hide
// export const setLoadingMessage = LoadingRef.current?.setMessage

const LoadingPage = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("Please Wait..");

  useImperativeHandle(ref, () => ({
    show: (m) => {
      setVisible(true);
      setMessage(m || "Please Wait...");
    },
    hide: () => {
      setVisible(false);
      setMessage("Please Wait...");
    },
    setMessage: (m) => {
      setMessage(m);
    },
  }));
  return (
    visible && (
      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.4)",
          padding: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          minWidth: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Text style={{ paddingRight: "10px" }}>{message}</Text>
        <Spin />
      </div>
    )
  );
});
