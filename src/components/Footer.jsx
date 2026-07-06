export default function Footer() {
  return (
    <footer className="footer">
      <p>Pena Pustaka</p>
      <p className="footer__page-no">— {new Date().getFullYear()} —</p>
    </footer>
  );
}