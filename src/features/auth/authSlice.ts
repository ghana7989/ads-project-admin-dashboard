import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  user: null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user?: User;
      }>
    ) => {
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      if (action.payload.user) {
        state.user = action.payload.user;
      }
      localStorage.setItem('token', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
