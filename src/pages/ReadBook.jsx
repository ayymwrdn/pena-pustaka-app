import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ReadBook() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    let foundBook = null;
    for (const user of users) {
      if (user.books) {
        const b = user.books.find(book => book.id === bookId);
        if (b) {
          foundBook = b;
          break;
        }
      }
    }
    setBook(foundBook);
    setLoading(false);
  }, [bookId]);

  // Fungsi validasi link Google Drive
  const isValidDriveLink = (link) => {
    if (!link) return false;
    // Cek apakah link mengandung drive.google.com
    return link.includes('drive.google.com') || link.includes('docs.google.com');
  };

  // Fungsi untuk mendapatkan link embed dari Google Drive
  const getDriveEmbedLink = (link) => {
    if (!link) return null;
    
    // Jika link sudah dalam bentuk embed
    if (link.includes('preview')) return link;
    
    // Extract file ID dari link Google Drive
    const match = link.match(/\/d\/([^\/]+)/);
    if (match) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    
    return link;
  };

  if (loading) {
    return (
      <div className="read-page">
        <div className="read-loading">Memuat buku...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="read-page">
        <div className="read-error">
          <h2>Buku tidak ditemukan</h2>
          <Link to="/" className="btn btn--solid">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  const isValid = isValidDriveLink(book.driveLink);
  const embedLink = isValid ? getDriveEmbedLink(book.driveLink) : null;

  return (
    <div className="read-page">
      <div className="read-header">
        <Link to="/" className="read-back">← Kembali</Link>
        <div className="read-info">
          <h1>{book.title}</h1>
          <p>oleh {book.author}</p>
        </div>
      </div>
      
      <div className="read-container">
        {isValid && embedLink ? (
          <>
            <a 
              href={book.driveLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="read-drive-link"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 10h-2V6h-2v4h-2V6h-2v4H9V6H7v4H5V4h14v6zm0 2H5v6h14v-6z"/>
              </svg>
              Baca di Google Drive
            </a>
            <p className="read-drive-info">
              Klik tombol di atas untuk membaca buku di Google Drive
            </p>
            <div style={{ marginTop: '20px', width: '100%', maxWidth: '800px', height: '500px', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
              <iframe 
                src={embedLink}
                width="100%" 
                height="100%" 
                frameBorder="0"
                allowFullScreen
                title="PDF Viewer"
              />
            </div>
          </>
        ) : (
          <div className="read-no-link">
            <div className="icon">📄</div>
            <h3>Link Google Drive tidak valid</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              Penulis belum menambahkan link Google Drive yang valid untuk buku ini.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Pastikan link berformat: https://drive.google.com/file/d/...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}