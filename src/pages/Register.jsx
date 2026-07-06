import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.email === email)) {
      setError('Email sudah terdaftar');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      books: []
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    onLogin({ id: newUser.id, name: newUser.name, email: newUser.email });
    navigate('/');
  };

  return (
    <section className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">Daftar Akun</h2>
        <p className="auth-subtitle">Mulai tulis dan terbitkan e-book-mu</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Nama Lengkap
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kamu"
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
          <button type="submit" className="btn btn--solid auth-btn">Daftar</button>
        </form>
        
        <p className="auth-switch">
          Sudah punya akun? <Link to="/login">Masuk sekarang</Link>
        </p>
      </div>
    </section>
  );
}