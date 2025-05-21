import { createSlice } from '@reduxjs/toolkit';
const userKey = `${process.env.NEXT_PUBLIC_USER_INFO}`;

const initialState = {
    user: {},
    token: '',
}
export const counterSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUser : (state, action) => {
      console.log(state, action);
      state.user = action.payload;
      localStorage.setItem(userKey, action.payload);
    }
  },
});

export const {  } = counterSlice.actions;

export default counterSlice.reducer;