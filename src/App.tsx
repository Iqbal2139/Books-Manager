import React, { useState, useEffect } from 'react';
import { Book, User, LogIn, LogOut, Plus, Trash2, Edit2, Search, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookData {
  id: number;
  title: string;
  author: string;
  year: number;
}

interface AuthUser {
  id: number;
  username: string;
}

export default function App() {
  const [books, setBooks] = useState<BookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Book Form State
  const [editingBook, setEditingBook] = useState<BookData | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState<number | string>('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBooks();
    if (token) {
      // In a real app, we'd verify the token and get user info
      const savedUser = localStorage.getItem('user');
      if (savedUser) setUser(JSON.parse(savedUser));
    }
  }, [token]);

  const fetchBooks = async (query = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/books${query ? `?title=${query}` : ''}`);
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error('Failed to fetch books', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Auth failed');

      if (!isRegister) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setShowAuth(false);
      } else {
        setIsRegister(false);
        setError('Registration successful! Please login.');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const handleSubmitBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const method = editingBook ? 'PUT' : 'POST';
    const url = editingBook ? `/api/books/${editingBook.id}` : '/api/books';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, author, year: Number(year) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save book');

      fetchBooks();
      setEditingBook(null);
      setTitle('');
      setAuthor('');
      setYear('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteBook = async (id: number) => {
    if (!token || !confirm('Are you sure?')) return;
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      fetchBooks();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const startEdit = (book: BookData) => {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setYear(book.year);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-orange-200">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white">
              <BookOpen size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">BookManager</h1>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-neutral-600 hidden sm:inline">Hello, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-orange-600 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="flex items-center gap-2 px-6 py-2 bg-neutral-900 text-white rounded-full text-sm font-semibold hover:bg-neutral-800 transition-all active:scale-95"
              >
                <LogIn size={18} />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Stats */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-end justify-between">
          <div className="w-full md:max-w-md">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2 block">Search Library</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-orange-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  fetchBooks(e.target.value);
                }}
                className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex gap-8">
            <div className="text-right">
              <span className="block text-3xl font-light leading-none">{books.length}</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Total Books</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  {editingBook ? <Edit2 size={24} className="text-orange-600" /> : <Plus size={24} className="text-orange-600" />}
                  {editingBook ? 'Edit Book' : 'Add New Book'}
                </h2>

                {!token ? (
                  <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 text-center">
                    <AlertCircle className="mx-auto mb-3 text-orange-600" size={32} />
                    <p className="text-sm text-orange-800 font-medium mb-4">Please login to manage the library.</p>
                    <button
                      onClick={() => setShowAuth(true)}
                      className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors"
                    >
                      Login Now
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitBook} className="space-y-5">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2 block">Book Title</label>
                      <input
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-orange-600 transition-all"
                        placeholder="e.g. The Great Gatsby"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2 block">Author</label>
                      <input
                        required
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-orange-600 transition-all"
                        placeholder="e.g. F. Scott Fitzgerald"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2 block">Year</label>
                      <input
                        required
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-orange-600 transition-all"
                        placeholder="e.g. 1925"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-4 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-all active:scale-95 shadow-lg shadow-neutral-900/10"
                      >
                        {editingBook ? 'Update Book' : 'Add to Collection'}
                      </button>
                      {editingBook && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBook(null);
                            setTitle('');
                            setAuthor('');
                            setYear('');
                          }}
                          className="px-4 py-4 bg-neutral-100 text-neutral-600 rounded-xl font-bold hover:bg-neutral-200 transition-all"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-neutral-400"
                  >
                    <Loader2 className="animate-spin mb-4" size={40} />
                    <p className="font-medium">Curating your library...</p>
                  </motion.div>
                ) : books.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-12 rounded-3xl border border-dashed border-neutral-300 text-center"
                  >
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                      <Book size={32} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">No books found</h3>
                    <p className="text-neutral-500">Start by adding a new book to your collection.</p>
                  </motion.div>
                ) : (
                  books.map((book) => (
                    <motion.div
                      key={book.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group bg-white p-6 rounded-3xl border border-neutral-200 hover:border-orange-600/30 hover:shadow-xl hover:shadow-orange-600/5 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 font-bold text-xl">
                          {book.title.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold group-hover:text-orange-600 transition-colors">{book.title}</h3>
                          <p className="text-neutral-500 font-medium">{book.author} • <span className="text-neutral-400">{book.year}</span></p>
                        </div>
                      </div>

                      {token && (
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEdit(book)}
                            className="p-3 text-neutral-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                            title="Edit Book"
                          >
                            <Edit2 size={20} />
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book.id)}
                            className="p-3 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Delete Book"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuth && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuth(false)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-orange-600/20">
                    <User size={32} />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
                  <p className="text-neutral-500">Access your personal library from anywhere.</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-medium">
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2 block">Username</label>
                    <input
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:border-orange-600 transition-all"
                      placeholder="Enter your username"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2 block">Password</label>
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:border-orange-600 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-5 bg-neutral-900 text-white rounded-2xl font-bold hover:bg-neutral-800 transition-all active:scale-95 shadow-xl shadow-neutral-900/10 mt-4"
                  >
                    {isRegister ? 'Register' : 'Login'}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <button
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-sm font-semibold text-neutral-500 hover:text-orange-600 transition-colors"
                  >
                    {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-neutral-200 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 grayscale opacity-50">
            <BookOpen size={20} />
            <span className="text-sm font-bold tracking-tight">BookManager</span>
          </div>
          <p className="text-sm text-neutral-400 font-medium">© 2026 BookManager. Built with Node.js, Express & Sequelize.</p>
        </div>
      </footer>
    </div>
  );
}
