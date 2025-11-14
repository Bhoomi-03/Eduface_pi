import { atom } from 'jotai';
import { STORAGE_KEYS } from '../utils/constants';

// Initialize auth state from localStorage
const getInitialAuth = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const role = localStorage.getItem(STORAGE_KEYS.ROLE);
  const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
  const userName = localStorage.getItem(STORAGE_KEYS.USER_NAME);

  return {
    isAuthenticated: !!token,
    token: token || null,
    role: role || null,
    userId: userId || null,
    userName: userName || null,
  };
};

// Jotai atom for auth state
export const authAtom = atom(getInitialAuth());

// Derived atom for checking if user is admin
export const isAdminAtom = atom((get) => {
  const auth = get(authAtom);
  return auth.role === 'admin';
});

// Derived atom for checking if user is faculty
export const isFacultyAtom = atom((get) => {
  const auth = get(authAtom);
  return auth.role === 'faculty';
});

// Derived atom for checking if user is security
export const isSecurityAtom = atom((get) => {
  const auth = get(authAtom);
  return auth.role === 'security';
});
