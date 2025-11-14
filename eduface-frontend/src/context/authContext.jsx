import { createContext, useReducer } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

export const AuthContext = createContext();

const initialState = {
  token: localStorage.getItem(STORAGE_KEYS.TOKEN) || null,
  role: localStorage.getItem(STORAGE_KEYS.ROLE) || null,
  userId: localStorage.getItem(STORAGE_KEYS.USER_ID) || null,
  userName: localStorage.getItem(STORAGE_KEYS.USER_NAME) || null,
  isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.TOKEN),
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        token: action.payload.token,
        role: action.payload.role,
        userId: action.payload.userId,
        userName: action.payload.userName,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        token: null,
        role: null,
        userId: null,
        userName: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (token, role, userId, userName) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
    localStorage.setItem(STORAGE_KEYS.USER_NAME, userName);
    dispatch({
      type: 'LOGIN',
      payload: { token, role, userId, userName },
    });
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    localStorage.removeItem(STORAGE_KEYS.USER_NAME);
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
