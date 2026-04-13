import { useSelector, useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, logout as logoutAction, clearError } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const login = async (email, password) => {
    dispatch(loginStart());
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        dispatch(
          loginSuccess({
            user: data.data.user,
            token: data.data.accessToken,
          })
        );
        return true;
      } else {
        dispatch(loginFailure(data.message || 'Invalid email or password'));
        return false;
      }
    } catch (err) {
      dispatch(loginFailure(err.message || 'Network error: Backend may be offline.'));
      return false;
    }
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  return { user, token, isAuthenticated, loading, error, login, logout, clearError: () => dispatch(clearError()) };
};
