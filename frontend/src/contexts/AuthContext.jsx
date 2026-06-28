import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TOKEN_KEY = 'tts:auth:token';

const AuthContext = createContext(null);

function formatApiErrorDetail(detail) {
  if (detail == null) return 'Something went wrong. Please try again.';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((e) => (e && typeof e.msg === 'string' ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(' ');
  }
  if (detail && typeof detail.msg === 'string') return detail.msg;
  return String(detail);
}

async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, {
    method: options.method || 'GET',
    credentials: 'include',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch (_e) { /* no body */ }
  if (!res.ok) {
    const message = formatApiErrorDetail(data && data.detail);
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return data;
}

export function AuthProvider({ children }) {
  // null = checking, false = unauthenticated, object = authed user
  const [user, setUser] = useState(null);

  // Check existing session on mount
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await apiFetch('/auth/me');
        if (alive) setUser(data?.user || false);
      } catch (_err) {
        if (alive) setUser(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    if (data?.access_token) localStorage.setItem(TOKEN_KEY, data.access_token);
    setUser(data?.user || false);
    return data?.user;
  }, []);

  const register = useCallback(async (email, password, name) => {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: { email, password, name },
    });
    if (data?.access_token) localStorage.setItem(TOKEN_KEY, data.access_token);
    setUser(data?.user || false);
    return data?.user;
  }, []);

  const logout = useCallback(async () => {
    try { await apiFetch('/auth/logout', { method: 'POST' }); } catch (_e) { /* ignore */ }
    localStorage.removeItem(TOKEN_KEY);
    setUser(false);
  }, []);

  const deleteAccount = useCallback(async () => {
    await apiFetch('/auth/account', { method: 'DELETE' });
    localStorage.removeItem(TOKEN_KEY);
    setUser(false);
  }, []);

  const value = useMemo(() => ({
    user,
    isChecking: user === null,
    isAuthed: !!user,
    login,
    register,
    logout,
    deleteAccount,
  }), [user, login, register, logout, deleteAccount]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
