
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function AuthPanel() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();

      if (mounted) {
        setUser(data.session?.user ?? null);
        setLoading(false);
        if (error) setMessage(error.message);
      }
    }

    loadSession();

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        if (mounted) setUser(session?.user ?? null);
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setBusy(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });

        if (error) throw error;

        setMessage(
          data.session
            ? 'Account created successfully!'
            : 'Account created. Please check your email to confirm it.'
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        setMessage('Login successful!');
      }
    } catch (error) {
      setMessage(error.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    setMessage(error ? error.message : 'You have logged out.');
  }

  if (loading) return <p>Checking login status...</p>;

  return (
    <section
      id="account"
      style={{
        maxWidth: 460,
        margin: '40px auto',
        padding: 24,
        borderRadius: 16,
        background: '#fff',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
      }}
    >
      <h2>{user ? 'Your InfinityCare Account' :
        mode === 'signup' ? 'Create your account' : 'Welcome back'}</h2>

      {user ? (
        <>
          <p>You are logged in as:</p>
          <p>{user.email}</p>
          <button className="btn btn-primary" onClick={handleLogout}>
            Log out
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="auth-email">Email address</label>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
            style={{ display: 'block', width: '100%', padding: 12, margin: '8px 0 16px' }}
          />

          <label htmlFor="auth-password">Password (minimum 8 characters)</label>
          <input
            id="auth-password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            minLength={8}
            required
            style={{ display: 'block', width: '100%', padding: 12, margin: '8px 0 16px' }}
          />

          <button
            className="btn btn-primary"
            type="submit"
            disabled={busy}
          >
            {busy ? 'Please wait...' :
              mode === 'signup' ? 'Create account' : 'Log in'}
          </button>

          <p>
            {mode === 'signup'
              ? 'Already registered? '
              : "Don't have an account? "}
            <button
              type="button"
              className="text-link"
              onClick={() => {
                setMode(mode === 'signup' ? 'login' : 'signup');
                setMessage('');
              }}
            >
              {mode === 'signup' ? 'Log in' : 'Sign up'}
            </button>
          </p>
        </form>
      )}

      {message && <p role="status">{message}</p>}
    </section>
  );
}
