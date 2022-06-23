import {  createSlice } from '@reduxjs/toolkit';


const initialState = {
  user: null,
  status: 'loading',
};


export const authSlice = createSlice({
  name: 'auth',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setUser: (state,action) => {
      state.user = action.payload;
      state.status = 'idle';
    },
   
  },

});

export const { setUser } = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;
