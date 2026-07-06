import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Profile({ user }) {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    coverImage: null,
    coverImagePreview: '',
    driveLink: ''
  });

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find(u => u.id === user.id);
    if (currentUser && currentUser.books) {
      setBooks(currentUser.books);
    }
  }, [user.id]);

  const saveBooks = (updatedBooks) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].books = updatedBooks;
      localStorage.setItem('users', JSON.stringify(users));
      setBooks(updatedBooks);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewBook({ 
          ...newBook, 
          coverImage: file,
          coverImagePreview: event.target.result 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    const book = {
      id: Date.now().toString(),
      title: newBook.title,
      author: newBook.author || user.name,
      description: newBook.description,
      coverImage: newBook.coverImagePreview || '',
      driveLink: newBook.driveLink,
      published: new Date().toISOString().split('T')[0],
      userId: user.id
    };
    const updatedBooks = [book, ...books];
    saveBooks(updatedBooks);
    setShowModal(false);
    setNewBook({ 
      title: '', 
      author: '', 
      description: '', 
      coverImage: null, 
      coverImagePreview: '',
      driveLink: '' 
    });
  };

  const handleDeleteBook = (bookId) => {
    if (window.confirm('Yakin ingin menghapus buku ini?')) {
      const updatedBooks = books.filter(b => b.id !== bookId);
      saveBooks(updatedBooks);
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setNewBook({
      title: book.title,
      author: book.author,
      description: book.description,
      coverImage: null,
      coverImagePreview: book.coverImage || '',
      driveLink: book.driveLink || ''
    });
    setShowModal(true);
  };

  const handleUpdateBook = (e) => {
    e.preventDefault();
    const updatedBooks = books.map(b => {
      if (b.id === editingBook.id) {
        return {
          ...b,
          title: newBook.title,
          author: newBook.author,
          description: newBook.description,
          coverImage: newBook.coverImagePreview || b.coverImage,
          driveLink: newBook.driveLink
        };
      }
      return b;
    });
    saveBooks(updatedBooks);
    setShowModal(false);
    setEditingBook(null);
    setNewBook({ 
      title: '', 
      author: '', 
      description: '', 
      coverImage: null, 
      coverImagePreview: '',
      driveLink: '' 
    });
  };

  return (
    <section className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-email">{user.email}</p>
          <p className="profile-stats">{books.length} buku diterbitkan</p>
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn btn--solid" onClick={() => setShowModal(true)}>
          + Terbitkan Buku Baru
        </button>
      </div>

      <div className="profile-books">
        <h2 className="profile-section-title">Buku-bukuku</h2>
        
        {books.length === 0 ? (
          <div className="profile-empty">
            <p>Kamu belum menerbitkan buku apapun.</p>
            <p>Mulai tulis naskahmu sekarang!</p>
          </div>
        ) : (
          <div className="books-grid">
            {books.map((book) => (
              <div className="book-card" key={book.id}>
                <div className="book-card__cover">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} className="book-card__cover-img" />
                  ) : (
                    <div className="book-card__cover-placeholder" style={{ backgroundColor: '#c0392b' }}>
                      <span className="book-card__kicker">E-book</span>
                      <span className="book-card__title">{book.title}</span>
                      <span className="book-card__author">— {book.author}</span>
                    </div>
                  )}
                </div>
                <div className="book-card__info">
                  <h3>{book.title}</h3>
                  <p className="book-card__author-name">{book.author}</p>
                  <p className="book-card__description">{book.description}</p>
                  <p className="book-card__date">{new Date(book.published).toLocaleDateString('id-ID')}</p>
                  {book.driveLink ? (
                    <Link to={`/read/${book.id}`} className="btn btn--solid book-card__read">
                      Baca →
                    </Link>
                  ) : (
                    <span className="book-card__no-pdf">Belum ada link</span>
                  )}
                  <div className="book-card__actions">
                    <button className="btn btn--ghost" onClick={() => handleEditBook(book)} style={{ fontSize: '0.85rem', padding: '4px 12px' }}>
                      Edit
                    </button>
                    <button className="btn btn--ghost" onClick={() => handleDeleteBook(book.id)} style={{ fontSize: '0.85rem', padding: '4px 12px', color: '#e74c3c' }}>
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => {
          setShowModal(false);
          setEditingBook(null);
          setNewBook({ 
            title: '', 
            author: '', 
            description: '', 
            coverImage: null, 
            coverImagePreview: '',
            driveLink: '' 
          });
        }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={() => {
              setShowModal(false);
              setEditingBook(null);
              setNewBook({ 
                title: '', 
                author: '', 
                description: '', 
                coverImage: null, 
                coverImagePreview: '',
                driveLink: '' 
              });
            }}>×</button>
            <h3 className="modal__title">
              {editingBook ? 'Edit Buku' : 'Terbitkan Buku Baru'}
            </h3>
            <form onSubmit={editingBook ? handleUpdateBook : handleAddBook} className="modal__form">
              <label>
                Judul Buku
                <input
                  type="text"
                  required
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  placeholder="Masukkan judul buku"
                />
              </label>
              <label>
                Penulis
                <input
                  type="text"
                  required
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  placeholder="Nama penulis"
                />
              </label>
              <label>
                Deskripsi
                <textarea
                  required
                  rows="3"
                  value={newBook.description}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                  placeholder="Ceritakan sedikit tentang buku ini..."
                />
              </label>
              <label>
                Sampul Buku
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {newBook.coverImagePreview && (
                  <div style={{ marginTop: '8px' }}>
                    <img 
                      src={newBook.coverImagePreview} 
                      alt="Preview sampul" 
                      style={{ maxWidth: '100px', maxHeight: '140px', borderRadius: '4px' }} 
                    />
                  </div>
                )}
                <small style={{ color: 'var(--text-muted)' }}>
                  Upload gambar sampul buku (JPG, PNG, WEBP)
                </small>
              </label>
              <label>
                Link Google Drive PDF
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  value={newBook.driveLink}
                  onChange={(e) => setNewBook({ ...newBook, driveLink: e.target.value })}
                />
                <small style={{ color: 'var(--text-muted)' }}>
                  Masukkan link share dari Google Drive
                </small>
              </label>
              <button type="submit" className="btn btn--solid">
                {editingBook ? 'Update Buku' : 'Terbitkan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}