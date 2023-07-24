import { call, put, takeEvery } from "redux-saga/effects";
import { getUsersSuccess, addUserSuccess } from "../redux/userState";
import {
  getQuizesSuccess,
  createQuizSuccess,
  deleteQuizSuccess,
  updateQuizSuccess,
} from "../redux/quizState";

const BASE_URL = "https://644f8db4b61a9f0c4d255519.mockapi.io/api/v1/";

function* workGetUsersFetch() {
  const users = yield call(() => fetch(`${BASE_URL}users`));
  const usersFormatted = yield users.json();
  yield put(getUsersSuccess(usersFormatted));
}

function* workAddUser(action) {
  const addedUser = yield call(() =>
    fetch(`${BASE_URL}users`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(action.payload),
    })
  );
  const addedUserFormatted = yield addedUser.json();
  yield put(addUserSuccess(addedUserFormatted));
}

function* workGetQuizesFetch() {
  const quizes = yield call(() => fetch(`${BASE_URL}quizes`));
  const quizesFormatted = yield quizes.json();
  yield put(getQuizesSuccess(quizesFormatted));
}

function* workCreateQuiz(action) {
  const addedQuiz = yield call(() =>
    fetch(`${BASE_URL}quizes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(action.payload),
    })
  );
  const addedQuizFormatted = yield addedQuiz.json();
  yield put(createQuizSuccess(addedQuizFormatted));
}

function* workDeleteQuiz(action) {
  const quizId = action.payload.id;
  const deleteQuiz = yield call(() =>
    fetch(`${BASE_URL}quizes/${quizId}`, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    })
  );
  const deleteQuizFormatted = yield deleteQuiz.json();
  yield put(deleteQuizSuccess(deleteQuizFormatted));
}

function* workUpdateQuiz(action) {
  const quizId = action.payload.id;
  const updateQuiz = yield call(() =>
    fetch(`${BASE_URL}quizes/${quizId}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(action.payload),
    })
  );
  const updateQuizFormatted = yield updateQuiz.json();
  yield put(updateQuizSuccess(updateQuizFormatted));
}

function* mainSaga() {
  yield takeEvery("users/getUsersFetch", workGetUsersFetch);
  yield takeEvery("users/addUser", workAddUser);
  yield takeEvery("quizes/getQuizesFetch", workGetQuizesFetch);
  yield takeEvery("quizes/createQuiz", workCreateQuiz);
  yield takeEvery("quizes/deleteQuiz", workDeleteQuiz);
  yield takeEvery("quizes/updateQuiz", workUpdateQuiz);
}

export default mainSaga;
