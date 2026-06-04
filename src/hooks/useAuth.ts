import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  logout as logoutAction,
  loginStart,
  loginSuccess,
  loginFailure,
} from '@/store/slices/authSlice';
import {
  useLoginMutation,
  useRegisterMutation,
} from '@/store/api/apiSlice';
import { ROUTES } from '@/constants/routes';
import type { LoginRequest, RegisterRequest } from '@/types/api';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token, user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();

  const login = async (credentials: LoginRequest) => {
    try {
      dispatch(loginStart());
      const result = await loginMutation(credentials).unwrap();
      dispatch(loginSuccess({ user: result.user, token: result.token }));
      return { success: true, data: result };
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.';
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      dispatch(loginStart());
      await registerMutation(userData).unwrap();
      dispatch(loginFailure(''));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Erro ao criar conta. Tente novamente.';
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    navigate(ROUTES.LOGIN);
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
  };
};
