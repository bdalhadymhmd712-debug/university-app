import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, Users, BookOpen, Wallet, User,
  LogOut, Menu, X, Sun, Moon, GraduationCap
} from 'lucide-react';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const menu = [
    { title: 'الرئيسية', icon: LayoutDashboard, path: '/dashboard' },
    { title: 'الطلاب', icon: Users, path: '/students' },
    { title: 'الغياب', icon: BookOpen, path: '/attendance' }, // تم التعديل
    { title: 'التراحيل', icon: Wallet, path: '#' },
    { title: 'الملف الشخصي', icon: User, path: '/profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 right-4 z-50 p-3 rounded-xl bg-indigo-600 text-white shadow-lg"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div onClick={() => setOpen(false)} className="md:hidden fixed inset-0 bg-black/60 z-40" />
      )}

      <aside
        className={`fixed top-0 right-0 h-screen w-72 z-40 transition-transform duration-300 
        ${open ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        glass border-l border-slate-700/50 flex flex-col`}
      >
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <GraduationCap size={26} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg">بوابة المدرسة</h2>
              <p className="text-xs opacity-60">لوحة التحكم</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = item.path === '/dashboard' ? true : false;
            return (
              <button
                key={item.title}
                onClick={() => {
                  if (item.path !== '#') navigate(item.path);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-all
                  ${active ? 'bg-gradient-to-l from-indigo-600 to-purple-600 text-white' : 'hover:bg-slate-700/40 opacity-80'}`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.title}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700/50 space-y-2">
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-700/40 text-sm">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الليلي'}</span>
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm">
            <LogOut size={18} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}