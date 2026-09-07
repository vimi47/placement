import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';

import type { User, LoginPayload, RegisterPayload } from '@/types';
import { authService } from '@/services/endpoints';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  setUser: (u: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('placement_ai_token');
    const storedUser = localStorage.getItem('placement_ai_user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('placement_ai_token');
        localStorage.removeItem('placement_ai_user');
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  // LOGIN
  const login = useCallback(async (payload: LoginPayload) => {
    const res = await authService.login(payload);

    const loggedInUser = {
      id: res.student_id,
      name: res.name,
      email: res.email,
    } as User;

    localStorage.setItem(
      'placement_ai_token',
      res.access_token
    );

    localStorage.setItem(
      'placement_ai_user',
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);
  }, []);

  // REGISTER
  const register = useCallback(async (payload: RegisterPayload) => {
    await authService.register(payload);
  }, []);

  // LOGOUT
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return ctx;
}