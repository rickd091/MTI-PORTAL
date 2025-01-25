// src/hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux';

import { setCredentials, logout } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const login = async (credentials) => {
    try {
      // Call your login API here
      const response = await loginApi(credentials);
      dispatch(setCredentials(response.data));
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    ...auth,
    login,
    logout: handleLogout,
  };
};