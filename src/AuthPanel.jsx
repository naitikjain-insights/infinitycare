
import { useState } from 'react';
import { supabase } from './lib/supabase';
import {
  Activity,
  CalendarDays,
  HeartPulse,
  ShieldCheck,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  LogIn,
  UserRoundPlus,
  Stethoscope,
  Heart,
} from 'lucide-react';
import './AuthPanel.css';

export default function AuthPanel() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        setMessage(
          data.session
            ? 'Account created successfully!'
            : 'Account created! Please check your email to verify your account.'
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        setMessage('Login successful! Opening your dashboard...');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Please enter your email address first.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

    if (error) setError(error.message);
    else setMessage('Password reset instructions have been sent to your email.');

    setLoading(false);
  }

  return (
    <main className="ic-auth-page">
      <section className="ic-auth-shell">
        <aside className="ic-brand-panel">
          <div className="ic-brand-logo">
            <div className="ic-logo-symbol">
              <HeartPulse size={35} strokeWidth={2.5} />
            </div>
            <div className="ic-brand-name">
              <span>INFINITY</span><strong>CARE</strong>
            </div>
          </div>

          <div className="ic-brand-line">
            <span />
            <Activity size={28} />
            <span />
          </div>

          <p className="ic-brand-tagline">
            Your Health. Our Priority. Always.
          </p>

          <p className="ic-brand-description">
            Your trusted healthcare partner. Book appointments, connect with
            specialists, and take charge of your wellbeing — all in one place.
          </p>

          <div className="ic-features">
            <div className="ic-feature">
              <div className="ic-feature-icon"><CalendarDays size={25} /></div>
              <div>
                <h3>Easy Appointments</h3>
                <p>Book appointments with ease.</p>
              </div>
            </div>

            <div className="ic-feature">
              <div className="ic-feature-icon"><Stethoscope size={25} /></div>
              <div>
                <h3>Expert Doctors</h3>
                <p>Connect with healthcare professionals.</p>
              </div>
            </div>

            <div className="ic-feature">
              <div className="ic-feature-icon"><ShieldCheck size={25} /></div>
              <div>
                <h3>Secure &amp; Private</h3>
                <p>Your account matters to us.</p>
              </div>
            </div>
          </div>

          <div className="ic-trust-note">
            <ShieldCheck size={35} />
            <p>Healthcare made simpler, safer, and more accessible.</p>
          </div>

          <div className="ic-decor ic-decor-one" />
          <div className="ic-decor ic-decor-two" />
        </aside>

        <section className="ic-form-panel">
          <div className="ic-mobile-logo">
            <HeartPulse size={32} />
            <span>INFINITY<strong>CARE</strong></span>
          </div>

          <div className="ic-account-label">
            <ShieldCheck size={19} />
            YOUR INFINITYCARE ACCOUNT
          </div>

          <h1>{mode === 'login' ? 'Welcome Back!' : 'Create Account'}</h1>

          <p className="ic-form-subtitle">
            {mode === 'login'
              ? 'Sign in to continue to your InfinityCare experience.'
              : 'Join InfinityCare and take the first step towards better wellbeing.'}
          </p>

          <div className="ic-heart-divider">
            <span />
            <Heart size={18} />
            <span />
          </div>

          <form onSubmit={handleSubmit}>
            <label className="ic-field-label" htmlFor="ic-email">
              Email address
            </label>
            <div className="ic-input-wrap">
              <Mail size={20} />
              <input
                id="ic-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <label className="ic-field-label" htmlFor="ic-password">
              Password
            </label>
            <div className="ic-input-wrap">
              <LockKeyhole size={20} />
              <input
                id="ic-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                minLength={6}
                required
              />
              <button
                className="ic-eye-button"
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {mode === 'login' && (
              <button
                className="ic-forgot-button"
                type="button"
                onClick={handleForgotPassword}
                disabled={loading}
              >
                Forgot password?
              </button>
            )}

            {error && <div className="ic-message ic-error">{error}</div>}
            {message && <div className="ic-message ic-success">{message}</div>}

            <button className="ic-submit-button" type="submit" disabled={loading}>
              {loading ? (
                'Please wait...'
              ) : mode === 'login' ? (
                <><LogIn size={20} /> Log In</>
              ) : (
                <><UserRoundPlus size={20} /> Create Account</>
              )}
            </button>
          </form>

          <div className="ic-or-divider"><span />or<span /></div>

          <p className="ic-switch-text">
            {mode === 'login'
              ? "Don't have an account?"
              : 'Already have an account?'}
          </p>

          <button
            className="ic-switch-button"
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError('');
              setMessage('');
            }}
          >
            {mode === 'login' ? (
              <><UserRoundPlus size={20} /> Create an Account</>
            ) : (
              <><LogIn size={20} /> Sign In Instead</>
            )}
          </button>

          <div className="ic-privacy-note">
            <LockKeyhole size={20} />
            <p>Keep your password private. Never share your password with anyone.</p>
          </div>

          <p className="ic-footer-text">
            Made with <Heart size={13} fill="currentColor" /> for better healthcare
          </p>
        </section>
      </section>
    </main>
  );
}
