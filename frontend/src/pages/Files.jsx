import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import {
  FolderOpen, Download, Search, Filter,
  BookOpen, ClipboardList, GraduationCap, File
} from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Files() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('الكل');

  useEffect(() => {
    axios.get(`${API}/api/files/my`)
      .then(res => setFiles(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const typeIcon = (type) => {
    if (type === 'محاضرة') return <BookOpen size={20} />;
    if (type === 'واجب') return <ClipboardList size={20} />;
    if (type === 'امتحان سابق') return <GraduationCap size={20} />;
    return <File size={20} />;
  };

  const typeColor = (type) => {
    if (type === 'محاضرة') return 'from-blue-500 to-cyan-500';
    if (type === 'واجب') return 'from-amber-500 to-orange-500';
    if (type === 'امتحان سابق') return 'from-purple-500 to-pink-500';
    if (type === 'مرجع') return 'from-emerald-500 to-green-500';
    return 'from-slate-500 to-gray-600';
  };

  const handleDownload = async (file) => {
    try {
      await axios.put(`${API}/api/files/${file._id}/download`);
      window.open(file.fileUrl, '_blank');
      setFiles(files.map(f => f._id === file._id ? { ...f, downloads: f.downloads + 1 } : f));
    } catch (err) {
      console.error(err);
    }
  };

  const types = ['الكل', 'محاضرة', 'واجب', 'امتحان سابق', 'مرجع'];

  const filtered = files.filter(f => {
    const matchSearch = f.title.includes(search) || f.course?.name?.includes(search);
    const matchFilter = filter === 'الكل' || f.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <Layout title="📁 المقررات والملفات" subtitle="محاضرات، واجبات، ومراجع علمية">
      {loading ? (
        <div className="text-center text-xl p-10 animate-pulse">جاري التحميل...</div>
      ) : (
        <>
          <div className="glass rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute top-3.5 right-4 opacity-40" size={20} />
              <input
                type="text"
                placeholder="ابحث عن ملف أو مقرر..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 pr-12 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={18} className="opacity-50" />
              {types.map(t => (
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
            عدد الملفات: <span className="font-bold text-indigo-400">{filtered.length}</span>
          </div>

          {filtered.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center">
              <FolderOpen size={48} className="mx-auto opacity-30 mb-3" />
              <p className="text-xl mb-2">📭 لا توجد ملفات</p>
              <p className="opacity-60 text-sm">لم تُرفع أي ملفات بعد</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((file) => (
                <div key={file._id} className="glass rounded-2xl p-5 hover:scale-[1.02] transition animate-slide-up group">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeColor(file.type)} flex items-center justify-center shadow-lg`}>
                      <div className="text-white">{typeIcon(file.type)}</div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-700/50">{file.type}</span>
                  </div>

                  <h3 className="font-bold mb-1">{file.title}</h3>
                  <p className="text-xs opacity-60 mb-1">📚 {file.course?.name} — {file.course?.code}</p>
                  {file.description && (
                    <p className="text-sm opacity-70 mb-3 line-clamp-2">{file.description}</p>
                  )}

                  <div className="flex justify-between items-center text-xs opacity-50 mb-4">
                    <span>📅 {new Date(file.createdAt).toLocaleDateString('ar-EG')}</span>
                    <span>⬇ {file.downloads} تحميل</span>
                  </div>

                  <button
                    onClick={() => handleDownload(file)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-l from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                  >
                    <Download size={16} />
                    تحميل الملف
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