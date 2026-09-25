import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { TrendingUp, Award, BookOpen } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Grades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/grades/my`)
      .then(res => setGrades(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const gradeColor = (g) => {
    if (g.startsWith('A')) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (g.startsWith('B')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (g.startsWith('C')) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (g === 'D') return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const totalAvg = grades.length > 0
    ? (grades.reduce((s, g) => s + g.total, 0) / grades.length).toFixed(1)
    : 0;
  const totalHours = grades.reduce((s, g) => s + (g.course?.creditHours || 0), 0);

  const gradeDistribution = Object.entries(
    grades.reduce((acc, g) => {
      const key = g.grade?.charAt(0) || 'F';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: `تقدير ${name}`, value }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const barData = grades.map(g => ({
    name: g.course?.code || g.course?.name?.substring(0, 8),
    المجموع: g.total,
  }));

  return (
    <Layout title="📊 النتائج الدراسية" subtitle="درجاتك ومعدلك التراكمي">
      {loading ? (
        <div className="text-center text-xl p-10 animate-pulse">جاري التحميل...</div>
      ) : grades.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-xl mb-2">📭 لا توجد نتائج بعد</p>
          <p className="opacity-60">ستظهر نتائجك بعد إعلانها</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard icon={<TrendingUp size={24} />} label="المعدل العام" value={`${totalAvg}%`} gradient="from-indigo-500 to-purple-600" />
            <StatCard icon={<BookOpen size={24} />} label="عدد المقررات" value={grades.length} gradient="from-emerald-500 to-green-600" />
            <StatCard icon={<Award size={24} />} label="الساعات المعتمدة" value={totalHours} gradient="from-amber-500 to-orange-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">توزيع التقديرات</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', direction: 'rtl' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">درجاتك في كل مقرر</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', direction: 'rtl' }} />
                  <Bar dataKey="المجموع" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-800/70">
                <tr>
                  <th className="p-4 text-right">المقرر</th>
                  <th className="p-4 text-center">النصفي</th>
                  <th className="p-4 text-center">العملي</th>
                  <th className="p-4 text-center">النهائي</th>
                  <th className="p-4 text-center">المجموع</th>
                  <th className="p-4 text-center">التقدير</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g) => (
                  <tr key={g._id} className="border-t border-slate-700/40 hover:bg-slate-700/20 transition">
                    <td className="p-4">
                      <div className="font-bold">{g.course?.name}</div>
                      <div className="text-xs opacity-60">{g.course?.code}</div>
                    </td>
                    <td className="p-4 text-center">{g.midterm}</td>
                    <td className="p-4 text-center">{g.practical}</td>
                    <td className="p-4 text-center">{g.final}</td>
                    <td className="p-4 text-center font-bold text-indigo-400">{g.total}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-bold border ${gradeColor(g.grade)}`}>{g.grade}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Layout>
  );
}

function StatCard({ icon, label, value, gradient }) {
  return (
    <div className="glass rounded-2xl p-5 animate-fade-in">
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-lg`}>
        <div className="text-white">{icon}</div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs opacity-60 mt-1">{label}</div>
    </div>
  );
}