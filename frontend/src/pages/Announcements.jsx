import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { User, FolderOpen, Calendar } from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Announcements() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/announcements`)
      .then(res => setList(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const priorityColor = (p) => {
    if (p === 'عاجل') return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (p === 'مهم') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  return (
    <Layout title="📢 الإعلانات" subtitle="آخر أخبار وإعلانات الجامعة">
      {loading ? (
        <div className="text-center text-xl p-10 animate-pulse">جاري التحميل...</div>
      ) : list.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-xl mb-2">📭 لا توجد إعلانات حالياً</p>
          <p className="opacity-60">ترقب الإعلانات القادمة</p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((item) => (
            <div
              key={item._id}
              className="glass rounded-2xl p-6 border-r-4 border-indigo-500 hover:scale-[1.01] transition animate-slide-up"
            >
              <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                <h2 className="text-xl font-bold">{item.title}</h2>
                <span className={`px-3 py-1 rounded-full text-xs border ${priorityColor(item.priority)}`}>
                  {item.priority}
                </span>
              </div>
              <p className="opacity-80 leading-relaxed mb-4">{item.body}</p>
              <div className="flex flex-wrap justify-between items-center gap-3 text-xs opacity-60">
                <span className="flex items-center gap-1">
                  <FolderOpen size={14} /> {item.category}
                </span>
                <span className="flex items-center gap-1">
                  <User size={14} /> {item.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> {new Date(item.createdAt).toLocaleDateString('ar-EG')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}