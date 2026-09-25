import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import {
  Library as LibraryIcon, Download, Search, Filter,
  BookOpen, User
} from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Library() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('الكل');

  useEffect(() => {
    axios.get(`${API}/api/library`)
      .then(res => setBooks(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (book) => {
    try {
      await axios.put(`${API}/api/library/${book._id}/download`);
      window.open(book.fileUrl, '_blank');
      setBooks(books.map(b => b._id === book._id ? { ...b, downloads: b.downloads + 1 } : b));
    } catch (err) {
      console.error(err);
    }
  };

  const categoryColor = (c) => {
    const colors = {
      'برمجة': 'from-blue-500 to-cyan-500',
      'رياضيات': 'from-emerald-500 to-green-500',
      'فيزياء': 'from-purple-500 to-pink-500',
      'كيمياء': 'from-orange-500 to-red-500',
      'أحياء': 'from-teal-500 to-emerald-500',
      'أدب': 'from-yellow-500 to-orange-500',
      'تاريخ': 'from-amber-500 to-yellow-500',
      'دين': 'from-indigo-500 to-purple-500',
    };
    return colors[c] || 'from-slate-500 to-gray-600';
  };

  const categories = ['الكل', 'برمجة', 'رياضيات', 'فيزياء', 'كيمياء', 'أحياء', 'أدب', 'تاريخ', 'دين', 'أخرى'];

  const filtered = books.filter(b => {
    const matchSearch = b.title.includes(search) || b.author.includes(search);
    const matchFilter = filter === 'الكل' || b.category === filter;
    return matchSearch && matchFilter;
  });

  return (
    <Layout title="📚 المكتبة الرقمية" subtitle="كتب ومراجع علمية للتحميل">
      {loading ? (
        <div className="text-center text-xl p-10 animate-pulse">جاري التحميل...</div>
      ) : (
        <>
          <div className="glass rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute top-3.5 right-4 opacity-40" size={20} />
              <input
                type="text"
                placeholder="ابحث عن كتاب أو مؤلف..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 pr-12 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={18} className="opacity-50" />
              {categories.slice(0, 5).map(t => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition ${
                    filter === t
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-slate-700/40 hover:bg-slate-700/60'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 text-sm opacity-60">
            عدد الكتب: <span className="font-bold text-indigo-400">{filtered.length}</span>
          </div>

          {filtered.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center">
              <LibraryIcon size={48} className="mx-auto opacity-30 mb-3" />
              <p className="text-xl mb-2">📭 لا توجد كتب</p>
              <p className="opacity-60 text-sm">لم تُضف أي كتب بعد</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((book) => (
                <div
                  key={book._id}
                  className="glass rounded-2xl p-5 hover:scale-[1.02] transition animate-slide-up flex flex-col"
                >
                  <div className={`h-36 rounded-xl bg-gradient-to-br ${categoryColor(book.category)} flex items-center justify-center mb-4 shadow-lg relative overflow-hidden`}>
                    {book.coverUrl ? (
                      <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen size={48} className="text-white/80" />
                    )}
                    <span className="absolute top-2 right-2 text-xs bg-black/40 backdrop-blur px-2 py-0.5 rounded-full text-white">
                      {book.category}
                    </span>
                  </div>

                  <h3 className="font-bold mb-1 line-clamp-2">{book.title}</h3>
                  <div className="flex items-center gap-1 text-xs opacity-60 mb-2">
                    <User size={12} />
                    <span>{book.author}</span>
                  </div>
                  {book.description && (
                    <p className="text-xs opacity-70 mb-3 line-clamp-2 flex-1">{book.description}</p>
                  )}

                  <div className="flex justify-between items-center text-xs opacity-50 mb-3">
                    <span>⬇ {book.downloads}</span>
                    {book.fileSize && <span>{book.fileSize}</span>}
                  </div>

                  <button
                    onClick={() => handleDownload(book)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-l from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                  >
                    <Download size={16} />
                    تحميل الكتاب
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Layout>
  );
}