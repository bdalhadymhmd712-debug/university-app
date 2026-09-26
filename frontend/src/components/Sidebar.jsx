import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, Calendar, BarChart3, ClipboardCheck,
  Megaphone, FolderOpen, Wallet, Library, FileText,
  MessageCircle, LogOut, Menu, X, Sun, Moon, GraduationCap,
  User, Copyright
} from 'lucide-react';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [showCopyright, setShowCopyright] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const menu = [
    { title: 'الرئيسية', icon: LayoutDashboard, path: '/dashboard' },
    { title: 'الجداول الدراسية', icon: Calendar, path: '/schedule' },
    { title: 'النتائج', icon: BarChart3, path: '/grades' },
    { title: 'الحضور والغياب', icon: ClipboardCheck, path: '/attendance' },
    { title: 'الإعلانات', icon: Megaphone, path: '/announcements' },
    { title: 'المقررات والملفات', icon: FolderOpen, path: '/files' },
    { title: 'الرسوم الدراسية', icon: Wallet, path: '/fees' },
    { title: 'المكتبة الرقمية', icon: Library, path: '/library' },
    { title: 'الطلبات الإدارية', icon: FileText, path: '/requests' },
    { title: 'التواصل', icon: MessageCircle, path: '/messages' },
    { title: 'الملف الشخصي', icon: User, path: '/profile' },
    { title: 'حقوق الملكية', icon: Copyright, path: '#copyright' },
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
        <div
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 z-40"
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-screen w-72 z-40 transition-transform duration-300 
        ${open ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        glass border-l border-slate-700/50 flex flex-col`}
      >
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <GraduationCap size={26} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg">بوابة الطالب</h2>
              <p className="text-xs opacity-60">جامعة البيان</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  if (item.path === '#copyright') {
                    setShowCopyright(true);
                  } else {
                    navigate(item.path);
                  }
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-all
                  ${active
                    ? 'bg-gradient-to-l from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'hover:bg-slate-700/40 opacity-80 hover:opacity-100'
                  }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.title}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700/50 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">
              {user?.name?.charAt(0) || '؟'}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="font-medium text-sm truncate">{user?.name}</div>
              <div className="text-xs opacity-60 truncate">{user?.email}</div>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-700/40 transition text-sm"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الليلي'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition text-sm"
          >
            <LogOut size={18} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Modal حقوق الملكية */}
      {showCopyright && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowCopyright(false)}
        >
          <div
            className="glass rounded-3xl w-full max-w-md p-8 text-center relative glow-border animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCopyright(false)}
              className="absolute top-4 left-4 p-2 rounded-lg hover:bg-slate-700/50 transition"
            >
              <X size={20} />
            </button>

            <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
              <Copyright size={40} className="text-white" />
            </div>

            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-l from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              حقوق الملكية الفكرية
            </h3>

            <div className="w-20 h-1 bg-gradient-to-l from-indigo-500 to-purple-500 rounded-full mx-auto mb-5"></div>

            <p className="text-lg leading-relaxed opacity-90 mb-2">
              تم تصميم المنصة بواسطة
            </p>
            <p className="text-xl font-bold bg-gradient-to-l from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              عبدالهادي محمد آدم
            </p>

            <p className="text-xs opacity-50 mt-6">
              © 2026 — جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      )}
    </>
  );
}