import { createSlice } from "@reduxjs/toolkit";

export const usersSlice = createSlice({
    name: 'users',
    initialState: {
        addedUser: undefined,
        isLoading: false,
        users: [],
        userDetails: undefined,
    },
    reducers: {
        getUsersFetch: (state) => {
            state.isLoading = true;
        },
        getUsersSuccess: (state, action) => {
            state.users = action.payload;
            state.isLoading = false;
        },
        getUsersFailed: (state) => {
            state.isLoading = false;
        },
        setUserData: (state, action) => {
            state.userDetails = action.payload;
        },
        addUser: (state, action) => {
            state.isLoading = true;
        },
        addUserSuccess: (state, action) => {
            state.addedUser = action.payload;
            state.isLoading = false;
        },
        addUserFailed: (state) => {
            state.isLoading = false;
        },
    }
});

export const {
  getUsersFetch,
  getUsersSuccess,
  getUsersFailed,
  setUserData,
  addUser,
  addUserSuccess,
  addUserFailed,
} = usersSlice.actions;

export default usersSlice.reducer;