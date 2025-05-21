import { setLocalInfo } from '@/utils/secureStorage';
import { createSlice } from '@reduxjs/toolkit';
const userKey = `${process.env.NEXT_PUBLIC_USER_INFO_KEY}`;
const tokenKey = `${process.env.NEXT_PUBLIC_TOKEN_KEY}`;

interface InitialState  {
  user: {
    id: string,
    name: string,
    email: string,
    role: userRole
  } | null,
  token: string,
  isAuthenticated: boolean,
  isLoading: boolean
}

export enum userRole {
  ADMIN,
  USER
}

const initialState: InitialState = {
  user: null,
  token: '',
  isAuthenticated: false,
  isLoading: true,
}
export const counterSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUser : (state, action) => {
      state.user = action.payload;
      setLocalInfo(userKey, action.payload);
    },
    updateToken : (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = action.payload? true : false;
      setLocalInfo(tokenKey, action.payload); 
    },
    updateIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    logoutUser: (state) => {
      state.token = '';
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem(userKey);
      localStorage.removeItem(tokenKey);
    },
  },
});

export const { updateUser, updateToken, updateIsLoading, logoutUser } = counterSlice.actions;

export default counterSlice.reducer;