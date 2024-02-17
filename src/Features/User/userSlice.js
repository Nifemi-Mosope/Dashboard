const { createSlice, createAction } = require('@reduxjs/toolkit');
const { axios, axiosWithAuth } = require('../utils');
const { clearErrors, setError } = require('../Error/errorSlice');
const { AppThunk } = require('../../Store/store');

const initialState = {
  isLoading: false,
  userId: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setLogout: (state) => {
      state.isAuth = false;
      state.token = '';
      state.userId = '';
      state.currentUser = null;
      state.alertProps = null;
    },
    setProfile: (state, action) => {
      state.currentUser = action.payload;
      state.isAuth = true;
    },
    setShowAlert: (state, action) => {
      state.alertProps = action.payload;
    },
    setAuth: (state, action) => {
      state.isLoading = false;
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      state.isAuth = true;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setCurrentRoute: (state, action) => {
      state.currentRoute = action.payload;
    },
    setIsAuth: (state, action) => {
      state.isAuth = action.payload;
    },
  },
});

const reset_password = createAction('user/reset_password');

const getAllAgents = createAction('user/getAllAgents');

export { reset_password, getAllAgents };

module.exports = {
  ...userSlice.actions,
  reset_password,
  getAllAgents,
  userReducer: userSlice.reducer,
};