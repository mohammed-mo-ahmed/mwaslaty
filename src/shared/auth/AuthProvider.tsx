'use client';

import {createContext, useContext, useEffect, useMemo, useState} from 'react';

type User = {
  name: string;
  email: string;
};

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, name?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const storageKey = 'mwaslaty_user';

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = window.localStorage.getItem(storageKey);
    if (storedUser) {
      setUser(JSON.parse(storedUser) as User);
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      isAuthenticated: Boolean(user),
      login(email, _password, name) {
        const nextUser = {email, name: name || email.split('@')[0] || 'User'};
        window.localStorage.setItem(storageKey, JSON.stringify(nextUser));
        setUser(nextUser);
      },
      logout() {
        window.localStorage.removeItem(storageKey);
        setUser(null);
      }
    };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
