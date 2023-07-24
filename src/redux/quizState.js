import { createSlice } from "@reduxjs/toolkit";

export const quizesSlice = createSlice({
    name: 'quizes',
    initialState: {
        createdQuiz: undefined,
        deletedQuiz: undefined,
        isLoading: false,
        isDeleting: false,
        isUpdating: false,
        quizes: []
    },
    reducers: {
        getQuizesFetch: (state) => {
            state.isLoading = true;
        },
        getQuizesSuccess: (state, action) => {
            state.quizes = action.payload;
            state.isLoading = false;
        },
        getQuizesFailed: (state) => {
            state.isLoading = false;
        },
        createQuiz: (state, action) => {
            state.isLoading = true;
        },
        createQuizSuccess: (state, action) => {
            state.createdQuiz = action.payload;
            state.isLoading = false;
        },
        createQuizFailed: (state) => {
            state.isLoading = false;
        },
        cleanCreatedQuiz: (state) => {
            state.createdQuiz = undefined;
        },
        deleteQuiz: (state, action) => {
            state.isDeleting = true;
        },
        deleteQuizSuccess: (state, action) => {
            state.isDeleting = false;
            state.deletedQuiz = action.payload;
        },
        updateQuiz: (state, action) => {
            state.isUpdating = true;
        },
        updateQuizSuccess: (state, action) => {
            state.isUpdating = false;
        },
    }
});

export const {
  getQuizesFetch,
  getQuizesSuccess,
  getQuizesFailed,
  createQuiz,
  createQuizSuccess,
  createQuizFailed,
  cleanCreatedQuiz,
  deleteQuiz,
  deleteQuizSuccess,
  updateQuiz,
  updateQuizSuccess
} = quizesSlice.actions;

export default quizesSlice.reducer;