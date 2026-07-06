import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Books({ user }) {
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareSuccess, setShareSuccess] = useState(null);

  useEffect(() => {
    fetchAllBooks();
  }, []);

  const fetchAllBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching books:', error);
    } else {
      setAllBooks(data || []);
    }
    setLoading(false);
  };

  const handleShare = (book) => {
    const shareUrl = `${window.location.origin}/read/${book.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Baca buku "${book.title}" oleh ${book.author} di Pena Pustaka`,
        url: shareUrl
      })
      .then(() => setShareSuccess(book.id))
      .catch(() => setShareSuccess(null));
    } else {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          setShareSuccess(book.id);
          setTimeout(() => setShareSuccess(null), 3000);
        })
        .catch(() => {
          alert('Gagal menyalin link!');
        });
    }
  };

  if (loading) {
    return (
      <section className="chapter" id="buku">
        <div className="chapter__heading">
          <span className="chapter__number">Perpustakaan</span>
          <h2 className="chapter__title">Buku yang Sudah Terbit</h2>
        </div>
        <div className="loading">Memuat buku...</div>
      </section>
    );
  }

  return (
    <section className="chapter" id="buku">
      <div className="chapter__heading">
        <span className="chapter__number">Perpustakaan</span>
        <h2 className="chapter__title">Buku yang Sudah Terbit</h2>
      </div>

      <div className="books-header">
        {user && (
          <Link to="/profile" className="btn btn--solid">
            + Terbitkan Buku
          </Link>
        )}
      </div>

      <div className="books-grid">
        {allBooks.length === 0 ? (
          <div className="profile-empty" style={{ gridColumn: '1/-1' }}>
            <p>Belum ada buku.</p>
            <p>Jadilah yang pertama!</p>
          </div>
        ) : (
          allBooks.map((book) => (
            <div className="book-card" key={book.id}>
              <div className="book-card__cover-wrapper">
                {book.cover_image ? (
                  <img src={book.cover_image} alt={book.title} className="book-card__cover-img" />
                ) : (
                  <div className="book-card__cover-placeholder" style={{ backgroundColor: '#c0392b' }}>
                    <span className="book-card__cover-title">{book.title}</span>
                    <span className="book-card__cover-author">{book.author}</span>
                  </div>
                )}
              </div>
              <div className="book-card__info">
                <h3 className="book-card__info-title">{book.title}</h3>
                <p className="book-card__info-author">{book.author}</p>
                <p className="book-card__info-publisher">oleh: {book.user_name}</p>
                <p className="book-card__info-desc">{book.description}</p>
                <div className="book-card__info-bottom">
                  <span className="book-card__info-date">{new Date(book.published).toLocaleDateString('id-ID')}</span>
                  {book.drive_link ? (
                    <Link to={`/read/${book.id}`} className="btn btn--solid book-card__read">
                      Baca →
                    </Link>
                  ) : (
                    <span className="book-card__no-pdf">Belum ada link</span>
                  )}
                </div>
                
                <div className="book-card__share">
                  <button 
                    className="btn btn--outline book-card__share-btn"
                    onClick={() => handleShare(book)}
                    style={{ 
                      width: '100%', 
                      padding: '6px 12px', 
                      fontSize: '0.8rem',
                      marginTop: '8px'
                    }}
                  >
                    {shareSuccess === book.id ? '✅ Link Disalin!' : '📤 Bagikan Buku'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}