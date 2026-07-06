import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ theme, onToggleTheme, user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__mark">P</span>
          Pena Pustaka
        </Link>

        <nav className="navbar__links">
          <a href="#tentang">Tentang</a>
          <a href="#buku">Buku</a>
          <a href="#kontak">Kontak</a>
          {user && <Link to="/profile">Profil</Link>}
        </nav>

        <div className="navbar__actions">
          <button
            className="ribbon-toggle"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
            aria-pressed={theme === "dark"}
          >
            <span className="ribbon-toggle__track">
              <span className="ribbon-toggle__knot">{theme === "dark" ? "☾" : "☀"}</span>
            </span>
          </button>
          
          {user ? (
            <div className="navbar__user">
              <span className="navbar__username">{user.name}</span>
              <button onClick={handleLogout} className="btn btn--ghost">Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost">Login</Link>
              <Link to="/register" className="btn btn--solid">Daftar</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}