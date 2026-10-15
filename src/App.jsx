
import { useEffect, useState } from 'react';
import AuthPanel from './AuthPanel';
import HomePage from './HomePage';
import { supabase } from './lib/supabase';
import './index.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) setError(error.message);
      setUser(data.session?.user ?? null);
      setLoading(false);
    }

    checkSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    setError('');

    const { error } = await supabase.auth.signOut();

    if (error) setError(error.message);

    setLoggingOut(false);
  }

  if (loading) {
    return (
      <div className="login-loading">
        <div className="login-spinner" />
        <h2>InfinityCare</h2>
        <p>Preparing your healthcare experience...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="login-first-page">
        <AuthPanel />
      </div>
    );
  }

  return (
    <>
      <div className="signed-in-bar">
        <span>
          <span className="signed-in-dot" />
          Signed in as <strong>{user.email}</strong>
        </span>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? 'Logging out...' : 'Log out'}
        </button>
      </div>

      {error && <p className="auth-message">{error}</p>}

      <HomePage />
    </>
  );
}
