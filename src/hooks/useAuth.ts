import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setCredentials, setUser, logout } from '../features/auth/authSlice';
import { useLoginMutation, useGetMeQuery } from '../app/api/authApi';
import type { LoginRequest, User } from '../types';

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
  error: unknown;
}

export function useAuth(): UseAuthReturn {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, token } = useAppSelector((state) => state.auth);
  const [loginMutation, { isLoading, error }] = useLoginMutation();
  const { data: currentUser } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Update user in state when fetched
  useEffect(() => {
    if (currentUser && (!user || user.id !== currentUser.id)) {
      dispatch(setUser(currentUser));
    }
  }, [currentUser, user, dispatch]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const result = await loginMutation(credentials).unwrap();
      dispatch(
        setCredentials({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        })
      );
    },
    [dispatch, loginMutation]
  );

  const signOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return {
    isAuthenticated,
    user: user || currentUser || null,
    token,
    login,
    signOut,
    isLoading,
    error,
  };
}
