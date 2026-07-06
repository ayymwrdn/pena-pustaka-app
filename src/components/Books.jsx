import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Books({ user }) {
  const [allBooks, setAllBooks] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const books = [];
    for (const u of users) {
      if (u.books) {
        for (const book of u.books) {
          books.push({
            ...book,
            publisherName: u.name
          });
        }
      }
    }
    setAllBooks(books);
  }, []);

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
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} className="book-card__cover-img" />
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
                <p className="book-card__info-publisher">{book.publisherName}</p>
                <p className="book-card__info-desc">{book.description}</p>
                <div className="book-card__info-bottom">
                  <span className="book-card__info-date">{new Date(book.published).toLocaleDateString('id-ID')}</span>
                  {book.driveLink ? (
                    <Link to={`/read/${book.id}`} className="btn btn--solid book-card__read">
                      Baca →
                    </Link>
                  ) : (
                    <span className="book-card__no-pdf">Belum ada link</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}