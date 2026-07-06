import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Register({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      setLoading(false);
      return;
    }

    if (name.trim().length < 2) {
      setError('Nama lengkap minimal 2 karakter');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name.trim()
          }
        }
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (signInError) {
          setError('Akun dibuat, silakan login manual');
          setLoading(false);
          navigate('/login');
          return;
        }

        if (signInData.user) {
          onLogin({
            id: signInData.user.id,
            name: signInData.user.user_metadata?.name || signInData.user.email,
            email: signInData.user.email
          });
          navigate('/');
        }
      }

    } catch (err) {
      setError(err.message || 'Registrasi gagal');
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">Daftar Akun</h2>
        <p className="auth-subtitle">Mulai tulis dan terbitkan e-book-mu</p>
        
        {error && (
          <div style={{ 
            background: '#fee', 
            color: '#c0392b', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '16px',
            wordWrap: 'break-word'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Nama Lengkap
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap kamu"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kamu@email.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
            />
          </label>
          <label>
            Konfirmasi Password
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Masukkan ulang password"
            />
          </label>
          <button type="submit" className="btn btn--solid auth-btn" disabled={loading}>
            {loading ? 'Memuat...' : 'Daftar'}
          </button>
        </form>
        
        <p className="auth-switch">
          Sudah punya akun? <Link to="/login">Masuk sekarang</Link>
        </p>
      </div>
    </section>
  );
}