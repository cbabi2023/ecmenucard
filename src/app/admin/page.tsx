'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Header from '../components/Header';
import { FiEye, FiEyeOff, FiLock, FiLogIn, FiMail } from 'react-icons/fi';
import styles from './admin.module.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else if (data.session) {
        localStorage.setItem('admin_auth', 'true');
        router.push('/admin/dashboard');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <Header title="Admin Login" />
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginIcon}>
            <FiLock size={28} />
          </div>
          <h2 className={styles.loginTitle}>Admin Access</h2>
          <p className={styles.loginSubtitle}>Sign in to manage your menu</p>

          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="adminEmail">
                <FiMail size={12} style={{ marginRight: 4 }} /> Email
              </label>
              <input
                id="adminEmail"
                type="email"
                className={styles.input}
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="adminPassword">
                <FiLock size={12} style={{ marginRight: 4 }} /> Password
              </label>
              <div className={styles.passwordField}>
                <input
                  id="adminPassword"
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.input} ${styles.passwordInput}`}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.loginBtn} disabled={loading}>
              <FiLogIn size={18} />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
