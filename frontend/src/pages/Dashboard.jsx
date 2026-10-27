import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import axios from 'axios';
import { Users, BookOpen, Wallet, Search, X, Phone, MapPin } from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    setIsSearching(true);
    try {
      const res = await axios.get(`${API}/api/students/search?q=${query}`);
      setSearchResults(res.data);
      setShowResults(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const cards = [
    { title: 'الطلاب', desc: 'إدارة بيانات الطلاب', icon: Users, path: '/students', gradient: 'from-blue-500 to-cyan-500' },
    { title: 'الغياب', desc: 'تسجيل الحضور والغياب', icon: BookOpen, path: '/attendance', gradient: 'from-emerald-500 to-green-500' },
    { title: 'التراحيل', desc: 'معلومات الباصات', icon: Wallet, path: '/transport', gradient: 'from-amber-500 to-orange-500' },
  ];

  return (
    <Layout title={`مرحبًا، ${user?.name?.split(' ')[0] || ''} 👋`} subtitle="لوحة التحكم">
      
      {/* شريط البحث */}
      <div className="glass rounded-2xl p-4 mb-8 relative z-20">
        <div className="relative">
          <Search className="absolute top-3.5 right-4 opacity-50" size={20} />
          <input
            type="text"
            placeholder="ابحث عن طالب بالاسم..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-3 pr-12 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* نتائج البحث (تظهر كقائمة منسدلة) */}
        {showResults && (
          <div className="absolute top-full left-4 right-4 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
            {searchResults.length === 0 && !isSearching ? (
              <div className="p-4 text-center opacity-60 text-sm">لا توجد نتائج</div>
            ) : (
              searchResults.map(s => (
                <div key={s._id} className="p-3 border-b border-slate-700 last:border-0 hover:bg-slate-700 cursor-pointer flex justify-between items-center" onClick={() => {
                  // هنا يمكنك توجيه المستخدم لصفحة الطالب أو فتح ملفه
                  alert(`الطالب: ${s.fullName}\nالصف: ${s.grade}\nولي الأمر: ${s.guardianName}\nالهاتف: ${s.guardianPhone}`);
                  setShowResults(false);
                }}>
                  <div>
                    <div className="font-bold">{s.fullName}</div>
                    <div className="text-xs opacity-60">{s.grade}</div>
                  </div>
                  <div className="text-xs opacity-60 text-left">
                    <div><Phone size={12} className="inline"/> {s.guardianPhone}</div>
                    <div><MapPin size={12} className="inline"/> {s.address}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      {/* بطاقات لوحة التحكم */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 relative z-10">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => card.path !== '#' && navigate(card.path)}
              style={{ animationDelay: `${i * 50}ms` }}
              className="glass rounded-2xl p-6 cursor-pointer hover:scale-[1.03] transform transition-all duration-300 animate-slide-up group relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon size={26} className="text-white" />
              </div>
              <h3 className="text-lg font-bold mb-1">{card.title}</h3>
              <p className="text-sm opacity-60">{card.desc}</p>
            </div>
          );
        })}
      </div>

    </Layout>
  );
}