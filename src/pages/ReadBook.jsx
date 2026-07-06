import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ReadBook() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBook() {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .eq('id', bookId);

        if (error) {
          setError(error.message);
          setBook(null);
        } else if (!data || data.length === 0) {
          setError('Buku tidak ditemukan');
          setBook(null);
        } else {
          setBook(data[0]);
        }
      } catch (err) {
        setError(err.message);
        setBook(null);
      }
      
      setLoading(false);
    }

    if (bookId) {
      fetchBook();
    } else {
      setError('ID buku tidak valid');
      setLoading(false);
    }
  }, [bookId]);

  const getDriveEmbedLink = (link) => {
    if (!link) return null;
    if (link.includes('preview')) return link;
    const match = link.match(/\/d\/([^\/]+)/);
    if (match) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return link;
  };

  if (loading) {
    return (
      <div className="read-page">
        <div className="read-loading">
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>📖</div>
          <p>Memuat buku...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="read-page">
        <div className="read-error">
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📕</div>
          <h2>{error || 'Buku tidak ditemukan'}</h2>
          <p style={{ color: 'var(--text-muted)' }}>ID: {bookId}</p>
          <Link to="/" className="btn btn--solid" style={{ marginTop: '16px' }}>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="read-page">
      <div className="read-header">
        <Link to="/" className="read-back">← Kembali</Link>
        <div className="read-info">
          <h1>{book.title}</h1>
          <p>oleh {book.author}</p>
        </div>
      </div>

      {book.drive_link ? (
        <div className="read-container" style={{ padding: '0', overflow: 'hidden', minHeight: '650px' }}>
          <iframe 
            src={getDriveEmbedLink(book.drive_link)}
            width="100%" 
            height="650px" 
            frameBorder="0"
            allowFullScreen
            title="PDF Viewer"
            style={{ border: 'none' }}
          />
        </div>
      ) : (
        <div className="read-container">
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📄</div>
          <h3 style={{ marginBottom: '8px' }}>Belum Ada File PDF</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Penulis belum mengupload PDF untuk buku ini.
          </p>
        </div>
      )}

      <div style={{ 
        marginTop: '24px', 
        padding: '16px 24px',
        background: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)'
      }}>
        <h4 style={{ marginBottom: '8px' }}>Detail Buku</h4>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>
          <strong>Judul:</strong> {book.title}
        </p>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>
          <strong>Penulis:</strong> {book.author}
        </p>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>
          <strong>Deskripsi:</strong> {book.description || 'Tidak ada deskripsi'}
        </p>
        <p style={{ color: 'var(--text-secondary)' }}>
          <strong>Tanggal Terbit:</strong> {new Date(book.published).toLocaleDateString('id-ID')}
        </p>
      </div>
    </div>
  );
}