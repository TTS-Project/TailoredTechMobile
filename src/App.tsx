import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Login from './screens/Login';
import ServicesCatalog from './screens/ServicesCatalog';
import Dashboard from './screens/portal/Dashboard';
import Invoices from './screens/portal/Invoices';
import Messages from './screens/portal/Messages';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session);
      setChecked(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!checked) return null; // TODO: replace with a branded loading screen
  return authed ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ServicesCatalog />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/portal"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/portal/invoices"
          element={
            <RequireAuth>
              <Invoices />
            </RequireAuth>
          }
        />
        <Route
          path="/portal/messages"
          element={
            <RequireAuth>
              <Messages />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
