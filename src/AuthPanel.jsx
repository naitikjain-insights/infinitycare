
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

      if (!mounted) return;

      setUser(data.session?.user ?? null);
      setLoading(false);

      if (error) setMessage(error.message);
    }

    loadSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
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
          email: email.trim(),
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
          email: email.trim(),
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
    setBusy(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setMessage('You have logged out.');
    } catch (error) {
      setMessage(error.message || 'Logout failed.');
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="auth-panel">
        <p>Checking login status...</p>
      </div>
    );
  }

  return (
    <div className="auth-panel">
      <span className="eyebrow">YOUR INFINITYCARE ACCOUNT</span>

      <h2>
        {user
          ? 'Welcome to InfinityCare'
          : mode === 'signup'
            ? 'Create your account'
            : 'Welcome back'}
      </h2>

      <p className="auth-description">
        {user
          ? 'You are signed in and ready to explore your wellness dashboard.'
          : 'Sign in or create an account to get started.'}
      </p>

      {user ? (
        <div className="auth-logged-in">
          <div className="auth-user-icon">
            <span>{user.email?.charAt(0).toUpperCase() || 'U'}</span>
          </div>

          <p>Logged in as</p>
          <strong className="auth-email">{user.email}</strong>

          <button
            className="btn btn-primary"
            onClick={handleLogout}
            disabled={busy}
          >
            {busy ? 'Please wait...' : 'Log out'}
          </button>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="auth-email">Email address</label>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            placeholder="Enter your password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            minLength={8}
            required
          />

          <button
            className="btn btn-primary auth-submit"
            type="submit"
            disabled={busy}
          >
            {busy
              ? 'Please wait...'
              : mode === 'signup'
                ? 'Create account'
                : 'Log in'}
          </button>

          <p className="auth-switch">
            {mode === 'signup'
              ? 'Already have an account? '
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

      {message && (
        <p className="auth-message" role="status">
          {message}
        </p>
      )}

      <p className="auth-note">
        Keep your password private. Never share your password with anyone.
      </p>
    </div>
  );
}
