import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  errors: [],
};

const errorSlice = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.errors = [...state.errors, { message: action.payload, type: 'error' }];
    },
    setSuccess: (state, action) => {
      state.errors = [...state.errors, { message: action.payload, type: 'success' }];
    },
    clearErrors: (state) => {
      state.errors = [];
    },
    clearError: (state, action) => {
      state.errors = state.errors.filter((e) => e.message !== action.payload);
    },
  },
});

export default errorSlice.reducer;
