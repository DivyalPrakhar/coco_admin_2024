import "./App.less";
import React from "react";
import { AppProvider } from "./AppProvider";
import AppRouter from "../routes";
import { Provider } from "react-redux";
import { setupStore } from "../redux";
import { ConfigProvider } from "antd";
import enUS from "antd/lib/calendar/locale/en_US";

const store = setupStore();

console.log("store -->", store);

export const App = (props) => {
  return (
    <ConfigProvider locale={enUS}>
      <Provider store={store}>
        <AppProvider>
          <AppRouter />
        </AppProvider>
      </Provider>
    </ConfigProvider>
  );
};
