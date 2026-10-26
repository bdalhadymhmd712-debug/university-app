import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Users, BookOpen, Wallet } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const cards = [
    { title: 'الطلاب', desc: 'إدارة بيانات الطلاب', icon: Users, path: '/students', gradient: 'from-blue-500 to-cyan-500' },
    { title: 'الغياب', desc: 'تسجيل الحضور والغياب', icon: BookOpen, path: '/attendance', gradient: 'from-emerald-500 to-green-500' }, // تم التعديل
    { title: 'التراحيل', desc: 'معلومات الباصات', icon: Wallet, path: '#', gradient: 'from-amber-500 to-orange-500' },
  ];

  return (
    <Layout title={`مرحبًا، ${user?.name?.split(' ')[0] || ''} 👋`} subtitle="لوحة التحكم">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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