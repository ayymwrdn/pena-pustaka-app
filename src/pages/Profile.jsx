import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Profile({ user }) {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    coverImage: null,
    coverImagePreview: '',
    driveLink: ''
  });

  // Ambil buku dari Supabase
  useEffect(() => {
    fetchBooks();
  }, [user.id]);

  const fetchBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching books:', error);
    } else {
      setBooks(data || []);
    }
    setLoading(false);
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

  const handleAddBook = async (e) => {
    e.preventDefault();
    
    const bookData = {
      user_id: user.id,
      user_name: user.name,
      title: newBook.title,
      author: newBook.author || user.name,
      description: newBook.description,
      cover_image: newBook.coverImagePreview || '',
      drive_link: newBook.driveLink,
      published: new Date().toISOString().split('T')[0]
    };

    const { data, error } = await supabase
      .from('books')
      .insert([bookData])
      .select();

    if (error) {
      console.error('Error adding book:', error);
      alert('Gagal menambahkan buku!');
    } else {
      setBooks([data[0], ...books]);
      setShowModal(false);
      setNewBook({ 
        title: '', 
        author: '', 
        description: '', 
        coverImage: null, 
        coverImagePreview: '',
        driveLink: '' 
      });
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Yakin ingin menghapus buku ini?')) {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      if (error) {
        console.error('Error deleting book:', error);
        alert('Gagal menghapus buku!');
      } else {
        setBooks(books.filter(b => b.id !== bookId));
      }
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setNewBook({
      title: book.title,
      author: book.author,
      description: book.description || '',
      coverImage: null,
      coverImagePreview: book.cover_image || '',
      driveLink: book.drive_link || ''
    });
    setShowModal(true);
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    
    const updateData = {
      title: newBook.title,
      author: newBook.author,
      description: newBook.description,
      cover_image: newBook.coverImagePreview || editingBook.cover_image,
      drive_link: newBook.driveLink
    };

    const { error } = await supabase
      .from('books')
      .update(updateData)
      .eq('id', editingBook.id);

    if (error) {
      console.error('Error updating book:', error);
      alert('Gagal mengupdate buku!');
    } else {
      setBooks(books.map(b => 
        b.id === editingBook.id ? { ...b, ...updateData } : b
      ));
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
    }
  };

  if (loading) {
    return <div className="loading">Memuat buku...</div>;
  }

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
                  <div className="book-card__actions">
                    <button className="btn btn--ghost" onClick={() => handleEditBook(book)}>
                      Edit
                    </button>
                    <button className="btn btn--ghost" onClick={() => handleDeleteBook(book.id)} style={{ color: '#e74c3c' }}>
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Tambah/Edit Buku */}
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