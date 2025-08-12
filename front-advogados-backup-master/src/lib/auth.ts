
// Helper functions for auth operations, e.g., storing/retrieving token from localStorage

type UserRole = 'USUARIO' | 'ADVOGADO';
interface User {
  name: string;
  email: string;
  role: UserRole;
  oab?: string;
}

const TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'userData';

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
};

export const getUserData = (): User | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(USER_DATA_KEY);
  return data ? JSON.parse(data) : null;
};

export const setUserData = (user: User): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
};

export const removeUserData = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_DATA_KEY);
};
