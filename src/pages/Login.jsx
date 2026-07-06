import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      onLogin({ id: user.id, name: user.name, email: user.email });
      navigate('/');
    } else {
      setError('Email atau password salah');
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">Masuk ke Akun</h2>
        <p className="auth-subtitle">Masuk untuk mengelola buku-bukumu</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
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
              placeholder="Masukkan password"
            />
          </label>
          <button type="submit" className="btn btn--solid auth-btn">Masuk</button>
        </form>
        
        <p className="auth-switch">
          Belum punya akun? <Link to="/register">Daftar sekarang</Link>
        </p>
      </div>
    </section>
  );
}