import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import axios from 'axios';
import {
  Calendar, BarChart3, ClipboardCheck, Megaphone, FolderOpen,
  Wallet, Library, FileText, MessageCircle, Award, BookOpen,
  Users, TrendingUp
} from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ grades: 0, avg: 0, courses: 0, announcements: 0 });

  useEffect(() => {
    if (user?.role === 'student') {
      Promise.all([
        axios.get(`${API}/api/grades/my`).catch(() => ({ data: [] })),
        axios.get(`${API}/api/announcements`).catch(() => ({ data: [] })),
      ]).then(([gradesRes, annRes]) => {
        const grades = gradesRes.data;
        const avg = grades.length > 0
          ? (grades.reduce((s, g) => s + g.total, 0) / grades.length).toFixed(1)
          : 0;
        setStats({
          grades: grades.length,
          avg,
          courses: grades.length,
          announcements: annRes.data.length,
        });
      });
    }
  }, [user]);

  if (user?.role === 'teacher') {
    const teacherCards = [
      { title: 'مقرراتي', desc: 'المقررات التي تُدرّسها', icon: BookOpen, path: '/teacher-courses', gradient: 'from-blue-500 to-cyan-500' },
      { title: 'إدخال الدرجات', desc: 'إضافة درجات الطلاب', icon: BarChart3, path: '/teacher-grades', gradient: 'from-emerald-500 to-green-500' },
      { title: 'تسجيل الحضور', desc: 'حضور الطلاب في محاضراتك', icon: ClipboardCheck, path: '/teacher-attendance', gradient: 'from-amber-500 to-orange-500' },
      { title: 'رفع ملفات', desc: 'محاضرات ومراجع لمقرراتك', icon: FolderOpen, path: '/teacher-files', gradient: 'from-pink-500 to-rose-500' },
      { title: 'الإعلانات', desc: 'آخر أخبار الجامعة', icon: Megaphone, path: '/announcements', gradient: 'from-purple-500 to-pink-500' },
      { title: 'التواصل', desc: 'منتدى الجامعة', icon: MessageCircle, path: '/messages', gradient: 'from-violet-500 to-purple-500' },
      { title: 'الملف الشخصي', desc: 'بياناتك وكلمة المرور', icon: Users, path: '/profile', gradient: 'from-slate-500 to-gray-600' },
    ];

    return (
      <Layout title={`مرحبًا، د. ${user?.name?.split(' ')[0] || ''} 👋`} subtitle="لوحة تحكم الأستاذ">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard icon={<BookOpen size={24} />} label="مقرراتي" value="3" gradient="from-blue-500 to-cyan-600" />
          <StatCard icon={<Users size={24} />} label="طلابي" value="45" gradient="from-emerald-500 to-green-600" />
          <StatCard icon={<TrendingUp size={24} />} label="محاضرات هذا الأسبوع" value="6" gradient="from-purple-500 to-pink-600" />
        </div>

        <h2 className="text-xl font-bold mb-4 opacity-90">الخدمات</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {teacherCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                onClick={() => navigate(card.path)}
                style={{ animationDelay: `${i * 50}ms` }}
                className="glass rounded-2xl p-6 cursor-pointer hover:scale-[1.03] transform transition-all duration-300 animate-slide-up group relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon size={26} className="text-white" />
                </div>
                <h3 className="text-lg font-bold mb-1">{card.title}</h3>
                <p className="text-sm opacity-60">{card.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition">
                  <span>اضغط للدخول</span>
                  <span>←</span>
                </div>
              </div>
            );
          })}
        </div>
      </Layout>
    );
  }

  const cards = [
    { title: 'الجداول الدراسية', desc: 'جدول المحاضرات الأسبوعي', icon: Calendar, path: '/schedule', gradient: 'from-blue-500 to-cyan-500' },
    { title: 'النتائج', desc: 'درجاتك ومعدلك التراكمي', icon: BarChart3, path: '/grades', gradient: 'from-emerald-500 to-green-500' },
    { title: 'الحضور والغياب', desc: 'سجل حضورك اليومي', icon: ClipboardCheck, path: '/attendance', gradient: 'from-amber-500 to-orange-500' },
    { title: 'الإعلانات', desc: 'آخر أخبار الجامعة', icon: Megaphone, path: '/announcements', gradient: 'from-purple-500 to-pink-500' },
    { title: 'المقررات والملفات', desc: 'محاضرات وملفات PDF', icon: FolderOpen, path: '/files', gradient: 'from-pink-500 to-rose-500' },
    { title: 'الرسوم الدراسية', desc: 'حالة الدفع والمتبقي', icon: Wallet, path: '/fees', gradient: 'from-red-500 to-orange-500' },
    { title: 'المكتبة الرقمية', desc: 'كتب ومراجع علمية', icon: Library, path: '/library', gradient: 'from-indigo-500 to-blue-500' },
    { title: 'الطلبات الإدارية', desc: 'تقديم طلباتك', icon: FileText, path: '/requests', gradient: 'from-teal-500 to-emerald-500' },
    { title: 'التواصل', desc: 'دردشة مع الطلاب', icon: MessageCircle, path: '/messages', gradient: 'from-violet-500 to-purple-500' },
  ];

  return (
    <Layout title={`مرحبًا، ${user?.name?.split(' ')[0] || 'طالبنا العزيز'} 👋`} subtitle="نظرة سريعة على يومك الدراسي">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<BarChart3 size={24} />} label="المعدل العام" value={`${stats.avg}%`} gradient="from-indigo-500 to-purple-600" />
        <StatCard icon={<BookOpen size={24} />} label="المقررات" value={stats.courses} gradient="from-cyan-500 to-blue-600" />
        <StatCard icon={<Award size={24} />} label="التقديرات" value={stats.grades} gradient="from-emerald-500 to-green-600" />
        <StatCard icon={<Megaphone size={24} />} label="الإعلانات" value={stats.announcements} gradient="from-orange-500 to-red-600" />
      </div>

      <h2 className="text-xl font-bold mb-4 opacity-90">الخدمات</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              style={{ animationDelay: `${i * 50}ms` }}
              className="glass rounded-2xl p-6 cursor-pointer hover:scale-[1.03] transform transition-all duration-300 animate-slide-up group relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon size={26} className="text-white" />
              </div>
              <h3 className="text-lg font-bold mb-1">{card.title}</h3>
              <p className="text-sm opacity-60">{card.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition">
                <span>اضغط للدخول</span>
                <span>←</span>
              </div>
            </div>
          );
        })}
      </div>
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