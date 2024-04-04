import { configureStore } from "@reduxjs/toolkit"
import { reducer } from "./reducers"

export function setupStore() {

  const store = configureStore({
    reducer,
    devTools: true,
  })
  
  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("./reducers", () => store.replaceReducer(reducer))
  }
  return store
}