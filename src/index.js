import { ThemeProvider } from "@material-tailwind/react";
import { configureStore } from "@reduxjs/toolkit";
import { MaterialTailwindControllerProvider } from "./context";
import App from "./App";
import userReducer from "./redux/userState";
import quizReducer from "./redux/quizState";
import mainSaga from "./sagas/mainSaga";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import React from "react";
import "./index.css";

const saga = createSagaMiddleware();
const store = configureStore({
  reducer: {
    users: userReducer,
    quizes: quizReducer,
  },
  middleware: [saga],
});
saga.run(mainSaga);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ThemeProvider>
      <MaterialTailwindControllerProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </MaterialTailwindControllerProvider>
    </ThemeProvider>
  </BrowserRouter>
);
